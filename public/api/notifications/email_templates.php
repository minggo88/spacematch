<?php
/**
 * SpaceMatch 이메일 알림 HTML 템플릿 (다국어 지원)
 * 
 * 사용법:
 *   include_once __DIR__ . '/email_templates.php';
 *   $html = emailTemplateApplicationNew($sellerName, $venueName, false, '', 'en');
 * 
 * 지원 언어: ko, en, ja, vi, th, fr, km, ru, uk
 */

/**
 * 국가 코드 → 언어 코드 변환 (PHP 버전)
 */
function _countryToLang($country)
{
    if (!$country)
        return 'ko';
    $map = [
        'ko' => 'ko',
        'en' => 'en',
        'en-GB' => 'en',
        'en-CA' => 'en',
        'vi' => 'vi',
        'ja' => 'ja',
        'th' => 'th',
        'km' => 'km',
        'ru' => 'ru',
        'uk' => 'uk',
        'fr-CA' => 'fr',
        'fr' => 'fr',
    ];
    return $map[$country] ?? $map[substr($country, 0, 2)] ?? 'ko';
}

/**
 * 다국어 텍스트 선택 헬퍼
 */
function _t($translations, $lang)
{
    return $translations[$lang] ?? $translations['en'] ?? $translations['ko'];
}

/**
 * 기본 이메일 레이아웃 래퍼
 */
function emailBaseTemplate($title, $bodyContent, $ctaUrl = null, $ctaText = null, $lang = 'ko')
{
    $footer = _t([
        'ko' => "이 이메일은 SpaceMatch에서 발송되었습니다.<br>알림 설정을 변경하려면 앱 내 알림 설정을 이용하세요.",
        'en' => "This email was sent by SpaceMatch.<br>To change notification settings, please use in-app settings.",
        'ja' => "このメールはSpaceMatchから送信されました。<br>通知設定はアプリ内の設定から変更できます。",
        'vi' => "Email này được gửi từ SpaceMatch.<br>Để thay đổi cài đặt thông báo, vui lòng sử dụng cài đặt trong ứng dụng.",
        'th' => "อีเมลนี้ส่งจาก SpaceMatch<br>หากต้องการเปลี่ยนการตั้งค่าแจ้งเตือน กรุณาใช้การตั้งค่าในแอป",
        'fr' => "Cet email a été envoyé par SpaceMatch.<br>Pour modifier les paramètres de notification, utilisez les paramètres de l'application.",
        'km' => "អ៊ីមែលនេះត្រូវបានផ្ញើដោយ SpaceMatch។<br>ដើម្បីផ្លាស់ប្តូរការកំណត់ការជូនដំណឹង សូមប្រើការកំណត់ក្នុងកម្មវិធី។",
        'ru' => "Это письмо отправлено SpaceMatch.<br>Чтобы изменить настройки уведомлений, используйте настройки в приложении.",
        'uk' => "Цей лист надіслано SpaceMatch.<br>Щоб змінити налаштування сповіщень, скористайтеся налаштуваннями в додатку.",
    ], $lang);

    $ctaHtml = '';
    if ($ctaUrl && $ctaText) {
        $ctaHtml = "
        <tr>
            <td align='center' style='padding: 24px 40px;'>
                <a href='{$ctaUrl}' style='display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;'>
                    {$ctaText}
                </a>
            </td>
        </tr>";
    }

    return "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{$title}</title>
</head>
<body style='margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;'>
    <table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='background-color: #f5f5f7; padding: 40px 0;'>
        <tr>
            <td align='center'>
                <table role='presentation' width='600' cellspacing='0' cellpadding='0' style='max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);'>
                    <!-- Header -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); padding: 28px 40px; text-align: center;'>
                            <h1 style='margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;'><img src='https://spacematch.net/favicon.png' alt='SM' style='height:32px; width:32px; vertical-align:middle; margin-right:8px; border-radius:6px;'>SpaceMatch</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style='padding: 32px 40px;'>
                            <h2 style='margin: 0 0 16px 0; color: #1a1a2e; font-size: 20px; font-weight: 700;'>{$title}</h2>
                            <div style='color: #555555; font-size: 15px; line-height: 1.7;'>
                                {$bodyContent}
                            </div>
                        </td>
                    </tr>
                    {$ctaHtml}
                    <!-- Footer -->
                    <tr>
                        <td style='padding: 24px 40px; border-top: 1px solid rgba(0,0,0,0.08); text-align: center;'>
                            <p style='margin: 0; color: #999999; font-size: 12px;'>
                                {$footer}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
}

/**
 * 새 입점 신청 알림 (Vendor/Admin용)
 */
