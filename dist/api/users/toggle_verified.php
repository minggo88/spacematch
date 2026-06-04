<?php
/**
 * toggle_verified.php — Admin toggles verification badge for a user with optional period
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');

$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';
if (!isset($_SESSION['user_id']) || !in_array($role, ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => '관리자만 이용 가능합니다.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
$userId = intval($data->user_id ?? 0);
$verified = isset($data->is_verified) ? intval($data->is_verified) : 0;
$start_date = isset($data->start_date) && $data->start_date ? $data->start_date : null;
$end_date = isset($data->end_date) && $data->end_date ? $data->end_date : null;

if ($userId <= 0) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 사용자 ID입니다.']);
    exit;
}

try {
    // Auto-migrate: add columns if missing
    $cols_to_add = [
        'is_verified' => 'TINYINT(1) DEFAULT 0',
        'verified_start' => 'DATE DEFAULT NULL',
        'verified_end' => 'DATE DEFAULT NULL'
    ];
    foreach ($cols_to_add as $col => $def) {
        try {
            $conn->exec("ALTER TABLE users ADD COLUMN {$col} {$def}");
        } catch (PDOException $e) { /* Column already exists */
        }
    }

    if ($verified) {
        $stmt = $conn->prepare("UPDATE users SET is_verified = 1, verified_start = ?, verified_end = ? WHERE id = ?");
        $stmt->execute([$start_date, $end_date, $userId]);
        $msg = '인증 뱃지 부여';
        if ($start_date && $end_date) {
            $msg .= " ({$start_date} ~ {$end_date})";
        }
    } else {
        $stmt = $conn->prepare("UPDATE users SET is_verified = 0, verified_start = NULL, verified_end = NULL WHERE id = ?");
        $stmt->execute([$userId]);
        $msg = '인증 뱃지 해제';
    }

    // Fetch updated data
    $fetchStmt = $conn->prepare("SELECT is_verified, verified_start, verified_end FROM users WHERE id = ?");
    $fetchStmt->execute([$userId]);
    $updated = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => $msg . '되었습니다.',
        'is_verified' => intval($updated['is_verified']),
        'verified_start' => $updated['verified_start'],
        'verified_end' => $updated['verified_end']
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>