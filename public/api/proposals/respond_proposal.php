<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'];

$data = json_decode(file_get_contents('php://input'));

if (!$data || !isset($data->proposal_id) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$proposal_id = intval($data->proposal_id);
$action = $data->action; // 'accept' or 'reject'
$seller_note = isset($data->seller_note) ? trim($data->seller_note) : '';

if (!in_array($action, ['accept', 'reject'])) {
    echo json_encode(["success" => false, "message" => "유효하지 않은 액션입니다."]);
    exit;
}

// Fetch the proposal
$stmt = $conn->prepare("SELECT * FROM distribution_proposals WHERE id = ?");
$stmt->execute([$proposal_id]);
$proposal = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$proposal) {
    echo json_encode(["success" => false, "message" => "제안을 찾을 수 없습니다."]);
    exit;
}

// Only seller can respond (or admin)
if ($role === 'seller' && $proposal['seller_id'] != $user_id) {
    echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
    exit;
}

if ($role !== 'seller' && $role !== 'admin' && $role !== 'superadmin') {
    echo json_encode(["success" => false, "message" => "셀러만 제안에 응답할 수 있습니다."]);
    exit;
}

if ($proposal['status'] !== 'pending') {
    echo json_encode(["success" => false, "message" => "이미 처리된 제안입니다."]);
    exit;
}

$new_status = ($action === 'accept') ? 'accepted' : 'rejected';

$updateStmt = $conn->prepare("UPDATE distribution_proposals SET status = ?, seller_note = ?, responded_at = NOW(), updated_at = NOW() WHERE id = ?");
$updateStmt->execute([$new_status, $seller_note, $proposal_id]);

// Send notification to vendor
try {
    $seller_name = $_SESSION['user_name'] ?? '셀러';
    $status_text = ($action === 'accept') ? '수락' : '거절';
    $notifMsg = "{$seller_name}님이 유통 제안을 {$status_text}했습니다: {$proposal['title']}";
    $notifLink = "/vendor/proposals";

    $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'proposal_response', ?, ?, NOW())");
    $notifStmt->execute([$proposal['vendor_id'], $notifMsg, $notifLink]);
} catch (Exception $e) { /* ignore */
}

echo json_encode([
    "success" => true,
    "message" => ($action === 'accept') ? "제안을 수락했습니다." : "제안을 거절했습니다.",
    "status" => $new_status
]);
?>