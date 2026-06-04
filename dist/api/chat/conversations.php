<?php
/**
 * Chat Conversations API
 * 
 * GET  /api/chat/conversations.php         — List my conversations
 * GET  /api/chat/conversations.php?type=cs  — List CS conversations (admin only)
 * POST /api/chat/conversations.php          — Create or get existing conversation
 *   Body: { "target_user_id": 123, "type": "direct"|"cs" }
 */

include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// ─── Auto-migrate: create tables (once per session) ───
if (empty($_SESSION['_ddl_chat'])) {
    try {
        $conn->query("SELECT id FROM chat_conversations LIMIT 1");
    } catch (PDOException $e) {
        $conn->exec("CREATE TABLE IF NOT EXISTS chat_conversations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            participant_1 INT NOT NULL,
            participant_2 INT NOT NULL,
            type ENUM('direct','cs') DEFAULT 'direct',
            last_message_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_pair (participant_1, participant_2, type),
            INDEX idx_p1 (participant_1),
            INDEX idx_p2 (participant_2)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }

    try {
        $conn->query("SELECT id FROM chat_messages LIMIT 1");
    } catch (PDOException $e) {
        $conn->exec("CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            conversation_id INT NOT NULL,
            sender_id INT NOT NULL,
            message_type ENUM('text','image','video','file') DEFAULT 'text',
            original_text TEXT,
            original_lang VARCHAR(5),
            translated_texts JSON,
            file_url VARCHAR(500) DEFAULT NULL,
            file_name VARCHAR(255) DEFAULT NULL,
            file_size INT DEFAULT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_conv (conversation_id),
            INDEX idx_sender (sender_id),
            INDEX idx_read (conversation_id, is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }

    // Auto-migrate: add 'type' column if missing
    try {
        $colCheck = $conn->query("SHOW COLUMNS FROM chat_conversations LIKE 'type'");
        if ($colCheck->rowCount() === 0) {
            $conn->exec("ALTER TABLE chat_conversations ADD COLUMN type ENUM('direct','cs') DEFAULT 'direct' AFTER participant_2");
            try {
                $conn->exec("ALTER TABLE chat_conversations DROP INDEX unique_pair");
            } catch (PDOException $e) {
            }
            $conn->exec("ALTER TABLE chat_conversations ADD UNIQUE KEY unique_pair (participant_1, participant_2, type)");
        }
    } catch (PDOException $e) {
    }

    $_SESSION['_ddl_chat'] = true;
}

// ─── GET: List conversations ───
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $type = isset($_GET['type']) ? trim($_GET['type']) : '';

        // Get user role for admin check
        $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $roleStmt->execute([$user_id]);
        $userRole = $roleStmt->fetchColumn();
        $isAdmin = in_array($userRole, ['admin', 'superadmin']);

        $query = "
        SELECT 
            c.*,
            CASE WHEN c.participant_1 = :uid THEN c.participant_2 ELSE c.participant_1 END as other_user_id,
            u_other.name as other_name,
            u_other.email as other_email,
            u_other.role as other_role,
            u_other.country as other_country,
            u_other.profile_image as other_profile_image,
            (SELECT COUNT(*) FROM chat_messages m 
             WHERE m.conversation_id = c.id AND m.sender_id != :uid2 AND m.is_read = 0) as unread_count,
            (SELECT m2.original_text FROM chat_messages m2 
             WHERE m2.conversation_id = c.id ORDER BY m2.id DESC LIMIT 1) as last_message,
            (SELECT m3.message_type FROM chat_messages m3 
             WHERE m3.conversation_id = c.id ORDER BY m3.id DESC LIMIT 1) as last_message_type,
            (SELECT m4.sender_id FROM chat_messages m4 
             WHERE m4.conversation_id = c.id ORDER BY m4.id DESC LIMIT 1) as last_sender_id
        FROM chat_conversations c
        LEFT JOIN users u_other ON u_other.id = 
            CASE WHEN c.participant_1 = :uid3 THEN c.participant_2 ELSE c.participant_1 END
    ";

        $params = [':uid' => $user_id, ':uid2' => $user_id, ':uid3' => $user_id];

        // Admin viewing CS conversations: show all CS conversations
        if ($isAdmin && $type === 'cs') {
            $query .= " WHERE c.type = 'cs'";
        } else if ($type === 'cs') {
            $query .= " WHERE c.type = 'cs' AND (c.participant_1 = :uid4 OR c.participant_2 = :uid5)";
            $params[':uid4'] = $user_id;
            $params[':uid5'] = $user_id;
        } else {
            $query .= " WHERE (c.participant_1 = :uid4 OR c.participant_2 = :uid5)";
            $params[':uid4'] = $user_id;
            $params[':uid5'] = $user_id;
            if ($type === 'direct') {
                $query .= " AND c.type = 'direct'";
            }
        }

        $query .= " ORDER BY c.last_message_at DESC, c.created_at DESC";

        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // For admin: In CS conversations, always show the NON-admin user's profile
        if ($isAdmin) {
            foreach ($conversations as &$conv) {
                if (isset($conv['type']) && $conv['type'] === 'cs') {
                    $p1 = intval($conv['participant_1']);
                    $p2 = intval($conv['participant_2']);
                    // Find which participant is NOT an admin
                    $roleCheck = $conn->prepare("SELECT id, name, email, role, country, profile_image FROM users WHERE id IN (?, ?)");
                    $roleCheck->execute([$p1, $p2]);
                    $participants = $roleCheck->fetchAll(PDO::FETCH_ASSOC);
                    $nonAdmin = null;
                    foreach ($participants as $p) {
                        if (!in_array($p['role'], ['admin', 'superadmin'])) {
                            $nonAdmin = $p;
                            break;
                        }
                    }
                    if ($nonAdmin) {
                        $conv['other_user_id'] = $nonAdmin['id'];
                        $conv['other_name'] = $nonAdmin['name'];
                        $conv['other_email'] = $nonAdmin['email'];
                        $conv['other_role'] = $nonAdmin['role'];
                        $conv['other_country'] = $nonAdmin['country'];
                        $conv['other_profile_image'] = $nonAdmin['profile_image'];
                    }
                }
            }
            unset($conv);
        }

        // For non-admin users, replace admin profile with "SpaceMatch CS" in CS conversations
        if (!$isAdmin) {
            foreach ($conversations as &$conv) {
                if (isset($conv['type']) && $conv['type'] === 'cs') {
                    $conv['other_name'] = 'SpaceMatch CS';
                    $conv['other_profile_image'] = null;
                    $conv['other_email'] = null;
                }
            }
            unset($conv);
        }

        foreach ($conversations as &$conv) {
            decode_fields($conv, ['other_name']);
        }
        unset($conv);

        echo json_encode([
            "success" => true,
            "conversations" => $conversations,
            "user_id" => $user_id
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[conversations] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        error_log('[conversations] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
        exit;
    }
}

// ─── POST: Create or get conversation ───
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $target_id = intval($input['target_user_id'] ?? 0);
    $type = ($input['type'] ?? 'direct') === 'cs' ? 'cs' : 'direct';

    if ($target_id <= 0 || $target_id === $user_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "유효하지 않은 대상 사용자입니다."]);
        exit;
    }

    // Ensure consistent ordering: smaller ID = participant_1
    $p1 = min($user_id, $target_id);
    $p2 = max($user_id, $target_id);

    // Check existing
    $existStmt = $conn->prepare("SELECT id FROM chat_conversations WHERE participant_1 = ? AND participant_2 = ? AND type = ?");
    $existStmt->execute([$p1, $p2, $type]);
    $existing = $existStmt->fetch();

    // ─── Permission check for NEW conversations ───
    if (!$existing) {
        $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $roleStmt->execute([$user_id]);
        $myRole = $roleStmt->fetchColumn();

        $targetRoleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $targetRoleStmt->execute([$target_id]);
        $targetRole = $targetRoleStmt->fetchColumn();

        $isMyAdmin = in_array($myRole, ['admin', 'superadmin']);
        $isTargetAdmin = in_array($targetRole, ['admin', 'superadmin']);

        // Admin can chat with anyone
        if (!$isMyAdmin) {
            // Anyone can chat with admin (CS)
            if (!$isTargetAdmin) {
                // Same role → blocked
                if ($myRole === $targetRole) {
                    http_response_code(403);
                    echo json_encode(["success" => false, "message" => "같은 역할의 사용자와는 채팅할 수 없습니다. 커뮤니티를 이용해주세요.", "error_code" => "SAME_ROLE"], JSON_UNESCAPED_UNICODE);
                    exit;
                }

                // vendor↔seller: check relationship
                $host_id = ($myRole === 'host') ? $user_id : $target_id;
                $seller_id = ($myRole === 'seller') ? $user_id : $target_id;
                $allowed = false;

                // Check 1: Vendor viewed seller contact
                try {
                    $v1 = $conn->prepare("SELECT id FROM seller_contact_views WHERE host_id = ? AND seller_id = ?");
                    $v1->execute([$host_id, $seller_id]);
                    if ($v1->fetch())
                        $allowed = true;
                } catch (PDOException $e) {
                }

                // Check 2: Seller viewed vendor contact
                if (!$allowed) {
                    try {
                        $v2 = $conn->prepare("SELECT id FROM vendor_contact_views WHERE seller_id = ? AND host_id = ?");
                        $v2->execute([$seller_id, $host_id]);
                        if ($v2->fetch())
                            $allowed = true;
                    } catch (PDOException $e) {
                    }
                }

                // Check 3: Approved application
                if (!$allowed) {
                    $appStmt = $conn->prepare("SELECT a.id FROM applications a JOIN venues v ON a.venue_id = v.id WHERE a.user_id = ? AND v.owner_id = ? AND a.status = 'approved' LIMIT 1");
                    $appStmt->execute([$seller_id, $host_id]);
                    if ($appStmt->fetch())
                        $allowed = true;
                }

                if (!$allowed) {
                    http_response_code(403);
                    echo json_encode(["success" => false, "message" => "채팅 권한이 없습니다. 연락처 열람 또는 입점 승인이 필요합니다.", "error_code" => "NO_PERMISSION"], JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }
    }

    if ($existing) {
        $convId = intval($existing['id']);
    } else {
        $insertStmt = $conn->prepare("INSERT INTO chat_conversations (participant_1, participant_2, type) VALUES (?, ?, ?)");
        $insertStmt->execute([$p1, $p2, $type]);
        $convId = intval($conn->lastInsertId());
    }

    // Return full conversation info
    $infoStmt = $conn->prepare("
        SELECT c.*, 
            u.name as other_name, u.email as other_email, u.role as other_role,
            u.country as other_country, u.profile_image as other_profile_image
        FROM chat_conversations c
        LEFT JOIN users u ON u.id = CASE WHEN c.participant_1 = ? THEN c.participant_2 ELSE c.participant_1 END
        WHERE c.id = ?
    ");
    $infoStmt->execute([$user_id, $convId]);
    $conv = $infoStmt->fetch(PDO::FETCH_ASSOC);

    // For non-admin users, replace admin info with "SpaceMatch 관리자" in CS conversations
    $roleCheckStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleCheckStmt->execute([$user_id]);
    $myRole = $roleCheckStmt->fetchColumn();
    if (!in_array($myRole, ['admin', 'superadmin']) && $type === 'cs' && $conv) {
        $conv['other_name'] = 'SpaceMatch 관리자';
        $conv['other_profile_image'] = null;
        $conv['other_email'] = null;
    }

    echo json_encode([
        "success" => true,
        "conversation" => $conv,
        "created" => !$existing
    ]);
    exit;
}

// ─── DELETE: Delete entire conversation (admin/superadmin only) ───
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $convId = intval($input['conversation_id'] ?? 0);

    if ($convId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
        exit;
    }

    // Check admin role
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $userRole = $roleStmt->fetchColumn();

    if (!in_array($userRole, ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "관리자만 대화를 삭제할 수 있습니다."]);
        exit;
    }

    // Verify conversation exists
    $convStmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ?");
    $convStmt->execute([$convId]);
    if (!$convStmt->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "대화를 찾을 수 없습니다."]);
        exit;
    }

    // Delete attached files from server
    $fileStmt = $conn->prepare("SELECT file_url FROM chat_messages WHERE conversation_id = ? AND file_url IS NOT NULL AND file_url != ''");
    $fileStmt->execute([$convId]);
    $files = $fileStmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($files as $fileUrl) {
        $filePath = $_SERVER['DOCUMENT_ROOT'] . $fileUrl;
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
    }

    // Delete all messages in the conversation
    $delMsgStmt = $conn->prepare("DELETE FROM chat_messages WHERE conversation_id = ?");
    $delMsgStmt->execute([$convId]);
    $deletedCount = $delMsgStmt->rowCount();

    // Delete the conversation itself
    $delConvStmt = $conn->prepare("DELETE FROM chat_conversations WHERE id = ?");
    $delConvStmt->execute([$convId]);

    echo json_encode([
        "success" => true,
        "message" => "대화가 삭제되었습니다.",
        "deleted_messages" => $deletedCount
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>