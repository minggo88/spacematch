<?php
// Admin: Batch update multiple ads
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$ad_ids = isset($input['ids']) && is_array($input['ids']) ? $input['ids'] : [];
$fields = isset($input['fields']) && is_array($input['fields']) ? $input['fields'] : [];

if (empty($ad_ids)) {
    echo json_encode(['success' => false, 'message' => 'No ads selected']);
    exit();
}

if (empty($fields)) {
    echo json_encode(['success' => false, 'message' => 'No fields to update']);
    exit();
}

// Build dynamic UPDATE query based on provided fields
$allowed_fields = ['slot_id', 'is_active', 'priority', 'start_date', 'end_date', 'target_countries', 'campaign_id'];
$set_parts = [];
$params = [];

foreach ($fields as $key => $value) {
    if (in_array($key, $allowed_fields)) {
        $set_parts[] = "$key = :$key";
        // Handle empty string as NULL for date fields
        if (in_array($key, ['start_date', 'end_date', 'campaign_id']) && ($value === '' || $value === null)) {
            $params[":$key"] = null;
        } else {
            $params[":$key"] = $value;
        }
    }
}

if (empty($set_parts)) {
    echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
    exit();
}

$set_sql = implode(', ', $set_parts);
$updated = 0;
$errors = [];

try {
    $conn->beginTransaction();

    foreach ($ad_ids as $id) {
        $id = intval($id);
        if ($id <= 0)
            continue;

        $sql = "UPDATE ads SET $set_sql WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $exec_params = array_merge($params, [':id' => $id]);
        $stmt->execute($exec_params);
        $updated++;
    }

    $conn->commit();
    echo json_encode(['success' => true, 'updated' => $updated, 'message' => "{$updated}개 광고가 수정되었습니다."]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>