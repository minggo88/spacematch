<?php
/**
 * remove_promotion.php
 * 관리자 전용: 프로모션 해제
 * POST: { promotion_id } 또는 { venue_id }
 */
include_once '../db_connect.php';
session_start();

// Admin only
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin privileges required.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$promotion_id = intval($data['promotion_id'] ?? 0);
$venue_id = intval($data['venue_id'] ?? 0);

if (!$promotion_id && !$venue_id) {
    echo json_encode(['success' => false, 'message' => 'promotion_id or venue_id is required.']);
    exit;
}

try {
    if ($promotion_id) {
        $stmt = $conn->prepare("DELETE FROM venue_promotions WHERE id = ?");
        $stmt->execute([$promotion_id]);
    } else {
        $stmt = $conn->prepare("DELETE FROM venue_promotions WHERE venue_id = ?");
        $stmt->execute([$venue_id]);
    }

    $deleted = $stmt->rowCount();
    if ($deleted > 0) {
        echo json_encode(['success' => true, 'message' => '프로모션이 해제되었습니다.']);
    } else {
        echo json_encode(['success' => true, 'message' => '삭제할 프로모션이 없습니다.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>