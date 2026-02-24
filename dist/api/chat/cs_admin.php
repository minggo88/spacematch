<?php
/**
 * CS Admin Lookup API
 * 
 * GET /api/chat/cs_admin.php — Returns a CS admin user ID for quick-connect
 * Picks the admin/superadmin with the fewest active CS conversations to load-balance.
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Don't allow admins to call this (they ARE the CS agents)
// Query DB for reliable role check
$roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$roleStmt->execute([$user_id]);
$myRole = $roleStmt->fetchColumn() ?: '';
if (in_array($myRole, ['admin', 'superadmin'])) {
    echo json_encode(["success" => false, "message" => "관리자는 CS 문의 대상이 아닙니다."]);
    exit;
}

try {
    // Check if user already has an active CS conversation
    $existingStmt = $conn->prepare("
        SELECT c.id, c.participant_1, c.participant_2,
            CASE WHEN c.participant_1 = ? THEN c.participant_2 ELSE c.participant_1 END as admin_id,
            u.name as admin_name, u.profile_image as admin_profile_image
        FROM chat_conversations c
        JOIN users u ON u.id = CASE WHEN c.participant_1 = ? THEN c.participant_2 ELSE c.participant_1 END
        WHERE (c.participant_1 = ? OR c.participant_2 = ?)
          AND c.type = 'cs'
        ORDER BY c.last_message_at DESC
        LIMIT 1
    ");
    $existingStmt->execute([$user_id, $user_id, $user_id, $user_id]);
    $existing = $existingStmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        echo json_encode([
            "success" => true,
            "admin_id" => intval($existing['admin_id']),
            "admin_name" => "SpaceMatch CS",
            "admin_profile_image" => null,
            "existing_conversation_id" => intval($existing['id']),
            "is_existing" => true
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Find the best admin to assign (least CS conversations → load balancing)
    $adminStmt = $conn->prepare("
        SELECT u.id, u.name, u.profile_image,
            COALESCE(
                (SELECT COUNT(*) FROM chat_conversations c 
                 WHERE c.type = 'cs' AND (c.participant_1 = u.id OR c.participant_2 = u.id)),
                0
            ) as cs_count
        FROM users u
        WHERE u.role IN ('admin', 'superadmin')
        ORDER BY cs_count ASC, u.id ASC
        LIMIT 1
    ");
    $adminStmt->execute();
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin) {
        echo json_encode([
            "success" => false,
            "message" => "현재 상담 가능한 관리자가 없습니다."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        "success" => true,
        "admin_id" => intval($admin['id']),
        "admin_name" => "SpaceMatch CS",
        "admin_profile_image" => null,
        "is_existing" => false
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "서버 오류: " . $e->getMessage()]);
}
?>