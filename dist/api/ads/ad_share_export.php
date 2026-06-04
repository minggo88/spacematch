<?php
// Ad Share Report — Excel Export (CSV with BOM for Korean Excel compatibility)
include_once '../db_connect.php';

$token = $_GET['token'] ?? '';
if (empty($token)) {
    http_response_code(400);
    echo 'Token is required';
    exit;
}

try {
    // Auto-create if not exists
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
    $stmt = $conn->prepare("SELECT ad_id, expires_at FROM ad_share_tokens WHERE token = :token");
    $stmt->execute([':token' => $token]);
    $tokenRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tokenRow) {
        http_response_code(404);
        echo 'Invalid token';
        exit;
    }

    if ($tokenRow['expires_at'] && strtotime($tokenRow['expires_at']) < time()) {
        http_response_code(410);
        echo 'Token expired';
        exit;
    }

    $ad_id = intval($tokenRow['ad_id']);

    // Fetch ad info
    $adStmt = $conn->prepare("SELECT * FROM ads WHERE id = :id");
    $adStmt->execute([':id' => $ad_id]);
    $ad = $adStmt->fetch(PDO::FETCH_ASSOC);

    if (!$ad) {
        http_response_code(404);
        echo 'Ad not found';
        exit;
    }

    // Fetch daily stats
    $daily = [];
    try {
        $dailyStmt = $conn->prepare("SELECT stat_date, views, clicks FROM ad_daily_stats WHERE ad_id = :id ORDER BY stat_date ASC");
        $dailyStmt->execute([':id' => $ad_id]);
        $daily = $dailyStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $ignore) {
        $daily = [];
    }

    // Calculate summary
    $totalViews = intval($ad['view_count'] ?? 0);
    $totalClicks = intval($ad['click_count'] ?? 0);
    $ctr = $totalViews > 0 ? round(($totalClicks / $totalViews) * 100, 2) : 0;

    // Set CSV headers
    $filename = 'ad_report_' . preg_replace('/[^a-zA-Z0-9_\x{AC00}-\x{D7AF}]/u', '_', $ad['title']) . '_' . date('Ymd') . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $output = fopen('php://output', 'w');

    // BOM for Korean Excel compatibility
    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

    // Ad Summary Section
    fputcsv($output, ['광고 성과 리포트']);
    fputcsv($output, []);
    fputcsv($output, ['광고 제목', $ad['title']]);
    fputcsv($output, ['슬롯', $ad['slot_id']]);
    fputcsv($output, ['시작일', $ad['start_date'] ?? '-']);
    fputcsv($output, ['종료일', $ad['end_date'] ?? '-']);
    fputcsv($output, ['상태', $ad['is_active'] == 1 ? '활성' : '비활성']);
    fputcsv($output, []);
    fputcsv($output, ['총 노출수', $totalViews]);
    fputcsv($output, ['총 클릭수', $totalClicks]);
    fputcsv($output, ['CTR (%)', $ctr]);
    fputcsv($output, []);

    // Daily stats table
    if (!empty($daily)) {
        fputcsv($output, ['일별 통계']);
        fputcsv($output, ['날짜', '노출수', '클릭수', 'CTR (%)']);
        foreach ($daily as $d) {
            $dViews = intval($d['views']);
            $dClicks = intval($d['clicks']);
            $dCtr = $dViews > 0 ? round(($dClicks / $dViews) * 100, 2) : 0;
            fputcsv($output, [$d['stat_date'], $dViews, $dClicks, $dCtr]);
        }
    }

    fclose($output);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo 'Error: ' . $e->getMessage();
}
?>