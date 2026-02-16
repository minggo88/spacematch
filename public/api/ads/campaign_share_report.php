<?php
// Public: Get campaign report by share token (no auth required)
include_once '../db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$token = isset($_GET['token']) ? trim($_GET['token']) : '';
if (empty($token)) {
    echo json_encode(['success' => false, 'message' => 'token required']);
    exit();
}

try {
    // Auto-create table
    $conn->exec("CREATE TABLE IF NOT EXISTS campaign_share_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_campaign (campaign_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Validate token
    $stmt = $conn->prepare("SELECT campaign_id, expires_at FROM campaign_share_tokens WHERE token = :token");
    $stmt->execute([':token' => $token]);
    $tokenRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tokenRow) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => '유효하지 않은 링크입니다.']);
        exit();
    }

    if ($tokenRow['expires_at'] && strtotime($tokenRow['expires_at']) < time()) {
        http_response_code(410);
        echo json_encode(['success' => false, 'message' => '만료된 링크입니다.']);
        exit();
    }

    $cid = intval($tokenRow['campaign_id']);

    // Campaign info
    $cStmt = $conn->prepare("SELECT id, name, advertiser, budget, start_date, end_date, status, created_at FROM ad_campaigns WHERE id = :id");
    $cStmt->execute([':id' => $cid]);
    $campaign = $cStmt->fetch(PDO::FETCH_ASSOC);
    if (!$campaign) {
        echo json_encode(['success' => false, 'message' => 'Campaign not found']);
        exit();
    }

    // Ads
    $aStmt = $conn->prepare("SELECT id, title, slot_id, image_url, view_count, click_count, start_date, end_date FROM ads WHERE campaign_id = :id ORDER BY view_count DESC");
    $aStmt->execute([':id' => $cid]);
    $ads = $aStmt->fetchAll(PDO::FETCH_ASSOC);

    // Daily stats
    $adIds = array_column($ads, 'id');
    $daily = [];
    if (!empty($adIds)) {
        try {
            $ph = implode(',', array_fill(0, count($adIds), '?'));
            $dStmt = $conn->prepare("SELECT stat_date, SUM(views) as views, SUM(clicks) as clicks FROM ad_daily_stats WHERE ad_id IN ($ph) GROUP BY stat_date ORDER BY stat_date ASC");
            $dStmt->execute($adIds);
            $daily = $dStmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $ignore) {
        }
    }

    // Summary
    $totalViews = array_sum(array_column($ads, 'view_count'));
    $totalClicks = array_sum(array_column($ads, 'click_count'));
    $ctr = $totalViews > 0 ? round(($totalClicks / $totalViews) * 100, 2) : 0;
    $start = $campaign['start_date'] ?: $campaign['created_at'];
    $end = $campaign['end_date'] ?: date('Y-m-d');
    $days = max(1, (new DateTime($start))->diff(new DateTime($end))->days + 1);

    echo json_encode([
        'success' => true,
        'campaign' => [
            'name' => $campaign['name'],
            'advertiser' => $campaign['advertiser'],
            'budget' => $campaign['budget'],
            'start_date' => $campaign['start_date'],
            'end_date' => $campaign['end_date'],
            'status' => $campaign['status'],
        ],
        'ads' => array_map(function ($a) {
            return [
                'title' => $a['title'],
                'slot_id' => $a['slot_id'],
                'image_url' => $a['image_url'],
                'view_count' => $a['view_count'],
                'click_count' => $a['click_count'],
            ];
        }, $ads),
        'daily_stats' => $daily,
        'summary' => [
            'total_views' => $totalViews,
            'total_clicks' => $totalClicks,
            'ctr' => $ctr,
            'running_days' => $days,
            'avg_daily_views' => round($totalViews / $days, 1),
            'avg_daily_clicks' => round($totalClicks / $days, 1),
            'ad_count' => count($ads),
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>