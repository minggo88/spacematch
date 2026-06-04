<?php
include_once '../db_connect.php';

try {
    // Check if 'commission_rate' column exists
    $stmt = $conn->query("SHOW COLUMNS FROM venues LIKE 'commission_rate'");
    $exists = $stmt->fetch();

    if (!$exists) {
        $sql = "ALTER TABLE venues ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0 AFTER price";
        $conn->exec($sql);
        echo "Column 'commission_rate' added successfully to 'venues' table.<br>";
    } else {
        echo "Column 'commission_rate' already exists in 'venues' table.<br>";
    }

} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "Error: " . $e->getMessage();
}
?>