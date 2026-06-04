<?php
include_once '../db_connect.php';

try {
    // Check if 'size' column exists
    $stmt = $conn->query("SHOW COLUMNS FROM venues LIKE 'size'");
    $exists = $stmt->fetch();

    if (!$exists) {
        $sql = "ALTER TABLE venues ADD COLUMN size VARCHAR(20) DEFAULT 'medium' AFTER type";
        $conn->exec($sql);
        echo "Column 'size' added successfully to 'venues' table.<br>";
    } else {
        echo "Column 'size' already exists in 'venues' table.<br>";
    }

} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "Error: " . $e->getMessage();
}
?>