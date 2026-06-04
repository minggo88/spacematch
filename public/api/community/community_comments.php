<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

// Create comments table if not exists (once per session)
if (empty($_SESSION['_ddl_community_comments'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS community_comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            parent_id INT DEFAULT NULL,
            user_id INT NOT NULL,
            user_name VARCHAR(100) NOT NULL,
            user_role VARCHAR(20) NOT NULL,
            profile_image VARCHAR(500) DEFAULT '',
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_post_id (post_id),
            INDEX idx_parent_id (parent_id)
        )");
        $migrate_cols = [
            ['community_comments', 'original_lang', "ADD COLUMN original_lang VARCHAR(5) DEFAULT NULL AFTER content"],
            ['users', 'country', "ADD COLUMN country VARCHAR(5) DEFAULT NULL AFTER instagram"],
        ];
        foreach ($migrate_cols as $mc) {
            try {
                $conn->query("SELECT {$mc[1]} FROM {$mc[0]} LIMIT 1");
            } catch (PDOException $e) {
                $conn->exec("ALTER TABLE {$mc[0]} {$mc[2]}");
            }
        }
        $_SESSION['_ddl_community_comments'] = true;
    } catch (PDOException $e) {
        // Table might already exist
    }
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? '';
$is_admin = in_array($user_role, ['admin', 'superadmin']);

// GET - Fetch comments for a post
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
    if ($post_id <= 0) {
        echo json_encode(["success" => false, "message" => "post_id가 필요합니다."]);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT c.id, c.post_id, c.parent_id, c.user_id, u.name AS user_name, u.name_en AS user_name_en, u.role AS user_role, u.profile_image, u.country, c.content, c.original_lang, c.created_at 
                                FROM community_comments c
                                JOIN users u ON c.user_id = u.id
                                WHERE c.post_id = ? 
                                ORDER BY c.created_at ASC");
        $stmt->execute([$post_id]);
        $allComments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Build nested structure
        $topLevel = [];
        $repliesMap = [];

        // Prepare like count queries
        $likeCntStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comment_likes WHERE comment_id = ?");
        $isLikedStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comment_likes WHERE comment_id = ? AND user_id = ?");

        foreach ($allComments as &$c) {
            decode_fields($c, ['content', 'user_name']);
            $c['id'] = intval($c['id']);
            $c['post_id'] = intval($c['post_id']);
            $c['parent_id'] = $c['parent_id'] ? intval($c['parent_id']) : null;
            $c['user_id'] = intval($c['user_id']);
            $c['is_mine'] = ($c['user_id'] === intval($user_id));
            $c['can_delete'] = ($c['is_mine'] || $is_admin);
            $c['replies'] = [];

            // Like data
            $likeCntStmt->execute([$c['id']]);
            $c['like_count'] = intval($likeCntStmt->fetch(PDO::FETCH_ASSOC)['cnt']);
            $isLikedStmt->execute([$c['id'], $user_id]);
            $c['is_liked'] = intval($isLikedStmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0;
        }
        unset($c);

        // Separate top-level comments and replies
        foreach ($allComments as $c) {
            if ($c['parent_id'] === null) {
                $topLevel[$c['id']] = $c;
            } else {
                $repliesMap[$c['parent_id']][] = $c;
            }
        }

        // Attach replies to parents
        foreach ($topLevel as &$comment) {
            if (isset($repliesMap[$comment['id']])) {
                $comment['replies'] = $repliesMap[$comment['id']];
            }
        }
        unset($comment);

        // Count
        $totalComments = count($allComments);

        echo json_encode([
            "success" => true,
            "comments" => array_values($topLevel),
            "total" => $totalComments
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[community_comments GET] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "댓글 로드 중 오류가 발생했습니다."]);
    }
    exit;
}

// POST - Create comment or reply
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->post_id) || !isset($data->content) || empty(trim($data->content))) {
        echo json_encode(["success" => false, "message" => "post_id와 content가 필요합니다."]);
        exit;
    }

    $post_id = intval($data->post_id);
    $parent_id = isset($data->parent_id) ? intval($data->parent_id) : null;
    $content = strip_tags(trim($data->content));
    $original_lang = isset($data->original_lang) ? trim($data->original_lang) : 'ko';

    // Verify post exists
    $postCheck = $conn->prepare("SELECT id FROM community_posts WHERE id = ?");
    $postCheck->execute([$post_id]);
    if (!$postCheck->fetch()) {
        echo json_encode(["success" => false, "message" => "게시글을 찾을 수 없습니다."]);
        exit;
    }

    // If replying, verify parent comment exists
    if ($parent_id) {
        $parentCheck = $conn->prepare("SELECT id FROM community_comments WHERE id = ? AND post_id = ?");
        $parentCheck->execute([$parent_id, $post_id]);
        if (!$parentCheck->fetch()) {
            echo json_encode(["success" => false, "message" => "원본 댓글을 찾을 수 없습니다."]);
            exit;
        }
    }

    // Get user info
    $user_name = $_SESSION['user_name'] ?? 'Unknown';
    $profile_image = '';
    try {
        $userStmt = $conn->prepare("SELECT name, profile_image FROM users WHERE id = ?");
        $userStmt->execute([$user_id]);
        $userData = $userStmt->fetch(PDO::FETCH_ASSOC);
        if ($userData) {
            $user_name = $userData['name'];
            $profile_image = $userData['profile_image'] ?? '';
        }
    } catch (PDOException $e) {
    }

    try {
        $stmt = $conn->prepare("INSERT INTO community_comments (post_id, parent_id, user_id, user_name, user_role, profile_image, content, original_lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$post_id, $parent_id, $user_id, $user_name, $user_role, $profile_image, $content, $original_lang]);
        $newId = $conn->lastInsertId();

        // [NOTIFICATION] Notify post author and parent comment author
        try {
            // Ensure notifications table exists (once per session)
            if (empty($_SESSION['_ddl_notifications'])) {
                $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    message TEXT NOT NULL,
                    link VARCHAR(255),
                    is_read BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX (user_id), INDEX (is_read)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
                $_SESSION['_ddl_notifications'] = true;
            }

            // Get post info
            $postInfoStmt = $conn->prepare("SELECT user_id, title, community_type FROM community_posts WHERE id = ?");
            $postInfoStmt->execute([$post_id]);
            $postInfo = $postInfoStmt->fetch(PDO::FETCH_ASSOC);

            if ($postInfo) {
                $postAuthorId = intval($postInfo['user_id']);
                $postTitle = mb_substr($postInfo['title'], 0, 20, 'UTF-8');
                $communityType = $postInfo['community_type'];

                // Helper: get role-based link for a user (with post highlight)
                $getRoleLink = function ($targetUserId) use ($conn, $communityType, $post_id) {
                    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
                    $roleStmt->execute([$targetUserId]);
                    $roleData = $roleStmt->fetch(PDO::FETCH_ASSOC);
                    $targetRole = $roleData ? $roleData['role'] : 'seller';

                    if ($targetRole === 'admin' || $targetRole === 'superadmin') {
                        $base = ($communityType === 'seller') ? '/admin/community/seller' : (($communityType === 'host') ? '/admin/community/host' : '/admin/community/general');
                    } elseif ($targetRole === 'host') {
                        $base = ($communityType === 'general') ? '/host/community/general' : '/host/community';
                    } else {
                        $base = ($communityType === 'general') ? '/seller/community/general' : '/seller/community';
                    }
                    return $base . "?highlight={$post_id}";
                };

                // Notify post author (if commenter is not the author)
                if ($postAuthorId !== intval($user_id)) {
                    $notifMsg = "{$user_name}님이 '{$postTitle}...' 게시글에 댓글을 남겼습니다.";
                    $notifLink = $getRoleLink($postAuthorId);
                    $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'community_comment', ?, ?, NOW())";
                    $notifStmt = $conn->prepare($notifSql);
                    $notifStmt->execute([$postAuthorId, $notifMsg, $notifLink]);

                    // [EMAIL] 댓글 이메일 알림 (다국어)
                    try {
                        $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                        $_un = $user_name;
                        $_pt = $postInfo['title'];
                        $_nl = $notifLink;
                        sendEmailToUser(
                            $conn,
                            $postAuthorId,
                            '',
                            '',
                            'cat_community',
                            function ($lang) use ($_un, $_pt, $siteUrl, $_nl) {
                                $subj = _t(['ko' => "{$_un}님이 댓글을 남겼습니다", 'en' => "{$_un} left a comment", 'ja' => "{$_un}さんがコメント", 'vi' => "{$_un} đã bình luận", 'th' => "{$_un} แสดงความคิดเห็น", 'fr' => "{$_un} a commenté", 'km' => "{$_un} បានមតិ", 'ru' => "{$_un} оставил(а) комментарий", 'uk' => "{$_un} залишив(ла) коментар"], $lang);
                                return ['subject' => $subj, 'html' => emailTemplateCommunityComment($_un, $_pt, false, $siteUrl, $_nl, $lang)];
                            }
                        );
                    } catch (Exception $emailErr) {
                        error_log("Email error (community_comment): " . $emailErr->getMessage());
                    }
                }

                // If this is a reply, notify parent comment author too
                if ($parent_id) {
                    $parentStmt = $conn->prepare("SELECT user_id, user_name FROM community_comments WHERE id = ?");
                    $parentStmt->execute([$parent_id]);
                    $parentData = $parentStmt->fetch(PDO::FETCH_ASSOC);
                    if ($parentData && intval($parentData['user_id']) !== intval($user_id) && intval($parentData['user_id']) !== $postAuthorId) {
                        $replyMsg = "{$user_name}님이 회원님의 댓글에 답글을 남겼습니다.";
                        $replyLink = $getRoleLink(intval($parentData['user_id']));
                        $replySql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'community_reply', ?, ?, NOW())";
                        $replyStmt = $conn->prepare($replySql);
                        $replyStmt->execute([intval($parentData['user_id']), $replyMsg, $replyLink]);

                        // [EMAIL] 답글 이메일 알림 (다국어)
                        try {
                            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                            $_un = $user_name;
                            $_pt = $postInfo['title'];
                            $_rl = $replyLink;
                            sendEmailToUser(
                                $conn,
                                intval($parentData['user_id']),
                                '',
                                '',
                                'cat_community',
                                function ($lang) use ($_un, $_pt, $siteUrl, $_rl) {
                                    $subj = _t(['ko' => "{$_un}님이 답글을 남겼습니다", 'en' => "{$_un} replied", 'ja' => "{$_un}さんが返信", 'vi' => "{$_un} đã trả lời", 'th' => "{$_un} ตอบกลับ", 'fr' => "{$_un} a répondu", 'km' => "{$_un} បានឆ្លើយ", 'ru' => "{$_un} ответил(а)", 'uk' => "{$_un} відповів(ла)"], $lang);
                                    return ['subject' => $subj, 'html' => emailTemplateCommunityComment($_un, $_pt, true, $siteUrl, $_rl, $lang)];
                                }
                            );
                        } catch (Exception $emailErr) {
                            error_log("Email error (community_reply): " . $emailErr->getMessage());
                        }
                    }
                }
            }
        } catch (Exception $e) {
            error_log("SpaceMatch Notification Error (community_comment): " . $e->getMessage());
        }

        echo json_encode([
            "success" => true,
            "message" => "댓글이 등록되었습니다.",
            "comment" => [
                "id" => intval($newId),
                "post_id" => $post_id,
                "parent_id" => $parent_id,
                "user_id" => intval($user_id),
                "user_name" => $user_name,
                "user_role" => $user_role,
                "profile_image" => $profile_image,
                "content" => $content,
                "created_at" => date('Y-m-d H:i:s'),
                "is_mine" => true,
                "can_delete" => true,
                "replies" => []
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[community_comments POST] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "댓글 등록 중 오류가 발생했습니다."]);
    }
    exit;
}

