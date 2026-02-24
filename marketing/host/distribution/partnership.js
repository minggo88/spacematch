/**
 * Space Match 벤더 마케팅 — 파트너십 관리
 * 
 * 외부 파트너(브랜드, 미디어, 이벤트 기획사 등)와의
 * 파트너십을 관리하고 시너지 기회를 평가합니다.
 */

// ── 파트너 유형 ──
export const PARTNER_TYPES = {
    BRAND: { id: 'brand', label: '브랜드 파트너', icon: '🏷️', description: '제품/서비스 브랜드와 공동 프로모션' },
    MEDIA: { id: 'media', label: '미디어 파트너', icon: '📰', description: '인플루언서, 미디어 채널 협업' },
    EVENT: { id: 'event', label: '이벤트 파트너', icon: '🎪', description: '이벤트 기획사, 공동 행사 운영' },
    PLATFORM: { id: 'platform', label: '플랫폼 파트너', icon: '🌐', description: '타 플랫폼과 교차 프로모션' },
    LOCAL: { id: 'local', label: '지역 파트너', icon: '🏘️', description: '지역 자치단체, 상권 협의체' },
    LOGISTICS: { id: 'logistics', label: '물류 파트너', icon: '🚛', description: '배송, 설치, 장비 렌탈' },
};

// ── 파트너 등급 ──
export const PARTNER_TIERS = {
    STRATEGIC: { id: 'strategic', label: '전략 파트너', icon: '💎', minScore: 80, benefits: ['우선 노출', '공동 마케팅', '수수료 할인'] },
    PREMIUM: { id: 'premium', label: '프리미엄 파트너', icon: '🥇', minScore: 60, benefits: ['추천 노출', '성과 리포트'] },
    STANDARD: { id: 'standard', label: '일반 파트너', icon: '🤝', minScore: 0, benefits: ['기본 노출'] },
};

// ── 파트너십 생성 ──
export function createPartnership({
    partnerName,
    partnerType = 'brand',
    contactPerson = '',
    contactEmail = '',
    terms = {},
    startDate = new Date().toISOString().split('T')[0],
    duration = 90,
    goals = [],
}) {
    if (!partnerName) throw new Error('파트너명은 필수입니다');

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    return {
        id: `partner_${Date.now()}`,
        partnerName,
        partnerType,
        typeLabel: PARTNER_TYPES[partnerType.toUpperCase()]?.label || partnerType,
        contactPerson,
        contactEmail,
        terms: {
            revenueShare: terms.revenueShare || 0,
            commissionRate: terms.commissionRate || 10,
            exclusivity: terms.exclusivity || false,
            territory: terms.territory || [],
            ...terms,
        },
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        duration,
        goals,
        status: 'active',
        metrics: {
            jointRevenue: 0,
            referrals: 0,
            jointEvents: 0,
            impressions: 0,
        },
        healthScore: 100,
        tier: 'standard',
        notes: [],
        createdAt: new Date().toISOString(),
    };
}

// ── 파트너십 건강도 평가 ──
export function assessPartnershipHealth(partnership) {
    let score = 50; // 기본 점수
    const factors = [];

    // 매출 기여
    if (partnership.metrics.jointRevenue > 5000000) { score += 20; factors.push({ factor: '높은 매출 기여', impact: '+20' }); }
    else if (partnership.metrics.jointRevenue > 1000000) { score += 10; factors.push({ factor: '매출 기여', impact: '+10' }); }

    // 활동성
    if (partnership.metrics.jointEvents > 3) { score += 15; factors.push({ factor: '활발한 공동 이벤트', impact: '+15' }); }
    else if (partnership.metrics.jointEvents === 0) { score -= 10; factors.push({ factor: '공동 이벤트 없음', impact: '-10' }); }

    // 레퍼럴
    if (partnership.metrics.referrals > 10) { score += 15; factors.push({ factor: '추천 고객 유입', impact: '+15' }); }

    // 기간
    const daysSinceStart = Math.floor((new Date() - new Date(partnership.startDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceStart > 180) { score += 10; factors.push({ factor: '장기 파트너', impact: '+10' }); }

    score = Math.max(0, Math.min(100, score));

    // 등급 결정
    const tier = score >= PARTNER_TIERS.STRATEGIC.minScore ? PARTNER_TIERS.STRATEGIC
        : score >= PARTNER_TIERS.PREMIUM.minScore ? PARTNER_TIERS.PREMIUM
            : PARTNER_TIERS.STANDARD;

    return {
        score,
        tier: tier.id,
        tierLabel: tier.label,
        tierIcon: tier.icon,
        benefits: tier.benefits,
        factors,
        recommendation: score >= 80 ? '파트너십 확대 추천' : score >= 50 ? '현 수준 유지' : '재협상 또는 종료 검토',
    };
}

// ── 공동 프로모션 제안 생성 ──
export function suggestJointPromotions(vendorProfile, partnerProfile) {
    const suggestions = [];

    suggestions.push({
        type: 'cross_promotion',
        title: `${vendorProfile.name} x ${partnerProfile.name} 교차 프로모션`,
        description: '양측 고객에게 할인 혜택 제공',
        estimatedReach: (vendorProfile.followers || 1000) + (partnerProfile.followers || 1000),
        difficulty: 'easy',
    });

    suggestions.push({
        type: 'joint_event',
        title: '공동 팝업 이벤트',
        description: `${vendorProfile.name} 공간에서 ${partnerProfile.name}과 합동 이벤트 개최`,
        estimatedReach: Math.round(((vendorProfile.followers || 1000) + (partnerProfile.followers || 1000)) * 1.5),
        difficulty: 'medium',
    });

    suggestions.push({
        type: 'content_collab',
        title: 'SNS 콘텐츠 콜라보',
        description: '양측 채널에서 상호 소개 콘텐츠 발행',
        estimatedReach: (vendorProfile.followers || 500) + (partnerProfile.followers || 500),
        difficulty: 'easy',
    });

    suggestions.push({
        type: 'bundle_offer',
        title: '공동 패키지 상품',
        description: '양측 서비스를 묶은 할인 패키지',
        estimatedReach: Math.round(((vendorProfile.followers || 800) * 0.7)),
        difficulty: 'medium',
    });

    return suggestions;
}

// ── 파트너십 ROI 계산 ──
export function calculatePartnershipROI(partnership) {
    const revenue = partnership.metrics.jointRevenue;
    const costs = partnership.terms.revenueShare
        ? revenue * (partnership.terms.revenueShare / 100)
        : 0;

    const referralValue = partnership.metrics.referrals * 50000; // 추천당 예상 가치

    return {
        partnerName: partnership.partnerName,
        totalRevenue: revenue,
        totalCosts: Math.round(costs),
        referralValue: Math.round(referralValue),
        netValue: Math.round(revenue - costs + referralValue),
        roi: costs > 0 ? Math.round(((revenue - costs + referralValue) / costs) * 100) : null,
        duration: partnership.duration,
        monthlyValue: partnership.duration > 0
            ? Math.round((revenue - costs + referralValue) / (partnership.duration / 30))
            : 0,
    };
}

export default {
    PARTNER_TYPES,
    PARTNER_TIERS,
    createPartnership,
    assessPartnershipHealth,
    suggestJointPromotions,
    calculatePartnershipROI,
};
