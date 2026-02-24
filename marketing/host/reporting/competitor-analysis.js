/**
 * Space Match 벤더 마케팅 — 경쟁사 분석
 * 
 * 동종 벤더 벤치마킹, 시장 포지셔닝, 강약점 분석을 제공합니다.
 * SWOT 분석, 포지셔닝 맵, 격차 분석을 지원합니다.
 */

// ── 분석 차원 ──
export const ANALYSIS_DIMENSIONS = {
    PRICING: { id: 'pricing', label: '가격 경쟁력', icon: '💰', weight: 20 },
    QUALITY: { id: 'quality', label: '공간 품질', icon: '✨', weight: 25 },
    LOCATION: { id: 'location', label: '입지', icon: '📍', weight: 20 },
    SERVICE: { id: 'service', label: '서비스 수준', icon: '🤝', weight: 15 },
    MARKETING: { id: 'marketing', label: '마케팅 활동', icon: '📢', weight: 10 },
    REPUTATION: { id: 'reputation', label: '평판', icon: '⭐', weight: 10 },
};

// ── 경쟁사 프로필 생성 ──
export function createCompetitorProfile({
    name,
    category = '',
    location = '',
    priceRange = { min: 0, max: 0 },
    ratings = { overall: 0, quality: 0, service: 0, value: 0 },
    metrics = {},
    strengths = [],
    weaknesses = [],
}) {
    return {
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        category,
        location,
        priceRange,
        ratings,
        metrics: {
            monthlyBookings: metrics.monthlyBookings || 0,
            avgOccupancyRate: metrics.avgOccupancyRate || 0,
            sellerCount: metrics.sellerCount || 0,
            reviewCount: metrics.reviewCount || 0,
            socialFollowers: metrics.socialFollowers || 0,
            ...metrics,
        },
        strengths,
        weaknesses,
        createdAt: new Date().toISOString(),
    };
}

// ── 벤치마킹 점수 비교 ──
export function benchmarkAgainstCompetitors(myProfile, competitors = []) {
    const dimensions = Object.values(ANALYSIS_DIMENSIONS);

    const myScores = calculateDimensionScores(myProfile);
    const competitorScores = competitors.map(c => ({
        name: c.name,
        scores: calculateDimensionScores(c),
    }));

    const avgCompetitorScores = {};
    dimensions.forEach(dim => {
        const scores = competitorScores.map(c => c.scores[dim.id] || 0);
        avgCompetitorScores[dim.id] = scores.length > 0
            ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
            : 50;
    });

    const comparison = dimensions.map(dim => ({
        ...dim,
        myScore: myScores[dim.id] || 0,
        avgCompetitorScore: avgCompetitorScores[dim.id],
        gap: (myScores[dim.id] || 0) - avgCompetitorScores[dim.id],
        status: (myScores[dim.id] || 0) > avgCompetitorScores[dim.id] ? 'above' : (myScores[dim.id] || 0) < avgCompetitorScores[dim.id] ? 'below' : 'equal',
    }));

    const myTotalScore = dimensions.reduce((s, d) => s + ((myScores[d.id] || 0) * d.weight / 100), 0);
    const avgTotalScore = dimensions.reduce((s, d) => s + ((avgCompetitorScores[d.id] || 0) * d.weight / 100), 0);

    return {
        dimensions: comparison,
        myTotalScore: Math.round(myTotalScore),
        avgCompetitorScore: Math.round(avgTotalScore),
        overallPosition: myTotalScore > avgTotalScore ? '시장 평균 이상' : '시장 평균 이하',
        competitorCount: competitors.length,
    };
}

function calculateDimensionScores(profile) {
    const scores = {};
    const r = profile.ratings || {};
    const m = profile.metrics || {};

    scores.pricing = profile.priceRange?.max > 0 ? Math.min(100, Math.round(100 - (profile.priceRange.max / 10000))) : 50;
    scores.quality = r.quality ? r.quality * 20 : r.overall ? r.overall * 20 : 50;
    scores.location = profile.location ? 70 : 30;
    scores.service = r.service ? r.service * 20 : 50;
    scores.marketing = Math.min(100, (m.socialFollowers || 0) / 100);
    scores.reputation = m.reviewCount > 50 ? 90 : m.reviewCount > 20 ? 70 : m.reviewCount > 5 ? 50 : 30;

    return scores;
}

