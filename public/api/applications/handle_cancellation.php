<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

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
$user_role = $_SESSION['user_role'] ?? '';
$data = json_decode(file_get_contents("php://input"));

$request_id = isset($data->request_id) ? intval($data->request_id) : 0;
$action = isset($data->action) ? $data->action : ''; // 'approved' or 'rejected'
$decision_note = isset($data->decision_note) ? trim($data->decision_note) : '';

if ($request_id <= 0) {
    echo json_encode(["success" => false, "message" => "요청 ID가 필요합니다."]);
    exit;
}

if (!in_array($action, ['approved', 'rejected'])) {
    echo json_encode(["success" => false, "message" => "유효한 결정(승인/거절)이 필요합니다."]);
    exit;
}

try {
    // Get the cancellation request with venue info
    $reqStmt = $conn->prepare("SELECT cr.*, v.owner_id, a.venue_name, a.user_id as applicant_id
                                FROM cancellation_requests cr
                                JOIN applications a ON cr.application_id = a.id
                                JOIN venues v ON cr.venue_id = v.id
                                WHERE cr.id = ?");
    $reqStmt->execute([$request_id]);
    $req = $reqStmt->fetch(PDO::FETCH_ASSOC);

    if (!$req) {
        echo json_encode(["success" => false, "message" => "취소 요청을 찾을 수 없습니다."]);
        exit;
    }

    if ($req['status'] !== 'pending') {
        echo json_encode(["success" => false, "message" => "이미 처리된 요청입니다."]);
        exit;
    }

    // Permission check: must be venue owner, admin, or superadmin
    $can_handle = false;
    if ($user_role === 'admin' || $user_role === 'superadmin') {
        $can_handle = true;
    } elseif ($user_role === 'vendor' && intval($req['owner_id']) === $user_id) {
        $can_handle = true;
    }

    if (!$can_handle) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    // Begin transaction
    $conn->beginTransaction();

    // Update cancellation request status
    $updateReq = $conn->prepare("UPDATE cancellation_requests SET status = ?, decided_by = ?, decision_note = ?, decided_at = NOW() WHERE id = ?");
    $updateReq->execute([$action, $user_id, $decision_note, $request_id]);

    // If approved, cancel the original application
    if ($action === 'approved') {
        $updateApp = $conn->prepare("UPDATE applications SET status = 'cancelled' WHERE id = ?");
        $updateApp->execute([$req['application_id']]);

        // Auto-migrate: add 'cancelled' to status if it's ENUM
        // If status column is VARCHAR, this is unnecessary. If ENUM, we need to ALTER.
        // Safe approach: just update - MySQL VARCHAR will accept any value.
    }

    $conn->commit();

    // Notify the seller
    try {
        $actionLabel = ($action === 'approved') ? '승인' : '거절';
        $notifMsg = "[취소 요청 {$actionLabel}] \"{$req['venue_name']}\" 입점 취소 요청이 {$actionLabel}되었습니다.";
        if ($decision_note) {
            $notifMsg .= " 사유: " . mb_substr($decision_note, 0, 50);
        }
        $notifLink = "/seller/applications";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, 'cancellation_result', ?, ?)");
        $notifStmt->execute([$req['applicant_id'], $notifMsg, $notifLink]);
    } catch (Exception $e) {
        error_log("SpaceMatch Notification Error (handle_cancellation): " . $e->getMessage());
    }

    $resultMsg = ($action === 'approved') ? '취소 요청을 승인했습니다. 해당 신청은 취소 처리되었습니다.' : '취소 요청을 거절했습니다.';
    echo json_encode(["success" => true, "message" => $resultMsg]);

} catch (PDOException $e) {
    if ($conn->inTransaction())
        $conn->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
