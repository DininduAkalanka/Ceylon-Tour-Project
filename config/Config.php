<?php
/**
 * Secure Configuration Loader
 * This file loads environment variables from .env file
 * SECURITY: Never commit your .env file to Git!
 */

// Prevent direct access
if (!defined('CONFIG_ACCESS')) {
    die('Direct access not permitted');
}

class Config {
    private static $config = [];
    private static $loaded = false;

    /**
     * Load environment variables from .env file
     */
    public static function load() {
        if (self::$loaded) {
            return;
        }

        $envFile = __DIR__ . '/.env';
        
        // Check if .env file exists
        if (!file_exists($envFile)) {
            // Fallback to .env.example for first-time setup guidance
            if (file_exists(__DIR__ . '/.env.example')) {
                die('ERROR: Please create a .env file by copying .env.example and filling in your credentials.');
            }
            die('ERROR: Configuration file (.env) not found. Please create it with your database and email credentials.');
        }

        // Read .env file
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments and empty lines
            if (strpos(trim($line), '#') === 0 || empty(trim($line))) {
                continue;
            }

            // Parse key=value pairs
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            $value = trim($value, '"\'');
            
            // Store in config array
            self::$config[$key] = $value;
            
            // Also set as environment variable
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }

        self::$loaded = true;
    }

    /**
     * Get configuration value
     * @param string $key Configuration key
     * @param mixed $default Default value if key not found
     * @return mixed Configuration value
     */
    public static function get($key, $default = null) {
        self::load();
        return self::$config[$key] ?? $default;
    }

    /**
     * Get database configuration
     * @return array Database configuration
     */
    public static function database() {
        return [
            'host' => self::get('DB_HOST', 'localhost'),
            'name' => self::get('DB_NAME'),
            'user' => self::get('DB_USER'),
            'pass' => self::get('DB_PASS'),
        ];
    }

    /**
     * Get email configuration
     * @return array Email configuration
     */
    public static function email() {
        return [
            'smtp_host'     => self::get('SMTP_HOST', 'smtp.gmail.com'),
            'smtp_port'     => self::get('SMTP_PORT', 587),
            'smtp_secure'   => self::get('SMTP_SECURE', 'tls'),
            'smtp_username' => self::get('SMTP_USERNAME'),
            'smtp_password' => self::get('SMTP_PASSWORD'),
            'from_email'    => self::get('FROM_EMAIL'),
            'from_name'     => self::get('FROM_NAME', 'Ceylon Tour.com'),
            'reply_to'      => self::get('REPLY_TO'),
        ];
    }

    /**
     * Check if running in debug mode
     * @return bool
     */
    public static function isDebug() {
        return self::get('DEBUG_MODE', 'false') === 'true';
    }

    /**
     * Get application environment
     * @return string
     */
    public static function environment() {
        return self::get('APP_ENV', 'production');
    }
}

// Auto-load configuration
Config::load();
?>
