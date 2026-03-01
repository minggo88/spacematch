<?php
/**
 * Seller Stats Upload API (FormData based)
 * 
 * Handles bulk import of sales data using multipart/form-data instead of JSON POST
 * to avoid WAF/ModSecurity blocking.
 * 
 * GET Actions:
 *   - templates   : Return ERP template definitions
 *   - history     : List import batches
 * 
 * POST Actions (via $_POST + $_FILES):
 *   - import      : Bulk insert from uploaded JSON file
 *   - auto_map    : Column auto-mapping
 *   - undo_batch  : Delete import batch
 */

include_once '../db_connect.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
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

@ini_set('max_execution_time', 600);
@ini_set('memory_limit', '1024M');

// Determine action from GET or POST
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// ── COLUMN KEYWORDS (for auto-mapping) ──
$COLUMN_KEYWORDS = [
    'record_date' => ['date', '날짜', '일자', '주문일', '결제일', '발행일', '영업일', '거래일', '日付', '注文日', '日期'],
    'order_number' => ['order id', 'order no', '주문번호', '거래번호', '전표번호', '영수증번호', 'invoice', 'receipt'],
    'transaction_count' => ['transaction', '건수', '주문수', '거래건', 'orders'],
    'product_name' => ['product', 'item', '상품', '품목', 'name', '상품명', '商品', '产品'],
    'sku' => ['sku', 'barcode', '바코드', '상품코드', '품번', 'upc', 'ean'],
    'brand' => ['brand', '브랜드', '제조사', 'manufacturer'],
    'option_info' => ['option', '옵션', '색상', '사이즈', 'variant', 'size', 'color'],
    'best_selling_item' => ['category', '카테고리', '분류', '상품군', 'type'],
    'quantity_sold' => ['quantity', 'qty', '수량', '개수', '판매수량', 'units', 'pcs', '数量', '個数'],
    'return_qty' => ['return qty', '반품수량', '환불수량'],
    'customer_count' => ['customer', '고객', '방문', '고객수', 'buyer'],
    'monthly_revenue' => ['revenue', 'sales', 'amount', '매출', '금액', '결제금액', '판매액', '매출액', '판매금액', '売上', '金額', 'total', '합계'],
    'avg_unit_price' => ['unit price', '단가', '판매단가', 'unitprice'],
    'cost_price' => ['cost', '원가', '매입가', '공급가액', 'cogs', 'expense'],
    'discount_amount' => ['discount', '할인', '할인액', '쿠폰할인', 'coupon'],
    'tax_amount' => ['tax', 'vat', '세금', '부가세', '소비세', 'gst'],
    'shipping_cost' => ['shipping', 'delivery', '배송비', '배송', '택배', 'freight'],
    'refund_amount' => ['refund', '환불', '환불액', '반품금액'],
    'commission_fee' => ['commission', 'fee', '수수료', '플랫폼수수료'],
    'net_revenue' => ['net', '순매출', '순수익', '정산금액', '실수령액'],
    'profit_amount' => ['profit', '이익', '순이익', '마진', 'margin'],
    'points_used' => ['points', '적립금', '포인트', '마일리지'],
    'payment_method' => ['payment method', '결제수단', '결제방법', 'card', '카드', '현금', 'cash'],
    'payment_status' => ['status', '결제상태', '주문상태', 'complete', 'pending'],
    'customer_name' => ['customer name', '고객명', '주문자', '구매자', 'buyer name'],
    'staff_name' => ['staff', 'employee', '판매원', '담당자', '직원', 'cashier'],
    'store_name' => ['store', 'branch', 'shop', '매장', '지점', '판매점', 'outlet'],
    'platform' => ['platform', '플랫폼', 'marketplace'],
    'supplier' => ['supplier', 'vendor', '거래처', '공급업체'],
    'sales_channel' => ['channel', '판매채널', '채널'],
    'region' => ['region', '지역', 'area'],
    'venue_type' => ['venue', '매장유형', '업태', '업종'],
    'satisfaction' => ['rating', 'satisfaction', '만족도', '평점', 'review', 'score'],
    'memo' => ['memo', 'note', '비고', '메모', 'remark', 'comment', '내역'],
];

