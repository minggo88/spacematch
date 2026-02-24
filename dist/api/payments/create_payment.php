<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$payment_type = $input['payment_type'] ?? 'platform_fee';
$amount = intval($input['amount'] ?? 0);
$plan_id = isset($input['plan_id']) ? intval($input['plan_id']) : null;
$reference_id = $input['reference_id'] ?? null;
$reference_label = $input['reference_label'] ?? null;

if ($amount <= 0) {
    echo json_encode(['success' => false, 'message' => '결제 금액이 올바르지 않습니다.']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO payments (user_id, user_name, user_role, payment_type, plan_id, amount, reference_id, reference_label, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
    $stmt->execute([
        $_SESSION['user_id'],
        $_SESSION['name'] ?? '',
        $_SESSION['user_role'] ?? ($_SESSION['role'] ?? ''),
        $payment_type,
        $plan_id,
        $amount,
        $reference_id,
        $reference_label
    ]);

    $paymentId = $conn->lastInsertId();

    // Log history
    $hist = $conn->prepare("INSERT INTO payment_history (payment_id, old_status, new_status, changed_by, note) VALUES (?, NULL, 'pending', ?, '결제 건 생성')");
    $hist->execute([$paymentId, $_SESSION['user_id']]);

    echo json_encode(['success' => true, 'message' => '결제 건이 생성되었습니다.', 'payment_id' => $paymentId]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '결제 생성에 실패했습니다.']);
}
?>