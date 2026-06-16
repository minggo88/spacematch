<?php
/**
 * Chat Permission Check API
 * 
 * GET ?target_id=N → Check if current user can chat with target user
 * Returns: { allowed: bool, reason: string }
 * 
 * Rules:
 * - vendor↔vendor: BLOCKED (community only)
 * - seller↔seller: BLOCKED
 * - anyone→admin: ALLOWED (CS)
 * - vendor→seller: allowed if contact unlocked OR application approved
 * - seller→vendor: allowed if contact unlocked OR application approved
 */
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);
$user_role = $_SESSION['user_role'] ?? '';
$target_id = intval($_GET['target_id'] ?? 0);

if ($target_id <= 0 || $target_id === $user_id) {
    echo json_encode(["success" => true, "allowed" => false, "reason" => "invalid_target"]);
    exit;
}

try {
    // Get target user role
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$target_id]);
    $target_role = $stmt->fetchColumn();

    if (!$target_role) {
        echo json_encode(["success" => true, "allowed" => false, "reason" => "user_not_found"]);
        exit;
    }

    $is_admin = in_array($user_role, ['admin', 'superadmin']);
    $target_is_admin = in_array($target_role, ['admin', 'superadmin']);

    // Admin can chat with anyone
    if ($is_admin) {
        echo json_encode(["success" => true, "allowed" => true, "reason" => "admin"]);
        exit;
    }

    // Anyone can chat with admin (CS)
    if ($target_is_admin) {
        echo json_encode(["success" => true, "allowed" => true, "reason" => "cs_inquiry"]);
        exit;
    }

    // Same role → blocked
    if ($user_role === $target_role) {
        echo json_encode(["success" => true, "allowed" => false, "reason" => "same_role"]);
        exit;
    }

    // seller↔host: always allowed
    $is_seller_host = ($user_role === 'seller' && $target_role === 'host') || ($user_role === 'host' && $target_role === 'seller');
    if ($is_seller_host) {
        echo json_encode(["success" => true, "allowed" => true, "reason" => "seller_host"]);
        exit;
    }

    // vendor→seller or seller→vendor: check relationship
    $allowed = false;
    $reason = "no_relationship";

    // Determine who is vendor and who is seller
    $host_id = ($user_role === 'host') ? $user_id : $target_id;
    $seller_id = ($user_role === 'seller') ? $user_id : $target_id;

    // Check 1: Contact unlocked (vendor viewed seller's contact)
    $viewStmt = $conn->prepare("SELECT id FROM seller_contact_views WHERE host_id = ? AND seller_id = ?");
    $viewStmt->execute([$host_id, $seller_id]);
    if ($viewStmt->fetch()) {
        $allowed = true;
        $reason = "contact_unlocked";
    }

    // Check 2: Seller viewed vendor's contact (if seller_vendor system exists)
    if (!$allowed) {
        try {
            $viewStmt2 = $conn->prepare("SELECT id FROM vendor_contact_views WHERE seller_id = ? AND host_id = ?");
            $viewStmt2->execute([$seller_id, $host_id]);
            if ($viewStmt2->fetch()) {
                $allowed = true;
                $reason = "vendor_contact_unlocked";
            }
        } catch (PDOException $e) {
            // Table may not exist yet
        }
    }

    // Check 3: Approved application relationship
    if (!$allowed) {
        $appStmt = $conn->prepare("
            SELECT a.id FROM applications a
            JOIN venues v ON a.venue_id = v.id
            WHERE a.user_id = ? AND v.owner_id = ? AND a.status = 'approved'
            LIMIT 1
        ");
        $appStmt->execute([$seller_id, $host_id]);
        if ($appStmt->fetch()) {
            $allowed = true;
            $reason = "application_approved";
        }
    }

    echo json_encode([
        "success" => true,
        "allowed" => $allowed,
        "reason" => $reason
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[chat_permission] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "시스템 오류가 발생했습니다."]);
}
?>