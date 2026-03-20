<?php
/**
 * upload_image.php — 이메일 마케팅용 이미지 업로드
 * POST: multipart/form-data { image: file }
 * Returns: { success: true, url: "/uploads/email/filename.jpg" }
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => '이미지 파일이 필요합니다.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES['image'];
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => '파일 업로드 오류'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!in_array($file['type'], $allowed)) {
    echo json_encode(['success' => false, 'message' => 'JPG, PNG, GIF, WebP만 업로드 가능합니다.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => '파일 크기는 5MB 이하여야 합니다.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Create upload directory
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/email/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'email_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$filepath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $filepath)) {
    $url = '/uploads/email/' . $filename;
    echo json_encode([
        'success' => true,
        'url' => $url,
        'full_url' => 'https://spacematch.net' . $url,
        'filename' => $filename
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['success' => false, 'message' => '파일 저장 실패'], JSON_UNESCAPED_UNICODE);
}
?>