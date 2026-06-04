<?php
/**
 * 카카오톡 알림톡 발송 플레이스홀더
 * 
 * ⚠️ 실제 연동을 위해서는 다음이 필요합니다:
 *   1. 카카오 비즈니스 채널 개설
 *   2. 알림톡 API 키 발급
 *   3. 메시지 템플릿 등록 및 승인
 * 
 * 사용법 (연동 완료 후):
 *   include_once __DIR__ . '/send_kakao.php';
 *   sendKakaoAlert('01012345678', 'TEMPLATE_001', ['name' => '홍길동', 'venue' => '강남점']);
 */

// 카카오 비즈 API 설정 (연동 시 실제 값 입력)
define('KAKAO_BIZ_API_KEY', '');     // 비즈메시지 API 키
define('KAKAO_SENDER_KEY', '');       // 발신 프로필 키
define('KAKAO_API_URL', 'https://api.bizppurio.com/v1');  // 알림톡 API 엔드포인트 (예시)

/**
 * 카카오톡 알림톡 발송
 * 
 * @param string $phoneNumber 수신자 전화번호 (010XXXXXXXX)
 * @param string $templateCode 승인된 템플릿 코드
 * @param array $variables 템플릿 변수 치환값
 * @return array ['success' => bool, 'message' => string]
 */
function sendKakaoAlert($phoneNumber, $templateCode, $variables = [])
{
    // ⚠️ 아직 연동되지 않음 — 로그만 남기고 리턴
    if (empty(KAKAO_BIZ_API_KEY) || empty(KAKAO_SENDER_KEY)) {
        error_log("[Kakao] 알림톡 미연동 — API 키 미설정. Phone: {$phoneNumber}, Template: {$templateCode}");
        return ['success' => false, 'message' => '카카오톡 알림톡이 아직 연동되지 않았습니다.'];
    }

    try {
        // TODO: 실제 API 호출 구현
        // 1. 전화번호 정규화 (하이픈 제거, 국가코드 추가)
        // 2. 템플릿 변수 치환
        // 3. HTTP POST 요청 전송
        // 4. 응답 처리

        $payload = [
            'senderKey' => KAKAO_SENDER_KEY,
            'templateCode' => $templateCode,
            'recipientNo' => preg_replace('/[^0-9]/', '', $phoneNumber),
            'variables' => $variables,
        ];

        // 예시 API 호출 (실제 연동 시 활성화)
        /*
        $ch = curl_init(KAKAO_API_URL . '/kakao/alimtalk/send');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . KAKAO_BIZ_API_KEY,
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true, 'message' => '알림톡 발송 완료'];
        } else {
            error_log("[Kakao] 알림톡 발송 실패 — HTTP {$httpCode}: {$response}");
            return ['success' => false, 'message' => '알림톡 발송 실패'];
        }
        */

        error_log("[Kakao] Placeholder — would send to {$phoneNumber} with template {$templateCode}");
        return ['success' => false, 'message' => '플레이스홀더 모드'];

    } catch (Exception $e) {
        error_log("[Kakao] Error: " . $e->getMessage());
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        return ['success' => false, 'message' => '서버 오류가 발생했습니다.'];
    }
}

/**
 * 유저 ID 기반 알림톡 발송 (DB에서 전화번호 조회)
 */
function sendKakaoAlertToUser($conn, $userId, $templateCode, $variables = [])
{
    try {
        $stmt = $conn->prepare("SELECT phone FROM users WHERE id = ? AND phone IS NOT NULL AND phone != ''");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || empty($user['phone'])) {
            return ['success' => false, 'message' => '전화번호 없음'];
        }

        return sendKakaoAlert($user['phone'], $templateCode, $variables);
    } catch (Exception $e) {
        error_log("[Kakao] User lookup error: " . $e->getMessage());
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        return ['success' => false, 'message' => '서버 오류가 발생했습니다.'];
    }
}

/**
 * 템플릿 코드 상수 (카카오 비즈 승인 후 실제 코드로 교체)
 */
class KakaoTemplates
{
    const APPLICATION_NEW = 'TPL_APP_NEW';          // 새 입점 신청 접수
    const APPLICATION_APPROVED = 'TPL_APP_APPROVED'; // 입점 승인
    const APPLICATION_REJECTED = 'TPL_APP_REJECTED'; // 입점 반려
    const NEW_VENUE_ALERT = 'TPL_VENUE_NEW';         // 새 공간 등록 알림
}
?>