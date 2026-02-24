<?php
include_once '../db_connect.php';
session_start();

// 1. Add user_id column if missing
try {
    $conn->exec("ALTER TABLE applications ADD COLUMN user_id INT(11)");
    echo "Checked user_id column.<br>";
} catch (PDOException $e) {
    echo "user_id column likely exists.<br>";
}

// 2. Add seller_id column if missing (for safety)
try {
    $conn->exec("ALTER TABLE applications ADD COLUMN seller_id INT(11)");
    echo "Checked seller_id column.<br>";
} catch (PDOException $e) {
    echo "seller_id column likely exists.<br>";
}

// 3. Sync Data: If user_id is NULL/0 but seller_id has value, copy it.
$conn->exec("UPDATE applications SET user_id = seller_id WHERE (user_id IS NULL OR user_id = 0) AND seller_id > 0");
echo "Synced seller_id -> user_id.<br>";

// 4. Sync Data: If seller_id is NULL/0 but user_id has value, copy it.
$conn->exec("UPDATE applications SET seller_id = user_id WHERE (seller_id IS NULL OR seller_id = 0) AND user_id > 0");
echo "Synced user_id -> seller_id.<br>";

// 5. Check Current User Data
if (isset($_SESSION['user_id'])) {
    $uid = $_SESSION['user_id'];
    echo "<h3>Current User ID: $uid</h3>";

    $stmt = $conn->prepare("SELECT * FROM applications WHERE user_id = ?");
    $stmt->execute([$uid]);
    $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h3>Found Applications: " . count($apps) . "</h3>";
    echo "<pre>" . json_encode($apps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
} else {
    echo "<h3>No User Logged In</h3>";
}
?>