<?php
/**
 * send_marketing_email.php — 관리자 광고 메일 발송 API
 * POST: { subject, html_body, cta_text, cta_url, image_url, target_role: all|seller|host|vendor, test_only: bool }
 */
include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();
header('Content-Type: application/json; charset=UTF-8');

// Admin/Superadmin only
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
$subject = trim($data->subject ?? '');
$htmlBody = trim($data->html_body ?? '');
$ctaText = trim($data->cta_text ?? '');
$ctaUrl = trim($data->cta_url ?? '');
$imageUrl = trim($data->image_url ?? '');
$targetRole = $data->target_role ?? 'all';
$testOnly = !empty($data->test_only);

if (empty($subject) || empty($htmlBody)) {
    echo json_encode(['success' => false, 'message' => '제목과 내용을 입력해주세요.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Ensure email_campaigns table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS email_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject VARCHAR(500) NOT NULL,
        html_body LONGTEXT,
        cta_text VARCHAR(200),
        cta_url VARCHAR(500),
        image_url VARCHAR(500),
        target_role VARCHAR(20) DEFAULT 'all',
        total_recipients INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        sent_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Ensure cat_marketing column exists in notification_settings
    try {
        $conn->exec("ALTER TABLE notification_settings ADD COLUMN cat_marketing TINYINT(1) DEFAULT 1");
    } catch (Exception $e) {
        // Column already exists
    }

    // Build the final HTML email using the SpaceMatch template
    $imageHtml = '';
    if (!empty($imageUrl)) {
        $imageHtml = "<div style='text-align:center; margin: 20px 0;'>
            <img src='{$imageUrl}' alt='Campaign Image' style='max-width:100%; height:auto; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);' />
        </div>";
    }

    $fullBody = $imageHtml . "<div style='color:#333333; font-size:15px; line-height:1.8;'>" . $htmlBody . "</div>";

    // Generate unsubscribe token (simple hash)
    // The actual token will be per-user, generated during sending
    $siteUrl = 'https://spacematch.net';

    // Test mode: send only to the admin's own email
    if ($testOnly) {
        $adminId = $_SESSION['user_id'];
        $testHtml = emailBaseTemplate($subject, $fullBody, !empty($ctaUrl) ? $ctaUrl : null, !empty($ctaText) ? $ctaText : null, 'ko');

        // Add unsubscribe footer (preview mode)
        $testHtml = str_replace('</body>', '<div style="text-align:center; padding:16px; font-size:11px; color:#999;">
            <a href="#" style="color:#999; text-decoration:underline;">수신 거부</a> | 이 메일은 SpaceMatch에서 발송되었습니다
        </div></body>', $testHtml);

        $stmt = $conn->prepare("SELECT email, name FROM users WHERE id = ?");
        $stmt->execute([$adminId]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            $result = _emailSend($admin['email'], $admin['name'] ?? '', '[테스트] ' . $subject, $testHtml);
            echo json_encode([
                'success' => true,
                'message' => $result ? "테스트 메일이 {$admin['email']}로 발송되었습니다." : "테스트 메일 발송 실패",
                'test' => true
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(['success' => false, 'message' => '관리자 이메일을 찾을 수 없습니다.'], JSON_UNESCAPED_UNICODE);
        }
        exit;
    }

    // Full send mode: get all eligible recipients
    $roleFilter = '';
    $params = [];
    if ($targetRole !== 'all') {
        $roleFilter = 'AND u.role = ?';
        $params[] = $targetRole;
    }

    // Check email_verified column exists
    $col_ev = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
    $has_ev = $col_ev->fetch() ? true : false;
    $evCondition = $has_ev ? "AND u.email_verified = 1" : "";

    $sql = "SELECT u.id, u.email, u.name, u.country 
            FROM users u 
            WHERE u.email IS NOT NULL 
            AND u.email != '' 
            AND u.status = 'active'
            {$evCondition}
            AND u.role NOT IN ('admin', 'superadmin')
            {$roleFilter}
            AND u.id NOT IN (
                SELECT ns.user_id FROM notification_settings ns 
                WHERE ns.cat_marketing = 0 OR ns.email_enabled = 0
            )";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $recipients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalRecipients = count($recipients);
    $sentCount = 0;
    $failedCount = 0;

    // Record campaign
    $campStmt = $conn->prepare("INSERT INTO email_campaigns (subject, html_body, cta_text, cta_url, image_url, target_role, total_recipients, sent_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $campStmt->execute([$subject, $htmlBody, $ctaText, $ctaUrl, $imageUrl, $targetRole, $totalRecipients, $_SESSION['user_id']]);
    $campaignId = $conn->lastInsertId();

    // Send to each recipient
    foreach ($recipients as $user) {
        $lang = _countryToLang($user['country'] ?? 'ko');

        // Generate per-user unsubscribe token
        $token = base64_encode($user['id'] . ':' . hash('sha256', $user['id'] . ':' . $user['email'] . ':spacematch_unsub'));
        $unsubLink = "{$siteUrl}/api/email/unsubscribe.php?token=" . urlencode($token);

        $userHtml = emailBaseTemplate($subject, $fullBody, !empty($ctaUrl) ? $ctaUrl : null, !empty($ctaText) ? $ctaText : null, $lang);

        // Add unsubscribe footer
        $unsubText = $lang === 'ko' ? '수신 거부' : ($lang === 'ja' ? '配信停止' : 'Unsubscribe');
        $unsubNote = $lang === 'ko' ? '이 메일은 SpaceMatch 마케팅 메일입니다' : ($lang === 'ja' ? 'SpaceMatchマーケティングメール' : 'This is a SpaceMatch marketing email');

        $userHtml = str_replace('</body>', "<div style='text-align:center; padding:16px; font-size:11px; color:#999;'>
            <a href='{$unsubLink}' style='color:#999; text-decoration:underline;'>{$unsubText}</a> | {$unsubNote}
        </div></body>", $userHtml);

        $result = _emailSend($user['email'], $user['name'] ?? '', $subject, $userHtml);
        if ($result) {
            $sentCount++;
        } else {
            $failedCount++;
        }
    }

    // Update campaign stats
    $updateStmt = $conn->prepare("UPDATE email_campaigns SET sent_count = ?, failed_count = ? WHERE id = ?");
    $updateStmt->execute([$sentCount, $failedCount, $campaignId]);

    echo json_encode([
        'success' => true,
        'message' => "메일 발송 완료: {$sentCount}건 성공, {$failedCount}건 실패 (총 {$totalRecipients}명 대상)",
        'campaign_id' => $campaignId,
        'stats' => [
            'total' => $totalRecipients,
            'sent' => $sentCount,
            'failed' => $failedCount
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '오류: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>