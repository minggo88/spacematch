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
$data = json_decode(file_get_contents("php://input"));
$application_id = isset($data->id) ? intval($data->id) : 0;

if ($application_id <= 0) {
    echo json_encode(["success" => false, "message" => "신청 ID가 필요합니다."]);
    exit;
}

try {
    // Verify the application belongs to this seller
    $checkStmt = $conn->prepare("SELECT id, status FROM applications WHERE id = ? AND user_id = ?");
    $checkStmt->execute([$application_id, $user_id]);
    $app = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$app) {
        echo json_encode(["success" => false, "message" => "해당 신청을 찾을 수 없거나 권한이 없습니다."]);
        exit;
    }

    // Block direct cancellation of approved applications
    if ($app['status'] === 'approved') {
        echo json_encode([
            "success" => false,
            "message" => "승인된 신청은 직접 취소할 수 없습니다. '취소 요청'을 통해 호스트의 승인을 받아야 합니다.",
            "require_cancellation_request" => true
        ]);
        exit;
    }

    // Delete the application (only pending/rejected)
    $deleteStmt = $conn->prepare("DELETE FROM applications WHERE id = ? AND user_id = ?");
    $deleteStmt->execute([$application_id, $user_id]);

    echo json_encode([
        "success" => true,
        "message" => "신청이 취소되었습니다."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
