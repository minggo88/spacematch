<?php
// Remove upload limits
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '512M');
@ini_set('max_execution_time', 600);
@ini_set('max_file_uploads', 20);

include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

// Create tables if not exists (once per session)
if (empty($_SESSION['_ddl_community_migrated'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS community_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            user_name VARCHAR(100) NOT NULL,
            user_role VARCHAR(20) NOT NULL,
            profile_image VARCHAR(500) DEFAULT '',
            community_type ENUM('seller', 'host', 'general') NOT NULL,
            label VARCHAR(50) DEFAULT '',
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_community_type (community_type),
            INDEX idx_user_id (user_id),
            INDEX idx_label (label)
        )");

        $migrate_cols = [
            ['community_posts', 'label', "ADD COLUMN label VARCHAR(50) DEFAULT '' AFTER community_type"],
            ['community_posts', 'view_count', "ADD COLUMN view_count INT DEFAULT 0 AFTER content"],
            ['community_posts', 'keywords', "ADD COLUMN keywords TEXT DEFAULT NULL AFTER view_count"],
            ['community_posts', 'original_lang', "ADD COLUMN original_lang VARCHAR(5) DEFAULT NULL AFTER content"],
            ['community_posts', 'is_notice', "ADD COLUMN is_notice TINYINT(1) DEFAULT 0 AFTER keywords"],
            ['community_posts', 'country', "ADD COLUMN country VARCHAR(5) DEFAULT NULL AFTER is_notice"],
            ['community_posts', 'share_count', "ADD COLUMN share_count INT DEFAULT 0 AFTER view_count"],
            ['users', 'country', "ADD COLUMN country VARCHAR(5) DEFAULT NULL AFTER instagram"],
            ['users', 'name_en', "ADD COLUMN name_en VARCHAR(100) DEFAULT NULL AFTER name"],
        ];
        foreach ($migrate_cols as $mc) {
            try {
                $conn->query("SELECT {$mc[1]} FROM {$mc[0]} LIMIT 1");
            } catch (PDOException $e) {
                $conn->exec("ALTER TABLE {$mc[0]} {$mc[2]}");
            }
        }

        $conn->exec("CREATE TABLE IF NOT EXISTS community_post_photos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_post_id (post_id)
        )");

        $conn->exec("CREATE TABLE IF NOT EXISTS community_post_likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_post_user (post_id, user_id),
            INDEX idx_post_id (post_id),
            INDEX idx_user_id (user_id)
        )");

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

        $_SESSION['_ddl_community_migrated'] = true;
    } catch (PDOException $e) {
        // Tables might already exist
    }
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? '';

$is_admin = in_array($user_role, ['admin', 'superadmin']);

function checkAccess($type, $role)
{
    // Admin and superadmin have access to ALL communities
    if (in_array($role, ['admin', 'superadmin']))
        return;

    if ($type === 'seller' && $role !== 'seller') {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "셀러만 접근 가능합니다."]);
        exit;
    }
    if ($type === 'host' && $role !== 'host') {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "호스트만 접근 가능합니다."]);
        exit;
    }
    if ($type === 'general' && !in_array($role, ['seller', 'host'])) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }
}

