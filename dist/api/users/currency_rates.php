<?php
/**
 * Currency Rates API
 * 
 * Provides currency exchange rate information and country/region data for global support.
 * 
 * Actions:
 *   - rates      : Get exchange rates (base: USD)
 *   - countries  : Get country list with default currencies & tax info
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

$action = $_GET['action'] ?? '';

// ── Hardcoded exchange rates (base: USD) — update periodically or integrate API ──
$EXCHANGE_RATES = [
    'USD' => 1.0000,
    'KRW' => 1380.00,
    'EUR' => 0.9200,
    'JPY' => 150.00,
    'CNY' => 7.2500,
    'GBP' => 0.7900,
    'THB' => 35.50,
    'VND' => 25400.00,
    'CAD' => 1.3600,
    'AUD' => 1.5500,
    'SGD' => 1.3400,
    'HKD' => 7.8100,
    'TWD' => 32.00,
    'MYR' => 4.7000,
    'PHP' => 56.00,
    'IDR' => 15800.00,
    'INR' => 83.50,
    'BRL' => 4.9700,
    'MXN' => 17.20,
    'CHF' => 0.8800,
];

$CURRENCY_SYMBOLS = [
    'USD' => '$',
    'KRW' => '₩',
    'EUR' => '€',
    'JPY' => '¥',
    'CNY' => '¥',
    'GBP' => '£',
    'THB' => '฿',
    'VND' => '₫',
    'CAD' => 'C$',
    'AUD' => 'A$',
    'SGD' => 'S$',
    'HKD' => 'HK$',
    'TWD' => 'NT$',
    'MYR' => 'RM',
    'PHP' => '₱',
    'IDR' => 'Rp',
    'INR' => '₹',
    'BRL' => 'R$',
    'MXN' => 'Mex$',
    'CHF' => 'CHF',
];

// ── Country / Region definitions ──
$COUNTRIES = [
    [
        'code' => 'KR',
        'name' => 'South Korea',
        'name_local' => '한국',
        'currency' => 'KRW',
        'tax_type' => 'VAT',
        'tax_rate' => 10.0,
        'regions' => ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
    ],
    [
        'code' => 'JP',
        'name' => 'Japan',
        'name_local' => '日本',
        'currency' => 'JPY',
        'tax_type' => '消費税',
        'tax_rate' => 10.0,
        'regions' => ['東京', '大阪', '京都', '北海道', '福岡', '愛知', '神奈川', '千葉', '埼玉', '兵庫']
    ],
    [
        'code' => 'US',
        'name' => 'United States',
        'name_local' => 'USA',
        'currency' => 'USD',
        'tax_type' => 'Sales Tax',
        'tax_rate' => 0.0,
        'regions' => ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'Washington', 'Massachusetts']
    ],
    [
        'code' => 'CN',
        'name' => 'China',
        'name_local' => '中国',
        'currency' => 'CNY',
        'tax_type' => '增值税',
        'tax_rate' => 13.0,
        'regions' => ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '湖南', '山东', '福建']
    ],
    [
        'code' => 'TH',
        'name' => 'Thailand',
        'name_local' => 'ประเทศไทย',
        'currency' => 'THB',
        'tax_type' => 'VAT',
        'tax_rate' => 7.0,
        'regions' => ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Chon Buri']
    ],
    [
        'code' => 'VN',
        'name' => 'Vietnam',
        'name_local' => 'Việt Nam',
        'currency' => 'VND',
        'tax_type' => 'VAT',
        'tax_rate' => 10.0,
        'regions' => ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho']
    ],
    [
        'code' => 'GB',
        'name' => 'United Kingdom',
        'name_local' => 'UK',
        'currency' => 'GBP',
        'tax_type' => 'VAT',
        'tax_rate' => 20.0,
        'regions' => ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Cardiff']
    ],
    [
        'code' => 'DE',
        'name' => 'Germany',
        'name_local' => 'Deutschland',
        'currency' => 'EUR',
        'tax_type' => 'USt.',
        'tax_rate' => 19.0,
        'regions' => ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart']
    ],
    [
        'code' => 'FR',
        'name' => 'France',
        'name_local' => 'France',
        'currency' => 'EUR',
        'tax_type' => 'TVA',
        'tax_rate' => 20.0,
        'regions' => ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Bordeaux']
    ],
    [
        'code' => 'SG',
        'name' => 'Singapore',
        'name_local' => 'Singapore',
        'currency' => 'SGD',
        'tax_type' => 'GST',
        'tax_rate' => 9.0,
        'regions' => ['Central', 'East', 'West', 'North', 'North-East']
    ],
    [
        'code' => 'AU',
        'name' => 'Australia',
        'name_local' => 'Australia',
        'currency' => 'AUD',
        'tax_type' => 'GST',
        'tax_rate' => 10.0,
        'regions' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra']
    ],
    [
        'code' => 'CA',
        'name' => 'Canada',
        'name_local' => 'Canada',
        'currency' => 'CAD',
        'tax_type' => 'GST/HST',
        'tax_rate' => 5.0,
        'regions' => ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba']
    ],
    [
        'code' => 'TW',
        'name' => 'Taiwan',
        'name_local' => '台灣',
        'currency' => 'TWD',
        'tax_type' => '營業稅',
        'tax_rate' => 5.0,
        'regions' => ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hsinchu']
    ],
    [
        'code' => 'MY',
        'name' => 'Malaysia',
        'name_local' => 'Malaysia',
        'currency' => 'MYR',
        'tax_type' => 'SST',
        'tax_rate' => 6.0,
        'regions' => ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sabah']
    ],
    [
        'code' => 'PH',
        'name' => 'Philippines',
        'name_local' => 'Pilipinas',
        'currency' => 'PHP',
        'tax_type' => 'VAT',
        'tax_rate' => 12.0,
        'regions' => ['Metro Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati']
    ],
    [
        'code' => 'ID',
        'name' => 'Indonesia',
        'name_local' => 'Indonesia',
        'currency' => 'IDR',
        'tax_type' => 'PPN',
        'tax_rate' => 11.0,
        'regions' => ['Jakarta', 'Bali', 'Surabaya', 'Bandung', 'Medan']
    ],
];

try {
    switch ($action) {
        case 'rates':
            $base = strtoupper(trim($_GET['base'] ?? 'USD'));
            if (!isset($EXCHANGE_RATES[$base])) {
                echo json_encode(["success" => false, "message" => "Unknown base currency: $base"]);
                exit;
            }
            // Convert all rates relative to the requested base
            $baseRate = $EXCHANGE_RATES[$base];
            $converted = [];
            foreach ($EXCHANGE_RATES as $code => $rate) {
                $converted[$code] = round($rate / $baseRate, 6);
            }
            echo json_encode([
                "success" => true,
                "base" => $base,
                "rates" => $converted,
                "symbols" => $CURRENCY_SYMBOLS,
                "updated_at" => date('Y-m-d'),
            ]);
            break;

        case 'countries':
            echo json_encode([
                "success" => true,
                "countries" => $COUNTRIES,
            ]);
            break;

        case 'convert':
            $from = strtoupper(trim($_GET['from'] ?? 'KRW'));
            $to = strtoupper(trim($_GET['to'] ?? 'USD'));
            $amount = floatval($_GET['amount'] ?? 0);

            if (!isset($EXCHANGE_RATES[$from]) || !isset($EXCHANGE_RATES[$to])) {
                echo json_encode(["success" => false, "message" => "Unknown currency"]);
                exit;
            }

            $usdAmount = $amount / $EXCHANGE_RATES[$from];
            $converted = $usdAmount * $EXCHANGE_RATES[$to];

            echo json_encode([
                "success" => true,
                "from" => $from,
                "to" => $to,
                "amount" => $amount,
                "converted" => round($converted, 2),
                "rate" => round($EXCHANGE_RATES[$to] / $EXCHANGE_RATES[$from], 6),
            ]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>