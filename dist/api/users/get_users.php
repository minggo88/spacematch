<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in HTML, we'll return JSON

header('Content-Type: application/json; charset=utf-8');

include_once '../db_connect.php';
session_start();

// Check for admin or superadmin role
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
  http_response_code(403);
  echo json_encode(array("error" => "Unauthorized. Please login as admin."));
  exit;
}

$role = $_SESSION['user_role'];

try {
  // Check if is_featured column exists
  $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'is_featured'");
  $has_featured = $col_check->fetch() ? true : false;
  $featured_col = $has_featured ? ", u.is_featured" : ", 0 as is_featured";

  // Check period columns
  $col_fs = $conn->query("SHOW COLUMNS FROM users LIKE 'featured_start'");
  $has_fs = $col_fs->fetch() ? true : false;
  $featured_col .= $has_fs ? ", u.featured_start, u.featured_end" : ", NULL as featured_start, NULL as featured_end";

  // Check if is_verified column exists
  $col_check2 = $conn->query("SHOW COLUMNS FROM users LIKE 'is_verified'");
  $has_verified = $col_check2->fetch() ? true : false;
  $verified_col = $has_verified ? ", u.is_verified" : ", 0 as is_verified";

  // Check verified period columns
  $col_vs = $conn->query("SHOW COLUMNS FROM users LIKE 'verified_start'");
  $has_vs = $col_vs->fetch() ? true : false;
  $verified_col .= $has_vs ? ", u.verified_start, u.verified_end" : ", NULL as verified_start, NULL as verified_end";

  // Check if email_verified column exists
  $col_ev = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
  $has_ev = $col_ev->fetch() ? true : false;
  $email_verified_col = $has_ev ? ", u.email_verified" : ", 1 as email_verified";

  $search = isset($_GET['search']) ? trim($_GET['search']) : '';
  $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;

  if ($role === 'superadmin') {
    $query = "SELECT 
                    u.id, u.name, u.business_no, u.email, u.phone, u.role, u.status, u.venue_limit, u.created_at, u.profile_image, u.country
                    {$featured_col}
                    {$verified_col}
                    {$email_verified_col},
                    (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id) as venue_count,
                    (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as app_count
                  FROM users u 
                  WHERE u.role != 'dummy_condition' ";
  } else {
    $query = "SELECT 
                    u.id, u.name, u.business_no, u.email, u.phone, u.role, u.status, u.venue_limit, u.created_at, u.profile_image, u.country
                    {$featured_col}
                    {$verified_col}
                    {$email_verified_col},
                    (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id) as venue_count,
                    (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as app_count
                  FROM users u 
                  WHERE u.role NOT IN ('admin', 'superadmin') ";
  }

  $params = [];
  if (!empty($search)) {
    $query .= " AND (u.name LIKE ? OR u.email LIKE ?)";
    $params[] = '%' . $search . '%';
    $params[] = '%' . $search . '%';
  }

  $query .= " ORDER BY u.created_at DESC";
  if ($limit > 0) {
    $query .= " LIMIT " . $limit;
  }

  $stmt = $conn->prepare($query);
  $stmt->execute($params);
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  decode_rows($results, ['name']);

  echo json_encode(["success" => true, "users" => $results]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(array("error" => "Database Error: " . $e->getMessage()));
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(array("error" => "Server Error: " . $e->getMessage()));
}
?>