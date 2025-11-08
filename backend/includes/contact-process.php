<?php
// Strict error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Initialize session
session_start();

// JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load secure configuration
define('CONFIG_ACCESS', true);
require_once __DIR__ . '/../config.php';

// Get database credentials from secure config
$dbConfig = Config::database();
define('DB_HOST', $dbConfig['host']);
define('DB_NAME', $dbConfig['name']);
define('DB_USER', $dbConfig['user']);
define('DB_PASS', $dbConfig['pass']);

// Get email settings from secure config
$emailConfig = Config::email();
define('ADMIN_EMAIL', $emailConfig['from_email']);
define('ADMIN_NAME', $emailConfig['from_name']);
define('REPLY_EMAIL', $emailConfig['reply_to']);

// Response helper
function jsonResponse($status, $msg, $extra = []) {
    http_response_code($status ? 200 : 400);
    echo json_encode(array_merge([
        'success' => $status,
        'message' => $msg
    ], $extra));
    exit;
}

// Check request type
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed');
}

try {
    // Extract form fields
    $formData = [
        'fullname' => filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING),
        'email_addr' => filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL),
        'phone_num' => filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING),
        'msg_subject' => filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING),
        'user_message' => filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING)
    ];

    // Validation rules
    $validationErrors = [];

    // Name validation
    if (empty($formData['fullname'])) {
        $validationErrors[] = 'Full name cannot be empty';
    } elseif (strlen($formData['fullname']) < 2 || strlen($formData['fullname']) > 100) {
        $validationErrors[] = 'Name length must be 2-100 characters';
    }

    // Email validation
    if (empty($formData['email_addr'])) {
        $validationErrors[] = 'Email address required';
    } elseif (!filter_var($formData['email_addr'], FILTER_VALIDATE_EMAIL)) {
        $validationErrors[] = 'Email format is invalid';
    }

    // Phone validation (optional field)
    if (!empty($formData['phone_num'])) {
        $cleanPhone = preg_replace('/[^0-9\+\-\s\(\)]/', '', $formData['phone_num']);
        if (strlen($cleanPhone) < 8) {
            $validationErrors[] = 'Phone number seems too short';
        }
    }

    // Message validation
    if (empty($formData['user_message'])) {
        $validationErrors[] = 'Please provide a message';
    } elseif (strlen($formData['user_message']) < 10) {
        $validationErrors[] = 'Message needs at least 10 characters';
    }

    // Stop if validation fails
    if (count($validationErrors) > 0) {
        jsonResponse(false, implode('. ', $validationErrors));
    }

    // Database connection
    $dbConnection = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Capture client info
    $clientIP = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP) ?: 'unknown';
    $clientAgent = htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', ENT_QUOTES);

    // Database insertion
    $insertQuery = $dbConnection->prepare("
        INSERT INTO contact_messages 
        (name, email, phone, subject, message, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    $insertQuery->execute([
        $formData['fullname'],
        $formData['email_addr'],
        $formData['phone_num'] ?: null,
        $formData['msg_subject'] ?: 'General Inquiry',
        $formData['user_message'],
        $clientIP,
        $clientAgent
    ]);

    $recordId = $dbConnection->lastInsertId();

    // Email to administrator
    $adminEmailSubject = "Contact Form: Message from {$formData['fullname']}";
    $adminEmailBody = sprintf("
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
                .email-wrapper { max-width: 650px; margin: 30px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .email-header { background: linear-gradient(135deg, #87d065 0%%, #6db54c 100%%); padding: 30px; text-align: center; color: white; }
                .email-body { padding: 30px; }
                .info-row { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; border-left: 4px solid #87d065; }
                .info-label { font-weight: 600; color: #333; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
                .info-value { color: #555; line-height: 1.6; }
                .email-footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class='email-wrapper'>
                <div class='email-header'>
                    <h1>New Contact Message</h1>
                    <p>Reference: #%s</p>
                </div>
                <div class='email-body'>
                    <div class='info-row'>
                        <div class='info-label'>Sender Name</div>
                        <div class='info-value'>%s</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Email Address</div>
                        <div class='info-value'>%s</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Phone Number</div>
                        <div class='info-value'>%s</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Subject</div>
                        <div class='info-value'>%s</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Message Content</div>
                        <div class='info-value'>%s</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Submitted On</div>
                        <div class='info-value'>%s</div>
                    </div>
                </div>
                <div class='email-footer'>
                    <p>Ceylon Tour.com - Contact Management System</p>
                    <p>&copy; %d All Rights Reserved</p>
                </div>
            </div>
        </body>
        </html>
    ",
        $recordId,
        htmlspecialchars($formData['fullname']),
        htmlspecialchars($formData['email_addr']),
        htmlspecialchars($formData['phone_num'] ?: 'Not provided'),
        htmlspecialchars($formData['msg_subject'] ?: 'General Inquiry'),
        nl2br(htmlspecialchars($formData['user_message'])),
        date('l, F j, Y \a\t g:i A'),
        date('Y')
    );

    $adminHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . ADMIN_NAME . ' <noreply@ceylontour.com>',
        'Reply-To: ' . $formData['email_addr'],
        'X-Mailer: PHP/' . phpversion()
    ];

    mail(ADMIN_EMAIL, $adminEmailSubject, $adminEmailBody, implode("\r\n", $adminHeaders));

    // Confirmation email to user
    $userEmailSubject = "We've Received Your Message - Ceylon Tour.com";
    $userEmailBody = sprintf("
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
                .email-wrapper { max-width: 650px; margin: 30px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .email-header { background: linear-gradient(135deg, #87d065 0%%, #6db54c 100%%); padding: 40px; text-align: center; color: white; }
                .email-body { padding: 40px; }
                .greeting { font-size: 20px; color: #333; margin-bottom: 20px; }
                .content-text { color: #555; line-height: 1.8; margin: 15px 0; }
                .message-preview { background: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #87d065; margin: 25px 0; }
                .contact-info { background: #ecf9ff; padding: 20px; border-radius: 5px; margin: 25px 0; }
                .cta-button { display: inline-block; padding: 15px 35px; background: #87d065; color: white; text-decoration: none; border-radius: 5px; margin: 25px 0; font-weight: 600; }
                .email-footer { background: #2c3e50; color: white; padding: 25px; text-align: center; font-size: 13px; line-height: 1.6; }
            </style>
        </head>
        <body>
            <div class='email-wrapper'>
                <div class='email-header'>
                    <h1>Thank You for Reaching Out!</h1>
                    <p style='margin-top: 10px; font-size: 16px;'>We appreciate your interest in Ceylon Tour.com</p>
                </div>
                <div class='email-body'>
                    <div class='greeting'>Hello %s,</div>
                    <p class='content-text'>
                        We have successfully received your inquiry. Our dedicated team will review your message 
                        and respond within 24 hours during business days.
                    </p>
                    <div class='message-preview'>
                        <strong style='color: #333; display: block; margin-bottom: 10px;'>Your Message:</strong>
                        <p style='color: #555;'>%s</p>
                    </div>
                    <p class='content-text'>
                        For immediate assistance, please don't hesitate to contact us directly:
                    </p>
                    <div class='contact-info'>
                        <p style='margin: 8px 0;'><strong>Sri Lanka Office:</strong> +94 76 393 6557</p>
                        <p style='margin: 8px 0;'><strong>Ireland Office:</strong> +353 87 383 9726</p>
                        <p style='margin: 8px 0;'><strong>Email:</strong> info@ceylontour.com</p>
                    </div>
                    <div style='text-align: center;'>
                        <a href='https://www.ceylontour.com' class='cta-button'>Explore Our Tours</a>
                    </div>
                    <p class='content-text' style='margin-top: 30px;'>
                        Best regards,<br>
                        <strong>The Ceylon Tour.com Team</strong>
                    </p>
                </div>
                <div class='email-footer'>
                    <p><strong>Ceylon Tour.com</strong></p>
                    <p>59/58 Hanthana Gemunu Mawatha, Kandy, Sri Lanka</p>
                    <p style='margin-top: 10px;'>Email: info@ceylontour.com | Phone: +94 76 393 6557</p>
                    <p style='margin-top: 15px;'>&copy; %d Ceylon Tour.com. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    ",
        htmlspecialchars($formData['fullname']),
        nl2br(htmlspecialchars($formData['user_message'])),
        date('Y')
    );

    $userHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . ADMIN_NAME . ' <' . REPLY_EMAIL . '>',
        'Reply-To: ' . REPLY_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    ];

    mail($formData['email_addr'], $userEmailSubject, $userEmailBody, implode("\r\n", $userHeaders));

    // Success response
    jsonResponse(true, 'Your message has been sent successfully! We will contact you within 24 hours.', [
        'reference_id' => $recordId
    ]);

} catch (PDOException $dbError) {
    error_log("DB Error: " . $dbError->getMessage());
    jsonResponse(false, 'A database error occurred. Please try again shortly.');
} catch (Exception $generalError) {
    error_log("System Error: " . $generalError->getMessage());
    jsonResponse(false, 'An unexpected error occurred. Please try again later.');
}
?>
