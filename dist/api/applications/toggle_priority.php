<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

$role = $_SESSION['user_role'] ?? '';
if (!in_array($role, ['admin', 'superadmin'])) {
    echo json_encode(['success' => false, 'message' => '관리자 권한이 필요합니다.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$application_id = intval($data['application_id'] ?? 0);
$is_priority = intval($data['is_priority'] ?? 0);

if (!$application_id) {
    echo json_encode(['success' => false, 'message' => '신청 ID가 필요합니다.']);
    exit;
}

try {
    // Auto-migrate: ensure is_priority column exists
    try {
        $conn->exec("ALTER TABLE applications ADD COLUMN is_priority TINYINT(1) DEFAULT 0");
    } catch (Exception $e) { /* column likely exists */
    }

    $stmt = $conn->prepare("UPDATE applications SET is_priority = ? WHERE id = ?");
    $stmt->execute([$is_priority ? 1 : 0, $application_id]);

    echo json_encode([
        'success' => true,
        'message' => $is_priority ? '패스트트랙이 설정되었습니다.' : '패스트트랙이 해제되었습니다.',
        'is_priority' => $is_priority ? 1 : 0
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>