function emailTemplateApplicationNew($sellerName, $venueName, $isPriority = false, $siteUrl = '', $lang = 'ko')
{
    $prefix = $isPriority ? '⚡ ' : '';
    $t = _t([
        'ko' => ['title' => '새 입점 신청이 접수되었습니다', 'body' => "님이 <strong>{$venueName}</strong>에 입점을 신청했습니다.", 'note' => '📋 신청서를 확인하고 승인/반려 처리해 주세요.', 'cta' => '신청 확인하기'],
        'en' => ['title' => 'New Application Received', 'body' => " has applied to <strong>{$venueName}</strong>.", 'note' => '📋 Please review and approve/reject the application.', 'cta' => 'View Application'],
        'ja' => ['title' => '新規入店申請が届きました', 'body' => "さんが<strong>{$venueName}</strong>に入店を申請しました。", 'note' => '📋 申請書を確認し、承認/却下してください。', 'cta' => '申請を確認する'],
        'vi' => ['title' => 'Đã nhận đơn đăng ký mới', 'body' => " đã đăng ký vào <strong>{$venueName}</strong>.", 'note' => '📋 Vui lòng xem xét và phê duyệt/từ chối đơn.', 'cta' => 'Xem đơn đăng ký'],
        'th' => ['title' => 'ได้รับใบสมัครใหม่', 'body' => " สมัครเข้า <strong>{$venueName}</strong>", 'note' => '📋 กรุณาตรวจสอบและอนุมัติ/ปฏิเสธใบสมัคร', 'cta' => 'ดูใบสมัคร'],
        'fr' => ['title' => 'Nouvelle candidature reçue', 'body' => " a postulé pour <strong>{$venueName}</strong>.", 'note' => '📋 Veuillez examiner et approuver/rejeter la candidature.', 'cta' => 'Voir la candidature'],
        'km' => ['title' => 'បានទទួលការស្នើសុំថ្មី', 'body' => " បានស្នើសុំទៅ <strong>{$venueName}</strong>។", 'note' => '📋 សូមពិនិត្យ និងអនុម័ត/បដិសេធ។', 'cta' => 'មើលការស្នើសុំ'],
        'ru' => ['title' => 'Получена новая заявка', 'body' => " подал(а) заявку на <strong>{$venueName}</strong>.", 'note' => '📋 Просмотрите и одобрите/отклоните заявку.', 'cta' => 'Посмотреть заявку'],
        'uk' => ['title' => 'Отримано нову заявку', 'body' => " подав(ла) заявку на <strong>{$venueName}</strong>.", 'note' => '📋 Перегляньте та затвердіть/відхиліть заявку.', 'cta' => 'Переглянути заявку'],
    ], $lang);

    $title = $prefix . $t['title'];
    $body = "
        <p style='color: #333333;'><strong>{$sellerName}</strong>{$t['body']}</p>
        <div style='background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #818cf8; font-size: 14px;'>{$t['note']}</p>
        </div>
    ";
    return emailBaseTemplate($title, $body, $siteUrl . '/admin/applications', $t['cta'], $lang);
}

/**
 * 입점 승인 알림 (Seller용)
 */
function emailTemplateApplicationApproved($venueName, $siteUrl = '', $lang = 'ko')
{
    $t = _t([
        'ko' => ['title' => '✅ 입점 신청이 승인되었습니다!', 'body' => "축하합니다! <strong>{$venueName}</strong> 입점 신청이 승인되었습니다.", 'note' => '🎉 지금 바로 공간을 확인해 보세요!', 'cta' => '신청 현황 확인'],
        'en' => ['title' => '✅ Your Application Has Been Approved!', 'body' => "Congratulations! Your application for <strong>{$venueName}</strong> has been approved.", 'note' => '🎉 Check out the venue now!', 'cta' => 'View Status'],
        'ja' => ['title' => '✅ 入店申請が承認されました！', 'body' => "おめでとうございます！<strong>{$venueName}</strong>の入店申請が承認されました。", 'note' => '🎉 今すぐスペースを確認しましょう！', 'cta' => '申請状況を確認'],
        'vi' => ['title' => '✅ Đơn đăng ký đã được phê duyệt!', 'body' => "Chúc mừng! Đơn đăng ký cho <strong>{$venueName}</strong> đã được phê duyệt.", 'note' => '🎉 Hãy kiểm tra không gian ngay!', 'cta' => 'Xem trạng thái'],
        'th' => ['title' => '✅ ใบสมัครได้รับการอนุมัติแล้ว!', 'body' => "ยินดีด้วย! ใบสมัครสำหรับ <strong>{$venueName}</strong> ได้รับการอนุมัติแล้ว", 'note' => '🎉 ตรวจสอบพื้นที่ตอนนี้เลย!', 'cta' => 'ดูสถานะ'],
        'fr' => ['title' => '✅ Votre candidature a été approuvée!', 'body' => "Félicitations! Votre candidature pour <strong>{$venueName}</strong> a été approuvée.", 'note' => '🎉 Découvrez l\'espace maintenant!', 'cta' => 'Voir le statut'],
        'km' => ['title' => '✅ ការស្នើសុំត្រូវបានអនុម័ត!', 'body' => "សូមអបអរសើរ! ការស្នើសុំសម្រាប់ <strong>{$venueName}</strong> ត្រូវបានអនុម័ត។", 'note' => '🎉 សូមពិនិត្យក្នុងឥឡូវនេះ!', 'cta' => 'មើលស្ថានភាព'],
        'ru' => ['title' => '✅ Ваша заявка одобрена!', 'body' => "Поздравляем! Ваша заявка на <strong>{$venueName}</strong> одобрена.", 'note' => '🎉 Посмотрите пространство прямо сейчас!', 'cta' => 'Посмотреть статус'],
        'uk' => ['title' => '✅ Вашу заявку затверджено!', 'body' => "Вітаємо! Вашу заявку на <strong>{$venueName}</strong> затверджено.", 'note' => '🎉 Перегляньте простір зараз!', 'cta' => 'Переглянути статус'],
    ], $lang);

    $body = "
        <p style='color: #333333;'>{$t['body']}</p>
        <div style='background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #34d399; font-size: 14px;'>{$t['note']}</p>
        </div>
    ";
    return emailBaseTemplate($t['title'], $body, $siteUrl . '/seller/applications', $t['cta'], $lang);
}

/**
 * 입점 반려 알림 (Seller용)
 */
