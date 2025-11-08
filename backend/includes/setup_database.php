<?php
/**
 * Secure Database Setup Script
 * Uses environment variables from .env file
 * NEVER hardcode passwords here!
 */

// Load secure configuration
define('CONFIG_ACCESS', true);
require_once __DIR__ . '/config.php';

// Get database credentials from secure config
$dbConfig = Config::database();

$servername = $dbConfig['host'];
$username = $dbConfig['user'];
$password = $dbConfig['pass'];
$dbname = $dbConfig['name'];

// Create connection to the tour database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Log error securely without exposing sensitive info
    error_log("Database connection failed: " . $conn->connect_error);
    
    if (Config::isDebug()) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        die("Database connection error. Please contact the administrator.");
    }
}

// Only show success message in debug mode
if (Config::isDebug()) {
    // echo "Connected successfully to MySQL server<br>";
}

?>