// ── ERP TEMPLATES ──
$ERP_TEMPLATES = [
    'generic' => [
        'name' => 'Generic / Custom',
        'name_ko' => '범용 / 커스텀',
        'columns' => [
            ['key' => 'record_date', 'label' => 'Date', 'label_ko' => '날짜', 'required' => true],
            ['key' => 'monthly_revenue', 'label' => 'Revenue', 'label_ko' => '매출액', 'required' => true],
            ['key' => 'transaction_count', 'label' => 'Transactions', 'label_ko' => '거래건수', 'required' => false],
            ['key' => 'product_name', 'label' => 'Product', 'label_ko' => '상품명', 'required' => false],
            ['key' => 'quantity_sold', 'label' => 'Qty', 'label_ko' => '수량', 'required' => false],
        ]
    ],
    'naver_smartstore' => [
        'name' => 'Naver Smartstore',
        'name_ko' => '네이버 스마트스토어',
        'auto_map' => ['결제일' => 'record_date', '상품명' => 'product_name', '수량' => 'quantity_sold', '결제금액' => 'monthly_revenue', '상품주문번호' => 'memo', '상품별 총 주문금액' => 'monthly_revenue', '구매자명' => 'customer_count'],
        'columns' => [['key' => 'record_date', 'label' => '결제일', 'required' => true], ['key' => 'product_name', 'label' => '상품명', 'required' => false], ['key' => 'quantity_sold', 'label' => '수량', 'required' => false], ['key' => 'monthly_revenue', 'label' => '결제금액', 'required' => true]]
    ],
    'coupang' => [
        'name' => 'Coupang',
        'name_ko' => '쿠팡',
        'auto_map' => ['주문일' => 'record_date', '결제일' => 'record_date', '노출상품명' => 'product_name', '상품명' => 'product_name', '수량' => 'quantity_sold', '판매가(할인가)' => 'monthly_revenue', '결제액' => 'monthly_revenue', '주문번호' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => '주문일', 'required' => true], ['key' => 'product_name', 'label' => '상품명', 'required' => false], ['key' => 'monthly_revenue', 'label' => '결제액', 'required' => true]]
    ],
    'cafe24' => [
        'name' => 'Cafe24',
        'name_ko' => '카페24',
        'auto_map' => ['주문일시' => 'record_date', '주문일' => 'record_date', '상품명' => 'product_name', '수량' => 'quantity_sold', '주문금액' => 'monthly_revenue', '실결제금액' => 'monthly_revenue', '주문번호' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => '주문일시', 'required' => true], ['key' => 'product_name', 'label' => '상품명', 'required' => false], ['key' => 'monthly_revenue', 'label' => '주문금액', 'required' => true]]
    ],
    'shopify' => [
        'name' => 'Shopify',
        'name_ko' => 'Shopify',
        'auto_map' => ['Created at' => 'record_date', 'Date' => 'record_date', 'Lineitem name' => 'product_name', 'Lineitem quantity' => 'quantity_sold', 'Total' => 'monthly_revenue', 'Subtotal' => 'monthly_revenue', 'Name' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => 'Created at', 'required' => true], ['key' => 'product_name', 'label' => 'Lineitem name', 'required' => false], ['key' => 'monthly_revenue', 'label' => 'Total', 'required' => true]]
    ],
    'amazon' => [
        'name' => 'Amazon',
        'name_ko' => 'Amazon',
        'auto_map' => ['purchase-date' => 'record_date', 'order-date' => 'record_date', 'product-name' => 'product_name', 'quantity-purchased' => 'quantity_sold', 'item-price' => 'monthly_revenue', 'order-id' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => 'purchase-date', 'required' => true], ['key' => 'product_name', 'label' => 'product-name', 'required' => false], ['key' => 'monthly_revenue', 'label' => 'item-price', 'required' => true]]
    ],
    'rakuten' => [
        'name' => 'Rakuten',
        'name_ko' => '라쿠텐',
        'auto_map' => ['注文日時' => 'record_date', '注文日' => 'record_date', '商品名' => 'product_name', '個数' => 'quantity_sold', '合計金額' => 'monthly_revenue', '受注番号' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => '注文日時', 'required' => true], ['key' => 'product_name', 'label' => '商品名', 'required' => false], ['key' => 'monthly_revenue', 'label' => '合計金額', 'required' => true]]
    ],
    'etsy' => [
        'name' => 'Etsy',
        'name_ko' => 'Etsy',
        'auto_map' => ['Sale Date' => 'record_date', 'Date' => 'record_date', 'Item Name' => 'product_name', 'Quantity' => 'quantity_sold', 'Order Value' => 'monthly_revenue', 'Price' => 'monthly_revenue', 'Order ID' => 'memo'],
        'columns' => [['key' => 'record_date', 'label' => 'Sale Date', 'required' => true], ['key' => 'product_name', 'label' => 'Item Name', 'required' => false], ['key' => 'monthly_revenue', 'label' => 'Order Value', 'required' => true]]
    ],
];

