/**
 * Space Match 셀러 마케팅 — 리타겟팅 전략
 * 
 * 이탈 위험 고객 감지 및 재유입 캠페인을 관리합니다.
 * 비활성 기간 기반 분류와 자동 캠페인 트리거를 제공합니다.
 */

// ── 이탈 위험 단계 ──
export const CHURN_RISK_LEVELS = {
    SAFE: { id: 'safe', label: '안전', color: '#10B981', icon: '✅', daysInactive: [0, 14], action: '무행동' },
    WARM: { id: 'warm', label: '관심 필요', color: '#F59E0B', icon: '🟡', daysInactive: [15, 30], action: '리마인더 발송' },
    COOLING: { id: 'cooling', label: '이탈 주의', color: '#F97316', icon: '🟠', daysInactive: [31, 60], action: '특별 혜택 제안' },
    COLD: { id: 'cold', label: '이탈 위험', color: '#EF4444', icon: '🔴', daysInactive: [61, 90], action: '긴급 프로모션' },
    LOST: { id: 'lost', label: '이탈', color: '#6B7280', icon: '⚫', daysInactive: [91, Infinity], action: '재활성화 캠페인' },
};

// ── 이탈 위험도 판별 ──
export function assessChurnRisk(lastActivityDate, referenceDate = new Date()) {
    const daysInactive = Math.floor((referenceDate - new Date(lastActivityDate)) / (1000 * 60 * 60 * 24));

    for (const level of Object.values(CHURN_RISK_LEVELS)) {
        if (daysInactive >= level.daysInactive[0] && daysInactive <= level.daysInactive[1]) {
            return { ...level, daysInactive };
        }
    }
    return { ...CHURN_RISK_LEVELS.LOST, daysInactive };
}

// ── 캠페인 유형 ──
export const RETARGET_CAMPAIGNS = {
    REMINDER: {
        id: 'reminder',
        label: '리마인드 메시지',
        description: '최근 활동 상기 및 신상품 안내',
        triggerRisk: 'warm',
        channels: ['push', 'email'],
    },
    WINBACK_OFFER: {
        id: 'winback_offer',
        label: '복귀 혜택',
        description: '특별 할인 쿠폰 제공',
        triggerRisk: 'cooling',
        channels: ['email', 'sms'],
    },
    URGENCY_DEAL: {
        id: 'urgency_deal',
        label: '긴급 프로모션',
        description: '기간 한정 대폭 할인',
        triggerRisk: 'cold',
        channels: ['email', 'sms', 'push'],
    },
    REACTIVATION: {
        id: 'reactivation',
        label: '재활성화 캠페인',
        description: '모든 채널 동원 복귀 유도',
        triggerRisk: 'lost',
        channels: ['email', 'sms', 'push', 'ads'],
    },
    FEEDBACK: {
        id: 'feedback',
        label: '피드백 요청',
        description: '이탈 원인 파악을 위한 설문',
        triggerRisk: 'cold',
        channels: ['email'],
    },
};

// ── 리타겟팅 캠페인 생성 ──
export function createRetargetingCampaign({
    type = 'reminder',
    targetAudience = [],
    message = '',
    incentive = null,
    startDate = new Date().toISOString().split('T')[0],
    duration = 7,
}) {
    const template = RETARGET_CAMPAIGNS[type.toUpperCase()] || RETARGET_CAMPAIGNS.REMINDER;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    return {
        id: `retarget_${Date.now()}`,
        type: template.id,
        label: template.label,
        description: template.description,
        channels: template.channels,
        targetAudience,
        message: message || template.description,
        incentive,
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        status: 'scheduled',
        metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        createdAt: new Date().toISOString(),
    };
}

// ── 판매 기록에서 이탈 위험 유저 분석 ──
export function analyzeChurnRisk(records, referenceDate = new Date()) {
    const userLastActivity = {};

    records.forEach(r => {
        const userId = r.user_id || 'unknown';
        const date = r.record_date;
        if (!date) return;
        if (!userLastActivity[userId] || date > userLastActivity[userId].date) {
            userLastActivity[userId] = {
                date,
                country: r.country_code || 'KR',
                lastRevenue: Number(r.monthly_revenue) || 0,
                lastCategory: r.best_selling_item || '',
            };
        }
    });

    const riskDistribution = {};
    Object.values(CHURN_RISK_LEVELS).forEach(l => { riskDistribution[l.id] = { ...l, count: 0, users: [] }; });

    const userRisks = Object.entries(userLastActivity).map(([userId, info]) => {
        const risk = assessChurnRisk(info.date, referenceDate);
        riskDistribution[risk.id].count += 1;
        riskDistribution[risk.id].users.push(userId);

        return {
            userId,
            ...info,
            risk,
        };
    });

    return {
        users: userRisks.sort((a, b) => b.risk.daysInactive - a.risk.daysInactive),
        distribution: Object.values(riskDistribution),
        totalUsers: userRisks.length,
        atRiskCount: userRisks.filter(u => ['cooling', 'cold', 'lost'].includes(u.risk.id)).length,
        generatedAt: new Date().toISOString(),
    };
}

// ── 자동 캠페인 트리거 추천 ──
export function suggestCampaigns(churnAnalysis) {
    const suggestions = [];

    churnAnalysis.distribution.forEach(level => {
        if (level.count === 0) return;

        const matchingCampaigns = Object.values(RETARGET_CAMPAIGNS)
            .filter(c => c.triggerRisk === level.id);

        matchingCampaigns.forEach(campaign => {
            suggestions.push({
                campaign: campaign.id,
                label: campaign.label,
                targetCount: level.count,
                targetRiskLevel: level.id,
                channels: campaign.channels,
                priority: level.id === 'cold' ? 'high' : level.id === 'cooling' ? 'medium' : 'low',
                estimatedImpact: `${level.count}명 대상, ${campaign.channels.length}개 채널`,
            });
        });
    });

    return suggestions.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
    });
}

// ── 캠페인 성과 분석 ──
export function analyzeCampaignPerformance(campaign) {
    const { sent, opened, clicked, converted } = campaign.metrics;
    return {
        campaignId: campaign.id,
        type: campaign.type,
        openRate: sent > 0 ? Math.round((opened / sent) * 10000) / 100 : 0,
        clickRate: opened > 0 ? Math.round((clicked / opened) * 10000) / 100 : 0,
        conversionRate: clicked > 0 ? Math.round((converted / clicked) * 10000) / 100 : 0,
        overallRate: sent > 0 ? Math.round((converted / sent) * 10000) / 100 : 0,
        targetCount: campaign.targetAudience.length,
        ...campaign.metrics,
    };
}

export default {
    CHURN_RISK_LEVELS,
    RETARGET_CAMPAIGNS,
    assessChurnRisk,
    createRetargetingCampaign,
    analyzeChurnRisk,
    suggestCampaigns,
    analyzeCampaignPerformance,
};
