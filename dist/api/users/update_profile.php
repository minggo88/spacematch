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

    // Ensure all optional columns exist (once per session)
    if (empty($_SESSION['_ddl_profile_migrated'])) {
        $migrate_cols = [
            ['description', "ADD COLUMN description TEXT DEFAULT NULL"],
            ['category', "ADD COLUMN category VARCHAR(100) DEFAULT NULL"],
            ['instagram', "ADD COLUMN instagram VARCHAR(255) DEFAULT NULL"],
            ['brand_name', "ADD COLUMN brand_name VARCHAR(255) DEFAULT NULL"],
            ['is_public', "ADD COLUMN is_public TINYINT(1) DEFAULT 1"],
            ['country', "ADD COLUMN country VARCHAR(5) DEFAULT NULL"],
            ['real_name', "ADD COLUMN real_name VARCHAR(100) DEFAULT NULL"],
            ['name_en', "ADD COLUMN name_en VARCHAR(100) DEFAULT NULL"],
            ['business_no', "ADD COLUMN business_no VARCHAR(50) DEFAULT NULL"],
            ['company_name', "ADD COLUMN company_name VARCHAR(255) DEFAULT NULL"],
            ['address', "ADD COLUMN address VARCHAR(500) DEFAULT NULL"],
            ['website', "ADD COLUMN website VARCHAR(500) DEFAULT NULL"],
            ['categories', "ADD COLUMN categories VARCHAR(500) DEFAULT NULL"],
            ['keywords', "ADD COLUMN keywords TEXT DEFAULT NULL"],
        ];
        foreach ($migrate_cols as $mc) {
            try {
                $conn->query("SELECT {$mc[0]} FROM users LIMIT 1");
            } catch (PDOException $e) {
                $conn->exec("ALTER TABLE users {$mc[1]}");
            }
        }
        $_SESSION['_ddl_profile_migrated'] = true;
    }

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
        $updates[] = "description = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->description)));
    }

    if (isset($data->category)) {
        $updates[] = "category = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->category)));
    }

    if (isset($data->instagram)) {
        $updates[] = "instagram = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->instagram)));
    }

    if (isset($data->brandName)) {
        $updates[] = "brand_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->brandName)));
    }

    if (isset($data->is_public)) {
        $updates[] = "is_public = ?";
        $params[] = intval($data->is_public) ? 1 : 0;
    }

    if (isset($data->country)) {
        $updates[] = "country = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->country)));
    }

    if (isset($data->realName)) {
        $updates[] = "real_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->realName)));
    }

    if (isset($data->nameEn)) {
        $updates[] = "name_en = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->nameEn)));
    }

    if (isset($data->businessNumber) || isset($data->business_no)) {
        $biz_val = isset($data->businessNumber) ? $data->businessNumber : $data->business_no;
        $updates[] = "business_no = ?";
        $params[] = htmlspecialchars(strip_tags(trim($biz_val)));
    }

    // Vendor-specific fields
    if (isset($data->company_name)) {
        $updates[] = "company_name = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->company_name)));
    }

    if (isset($data->address)) {
        $updates[] = "address = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->address)));
    }

    if (isset($data->website)) {
        $updates[] = "website = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->website)));
    }

    if (isset($data->categories)) {
        $updates[] = "categories = ?";
        $params[] = htmlspecialchars(strip_tags(trim($data->categories)));
    }

    if (isset($data->keywords)) {
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

    // Fetch updated user data to return (columns guaranteed by session migration)
    $base_cols = "id, name, email, role, status, phone, business_no, profile_image, venue_limit, category, instagram, description, brand_name, real_name, is_public, country, name_en, keywords, company_name, address, website, categories";

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
    error_log('[update_profile] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "프로필 업데이트 중 오류가 발생했습니다."]);
}
?>