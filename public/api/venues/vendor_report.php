<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? '';

// Allow vendor + admin/superadmin
if (!in_array($role, ['vendor', 'admin', 'superadmin'])) {
    echo json_encode(['success' => false, 'message' => '벤더 또는 관리자 권한이 필요합니다.']);
    exit;
}

try {
    // Auto-migrate: add view_count column to venues
    try {
        $conn->exec("ALTER TABLE venues ADD COLUMN view_count INT DEFAULT 0");
    } catch (Exception $e) {
    }

    // If admin, allow viewing a specific vendor's report via ?vendor_id=
    $target_vendor = $user_id;
    if (in_array($role, ['admin', 'superadmin']) && isset($_GET['vendor_id'])) {
        $target_vendor = intval($_GET['vendor_id']);
    }

    // 1. My Venues with stats
    $stmt = $conn->prepare("
        SELECT v.id, v.name, v.location, v.status, v.price, v.pricing_unit, v.type, v.size, 
               v.view_count, v.created_at,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id) as app_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'rejected') as rejected_count,
               (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'pending') as pending_count
        FROM venues v 
        WHERE v.owner_id = ?
        ORDER BY v.created_at DESC
    ");
    $stmt->execute([$target_vendor]);
    $venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Overall stats
    $totalVenues = count($venues);
    $totalViews = 0;
    $totalApps = 0;
    $totalApproved = 0;
    $activeVenues = 0;

    foreach ($venues as &$v) {
        $v['view_count'] = intval($v['view_count'] ?? 0);
        $v['app_count'] = intval($v['app_count']);
        $v['approved_count'] = intval($v['approved_count']);
        $v['rejected_count'] = intval($v['rejected_count']);
        $v['pending_count'] = intval($v['pending_count']);
        $v['conversion_rate'] = $v['app_count'] > 0 ? round($v['approved_count'] / $v['app_count'] * 100, 1) : 0;

        $totalViews += $v['view_count'];
        $totalApps += $v['app_count'];
        $totalApproved += $v['approved_count'];
        if ($v['status'] === 'approved')
            $activeVenues++;
    }
    unset($v);

    $overallConversion = $totalApps > 0 ? round($totalApproved / $totalApps * 100, 1) : 0;

    // 3. Monthly application trend (last 6 months)
    $stmt = $conn->prepare("
        SELECT DATE_FORMAT(a.created_at, '%Y-%m') as month, COUNT(*) as count,
               SUM(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) as approved
        FROM applications a
        JOIN venues v ON a.venue_id = v.id
        WHERE v.owner_id = ?
        AND a.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(a.created_at, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([$target_vendor]);
    $monthlyTrend = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Applications by category
    $stmt = $conn->prepare("
        SELECT COALESCE(u.category, '기타') as category, COUNT(*) as count
        FROM applications a
        JOIN venues v ON a.venue_id = v.id
        JOIN users u ON a.user_id = u.id
        WHERE v.owner_id = ?
        GROUP BY u.category
        ORDER BY count DESC
        LIMIT 10
    ");
    $stmt->execute([$target_vendor]);
    $appsByCategory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Recent applications
    $stmt = $conn->prepare("
        SELECT a.id, a.status, a.created_at, a.is_priority,
               u.name as seller_name, u.category as seller_category,
               v.name as venue_name
        FROM applications a
        JOIN venues v ON a.venue_id = v.id
        JOIN users u ON a.user_id = u.id
        WHERE v.owner_id = ?
        ORDER BY a.created_at DESC
        LIMIT 10
    ");
    $stmt->execute([$target_vendor]);
    $recentApps = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 6. Venue performance ranking
    $venueRanking = $venues;
    usort($venueRanking, function ($a, $b) {
        return ($b['app_count'] + $b['view_count']) - ($a['app_count'] + $a['view_count']);
    });
    $venueRanking = array_slice($venueRanking, 0, 10);

    // 7. Previous period comparison (this month vs last month)
    $stmt = $conn->prepare("
        SELECT 
            SUM(CASE WHEN a.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') THEN 1 ELSE 0 END) as current_apps,
            SUM(CASE WHEN a.created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH) 
                AND a.created_at < DATE_FORMAT(NOW(), '%Y-%m-01') THEN 1 ELSE 0 END) as prev_apps,
            SUM(CASE WHEN a.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') AND a.status = 'approved' THEN 1 ELSE 0 END) as current_approved,
            SUM(CASE WHEN a.created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH) 
                AND a.created_at < DATE_FORMAT(NOW(), '%Y-%m-01') AND a.status = 'approved' THEN 1 ELSE 0 END) as prev_approved
        FROM applications a
        JOIN venues v ON a.venue_id = v.id
        WHERE v.owner_id = ?
        AND a.created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ");
    $stmt->execute([$target_vendor]);
    $periodRow = $stmt->fetch(PDO::FETCH_ASSOC);

    $currentApps = intval($periodRow['current_apps'] ?? 0);
    $prevApps = intval($periodRow['prev_apps'] ?? 0);
    $currentApproved = intval($periodRow['current_approved'] ?? 0);
    $prevApproved = intval($periodRow['prev_approved'] ?? 0);

    $previousPeriod = [
        'currentApps' => $currentApps,
        'prevApps' => $prevApps,
        'appsGrowth' => $prevApps > 0 ? round(($currentApps - $prevApps) / $prevApps * 100, 1) : ($currentApps > 0 ? 100 : 0),
        'currentApproved' => $currentApproved,
        'prevApproved' => $prevApproved,
        'approvedGrowth' => $prevApproved > 0 ? round(($currentApproved - $prevApproved) / $prevApproved * 100, 1) : ($currentApproved > 0 ? 100 : 0),
        'currentConversion' => $currentApps > 0 ? round($currentApproved / $currentApps * 100, 1) : 0,
        'prevConversion' => $prevApps > 0 ? round($prevApproved / $prevApps * 100, 1) : 0,
    ];

    // 8. Weekday distribution (applications by day of week)
    $stmt = $conn->prepare("
        SELECT DAYOFWEEK(a.created_at) as dow, COUNT(*) as count
        FROM applications a
        JOIN venues v ON a.venue_id = v.id
        WHERE v.owner_id = ?
        AND a.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
        GROUP BY DAYOFWEEK(a.created_at)
        ORDER BY dow
    ");
    $stmt->execute([$target_vendor]);
    $weekdayRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Map to Mon-Sun (MySQL DAYOFWEEK: 1=Sun,2=Mon,...,7=Sat → remap to Mon=0..Sun=6)
    $dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    $weekdayStats = array_fill(0, 7, 0);
    foreach ($weekdayRows as $r) {
        $mysqlDow = intval($r['dow']); // 1=Sun,2=Mon,...,7=Sat
        $idx = ($mysqlDow === 1) ? 6 : $mysqlDow - 2; // Remap to Mon=0..Sun=6
        $weekdayStats[$idx] = intval($r['count']);
    }
    $weekdayData = [];
    for ($i = 0; $i < 7; $i++) {
        $weekdayData[] = ['day' => $dayLabels[$i], 'count' => $weekdayStats[$i]];
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'summary' => [
                'totalVenues' => $totalVenues,
                'activeVenues' => $activeVenues,
                'totalViews' => $totalViews,
                'totalApps' => $totalApps,
                'totalApproved' => $totalApproved,
                'conversionRate' => $overallConversion
            ],
            'venues' => $venues,
            'monthlyTrend' => $monthlyTrend,
            'appsByCategory' => $appsByCategory,
            'recentApps' => $recentApps,
            'venueRanking' => $venueRanking,
            'previousPeriod' => $previousPeriod,
            'weekdayStats' => $weekdayData
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>