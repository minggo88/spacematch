<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

try {
    // Auto-migrate: add view_count to venues if not exists (once per session)
    if (empty($_SESSION['_ddl_venues_view_count'])) {
        try {
            $conn->exec("ALTER TABLE venues ADD COLUMN view_count INT DEFAULT 0");
        } catch (Exception $e) {
        }
        $_SESSION['_ddl_venues_view_count'] = true;
    }

    $limit = min(max(intval($_GET['limit'] ?? 30), 1), 100);

    $query = "
        SELECT v.id, v.name, v.location, v.type, v.size, v.price, v.pricing_unit,
               v.images, v.view_count, v.created_at, v.status,
               u.name as owner_name, u.brand_name as owner_brand,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id) as app_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as recent_app_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_app_count
        FROM venues v
        JOIN users u ON v.owner_id = u.id
        WHERE v.status = 'approved'
        ORDER BY ((SELECT COUNT(*) FROM applications a2 WHERE a2.venue_id = v.id) + COALESCE(v.view_count, 0)) DESC, v.created_at DESC
        LIMIT :limit
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse images JSON + compute metrics
    $typeDistribution = [];
    $totalViews = 0;
    $totalApps = 0;

    foreach ($venues as &$v) {
        $v['view_count'] = intval($v['view_count'] ?? 0);
        $v['app_count'] = intval($v['app_count']);
        $v['approved_count'] = intval($v['approved_count'] ?? 0);
        $v['recent_app_count'] = intval($v['recent_app_count']);
        $v['monthly_app_count'] = intval($v['monthly_app_count'] ?? 0);

        if (is_string($v['images'])) {
            $imgs = json_decode($v['images'], true);
            $v['images'] = is_array($imgs) ? $imgs : [];
        }

        $v['popularity_score'] = $v['app_count'] + $v['view_count'];

        // Competition ratio (applications per 100 views)
        $v['competition_ratio'] = $v['view_count'] > 0
            ? round($v['app_count'] / $v['view_count'] * 100, 1)
            : 0;

        // Approval rate
        $v['approval_rate'] = $v['app_count'] > 0
            ? round($v['approved_count'] / $v['app_count'] * 100, 1)
            : 0;

        // Trend classification
        if ($v['recent_app_count'] >= 3) {
            $v['trend'] = 'hot';
        } elseif ($v['recent_app_count'] >= 1) {
            $v['trend'] = 'rising';
        } else {
            $v['trend'] = 'steady';
        }

        // Type distribution accumulation
        $type = $v['type'] ?: '기타';
        $typeDistribution[$type] = ($typeDistribution[$type] ?? 0) + 1;

        $totalViews += $v['view_count'];
        $totalApps += $v['app_count'];
    }
    unset($v);

    // Stats
    $totalVenues = count($venues);
    $hotCount = count(array_filter($venues, fn($v) => $v['trend'] === 'hot'));
    $risingCount = count(array_filter($venues, fn($v) => $v['trend'] === 'rising'));

    // Sort type distribution descending
    arsort($typeDistribution);
    $typeStats = [];
    foreach ($typeDistribution as $type => $count) {
        $typeStats[] = ['type' => $type, 'count' => $count];
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'venues' => $venues,
            'stats' => [
                'total' => $totalVenues,
                'hot' => $hotCount,
                'rising' => $risingCount,
                'avgViews' => $totalVenues > 0 ? round($totalViews / $totalVenues) : 0,
                'avgApps' => $totalVenues > 0 ? round($totalApps / $totalVenues, 1) : 0,
                'avgCompetition' => $totalViews > 0 ? round($totalApps / $totalViews * 100, 1) : 0,
            ],
            'typeDistribution' => $typeStats
        ]
    ]);

} catch (PDOException $e) {
    error_log('[popular_venues] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '시스템 오류가 발생했습니다.']);
}
?>