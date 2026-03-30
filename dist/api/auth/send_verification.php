<?php
/**
 * 이메일 인증 코드 발송 API
 * POST { email: string }
 * Response: { success: boolean, message: string, cooldown?: number }
 */
ob_start();
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
include_once '../notifications/send_email.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty(trim($data->email))) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "이메일을 입력해주세요."]);
    exit;
}

$email = strtolower(trim($data->email));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "유효한 이메일 주소를 입력해주세요."]);
    exit;
}

// Get client IP
function getClientIP()
{
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($keys as $k) {
        if (!empty($_SERVER[$k])) {
            $ip = trim(explode(',', $_SERVER[$k])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP))
                return $ip;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

$clientIP = getClientIP();

try {
    // ── 1. Create email_verifications table (once per session) ──
    if (empty($_SESSION['_ddl_email_verifications'])) {
        session_start();
        $conn->exec("CREATE TABLE IF NOT EXISTS email_verifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(10) NOT NULL,
            ip VARCHAR(45) NOT NULL,
            attempts INT DEFAULT 0,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_ip (ip),
            INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $_SESSION['_ddl_email_verifications'] = true;
    }

    // ── 2. Check if email already registered ──
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->rowCount() > 0) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "이미 가입된 이메일입니다."]);
        exit;
    }

    // ── 3. Rate limit: 1 minute cooldown per email ──
    $cooldownStmt = $conn->prepare("SELECT created_at FROM email_verifications WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) ORDER BY created_at DESC LIMIT 1");
    $cooldownStmt->execute([$email]);
    if ($cooldownStmt->rowCount() > 0) {
        $lastSent = $cooldownStmt->fetch(PDO::FETCH_ASSOC);
        $waitSec = 60 - (time() - strtotime($lastSent['created_at']));
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "{$waitSec}초 후에 다시 시도해주세요.", "cooldown" => max(0, $waitSec)]);
        exit;
    }

    // ── 4. Rate limit: max 5 per hour per IP ──
    $ipLimitStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM email_verifications WHERE ip = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $ipLimitStmt->execute([$clientIP]);
    $ipCount = intval($ipLimitStmt->fetch(PDO::FETCH_ASSOC)['cnt']);
    if ($ipCount >= 5) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "인증 요청이 너무 많습니다. 1시간 후 다시 시도해주세요."]);
        exit;
    }

    // ── 5. Generate 6-digit code ──
    $code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes

    // ── 6. Invalidate previous codes for this email ──
    $conn->prepare("DELETE FROM email_verifications WHERE email = ?")->execute([$email]);

    // ── 7. Save new code ──
    $insertStmt = $conn->prepare("INSERT INTO email_verifications (email, code, ip, expires_at) VALUES (?, ?, ?, ?)");
    $insertStmt->execute([$email, $code, $clientIP, $expiresAt]);

    // ── 8. Send verification email ──
    include_once '../notifications/email_templates.php';

    $lang = isset($data->country) ? _countryToLang($data->country) : 'ko';
    $subject = _t([
        'ko' => '[SpaceMatch] 이메일 인증 코드',
        'en' => '[SpaceMatch] Email Verification Code',
        'ja' => '[SpaceMatch] メール認証コード',
        'vi' => '[SpaceMatch] Mã xác minh email',
        'th' => '[SpaceMatch] รหัสยืนยันอีเมล',
        'fr' => '[SpaceMatch] Code de vérification email',
        'km' => '[SpaceMatch] លេខកូដផ្ទៀងផ្ទាត់អ៊ីមែល',
        'ru' => '[SpaceMatch] Код подтверждения email',
        'uk' => '[SpaceMatch] Код підтвердження email'
    ], $lang);

    $html = emailTemplateVerificationCode($code, $lang);
    $sent = _emailSend($email, '', $subject, $html);

    if ($sent) {
        // Clean up expired codes periodically
        $conn->exec("DELETE FROM email_verifications WHERE expires_at < NOW()");

        ob_end_clean();
        echo json_encode([
            "success" => true,
            "message" => "인증 코드가 발송되었습니다. 이메일을 확인해주세요.",
            "expires_in" => 600
        ]);
    } else {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요."]);
    }

} catch (PDOException $e) {
    ob_end_clean();
    error_log("Email verification error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
} catch (Exception $e) {
    ob_end_clean();
    error_log("Email verification error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
}
?>