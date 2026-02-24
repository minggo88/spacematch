<?php
include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

// Auth check - only sellers
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid method"]);
    exit;
}

$user_id = intval($_SESSION['user_id']);
$data = json_decode(file_get_contents("php://input"));
$application_id = isset($data->application_id) ? intval($data->application_id) : 0;
$reason = isset($data->reason) ? trim($data->reason) : '';

if ($application_id <= 0) {
    echo json_encode(["success" => false, "message" => "신청 ID가 필요합니다."]);
    exit;
}

if (empty($reason)) {
    echo json_encode(["success" => false, "message" => "취소 사유를 반드시 작성해주세요."]);
    exit;
}

try {
    // Auto-migrate: create cancellation_requests table
    $conn->exec("CREATE TABLE IF NOT EXISTS cancellation_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        seller_id INT NOT NULL,
        venue_id INT NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        decided_by INT DEFAULT NULL,
        decision_note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        decided_at TIMESTAMP NULL DEFAULT NULL,
        INDEX (application_id),
        INDEX (seller_id),
        INDEX (venue_id),
        INDEX (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Verify: application belongs to this seller AND is approved
    $checkStmt = $conn->prepare("SELECT a.id, a.status, a.venue_id, a.venue_name, v.owner_id 
                                  FROM applications a 
                                  JOIN venues v ON a.venue_id = v.id 
                                  WHERE a.id = ? AND a.user_id = ?");
    $checkStmt->execute([$application_id, $user_id]);
    $app = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$app) {
        echo json_encode(["success" => false, "message" => "해당 신청을 찾을 수 없거나 권한이 없습니다."]);
        exit;
    }

    if ($app['status'] !== 'approved') {
        echo json_encode(["success" => false, "message" => "승인된 신청만 취소 요청이 가능합니다. 대기 중인 신청은 직접 취소하세요."]);
        exit;
    }

    // Check if there's already a pending cancellation request
    $dupCheck = $conn->prepare("SELECT id FROM cancellation_requests WHERE application_id = ? AND status = 'pending'");
    $dupCheck->execute([$application_id]);
    if ($dupCheck->fetch()) {
        echo json_encode(["success" => false, "message" => "이미 취소 요청이 진행 중입니다."]);
        exit;
    }

    // Insert cancellation request
    $insertStmt = $conn->prepare("INSERT INTO cancellation_requests (application_id, seller_id, venue_id, reason) VALUES (?, ?, ?, ?)");
    $insertStmt->execute([$application_id, $user_id, $app['venue_id'], $reason]);

    // Send notification to venue owner (host)
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $sellerName = $_SESSION['user_name'] ?? '셀러';
        $notifMsg = "[취소 요청] {$sellerName}님이 \"{$app['venue_name']}\" 입점 취소를 요청했습니다. 사유: " . mb_substr($reason, 0, 50);
        $notifLink = "/host/applications";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, 'cancellation_request', ?, ?)");
        $notifStmt->execute([$app['owner_id'], $notifMsg, $notifLink]);

        // [EMAIL] 취소 요청 이메일 알림 (다국어)
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_vn = $app['venue_name'];
            $_rs = mb_substr($reason, 0, 100);
            sendEmailToUser(
                $conn,
                $app['owner_id'],
                '',
                '',
                'cat_application',
                function ($lang) use ($_vn, $_rs, $siteUrl) {
                    $subj = _t(['ko' => '입점 취소 요청이 접수되었습니다', 'en' => 'Cancellation Request Submitted', 'ja' => 'キャンセル要求が送信されました', 'vi' => 'Yêu cầu hủy đã được gửi', 'th' => 'ส่งคำขอยกเลิกแล้ว'], $lang);
                    return ['subject' => $subj, 'html' => emailTemplateCancellation('request', $_vn, $_rs, $siteUrl, '/host/applications', $lang)];
                }
            );
        } catch (Exception $emailErr) {
            error_log("Email error (cancellation_request): " . $emailErr->getMessage());
        }
    } catch (Exception $e) {
        error_log("SpaceMatch Notification Error (request_cancellation): " . $e->getMessage());
    }

    echo json_encode(["success" => true, "message" => "취소 요청이 접수되었습니다. 호스트의 승인을 기다려주세요."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
