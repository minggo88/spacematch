<?php
include_once '../db_connect.php';
session_start();

// Allow only admin or superadmin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

// Get PUT/POST data
$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->name) && isset($data->price)) {
    try {
        $query = "UPDATE venues SET 
                  name = :name, 
                  location = :location, 
                  description = :description, 
                  price = :price, 
                  type = :type 
                  WHERE id = :id";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":location", $data->location);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":price", $data->price);
        $stmt->bindParam(":type", $data->type);
        $stmt->bindParam(":id", $data->id);

        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Venue updated successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update venue."));
        }
    } catch (PDOException $e) {
        echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Missing required fields."));
}
?>