<?php
/**
 * Batch Geocode Script
 * Converts all existing venues without coordinates to lat/lng using Kakao API.
 * 
 * Run from browser: /spacematch/api/utils/batch_geocode.php
 * Requires admin/superadmin session.
 */
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Only allow admin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "관리자만 실행할 수 있습니다."]);
    exit;
}

include_once 'geocode.php';

// Ensure lat/lng columns exist
try {
    $chk = $conn->query("SHOW COLUMNS FROM venues LIKE 'latitude'");
    if (!$chk->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN latitude DECIMAL(10,7) DEFAULT NULL");
    }
    $chk2 = $conn->query("SHOW COLUMNS FROM venues LIKE 'longitude'");
    if (!$chk2->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN longitude DECIMAL(10,7) DEFAULT NULL");
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "컬럼 추가 실패: " . $e->getMessage()]);
    exit;
}

// Check if API key is configured
if (empty(KAKAO_REST_API_KEY)) {
    echo json_encode(["success" => false, "message" => "KAKAO_REST_API_KEY가 설정되지 않았습니다. geocode.php를 확인하세요."]);
    exit;
}

// Find venues without coordinates
$stmt = $conn->query("SELECT id, name, location FROM venues WHERE (latitude IS NULL OR longitude IS NULL) AND location IS NOT NULL AND location != ''");
$venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

$results = [
    'total' => count($venues),
    'success' => 0,
    'failed' => 0,
    'details' => []
];

$updateStmt = $conn->prepare("UPDATE venues SET latitude = ?, longitude = ? WHERE id = ?");

foreach ($venues as $venue) {
    // Rate limiting: Kakao API allows ~30 req/min for free tier
    usleep(200000); // 200ms delay between requests

    $coords = geocodeAddress($venue['location']);

    if ($coords) {
        $updateStmt->execute([$coords['lat'], $coords['lng'], $venue['id']]);
        $results['success']++;
        $results['details'][] = [
            'id' => $venue['id'],
            'name' => $venue['name'],
            'status' => 'ok',
            'lat' => $coords['lat'],
            'lng' => $coords['lng']
        ];
    } else {
        $results['failed']++;
        $results['details'][] = [
            'id' => $venue['id'],
            'name' => $venue['name'],
            'address' => $venue['location'],
            'status' => 'failed'
        ];
    }
}

echo json_encode([
    "success" => true,
    "message" => "일괄 좌표 변환 완료: {$results['success']}건 성공, {$results['failed']}건 실패",
    "results" => $results
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>