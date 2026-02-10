<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Only allow logged-in users to update their own profile
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];

if (!$data) {
    echo json_encode(["success" => false, "message" => "잘못된 요청입니다."]);
    exit;
}

try {
    $updates = [];
    $params = [];

    // Allowed fields for self-update
    if (isset($data->name) && !empty(trim($data->name))) {
        $updates[] = "name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->name)));
    }

    if (isset($data->phone)) {
        $updates[] = "phone = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->phone)));
    }

    if (isset($data->description)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'description'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN description TEXT DEFAULT NULL");
        }
        $updates[] = "description = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->description)));
    }

    if (isset($data->category)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'category'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN category VARCHAR(100) DEFAULT NULL");
        }
        $updates[] = "category = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->category)));
    }

    if (isset($data->instagram)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN instagram VARCHAR(255) DEFAULT NULL");
        }
        $updates[] = "instagram = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->instagram)));
    }

    if (isset($data->brandName)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'brand_name'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN brand_name VARCHAR(255) DEFAULT NULL");
        }
        $updates[] = "brand_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->brandName)));
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "수정할 내용이 없습니다."]);
        exit;
    }

    $params[] = $user_id;
    $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    // Fetch updated user data to return
    $base_cols = "id, name, email, role, status, phone, business_no, profile_image, venue_limit";
    $opt_cols = ['category', 'instagram', 'description', 'brand_name', 'real_name'];
    foreach ($opt_cols as $oc) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$oc}'");
        if ($chk->fetch())
            $base_cols .= ", {$oc}";
    }

    $fetch = $conn->prepare("SELECT {$base_cols} FROM users WHERE id = ?");
    $fetch->execute([$user_id]);
    $updatedUser = $fetch->fetch(PDO::FETCH_ASSOC);

    // Update ALL session variables to stay in sync
    $_SESSION['user_name'] = $updatedUser['name'];
    $_SESSION['user_role'] = $updatedUser['role'];
    $_SESSION['user_email'] = $updatedUser['email'];
    // Refresh session lifetime on profile update
    session_regenerate_id(false);

    echo json_encode([
        "success" => true,
        "message" => "프로필이 수정되었습니다.",
        "user" => $updatedUser
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>