$SUPPORTED_CURRENCIES = ['KRW', 'USD', 'EUR', 'JPY', 'CNY', 'GBP', 'THB', 'VND', 'CAD', 'AUD', 'SGD', 'HKD', 'TWD', 'MYR', 'PHP', 'IDR', 'INR', 'BRL', 'MXN', 'CHF'];

try {
    switch ($action) {

        // ══════════════════════════════════
        //  GET: TEMPLATES
        // ══════════════════════════════════
        case 'templates':
            echo json_encode([
                "success" => true,
                "templates" => $ERP_TEMPLATES,
                "currencies" => $SUPPORTED_CURRENCIES,
                "column_keywords" => $COLUMN_KEYWORDS,
            ]);
            break;

        // ══════════════════════════════════
        //  POST: AUTO_MAP (via $_POST)
        // ══════════════════════════════════
        case 'auto_map':
            $headersJson = $_POST['headers'] ?? '';
            $templateKey = $_POST['template'] ?? '';
            $headers = json_decode($headersJson, true) ?: [];

            $mapping = [];

            // Template-based mapping first
            if ($templateKey && isset($ERP_TEMPLATES[$templateKey]['auto_map'])) {
                $autoMap = $ERP_TEMPLATES[$templateKey]['auto_map'];
                foreach ($headers as $idx => $header) {
                    $hc = trim($header);
                    if (isset($autoMap[$hc])) {
                        $mapping[$idx] = $autoMap[$hc];
                    }
                }
            }

            // Keyword-based mapping for remaining
            foreach ($headers as $idx => $header) {
                if (isset($mapping[$idx]))
                    continue;
                $hl = mb_strtolower(trim($header));
                $bestM = null;
                $bestL = 0;
                foreach ($COLUMN_KEYWORDS as $field => $kws) {
                    if (in_array($field, $mapping))
                        continue;
                    foreach ($kws as $kw) {
                        $kwl = mb_strtolower($kw);
                        if (mb_strpos($hl, $kwl) !== false) {
                            $l = mb_strlen($kwl);
                            if ($l > $bestL) {
                                $bestM = $field;
                                $bestL = $l;
                            }
                        }
                    }
                }
                if ($bestM)
                    $mapping[$idx] = $bestM;
            }

            echo json_encode(["success" => true, "mapping" => $mapping]);
            break;

        // ══════════════════════════════════
        //  POST: IMPORT (via $_FILES + $_POST)
        // ══════════════════════════════════
        case 'import':
            // Read data from uploaded file or POST field
            $rawData = null;

            if (isset($_FILES['data_file']) && $_FILES['data_file']['error'] === UPLOAD_ERR_OK) {
                $rawData = file_get_contents($_FILES['data_file']['tmp_name']);
            } elseif (isset($_POST['data'])) {
                $rawData = $_POST['data'];
            }

            if (!$rawData) {
                echo json_encode(["success" => false, "message" => "No data received."]);
                break;
            }

            $input = json_decode($rawData, true);
            if (!$input) {
                echo json_encode(["success" => false, "message" => "Invalid JSON data."]);
                break;
            }

            $rows = $input['rows'] ?? [];
            $currency = trim($input['currency'] ?? $_POST['currency'] ?? 'KRW');
            $recordType = $input['record_type'] ?? $_POST['record_type'] ?? 'daily';
            $salesChannel = trim($input['sales_channel'] ?? $_POST['sales_channel'] ?? '');
            $countryCode = trim($input['country_code'] ?? $_POST['country_code'] ?? 'KR');
            $duplicateMode = trim($input['duplicate_mode'] ?? $_POST['duplicate_mode'] ?? 'overwrite');

            if (empty($rows)) {
                echo json_encode(["success" => false, "message" => "No data rows."]);
                break;
            }
            if (count($rows) > 50000) {
                echo json_encode(["success" => false, "message" => "Max 50000 rows."]);
                break;
            }
            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                $recordType = 'daily';
            }
            if (!in_array($duplicateMode, ['overwrite', 'skip', 'append'])) {
                $duplicateMode = 'overwrite';
            }

            // Auto-migrate columns
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

            // Drop unique keys if exist
            foreach (['uq_user_country_type_date', 'uq_user_type_date'] as $keyName) {
                try {
                    $keys = $conn->query("SHOW INDEX FROM seller_stats WHERE Key_name = '$keyName'")->fetchAll();
                    if (count($keys) > 0) {
                        $conn->exec("ALTER TABLE seller_stats DROP INDEX $keyName");
                    }
                } catch (PDOException $ex) { /* ignore */
                }
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

            // Prepare statements
            $insertStmt = $conn->prepare("INSERT INTO seller_stats
                (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                 avg_unit_price, best_selling_item, product_name, quantity_sold, cost_price, profit_margin,
                 discount_amount, tax_amount, shipping_cost, refund_amount, commission_fee, net_revenue,
                 payment_method, order_number, sku, brand, option_info, return_qty, profit_amount,
                 points_used, payment_status, customer_name, staff_name, store_name, platform, supplier,
                 currency, source, import_batch_id, sales_channel, region, venue_type, satisfaction, memo)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

            // For overwrite/skip: check existing records
            $checkStmt = $conn->prepare("SELECT id FROM seller_stats WHERE user_id = ? AND record_date = ? AND record_type = ? AND country_code = ? AND COALESCE(product_name,'') = ? LIMIT 1");

            $updateStmt = $conn->prepare("UPDATE seller_stats SET
                monthly_revenue=?, customer_count=?, transaction_count=?, avg_unit_price=?,
                best_selling_item=?, product_name=?, quantity_sold=?, cost_price=?, profit_margin=?,
                discount_amount=?, tax_amount=?, shipping_cost=?, refund_amount=?, commission_fee=?, net_revenue=?,
                payment_method=?, order_number=?, sku=?, brand=?, option_info=?, return_qty=?, profit_amount=?,
                points_used=?, payment_status=?, customer_name=?, staff_name=?, store_name=?, platform=?, supplier=?,
                currency=?, source=?, import_batch_id=?, sales_channel=?, region=?, venue_type=?, satisfaction=?, memo=?
                WHERE id = ?");

            $inserted = 0;
            $updated = 0;
            $skipped = 0;
            $errors = [];

            foreach ($rows as $i => $row) {
                $date = trim($row['record_date'] ?? '');
                if (empty($date)) {
                    $skipped++;
                    continue;
                }

                $date = _ul_normDate($date, $recordType);
                if (!$date) {
                    $errors[] = ['row' => $i + 1, 'error' => 'Invalid date'];
                    $skipped++;
                    continue;
                }

                $rev = _ul_pn($row['monthly_revenue'] ?? 0);
                $cust = _ul_cc(_ul_pn($row['customer_count'] ?? 0));
                $txn = _ul_cc(_ul_pn($row['transaction_count'] ?? 0));
                $qty = _ul_cc(_ul_pn($row['quantity_sold'] ?? 0));
                $cp = _ul_pn($row['cost_price'] ?? 0);
                $cat = trim($row['best_selling_item'] ?? '');
                $pn = trim($row['product_name'] ?? '');
                $memo = trim($row['memo'] ?? '');

                $mup = _ul_pn($row['avg_unit_price'] ?? 0);
                $up = ($mup > 0) ? $mup : (($txn > 0 && $rev > 0) ? round($rev / $txn) : 0);
                $pm = ($rev > 0 && $cp > 0) ? round((($rev - $cp) / $rev) * 100, 2) : null;

                if ($txn === 0 && $qty > 0) {
                    $txn = $qty;
                    if ($mup <= 0 && $qty > 0)
                        $up = round($rev / $qty);
                }

                $da = _ul_pn($row['discount_amount'] ?? 0);
                $ta = _ul_pn($row['tax_amount'] ?? 0);
                $sc = _ul_pn($row['shipping_cost'] ?? 0);
                $ra = _ul_pn($row['refund_amount'] ?? 0);
                $cf = _ul_pn($row['commission_fee'] ?? 0);
                $nr = _ul_pn($row['net_revenue'] ?? 0);
                if ($nr === 0 && $rev > 0)
                    $nr = $rev - $da - $ta - $cf - $ra;

                $pamt = _ul_pn($row['profit_amount'] ?? 0);
                if ($pamt === 0 && $rev > 0 && $cp > 0)
                    $pamt = $rev - $cp;

                $pymth = trim($row['payment_method'] ?? '');
                $onum = trim($row['order_number'] ?? '');
                $skuv = trim($row['sku'] ?? '');
                $brv = trim($row['brand'] ?? '');
                $optv = trim($row['option_info'] ?? '');
                $rqty = _ul_cc(_ul_pn($row['return_qty'] ?? 0));
                $pusd = _ul_pn($row['points_used'] ?? 0);
                $pyst = trim($row['payment_status'] ?? '');
                $cnm = trim($row['customer_name'] ?? '');
                $sfn = trim($row['staff_name'] ?? '');
                $stn = trim($row['store_name'] ?? '');
                $plf = trim($row['platform'] ?? '');
                $sup = trim($row['supplier'] ?? '');
                $rgn = trim($row['region'] ?? '');
                $vt = trim($row['venue_type'] ?? '');
                $sat = _ul_pn($row['satisfaction'] ?? 0);
                if ($sat < 0 || $sat > 5)
                    $sat = 0;

                try {
                    $existingId = null;

                    // Check for duplicates (overwrite or skip mode)
                    if ($duplicateMode !== 'append') {
                        $checkStmt->execute([$userId, $date, $recordType, $countryCode, $pn]);
                        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
                        if ($existing) {
                            $existingId = $existing['id'];
                        }
                    }

                    if ($existingId && $duplicateMode === 'skip') {
                        // Skip: duplicate exists, do nothing
                        $skipped++;
                    } elseif ($existingId && $duplicateMode === 'overwrite') {
                        // Overwrite: UPDATE existing record
                        $updateStmt->execute([
                            $rev,
                            $cust,
                            $txn,
                            $up,
                            $cat,
                            $pn,
                            $qty,
                            $cp,
                            $pm,
                            $da,
                            $ta,
                            $sc,
                            $ra,
                            $cf,
                            $nr,
                            $pymth,
                            $onum,
                            $skuv,
                            $brv,
                            $optv,
                            $rqty,
                            $pamt,
                            $pusd,
                            $pyst,
                            $cnm,
                            $sfn,
                            $stn,
                            $plf,
                            $sup,
                            $currency,
                            'excel',
                            $batchId,
                            $salesChannel ?: $plf,
                            $rgn,
                            $vt,
                            $sat ?: null,
                            $memo,
                            $existingId
                        ]);
                        $updated++;
                    } else {
                        // Append or no duplicate: INSERT new record
                        $insertStmt->execute([
                            $userId,
                            $countryCode,
                            $recordType,
                            $date,
                            $rev,
                            $cust,
                            $txn,
                            $up,
                            $cat,
                            $pn,
                            $qty,
                            $cp,
                            $pm,
                            $da,
                            $ta,
                            $sc,
                            $ra,
                            $cf,
                            $nr,
                            $pymth,
                            $onum,
                            $skuv,
                            $brv,
                            $optv,
                            $rqty,
                            $pamt,
                            $pusd,
                            $pyst,
                            $cnm,
                            $sfn,
                            $stn,
                            $plf,
                            $sup,
                            $currency,
                            'excel',
                            $batchId,
                            $salesChannel ?: $plf,
                            $rgn,
                            $vt,
                            $sat ?: null,
                            $memo
                        ]);
                        $inserted++;
                    }
                } catch (PDOException $e) {
                    $skipped++;
                    $errors[] = ['row' => $i + 1, 'error' => $e->getMessage()];
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Import complete.",
                "batch_id" => $batchId,
                "inserted" => $inserted,
                "updated" => $updated,
                "skipped" => $skipped,
                "total" => count($rows),
                "errors" => array_slice($errors, 0, 10)
            ]);
            break;

        // ══════════════════════════════════
        //  GET: HISTORY
        // ══════════════════════════════════
        case 'history':
            $hstmt = $conn->prepare("
                SELECT import_batch_id, source, sales_channel, currency,
                       COUNT(*) as record_count,
                       SUM(monthly_revenue) as total_revenue,
                       MIN(record_date) as date_from,
                       MAX(record_date) as date_to,
                       MIN(created_at) as imported_at
                FROM seller_stats
                WHERE user_id = ? AND import_batch_id IS NOT NULL
                GROUP BY import_batch_id, source, sales_channel, currency
                ORDER BY MIN(created_at) DESC LIMIT 20
            ");
            $hstmt->execute([$userId]);
            echo json_encode(["success" => true, "batches" => $hstmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // ══════════════════════════════════
        //  POST: UNDO_BATCH (via $_POST)
        // ══════════════════════════════════
        case 'undo_batch':
            $batchId = trim($_POST['batch_id'] ?? '');
            if (empty($batchId)) {
                echo json_encode(["success" => false, "message" => "Batch ID required."]);
                break;
            }
            $ustmt = $conn->prepare("DELETE FROM seller_stats WHERE user_id = ? AND import_batch_id = ?");
            $ustmt->execute([$userId, $batchId]);
            $deleted = $ustmt->rowCount();
            echo json_encode(["success" => true, "message" => "$deleted records deleted.", "deleted" => $deleted]);
            break;

        // ══════════════════════════════════
        //  POST: BULK_UNDO_BATCHES (via $_POST)
        // ══════════════════════════════════
        case 'bulk_undo_batches':
            $batchIdsRaw = trim($_POST['batch_ids'] ?? '');
            if (empty($batchIdsRaw)) {
                echo json_encode(["success" => false, "message" => "Batch IDs required."]);
                break;
            }
            $batchIds = array_filter(array_map('trim', explode(',', $batchIdsRaw)));
            if (count($batchIds) === 0) {
                echo json_encode(["success" => false, "message" => "No valid batch IDs."]);
                break;
            }
            $placeholders = implode(',', array_fill(0, count($batchIds), '?'));
            $params = $batchIds;
            array_unshift($params, $userId);
            $ustmt = $conn->prepare("DELETE FROM seller_stats WHERE user_id = ? AND import_batch_id IN ($placeholders)");
            $ustmt->execute($params);
            $deleted = $ustmt->rowCount();
            echo json_encode(["success" => true, "message" => "{$deleted}개 데이터가 삭제되었습니다.", "deleted" => $deleted]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}

// ── Helper functions (prefixed to avoid conflicts) ──
function _ul_normDate($ds, $rt)
{
    $ds = trim($ds);
    if (preg_match('/^(\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2})/', $ds, $m))
        $ds = $m[1];
    $ds = str_replace(['/', '.'], '-', $ds);
    if (is_numeric($ds) && intval($ds) > 30000 && intval($ds) < 60000) {
        $ds = date('Y-m-d', ($ds - 25569) * 86400);
    }
    if (preg_match('/(\d{4})\s*[년年]\s*(\d{1,2})\s*[월月]\s*(\d{1,2})\s*[일日]/', $ds, $m))
        $ds = sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
    if (preg_match('/^(\d{1,2})-(\d{1,2})-(\d{4})$/', $ds, $m))
        $ds = sprintf('%04d-%02d-%02d', $m[3], $m[1], $m[2]);
    if ($rt === 'daily' && preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $ds, $m))
        return sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
    if ($rt === 'monthly' && preg_match('/^(\d{4})-(\d{1,2})/', $ds, $m))
        return sprintf('%04d-%02d', $m[1], $m[2]);
    if ($rt === 'annual' && preg_match('/^(\d{4})/', $ds, $m))
        return $m[1];
    return null;
}

function _ul_pn($v)
{
    if (is_numeric($v))
        return intval($v);
    return intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', (string) $v)));
}

function _ul_cc($v)
{
    $v = intval($v);
    return ($v < 0 || $v > 2000000000) ? 0 : $v;
}
?>