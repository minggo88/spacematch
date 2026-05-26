<?php
// ─── Session Lifetime: 24 hours ───
$session_lifetime = 86400; // 24시간 (초)
ini_set('session.gc_maxlifetime', $session_lifetime);
ini_set('session.cookie_lifetime', $session_lifetime);

// ─── Session Security ───
ini_set('session.use_strict_mode', 1);           // Reject uninitialized session IDs
ini_set('session.use_only_cookies', 1);           // No session ID in URL
ini_set('session.cookie_httponly', 1);             // JavaScript cannot access session cookie

session_set_cookie_params([
    'lifetime' => $session_lifetime,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')
]);

// ─── Security Headers ───
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");

// ─── CORS: Capacitor 모바일 앱 + 웹 도메인 허용 ───
$allowed_origins = [
    'capacitor://localhost',     // Capacitor iOS
    'http://localhost',          // Capacitor Android
    'https://localhost',         // Capacitor Android (HTTPS)
];

// 서버 호스트 기반 동적 허용 (기존 웹 호환)
$server_host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
$request_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

$is_allowed = in_array($request_origin, $allowed_origins)
    || (!empty($request_origin) && !empty($server_host) && strpos($request_origin, $server_host) !== false);

if ($is_allowed && !empty($request_origin)) {
    header("Access-Control-Allow-Origin: " . $request_origin);
    header("Access-Control-Allow-Credentials: true");

    // Capacitor 앱에서는 SameSite=None 필요 (교차 출처 쿠키 허용)
    if (in_array($request_origin, $allowed_origins)) {
        session_set_cookie_params([
            'lifetime' => $session_lifetime,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'None',
            'secure' => true
        ]);
    }
}
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials — 환경변수 우선, 없으면 .env 파일에서 로드
$_envFile = __DIR__ . '/../../.env';
if (file_exists($_envFile)) {
    foreach (file($_envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $_line) {
        if (strpos(trim($_line), '#') === 0 || strpos($_line, '=') === false) continue;
        [$_k, $_v] = explode('=', $_line, 2);
        if (!getenv(trim($_k))) putenv(trim($_k) . '=' . trim($_v));
    }
}
$host     = getenv('DB_HOST') ?: 'localhost';
$db_name  = getenv('DB_NAME') ?: 'spacematch';
$username = getenv('DB_USER') ?: 'spacematch';
$password = getenv('DB_PASS') ?: '';

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);   // Use real prepared statements
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $exception) {
    http_response_code(500);
    error_log("DB Connection Error: " . $exception->getMessage());
    // Do NOT expose internal error details to client
    echo json_encode(array("message" => "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."));
    exit();
}
?>