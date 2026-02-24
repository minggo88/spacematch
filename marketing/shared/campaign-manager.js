/**
 * Space Match 공통 — 캠페인 통합 관리
 * 
 * 셀러/벤더 양측의 마케팅 캠페인을 통합 관리합니다.
 * 캠페인 상태 관리, 스케줄링, 성과 집계, 이력 추적을 지원합니다.
 */

// ── 캠페인 상태 머신 ──
export const CAMPAIGN_STATES = {
    DRAFT: { id: 'draft', label: '초안', icon: '📝', transitions: ['review', 'archived'] },
    REVIEW: { id: 'review', label: '검토 중', icon: '🔍', transitions: ['approved', 'draft'] },
    APPROVED: { id: 'approved', label: '승인', icon: '✅', transitions: ['scheduled', 'draft'] },
    SCHEDULED: { id: 'scheduled', label: '예약됨', icon: '📅', transitions: ['active', 'paused', 'cancelled'] },
    ACTIVE: { id: 'active', label: '진행 중', icon: '🟢', transitions: ['paused', 'completed', 'cancelled'] },
    PAUSED: { id: 'paused', label: '일시정지', icon: '⏸️', transitions: ['active', 'cancelled'] },
    COMPLETED: { id: 'completed', label: '완료', icon: '🏁', transitions: ['archived'] },
    CANCELLED: { id: 'cancelled', label: '취소', icon: '❌', transitions: ['archived'] },
    ARCHIVED: { id: 'archived', label: '보관', icon: '📦', transitions: [] },
};

// ── 캠페인 타입 (셀러 + 벤더 통합) ──
export const UNIFIED_CAMPAIGN_TYPES = {
    // 셀러 캠페인
    SELLER_COUPON: { id: 'seller_coupon', label: '쿠폰', side: 'seller', icon: '🎟️' },
    SELLER_FLASH_SALE: { id: 'seller_flash_sale', label: '타임세일', side: 'seller', icon: '⏰' },
    SELLER_BUNDLE: { id: 'seller_bundle', label: '번들딜', side: 'seller', icon: '📦' },
    SELLER_EMAIL: { id: 'seller_email', label: '이메일', side: 'seller', icon: '📧' },
    SELLER_RETARGET: { id: 'seller_retarget', label: '리타겟팅', side: 'seller', icon: '🔄' },
    // 벤더 캠페인
    VENDOR_AD: { id: 'vendor_ad', label: '광고', side: 'vendor', icon: '📢' },
    VENDOR_SPONSORED: { id: 'vendor_sponsored', label: '스폰서', side: 'vendor', icon: '🥇' },
    VENDOR_BANNER: { id: 'vendor_banner', label: '배너', side: 'vendor', icon: '🖼️' },
    VENDOR_PARTNERSHIP: { id: 'vendor_partnership', label: '파트너십', side: 'vendor', icon: '🤝' },
};

