<?php
/**
 * diag_subscription.php — 구독 상태 진단 (로그인한 사용자 본인 데이터만 반환)
 *
 * 사용법: https://spacematch.net/api/payments/diag_subscription.php
 * (로그인 상태에서 브라우저로 접근하거나 DevTools Network 탭에서 확인)
 *
 * 확인 후 이 파일은 삭제할 것
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Login required']);
    exit;
}

$userId = intval($_SESSION['user_id']);

try {
    // 1. 사용자 기본 정보
    $userStmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    // 2. 이 사용자의 모든 결제 내역 (상태 무관)
    $payStmt = $conn->prepare("
        SELECT
            p.id, p.status, p.confirmed_at, p.created_at,
            pp.name  AS plan_name,
            pp.category,
            pp.period,
            pp.target_role
        FROM payments p
        JOIN payment_plans pp ON p.plan_id = pp.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    ");
    $payStmt->execute([$userId]);
    $payments = $payStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. confirmed 상태 결제만 필터링 + 만료 여부 계산
    $active = [];
    foreach ($payments as $p) {
        if ($p['status'] !== 'confirmed') continue;
        $confirmedAt = strtotime($p['confirmed_at']);
        $now = time();
        switch ($p['period']) {
            case 'yearly': $exp = strtotime('+365 days', $confirmedAt); break;
            case 'once':   $exp = strtotime('+100 years', $confirmedAt); break;
            default:       $exp = strtotime('+30 days', $confirmedAt);
        }
        $isActive = $now <= $exp;
        $active[] = [
            'payment_id'  => $p['id'],
            'plan_name'   => $p['plan_name'],
            'category'    => $p['category'],
            'period'      => $p['period'],
            'target_role' => $p['target_role'],
            'confirmed_at'=> $p['confirmed_at'],
            'expires_at'  => date('Y-m-d H:i:s', $exp),
            'is_active'   => $isActive,
        ];
    }

    // 4. priority_viewing 체크 시뮬레이션
    $hasViewingSub = false;
    foreach ($active as $a) {
        if ($a['is_active'] && ($a['category'] === 'priority_viewing' || $a['category'] === '프리미엄 서비스')) {
            $hasViewingSub = true;
            break;
        }
    }

    echo json_encode([
        'user'              => $user,
        'all_payments'      => $payments,
        'active_subs'       => $active,
        'has_viewing_sub'   => $hasViewingSub,
        'check_sub_url_test'=> "/api/payments/check_subscription.php?category=priority_viewing",
        'note'              => '이 파일은 진단 후 삭제하세요',
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['error' => '서버 오류가 발생했습니다.']);
}
?>