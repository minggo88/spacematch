/**
 * Space Match 공통 — 알림 서비스
 * 
 * 마케팅 이벤트 기반 알림 생성, 채널 라우팅, 발송 관리를 수행합니다.
 * 인앱, 이메일, 푸시, SMS 채널을 지원합니다.
 */

// ── 알림 채널 ──
export const NOTIFICATION_CHANNELS = {
    IN_APP: { id: 'in_app', label: '인앱', icon: '🔔', priority: 1 },
    EMAIL: { id: 'email', label: '이메일', icon: '📧', priority: 2 },
    PUSH: { id: 'push', label: '푸시', icon: '📱', priority: 3 },
    SMS: { id: 'sms', label: 'SMS', icon: '💬', priority: 4 },
};

// ── 알림 유형 ──
export const NOTIFICATION_TYPES = {
    // 캠페인 관련
    CAMPAIGN_STARTED: { id: 'campaign_started', label: '캠페인 시작', channels: ['in_app', 'email'], severity: 'info' },
    CAMPAIGN_ENDED: { id: 'campaign_ended', label: '캠페인 종료', channels: ['in_app', 'email'], severity: 'info' },
    CAMPAIGN_BUDGET_LOW: { id: 'campaign_budget_low', label: '예산 부족', channels: ['in_app', 'email', 'push'], severity: 'warning' },
    CAMPAIGN_GOAL_MET: { id: 'campaign_goal_met', label: '목표 달성', channels: ['in_app', 'email', 'push'], severity: 'success' },
    // 매칭 관련
    NEW_MATCH: { id: 'new_match', label: '새 매칭', channels: ['in_app', 'push'], severity: 'info' },
    MATCH_CONFIRMED: { id: 'match_confirmed', label: '매칭 확정', channels: ['in_app', 'email', 'push'], severity: 'success' },
    // 프로모션 관련
    COUPON_EXPIRING: { id: 'coupon_expiring', label: '쿠폰 만료 임박', channels: ['in_app', 'push'], severity: 'warning' },
    FLASH_SALE_START: { id: 'flash_sale_start', label: '타임세일 시작', channels: ['in_app', 'push'], severity: 'info' },
    // 성과 관련
    MILESTONE_REACHED: { id: 'milestone_reached', label: '마일스톤 달성', channels: ['in_app', 'email'], severity: 'success' },
    PERFORMANCE_ALERT: { id: 'performance_alert', label: '성과 이상', channels: ['in_app', 'email'], severity: 'warning' },
    // 리뷰 관련
    NEW_REVIEW: { id: 'new_review', label: '새 리뷰', channels: ['in_app'], severity: 'info' },
    NEGATIVE_REVIEW: { id: 'negative_review', label: '부정적 리뷰', channels: ['in_app', 'email'], severity: 'warning' },
};

// ── 알림 생성 ──
export function createNotification({
    type,
    recipientId,
    recipientType = 'seller', // seller | vendor | admin
    title = '',
    message = '',
    data = {},
    channels = null,
    lang = 'ko',
}) {
    const notifType = NOTIFICATION_TYPES[type?.toUpperCase()] || Object.values(NOTIFICATION_TYPES).find(t => t.id === type);
    if (!notifType && !title) throw new Error('유효한 알림 유형 또는 제목이 필요합니다');

    return {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: notifType?.id || type,
        typeLabel: notifType?.label || type,
        severity: notifType?.severity || 'info',
        recipientId,
        recipientType,
        title: title || notifType?.label || '',
        message,
        data,
        channels: channels || notifType?.channels || ['in_app'],
        status: 'pending',
        read: false,
        lang,
        createdAt: new Date().toISOString(),
        sentAt: null,
        readAt: null,
    };
}

// ── 배치 알림 생성 ──
export function createBatchNotifications(type, recipientIds, messageTemplate, data = {}) {
    return recipientIds.map(recipientId =>
        createNotification({
            type,
            recipientId,
            message: typeof messageTemplate === 'function' ? messageTemplate(recipientId) : messageTemplate,
            data,
        })
    );
}

// ── 알림 우선순위 정렬 ──
export function prioritizeNotifications(notifications) {
    const severityOrder = { success: 1, warning: 2, info: 3 };
    return [...notifications].sort((a, b) => {
        const aSev = severityOrder[a.severity] || 3;
        const bSev = severityOrder[b.severity] || 3;
        if (aSev !== bSev) return aSev - bSev;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

// ── 알림 통계 ──
export function getNotificationStats(notifications) {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const byType = {};
    const bySeverity = { success: 0, warning: 0, info: 0 };

    notifications.forEach(n => {
        byType[n.type] = (byType[n.type] || 0) + 1;
        bySeverity[n.severity] = (bySeverity[n.severity] || 0) + 1;
    });

    return { total, unread, readRate: total > 0 ? Math.round(((total - unread) / total) * 10000) / 100 : 0, byType, bySeverity };
}

// ── 사용자 알림 설정 ──
export function createNotificationPreferences(userId) {
    return {
        userId,
        channels: {
            in_app: { enabled: true, quiet_hours: null },
            email: { enabled: true, digest: 'daily', quiet_hours: null },
            push: { enabled: true, quiet_hours: { start: '22:00', end: '08:00' } },
            sms: { enabled: false, quiet_hours: null },
        },
        types: Object.fromEntries(
            Object.keys(NOTIFICATION_TYPES).map(key => [key, { enabled: true }])
        ),
    };
}

// ── 알림 발송 가능 여부 판단 ──
export function shouldSendNotification(notification, preferences) {
    if (!preferences) return true;

    // 유형별 비활성화 확인
    const typeKey = notification.type?.toUpperCase();
    if (preferences.types?.[typeKey]?.enabled === false) return false;

    // 채널별 확인
    const activeChannels = notification.channels.filter(ch => {
        const chPref = preferences.channels?.[ch];
        if (!chPref?.enabled) return false;

        // 방해 금지 시간 확인
        if (chPref.quiet_hours) {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const { start, end } = chPref.quiet_hours;
            if (start < end) {
                if (currentTime >= start && currentTime < end) return false;
            } else {
                if (currentTime >= start || currentTime < end) return false;
            }
        }
        return true;
    });

    return activeChannels.length > 0;
}

export default {
    NOTIFICATION_CHANNELS,
    NOTIFICATION_TYPES,
    createNotification,
    createBatchNotifications,
    prioritizeNotifications,
    getNotificationStats,
    createNotificationPreferences,
    shouldSendNotification,
};
