<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Only allow logged-in users to update their own profile
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
    exit;
}

try {
    $updates = [];
    $params = [];

    // Allowed fields for self-update
    if (isset($data->name) && !empty(trim($data->name))) {
        $updates[] = "name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->name)));
    }

    if (isset($data->phone)) {
        $updates[] = "phone = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->phone)));
    }

    if (isset($data->description)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'description'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN description TEXT DEFAULT NULL");
        }
        $updates[] = "description = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->description)));
    }

    if (isset($data->category)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'category'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN category VARCHAR(100) DEFAULT NULL");
        }
        $updates[] = "category = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->category)));
    }

    if (isset($data->instagram)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN instagram VARCHAR(255) DEFAULT NULL");
        }
        $updates[] = "instagram = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->instagram)));
    }

    if (isset($data->brandName)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'brand_name'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN brand_name VARCHAR(255) DEFAULT NULL");
        }
        $updates[] = "brand_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->brandName)));
    }

    if (isset($data->is_public)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'is_public'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN is_public TINYINT(1) DEFAULT 1");
        }
        $updates[] = "is_public = ?";
        $params[] = intval($data->is_public) ? 1 : 0;
    }

    if (isset($data->country)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'country'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN country VARCHAR(5) DEFAULT NULL");
        }
        $updates[] = "country = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->country)));
    }

    if (isset($data->realName)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'real_name'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN real_name VARCHAR(100) DEFAULT NULL");
        }
        $updates[] = "real_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->realName)));
    }

    if (isset($data->nameEn)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'name_en'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN name_en VARCHAR(100) DEFAULT NULL");
        }
        $updates[] = "name_en = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->nameEn)));
    }

    if (isset($data->businessNumber) || isset($data->business_no)) {
        $biz_val = isset($data->businessNumber) ? $data->businessNumber : $data->business_no;
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'business_no'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN business_no VARCHAR(50) DEFAULT NULL");
        }
        $updates[] = "business_no = ?";
        $params[] = htmlspecialchars(strip_tags(trim($biz_val)));
    }

    // Vendor-specific fields
    if (isset($data->company_name)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'company_name'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN company_name VARCHAR(255) DEFAULT NULL");
        }
        $updates[] = "company_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->company_name)));
    }

    if (isset($data->address)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'address'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN address VARCHAR(500) DEFAULT NULL");
        }
        $updates[] = "address = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->address)));
    }

    if (isset($data->website)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'website'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN website VARCHAR(500) DEFAULT NULL");
        }
        $updates[] = "website = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->website)));
    }

    if (isset($data->categories)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'categories'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN categories VARCHAR(500) DEFAULT NULL");
        }
        $updates[] = "categories = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->categories)));
    }

    if (isset($data->keywords)) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE 'keywords'");
        if (!$chk->fetch()) {
            $conn->exec("ALTER TABLE users ADD COLUMN keywords TEXT DEFAULT NULL");
        }
        if (is_array($data->keywords)) {
            $sanitized = array_map(function ($kw) {
                return htmlspecialchars(strip_tags(trim($kw)));
            }, $data->keywords);
            $sanitized = array_filter($sanitized);
            $updates[] = "keywords = ?";
            $params[] = json_encode(array_values($sanitized), JSON_UNESCAPED_UNICODE);
        } else {
            $updates[] = "keywords = ?";
            $params[] = htmlspecialchars(strip_tags(trim($data->keywords)));
        }
    }

    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "No changes to update."]);
        exit;
    }

    $params[] = $user_id;
    $query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    // Fetch updated user data to return
    $base_cols = "id, name, email, role, status, phone, business_no, profile_image, venue_limit";
    $opt_cols = ['category', 'instagram', 'description', 'brand_name', 'real_name', 'is_public', 'country', 'name_en', 'keywords', 'company_name', 'address', 'website', 'categories'];
    foreach ($opt_cols as $oc) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$oc}'");
        if ($chk->fetch())
            $base_cols .= ", {$oc}";
    }

    $fetch = $conn->prepare("SELECT {$base_cols} FROM users WHERE id = ?");
    $fetch->execute([$user_id]);
    $updatedUser = $fetch->fetch(PDO::FETCH_ASSOC);

    // Update ALL session variables to stay in sync
    $_SESSION['user_name'] = $updatedUser['name'];
    $_SESSION['user_role'] = $updatedUser['role'];
    $_SESSION['user_email'] = $updatedUser['email'];
    // Refresh session lifetime on profile update
    session_regenerate_id(false);

    echo json_encode([
        "success" => true,
        "message" => "Profile updated.",
        "user" => $updatedUser
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>