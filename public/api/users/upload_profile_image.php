<?php
// Increase PHP limits for uploads
@ini_set('upload_max_filesize', '100M');
@ini_set('post_max_size', '100M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', 300);

include_once '../db_connect.php';

session_start();

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Debug log
error_log("=== Profile Image Upload ===");
error_log("FILES keys: " . implode(', ', array_keys($_FILES)));
error_log("SESSION user_id: " . $_SESSION['user_id']);

if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    echo json_encode(["success" => false, "message" => "No image file received."]);
    exit;
}

$file = $_FILES['image'];
$user_id = $_SESSION['user_id'];

// Check for upload errors with detailed messages
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => "Server max file size exceeded",
        UPLOAD_ERR_FORM_SIZE => "Form max file size exceeded",
        UPLOAD_ERR_PARTIAL => "File partially uploaded",
        UPLOAD_ERR_NO_TMP_DIR => "No temp folder",
        UPLOAD_ERR_CANT_WRITE => "Disk write failed",
        UPLOAD_ERR_EXTENSION => "Stopped by PHP extension"
    ];
    $msg = isset($errors[$file['error']]) ? $errors[$file['error']] : "Unknown error";
    error_log("Upload error code: " . $file['error'] . " - " . $msg);
    echo json_encode(["success" => false, "message" => "Upload error: " . $msg]);
    exit;
}

// No file size limit at all

// Extension check only (no finfo dependency)
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif', 'svg'])) {
    echo json_encode(["success" => false, "message" => "Only image files are allowed."]);
    exit;
}

// Create upload directory - use absolute path based on DOCUMENT_ROOT
$doc_root = $_SERVER['DOCUMENT_ROOT'];

// Auto-detect app base path from current script location
// Script: /spacematch/api/users/upload_profile_image.php -> app base: /spacematch
// Script: /api/users/upload_profile_image.php -> app base: (empty)
$script_dir = dirname($_SERVER['SCRIPT_NAME']); // e.g. /spacematch/api/users or /api/users
$app_base = dirname(dirname($script_dir)); // go up 2 levels -> /spacematch or /
if ($app_base === '/' || $app_base === '\\')
    $app_base = '';

error_log("DOCUMENT_ROOT: " . $doc_root);
error_log("SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME']);
error_log("Detected app_base: " . $app_base);

// Absolute filesystem path for upload
$upload_base = $doc_root . $app_base . '/uploads/profiles/';
error_log("Upload directory: " . $upload_base);

if (!file_exists($upload_base)) {
    if (!@mkdir($upload_base, 0755, true)) {
        error_log("Failed to create directory: " . $upload_base);
        // Try alternative path
        $upload_base = dirname(dirname(__DIR__)) . '/uploads/profiles/';
        error_log("Trying alternative path: " . $upload_base);
        if (!file_exists($upload_base)) {
            @mkdir($upload_base, 0755, true);
        }
    }
}

// Generate unique filename
$filename = "profile_" . $user_id . "_" . time() . "_" . mt_rand(1000, 9999) . "." . $extension;
$target_file = $upload_base . $filename;

error_log("Target file: " . $target_file);

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $target_file)) {
    // Web-accessible URL path
    $web_path = $app_base . "/uploads/profiles/" . $filename;
    error_log("Web path: " . $web_path);

    try {
        // Ensure profile_image column exists
        try {
            $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'profile_image'");
            if (!$chk->fetch()) {
                $conn->exec("ALTER TABLE users ADD COLUMN profile_image VARCHAR(500) DEFAULT NULL");
            }
        } catch (Exception $e) {
            // Column likely exists
        }

        // Update database
        $stmt = $conn->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
        $stmt->execute([$web_path, $user_id]);

        // Update session
        $_SESSION['user_profile_image'] = $web_path;

        error_log("SUCCESS: Profile image updated to " . $web_path);

        echo json_encode([
            "success" => true,
            "message" => "Profile image uploaded.",
            "imageUrl" => $web_path
        ]);
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
} else {
    $err = error_get_last();
    error_log("move_uploaded_file FAILED: " . print_r($err, true));
    error_log("From: " . $file['tmp_name'] . " To: " . $target_file);

    // Check if tmp file exists
    error_log("tmp_name exists: " . (file_exists($file['tmp_name']) ? 'YES' : 'NO'));
    error_log("target dir exists: " . (file_exists($upload_base) ? 'YES' : 'NO'));
    error_log("target dir writable: " . (is_writable($upload_base) ? 'YES' : 'NO'));

    echo json_encode([
        "success" => false,
        "message" => "File save failed. Check directory permissions. (writable: " . (is_writable($upload_base) ? 'Y' : 'N') . ", exists: " . (file_exists($upload_base) ? 'Y' : 'N') . ")"
    ]);
}
?>