<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Admin/Superadmin only
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id)) {
    echo json_encode(["success" => false, "message" => "사용자 ID가 필요합니다."]);
    exit;
}

$user_id = intval($data->user_id);

try {
    // Get current user info
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "사용자를 찾을 수 없습니다."]);
        exit;
    }

    // Protect superadmin
    if ($user['role'] === 'superadmin') {
        echo json_encode(["success" => false, "message" => "슈퍼 관리자는 수정할 수 없습니다."]);
        exit;
    }

    // Build dynamic UPDATE
    $updates = [];
    $params = [];

    if (isset($data->name) && !empty($data->name)) {
        $updates[] = "name = ?";
        $params[] = htmlspecialchars(strip_tags($data->name));
    }
    if (isset($data->email)) {
        $updates[] = "email = ?";
        $params[] = htmlspecialchars(strip_tags($data->email));
    }
    if (isset($data->phone)) {
        $updates[] = "phone = ?";
        $params[] = htmlspecialchars(strip_tags($data->phone));
    }

    // Check optional columns
    if (isset($data->category)) {
        $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'category'");
        if ($col_check->fetch()) {
            $updates[] = "category = ?";
            $params[] = htmlspecialchars(strip_tags($data->category));
        }
    }
    if (isset($data->instagram)) {
        $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
        if ($col_check->fetch()) {
            $updates[] = "instagram = ?";
            $params[] = htmlspecialchars(strip_tags($data->instagram));
        }
    }
    if (isset($data->description)) {
        $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'description'");
        if ($col_check->fetch()) {
            $updates[] = "description = ?";
            $params[] = htmlspecialchars(strip_tags($data->description));
        }
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "수정할 내용이 없습니다."]);
        exit;
    }

    $params[] = $user_id;
    $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    echo json_encode(["success" => true, "message" => "사용자 정보가 수정되었습니다."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>