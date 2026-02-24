<?php
include_once '../db_connect.php';

// ─── ads table ───
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slot_id VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        click_url VARCHAR(500) DEFAULT NULL,
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        priority INT DEFAULT 0,
        impressions INT DEFAULT 0,
        clicks INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ads_slot (slot_id, is_active, start_date, end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "✅ ads table created/verified.<br>";
} catch (PDOException $e) {
    echo "❌ ads table error: " . $e->getMessage() . "<br>";
}

// ─── adsense_config table ───
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS adsense_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id VARCHAR(100) DEFAULT NULL,
        slot_configs JSON DEFAULT NULL,
        is_enabled TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "✅ adsense_config table created/verified.<br>";

    // Insert default row if empty
    $check = $conn->query("SELECT COUNT(*) FROM adsense_config");
    if ($check->fetchColumn() == 0) {
        $conn->exec("INSERT INTO adsense_config (client_id, slot_configs, is_enabled) VALUES ('', '{}', 0)");
        echo "✅ Default adsense_config row inserted.<br>";
    }
} catch (PDOException $e) {
    echo "❌ adsense_config table error: " . $e->getMessage() . "<br>";
}

echo "<br>Migration completed.";
?>