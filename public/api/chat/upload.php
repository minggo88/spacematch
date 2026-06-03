<?php
/**
 * Chat File Upload API
 * 
 * POST /api/chat/upload.php
 * Form data: conversation_id, file (multipart)
 * Supports: images (jpg,png,gif,webp), videos (mp4,mov), files (pdf,doc,xlsx,etc)
 * Max size: 50MB
 */

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

$user_id = intval($_SESSION['user_id']);
$convId = intval($_POST['conversation_id'] ?? 0);

if ($convId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
    exit;
}

// Check participant (admin can access any CS conversation)
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$user_id]);
$uploaderRole = $roleStmt->fetchColumn();
$isAdmin = in_array($uploaderRole, ['admin', 'superadmin']);

if ($isAdmin) {
    // Admins can upload to any CS conversation
    $checkStmt = $conn->prepare("SELECT id, type FROM chat_conversations WHERE id = ?");
    $checkStmt->execute([$convId]);
    $convRow = $checkStmt->fetch(PDO::FETCH_ASSOC);
    if (!$convRow || $convRow['type'] !== 'cs') {
        // For non-CS conversations, still check participant
        $checkStmt2 = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND (participant_1 = ? OR participant_2 = ?)");
        $checkStmt2->execute([$convId, $user_id, $user_id]);
        if (!$checkStmt2->fetch()) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
            exit;
        }
    }
} else {
    $checkStmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND (participant_1 = ? OR participant_2 = ?)");
    $checkStmt->execute([$convId, $user_id, $user_id]);
    if (!$checkStmt->fetch()) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "파일 업로드에 실패했습니다."]);
    exit;
}

$file = $_FILES['file'];
// No file size limit — rely on PHP ini settings (upload_max_filesize, post_max_size)

// Determine file type
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$videoExts = ['mp4', 'mov', 'avi', 'webm'];
$allowedExts = array_merge($imageExts, $videoExts, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar']);

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "지원하지 않는 파일 형식입니다."]);
    exit;
}

$messageType = 'file';
if (in_array($ext, $imageExts))
    $messageType = 'image';
if (in_array($ext, $videoExts))
    $messageType = 'video';

// Create upload directory
// dirname(__DIR__) = public/api/chat → public/api
// dirname(dirname(__DIR__)) = public/api → public  (web root)
$uploadDir = dirname(dirname(__DIR__)) . '/uploads/chat/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "업로드 디렉토리를 생성할 수 없습니다."]);
        exit;
    }
}

// Generate unique filename
$uniqueName = uniqid('chat_') . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "파일 저장에 실패했습니다."]);
    exit;
}

$fileUrl = '/uploads/chat/' . $uniqueName;
$fileName = $file['name'];
$fileSize = $file['size'];

// Get user language
$langStmt = $conn->prepare("SELECT country FROM users WHERE id = ?");
$langStmt->execute([$user_id]);
$userLang = $langStmt->fetchColumn() ?: 'ko';

// Optional caption text
$caption = trim($_POST['caption'] ?? '');

// Insert message
$insertStmt = $conn->prepare("
    INSERT INTO chat_messages (conversation_id, sender_id, message_type, original_text, original_lang, file_url, file_name, file_size)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$insertStmt->execute([
    $convId,
    $user_id,
    $messageType,
    !empty($caption) ? $caption : $fileName,
    $userLang,
    $fileUrl,
    $fileName,
    $fileSize
]);
$msgId = intval($conn->lastInsertId());

// Update conversation
$updateStmt = $conn->prepare("UPDATE chat_conversations SET last_message_at = NOW() WHERE id = ?");
$updateStmt->execute([$convId]);

// Get inserted message
$getStmt = $conn->prepare("
    SELECT m.*, u.name as sender_name, u.profile_image as sender_profile_image, u.country as sender_country
    FROM chat_messages m
    LEFT JOIN users u ON u.id = m.sender_id
    WHERE m.id = ?
");
$getStmt->execute([$msgId]);
$message = $getStmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "message" => $message
]);
?>