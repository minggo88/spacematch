<?php
include_once '../db_connect.php';
include_once '../notifications/send_push.php';
include_once '../notifications/send_email.php';
session_start();

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->status)) {
    $application_id = $data->id;
    $status = $data->status; // 'approved' or 'rejected'
    $rejection_reason = isset($data->rejection_reason) ? trim($data->rejection_reason) : '';
    $user_id = $_SESSION['user_id'];
    $user_role = $_SESSION['user_role'] ?? '';

    $can_update = false;

    if ($user_role === 'admin' || $user_role === 'superadmin') {
        $can_update = true;
    } else {
        // Check if the application belongs to a venue owned by this user
        $checkQuery = "SELECT COUNT(*) FROM applications a 
                       JOIN venues v ON a.venue_id = v.id 
                       WHERE a.id = :app_id AND v.owner_id = :owner_id";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bindParam(':app_id', $application_id);
        $stmt->bindParam(':owner_id', $user_id);
        $stmt->execute();

        if ($stmt->fetchColumn() > 0) {
            $can_update = true;
        }
    }

    if ($can_update) {
        // Check 3-day deadline for approved → rejected
        if ($status === 'rejected') {
            $checkCurrent = $conn->prepare("SELECT status, selected_period FROM applications WHERE id = :id");
            $checkCurrent->bindParam(':id', $application_id);
            $checkCurrent->execute();
            $currentApp = $checkCurrent->fetch(PDO::FETCH_ASSOC);

            if ($currentApp && $currentApp['status'] === 'approved' && !empty($currentApp['selected_period'])) {
                $period = json_decode($currentApp['selected_period'], true);
                if (isset($period['start'])) {
                    $eventStart = new DateTime($period['start']);
                    $now = new DateTime();
                    $daysUntil = $now->diff($eventStart)->days;
                    $isFuture = $eventStart > $now;

                    if (!$isFuture || $daysUntil < 3) {
                        echo json_encode(["success" => false, "message" => "행사 시작 3일 전까지만 승인을 취소할 수 있습니다."]);
                        exit;
                    }
                }
            }
        }

        // Auto-add rejection_reason column if not exists
        try {
            $colCheck = $conn->query("SHOW COLUMNS FROM applications LIKE 'rejection_reason'");
            if ($colCheck->rowCount() === 0) {
                $conn->exec("ALTER TABLE applications ADD COLUMN rejection_reason TEXT DEFAULT NULL");
            }
        } catch (Exception $e) {
            // Column may already exist
        }

        $query = "UPDATE applications SET status = :status, rejection_reason = :reason WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':reason', $rejection_reason);
        $stmt->bindParam(':id', $application_id);

        if ($stmt->execute()) {
            // [NOTIFICATION] Notify Applicant
            try {
                // Ensure notifications table
                $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                    message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                // Get applicant ID and Venue Name
                $appQuery = "SELECT user_id, venue_name FROM applications WHERE id = :id";
                $appStmt = $conn->prepare($appQuery);
                $appStmt->bindParam(':id', $application_id);
                $appStmt->execute();
                $appData = $appStmt->fetch(PDO::FETCH_ASSOC);

                if ($appData) {
                    $statusMsg = ($status === 'approved') ? '승인' : (($status === 'rejected') ? '반려' : $status);
                    $notifMsg = "입점 신청이 [{$statusMsg}] 처리되었습니다: " . $appData['venue_name'];
                    if ($status === 'rejected' && !empty($rejection_reason)) {
                        $notifMsg .= "\n거절 사유: " . $rejection_reason;
                    }
                    $notifLink = "/seller/applications";

                    $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (:uid, 'application_status', :msg, :link, NOW())";
                    $notifStmt = $conn->prepare($notifSql);
                    $notifStmt->bindValue(':uid', $appData['user_id']);
                    $notifStmt->bindValue(':msg', $notifMsg);
                    $notifStmt->bindValue(':link', $notifLink);
                    $notifStmt->execute();

                    // [WEB PUSH] Seller에게 푸시 알림 발송
                    try {
                        $pushTitle = ($status === 'approved') ? '✅ 입점 승인' : '❌ 입점 반려';
                        sendPushToUser($conn, $appData['user_id'], $pushTitle, $notifMsg, $notifLink);
                    } catch (Exception $pushErr) {
                        error_log("Push notification error (update_status): " . $pushErr->getMessage());
                    }

                    // [EMAIL] Seller에게 이메일 알림 발송 (다국어)
                    try {
                        $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                        $_vn = $appData['venue_name'];
                        $_rr = $rejection_reason ?? '';
                        $_st = $status;
                        sendEmailToUser(
                            $conn,
                            $appData['user_id'],
                            '',
                            '',
                            'cat_application',
                            function ($lang) use ($_vn, $_rr, $_st, $siteUrl) {
                                if ($_st === 'approved') {
                                    $subj = _t(['ko' => "✅ 입점 승인: {$_vn}", 'en' => "✅ Approved: {$_vn}", 'ja' => "✅ 承認: {$_vn}", 'vi' => "✅ Đã duyệt: {$_vn}", 'th' => "✅ อนุมัติ: {$_vn}"], $lang);
                                    return ['subject' => $subj, 'html' => emailTemplateApplicationApproved($_vn, $siteUrl, $lang)];
                                } else {
                                    $subj = _t(['ko' => "❌ 입점 반려: {$_vn}", 'en' => "❌ Rejected: {$_vn}", 'ja' => "❌ 却下: {$_vn}", 'vi' => "❌ Từ chối: {$_vn}", 'th' => "❌ ปฏิเสธ: {$_vn}"], $lang);
                                    return ['subject' => $subj, 'html' => emailTemplateApplicationRejected($_vn, $_rr, $siteUrl, $lang)];
                                }
                            }
                        );
                    } catch (Exception $emailErr) {
                        error_log("Email notification error (update_status): " . $emailErr->getMessage());
                    }
                }
            } catch (Exception $e) {
                error_log("SpaceMatch Notification Error (update_status): " . $e->getMessage());
            }

            echo json_encode(array("success" => true, "message" => "상태가 변경되었습니다."));
        } else {
            echo json_encode(array("success" => false, "message" => "DB 오류가 발생했습니다."));
        }
    } else {
        http_response_code(403);
        echo json_encode(array("success" => false, "message" => "권한이 없습니다 (본인의 베뉴가 아니거나 관리자가 아님)."));
    }

} else {
    echo json_encode(array("success" => false, "message" => "잘못된 요청입니다."));
}
?>