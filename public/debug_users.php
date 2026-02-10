<?php
include_once 'public/api/db_connect.php';

echo "<h3>MySQL User Dump</h3>";
try {
    $stmt = $conn->query("SELECT id, name, email, role, status, business_no, venue_limit FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($users) > 0) {
        echo "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Bus.No</th><th>Limit</th></tr>";
        foreach ($users as $u) {
            echo "<tr>";
            foreach ($u as $k => $v)
                echo "<td>$v</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No users found in database.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>