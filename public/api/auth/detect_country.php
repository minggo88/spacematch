<?php
/**
 * detect_country.php — IP 기반 국가 자동 감지 API
 * 무료 ip-api.com 서비스 사용 (45요청/분 제한)
 */
header('Content-Type: application/json; charset=utf-8');

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
// 프록시를 통한 여러 IP가 올 수 있으므로 첫 번째 IP만 사용
if (strpos($ip, ',') !== false) {
    $ip = trim(explode(',', $ip)[0]);
}

// 로컬 IP 처리
if (in_array($ip, ['127.0.0.1', '::1', '']) || strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0) {
    echo json_encode([
        "success" => true,
        "country_code" => "ko",
        "country_name" => "South Korea",
        "ip" => $ip,
        "source" => "default"
    ]);
    exit;
}

// 세션 캐싱 (같은 세션 내 반복 호출 방지)
session_start();
if (isset($_SESSION['detected_country']) && isset($_SESSION['detected_ip']) && $_SESSION['detected_ip'] === $ip) {
    echo json_encode([
        "success" => true,
        "country_code" => $_SESSION['detected_country'],
        "country_name" => $_SESSION['detected_country_name'] ?? '',
        "ip" => $ip,
        "source" => "cache"
    ]);
    exit;
}

// ip-api.com 무료 API (HTTP only)
$apiUrl = "http://ip-api.com/json/{$ip}?fields=status,countryCode,country";
$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 3,
    CURLOPT_CONNECTTIMEOUT => 2,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    echo json_encode(["success" => true, "country_code" => "ko", "country_name" => "South Korea", "ip" => $ip, "source" => "fallback"]);
    exit;
}

$data = json_decode($response, true);
if (!$data || $data['status'] !== 'success') {
    echo json_encode(["success" => true, "country_code" => "ko", "country_name" => "South Korea", "ip" => $ip, "source" => "fallback"]);
    exit;
}

// ISO 국가코드 → 우리 시스템의 country code 매핑
$isoToSystem = [
    'KR' => 'ko',
    'JP' => 'ja',
    'VN' => 'vi',
    'US' => 'en',
    'GB' => 'en-GB',
    'CA' => 'en-CA',
    'TH' => 'th',
    'KH' => 'km',
    'RU' => 'ru',
    'UA' => 'uk',
];

$isoCode = $data['countryCode'] ?? '';
$systemCode = $isoToSystem[$isoCode] ?? 'en'; // 매핑 없으면 en으로 기본값

// 세션 캐시 저장
$_SESSION['detected_country'] = $systemCode;
$_SESSION['detected_country_name'] = $data['country'] ?? '';
$_SESSION['detected_ip'] = $ip;

echo json_encode([
    "success" => true,
    "country_code" => $systemCode,
    "country_name" => $data['country'] ?? '',
    "ip" => $ip,
    "source" => "api"
], JSON_UNESCAPED_UNICODE);
