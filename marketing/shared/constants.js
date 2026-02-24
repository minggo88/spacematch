/**
 * Space Match 공통 - 마케팅 상수 & 설정
 * 
 * 마케팅 모듈 전반에서 사용하는 상수 및 설정값
 */

export const MARKETING_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ARCHIVED: 'archived',
};

export const CAMPAIGN_TYPES = {
    PROMOTION: 'promotion',
    BRANDING: 'branding',
    RETARGETING: 'retargeting',
    AWARENESS: 'awareness',
};

export const TARGET_AUDIENCE = {
    SELLER: 'seller',
    VENDOR: 'vendor',
    BOTH: 'both',
};

export const METRICS = {
    IMPRESSIONS: 'impressions',
    CLICKS: 'clicks',
    CONVERSIONS: 'conversions',
    REVENUE: 'revenue',
    ROI: 'roi',
    CTR: 'ctr',
    CVR: 'cvr',
};

export default {
    MARKETING_STATUS,
    CAMPAIGN_TYPES,
    TARGET_AUDIENCE,
    METRICS,
};
