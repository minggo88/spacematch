<?php
/**
 * toggle_wishlist.php
 * 좋아요(찜) 토글 API — 서버사이드 저장
 * POST: { venue_id: int }
 * session 기반 user_id 사용
 */
include_once '../db_connect.php';
session_start();

// Auto-create wishlist table
$conn->exec("CREATE TABLE IF NOT EXISTS venue_wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    venue_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wish (user_id, venue_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["success" => false, "message" => "POST only"]);
        exit;
    }

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $venueId = intval($data['venue_id'] ?? 0);
    if ($venueId <= 0) {
        echo json_encode(["success" => false, "message" => "venue_id 필수"]);
        exit;
    }

    // Check if already wishlisted
    $check = $conn->prepare("SELECT id FROM venue_wishlist WHERE user_id = :uid AND venue_id = :vid");
    $check->execute([':uid' => $userId, ':vid' => $venueId]);

    if ($check->fetch()) {
        // Remove wishlist
        $del = $conn->prepare("DELETE FROM venue_wishlist WHERE user_id = :uid AND venue_id = :vid");
        $del->execute([':uid' => $userId, ':vid' => $venueId]);
        echo json_encode(["success" => true, "wishlisted" => false]);
    } else {
        // Add wishlist
        $ins = $conn->prepare("INSERT INTO venue_wishlist (user_id, venue_id) VALUES (:uid, :vid)");
        $ins->execute([':uid' => $userId, ':vid' => $venueId]);
        echo json_encode(["success" => true, "wishlisted" => true]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>