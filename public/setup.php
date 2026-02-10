<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>🚀 Setup Script Started...</h3>";

// Point to the correct db_connect file
if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
    echo "✅ found api/db_connect.php<br>";
} elseif (file_exists('db_connect.php')) {
    include_once 'db_connect.php';
    echo "✅ found db_connect.php<br>";
} else {
    die("❌ Error: Could not find api/db_connect.php.");
}

// Super Admin Credentials
$name = 'paik7777';
$email = 'copydot.thomaspaik@gmail.com';
$password = 'Fuckoff91!@';
$phone = '010-7568-1753';
$role = 'superadmin';

try {
    // 0. Create users table if not exists
    echo "Checking/Creating users table... ";
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'seller',
        status VARCHAR(20) DEFAULT 'active',
        profile_image VARCHAR(500) NULL,
        brand_name VARCHAR(100) NULL,
        brand_description TEXT NULL,
        instagram VARCHAR(200) NULL,
        product_category VARCHAR(100) NULL,
        custom_category VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "✅ Done.<br>";

    // 1. Fix 'role' column to allow 'superadmin'
    echo "Attempting to modify 'role' column to VARCHAR(20)... ";
    try {
        $conn->exec("ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'seller'");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "⚠️ " . $e->getMessage() . "<br>";
    }

    // 2. Add 'phone' column if missing
    try {
        echo "Checking/Adding 'phone' column... ";
        $conn->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email");
        echo "✅ Added.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists.<br>";
    }

    // 3. Add 'status' column if missing
    try {
        echo "Checking/Adding 'status' column... ";
        $conn->exec("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active' AFTER role");
        echo "✅ Added.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists.<br>";
    }

    // 4. CREATE OR UPDATE SUPER ADMIN
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(1, $email);
    $check_stmt->execute();

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    if ($check_stmt->rowCount() > 0) {
        echo "<h2>⚠️ User exists. Updating to Super Admin...</h2>";
        $update_query = "UPDATE users SET role = ?, phone = ?, status = 'active', password = ? WHERE email = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->execute([$role, $phone, $password_hash, $email]);
        echo "<h1 style='color: green;'>✅ Super Admin Updated!</h1>";
    } else {
        echo "Creating new Super Admin... ";
        $query = "INSERT INTO users (name, email, password, role, status, phone) VALUES (?, ?, ?, ?, 'active', ?)";
        $stmt = $conn->prepare($query);
        $stmt->execute([$name, $email, $password_hash, $role, $phone]);
        echo "<h1 style='color: green;'>✅ Super Admin Created!</h1>";
    }

    echo "<p><strong>Email:</strong> $email<br><strong>Password:</strong> $password</p>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ DELETE this setup.php file now!</p>";

} catch (PDOException $e) {
    echo "<h1>❌ Fatal Database Error</h1>";
    echo $e->getMessage();
}
?>