// GET - Fetch posts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json; charset=utf-8');
    $type = isset($_GET['type']) ? $_GET['type'] : 'general';
    checkAccess($type, $user_role);

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $label = isset($_GET['label']) ? trim($_GET['label']) : '';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $single_post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'latest'; // latest, likes, comments, views
    $mode = isset($_GET['mode']) ? $_GET['mode'] : ''; // 'best' = 개념글
    $country_filter = isset($_GET['country']) ? trim($_GET['country']) : ''; // country code or 'all'
    $limit = 20;
    $offset = ($page - 1) * $limit;

    // Fetch notices for this community
    $fetchNotices = isset($_GET['notices']) ? intval($_GET['notices']) : 0;

    try {
        // Handle share count increment
        $increment_share = isset($_GET['increment_share']) ? intval($_GET['increment_share']) : 0;
        if ($increment_share > 0) {
            $conn->prepare("UPDATE community_posts SET share_count = COALESCE(share_count, 0) + 1 WHERE id = ?")->execute([$increment_share]);
            echo json_encode(["success" => true]);
            exit;
        }

        // If a specific post_id is requested, return just that post (for shared links)
        if ($single_post_id > 0) {
            $stmt = $conn->prepare("SELECT p.id, p.user_id, u.name AS user_name, u.name_en AS user_name_en, u.role AS user_role, u.profile_image, u.country, p.label, p.title, p.content, p.original_lang, p.view_count, p.created_at,
                                    (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) as like_count,
                                    (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id AND user_id = ?) as is_liked
                                    FROM community_posts p
                                    JOIN users u ON p.user_id = u.id
                                    WHERE p.id = ?");
            $stmt->execute([$user_id, $single_post_id]);
            $singlePost = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($singlePost) {
                decode_fields($singlePost, ['title', 'content', 'label', 'user_name']);
                $singlePost['id'] = intval($singlePost['id']);
                $singlePost['user_id'] = intval($singlePost['user_id']);
                $singlePost['view_count'] = intval($singlePost['view_count']);
                $singlePost['like_count'] = intval($singlePost['like_count']);
                $singlePost['is_liked'] = intval($singlePost['is_liked']) > 0;
                $singlePost['is_mine'] = ($singlePost['user_id'] === intval($user_id));
                $singlePost['can_manage'] = ($singlePost['is_mine'] || $is_admin);
                $photoStmtSingle = $conn->prepare("SELECT id, image_url, sort_order FROM community_post_photos WHERE post_id = ? ORDER BY sort_order ASC");
                $photoStmtSingle->execute([$singlePost['id']]);
                $singlePost['photos'] = $photoStmtSingle->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    "success" => true,
                    "post" => $singlePost
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Post not found."
                ]);
            }
            exit;
        }

        // If notices requested, return notices only
        if ($fetchNotices) {
            // Add is_notice column check (already done in DDL migration above)

            $noticeStmt = $conn->prepare("SELECT p.id, p.user_id, u.name AS user_name, u.name_en AS user_name_en, u.role AS user_role, p.title, p.content, COALESCE(p.is_notice, 0) as is_notice, p.created_at
                                          FROM community_posts p
                                          JOIN users u ON p.user_id = u.id
                                          WHERE p.community_type = ? AND COALESCE(p.is_notice, 0) > 0
                                          ORDER BY p.is_notice DESC, p.created_at DESC
                                          LIMIT 20");
            $noticeStmt->execute([$type]);
            $notices = $noticeStmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($notices as &$n) {
                $n['id'] = intval($n['id']);
                $n['is_notice'] = intval($n['is_notice']);
            }
            echo json_encode(["success" => true, "notices" => $notices]);
            exit;
        }

        // Build query with optional label filter, country filter, and search (exclude notices)
        $where = "p.community_type = ? AND COALESCE(p.is_notice, 0) = 0";
        $params = [$type];
        if (!empty($country_filter) && $country_filter !== 'all') {
            $where .= " AND p.country = ?";
            $params[] = $country_filter;
        }
        if (!empty($label)) {
            $where .= " AND p.label = ?";
            $params[] = $label;
        }
        if (!empty($search)) {
            $where .= " AND (p.title LIKE ? OR p.content LIKE ? OR p.user_name LIKE ? OR p.keywords LIKE ?)";
            $searchParam = '%' . $search . '%';
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }

        // Best mode: only posts with 10+ likes
        if ($mode === 'best') {
            $where .= " AND (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) >= 10";
        }

        $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_posts p WHERE $where");
        $countStmt->execute($params);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['cnt'];

        // Sort order
        $orderBy = 'p.created_at DESC';
        switch ($sort) {
            case 'likes':
                $orderBy = 'like_count DESC, p.created_at DESC';
                break;
            case 'comments':
                $orderBy = 'comment_count DESC, p.created_at DESC';
                break;
            case 'views':
                $orderBy = 'p.view_count DESC, p.created_at DESC';
                break;
        }

        // share_count column guaranteed by session DDL migration

        $stmt = $conn->prepare("SELECT p.id, p.user_id, u.name AS user_name, u.name_en AS user_name_en, u.role AS user_role, u.profile_image, u.country, p.label, p.title, p.content, p.original_lang, p.view_count, COALESCE(p.share_count, 0) as share_count, p.keywords, p.created_at,
                                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) as like_count,
                                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                                (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count,
                                (SELECT COUNT(*) FROM community_bookmarks WHERE post_id = p.id AND user_id = ?) as is_bookmarked
                                FROM community_posts p
                                JOIN users u ON p.user_id = u.id
                                WHERE $where 
                                ORDER BY $orderBy 
                                LIMIT " . intval($limit) . " OFFSET " . intval($offset));
        $stmt->execute(array_merge([$user_id, $user_id], $params));
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Attach photos to each post
        $photoStmt = $conn->prepare("SELECT id, image_url, sort_order FROM community_post_photos WHERE post_id = ? ORDER BY sort_order ASC");

        // Collect unique user IDs for activity level calculation
        $userIds = array_unique(array_column($posts, 'user_id'));
        $activityLevels = [];
        if (!empty($userIds)) {
            $placeholders = implode(',', array_fill(0, count($userIds), '?'));
            // Calculate activity score: posts*3 + comments + received_likes
            $actStmt = $conn->prepare("SELECT u_id,
                (SELECT COUNT(*) FROM community_posts WHERE user_id = u_id) * 3 +
                (SELECT COUNT(*) FROM community_comments WHERE user_id = u_id) +
                (SELECT COUNT(*) FROM community_post_likes l JOIN community_posts p2 ON l.post_id = p2.id WHERE p2.user_id = u_id) as score
                FROM (SELECT ? as u_id) t");
            foreach ($userIds as $uid) {
                $actStmt->execute([intval($uid)]);
                $row = $actStmt->fetch(PDO::FETCH_ASSOC);
                $score = intval($row['score'] ?? 0);
                $lvl = 1;
                if ($score >= 100)
                    $lvl = 5;
                elseif ($score >= 50)
                    $lvl = 4;
                elseif ($score >= 20)
                    $lvl = 3;
                elseif ($score >= 5)
                    $lvl = 2;
                $activityLevels[intval($uid)] = $lvl;
            }
        }

        foreach ($posts as &$post) {
            decode_fields($post, ['title', 'content', 'label', 'user_name']);
            $post['id'] = intval($post['id']);
            $post['user_id'] = intval($post['user_id']);
            $post['view_count'] = intval($post['view_count']);
            $post['like_count'] = intval($post['like_count']);
            $post['is_liked'] = intval($post['is_liked']) > 0;
            $post['is_mine'] = ($post['user_id'] === intval($user_id));
            $post['can_manage'] = ($post['is_mine'] || $is_admin);
            $post['keywords'] = !empty($post['keywords']) ? json_decode($post['keywords'], true) : [];
            $post['share_count'] = intval($post['share_count'] ?? 0);
            $post['comment_count'] = intval($post['comment_count'] ?? 0);
            $post['is_bookmarked'] = intval($post['is_bookmarked'] ?? 0) > 0;
            $post['activity_level'] = $activityLevels[$post['user_id']] ?? 1;
            $photoStmt->execute([$post['id']]);
            $post['photos'] = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // Get unique labels for filter
        $labelStmt = $conn->prepare("SELECT DISTINCT label FROM community_posts WHERE community_type = ? AND label != '' ORDER BY label");
        $labelStmt->execute([$type]);
        $labels = $labelStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "success" => true,
            "posts" => $posts,
            "labels" => $labels,
            "total" => intval($total),
            "page" => $page,
            "totalPages" => max(1, ceil($total / $limit))
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[community_posts GET] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "커뮤니티 데이터 로드 중 오류가 발생했습니다."]);
    }
    exit;
}

