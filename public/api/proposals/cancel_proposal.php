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

if (!$data || !isset($data->proposal_id)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$proposal_id = intval($data->proposal_id);

// Fetch proposal
$stmt = $conn->prepare("SELECT * FROM distribution_proposals WHERE id = ?");
$stmt->execute([$proposal_id]);
$proposal = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$proposal) {
    echo json_encode(["success" => false, "message" => "제안을 찾을 수 없습니다."]);
    exit;
}

// Only vendor who sent it can cancel (or admin)
if ($role === 'vendor' && $proposal['vendor_id'] != $user_id) {
    echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
    exit;
}

if ($role !== 'vendor' && $role !== 'admin' && $role !== 'superadmin') {
    echo json_encode(["success" => false, "message" => "벤더만 제안을 취소할 수 있습니다."]);
    exit;
}

if ($proposal['status'] !== 'pending') {
    echo json_encode(["success" => false, "message" => "대기 중인 제안만 취소할 수 있습니다."]);
    exit;
}

$updateStmt = $conn->prepare("UPDATE distribution_proposals SET status = 'cancelled', updated_at = NOW() WHERE id = ?");
$updateStmt->execute([$proposal_id]);

// Notify seller
try {
    $vendor_name = $_SESSION['user_name'] ?? '벤더';
    $notifMsg = "{$vendor_name}님이 유통 제안을 취소했습니다: {$proposal['title']}";
    $notifLink = "/seller/proposals";

    $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'proposal_cancelled', ?, ?, NOW())");
    $notifStmt->execute([$proposal['seller_id'], $notifMsg, $notifLink]);
} catch (Exception $e) { /* ignore */
}

echo json_encode([
    "success" => true,
    "message" => "제안이 취소되었습니다."
]);
?>