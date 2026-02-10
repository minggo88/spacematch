<?php
include_once '../db_connect.php';
session_start();

// Allow admin, superadmin, or vendor
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin', 'vendor'])) {
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
        // Check ownership for vendors
        if ($user_role === 'vendor') {
            $ownerCheck = $conn->prepare("SELECT owner_id FROM venues WHERE id = ?");
            $ownerCheck->execute([$venue_id]);
            $owner = $ownerCheck->fetchColumn();

            if ($owner === false) {
                echo json_encode(array("success" => false, "message" => "존재하지 않는 베뉴입니다."));
                exit;
            }

            if (intval($owner) !== intval($user_id)) {
                http_response_code(403);
                echo json_encode(array("success" => false, "message" => "본인이 등록한 베뉴만 삭제할 수 있습니다."));
                exit;
            }

            // Vendor restriction: cannot delete if recruitment closed or approved sellers exist
            $rcCheck = $conn->prepare("SELECT recruitment_closed FROM venues WHERE id = ?");
            $rcCheck->execute([$venue_id]);
            $rcVal = $rcCheck->fetchColumn();
            if (intval($rcVal) === 1) {
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

        // Delete related applications first
        try {
            $delApps = $conn->prepare("DELETE FROM applications WHERE venue_id = ?");
            $delApps->execute([$venue_id]);
        } catch (PDOException $e) {
            // applications table may not exist
        }

        // Delete the venue
        $query = "DELETE FROM venues WHERE id = ?";
        $stmt = $conn->prepare($query);

        if ($stmt->execute([$venue_id])) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(array("success" => true, "message" => "베뉴가 삭제되었습니다."));
            } else {
                echo json_encode(array("success" => false, "message" => "삭제할 베뉴를 찾을 수 없습니다."));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "삭제에 실패했습니다."));
        }
    } catch (PDOException $e) {
        echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("success" => false, "message" => "베뉴 ID가 필요합니다."));
}
?>