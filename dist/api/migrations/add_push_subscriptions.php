<?php
/**
 * 마이그레이션: push_subscriptions 테이블 생성
 * 웹 푸시 알림을 위한 유저별 Push 구독 정보 저장
 */
include_once '../db_connect.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔔 Push Subscriptions 테이블 마이그레이션</h2>";

try {
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

    echo "✅ push_subscriptions 테이블 생성 완료<br>";

    // VAPID 키 설정 테이블
    $conn->exec("CREATE TABLE IF NOT EXISTS push_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    echo "✅ push_settings 테이블 생성 완료<br>";

    // VAPID 키 자동 생성 (없는 경우)
    $check = $conn->prepare("SELECT setting_value FROM push_settings WHERE setting_key = 'vapid_public_key'");
    $check->execute();
    if (!$check->fetch()) {
        // PHP에서 VAPID 키 쌍 생성
        $keyPair = generateVapidKeys();
        if ($keyPair) {
            $stmt = $conn->prepare("INSERT INTO push_settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute(['vapid_public_key', $keyPair['publicKey']]);
            $stmt->execute(['vapid_private_key', $keyPair['privateKey']]);
            echo "✅ VAPID 키 쌍 자동 생성 완료<br>";
            echo "<br><b>Public Key:</b> " . $keyPair['publicKey'] . "<br>";
            echo "<b>⚠️ Private Key는 보안상 표시하지 않습니다.</b><br>";
        } else {
            echo "⚠️ VAPID 키 자동 생성 실패 — 수동으로 설정하세요<br>";
        }
    } else {
        echo "ℹ️ VAPID 키가 이미 존재합니다<br>";
    }

} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "❌ 오류: " . $e->getMessage() . "<br>";
}

/**
 * ECDSA P-256 키 쌍 생성 (VAPID용)
 */
function generateVapidKeys()
{
    try {
        $key = openssl_pkey_new([
            'curve_name' => 'prime256v1',
            'private_key_type' => OPENSSL_KEYTYPE_EC,
        ]);
        if (!$key)
            return null;

        $details = openssl_pkey_get_details($key);
        if (!$details)
            return null;

        // EC 포인트에서 x, y 좌표 추출
        $x = $details['ec']['x'];
        $y = $details['ec']['y'];
        $d = $details['ec']['d'];

        // 비압축 공개키: 0x04 + x + y
        $publicKeyBin = "\x04" . str_pad($x, 32, "\x00", STR_PAD_LEFT) . str_pad($y, 32, "\x00", STR_PAD_LEFT);
        $privateKeyBin = str_pad($d, 32, "\x00", STR_PAD_LEFT);

        return [
            'publicKey' => rtrim(strtr(base64_encode($publicKeyBin), '+/', '-_'), '='),
            'privateKey' => rtrim(strtr(base64_encode($privateKeyBin), '+/', '-_'), '='),
        ];
    } catch (Exception $e) {
        error_log("VAPID key generation error: " . $e->getMessage());
        return null;
    }
}
?>