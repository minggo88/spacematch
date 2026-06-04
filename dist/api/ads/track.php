<?php
// Public: Track ad events (view / click)
// - 'view' events are already counted by get_ads.php, so this endpoint
//   silently acknowledges them to avoid 404 errors from the frontend.
// - 'click' events are delegated to track_click.php logic.
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($data['ad_id']) ? intval($data['ad_id']) : 0;
$event = isset($data['event']) ? trim($data['event']) : '';

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ad_id required']);
    exit();
}

// View events → already tracked by get_ads.php, just acknowledge
if ($event === 'view') {
    echo json_encode(['success' => true]);
    exit();
}

// Click events → update click_count
if ($event === 'click') {
    try {
        $stmt = $conn->prepare("UPDATE ads SET click_count = click_count + 1 WHERE id = :id");
        $stmt->execute([':id' => $ad_id]);

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
    exit();
}

// Unknown event type
echo json_encode(['success' => false, 'message' => 'unknown event type']);
?>