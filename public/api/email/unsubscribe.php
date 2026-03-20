<?php
/**
 * unsubscribe.php — 원클릭 수신 거부 처리
 * GET: ?token=base64(userId:hash)
 */
include_once '../db_connect.php';
header('Content-Type: text/html; charset=UTF-8');

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo renderPage('오류', '유효하지 않은 요청입니다.', false);
    exit;
}

try {
    $decoded = base64_decode($token);
    $parts = explode(':', $decoded, 2);

    if (count($parts) < 2) {
        echo renderPage('오류', '유효하지 않은 토큰입니다.', false);
        exit;
    }

    $userId = intval($parts[0]);
    $hash = $parts[1];

    // Verify token
    $stmt = $conn->prepare("SELECT id, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo renderPage('오류', '사용자를 찾을 수 없습니다.', false);
        exit;
    }

    $expectedHash = hash('sha256', $user['id'] . ':' . $user['email'] . ':spacematch_unsub');
    if (!hash_equals($expectedHash, $hash)) {
        echo renderPage('오류', '유효하지 않은 토큰입니다.', false);
        exit;
    }

    // Ensure cat_marketing column exists
    try {
        $conn->exec("ALTER TABLE notification_settings ADD COLUMN cat_marketing TINYINT(1) DEFAULT 1");
    } catch (Exception $e) {
        // Already exists
    }

    // Update notification settings — opt out of marketing
    $checkStmt = $conn->prepare("SELECT user_id FROM notification_settings WHERE user_id = ?");
    $checkStmt->execute([$userId]);

    if ($checkStmt->fetch()) {
        $updateStmt = $conn->prepare("UPDATE notification_settings SET cat_marketing = 0 WHERE user_id = ?");
        $updateStmt->execute([$userId]);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO notification_settings (user_id, push_enabled, email_enabled, cat_application, cat_community, cat_venue, cat_account, cat_payment, cat_marketing) VALUES (?, 1, 1, 1, 1, 1, 1, 1, 0)");
        $insertStmt->execute([$userId]);
    }

    echo renderPage('수신 거부 완료', '마케팅 이메일 수신이 해제되었습니다.<br>SpaceMatch 서비스 알림은 계속 수신됩니다.', true);

} catch (Exception $e) {
    echo renderPage('오류', '처리 중 오류가 발생했습니다.', false);
}

function renderPage($title, $message, $success)
{
    $icon = $success ? '✅' : '❌';
    $color = $success ? '#10b981' : '#ef4444';
    $bgColor = $success ? '#ecfdf5' : '#fef2f2';

    return "<!DOCTYPE html>
<html lang='ko'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{$title} - SpaceMatch</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f7; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .icon { font-size: 48px; margin-bottom: 20px; }
        .title { 
            font-size: 22px; 
            font-weight: 800; 
            color: #1a1a2e; 
            margin-bottom: 12px; 
        }
        .message { 
            font-size: 15px; 
            color: #666; 
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .status-badge {
            display: inline-block;
            background: {$bgColor};
            color: {$color};
            padding: 8px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
        }
        .logo {
            margin-top: 32px;
            font-size: 13px;
            color: #999;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class='card'>
        <div class='icon'>{$icon}</div>
        <h1 class='title'>{$title}</h1>
        <p class='message'>{$message}</p>
        <span class='status-badge'>" . ($success ? '처리 완료' : '처리 실패') . "</span>
        <p class='logo'>SpaceMatch</p>
    </div>
</body>
</html>";
}
?>