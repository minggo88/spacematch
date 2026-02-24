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
$conn->exec("CREATE TABLE IF NOT EXISTS distribution_proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    seller_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    proposal_type ENUM('distribution','consignment','wholesale') DEFAULT 'distribution',
    status ENUM('pending','accepted','rejected','cancelled') DEFAULT 'pending',
    vendor_note TEXT,
    seller_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    responded_at DATETIME DEFAULT NULL,
    INDEX idx_vendor (vendor_id),
    INDEX idx_seller (seller_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // ─── 제안 목록 조회 ───
    $status_filter = isset($_GET['status']) ? $_GET['status'] : '';

    if ($role === 'vendor') {
        $sql = "SELECT p.*, u.name as seller_name, u.email as seller_email, u.category as seller_category, u.profile_image as seller_image, u.description as seller_description
                FROM distribution_proposals p
                JOIN users u ON p.seller_id = u.id
                WHERE p.vendor_id = ?";
        $params = [$user_id];
    } elseif ($role === 'seller') {
        $sql = "SELECT p.*, u.name as vendor_name, u.email as vendor_email, u.company_name as vendor_company, u.profile_image as vendor_image, u.description as vendor_description
                FROM distribution_proposals p
                JOIN users u ON p.vendor_id = u.id
                WHERE p.seller_id = ?";
        $params = [$user_id];
    } elseif ($role === 'admin' || $role === 'superadmin') {
        $sql = "SELECT p.*, 
                vendor.name as vendor_name, vendor.email as vendor_email, vendor.company_name as vendor_company,
                seller.name as seller_name, seller.email as seller_email, seller.category as seller_category
                FROM distribution_proposals p
                JOIN users vendor ON p.vendor_id = vendor.id
                JOIN users seller ON p.seller_id = seller.id";
        $params = [];
    } else {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    if ($status_filter && in_array($status_filter, ['pending', 'accepted', 'rejected', 'cancelled'])) {
        $sql .= ($role === 'admin' || $role === 'superadmin') ? " WHERE p.status = ?" : " AND p.status = ?";
        $params[] = $status_filter;
    }

    $sql .= " ORDER BY p.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $proposals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "proposals" => $proposals]);

} elseif ($method === 'POST') {
    // ─── 새 제안 생성 (벤더만) ───
    if ($role !== 'vendor') {
        echo json_encode(["success" => false, "message" => "벤더만 제안을 보낼 수 있습니다."]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!$data || !isset($data->seller_id) || !isset($data->title)) {
        echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
        exit;
    }

    $seller_id = intval($data->seller_id);
    $title = trim($data->title);
    $message = isset($data->message) ? trim($data->message) : '';
    $proposal_type = isset($data->proposal_type) ? $data->proposal_type : 'distribution';
    $vendor_note = isset($data->vendor_note) ? trim($data->vendor_note) : '';

    if (empty($title)) {
        echo json_encode(["success" => false, "message" => "제안 제목을 입력해 주세요."]);
        exit;
    }

    // Verify seller exists
    $checkSeller = $conn->prepare("SELECT id, name FROM users WHERE id = ? AND role = 'seller'");
    $checkSeller->execute([$seller_id]);
    $sellerRow = $checkSeller->fetch();
    if (!$sellerRow) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 셀러입니다."]);
        exit;
    }

    // Check for duplicate pending proposal
    $checkDup = $conn->prepare("SELECT id FROM distribution_proposals WHERE vendor_id = ? AND seller_id = ? AND status = 'pending'");
    $checkDup->execute([$user_id, $seller_id]);
    if ($checkDup->fetch()) {
        echo json_encode(["success" => false, "message" => "이미 대기 중인 제안이 있습니다."]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO distribution_proposals (vendor_id, seller_id, title, message, proposal_type, vendor_note) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $seller_id, $title, $message, $proposal_type, $vendor_note]);

    $proposal_id = $conn->lastInsertId();

    // Send notification to seller
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL, link VARCHAR(500), is_read TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        $vendor_name = $_SESSION['user_name'] ?? '벤더';
        $notifMsg = "{$vendor_name}님이 유통 제안을 보냈습니다: {$title}";
        $notifLink = "/seller/proposals";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'proposal_new', ?, ?, NOW())");
        $notifStmt->execute([$seller_id, $notifMsg, $notifLink]);
    } catch (Exception $e) { /* ignore */
    }

    echo json_encode([
        "success" => true,
        "message" => "유통 제안이 성공적으로 전송되었습니다.",
        "proposal_id" => $proposal_id
    ]);

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>