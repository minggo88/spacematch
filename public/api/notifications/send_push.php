<?php
/**
 * 웹 푸시 알림 발송 함수
 * 
 * 사용법:
 *   include_once __DIR__ . '/send_push.php';
 *   sendPushToUser($conn, $userId, '제목', '내용', '/link', 'icon_url');
 *   sendPushToUsers($conn, [$userId1, $userId2], '제목', '내용');
 */

// ─── 유틸함수 (중복 정의 방지) ───

if (!function_exists('base64url_encode')) {
    function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

if (!function_exists('base64url_decode')) {
    function base64url_decode($data)
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }
}

// ─── 공개 API ───

/**
 * 특정 유저에게 웹 푸시 알림 발송
 */
function sendPushToUser($conn, $userId, $title, $body, $url = '/', $icon = '/favicon.png')
{
    return sendPushToUsers($conn, [$userId], $title, $body, $url, $icon);
}

/**
 * 여러 유저에게 웹 푸시 알림 발송
 */
function sendPushToUsers($conn, $userIds, $title, $body, $url = '/', $icon = '/favicon.png')
{
    if (empty($userIds))
        return ['sent' => 0, 'failed' => 0];

    try {
        // VAPID 키 로드
        $keys = _pushGetVapidKeys($conn);
        if (!$keys) {
            error_log("Push: VAPID 키가 설정되지 않았습니다.");
            return ['sent' => 0, 'failed' => 0, 'error' => 'VAPID 키 없음'];
        }

        // 해당 유저들의 구독 정보 조회
        $placeholders = implode(',', array_fill(0, count($userIds), '?'));
        $stmt = $conn->prepare("SELECT * FROM push_subscriptions WHERE user_id IN ($placeholders)");
        $stmt->execute($userIds);
        $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($subscriptions)) {
            return ['sent' => 0, 'failed' => 0, 'info' => '구독 없음'];
        }

        $payload = json_encode([
            'title' => $title,
            'body' => $body,
            'icon' => $icon,
            'badge' => '/favicon.png',
            'url' => $url,
            'timestamp' => time()
        ], JSON_UNESCAPED_UNICODE);

        $sent = 0;
        $failed = 0;
        $expiredEndpoints = [];

        foreach ($subscriptions as $sub) {
            $result = _pushSendWebPush(
                $sub['endpoint'],
                $sub['p256dh'],
                $sub['auth'],
                $payload,
                $keys
            );

            if ($result === true) {
                $sent++;
            } else if ($result === 'expired') {
                $expiredEndpoints[] = $sub['id'];
                $failed++;
            } else {
                $failed++;
            }
        }

        // 만료된 구독 정리
        if (!empty($expiredEndpoints)) {
            $ph = implode(',', array_fill(0, count($expiredEndpoints), '?'));
            $conn->prepare("DELETE FROM push_subscriptions WHERE id IN ($ph)")
                ->execute($expiredEndpoints);
        }

        return ['sent' => $sent, 'failed' => $failed];

    } catch (Exception $e) {
        error_log("Push send error: " . $e->getMessage());
        return ['sent' => 0, 'failed' => 0, 'error' => $e->getMessage()];
    }
}

// ─── 내부 함수 (_push 접두사로 충돌 방지) ───

/**
 * VAPID 키 조회
 */
function _pushGetVapidKeys($conn)
{
    try {
        $stmt = $conn->prepare("SELECT setting_key, setting_value FROM push_settings WHERE setting_key IN ('vapid_public_key', 'vapid_private_key')");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        if (empty($rows['vapid_public_key']) || empty($rows['vapid_private_key'])) {
            return null;
        }

        return [
            'publicKey' => $rows['vapid_public_key'],
            'privateKey' => $rows['vapid_private_key']
        ];
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Web Push 프로토콜로 알림 전송
 */
function _pushSendWebPush($endpoint, $userPublicKey, $userAuth, $payload, $vapidKeys)
{
    try {
        // 1. VAPID JWT 생성
        $audience = parse_url($endpoint, PHP_URL_SCHEME) . '://' . parse_url($endpoint, PHP_URL_HOST);
        $vapidHeaders = _pushCreateVapidHeaders($audience, 'mailto:copydot.thomaspaik@gmail.com', $vapidKeys);

        if (!$vapidHeaders) {
            error_log("Push: VAPID 헤더 생성 실패");
            return false;
        }

        // 2. 페이로드 암호화
        $encrypted = _pushEncryptPayload($userPublicKey, $userAuth, $payload);
        if (!$encrypted) {
            error_log("Push: 페이로드 암호화 실패");
            return false;
        }

        // 3. HTTP 요청 전송
        $headers = [
            'Content-Type: application/octet-stream',
            'Content-Encoding: aes128gcm',
            'Content-Length: ' . strlen($encrypted['cipherText']),
            'TTL: 86400',
            'Urgency: high',
            'Authorization: vapid t=' . $vapidHeaders['token'] . ', k=' . $vapidHeaders['publicKey'],
        ];

        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encrypted['cipherText']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            error_log("Push cURL error: $curlError");
            return false;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        } else if ($httpCode === 404 || $httpCode === 410) {
            return 'expired';
        } else {
            error_log("Push HTTP $httpCode: $response");
            return false;
        }

    } catch (Exception $e) {
        error_log("Push error: " . $e->getMessage());
        return false;
    }
}

/**
 * VAPID JWT 토큰 생성
 */
function _pushCreateVapidHeaders($audience, $subject, $vapidKeys)
{
    try {
        $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));

        $jwtPayload = base64url_encode(json_encode([
            'aud' => $audience,
            'exp' => time() + 43200,
            'sub' => $subject
        ]));

        $signingInput = "$header.$jwtPayload";

        // 개인키/공개키 바이너리
        $privateKeyBin = base64url_decode($vapidKeys['privateKey']);
        $publicKeyBin = base64url_decode($vapidKeys['publicKey']);

        // PEM 형식으로 변환
        $pem = _pushCreateEcPem($privateKeyBin, $publicKeyBin);
        if (!$pem)
            return null;

        $key = openssl_pkey_get_private($pem);
        if (!$key) {
            error_log("Push: PEM 로드 실패 — " . openssl_error_string());
            return null;
        }

        $signature = '';
        if (!openssl_sign($signingInput, $signature, $key, OPENSSL_ALGO_SHA256)) {
            error_log("Push: 서명 실패 — " . openssl_error_string());
            return null;
        }

        // DER 서명을 raw R+S (64 bytes)로 변환
        $rawSig = _pushDerToRaw($signature);

        $token = $signingInput . '.' . base64url_encode($rawSig);

        return [
            'token' => $token,
            'publicKey' => $vapidKeys['publicKey']
        ];

    } catch (Exception $e) {
        error_log("VAPID header error: " . $e->getMessage());
        return null;
    }
}

