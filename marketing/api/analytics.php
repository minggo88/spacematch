<?php
/**
 * Space Match 마케팅 API — 분석 데이터
 * 
 * 매출 분석, 트렌드, 세그먼테이션 데이터 조회 엔드포인트
 * 
 * 엔드포인트:
 *   GET /api/marketing/analytics/summary      — 요약 통계
 *   GET /api/marketing/analytics/trends        — 트렌드 데이터
 *   GET /api/marketing/analytics/segments      — 고객 세그먼트
 *   GET /api/marketing/analytics/countries     — 국가별 성과
 *   GET /api/marketing/analytics/forecast      — 매출 예측
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../public/api/db_config.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$resource = $segments[3] ?? 'summary';

try {
    switch ($resource) {
        case 'summary':
            getSummary($pdo);
            break;
        case 'trends':
            getTrends($pdo);
            break;
        case 'segments':
            getSegments($pdo);
            break;
        case 'countries':
            getCountryPerformance($pdo);
            break;
        case 'forecast':
            getForecast($pdo);
            break;
        default:
            jsonResponse(['error' => 'Endpoint not found'], 404);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

// ── 요약 통계 ──
function getSummary($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $period = $_GET['period'] ?? 'month'; // month | quarter | year

    $dateCondition = getDateCondition($period);
    $where = $dateCondition;
    $params = [];

    if ($userId) {
        $where .= ' AND user_id = ?';
        $params[] = $userId;
    }

    $stmt = $pdo->prepare("SELECT 
        COUNT(*) as record_count,
        COALESCE(SUM(monthly_revenue), 0) as total_revenue,
        COALESCE(AVG(monthly_revenue), 0) as avg_revenue,
        COALESCE(MAX(monthly_revenue), 0) as max_revenue,
        COALESCE(SUM(transaction_count), 0) as total_transactions,
        COALESCE(AVG(customer_count), 0) as avg_customers,
        COALESCE(AVG(satisfaction_score), 0) as avg_satisfaction
        FROM seller_stats WHERE $where");

    $stmt->execute($params);
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    // 이전 기간 비교
    $prevDateCondition = getPreviousPeriodCondition($period);
    $prevWhere = $prevDateCondition;
    if ($userId) {
        $prevWhere .= ' AND user_id = ?';
    }

    $prevStmt = $pdo->prepare("SELECT COALESCE(SUM(monthly_revenue), 0) as prev_revenue, COUNT(*) as prev_count FROM seller_stats WHERE $prevWhere");
    $prevStmt->execute($params);
    $prev = $prevStmt->fetch(PDO::FETCH_ASSOC);

    $summary['revenue_growth'] = $prev['prev_revenue'] > 0
        ? round(($summary['total_revenue'] - $prev['prev_revenue']) / $prev['prev_revenue'] * 100, 2)
        : 0;
    $summary['period'] = $period;

    jsonResponse(['success' => true, 'data' => $summary]);
}

// ── 트렌드 데이터 ──
function getTrends($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $metric = $_GET['metric'] ?? 'revenue'; // revenue | transactions | customers
    $groupBy = $_GET['group_by'] ?? 'month'; // day | month

    $dateFormat = $groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m';
    $field = match ($metric) {
        'transactions' => 'SUM(transaction_count)',
        'customers' => 'SUM(customer_count)',
        default => 'SUM(monthly_revenue)',
    };

    $where = '1=1';
    $params = [];
    if ($userId) {
        $where .= ' AND user_id = ?';
        $params[] = $userId;
    }

    $stmt = $pdo->prepare("SELECT DATE_FORMAT(record_date, '$dateFormat') as period, $field as value, COUNT(*) as records
        FROM seller_stats WHERE $where GROUP BY period ORDER BY period ASC LIMIT 365");
    $stmt->execute($params);

    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'metric' => $metric, 'groupBy' => $groupBy]);
}

// ── 고객 세그먼트 ──
function getSegments($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $where = $userId ? 'WHERE user_id = ?' : '';
    $params = $userId ? [$userId] : [];

    // RFM 기반 간이 세그먼트
    $stmt = $pdo->prepare("SELECT 
        country_code,
        COUNT(*) as frequency,
        SUM(monthly_revenue) as monetary,
        MAX(record_date) as last_purchase,
        DATEDIFF(NOW(), MAX(record_date)) as recency_days,
        AVG(satisfaction_score) as avg_satisfaction
        FROM seller_stats $where
        GROUP BY country_code
        ORDER BY monetary DESC");
    $stmt->execute($params);

    $segments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 세그먼트 분류
    foreach ($segments as &$seg) {
        $seg['segment'] = classifySegment($seg);
    }

    jsonResponse(['success' => true, 'data' => $segments]);
}

function classifySegment($seg)
{
    if ($seg['monetary'] > 10000000 && $seg['recency_days'] < 30)
        return 'champion';
    if ($seg['frequency'] > 10 && $seg['monetary'] > 5000000)
        return 'loyal';
    if ($seg['recency_days'] < 30 && $seg['frequency'] <= 3)
        return 'new';
    if ($seg['recency_days'] > 90)
        return 'at_risk';
    return 'regular';
}

// ── 국가별 성과 ──
function getCountryPerformance($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $where = $userId ? 'WHERE user_id = ?' : '';
    $params = $userId ? [$userId] : [];

    $stmt = $pdo->prepare("SELECT 
        COALESCE(country_code, 'KR') as country,
        COUNT(*) as records,
        SUM(monthly_revenue) as total_revenue,
        AVG(monthly_revenue) as avg_revenue,
        SUM(transaction_count) as total_transactions,
        AVG(satisfaction_score) as avg_satisfaction
        FROM seller_stats $where
        GROUP BY country_code
        ORDER BY total_revenue DESC");
    $stmt->execute($params);

    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 매출 예측 ──
function getForecast($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $periods = min(12, max(1, intval($_GET['periods'] ?? 3)));
    $where = $userId ? 'WHERE user_id = ?' : '';
    $params = $userId ? [$userId] : [];

    // 최근 12개월 월별 매출
    $stmt = $pdo->prepare("SELECT DATE_FORMAT(record_date, '%Y-%m') as month, SUM(monthly_revenue) as revenue
        FROM seller_stats $where
        GROUP BY month ORDER BY month DESC LIMIT 12");
    $stmt->execute($params);
    $monthly = array_reverse($stmt->fetchAll(PDO::FETCH_ASSOC));

    if (count($monthly) < 3) {
        jsonResponse(['success' => true, 'data' => [], 'message' => '예측에 최소 3개월 데이터가 필요합니다']);
        return;
    }

    // 단순 선형 회귀
    $revenues = array_column($monthly, 'revenue');
    $n = count($revenues);
    $xMean = ($n - 1) / 2;
    $yMean = array_sum($revenues) / $n;

    $num = 0;
    $den = 0;
    foreach ($revenues as $x => $y) {
        $num += ($x - $xMean) * ($y - $yMean);
        $den += pow($x - $xMean, 2);
    }

    $slope = $den != 0 ? $num / $den : 0;
    $intercept = $yMean - $slope * $xMean;

    $forecast = [];
    $lastMonth = end($monthly)['month'];
    for ($i = 1; $i <= $periods; $i++) {
        $predicted = max(0, round($intercept + $slope * ($n - 1 + $i)));
        $futureDate = date('Y-m', strtotime("$lastMonth-01 +{$i} months"));
        $forecast[] = [
            'month' => $futureDate,
            'predicted_revenue' => $predicted,
            'lower_bound' => max(0, round($predicted * 0.85)),
            'upper_bound' => round($predicted * 1.15),
        ];
    }

    jsonResponse([
        'success' => true,
        'data' => $forecast,
        'trend' => $slope > 0 ? 'growing' : ($slope < 0 ? 'declining' : 'stable'),
        'historical' => $monthly,
    ]);
}

// ── 헬퍼 ──
function getDateCondition($period)
{
    return match ($period) {
        'week' => "record_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
        'quarter' => "record_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)",
        'year' => "record_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)",
        default => "record_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)",
    };
}

function getPreviousPeriodCondition($period)
{
    return match ($period) {
        'week' => "record_date >= DATE_SUB(NOW(), INTERVAL 14 DAY) AND record_date < DATE_SUB(NOW(), INTERVAL 7 DAY)",
        'quarter' => "record_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND record_date < DATE_SUB(NOW(), INTERVAL 3 MONTH)",
        'year' => "record_date >= DATE_SUB(NOW(), INTERVAL 2 YEAR) AND record_date < DATE_SUB(NOW(), INTERVAL 1 YEAR)",
        default => "record_date >= DATE_SUB(NOW(), INTERVAL 2 MONTH) AND record_date < DATE_SUB(NOW(), INTERVAL 1 MONTH)",
    };
}

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
