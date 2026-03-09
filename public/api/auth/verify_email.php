<?php
/**
 * 이메일 인증 코드 확인 API
 * POST { email: string, code: string }
 * Response: { success: boolean, message: string, verified?: boolean }
 */
ob_start();
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';

session_start();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->code)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "이메일과 인증 코드를 입력해주세요."]);
    exit;
}

$email = strtolower(trim($data->email));
$code = trim($data->code);

if (strlen($code) !== 6 || !ctype_digit($code)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "6자리 숫자 코드를 입력해주세요."]);
    exit;
}

try {
    // ── 1. Find active verification code ──
    $stmt = $conn->prepare("SELECT id, code, attempts, expires_at FROM email_verifications WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "인증 코드가 만료되었거나 존재하지 않습니다. 다시 발송해주세요."]);
        exit;
    }

    // ── 2. Check max attempts (5) ──
    if (intval($row['attempts']) >= 5) {
        // Invalidate code
        $conn->prepare("DELETE FROM email_verifications WHERE id = ?")->execute([$row['id']]);
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "인증 시도 횟수를 초과했습니다. 새 코드를 발송해주세요."]);
        exit;
    }

    // ── 3. Verify code ──
    if ($row['code'] !== $code) {
        // Increment attempts
        $conn->prepare("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?")->execute([$row['id']]);
        $remaining = 4 - intval($row['attempts']);
        ob_end_clean();
        echo json_encode([
            "success" => false,
            "message" => "인증 코드가 일치하지 않습니다." . ($remaining > 0 ? " 남은 시도: {$remaining}회" : ""),
            "remaining_attempts" => max(0, $remaining)
        ]);
        exit;
    }

    // ── 4. Verification success ──
    // Store verified email in session for registration
    $_SESSION['verified_email'] = $email;
    $_SESSION['email_verified_at'] = time();

    // Delete used code
    $conn->prepare("DELETE FROM email_verifications WHERE email = ?")->execute([$email]);

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "verified" => true,
        "message" => "이메일 인증이 완료되었습니다."
    ]);

} catch (PDOException $e) {
    ob_end_clean();
    error_log("Email verify error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
} catch (Exception $e) {
    ob_end_clean();
    error_log("Email verify error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
}
?>