<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
if (strlen($q) < 1) {
    echo json_encode(["success" => true, "users" => []]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, name, role, profile_image FROM users WHERE name LIKE ? AND id != ? ORDER BY name LIMIT 10");
    $stmt->execute(['%' . $q . '%', $_SESSION['user_id']]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as &$u) {
        $u['id'] = intval($u['id']);
    }

    echo json_encode(["success" => true, "users" => $users]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>