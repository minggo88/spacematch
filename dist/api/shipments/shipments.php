<?php
include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'];

// Auto-create table (once per session)
if (empty($_SESSION['_ddl_shipments'])) {
    $conn->exec("CREATE TABLE IF NOT EXISTS shipments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_id INT NOT NULL,
        vendor_id INT NOT NULL,
        seller_id INT NOT NULL,
        order_title VARCHAR(255) NOT NULL,
        items TEXT,
        total_amount DECIMAL(12,0) DEFAULT 0,
        status ENUM('ordered','confirmed','shipping','delivered','completed','cancelled') DEFAULT 'ordered',
        tracking_number VARCHAR(100),
        courier VARCHAR(100),
        vendor_memo TEXT,
        seller_memo TEXT,
        ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        confirmed_at DATETIME,
        shipped_at DATETIME,
        delivered_at DATETIME,
        completed_at DATETIME,
        INDEX idx_vendor (vendor_id),
        INDEX idx_seller (seller_id),
        INDEX idx_proposal (proposal_id),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $_SESSION['_ddl_shipments'] = true;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // ─── 배송 목록 조회 ───
    $status_filter = isset($_GET['status']) ? $_GET['status'] : '';

    if ($role === 'vendor') {
        $sql = "SELECT s.*, u.name as seller_name, u.category as seller_category, u.profile_image as seller_image
                FROM shipments s
                JOIN users u ON s.seller_id = u.id
                WHERE s.vendor_id = ?";
        $params = [$user_id];
    } elseif ($role === 'seller') {
        $sql = "SELECT s.*, u.name as vendor_name, u.company_name as vendor_company, u.profile_image as vendor_image
                FROM shipments s
                JOIN users u ON s.vendor_id = u.id
                WHERE s.seller_id = ?";
        $params = [$user_id];
    } elseif ($role === 'admin' || $role === 'superadmin') {
        $sql = "SELECT s.*,
                vendor.name as vendor_name, vendor.company_name as vendor_company,
                seller.name as seller_name, seller.category as seller_category
                FROM shipments s
                JOIN users vendor ON s.vendor_id = vendor.id
                JOIN users seller ON s.seller_id = seller.id";
        $params = [];
    } else {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    $valid_statuses = ['ordered', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled'];
    if ($status_filter && in_array($status_filter, $valid_statuses)) {
        $sql .= ($role === 'admin' || $role === 'superadmin') ? " WHERE s.status = ?" : " AND s.status = ?";
        $params[] = $status_filter;
    }

    $sql .= " ORDER BY s.ordered_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $shipments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode items JSON
    foreach ($shipments as &$ship) {
        $ship['items'] = json_decode($ship['items'], true) ?: [];
    }

    echo json_encode(["success" => true, "shipments" => $shipments]);

} elseif ($method === 'POST') {
    // ─── 새 발주 생성 (벤더만) ───
    if ($role !== 'vendor') {
        echo json_encode(["success" => false, "message" => "벤더만 발주를 생성할 수 있습니다."]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!$data || !isset($data->proposal_id) || !isset($data->order_title) || !isset($data->items)) {
        echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
        exit;
    }

    $proposal_id = intval($data->proposal_id);
    $order_title = trim($data->order_title);
    $items = $data->items; // array of {name, quantity, unit_price}
    $vendor_memo = isset($data->vendor_memo) ? trim($data->vendor_memo) : '';

    if (empty($order_title)) {
        echo json_encode(["success" => false, "message" => "발주 제목을 입력해 주세요."]);
        exit;
    }

    // Verify proposal exists and is accepted
    $checkProposal = $conn->prepare("SELECT * FROM distribution_proposals WHERE id = ? AND vendor_id = ? AND status = 'accepted'");
    $checkProposal->execute([$proposal_id, $user_id]);
    $proposal = $checkProposal->fetch();
    if (!$proposal) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 제안이거나 수락되지 않은 제안입니다."]);
        exit;
    }

    $seller_id = $proposal['seller_id'];

    // Calculate total
    $total_amount = 0;
    $items_clean = [];
    if (is_array($items)) {
        foreach ($items as $item) {
            $qty = isset($item->quantity) ? intval($item->quantity) : 0;
            $price = isset($item->unit_price) ? intval($item->unit_price) : 0;
            $items_clean[] = [
                'name' => trim($item->name ?? ''),
                'quantity' => $qty,
                'unit_price' => $price
            ];
            $total_amount += $qty * $price;
        }
    }

    $items_json = json_encode($items_clean, JSON_UNESCAPED_UNICODE);

    $stmt = $conn->prepare("INSERT INTO shipments (proposal_id, vendor_id, seller_id, order_title, items, total_amount, vendor_memo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$proposal_id, $user_id, $seller_id, $order_title, $items_json, $total_amount, $vendor_memo]);

    $shipment_id = $conn->lastInsertId();

    // Notify seller
    try {
        $vendor_name = $_SESSION['user_name'] ?? '벤더';
        $notifMsg = "{$vendor_name}님이 새 발주를 등록했습니다: {$order_title}";
        $notifLink = "/seller/shipments";
        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'shipment_new', ?, ?, NOW())");
        $notifStmt->execute([$seller_id, $notifMsg, $notifLink]);

        // [EMAIL] 발주 이메일 (다국어)
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_ot = $order_title;
            $_vn = $vendor_name;
            sendEmailToUser(
                $conn,
                $seller_id,
                '',
                '',
                'cat_application',
                function ($lang) use ($_ot, $_vn, $siteUrl) {
                    $subj = _t([
                        'ko' => "📦 새 발주: {$_ot}",
                        'en' => "📦 New Order: {$_ot}",
                        'ja' => "📦 新規発注: {$_ot}",
                        'vi' => "📦 Đơn mới: {$_ot}",
                        'th' => "📦 คำสั่งซื้อใหม่: {$_ot}",
                        'fr' => "📦 Nouvelle commande: {$_ot}",
                        'km' => "📦 ការបញ្ជាទិញថ្មី: {$_ot}",
                        'ru' => "📦 Новый заказ: {$_ot}",
                        'uk' => "📦 Нове замовлення: {$_ot}",
                    ], $lang);
                    $body = _t(['ko' => "{$_vn}님이 발주를 등록했습니다.", 'en' => "{$_vn} placed a new order.", 'ja' => "{$_vn}さんが発注しました。", 'vi' => "{$_vn} đã đặt đơn.", 'th' => "{$_vn} สั่งซื้อ", 'fr' => "{$_vn} a passé commande.", 'km' => "{$_vn} បានបញ្ជាទិញ។", 'ru' => "{$_vn} сделал заказ.", 'uk' => "{$_vn} зробив замовлення."], $lang);
                    return ['subject' => $subj, 'html' => "<p>{$body}</p>"];
                }
            );
        } catch (Exception $emailErr) {
            error_log('[shipments] email: ' . $emailErr->getMessage());
        }
    } catch (Exception $e) { /* ignore */
    }

    echo json_encode([
        "success" => true,
        "message" => "발주가 성공적으로 등록되었습니다.",
        "shipment_id" => $shipment_id
    ]);

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>