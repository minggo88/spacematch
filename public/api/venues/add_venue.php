<?php
include_once '../db_connect.php';
include_once '../utils/geocode.php';
include_once '../utils/session_role.php';
include_once '../notifications/send_email.php';
session_start();

// Configure upload limits (try to override server settings)
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '1024M');
@ini_set('max_execution_time', '300');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "로그인이 필요합니다."));
    exit;
}

$role = sm_sync_session_role($conn);
$roleNorm = sm_normalize_role($role);
if (!sm_is_admin_role($roleNorm) && !sm_is_host_role($roleNorm)) {
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
$name = isset($_POST['name']) ? strip_tags($_POST['name']) : null;
$location = isset($_POST['location']) ? strip_tags($_POST['location']) : null;
$price = isset($_POST['price']) ? strip_tags($_POST['price']) : null;
$commission_rate = isset($_POST['commission_rate']) ? floatval($_POST['commission_rate']) : 0;
$description = isset($_POST['description']) ? strip_tags($_POST['description']) : '';
$type = isset($_POST['type']) ? strip_tags($_POST['type']) : 'popup';
$size = isset($_POST['size']) ? strip_tags($_POST['size']) : 'medium';
$pricing_unit = isset($_POST['pricing_unit']) ? strip_tags($_POST['pricing_unit']) : 'daily';
$recruitment_deadline = isset($_POST['recruitment_deadline']) && $_POST['recruitment_deadline'] !== '' ? $_POST['recruitment_deadline'] : null;
$recruitment_closed = isset($_POST['recruitment_closed']) ? intval($_POST['recruitment_closed']) : 0;
$max_sellers = isset($_POST['max_sellers']) ? intval($_POST['max_sellers']) : 0;
$region = isset($_POST['region']) ? strip_tags($_POST['region']) : '';
$recruitment_start = isset($_POST['recruitment_start']) && $_POST['recruitment_start'] !== '' ? $_POST['recruitment_start'] : null;
$recruitment_end = isset($_POST['recruitment_end']) && $_POST['recruitment_end'] !== '' ? $_POST['recruitment_end'] : null;
$event_start = isset($_POST['event_start']) && $_POST['event_start'] !== '' ? $_POST['event_start'] : null;
$event_end = isset($_POST['event_end']) && $_POST['event_end'] !== '' ? $_POST['event_end'] : null;
$event_periods = isset($_POST['event_periods']) ? $_POST['event_periods'] : null;
$avg_sales = isset($_POST['avg_sales']) ? strip_tags($_POST['avg_sales']) : '';
$sales_unit = isset($_POST['sales_unit']) ? strip_tags($_POST['sales_unit']) : 'monthly';
$popular_categories = isset($_POST['popular_categories']) ? $_POST['popular_categories'] : '[]';
$target_customers = isset($_POST['target_customers']) ? $_POST['target_customers'] : '[]';

// Handle attachment file uploads
$attachment_paths = [];
if (isset($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
    $attachDir = __DIR__ . '/../../uploads/attachments/';
    if (!is_dir($attachDir)) {
        mkdir($attachDir, 0777, true);
    }
    for ($i = 0; $i < count($_FILES['attachments']['name']); $i++) {
        if ($_FILES['attachments']['error'][$i] === UPLOAD_ERR_OK) {
            $origName = basename($_FILES['attachments']['name'][$i]);
            $ext = pathinfo($origName, PATHINFO_EXTENSION);
            $uniqueName = 'att_' . time() . '_' . $i . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $destPath = $attachDir . $uniqueName;
            if (move_uploaded_file($_FILES['attachments']['tmp_name'][$i], $destPath)) {
                $attachment_paths[] = 'uploads/attachments/' . $uniqueName;
            }
        }
    }
}
$attachments_json = json_encode($attachment_paths);

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

    $owner_id = (int) $_SESSION['user_id'];
    $role = $roleNorm;

    // 관리자: 지정한 호스트(owner_id)에 등록 가능 (미지정 시 관리자 계정)
    if (sm_is_admin_role($roleNorm)) {
        $postedOwner = isset($_POST['owner_id']) ? (int) $_POST['owner_id'] : 0;
        if ($postedOwner > 0) {
            $ownChk = $conn->prepare("SELECT id FROM users WHERE id = ? AND role IN ('host') LIMIT 1");
            $ownChk->execute([$postedOwner]);
            if ($ownChk->fetch(PDO::FETCH_ASSOC)) {
                $owner_id = $postedOwner;
            }
        }
    }

    // Enforce Venue Limit for Vendors
    if (sm_is_host_role($roleNorm)) {
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
    $status = sm_is_admin_role($roleNorm) ? 'approved' : 'pending';

    try {
        // Auto-migrate: run DDL once per session
        if (empty($_SESSION['_ddl_venues_migrated'])) {
            $migrate_cols = [
                ['size', "ADD COLUMN size VARCHAR(20) DEFAULT 'medium' AFTER type"],
                ['commission_rate', "ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0 AFTER price"],
                ['pricing_unit', "ADD COLUMN pricing_unit ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily' AFTER price"],
                ['recruitment_deadline', "ADD COLUMN recruitment_deadline DATE DEFAULT NULL"],
                ['recruitment_closed', "ADD COLUMN recruitment_closed TINYINT(1) DEFAULT 0"],
                ['max_sellers', "ADD COLUMN max_sellers INT DEFAULT 0"],
                ['region', "ADD COLUMN region VARCHAR(50) DEFAULT '' AFTER location"],
                ['recruitment_start', "ADD COLUMN recruitment_start DATE DEFAULT NULL"],
                ['recruitment_end', "ADD COLUMN recruitment_end DATE DEFAULT NULL"],
                ['event_start', "ADD COLUMN event_start DATE DEFAULT NULL"],
                ['event_end', "ADD COLUMN event_end DATE DEFAULT NULL"],
                ['event_periods', "ADD COLUMN event_periods TEXT DEFAULT NULL"],
                ['latitude', "ADD COLUMN latitude DECIMAL(10,7) DEFAULT NULL"],
                ['longitude', "ADD COLUMN longitude DECIMAL(10,7) DEFAULT NULL"],
                ['avg_sales', "ADD COLUMN avg_sales VARCHAR(100) DEFAULT ''"],
                ['sales_unit', "ADD COLUMN sales_unit VARCHAR(20) DEFAULT 'monthly'"],
                ['popular_categories', "ADD COLUMN popular_categories TEXT DEFAULT NULL"],
                ['target_customers', "ADD COLUMN target_customers TEXT DEFAULT NULL"],
                ['attachments', "ADD COLUMN attachments TEXT DEFAULT NULL"],
                ['is_premium', "ADD COLUMN is_premium TINYINT(1) DEFAULT 0"],
            ];
            foreach ($migrate_cols as $mc) {
                try {
                    $chk = $conn->query("SHOW COLUMNS FROM venues LIKE '{$mc[0]}'");
                    if (!$chk->fetch()) {
                        $conn->exec("ALTER TABLE venues {$mc[1]}");
                    }
                } catch (Exception $e) { /* already exists */
                }
            }
            $_SESSION['_ddl_venues_migrated'] = true;
        }

        // Build column and value lists (all columns now guaranteed to exist)
        $columns = "name, location, description, price, pricing_unit, type, images, owner_id, status";
        $values = ":name, :location, :description, :price, :pricing_unit, :type, :images, :owner_id, :status";

        $columns .= ", size, commission_rate";
        $values .= ", :size, :commission_rate";

        $columns .= ", recruitment_deadline, recruitment_closed, max_sellers";
        $values .= ", :recruitment_deadline, :recruitment_closed, :max_sellers";

        $columns .= ", recruitment_start, recruitment_end, event_start, event_end, event_periods";
        $values .= ", :recruitment_start, :recruitment_end, :event_start, :event_end, :event_periods";

        // Geocode: 관리자 등록은 응답 속도 우선(외부 API 최대 5초 대기 제거)
        $latitude = null;
        $longitude = null;
        $isAdminCreate = sm_is_admin_role($roleNorm);
        if (!$isAdminCreate) {
            try {
                $coords = geocodeAddress($location);
                if ($coords) {
                    $latitude = $coords['lat'];
                    $longitude = $coords['lng'];
                }
            } catch (Exception $geoEx) {
                error_log('[add_venue] geocode: ' . $geoEx->getMessage());
            }
        }
        $columns .= ", latitude, longitude";
        $values .= ", :latitude, :longitude";

        $columns .= ", avg_sales, sales_unit, popular_categories, target_customers, attachments";
        $values .= ", :avg_sales, :sales_unit, :popular_categories, :target_customers, :attachments";
        // Check if vendor has active premium_space subscription
        $is_premium = 0;
        if (sm_is_host_role($roleNorm)) {
            try {
                $prem_stmt = $conn->prepare("SELECT p.id FROM payments p JOIN payment_plans pp ON p.plan_id = pp.id WHERE p.user_id = ? AND pp.category = 'premium_space' AND p.status = 'confirmed' ORDER BY p.created_at DESC LIMIT 1");
                $prem_stmt->execute([$owner_id]);
                if ($prem_stmt->fetch()) {
                    $is_premium = 1;
                }
            } catch (Exception $e) { /* ignore */
            }
        }
        $columns .= ", region, is_premium";
        $values .= ", :region, :is_premium";

        $query = "INSERT INTO venues ({$columns}) VALUES ({$values})";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":location", $location);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":price", $price);
        $stmt->bindParam(":pricing_unit", $pricing_unit);
        $stmt->bindParam(":type", $type);
        $stmt->bindParam(":size", $size);
        $stmt->bindParam(":commission_rate", $commission_rate);
        $stmt->bindParam(":recruitment_deadline", $recruitment_deadline);
        $stmt->bindParam(":recruitment_closed", $recruitment_closed);
        $stmt->bindParam(":max_sellers", $max_sellers);
        $stmt->bindParam(":images", $images_json);
        $stmt->bindParam(":owner_id", $owner_id);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":latitude", $latitude);
        $stmt->bindParam(":longitude", $longitude);
        $stmt->bindParam(":region", $region);
        $stmt->bindParam(":recruitment_start", $recruitment_start);
        $stmt->bindParam(":recruitment_end", $recruitment_end);
        $stmt->bindParam(":event_start", $event_start);
        $stmt->bindParam(":event_end", $event_end);
        $stmt->bindParam(":event_periods", $event_periods);
        $stmt->bindParam(":avg_sales", $avg_sales);
        $stmt->bindParam(":sales_unit", $sales_unit);
        $stmt->bindParam(":popular_categories", $popular_categories);
        $stmt->bindParam(":target_customers", $target_customers);
        $stmt->bindParam(":attachments", $attachments_json);
        $stmt->bindParam(":is_premium", $is_premium);

        if ($stmt->execute()) {
            $newVenueId = (int) $conn->lastInsertId();
            $response = array('success' => true, 'message' => '베뉴가 등록되었습니다.', 'id' => $newVenueId);

            // 관리자 등록: 알림·푸시·이메일·지오코딩 생략 후 즉시 JSON 반환
            if ($isAdminCreate) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($response);
                exit;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($response);
            if (function_exists('fastcgi_finish_request')) {
                @fastcgi_finish_request();
            }

            // [NOTIFICATION] Notify admins when a vendor registers a new venue
            if ($status === 'pending') {
                try {
                    if (empty($_SESSION['_ddl_notifications'])) {
                        $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                            message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
                        $_SESSION['_ddl_notifications'] = true;
                    }

                    $adminQuery = "SELECT id FROM users WHERE role IN ('admin', 'superadmin')";
                    $admins = $conn->query($adminQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $vendorName = $_SESSION['user_name'] ?? '호스트';
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

                // [EMAIL] Admin에게 새 베뉴 등록 이메일 알림 (다국어)
                try {
                    $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                    $adminIds = array_map(function ($a) {
                        return $a['id'];
                    }, $admins ?? []);
                    if (!empty($adminIds)) {
                        $_nm = $name;
                        $_rg = $region;
                        sendEmailToUsers(
                            $conn,
                            $adminIds,
                            '',
                            '',
                            'cat_venue',
                            function ($lang) use ($_nm, $_rg, $siteUrl) {
                                $subj = _t(['ko' => "새 베뉴 등록 대기: {$_nm}", 'en' => "New Venue Pending: {$_nm}", 'ja' => "新規スペース登録: {$_nm}", 'vi' => "Không gian mới đang chờ: {$_nm}", 'th' => "พื้นที่ใหม่รอดำเนินการ: {$_nm}"], $lang);
                                return ['subject' => $subj, 'html' => emailTemplateNewVenue($_nm, $_rg, $siteUrl, $lang)];
                            }
                        );
                    }
                } catch (Exception $emailErr) {
                    error_log("Email error (add_venue): " . $emailErr->getMessage());
                }
            }

            // [SPACE ALERTS] Notify subscribed sellers (클라이언트 응답 후 백그라운드)
            try {
                include_once __DIR__ . '/../notifications/trigger_alerts.php';
                triggerSpaceAlerts($conn, array(
                    'id' => $newVenueId,
                    'name' => $name,
                    'region' => $region,
                    'type' => $type,
                    'price' => $price,
                ));
            } catch (Exception $e) {
                // Don't block venue creation if alert fails
            }

            exit;
        } else {
            echo json_encode(array("success" => false, "message" => "베뉴 등록에 실패했습니다."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        error_log('[add_venue] ' . $e->getMessage());
        echo json_encode(array("success" => false, "message" => "공간 등록 중 오류가 발생했습니다."));
    }

} else {
    echo json_encode(array("success" => false, "message" => "필수 정보가 누락되었습니다."));
}
?>