<?php
/**
 * 세션 user_role ↔ DB users.role 동기화 및 역할 정규화
 */
function sm_sync_session_role(PDO $conn)
{
    $role = isset($_SESSION['user_role']) ? trim((string) $_SESSION['user_role']) : '';
    if (!isset($_SESSION['user_id'])) {
        return $role;
    }
    try {
        $roleStmt = $conn->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
        $roleStmt->execute([$_SESSION['user_id']]);
        $rrow = $roleStmt->fetch(PDO::FETCH_ASSOC);
        if ($rrow && array_key_exists('role', $rrow) && $rrow['role'] !== null && $rrow['role'] !== '') {
            $role = trim((string) $rrow['role']);
            $_SESSION['user_role'] = $role;
        }
    } catch (Exception $e) { /* keep session role */
    }
    return $role;
}

function sm_normalize_role($role)
{
    return strtolower(str_replace('super_admin', 'superadmin', trim((string) $role)));
}

function sm_is_admin_role($roleNorm)
{
    return in_array($roleNorm, array('admin', 'superadmin'), true);
}

function sm_is_host_role($roleNorm)
{
    return $roleNorm === 'host';
}
