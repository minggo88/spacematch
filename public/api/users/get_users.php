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

  if ($role === 'superadmin') {
    $query = "SELECT 
                    u.id, u.name, u.business_no, u.email, u.phone, u.role, u.status, u.venue_limit, u.created_at
                    {$featured_col},
                    (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id) as venue_count,
                    (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as app_count
                  FROM users u 
                  WHERE u.role != 'dummy_condition' 
                  ORDER BY u.created_at DESC";
  } else {
    $query = "SELECT 
                    u.id, u.name, u.business_no, u.email, u.phone, u.role, u.status, u.venue_limit, u.created_at
                    {$featured_col},
                    (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id) as venue_count,
                    (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as app_count
                  FROM users u 
                  WHERE u.role NOT IN ('admin', 'superadmin')
                  ORDER BY u.created_at DESC";
  }

  $stmt = $conn->prepare($query);
  $stmt->execute();
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($results);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(array("error" => "Database Error: " . $e->getMessage()));
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(array("error" => "Server Error: " . $e->getMessage()));
}
?>