// ── SWOT 분석 ──
export function generateSWOT(myProfile, competitors = [], marketData = {}) {
    const benchmark = benchmarkAgainstCompetitors(myProfile, competitors);

    const strengths = benchmark.dimensions.filter(d => d.status === 'above').map(d => d.label);
    const weaknesses = benchmark.dimensions.filter(d => d.status === 'below').map(d => d.label);

    const opportunities = [];
    const threats = [];

    if (marketData.growthRate > 10) opportunities.push('시장 성장 중 (연 ' + marketData.growthRate + '%)');
    if (competitors.length < 5) opportunities.push('경쟁사 수가 적음 (확장 기회)');
    if (myProfile.metrics?.avgOccupancyRate < 50) opportunities.push('가동률 개선 여지 있음');

    if (competitors.length > 10) threats.push('과밀 경쟁 시장');
    if (marketData.newEntrants > 3) threats.push('신규 진입자 증가');
    if (myProfile.ratings?.overall < 3.5) threats.push('평판 관리 필요');

    // 최소 항목 보장
    if (strengths.length === 0) strengths.push('Space Match 플랫폼 입점');
    if (weaknesses.length === 0) weaknesses.push('경쟁 분석 데이터 부족');
    if (opportunities.length === 0) opportunities.push('온라인 마케팅 강화 가능');
    if (threats.length === 0) threats.push('시장 변동성');

    return {
        strengths: { label: '강점 (S)', items: strengths, color: '#10B981' },
        weaknesses: { label: '약점 (W)', items: weaknesses, color: '#EF4444' },
        opportunities: { label: '기회 (O)', items: opportunities, color: '#3B82F6' },
        threats: { label: '위협 (T)', items: threats, color: '#F59E0B' },
    };
}

// ── 포지셔닝 맵 데이터 (가격 vs 품질) ──
export function generatePositioningMap(myProfile, competitors = []) {
    const allProfiles = [{ ...myProfile, isMe: true }, ...competitors.map(c => ({ ...c, isMe: false }))];

    return allProfiles.map(p => {
        const priceScore = p.priceRange?.max > 0 ? Math.min(100, p.priceRange.max / 1000) : 50;
        const qualityScore = (p.ratings?.quality || p.ratings?.overall || 3) * 20;

        return {
            name: p.name,
            isMe: p.isMe || false,
            x: priceScore, // 가격 축 (높을수록 비쌈)
            y: qualityScore, // 품질 축 (높을수록 좋음)
            size: (p.metrics?.reviewCount || 10), // 버블 크기 = 인지도
            quadrant: priceScore > 50
                ? (qualityScore > 50 ? '프리미엄' : '고가저질')
                : (qualityScore > 50 ? '가성비' : '저가저질'),
        };
    });
}

// ── 격차 분석 리포트 ──
export function generateGapAnalysis(myProfile, topCompetitor) {
    const myScores = calculateDimensionScores(myProfile);
    const compScores = calculateDimensionScores(topCompetitor);

    return Object.values(ANALYSIS_DIMENSIONS).map(dim => {
        const myScore = myScores[dim.id] || 0;
        const compScore = compScores[dim.id] || 0;
        const gap = myScore - compScore;

        return {
            dimension: dim.label,
            icon: dim.icon,
            myScore,
            competitorScore: compScore,
            gap,
            priority: gap < -20 ? 'high' : gap < -5 ? 'medium' : 'low',
            action: gap < -20 ? '긴급 개선 필요' : gap < -5 ? '개선 권장' : gap > 10 ? '경쟁 우위 유지' : '현 수준 유지',
        };
    });
}

export default {
    ANALYSIS_DIMENSIONS,
    createCompetitorProfile,
    benchmarkAgainstCompetitors,
    generateSWOT,
    generatePositioningMap,
    generateGapAnalysis,
};
