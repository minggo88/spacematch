<?php
/**
 * Seller Tax Management API
 * 
 * Provides tax calculations and summaries based on seller's sales data.
 * Supports custom tax rate settings per seller.
 * 
 * Actions:
 *   - tax_info       : Get tax rules for a specific country
 *   - calculate      : Calculate estimated taxes for a period
 *   - summary        : Get tax summary for dashboard
 *   - save_settings  : Save custom tax rates
 *   - load_settings  : Load custom tax rates
 *   - reset_settings : Reset to default rates
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if ($role !== 'seller') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Seller only."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? '';

// ── Tax rules by country ──
$TAX_RULES = [
    'KR' => [
        'country' => 'South Korea',
        'country_local' => '한국',
        'currency' => 'KRW',
        'vat' => [
            'name' => '부가가치세 (VAT)',
            'rate' => 10.0,
            'threshold' => 0,
            'period' => 'semi-annual',
            'filing_dates' => ['01-25', '07-25'],
            'description' => '매출액의 10%'
        ],
        'income_tax' => [
            'name' => '종합소득세',
            'period' => 'annual',
            'filing_date' => '05-31',
            'brackets' => [
                ['min' => 0, 'max' => 14000000, 'rate' => 6],
                ['min' => 14000000, 'max' => 50000000, 'rate' => 15],
                ['min' => 50000000, 'max' => 88000000, 'rate' => 24],
                ['min' => 88000000, 'max' => 150000000, 'rate' => 35],
                ['min' => 150000000, 'max' => 300000000, 'rate' => 38],
                ['min' => 300000000, 'max' => 500000000, 'rate' => 40],
                ['min' => 500000000, 'max' => 1000000000, 'rate' => 42],
                ['min' => 1000000000, 'max' => PHP_INT_MAX, 'rate' => 45],
            ],
        ],
        'simplified' => [
            'name' => '간이과세자',
            'threshold' => 80000000,
            'rate' => 1.5,
            'description' => '연매출 8,000만원 미만 시 적용'
        ],
    ],
    'JP' => [
        'country' => 'Japan',
        'country_local' => '日本',
        'currency' => 'JPY',
        'vat' => [
            'name' => '消費税',
            'rate' => 10.0,
            'threshold' => 10000000,
            'period' => 'annual',
            'filing_dates' => ['03-31'],
            'description' => '課税売上高1,000万円超で課税事業者'
        ],
        'income_tax' => [
            'name' => '所得税',
            'period' => 'annual',
            'filing_date' => '03-15',
            'brackets' => [
                ['min' => 0, 'max' => 1950000, 'rate' => 5],
                ['min' => 1950000, 'max' => 3300000, 'rate' => 10],
                ['min' => 3300000, 'max' => 6950000, 'rate' => 20],
                ['min' => 6950000, 'max' => 9000000, 'rate' => 23],
                ['min' => 9000000, 'max' => 18000000, 'rate' => 33],
                ['min' => 18000000, 'max' => 40000000, 'rate' => 40],
                ['min' => 40000000, 'max' => PHP_INT_MAX, 'rate' => 45],
            ],
        ],
    ],
    'US' => [
        'country' => 'United States',
        'country_local' => 'USA',
        'currency' => 'USD',
        'vat' => [
            'name' => 'Sales Tax',
            'rate' => 0.0,
            'threshold' => 0,
            'period' => 'varies',
            'filing_dates' => [],
            'description' => 'Sales tax varies by state (0-10%+)'
        ],
        'income_tax' => [
            'name' => 'Federal Income Tax',
            'period' => 'annual',
            'filing_date' => '04-15',
            'brackets' => [
                ['min' => 0, 'max' => 11000, 'rate' => 10],
                ['min' => 11000, 'max' => 44725, 'rate' => 12],
                ['min' => 44725, 'max' => 95375, 'rate' => 22],
                ['min' => 95375, 'max' => 182100, 'rate' => 24],
                ['min' => 182100, 'max' => 231250, 'rate' => 32],
                ['min' => 231250, 'max' => 578125, 'rate' => 35],
                ['min' => 578125, 'max' => PHP_INT_MAX, 'rate' => 37],
            ],
        ],
    ],
    'GB' => [
        'country' => 'United Kingdom',
        'country_local' => 'UK',
        'currency' => 'GBP',
        'vat' => [
            'name' => 'VAT',
            'rate' => 20.0,
            'threshold' => 85000,
            'period' => 'quarterly',
            'filing_dates' => ['04-07', '07-07', '10-07', '01-07'],
            'description' => 'VAT registration required above £85,000'
        ],
        'income_tax' => [
            'name' => 'Income Tax',
            'period' => 'annual',
            'filing_date' => '01-31',
            'brackets' => [
                ['min' => 0, 'max' => 12570, 'rate' => 0],
                ['min' => 12570, 'max' => 50270, 'rate' => 20],
                ['min' => 50270, 'max' => 125140, 'rate' => 40],
                ['min' => 125140, 'max' => PHP_INT_MAX, 'rate' => 45],
            ],
        ],
    ],
    'DE' => [
        'country' => 'Germany',
        'country_local' => 'Deutschland',
        'currency' => 'EUR',
        'vat' => [
            'name' => 'Umsatzsteuer',
            'rate' => 19.0,
            'threshold' => 22000,
            'period' => 'monthly',
            'filing_dates' => [],
            'description' => 'USt. Voranmeldung monatlich/vierteljährlich'
        ],
        'income_tax' => [
            'name' => 'Einkommensteuer',
            'period' => 'annual',
            'filing_date' => '07-31',
            'brackets' => [
                ['min' => 0, 'max' => 10908, 'rate' => 0],
                ['min' => 10908, 'max' => 62809, 'rate' => 14],
                ['min' => 62809, 'max' => 277825, 'rate' => 42],
                ['min' => 277825, 'max' => PHP_INT_MAX, 'rate' => 45],
            ],
        ],
    ],
    'SG' => [
        'country' => 'Singapore',
        'country_local' => 'Singapore',
        'currency' => 'SGD',
        'vat' => [
            'name' => 'GST',
            'rate' => 9.0,
            'threshold' => 1000000,
            'period' => 'quarterly',
            'filing_dates' => [],
            'description' => 'GST registration required if taxable turnover exceeds S$1M'
        ],
        'income_tax' => [
            'name' => 'Income Tax',
            'period' => 'annual',
            'filing_date' => '04-15',
            'brackets' => [
                ['min' => 0, 'max' => 20000, 'rate' => 0],
                ['min' => 20000, 'max' => 30000, 'rate' => 2],
                ['min' => 30000, 'max' => 40000, 'rate' => 3.5],
                ['min' => 40000, 'max' => 80000, 'rate' => 7],
                ['min' => 80000, 'max' => 120000, 'rate' => 11.5],
                ['min' => 120000, 'max' => 160000, 'rate' => 15],
                ['min' => 160000, 'max' => 200000, 'rate' => 18],
                ['min' => 200000, 'max' => 240000, 'rate' => 19],
                ['min' => 240000, 'max' => 280000, 'rate' => 19.5],
                ['min' => 280000, 'max' => 320000, 'rate' => 20],
                ['min' => 320000, 'max' => PHP_INT_MAX, 'rate' => 22],
            ],
        ],
    ],
    'CA' => [
        'country' => 'Canada',
        'country_local' => 'Canada',
        'currency' => 'CAD',
        'vat' => [
            'name' => 'GST/HST',
            'rate' => 5.0,
            'threshold' => 30000,
            'period' => 'quarterly',
            'filing_dates' => [],
            'description' => 'GST 5% federal + PST/HST varies by province (0-10%)'
        ],
        'income_tax' => [
            'name' => 'Federal Income Tax',
            'period' => 'annual',
            'filing_date' => '04-30',
            'brackets' => [
                ['min' => 0, 'max' => 55867, 'rate' => 15],
                ['min' => 55867, 'max' => 111733, 'rate' => 20.5],
                ['min' => 111733, 'max' => 154906, 'rate' => 26],
                ['min' => 154906, 'max' => 220000, 'rate' => 29],
                ['min' => 220000, 'max' => PHP_INT_MAX, 'rate' => 33],
            ],
        ],
    ],
    'VN' => [
        'country' => 'Vietnam',
        'country_local' => 'Việt Nam',
        'currency' => 'VND',
        'vat' => [
            'name' => '부가가치세(VAT)',
            'rate' => 10.0,
            'threshold' => 0,
            'period' => 'monthly',
            'filing_dates' => [],
            'description' => '표준세율 10%, 일부 품목 5%'
        ],
        'income_tax' => [
            'name' => '개인소득세(PIT)',
            'period' => 'annual',
            'filing_date' => '03-31',
            'brackets' => [
                ['min' => 0, 'max' => 60000000, 'rate' => 5],
                ['min' => 60000000, 'max' => 120000000, 'rate' => 10],
                ['min' => 120000000, 'max' => 216000000, 'rate' => 15],
                ['min' => 216000000, 'max' => 384000000, 'rate' => 20],
                ['min' => 384000000, 'max' => 624000000, 'rate' => 25],
                ['min' => 624000000, 'max' => 960000000, 'rate' => 30],
                ['min' => 960000000, 'max' => PHP_INT_MAX, 'rate' => 35],
            ],
        ],
    ],
    'TH' => [
        'country' => 'Thailand',
        'country_local' => 'ประเทศไทย',
        'currency' => 'THB',
        'vat' => [
            'name' => '부가가치세(VAT)',
            'rate' => 7.0,
            'threshold' => 1800000,
            'period' => 'monthly',
            'filing_dates' => [],
            'description' => '연매출 180만 바트 초과 시 VAT 7% 적용'
        ],
        'income_tax' => [
            'name' => '개인소득세(PIT)',
            'period' => 'annual',
            'filing_date' => '03-31',
            'brackets' => [
                ['min' => 0, 'max' => 150000, 'rate' => 0],
                ['min' => 150000, 'max' => 300000, 'rate' => 5],
                ['min' => 300000, 'max' => 500000, 'rate' => 10],
                ['min' => 500000, 'max' => 750000, 'rate' => 15],
                ['min' => 750000, 'max' => 1000000, 'rate' => 20],
                ['min' => 1000000, 'max' => 2000000, 'rate' => 25],
                ['min' => 2000000, 'max' => 5000000, 'rate' => 30],
                ['min' => 5000000, 'max' => PHP_INT_MAX, 'rate' => 35],
            ],
        ],
    ],
    'KH' => [
        'country' => 'Cambodia',
        'country_local' => 'កម្ពុជា',
        'currency' => 'KHR',
        'vat' => [
            'name' => '부가가치세(VAT)',
            'rate' => 10.0,
            'threshold' => 0,
            'period' => 'monthly',
            'filing_dates' => [],
            'description' => '표준 VAT 세율 10%'
        ],
        'income_tax' => [
            'name' => '사업이익세(ToP)',
            'period' => 'annual',
            'filing_date' => '03-31',
            'brackets' => [
                ['min' => 0, 'max' => PHP_INT_MAX, 'rate' => 20],
            ],
        ],
    ],
    'RU' => [
        'country' => 'Russia',
        'country_local' => 'Россия',
        'currency' => 'RUB',
        'vat' => [
            'name' => '부가가치세(НДС)',
            'rate' => 20.0,
            'threshold' => 0,
            'period' => 'quarterly',
            'filing_dates' => [],
            'description' => '기본세율 20%, 경감세율 10%'
        ],
        'income_tax' => [
            'name' => '개인소득세(НДФЛ)',
            'period' => 'annual',
            'filing_date' => '04-30',
            'brackets' => [
                ['min' => 0, 'max' => 5000000, 'rate' => 13],
                ['min' => 5000000, 'max' => PHP_INT_MAX, 'rate' => 15],
            ],
        ],
    ],
    'UA' => [
        'country' => 'Ukraine',
        'country_local' => 'Україна',
        'currency' => 'UAH',
        'vat' => [
            'name' => '부가가치세(ПДВ)',
            'rate' => 20.0,
            'threshold' => 0,
            'period' => 'monthly',
            'filing_dates' => [],
            'description' => '기본세율 20%, 경감세율 7%'
        ],
        'income_tax' => [
            'name' => '개인소득세(ПДФО)',
            'period' => 'annual',
            'filing_date' => '05-01',
            'brackets' => [
                ['min' => 0, 'max' => PHP_INT_MAX, 'rate' => 18],
            ],
        ],
    ],
];

// ── Auto-migrate: create seller_tax_settings table ──
try {
    $conn->query("SELECT 1 FROM seller_tax_settings LIMIT 1");
} catch (PDOException $ex) {
    $conn->exec("CREATE TABLE seller_tax_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        country_code VARCHAR(2) NOT NULL,
        vat_rate DECIMAL(6,2) DEFAULT NULL,
        simplified_rate DECIMAL(6,2) DEFAULT NULL,
        simplified_threshold BIGINT DEFAULT NULL,
        custom_brackets JSON DEFAULT NULL,
        extra_deduction BIGINT DEFAULT 0,
        memo TEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_country (user_id, country_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

// ── Helper: merge custom settings into default rules ──
function applyCustomSettings($rules, $custom)
{
    if (!$custom)
        return $rules;
    // Override VAT rate
    if ($custom['vat_rate'] !== null) {
        $rules['vat']['rate'] = floatval($custom['vat_rate']);
    }
    // Override simplified rate/threshold (KR)
    if (isset($rules['simplified'])) {
        if ($custom['simplified_rate'] !== null) {
            $rules['simplified']['rate'] = floatval($custom['simplified_rate']);
        }
        if ($custom['simplified_threshold'] !== null) {
            $rules['simplified']['threshold'] = intval($custom['simplified_threshold']);
        }
    }
    // Override income tax brackets
    if (!empty($custom['custom_brackets'])) {
        $brackets = json_decode($custom['custom_brackets'], true);
        if (is_array($brackets) && count($brackets) > 0) {
            // Restore PHP_INT_MAX for last bracket
            foreach ($brackets as &$b) {
                if ($b['max'] === null || $b['max'] === 0) {
                    $b['max'] = PHP_INT_MAX;
                }
            }
            $rules['income_tax']['brackets'] = $brackets;
        }
    }
    return $rules;
}

try {
    switch ($action) {

        // ── TAX_INFO: Return tax rules for a country ──
        case 'tax_info':
            $country = strtoupper(trim($input['country'] ?? $_GET['country'] ?? 'KR'));
            if (!isset($TAX_RULES[$country])) {
                echo json_encode(["success" => false, "message" => "Tax rules not available for: $country"]);
                exit;
            }
            $rules = $TAX_RULES[$country];
            // Sanitize PHP_INT_MAX in brackets
            if (isset($rules['income_tax']['brackets'])) {
                foreach ($rules['income_tax']['brackets'] as &$b) {
                    if ($b['max'] >= PHP_INT_MAX)
                        $b['max'] = null;
                }
            }
            echo json_encode(["success" => true, "tax_rules" => $rules, "available_countries" => array_keys($TAX_RULES)]);
            break;

        // ── CALCULATE: Estimate taxes for a given revenue ──
        case 'calculate':
            $country = strtoupper(trim($input['country'] ?? 'KR'));
            $annualRevenue = floatval($input['annual_revenue'] ?? 0);
            $annualCost = floatval($input['annual_cost'] ?? 0);
            $extraDeduction = floatval($input['extra_deduction'] ?? 0);
            $profit = $annualRevenue - $annualCost - $extraDeduction;

            if (!isset($TAX_RULES[$country])) {
                echo json_encode(["success" => false, "message" => "Tax rules not available for: $country"]);
                exit;
            }

            $rules = $TAX_RULES[$country];

            // Load custom settings and merge
            $stmt = $conn->prepare("SELECT * FROM seller_tax_settings WHERE user_id = ? AND country_code = ?");
            $stmt->execute([$userId, $country]);
            $custom = $stmt->fetch(PDO::FETCH_ASSOC);
            $isCustom = !!$custom;
            if ($custom) {
                if ($custom['extra_deduction'] && $extraDeduction == 0) {
                    $extraDeduction = intval($custom['extra_deduction']);
                    $profit = $annualRevenue - $annualCost - $extraDeduction;
                }
                $rules = applyCustomSettings($rules, $custom);
            }

            $result = [];

            // VAT calculation
            $vatRate = $rules['vat']['rate'];
            $vatAmount = round($annualRevenue * ($vatRate / 100), 0);
            $result['vat'] = [
                'name' => $rules['vat']['name'],
                'rate' => $vatRate,
                'amount' => $vatAmount,
                'description' => $rules['vat']['description'],
                'threshold' => $rules['vat']['threshold'],
                'filing_dates' => $rules['vat']['filing_dates'],
            ];

            // Check simplified taxation (Korea only)
            if ($country === 'KR' && isset($rules['simplified']) && $annualRevenue < $rules['simplified']['threshold']) {
                $result['vat']['simplified'] = true;
                $result['vat']['simplified_rate'] = $rules['simplified']['rate'];
                $result['vat']['amount'] = round($annualRevenue * ($rules['simplified']['rate'] / 100), 0);
                $result['vat']['description'] = $rules['simplified']['description'];
            }

            // Income tax calculation (progressive brackets)
            $incomeTax = 0;
            $taxableIncome = max(0, $profit);
            if (isset($rules['income_tax']['brackets'])) {
                $remaining = $taxableIncome;
                $breakdown = [];
                foreach ($rules['income_tax']['brackets'] as $bracket) {
                    $max = ($bracket['max'] >= PHP_INT_MAX) ? $remaining + 1 : $bracket['max'];
                    $width = $max - $bracket['min'];
                    $taxable = min($remaining, $width);
                    if ($taxable <= 0)
                        break;
                    $tax = round($taxable * ($bracket['rate'] / 100), 0);
                    $incomeTax += $tax;
                    $remaining -= $taxable;
                    $breakdown[] = [
                        'range' => $bracket['min'] . ' ~ ' . ($bracket['max'] >= PHP_INT_MAX ? '∞' : number_format($bracket['max'])),
                        'rate' => $bracket['rate'],
                        'taxable' => $taxable,
                        'tax' => $tax,
                    ];
                }
                $result['income_tax'] = [
                    'name' => $rules['income_tax']['name'],
                    'taxable_income' => $taxableIncome,
                    'total_tax' => $incomeTax,
                    'effective_rate' => $taxableIncome > 0 ? round(($incomeTax / $taxableIncome) * 100, 2) : 0,
                    'filing_date' => $rules['income_tax']['filing_date'],
                    'breakdown' => $breakdown,
                ];
            }

            // Total estimated taxes
            $totalTax = $vatAmount + $incomeTax;
            $result['summary'] = [
                'annual_revenue' => $annualRevenue,
                'annual_cost' => $annualCost,
                'extra_deduction' => $extraDeduction,
                'profit' => $profit,
                'total_estimated_tax' => $totalTax,
                'effective_total_rate' => $annualRevenue > 0 ? round(($totalTax / $annualRevenue) * 100, 2) : 0,
                'after_tax_income' => $profit - $incomeTax,
            ];

            echo json_encode([
                "success" => true,
                "calculation" => $result,
                "country" => $country,
                "currency" => $rules['currency'],
                "is_custom" => $isCustom,
            ]);
            break;

        // ── SAVE_SETTINGS: Save custom tax rates ──
        case 'save_settings':
            $country = strtoupper(trim($input['country'] ?? 'KR'));
            $vatRate = isset($input['vat_rate']) ? floatval($input['vat_rate']) : null;
            $simplifiedRate = isset($input['simplified_rate']) ? floatval($input['simplified_rate']) : null;
            $simplifiedThreshold = isset($input['simplified_threshold']) ? intval($input['simplified_threshold']) : null;
            $customBrackets = isset($input['brackets']) ? json_encode($input['brackets']) : null;
            $extraDeduction = intval($input['extra_deduction'] ?? 0);
            $memo = trim($input['memo'] ?? '');

            $stmt = $conn->prepare("SELECT id FROM seller_tax_settings WHERE user_id = ? AND country_code = ?");
            $stmt->execute([$userId, $country]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $stmt = $conn->prepare("UPDATE seller_tax_settings SET 
                    vat_rate = ?, simplified_rate = ?, simplified_threshold = ?,
                    custom_brackets = ?, extra_deduction = ?, memo = ?
                    WHERE user_id = ? AND country_code = ?");
                $stmt->execute([
                    $vatRate,
                    $simplifiedRate,
                    $simplifiedThreshold,
                    $customBrackets,
                    $extraDeduction,
                    $memo,
                    $userId,
                    $country
                ]);
            } else {
                $stmt = $conn->prepare("INSERT INTO seller_tax_settings 
                    (user_id, country_code, vat_rate, simplified_rate, simplified_threshold, custom_brackets, extra_deduction, memo)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $userId,
                    $country,
                    $vatRate,
                    $simplifiedRate,
                    $simplifiedThreshold,
                    $customBrackets,
                    $extraDeduction,
                    $memo
                ]);
            }

            echo json_encode(["success" => true, "message" => "Tax settings saved."]);
            break;

        // ── LOAD_SETTINGS: Get custom tax rates ──
        case 'load_settings':
            $country = strtoupper(trim($input['country'] ?? $_GET['country'] ?? 'KR'));
            $stmt = $conn->prepare("SELECT * FROM seller_tax_settings WHERE user_id = ? AND country_code = ?");
            $stmt->execute([$userId, $country]);
            $settings = $stmt->fetch(PDO::FETCH_ASSOC);

            // Get default rules for comparison
            $defaults = null;
            if (isset($TAX_RULES[$country])) {
                $defaults = [
                    'vat_rate' => $TAX_RULES[$country]['vat']['rate'],
                    'brackets' => $TAX_RULES[$country]['income_tax']['brackets'] ?? [],
                ];
                if (isset($TAX_RULES[$country]['simplified'])) {
                    $defaults['simplified_rate'] = $TAX_RULES[$country]['simplified']['rate'];
                    $defaults['simplified_threshold'] = $TAX_RULES[$country]['simplified']['threshold'];
                }
                // Sanitize PHP_INT_MAX
                if (!empty($defaults['brackets'])) {
                    foreach ($defaults['brackets'] as &$b) {
                        if ($b['max'] >= PHP_INT_MAX)
                            $b['max'] = null;
                    }
                }
            }

            if ($settings && !empty($settings['custom_brackets'])) {
                $settings['custom_brackets'] = json_decode($settings['custom_brackets'], true);
            }

            echo json_encode([
                "success" => true,
                "settings" => $settings,
                "defaults" => $defaults,
                "has_custom" => !!$settings,
            ]);
            break;

        // ── RESET_SETTINGS: Delete custom settings (revert to defaults) ──
        case 'reset_settings':
            $country = strtoupper(trim($input['country'] ?? 'KR'));
            $stmt = $conn->prepare("DELETE FROM seller_tax_settings WHERE user_id = ? AND country_code = ?");
            $stmt->execute([$userId, $country]);
            echo json_encode(["success" => true, "message" => "Settings reset to defaults."]);
            break;

        // ── SUMMARY: Get revenue and tax summary from actual data ──
        case 'summary':
            $year = intval($input['year'] ?? $_GET['year'] ?? date('Y'));

            // Fetch annual totals grouped by month
            $stmt = $conn->prepare("
                SELECT 
                    SUBSTRING(record_date, 1, 7) as month,
                    SUM(monthly_revenue) as revenue,
                    SUM(cost_price) as cost,
                    SUM(transaction_count) as transactions,
                    SUM(quantity_sold) as quantity,
                    currency,
                    COUNT(*) as record_count
                FROM seller_stats 
                WHERE user_id = ? AND record_date LIKE ?
                GROUP BY SUBSTRING(record_date, 1, 7), currency
                ORDER BY month
            ");
            $stmt->execute([$userId, $year . '%']);
            $monthly = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Aggregate totals
            $totalRevenue = 0;
            $totalCost = 0;
            $totalTx = 0;
            foreach ($monthly as $m) {
                $totalRevenue += intval($m['revenue']);
                $totalCost += intval($m['cost']);
                $totalTx += intval($m['transactions']);
            }

            echo json_encode([
                "success" => true,
                "year" => $year,
                "monthly_breakdown" => $monthly,
                "totals" => [
                    "revenue" => $totalRevenue,
                    "cost" => $totalCost,
                    "profit" => $totalRevenue - $totalCost,
                    "transactions" => $totalTx,
                ],
            ]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>