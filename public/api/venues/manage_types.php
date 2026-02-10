<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');

// Check Admin Auth
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: List all types (including inactive)
if ($method === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT * FROM venue_types ORDER BY id ASC");
        $stmt->execute();
        $types = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($types);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// POST: Add new type
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['name']) && isset($data['code'])) {
        try {
            $stmt = $conn->prepare("INSERT INTO venue_types (name, code, is_active) VALUES (:name, :code, 1)");
            $stmt->execute([':name' => $data['name'], ':code' => $data['code']]);
            echo json_encode(["success" => true, "message" => "Type added", "id" => $conn->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error adding type: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing name or code"]);
    }
}

// PUT: Update status or name
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'])) {
        try {
            $fields = [];
            $params = [':id' => $data['id']];

            if (isset($data['name'])) {
                $fields[] = "name = :name";
                $params[':name'] = $data['name'];
            }
            if (isset($data['is_active'])) {
                $fields[] = "is_active = :is_active";
                $params[':is_active'] = $data['is_active'];
            }

            if (empty($fields)) {
                echo json_encode(["success" => false, "message" => "No fields to update"]);
                exit;
            }

            $sql = "UPDATE venue_types SET " . implode(", ", $fields) . " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);

            echo json_encode(["success" => true, "message" => "Type updated"]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error updating type: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing ID"]);
    }
}

// DELETE: Remove type (Hard delete or soft delete?) -> Let's implement Soft Delete (is_active=0) via PUT usually, but if DELETE method is called we might want to actually delete. 
// For safety, let's restrict DELETE to only if it's not in use, but for now user asked to "Hide/Remove". 
// Let's stick to is_active toggle via PUT for hiding. DELETE method for actual removal if needed.
else if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
        try {
            $stmt = $conn->prepare("DELETE FROM venue_types WHERE id = :id");
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(["success" => true, "message" => "Type deleted"]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error deleting type: " . $e->getMessage()]);
        }
    }
}
?>