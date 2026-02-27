<?php
include_once '../db_connect.php';

session_start();

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Refresh session cookie on every check to keep session alive
    if (session_status() === PHP_SESSION_ACTIVE) {
        setcookie(session_name(), session_id(), time() + 86400, '/', '', false, true);
    }

    // Build column list dynamically for optional fields
    $base_cols = "id, name, email, role, status, phone, business_no, profile_image, venue_limit";

    $opt_cols = ['category', 'instagram', 'description', 'brand_name', 'real_name', 'is_public', 'country', 'is_demo', 'name_en', 'keywords', 'company_name', 'address', 'website', 'categories', 'created_at'];
    foreach ($opt_cols as $oc) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$oc}'");
        if ($chk->fetch())
            $base_cols .= ", {$oc}";
    }

    $query = "SELECT {$base_cols} FROM users WHERE id = ? LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Update session if needed
        $_SESSION['user_role'] = $row['role'];
        $_SESSION['user_name'] = $row['name'];

        // ── Track last activity for online status ──
        try {
            $colCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'last_active_at'");
            if (!$colCheck->fetch()) {
                $conn->exec("ALTER TABLE users ADD COLUMN last_active_at DATETIME NULL DEFAULT NULL");
            }
            $conn->prepare("UPDATE users SET last_active_at = NOW() WHERE id = ?")->execute([$user_id]);
        } catch (PDOException $e) { /* non-critical */
        }

        echo json_encode(array(
            "success" => true,
            "user" => $row
        ));
    } else {
        // Session exists but user not found in DB? Weird edge case.
        session_destroy();
        echo json_encode(array("success" => false, "message" => "Invalid session."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Not logged in."));
}
?>