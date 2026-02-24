<?php
@ini_set('upload_max_filesize', '100M');
@ini_set('post_max_size', '100M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', 300);

include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Create seller_photos table if not exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(200) DEFAULT '',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
    )");
} catch (PDOException $e) {
    // Table might already exist, continue
}

// Check current photo count (max 5)
$countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM seller_photos WHERE user_id = ?");
$countStmt->execute([$user_id]);
$count = $countStmt->fetch(PDO::FETCH_ASSOC)['cnt'];

if ($count >= 10) {
    echo json_encode(["success" => false, "message" => "최대 10장까지 업로드 가능합니다."]);
    exit;
}

if (!isset($_FILES['photo'])) {
    echo json_encode(["success" => false, "message" => "이미지가 업로드되지 않았습니다."]);
    exit;
}

$file = $_FILES['photo'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "업로드 에러: " . $file['error']]);
    exit;
}

// Validate file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, $allowed_types)) {
    echo json_encode(["success" => false, "message" => "허용되지 않는 파일 형식입니다. (JPG, PNG, GIF, WEBP만 가능)"]);
    exit;
}

// Validate file size (max 10MB)
if ($file['size'] > 10 * 1024 * 1024) {
    echo json_encode(["success" => false, "message" => "파일 크기는 10MB 이하만 가능합니다."]);
    exit;
}

// Create upload directory using DOCUMENT_ROOT for reliable absolute path
$doc_root = $_SERVER['DOCUMENT_ROOT'];
$target_dir = $doc_root . '/spacematch/uploads/seller_photos/';

// Fallback to relative path if DOCUMENT_ROOT fails
if (!$doc_root || $doc_root === '') {
    $target_dir = '../../uploads/seller_photos/';
}

if (!file_exists($target_dir)) {
    $created = @mkdir($target_dir, 0777, true);
    if (!$created) {
        error_log("[upload_seller_photos] Failed to create dir: $target_dir");
        $target_dir = '../../uploads/seller_photos/';
        if (!file_exists($target_dir)) {
            @mkdir($target_dir, 0777, true);
        }
    }
}

error_log("[upload_seller_photos] Upload dir: $target_dir | exists: " . (file_exists($target_dir) ? 'yes' : 'no'));

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = "seller_" . $user_id . "_" . time() . "_" . mt_rand(1000, 9999) . "." . $extension;
$target_file = $target_dir . $filename;

$caption = isset($_POST['caption']) ? htmlspecialchars(strip_tags(trim($_POST['caption']))) : '';

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    $web_path = "/spacematch/uploads/seller_photos/" . $filename;

    try {
        $stmt = $conn->prepare("INSERT INTO seller_photos (user_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $web_path, $caption, $count]);

        $photoId = $conn->lastInsertId();

        echo json_encode([
            "success" => true,
            "message" => "사진이 업로드되었습니다.",
            "photo" => [
                "id" => intval($photoId),
                "image_url" => $web_path,
                "caption" => $caption
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "파일 저장 중 오류가 발생했습니다."]);
}
?>