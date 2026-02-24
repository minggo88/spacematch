<?php
/**
 * Share Preview - OG Meta Tag Generator
 * 
 * Generates dynamic Open Graph meta tags for community posts
 * so that shared links show rich previews on KakaoTalk, X/Twitter, Facebook, etc.
 * 
 * Usage: /api/community/share_preview.php?post=123&type=seller
 */

// Database connection (without session requirement)
include_once __DIR__ . '/../db_connect.php';

if (!isset($conn)) {
    header('Location: /');
    exit;
}

$post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;
$type = isset($_GET['type']) ? $_GET['type'] : 'general';

if ($post_id <= 0) {
    header('Location: /');
    exit;
}

// Fetch post data
try {
    $stmt = $conn->prepare("
        SELECT p.title, p.content, p.user_name, p.like_count, p.view_count, p.community_type, p.created_at
        FROM community_posts p WHERE p.id = ?
    ");
    $stmt->execute([$post_id]);
    $post = $stmt->fetch();

    if (!$post) {
        header('Location: /');
        exit;
    }

    // Fetch first photo if exists
    $photoStmt = $conn->prepare("SELECT image_url FROM community_post_photos WHERE post_id = ? ORDER BY sort_order ASC LIMIT 1");
    $photoStmt->execute([$post_id]);
    $photo = $photoStmt->fetch();

    // Fetch comment count
    $commentStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comments WHERE post_id = ?");
    $commentStmt->execute([$post_id]);
    $commentCount = $commentStmt->fetch()['cnt'] ?? 0;

} catch (PDOException $e) {
    header('Location: /');
    exit;
}

// Prepare OG data
$title = htmlspecialchars($post['title'], ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars(mb_substr(strip_tags($post['content']), 0, 150, 'UTF-8'), ENT_QUOTES, 'UTF-8');
$author = htmlspecialchars($post['user_name'], ENT_QUOTES, 'UTF-8');
$communityType = $post['community_type'] ?? $type;

$communityNames = [
    'seller' => 'Seller Community',
    'host' => 'Host Community',
    'general' => 'Community'
];
$communityName = $communityNames[$communityType] ?? 'Community';

// Build the SPA redirect URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host_url = $protocol . '://' . $_SERVER['HTTP_HOST'];
$communityPath = '/community/' . urlencode($communityType);
$spaUrl = $host_url . $communityPath . '?post=' . $post_id;

// Image URL
$imageUrl = '';
if ($photo && !empty($photo['image_url'])) {
    $imgSrc = $photo['image_url'];
    if (strpos($imgSrc, 'http') === 0) {
        $imageUrl = $imgSrc;
    } else {
        $imageUrl = $host_url . '/' . ltrim($imgSrc, '/');
    }
}

// Stats for description
$stats = "❤️ {$post['like_count']} · 💬 {$commentCount} · 👁 {$post['view_count']}";
$fullDescription = "{$description} | {$stats} | by {$author}";

// Increment share count
try {
    // Add share_count column if not exists
    try {
        $conn->query("SELECT share_count FROM community_posts LIMIT 1");
    } catch (PDOException $e) {
        $conn->exec("ALTER TABLE community_posts ADD COLUMN share_count INT DEFAULT 0 AFTER view_count");
    }
    $conn->prepare("UPDATE community_posts SET share_count = share_count + 1 WHERE id = ?")->execute([$post_id]);
} catch (PDOException $e) {
    // Non-critical, continue
}

?><!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="<?= $title ?> - SpaceMatch <?= $communityName ?>">
    <meta property="og:description" content="<?= $fullDescription ?>">
    <meta property="og:url" content="<?= htmlspecialchars($spaUrl, ENT_QUOTES, 'UTF-8') ?>">
    <meta property="og:site_name" content="SpaceMatch">
    <?php if ($imageUrl): ?>
        <meta property="og:image" content="<?= htmlspecialchars($imageUrl, ENT_QUOTES, 'UTF-8') ?>">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
    <?php endif; ?>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="<?= $imageUrl ? 'summary_large_image' : 'summary' ?>">
    <meta name="twitter:title" content="<?= $title ?>">
    <meta name="twitter:description" content="<?= $fullDescription ?>">
    <?php if ($imageUrl): ?>
        <meta name="twitter:image" content="<?= htmlspecialchars($imageUrl, ENT_QUOTES, 'UTF-8') ?>">
    <?php endif; ?>

    <title>
        <?= $title ?> - SpaceMatch
        <?= $communityName ?>
    </title>

    <!-- Auto-redirect to SPA -->
    <meta http-equiv="refresh" content="0;url=<?= htmlspecialchars($spaUrl, ENT_QUOTES, 'UTF-8') ?>">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f8fafc;
            color: #334155;
        }

        .card {
            text-align: center;
            padding: 40px;
        }

        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        a {
            color: #6366f1;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="spinner"></div>
        <p>Redirecting to SpaceMatch Community...</p>
        <p><a href="<?= htmlspecialchars($spaUrl, ENT_QUOTES, 'UTF-8') ?>">Click here if not redirected
                automatically</a></p>
    </div>
    <script>window.location.replace(<?= json_encode($spaUrl) ?>);</script>
</body>

</html>