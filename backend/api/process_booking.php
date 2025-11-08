<?php
// Start output buffering to prevent any unexpected output
ob_start();

// Disable error display to prevent breaking JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/booking-errors.log');

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

// Database connection
require_once __DIR__ . '/../includes/setup_database.php';

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

// Collect form data
$fullName   = $_POST['fullName'] ?? '';
$email      = $_POST['email'] ?? '';
$phone      = $_POST['phone'] ?? '';
$package    = $_POST['packageSelect'] ?? '';
$date       = $_POST['travelDate'] ?? '';
$travelers  = (int)($_POST['numTravelers'] ?? 0);
$message    = $_POST['message'] ?? '';

// Validation
if (!$fullName || !$email || !$package || !$date || $travelers < 1) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
    exit();
}

// Additional validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit();
}

if ($travelers < 1 || $travelers > 20) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Number of travelers must be between 1 and 20']);
    exit();
}

// Save booking in DB
$stmt = $conn->prepare("INSERT INTO bookings (full_name, email, phone, package_name, travel_date, num_travelers, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssis", $fullName, $email, $phone, $package, $date, $travelers, $message);

if ($stmt->execute()) {
    $bookingId = $conn->insert_id;

    // --- Send Email Confirmation ---
    $mail = new PHPMailer(true);
    $emailSent = false;
    
    try {
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
        $mail->addAddress($email, $fullName);
        $mail->addReplyTo($emailConfig['reply_to'], $emailConfig['from_name']);

        // Email Content
        $mail->isHTML(true);
        $mail->Subject = "Booking Confirmed (#$bookingId) - Thank You!";
        $mail->Body = "
          <div style='
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              border: 1px solid #e0e0e0;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          '>
            <div style='background: #1976d2; color: white; padding: 20px; text-align: center;'>
              <h1 style='margin:0;'>🌍 Ceylon Tour.com</h1>
              <p style='margin:0;font-size:16px;'>Your adventure starts here!</p>
            </div>

            <div style='padding: 20px;'>
              <h2 style='color:#333;'>Booking Confirmed</h2>
              <p>Hi <b>$fullName</b>,</p>
              <p>Thank you for booking with us! Your booking has been confirmed. Here are your details:</p>

              <table style='width:100%;border-collapse: collapse; margin-top:15px;'>
                <tr>
                  <td style='padding:8px;border:1px solid #ddd;'><b>Booking ID</b></td>
                  <td style='padding:8px;border:1px solid #ddd;'>#$bookingId</td>
                </tr>
                <tr>
                  <td style='padding:8px;border:1px solid #ddd;'><b>Package</b></td>
                  <td style='padding:8px;border:1px solid #ddd;'>$package</td>
                </tr>
                <tr>
                  <td style='padding:8px;border:1px solid #ddd;'><b>Date</b></td>
                  <td style='padding:8px;border:1px solid #ddd;'>$date</td>
                </tr>
                <tr>
                  <td style='padding:8px;border:1px solid #ddd;'><b>Travelers</b></td>
                  <td style='padding:8px;border:1px solid #ddd;'>$travelers</td>
                </tr>
                <tr>
                  <td style='padding:8px;border:1px solid #ddd;'><b>Phone</b></td>
                  <td style='padding:8px;border:1px solid #ddd;'>$phone</td>
                </tr>
              </table>

              <p style='margin-top:20px;'>We will contact you shortly with more details.</p>
              <p style='margin:0;'>Safe travels,</p>
              <p style='margin:0;'><b>Tour Booking Team</b></p>
            </div>

            <div style='background:#f5f5f5;color:#555;text-align:center;padding:10px;font-size:12px;'>
              © " . date('Y') . " Tour Booking. All rights reserved.
            </div>
          </div>
        ";

        $mail->send();
        $emailSent = true;
        error_log("Booking #$bookingId: Email sent successfully to $email");

    } catch (Exception $e) {
        error_log("Booking #$bookingId: Email failed - {$mail->ErrorInfo}");
    }

    // Clear output buffer and send success response
    ob_clean();
    
    $message = $emailSent 
        ? "Booking confirmed successfully! A confirmation email has been sent to $email."
        : "Booking confirmed successfully! However, the confirmation email could not be sent. We will contact you directly.";
    
    echo json_encode([
        'success' => true,
        'message' => $message,
        'bookingId' => $bookingId,
        'emailSent' => $emailSent
    ]);

} else {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>