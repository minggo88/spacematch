<?php
/**
 * Migration: Add preferred_locale column to users table
 */
require_once __DIR__ . '/../db_connect.php';

try {
    // Check if column already exists
    $check = $pdo->query("SHOW COLUMNS FROM users LIKE 'preferred_locale'");
    if ($check->rowCount() === 0) {
        $pdo->exec("ALTER TABLE users ADD COLUMN preferred_locale VARCHAR(5) DEFAULT 'ko' AFTER profile_image");
        echo json_encode(['success' => true, 'message' => 'Added preferred_locale column']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Column already exists']);
    }
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}