<?php
include_once '../db_connect.php';

// Array of columns to add
$columns_to_add = [
    "category" => "VARCHAR(50) DEFAULT NULL",
    "instagram" => "VARCHAR(100) DEFAULT NULL",
    "description" => "TEXT DEFAULT NULL"
];

foreach ($columns_to_add as $column => $definition) {
    try {
        // Check if column exists
        $check = $conn->query("SHOW COLUMNS FROM users LIKE '$column'");

        if ($check->rowCount() == 0) {
            // Add column if it doesn't exist
            $sql = "ALTER TABLE users ADD COLUMN $column $definition";
            $conn->exec($sql);
            echo "Added column '$column' successfully.<br>";
        } else {
            echo "Column '$column' already exists.<br>";
        }
    } catch (PDOException $e) {
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo "Error adding column '$column': " . $e->getMessage() . "<br>";
    }
}

echo "Migration completed.";
?>