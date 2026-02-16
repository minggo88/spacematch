<?php
// Migration: Create ad analytics tables
include_once '../db_connect.php';
header('Content-Type: text/html; charset=utf-8');

echo "<h2>📊 광고 분석 테이블 마이그레이션</h2><hr>";

// 1. ad_daily_stats
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_daily_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        stat_date DATE NOT NULL,
        views INT DEFAULT 0,
        clicks INT DEFAULT 0,
        UNIQUE KEY unique_ad_date (ad_id, stat_date),
        INDEX idx_ad (ad_id),
        INDEX idx_date (stat_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "✅ <b>ad_daily_stats</b> — OK<br>";
} catch (PDOException $e) {
    echo "❌ <b>ad_daily_stats</b> — " . $e->getMessage() . "<br>";
}

// 2. ad_share_tokens
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_share_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_ad (ad_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "✅ <b>ad_share_tokens</b> — OK<br>";
} catch (PDOException $e) {
    echo "❌ <b>ad_share_tokens</b> — " . $e->getMessage() . "<br>";
}

// 3. Backfill: seed daily stats from existing ads (spread cumulative counts as single-day entry for created_at date)
try {
    $existing = $conn->query("SELECT id, view_count, click_count, DATE(created_at) as d FROM ads WHERE view_count > 0 OR click_count > 0");
    $backfilled = 0;
    $stmt = $conn->prepare("INSERT IGNORE INTO ad_daily_stats (ad_id, stat_date, views, clicks) VALUES (:ad_id, :stat_date, :views, :clicks)");
    while ($row = $existing->fetch(PDO::FETCH_ASSOC)) {
        $stmt->execute([
            ':ad_id' => $row['id'],
            ':stat_date' => $row['d'],
            ':views' => $row['view_count'],
            ':clicks' => $row['click_count']
        ]);
        $backfilled++;
    }
    echo "✅ 기존 광고 $backfilled 건 백필 완료<br>";
} catch (PDOException $e) {
    echo "⚠️ 백필 스킵: " . $e->getMessage() . "<br>";
}

echo "<hr><p style='color:green;font-weight:bold'>✅ 마이그레이션 완료!</p>";
?>