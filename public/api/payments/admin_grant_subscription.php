<?php
/**
 * admin_grant_subscription.php
 *
 * 관리자가 특정 사용자에게 구독 플랜을 직접 부여하거나 취소합니다.
 * superadmin 전용.
 *
 * POST { action: 'grant', email, plan_id, note }
 *   → 해당 이메일 사용자에게 confirmed 상태 payment 레코드 생성
 *
 * POST { action: 'revoke', payment_id, note }
 *   → 해당 payment를 rejected로 변경 (구독 취소)
 */
include_once '../db_connect.php';
session_start();

$userRole = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
if (!isset($_SESSION['user_id']) || !in_array($userRole, ['superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => '슈퍼어드민 권한이 필요합니다.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

try {
    // ─── Grant ───────────────────────────────────────────────────────
    if ($action === 'grant') {
        $email  = trim($input['email']   ?? '');
        $planId = intval($input['plan_id'] ?? 0);
        $note   = trim($input['note']    ?? '') ?: '관리자 직접 구독 부여';

        if (!$email || !$planId) {
            echo json_encode(['success' => false, 'message' => '이메일과 플랜을 입력해주세요.']);
            exit;
        }

        // 사용자 조회
        $uStmt = $conn->prepare("SELECT id, name, role FROM users WHERE email = ?");
        $uStmt->execute([$email]);
        $targetUser = $uStmt->fetch();
        if (!$targetUser) {
            echo json_encode(['success' => false, 'message' => "사용자를 찾을 수 없습니다: {$email}"]);
            exit;
        }

        // 플랜 조회
        $pStmt = $conn->prepare("SELECT * FROM payment_plans WHERE id = ? AND is_active = 1");
        $pStmt->execute([$planId]);
        $plan = $pStmt->fetch();
        if (!$plan) {
            echo json_encode(['success' => false, 'message' => '플랜을 찾을 수 없습니다.']);
            exit;
        }

        // confirmed 결제 레코드 생성
        $iStmt = $conn->prepare("
            INSERT INTO payments
                (user_id, user_name, user_role, payment_type, plan_id, amount, reference_label, status, admin_note, confirmed_at)
            VALUES
                (?, ?, ?, 'subscription', ?, ?, ?, 'confirmed', ?, NOW())
        ");
        $iStmt->execute([
            $targetUser['id'],
            $targetUser['name'],
            $targetUser['role'],
            $planId,
            $plan['amount'],
            $plan['name'],
            $note,
        ]);
        $newPaymentId = $conn->lastInsertId();

        // 이력 기록
        $hist = $conn->prepare("INSERT INTO payment_history (payment_id, old_status, new_status, changed_by, note) VALUES (?, NULL, 'confirmed', ?, ?)");
        $hist->execute([$newPaymentId, $_SESSION['user_id'], '관리자 직접 구독 부여: ' . $note]);

        // 사용자 알림
        $nStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, 'payment_result', ?, ?)");
        $nStmt->execute([
            $targetUser['id'],
            "{$plan['name']} 구독이 활성화되었습니다.",
            "/{$targetUser['role']}/payments"
        ]);

        echo json_encode([
            'success'    => true,
            'message'    => "{$targetUser['name']}({$email})에게 [{$plan['name']}] 구독이 부여되었습니다.",
            'payment_id' => $newPaymentId,
            'user'       => ['id' => $targetUser['id'], 'name' => $targetUser['name'], 'role' => $targetUser['role']],
            'plan'       => ['id' => $plan['id'], 'name' => $plan['name'], 'category' => $plan['category']],
        ]);

    // ─── Revoke ──────────────────────────────────────────────────────
    } elseif ($action === 'revoke') {
        $paymentId = intval($input['payment_id'] ?? 0);
        $note      = trim($input['note'] ?? '') ?: '관리자 구독 취소';

        if (!$paymentId) {
            echo json_encode(['success' => false, 'message' => 'payment_id가 필요합니다.']);
            exit;
        }

        $cStmt = $conn->prepare("SELECT * FROM payments WHERE id = ?");
        $cStmt->execute([$paymentId]);
        $payment = $cStmt->fetch();
        if (!$payment) {
            echo json_encode(['success' => false, 'message' => '결제 건을 찾을 수 없습니다.']);
            exit;
        }

        $conn->prepare("UPDATE payments SET status = 'rejected', admin_note = ? WHERE id = ?")
             ->execute([$note, $paymentId]);

        $hist = $conn->prepare("INSERT INTO payment_history (payment_id, old_status, new_status, changed_by, note) VALUES (?, ?, 'rejected', ?, ?)");
        $hist->execute([$paymentId, $payment['status'], $_SESSION['user_id'], '관리자 구독 취소: ' . $note]);

        echo json_encode(['success' => true, 'message' => '구독이 취소되었습니다.']);

    } else {
        echo json_encode(['success' => false, 'message' => '알 수 없는 action입니다.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>