function emailTemplateApplicationRejected($venueName, $reason = '', $siteUrl = '', $lang = 'ko')
{
    $t = _t([
        'ko' => ['title' => '❌ 입점 신청이 반려되었습니다', 'body' => "<strong>{$venueName}</strong> 입점 신청이 반려되었습니다.", 'reason_label' => '거절 사유:', 'retry' => '수정 후 다시 신청할 수 있습니다.', 'cta' => '신청 현황 확인'],
        'en' => ['title' => '❌ Your Application Has Been Rejected', 'body' => "Your application for <strong>{$venueName}</strong> has been rejected.", 'reason_label' => 'Reason:', 'retry' => 'You can reapply after making changes.', 'cta' => 'View Status'],
        'ja' => ['title' => '❌ 入店申請が却下されました', 'body' => "<strong>{$venueName}</strong>の入店申請が却下されました。", 'reason_label' => '却下理由:', 'retry' => '修正後に再申請できます。', 'cta' => '申請状況を確認'],
        'vi' => ['title' => '❌ Đơn đăng ký bị từ chối', 'body' => "Đơn đăng ký cho <strong>{$venueName}</strong> đã bị từ chối.", 'reason_label' => 'Lý do:', 'retry' => 'Bạn có thể nộp lại sau khi chỉnh sửa.', 'cta' => 'Xem trạng thái'],
        'th' => ['title' => '❌ ใบสมัครถูกปฏิเสธ', 'body' => "ใบสมัครสำหรับ <strong>{$venueName}</strong> ถูกปฏิเสธ", 'reason_label' => 'เหตุผล:', 'retry' => 'คุณสามารถสมัครใหม่ได้หลังแก้ไข', 'cta' => 'ดูสถานะ'],
        'fr' => ['title' => '❌ Votre candidature a été rejetée', 'body' => "Votre candidature pour <strong>{$venueName}</strong> a été rejetée.", 'reason_label' => 'Raison:', 'retry' => 'Vous pouvez soumettre à nouveau après modification.', 'cta' => 'Voir le statut'],
        'km' => ['title' => '❌ ការស្នើសុំត្រូវបានបដិសេធ', 'body' => "ការស្នើសុំសម្រាប់ <strong>{$venueName}</strong> ត្រូវបានបដិសេធ។", 'reason_label' => 'មូលហេតុ:', 'retry' => 'អ្ន កអា ចស្នើសុំម្តង ទៀតប្រើការ កែសម្រួល។', 'cta' => 'មើលស្ថានភាព'],
        'ru' => ['title' => '❌ Ваша заявка отклонена', 'body' => "Ваша заявка на <strong>{$venueName}</strong> отклонена.", 'reason_label' => 'Причина:', 'retry' => 'Вы можете подать повторно после исправления.', 'cta' => 'Посмотреть статус'],
        'uk' => ['title' => '❌ Вашу заявку відхилено', 'body' => "Вашу заявку на <strong>{$venueName}</strong> відхилено.", 'reason_label' => 'Причина:', 'retry' => 'Ви можете подати повторно після виправлення.', 'cta' => 'Переглянути статус'],
    ], $lang);

    $reasonHtml = '';
    if (!empty($reason)) {
        $reasonHtml = "
        <div style='background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0 0 4px 0; color: #f87171; font-size: 13px; font-weight: 600;'>{$t['reason_label']}</p>
            <p style='margin: 0; color: #fca5a5; font-size: 14px;'>{$reason}</p>
        </div>";
    }
    $body = "
        <p style='color: #333333;'>{$t['body']}</p>
        {$reasonHtml}
        <p style='color: #777777; font-size: 14px;'>{$t['retry']}</p>
    ";
    return emailBaseTemplate($t['title'], $body, $siteUrl . '/seller/applications', $t['cta'], $lang);
}

/**
 * 새 공간 등록 알림 (구독자용)
 */
function emailTemplateNewVenue($venueName, $region = '', $siteUrl = '', $lang = 'ko')
{
    $regionText = $region ? "[{$region}] " : '';
    $t = _t([
        'ko' => ['title' => '새로운 공간이 등록되었습니다', 'body' => '관심 있는 지역에 새로운 공간이 등록되었습니다.', 'cta' => '공간 확인하기'],
        'en' => ['title' => 'New Venue Registered', 'body' => 'A new venue has been registered in your area of interest.', 'cta' => 'View Venue'],
        'ja' => ['title' => '新しいスペースが登録されました', 'body' => '関心のある地域に新しいスペースが登録されました。', 'cta' => 'スペースを確認'],
        'vi' => ['title' => 'Không gian mới đã đăng ký', 'body' => 'Một không gian mới đã được đăng ký trong khu vực bạn quan tâm.', 'cta' => 'Xem không gian'],
        'th' => ['title' => 'มีพื้นที่ใหม่ลงทะเบียน', 'body' => 'มีพื้นที่ใหม่ลงทะเบียนในพื้นที่ที่คุณสนใจ', 'cta' => 'ดูพื้นที่'],
        'fr' => ['title' => 'Nouvel espace enregistré', 'body' => 'Un nouvel espace a été enregistré dans votre zone d\'intérêt.', 'cta' => 'Voir l\'espace'],
        'km' => ['title' => 'ក្២ាំងថ្មីត្រូវបានចុះឈ្មោះ', 'body' => 'ក្២ាៀងថ្មីត្រូវបានចុះឈ្មោះក្នុងតំបន់ដែលអ្ន ក  ស្និល (។', 'cta' => 'មើលក្២ាៀង'],
        'ru' => ['title' => 'Новое пространство зарегистрировано', 'body' => 'Новое пространство зарегистрировано в вашем регионе.', 'cta' => 'Посмотреть'],
        'uk' => ['title' => 'Новий простір зареєстровано', 'body' => 'Новий простір зареєстровано у вашому регіоні.', 'cta' => 'Переглянути'],
    ], $lang);

    $title = "🏠 {$regionText}{$t['title']}";
    $body = "
        <p style='color: #333333;'>{$t['body']}</p>
        <div style='background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #818cf8; font-size: 16px; font-weight: 600;'>📍 {$venueName}</p>
        </div>
    ";
    return emailBaseTemplate($title, $body, $siteUrl . '/seller/dashboard', $t['cta'], $lang);
}

