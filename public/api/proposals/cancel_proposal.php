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

if (!$data || !isset($data->proposal_id)) {
    echo json_encode(["success" => false, "message" => "필수 항목이 누락되었습니다."]);
    exit;
}

$proposal_id = intval($data->proposal_id);

try {
    // Fetch proposal
    $stmt = $conn->prepare("SELECT * FROM distribution_proposals WHERE id = ?");
    $stmt->execute([$proposal_id]);
    $proposal = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$proposal) {
        echo json_encode(["success" => false, "message" => "제안을 찾을 수 없습니다."]);
        exit;
    }

    // Only vendor who sent it can cancel (or admin)
    if ($role === 'vendor' && $proposal['vendor_id'] != $user_id) {
        echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
        exit;
    }

    if ($role !== 'vendor' && $role !== 'admin' && $role !== 'superadmin') {
        echo json_encode(["success" => false, "message" => "벤더만 제안을 취소할 수 있습니다."]);
        exit;
    }

    if ($proposal['status'] !== 'pending') {
        echo json_encode(["success" => false, "message" => "대기 중인 제안만 취소할 수 있습니다."]);
        exit;
    }

    $updateStmt = $conn->prepare("UPDATE distribution_proposals SET status = 'cancelled', updated_at = NOW() WHERE id = ?");
    $updateStmt->execute([$proposal_id]);

    // Notify seller
    try {
        $vendor_name = $_SESSION['user_name'] ?? '벤더';
        $notifMsg = "{$vendor_name}님이 유통 제안을 취소했습니다: {$proposal['title']}";
        $notifLink = "/seller/proposals";

        $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'proposal_cancelled', ?, ?, NOW())");
        $notifStmt->execute([$proposal['seller_id'], $notifMsg, $notifLink]);

        // [EMAIL] 취소 이메일
        try {
            $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
            $_title = $proposal['title'];
            sendEmailToUser(
                $conn,
                $proposal['seller_id'],
                '',
                '',
                'cat_application',
                function ($lang) use ($_title, $siteUrl) {
                    $subj = _t([
                        'ko' => "❌ 유통 제안 취소: {$_title}",
                        'en' => "❌ Proposal Cancelled: {$_title}",
                        'ja' => "❌ 提案がキャンセル: {$_title}",
                        'vi' => "❌ Đề xuất đã hủy: {$_title}",
                        'th' => "❌ ยกเลิกข้อเสนอ: {$_title}",
                        'fr' => "❌ Proposition annulée: {$_title}",
                        'km' => "❌ ស្នើសុំត្រូវបានលុបចោល: {$_title}",
                        'ru' => "❌ Предложение отменено: {$_title}",
                        'uk' => "❌ Пропозицію скасовано: {$_title}",
                    ], $lang);
                    $body = _t(['ko' => '유통 제안이 취소되었습니다.', 'en' => 'The proposal has been cancelled.', 'ja' => '提案がキャンセルされました。', 'vi' => 'Đề xuất đã bị hủy.', 'th' => 'ข้อเสนอถูกยกเลิกแล้ว', 'fr' => 'La proposition a été annulée.', 'km' => 'ស្នើសុំត្រូវបានលុបចោល។', 'ru' => 'Предложение отменено.', 'uk' => 'Пропозицію скасовано.'], $lang);
                    return ['subject' => $subj, 'html' => "<p>{$body}</p>"];
                }
            );
        } catch (Exception $emailErr) {
            error_log('[cancel_proposal] email: ' . $emailErr->getMessage());
        }
    } catch (Exception $e) { /* ignore */
    }

    echo json_encode([
        "success" => true,
        "message" => "제안이 취소되었습니다."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[cancel_proposal] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>