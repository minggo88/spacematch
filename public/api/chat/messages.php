<?php
/**
 * Chat Messages API
 * 
 * GET  /api/chat/messages.php?conversation_id=N           — Get messages
 * GET  /api/chat/messages.php?conversation_id=N&after_id=M — Polling: new messages only
 * POST /api/chat/messages.php                              — Send message
 *   Body: { "conversation_id": N, "text": "..." }
 * PUT  /api/chat/messages.php                              — Mark messages as read
 *   Body: { "conversation_id": N }
 */

include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Get user's language
$langStmt = $conn->prepare("SELECT country FROM users WHERE id = ?");
$langStmt->execute([$user_id]);
$userLang = $langStmt->fetchColumn() ?: 'ko';

// ─── Helper: Check if user is participant (admin can access CS convs) ───
function isParticipant($conn, $conversation_id, $user_id)
{
    // Check if direct participant
    $stmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND (participant_1 = ? OR participant_2 = ?)");
    $stmt->execute([$conversation_id, $user_id, $user_id]);
    if ($stmt->fetch() !== false)
        return true;

    // Admin/superadmin can access any CS conversation
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $role = $roleStmt->fetchColumn();
    if (in_array($role, ['admin', 'superadmin'])) {
        $csStmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND type = 'cs'");
        $csStmt->execute([$conversation_id]);
        return $csStmt->fetch() !== false;
    }
    return false;
}

// ─── Helper: Get other participant's language ───
function getOtherUserLang($conn, $conversation_id, $sender_id)
{
    $stmt = $conn->prepare("
        SELECT u.country FROM chat_conversations c
        JOIN users u ON u.id = CASE WHEN c.participant_1 = ? THEN c.participant_2 ELSE c.participant_1 END
        WHERE c.id = ?
    ");
    $stmt->execute([$sender_id, $conversation_id]);
    return $stmt->fetchColumn() ?: 'ko';
}

// ─── Helper: Translate text using existing translate.php logic ───
function translateMessage($text, $sourceLang, $targetLang)
{
    if (empty($text) || $sourceLang === $targetLang)
        return $text;

    // Normalize language codes for MyMemory
    $langMap = [
        'ko' => 'ko',
        'en' => 'en',
        'en-GB' => 'en',
        'en-CA' => 'en',
        'fr-CA' => 'fr',
        'fr' => 'fr',
        'ja' => 'ja',
        'vi' => 'vi',
        'zh' => 'zh-CN',
        'th' => 'th',
        'km' => 'km',
        'ru' => 'ru',
        'uk' => 'uk',
    ];
    $src = $langMap[$sourceLang] ?? substr($sourceLang, 0, 2);
    $tgt = $langMap[$targetLang] ?? substr($targetLang, 0, 2);

    if ($src === $tgt)
        return $text;

    // Check cache first
    global $conn;
    $hash = hash('sha256', $text);
    $cacheStmt = $conn->prepare("SELECT translated_text FROM translation_cache WHERE source_hash = ? AND source_lang = ? AND target_lang = ? LIMIT 1");
    $cacheStmt->execute([$hash, $src, $tgt]);
    $cached = $cacheStmt->fetch(PDO::FETCH_ASSOC);
    if ($cached)
        return $cached['translated_text'];

    // Call MyMemory API
    $url = "https://api.mymemory.translated.net/get?" . http_build_query([
        'q' => $text,
        'langpair' => "$src|$tgt",
        'de' => 'spacematch@example.com'
    ]);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Accept: application/json']
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 || !$response)
        return $text;

    $data = json_decode($response, true);
    if (isset($data['responseData']['translatedText'])) {
        $translated = $data['responseData']['translatedText'];
        if (strtoupper($translated) === $translated && strlen($translated) > 20)
            return $text;

        // Cache result
        try {
            $cacheInsert = $conn->prepare("INSERT INTO translation_cache (source_lang, target_lang, source_text, translated_text, source_hash) VALUES (?, ?, ?, ?, ?)");
            $cacheInsert->execute([$src, $tgt, $text, $translated, $hash]);
        } catch (PDOException $e) { /* ignore duplicate */
        }

        return $translated;
    }

    return $text;
}

// ─── GET: Fetch messages ───
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $convId = intval($_GET['conversation_id'] ?? 0);
    $afterId = intval($_GET['after_id'] ?? 0);

    if ($convId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
        exit;
    }

    // Check admin access for CS conversations
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $userRole = $roleStmt->fetchColumn();
    $isAdmin = in_array($userRole, ['admin', 'superadmin']);

    // Check CS type for admin bypass
    $typeStmt = $conn->prepare("SELECT type FROM chat_conversations WHERE id = ?");
    $typeStmt->execute([$convId]);
    $convType = $typeStmt->fetchColumn();

    if (!($isAdmin && $convType === 'cs') && !isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    $query = "
        SELECT m.*, u.name as sender_name, u.profile_image as sender_profile_image, u.country as sender_country
        FROM chat_messages m
        LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
    ";
    $params = [$convId];

    if ($afterId > 0) {
        $query .= " AND m.id > ?";
        $params[] = $afterId;
    }

    $query .= " ORDER BY m.id ASC LIMIT 200";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse translated_texts JSON
    foreach ($messages as &$msg) {
        if (!empty($msg['translated_texts'])) {
            $msg['translated_texts'] = json_decode($msg['translated_texts'], true);
        } else {
            $msg['translated_texts'] = [];
        }
    }

    echo json_encode([
        "success" => true,
        "messages" => $messages,
        "viewer_lang" => $userLang
    ]);
    exit;
}

