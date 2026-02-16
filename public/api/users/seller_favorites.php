<?php
/**
 * Seller Favorites API
 * 
 * GET: Returns list of favorited seller IDs for current vendor
 * POST: Toggle favorite (add/remove) for a seller
 *   Body: { seller_id: int }
 */
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Ensure table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vendor_id INT NOT NULL,
        seller_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_vendor_seller (vendor_id, seller_id),
        INDEX idx_vendor (vendor_id)
    )");
} catch (PDOException $e) { /* table exists */
}

// GET: List favorite seller IDs
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT seller_id FROM seller_favorites WHERE vendor_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "success" => true,
            "favorite_ids" => array_map('intval', $ids)
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

// POST: Toggle favorite
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $seller_id = intval($input['seller_id'] ?? 0);

    if ($seller_id <= 0) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 셀러 ID입니다."]);
        exit;
    }

    try {
        // Check if already favorited
        $checkStmt = $conn->prepare("SELECT id FROM seller_favorites WHERE vendor_id = ? AND seller_id = ?");
        $checkStmt->execute([$user_id, $seller_id]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            // Remove favorite
            $delStmt = $conn->prepare("DELETE FROM seller_favorites WHERE vendor_id = ? AND seller_id = ?");
            $delStmt->execute([$user_id, $seller_id]);
            echo json_encode([
                "success" => true,
                "action" => "removed",
                "is_favorite" => false
            ], JSON_UNESCAPED_UNICODE);
        } else {
            // Add favorite
            $insStmt = $conn->prepare("INSERT INTO seller_favorites (vendor_id, seller_id) VALUES (?, ?)");
            $insStmt->execute([$user_id, $seller_id]);
            echo json_encode([
                "success" => true,
                "action" => "added",
                "is_favorite" => true
            ], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>