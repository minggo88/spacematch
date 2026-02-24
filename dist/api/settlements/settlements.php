<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'];

// Auto-create table
$conn->exec("CREATE TABLE IF NOT EXISTS settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    vendor_id INT NOT NULL,
    seller_id INT NOT NULL,
    amount DECIMAL(12,0) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    commission_amount DECIMAL(12,0) DEFAULT 0,
    net_amount DECIMAL(12,0) DEFAULT 0,
    status ENUM('pending','confirmed','paid','disputed') DEFAULT 'pending',
    vendor_note TEXT,
    seller_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    paid_at DATETIME,
    INDEX idx_vendor (vendor_id),
    INDEX idx_seller (seller_id),
    INDEX idx_shipment (shipment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // ─── 정산 내역 + 통계 조회 ───
    $status_filter = isset($_GET['status']) ? $_GET['status'] : '';

    if ($role === 'vendor') {
        $sql = "SELECT st.*, u.name as seller_name, u.category as seller_category,
                sh.order_title as shipment_title
                FROM settlements st
                JOIN users u ON st.seller_id = u.id
                LEFT JOIN shipments sh ON st.shipment_id = sh.id
                WHERE st.vendor_id = ?";
        $params = [$user_id];

        // Stats
        $statsSql = "SELECT
            COALESCE(SUM(amount), 0) as total_amount,
            COALESCE(SUM(commission_amount), 0) as total_commission,
            COALESCE(SUM(net_amount), 0) as total_net,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
            COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) as confirmed_amount,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount,
            COUNT(*) as total_count,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count
            FROM settlements WHERE vendor_id = ?";
        $statsStmt = $conn->prepare($statsSql);
        $statsStmt->execute([$user_id]);

    } elseif ($role === 'seller') {
        $sql = "SELECT st.*, u.name as vendor_name, u.company_name as vendor_company,
                sh.order_title as shipment_title
                FROM settlements st
                JOIN users u ON st.vendor_id = u.id
                LEFT JOIN shipments sh ON st.shipment_id = sh.id
                WHERE st.seller_id = ?";
        $params = [$user_id];

        $statsSql = "SELECT
            COALESCE(SUM(amount), 0) as total_amount,
            COALESCE(SUM(commission_amount), 0) as total_commission,
            COALESCE(SUM(net_amount), 0) as total_net,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END), 0) as pending_amount,
            COALESCE(SUM(CASE WHEN status = 'confirmed' THEN net_amount ELSE 0 END), 0) as confirmed_amount,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN net_amount ELSE 0 END), 0) as paid_amount,
            COUNT(*) as total_count,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count
            FROM settlements WHERE seller_id = ?";
        $statsStmt = $conn->prepare($statsSql);
        $statsStmt->execute([$user_id]);

    } elseif ($role === 'admin' || $role === 'superadmin') {
        $sql = "SELECT st.*,
                vendor.name as vendor_name, vendor.company_name as vendor_company,
                seller.name as seller_name, seller.category as seller_category,
                sh.order_title as shipment_title
                FROM settlements st
                JOIN users vendor ON st.vendor_id = vendor.id
                JOIN users seller ON st.seller_id = seller.id
                LEFT JOIN shipments sh ON st.shipment_id = sh.id";
        $params = [];

        $statsSql = "SELECT
            COALESCE(SUM(amount), 0) as total_amount,
            COALESCE(SUM(commission_amount), 0) as total_commission,
            COALESCE(SUM(net_amount), 0) as total_net,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
            COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) as confirmed_amount,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount,
            COUNT(*) as total_count,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count
            FROM settlements";
        $statsStmt = $conn->prepare($statsSql);
        $statsStmt->execute([]);
    } else {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    $valid_statuses = ['pending', 'confirmed', 'paid', 'disputed'];
    if ($status_filter && in_array($status_filter, $valid_statuses)) {
        $sql .= ($role === 'admin' || $role === 'superadmin') ? " WHERE st.status = ?" : " AND st.status = ?";
        $params[] = $status_filter;
    }

    $sql .= " ORDER BY st.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $settlements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "settlements" => $settlements,
        "stats" => $stats
    ]);

} elseif ($method === 'POST') {
    // ─── 정산 생성 (벤더만) ───
    if ($role !== 'vendor') {
        echo json_encode(["success" => false, "message" => "벤더만 정산을 생성할 수 있습니다."]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!$data || !isset($data->shipment_id)) {
        echo json_encode(["success" => false, "message" => "배송 ID가 필요합니다."]);
        exit;
    }

    $shipment_id = intval($data->shipment_id);
    $commission_rate = isset($data->commission_rate) ? floatval($data->commission_rate) : 0;
    $vendor_note = isset($data->vendor_note) ? trim($data->vendor_note) : '';

    // Verify shipment exists and is completed
    $checkShipment = $conn->prepare("SELECT * FROM shipments WHERE id = ? AND vendor_id = ? AND status = 'completed'");
    $checkShipment->execute([$shipment_id, $user_id]);
    $shipment = $checkShipment->fetch();
    if (!$shipment) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 배송이거나 완료되지 않은 배송입니다."]);
        exit;
    }

    // Check duplicate
    $dupCheck = $conn->prepare("SELECT id FROM settlements WHERE shipment_id = ?");
    $dupCheck->execute([$shipment_id]);
    if ($dupCheck->fetch()) {
        echo json_encode(["success" => false, "message" => "이미 정산이 생성된 배송입니다."]);
        exit;
    }

    $amount = intval($shipment['total_amount']);
    $commission_amount = intval(round($amount * $commission_rate / 100));
    $net_amount = $amount - $commission_amount;

    $stmt = $conn->prepare("INSERT INTO settlements (shipment_id, vendor_id, seller_id, amount, commission_rate, commission_amount, net_amount, vendor_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $shipment_id,
        $user_id,
        $shipment['seller_id'],
        $amount,
        $commission_rate,
        $commission_amount,
        $net_amount,
        $vendor_note
    ]);

    $settlement_id = $conn->lastInsertId();

    // Notify seller
    try {
        $vendor_name = $_SESSION['user_name'] ?? '벤더';
        $notifMsg = "{$vendor_name}님이 정산을 등록했습니다 (" . number_format($net_amount) . "원)";
        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'settlement_new', ?, '/seller/settlements', NOW())");
        $notifStmt->execute([$shipment['seller_id'], $notifMsg]);
    } catch (Exception $e) { /* ignore */
    }

    echo json_encode([
        "success" => true,
        "message" => "정산이 등록되었습니다.",
        "settlement_id" => $settlement_id
    ]);

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>