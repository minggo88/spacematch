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

if (!$data || !isset($data->proposal_id) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$proposal_id = intval($data->proposal_id);
$action = $data->action; // 'accept' or 'reject'
$seller_note = isset($data->seller_note) ? trim($data->seller_note) : '';

if (!in_array($action, ['accept', 'reject'])) {
    echo json_encode(["success" => false, "message" => "유효하지 않은 액션입니다."]);
    exit;
}

try {
    // Fetch the proposal
    $stmt = $conn->prepare("SELECT * FROM distribution_proposals WHERE id = ?");
    $stmt->execute([$proposal_id]);
    $proposal = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$proposal) {
        echo json_encode(["success" => false, "message" => "제안을 찾을 수 없습니다."]);
        exit;
    }

    // Only seller can respond (or admin)
    if ($role === 'seller' && $proposal['seller_id'] != $user_id) {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    if ($role !== 'seller' && $role !== 'admin' && $role !== 'superadmin') {
        echo json_encode(["success" => false, "message" => "셀러만 제안에 응답할 수 있습니다."]);
        exit;
    }

    if ($proposal['status'] !== 'pending') {
        echo json_encode(["success" => false, "message" => "이미 처리된 제안입니다."]);
        exit;
    }

    $new_status = ($action === 'accept') ? 'accepted' : 'rejected';

    $updateStmt = $conn->prepare("UPDATE distribution_proposals SET status = ?, seller_note = ?, responded_at = NOW(), updated_at = NOW() WHERE id = ?");
    $updateStmt->execute([$new_status, $seller_note, $proposal_id]);

    // Send notification to vendor
    try {
        $seller_name = $_SESSION['user_name'] ?? '셀러';
        $status_text = ($action === 'accept') ? '수락' : '거절';
        $notifMsg = "{$seller_name}님이 유통 제안을 {$status_text}했습니다: {$proposal['title']}";
        $notifLink = "/vendor/proposals";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'proposal_response', ?, ?, NOW())");
        $notifStmt->execute([$proposal['vendor_id'], $notifMsg, $notifLink]);

        // [EMAIL] 제안 응답 이메일
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_title = $proposal['title'];
            $_st = $action;
            $_sn = $seller_name;
            sendEmailToUser(
                $conn,
                $proposal['vendor_id'],
                '',
                '',
                'cat_application',
                function ($lang) use ($_title, $_st, $_sn, $siteUrl) {
                    if ($_st === 'accept') {
                        $subj = _t(['ko' => "✅ 제안 수락: {$_title}", 'en' => "✅ Proposal Accepted: {$_title}", 'ja' => "✅ 提案承認: {$_title}", 'vi' => "✅ Chấp nhận: {$_title}", 'th' => "✅ ยอมรับ: {$_title}", 'fr' => "✅ Acceptée: {$_title}", 'km' => "✅ ទទួល: {$_title}", 'ru' => "✅ Принято: {$_title}", 'uk' => "✅ Прийнято: {$_title}"], $lang);
                    } else {
                        $subj = _t(['ko' => "❌ 제안 거절: {$_title}", 'en' => "❌ Proposal Rejected: {$_title}", 'ja' => "❌ 提案却下: {$_title}", 'vi' => "❌ Từ chối: {$_title}", 'th' => "❌ ปฏิเสธ: {$_title}", 'fr' => "❌ Rejetée: {$_title}", 'km' => "❌ បដិសេធ: {$_title}", 'ru' => "❌ Отклонено: {$_title}", 'uk' => "❌ Відхилено: {$_title}"], $lang);
                    }
                    $statusText = _t(['ko' => ($_st === 'accept' ? '수락' : '거절'), 'en' => ($_st === 'accept' ? 'accepted' : 'rejected'), 'ja' => ($_st === 'accept' ? '承認' : '却下'), 'vi' => ($_st === 'accept' ? 'chấp nhận' : 'từ chối'), 'th' => ($_st === 'accept' ? 'ยอมรับ' : 'ปฏิเสธ'), 'fr' => ($_st === 'accept' ? 'acceptée' : 'rejetée'), 'km' => ($_st === 'accept' ? 'ទទួល' : 'បដិសេធ'), 'ru' => ($_st === 'accept' ? 'принято' : 'отклонено'), 'uk' => ($_st === 'accept' ? 'прийнято' : 'відхилено')], $lang);
                    $body = _t(['ko' => "{$_sn}님이 제안을 {$statusText}했습니다.", 'en' => "{$_sn} {$statusText} your proposal.", 'ja' => "{$_sn}さんが提案を{$statusText}しました。", 'vi' => "{$_sn} đã {$statusText} đề xuất.", 'th' => "{$_sn} {$statusText}ข้อเสนอ", 'fr' => "{$_sn} a {$statusText} votre proposition.", 'km' => "{$_sn} បាន{$statusText}ស្នើសុំ។", 'ru' => "{$_sn} {$statusText} ваше предложение.", 'uk' => "{$_sn} {$statusText} вашу пропозицію."], $lang);
                    return ['subject' => $subj, 'html' => "<p>{$body}</p>"];
                }
            );
        } catch (Exception $emailErr) {
            error_log('[respond_proposal] email: ' . $emailErr->getMessage());
        }
    } catch (Exception $e) { /* ignore */
    }

    echo json_encode([
        "success" => true,
        "message" => ($action === 'accept') ? "제안을 수락했습니다." : "제안을 거절했습니다.",
        "status" => $new_status
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[respond_proposal] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>