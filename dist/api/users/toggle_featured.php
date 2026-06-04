<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Only admin/superadmin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Admin privileges required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->user_id)) {
    echo json_encode(["success" => false, "message" => "user_id is required."]);
    exit;
}

$user_id = intval($data->user_id);
$featured = isset($data->is_featured) ? intval($data->is_featured) : 0;
$start_date = isset($data->start_date) && $data->start_date ? $data->start_date : null;
$end_date = isset($data->end_date) && $data->end_date ? $data->end_date : null;

try {
    // Ensure columns exist
    $cols_to_add = [
        'is_featured' => 'TINYINT(1) DEFAULT 0',
        'featured_start' => 'DATE DEFAULT NULL',
        'featured_end' => 'DATE DEFAULT NULL'
    ];
    foreach ($cols_to_add as $col => $def) {
        try {
            $conn->exec("ALTER TABLE users ADD COLUMN {$col} {$def}");
        } catch (PDOException $e) { /* already exists */
        }
    }

    if ($featured) {
        // Enable with period
        $stmt = $conn->prepare("UPDATE users SET is_featured = 1, featured_start = ?, featured_end = ? WHERE id = ?");
        $stmt->execute([$start_date, $end_date, $user_id]);
        $msg = "Featured status enabled.";
        if ($start_date && $end_date) {
            $msg .= " ({$start_date} ~ {$end_date})";
        }
    } else {
        // Disable - clear dates
        $stmt = $conn->prepare("UPDATE users SET is_featured = 0, featured_start = NULL, featured_end = NULL WHERE id = ?");
        $stmt->execute([$user_id]);
        $msg = "Featured status disabled.";
    }

    // Fetch updated data
    $fetchStmt = $conn->prepare("SELECT is_featured, featured_start, featured_end FROM users WHERE id = ?");
    $fetchStmt->execute([$user_id]);
    $updated = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => $msg,
        "is_featured" => intval($updated['is_featured']),
        "featured_start" => $updated['featured_start'],
        "featured_end" => $updated['featured_end']
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>