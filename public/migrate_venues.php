<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>🔧 Venues Table Migration</h3>";

if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
} elseif (file_exists('db_connect.php')) {
    include_once 'db_connect.php';
} else {
    die("❌ Error: Could not find db_connect.php.");
}

try {
    // Add owner_id column
    try {
        echo "Adding 'owner_id' column... ";
        $conn->exec("ALTER TABLE venues ADD COLUMN owner_id INT NULL AFTER id");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists or error: " . $e->getMessage() . "<br>";
    }

    // Add status column
    try {
        echo "Adding 'status' column... ";
        $conn->exec("ALTER TABLE venues ADD COLUMN status VARCHAR(20) DEFAULT 'approved' AFTER images");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists or error: " . $e->getMessage() . "<br>";
    }

    // Add created_at column
    try {
        echo "Adding 'created_at' column... ";
        $conn->exec("ALTER TABLE venues ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists or error: " . $e->getMessage() . "<br>";
    }

    echo "<h2 style='color: green;'>✅ Migration Complete!</h2>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ DELETE this migrate_venues.php file now!</p>";

} catch (PDOException $e) {
    echo "<h1>❌ Fatal Error</h1>" . $e->getMessage();
}
?>