/**
 * Space Match 벤더 마케팅 — 지역 확장 전략
 * 
 * 새로운 지역/국가로의 확장을 위한 시장 분석,
 * 기회 평가, 진출 전략을 제공합니다.
 */

// ── 지원 국가/지역 데이터 ──
export const MARKETS = {
    KR: { code: 'KR', name: '대한민국', flag: '🇰🇷', regions: ['서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'], maturity: 'mature' },
    JP: { code: 'JP', name: '일본', flag: '🇯🇵', regions: ['도쿄', '오사카', '교토', '나고야', '후쿠오카', '삿포로', '요코하마'], maturity: 'growing' },
    US: { code: 'US', name: '미국', flag: '🇺🇸', regions: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'], maturity: 'emerging' },
    TH: { code: 'TH', name: '태국', flag: '🇹🇭', regions: ['방콕', '치앙마이', '푸켓', '파타야'], maturity: 'emerging' },
    VN: { code: 'VN', name: '베트남', flag: '🇻🇳', regions: ['호치민', '하노이', '다낭'], maturity: 'emerging' },
    TW: { code: 'TW', name: '대만', flag: '🇹🇼', regions: ['타이베이', '타이중', '가오슝'], maturity: 'growing' },
    SG: { code: 'SG', name: '싱가포르', flag: '🇸🇬', regions: ['Central', 'East', 'West'], maturity: 'growing' },
    MY: { code: 'MY', name: '말레이시아', flag: '🇲🇾', regions: ['쿠알라룸푸르', '페낭', '조호르바루'], maturity: 'emerging' },
};

// ── 시장 기회 평가 ──
export function evaluateMarketOpportunity(marketCode, data = {}) {
    const market = MARKETS[marketCode];
    if (!market) return null;

    const {
        existingVendors = 0,
        existingSellers = 0,
        monthlySearchVolume = 0,
        avgRevenuePerVendor = 0,
        competitorCount = 0,
    } = data;

    // 각 지표 점수화 (0-100)
    const demandScore = Math.min(100, monthlySearchVolume / 100);
    const supplyGap = existingVendors < 10 ? 90 : existingVendors < 50 ? 60 : 30;
    const revenueScore = Math.min(100, avgRevenuePerVendor / 10000);
    const competitionScore = competitorCount < 3 ? 90 : competitorCount < 10 ? 60 : 30;
    const maturityBonus = market.maturity === 'emerging' ? 80 : market.maturity === 'growing' ? 60 : 40;

    const totalScore = Math.round(
        demandScore * 0.25 + supplyGap * 0.25 + revenueScore * 0.2 + competitionScore * 0.15 + maturityBonus * 0.15
    );

    return {
        market: { ...market },
        scores: {
            demand: Math.round(demandScore),
            supplyGap: Math.round(supplyGap),
            revenue: Math.round(revenueScore),
            competition: Math.round(competitionScore),
            maturity: Math.round(maturityBonus),
        },
        totalScore,
        rating: totalScore >= 70 ? '⭐⭐⭐' : totalScore >= 50 ? '⭐⭐' : '⭐',
        recommendation: totalScore >= 70 ? '적극 진출 추천' : totalScore >= 50 ? '조건부 진출' : '추가 조사 필요',
        existingPresence: { vendors: existingVendors, sellers: existingSellers },
    };
}

// ── 지역 확장 로드맵 생성 ──
export function generateExpansionRoadmap(targetMarkets = [], currentMarket = 'KR') {
    const evaluated = targetMarkets.map(code => evaluateMarketOpportunity(code)).filter(Boolean);
    const ranked = evaluated.sort((a, b) => b.totalScore - a.totalScore);

    const phases = [];
    ranked.forEach((market, idx) => {
        const phase = Math.floor(idx / 2) + 1;
        phases.push({
            phase,
            market: market.market.name,
            marketCode: market.market.code,
            flag: market.market.flag,
            score: market.totalScore,
            recommendation: market.recommendation,
            timeline: phase === 1 ? '1~3개월' : phase === 2 ? '4~6개월' : `${phase * 3 - 2}~${phase * 3}개월`,
            tasks: getExpansionTasks(market, phase),
        });
    });

    return {
        currentMarket: MARKETS[currentMarket],
        phases,
        totalMarkets: ranked.length,
        estimatedTimeline: `${phases.length * 3}개월`,
    };
}

function getExpansionTasks(marketEval, phase) {
    const baseTasks = [
        '시장 조사 및 현지 트렌드 분석',
        '현지 언어 번역 및 로컬라이제이션',
        '현지 파트너 벤더 확보 (최소 5곳)',
    ];

    if (phase === 1) {
        return [...baseTasks, '파일럿 프로그램 운영', '초기 셀러 모집 (10~20명)'];
    }
    return [...baseTasks, '정식 서비스 런칭', '마케팅 캠페인 집행', '현지 커뮤니티 구축'];
}

// ── 지역별 수요/공급 분석 ──
export function analyzeRegionalDemand(records, marketCode) {
    const market = MARKETS[marketCode];
    if (!market) return null;

    const regionStats = {};
    market.regions.forEach(region => {
        regionStats[region] = { sellers: 0, revenue: 0, vendors: 0, transactions: 0 };
    });

    records.filter(r => (r.country_code || 'KR') === marketCode).forEach(r => {
        const region = r.region || market.regions[0];
        if (!regionStats[region]) regionStats[region] = { sellers: 0, revenue: 0, vendors: 0, transactions: 0 };
        regionStats[region].sellers += 1;
        regionStats[region].revenue += Number(r.monthly_revenue) || 0;
        regionStats[region].transactions += Number(r.transaction_count) || 0;
    });

    const totalRevenue = Object.values(regionStats).reduce((s, r) => s + r.revenue, 0);

    return {
        market: market.name,
        regions: Object.entries(regionStats)
            .map(([region, stats]) => ({
                region,
                ...stats,
                revenueShare: totalRevenue > 0 ? Math.round((stats.revenue / totalRevenue) * 10000) / 100 : 0,
                density: stats.sellers > 0 ? 'active' : 'opportunity',
            }))
            .sort((a, b) => b.revenue - a.revenue),
        hotspots: Object.entries(regionStats)
            .filter(([, s]) => s.revenue > 0)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 3)
            .map(([region]) => region),
        opportunities: Object.entries(regionStats)
            .filter(([, s]) => s.sellers === 0)
            .map(([region]) => region),
    };
}

