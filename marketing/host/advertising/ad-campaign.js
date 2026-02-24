/**
 * Space Match 벤더 마케팅 — 광고 캠페인 관리
 * 
 * 벤더 광고 캠페인의 전체 라이프사이클을 관리합니다.
 * 캠페인 생성, 예산 관리, 타겟팅, 성과 추적을 지원합니다.
 */

// ── 광고 목표 ──
export const AD_OBJECTIVES = {
    AWARENESS: { id: 'awareness', label: '브랜드 인지도', icon: '👀', kpi: 'impressions', bidType: 'CPM' },
    TRAFFIC: { id: 'traffic', label: '트래픽 유입', icon: '🔗', kpi: 'clicks', bidType: 'CPC' },
    ENGAGEMENT: { id: 'engagement', label: '참여 유도', icon: '💬', kpi: 'engagements', bidType: 'CPE' },
    CONVERSION: { id: 'conversion', label: '전환 (예약/문의)', icon: '🎯', kpi: 'conversions', bidType: 'CPA' },
    RETENTION: { id: 'retention', label: '재방문 유도', icon: '🔄', kpi: 'returnVisits', bidType: 'CPC' },
};

// ── 광고 배치 ──
export const AD_PLACEMENTS = {
    SEARCH_TOP: { id: 'search_top', label: '검색 결과 상단', cpc: 500, priority: 1 },
    HOMEPAGE_BANNER: { id: 'homepage_banner', label: '홈 배너', cpm: 3000, priority: 2 },
    CATEGORY_PAGE: { id: 'category_page', label: '카테고리 페이지', cpc: 300, priority: 3 },
    SIDEBAR: { id: 'sidebar', label: '사이드바', cpc: 200, priority: 4 },
    IN_FEED: { id: 'in_feed', label: '피드 내 삽입', cpc: 400, priority: 2 },
    EMAIL_SPONSOR: { id: 'email_sponsor', label: '이메일 스폰서', cpm: 5000, priority: 3 },
};

// ── 캠페인 생성 ──
export function createAdCampaign({
    name,
    objective = 'awareness',
    placements = ['search_top'],
    budget = { daily: 50000, total: null },
    schedule = { startDate: new Date().toISOString().split('T')[0], endDate: null },
    targeting = {},
    creatives = [],
}) {
    if (!name) throw new Error('캠페인 이름은 필수입니다');

    const obj = AD_OBJECTIVES[objective.toUpperCase()] || AD_OBJECTIVES.AWARENESS;

    // 종료일 미지정 시 30일 기본
    if (!schedule.endDate) {
        const end = new Date(schedule.startDate);
        end.setDate(end.getDate() + 30);
        schedule.endDate = end.toISOString().split('T')[0];
    }

    const durationDays = Math.ceil((new Date(schedule.endDate) - new Date(schedule.startDate)) / (1000 * 60 * 60 * 24));

    return {
        id: `campaign_${Date.now()}`,
        name,
        objective: obj.id,
        objectiveLabel: obj.label,
        kpi: obj.kpi,
        bidType: obj.bidType,
        placements,
        budget: {
            daily: budget.daily,
            total: budget.total || budget.daily * durationDays,
            spent: 0,
            remaining: budget.total || budget.daily * durationDays,
        },
        schedule,
        durationDays,
        targeting: {
            countries: targeting.countries || [],
            categories: targeting.categories || [],
            audiences: targeting.audiences || [],
            keywords: targeting.keywords || [],
            ...targeting,
        },
        creatives,
        status: 'draft',
        metrics: {
            impressions: 0, clicks: 0, conversions: 0,
            spend: 0, ctr: 0, cvr: 0, cpc: 0, cpm: 0, cpa: 0,
        },
        createdAt: new Date().toISOString(),
    };
}

