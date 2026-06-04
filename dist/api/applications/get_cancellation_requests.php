<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);
$user_role = $_SESSION['user_role'] ?? '';

try {
    // Auto-migrate: ensure table exists (wrapped separately so it doesn't break main query)
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS cancellation_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            application_id INT NOT NULL,
            seller_id INT NOT NULL,
            venue_id INT NOT NULL,
            reason TEXT NOT NULL,
            status ENUM('pending','approved','rejected') DEFAULT 'pending',
            decided_by INT DEFAULT NULL,
            decision_note TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            decided_at TIMESTAMP NULL DEFAULT NULL,
            INDEX idx_cr_app (application_id),
            INDEX idx_cr_seller (seller_id),
            INDEX idx_cr_venue (venue_id),
            INDEX idx_cr_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    } catch (Exception $migrationErr) {
        error_log("cancellation_requests migration warning: " . $migrationErr->getMessage());
        // Continue — table may already exist
    }

    // Check if applications table has venue_name column
    $has_venue_name = false;
    try {
        $col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'venue_name'");
        $has_venue_name = $col_check && $col_check->fetch() ? true : false;
    } catch (Exception $e) { /* applications table may not exist */
    }
    $venue_name_col = $has_venue_name ? 'a.venue_name,' : '';

    if ($user_role === 'admin' || $user_role === 'superadmin') {
        $query = "SELECT cr.*, 
                         {$venue_name_col} a.status as app_status,
                         seller.name as seller_name, seller.email as seller_email,
                         v.name as venue_title, v.location as venue_location,
                         host.name as host_name,
                         decider.name as decided_by_name
                  FROM cancellation_requests cr
                  LEFT JOIN applications a ON cr.application_id = a.id
                  LEFT JOIN users seller ON cr.seller_id = seller.id
                  LEFT JOIN venues v ON cr.venue_id = v.id
                  LEFT JOIN users vendor ON v.owner_id = host.id
                  LEFT JOIN users decider ON cr.decided_by = decider.id
                  ORDER BY cr.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
    } elseif ($user_role === 'host') {
        $query = "SELECT cr.*, 
                         {$venue_name_col} a.status as app_status,
                         seller.name as seller_name, seller.email as seller_email,
                         v.name as venue_title, v.location as venue_location,
                         decider.name as decided_by_name
                  FROM cancellation_requests cr
                  LEFT JOIN applications a ON cr.application_id = a.id
                  LEFT JOIN users seller ON cr.seller_id = seller.id
                  LEFT JOIN venues v ON cr.venue_id = v.id
                  LEFT JOIN users decider ON cr.decided_by = decider.id
                  WHERE v.owner_id = ?
                  ORDER BY cr.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute([$user_id]);
    } else {
        $query = "SELECT cr.*, 
                         {$venue_name_col} a.status as app_status,
                         v.name as venue_title, v.location as venue_location,
                         decider.name as decided_by_name
                  FROM cancellation_requests cr
                  LEFT JOIN applications a ON cr.application_id = a.id
                  LEFT JOIN venues v ON cr.venue_id = v.id
                  LEFT JOIN users decider ON cr.decided_by = decider.id
                  WHERE cr.seller_id = ?
                  ORDER BY cr.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute([$user_id]);
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "requests" => $results]);

} catch (PDOException $e) {
    error_log("get_cancellation_requests error: " . $e->getMessage());
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}