// POST - Create post (multipart/form-data for photos)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');

    $type = isset($_POST['type']) ? $_POST['type'] : '';
    $title = isset($_POST['title']) ? strip_tags(trim($_POST['title'])) : '';
    $content = isset($_POST['content']) ? strip_tags(trim($_POST['content'])) : '';
    $label = isset($_POST['label']) ? strip_tags(trim($_POST['label'])) : '';
    $is_notice = 0;
    if ($is_admin && isset($_POST['is_notice'])) {
        $is_notice = intval($_POST['is_notice']);
        if ($is_notice < 0 || $is_notice > 2)
            $is_notice = 0;
    }
    $keywordsRaw = isset($_POST['keywords']) ? trim($_POST['keywords']) : '';
    $original_lang = isset($_POST['original_lang']) ? trim($_POST['original_lang']) : 'ko';
    $keywordsJson = null;
    if (!empty($keywordsRaw)) {
        $decoded = json_decode($keywordsRaw, true);
        if (is_array($decoded)) {
            $keywordsJson = json_encode(array_values(array_filter(array_map('trim', $decoded))), JSON_UNESCAPED_UNICODE);
        }
    }

    if (empty($type) || empty($title) || empty($content)) {
        echo json_encode(["success" => false, "message" => "제목, 내용, 커뮤니티 유형이 필요합니다."]);
        exit;
    }

    checkAccess($type, $user_role);

    // Get user info
    $user_name = $_SESSION['user_name'] ?? 'Unknown';
    $profile_image = '';
    $user_country = null;
    try {
        $userStmt = $conn->prepare("SELECT name, profile_image, country FROM users WHERE id = ?");
        $userStmt->execute([$user_id]);
        $userData = $userStmt->fetch(PDO::FETCH_ASSOC);
        if ($userData) {
            $user_name = $userData['name'];
            $profile_image = $userData['profile_image'] ?? '';
            $user_country = $userData['country'] ?? null;
        }
    } catch (PDOException $e) {
    }

    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("INSERT INTO community_posts (user_id, user_name, user_role, profile_image, community_type, label, title, content, original_lang, keywords, is_notice, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $user_name, $user_role, $profile_image, $type, $label, $title, $content, $original_lang, $keywordsJson, $is_notice, $user_country]);
        $newId = $conn->lastInsertId();

        // Handle photo uploads (up to 10)
        $uploadedPhotos = [];

        // Auto-detect app base path
        $script_dir = dirname($_SERVER['SCRIPT_NAME']);
        $app_base = dirname($script_dir); // go up 1 level from /api/community -> /api -> app root
        $app_base = dirname($app_base); // one more level up
        if ($app_base === '/' || $app_base === '\\')
            $app_base = '';

        $doc_root = $_SERVER['DOCUMENT_ROOT'];
        $upload_base = $doc_root . $app_base . '/uploads/community/';

        if (!file_exists($upload_base)) {
            @mkdir($upload_base, 0755, true);
        }
        // Fallback to relative path if DOCUMENT_ROOT approach fails
        if (!file_exists($upload_base) || !is_writable($upload_base)) {
            $upload_base = dirname(dirname(__DIR__)) . '/uploads/community/';
            if (!file_exists($upload_base)) {
                @mkdir($upload_base, 0755, true);
            }
        }

        $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif'];

        if (isset($_FILES['photos'])) {
            $files = $_FILES['photos'];
            $fileCount = is_array($files['name']) ? count($files['name']) : 1;
            $maxFiles = min($fileCount, 10);

            error_log("Community photo upload: $fileCount files received, processing up to $maxFiles");

            for ($i = 0; $i < $maxFiles; $i++) {
                $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
                $fileName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
                $fileError = is_array($files['error']) ? $files['error'][$i] : $files['error'];

                if ($fileError !== UPLOAD_ERR_OK || empty($tmpName)) {
                    error_log("Photo $i skipped: error=$fileError, tmpName=$tmpName");
                    continue;
                }

                // Extension-based check (no finfo dependency)
                $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                if (!in_array($ext, $allowed_ext)) {
                    error_log("Photo $i skipped: invalid extension '$ext'");
                    continue;
                }

                $newName = "post_" . $newId . "_" . $i . "_" . time() . "_" . mt_rand(1000, 9999) . "." . $ext;
                $targetPath = $upload_base . $newName;

                if (move_uploaded_file($tmpName, $targetPath)) {
                    $webPath = $app_base . "/uploads/community/" . $newName;
                    $photoInsert = $conn->prepare("INSERT INTO community_post_photos (post_id, image_url, sort_order) VALUES (?, ?, ?)");
                    $photoInsert->execute([$newId, $webPath, $i]);
                    $uploadedPhotos[] = [
                        "id" => intval($conn->lastInsertId()),
                        "image_url" => $webPath,
                        "sort_order" => $i
                    ];
                    error_log("Photo $i uploaded: $webPath");
                } else {
                    error_log("Photo $i move_uploaded_file FAILED: $tmpName -> $targetPath");
                }
            }
        }

        $conn->commit();

        // [NOTIFICATION] Notify community members about new post
        try {
            if (empty($_SESSION['_ddl_notifications'])) {
                $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                    message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
                $_SESSION['_ddl_notifications'] = true;
            }

            $titleShort = mb_substr($title, 0, 20, 'UTF-8');
            $communityLabels = ['seller' => '셀러', 'host' => '호스트', 'general' => '통합'];
            $communityLabel = $communityLabels[$type] ?? '커뮤니티';
            $notifMsg = "[{$communityLabel} 커뮤니티] {$user_name}님이 새 글을 작성했습니다: '{$titleShort}...'";

            $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'community_post', ?, ?, NOW())";
            $notifStmt = $conn->prepare($notifSql);

            // Determine which users should be notified and their role-based links
            $recipientQueries = [];

            if ($type === 'seller') {
                // Notify other sellers
                $recipientQueries[] = ['query' => "SELECT id FROM users WHERE role = 'seller' AND id != ? LIMIT 50", 'link' => "/seller/community?highlight={$newId}"];
            } elseif ($type === 'host') {
                // Notify other hosts
                $recipientQueries[] = ['query' => "SELECT id FROM users WHERE role = 'host' AND id != ? LIMIT 50", 'link' => "/host/community?highlight={$newId}"];
            } else {
                // General: notify sellers and hosts with their respective links
                $recipientQueries[] = ['query' => "SELECT id FROM users WHERE role = 'seller' AND id != ? LIMIT 50", 'link' => "/seller/community/general?highlight={$newId}"];
                $recipientQueries[] = ['query' => "SELECT id FROM users WHERE role = 'host' AND id != ? LIMIT 50", 'link' => "/host/community/general?highlight={$newId}"];
            }

            // Always notify admins
            $adminLink = ($type === 'seller') ? '/admin/community/seller' : (($type === 'host') ? '/admin/community/host' : '/admin/community/general');
            $adminLink .= "?highlight={$newId}";
            $recipientQueries[] = ['query' => "SELECT id FROM users WHERE role IN ('admin', 'superadmin') AND id != ? LIMIT 10", 'link' => $adminLink];

            foreach ($recipientQueries as $rq) {
                $memberStmt = $conn->prepare($rq['query']);
                $memberStmt->execute([$user_id]);
                $members = $memberStmt->fetchAll(PDO::FETCH_ASSOC);
                $emailRecipientIds = [];
                foreach ($members as $member) {
                    $notifStmt->execute([$member['id'], $notifMsg, $rq['link']]);
                    $emailRecipientIds[] = $member['id'];
                }

                // [EMAIL] 커뮤니티 새 글 이메일 알림
                if (!empty($emailRecipientIds)) {
                    try {
                        $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                        $_un = $user_name;
                        $_tt = $title;
                        $_lk = $rq['link'];
                        sendEmailToUsers(
                            $conn,
                            $emailRecipientIds,
                            '',
                            '',
                            'cat_community',
                            function ($lang) use ($_un, $_tt, $siteUrl, $_lk) {
                                $subj = _t(['ko' => "[커뮤니티] {$_un}님이 새 글을 작성했습니다", 'en' => "[Community] {$_un} posted a new article", 'ja' => "[コミュニティ] {$_un}さんが新規投稿", 'vi' => "[Cộng đồng] {$_un} đã đăng bài mới", 'th' => "[ชุมชน] {$_un} โพสต์ใหม่", 'fr' => "[Communauté] {$_un} a publié un article", 'km' => "[សហគមន៍] {$_un} បានបង្ហោះអត្ថបទ", 'ru' => "[Сообщество] {$_un} опубликовал(а) пост", 'uk' => "[Спільнота] {$_un} опублікував(ла) пост"], $lang);
                                return ['subject' => $subj, 'html' => emailTemplateCommunityComment($_un, $_tt, false, $siteUrl, $_lk, $lang)];
                            }
                        );
                    } catch (Exception $emailErr) {
                        error_log("Email error (community_post): " . $emailErr->getMessage());
                    }
                }
            }
        } catch (Exception $e) {
            error_log("SpaceMatch Notification Error (community_post): " . $e->getMessage());
        }

        // [NOTIFICATION] Mention notifications (@username)
        try {
            preg_match_all('/@([\w가-힣]+)/', $content, $mentionMatches);
            if (!empty($mentionMatches[1])) {
                $mentionedNames = array_unique($mentionMatches[1]);
                $placeholders = implode(',', array_fill(0, count($mentionedNames), '?'));
                $mentionStmt = $conn->prepare("SELECT id, name, role FROM users WHERE name IN ($placeholders) AND id != ?");
                $mentionStmt->execute(array_merge($mentionedNames, [$user_id]));
                $mentionedUsers = $mentionStmt->fetchAll(PDO::FETCH_ASSOC);

                $mentionNotifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'community_mention', ?, ?, NOW())");
                $communityLabels2 = ['seller' => '셀러', 'host' => '호스트', 'general' => '통합'];
                $communityLabel2 = $communityLabels2[$type] ?? '커뮤니티';

                foreach ($mentionedUsers as $mu) {
                    $mentionMsg = "[{$communityLabel2} 커뮤니티] {$user_name}님이 게시글에서 회원님을 언급했습니다: '" . mb_substr($title, 0, 20, 'UTF-8') . "...'";
                    $mentionLink = '/';
                    if ($mu['role'] === 'seller')
                        $mentionLink = ($type === 'seller') ? "/seller/community?highlight={$newId}" : "/seller/community/general?highlight={$newId}";
                    elseif ($mu['role'] === 'host')
                        $mentionLink = ($type === 'host') ? "/host/community?highlight={$newId}" : "/host/community/general?highlight={$newId}";
                    else
                        $mentionLink = "/admin/community/{$type}?highlight={$newId}";
                    $mentionNotifStmt->execute([$mu['id'], $mentionMsg, $mentionLink]);

                    // [EMAIL] 멘션 이메일 알림 (다국어)
                    try {
                        $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                        $_un = $user_name;
                        $_tt = $title;
                        $_ml = $mentionLink;
                        sendEmailToUser(
                            $conn,
                            $mu['id'],
                            '',
                            '',
                            'cat_community',
                            function ($lang) use ($_un, $_tt, $siteUrl, $_ml) {
                                $subj = _t(['ko' => "[커뮤니티] {$_un}님이 회원님을 언급했습니다", 'en' => "[Community] {$_un} mentioned you", 'ja' => "[コミュニティ] {$_un}さんがメンション", 'vi' => "[Cộng đồng] {$_un} đã nhắc đến bạn", 'th' => "[ชุมชน] {$_un} กล่าวถึงคุณ", 'fr' => "[Communauté] {$_un} vous a mentionné", 'km' => "[សហគមន៍] {$_un} បានលើកឡើង", 'ru' => "[Сообщество] {$_un} упомянул(а) вас", 'uk' => "[Спільнота] {$_un} згадав(ла) вас"], $lang);
                                return ['subject' => $subj, 'html' => emailTemplateCommunityComment($_un, $_tt, false, $siteUrl, $_ml, $lang)];
                            }
                        );
                    } catch (Exception $emailErr) {
                        error_log("Email error (community_mention): " . $emailErr->getMessage());
                    }
                }
            }
        } catch (Exception $e) {
            error_log("SpaceMatch Mention Notification Error: " . $e->getMessage());
        }

        echo json_encode([
            "success" => true,
            "message" => "게시글이 등록되었습니다.",
            "post" => [
                "id" => intval($newId),
                "user_id" => intval($user_id),
                "user_name" => $user_name,
                "user_role" => $user_role,
                "profile_image" => $profile_image,
                "label" => $label,
                "title" => $title,
                "content" => $content,
                "keywords" => $keywordsJson ? json_decode($keywordsJson, true) : [],
                "photos" => $uploadedPhotos,
                "is_notice" => $is_notice,
                "created_at" => date('Y-m-d H:i:s'),
                "is_mine" => true
            ]
        ]);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        error_log('[community_posts POST] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "게시글 등록 중 오류가 발생했습니다."]);
    }
    exit;
}

