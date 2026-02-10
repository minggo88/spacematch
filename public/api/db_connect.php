<?php
// ─── Session Lifetime: 24 hours ───
$session_lifetime = 86400; // 24시간 (초)
ini_set('session.gc_maxlifetime', $session_lifetime);
ini_set('session.cookie_lifetime', $session_lifetime);
session_set_cookie_params([
    'lifetime' => $session_lifetime,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Dynamic CORS: allow only same-origin or specific domain
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$server_host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
if (!empty($allowed_origin) && (strpos($allowed_origin, $server_host) !== false)) {
    header("Access-Control-Allow-Origin: " . $allowed_origin);
    header("Access-Control-Allow-Credentials: true");
} else {
    // Same-origin requests (no Origin header) are allowed by default
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials
$host = 'localhost';
$db_name = 'spacematch';
$username = 'spacematch';
$password = 'qortpdnd91!@';

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {
    http_response_code(500);
    error_log("DB Connection Error: " . $exception->getMessage());
    echo json_encode(array("message" => "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."));
    exit();
}
?>