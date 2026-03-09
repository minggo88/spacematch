<?php
/**
 * 이메일 인증 테스트 스크립트 — 테스트 완료 후 반드시 삭제하세요!
 */
header('Content-Type: application/json; charset=utf-8');
ob_start();

include_once '../notifications/send_email.php';
include_once '../notifications/email_templates.php';

$testEmail = 'thomaspaik91@gmail.com';
$testCode = '482719'; // 테스트용 고정 코드

$subject = '[SpaceMatch] 이메일 인증 코드 (테스트)';
$html = emailTemplateVerificationCode($testCode, 'ko');

$sent = _emailSend($testEmail, '', $subject, $html);

ob_end_clean();

if ($sent) {
    echo json_encode([
        "success" => true,
        "message" => "테스트 인증 이메일이 {$testEmail}로 발송되었습니다.",
        "code" => $testCode
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "message" => "이메일 발송 실패"
    ], JSON_UNESCAPED_UNICODE);
}
?>