<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

// Suppress PHP warnings/notices from appearing in JSON output
error_reporting(E_ERROR);

// Require login
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

try {
    // 1. Fetch all active venues with relevant fields
    $stmt = $conn->prepare("
        SELECT id, name, type, region, location, size, price,
               commission_rate, avg_sales, popular_categories, target_customers,
               day_price, week_price, month_price, max_sellers,
               created_at
        FROM venues
        WHERE status = 'approved'
    ");
    $stmt->execute();
    $venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalVenues = count($venues);

    // Helper: parse Korean avg_sales text to numeric value (in 만원)
    // e.g. "500만원" -> 500, "약 1000만원" -> 1000, "5천만원" -> 5000, "3억" -> 30000
    function parseAvgSales($text)
    {
        if (empty($text))
            return null;

        // Remove whitespace, 약, ~, 원
        $text = preg_replace('/[\s약~원,]/u', '', $text);

        // Pattern: number + unit
        $value = null;

        // Try: N억N천만 or N억
        if (preg_match('/(\d+(?:\.\d+)?)억/u', $text, $m)) {
            $value = floatval($m[1]) * 10000; // 억 -> 만원
            if (preg_match('/(\d+(?:\.\d+)?)천만/u', $text, $m2)) {
                $value += floatval($m2[1]) * 1000;
            } elseif (preg_match('/억(\d+(?:\.\d+)?)만/u', $text, $m2)) {
                $value += floatval($m2[1]);
            }
            return $value;
        }

        // Try: N천만
        if (preg_match('/(\d+(?:\.\d+)?)천만/u', $text, $m)) {
            return floatval($m[1]) * 1000;
        }

        // Try: N백만
        if (preg_match('/(\d+(?:\.\d+)?)백만/u', $text, $m)) {
            return floatval($m[1]) * 100;
        }

        // Try: N만
        if (preg_match('/(\d+(?:\.\d+)?)만/u', $text, $m)) {
            return floatval($m[1]);
        }

        // Try: N천
        if (preg_match('/(\d+(?:\.\d+)?)천/u', $text, $m)) {
            return floatval($m[1]) * 0.1; // 천원 -> 0.1만원
        }

        // Try plain number (assume 만원 if > 100, else raw 만원)
        if (preg_match('/^(\d+(?:\.\d+)?)$/u', $text, $m)) {
            $num = floatval($m[1]);
            // If very large number like 5000000, convert from 원 to 만원
            if ($num >= 10000)
                return $num / 10000;
            return $num;
        }

        return null;
    }

    // 2. Aggregate stats
    $priceByRegion = [];
    $priceByType = [];
    $priceBySize = [];
    $salesByRegion = [];
    $salesByType = [];
    $commissions = [];
    $allCategories = [];
    $allPrices = [];
    $salesValues = [];
    $monthlyVenueCount = [];
    $venueCountByRegion = [];
    $categoriesByRegion = [];
    $typesByRegion = [];

    // District-level stats
    $districtData = []; // [region][district] => { prices:[], sales:[], count:int, customers:{} }

    // Target customer stats
    $allCustomerTypes = [];
    $customersByRegion = [];
    $priceByCustomer = [];
    $salesByCustomer = [];

    // Helper: extract district (구/군/시) from location string
    function extractDistrict($location)
    {
        if (empty($location))
            return '미분류';
        // Korean addresses: "서울특별시 강남구 ..." or "서울 강남구 ..." or "경기도 성남시 ..." etc.
        // Try to find 구, 군, or 시 (city-level under province)
        if (preg_match('/(\S+[구군])\s/u', $location, $m)) {
            return $m[1];
        }
        // Try: 시 (but not 특별시/광역시 - look for the second 시)
        if (preg_match('/(?:특별시|광역시|특별자치시|도)\s+(\S+시)/u', $location, $m)) {
            return $m[1];
        }
        // Fallback: second word token
        $parts = preg_split('/\s+/', trim($location));
        return isset($parts[1]) ? $parts[1] : '미분류';
    }

    foreach ($venues as $v) {
        $price = floatval($v['price']);
        $region = $v['region'] ?: '미분류';
        $type = $v['type'] ?: '기타';

        // Venue count by region
        if (!isset($venueCountByRegion[$region]))
            $venueCountByRegion[$region] = 0;
        $venueCountByRegion[$region]++;

        // Types by region
        if (!isset($typesByRegion[$region]))
            $typesByRegion[$region] = [];
        if (!isset($typesByRegion[$region][$type]))
            $typesByRegion[$region][$type] = 0;
        $typesByRegion[$region][$type]++;
        $size = $v['size'] ?: 'medium';
        $commission = floatval($v['commission_rate']);

        // Price aggregation
        if ($price > 0) {
            $allPrices[] = $price;
            if (!isset($priceByRegion[$region]))
                $priceByRegion[$region] = [];
            $priceByRegion[$region][] = $price;

            if (!isset($priceByType[$type]))
                $priceByType[$type] = [];
            $priceByType[$type][] = $price;

            if (!isset($priceBySize[$size]))
                $priceBySize[$size] = [];
            $priceBySize[$size][] = $price;
        }

        // Commission
        if ($commission > 0) {
            $commissions[] = $commission;
        }

        // Avg sales parsing
        $salesNum = parseAvgSales($v['avg_sales']);
        if ($salesNum !== null && $salesNum > 0) {
            $salesValues[] = $salesNum;
            if (!isset($salesByRegion[$region]))
                $salesByRegion[$region] = [];
            $salesByRegion[$region][] = $salesNum;
            if (!isset($salesByType[$type]))
                $salesByType[$type] = [];
            $salesByType[$type][] = $salesNum;
        }

        // Categories
        if (!empty($v['popular_categories'])) {
            $cats = json_decode($v['popular_categories'], true);
            if (is_array($cats)) {
                foreach ($cats as $cat) {
                    if (!isset($allCategories[$cat]))
                        $allCategories[$cat] = 0;
                    $allCategories[$cat]++;
                    // Categories by region
                    if (!isset($categoriesByRegion[$region]))
                        $categoriesByRegion[$region] = [];
                    if (!isset($categoriesByRegion[$region][$cat]))
                        $categoriesByRegion[$region][$cat] = 0;
                    $categoriesByRegion[$region][$cat]++;
                }
            }
        }

        // Monthly venue creation trend
        $month = substr($v['created_at'], 0, 7); // YYYY-MM
        if (!isset($monthlyVenueCount[$month]))
            $monthlyVenueCount[$month] = 0;
        $monthlyVenueCount[$month]++;

        // District-level breakdown
        $district = extractDistrict($v['location']);
        if (!isset($districtData[$region]))
            $districtData[$region] = [];
        if (!isset($districtData[$region][$district]))
            $districtData[$region][$district] = ['count' => 0, 'prices' => [], 'sales' => [], 'customers' => []];
        $districtData[$region][$district]['count']++;
        if ($price > 0)
            $districtData[$region][$district]['prices'][] = $price;
        if ($salesNum !== null && $salesNum > 0)
            $districtData[$region][$district]['sales'][] = $salesNum;

        // Target customers
        if (!empty($v['target_customers'])) {
            $custList = json_decode($v['target_customers'], true);
            if (is_array($custList)) {
                foreach ($custList as $cust) {
                    if (empty($cust))
                        continue;
                    // Global count
                    if (!isset($allCustomerTypes[$cust]))
                        $allCustomerTypes[$cust] = 0;
                    $allCustomerTypes[$cust]++;
                    // By region
                    if (!isset($customersByRegion[$region]))
                        $customersByRegion[$region] = [];
                    if (!isset($customersByRegion[$region][$cust]))
                        $customersByRegion[$region][$cust] = 0;
                    $customersByRegion[$region][$cust]++;
                    // By district
                    if (!isset($districtData[$region][$district]['customers'][$cust]))
                        $districtData[$region][$district]['customers'][$cust] = 0;
                    $districtData[$region][$district]['customers'][$cust]++;
                    // Price/Sales by customer type
                    if ($price > 0) {
                        if (!isset($priceByCustomer[$cust]))
                            $priceByCustomer[$cust] = [];
                        $priceByCustomer[$cust][] = $price;
                    }
                    if ($salesNum !== null && $salesNum > 0) {
                        if (!isset($salesByCustomer[$cust]))
                            $salesByCustomer[$cust] = [];
                        $salesByCustomer[$cust][] = $salesNum;
                    }
                }
            }
        }
    }

    // Helper: compute avg from array
    function avg($arr)
    {
        if (empty($arr))
            return 0;
        return round(array_sum($arr) / count($arr));
    }

    // 3. Build response
    // Summary
    $summary = [
        'totalVenues' => $totalVenues,
        'avgPrice' => avg($allPrices),
        'avgCommission' => empty($commissions) ? 0 : round(array_sum($commissions) / count($commissions), 1),
        'salesDataCount' => count($salesValues),
        'avgSales' => avg($salesValues),
    ];

    // Price by region (sort by avg desc)
    $regionStats = [];
    foreach ($priceByRegion as $r => $prices) {
        $regionStats[] = [
            'label' => $r,
            'avgPrice' => avg($prices),
            'count' => count($prices),
            'min' => min($prices),
            'max' => max($prices),
        ];
    }
    usort($regionStats, function ($a, $b) {
        return $b['avgPrice'] - $a['avgPrice'];
    });

    // Price by type
    $typeStats = [];
    foreach ($priceByType as $t => $prices) {
        $typeStats[] = [
            'label' => $t,
            'avgPrice' => avg($prices),
            'count' => count($prices),
        ];
    }
    usort($typeStats, function ($a, $b) {
        return $b['avgPrice'] - $a['avgPrice'];
    });

    // Price by size
    $sizeLabels = ['small' => '소형', 'medium' => '중형', 'large' => '대형'];
    $sizeStats = [];
    foreach ($priceBySize as $s => $prices) {
        $sizeStats[] = [
            'label' => isset($sizeLabels[$s]) ? $sizeLabels[$s] : $s,
            'key' => $s,
            'avgPrice' => avg($prices),
            'count' => count($prices),
        ];
    }

    // Commission distribution
    $commissionSummary = [
        'avg' => empty($commissions) ? 0 : round(array_sum($commissions) / count($commissions), 1),
        'min' => empty($commissions) ? 0 : min($commissions),
        'max' => empty($commissions) ? 0 : max($commissions),
        'count' => count($commissions),
    ];

    // Top categories (sort by count desc, top 10)
    arsort($allCategories);
    $topCategories = [];
    $i = 0;
    foreach ($allCategories as $cat => $count) {
        if ($i >= 10)
            break;
        $topCategories[] = ['label' => $cat, 'count' => $count];
        $i++;
    }

    // Sales by region
    $salesRegionStats = [];
    foreach ($salesByRegion as $r => $vals) {
        $salesRegionStats[] = [
            'label' => $r,
            'avgSales' => avg($vals),
            'count' => count($vals),
        ];
    }
    usort($salesRegionStats, function ($a, $b) {
        return $b['avgSales'] - $a['avgSales'];
    });

    // Sales by type
    $salesTypeStats = [];
    foreach ($salesByType as $t => $vals) {
        $salesTypeStats[] = [
            'label' => $t,
            'avgSales' => avg($vals),
            'count' => count($vals),
        ];
    }
    usort($salesTypeStats, function ($a, $b) {
        return $b['avgSales'] - $a['avgSales'];
    });

    // Price distribution (ranges)
    $ranges = [
        ['label' => '무료', 'min' => 0, 'max' => 0],
        ['label' => '~10만', 'min' => 1, 'max' => 100000],
        ['label' => '10~30만', 'min' => 100001, 'max' => 300000],
        ['label' => '30~50만', 'min' => 300001, 'max' => 500000],
        ['label' => '50~100만', 'min' => 500001, 'max' => 1000000],
        ['label' => '100만+', 'min' => 1000001, 'max' => PHP_INT_MAX],
    ];
    $priceDistribution = [];
    foreach ($ranges as $range) {
        $count = 0;
        foreach ($allPrices as $p) {
            if ($range['min'] === 0 && $range['max'] === 0) {
                if ($p == 0)
                    $count++;
            } elseif ($p >= $range['min'] && $p <= $range['max']) {
                $count++;
            }
        }
        $priceDistribution[] = ['label' => $range['label'], 'count' => $count];
    }

    // Monthly trend (last 6 months)
    ksort($monthlyVenueCount);
    $monthlyTrend = [];
    foreach ($monthlyVenueCount as $m => $c) {
        $monthlyTrend[] = ['month' => $m, 'count' => $c];
    }
    // Keep only last 12
    $monthlyTrend = array_slice($monthlyTrend, -12);

    // Venues by region (sorted by count desc)
    $venueRegionStats = [];
    foreach ($venueCountByRegion as $r => $cnt) {
        $topCats = isset($categoriesByRegion[$r]) ? $categoriesByRegion[$r] : [];
        arsort($topCats);
        $topCatList = array_slice(array_keys($topCats), 0, 3);

        $topTypes = isset($typesByRegion[$r]) ? $typesByRegion[$r] : [];
        arsort($topTypes);
        $topTypeList = array_slice(array_keys($topTypes), 0, 3);

        $venueRegionStats[] = [
            'label' => $r,
            'count' => $cnt,
            'avgPrice' => isset($priceByRegion[$r]) ? avg($priceByRegion[$r]) : 0,
            'avgSales' => isset($salesByRegion[$r]) ? avg($salesByRegion[$r]) : 0,
            'topCategories' => $topCatList,
            'topTypes' => $topTypeList,
        ];
    }
    usort($venueRegionStats, function ($a, $b) {
        return $b['count'] - $a['count'];
    });

    // District-level stats per region
    $districtStats = [];
    foreach ($districtData as $region => $districts) {
        $regionDistricts = [];
        foreach ($districts as $distName => $dd) {
            $topCusts = $dd['customers'];
            arsort($topCusts);
            $regionDistricts[] = [
                'label' => $distName,
                'count' => $dd['count'],
                'avgPrice' => avg($dd['prices']),
                'avgSales' => avg($dd['sales']),
                'topCustomers' => array_slice(array_keys($topCusts), 0, 3),
            ];
        }
        usort($regionDistricts, function ($a, $b) {
            return $b['count'] - $a['count']; });
        $districtStats[$region] = $regionDistricts;
    }

    // Top customer types
    arsort($allCustomerTypes);
    $topCustomerTypes = [];
    $ci = 0;
    foreach ($allCustomerTypes as $cust => $cnt) {
        if ($ci >= 15)
            break;
        $topCustomerTypes[] = ['label' => $cust, 'count' => $cnt];
        $ci++;
    }

    // Customers by region (top 5 per region)
    $customerRegionStats = [];
    foreach ($customersByRegion as $r => $custs) {
        arsort($custs);
        $top = [];
        $j = 0;
        foreach ($custs as $c => $cnt) {
            if ($j >= 5)
                break;
            $top[] = ['label' => $c, 'count' => $cnt];
            $j++;
        }
        $customerRegionStats[$r] = $top;
    }

    // Price by customer type
    $priceCustomerStats = [];
    foreach ($priceByCustomer as $c => $prices) {
        $priceCustomerStats[] = [
            'label' => $c,
            'avgPrice' => avg($prices),
            'count' => count($prices),
        ];
    }
    usort($priceCustomerStats, function ($a, $b) {
        return $b['avgPrice'] - $a['avgPrice']; });

    // Sales by customer type
    $salesCustomerStats = [];
    foreach ($salesByCustomer as $c => $vals) {
        $salesCustomerStats[] = [
            'label' => $c,
            'avgSales' => avg($vals),
            'count' => count($vals),
        ];
    }
    usort($salesCustomerStats, function ($a, $b) {
        return $b['avgSales'] - $a['avgSales']; });

    echo json_encode([
        'success' => true,
        'data' => [
            'summary' => $summary,
            'priceByRegion' => $regionStats,
            'priceByType' => $typeStats,
            'priceBySize' => $sizeStats,
            'commission' => $commissionSummary,
            'topCategories' => $topCategories,
            'salesByRegion' => $salesRegionStats,
            'salesByType' => $salesTypeStats,
            'priceDistribution' => $priceDistribution,
            'monthlyTrend' => $monthlyTrend,
            'venuesByRegion' => $venueRegionStats,
            'districtStats' => $districtStats,
            'topCustomerTypes' => $topCustomerTypes,
            'customersByRegion' => $customerRegionStats,
            'priceByCustomer' => $priceCustomerStats,
            'salesByCustomer' => $salesCustomerStats,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>