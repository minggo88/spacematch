/**
 * Space Match 벤더 마케팅 — 배너 광고
 * 
 * 플랫폼 내 배너 광고 슬롯 관리, 크리에이티브 생성,
 * 노출 로테이션, 성과 추적을 지원합니다.
 */

// ── 배너 슬롯 정의 ──
export const BANNER_SLOTS = {
    HERO: { id: 'hero', label: '메인 히어로', size: '1920x600', position: 'homepage_top', pricePer1k: 5000 },
    SIDEBAR_LARGE: { id: 'sidebar_lg', label: '사이드바 대형', size: '300x600', position: 'sidebar', pricePer1k: 2000 },
    SIDEBAR_SMALL: { id: 'sidebar_sm', label: '사이드바 소형', size: '300x250', position: 'sidebar', pricePer1k: 1500 },
    INLINE: { id: 'inline', label: '콘텐츠 인라인', size: '728x90', position: 'content_mid', pricePer1k: 1800 },
    MOBILE_BOTTOM: { id: 'mobile_bottom', label: '모바일 하단', size: '320x50', position: 'mobile_footer', pricePer1k: 1200 },
    INTERSTITIAL: { id: 'interstitial', label: '전면 광고', size: '640x960', position: 'fullscreen', pricePer1k: 8000 },
};

// ── 배너 크리에이티브 생성 ──
export function createBannerCreative({
    name,
    slotId = 'inline',
    imageUrl = '',
    headline = '',
    subheadline = '',
    ctaText = '자세히 보기',
    linkUrl = '',
    backgroundColor = '#FFFFFF',
    textColor = '#000000',
}) {
    const slot = BANNER_SLOTS[slotId.toUpperCase()] || BANNER_SLOTS.INLINE;

    return {
        id: `banner_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: name || `${slot.label} 배너`,
        slot: slot.id,
        slotLabel: slot.label,
        size: slot.size,
        content: {
            imageUrl,
            headline,
            subheadline,
            ctaText,
            linkUrl,
            backgroundColor,
            textColor,
        },
        status: 'draft',
        metrics: { impressions: 0, clicks: 0, conversions: 0 },
        createdAt: new Date().toISOString(),
    };
}

// ── 배너 캠페인 생성 ──
export function createBannerCampaign({
    name,
    banners = [],
    budget = 100000,
    schedule = {},
    targeting = {},
    rotationType = 'even', // even: 균등, weighted: 성과기반, sequential: 순차
}) {
    const startDate = schedule.startDate || new Date().toISOString().split('T')[0];
    const endDate = schedule.endDate || (() => {
        const d = new Date(startDate); d.setDate(d.getDate() + 14); return d.toISOString().split('T')[0];
    })();

    return {
        id: `banner_campaign_${Date.now()}`,
        name,
        banners,
        budget: { total: budget, spent: 0, remaining: budget },
        schedule: { startDate, endDate },
        targeting,
        rotationType,
        status: 'draft',
        totalImpressions: 0,
        totalClicks: 0,
        createdAt: new Date().toISOString(),
    };
}

// ── 배너 로테이션 (다음 표시할 배너 결정) ──
export function selectNextBanner(campaign) {
    const { banners, rotationType } = campaign;
    if (!banners || banners.length === 0) return null;

    switch (rotationType) {
        case 'weighted': {
            // 성과 기반: CTR이 높은 배너에 더 많은 노출
            const withCtr = banners.map(b => ({
                ...b,
                ctr: b.metrics.impressions > 0 ? b.metrics.clicks / b.metrics.impressions : 0.01,
            }));
            const totalCtr = withCtr.reduce((s, b) => s + b.ctr, 0);
            let random = Math.random() * totalCtr;
            for (const banner of withCtr) {
                random -= banner.ctr;
                if (random <= 0) return banner;
            }
            return withCtr[0];
        }
        case 'sequential': {
            // 순차: 가장 적게 노출된 배너
            return [...banners].sort((a, b) => a.metrics.impressions - b.metrics.impressions)[0];
        }
        default: {
            // 균등: 랜덤 선택
            return banners[Math.floor(Math.random() * banners.length)];
        }
    }
}

// ── 배너 성과 분석 ──
export function analyzeBannerPerformance(banner) {
    const { impressions, clicks, conversions } = banner.metrics;
    const slot = Object.values(BANNER_SLOTS).find(s => s.id === banner.slot);
    const estimatedCost = slot ? Math.round((impressions / 1000) * slot.pricePer1k) : 0;

    return {
        bannerId: banner.id,
        name: banner.name,
        slot: banner.slotLabel,
        size: banner.size,
        impressions,
        clicks,
        conversions,
        ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
        cvr: clicks > 0 ? Math.round((conversions / clicks) * 10000) / 100 : 0,
        estimatedCost,
        costPerClick: clicks > 0 ? Math.round(estimatedCost / clicks) : 0,
        // 배너 위치별 벤치마크
        benchmark: getBannerBenchmark(banner.slot),
    };
}

function getBannerBenchmark(slotId) {
    const benchmarks = {
        hero: { ctr: 1.5, cvr: 2.0 },
        sidebar_lg: { ctr: 0.8, cvr: 1.5 },
        sidebar_sm: { ctr: 0.5, cvr: 1.0 },
        inline: { ctr: 1.0, cvr: 1.8 },
        mobile_bottom: { ctr: 0.6, cvr: 0.8 },
        interstitial: { ctr: 3.0, cvr: 4.0 },
    };
    return benchmarks[slotId] || { ctr: 1.0, cvr: 1.5 };
}

// ── 슬롯별 비용 견적 ──
export function estimateBannerCost(slotId, targetImpressions = 10000) {
    const slot = BANNER_SLOTS[slotId.toUpperCase()] || Object.values(BANNER_SLOTS).find(s => s.id === slotId);
    if (!slot) return null;

    const cost = Math.round((targetImpressions / 1000) * slot.pricePer1k);
    return {
        slot: slot.label,
        size: slot.size,
        targetImpressions,
        pricePer1k: slot.pricePer1k,
        estimatedCost: cost,
        estimatedClicks: Math.round(targetImpressions * 0.01), // 1% CTR 가정
    };
}

export default {
    BANNER_SLOTS,
    createBannerCreative,
    createBannerCampaign,
    selectNextBanner,
    analyzeBannerPerformance,
    estimateBannerCost,
};
