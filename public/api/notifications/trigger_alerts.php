<?php
/**
 * Trigger space alerts for subscribed sellers whose preferences match a new venue.
 * Called internally from add_venue.php after a venue is approved/created.
 */
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
            }
        }
    } catch (Exception $e) {
        error_log("SpaceMatch Alert Error: " . $e->getMessage());
    }
}
?>