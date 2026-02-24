/**
 * Space Match 벤더 마케팅 — 셀러 매칭 최적화
 * 
 * 벤더 공간에 최적의 셀러를 매칭하기 위한 스코어링,
 * 필터링, 추천 알고리즘을 제공합니다.
 */

// ── 매칭 기준 가중치 ──
export const MATCHING_CRITERIA = {
    CATEGORY_FIT: { id: 'category_fit', label: '카테고리 적합성', weight: 25, icon: '🏷️' },
    REVENUE_HISTORY: { id: 'revenue_history', label: '매출 실적', weight: 20, icon: '💰' },
    LOCATION_PROXIMITY: { id: 'location', label: '지역 근접성', weight: 15, icon: '📍' },
    SATISFACTION: { id: 'satisfaction', label: '만족도 평점', weight: 15, icon: '⭐' },
    EXPERIENCE: { id: 'experience', label: '활동 경력', weight: 10, icon: '📋' },
    BRAND_ALIGNMENT: { id: 'brand', label: '브랜드 적합성', weight: 10, icon: '🎨' },
    AVAILABILITY: { id: 'availability', label: '가용성', weight: 5, icon: '📅' },
};

// ── 매칭 점수 계산 ──
export function calculateMatchScore(vendor, seller) {
    const scores = {};
    let totalScore = 0;

    // 카테고리 적합성
    const categoryFit = vendor.preferredCategories?.includes(seller.category) ? 100
        : vendor.acceptedCategories?.includes(seller.category) ? 70 : 30;
    scores.category_fit = categoryFit;

    // 매출 실적
    const revenueScore = seller.avgMonthlyRevenue > 1000000 ? 100
        : seller.avgMonthlyRevenue > 500000 ? 80
            : seller.avgMonthlyRevenue > 100000 ? 60 : 40;
    scores.revenue_history = revenueScore;

    // 지역 근접성
    const sameCountry = vendor.country === seller.country;
    const sameRegion = sameCountry && vendor.region === seller.region;
    scores.location = sameRegion ? 100 : sameCountry ? 70 : 40;

    // 만족도
    const satScore = seller.satisfactionScore ? Math.min(100, seller.satisfactionScore * 20) : 50;
    scores.satisfaction = satScore;

    // 경력 (기록 수 기반)
    const expScore = seller.recordCount > 100 ? 100 : seller.recordCount > 50 ? 80 : seller.recordCount > 10 ? 60 : 30;
    scores.experience = expScore;

    // 브랜드 적합성 (공간 유형 매칭)
    const brandFit = seller.venuePreference === vendor.venueType ? 100
        : seller.venuePreference ? 50 : 60;
    scores.brand = brandFit;

    // 가용성
    scores.availability = seller.available ? 100 : 0;

    // 가중 평균 계산
    Object.values(MATCHING_CRITERIA).forEach(criteria => {
        const score = scores[criteria.id] || 0;
        totalScore += (score * criteria.weight) / 100;
    });

    return {
        totalScore: Math.round(totalScore),
        breakdown: Object.entries(scores).map(([id, score]) => {
            const criteria = Object.values(MATCHING_CRITERIA).find(c => c.id === id);
            return { id, label: criteria?.label || id, score, weight: criteria?.weight || 0, icon: criteria?.icon || '' };
        }),
        compatibility: totalScore >= 80 ? 'excellent' : totalScore >= 60 ? 'good' : totalScore >= 40 ? 'fair' : 'poor',
        compatibilityLabel: totalScore >= 80 ? '🟢 높음' : totalScore >= 60 ? '🟡 보통' : totalScore >= 40 ? '🟠 낮음' : '🔴 부적합',
    };
}

// ── 벤더에 맞는 셀러 추천 ──
export function recommendSellers(vendor, sellers, topN = 10) {
    const scored = sellers.map(seller => ({
        seller,
        matchScore: calculateMatchScore(vendor, seller),
    })).sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore);

    return {
        recommendations: scored.slice(0, topN),
        totalCandidates: sellers.length,
        excellentCount: scored.filter(s => s.matchScore.compatibility === 'excellent').length,
        goodCount: scored.filter(s => s.matchScore.compatibility === 'good').length,
    };
}

// ── 셀러에 맞는 벤더 추천 ──
export function recommendVendors(seller, vendors, topN = 10) {
    const scored = vendors.map(vendor => ({
        vendor,
        matchScore: calculateMatchScore(vendor, seller),
    })).sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore);

    return {
        recommendations: scored.slice(0, topN),
        totalVenues: vendors.length,
    };
}

// ── 매칭 이력 분석 ──
export function analyzeMatchingHistory(matchHistory = []) {
    const successCount = matchHistory.filter(m => m.outcome === 'success').length;
    const totalCount = matchHistory.length || 1;

    const categorySuccess = {};
    matchHistory.filter(m => m.outcome === 'success').forEach(m => {
        const cat = m.sellerCategory || 'unknown';
        categorySuccess[cat] = (categorySuccess[cat] || 0) + 1;
    });

    return {
        totalMatches: matchHistory.length,
        successRate: Math.round((successCount / totalCount) * 10000) / 100,
        avgMatchScore: matchHistory.length > 0
            ? Math.round(matchHistory.reduce((s, m) => s + (m.matchScore || 0), 0) / matchHistory.length)
            : 0,
        topCategories: Object.entries(categorySuccess)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, count]) => ({ category, successCount: count })),
        avgRevenue: matchHistory.length > 0
            ? Math.round(matchHistory.reduce((s, m) => s + (m.revenue || 0), 0) / matchHistory.length)
            : 0,
    };
}

// ── 매칭 필터 프리셋 ──
export const MATCHING_PRESETS = {
    highRevenue: { label: '고매출 셀러', filters: { minRevenue: 1000000, minSatisfaction: 3.5 } },
    newSellers: { label: '신규 셀러', filters: { maxRecords: 10, minSatisfaction: 0 } },
    localSellers: { label: '지역 셀러', filters: { sameCountry: true, sameRegion: true } },
    topRated: { label: '평점 높은 셀러', filters: { minSatisfaction: 4.5 } },
    experienced: { label: '경력 셀러', filters: { minRecords: 50 } },
};

export default {
    MATCHING_CRITERIA,
    calculateMatchScore,
    recommendSellers,
    recommendVendors,
    analyzeMatchingHistory,
    MATCHING_PRESETS,
};
