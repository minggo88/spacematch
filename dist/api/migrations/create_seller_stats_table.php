<?php
header('Content-Type: text/html; charset=utf-8');
include_once '../db_connect.php';

echo "<h2>Seller Stats Table Migration</h2><pre>";

// 1. seller_stats
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        record_type VARCHAR(10) NOT NULL DEFAULT 'monthly' COMMENT 'daily, monthly, annual',
        record_date VARCHAR(10) NOT NULL COMMENT 'YYYY-MM-DD or YYYY-MM or YYYY',
        monthly_revenue INT DEFAULT 0 COMMENT '매출액 (원)',
        customer_count INT DEFAULT 0 COMMENT '방문 고객 수',
        transaction_count INT DEFAULT 0 COMMENT '거래 건수',
        avg_unit_price INT DEFAULT 0 COMMENT '평균 객단가 (원)',
        best_selling_item VARCHAR(200) DEFAULT NULL COMMENT '인기 상품 카테고리',
        venue_type VARCHAR(50) DEFAULT NULL COMMENT '활동 공간 유형',
        region VARCHAR(100) DEFAULT NULL COMMENT '활동 지역',
        satisfaction TINYINT DEFAULT NULL COMMENT '운영 만족도 (1~5)',
        memo TEXT DEFAULT NULL COMMENT '메모/비고',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type_date (record_type, record_date),
        UNIQUE KEY uq_user_type_date (user_id, record_type, record_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "[OK] seller_stats table created\n";
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "[ERROR] seller_stats: " . $e->getMessage() . "\n";
}

// 2. Add record_type column if table already exists without it (backward compat)
try {
    $cols = $conn->query("SHOW COLUMNS FROM seller_stats LIKE 'record_type'")->fetchAll();
    if (empty($cols)) {
        $conn->exec("ALTER TABLE seller_stats ADD COLUMN record_type VARCHAR(10) NOT NULL DEFAULT 'monthly' AFTER user_id");
        echo "[OK] record_type column added\n";
    } else {
        echo "[OK] record_type column already exists\n";
    }
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "[INFO] record_type check: " . $e->getMessage() . "\n";
}

// 3. Rename record_month to record_date if needed
try {
    $cols = $conn->query("SHOW COLUMNS FROM seller_stats LIKE 'record_month'")->fetchAll();
    if (!empty($cols)) {
        $conn->exec("ALTER TABLE seller_stats CHANGE COLUMN record_month record_date VARCHAR(10) NOT NULL COMMENT 'YYYY-MM-DD or YYYY-MM or YYYY'");
        echo "[OK] record_month renamed to record_date\n";
        // Update unique key
        try {
            $conn->exec("ALTER TABLE seller_stats DROP INDEX uq_user_month");
        } catch (PDOException $e) { /* index may not exist */
        }
        try {
            $conn->exec("ALTER TABLE seller_stats ADD UNIQUE KEY uq_user_type_date (user_id, record_type, record_date)");
            echo "[OK] Updated unique constraint\n";
        } catch (PDOException $e) {
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo "[INFO] Unique key: " . $e->getMessage() . "\n";
        }
    } else {
        echo "[OK] record_date column already exists\n";
    }
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "[INFO] record_date check: " . $e->getMessage() . "\n";
}

echo "\n--- DONE ---\n";

try {
    $count = $conn->query("SELECT COUNT(*) FROM seller_stats")->fetchColumn();
    echo "  seller_stats : $count rows\n";
} catch (PDOException $e) {
    echo "  seller_stats : NOT FOUND\n";
}
echo "</pre>";
?>