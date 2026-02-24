<?php
/**
 * Seller Stats Import API
 * 
 * Handles bulk import of sales data from Excel/CSV files (parsed on frontend via SheetJS).
 * Also provides ERP template definitions for download.
 * 
 * Actions:
 *   - import      : Bulk insert parsed rows (JSON array from frontend)
 *   - templates   : Return available ERP template column definitions
 *   - history     : List import batches for this user
 *   - undo_batch  : Delete all records from a specific import batch
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + seller role
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

// ── SUPPORTED CURRENCIES ──
$SUPPORTED_CURRENCIES = ['KRW', 'USD', 'EUR', 'JPY', 'CNY', 'GBP', 'THB', 'VND', 'CAD', 'AUD', 'SGD', 'HKD', 'TWD', 'MYR', 'PHP', 'IDR', 'INR', 'BRL', 'MXN', 'CHF'];

// ── ERP TEMPLATE DEFINITIONS ──
// Each template defines expected column names for different ERP/marketplace systems
$ERP_TEMPLATES = [
    'generic' => [
        'name' => 'Generic / Custom',
        'name_ko' => '범용 / 커스텀',
        'columns' => [
            ['key' => 'record_date', 'label' => 'Date', 'label_ko' => '날짜', 'required' => true],
            ['key' => 'monthly_revenue', 'label' => 'Revenue', 'label_ko' => '매출액', 'required' => true],
            ['key' => 'transaction_count', 'label' => 'Transactions', 'label_ko' => '거래건수', 'required' => false],
            ['key' => 'customer_count', 'label' => 'Customers', 'label_ko' => '고객수', 'required' => false],
            ['key' => 'product_name', 'label' => 'Product', 'label_ko' => '상품명', 'required' => false],
            ['key' => 'quantity_sold', 'label' => 'Qty Sold', 'label_ko' => '판매수량', 'required' => false],
            ['key' => 'cost_price', 'label' => 'Cost', 'label_ko' => '원가', 'required' => false],
            ['key' => 'best_selling_item', 'label' => 'Category', 'label_ko' => '카테고리', 'required' => false],
            ['key' => 'memo', 'label' => 'Memo', 'label_ko' => '메모', 'required' => false],
        ]
    ],
    'naver_smartstore' => [
        'name' => 'Naver Smartstore',
        'name_ko' => '네이버 스마트스토어',
        'auto_map' => [
            '결제일' => 'record_date',
            '상품주문번호' => 'memo',
            '상품명' => 'product_name',
            '수량' => 'quantity_sold',
            '상품별 총 주문금액' => 'monthly_revenue',
            '결제금액' => 'monthly_revenue',
            '구매자명' => 'customer_count',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => '결제일', 'required' => true],
            ['key' => 'product_name', 'label' => '상품명', 'required' => false],
            ['key' => 'quantity_sold', 'label' => '수량', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => '결제금액', 'required' => true],
            ['key' => 'memo', 'label' => '주문번호', 'required' => false],
        ]
    ],
    'coupang' => [
        'name' => 'Coupang',
        'name_ko' => '쿠팡',
        'auto_map' => [
            '주문일' => 'record_date',
            '결제일' => 'record_date',
            '노출상품명' => 'product_name',
            '상품명' => 'product_name',
            '수량' => 'quantity_sold',
            '판매가(할인가)' => 'monthly_revenue',
            '결제액' => 'monthly_revenue',
            '주문번호' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => '주문일', 'required' => true],
            ['key' => 'product_name', 'label' => '상품명', 'required' => false],
            ['key' => 'quantity_sold', 'label' => '수량', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => '결제액', 'required' => true],
            ['key' => 'memo', 'label' => '주문번호', 'required' => false],
        ]
    ],
    'cafe24' => [
        'name' => 'Cafe24',
        'name_ko' => '카페24',
        'auto_map' => [
            '주문일시' => 'record_date',
            '주문일' => 'record_date',
            '상품명' => 'product_name',
            '수량' => 'quantity_sold',
            '주문금액' => 'monthly_revenue',
            '실결제금액' => 'monthly_revenue',
            '주문번호' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => '주문일시', 'required' => true],
            ['key' => 'product_name', 'label' => '상품명', 'required' => false],
            ['key' => 'quantity_sold', 'label' => '수량', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => '주문금액', 'required' => true],
            ['key' => 'memo', 'label' => '주문번호', 'required' => false],
        ]
    ],
    'shopify' => [
        'name' => 'Shopify',
        'name_ko' => 'Shopify',
        'auto_map' => [
            'Created at' => 'record_date',
            'Date' => 'record_date',
            'Lineitem name' => 'product_name',
            'Lineitem quantity' => 'quantity_sold',
            'Total' => 'monthly_revenue',
            'Subtotal' => 'monthly_revenue',
            'Name' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => 'Created at', 'required' => true],
            ['key' => 'product_name', 'label' => 'Lineitem name', 'required' => false],
            ['key' => 'quantity_sold', 'label' => 'Lineitem quantity', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => 'Total', 'required' => true],
            ['key' => 'memo', 'label' => 'Name', 'required' => false],
        ]
    ],
    'amazon' => [
        'name' => 'Amazon',
        'name_ko' => 'Amazon',
        'auto_map' => [
            'purchase-date' => 'record_date',
            'order-date' => 'record_date',
            'product-name' => 'product_name',
            'quantity-purchased' => 'quantity_sold',
            'item-price' => 'monthly_revenue',
            'order-id' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => 'purchase-date', 'required' => true],
            ['key' => 'product_name', 'label' => 'product-name', 'required' => false],
            ['key' => 'quantity_sold', 'label' => 'quantity-purchased', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => 'item-price', 'required' => true],
            ['key' => 'memo', 'label' => 'order-id', 'required' => false],
        ]
    ],
    'rakuten' => [
        'name' => 'Rakuten',
        'name_ko' => '라쿠텐 (楽天)',
        'auto_map' => [
            '注文日時' => 'record_date',
            '注文日' => 'record_date',
            '商品名' => 'product_name',
            '個数' => 'quantity_sold',
            '合計金額' => 'monthly_revenue',
            '受注番号' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => '注文日時', 'required' => true],
            ['key' => 'product_name', 'label' => '商品名', 'required' => false],
            ['key' => 'quantity_sold', 'label' => '個数', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => '合計金額', 'required' => true],
            ['key' => 'memo', 'label' => '受注番号', 'required' => false],
        ]
    ],
    'etsy' => [
        'name' => 'Etsy',
        'name_ko' => 'Etsy',
        'auto_map' => [
            'Sale Date' => 'record_date',
            'Date' => 'record_date',
            'Item Name' => 'product_name',
            'Quantity' => 'quantity_sold',
            'Order Value' => 'monthly_revenue',
            'Price' => 'monthly_revenue',
            'Order ID' => 'memo',
        ],
        'columns' => [
            ['key' => 'record_date', 'label' => 'Sale Date', 'required' => true],
            ['key' => 'product_name', 'label' => 'Item Name', 'required' => false],
            ['key' => 'quantity_sold', 'label' => 'Quantity', 'required' => false],
            ['key' => 'monthly_revenue', 'label' => 'Order Value', 'required' => true],
            ['key' => 'memo', 'label' => 'Order ID', 'required' => false],
        ]
    ],
];

// ── Smart column mapping keywords (multi-language) ──
$COLUMN_KEYWORDS = [
    // ── 거래 기본 정보 (Transaction Basics) ──
    'record_date' => ['date', '날짜', '일자', '주문일', '결제일', '발행일', '日付', '注文日', '日期', 'datum', 'fecha', 'data'],
    'order_number' => ['order id', 'order no', '주문번호', '거래번호', '전표번호', '영수증', '注文番号', '伝票', '订单号', 'bestellnummer', 'numéro', 'número', 'invoice', 'receipt'],
    'transaction_count' => ['transaction', '건수', '주문수', '거래건', '取引', '注文', '订单', 'bestellung', 'commande', 'orders'],

    // ── 상품 정보 (Product Info) ──
    'product_name' => ['product', 'item', '상품', '품목', '商品', '产品', 'produkt', 'produit', 'name', '이름', '상품명'],
    'sku' => ['sku', 'barcode', '바코드', '상품코드', '품번', 'コード', '编码', 'artikelnr', 'référence', 'codigo', 'upc', 'ean', 'jan'],
    'brand' => ['brand', '브랜드', '제조사', '만든곳', 'ブランド', '品牌', 'marke', 'marque', 'marca', 'manufacturer'],
    'option_info' => ['option', '옵션', '색상', '사이즈', 'オプション', '选项', 'variante', 'variant', 'size', 'color', '규격'],
    'best_selling_item' => ['category', '카테고리', '분류', '상품군', 'カテゴリ', '类别', 'kategorie', 'catégorie', 'type', 'genre'],

    // ── 수량 (Quantities) ──
    'quantity_sold' => ['quantity', 'qty', '수량', '개수', '판매수량', '数量', '個数', 'menge', 'quantité', 'units', 'pcs'],
    'return_qty' => ['return qty', '반품수량', '환불수량', '교환수량', '返品数', '退货数', 'retoure', 'retour qty'],
    'customer_count' => ['customer', '고객', '방문', '고객수', '顧客', '客数', '客户', 'kunde', 'client', 'visitors', 'buyer'],

    // ── 금액 (Amounts) ──
    'monthly_revenue' => ['revenue', 'sales', 'amount', '매출', '금액', '결제금액', '판매액', '매출액', '売上', '金額', '收入', 'umsatz', 'ventes', 'total', '합계'],
    'avg_unit_price' => ['unit price', '단가', '판매단가', '単価', '单价', 'unitprice', 'prix unitaire', 'stückpreis', 'precio unitario'],
    'cost_price' => ['cost', '원가', '매입가', '仕入', '成本', 'kosten', 'coût', 'cogs', 'expense', '매입단가'],
    'discount_amount' => ['discount', '할인', '할인액', '쿠폰할인', '割引', '折扣', 'rabatt', 'remise', 'descuento', 'coupon', '쿠폰'],
    'tax_amount' => ['tax', 'vat', '세금', '부가세', '소비세', '부가가치세', '税', '税金', '增值税', 'steuer', 'taxe', 'impuesto', 'gst'],
    'shipping_cost' => ['shipping', 'delivery', '배송비', '배송', '택배', '배송료', '送料', '运费', 'versand', 'livraison', 'envío', 'freight'],
    'refund_amount' => ['refund', '환불', '환불액', '반품금액', '返品', '返金', '退款', 'erstattung', 'remboursement', 'devolución'],
    'commission_fee' => ['commission', 'fee', '수수료', '플랫폼수수료', '手数料', '佣金', 'provision', 'gebühr', 'comisión', '중개수수료'],
    'net_revenue' => ['net', '순매출', '순수익', '정산금액', '실수령액', '純売上', '净收入', 'netto', 'net revenue', 'net sales'],
    'profit_amount' => ['profit', '이익', '이익금', '순이익', '마진', '利益', '利润', 'gewinn', 'bénéfice', 'ganancia', 'margin'],
    'points_used' => ['points', '적립금', '포인트', '마일리지', 'ポイント', '积分', 'punkte', 'rewards', 'mileage', '사용포인트'],

    // ── 결제 정보 (Payment Info) ──
    'payment_method' => ['payment method', '결제수단', '결제방법', '결제유형', '決済方法', '支付方式', 'zahlungsart', 'mode paiement', 'forma pago', 'card', '카드', '현금', 'cash', '계좌이체'],
    'payment_status' => ['status', '결제상태', '주문상태', '상태', 'ステータス', '状态', 'zahlungsstatus', 'statut', 'estado', 'complete', 'pending', 'cancelled'],

    // ── 사람/장소 (People & Location) ──
    'customer_name' => ['customer name', '고객명', '주문자', '구매자', '顧客名', '客户名', 'kundenname', 'nom client', 'nombre cliente', 'buyer name'],
    'staff_name' => ['staff', 'employee', '판매원', '담당자', '직원', '担当', '员工', 'mitarbeiter', 'employé', 'empleado', 'cashier', '캐시어'],
    'store_name' => ['store', 'branch', 'shop', '매장', '지점', '판매점', '점포', '店舗', '门店', 'filiale', 'magasin', 'tienda', 'outlet', '지점명'],
    'platform' => ['platform', '플랫폼', '판매플랫폼', 'プラットフォーム', '平台', 'plattform', 'plateforme', 'plataforma', 'marketplace', '마켓플레이스'],
    'supplier' => ['supplier', 'vendor', '거래처', '공급업체', '사입자', '仕入先', '供应商', 'lieferant', 'fournisseur', 'proveedor'],
    'sales_channel' => ['channel', '판매채널', '채널', '유통경로', 'チャネル', '渠道', 'kanal', 'canal'],
    'region' => ['region', '지역', '관할', '地域', '地区', 'gebiet', 'région', 'región', 'area'],
    'venue_type' => ['venue', '매장유형', '업태', '업종', '業態', '业态', 'geschäftstyp', 'type lieu'],
    'satisfaction' => ['rating', 'satisfaction', '만족도', '평점', '評価', '评分', 'bewertung', 'évaluation', 'calificación', 'review', 'score'],

    // ── 기타 (Other) ──
    'memo' => ['memo', 'note', '비고', '메모', '備考', '备注', 'notiz', 'remarque', 'remark', 'comment', '내역'],
];

try {
    switch ($action) {

        // ── TEMPLATES: Return ERP template definitions ──
        case 'templates':
            echo json_encode([
                "success" => true,
                "templates" => $ERP_TEMPLATES,
                "currencies" => $SUPPORTED_CURRENCIES,
                "column_keywords" => $COLUMN_KEYWORDS,
            ]);
            break;

        // ── AUTO_MAP: Given header row, suggest column mappings ──
        case 'auto_map':
            $headers = $input['headers'] ?? [];
            $templateKey = $input['template'] ?? '';

            $mapping = [];

            // If template specified, use its auto_map first
            if ($templateKey && isset($ERP_TEMPLATES[$templateKey]['auto_map'])) {
                $autoMap = $ERP_TEMPLATES[$templateKey]['auto_map'];
                foreach ($headers as $idx => $header) {
                    $headerClean = trim($header);
                    if (isset($autoMap[$headerClean])) {
                        $mapping[$idx] = $autoMap[$headerClean];
                    }
                }
            }

            // Fill remaining unmapped columns using keyword matching
            // Sort keywords by length (longer = more specific = higher priority)
            foreach ($headers as $idx => $header) {
                if (isset($mapping[$idx]))
                    continue;
                $headerLower = mb_strtolower(trim($header));

                $bestMatch = null;
                $bestKeywordLen = 0;

                foreach ($COLUMN_KEYWORDS as $field => $keywords) {
                    // Don't map to a field that's already mapped
                    if (in_array($field, $mapping))
                        continue;
                    foreach ($keywords as $keyword) {
                        $kwLower = mb_strtolower($keyword);
                        if (mb_strpos($headerLower, $kwLower) !== false) {
                            // Prefer longer keyword matches (more specific)
                            $kwLen = mb_strlen($kwLower);
                            if ($kwLen > $bestKeywordLen) {
                                $bestMatch = $field;
                                $bestKeywordLen = $kwLen;
                            }
                        }
                    }
                }

                if ($bestMatch) {
                    $mapping[$idx] = $bestMatch;
                }
            }

            echo json_encode(["success" => true, "mapping" => $mapping]);
            break;

        // ── IMPORT: Bulk insert parsed rows ──
        case 'import':
            $rows = $input['rows'] ?? [];
            $currency = trim($input['currency'] ?? 'KRW');
            $recordType = $input['record_type'] ?? 'daily';
            $salesChannel = trim($input['sales_channel'] ?? '');
            $templateKey = trim($input['template'] ?? 'generic');
            $countryCode = trim($input['country_code'] ?? 'KR');

            if (empty($rows)) {
                echo json_encode(["success" => false, "message" => "No data to import."]);
                exit;
            }

            if (count($rows) > 5000) {
                echo json_encode(["success" => false, "message" => "Maximum 5000 rows per import."]);
                exit;
            }

            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                $recordType = 'daily';
            }

            // ── Auto-migrate INT columns to BIGINT to prevent overflow ──
            $intToBigint = ['monthly_revenue', 'customer_count', 'transaction_count', 'avg_unit_price'];
            foreach ($intToBigint as $col) {
                try {
                    $colInfo = $conn->query("SHOW COLUMNS FROM seller_stats WHERE Field = '$col'")->fetch(PDO::FETCH_ASSOC);
                    if ($colInfo && stripos($colInfo['Type'], 'bigint') === false && stripos($colInfo['Type'], 'decimal') === false) {
                        $conn->exec("ALTER TABLE seller_stats MODIFY COLUMN `$col` BIGINT DEFAULT 0");
                    }
                } catch (PDOException $ex) { /* ignore */
                }
            }

            // ── Drop UNIQUE KEY if exists (allow multiple rows per date for product-level data) ──
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

            // Generate batch ID
            $batchId = sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0xffff)
            );

            $stmt = $conn->prepare("INSERT INTO seller_stats 
                (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                 avg_unit_price, best_selling_item, product_name, quantity_sold, cost_price, profit_margin,
                 discount_amount, tax_amount, shipping_cost, refund_amount, commission_fee, net_revenue,
                 payment_method, order_number, sku, brand, option_info, return_qty, profit_amount,
                 points_used, payment_status, customer_name, staff_name, store_name, platform, supplier,
                 currency, source, import_batch_id, sales_channel, region, venue_type, satisfaction, memo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $inserted = 0;
            $skipped = 0;
            $errors = [];

            foreach ($rows as $i => $row) {
                $date = trim($row['record_date'] ?? '');
                if (empty($date)) {
                    $skipped++;
                    continue;
                }

                // Normalize date to appropriate format
                $date = normalizeDate($date, $recordType);
                if (!$date) {
                    $errors[] = ['row' => $i + 1, 'error' => 'Invalid date format'];
                    $skipped++;
                    continue;
                }

                $revenue = parseNumber($row['monthly_revenue'] ?? 0);
                $customers = clampCount(parseNumber($row['customer_count'] ?? 0));
                $transactions = clampCount(parseNumber($row['transaction_count'] ?? 0));
                $quantitySold = clampCount(parseNumber($row['quantity_sold'] ?? 0));
                $costPrice = parseNumber($row['cost_price'] ?? 0);
                $category = trim($row['best_selling_item'] ?? '');
                $productName = trim($row['product_name'] ?? '');
                $memo = trim($row['memo'] ?? '');

                // Use mapped unit price if provided, otherwise auto-calculate
                $mappedUnitPrice = parseNumber($row['avg_unit_price'] ?? 0);
                if ($mappedUnitPrice > 0) {
                    $unitPrice = $mappedUnitPrice;
                } else {
                    $unitPrice = ($transactions > 0 && $revenue > 0) ? round($revenue / $transactions) : 0;
                }
                $profitMargin = ($revenue > 0 && $costPrice > 0) ? round((($revenue - $costPrice) / $revenue) * 100, 2) : null;
                // If transactions not set but quantity is, use quantity as transaction proxy
                if ($transactions === 0 && $quantitySold > 0) {
                    $transactions = $quantitySold;
                    if ($mappedUnitPrice <= 0) {
                        $unitPrice = round($revenue / $quantitySold);
                    }
                }

                // Parse new fields
                $discountAmount = parseNumber($row['discount_amount'] ?? 0);
                $taxAmount = parseNumber($row['tax_amount'] ?? 0);
                $shippingCost = parseNumber($row['shipping_cost'] ?? 0);
                $refundAmount = parseNumber($row['refund_amount'] ?? 0);
                $commissionFee = parseNumber($row['commission_fee'] ?? 0);
                $netRevenue = parseNumber($row['net_revenue'] ?? 0);
                $paymentMethod = trim($row['payment_method'] ?? '');
                $orderNumber = trim($row['order_number'] ?? '');
                $skuVal = trim($row['sku'] ?? '');
                $brandVal = trim($row['brand'] ?? '');
                $optionInfo = trim($row['option_info'] ?? '');
                $returnQty = clampCount(parseNumber($row['return_qty'] ?? 0));
                $profitAmount = parseNumber($row['profit_amount'] ?? 0);
                $pointsUsed = parseNumber($row['points_used'] ?? 0);
                $paymentStatus = trim($row['payment_status'] ?? '');
                $customerName = trim($row['customer_name'] ?? '');
                $staffName = trim($row['staff_name'] ?? '');
                $storeName = trim($row['store_name'] ?? '');
                $platformVal = trim($row['platform'] ?? '');
                $supplierVal = trim($row['supplier'] ?? '');
                $regionVal = trim($row['region'] ?? '');
                $venueTypeVal = trim($row['venue_type'] ?? '');
                $satisfactionVal = parseNumber($row['satisfaction'] ?? 0);
                if ($satisfactionVal < 0 || $satisfactionVal > 5)
                    $satisfactionVal = 0;

                // Auto-calculate net_revenue if not mapped
                if ($netRevenue === 0 && $revenue > 0) {
                    $netRevenue = $revenue - $discountAmount - $taxAmount - $commissionFee - $refundAmount;
                }

                // Auto-calculate profit_amount if not mapped
                if ($profitAmount === 0 && $revenue > 0 && $costPrice > 0) {
                    $profitAmount = $revenue - $costPrice;
                }

                try {
                    $stmt->execute([
                        $userId,
                        $countryCode,
                        $recordType,
                        $date,
                        $revenue,
                        $customers,
                        $transactions,
                        $unitPrice,
                        $category,
                        $productName,
                        $quantitySold,
                        $costPrice,
                        $profitMargin,
                        $discountAmount,
                        $taxAmount,
                        $shippingCost,
                        $refundAmount,
                        $commissionFee,
                        $netRevenue,
                        $paymentMethod,
                        $orderNumber,
                        $skuVal,
                        $brandVal,
                        $optionInfo,
                        $returnQty,
                        $profitAmount,
                        $pointsUsed,
                        $paymentStatus,
                        $customerName,
                        $staffName,
                        $storeName,
                        $platformVal,
                        $supplierVal,
                        $currency,
                        'excel',
                        $batchId,
                        $salesChannel ?: $platformVal,
                        $regionVal,
                        $venueTypeVal,
                        $satisfactionVal ?: null,
                        $memo
                    ]);
                    $inserted++;
                } catch (PDOException $e) {
                    // Duplicate or other constraint error — try update instead
                    if ($e->getCode() == 23000) {
                        $skipped++;
                        $errors[] = ['row' => $i + 1, 'error' => 'Duplicate date: ' . $date];
                    } else {
                        $errors[] = ['row' => $i + 1, 'error' => $e->getMessage()];
                        $skipped++;
                    }
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Import complete.",
                "batch_id" => $batchId,
                "inserted" => $inserted,
                "skipped" => $skipped,
                "total" => count($rows),
                "errors" => array_slice($errors, 0, 10), // limit error details
            ]);
            break;

        // ── HISTORY: List import batches ──
        case 'history':
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
            $batches = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "batches" => $batches]);
            break;

        // ── UNDO_BATCH: Delete all records from a batch ──
        case 'undo_batch':
            $batchId = trim($input['batch_id'] ?? '');
            if (empty($batchId)) {
                echo json_encode(["success" => false, "message" => "Batch ID required."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM seller_stats WHERE user_id = ? AND import_batch_id = ?");
            $stmt->execute([$userId, $batchId]);
            $deleted = $stmt->rowCount();
            echo json_encode(["success" => true, "message" => "$deleted records deleted.", "deleted" => $deleted]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}

// ── Helper: Normalize various date formats to YYYY-MM-DD / YYYY-MM / YYYY ──
function normalizeDate($dateStr, $recordType)
{
    $dateStr = trim($dateStr);

    // Remove time portion if present
    if (preg_match('/^(\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2})/', $dateStr, $m)) {
        $dateStr = $m[1];
    }

    // Replace common separators
    $dateStr = str_replace(['/', '.'], '-', $dateStr);

    // Handle Excel serial date numbers
    if (is_numeric($dateStr) && intval($dateStr) > 30000 && intval($dateStr) < 60000) {
        $unixTime = ($dateStr - 25569) * 86400;
        $dateStr = date('Y-m-d', $unixTime);
    }

    // Handle various date formats
    // Korean: 2024년 1월 15일
    if (preg_match('/(\d{4})\s*[년年]\s*(\d{1,2})\s*[월月]\s*(\d{1,2})\s*[일日]/', $dateStr, $m)) {
        $dateStr = sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
    }
    // Japanese: 2024年1月15日
    if (preg_match('/(\d{4})年(\d{1,2})月(\d{1,2})日/', $dateStr, $m)) {
        $dateStr = sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
    }
    // MM/DD/YYYY → YYYY-MM-DD (US format detection)
    if (preg_match('/^(\d{1,2})-(\d{1,2})-(\d{4})$/', $dateStr, $m)) {
        $dateStr = sprintf('%04d-%02d-%02d', $m[3], $m[1], $m[2]);
    }

    // Format based on record type
    if ($recordType === 'daily') {
        if (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $dateStr, $m)) {
            return sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
        }
    } elseif ($recordType === 'monthly') {
        if (preg_match('/^(\d{4})-(\d{1,2})/', $dateStr, $m)) {
            return sprintf('%04d-%02d', $m[1], $m[2]);
        }
    } elseif ($recordType === 'annual') {
        if (preg_match('/^(\d{4})/', $dateStr, $m)) {
            return $m[1];
        }
    }

    return null;
}

// ── Helper: Parse number from various formats ──
function parseNumber($val)
{
    if (is_numeric($val))
        return intval($val);
    // Remove currency symbols, commas, spaces
    $clean = preg_replace('/[^\d.\-]/', '', str_replace(',', '', (string) $val));
    return intval($clean);
}

// Clamp count values to prevent INT overflow (max 2,147,483,647)
function clampCount($val)
{
    $v = intval($val);
    if ($v < 0)
        return 0;
    if ($v > 2000000000)
        return 0; // Likely mismatched column (revenue mapped as count)
    return $v;
}
?>