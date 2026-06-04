<?php
/**
 * 어드민 데모 계정 업그레이드 마이그레이션
 * demo-admin@spacematch.net의 role을 admin으로, is_demo를 1로 변경
 * 1회 실행 후 반드시 삭제하세요!
 */
include_once '../../db_connect.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    $email = 'demo-admin@spacematch.net';

    // 계정 존재 확인
    $check = $conn->prepare("SELECT id, role, is_demo FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => '계정이 존재하지 않습니다: ' . $email], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $user = $check->fetch(PDO::FETCH_ASSOC);

    // role을 admin으로, is_demo를 1로 업데이트
    $update = $conn->prepare("UPDATE users SET role = 'admin', is_demo = 1, description = '이 계정은 데모 전용입니다. 관리자 기능 체험만 가능합니다.', brand_name = 'SpaceMatch Admin' WHERE email = ?");
    $update->execute([$email]);

    echo json_encode([
        'success' => true,
        'message' => '어드민 데모 계정 업그레이드 완료!',
        'before' => ['role' => $user['role'], 'is_demo' => $user['is_demo']],
        'after' => ['role' => 'admin', 'is_demo' => 1],
        'email' => $email
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        'message' => '서버 오류가 발생했습니다.'
    ], JSON_UNESCAPED_UNICODE);
}
?>