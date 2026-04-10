<?php
/**
 * AutomatIA Pro — Entry point for cPanel
 * This file serves static assets and proxies API requests to Node.js backend
 */

$requestUri = $_SERVER['REQUEST_URI'];
$scriptDir = dirname(__FILE__);
$publicDir = $scriptDir . '/backend/public_html';

// Remove leading slash
$path = ltrim(parse_url($requestUri, PHP_URL_PATH), '/');

// API requests go to Node.js backend (via .htaccess rewrite)
if (strpos($path, 'api/') === 0) {
    // This is handled by .htaccess ProxyPass
    return false;
}

// Serve static files from public_html
$file = $publicDir . '/' . $path;

// If it's a directory or doesn't exist, try index.html
if (is_dir($file) || !file_exists($file)) {
    $file = $publicDir . '/index.html';
}

// Security: prevent directory traversal
if (strpos(realpath($file), realpath($publicDir)) !== 0) {
    header('HTTP/1.0 404 Not Found');
    exit;
}

// Serve the file
if (file_exists($file)) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'ico' => 'image/x-icon',
        'txt' => 'text/plain',
        'xml' => 'application/xml'
    ];

    header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));

    // Cache headers for static assets
    if (in_array($ext, ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'])) {
        header('Cache-Control: public, max-age=31536000'); // 1 year
    } else {
        header('Cache-Control: public, max-age=3600'); // 1 hour
    }

    readfile($file);
} else {
    header('HTTP/1.0 404 Not Found');
    echo '404 Not Found';
}
?>
