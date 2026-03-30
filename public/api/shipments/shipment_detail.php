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

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "배송 ID가 필요합니다."]);
    exit;
}

$shipment_id = intval($_GET['id']);

try {
    $sql = "SELECT s.*,
            vendor.name as vendor_name, vendor.company_name as vendor_company, vendor.email as vendor_email, vendor.profile_image as vendor_image,
            seller.name as seller_name, seller.category as seller_category, seller.email as seller_email, seller.profile_image as seller_image,
            p.title as proposal_title, p.proposal_type
            FROM shipments s
            JOIN users vendor ON s.vendor_id = vendor.id
            JOIN users seller ON s.seller_id = seller.id
            LEFT JOIN distribution_proposals p ON s.proposal_id = p.id
            WHERE s.id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$shipment_id]);
    $shipment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$shipment) {
        echo json_encode(["success" => false, "message" => "배송 정보를 찾을 수 없습니다."]);
        exit;
    }

    // Permission check
    $isAdmin = ($role === 'admin' || $role === 'superadmin');
    if (!$isAdmin && $shipment['vendor_id'] != $user_id && $shipment['seller_id'] != $user_id) {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    // Decode items JSON
    $shipment['items'] = json_decode($shipment['items'], true) ?: [];

    echo json_encode(["success" => true, "shipment" => $shipment]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[shipment_detail] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>