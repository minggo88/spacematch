<?php
/**
 * remove_promotion.php
 * 관리자 전용: 프로모션 해제
 * POST: { promotion_id } 또는 { venue_id }
 */
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit;
}
$role = isset($_SESSION['user_role']) ? trim((string) $_SESSION['user_role']) : '';
try {
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $roleStmt->execute([$_SESSION['user_id']]);
    $rrow = $roleStmt->fetch(PDO::FETCH_ASSOC);
    if ($rrow && array_key_exists('role', $rrow) && $rrow['role'] !== null && $rrow['role'] !== '') {
        $role = trim((string) $rrow['role']);
        $_SESSION['user_role'] = $role;
    }
} catch (Exception $e) { /* keep session role */
}
$roleNorm = strtolower(str_replace('super_admin', 'superadmin', $role));
if (!in_array($roleNorm, ['admin', 'superadmin'], true)) {
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
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>