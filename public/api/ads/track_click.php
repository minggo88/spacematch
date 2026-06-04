<?php
// Public: Track ad click
include_once '../db_connect.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($data['ad_id']) ? intval($data['ad_id']) : 0;

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ad_id required']);
    exit();
}

try {
    $stmt = $conn->prepare("UPDATE ads SET click_count = click_count + 1 WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);

    // Also record in daily stats
    $daily = $conn->prepare("
        INSERT INTO ad_daily_stats (ad_id, stat_date, clicks) VALUES (:id, CURDATE(), 1)
        ON DUPLICATE KEY UPDATE clicks = clicks + 1
    ");
    $daily->execute([':id' => $ad_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>