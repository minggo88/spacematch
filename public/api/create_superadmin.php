<?php
include_once 'db_connect.php';
session_start();

// Security: only existing superadmin can create another one
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'superadmin') {
    http_response_code(403);
    echo "<h1 style='color: red;'>⛔ Access Denied. Superadmin login required.</h1>";
    exit;
}

// Super Admin Credentials
$name = 'paik7777';
$email = 'copydot.thomaspaik@gmail.com';
$password = 'Fuckoff91!@';
$phone = '010-7568-1753';
$role = 'superadmin';

// Check if superadmin already exists
$check_query = "SELECT id FROM users WHERE email = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bindParam(1, $email);
$check_stmt->execute();

if ($check_stmt->rowCount() > 0) {
    echo "<h2>Super Admin already exists!</h2>";
    echo "<p>Email: " . htmlspecialchars($email) . "</p>";
    echo "<p>Please delete this file (create_superadmin.php) from the server for security.</p>";
    exit;
}

// Create Super Admin
$password_hash = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO users (name, email, password, role, status, phone) VALUES (:name, :email, :password, :role, 'active', :phone)";
$stmt = $conn->prepare($query);
$stmt->bindParam(":name", $name);
$stmt->bindParam(":email", $email);
$stmt->bindParam(":password", $password_hash);
$stmt->bindParam(":role", $role);
$stmt->bindParam(":phone", $phone);

if ($stmt->execute()) {
    echo "<h1 style='color: green;'>✅ Super Admin Created Successfully!</h1>";
    echo "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
    echo "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
    echo "<p><strong>Password:</strong> (as provided)</p>";
    echo "<p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>";
    echo "<hr>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ IMPORTANT: Delete this file (create_superadmin.php) from the server immediately after use!</p>";
} else {
    echo "<h1 style='color: red;'>❌ Failed to create Super Admin</h1>";
    print_r($stmt->errorInfo());
}
?>