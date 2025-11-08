<?php
/**
 * Secure Email Configuration
 * Uses environment variables from .env file
 * NEVER hardcode passwords here!
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy .env.example to .env
 * 2. Enable 2-Factor Authentication on your Gmail account
 * 3. Generate an App Password:
 *    - Go to Google Account settings
 *    - Security → 2-Step Verification → App passwords
 *    - Generate a 16-character app password
 *    - Add this password to .env file as SMTP_PASSWORD
 * 4. Update other email settings in .env file
 * 5. NEVER commit .env file to Git!
 */

// Load secure configuration
define('CONFIG_ACCESS', true);
require_once __DIR__ . '/config.php';

// Return email configuration from environment variables
return Config::email();
?>