// DELETE - Delete comment (owner or admin)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->comment_id)) {
        echo json_encode(["success" => false, "message" => "comment_id가 필요합니다."]);
        exit;
    }

    $comment_id = intval($data->comment_id);

    try {
        $stmt = $conn->prepare("SELECT id, user_id FROM community_comments WHERE id = ?");
        $stmt->execute([$comment_id]);
        $comment = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$comment) {
            echo json_encode(["success" => false, "message" => "댓글을 찾을 수 없습니다."]);
            exit;
        }

        if (intval($comment['user_id']) !== intval($user_id) && !$is_admin) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "삭제 권한이 없습니다."]);
            exit;
        }

        // Delete replies first, then the comment itself
        $conn->beginTransaction();
        $delReplies = $conn->prepare("DELETE FROM community_comments WHERE parent_id = ?");
        $delReplies->execute([$comment_id]);
        $delComment = $conn->prepare("DELETE FROM community_comments WHERE id = ?");
        $delComment->execute([$comment_id]);
        $conn->commit();

        echo json_encode(["success" => true, "message" => "댓글이 삭제되었습니다."]);
    } catch (PDOException $e) {
        if ($conn->inTransaction())
            $conn->rollBack();
        http_response_code(500);
        error_log('[community_comments DELETE] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "댓글 삭제 중 오류가 발생했습니다."]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>