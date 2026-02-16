<?php
session_start();

// Clear session cookie to prevent reuse
if (ini_get("session.use_cookies")) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Clear session data and destroy
$_SESSION = array();
session_destroy();

echo json_encode(array("success" => true, "message" => "Logged out successfully."));
?>