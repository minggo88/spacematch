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

if (!$data || !isset($data->settlement_id) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$settlement_id = intval($data->settlement_id);
$action = $data->action;

$valid_actions = ['confirm', 'pay', 'dispute'];
if (!in_array($action, $valid_actions)) {
    echo json_encode(["success" => false, "message" => "유효하지 않은 액션입니다."]);
    exit;
}

try {
    // Fetch settlement
    $stmt = $conn->prepare("SELECT * FROM settlements WHERE id = ?");
    $stmt->execute([$settlement_id]);
    $settlement = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$settlement) {
        echo json_encode(["success" => false, "message" => "정산 정보를 찾을 수 없습니다."]);
        exit;
    }

    $isAdmin = ($role === 'admin' || $role === 'superadmin');
    $isVendor = ($role === 'vendor' && $settlement['vendor_id'] == $user_id);
    $isSeller = ($role === 'seller' && $settlement['seller_id'] == $user_id);

    $transitions = [
        'confirm' => ['from' => 'pending', 'to' => 'confirmed', 'allowed' => ['seller', 'admin']],
        'pay' => ['from' => 'confirmed', 'to' => 'paid', 'allowed' => ['vendor', 'admin']],
        'dispute' => ['from' => 'pending', 'to' => 'disputed', 'allowed' => ['seller', 'admin']],
    ];

    $rule = $transitions[$action];

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

    if ($settlement['status'] !== $rule['from']) {
        echo json_encode(["success" => false, "message" => "현재 상태에서는 이 액션을 수행할 수 없습니다."]);
        exit;
    }

    $new_status = $rule['to'];
    $note = isset($data->note) ? trim($data->note) : null;

    $sql = "UPDATE settlements SET status = ?";
    $params = [$new_status];

    if ($action === 'confirm') {
        $sql .= ", confirmed_at = NOW()";
    } elseif ($action === 'pay') {
        $sql .= ", paid_at = NOW()";
    }

    if ($note) {
        if ($isSeller || ($isAdmin && !$isVendor)) {
            $sql .= ", seller_note = ?";
        } else {
            $sql .= ", vendor_note = ?";
        }
        $params[] = $note;
    }

    $sql .= " WHERE id = ?";
    $params[] = $settlement_id;

    $updateStmt = $conn->prepare($sql);
    $updateStmt->execute($params);

    // Notification
    try {
        $action_labels = [
            'confirm' => '정산을 확인',
            'pay' => '지급을 완료',
            'dispute' => '정산에 이의를 제기'
        ];
        $actor_name = $_SESSION['user_name'] ?? ($isVendor ? '벤더' : '셀러');
        $notifMsg = "{$actor_name}님이 {$action_labels[$action]}했습니다.";

        $notify_user_id = $isVendor ? $settlement['seller_id'] : $settlement['vendor_id'];
        $notifLink = $isVendor ? "/seller/settlements" : "/vendor/settlements";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'settlement_update', ?, ?, NOW())");
        $notifStmt->execute([$notify_user_id, $notifMsg, $notifLink]);

        // [EMAIL] 정산 상태 변경 이메일
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_act = $action;
            $action_map_en = ['confirm' => 'confirmed', 'pay' => 'paid', 'dispute' => 'disputed'];
            sendEmailToUser(
                $conn,
                $notify_user_id,
                '',
                '',
                'cat_application',
                function ($lang) use ($_act, $action_labels, $action_map_en, $siteUrl) {
                    $statusTxt = _t(['ko' => $action_labels[$_act], 'en' => $action_map_en[$_act], 'ja' => $action_labels[$_act], 'vi' => $action_map_en[$_act], 'th' => $action_map_en[$_act], 'fr' => $action_map_en[$_act], 'km' => $action_map_en[$_act], 'ru' => $action_map_en[$_act], 'uk' => $action_map_en[$_act]], $lang);
                    $subj = _t(['ko' => "💰 정산 상태 변경", 'en' => "💰 Settlement Update", 'ja' => "💰 精算更新", 'vi' => "💰 Cập nhật", 'th' => "💰 อัปเดต", 'fr' => "💰 Mise à jour", 'km' => "💰 ការធ្វើបច្ចុប្បន្នភាព", 'ru' => "💰 Обновление", 'uk' => "💰 Оновлення"], $lang);
                    $body = _t(['ko' => "정산 상태가 '{$statusTxt}'로 변경되었습니다.", 'en' => "Settlement status: {$statusTxt}.", 'ja' => "精算が{$statusTxt}に変更。", 'vi' => "Trạng thái: {$statusTxt}.", 'th' => "สถานะ: {$statusTxt}", 'fr' => "Statut: {$statusTxt}.", 'km' => "ស្ថានភាព: {$statusTxt}", 'ru' => "Статус: {$statusTxt}.", 'uk' => "Статус: {$statusTxt}."], $lang);
                    return ['subject' => $subj, 'html' => "<p>{$body}</p>"];
                }
            );
        } catch (Exception $emailErr) {
            error_log('[update_settlement] email: ' . $emailErr->getMessage());
        }
    } catch (Exception $e) { /* ignore */
    }

    $messages = [
        'confirm' => '정산을 확인했습니다.',
        'pay' => '지급이 완료되었습니다.',
        'dispute' => '이의가 제기되었습니다.'
    ];

    echo json_encode([
        "success" => true,
        "message" => $messages[$action],
        "status" => $new_status
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[update_settlement] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>