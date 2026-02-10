<?php
include_once '../db_connect.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL, 
        message TEXT NOT NULL,
        link VARCHAR(255),
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $conn->exec($sql);
    echo "Table 'notifications' created or already exists successfully.";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>