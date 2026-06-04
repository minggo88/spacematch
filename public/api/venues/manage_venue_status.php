<?php
include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

// Allow only admin or superadmin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->status)) {
    $venue_id = $data->id;
    $status = $data->status;

    if (!in_array($status, ['approved', 'rejected', 'suspended'])) {
        echo json_encode(array("success" => false, "message" => "Invalid status."));
        exit;
    }

    try {
        // Get venue info before update for notification
        $venueInfoStmt = $conn->prepare("SELECT name, owner_id FROM venues WHERE id = ?");
        $venueInfoStmt->execute([$venue_id]);
        $venueInfo = $venueInfoStmt->fetch(PDO::FETCH_ASSOC);

        $query = "UPDATE venues SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($query);

        if ($stmt->execute([$status, $venue_id])) {
            // [NOTIFICATION] Notify venue owner about status change
            if ($venueInfo && $venueInfo['owner_id']) {
                try {
                    $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                        message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                    $statusLabels = ['approved' => '승인', 'rejected' => '반려', 'suspended' => '정지'];
                    $statusLabel = $statusLabels[$status] ?? $status;
                    $venueName = $venueInfo['name'];
                    $notifMsg = "'{$venueName}' 공간이 [{$statusLabel}] 처리되었습니다.";
                    $notifLink = "/host/venues";

                    $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'venue_status', ?, ?, NOW())";
                    $notifStmt = $conn->prepare($notifSql);
                    $notifStmt->execute([$venueInfo['owner_id'], $notifMsg, $notifLink]);

                    // [EMAIL] 베뉴 상태 변경 이메일 알림 (다국어)
                    try {
                        $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                        $_vn = $venueName;
                        $_st = $status;
                        $_nl = $notifLink;
                        sendEmailToUser(
                            $conn,
                            $venueInfo['owner_id'],
                            '',
                            '',
                            'cat_venue',
                            function ($lang) use ($_vn, $_st, $siteUrl, $_nl) {
                                $subj = _t(['ko' => "'{$_vn}' 공간 상태가 변경되었습니다", 'en' => "'{$_vn}' status changed", 'ja' => "'{$_vn}' 状態変更", 'vi' => "'{$_vn}' đã thay đổi trạng thái", 'th' => "'{$_vn}' สถานะเปลี่ยนแปลง"], $lang);
                                return ['subject' => $subj, 'html' => emailTemplateVenueStatus($_vn, $_st, $siteUrl, $_nl, $lang)];
                            }
                        );
                    } catch (Exception $emailErr) {
                        error_log("Email error (venue_status): " . $emailErr->getMessage());
                    }
                } catch (Exception $e) {
                    // Don't block venue status update if notification fails
                }
            }

            echo json_encode(array("success" => true, "message" => "Venue status updated to " . $status));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update status."));
        }
    } catch (PDOException $e) {
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(array("success" => false, "message" => '서버 오류가 발생했습니다.'));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Missing parameters."));
}
?>