// PUT - Edit post (admin or owner)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    header('Content-Type: application/json; charset=utf-8');
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->post_id)) {
        echo json_encode(["success" => false, "message" => "post_id가 필요합니다."]);
        exit;
    }

    $post_id = intval($data->post_id);
    $stmt = $conn->prepare("SELECT id, user_id FROM community_posts WHERE id = ?");
    $stmt->execute([$post_id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        echo json_encode(["success" => false, "message" => "게시글을 찾을 수 없습니다."]);
        exit;
    }

    // Only owner or admin can edit
    if (intval($post['user_id']) !== intval($user_id) && !$is_admin) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "수정 권한이 없습니다."]);
        exit;
    }

    $updates = [];
    $params = [];
    if (isset($data->title)) {
        $updates[] = "title = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->title)));
    }
    if (isset($data->content)) {
        $updates[] = "content = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->content)));
    }
    if (isset($data->label)) {
        $updates[] = "label = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->label)));
    }
    if (isset($data->keywords) && is_array($data->keywords)) {
        $updates[] = "keywords = ?";
        $params[] = json_encode(array_values(array_filter(array_map('trim', $data->keywords))), JSON_UNESCAPED_UNICODE);
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "수정할 내용이 없습니다."]);
        exit;
    }

    $params[] = $post_id;
    $sql = "UPDATE community_posts SET " . implode(', ', $updates) . " WHERE id = ?";
    $upd = $conn->prepare($sql);
    $upd->execute($params);

    echo json_encode(["success" => true, "message" => "게시글이 수정되었습니다."]);
    exit;
}

http_response_code(405);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>