<?php
/**
 * 관리자 베뉴 등록: 담당 호스트 선택용 목록
 */
include_once '../db_connect.php';
include_once '../utils/session_role.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array('success' => false, 'message' => 'Unauthorized.'));
    exit;
}

$role = sm_sync_session_role($conn);
$roleNorm = sm_normalize_role($role);
if (!sm_is_admin_role($roleNorm)) {
    http_response_code(403);
    echo json_encode(array('success' => false, 'message' => 'Admin privileges required.'));
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, name, email, brand_name FROM users WHERE role IN ('host') ORDER BY name ASC");
    $stmt->execute();
    $hosts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(array('success' => true, 'hosts' => $hosts));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'DB Error'));
}