/**
 * 채팅 메시지 수신 알림
 */
function emailTemplateChatMessage($senderName, $messagePreview, $isCS = false, $siteUrl = '', $chatLink = '/seller/chat', $lang = 'ko')
{
    $prefix = $isCS ? '[CS] ' : '';
    $t = _t([
        'ko' => ['title' => "님이 메시지를 보냈습니다", 'body' => "님이 새 메시지를 보냈습니다.", 'cta' => '채팅 확인하기'],
        'en' => ['title' => " sent you a message", 'body' => " sent you a new message.", 'cta' => 'View Chat'],
        'ja' => ['title' => "さんからメッセージが届きました", 'body' => "さんから新しいメッセージが届きました。", 'cta' => 'チャットを確認'],
        'vi' => ['title' => " đã gửi tin nhắn", 'body' => " đã gửi tin nhắn mới cho bạn.", 'cta' => 'Xem tin nhắn'],
        'th' => ['title' => " ส่งข้อความถึงคุณ", 'body' => " ส่งข้อความใหม่ถึงคุณ", 'cta' => 'ดูแชท'],
        'fr' => ['title' => " vous a envoyé un message", 'body' => " vous a envoyé un nouveau message.", 'cta' => 'Voir le chat'],
        'km' => ['title' => " បានផ្ញើសារ", 'body' => " បានផ្ញើសារថ្មី។", 'cta' => 'មើលជំនួយ'],
        'ru' => ['title' => " отправил(а) сообщение", 'body' => " отправил(а) новое сообщение.", 'cta' => 'Посмотреть чат'],
        'uk' => ['title' => " надіслав(ла) повідомлення", 'body' => " надіслав(ла) нове повідомлення.", 'cta' => 'Переглянути чат'],
    ], $lang);

    $title = "💬 {$prefix}{$senderName}{$t['title']}";
    $preview = mb_substr($messagePreview, 0, 100, 'UTF-8');
    $body = "
        <p style='color: #333333;'><strong>{$senderName}</strong>{$t['body']}</p>
        <div style='background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #c4b5fd; font-size: 14px; font-style: italic;'>\"{$preview}\"</p>
        </div>
    ";
    return emailBaseTemplate($title, $body, $siteUrl . $chatLink, $t['cta'], $lang);
}

/**
 * 커뮤니티 댓글/답글 알림
 */
function emailTemplateCommunityComment($commenterName, $postTitle, $isReply = false, $siteUrl = '', $link = '/seller/community', $lang = 'ko')
{
    $t = _t([
        'ko' => [
            'type' => $isReply ? '답글' : '댓글',
            'title_suffix' => ($isReply ? '답글' : '댓글') . '을 남겼습니다',
            'body_suffix' => "게시글에 " . ($isReply ? '답글' : '댓글') . "을 남겼습니다.",
            'note' => '게시글을 확인하고 대화에 참여해 보세요!',
            'cta' => '게시글 확인하기',
        ],
        'en' => [
            'type' => $isReply ? 'reply' : 'comment',
            'title_suffix' => 'left a ' . ($isReply ? 'reply' : 'comment'),
            'body_suffix' => "left a " . ($isReply ? 'reply' : 'comment') . " on your post.",
            'note' => 'Check the post and join the conversation!',
            'cta' => 'View Post',
        ],
        'ja' => [
            'type' => $isReply ? '返信' : 'コメント',
            'title_suffix' => ($isReply ? '返信' : 'コメント') . 'しました',
            'body_suffix' => "の投稿に" . ($isReply ? '返信' : 'コメント') . "しました。",
            'note' => '投稿を確認して会話に参加しましょう！',
            'cta' => '投稿を確認',
        ],
        'vi' => [
            'type' => $isReply ? 'trả lời' : 'bình luận',
            'title_suffix' => 'đã ' . ($isReply ? 'trả lời' : 'bình luận'),
            'body_suffix' => "đã " . ($isReply ? 'trả lời' : 'bình luận') . " trên bài viết của bạn.",
            'note' => 'Hãy xem bài viết và tham gia cuộc trò chuyện!',
            'cta' => 'Xem bài viết',
        ],
        'th' => [
            'type' => $isReply ? 'ตอบกลับ' : 'แสดงความคิดเห็น',
            'title_suffix' => ($isReply ? 'ตอบกลับ' : 'แสดงความคิดเห็น') . 'แล้ว',
            'body_suffix' => ($isReply ? 'ตอบกลับ' : 'แสดงความคิดเห็น') . "ในโพสต์ของคุณ",
            'note' => 'ตรวจสอบโพสต์และเข้าร่วมสนทนา!',
            'cta' => 'ดูโพสต์',
        ],
        'fr' => [
            'type' => $isReply ? 'réponse' : 'commentaire',
            'title_suffix' => 'a laissé un ' . ($isReply ? 'réponse' : 'commentaire'),
            'body_suffix' => "a laissé un " . ($isReply ? 'réponse' : 'commentaire') . " sur votre publication.",
            'note' => 'Consultez la publication et participez!',
            'cta' => 'Voir la publication',
        ],
        'km' => [
            'type' => $isReply ? 'ចម្លើយ' : 'មតិ',
            'title_suffix' => 'បាន' . ($isReply ? 'ចម្លើយ' : 'មតិ'),
            'body_suffix' => ($isReply ? 'ចម្លើយ' : 'មតិ') . "លើប៉ុសត៍របស់អ្នក។",
            'note' => 'សូមពិនិត្យប៉ុសត៍ និង     ចូលរួម!',
            'cta' => 'មើលប៉ុសត៍',
        ],
        'ru' => [
            'type' => $isReply ? 'ответ' : 'комментарий',
            'title_suffix' => 'оставил(а) ' . ($isReply ? 'ответ' : 'комментарий'),
            'body_suffix' => "оставил(а) " . ($isReply ? 'ответ' : 'комментарий') . " к вашему посту.",
            'note' => 'Посмотрите пост и присоединитесь!',
            'cta' => 'Посмотреть пост',
        ],
        'uk' => [
            'type' => $isReply ? 'відповідь' : 'коментар',
            'title_suffix' => 'залишив(ла) ' . ($isReply ? 'відповідь' : 'коментар'),
            'body_suffix' => "залишив(ла) " . ($isReply ? 'відповідь' : 'коментар') . " на ваш пост.",
            'note' => 'Перегляньте пост та приєднайтеся!',
            'cta' => 'Переглянути пост',
        ],
    ], $lang);

    $postShort = mb_substr($postTitle, 0, 30, 'UTF-8');
    $title = "💬 {$commenterName} {$t['title_suffix']}";
    $body = "
        <p style='color: #333333;'><strong>{$commenterName}</strong> '<strong>{$postShort}...</strong>' {$t['body_suffix']}</p>
        <div style='background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #fb7185; font-size: 14px;'>{$t['note']}</p>
        </div>
    ";
    return emailBaseTemplate($title, $body, $siteUrl . $link, $t['cta'], $lang);
}

