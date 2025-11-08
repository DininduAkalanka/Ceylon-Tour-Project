<?php
/**
 * WhatsApp Button Click Notification Handler
 * Sends email notification when WhatsApp button is clicked
 * Version: 1.0.0
 */

// Error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Set response header
header('Content-Type: application/json');

// Allow CORS if needed (adjust for your domain)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method is allowed'
    ]);
    exit;
}

// Email Configuration
$EMAIL_CONFIG = [
    'to_email' => 'info@ceylontour.com', // Your email address
    'from_email' => 'noreply@ceylontour.com', // Sender email
    'from_name' => 'Ceylon Tour WhatsApp Notification',
    'subject' => 'New WhatsApp Contact Request'
];

try {
    // Get JSON data from request
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validate data
    if (!$data || !isset($data['message'])) {
        throw new Exception('Invalid data received');
    }

    // Sanitize input data
    $message = htmlspecialchars($data['message'] ?? 'No message', ENT_QUOTES, 'UTF-8');
    $timestamp = htmlspecialchars($data['timestamp'] ?? date('Y-m-d H:i:s'), ENT_QUOTES, 'UTF-8');
    $pageUrl = htmlspecialchars($data['pageUrl'] ?? 'Unknown', ENT_QUOTES, 'UTF-8');
    $referrer = htmlspecialchars($data['referrer'] ?? 'Direct visit', ENT_QUOTES, 'UTF-8');
    $userAgent = htmlspecialchars($data['userAgent'] ?? 'Unknown', ENT_QUOTES, 'UTF-8');

    // Get visitor IP address
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

    // Detect device type
    $device = 'Desktop';
    if (preg_match('/mobile|android|iphone|ipad|phone/i', $userAgent)) {
        $device = 'Mobile';
    } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
        $device = 'Tablet';
    }

    // Build email content
    $emailBody = buildEmailBody([
        'message' => $message,
        'timestamp' => $timestamp,
        'pageUrl' => $pageUrl,
        'referrer' => $referrer,
        'userAgent' => $userAgent,
        'ipAddress' => $ip_address,
        'device' => $device
    ]);

    // Send email
    $emailSent = sendEmail(
        $EMAIL_CONFIG['to_email'],
        $EMAIL_CONFIG['subject'],
        $emailBody,
        $EMAIL_CONFIG['from_email'],
        $EMAIL_CONFIG['from_name']
    );

    if ($emailSent) {
        // Log successful notification (optional)
        logNotification($data);

        echo json_encode([
            'success' => true,
            'message' => 'Email notification sent successfully'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * Build HTML email body
 */
function buildEmailBody($data) {
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #25D366; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background: #f5f5f5; border-left: 4px solid #25D366; }
            .label { font-weight: bold; color: #25D366; }
            .value { margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2 style='margin: 0;'>🟢 WhatsApp Contact Request</h2>
                <p style='margin: 10px 0 0 0;'>Someone clicked your WhatsApp button!</p>
            </div>
            <div class='content'>
                <div class='alert'>
                    <strong>⚡ Action Required:</strong> A potential customer is trying to reach you on WhatsApp!
                </div>

                <div class='info-row'>
                    <div class='label'>💬 Message Intent:</div>
                    <div class='value'>{$data['message']}</div>
                </div>

                <div class='info-row'>
                    <div class='label'>🕐 Time:</div>
                    <div class='value'>{$data['timestamp']}</div>
                </div>

                <div class='info-row'>
                    <div class='label'>📱 Device:</div>
                    <div class='value'>{$data['device']}</div>
                </div>

                <div class='info-row'>
                    <div class='label'>📄 Page:</div>
                    <div class='value'><a href='{$data['pageUrl']}'>{$data['pageUrl']}</a></div>
                </div>

                <div class='info-row'>
                    <div class='label'>🔗 Referrer:</div>
                    <div class='value'>{$data['referrer']}</div>
                </div>

                <div class='info-row'>
                    <div class='label'>🌐 IP Address:</div>
                    <div class='value'>{$data['ipAddress']}</div>
                </div>

                <div class='info-row'>
                    <div class='label'>🖥️ User Agent:</div>
                    <div class='value' style='font-size: 11px; word-break: break-all;'>{$data['userAgent']}</div>
                </div>

                <div style='margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px; text-align: center;'>
                    <p style='margin: 0; font-size: 14px;'>
                        <strong>💡 Next Step:</strong> Check your WhatsApp for incoming message!
                    </p>
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated notification from Ceylon Tour.com WhatsApp Button</p>
                <p>© " . date('Y') . " Ceylon Tour.com. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    return $html;
}

/**
 * Send email using PHP mail function or PHPMailer
 */
function sendEmail($to, $subject, $body, $from, $fromName) {
    // Check if PHPMailer is available
    if (file_exists('vendor/autoload.php')) {
        return sendEmailWithPHPMailer($to, $subject, $body, $from, $fromName);
    } else {
        return sendEmailWithPHPMail($to, $subject, $body, $from, $fromName);
    }
}

/**
 * Send email using PHPMailer (recommended)
 */
function sendEmailWithPHPMailer($to, $subject, $body, $from, $fromName) {
    require_once 'vendor/autoload.php';

    try {
        // Include email configuration if it exists
        $config = [];
        if (file_exists('email_config.php')) {
            $config = require 'email_config.php';
        }

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'] ?? $from;
        $mail->Password = $config['smtp_password'] ?? '';
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'] ?? 587;

        // Recipients
        $mail->setFrom($from, $fromName);
        $mail->addAddress($to);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
        return true;
    } catch (\Exception $e) {
        error_log("PHPMailer Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Send email using PHP mail() function (fallback)
 */
function sendEmailWithPHPMail($to, $subject, $body, $from, $fromName) {
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: {$fromName} <{$from}>" . "\r\n";
    $headers .= "Reply-To: {$from}" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $body, $headers);
}

/**
 * Log notification to file (optional)
 */
function logNotification($data) {
    $logFile = 'logs/whatsapp_notifications.log';
    $logDir = dirname($logFile);
    
    // Create logs directory if it doesn't exist
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }

    $logEntry = date('Y-m-d H:i:s') . " - WhatsApp button clicked\n";
    $logEntry .= "Message: " . ($data['message'] ?? 'N/A') . "\n";
    $logEntry .= "Page: " . ($data['pageUrl'] ?? 'N/A') . "\n";
    $logEntry .= "Referrer: " . ($data['referrer'] ?? 'N/A') . "\n";
    $logEntry .= str_repeat('-', 80) . "\n";

    @file_put_contents($logFile, $logEntry, FILE_APPEND);
}
?>
