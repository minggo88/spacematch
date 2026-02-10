<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    if (isset($data->id)) {
        // Mark specific notification
        $query = "UPDATE notifications SET is_read = 1 WHERE id = :id AND user_id = :user_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
    } elseif (isset($data->all) && $data->all === true) {
        // Mark all as read
        $query = "UPDATE notifications SET is_read = 1 WHERE user_id = :user_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
    }

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>