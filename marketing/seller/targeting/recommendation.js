/**
 * Space Match 셀러 마케팅 — 상품 추천 알고리즘
 * 
 * 셀러 판매 기록을 분석하여 새로운 카테고리/상품을 추천합니다.
 * 협업 필터링, 연관 규칙, 인기도 기반 추천을 제공합니다.
 */

// ── 인기도 기반 추천 (가장 많이 팔린 카테고리) ──
export function getPopularRecommendations(records, currentCategories = [], topN = 5) {
    const categoryStats = {};

    records.forEach(r => {
        const cat = r.best_selling_item;
        if (!cat) return;
        if (!categoryStats[cat]) categoryStats[cat] = { count: 0, totalRevenue: 0, avgSatisfaction: 0, satisfactionCount: 0 };
        categoryStats[cat].count += 1;
        categoryStats[cat].totalRevenue += Number(r.monthly_revenue) || 0;
        if (Number(r.satisfaction_score) > 0) {
            categoryStats[cat].avgSatisfaction += Number(r.satisfaction_score);
            categoryStats[cat].satisfactionCount += 1;
        }
    });

    return Object.entries(categoryStats)
        .map(([category, stats]) => ({
            category,
            score: stats.count,
            totalRevenue: stats.totalRevenue,
            avgRevenue: stats.count > 0 ? Math.round(stats.totalRevenue / stats.count) : 0,
            avgSatisfaction: stats.satisfactionCount > 0 ? Math.round((stats.avgSatisfaction / stats.satisfactionCount) * 10) / 10 : null,
            isNew: !currentCategories.includes(category),
            reason: 'popularity',
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
}

// ── 연관 규칙 기반 추천 (함께 잘 팔리는 카테고리) ──
export function getAssociationRecommendations(records, targetCategory, topN = 5) {
    // 같은 셀러의 카테고리 조합 분석
    const sellerCategories = {};
    records.forEach(r => {
        const seller = r.user_id || 'unknown';
        const cat = r.best_selling_item;
        if (!cat) return;
        if (!sellerCategories[seller]) sellerCategories[seller] = new Set();
        sellerCategories[seller].add(cat);
    });

    // 타겟 카테고리와 함께 등장하는 빈도
    const coOccurrence = {};
    Object.values(sellerCategories).forEach(catSet => {
        if (!catSet.has(targetCategory)) return;
        catSet.forEach(cat => {
            if (cat === targetCategory) return;
            coOccurrence[cat] = (coOccurrence[cat] || 0) + 1;
        });
    });

    const totalWithTarget = Object.values(sellerCategories).filter(s => s.has(targetCategory)).length;

    return Object.entries(coOccurrence)
        .map(([category, count]) => ({
            category,
            coOccurrenceCount: count,
            confidence: totalWithTarget > 0 ? Math.round((count / totalWithTarget) * 10000) / 100 : 0,
            reason: 'association',
            rationale: `${targetCategory}를 판매하는 셀러의 ${Math.round((count / totalWithTarget) * 100)}%가 함께 판매`,
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, topN);
}

// ── 국가별 인기 카테고리 추천 ──
export function getCountryRecommendations(records, countryCode, currentCategories = [], topN = 5) {
    const countryRecords = records.filter(r => (r.country_code || 'KR') === countryCode);
    const categoryStats = {};

    countryRecords.forEach(r => {
        const cat = r.best_selling_item;
        if (!cat) return;
        if (!categoryStats[cat]) categoryStats[cat] = { count: 0, totalRevenue: 0 };
        categoryStats[cat].count += 1;
        categoryStats[cat].totalRevenue += Number(r.monthly_revenue) || 0;
    });

    return Object.entries(categoryStats)
        .filter(([cat]) => !currentCategories.includes(cat))
        .map(([category, stats]) => ({
            category,
            countryCode,
            popularity: stats.count,
            totalRevenue: stats.totalRevenue,
            avgRevenue: stats.count > 0 ? Math.round(stats.totalRevenue / stats.count) : 0,
            reason: 'country_trend',
            rationale: `${countryCode} 시장에서 ${stats.count}회 판매 기록`,
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, topN);
}

// ── 매출 성장률 기반 추천 (뜨는 카테고리) ──
export function getTrendingRecommendations(records, topN = 5) {
    const periodCategories = {};

    records.forEach(r => {
        const cat = r.best_selling_item;
        const date = r.record_date;
        if (!cat || !date) return;
        const ym = date.substring(0, 7);
        if (!periodCategories[cat]) periodCategories[cat] = {};
        if (!periodCategories[cat][ym]) periodCategories[cat][ym] = 0;
        periodCategories[cat][ym] += Number(r.monthly_revenue) || 0;
    });

    return Object.entries(periodCategories)
        .map(([category, timeline]) => {
            const periods = Object.keys(timeline).sort();
            if (periods.length < 2) return null;

            const latest = timeline[periods[periods.length - 1]];
            const previous = timeline[periods[periods.length - 2]];
            const growth = previous > 0 ? Math.round(((latest - previous) / previous) * 10000) / 100 : 0;

            return {
                category,
                growth,
                latestRevenue: latest,
                previousRevenue: previous,
                periods: periods.length,
                reason: 'trending',
                rationale: `전월 대비 ${growth}% 성장`,
            };
        })
        .filter(Boolean)
        .filter(r => r.growth > 0)
        .sort((a, b) => b.growth - a.growth)
        .slice(0, topN);
}

// ── 종합 추천 생성 ──
export function generateRecommendations(records, { currentCategories = [], countryCode = 'KR', primaryCategory = null } = {}) {
    const popular = getPopularRecommendations(records, currentCategories);
    const trending = getTrendingRecommendations(records);
    const countryBased = getCountryRecommendations(records, countryCode, currentCategories);
    const associated = primaryCategory ? getAssociationRecommendations(records, primaryCategory) : [];

    // 중복 제거 및 점수 통합
    const scoreMap = {};
    const addScore = (items, weight) => {
        items.forEach((item, index) => {
            const key = item.category;
            if (!scoreMap[key]) scoreMap[key] = { category: key, totalScore: 0, reasons: [], details: {} };
            const positionScore = (items.length - index) / items.length;
            scoreMap[key].totalScore += positionScore * weight;
            scoreMap[key].reasons.push(item.reason);
            scoreMap[key].details[item.reason] = item;
        });
    };

    addScore(popular, 1.0);
    addScore(trending, 1.5);
    addScore(countryBased, 1.2);
    addScore(associated, 1.3);

    const recommendations = Object.values(scoreMap)
        .map(r => ({
            ...r,
            totalScore: Math.round(r.totalScore * 100) / 100,
            isNew: !currentCategories.includes(r.category),
        }))
        .sort((a, b) => b.totalScore - a.totalScore);

    return {
        recommendations,
        breakdown: { popular, trending, countryBased, associated },
        generatedAt: new Date().toISOString(),
    };
}

export default {
    getPopularRecommendations,
    getAssociationRecommendations,
    getCountryRecommendations,
    getTrendingRecommendations,
    generateRecommendations,
};
