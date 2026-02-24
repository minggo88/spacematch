<?php
/**
 * Push 구독 저장/삭제 API
 * POST: 새 구독 저장 또는 업데이트
 * DELETE: 구독 삭제
 * GET: VAPID 공개키 반환 (인증 불필요)
 */
include_once '../db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET 요청은 인증 없이 VAPID 공개키 반환 가능
if ($method === 'GET') {
    try {
        // 테이블 존재 여부 먼저 체크
        $tableCheck = $conn->query("SHOW TABLES LIKE 'push_settings'");
        if ($tableCheck->rowCount() === 0) {
            echo json_encode(['success' => false, 'message' => 'VAPID 키가 아직 설정되지 않았습니다. 마이그레이션을 먼저 실행하세요.']);
            exit();
        }

        $stmt = $conn->prepare("SELECT setting_value FROM push_settings WHERE setting_key = 'vapid_public_key'");
        $stmt->execute();
        $row = $stmt->fetch();

        if ($row) {
            echo json_encode(['success' => true, 'publicKey' => $row['setting_value']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'VAPID 키가 설정되지 않았습니다.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'VAPID 키 조회 실패']);
    }
    exit();
}

// POST/DELETE는 로그인 필수
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit();
}

$userId = intval($_SESSION['user_id']);

// ─── POST: 구독 저장 ───
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['endpoint']) || empty($data['keys']['p256dh']) || empty($data['keys']['auth'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => '구독 정보가 올바르지 않습니다.']);
        exit();
    }

    try {
        // 테이블 존재 확인
        $conn->exec("CREATE TABLE IF NOT EXISTS push_subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            endpoint TEXT NOT NULL,
            p256dh VARCHAR(500) NOT NULL,
            auth VARCHAR(500) NOT NULL,
            user_agent VARCHAR(500) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user (user_id),
            UNIQUE KEY unique_endpoint (user_id, endpoint(500))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // UPSERT: 같은 endpoint면 업데이트
        $stmt = $conn->prepare("
            INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
            VALUES (:user_id, :endpoint, :p256dh, :auth, :user_agent)
            ON DUPLICATE KEY UPDATE
                p256dh = VALUES(p256dh),
                auth = VALUES(auth),
                user_agent = VALUES(user_agent),
                updated_at = NOW()
        ");

        $stmt->execute([
            ':user_id' => $userId,
            ':endpoint' => $data['endpoint'],
            ':p256dh' => $data['keys']['p256dh'],
            ':auth' => $data['keys']['auth'],
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);

        echo json_encode(['success' => true, 'message' => '푸시 알림이 활성화되었습니다.']);

    } catch (PDOException $e) {
        error_log("Push subscription save error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '구독 저장 실패']);
    }
}

// ─── DELETE: 구독 삭제 ───
else if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $endpoint = $data['endpoint'] ?? '';

    if (empty($endpoint)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'endpoint가 필요합니다.']);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM push_subscriptions WHERE user_id = :user_id AND endpoint = :endpoint");
        $stmt->execute([':user_id' => $userId, ':endpoint' => $endpoint]);

        echo json_encode(['success' => true, 'message' => '푸시 알림이 비활성화되었습니다.']);
    } catch (PDOException $e) {
        error_log("Push subscription delete error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '구독 삭제 실패']);
    }
}
?>