/**
 * 결제 관련 알림 (입금 신고 / 확인 / 거절)
 */
function emailTemplatePayment($action, $note = '', $siteUrl = '', $link = '/admin/payments', $lang = 'ko')
{
    $titles = _t([
        'ko' => ['submitted' => '💳 새 입금 신고가 접수되었습니다', 'confirmed' => '✅ 결제가 확인되었습니다', 'rejected' => '❌ 결제가 거절되었습니다'],
        'en' => ['submitted' => '💳 New Payment Submitted', 'confirmed' => '✅ Payment Confirmed', 'rejected' => '❌ Payment Rejected'],
        'ja' => ['submitted' => '💳 新規入金申告', 'confirmed' => '✅ 決済が確認されました', 'rejected' => '❌ 決済が拒否されました'],
        'vi' => ['submitted' => '💳 Thanh toán mới đã nộp', 'confirmed' => '✅ Đã xác nhận thanh toán', 'rejected' => '❌ Thanh toán bị từ chối'],
        'th' => ['submitted' => '💳 ส่งการชำระเงินใหม่แล้ว', 'confirmed' => '✅ ยืนยันการชำระเงินแล้ว', 'rejected' => '❌ การชำระเงินถูกปฏิเสธ'],
        'fr' => ['submitted' => '💳 Nouveau paiement soumis', 'confirmed' => '✅ Paiement confirmé', 'rejected' => '❌ Paiement rejeté'],
        'km' => ['submitted' => '💳 ការបង់ថ្មី', 'confirmed' => '✅ ការបង់ត្រូវបានបញ្ជាក់', 'rejected' => '❌ ការបង់ត្រូវបានបដិសេធ'],
        'ru' => ['submitted' => '💳 Новый платеж', 'confirmed' => '✅ Платеж подтвержден', 'rejected' => '❌ Платеж отклонен'],
        'uk' => ['submitted' => '💳 Новий платіж', 'confirmed' => '✅ Платіж підтверджено', 'rejected' => '❌ Платіж відхилено'],
    ], $lang);

    $ctaTexts = _t([
        'ko' => '결제 내역 확인',
        'en' => 'View Payment Details',
        'ja' => '決済詳細を確認',
        'vi' => 'Xem chi tiết thanh toán',
        'th' => 'ดูรายละเอียดการชำระเงิน',
        'fr' => 'Voir les détails du paiement',
        'km' => 'មើលលម្អិតការបង់',
        'ru' => 'Посмотреть детали',
        'uk' => 'Переглянути деталі',
    ], $lang);

    $noteLabel = _t([
        'ko' => '메모',
        'en' => 'Note',
        'ja' => 'メモ',
        'vi' => 'Ghi chú',
        'th' => 'หมายเหตุ',
        'fr' => 'Note',
        'km' => 'កំណត់សម្គាល់',
        'ru' => 'Примечание',
        'uk' => 'Примітка',
    ], $lang);

    $colors = [
        'submitted' => ['bg' => 'rgba(99,102,241,0.1)', 'border' => 'rgba(99,102,241,0.2)', 'text' => '#818cf8'],
        'confirmed' => ['bg' => 'rgba(16,185,129,0.1)', 'border' => 'rgba(16,185,129,0.2)', 'text' => '#34d399'],
        'rejected' => ['bg' => 'rgba(239,68,68,0.1)', 'border' => 'rgba(239,68,68,0.2)', 'text' => '#f87171'],
    ];

    $title = $titles[$action] ?? ($titles['submitted'] ?? '💳 Payment');
    $c = $colors[$action] ?? $colors['submitted'];
    $noteHtml = $note ? "<p style='margin: 8px 0 0; color: {$c['text']}; font-size: 13px;'>{$noteLabel}: {$note}</p>" : '';
    $body = "
        <div style='background: {$c['bg']}; border: 1px solid {$c['border']}; border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: {$c['text']}; font-size: 15px; font-weight: 600;'>{$title}</p>
            {$noteHtml}
        </div>
    ";
    return emailBaseTemplate($title, $body, $siteUrl . $link, $ctaTexts, $lang);
}

/**
 * 취소 요청/결과 알림
 */
