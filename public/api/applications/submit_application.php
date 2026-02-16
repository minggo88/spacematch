<?php
// Enable Error Reporting for Debugging (will appear in JSON if possible, or HTML)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't output HTML errors, we want JSON

include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

// Error Handler to verify JSON output even on fatal errors
function jsonErrorHandler()
{
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        echo json_encode(["success" => false, "message" => "Fatal Error: " . $error['message']]);
    }
}
register_shutdown_function('jsonErrorHandler');

try {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
        exit;
    }

    // Support both JSON body and FormData (multipart)
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (strpos($contentType, 'multipart/form-data') !== false || !empty($_POST)) {
        // FormData submission (with file uploads)
        $venue_id = isset($_POST['venue_id']) ? $_POST['venue_id'] : null;
        $venue_name = isset($_POST['venue_name']) ? $_POST['venue_name'] : null;
        $message = isset($_POST['message']) ? trim($_POST['message']) : '';
        $selected_period = isset($_POST['selected_period']) ? $_POST['selected_period'] : null;
    } else {
        // JSON submission (legacy)
        $data = json_decode(file_get_contents("php://input"));
        $venue_id = isset($data->venue_id) ? $data->venue_id : null;
        $venue_name = isset($data->venue_name) ? $data->venue_name : null;
        $message = isset($data->message) ? trim($data->message) : '';
        $selected_period = isset($data->selected_period) ? json_encode($data->selected_period) : null;
    }

    if ($venue_id && $venue_name) {

        $seller_id = $_SESSION['user_id'];
        $seller_name = $_SESSION['user_name'] ?? 'Unknown User';

        // Handle attachment file uploads
        $attachment_paths = [];
        if (isset($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
            $attachDir = __DIR__ . '/../../uploads/app_attachments/';
            if (!is_dir($attachDir)) {
                mkdir($attachDir, 0777, true);
            }
            for ($i = 0; $i < count($_FILES['attachments']['name']); $i++) {
                if ($_FILES['attachments']['error'][$i] === UPLOAD_ERR_OK) {
                    $origName = basename($_FILES['attachments']['name'][$i]);
                    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
                    // Block video files
                    $videoExts = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'm4v', '3gp', 'mpeg', 'mpg', 'ts', 'vob'];
                    if (in_array($ext, $videoExts)) {
                        continue; // skip video files
                    }
                    $uniqueName = 'app_' . time() . '_' . $i . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                    $destPath = $attachDir . $uniqueName;
                    if (move_uploaded_file($_FILES['attachments']['tmp_name'][$i], $destPath)) {
                        $attachment_paths[] = 'uploads/app_attachments/' . $uniqueName;
                    }
                }
            }
        }
        $attachments_json = json_encode($attachment_paths);

        // 1. Ensure Table Exists (Safe Check)
        $createTableSQL = "CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            venue_id INT NOT NULL,
            user_id INT NOT NULL,
            seller_name VARCHAR(255),
            venue_name VARCHAR(255),
            message TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $conn->exec($createTableSQL);

        // 2. Ensure Columns Exist (Safe Alter - Ignore Errors)
        $columns_to_check = ['user_id', 'seller_name', 'venue_name', 'message'];
        foreach ($columns_to_check as $col) {
            try {
                $type = ($col == 'user_id') ? 'INT(11)' : ($col == 'message' ? 'TEXT' : 'VARCHAR(255)');
                $conn->exec("ALTER TABLE applications ADD COLUMN $col $type");
            } catch (Exception $e) {
                // Column likely exists, continue
            }
        }

        // Auto-migrate: add selected_period column
        try {
            $conn->exec("ALTER TABLE applications ADD COLUMN selected_period TEXT DEFAULT NULL");
        } catch (Exception $e) {
            // Column likely exists
        }

        // Auto-migrate: add attachments column
        try {
            $conn->exec("ALTER TABLE applications ADD COLUMN attachments TEXT DEFAULT NULL");
        } catch (Exception $e) {
            // Column likely exists
        }

        // Auto-migrate: add is_priority column
        try {
            $conn->exec("ALTER TABLE applications ADD COLUMN is_priority TINYINT(1) DEFAULT 0");
        } catch (Exception $e) {
            // Column likely exists
        }

        // Auto-create fasttrack_usage table
        try {
            $conn->exec("CREATE TABLE IF NOT EXISTS fasttrack_usage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                application_id INT NOT NULL,
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (user_id),
                INDEX (used_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        } catch (Exception $e) {
        }

        // Determine Fast Track status
        $use_fasttrack = 0;
        if (strpos($contentType, 'multipart/form-data') !== false || !empty($_POST)) {
            $use_fasttrack = intval($_POST['use_fasttrack'] ?? 0);
        } else {
            $use_fasttrack = intval($data->use_fasttrack ?? 0);
        }

        $is_priority = 0;
        $fasttrack_message = '';

        if ($use_fasttrack) {
            // Check user_services for active priority_application permission
            try {
                // Auto-migrate columns
                try {
                    $conn->exec("ALTER TABLE user_services ADD COLUMN auto_apply TINYINT(1) DEFAULT 0");
                } catch (Exception $e) {
                }
                try {
                    $conn->exec("ALTER TABLE user_services ADD COLUMN monthly_limit INT DEFAULT 0");
                } catch (Exception $e) {
                }

                $svcStmt = $conn->prepare("SELECT enabled, start_date, end_date, monthly_limit FROM user_services WHERE user_id = ? AND service = 'priority_application'");
                $svcStmt->execute([$seller_id]);
                $svcRow = $svcStmt->fetch(PDO::FETCH_ASSOC);

                if ($svcRow && $svcRow['enabled']) {
                    $now = date('Y-m-d');
                    $dateValid = true;
                    if ($svcRow['end_date'] && $now > $svcRow['end_date'])
                        $dateValid = false;
                    if ($svcRow['start_date'] && $now < $svcRow['start_date'])
                        $dateValid = false;

                    if ($dateValid) {
                        $monthlyLimit = intval($svcRow['monthly_limit'] ?? 0);

                        if ($monthlyLimit > 0) {
                            // Check this month's usage
                            $monthStart = date('Y-m-01');
                            $usageStmt = $conn->prepare("SELECT COUNT(*) FROM fasttrack_usage WHERE user_id = ? AND used_at >= ?");
                            $usageStmt->execute([$seller_id, $monthStart]);
                            $monthUsed = intval($usageStmt->fetchColumn());

                            if ($monthUsed < $monthlyLimit) {
                                $is_priority = 1;
                            } else {
                                $fasttrack_message = '이번 달 패스트트랙 사용 횟수를 초과했습니다.';
                            }
                        } else {
                            // No monthly limit = unlimited
                            $is_priority = 1;
                        }
                    }
                }
            } catch (Exception $e) { /* ignore */
            }
        }

        // 3. Insert Application

        // Check for duplicates first
        $checkQuery = "SELECT COUNT(*) FROM applications WHERE venue_id = :venue_id AND user_id = :seller_id";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(":venue_id", $venue_id);
        $checkStmt->bindParam(":seller_id", $seller_id);
        $checkStmt->execute();

        if ($checkStmt->fetchColumn() > 0) {
            echo json_encode(["success" => false, "message" => "이미 신청 완료된 공고입니다."]);
            exit;
        }
        $query = "INSERT INTO applications 
                 (venue_id, user_id, seller_name, venue_name, message, selected_period, attachments, is_priority, status, created_at) 
                 VALUES 
                 (:venue_id, :seller_id, :seller_name, :venue_name, :message, :selected_period, :attachments, :is_priority, 'pending', NOW())";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(":venue_id", $venue_id);
        $stmt->bindParam(":seller_id", $seller_id);
        $stmt->bindParam(":seller_name", $seller_name);
        $stmt->bindParam(":venue_name", $venue_name);
        $stmt->bindParam(":message", $message);
        $stmt->bindParam(":selected_period", $selected_period);
        $stmt->bindParam(":attachments", $attachments_json);
        $stmt->bindParam(":is_priority", $is_priority);

        if ($stmt->execute()) {

            // [NOTIFICATION] Notify Admins and Venue Owner
            try {
                // Ensure notifications table
                $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                    message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                // Find all admins
                $adminQuery = "SELECT id FROM users WHERE role IN ('admin', 'superadmin')";
                $admins = $conn->query($adminQuery)->fetchAll(PDO::FETCH_ASSOC);

                $priorityPrefix = $is_priority ? '⚡ [우선 신청] ' : '';
                $notifMsg = $priorityPrefix . $seller_name . "님이 새로운 입점 신청을 했습니다: " . $venue_name;
                $notifLink = "/admin/applications";

                $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (:uid, 'application_new', :msg, :link, NOW())";
                $notifStmt = $conn->prepare($notifSql);

                foreach ($admins as $admin) {
                    $notifStmt->bindValue(':uid', $admin['id']);
                    $notifStmt->bindValue(':msg', $notifMsg);
                    $notifStmt->bindValue(':link', $notifLink);
                    $notifStmt->execute();
                }

                // Also notify venue owner (vendor)
                $ownerQuery = "SELECT owner_id FROM venues WHERE id = ?";
                $ownerStmt = $conn->prepare($ownerQuery);
                $ownerStmt->execute([$venue_id]);
                $ownerData = $ownerStmt->fetch(PDO::FETCH_ASSOC);
                if ($ownerData && $ownerData['owner_id']) {
                    $vendorMsg = $priorityPrefix . $seller_name . "님이 '{$venue_name}'에 입점 신청을 했습니다.";
                    $vendorLink = "/vendor/dashboard";
                    $notifStmt->bindValue(':uid', $ownerData['owner_id']);
                    $notifStmt->bindValue(':msg', $vendorMsg);
                    $notifStmt->bindValue(':link', $vendorLink);
                    $notifStmt->execute();
                }
            } catch (Exception $e) {
                error_log("SpaceMatch Notification Error (submit_application): " . $e->getMessage());
            }

            // Record fasttrack usage if used
            if ($is_priority) {
                try {
                    $appId = $conn->lastInsertId();
                    $usageInsert = $conn->prepare("INSERT INTO fasttrack_usage (user_id, application_id, used_at) VALUES (?, ?, NOW())");
                    $usageInsert->execute([$seller_id, $appId]);
                } catch (Exception $e) {
                    error_log("FastTrack Usage Recording Error: " . $e->getMessage());
                }
            }

            $responseMsg = "신청이 완료되었습니다.";
            if ($is_priority) {
                $responseMsg = "⚡ 패스트트랙으로 신청이 완료되었습니다.";
            } elseif ($fasttrack_message) {
                $responseMsg = "신청이 완료되었습니다. (" . $fasttrack_message . ")";
            }

            echo json_encode(["success" => true, "message" => $responseMsg, "is_priority" => $is_priority]);
        } else {
            $err = $stmt->errorInfo();
            echo json_encode(["success" => false, "message" => "DB Error: " . $err[2]]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "데이터가 불충분합니다."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "System Error: " . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "General Error: " . $e->getMessage()]);
}
?>