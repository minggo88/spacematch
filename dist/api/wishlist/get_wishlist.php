<?php
/**
 * get_wishlist.php
 * 현재 로그인한 사용자의 찜 목록 반환
 */
include_once '../db_connect.php';
session_start();

// Auto-create table
$conn->exec("CREATE TABLE IF NOT EXISTS venue_wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    venue_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wish (user_id, venue_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

try {
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo json_encode([]);
        exit;
    }

    $stmt = $conn->prepare("SELECT venue_id FROM venue_wishlist WHERE user_id = :uid");
    $stmt->execute([':uid' => $userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($rows ?: []);
} catch (Exception $e) {
    echo json_encode([]);
}
?>