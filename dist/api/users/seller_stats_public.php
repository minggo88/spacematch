<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login (any role)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$MIN_COUNT = 3; // Privacy threshold: only show aggregates with 3+ sellers

try {
    // ── 1. Fetch all stats joined with user category (no personal info) ──
    $stmt = $conn->query("
        SELECT s.record_type, s.record_date, s.monthly_revenue, s.customer_count, s.transaction_count,
               s.avg_unit_price, s.best_selling_item, s.venue_type, s.region,
               s.satisfaction, u.category
        FROM seller_stats s
        JOIN users u ON s.user_id = u.id
        WHERE u.role = 'seller'
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        echo json_encode([
            "success" => true,
            "data" => [
                "summary" => ["totalSellers" => 0, "totalRecords" => 0, "avgRevenue" => 0, "avgUnitPrice" => 0],
                "byCategory" => [],
                "byRegion" => [],
                "byVenueType" => [],
                "monthlyTrend" => [],
                "revenueDistribution" => [],
                "satisfactionByType" => [],
                "topKeywords" => [],
            ]
        ]);
        exit;
    }

    // ── 2. Aggregate data ──
    $sellerIds = []; // track unique sellers per group
    $allRevenues = [];
    $allUnitPrices = [];
    $byCategory = [];    // category => { revenues, customers, transactions, unitPrices, sellerSet }
    $byRegion = [];      // region => { revenues, sellerSet }
    $byVenueType = [];   // venueType => { revenues, satisfactions, sellerSet }
    $byMonth = [];       // YYYY-MM => { revenues, sellerSet }
    $keywords = [];      // keyword => count
    $satisfactionByType = [];

    // Unique sellers across all data
    $uniqueSellers = [];

    foreach ($rows as $r) {
        // We don't have user_id in the query result for privacy, 
        // but we need to count unique sellers. Use a workaround via record_month uniqueness.
        // Actually, let's re-query to get seller count
        $revenue = intval($r['monthly_revenue']);
        $customers = intval($r['customer_count']);
        $transactions = intval($r['transaction_count']);
        $unitPrice = intval($r['avg_unit_price']);
        $category = $r['category'] ?: '미분류';
        $region = $r['region'] ?: '미분류';
        $venueType = $r['venue_type'] ?: '기타';
        // For monthly trend, extract YYYY-MM portion from record_date
        $recordDate = $r['record_date'] ?? '';
        $month = strlen($recordDate) >= 7 ? substr($recordDate, 0, 7) : $recordDate;
        $satisfaction = intval($r['satisfaction']);
        $bestItem = trim($r['best_selling_item'] ?? '');

        if ($revenue > 0)
            $allRevenues[] = $revenue;
        if ($unitPrice > 0)
            $allUnitPrices[] = $unitPrice;

        // By category
        if (!isset($byCategory[$category])) {
            $byCategory[$category] = ['revenues' => [], 'customers' => [], 'transactions' => [], 'unitPrices' => [], 'count' => 0];
        }
        $byCategory[$category]['count']++;
        if ($revenue > 0)
            $byCategory[$category]['revenues'][] = $revenue;
        if ($customers > 0)
            $byCategory[$category]['customers'][] = $customers;
        if ($transactions > 0)
            $byCategory[$category]['transactions'][] = $transactions;
        if ($unitPrice > 0)
            $byCategory[$category]['unitPrices'][] = $unitPrice;

        // By region
        if (!isset($byRegion[$region])) {
            $byRegion[$region] = ['revenues' => [], 'count' => 0];
        }
        $byRegion[$region]['count']++;
        if ($revenue > 0)
            $byRegion[$region]['revenues'][] = $revenue;

        // By venue type
        if (!isset($byVenueType[$venueType])) {
            $byVenueType[$venueType] = ['revenues' => [], 'satisfactions' => [], 'count' => 0];
        }
        $byVenueType[$venueType]['count']++;
        if ($revenue > 0)
            $byVenueType[$venueType]['revenues'][] = $revenue;
        if ($satisfaction > 0)
            $byVenueType[$venueType]['satisfactions'][] = $satisfaction;

        // By month
        if (!isset($byMonth[$month])) {
            $byMonth[$month] = ['revenues' => [], 'count' => 0];
        }
        $byMonth[$month]['count']++;
        if ($revenue > 0)
            $byMonth[$month]['revenues'][] = $revenue;

        // Keywords from best_selling_item
        if (!empty($bestItem)) {
            // Split by common separators
            $items = preg_split('/[,\/·\s]+/u', $bestItem);
            foreach ($items as $item) {
                $item = trim($item);
                if (mb_strlen($item) < 2)
                    continue; // skip single chars
                if (!isset($keywords[$item]))
                    $keywords[$item] = 0;
                $keywords[$item]++;
            }
        }
    }

    // Count unique sellers
    $sellerCount = $conn->query("SELECT COUNT(DISTINCT user_id) FROM seller_stats")->fetchColumn();

    // ── 3. Build response (privacy-safe) ──

    // Helper
    function avg($arr)
    {
        if (empty($arr))
            return 0;
        return round(array_sum($arr) / count($arr));
    }

    // Summary
    $summary = [
        'totalSellers' => intval($sellerCount),
        'totalRecords' => count($rows),
        'avgRevenue' => avg($allRevenues),
        'avgUnitPrice' => avg($allUnitPrices),
        'totalCustomers' => array_sum(array_column($rows, 'customer_count')),
        'totalTransactions' => array_sum(array_column($rows, 'transaction_count')),
    ];

    // By category (only show if count >= MIN_COUNT)
    $categoryStats = [];
    foreach ($byCategory as $cat => $data) {
        if ($data['count'] < $MIN_COUNT)
            continue;
        $categoryStats[] = [
            'label' => $cat,
            'avgRevenue' => avg($data['revenues']),
            'avgUnitPrice' => avg($data['unitPrices']),
            'avgCustomers' => avg($data['customers']),
            'count' => $data['count'],
        ];
    }
    usort($categoryStats, function ($a, $b) {
        return $b['avgRevenue'] - $a['avgRevenue'];
    });

    // By region (only show if count >= MIN_COUNT)
    $regionStats = [];
    foreach ($byRegion as $reg => $data) {
        if ($data['count'] < $MIN_COUNT)
            continue;
        $regionStats[] = [
            'label' => $reg,
            'avgRevenue' => avg($data['revenues']),
            'count' => $data['count'],
        ];
    }
    usort($regionStats, function ($a, $b) {
        return $b['avgRevenue'] - $a['avgRevenue'];
    });

    // By venue type (only show if count >= MIN_COUNT)
    $venueTypeStats = [];
    foreach ($byVenueType as $vt => $data) {
        if ($data['count'] < $MIN_COUNT)
            continue;
        $venueTypeStats[] = [
            'label' => $vt,
            'avgRevenue' => avg($data['revenues']),
            'avgSatisfaction' => empty($data['satisfactions']) ? 0 : round(array_sum($data['satisfactions']) / count($data['satisfactions']), 1),
            'count' => $data['count'],
        ];
    }
    usort($venueTypeStats, function ($a, $b) {
        return $b['avgRevenue'] - $a['avgRevenue'];
    });

    // Monthly trend (last 12 months)
    ksort($byMonth);
    $monthlyTrend = [];
    foreach ($byMonth as $m => $data) {
        $monthlyTrend[] = [
            'month' => $m,
            'avgRevenue' => avg($data['revenues']),
            'count' => $data['count'],
        ];
    }
    $monthlyTrend = array_slice($monthlyTrend, -12);

    // Revenue distribution
    $ranges = [
        ['label' => '~100만', 'min' => 0, 'max' => 1000000],
        ['label' => '100~300만', 'min' => 1000001, 'max' => 3000000],
        ['label' => '300~500만', 'min' => 3000001, 'max' => 5000000],
        ['label' => '500~1000만', 'min' => 5000001, 'max' => 10000000],
        ['label' => '1000~3000만', 'min' => 10000001, 'max' => 30000000],
        ['label' => '3000만+', 'min' => 30000001, 'max' => PHP_INT_MAX],
    ];
    $revenueDistribution = [];
    foreach ($ranges as $range) {
        $count = 0;
        foreach ($allRevenues as $rev) {
            if ($rev >= $range['min'] && $rev <= $range['max'])
                $count++;
        }
        $revenueDistribution[] = ['label' => $range['label'], 'count' => $count];
    }

    // Top keywords (top 15)
    arsort($keywords);
    $topKeywords = [];
    $ki = 0;
    foreach ($keywords as $kw => $cnt) {
        if ($ki >= 15)
            break;
        if ($cnt < 2)
            continue; // only show keywords that appear 2+ times
        $topKeywords[] = ['label' => $kw, 'count' => $cnt];
        $ki++;
    }

    // Satisfaction by venue type (reuse venueTypeStats)
    $satisfactionStats = [];
    foreach ($byVenueType as $vt => $data) {
        if ($data['count'] < $MIN_COUNT || empty($data['satisfactions']))
            continue;
        $satisfactionStats[] = [
            'label' => $vt,
            'avgSatisfaction' => round(array_sum($data['satisfactions']) / count($data['satisfactions']), 1),
            'count' => count($data['satisfactions']),
        ];
    }
    usort($satisfactionStats, function ($a, $b) {
        return $b['avgSatisfaction'] * 10 - $a['avgSatisfaction'] * 10;
    });

    echo json_encode([
        "success" => true,
        "data" => [
            "summary" => $summary,
            "byCategory" => $categoryStats,
            "byRegion" => $regionStats,
            "byVenueType" => $venueTypeStats,
            "monthlyTrend" => $monthlyTrend,
            "revenueDistribution" => $revenueDistribution,
            "satisfactionByType" => $satisfactionStats,
            "topKeywords" => $topKeywords,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>