// ── 예산 소진율 계산 ──
export function calculateBudgetPacing(campaign) {
    const now = new Date();
    const start = new Date(campaign.schedule.startDate);
    const end = new Date(campaign.schedule.endDate);

    const totalDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, (end - now) / (1000 * 60 * 60 * 24));

    const expectedSpend = (elapsedDays / totalDays) * campaign.budget.total;
    const actualSpend = campaign.budget.spent;
    const paceRatio = expectedSpend > 0 ? actualSpend / expectedSpend : 0;

    return {
        totalBudget: campaign.budget.total,
        spent: actualSpend,
        remaining: campaign.budget.total - actualSpend,
        elapsedDays: Math.round(elapsedDays),
        remainingDays: Math.round(remainingDays),
        expectedSpend: Math.round(expectedSpend),
        paceRatio: Math.round(paceRatio * 100) / 100,
        paceStatus: paceRatio > 1.2 ? 'overspending' : paceRatio < 0.8 ? 'underspending' : 'on_track',
        dailyBudgetRemaining: remainingDays > 0 ? Math.round((campaign.budget.total - actualSpend) / remainingDays) : 0,
        projectedTotalSpend: elapsedDays > 0 ? Math.round((actualSpend / elapsedDays) * totalDays) : 0,
    };
}

// ── 성과 지표 계산 ──
export function calculateAdMetrics(campaign) {
    const { impressions, clicks, conversions, spend } = campaign.metrics;

    return {
        impressions,
        clicks,
        conversions,
        spend,
        ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
        cvr: clicks > 0 ? Math.round((conversions / clicks) * 10000) / 100 : 0,
        cpc: clicks > 0 ? Math.round(spend / clicks) : 0,
        cpm: impressions > 0 ? Math.round((spend / impressions) * 1000) : 0,
        cpa: conversions > 0 ? Math.round(spend / conversions) : 0,
        // 벤치마크 비교
        benchmark: {
            ctr: 2.5,   // 평균 CTR
            cvr: 3.0,   // 평균 전환율
            cpc: 350,   // 평균 CPC (원)
        },
    };
}

// ── 광고 크리에이티브 A/B 테스트 ──
export function evaluateCreativePerformance(creatives) {
    if (!creatives || creatives.length === 0) return null;

    const ranked = creatives
        .map(c => ({
            ...c,
            ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
            cvr: c.clicks > 0 ? (c.conversions / c.clicks) * 100 : 0,
            roi: c.spend > 0 ? ((c.revenue - c.spend) / c.spend) * 100 : 0,
        }))
        .sort((a, b) => b.ctr - a.ctr);

    return {
        winner: ranked[0],
        allCreatives: ranked,
        recommendation: ranked.length > 1
            ? `"${ranked[0].name || 'Creative A'}"가 CTR ${Math.round(ranked[0].ctr * 100) / 100}%로 최고 성과`
            : '비교할 크리에이티브가 부족합니다',
    };
}

// ── 캠페인 최적화 추천 ──
export function getOptimizationSuggestions(campaign) {
    const metrics = calculateAdMetrics(campaign);
    const pacing = calculateBudgetPacing(campaign);
    const suggestions = [];

    if (metrics.ctr < metrics.benchmark.ctr) {
        suggestions.push({
            area: 'CTR 개선',
            priority: 'high',
            message: `현재 CTR(${metrics.ctr}%)이 벤치마크(${metrics.benchmark.ctr}%)보다 낮습니다`,
            actions: ['광고 크리에이티브 변경', '타겟팅 범위 조정', '광고 문구 A/B 테스트'],
        });
    }

    if (metrics.cvr < metrics.benchmark.cvr && metrics.clicks > 50) {
        suggestions.push({
            area: '전환율 개선',
            priority: 'high',
            message: `전환율(${metrics.cvr}%)을 높일 필요가 있습니다`,
            actions: ['랜딩 페이지 최적화', 'CTA 버튼 개선', '프로필 완성도 확인'],
        });
    }

    if (pacing.paceStatus === 'overspending') {
        suggestions.push({
            area: '예산 관리',
            priority: 'medium',
            message: '예산 소진이 계획보다 빠릅니다',
            actions: ['일일 예산 제한 조정', '비효율 배치 중단', '입찰가 낮추기'],
        });
    }

    if (pacing.paceStatus === 'underspending') {
        suggestions.push({
            area: '노출 확대',
            priority: 'low',
            message: '예산이 충분히 활용되지 않고 있습니다',
            actions: ['타겟팅 범위 확대', '추가 배치 선택', '입찰가 올리기'],
        });
    }

    return suggestions;
}

export default {
    AD_OBJECTIVES,
    AD_PLACEMENTS,
    createAdCampaign,
    calculateBudgetPacing,
    calculateAdMetrics,
    evaluateCreativePerformance,
    getOptimizationSuggestions,
};
