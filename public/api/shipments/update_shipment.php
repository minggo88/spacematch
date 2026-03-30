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

$data = json_decode(file_get_contents('php://input'));

if (!$data || !isset($data->shipment_id) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$shipment_id = intval($data->shipment_id);
$action = $data->action;

// Valid actions: confirm, ship, deliver, complete, cancel
$valid_actions = ['confirm', 'ship', 'deliver', 'complete', 'cancel'];
if (!in_array($action, $valid_actions)) {
    echo json_encode(["success" => false, "message" => "유효하지 않은 액션입니다."]);
    exit;
}

try {
    // Fetch shipment
    $stmt = $conn->prepare("SELECT * FROM shipments WHERE id = ?");
    $stmt->execute([$shipment_id]);
    $shipment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$shipment) {
        echo json_encode(["success" => false, "message" => "배송 정보를 찾을 수 없습니다."]);
        exit;
    }

    $isAdmin = ($role === 'admin' || $role === 'superadmin');
    $isVendor = ($role === 'vendor' && $shipment['vendor_id'] == $user_id);
    $isSeller = ($role === 'seller' && $shipment['seller_id'] == $user_id);

    // Action permissions & status transitions
    $transitions = [
        'confirm' => ['from' => 'ordered', 'to' => 'confirmed', 'allowed' => ['seller', 'admin']],
        'ship' => ['from' => 'confirmed', 'to' => 'shipping', 'allowed' => ['vendor', 'admin']],
        'deliver' => ['from' => 'shipping', 'to' => 'delivered', 'allowed' => ['seller', 'admin']],
        'complete' => ['from' => 'delivered', 'to' => 'completed', 'allowed' => ['vendor', 'seller', 'admin']],
        'cancel' => ['from' => null, 'to' => 'cancelled', 'allowed' => ['vendor', 'admin']],
    ];

    $rule = $transitions[$action];

    // Check permission
    $hasPermission = $isAdmin;
    if (!$hasPermission) {
        if (in_array('vendor', $rule['allowed']) && $isVendor)
            $hasPermission = true;
        if (in_array('seller', $rule['allowed']) && $isSeller)
            $hasPermission = true;
    }

    if (!$hasPermission) {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    // Check current status
    if ($action === 'cancel') {
        if (!in_array($shipment['status'], ['ordered', 'confirmed', 'shipping'])) {
            echo json_encode(["success" => false, "message" => "이미 완료되었거나 취소된 배송입니다."]);
            exit;
        }
    } else {
        if ($shipment['status'] !== $rule['from']) {
            echo json_encode(["success" => false, "message" => "현재 상태에서는 이 액션을 수행할 수 없습니다. (현재: {$shipment['status']})"]);
            exit;
        }
    }

    // Build update query
    $new_status = $rule['to'];
    $timestamp_col = null;
    switch ($action) {
        case 'confirm':
            $timestamp_col = 'confirmed_at';
            break;
        case 'ship':
            $timestamp_col = 'shipped_at';
            break;
        case 'deliver':
            $timestamp_col = 'delivered_at';
            break;
        case 'complete':
            $timestamp_col = 'completed_at';
            break;
    }

    // Extra fields for ship action
    $tracking_number = isset($data->tracking_number) ? trim($data->tracking_number) : null;
    $courier = isset($data->courier) ? trim($data->courier) : null;
    $memo = isset($data->memo) ? trim($data->memo) : null;

    $sql = "UPDATE shipments SET status = ?";
    $params = [$new_status];

    if ($timestamp_col) {
        $sql .= ", {$timestamp_col} = NOW()";
    }

    if ($action === 'ship' && $tracking_number) {
        $sql .= ", tracking_number = ?, courier = ?";
        $params[] = $tracking_number;
        $params[] = $courier;
    }

    if ($memo) {
        if ($isVendor || ($isAdmin && !$isSeller)) {
            $sql .= ", vendor_memo = ?";
        } else {
            $sql .= ", seller_memo = ?";
        }
        $params[] = $memo;
    }

    $sql .= " WHERE id = ?";
    $params[] = $shipment_id;

    $updateStmt = $conn->prepare($sql);
    $updateStmt->execute($params);

    // Notification
    try {
        $action_labels = [
            'confirm' => '발주를 확인',
            'ship' => '배송을 등록',
            'deliver' => '입고를 확인',
            'complete' => '거래를 완료',
            'cancel' => '배송을 취소'
        ];
        $actor_name = $_SESSION['user_name'] ?? ($isVendor ? '벤더' : '셀러');
        $notifMsg = "{$actor_name}님이 {$action_labels[$action]}했습니다: {$shipment['order_title']}";

        // Notify the other party
        $notify_user_id = $isVendor ? $shipment['seller_id'] : $shipment['vendor_id'];
        $notifLink = $isVendor ? "/seller/shipments" : "/vendor/shipments";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'shipment_update', ?, ?, NOW())");
        $notifStmt->execute([$notify_user_id, $notifMsg, $notifLink]);

        // [EMAIL] 배송 상태 변경 이메일 (다국어)
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_ot = $shipment['order_title'];
            $_act = $action;
            $action_map_en = ['confirm' => 'confirmed', 'ship' => 'shipped', 'deliver' => 'delivered', 'complete' => 'completed', 'cancel' => 'cancelled'];
            sendEmailToUser(
                $conn,
                $notify_user_id,
                '',
                '',
                'cat_application',
                function ($lang) use ($_ot, $_act, $action_map_en, $action_labels, $siteUrl) {
                    $statusTxt = _t(['ko' => $action_labels[$_act], 'en' => $action_map_en[$_act], 'ja' => $action_labels[$_act], 'vi' => $action_map_en[$_act], 'th' => $action_map_en[$_act], 'fr' => $action_map_en[$_act], 'km' => $action_map_en[$_act], 'ru' => $action_map_en[$_act], 'uk' => $action_map_en[$_act]], $lang);
                    $subj = _t([
                        'ko' => "🚚 배송 상태 변경: {$_ot}",
                        'en' => "🚚 Shipment Update: {$_ot}",
                        'ja' => "🚚 配送更新: {$_ot}",
                        'vi' => "🚚 Cập nhật giao hàng: {$_ot}",
                        'th' => "🚚 อัปเดตการจัดส่ง: {$_ot}",
                        'fr' => "🚚 Mise à jour: {$_ot}",
                        'km' => "🚚 ការធ្វើបច្ចុប្បន្នភាព: {$_ot}",
                        'ru' => "🚚 Обновление доставки: {$_ot}",
                        'uk' => "🚚 Оновлення доставки: {$_ot}",
                    ], $lang);
                    $body = _t(['ko' => "배송 상태가 '{$statusTxt}'로 변경되었습니다.", 'en' => "Shipment status changed to '{$statusTxt}'.", 'ja' => "配送状態が'{$statusTxt}'に変更されました。", 'vi' => "Trạng thái đã thay đổi.", 'th' => "สถานะเปลี่ยนแล้ว", 'fr' => "Statut changé.", 'km' => "ស្ថានភាពបានផ្លាស់ប្តូរ។", 'ru' => "Статус изменён.", 'uk' => "Статус змінено."], $lang);
                    return ['subject' => $subj, 'html' => "<p>{$body}</p>"];
                }
            );
        } catch (Exception $emailErr) {
            error_log('[update_shipment] email: ' . $emailErr->getMessage());
        }
    } catch (Exception $e) { /* ignore */
    }

    $messages = [
        'confirm' => '발주를 확인했습니다.',
        'ship' => '배송이 등록되었습니다.',
        'deliver' => '입고가 확인되었습니다.',
        'complete' => '거래가 완료되었습니다.',
        'cancel' => '배송이 취소되었습니다.'
    ];

    echo json_encode([
        "success" => true,
        "message" => $messages[$action],
        "status" => $new_status
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[update_shipment] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>