function emailTemplateCancellation($action, $venueName, $reason = '', $siteUrl = '', $link = '/host/applications', $lang = 'ko')
{
    $isRequest = ($action === 'request');
    $t = _t([
        'ko' => [
            'title' => $isRequest ? "⚠️ 입점 취소 요청이 접수되었습니다" : "📋 취소 요청 처리 결과",
            'body' => "<strong>{$venueName}</strong>에 대한 " . ($isRequest ? "취소 요청이 접수" : "취소 요청이 처리") . "되었습니다.",
            'note' => $isRequest ? "관리자 확인 후 처리됩니다." : "결과를 확인해 주세요.",
            'reason' => '사유',
            'cta' => '상세 확인하기',
        ],
        'en' => [
            'title' => $isRequest ? "⚠️ Cancellation Request Submitted" : "📋 Cancellation Request Result",
            'body' => "Cancellation " . ($isRequest ? "request for" : "result for") . " <strong>{$venueName}</strong> has been " . ($isRequest ? "submitted." : "processed."),
            'note' => $isRequest ? "An admin will review your request." : "Please check the result.",
            'reason' => 'Reason',
            'cta' => 'View Details',
        ],
        'ja' => [
            'title' => $isRequest ? "⚠️ キャンセル要求が送信されました" : "📋 キャンセル処理結果",
            'body' => "<strong>{$venueName}</strong>の" . ($isRequest ? "キャンセル要求が送信されました。" : "キャンセル処理が完了しました。"),
            'note' => $isRequest ? "管理者の確認後に処理されます。" : "結果をご確認ください。",
            'reason' => '理由',
            'cta' => '詳細を確認',
        ],
        'vi' => [
            'title' => $isRequest ? "⚠️ Yêu cầu hủy đã được gửi" : "📋 Kết quả yêu cầu hủy",
            'body' => "Yêu cầu hủy cho <strong>{$venueName}</strong> đã được " . ($isRequest ? "gửi." : "xử lý."),
            'note' => $isRequest ? "Quản trị viên sẽ xem xét yêu cầu." : "Vui lòng kiểm tra kết quả.",
            'reason' => 'Lý do',
            'cta' => 'Xem chi tiết',
        ],
        'th' => [
            'title' => $isRequest ? "⚠️ ส่งคำขอยกเลิกแล้ว" : "📋 ผลลัพธ์การขอยกเลิก",
            'body' => "คำขอยกเลิกสำหรับ <strong>{$venueName}</strong> " . ($isRequest ? "ถูกส่งแล้ว" : "ได้รับการประมวลผลแล้ว"),
            'note' => $isRequest ? "ผู้ดูแลจะตรวจสอบคำขอของคุณ" : "กรุณาตรวจสอบผลลัพธ์",
            'reason' => 'เหตุผล',
            'cta' => 'ดูรายละเอียด',
        ],
        'fr' => [
            'title' => $isRequest ? "⚠️ Demande d'annulation soumise" : "📋 Résultat de la demande d'annulation",
            'body' => "La demande d'annulation pour <strong>{$venueName}</strong> a été " . ($isRequest ? "soumise." : "traitée."),
            'note' => $isRequest ? "Un administrateur examinera votre demande." : "Veuillez vérifier le résultat.",
            'reason' => 'Raison',
            'cta' => 'Voir les détails',
        ],
        'km' => [
            'title' => $isRequest ? "⚠️ សំណើរអាប្រះបានផ្ញើ" : "📋 លទ្ធផលសំណើរអាប្រះ",
            'body' => "សំណើរអាប្រះសម្រាប់ <strong>{$venueName}</strong> ត្រូវបាន" . ($isRequest ? "ផ្ញើ។" : "ដំណើរការ។"),
            'note' => $isRequest ? "អ្នកគ្រប់គ្រងនឹងពិនិត្យ។" : "សូមពិនិត្យលទ្ធផល។",
            'reason' => 'មូលហេតុ',
            'cta' => 'មើលលម្អិត',
        ],
        'ru' => [
            'title' => $isRequest ? "⚠️ Запрос на отмену отправлен" : "📋 Результат запроса на отмену",
            'body' => "Запрос на отмену для <strong>{$venueName}</strong> " . ($isRequest ? "отправлен." : "обработан."),
            'note' => $isRequest ? "Администратор рассмотрит ваш запрос." : "Пожалуйста, проверьте результат.",
            'reason' => 'Причина',
            'cta' => 'Посмотреть детали',
        ],
        'uk' => [
            'title' => $isRequest ? "⚠️ Запит на скасування надіслано" : "📋 Результат запиту на скасування",
            'body' => "Запит на скасування для <strong>{$venueName}</strong> " . ($isRequest ? "надіслано." : "оброблено."),
            'note' => $isRequest ? "Адміністратор розгляне ваш запит." : "Будь ласка, перевірте результат.",
            'reason' => 'Причина',
            'cta' => 'Переглянути деталі',
        ],
    ], $lang);

    $color = $isRequest ? ['bg' => 'rgba(245,158,11,0.1)', 'border' => 'rgba(245,158,11,0.2)', 'text' => '#fbbf24']
        : ['bg' => 'rgba(99,102,241,0.1)', 'border' => 'rgba(99,102,241,0.2)', 'text' => '#818cf8'];
    $reasonHtml = $reason ? "<p style='margin: 8px 0 0; color: {$color['text']}; font-size: 13px;'>{$t['reason']}: {$reason}</p>" : '';
    $body = "
        <p style='color: #333333;'>{$t['body']}</p>
        <div style='background: {$color['bg']}; border: 1px solid {$color['border']}; border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: {$color['text']}; font-size: 14px;'>{$t['note']}</p>
            {$reasonHtml}
        </div>
    ";
    return emailBaseTemplate($t['title'], $body, $siteUrl . $link, $t['cta'], $lang);
}

/**
 * 베뉴 상태 변경 알림
 */
