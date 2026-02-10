<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>🔧 User Table Enhancements Migration</h3>";

if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
} elseif (file_exists('db_connect.php')) {
    include_once 'db_connect.php';
} else {
    die("❌ Error: Could not find db_connect.php.");
}

try {
    // Add business_no column
    try {
        echo "Adding 'business_no' column... ";
        $conn->exec("ALTER TABLE users ADD COLUMN business_no VARCHAR(50) NULL AFTER name");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists or error: " . $e->getMessage() . "<br>";
    }

    // Add venue_limit column (default 3)
    try {
        echo "Adding 'venue_limit' column... ";
        $conn->exec("ALTER TABLE users ADD COLUMN venue_limit INT DEFAULT 3 AFTER role");
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Already exists or error: " . $e->getMessage() . "<br>";
    }

    // Create banned_users table for permanent ban enforcement (simpler than checking soft-deleted users if we want to delete them)
    // Actually, "delete or block". If we delete, we lose the info to prevent re-signup unless we store it elsewhere.
    // Let's create a `banned_users` table to store hashes of banned credentials.
    try {
        echo "Creating 'banned_users' table... ";
        $sql = "CREATE TABLE IF NOT EXISTS banned_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NULL,
            phone VARCHAR(50) NULL,
            business_no VARCHAR(50) NULL,
            banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reason TEXT NULL
        )";
        $conn->exec($sql);
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Error creating table: " . $e->getMessage() . "<br>";
    }

    // Create applications table if not exists (for seller stats)
    try {
        echo "Creating 'applications' table... ";
        $sql = "CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            venue_id INT NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
        )";
        $conn->exec($sql);
        echo "✅ Done.<br>";
    } catch (PDOException $e) {
        echo "ℹ️ Error creating applications table: " . $e->getMessage() . "<br>";
    }

    echo "<h2 style='color: green;'>✅ Migration Complete!</h2>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ DELETE this migrate_user_enhancements.php file now!</p>";

} catch (PDOException $e) {
    echo "<h1>❌ Fatal Error</h1>" . $e->getMessage();
}
?>