/**
 * EC Private Key PEM 생성 (SEC1 형식)
 * 
 * ASN.1 구조:
 *   ECPrivateKey ::= SEQUENCE {
 *     version        INTEGER { ecPrivkeyVer1(1) },
 *     privateKey     OCTET STRING (32 bytes),
 *     parameters [0] OID (prime256v1),
 *     publicKey  [1] BIT STRING (65 bytes, uncompressed)
 *   }
 */
function _pushCreateEcPem($privateKeyBin, $publicKeyBin)
{
    // OID for prime256v1 (P-256)
    $curveOid = hex2bin('06082a8648ce3d030107');

    // 개인키 32바이트로 패딩
    $privKey = str_pad($privateKeyBin, 32, "\x00", STR_PAD_LEFT);

    // 공개키 BIT STRING 내부: 0x00 (unused bits) + publicKeyBin
    $pubBitContent = "\x00" . $publicKeyBin;

    // 각 컴포넌트를 ASN.1 TLV로 인코딩
    $version = "\x02\x01\x01"; // INTEGER 1
    $privOctet = "\x04\x20" . $privKey; // OCTET STRING (32 bytes)
    $params = "\xa0" . _pushAsn1Len($curveOid) . $curveOid; // [0] EXPLICIT OID
    $pubBitString = "\x03" . _pushAsn1Len($pubBitContent) . $pubBitContent;
    $pubKey = "\xa1" . _pushAsn1Len($pubBitString) . $pubBitString; // [1] EXPLICIT BIT STRING

    // SEQUENCE 전체 조립
    $innerContent = $version . $privOctet . $params . $pubKey;
    $sequence = "\x30" . _pushAsn1Len($innerContent) . $innerContent;

    $pem = "-----BEGIN EC PRIVATE KEY-----\n" .
        chunk_split(base64_encode($sequence), 64, "\n") .
        "-----END EC PRIVATE KEY-----\n";

    // 생성한 PEM 검증
    $testKey = openssl_pkey_get_private($pem);
    if (!$testKey) {
        error_log("Push: PEM 생성 검증 실패 — " . openssl_error_string());
        return null;
    }

    return $pem;
}

/**
 * Web Push 페이로드 암호화 (aes128gcm)
 */
