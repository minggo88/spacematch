<?php
/**
 * Find Email API
 * POST /api/auth/find_email.php
 * Body: { "name": "홍길동", "phone": "010-1234-5678" }
 * Response: { "success": true, "email": "te***@gmail.com" }
 */
include_once '../db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || !isset($data->phone)) {
    echo json_encode(["success" => false, "message" => "이름과 연락처를 입력해주세요."]);
    exit;
}

$name = htmlspecialchars(strip_tags($data->name));
$phone = htmlspecialchars(strip_tags($data->phone));

try {
    // Try matching with real_name first, then name
    $stmt = $conn->prepare("SELECT email FROM users WHERE (real_name = ? OR name = ?) AND phone = ? LIMIT 1");
    $stmt->execute([$name, $name, $phone]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $email = $row['email'];

        // Mask email: show first 2 chars + *** + @domain
        $parts = explode('@', $email);
        if (strlen($parts[0]) <= 2) {
            $masked = $parts[0] . '***@' . $parts[1];
        } else {
            $masked = substr($parts[0], 0, 2) . '***@' . $parts[1];
        }

        echo json_encode(["success" => true, "email" => $masked]);
    } else {
        echo json_encode(["success" => false, "message" => "일치하는 회원 정보를 찾을 수 없습니다."]);
    }
} catch (PDOException $e) {
    error_log("FindEmail Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
}
?>