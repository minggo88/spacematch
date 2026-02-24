<?php
include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$payment_id = intval($input['payment_id'] ?? 0);
$depositor_name = trim($input['depositor_name'] ?? '');

if (!$payment_id || !$depositor_name) {
    echo json_encode(['success' => false, 'message' => '결제 ID와 입금자명을 입력해주세요.']);
    exit;
}

try {
    // Verify ownership
    $check = $conn->prepare("SELECT id, status FROM payments WHERE id = ? AND user_id = ?");
    $check->execute([$payment_id, $_SESSION['user_id']]);
    $payment = $check->fetch();

    if (!$payment) {
        echo json_encode(['success' => false, 'message' => '결제 건을 찾을 수 없습니다.']);
        exit;
    }

    if ($payment['status'] !== 'pending') {
        echo json_encode(['success' => false, 'message' => '이미 처리된 결제입니다.']);
        exit;
    }

    // Update status to submitted
    $stmt = $conn->prepare("UPDATE payments SET status = 'submitted', depositor_name = ?, submitted_at = NOW() WHERE id = ?");
    $stmt->execute([$depositor_name, $payment_id]);

    // Log history
    $hist = $conn->prepare("INSERT INTO payment_history (payment_id, old_status, new_status, changed_by, note) VALUES (?, 'pending', 'submitted', ?, ?)");
    $hist->execute([$payment_id, $_SESSION['user_id'], "입금 완료 신고 — 입금자: $depositor_name"]);

    // Notify super admins
    $admins = $conn->query("SELECT id FROM users WHERE role = 'superadmin'");
    $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, 'payment_submitted', ?, '/admin/payments')");
    $userName = $_SESSION['name'] ?? '사용자';
    while ($admin = $admins->fetch()) {
        $notifStmt->execute([$admin['id'], "{$userName}님이 입금 완료를 신고했습니다. 확인해주세요."]);

        // [EMAIL] 입금 신고 이메일 알림 (다국어)
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_un = $userName;
            sendEmailToUser(
                $conn,
                $admin['id'],
                '',
                '',
                'cat_payment',
                function ($lang) use ($_un, $siteUrl) {
                    $subj = _t(['ko' => '새 입금 신고가 접수되었습니다', 'en' => 'New Payment Submitted', 'ja' => '新規入金申告', 'vi' => 'Thanh toán mới đã nộp', 'th' => 'ส่งการชำระเงินใหม่แล้ว'], $lang);
                    return ['subject' => $subj, 'html' => emailTemplatePayment('submitted', "{$_un}", $siteUrl, '/admin/payments', $lang)];
                }
            );
        } catch (Exception $emailErr) {
            error_log("Email error (payment_submitted): " . $emailErr->getMessage());
        }
    }

    echo json_encode(['success' => true, 'message' => '입금 완료가 신고되었습니다. 관리자 확인 후 처리됩니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '처리에 실패했습니다.']);
}
?>