<?php
include_once '../db_connect.php';
include_once '../utils/geocode.php';
session_start();

// Configure upload limits (try to override server settings)
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '1024M');
@ini_set('max_execution_time', '300');

// Allow admin, superadmin, or vendor
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin', 'vendor'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method Not Allowed."));
    exit;
}

// Get POST data
$name = isset($_POST['name']) ? htmlspecialchars(strip_tags($_POST['name'])) : null;
$location = isset($_POST['location']) ? htmlspecialchars(strip_tags($_POST['location'])) : null;
$price = isset($_POST['price']) ? htmlspecialchars(strip_tags($_POST['price'])) : null;
$commission_rate = isset($_POST['commission_rate']) ? floatval($_POST['commission_rate']) : 0;
$description = isset($_POST['description']) ? htmlspecialchars(strip_tags($_POST['description'])) : '';
$type = isset($_POST['type']) ? htmlspecialchars(strip_tags($_POST['type'])) : 'popup';
$size = isset($_POST['size']) ? htmlspecialchars(strip_tags($_POST['size'])) : 'medium';
$pricing_unit = isset($_POST['pricing_unit']) ? htmlspecialchars(strip_tags($_POST['pricing_unit'])) : 'daily';
$recruitment_deadline = isset($_POST['recruitment_deadline']) && $_POST['recruitment_deadline'] !== '' ? $_POST['recruitment_deadline'] : null;
$recruitment_closed = isset($_POST['recruitment_closed']) ? intval($_POST['recruitment_closed']) : 0;
$max_sellers = isset($_POST['max_sellers']) ? intval($_POST['max_sellers']) : 0;
$region = isset($_POST['region']) ? htmlspecialchars(strip_tags($_POST['region'])) : '';
$recruitment_start = isset($_POST['recruitment_start']) && $_POST['recruitment_start'] !== '' ? $_POST['recruitment_start'] : null;
$recruitment_end = isset($_POST['recruitment_end']) && $_POST['recruitment_end'] !== '' ? $_POST['recruitment_end'] : null;
$event_start = isset($_POST['event_start']) && $_POST['event_start'] !== '' ? $_POST['event_start'] : null;
$event_end = isset($_POST['event_end']) && $_POST['event_end'] !== '' ? $_POST['event_end'] : null;
$event_periods = isset($_POST['event_periods']) ? $_POST['event_periods'] : null;
$avg_sales = isset($_POST['avg_sales']) ? htmlspecialchars(strip_tags($_POST['avg_sales'])) : '';
$popular_categories = isset($_POST['popular_categories']) ? $_POST['popular_categories'] : '[]';

// Auto-extract region from address if not provided
if (empty($region) && !empty($location)) {
    $region_map = [
        '서울' => '서울특별시',
        '경기' => '경기도',
        '인천' => '인천광역시',
        '부산' => '부산광역시',
        '대구' => '대구광역시',
        '광주' => '광주광역시',
        '대전' => '대전광역시',
        '울산' => '울산광역시',
        '세종' => '세종특별자치시',
        '제주' => '제주특별자치도',
        '강원' => '강원도',
        '충북' => '충청북도',
        '충남' => '충청남도',
        '전북' => '전라북도',
        '전남' => '전라남도',
        '경북' => '경상북도',
        '경남' => '경상남도'
    ];
    foreach ($region_map as $short => $full) {
        if (strpos($location, $full) === 0 || strpos($location, $short) === 0) {
            $region = $full;
            break;
        }
    }
}

// Validate commission_rate (0-100)
if ($commission_rate < 0)
    $commission_rate = 0;
if ($commission_rate > 100)
    $commission_rate = 100;

// Validate pricing_unit
if (!in_array($pricing_unit, ['daily', 'weekly', 'monthly'])) {
    $pricing_unit = 'daily';
}