function emailTemplateVenueStatus($venueName, $newStatus, $siteUrl = '', $link = '/host/venues', $lang = 'ko')
{
    $statusLabels = _t([
        'ko' => ['active' => '✅ 활성화', 'inactive' => '⏸️ 비활성화', 'deleted' => '🗑️ 삭제', 'approved' => '✅ 승인', 'rejected' => '❌ 반려', 'suspended' => '⏸️ 정지'],
        'en' => ['active' => '✅ Active', 'inactive' => '⏸️ Inactive', 'deleted' => '🗑️ Deleted', 'approved' => '✅ Approved', 'rejected' => '❌ Rejected', 'suspended' => '⏸️ Suspended'],
        'ja' => ['active' => '✅ 有効', 'inactive' => '⏸️ 無効', 'deleted' => '🗑️ 削除', 'approved' => '✅ 承認', 'rejected' => '❌ 却下', 'suspended' => '⏸️ 停止'],
        'vi' => ['active' => '✅ Hoạt động', 'inactive' => '⏸️ Không hoạt động', 'deleted' => '🗑️ Đã xóa', 'approved' => '✅ Đã duyệt', 'rejected' => '❌ Bị từ chối', 'suspended' => '⏸️ Tạm ngưng'],
        'th' => ['active' => '✅ ใช้งาน', 'inactive' => '⏸️ ไม่ใช้งาน', 'deleted' => '🗑️ ลบแล้ว', 'approved' => '✅ อนุมัติ', 'rejected' => '❌ ปฏิเสธ', 'suspended' => '⏸️ ระงับ'],
        'fr' => ['active' => '✅ Actif', 'inactive' => '⏸️ Inactif', 'deleted' => '🗑️ Supprimé', 'approved' => '✅ Approuvé', 'rejected' => '❌ Rejeté', 'suspended' => '⏸️ Suspendu'],
        'km' => ['active' => '✅ សកម្ម', 'inactive' => '⏸️ មិនសកម្ម', 'deleted' => '🗑️ បានលុប', 'approved' => '✅ អនុម័ត', 'rejected' => '❌ បដិសេធ', 'suspended' => '⏸️ ផ្អាក'],
        'ru' => ['active' => '✅ Активно', 'inactive' => '⏸️ Неактивно', 'deleted' => '🗑️ Удалено', 'approved' => '✅ Одобрено', 'rejected' => '❌ Отклонено', 'suspended' => '⏸️ Приостановлено'],
        'uk' => ['active' => '✅ Активно', 'inactive' => '⏸️ Неактивно', 'deleted' => '🗑️ Видалено', 'approved' => '✅ Затверджено', 'rejected' => '❌ Відхилено', 'suspended' => '⏸️ Призупинено'],
    ], $lang);

    $t = _t([
        'ko' => ['title' => '🏠 공간 상태가 변경되었습니다', 'body' => "<strong>{$venueName}</strong> 공간의 상태가 변경되었습니다.", 'status' => '상태', 'cta' => '공간 관리하기'],
        'en' => ['title' => '🏠 Venue Status Changed', 'body' => "The status of <strong>{$venueName}</strong> has been changed.", 'status' => 'Status', 'cta' => 'Manage Venue'],
        'ja' => ['title' => '🏠 スペースの状態が変更されました', 'body' => "<strong>{$venueName}</strong>の状態が変更されました。", 'status' => '状態', 'cta' => 'スペース管理'],
        'vi' => ['title' => '🏠 Trạng thái không gian đã thay đổi', 'body' => "Trạng thái của <strong>{$venueName}</strong> đã thay đổi.", 'status' => 'Trạng thái', 'cta' => 'Quản lý không gian'],
        'th' => ['title' => '🏠 สถานะพื้นที่เปลี่ยนแปลง', 'body' => "สถานะของ <strong>{$venueName}</strong> ถูกเปลี่ยนแปลง", 'status' => 'สถานะ', 'cta' => 'จัดการพื้นที่'],
        'fr' => ['title' => '🏠 Statut de l\'espace modifié', 'body' => "Le statut de <strong>{$venueName}</strong> a été modifié.", 'status' => 'Statut', 'cta' => 'Gérer l\'espace'],
        'km' => ['title' => '🏠 ស្ថានភាពក្២ាៀងបានផ្លាស់ប្តូរ', 'body' => "ស្ថានភាពរបស់ <strong>{$venueName}</strong> បានផ្លាស់ប្តូរ។", 'status' => 'ស្ថានភាព', 'cta' => 'គ្រប់គ្រងក្២ាៀង'],
        'ru' => ['title' => '🏠 Статус пространства изменен', 'body' => "Статус <strong>{$venueName}</strong> изменен.", 'status' => 'Статус', 'cta' => 'Управление'],
        'uk' => ['title' => '🏠 Статус простору змінено', 'body' => "Статус <strong>{$venueName}</strong> змінено.", 'status' => 'Статус', 'cta' => 'Керування'],
    ], $lang);

    $statusLabel = $statusLabels[$newStatus] ?? $newStatus;
    $body = "
        <p style='color: #333333;'>{$t['body']}</p>
        <div style='background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
            <p style='margin: 0; color: #818cf8; font-size: 16px; font-weight: 600;'>{$t['status']}: {$statusLabel}</p>
        </div>
    ";
    return emailBaseTemplate($t['title'], $body, $siteUrl . $link, $t['cta'], $lang);
}

/**
 * 계정 관련 알림 (가입 승인, 신규 가입 알림)
 */
