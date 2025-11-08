<?php
/**
 * Front Controller - Entry Point for All Requests
 * This file should be the only PHP file in the public directory
 */

// Define base paths
define('ROOT_PATH', dirname(__DIR__));
define('CONFIG_PATH', ROOT_PATH . '/config');
define('BACKEND_PATH', ROOT_PATH . '/backend');
define('FRONTEND_PATH', ROOT_PATH . '/frontend');
define('VIEWS_PATH', FRONTEND_PATH . '/views/pages');

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the requested URI
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$uri = str_replace($scriptName, '', $requestUri);
$uri = trim($uri, '/');
$uri = parse_url($uri, PHP_URL_PATH);

// Default route
if (empty($uri) || $uri === 'index.php') {
    $uri = 'index';
}

// Route mapping
$routes = [
    // Main pages
    'index' => VIEWS_PATH . '/index.php',
    'home' => VIEWS_PATH . '/index.php',
    '' => VIEWS_PATH . '/index.php',
    
    // Contact
    'contact' => VIEWS_PATH . '/contact_us.php',
    'contact_us' => VIEWS_PATH . '/contact_us.php',
    
    // Feedback
    'feedback' => VIEWS_PATH . '/feedback.php',
    
    // Tour packages
    'yala-safari' => VIEWS_PATH . '/yala-safari-details.php',
    'yala-safari-details' => VIEWS_PATH . '/yala-safari-details.php',
    'highlights-5days' => VIEWS_PATH . '/Highlights_of_Sri_Lanka-5Days.php',
    'highlights-10days' => VIEWS_PATH . '/Highlights_of_Sri_Lanka-10Days.php',
    'tour-9days' => VIEWS_PATH . '/Sri_Lanka-9Day_Tour_Package.php',
    'beach-holiday' => VIEWS_PATH . '/Sri_Lanka_Beach_Holiday.php',
    'budget-tour' => VIEWS_PATH . '/Sri_Lanka_Budget_Tour_Package.php',
    'heritage-tour' => VIEWS_PATH . '/Sri_Lanka_Heritage_Tour_Package.php',
    
    // Activities
    'surfing' => VIEWS_PATH . '/surfing.html',
    'water-rafting' => VIEWS_PATH . '/water-rafting.html',
    'wildlife-safari' => VIEWS_PATH . '/wildlife-safari.html',
];

// Check if the route exists
if (isset($routes[$uri])) {
    $file = $routes[$uri];
    if (file_exists($file)) {
        require_once $file;
    } else {
        http_response_code(404);
        echo "<!DOCTYPE html><html><head><title>404 Not Found</title></head><body>";
        echo "<h1>404 - Page Not Found</h1>";
        echo "<p>The file <code>$file</code> could not be found.</p>";
        echo "<a href='/'>Go to Homepage</a>";
        echo "</body></html>";
    }
} else {
    // Try to find the file directly (fallback for old URLs)
    $directFile = VIEWS_PATH . '/' . $uri;
    
    if (file_exists($directFile . '.php')) {
        require_once $directFile . '.php';
    } elseif (file_exists($directFile . '.html')) {
        require_once $directFile . '.html';
    } else {
        http_response_code(404);
        echo "<!DOCTYPE html><html><head><title>404 Not Found</title></head><body>";
        echo "<h1>404 - Page Not Found</h1>";
        echo "<p>The requested page <code>$uri</code> could not be found.</p>";
        echo "<a href='/'>Go to Homepage</a>";
        echo "</body></html>";
    }
}
