<?php
// Security Audit API — Superadmin only
// Returns server-side security check results and can apply fixes
include_once '../db_connect.php';
session_start();

// Only superadmin can run security audits
if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Superadmin only']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$api_dir = __DIR__ . '/..';
$public_dir = realpath($api_dir . '/..') ?: dirname($api_dir);

// ═══════════════════════════════════
// GET: Run security audit checks
// ═══════════════════════════════════
if ($method === 'GET') {
    $checks = [];

    // ─── CHECK 1: .htaccess exists in /api directory ───
    $htaccess_api = $api_dir . '/.htaccess';
    $htaccess_exists = file_exists($htaccess_api);
    $htaccess_content = $htaccess_exists ? file_get_contents($htaccess_api) : '';
    $htaccess_blocks_php = $htaccess_exists && (
        strpos($htaccess_content, 'db_connect') !== false ||
        strpos($htaccess_content, 'deny from all') !== false ||
        strpos($htaccess_content, 'Require all denied') !== false
    );
    $checks[] = [
        'id' => 'htaccess_api',
        'category' => 'access_control',
        'severity' => 'critical',
        'title' => 'API 디렉토리 .htaccess 보호',
        'description' => 'db_connect.php 등 민감한 파일에 대한 직접 접근 차단',
        'status' => $htaccess_exists && $htaccess_blocks_php ? 'pass' : 'fail',
        'detail' => !$htaccess_exists
            ? '.htaccess 파일이 존재하지 않습니다'
            : ($htaccess_blocks_php ? '보호 규칙이 적용되어 있습니다' : 'db_connect.php 접근 차단 규칙이 없습니다'),
        'fixable' => true,
        'fix_id' => 'create_htaccess',
    ];

    // ─── CHECK 2: db_connect.php direct access test ───
    $checks[] = [
        'id' => 'db_connect_access',
        'category' => 'access_control',
        'severity' => 'critical',
        'title' => 'DB 연결 파일 직접 접근 차단',
        'description' => 'db_connect.php가 브라우저에서 직접 접근 불가한지 확인',
        'status' => $htaccess_exists && $htaccess_blocks_php ? 'pass' : 'fail',
        'detail' => $htaccess_exists && $htaccess_blocks_php
            ? 'db_connect.php 접근이 차단되어 있습니다'
            : '⚠️ db_connect.php에 직접 접근 가능 — DB 비밀번호 유출 위험',
        'fixable' => true,
        'fix_id' => 'create_htaccess',
    ];

    // ─── CHECK 3: Upload directory has .htaccess (PHP execution prevention) ───
    $upload_htaccess_path = $public_dir . '/uploads/.htaccess';
    $upload_htaccess_exists = file_exists($upload_htaccess_path);
    $upload_htaccess_ok = false;
    if ($upload_htaccess_exists) {
        $content = file_get_contents($upload_htaccess_path);
        $upload_htaccess_ok = strpos($content, 'php_flag engine off') !== false
            || strpos($content, 'RemoveHandler .php') !== false
            || strpos($content, 'deny from all') !== false
            || strpos($content, 'SetHandler none') !== false;
    }
    $checks[] = [
        'id' => 'upload_php_block',
        'category' => 'file_upload',
        'severity' => 'critical',
        'title' => '업로드 폴더 PHP 실행 차단',
        'description' => '업로드된 파일에서 PHP 코드 실행을 방지',
        'status' => $upload_htaccess_ok ? 'pass' : 'fail',
        'detail' => $upload_htaccess_ok
            ? 'uploads/ 폴더에서 PHP 실행이 차단되어 있습니다'
            : '⚠️ uploads/ 폴더에서 PHP 파일 실행 가능 — 웹셸 위험',
        'fixable' => true,
        'fix_id' => 'create_upload_htaccess',
    ];

    // ─── CHECK 4: Security headers in db_connect.php ───
    $db_content = file_get_contents($api_dir . '/db_connect.php');
    $has_xframe = strpos($db_content, 'X-Frame-Options') !== false;
    $has_xcontent = strpos($db_content, 'X-Content-Type-Options') !== false;
    $has_xxss = strpos($db_content, 'X-XSS-Protection') !== false;
    $all_headers = $has_xframe && $has_xcontent && $has_xxss;
    $checks[] = [
        'id' => 'security_headers',
        'category' => 'headers',
        'severity' => 'medium',
        'title' => '보안 헤더 설정',
        'description' => 'X-Frame-Options, X-Content-Type-Options, X-XSS-Protection 헤더',
        'status' => $all_headers ? 'pass' : 'warn',
        'detail' => $all_headers
            ? '모든 보안 헤더가 적용되어 있습니다'
            : '일부 보안 헤더가 누락되어 있습니다',
        'fixable' => false,
    ];

    // ─── CHECK 5: Session security settings ───
    $has_httponly = strpos($db_content, 'httponly') !== false || strpos($db_content, 'cookie_httponly') !== false;
    $has_samesite = strpos($db_content, 'samesite') !== false || strpos($db_content, 'SameSite') !== false;
    $has_strict = strpos($db_content, 'use_strict_mode') !== false;
    $session_ok = $has_httponly && $has_samesite && $has_strict;
    $checks[] = [
        'id' => 'session_security',
        'category' => 'session',
        'severity' => 'high',
        'title' => '세션 보안 설정',
        'description' => 'HttpOnly, SameSite, Strict Mode 등 세션 쿠키 보안',
        'status' => $session_ok ? 'pass' : 'warn',
        'detail' => $session_ok
            ? '세션 보안이 올바르게 설정되어 있습니다'
            : '세션 보안 설정이 일부 누락되어 있습니다',
        'fixable' => false,
    ];

    // ─── CHECK 6: PDO prepared statements (check for raw query patterns) ───
    $dangerous_files = [];
    $php_files = glob($api_dir . '/*/*.php');
    $php_files = array_merge($php_files ?: [], glob($api_dir . '/*.php') ?: []);
    foreach ($php_files as $file) {
        $content = file_get_contents($file);
        // Look for string concatenation in SQL queries (potential injection)
        if (preg_match('/\$conn->query\s*\(\s*"[^"]*\$[^"]*"/s', $content) ||
            preg_match('/\$conn->query\s*\(\s*\'[^\']*\$[^\']*\'/s', $content) ||
            preg_match('/\$conn->exec\s*\(\s*"[^"]*\$(?!conn)[^"]*"/s', $content)) {
            $basename = basename($file);
            if (!in_array($basename, ['db_connect.php'])) {
                $dangerous_files[] = basename(dirname($file)) . '/' . $basename;
            }
        }
    }
    $checks[] = [
        'id' => 'sql_injection',
        'category' => 'injection',
        'severity' => 'high',
        'title' => 'SQL Injection 방어',
        'description' => 'PDO 준비문(Prepared Statements) 사용 여부',
        'status' => count($dangerous_files) === 0 ? 'pass' : 'warn',
        'detail' => count($dangerous_files) === 0
            ? '모든 파일에서 안전한 쿼리 패턴 사용 중'
            : '⚠️ 변수가 직접 삽입된 쿼리 발견: ' . implode(', ', array_slice($dangerous_files, 0, 5)),
        'fixable' => false,
    ];

    // ─── CHECK 7: Error message exposure ───
    $error_exposure_files = [];
    foreach ($php_files as $file) {
        $content = file_get_contents($file);
        if (preg_match('/\$e->getMessage\(\)/', $content) && preg_match('/json_encode.*getMessage/', $content)) {
            $error_exposure_files[] = basename(dirname($file)) . '/' . basename($file);
        }
    }
    $checks[] = [
        'id' => 'error_exposure',
        'category' => 'information',
        'severity' => 'medium',
        'title' => 'DB 에러 메시지 노출',
        'description' => 'PDOException 메시지가 클라이언트에 직접 노출되는지 확인',
        'status' => count($error_exposure_files) === 0 ? 'pass' : 'warn',
        'detail' => count($error_exposure_files) === 0
            ? '에러 메시지가 안전하게 처리되고 있습니다'
            : '⚠️ DB 에러 메시지 노출 파일 (' . count($error_exposure_files) . '개): ' . implode(', ', array_slice($error_exposure_files, 0, 5)),
        'fixable' => false,
    ];

    // ─── CHECK 8: Directory listing prevention ───
    $main_htaccess = $public_dir . '/.htaccess';
    $main_htaccess_exists = file_exists($main_htaccess);
    $dir_listing_blocked = false;
    if ($main_htaccess_exists) {
        $content = file_get_contents($main_htaccess);
        $dir_listing_blocked = strpos($content, 'Indexes') !== false;
    }
    $checks[] = [
        'id' => 'directory_listing',
        'category' => 'access_control',
        'severity' => 'medium',
        'title' => '디렉토리 목록 노출 차단',
        'description' => '서버 디렉토리의 파일 목록이 브라우저에 노출되지 않도록 설정',
        'status' => $dir_listing_blocked ? 'pass' : 'warn',
        'detail' => $dir_listing_blocked
            ? '디렉토리 목록 노출이 차단되어 있습니다'
            : 'Options -Indexes 설정이 확인되지 않았습니다',
        'fixable' => true,
        'fix_id' => 'create_main_htaccess',
    ];

    // ─── CHECK 9: File upload MIME type validation ───
    $upload_files_checked = 0;
    $upload_files_safe = 0;
    $upload_check_files = [
        'venues/add_venue.php', 'venues/update_venue.php',
        'popups/popups.php', 'ads/create_ad.php', 'ads/update_ad.php',
        'users/upload_profile_image.php', 'users/upload_seller_photos.php',
        'community/community_posts.php', 'applications/submit_application.php'
    ];
    foreach ($upload_check_files as $uf) {
        $path = $api_dir . '/' . $uf;
        if (file_exists($path)) {
            $upload_files_checked++;
            $content = file_get_contents($path);
            if (strpos($content, 'finfo_file') !== false || strpos($content, 'getimagesize') !== false || strpos($content, 'mime_content_type') !== false) {
                $upload_files_safe++;
            }
        }
    }
    $checks[] = [
        'id' => 'upload_mime_check',
        'category' => 'file_upload',
        'severity' => 'high',
        'title' => '파일 업로드 MIME 타입 검증',
        'description' => '업로드 파일의 실제 MIME 타입을 확인하여 위장 파일 차단',
        'status' => ($upload_files_checked > 0 && $upload_files_safe === $upload_files_checked) ? 'pass' : 'warn',
        'detail' => "{$upload_files_safe}/{$upload_files_checked}개 파일에서 MIME 타입 검증 사용 중",
        'fixable' => false,
    ];

    // ─── CHECK 10: CORS configuration ───
    $cors_ok = strpos($db_content, 'Access-Control-Allow-Origin') !== false
        && strpos($db_content, 'allowed_origins') !== false;
    $wildcard_cors = strpos($db_content, "'*'") !== false && strpos($db_content, 'Allow-Origin: *') !== false;
    $checks[] = [
        'id' => 'cors_config',
        'category' => 'headers',
        'severity' => 'medium',
        'title' => 'CORS 설정',
        'description' => 'Cross-Origin Resource Sharing 정책이 적절하게 설정되어 있는지 확인',
        'status' => ($cors_ok && !$wildcard_cors) ? 'pass' : ($wildcard_cors ? 'fail' : 'warn'),
        'detail' => $wildcard_cors
            ? '⚠️ CORS가 와일드카드(*)로 설정되어 있어 모든 도메인에서 접근 가능'
            : ($cors_ok ? '허용된 도메인 목록으로 CORS가 설정되어 있습니다' : 'CORS 설정을 확인해주세요'),
        'fixable' => false,
    ];

    // ─── Summary ───
    $total = count($checks);
    $passed = count(array_filter($checks, fn($c) => $c['status'] === 'pass'));
    $failed = count(array_filter($checks, fn($c) => $c['status'] === 'fail'));
    $warned = count(array_filter($checks, fn($c) => $c['status'] === 'warn'));

    $score = $total > 0 ? round(($passed / $total) * 100) : 0;
    $grade = $score >= 90 ? 'A' : ($score >= 70 ? 'B' : ($score >= 50 ? 'C' : ($score >= 30 ? 'D' : 'F')));

    echo json_encode([
        'success' => true,
        'audit' => [
            'checks' => $checks,
            'summary' => [
                'total' => $total,
                'passed' => $passed,
                'failed' => $failed,
                'warned' => $warned,
                'score' => $score,
                'grade' => $grade,
            ],
            'timestamp' => date('Y-m-d H:i:s'),
        ]
    ]);

// ═══════════════════════════════════
// POST: Apply security fixes
// ═══════════════════════════════════
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $fix_id = $data['fix_id'] ?? '';
    $results = [];

    if ($fix_id === 'create_htaccess') {
        // Create .htaccess to protect db_connect.php
        $htaccess_content = "# Security: Block direct access to sensitive files\n";
        $htaccess_content .= "<FilesMatch \"^(db_connect|geocode)\\.php$\">\n";
        $htaccess_content .= "    <IfModule mod_authz_core.c>\n";
        $htaccess_content .= "        Require all denied\n";
        $htaccess_content .= "    </IfModule>\n";
        $htaccess_content .= "    <IfModule !mod_authz_core.c>\n";
        $htaccess_content .= "        Order Allow,Deny\n";
        $htaccess_content .= "        Deny from all\n";
        $htaccess_content .= "    </IfModule>\n";
        $htaccess_content .= "</FilesMatch>\n";

        $path = $api_dir . '/.htaccess';
        if (file_put_contents($path, $htaccess_content) !== false) {
            $results[] = ['fix_id' => 'create_htaccess', 'success' => true, 'message' => 'API 디렉토리 .htaccess가 생성되었습니다'];
        } else {
            $results[] = ['fix_id' => 'create_htaccess', 'success' => false, 'message' => '.htaccess 파일 생성 실패 (권한 확인 필요)'];
        }

    } elseif ($fix_id === 'create_upload_htaccess') {
        // Create .htaccess in uploads/ to prevent PHP execution
        $upload_dirs = ['uploads', 'uploads/venues', 'uploads/profiles', 'uploads/attachments', 'uploads/popups', 'uploads/ads', 'uploads/community', 'uploads/seller_photos'];
        $htaccess_content  = "# Security: Prevent PHP execution in upload directory\n";
        $htaccess_content .= "<IfModule mod_php.c>\n";
        $htaccess_content .= "    php_flag engine off\n";
        $htaccess_content .= "</IfModule>\n";
        $htaccess_content .= "<IfModule mod_php7.c>\n";
        $htaccess_content .= "    php_flag engine off\n";
        $htaccess_content .= "</IfModule>\n";
        $htaccess_content .= "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps .pht\n";
        $htaccess_content .= "AddType text/plain .php .phtml .php3 .php4 .php5 .php7 .phps .pht\n";
        $htaccess_content .= "\n# Only allow safe file types\n";
        $htaccess_content .= "<FilesMatch \"\\.(php|phtml|php[3-7]|phps|pht|cgi|pl|sh|py|rb|asp|aspx|jsp)$\">\n";
        $htaccess_content .= "    <IfModule mod_authz_core.c>\n";
        $htaccess_content .= "        Require all denied\n";
        $htaccess_content .= "    </IfModule>\n";
        $htaccess_content .= "    <IfModule !mod_authz_core.c>\n";
        $htaccess_content .= "        Order Allow,Deny\n";
        $htaccess_content .= "        Deny from all\n";
        $htaccess_content .= "    </IfModule>\n";
        $htaccess_content .= "</FilesMatch>\n";

        $success = true;
        foreach ($upload_dirs as $dir) {
            $dir_path = $public_dir . '/' . $dir;
            if (!is_dir($dir_path)) {
                @mkdir($dir_path, 0755, true);
            }
            $path = $dir_path . '/.htaccess';
            if (file_put_contents($path, $htaccess_content) === false) {
                $success = false;
            }
        }
        $results[] = [
            'fix_id' => 'create_upload_htaccess',
            'success' => $success,
            'message' => $success
                ? '모든 업로드 디렉토리에 PHP 실행 차단 .htaccess가 생성되었습니다'
                : '일부 디렉토리에 .htaccess 생성 실패'
        ];

    } elseif ($fix_id === 'create_main_htaccess') {
        // Add directory listing prevention
        $path = $public_dir . '/.htaccess';
        $existing = file_exists($path) ? file_get_contents($path) : '';

        if (strpos($existing, 'Indexes') === false) {
            $new_content = "# Security: Prevent directory listing\nOptions -Indexes\n\n" . $existing;
            if (file_put_contents($path, $new_content) !== false) {
                $results[] = ['fix_id' => 'create_main_htaccess', 'success' => true, 'message' => '디렉토리 목록 노출 차단이 설정되었습니다'];
            } else {
                $results[] = ['fix_id' => 'create_main_htaccess', 'success' => false, 'message' => '.htaccess 파일 수정 실패'];
            }
        } else {
            $results[] = ['fix_id' => 'create_main_htaccess', 'success' => true, 'message' => '이미 설정되어 있습니다'];
        }

    } elseif ($fix_id === 'fix_all') {
        // Apply all fixable items
        // This is handled client-side by calling each fix individually
        $results[] = ['fix_id' => 'fix_all', 'success' => false, 'message' => '개별 수정을 사용해주세요'];

    } else {
        $results[] = ['fix_id' => $fix_id, 'success' => false, 'message' => '알 수 없는 수정 항목'];
    }

    echo json_encode(['success' => true, 'results' => $results]);

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
