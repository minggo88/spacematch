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

    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->venue_id) && isset($data->venue_name)) {

        $seller_id = $_SESSION['user_id'];
        $seller_name = $_SESSION['user_name'] ?? 'Unknown User';
        // Fallback if session name missing

        $venue_id = $data->venue_id;
        $venue_name = $data->venue_name;
        $message = isset($data->message) ? trim($data->message) : '';
        $selected_period = isset($data->selected_period) ? json_encode($data->selected_period) : null;

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
        // We use silent try-catch blocks for individual alters to avoid crashing
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
                 (venue_id, user_id, seller_name, venue_name, message, selected_period, status, created_at) 
                 VALUES 
                 (:venue_id, :seller_id, :seller_name, :venue_name, :message, :selected_period, 'pending', NOW())";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(":venue_id", $venue_id);
        $stmt->bindParam(":seller_id", $seller_id);
        $stmt->bindParam(":seller_name", $seller_name);
        $stmt->bindParam(":venue_name", $venue_name);
        $stmt->bindParam(":message", $message);
        $stmt->bindParam(":selected_period", $selected_period);

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

                $notifMsg = $seller_name . "님이 새로운 입점 신청을 했습니다: " . $venue_name;
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
                    $vendorMsg = $seller_name . "님이 '{$venue_name}'에 입점 신청을 했습니다.";
                    $vendorLink = "/vendor/dashboard";
                    $notifStmt->bindValue(':uid', $ownerData['owner_id']);
                    $notifStmt->bindValue(':msg', $vendorMsg);
                    $notifStmt->bindValue(':link', $vendorLink);
                    $notifStmt->execute();
                }
            } catch (Exception $e) {
                error_log("SpaceMatch Notification Error (submit_application): " . $e->getMessage());
            }

            echo json_encode(["success" => true, "message" => "신청이 완료되었습니다."]);
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