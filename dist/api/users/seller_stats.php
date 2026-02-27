<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + seller role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if ($role !== 'seller') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "셀러만 이용 가능합니다."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? 'list';

// ── Auto-migration: ensure seller_stats table has all required columns ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        country_code VARCHAR(2) NOT NULL DEFAULT 'KR',
        record_type VARCHAR(10) NOT NULL DEFAULT 'monthly',
        record_date VARCHAR(10) NOT NULL,
        monthly_revenue BIGINT DEFAULT 0,
        customer_count BIGINT DEFAULT 0,
        transaction_count BIGINT DEFAULT 0,
        avg_unit_price BIGINT DEFAULT 0,
        best_selling_item VARCHAR(200) DEFAULT NULL,
        venue_type VARCHAR(50) DEFAULT NULL,
        region VARCHAR(100) DEFAULT NULL,
        region_detail VARCHAR(500) DEFAULT NULL,
        satisfaction TINYINT DEFAULT NULL,
        memo TEXT DEFAULT NULL,
        currency VARCHAR(3) DEFAULT 'KRW',
        exchange_rate DECIMAL(12,4) DEFAULT NULL,
        source VARCHAR(50) DEFAULT 'manual',
        import_batch_id VARCHAR(36) DEFAULT NULL,
        sales_channel VARCHAR(100) DEFAULT NULL,
        product_name VARCHAR(200) DEFAULT NULL,
        quantity_sold INT DEFAULT 0,
        cost_price INT DEFAULT 0,
        profit_margin DECIMAL(5,2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type_date (record_type, record_date),
        INDEX idx_country (user_id, country_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add missing columns for existing tables
    $colsToAdd = [
        'country_code' => "VARCHAR(2) NOT NULL DEFAULT 'KR' AFTER user_id",
        'venue_type' => "VARCHAR(50) DEFAULT NULL AFTER best_selling_item",
        'region' => "VARCHAR(100) DEFAULT NULL AFTER venue_type",
        'region_detail' => "VARCHAR(500) DEFAULT NULL AFTER region",
        'satisfaction' => "TINYINT DEFAULT NULL AFTER region_detail",
        'memo' => "TEXT DEFAULT NULL AFTER satisfaction",
        'currency' => "VARCHAR(3) DEFAULT 'KRW' AFTER memo",
        'exchange_rate' => "DECIMAL(12,4) DEFAULT NULL AFTER currency",
        'source' => "VARCHAR(50) DEFAULT 'manual' AFTER exchange_rate",
        'import_batch_id' => "VARCHAR(36) DEFAULT NULL AFTER source",
        'sales_channel' => "VARCHAR(100) DEFAULT NULL AFTER import_batch_id",
        'product_name' => "VARCHAR(200) DEFAULT NULL AFTER sales_channel",
        'quantity_sold' => "INT DEFAULT 0 AFTER product_name",
        'cost_price' => "INT DEFAULT 0 AFTER quantity_sold",
        'profit_margin' => "DECIMAL(5,2) DEFAULT NULL AFTER cost_price",
        'discount_amount' => "BIGINT DEFAULT 0 AFTER profit_margin",
        'tax_amount' => "BIGINT DEFAULT 0 AFTER discount_amount",
        'shipping_cost' => "BIGINT DEFAULT 0 AFTER tax_amount",
        'refund_amount' => "BIGINT DEFAULT 0 AFTER shipping_cost",
        'commission_fee' => "BIGINT DEFAULT 0 AFTER refund_amount",
        'net_revenue' => "BIGINT DEFAULT 0 AFTER commission_fee",
        'payment_method' => "VARCHAR(100) DEFAULT NULL AFTER net_revenue",
        'order_number' => "VARCHAR(200) DEFAULT NULL AFTER payment_method",
        'sku' => "VARCHAR(200) DEFAULT NULL AFTER order_number",
        'brand' => "VARCHAR(200) DEFAULT NULL AFTER sku",
        'option_info' => "VARCHAR(500) DEFAULT NULL AFTER brand",
        'return_qty' => "INT DEFAULT 0 AFTER option_info",
        'profit_amount' => "BIGINT DEFAULT 0 AFTER return_qty",
        'points_used' => "BIGINT DEFAULT 0 AFTER profit_amount",
        'payment_status' => "VARCHAR(50) DEFAULT NULL AFTER points_used",
        'customer_name' => "VARCHAR(200) DEFAULT NULL AFTER payment_status",
        'staff_name' => "VARCHAR(200) DEFAULT NULL AFTER customer_name",
        'store_name' => "VARCHAR(200) DEFAULT NULL AFTER staff_name",
        'platform' => "VARCHAR(100) DEFAULT NULL AFTER store_name",
        'supplier' => "VARCHAR(200) DEFAULT NULL AFTER platform",
    ];
    foreach ($colsToAdd as $col => $def) {
        try {
            $conn->query("SELECT `$col` FROM seller_stats LIMIT 1");
        } catch (PDOException $ex) {
            $conn->exec("ALTER TABLE seller_stats ADD COLUMN `$col` $def");
        }
    }

    // Auto-migrate INT columns to BIGINT to prevent overflow
    $intToBigint = ['monthly_revenue', 'customer_count', 'transaction_count', 'avg_unit_price'];
    foreach ($intToBigint as $col) {
        try {
            $colInfo = $conn->query("SHOW COLUMNS FROM seller_stats WHERE Field = '$col'")->fetch(PDO::FETCH_ASSOC);
            if ($colInfo && stripos($colInfo['Type'], 'bigint') === false) {
                $conn->exec("ALTER TABLE seller_stats MODIFY COLUMN `$col` BIGINT DEFAULT 0");
            }
        } catch (PDOException $ex) { /* ignore */
        }
    }

    // Migrate UNIQUE KEY: remove if exists (allow product-level data)
    try {
        $keys = $conn->query("SHOW INDEX FROM seller_stats WHERE Key_name = 'uq_user_country_type_date'")->fetchAll();
        if (count($keys) > 0) {
            $conn->exec("ALTER TABLE seller_stats DROP INDEX uq_user_country_type_date");
        }
    } catch (PDOException $ex) { /* ignore */
    }
    try {
        $keys = $conn->query("SHOW INDEX FROM seller_stats WHERE Key_name = 'uq_user_type_date'")->fetchAll();
        if (count($keys) > 0) {
            $conn->exec("ALTER TABLE seller_stats DROP INDEX uq_user_type_date");
        }
    } catch (PDOException $ex) { /* ignore */
    }
} catch (PDOException $e) {
    // Table/columns already exist — ignore
}

try {
    switch ($action) {
        // ── LIST: 본인 데이터만 조회 ──
        case 'list':
            $type = $_GET['record_type'] ?? '';
            $countryCode = trim($_GET['country_code'] ?? 'ALL');

            // Build WHERE conditions
            $where = "user_id = ?";
            $params = [$userId];

            if ($type && in_array($type, ['daily', 'monthly', 'annual'])) {
                $where .= " AND record_type = ?";
                $params[] = $type;
            }
            if ($countryCode !== 'ALL' && $countryCode !== '') {
                $where .= " AND country_code = ?";
                $params[] = $countryCode;
            }

            $stmt = $conn->prepare("SELECT * FROM seller_stats WHERE $where ORDER BY record_date DESC");
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Summary per record_type (filtered by country)
            $summaryWhere = "user_id = ?";
            $summaryParams = [$userId];
            if ($countryCode !== 'ALL' && $countryCode !== '') {
                $summaryWhere .= " AND country_code = ?";
                $summaryParams[] = $countryCode;
            }
            $summaryStmt = $conn->prepare("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price
                FROM seller_stats WHERE $summaryWhere GROUP BY record_type
            ");
            $summaryStmt->execute($summaryParams);
            $summaryRows = $summaryStmt->fetchAll(PDO::FETCH_ASSOC);
            $summary = [];
            foreach ($summaryRows as $sr) {
                $summary[$sr['record_type']] = $sr;
            }

            // Available countries for this user
            $countriesStmt = $conn->prepare("
                SELECT COALESCE(country_code, 'KR') as country_code,
                       COUNT(*) as record_count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue
                FROM seller_stats WHERE user_id = ?
                GROUP BY country_code ORDER BY total_revenue DESC
            ");
            $countriesStmt->execute([$userId]);
            $countryBreakdown = $countriesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "stats" => $rows,
                "summary" => $summary,
                "countryBreakdown" => $countryBreakdown,
            ]);
            break;

        // ── SAVE: UPSERT (기간 기준 생성/수정) ──
        case 'save':
            $recordType = $input['record_type'] ?? 'monthly';
            $recordDate = trim($input['record_date'] ?? '');

            // Validate record_type
            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 기록 유형입니다."]);
                exit;
            }

            // Validate record_date format
            $valid = false;
            if ($recordType === 'daily' && preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $recordDate))
                $valid = true;
            if ($recordType === 'monthly' && preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $recordDate))
                $valid = true;
            if ($recordType === 'annual' && preg_match('/^\d{4}$/', $recordDate))
                $valid = true;

            if (!$valid) {
                echo json_encode(["success" => false, "message" => "올바른 날짜 형식이 아닙니다."]);
                exit;
            }

            $revenue = intval($input['monthly_revenue'] ?? 0);
            $customers = intval($input['customer_count'] ?? 0);
            $transactions = intval($input['transaction_count'] ?? 0);
            $unitPrice = intval($input['avg_unit_price'] ?? 0);
            $bestItem = trim($input['best_selling_item'] ?? '');
            $venueType = trim($input['venue_type'] ?? '');
            $region = trim($input['region'] ?? '');
            $regionDetail = trim($input['region_detail'] ?? '');
            $satisfaction = intval($input['satisfaction'] ?? 0);
            $memo = trim($input['memo'] ?? '');
            $countryCode = trim($input['country_code'] ?? 'KR');
            // Phase 1: new fields
            $currency = trim($input['currency'] ?? 'KRW');
            $source = trim($input['source'] ?? 'manual');
            $salesChannel = trim($input['sales_channel'] ?? '');
            $productName = trim($input['product_name'] ?? '');
            $quantitySold = intval($input['quantity_sold'] ?? 0);
            $costPrice = intval($input['cost_price'] ?? 0);
            $profitMargin = isset($input['profit_margin']) ? floatval($input['profit_margin']) : null;

            if ($satisfaction < 0 || $satisfaction > 5)
                $satisfaction = 0;

            // Auto-calculate profit margin if not provided
            if ($profitMargin === null && $revenue > 0 && $costPrice > 0) {
                $profitMargin = round((($revenue - $costPrice) / $revenue) * 100, 2);
            }

            // Check if record exists (by id if editing, otherwise by composite key including country_code)
            $existingId = intval($input['id'] ?? 0);
            if ($existingId > 0) {
                $check = $conn->prepare("SELECT id FROM seller_stats WHERE id = ? AND user_id = ?");
                $check->execute([$existingId, $userId]);
            } else {
                $check = $conn->prepare("SELECT id FROM seller_stats WHERE user_id = ? AND country_code = ? AND record_type = ? AND record_date = ?");
                $check->execute([$userId, $countryCode, $recordType, $recordDate]);
            }
            $existing = $check->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $stmt = $conn->prepare("UPDATE seller_stats SET 
                    country_code = ?, monthly_revenue = ?, customer_count = ?, transaction_count = ?,
                    avg_unit_price = ?, best_selling_item = ?, venue_type = ?,
                    region = ?, region_detail = ?, satisfaction = ?, memo = ?,
                    currency = ?, source = ?, sales_channel = ?,
                    product_name = ?, quantity_sold = ?, cost_price = ?, profit_margin = ?
                    WHERE id = ? AND user_id = ?");
                $stmt->execute([
                    $countryCode,
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $regionDetail,
                    $satisfaction ?: null,
                    $memo,
                    $currency,
                    $source,
                    $salesChannel,
                    $productName,
                    $quantitySold,
                    $costPrice,
                    $profitMargin,
                    $existing['id'],
                    $userId
                ]);
                echo json_encode(["success" => true, "message" => "데이터가 수정되었습니다.", "id" => $existing['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO seller_stats 
                    (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                     avg_unit_price, best_selling_item, venue_type, region, region_detail, satisfaction, memo,
                     currency, source, sales_channel, product_name, quantity_sold, cost_price, profit_margin)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $userId,
                    $countryCode,
                    $recordType,
                    $recordDate,
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $regionDetail,
                    $satisfaction ?: null,
                    $memo,
                    $currency,
                    $source,
                    $salesChannel,
                    $productName,
                    $quantitySold,
                    $costPrice,
                    $profitMargin
                ]);
                echo json_encode(["success" => true, "message" => "데이터가 저장되었습니다.", "id" => $conn->lastInsertId()]);
            }
            break;

        // ── DELETE ──
        case 'delete':
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 ID입니다."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM seller_stats WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "데이터가 삭제되었습니다."]);
            } else {
                echo json_encode(["success" => false, "message" => "삭제할 데이터를 찾을 수 없습니다."]);
            }
            break;


        // ── IMPORT-related actions: delegate to seller_stats_import.php if it exists ──
        case 'import':
        case 'templates':
        case 'auto_map':
        case 'history':
        case 'undo_batch':
            $importFile = __DIR__ . '/seller_stats_import_logic.php';
            if (file_exists($importFile)) {
                include $importFile;
            } else {
                // ── Full inline import logic (complete) ──
                $SUPPORTED_CURRENCIES = ['KRW','USD','EUR','JPY','CNY','GBP','THB','VND','CAD','AUD','SGD','HKD','TWD','MYR','PHP','IDR','INR','BRL','MXN','CHF'];
                $ERP_TEMPLATES = [
                    'generic' => ['name'=>'Generic / Custom','name_ko'=>'범용 / 커스텀','columns'=>[
                        ['key'=>'record_date','label'=>'Date','label_ko'=>'날짜','required'=>true],
                        ['key'=>'monthly_revenue','label'=>'Revenue','label_ko'=>'매출액','required'=>true],
                        ['key'=>'transaction_count','label'=>'Transactions','label_ko'=>'거래건수','required'=>false],
                        ['key'=>'customer_count','label'=>'Customers','label_ko'=>'고객수','required'=>false],
                        ['key'=>'product_name','label'=>'Product','label_ko'=>'상품명','required'=>false],
                        ['key'=>'quantity_sold','label'=>'Qty Sold','label_ko'=>'판매수량','required'=>false],
                        ['key'=>'cost_price','label'=>'Cost','label_ko'=>'원가','required'=>false],
                        ['key'=>'best_selling_item','label'=>'Category','label_ko'=>'카테고리','required'=>false],
                        ['key'=>'memo','label'=>'Memo','label_ko'=>'메모','required'=>false],
                    ]],
                    'naver_smartstore' => ['name'=>'Naver Smartstore','name_ko'=>'네이버 스마트스토어',
                        'auto_map'=>['결제일'=>'record_date','상품주문번호'=>'memo','상품명'=>'product_name','수량'=>'quantity_sold','상품별 총 주문금액'=>'monthly_revenue','결제금액'=>'monthly_revenue','구매자명'=>'customer_count'],
                        'columns'=>[['key'=>'record_date','label'=>'결제일','required'=>true],['key'=>'product_name','label'=>'상품명','required'=>false],['key'=>'quantity_sold','label'=>'수량','required'=>false],['key'=>'monthly_revenue','label'=>'결제금액','required'=>true],['key'=>'memo','label'=>'주문번호','required'=>false]]],
                    'coupang' => ['name'=>'Coupang','name_ko'=>'쿠팡',
                        'auto_map'=>['주문일'=>'record_date','결제일'=>'record_date','노출상품명'=>'product_name','상품명'=>'product_name','수량'=>'quantity_sold','판매가(할인가)'=>'monthly_revenue','결제액'=>'monthly_revenue','주문번호'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'주문일','required'=>true],['key'=>'product_name','label'=>'상품명','required'=>false],['key'=>'quantity_sold','label'=>'수량','required'=>false],['key'=>'monthly_revenue','label'=>'결제액','required'=>true],['key'=>'memo','label'=>'주문번호','required'=>false]]],
                    'cafe24' => ['name'=>'Cafe24','name_ko'=>'카페24',
                        'auto_map'=>['주문일시'=>'record_date','주문일'=>'record_date','상품명'=>'product_name','수량'=>'quantity_sold','주문금액'=>'monthly_revenue','실결제금액'=>'monthly_revenue','주문번호'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'주문일시','required'=>true],['key'=>'product_name','label'=>'상품명','required'=>false],['key'=>'quantity_sold','label'=>'수량','required'=>false],['key'=>'monthly_revenue','label'=>'주문금액','required'=>true],['key'=>'memo','label'=>'주문번호','required'=>false]]],
                    'shopify' => ['name'=>'Shopify','name_ko'=>'Shopify',
                        'auto_map'=>['Created at'=>'record_date','Date'=>'record_date','Lineitem name'=>'product_name','Lineitem quantity'=>'quantity_sold','Total'=>'monthly_revenue','Subtotal'=>'monthly_revenue','Name'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'Created at','required'=>true],['key'=>'product_name','label'=>'Lineitem name','required'=>false],['key'=>'quantity_sold','label'=>'Lineitem quantity','required'=>false],['key'=>'monthly_revenue','label'=>'Total','required'=>true],['key'=>'memo','label'=>'Name','required'=>false]]],
                    'amazon' => ['name'=>'Amazon','name_ko'=>'Amazon',
                        'auto_map'=>['purchase-date'=>'record_date','order-date'=>'record_date','product-name'=>'product_name','quantity-purchased'=>'quantity_sold','item-price'=>'monthly_revenue','order-id'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'purchase-date','required'=>true],['key'=>'product_name','label'=>'product-name','required'=>false],['key'=>'quantity_sold','label'=>'quantity-purchased','required'=>false],['key'=>'monthly_revenue','label'=>'item-price','required'=>true],['key'=>'memo','label'=>'order-id','required'=>false]]],
                    'rakuten' => ['name'=>'Rakuten','name_ko'=>'라쿠텐 (楽天)',
                        'auto_map'=>['注文日時'=>'record_date','注文日'=>'record_date','商品名'=>'product_name','個数'=>'quantity_sold','合計金額'=>'monthly_revenue','受注番号'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'注文日時','required'=>true],['key'=>'product_name','label'=>'商品名','required'=>false],['key'=>'quantity_sold','label'=>'個数','required'=>false],['key'=>'monthly_revenue','label'=>'合計金額','required'=>true],['key'=>'memo','label'=>'受注番号','required'=>false]]],
                    'etsy' => ['name'=>'Etsy','name_ko'=>'Etsy',
                        'auto_map'=>['Sale Date'=>'record_date','Date'=>'record_date','Item Name'=>'product_name','Quantity'=>'quantity_sold','Order Value'=>'monthly_revenue','Price'=>'monthly_revenue','Order ID'=>'memo'],
                        'columns'=>[['key'=>'record_date','label'=>'Sale Date','required'=>true],['key'=>'product_name','label'=>'Item Name','required'=>false],['key'=>'quantity_sold','label'=>'Quantity','required'=>false],['key'=>'monthly_revenue','label'=>'Order Value','required'=>true],['key'=>'memo','label'=>'Order ID','required'=>false]]],
                ];
                $COLUMN_KEYWORDS = [
                    'record_date'=>['date','날짜','일자','주문일','결제일','발행일','日付','注文日','日期','datum','fecha','data','영업일'],
                    'order_number'=>['order id','order no','주문번호','거래번호','전표번호','영수증','注文番号','伝票','订单号','bestellnummer','invoice','receipt','연수증번호'],
                    'transaction_count'=>['transaction','건수','주문수','거래건','取引','注文','订单','orders'],
                    'product_name'=>['product','item','상품','품목','商品','产品','name','상품명'],
                    'sku'=>['sku','barcode','바코드','상품코드','품번','コード','编码','upc','ean'],
                    'brand'=>['brand','브랜드','제조사','ブランド','品牌','manufacturer'],
                    'option_info'=>['option','옵션','색상','사이즈','オプション','选项','variant','size','color'],
                    'best_selling_item'=>['category','카테고리','분류','상품군','カテゴリ','类别','type'],
                    'quantity_sold'=>['quantity','qty','수량','개수','판매수량','数量','個数','units','pcs'],
                    'return_qty'=>['return qty','반품수량','환불수량','返品数','退货数'],
                    'customer_count'=>['customer','고객','방문','고객수','顧客','客数','客户','buyer'],
                    'monthly_revenue'=>['revenue','sales','amount','매출','금액','결제금액','판매액','매출액','売上','金額','收入','total','합계','합계금액','단가'],
                    'avg_unit_price'=>['unit price','단가','판매단가','単価','单价','prix unitaire'],
                    'cost_price'=>['cost','원가','매입가','仕入','成本','cogs','공급가액','공급가'],
                    'discount_amount'=>['discount','할인','할인액','쿠폰할인','割引','折扣','coupon'],
                    'tax_amount'=>['tax','vat','세금','부가세','소비세','부가가치세','税','税金','부가세'],
                    'shipping_cost'=>['shipping','delivery','배송비','배송','택배','배송료','送料','运费'],
                    'refund_amount'=>['refund','환불','환불액','반품금액','返品','返金','退款'],
                    'commission_fee'=>['commission','fee','수수료','플랫폼수수료','手数料','佣金'],
                    'net_revenue'=>['net','순매출','순수익','정산금액','실수령액','純売上','净收入'],
                    'profit_amount'=>['profit','이익','이익금','순이익','마진','利益','利润'],
                    'points_used'=>['points','적립금','포인트','마일리지','ポイント','积分'],
                    'payment_method'=>['payment method','결제수단','결제방법','결제유형','決済方法','支付方式','card','카드','현금','cash','결제상세'],
                    'payment_status'=>['status','결제상태','주문상태','상태','ステータス','状态'],
                    'customer_name'=>['customer name','고객명','주문자','구매자','顧客名','客户名','buyer name'],
                    'staff_name'=>['staff','employee','판매원','담당자','직원','担当','员工','cashier'],
                    'store_name'=>['store','branch','shop','매장','지점','판매점','점포','店舗','门店'],
                    'platform'=>['platform','플랫폼','プラットフォーム','平台','marketplace','마켓플레이스'],
                    'supplier'=>['supplier','vendor','거래처','공급업체','仕入先','供应商'],
                    'sales_channel'=>['channel','판매채널','채널','유통경로','チャネル','渠道'],
                    'region'=>['region','지역','관할','地域','地区','area'],
                    'venue_type'=>['venue','매장유형','업태','업종','業態','业态'],
                    'satisfaction'=>['rating','satisfaction','만족도','평점','評価','评分','review','score'],
                    'memo'=>['memo','note','비고','메모','備考','备注','remark','comment','내역'],
                ];

                if ($action === 'templates') {
                    echo json_encode(["success" => true, "templates" => $ERP_TEMPLATES, "currencies" => $SUPPORTED_CURRENCIES, "column_keywords" => $COLUMN_KEYWORDS]);
                } elseif ($action === 'auto_map') {
                    $headers = $input['headers'] ?? [];
                    $templateKey = $input['template'] ?? '';
                    $mapping = [];
                    // Template auto_map first
                    if ($templateKey && isset($ERP_TEMPLATES[$templateKey]['auto_map'])) {
                        $autoMap = $ERP_TEMPLATES[$templateKey]['auto_map'];
                        foreach ($headers as $idx => $header) {
                            $hClean = trim($header);
                            if (isset($autoMap[$hClean])) $mapping[$idx] = $autoMap[$hClean];
                        }
                    }
                    // Keyword matching for unmapped
                    foreach ($headers as $idx => $header) {
                        if (isset($mapping[$idx])) continue;
                        $hLower = mb_strtolower(trim($header));
                        $bestMatch = null; $bestLen = 0;
                        foreach ($COLUMN_KEYWORDS as $field => $keywords) {
                            if (in_array($field, $mapping)) continue;
                            foreach ($keywords as $kw) {
                                $kwL = mb_strtolower($kw);
                                if (mb_strpos($hLower, $kwL) !== false) {
                                    $kwLen = mb_strlen($kwL);
                                    if ($kwLen > $bestLen) { $bestMatch = $field; $bestLen = $kwLen; }
                                }
                            }
                        }
                        if ($bestMatch) $mapping[$idx] = $bestMatch;
                    }
                    echo json_encode(["success" => true, "mapping" => $mapping]);
                } elseif ($action === 'history') {
                    $stmt = $conn->prepare("
                        SELECT import_batch_id, source, sales_channel, currency,
                               COUNT(*) as record_count,
                               SUM(monthly_revenue) as total_revenue,
                               MIN(record_date) as date_from,
                               MAX(record_date) as date_to,
                               MIN(created_at) as imported_at
                        FROM seller_stats 
                        WHERE user_id = ? AND import_batch_id IS NOT NULL 
                        GROUP BY import_batch_id, source, sales_channel, currency
                        ORDER BY MIN(created_at) DESC
                        LIMIT 20
                    ");
                    $stmt->execute([$userId]);
                    echo json_encode(["success" => true, "batches" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
                } elseif ($action === 'undo_batch') {
                    $batchId = trim($input['batch_id'] ?? '');
                    if (empty($batchId)) {
                        echo json_encode(["success" => false, "message" => "Batch ID required."]);
                    } else {
                        $stmt = $conn->prepare("DELETE FROM seller_stats WHERE user_id = ? AND import_batch_id = ?");
                        $stmt->execute([$userId, $batchId]);
                        echo json_encode(["success" => true, "deleted" => $stmt->rowCount()]);
                    }
                } elseif ($action === 'import') {
                    // ── Inline import logic ──
                    $rows = $input['rows'] ?? [];
                    $currency = trim($input['currency'] ?? 'KRW');
                    $recordType = trim($input['record_type'] ?? 'daily');
                    $salesChannel = trim($input['sales_channel'] ?? '');
                    $countryCode = 'KR';

                    if (empty($rows)) {
                        echo json_encode(["success" => false, "message" => "No data."]);
                        break;
                    }
                    if (!in_array($recordType, ['daily','monthly','annual'])) $recordType = 'daily';

                    $batchId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff),
                        mt_rand(0,0x0fff)|0x4000,mt_rand(0,0x3fff)|0x8000,
                        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff));

                    $stmt = $conn->prepare("INSERT INTO seller_stats 
                        (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                         avg_unit_price, best_selling_item, product_name, quantity_sold, cost_price, profit_margin,
                         discount_amount, tax_amount, shipping_cost, refund_amount, commission_fee, net_revenue,
                         payment_method, order_number, sku, brand, option_info, return_qty, profit_amount,
                         points_used, payment_status, customer_name, staff_name, store_name, platform, supplier,
                         currency, source, import_batch_id, sales_channel, region, venue_type, satisfaction, memo)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                    $inserted = 0; $skipped = 0; $errors = [];
                    foreach ($rows as $i => $row) {
                        $date = trim($row['record_date'] ?? '');
                        if (empty($date)) { $skipped++; continue; }
                        // Basic date normalization
                        $date = str_replace(['/', '.'], '-', $date);
                        if (preg_match('/^(\d{4}[-]\d{1,2}[-]\d{1,2})/', $date, $m)) $date = $m[1];
                        elseif (is_numeric($date) && intval($date) > 30000 && intval($date) < 60000) {
                            $date = date('Y-m-d', ($date - 25569) * 86400);
                        }
                        // Validate date
                        if ($recordType === 'daily' && !preg_match('/^\d{4}-\d{1,2}-\d{1,2}$/', $date)) { $skipped++; continue; }

                        $revenue = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['monthly_revenue'] ?? 0)));
                        $customers = intval($row['customer_count'] ?? 0);
                        $transactions = intval($row['transaction_count'] ?? 0);
                        $quantitySold = intval($row['quantity_sold'] ?? 0);
                        $costPrice = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['cost_price'] ?? 0)));
                        $unitPrice = intval($row['avg_unit_price'] ?? 0);
                        if ($unitPrice <= 0 && $transactions > 0 && $revenue > 0) $unitPrice = round($revenue / $transactions);
                        if ($transactions === 0 && $quantitySold > 0) { $transactions = $quantitySold; if ($unitPrice <= 0 && $revenue > 0) $unitPrice = round($revenue / $quantitySold); }
                        $profitMargin = ($revenue > 0 && $costPrice > 0) ? round((($revenue - $costPrice) / $revenue) * 100, 2) : null;
                        $discountAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['discount_amount'] ?? 0)));
                        $taxAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['tax_amount'] ?? 0)));
                        $shippingCost = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['shipping_cost'] ?? 0)));
                        $refundAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['refund_amount'] ?? 0)));
                        $commissionFee = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['commission_fee'] ?? 0)));
                        $netRevenue = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['net_revenue'] ?? 0)));
                        if ($netRevenue === 0 && $revenue > 0) $netRevenue = $revenue - $discountAmount - $taxAmount - $commissionFee - $refundAmount;
                        $profitAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['profit_amount'] ?? 0)));
                        if ($profitAmount === 0 && $revenue > 0 && $costPrice > 0) $profitAmount = $revenue - $costPrice;

                        try {
                            $stmt->execute([
                                $userId, $countryCode, $recordType, $date,
                                $revenue, $customers, $transactions, $unitPrice,
                                trim($row['best_selling_item'] ?? ''), trim($row['product_name'] ?? ''),
                                $quantitySold, $costPrice, $profitMargin,
                                $discountAmount, $taxAmount, $shippingCost, $refundAmount,
                                $commissionFee, $netRevenue,
                                trim($row['payment_method'] ?? ''), trim($row['order_number'] ?? ''),
                                trim($row['sku'] ?? ''), trim($row['brand'] ?? ''), trim($row['option_info'] ?? ''),
                                intval($row['return_qty'] ?? 0), $profitAmount,
                                intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['points_used'] ?? 0))),
                                trim($row['payment_status'] ?? ''), trim($row['customer_name'] ?? ''),
                                trim($row['staff_name'] ?? ''), trim($row['store_name'] ?? ''),
                                trim($row['platform'] ?? ''), trim($row['supplier'] ?? ''),
                                $currency, 'excel', $batchId,
                                $salesChannel ?: trim($row['platform'] ?? ''),
                                trim($row['region'] ?? ''), trim($row['venue_type'] ?? ''),
                                (intval($row['satisfaction'] ?? 0) >= 0 && intval($row['satisfaction'] ?? 0) <= 5) ? intval($row['satisfaction'] ?? 0) ?: null : null,
                                trim($row['memo'] ?? '')
                            ]);
                            $inserted++;
                        } catch (PDOException $e) {
                            $skipped++;
                            $errors[] = ['row' => $i + 1, 'error' => $e->getMessage()];
                        }
                    }
                    echo json_encode([
                        "success" => true, "batch_id" => $batchId,
                        "inserted" => $inserted, "skipped" => $skipped,
                        "total" => count($rows), "errors" => array_slice($errors, 0, 10)
                    ]);
                }
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>