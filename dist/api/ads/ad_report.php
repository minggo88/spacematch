<?php
// Admin: Get detailed ad report with daily stats
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$ad_id = isset($_GET['ad_id']) ? intval($_GET['ad_id']) : 0;
if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ad_id required']);
    exit();
}

try {
    // 1. Get ad info
    $stmt = $conn->prepare("SELECT * FROM ads WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ad) {
        echo json_encode(['success' => false, 'message' => 'Ad not found']);
        exit();
    }

    // 2. Get daily stats (safe: table may not exist yet)
    $daily = [];
    try {
        $stmt2 = $conn->prepare("
            SELECT stat_date, views, clicks 
            FROM ad_daily_stats 
            WHERE ad_id = :id 
            ORDER BY stat_date ASC
        ");
        $stmt2->execute([':id' => $ad_id]);
        $daily = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $ignore) {
        // Table doesn't exist yet — continue with empty daily stats
        $daily = [];
    }

    // 3. Compute summary from cumulative data in ads table
    $total_views = intval($ad['view_count']);
    $total_clicks = intval($ad['click_count']);
    $ctr = $total_views > 0 ? round(($total_clicks / $total_views) * 100, 2) : 0;

    // Calculate running days
    $start = $ad['start_date'] ?: $ad['created_at'];
    $end = $ad['end_date'] ?: date('Y-m-d');
    $start_dt = new DateTime($start);
    $end_dt = new DateTime($end);
    $running_days = max(1, $start_dt->diff($end_dt)->days + 1);

    echo json_encode([
        'success' => true,
        'ad' => $ad,
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