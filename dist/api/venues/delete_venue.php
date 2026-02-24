<?php
// Delete venue → Move to trash
include_once '../db_connect.php';
session_start();

// Allow admin, superadmin, or vendor
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin', 'host'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "권한이 없습니다."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $venue_id = intval($data->id);
    $user_id = $_SESSION['user_id'];
    $user_role = $_SESSION['user_role'];

    try {
        // Auto-create trash_bin table
        $conn->exec("CREATE TABLE IF NOT EXISTS trash_bin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            table_name VARCHAR(100) NOT NULL,
            record_id VARCHAR(100) NOT NULL,
            item_label VARCHAR(255) DEFAULT '',
            record_data JSON NULL,
            deleted_by INT NULL,
            deleted_by_name VARCHAR(100) DEFAULT '',
            deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_table (table_name),
            INDEX idx_deleted_at (deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // Fetch venue data
        $venueStmt = $conn->prepare("SELECT * FROM venues WHERE id = ?");
        $venueStmt->execute([$venue_id]);
        $venue = $venueStmt->fetch(PDO::FETCH_ASSOC);

        if (!$venue) {
            echo json_encode(array("success" => false, "message" => "존재하지 않는 베뉴입니다."));
            exit;
        }

        // Check ownership for hosts
        if ($user_role === 'host') {
            if (intval($venue['owner_id']) !== intval($user_id)) {
                http_response_code(403);
                echo json_encode(array("success" => false, "message" => "본인이 등록한 베뉴만 삭제할 수 있습니다."));
                exit;
            }

            // Vendor restriction: cannot delete if recruitment closed or approved sellers exist
            if (intval($venue['recruitment_closed'] ?? 0) === 1) {
                echo json_encode(array("success" => false, "message" => "모집이 마감된 공간은 삭제할 수 없습니다. 삭제가 필요한 경우 관리자에게 문의하세요."));
                exit;
            }

            try {
                $appCheck = $conn->prepare("SELECT COUNT(*) FROM applications WHERE venue_id = ? AND status = 'approved'");
                $appCheck->execute([$venue_id]);
                $approvedCount = intval($appCheck->fetchColumn());
                if ($approvedCount > 0) {
                    echo json_encode(array("success" => false, "message" => "승인된 입점 신청이 있는 공간은 삭제할 수 없습니다. 삭제가 필요한 경우 관리자에게 문의하세요."));
                    exit;
                }
            } catch (PDOException $e) {
                // applications table may not exist yet
            }
        }

        // Collect related applications data
        $applications = [];
        try {
            $appStmt = $conn->prepare("SELECT * FROM applications WHERE venue_id = ?");
            $appStmt->execute([$venue_id]);
            $applications = $appStmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) { /* ignore */
        }

        // Build complete record data
        $record_data = $venue;
        $record_data['_applications'] = $applications;

        // Move to trash
        $insertTrash = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (:tn, :ri, :il, :rd, :db, :dn)");
        $insertTrash->execute([
            ':tn' => 'venues',
            ':ri' => $venue_id,
            ':il' => $venue['name'] ?? '베뉴 #' . $venue_id,
            ':rd' => json_encode($record_data, JSON_UNESCAPED_UNICODE),
            ':db' => $user_id,
            ':dn' => $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'Unknown',
        ]);

        // Delete related applications
        try {
            $delApps = $conn->prepare("DELETE FROM applications WHERE venue_id = ?");
            $delApps->execute([$venue_id]);
        } catch (PDOException $e) { /* ignore */
        }

        // Delete the venue
        $stmt = $conn->prepare("DELETE FROM venues WHERE id = ?");
        $stmt->execute([$venue_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => true, "message" => "베뉴가 휴지통으로 이동되었습니다."));
        } else {
            echo json_encode(array("success" => false, "message" => "삭제할 베뉴를 찾을 수 없습니다."));
        }
    } catch (PDOException $e) {
        echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("success" => false, "message" => "베뉴 ID가 필요합니다."));
}
?>