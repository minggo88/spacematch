<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once 'db_connect.php';
session_start();

// Security: only superadmin can access test tools
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'superadmin') {
    http_response_code(403);
    echo "<h1 style='color: red;'>⛔ Access Denied. Superadmin login required.</h1>";
    exit;
}

header('Content-Type: text/html; charset=utf-8');

echo "<h1>System Diagnosis & Test Apply</h1>";

// 1. Check Session
echo "<h2>1. Session Check</h2>";
if (isset($_SESSION['user_id'])) {
    echo "Logged in as User ID: " . $_SESSION['user_id'] . "<br>";
    $seller_id = $_SESSION['user_id'];
    $seller_name = $_SESSION['user_name'] ?? 'Test User';
} else {
    echo "<b>NOT LOGGED IN. Using Dummy Data for Testing.</b><br>";
    $seller_id = 1; // Assuming ID 1 exists
    $seller_name = "Test User (Dummy)";
}

// 2. Check Table Schema
echo "<h2>2. Table Schema Check (applications)</h2>";
try {
    $stmt = $conn->query("DESCRIBE applications");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns found: " . implode(", ", $columns) . "<br>";

    $required = ['venue_id', 'user_id', 'seller_name', 'venue_name', 'status', 'created_at'];
    foreach ($required as $col) {
        if (!in_array($col, $columns)) {
            echo "<b style='color:red'>MISSING COLUMN: $col</b> - Attempting to fix...<br>";
            if ($col == 'user_id')
                $conn->exec("ALTER TABLE applications ADD COLUMN user_id INT(11)");
            if ($col == 'seller_name')
                $conn->exec("ALTER TABLE applications ADD COLUMN seller_name VARCHAR(255)");
            if ($col == 'venue_name')
                $conn->exec("ALTER TABLE applications ADD COLUMN venue_name VARCHAR(255)");
            if ($col == 'created_at')
                $conn->exec("ALTER TABLE applications ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        }
    }
} catch (PDOException $e) {
    echo "Error checking schema: " . $e->getMessage() . "<br>";
    // Try creating table if missing
    $sql = "CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        user_id INT NOT NULL,
        seller_name VARCHAR(255),
        venue_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Attempted to CREATE table 'applications'.<br>";
}

// 3. Dry Run Insert
echo "<h2>3. Test Insertion</h2>";
try {
    // Get a valid venue ID first
    $v_stmt = $conn->query("SELECT id, name FROM venues LIMIT 1");
    $venue = $v_stmt->fetch(PDO::FETCH_ASSOC);

    if ($venue) {
        echo "Found existing venue: " . $venue['name'] . " (ID: " . $venue['id'] . ")<br>";

        $query = "INSERT INTO applications SET venue_id=:venue_id, user_id=:seller_id, seller_name=:seller_name, venue_name=:venue_name, status='test', created_at=NOW()";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":venue_id", $venue['id']);
        $stmt->bindParam(":seller_id", $seller_id);
        $stmt->bindParam(":seller_name", $seller_name);
        $stmt->bindParam(":venue_name", $venue['name']);

        if ($stmt->execute()) {
            echo "<h3 style='color:green'>SUCCESS: Test record inserted!</h3>";
            echo "Last Insert ID: " . $conn->lastInsertId() . "<br>";
        } else {
            $err = $stmt->errorInfo();
            echo "<h3 style='color:red'>FAILURE: Insert failed.</h3>";
            echo "SQL Error Code: " . $err[0] . "<br>";
            echo "Error Message: " . $err[2] . "<br>";
        }
    } else {
        echo "No venues found in DB to test with.<br>";
    }

} catch (PDOException $e) {
    echo "<h3 style='color:red'>EXCEPTION: " . $e->getMessage() . "</h3>";
}
?>