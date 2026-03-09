<?php
/**
 * DB Migration: Add mobile_image_url column to ads table
 * Run this on the production database server
 * 
 * Usage: Execute this SQL directly on MySQL or run this PHP file on the server
 */
include_once '../db_connect.php';

try {
    // Check if column already exists
    $check = $conn->query("SHOW COLUMNS FROM ads LIKE 'mobile_image_url'");
    if ($check->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'mobile_image_url column already exists.']);
        exit();
    }

    $conn->exec("ALTER TABLE ads ADD COLUMN mobile_image_url VARCHAR(500) DEFAULT NULL AFTER image_url");
    echo json_encode(['success' => true, 'message' => 'mobile_image_url column added successfully.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>