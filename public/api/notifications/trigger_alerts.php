<?php
/**
 * Trigger space alerts for subscribed sellers whose preferences match a new venue.
 * Called internally from add_venue.php after a venue is approved/created.
 */
include_once __DIR__ . '/send_push.php';
include_once __DIR__ . '/send_email.php';

function triggerSpaceAlerts($conn, $venueData)
{
    try {
        // Get all active alert preferences from subscribed users
        $stmt = $conn->prepare("
            SELECT ap.*, u.name as user_name
            FROM alert_preferences ap
            JOIN users u ON ap.user_id = u.id
            WHERE ap.is_active = 1
        ");
        $stmt->execute();
        $prefs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($prefs))
            return;

        // Ensure notifications table exists
        $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
            message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (:uid, 'space_alert', :msg, :link, NOW())";
        $notifStmt = $conn->prepare($notifSql);

        $venueRegion = $venueData['region'] ?? '';
        $venueType = $venueData['type'] ?? '';
        $venuePrice = intval($venueData['price'] ?? 0);
        $venueName = $venueData['name'] ?? '';
        $venueId = $venueData['id'] ?? 0;

        $pushRecipients = []; // 푸시 알림 수신 대상

        foreach ($prefs as $pref) {
            // Check if user has active popular_space_alert subscription
            try {
                $subCheck = $conn->prepare("SELECT p.id FROM payments p JOIN payment_plans pp ON p.plan_id = pp.id WHERE p.user_id = ? AND pp.category = 'popular_space_alert' AND p.status = 'confirmed' ORDER BY p.created_at DESC LIMIT 1");
                $subCheck->execute([$pref['user_id']]);
                if (!$subCheck->fetch())
                    continue;
            } catch (Exception $e) {
                continue;
            }

            $regions = json_decode($pref['regions'] ?: '[]', true);
            $types = json_decode($pref['types'] ?: '[]', true);
            $minPrice = intval($pref['min_price']);
            $maxPrice = intval($pref['max_price']);

            // Match check
            $regionMatch = empty($regions) || in_array($venueRegion, $regions);
            $typeMatch = empty($types) || in_array($venueType, $types);
            $priceMatch = true;
            if ($minPrice > 0 && $venuePrice < $minPrice)
                $priceMatch = false;
            if ($maxPrice > 0 && $venuePrice > $maxPrice)
                $priceMatch = false;

            if ($regionMatch && $typeMatch && $priceMatch) {
                $msg = "🔔 " . ($venueRegion ? "[$venueRegion] " : "") . "새로운 공간이 등록되었습니다: $venueName";
                $link = "/seller/dashboard";

                $notifStmt->bindValue(':uid', $pref['user_id']);
                $notifStmt->bindValue(':msg', $msg);
                $notifStmt->bindValue(':link', $link);
                $notifStmt->execute();

                $pushRecipients[] = $pref['user_id'];
            }
        }

        // [WEB PUSH] 매칭된 유저들에게 푸시 알림 발송
        if (!empty($pushRecipients)) {
            try {
                $pushMsg = ($venueRegion ? "[$venueRegion] " : "") . "새로운 공간: $venueName";
                sendPushToUsers($conn, $pushRecipients, '🏠 새 공간 알림', $pushMsg, '/seller/dashboard');
            } catch (Exception $pushErr) {
                error_log("Push notification error (trigger_alerts): " . $pushErr->getMessage());
            }

            // [EMAIL] 매칭된 유저들에게 이메일 발송 (다국어)
            try {
                $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                $_vn = $venueName;
                $_vr = $venueRegion;
                sendEmailToUsers(
                    $conn,
                    $pushRecipients,
                    '',
                    '',
                    'cat_venue',
                    function ($lang) use ($_vn, $_vr, $siteUrl) {
                        $subj = _t(['ko' => "🏠 새로운 공간이 등록되었습니다: {$_vn}", 'en' => "🏠 New Venue: {$_vn}", 'ja' => "🏠 新規スペース: {$_vn}", 'vi' => "🏠 Không gian mới: {$_vn}", 'th' => "🏠 พื้นที่ใหม่: {$_vn}"], $lang);
                        return ['subject' => $subj, 'html' => emailTemplateNewVenue($_vn, $_vr, $siteUrl, $lang)];
                    }
                );
            } catch (Exception $emailErr) {
                error_log("Email error (trigger_alerts): " . $emailErr->getMessage());
            }
        }
    } catch (Exception $e) {
        error_log("SpaceMatch Alert Error: " . $e->getMessage());
    }
}
?>