function emailTemplateAccountNotice($type, $userName = '', $siteUrl = '', $lang = 'ko')
{
    if ($type === 'approved') {
        $t = _t([
            'ko' => ['title' => '🎉 가입이 승인되었습니다!', 'body' => '축하합니다! SpaceMatch 가입이 승인되었습니다.', 'note' => '이제 로그인하여 SpaceMatch의 모든 기능을 이용하실 수 있습니다.', 'cta' => '로그인하기'],
            'en' => ['title' => '🎉 Your Account Has Been Approved!', 'body' => 'Congratulations! Your SpaceMatch account has been approved.', 'note' => 'You can now log in and use all SpaceMatch features.', 'cta' => 'Log In'],
            'ja' => ['title' => '🎉 アカウントが承認されました！', 'body' => 'おめでとうございます！SpaceMatchアカウントが承認されました。', 'note' => 'ログインしてSpaceMatchのすべての機能をご利用ください。', 'cta' => 'ログイン'],
            'vi' => ['title' => '🎉 Tài khoản đã được phê duyệt!', 'body' => 'Chúc mừng! Tài khoản SpaceMatch của bạn đã được phê duyệt.', 'note' => 'Bạn có thể đăng nhập và sử dụng tất cả tính năng.', 'cta' => 'Đăng nhập'],
            'th' => ['title' => '🎉 บัญชีได้รับการอนุมัติแล้ว!', 'body' => 'ยินดีด้วย! บัญชี SpaceMatch ของคุณได้รับการอนุมัติแล้ว', 'note' => 'คุณสามารถเข้าสู่ระบบและใช้งานฟีเจอร์ทั้งหมดได้แล้ว', 'cta' => 'เข้าสู่ระบบ'],
            'fr' => ['title' => '🎉 Votre compte a été approuvé!', 'body' => 'Félicitations! Votre compte SpaceMatch a été approuvé.', 'note' => 'Vous pouvez maintenant vous connecter.', 'cta' => 'Se connecter'],
            'km' => ['title' => '🎉 គណនីត្រូវបានអនុម័ត!', 'body' => 'សូមអបអរសើរ! គណនី SpaceMatch ត្រូវបានអនុម័ត។', 'note' => 'អ្នកអាចចូលប្រើប្រាស់បានឥឡូវ។', 'cta' => 'ចូល'],
            'ru' => ['title' => '🎉 Ваш аккаунт одобрен!', 'body' => 'Поздравляем! Ваш аккаунт SpaceMatch одобрен.', 'note' => 'Теперь вы можете войти.', 'cta' => 'Войти'],
            'uk' => ['title' => '🎉 Ваш акаунт затверджено!', 'body' => 'Вітаємо! Ваш акаунт SpaceMatch затверджено.', 'note' => 'Тепер ви можете увійти.', 'cta' => 'Увійти'],
        ], $lang);

        $body = "
            <p style='color: #333333;'>{$t['body']}</p>
            <div style='background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
                <p style='margin: 0; color: #34d399; font-size: 14px;'>{$t['note']}</p>
            </div>
        ";
        return emailBaseTemplate($t['title'], $body, $siteUrl . '/login', $t['cta'], $lang);
    } else {
        // 관리자에게 보내는 신규 가입 알림 — 항상 한국어
        $t = _t([
            'ko' => ['title' => '👤 새 사용자가 가입했습니다', 'body' => "<strong>{$userName}</strong>님이 새로 가입했습니다.", 'note' => '사용자 관리 페이지에서 확인하세요.', 'cta' => '사용자 관리'],
            'en' => ['title' => '👤 New User Registered', 'body' => "<strong>{$userName}</strong> has registered.", 'note' => 'Please check the user management page.', 'cta' => 'Manage Users'],
            'ja' => ['title' => '👤 新規ユーザー登録', 'body' => "<strong>{$userName}</strong>さんが新規登録しました。", 'note' => 'ユーザー管理ページで確認してください。', 'cta' => 'ユーザー管理'],
            'vi' => ['title' => '👤 Người dùng mới đăng ký', 'body' => "<strong>{$userName}</strong> vừa đăng ký.", 'note' => 'Vui lòng kiểm tra trang quản lý người dùng.', 'cta' => 'Quản lý người dùng'],
            'th' => ['title' => '👤 ผู้ใช้ใหม่ลงทะเบียน', 'body' => "<strong>{$userName}</strong> ลงทะเบียนแล้ว", 'note' => 'กรุณาตรวจสอบที่หน้าจัดการผู้ใช้', 'cta' => 'จัดการผู้ใช้'],
            'fr' => ['title' => '👤 Nouvel utilisateur inscrit', 'body' => "<strong>{$userName}</strong> s'est inscrit.", 'note' => 'Veuillez vérifier la page de gestion des utilisateurs.', 'cta' => 'Gérer les utilisateurs'],
            'km' => ['title' => '👤 អ្នកប្រើប្រាស់ថ្មីចុះឈ្មោះ', 'body' => "<strong>{$userName}</strong> បានចុះឈ្មោះ។", 'note' => 'សូមពិនិត្យទំព័រគ្រប់គ្រងអ្នកប្រើប្រាស់។', 'cta' => 'គ្រប់គ្រងអ្នកប្រើប្រាស់'],
            'ru' => ['title' => '👤 Новый пользователь', 'body' => "<strong>{$userName}</strong> зарегистрировался.", 'note' => 'Проверьте страницу управления.', 'cta' => 'Управление'],
            'uk' => ['title' => '👤 Новий користувач', 'body' => "<strong>{$userName}</strong> зареєструвався.", 'note' => 'Перевірте сторінку керування.', 'cta' => 'Керування'],
        ], $lang);

        $body = "
            <p style='color: #333333;'>{$t['body']}</p>
            <div style='background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
                <p style='margin: 0; color: #818cf8; font-size: 14px;'>{$t['note']}</p>
            </div>
        ";
        return emailBaseTemplate($t['title'], $body, $siteUrl . '/admin/users', $t['cta'], $lang);
    }
}
?>