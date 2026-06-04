<?php
// Restore item from trash bin back to original table
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$trash_id = intval($data['id'] ?? 0);

if ($trash_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'id가 필요합니다.']);
    exit;
}

try {
    // Fetch trash record
    $stmt = $conn->prepare("SELECT * FROM trash_bin WHERE id = :id");
    $stmt->execute([':id' => $trash_id]);
    $trash = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$trash) {
        echo json_encode(['success' => false, 'message' => '휴지통 항목을 찾을 수 없습니다.']);
        exit;
    }

    $table_name = $trash['table_name'];
    $record_data = json_decode($trash['record_data'], true);

    if (empty($record_data)) {
        // Cannot restore without data — just remove from trash
        $conn->prepare("DELETE FROM trash_bin WHERE id = :id")->execute([':id' => $trash_id]);
        echo json_encode(['success' => true, 'message' => '원본 데이터가 없어 복원할 수 없습니다. 휴지통에서 제거했습니다.']);
        exit;
    }

    // Check if table still exists
    $tableCheck = $conn->query("SHOW TABLES LIKE '$table_name'");
    if ($tableCheck->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => "원본 테이블 '{$table_name}'이(가) 존재하지 않습니다."]);
        exit;
    }

    // Re-insert into original table
    $columns = array_keys($record_data);
    $placeholders = array_map(fn($c) => ":$c", $columns);
    $colStr = implode(', ', array_map(fn($c) => "`$c`", $columns));
    $phStr = implode(', ', $placeholders);

    $insertStmt = $conn->prepare("INSERT INTO `$table_name` ($colStr) VALUES ($phStr)");
    $bindData = [];
    foreach ($record_data as $key => $val) {
        $bindData[":$key"] = $val;
    }
    $insertStmt->execute($bindData);

    // Remove from trash
    $conn->prepare("DELETE FROM trash_bin WHERE id = :id")->execute([':id' => $trash_id]);

    echo json_encode(['success' => true, 'message' => '복원되었습니다.']);
} catch (PDOException $e) {
    // If duplicate key, report gracefully
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
        // Try INSERT IGNORE or just delete from trash
        $conn->prepare("DELETE FROM trash_bin WHERE id = :id")->execute([':id' => $trash_id]);
        echo json_encode(['success' => true, 'message' => '동일 ID가 이미 존재합니다. 휴지통에서 제거했습니다.']);
    } else {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
}
?>