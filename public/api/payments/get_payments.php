<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

try {
    $role = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
    $userId = $_SESSION['user_id'];

    // Superadmin/admin sees all, others see only their own
    if ($role === 'superadmin' || $role === 'admin') {
        $stmt = $conn->query("SELECT * FROM payments ORDER BY created_at DESC");
    } else {
        $stmt = $conn->prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
    }

    $payments = $stmt->fetchAll();

    echo json_encode(['success' => true, 'payments' => $payments]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '결제 내역 조회에 실패했습니다.']);
}
?>