// ── 통합 캠페인 생성 ──
export function createCampaign({
    name,
    type,
    ownerId,
    ownerType = 'seller', // seller | vendor
    description = '',
    budget = { total: 0, daily: 0 },
    schedule = {},
    targeting = {},
    settings = {},
}) {
    if (!name) throw new Error('캠페인 이름은 필수입니다');

    const campaignType = UNIFIED_CAMPAIGN_TYPES[type?.toUpperCase()] || Object.values(UNIFIED_CAMPAIGN_TYPES).find(t => t.id === type);

    return {
        id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name,
        type: campaignType?.id || type,
        typeLabel: campaignType?.label || type,
        side: campaignType?.side || ownerType,
        ownerId,
        ownerType,
        description,
        status: 'draft',
        budget: { total: budget.total, daily: budget.daily, spent: 0 },
        schedule: {
            startDate: schedule.startDate || null,
            endDate: schedule.endDate || null,
            timezone: schedule.timezone || 'Asia/Seoul',
        },
        targeting,
        settings,
        metrics: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        history: [{ action: 'created', timestamp: new Date().toISOString(), by: ownerId }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// ── 상태 전환 ──
export function transitionState(campaign, newState, userId = null) {
    const current = CAMPAIGN_STATES[campaign.status.toUpperCase()] || CAMPAIGN_STATES.DRAFT;
    const allowed = current.transitions;

    if (!allowed.includes(newState)) {
        throw new Error(`'${current.id}' → '${newState}' 전환은 허용되지 않습니다. 가능: [${allowed.join(', ')}]`);
    }

    return {
        ...campaign,
        status: newState,
        history: [...campaign.history, { action: `status_${newState}`, timestamp: new Date().toISOString(), by: userId }],
        updatedAt: new Date().toISOString(),
    };
}

// ── 스케줄 기반 자동 상태 업데이트 ──
export function autoUpdateCampaignStatus(campaign, now = new Date()) {
    if (campaign.status === 'scheduled' && campaign.schedule.startDate) {
        if (new Date(campaign.schedule.startDate) <= now) {
            return transitionState(campaign, 'active', 'system');
        }
    }
    if (campaign.status === 'active' && campaign.schedule.endDate) {
        if (new Date(campaign.schedule.endDate) <= now) {
            return transitionState(campaign, 'completed', 'system');
        }
    }
    // 예산 소진
    if (campaign.status === 'active' && campaign.budget.total > 0 && campaign.budget.spent >= campaign.budget.total) {
        return transitionState(campaign, 'completed', 'system');
    }
    return campaign;
}

// ── 전체 캠페인 목록 필터 ──
export function filterCampaigns(campaigns, filters = {}) {
    let result = [...campaigns];

    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.side) result = result.filter(c => c.side === filters.side);
    if (filters.type) result = result.filter(c => c.type === filters.type);
    if (filters.ownerId) result = result.filter(c => c.ownerId === filters.ownerId);
    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (filters.dateFrom) result = result.filter(c => c.createdAt >= filters.dateFrom);
    if (filters.dateTo) result = result.filter(c => c.createdAt <= filters.dateTo);

    const sortBy = filters.sortBy || 'createdAt';
    const sortDir = filters.sortDir === 'asc' ? 1 : -1;
    result.sort((a, b) => (a[sortBy] > b[sortBy] ? sortDir : -sortDir));

    return { campaigns: result, total: result.length };
}

// ── 캠페인 성과 집계 ──
export function aggregateCampaignPerformance(campaigns) {
    const active = campaigns.filter(c => c.status === 'active');
    const completed = campaigns.filter(c => c.status === 'completed');
    const all = [...active, ...completed];

    const totalSpend = all.reduce((s, c) => s + (c.budget.spent || 0), 0);
    const totalRevenue = all.reduce((s, c) => s + (c.metrics.revenue || 0), 0);
    const totalImpressions = all.reduce((s, c) => s + (c.metrics.impressions || 0), 0);
    const totalConversions = all.reduce((s, c) => s + (c.metrics.conversions || 0), 0);

    return {
        totalCampaigns: campaigns.length,
        activeCampaigns: active.length,
        completedCampaigns: completed.length,
        totalSpend,
        totalRevenue,
        overallROI: totalSpend > 0 ? Math.round(((totalRevenue - totalSpend) / totalSpend) * 10000) / 100 : 0,
        totalImpressions,
        totalConversions,
        avgCPA: totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0,
        bySide: {
            seller: all.filter(c => c.side === 'seller').length,
            vendor: all.filter(c => c.side === 'vendor').length,
        },
    };
}

export default {
    CAMPAIGN_STATES,
    UNIFIED_CAMPAIGN_TYPES,
    createCampaign,
    transitionState,
    autoUpdateCampaignStatus,
    filterCampaigns,
    aggregateCampaignPerformance,
};
