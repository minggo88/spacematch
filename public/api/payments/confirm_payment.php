<?php
include_once '../db_connect.php';
session_start();

$userRole = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
if (!isset($_SESSION['user_id']) || $userRole !== 'superadmin') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => '권한이 없습니다.',
        'debug_role' => $userRole,
        'debug_session_keys' => array_keys($_SESSION)
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$payment_id = intval($input['payment_id'] ?? 0);
$action = $input['action'] ?? ''; // 'confirm' or 'reject'
$admin_note = trim($input['admin_note'] ?? '');

if (!$payment_id || !in_array($action, ['confirm', 'reject'])) {
    echo json_encode(['success' => false, 'message' => '올바른 요청이 아닙니다.']);
    exit;
}

try {
    $check = $conn->prepare("SELECT * FROM payments WHERE id = ?");
    $check->execute([$payment_id]);
    $payment = $check->fetch();

    if (!$payment) {
        echo json_encode(['success' => false, 'message' => '결제 건을 찾을 수 없습니다.']);
        exit;
    }

    $oldStatus = $payment['status'];
    $newStatus = $action === 'confirm' ? 'confirmed' : 'rejected';

    $stmt = $conn->prepare("UPDATE payments SET status = ?, admin_note = ?, confirmed_at = NOW() WHERE id = ?");
    $stmt->execute([$newStatus, $admin_note, $payment_id]);

    // Log history
    $hist = $conn->prepare("INSERT INTO payment_history (payment_id, old_status, new_status, changed_by, note) VALUES (?, ?, ?, ?, ?)");
    $hist->execute([$payment_id, $oldStatus, $newStatus, $_SESSION['user_id'], $admin_note ?: ($action === 'confirm' ? '입금 확인 완료' : '입금 거절')]);

    // Notify user
    $actionLabel = $action === 'confirm' ? '확인' : '거절';
    $notifMsg = "결제가 {$actionLabel}되었습니다." . ($admin_note ? " — $admin_note" : '');
    $userRole = $payment['user_role'] ?? 'seller';
    $link = "/{$userRole}/payments";
    $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, 'payment_result', ?, ?)");
    $notifStmt->execute([$payment['user_id'], $notifMsg, $link]);

    echo json_encode(['success' => true, 'message' => "결제가 {$actionLabel}되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '처리에 실패했습니다.']);
}
?>