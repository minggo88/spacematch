<?php
/**
 * check_subscription.php
 * 
 * Checks if a user has an active subscription for a specific plan category.
 * 
 * GET params: ?category=입점 서비스  (optional, checks any active subscription if omitted)
 * 
 * Also exposes a reusable function: hasActiveSubscription($conn, $userId, $planCategory)
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

/**
 * Check if user has active confirmed subscription for a given plan category.
 * Returns array with subscription details or null if not active.
 */
function hasActiveSubscription($conn, $userId, $planCategory = null)
{
    try {
        $sql = "SELECT p.*, pp.name as plan_name, pp.category, pp.plan_type, pp.period, pp.amount as plan_amount
                FROM payments p
                JOIN payment_plans pp ON p.plan_id = pp.id
                WHERE p.user_id = ? AND p.status = 'confirmed'";
        $params = [$userId];

        if ($planCategory) {
            $sql .= " AND pp.category = ?";
            $params[] = $planCategory;
        }

        $sql .= " ORDER BY p.confirmed_at DESC LIMIT 1";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $subscription = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$subscription)
            return null;

        // Check expiry based on period
        $confirmedAt = strtotime($subscription['confirmed_at']);
        $now = time();
        $period = $subscription['period'] ?? 'monthly';

        switch ($period) {
            case 'monthly':
                $expiresAt = strtotime('+30 days', $confirmedAt);
                break;
            case 'yearly':
                $expiresAt = strtotime('+365 days', $confirmedAt);
                break;
            case 'once':
                // One-time payments never expire
                $expiresAt = strtotime('+100 years', $confirmedAt);
                break;
            default:
                $expiresAt = strtotime('+30 days', $confirmedAt);
        }

        if ($now > $expiresAt)
            return null; // Expired

        return [
            'active' => true,
            'plan_name' => $subscription['plan_name'],
            'category' => $subscription['category'],
            'plan_type' => $subscription['plan_type'],
            'period' => $period,
            'confirmed_at' => $subscription['confirmed_at'],
            'expires_at' => date('Y-m-d H:i:s', $expiresAt),
            'payment_id' => $subscription['id'],
        ];
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Check all subscription categories for a user.
 * Returns an object with each category's active status.
 */
function getAllSubscriptions($conn, $userId)
{
    $categories = ['입점 서비스', '마케팅 서비스', '프리미엄 서비스', '기타'];
    $result = [];
    foreach ($categories as $cat) {
        $sub = hasActiveSubscription($conn, $userId, $cat);
        $result[$cat] = $sub ? $sub : ['active' => false];
    }
    return $result;
}

// ─── API endpoint (when called directly) ───
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

$userId = $_SESSION['user_id'];
$category = $_GET['category'] ?? null;

if ($category) {
    $sub = hasActiveSubscription($conn, $userId, $category);

    // priority_viewing: if no plan with that exact category exists, fall back to
    // the standard admin-managed premium category ('프리미엄 서비스') so that hosts
    // who purchased the Premium plan are correctly granted access.
    if (!$sub && $category === 'priority_viewing') {
        $sub = hasActiveSubscription($conn, $userId, '프리미엄 서비스');
    }

    echo json_encode([
        'success' => true,
        'subscription' => $sub ?: ['active' => false],
    ]);
} else {
    echo json_encode([
        'success' => true,
        'subscriptions' => getAllSubscriptions($conn, $userId),
    ]);
}
?>