function _pushEncryptPayload($userPublicKey, $userAuth, $payload)
{
    try {
        $userPublicKeyBin = base64url_decode($userPublicKey);
        $userAuthBin = base64url_decode($userAuth);

        // 서버 ECDH 키 쌍 생성
        $serverKey = openssl_pkey_new([
            'curve_name' => 'prime256v1',
            'private_key_type' => OPENSSL_KEYTYPE_EC,
        ]);
        if (!$serverKey)
            return null;

        $serverKeyDetails = openssl_pkey_get_details($serverKey);
        $serverPublicKeyBin = "\x04" .
            str_pad($serverKeyDetails['ec']['x'], 32, "\x00", STR_PAD_LEFT) .
            str_pad($serverKeyDetails['ec']['y'], 32, "\x00", STR_PAD_LEFT);

        // ECDH 공유 시크릿 계산
        $sharedSecret = _pushComputeEcdhSecret($serverKey, $userPublicKeyBin);
        if (!$sharedSecret)
            return null;

        // salt 생성 (16 bytes)
        $salt = random_bytes(16);

        // HKDF key derivation
        $keyInfoAuth = "WebPush: info\x00" . $userPublicKeyBin . $serverPublicKeyBin;
        $ikm = _pushHkdf($userAuthBin, $sharedSecret, $keyInfoAuth, 32);

        $key = _pushHkdf($salt, $ikm, "Content-Encoding: aes128gcm\x00", 16);
        $nonce = _pushHkdf($salt, $ikm, "Content-Encoding: nonce\x00", 12);

        // 페이로드에 패딩 추가 (delimiter \x02 = 마지막 레코드)
        $paddedPayload = $payload . "\x02";

        // AES-128-GCM 암호화
        $tag = '';
        $encrypted = openssl_encrypt(
            $paddedPayload,
            'aes-128-gcm',
            $key,
            OPENSSL_RAW_DATA,
            $nonce,
            $tag,
            '',
            16
        );

        if ($encrypted === false)
            return null;

        // aes128gcm Content-Coding 헤더 구성
        $recordSize = pack('N', 4096);
        $keyIdLen = chr(65); // 65 bytes for uncompressed P-256 public key
        $header = $salt . $recordSize . $keyIdLen . $serverPublicKeyBin;

        return [
            'cipherText' => $header . $encrypted . $tag
        ];

    } catch (Exception $e) {
        error_log("Encrypt error: " . $e->getMessage());
        return null;
    }
}

/**
 * ECDH 공유 시크릿 계산
 */
function _pushComputeEcdhSecret($serverPrivateKey, $userPublicKeyBin)
{
    try {
        // 유저 공개키를 SPKI DER → PEM으로 변환
        $ecOid = hex2bin('06082a8648ce3d0201');   // OID: ecPublicKey
        $curveOid = hex2bin('06082a8648ce3d030107'); // OID: prime256v1

        $algId = "\x30" . chr(strlen($ecOid . $curveOid)) . $ecOid . $curveOid;
        $bitString = "\x03" . chr(strlen($userPublicKeyBin) + 1) . "\x00" . $userPublicKeyBin;

        $pubKeyDer = "\x30" . chr(strlen($algId . $bitString)) . $algId . $bitString;

        $pubKeyPem = "-----BEGIN PUBLIC KEY-----\n" .
            chunk_split(base64_encode($pubKeyDer), 64, "\n") .
            "-----END PUBLIC KEY-----\n";

        $pubKey = openssl_pkey_get_public($pubKeyPem);
        if (!$pubKey) {
            error_log("Push ECDH: 공개키 PEM 로드 실패");
            return null;
        }

        $result = openssl_pkey_derive($serverPrivateKey, $pubKey);
        if ($result === false)
            return null;
        return $result;
    } catch (Exception $e) {
        error_log("ECDH error: " . $e->getMessage());
        return null;
    }
}

/**
 * HKDF (HMAC-based Key Derivation Function)
 */
function _pushHkdf($salt, $ikm, $info, $length)
{
    // Extract
    $prk = hash_hmac('sha256', $ikm, $salt, true);
    // Expand
    $result = '';
    $t = '';
    $counter = 1;
    while (strlen($result) < $length) {
        $t = hash_hmac('sha256', $t . $info . chr($counter), $prk, true);
        $result .= $t;
        $counter++;
    }
    return substr($result, 0, $length);
}

/**
 * DER 서명을 raw R||S (각 32바이트) 형식으로 변환
 * SEQUENCE 헤더 길이를 동적으로 파싱
 */
function _pushDerToRaw($der)
{
    $pos = 0;

    // SEQUENCE tag (0x30)
    if (ord($der[$pos]) !== 0x30)
        return str_repeat("\x00", 64);
    $pos++;

    // SEQUENCE length (skip — 가변 길이 지원)
    $seqLen = ord($der[$pos]);
    $pos++;
    if ($seqLen > 127) {
        // multi-byte length
        $numBytes = $seqLen & 0x7f;
        $pos += $numBytes;
    }

    // R: INTEGER tag (0x02)
    if (ord($der[$pos]) !== 0x02)
        return str_repeat("\x00", 64);
    $pos++;
    $rLen = ord($der[$pos]);
    $pos++;
    $r = substr($der, $pos, $rLen);
    $pos += $rLen;

    // S: INTEGER tag (0x02)
    if (ord($der[$pos]) !== 0x02)
        return str_repeat("\x00", 64);
    $pos++;
    $sLen = ord($der[$pos]);
    $pos++;
    $s = substr($der, $pos, $sLen);

    // 앞쪽 0x00 패딩 제거 후 32바이트 맞춤
    $r = ltrim($r, "\x00");
    $s = ltrim($s, "\x00");

    return str_pad($r, 32, "\x00", STR_PAD_LEFT) . str_pad($s, 32, "\x00", STR_PAD_LEFT);
}

/**
 * ASN.1 DER 길이 인코딩
 */
function _pushAsn1Len($data)
{
    $len = strlen($data);
    if ($len < 128)
        return chr($len);
    if ($len < 256)
        return "\x81" . chr($len);
    return "\x82" . pack('n', $len);
}
?>