/**
 * Space Match 벤더 마케팅 — 스폰서 리스팅
 * 
 * 검색 결과 및 카테고리 페이지에서 상위 노출을 위한
 * 스폰서 리스팅 관리를 지원합니다.
 */

// ── 리스팅 플랜 ──
export const LISTING_PLANS = {
    BASIC: {
        id: 'basic', label: '베이직', price: 30000, duration: 7,
        features: ['검색 결과 상단 5위', '기본 배지', '주간 리포트'],
        maxKeywords: 3, icon: '🥉',
    },
    STANDARD: {
        id: 'standard', label: '스탠다드', price: 70000, duration: 14,
        features: ['검색 결과 상단 3위', '프리미엄 배지', '일일 리포트', '추천 피드 노출'],
        maxKeywords: 5, icon: '🥈',
    },
    PREMIUM: {
        id: 'premium', label: '프리미엄', price: 150000, duration: 30,
        features: ['검색 결과 1위', '프리미엄 배지 + 강조', '실시간 리포트', '추천 피드 우선', '홈 배너 교차 노출', '전담 매니저'],
        maxKeywords: 10, icon: '🥇',
    },
};

// ── 스폰서 리스팅 생성 ──
export function createSponsoredListing({
    vendorId,
    vendorName,
    plan = 'basic',
    keywords = [],
    categories = [],
    targetCountries = [],
    startDate = new Date().toISOString().split('T')[0],
    customDuration = null,
}) {
    const p = LISTING_PLANS[plan.toUpperCase()] || LISTING_PLANS.BASIC;
    const duration = customDuration || p.duration;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    if (keywords.length > p.maxKeywords) {
        keywords = keywords.slice(0, p.maxKeywords);
    }

    return {
        id: `listing_${Date.now()}`,
        vendorId,
        vendorName,
        plan: p.id,
        planLabel: p.label,
        price: p.price,
        features: p.features,
        keywords,
        categories,
        targetCountries,
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        duration,
        status: 'pending',
        metrics: {
            impressions: 0, clicks: 0, profileViews: 0,
            inquiries: 0, bookings: 0,
        },
        createdAt: new Date().toISOString(),
    };
}

// ── 키워드 입찰 경쟁도 분석 ──
export function analyzeKeywordCompetition(keyword, existingListings = []) {
    const competing = existingListings.filter(l =>
        l.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );

    const avgBid = competing.length > 0
        ? Math.round(competing.reduce((s, l) => s + (LISTING_PLANS[l.plan.toUpperCase()]?.price || 0), 0) / competing.length)
        : 0;

    return {
        keyword,
        competitorCount: competing.length,
        competitionLevel: competing.length >= 5 ? 'high' : competing.length >= 2 ? 'medium' : 'low',
        avgBidAmount: avgBid,
        suggestedPlan: competing.length >= 5 ? 'premium' : competing.length >= 2 ? 'standard' : 'basic',
        estimatedPosition: Math.min(competing.length + 1, 10),
    };
}

// ── 리스팅 성과 분석 ──
export function analyzeSponsoredPerformance(listing) {
    const { impressions, clicks, profileViews, inquiries, bookings } = listing.metrics;
    const cost = listing.price;

    return {
        listingId: listing.id,
        plan: listing.planLabel,
        duration: listing.duration,
        metrics: listing.metrics,
        ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
        profileViewRate: clicks > 0 ? Math.round((profileViews / clicks) * 10000) / 100 : 0,
        inquiryRate: profileViews > 0 ? Math.round((inquiries / profileViews) * 10000) / 100 : 0,
        bookingRate: inquiries > 0 ? Math.round((bookings / inquiries) * 10000) / 100 : 0,
        costPerClick: clicks > 0 ? Math.round(cost / clicks) : 0,
        costPerInquiry: inquiries > 0 ? Math.round(cost / inquiries) : 0,
        costPerBooking: bookings > 0 ? Math.round(cost / bookings) : 0,
        roi: bookings > 0 ? `${bookings}건 예약 달성` : '아직 예약 전환 없음',
    };
}

// ── 리스팅 플랜 추천 ──
export function recommendPlan(vendorProfile = {}, competitorCount = 0) {
    const hasHighBudget = vendorProfile.budget === 'high';
    const isNewVendor = vendorProfile.isNew;
    const wantsMaxExposure = vendorProfile.priority === 'exposure';

    if (hasHighBudget || wantsMaxExposure || competitorCount >= 5) {
        return { recommended: LISTING_PLANS.PREMIUM, reason: '경쟁이 치열하거나 최대 노출이 필요한 경우' };
    }
    if (isNewVendor) {
        return { recommended: LISTING_PLANS.BASIC, reason: '신규 벤더는 기본 플랜으로 시작을 권장합니다' };
    }
    return { recommended: LISTING_PLANS.STANDARD, reason: '안정적인 노출과 합리적인 비용' };
}

// ── 키워드 추천 ──
export function suggestKeywords(vendorProfile = {}) {
    const suggestions = [];
    const { category, location, name, amenities = [] } = vendorProfile;

    if (category) suggestions.push(category, `${category} 대여`, `${category} 추천`);
    if (location) suggestions.push(`${location} 공간`, `${location} 팝업`);
    if (name) suggestions.push(name);
    amenities.slice(0, 3).forEach(a => suggestions.push(a));

    // 일반 인기 키워드
    suggestions.push('팝업스토어', '플리마켓', '공간대여', '벤더매칭');

    return [...new Set(suggestions)].slice(0, 10);
}

export default {
    LISTING_PLANS,
    createSponsoredListing,
    analyzeKeywordCompetition,
    analyzeSponsoredPerformance,
    recommendPlan,
    suggestKeywords,
};
