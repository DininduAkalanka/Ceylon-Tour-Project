<?php
// Start output buffering to prevent any unexpected output
ob_start();

// Disable error display to prevent breaking JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../PHPMailer-master/PHPMailer-master/src/Exception.php';
require __DIR__ . '/../../PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/../../PHPMailer-master/PHPMailer-master/src/SMTP.php';

// Load email configuration
$emailConfig = require __DIR__ . '/../../config/email_config.php';

// Log file for debugging
$logFile = __DIR__ . '/contact-debug.log';

function logDebug($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

logDebug("=== Contact Form Submission Started ===");

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logDebug("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

logDebug("POST data received: " . print_r($_POST, true));

// Get form data
$userName = trim($_POST['name'] ?? '');
$userEmail = trim($_POST['email'] ?? '');
$userPhone = trim($_POST['phone'] ?? '');
$msgSubject = trim($_POST['subject'] ?? '');
$userMessage = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($userName) || strlen($userName) < 2) {
    $errors[] = 'Name is required (minimum 2 characters)';
}

if (empty($userEmail) || !filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($userMessage) || strlen($userMessage) < 10) {
    $errors[] = 'Message is required (minimum 10 characters)';
}

if (!empty($errors)) {
    logDebug("Validation errors: " . implode(', ', $errors));
    ob_clean();
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit();
}

// Database connection
try {
    $servername = "localhost";
    $username = "tour_user";
    $password = "TourUser@#2025";
    $dbname = "tour_user";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    logDebug("Database connection successful");

} catch (Exception $e) {
    logDebug("Database connection failed: " . $e->getMessage());
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please try again later.']);
    exit();
}

// Get client information
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

// Save to database
$stmt = $conn->prepare("INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    logDebug("Prepare failed: " . $conn->error);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    exit();
}

$subjectValue = $msgSubject ?: 'General Inquiry';
$phoneValue = $userPhone ?: null;

$stmt->bind_param("sssssss", $userName, $userEmail, $phoneValue, $subjectValue, $userMessage, $clientIP, $userAgent);

if (!$stmt->execute()) {
    logDebug("Execute failed: " . $stmt->error);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Failed to save message. Please try again.']);
    exit();
}

$messageId = $conn->insert_id;
logDebug("Message saved to database with ID: $messageId");

$stmt->close();
$conn->close();

// Send emails using PHPMailer
$emailsSent = ['admin' => false, 'user' => false];
$emailErrors = [];

// --- Send Email to Admin ---
try {
    $mail = new PHPMailer(true);
    
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host       = $emailConfig['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $emailConfig['smtp_username'];
    $mail->Password   = $emailConfig['smtp_password'];
    $mail->SMTPSecure = $emailConfig['smtp_secure'];
    $mail->Port       = $emailConfig['smtp_port'];

    // From & To
    $mail->setFrom($emailConfig['from_email'], 'Ceylon Tour Contact Form');
    $mail->addAddress('info@ceylontour.com', 'Ceylon Tour Admin');
    $mail->addReplyTo($userEmail, $userName);

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Message from $userName - Ceylon Tour";
    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background: #87d065; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;'>
            <h2 style='margin:0;'>New Contact Form Submission</h2>
        </div>
        <div style='background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 5px 5px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 30%;'>Name:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . htmlspecialchars($userName) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;'>Email:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . htmlspecialchars($userEmail) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;'>Phone:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . htmlspecialchars($userPhone ?: 'Not provided') . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;'>Subject:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . htmlspecialchars($msgSubject ?: 'General Inquiry') . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;'>Message:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . nl2br(htmlspecialchars($userMessage)) . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold;'>Date:</td>
                    <td style='padding: 10px; border-bottom: 1px solid #f0f0f0;'>" . date('F j, Y, g:i a') . "</td>
                </tr>
                <tr>
                    <td style='padding: 10px; font-weight: bold;'>Message ID:</td>
                    <td style='padding: 10px;'>#$messageId</td>
                </tr>
            </table>
        </div>
    </div>
    ";

    $mail->send();
    $emailsSent['admin'] = true;
    logDebug("Admin email sent successfully");

} catch (Exception $e) {
    $emailErrors[] = "Admin email failed: {$mail->ErrorInfo}";
    logDebug("Admin email not sent: {$mail->ErrorInfo}");
}

// --- Send Confirmation Email to User ---
try {
    $mail = new PHPMailer(true);
    
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host       = $emailConfig['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $emailConfig['smtp_username'];
    $mail->Password   = $emailConfig['smtp_password'];
    $mail->SMTPSecure = $emailConfig['smtp_secure'];
    $mail->Port       = $emailConfig['smtp_port'];

    // From & To
    $mail->setFrom($emailConfig['from_email'], $emailConfig['from_name']);
    $mail->addAddress($userEmail, $userName);
    $mail->addReplyTo($emailConfig['reply_to'], $emailConfig['from_name']);

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = "Thank You for Contacting Ceylon Tour.com";
    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background: #87d065; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0;'>
            <h1 style='margin:0;'>Thank You for Reaching Out!</h1>
        </div>
        <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;'>
            <p>Dear <strong>" . htmlspecialchars($userName) . "</strong>,</p>
            <p>Thank you for contacting Ceylon Tour.com. We have received your message and our team will respond within 24 hours.</p>
            
            <div style='background: white; padding: 15px; margin: 20px 0; border-left: 4px solid #87d065;'>
                <strong>Your Message:</strong>
                <p style='margin: 10px 0 0 0;'>" . nl2br(htmlspecialchars($userMessage)) . "</p>
            </div>

            <p><strong>Need immediate assistance?</strong></p>
            <ul style='list-style: none; padding: 0;'>
                <li style='padding: 5px 0;'>📞 Phone (Sri Lanka): +94 76 393 6557</li>
                <li style='padding: 5px 0;'>📞 Phone (Ireland): +353 87 383 9726</li>
                <li style='padding: 5px 0;'>📧 Email: info@ceylontour.com</li>
            </ul>

            <p style='margin-top: 20px;'>Best regards,<br><strong>Ceylon Tour.com Team</strong></p>
        </div>
        <div style='text-align: center; padding: 20px; color: #666; font-size: 12px;'>
            <p style='margin: 5px 0;'>59/58 Hanthana Gemunu Mawatha, Kandy, Sri Lanka</p>
            <p style='margin: 5px 0;'>© " . date('Y') . " Ceylon Tour.com. All rights reserved.</p>
        </div>
    </div>
    ";

    $mail->send();
    $emailsSent['user'] = true;
    logDebug("User confirmation email sent successfully");

} catch (Exception $e) {
    $emailErrors[] = "User email failed: {$mail->ErrorInfo}";
    logDebug("User confirmation email not sent: {$mail->ErrorInfo}");
}

// Prepare response
logDebug("=== Contact Form Submission Completed ===");
logDebug("Admin email sent: " . ($emailsSent['admin'] ? 'YES' : 'NO'));
logDebug("User email sent: " . ($emailsSent['user'] ? 'YES' : 'NO'));

ob_clean();

if ($emailsSent['admin'] && $emailsSent['user']) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. We will contact you within 24 hours.',
        'data' => ['message_id' => $messageId]
    ]);
} else if ($emailsSent['admin'] || $emailsSent['user']) {
    echo json_encode([
        'success' => true,
        'message' => 'Your message was saved successfully. However, there was a partial email delivery issue. We will contact you soon.',
        'data' => ['message_id' => $messageId, 'email_warnings' => $emailErrors]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Your message was saved successfully. However, email notifications could not be sent. We will still contact you within 24 hours.',
        'data' => ['message_id' => $messageId, 'email_errors' => $emailErrors]
    ]);
}
?>
