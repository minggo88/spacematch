<?php
// ── 마진율 계산기 통계 조회 API ──
// admin/superadmin 전용
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';

session_start();

// 인증 체크
$userRole = $_SESSION['user_role'] ?? '';
if (!isset($_SESSION['user_id']) || !in_array($userRole, ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => '관리자 권한이 필요합니다']);
    exit();
}

$period = isset($_GET['period']) ? $_GET['period'] : '7d';
$startDate = isset($_GET['start_date']) ? $_GET['start_date'] : null;
$endDate = isset($_GET['end_date']) ? $_GET['end_date'] : null;

// 기간 계산
switch ($period) {
    case 'today':
        $dateFrom = date('Y-m-d');
        $dateTo = date('Y-m-d');
        break;
    case '7d':
        $dateFrom = date('Y-m-d', strtotime('-6 days'));
        $dateTo = date('Y-m-d');
        break;
    case '30d':
        $dateFrom = date('Y-m-d', strtotime('-29 days'));
        $dateTo = date('Y-m-d');
        break;
    case 'custom':
        $dateFrom = $startDate ?: date('Y-m-d', strtotime('-7 days'));
        $dateTo = $endDate ?: date('Y-m-d');
        break;
    default:
        $dateFrom = date('Y-m-d', strtotime('-6 days'));
        $dateTo = date('Y-m-d');
}

try {
    // ═══ 1. KPI 요약 ═══
    $kpi = $conn->prepare("
        SELECT
            COALESCE(SUM(page_views), 0) AS total_views,
            COALESCE(SUM(unique_visitors), 0) AS total_uv,
            COALESCE(SUM(calculations), 0) AS total_calculations,
            COALESCE(SUM(unlock_attempts), 0) AS total_unlocks,
            COALESCE(SUM(conversions), 0) AS total_conversions,
            COALESCE(SUM(mobile_views), 0) AS total_mobile,
            COALESCE(SUM(desktop_views), 0) AS total_desktop
        FROM calc_daily_stats
        WHERE stat_date BETWEEN :from AND :to
    ");
    $kpi->execute([':from' => $dateFrom, ':to' => $dateTo]);
    $summary = $kpi->fetch(PDO::FETCH_ASSOC);

    // 전환율 계산
    $summary['conversion_rate'] = $summary['total_uv'] > 0
        ? round(($summary['total_conversions'] / $summary['total_uv']) * 100, 1)
        : 0;

    // ═══ 2. 전일 대비 변화 ═══
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $dayBefore = date('Y-m-d', strtotime('-2 days'));

    $todayStats = $conn->prepare("SELECT * FROM calc_daily_stats WHERE stat_date = CURDATE()");
    $todayStats->execute();
    $todayData = $todayStats->fetch(PDO::FETCH_ASSOC);

    $yesterdayStats = $conn->prepare("SELECT * FROM calc_daily_stats WHERE stat_date = :d");
    $yesterdayStats->execute([':d' => $yesterday]);
    $yesterdayData = $yesterdayStats->fetch(PDO::FETCH_ASSOC);

    $changes = [
        'views' => [
            'today' => $todayData['page_views'] ?? 0,
            'yesterday' => $yesterdayData['page_views'] ?? 0,
        ],
        'uv' => [
            'today' => $todayData['unique_visitors'] ?? 0,
            'yesterday' => $yesterdayData['unique_visitors'] ?? 0,
        ],
        'calculations' => [
            'today' => $todayData['calculations'] ?? 0,
            'yesterday' => $yesterdayData['calculations'] ?? 0,
        ],
        'conversions' => [
            'today' => $todayData['conversions'] ?? 0,
            'yesterday' => $yesterdayData['conversions'] ?? 0,
        ],
    ];

    // ═══ 3. 일별 추이 데이터 ═══
    $daily = $conn->prepare("
        SELECT stat_date, page_views, unique_visitors, calculations,
               unlock_attempts, conversions, mobile_views, desktop_views
        FROM calc_daily_stats
        WHERE stat_date BETWEEN :from AND :to
        ORDER BY stat_date ASC
    ");
    $daily->execute([':from' => $dateFrom, ':to' => $dateTo]);
    $dailyData = $daily->fetchAll(PDO::FETCH_ASSOC);

    // 누락된 날짜 채우기
    $dateRange = [];
    $current = new DateTime($dateFrom);
    $end = new DateTime($dateTo);
    while ($current <= $end) {
        $dateRange[$current->format('Y-m-d')] = [
            'stat_date' => $current->format('Y-m-d'),
            'page_views' => 0,
            'unique_visitors' => 0,
            'calculations' => 0,
            'unlock_attempts' => 0,
            'conversions' => 0,
            'mobile_views' => 0,
            'desktop_views' => 0,
        ];
        $current->modify('+1 day');
    }
    foreach ($dailyData as $row) {
        $dateRange[$row['stat_date']] = $row;
    }
    $chartData = array_values($dateRange);

    // ═══ 4. 리퍼러 분석 ═══
    $refStmt = $conn->prepare("
        SELECT
            CASE
                WHEN referrer = '' OR referrer IS NULL THEN '직접 방문'
                WHEN referrer LIKE '%google%' THEN 'Google'
                WHEN referrer LIKE '%naver%' THEN 'Naver'
                WHEN referrer LIKE '%daum%' THEN 'Daum'
                WHEN referrer LIKE '%bing%' THEN 'Bing'
                WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.%' THEN 'Facebook'
                WHEN referrer LIKE '%instagram%' THEN 'Instagram'
                WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' THEN 'Twitter/X'
                WHEN referrer LIKE '%youtube%' THEN 'YouTube'
                WHEN referrer LIKE '%kakao%' THEN 'KakaoTalk'
                WHEN referrer LIKE '%band.us%' THEN 'Band'
                ELSE '기타'
            END AS source,
            COUNT(*) AS count
        FROM calc_page_views
        WHERE DATE(created_at) BETWEEN :from AND :to
        GROUP BY source
        ORDER BY count DESC
        LIMIT 10
    ");
    $refStmt->execute([':from' => $dateFrom, ':to' => $dateTo]);
    $referrers = $refStmt->fetchAll(PDO::FETCH_ASSOC);

    // ═══ 5. 최근 방문 로그 (최신 20건) ═══
    $recentStmt = $conn->prepare("
        SELECT session_id, ip_address, device_type, referrer, page_url, created_at
        FROM calc_page_views
        WHERE DATE(created_at) BETWEEN :from AND :to
        ORDER BY created_at DESC
        LIMIT 20
    ");
    $recentStmt->execute([':from' => $dateFrom, ':to' => $dateTo]);
    $recentLogs = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    // ═══ 6. 시간대별 분포 (오늘) ═══
    $hourlyStmt = $conn->prepare("
        SELECT HOUR(created_at) AS hour, COUNT(*) AS count
        FROM calc_page_views
        WHERE DATE(created_at) = CURDATE()
        GROUP BY HOUR(created_at)
        ORDER BY hour
    ");
    $hourlyStmt->execute();
    $hourlyRaw = $hourlyStmt->fetchAll(PDO::FETCH_ASSOC);

    // 24시간 채우기
    $hourly = array_fill(0, 24, 0);
    foreach ($hourlyRaw as $row) {
        $hourly[(int) $row['hour']] = (int) $row['count'];
    }

    echo json_encode([
        'success' => true,
        'period' => ['from' => $dateFrom, 'to' => $dateTo],
        'summary' => $summary,
        'changes' => $changes,
        'chart' => $chartData,
        'referrers' => $referrers,
        'recent_logs' => $recentLogs,
        'hourly' => $hourly,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>