if ($name && $location && ($price !== null && $price !== '')) {

    $owner_id = $_SESSION['user_id'];
    $role = $_SESSION['user_role'];

    // Enforce Venue Limit for Vendors
    if ($role === 'vendor') {
        try {
            $limit_stmt = $conn->prepare("SELECT venue_limit FROM users WHERE id = ?");
            $limit_stmt->execute([$owner_id]);
            $user_limit = $limit_stmt->fetchColumn();
            $limit = ($user_limit !== false && $user_limit !== null) ? $user_limit : 3;

            $count_stmt = $conn->prepare("SELECT COUNT(*) FROM venues WHERE owner_id = ?");
            $count_stmt->execute([$owner_id]);
            $current_count = $count_stmt->fetchColumn();

            if ($current_count >= $limit) {
                echo json_encode(array("success" => false, "message" => "베뉴 등록 한도({$limit}개)를 초과했습니다."));
                exit;
            }
        } catch (PDOException $e) {
            echo json_encode(array("success" => false, "message" => "한도 확인 중 오류가 발생했습니다."));
            exit;
        }
    }

    // Handle File Uploads
    $uploaded_images = [];

    // Use DOCUMENT_ROOT for reliable path resolution
    $doc_root = rtrim($_SERVER['DOCUMENT_ROOT'], '/\\');
    $upload_dir = $doc_root . '/spacematch/uploads/venues/';

    // Fallback to relative path if DOCUMENT_ROOT fails
    if (!$doc_root || $doc_root === '') {
        $upload_dir = '../../uploads/venues/';
    }

    // Create directory if not exists
    if (!file_exists($upload_dir)) {
        $created = @mkdir($upload_dir, 0777, true);
        if (!$created) {
            error_log("[add_venue] Failed to create upload dir: $upload_dir");
            // Try relative path as fallback
            $upload_dir = '../../uploads/venues/';
            if (!file_exists($upload_dir)) {
                @mkdir($upload_dir, 0777, true);
            }
        }
    }

    error_log("[add_venue] Upload dir: $upload_dir | exists: " . (file_exists($upload_dir) ? 'yes' : 'no'));

    if (isset($_FILES['images'])) {
        $file_count = count($_FILES['images']['name']);
        error_log("[add_venue] Received $file_count image(s) for upload");

        for ($i = 0; $i < $file_count; $i++) {
            $file_name = $_FILES['images']['name'][$i];
            $file_tmp = $_FILES['images']['tmp_name'][$i];
            $file_error = $_FILES['images']['error'][$i];

            if ($file_error === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

                if (in_array($ext, $allowed)) {
                    $new_name = uniqid('venue_', true) . "." . $ext;
                    $destination = $upload_dir . $new_name;

                    if (move_uploaded_file($file_tmp, $destination)) {
                        $uploaded_images[] = "/spacematch/uploads/venues/" . $new_name;
                        error_log("[add_venue] Successfully uploaded: $new_name");
                    } else {
                        error_log("[add_venue] move_uploaded_file FAILED for: $file_name -> $destination");
                    }
                } else {
                    error_log("[add_venue] Rejected extension '$ext' for file: $file_name");
                }
            } else {
                error_log("[add_venue] Upload error code $file_error for file: $file_name");
            }
        }
    } else {
        error_log("[add_venue] No images received in \$_FILES");
    }

    $images_json = json_encode($uploaded_images);
    $status = in_array($role, ['admin', 'superadmin']) ? 'approved' : 'pending';

    try {
        // Auto-migrate: add size column if not exists
        $col_check = $conn->query("SHOW COLUMNS FROM venues LIKE 'size'");
        $has_size_column = $col_check->fetch() ? true : false;
        if (!$has_size_column) {
            $conn->exec("ALTER TABLE venues ADD COLUMN size VARCHAR(20) DEFAULT 'medium' AFTER type");
            $has_size_column = true;
        }

        // Auto-migrate: add commission_rate column if not exists
        $col_check2 = $conn->query("SHOW COLUMNS FROM venues LIKE 'commission_rate'");
        $has_commission_column = $col_check2->fetch() ? true : false;
        if (!$has_commission_column) {
            $conn->exec("ALTER TABLE venues ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0 AFTER price");
            $has_commission_column = true;
        }

        // Auto-migrate: add pricing_unit column if not exists
        $col_check_pu = $conn->query("SHOW COLUMNS FROM venues LIKE 'pricing_unit'");
        if (!$col_check_pu->fetch()) {
            $conn->exec("ALTER TABLE venues ADD COLUMN pricing_unit ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily' AFTER price");
        }

        // Build column and value lists dynamically
        $columns = "name, location, description, price, pricing_unit, type, images, owner_id, status";
        $values = ":name, :location, :description, :price, :pricing_unit, :type, :images, :owner_id, :status";

        if ($has_size_column) {
            $columns .= ", size";
            $values .= ", :size";
        }
        if ($has_commission_column) {
            $columns .= ", commission_rate";
            $values .= ", :commission_rate";
        }

        // Check for recruitment columns
        $col_check3 = $conn->query("SHOW COLUMNS FROM venues LIKE 'recruitment_deadline'");
        $has_deadline = $col_check3->fetch() ? true : false;
        $col_check4 = $conn->query("SHOW COLUMNS FROM venues LIKE 'recruitment_closed'");
        $has_closed = $col_check4->fetch() ? true : false;

        if ($has_deadline) {
            $columns .= ", recruitment_deadline";
            $values .= ", :recruitment_deadline";
        }
        if ($has_closed) {
            $columns .= ", recruitment_closed";
            $values .= ", :recruitment_closed";
        }

        // Check for max_sellers column
        $col_check5 = $conn->query("SHOW COLUMNS FROM venues LIKE 'max_sellers'");
        $has_max_sellers = $col_check5->fetch() ? true : false;
        if ($has_max_sellers) {
            $columns .= ", max_sellers";
            $values .= ", :max_sellers";
        }

        // Check for region column
        $col_check_region = $conn->query("SHOW COLUMNS FROM venues LIKE 'region'");
        $has_region = $col_check_region->fetch() ? true : false;
        if (!$has_region) {
            $conn->exec("ALTER TABLE venues ADD COLUMN region VARCHAR(50) DEFAULT '' AFTER location");
            $has_region = true;
        }

        // Auto-migrate: add new date columns if missing
        $date_cols = ['recruitment_start', 'recruitment_end', 'event_start', 'event_end'];
        foreach ($date_cols as $dc) {
            $dc_check = $conn->query("SHOW COLUMNS FROM venues LIKE '{$dc}'");
            if (!$dc_check->fetch()) {
                $conn->exec("ALTER TABLE venues ADD COLUMN {$dc} DATE DEFAULT NULL");
            }
        }
        // Add all 4 date columns to INSERT
        $columns .= ", recruitment_start, recruitment_end, event_start, event_end";
        $values .= ", :recruitment_start, :recruitment_end, :event_start, :event_end";

        // Auto-migrate: add event_periods column if missing
        $ep_check = $conn->query("SHOW COLUMNS FROM venues LIKE 'event_periods'");
        if (!$ep_check->fetch()) {
            $conn->exec("ALTER TABLE venues ADD COLUMN event_periods TEXT DEFAULT NULL");
        }
        $columns .= ", event_periods";
        $values .= ", :event_periods";

        // Check for lat/lng columns
        $col_lat = $conn->query("SHOW COLUMNS FROM venues LIKE 'latitude'");
        $has_lat = $col_lat->fetch() ? true : false;
        if (!$has_lat) {
            $conn->exec("ALTER TABLE venues ADD COLUMN latitude DECIMAL(10,7) DEFAULT NULL");
            $conn->exec("ALTER TABLE venues ADD COLUMN longitude DECIMAL(10,7) DEFAULT NULL");
        }

        // Geocode the address
        $latitude = null;
        $longitude = null;
        $coords = geocodeAddress($location);
        if ($coords) {
            $latitude = $coords['lat'];
            $longitude = $coords['lng'];
        }
        $columns .= ", latitude, longitude";
        $values .= ", :latitude, :longitude";

        // Auto-migrate: add avg_sales and popular_categories columns
        $col_avg = $conn->query("SHOW COLUMNS FROM venues LIKE 'avg_sales'");
        if (!$col_avg->fetch()) {
            $conn->exec("ALTER TABLE venues ADD COLUMN avg_sales VARCHAR(100) DEFAULT ''");
        }
        $columns .= ", avg_sales";
        $values .= ", :avg_sales";

        $col_pop = $conn->query("SHOW COLUMNS FROM venues LIKE 'popular_categories'");
        if (!$col_pop->fetch()) {
            $conn->exec("ALTER TABLE venues ADD COLUMN popular_categories TEXT DEFAULT NULL");
        }
        $columns .= ", popular_categories";
        $values .= ", :popular_categories";

        $query = "INSERT INTO venues ({$columns}" . ($has_region ? ', region' : '') . ") VALUES ({$values}" . ($has_region ? ', :region' : '') . ")";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":location", $location);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":pricing_unit", $pricing_unit);
        $stmt->bindParam(":type", $type);
        if ($has_size_column) {
            $stmt->bindParam(":size", $size);
        }
        if ($has_commission_column) {
            $stmt->bindParam(":commission_rate", $commission_rate);
        }
        if ($has_deadline) {
            $stmt->bindParam(":recruitment_deadline", $recruitment_deadline);
        }
        if ($has_closed) {
            $stmt->bindParam(":recruitment_closed", $recruitment_closed);
        }
        if ($has_max_sellers) {
            $stmt->bindParam(":max_sellers", $max_sellers);
        }
        $stmt->bindParam(":images", $images_json);
        $stmt->bindParam(":owner_id", $owner_id);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":latitude", $latitude);
        $stmt->bindParam(":longitude", $longitude);
        if ($has_region) {
            $stmt->bindParam(":region", $region);
        }
        $stmt->bindParam(":recruitment_start", $recruitment_start);
        $stmt->bindParam(":recruitment_end", $recruitment_end);
        $stmt->bindParam(":event_start", $event_start);
        $stmt->bindParam(":event_end", $event_end);
        $stmt->bindParam(":event_periods", $event_periods);
        $stmt->bindParam(":avg_sales", $avg_sales);
        $stmt->bindParam(":popular_categories", $popular_categories);

        if ($stmt->execute()) {
            // [NOTIFICATION] Notify admins when a vendor registers a new venue
            if ($status === 'pending') {
                try {
                    $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                        message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                    $adminQuery = "SELECT id FROM users WHERE role IN ('admin', 'superadmin')";
                    $admins = $conn->query($adminQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $vendorName = $_SESSION['user_name'] ?? '벤더';
                    $notifMsg = "{$vendorName}님이 새 베뉴 '{$name}'을(를) 등록했습니다. 승인 대기 중입니다.";
                    $notifLink = "/admin/venues";

                    $notifSql = "INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'venue_new', ?, ?, NOW())";
                    $notifStmt = $conn->prepare($notifSql);
                    foreach ($admins as $admin) {
                        $notifStmt->execute([$admin['id'], $notifMsg, $notifLink]);
                    }
                } catch (Exception $e) {
                    // Don't block venue creation if notification fails
                }
            }

            echo json_encode(array("success" => true, "message" => "베뉴가 등록되었습니다.", "id" => $conn->lastInsertId()));
        } else {
            echo json_encode(array("success" => false, "message" => "베뉴 등록에 실패했습니다."));
        }
    } catch (PDOException $e) {
        echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
    }

} else {
    echo json_encode(array("success" => false, "message" => "필수 정보가 누락되었습니다."));
}
?>