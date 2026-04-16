<?php
header('Content-Type: text/html; charset=utf-8');
include_once '../db_connect.php';

echo "<h2>Payment Tables Migration</h2><pre>";

// 1. payment_settings
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS payment_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        is_payment_enabled TINYINT(1) DEFAULT 0,
        bank_name VARCHAR(100) DEFAULT NULL,
        account_number VARCHAR(100) DEFAULT NULL,
        account_holder VARCHAR(100) DEFAULT NULL,
        payment_notice TEXT DEFAULT NULL,
        platform_fee_amount INT DEFAULT 0,
        platform_fee_period VARCHAR(20) DEFAULT 'monthly',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "[OK] payment_settings table\n";

    $check = $conn->query("SELECT COUNT(*) FROM payment_settings");
    if ($check->fetchColumn() == 0) {
        $conn->exec("INSERT INTO payment_settings (is_payment_enabled) VALUES (0)");
        echo "[OK] Default row inserted\n";
    } else {
        echo "[OK] Default row already exists\n";
    }
} catch (PDOException $e) {
    echo "[ERROR] payment_settings: " . $e->getMessage() . "\n";
}

// 2. payments
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        user_name VARCHAR(100) DEFAULT NULL,
        user_role VARCHAR(20) DEFAULT NULL,
        payment_type VARCHAR(50) NOT NULL DEFAULT 'platform_fee',
        amount INT NOT NULL DEFAULT 0,
        depositor_name VARCHAR(100) DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        reference_id INT DEFAULT NULL,
        reference_label VARCHAR(200) DEFAULT NULL,
        admin_note TEXT DEFAULT NULL,
        submitted_at TIMESTAMP NULL DEFAULT NULL,
        confirmed_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_status (status),
        INDEX idx_type (payment_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "[OK] payments table\n";
} catch (PDOException $e) {
    echo "[ERROR] payments: " . $e->getMessage() . "\n";
}

// 3. payment_history
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS payment_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_id INT NOT NULL,
        old_status VARCHAR(20) DEFAULT NULL,
        new_status VARCHAR(20) NOT NULL,
        changed_by INT DEFAULT NULL,
        note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_payment (payment_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "[OK] payment_history table\n";
} catch (PDOException $e) {
    echo "[ERROR] payment_history: " . $e->getMessage() . "\n";
}

// 4. payment_plans
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS payment_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT DEFAULT NULL,
        amount INT NOT NULL DEFAULT 0,
        period VARCHAR(20) DEFAULT 'monthly',
        features JSON DEFAULT NULL,
        target_role VARCHAR(20) DEFAULT 'all',
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active, target_role, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "[OK] payment_plans table\n";
} catch (PDOException $e) {
    echo "[ERROR] payment_plans: " . $e->getMessage() . "\n";
}

// 5. Add plan_id to payments
try {
    $cols = $conn->query("SHOW COLUMNS FROM payments LIKE 'plan_id'")->fetchAll();
    if (empty($cols)) {
        $conn->exec("ALTER TABLE payments ADD COLUMN plan_id INT DEFAULT NULL AFTER payment_type");
        echo "[OK] plan_id column added\n";
    } else {
        echo "[OK] plan_id column already exists\n";
    }
} catch (PDOException $e) {
    echo "[ERROR] plan_id: " . $e->getMessage() . "\n";
}

echo "\n--- DONE ---\n";

// Show final table status
echo "\nTable Status:\n";
$tables = ['payment_settings', 'payments', 'payment_history', 'payment_plans'];
foreach ($tables as $t) {
    try {
        $count = $conn->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        echo "  $t : $count rows\n";
    } catch (PDOException $e) {
        echo "  $t : NOT FOUND\n";
    }
}
echo "</pre>";
?>