// ── 확장 비용 예측 ──
export function estimateExpansionCost(marketCode, scale = 'small') {
    const scales = {
        small: { vendors: 5, sellers: 20, marketing: 3000000, operations: 2000000, label: '소규모' },
        medium: { vendors: 20, sellers: 100, marketing: 10000000, operations: 7000000, label: '중규모' },
        large: { vendors: 50, sellers: 500, marketing: 30000000, operations: 20000000, label: '대규모' },
    };

    const s = scales[scale] || scales.small;
    const market = MARKETS[marketCode];
    const localizedMultiplier = market?.maturity === 'emerging' ? 0.7 : market?.maturity === 'growing' ? 0.85 : 1.0;

    return {
        market: market?.name || marketCode,
        scale: s.label,
        targetVendors: s.vendors,
        targetSellers: s.sellers,
        costs: {
            marketing: Math.round(s.marketing * localizedMultiplier),
            operations: Math.round(s.operations * localizedMultiplier),
            localization: Math.round(2000000 * localizedMultiplier),
            total: Math.round((s.marketing + s.operations + 2000000) * localizedMultiplier),
        },
        timeline: scale === 'large' ? '6~12개월' : scale === 'medium' ? '3~6개월' : '1~3개월',
    };
}

export default {
    MARKETS,
    evaluateMarketOpportunity,
    generateExpansionRoadmap,
    analyzeRegionalDemand,
    estimateExpansionCost,
};