// ─── POST: Send message ───
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $convId = intval($input['conversation_id'] ?? 0);
    $text = trim($input['text'] ?? '');

    if ($convId <= 0 || empty($text)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id와 text는 필수입니다."]);
        exit;
    }

    if (!isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    // Get other user's language for translation
    $otherLang = getOtherUserLang($conn, $convId, $user_id);

    // Translate message to ALL supported languages (so admin can view in any language)
    // Core languages (unique translation targets)
    $coreLangs = ['ko', 'en', 'ja', 'vi', 'zh', 'th', 'km', 'fr', 'ru', 'uk'];
    $translatedTexts = [];
    $translatedTexts[$userLang] = $text; // Store original in sender's language

    // Normalize sender lang for comparison
    $senderCore = $langMap[$userLang] ?? substr($userLang, 0, 2);

    foreach ($coreLangs as $targetLang) {
        $targetCore = $langMap[$targetLang] ?? substr($targetLang, 0, 2);
        if ($targetCore === $senderCore)
            continue; // Skip sender's own language
        $translated = translateMessage($text, $userLang, $targetLang);
        if ($translated && $translated !== $text) {
            $translatedTexts[$targetLang] = $translated;
        }
    }

    // Store aliases so 'en-GB', 'en-CA' find 'en' translation; 'fr-CA' finds 'fr'
    if (isset($translatedTexts['en'])) {
        $translatedTexts['en-GB'] = $translatedTexts['en'];
        $translatedTexts['en-CA'] = $translatedTexts['en'];
    }
    if (isset($translatedTexts['fr'])) {
        $translatedTexts['fr-CA'] = $translatedTexts['fr'];
    }
    // Also store zh-CN as zh (MyMemory returns zh-CN)
    if (isset($translatedTexts['zh'])) {
        $translatedTexts['zh-CN'] = $translatedTexts['zh'];
    }

    // Insert message
    $insertStmt = $conn->prepare("
        INSERT INTO chat_messages (conversation_id, sender_id, message_type, original_text, original_lang, translated_texts)
        VALUES (?, ?, 'text', ?, ?, ?)
    ");
    $insertStmt->execute([
        $convId,
        $user_id,
        $text,
        $userLang,
        !empty($translatedTexts) ? json_encode($translatedTexts, JSON_UNESCAPED_UNICODE) : null
    ]);
    $msgId = intval($conn->lastInsertId());

    // Update conversation last_message_at
    $updateStmt = $conn->prepare("UPDATE chat_conversations SET last_message_at = NOW() WHERE id = ?");
    $updateStmt->execute([$convId]);

    // ─── Create notification for the other participant ───
    try {
        // Get conversation info to find the other user
        $convInfoStmt = $conn->prepare("SELECT participant_1, participant_2, type FROM chat_conversations WHERE id = ?");
        $convInfoStmt->execute([$convId]);
        $convInfo = $convInfoStmt->fetch(PDO::FETCH_ASSOC);

        if ($convInfo) {
            $other_user_id = ($convInfo['participant_1'] == $user_id) ? $convInfo['participant_2'] : $convInfo['participant_1'];

            // Get sender info
            $senderStmt = $conn->prepare("SELECT name, role FROM users WHERE id = ?");
            $senderStmt->execute([$user_id]);
            $senderInfo = $senderStmt->fetch(PDO::FETCH_ASSOC);
            $senderName = $senderInfo['name'] ?? 'User';
            $senderRole = $senderInfo['role'] ?? '';
            $isSenderAdmin = in_array($senderRole, ['admin', 'superadmin']);

            // Notification message templates per language
            $csNotifTemplates = [
                'ko' => '[CS] {{name}}님이 메시지를 보냈습니다.',
                'en' => '[CS] {{name}} sent a message.',
                'ja' => '[CS] {{name}}さんがメッセージを送信しました。',
                'vi' => '[CS] {{name}} đã gửi tin nhắn.',
                'th' => '[CS] {{name}} ส่งข้อความแล้ว',
                'km' => '[CS] {{name}} បានផ្ញើរសារ។',
                'ru' => '[CS] {{name}} отправил(а) сообщение.',
                'uk' => '[CS] {{name}} надіслав(ла) повідомлення.',
                'fr-CA' => '[CS] {{name}} a envoyé un message.',
                'en-GB' => '[CS] {{name}} sent a message.',
                'en-CA' => '[CS] {{name}} sent a message.',
            ];
            $chatNotifTemplates = [
                'ko' => '{{name}}님이 메시지를 보냈습니다.',
                'en' => '{{name}} sent a message.',
                'ja' => '{{name}}さんがメッセージを送信しました。',
                'vi' => '{{name}} đã gửi tin nhắn.',
                'th' => '{{name}} ส่งข้อความแล้ว',
                'km' => '{{name}} បានផ្ញើរសារ។',
                'ru' => '{{name}} отправил(а) сообщение.',
                'uk' => '{{name}} надіслав(ла) повідомлення.',
                'fr-CA' => '{{name}} a envoyé un message.',
                'en-GB' => '{{name}} sent a message.',
                'en-CA' => '{{name}} sent a message.',
            ];
            // Helper to get notification text in recipient's language
            $getNotifMsg = function ($templates, $recipientLang, $displayName) {
                $baseLang = explode('-', $recipientLang)[0];
                $template = $templates[$recipientLang] ?? $templates[$baseLang] ?? $templates['en'];
                return str_replace('{{name}}', $displayName, $template);
            };

            // Helper: get role-based chat link for a user
            $getLinkForRole = function ($role) {
                if (in_array($role, ['admin', 'superadmin']))
                    return '/admin/cs';
                if ($role === 'vendor')
                    return '/vendor/chat';
                return '/seller/chat'; // seller or any other role
            };

            $isCS = ($convInfo['type'] === 'cs');

            if ($isCS) {
                // For CS: admin senders show as "SpaceMatch CS"
                $displayName = $isSenderAdmin ? 'SpaceMatch CS' : $senderName;
                $notifType = 'cs_message';

                // Get recipient's role and language for link and notification text
                $recipientInfoStmt = $conn->prepare("SELECT role, country FROM users WHERE id = ?");
                $recipientInfoStmt->execute([$other_user_id]);
                $recipientInfo = $recipientInfoStmt->fetch(PDO::FETCH_ASSOC);
                $recipientRole = $recipientInfo['role'] ?? 'seller';
                $recipientLang = $recipientInfo['country'] ?? 'ko';
                $notifLink = $getLinkForRole($recipientRole);
                $notifMsg = $getNotifMsg($csNotifTemplates, $recipientLang, $displayName);

                // Insert notification for the direct recipient
                $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$other_user_id, $notifType, $notifMsg, $notifLink]);

                // If sender is NOT admin, also notify ALL admins
                if (!$isSenderAdmin) {
                    $adminNotifStmt = $conn->prepare("
                        SELECT id, country FROM users 
                        WHERE role IN ('admin', 'superadmin')
                    ");
                    $adminNotifStmt->execute();
                    $allAdmins = $adminNotifStmt->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($allAdmins as $adminRow) {
                        $adminId = $adminRow['id'];
                        if ($adminId != $other_user_id) { // don't double-notify
                            $adminLang = $adminRow['country'] ?? 'ko';
                            $adminNotifMsg = $getNotifMsg($csNotifTemplates, $adminLang, $senderName);
                            $notifStmt->execute([$adminId, $notifType, $adminNotifMsg, '/admin/cs']);
                        }
                    }
                }
            } else {
                // Regular chat message
                $notifType = 'chat_message';

                // Get recipient's role and language
                $recipientInfoStmt2 = $conn->prepare("SELECT role, country FROM users WHERE id = ?");
                $recipientInfoStmt2->execute([$other_user_id]);
                $recipientInfo2 = $recipientInfoStmt2->fetch(PDO::FETCH_ASSOC);
                $recipientRole = $recipientInfo2['role'] ?? 'seller';
                $recipientLang = $recipientInfo2['country'] ?? 'ko';
                $notifLink = $getLinkForRole($recipientRole);
                $notifMsg = $getNotifMsg($chatNotifTemplates, $recipientLang, $senderName);

                $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$other_user_id, $notifType, $notifMsg, $notifLink]);
            }
        }
    } catch (PDOException $e) {
        // Don't fail the message send if notification creation fails
        error_log("Notification creation failed: " . $e->getMessage());
    }

    // Get inserted message with sender info
    $getStmt = $conn->prepare("
        SELECT m.*, u.name as sender_name, u.profile_image as sender_profile_image, u.country as sender_country
        FROM chat_messages m
        LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
    ");
    $getStmt->execute([$msgId]);
    $message = $getStmt->fetch(PDO::FETCH_ASSOC);
    if (!empty($message['translated_texts'])) {
        $message['translated_texts'] = json_decode($message['translated_texts'], true);
    }

    echo json_encode([
        "success" => true,
        "message" => $message
    ]);
    exit;
}

// ─── PUT: Mark as read ───
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $convId = intval($input['conversation_id'] ?? 0);

    if ($convId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
        exit;
    }

    if (!isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    // Mark all messages from the OTHER user as read
    $stmt = $conn->prepare("UPDATE chat_messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ? AND is_read = 0");
    $stmt->execute([$convId, $user_id]);
    $count = $stmt->rowCount();

    echo json_encode([
        "success" => true,
        "marked_count" => $count
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>