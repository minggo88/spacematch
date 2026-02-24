<?php
/**
 * Space Match 마케팅 API — 리포트 생성
 * 
 * 마케팅 성과 리포트 생성 및 데이터 내보내기 엔드포인트
 * 
 * 엔드포인트:
 *   GET  /api/marketing/reports/dashboard  — 대시보드 데이터
 *   GET  /api/marketing/reports/roi        — ROI 리포트
 *   GET  /api/marketing/reports/export     — CSV 내보내기
 *   POST /api/marketing/reports/custom     — 커스텀 리포트 생성
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../public/api/db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$resource = $segments[3] ?? 'dashboard';

try {
    switch ("$method:$resource") {
        case 'GET:dashboard':
            getDashboard($pdo);
            break;
        case 'GET:roi':
            getROIReport($pdo);
            break;
        case 'GET:export':
            exportCSV($pdo);
            break;
        case 'POST:custom':
            generateCustomReport($pdo);
            break;
        default:
            jsonResponse(['error' => 'Endpoint not found'], 404);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

// ── 대시보드 데이터 ──
function getDashboard($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $role = $_GET['role'] ?? 'seller'; // seller | vendor
    $period = $_GET['period'] ?? 'month';

    $data = [];

    // KPI 카드
    if ($role === 'seller') {
        $where = $userId ? 'AND user_id = ?' : '';
        $params = $userId ? [$userId] : [];
        $dateWhere = getDateCondition($period);

        $stmt = $pdo->prepare("SELECT 
            COALESCE(SUM(monthly_revenue), 0) as revenue,
            COALESCE(SUM(transaction_count), 0) as transactions,
            COALESCE(AVG(satisfaction_score), 0) as satisfaction,
            COUNT(DISTINCT country_code) as active_countries
            FROM seller_stats WHERE $dateWhere $where");
        $stmt->execute($params);
        $data['kpis'] = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 캠페인 요약
    $cmpWhere = $userId ? 'WHERE owner_id = ?' : '';
    $cmpParams = $userId ? [$userId] : [];

    $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM marketing_campaigns $cmpWhere GROUP BY status");
    $stmt->execute($cmpParams);
    $data['campaigns'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 최근 활동
    $stmt = $pdo->prepare("SELECT id, name, type, status, updated_at FROM marketing_campaigns $cmpWhere ORDER BY updated_at DESC LIMIT 5");
    $stmt->execute($cmpParams);
    $data['recent'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data['period'] = $period;
    $data['generatedAt'] = date('c');

    jsonResponse(['success' => true, 'data' => $data]);
}

// ── ROI 리포트 ──
function getROIReport($pdo)
{
    $userId = $_GET['user_id'] ?? null;
    $where = $userId ? 'WHERE owner_id = ?' : '';
    $params = $userId ? [$userId] : [];

    // 캠페인별 ROI
    $stmt = $pdo->prepare("SELECT id, name, type, 
        COALESCE(budget_total, 0) as total_cost,
        COALESCE(JSON_EXTRACT(metrics, '$.revenue'), 0) as revenue,
        COALESCE(JSON_EXTRACT(metrics, '$.conversions'), 0) as conversions
        FROM marketing_campaigns $where ORDER BY created_at DESC LIMIT 20");
    $stmt->execute($params);
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $report = array_map(function ($c) {
        $cost = floatval($c['total_cost']);
        $revenue = floatval($c['revenue']);
        $roi = $cost > 0 ? round(($revenue - $cost) / $cost * 100, 2) : 0;
        $roas = $cost > 0 ? round($revenue / $cost, 2) : 0;

        return [
            'id' => $c['id'],
            'name' => $c['name'],
            'type' => $c['type'],
            'cost' => $cost,
            'revenue' => $revenue,
            'profit' => $revenue - $cost,
            'roi_percent' => $roi,
            'roas' => $roas,
            'conversions' => intval($c['conversions']),
            'cpa' => intval($c['conversions']) > 0 ? round($cost / intval($c['conversions'])) : 0,
        ];
    }, $campaigns);

    $totalCost = array_sum(array_column($report, 'cost'));
    $totalRevenue = array_sum(array_column($report, 'revenue'));

    jsonResponse([
        'success' => true,
        'data' => $report,
        'summary' => [
            'total_cost' => $totalCost,
            'total_revenue' => $totalRevenue,
            'total_profit' => $totalRevenue - $totalCost,
            'overall_roi' => $totalCost > 0 ? round(($totalRevenue - $totalCost) / $totalCost * 100, 2) : 0,
            'overall_roas' => $totalCost > 0 ? round($totalRevenue / $totalCost, 2) : 0,
        ],
    ]);
}

// ── CSV 내보내기 ──
function exportCSV($pdo)
{
    $type = $_GET['type'] ?? 'sales'; // sales | campaigns | promotions
    $userId = $_GET['user_id'] ?? null;

    $where = $userId ? 'WHERE user_id = ?' : '';
    $params = $userId ? [$userId] : [];

    switch ($type) {
        case 'campaigns':
            $cmpWhere = $userId ? 'WHERE owner_id = ?' : '';
            $stmt = $pdo->prepare("SELECT id, name, type, side, status, budget_total, schedule_start, schedule_end, created_at FROM marketing_campaigns $cmpWhere ORDER BY created_at DESC");
            $stmt->execute($params);
            break;
        default: // sales
            $stmt = $pdo->prepare("SELECT record_date, country_code, monthly_revenue, transaction_count, customer_count, unit_price, best_selling_item, satisfaction_score FROM seller_stats $where ORDER BY record_date DESC");
            $stmt->execute($params);
    }

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        jsonResponse(['success' => false, 'error' => '내보낼 데이터가 없습니다']);
        return;
    }

    // CSV 생성
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="marketing_' . $type . '_' . date('Ymd') . '.csv"');

    echo "\xEF\xBB\xBF"; // BOM for Excel
    $output = fopen('php://output', 'w');
    fputcsv($output, array_keys($rows[0]));
    foreach ($rows as $row) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}

// ── 커스텀 리포트 ──
function generateCustomReport($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);

    $metrics = $data['metrics'] ?? ['revenue', 'transactions'];
    $groupBy = $data['group_by'] ?? 'month';
    $dateFrom = $data['date_from'] ?? date('Y-m-d', strtotime('-6 months'));
    $dateTo = $data['date_to'] ?? date('Y-m-d');
    $userId = $data['user_id'] ?? null;

    $selectFields = ['COUNT(*) as record_count'];
    foreach ($metrics as $metric) {
        switch ($metric) {
            case 'revenue':
                $selectFields[] = 'SUM(monthly_revenue) as total_revenue';
                break;
            case 'transactions':
                $selectFields[] = 'SUM(transaction_count) as total_transactions';
                break;
            case 'customers':
                $selectFields[] = 'SUM(customer_count) as total_customers';
                break;
            case 'satisfaction':
                $selectFields[] = 'AVG(satisfaction_score) as avg_satisfaction';
                break;
        }
    }

    $groupByField = match ($groupBy) {
        'day' => "DATE_FORMAT(record_date, '%Y-%m-%d')",
        'week' => "YEARWEEK(record_date)",
        'country' => "COALESCE(country_code, 'KR')",
        default => "DATE_FORMAT(record_date, '%Y-%m')",
    };

    $where = "record_date BETWEEN ? AND ?";
    $params = [$dateFrom, $dateTo];
    if ($userId) {
        $where .= ' AND user_id = ?';
        $params[] = $userId;
    }

    $select = implode(', ', $selectFields);
    $stmt = $pdo->prepare("SELECT $groupByField as group_key, $select FROM seller_stats WHERE $where GROUP BY group_key ORDER BY group_key ASC");
    $stmt->execute($params);

    jsonResponse([
        'success' => true,
        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        'config' => ['metrics' => $metrics, 'groupBy' => $groupBy, 'dateFrom' => $dateFrom, 'dateTo' => $dateTo],
        'generatedAt' => date('c'),
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

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
