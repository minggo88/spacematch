<?php
/**
 * DB Migration: Add all missing columns to ads table
 * Safe to run multiple times — skips columns that already exist
 */
include_once '../db_connect.php';

$results = [];

$columns_to_add = [
    ['name' => 'mobile_image_url', 'definition' => 'VARCHAR(500) DEFAULT NULL AFTER image_url'],
    ['name' => 'target_countries', 'definition' => "VARCHAR(500) DEFAULT 'all' AFTER priority"],
    ['name' => 'campaign_id',     'definition' => 'INT DEFAULT NULL AFTER target_countries'],
    ['name' => 'view_count',      'definition' => 'INT DEFAULT 0'],
    ['name' => 'click_count',     'definition' => 'INT DEFAULT 0'],
];

try {
    foreach ($columns_to_add as $col) {
        $check = $conn->query("SHOW COLUMNS FROM ads LIKE '{$col['name']}'");
        if ($check->rowCount() > 0) {
            $results[] = "{$col['name']}: already exists (skipped)";
        } else {
            $conn->exec("ALTER TABLE ads ADD COLUMN {$col['name']} {$col['definition']}");
            $results[] = "{$col['name']}: added successfully ✓";
        }
    }

    // Also create ad_daily_stats table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_daily_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        stat_date DATE NOT NULL,
        views INT DEFAULT 0,
        clicks INT DEFAULT 0,
        UNIQUE KEY unique_ad_date (ad_id, stat_date)
    )");
    $results[] = "ad_daily_stats table: ready ✓";

    echo json_encode(['success' => true, 'results' => $results], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.', 'results' => $results]);
}
?>