<?php
// Public: Get ad report by share token (no auth required)
include_once '../db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$token = isset($_GET['token']) ? trim($_GET['token']) : '';
if (empty($token)) {
    echo json_encode(['success' => false, 'message' => 'token required']);
    exit();
}

try {
    // Auto-create table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_share_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_ad (ad_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Validate token
    $stmt = $conn->prepare("
        SELECT t.ad_id, t.expires_at 
        FROM ad_share_tokens t 
        WHERE t.token = :token
    ");
    $stmt->execute([':token' => $token]);
    $tokenRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tokenRow) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => '유효하지 않은 링크입니다.']);
        exit();
    }

    // Check expiration
    if ($tokenRow['expires_at'] && strtotime($tokenRow['expires_at']) < time()) {
        http_response_code(410);
        echo json_encode(['success' => false, 'message' => '만료된 링크입니다.']);
        exit();
    }

    $ad_id = intval($tokenRow['ad_id']);

    // Get ad info (limited fields for public)
    $adStmt = $conn->prepare("SELECT id, slot_id, title, image_url, start_date, end_date, view_count, click_count, created_at FROM ads WHERE id = :id");
    $adStmt->execute([':id' => $ad_id]);
    $ad = $adStmt->fetch(PDO::FETCH_ASSOC);

    if (!$ad) {
        echo json_encode(['success' => false, 'message' => 'Ad not found']);
        exit();
    }

    // Get daily stats (safe: table may not exist)
    $daily = [];
    try {
        $dailyStmt = $conn->prepare("
            SELECT stat_date, views, clicks 
            FROM ad_daily_stats 
            WHERE ad_id = :id 
            ORDER BY stat_date ASC
        ");
        $dailyStmt->execute([':id' => $ad_id]);
        $daily = $dailyStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $ignore) {
        $daily = [];
    }

    // Summary
    $total_views = intval($ad['view_count']);
    $total_clicks = intval($ad['click_count']);
    $ctr = $total_views > 0 ? round(($total_clicks / $total_views) * 100, 2) : 0;

    $start = $ad['start_date'] ?: $ad['created_at'];
    $end = $ad['end_date'] ?: date('Y-m-d');
    $start_dt = new DateTime($start);
    $end_dt = new DateTime($end);
    $running_days = max(1, $start_dt->diff($end_dt)->days + 1);

    echo json_encode([
        'success' => true,
        'ad' => [
            'title' => $ad['title'],
            'image_url' => $ad['image_url'],
            'slot_id' => $ad['slot_id'],
            'start_date' => $ad['start_date'],
            'end_date' => $ad['end_date'],
        ],
        'daily_stats' => $daily,
        'summary' => [
            'total_views' => $total_views,
            'total_clicks' => $total_clicks,
            'ctr' => $ctr,
            'running_days' => $running_days,
            'avg_daily_views' => round($total_views / $running_days, 1),
            'avg_daily_clicks' => round($total_clicks / $running_days, 1),
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>