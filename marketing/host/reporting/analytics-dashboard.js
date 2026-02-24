/**
 * Space Match 벤더 마케팅 — 분석 대시보드
 * 
 * 벤더 마케팅 활동 전반의 핵심 성과 지표를 집계하고
 * 대시보드에 표시할 데이터를 생성합니다.
 */

// ── 대시보드 위젯 유형 ──
export const WIDGET_TYPES = {
    KPI_CARD: { id: 'kpi_card', label: 'KPI 카드' },
    LINE_CHART: { id: 'line_chart', label: '라인 차트' },
    BAR_CHART: { id: 'bar_chart', label: '바 차트' },
    PIE_CHART: { id: 'pie_chart', label: '파이 차트' },
    TABLE: { id: 'table', label: '테이블' },
    HEATMAP: { id: 'heatmap', label: '히트맵' },
    FUNNEL: { id: 'funnel', label: '퍼널' },
};

// ── KPI 정의 ──
export const DASHBOARD_KPIS = {
    totalExposure: { id: 'totalExposure', label: '총 노출', unit: '회', icon: '👀', trend: 'up_good' },
    profileViews: { id: 'profileViews', label: '프로필 조회', unit: '회', icon: '👁️', trend: 'up_good' },
    inquiries: { id: 'inquiries', label: '문의 수', unit: '건', icon: '📩', trend: 'up_good' },
    bookings: { id: 'bookings', label: '예약 수', unit: '건', icon: '📋', trend: 'up_good' },
    revenue: { id: 'revenue', label: '매출', unit: '원', icon: '💰', trend: 'up_good' },
    sellerMatches: { id: 'sellerMatches', label: '셀러 매칭', unit: '건', icon: '🤝', trend: 'up_good' },
    satisfactionAvg: { id: 'satisfactionAvg', label: '평균 만족도', unit: '점', icon: '⭐', trend: 'up_good' },
    conversionRate: { id: 'conversionRate', label: '전환율', unit: '%', icon: '🎯', trend: 'up_good' },
};

// ── KPI 계산 ──
export function calculateKPIs(data) {
    const {
        impressions = 0, profileViews = 0, inquiries = 0, bookings = 0,
        revenue = 0, sellerMatches = 0, satisfactionScores = [],
        previousPeriod = {},
    } = data;

    const avgSatisfaction = satisfactionScores.length > 0
        ? Math.round((satisfactionScores.reduce((s, v) => s + v, 0) / satisfactionScores.length) * 10) / 10
        : 0;

    const conversionRate = profileViews > 0
        ? Math.round((bookings / profileViews) * 10000) / 100
        : 0;

    const kpis = [
        { ...DASHBOARD_KPIS.totalExposure, value: impressions, change: calcChange(impressions, previousPeriod.impressions) },
        { ...DASHBOARD_KPIS.profileViews, value: profileViews, change: calcChange(profileViews, previousPeriod.profileViews) },
        { ...DASHBOARD_KPIS.inquiries, value: inquiries, change: calcChange(inquiries, previousPeriod.inquiries) },
        { ...DASHBOARD_KPIS.bookings, value: bookings, change: calcChange(bookings, previousPeriod.bookings) },
        { ...DASHBOARD_KPIS.revenue, value: revenue, change: calcChange(revenue, previousPeriod.revenue) },
        { ...DASHBOARD_KPIS.sellerMatches, value: sellerMatches, change: calcChange(sellerMatches, previousPeriod.sellerMatches) },
        { ...DASHBOARD_KPIS.satisfactionAvg, value: avgSatisfaction, change: calcChange(avgSatisfaction, previousPeriod.avgSatisfaction) },
        { ...DASHBOARD_KPIS.conversionRate, value: conversionRate, change: calcChange(conversionRate, previousPeriod.conversionRate) },
    ];

    kpis.forEach(kpi => {
        kpi.changeDirection = kpi.change > 0 ? 'up' : kpi.change < 0 ? 'down' : 'flat';
        kpi.isPositive = (kpi.trend === 'up_good' && kpi.change >= 0) || (kpi.trend === 'down_good' && kpi.change <= 0);
    });

    return kpis;
}

function calcChange(current, previous) {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 10000) / 100;
}

// ── 마케팅 퍼널 데이터 ──
export function generateFunnelData(data) {
    const { impressions = 0, profileViews = 0, inquiries = 0, bookings = 0 } = data;

    const stages = [
        { stage: '노출', value: impressions, icon: '👀' },
        { stage: '프로필 조회', value: profileViews, icon: '👁️' },
        { stage: '문의', value: inquiries, icon: '📩' },
        { stage: '예약 확정', value: bookings, icon: '✅' },
    ];

    return stages.map((s, i) => ({
        ...s,
        dropoffRate: i > 0 && stages[i - 1].value > 0
            ? Math.round(((stages[i - 1].value - s.value) / stages[i - 1].value) * 10000) / 100
            : 0,
        conversionRate: stages[0].value > 0
            ? Math.round((s.value / stages[0].value) * 10000) / 100
            : 0,
    }));
}

// ── 채널별 성과 집계 ──
export function aggregateChannelPerformance(channels = []) {
    return channels.map(ch => ({
        channel: ch.name,
        impressions: ch.impressions || 0,
        clicks: ch.clicks || 0,
        conversions: ch.conversions || 0,
        spend: ch.spend || 0,
        ctr: ch.impressions > 0 ? Math.round((ch.clicks / ch.impressions) * 10000) / 100 : 0,
        cpa: ch.conversions > 0 ? Math.round(ch.spend / ch.conversions) : 0,
        roi: ch.spend > 0 ? Math.round(((ch.revenue || 0 - ch.spend) / ch.spend) * 10000) / 100 : 0,
    })).sort((a, b) => b.roi - a.roi);
}

// ── 기간별 트렌드 데이터 ──
export function generateTrendData(records, metric = 'revenue', groupBy = 'month') {
    const grouped = {};

    records.forEach(r => {
        let key;
        if (groupBy === 'month' && r.date) key = r.date.substring(0, 7);
        else if (groupBy === 'week' && r.date) {
            const d = new Date(r.date);
            const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
            key = weekStart.toISOString().split('T')[0];
        } else {
            key = r.date || 'unknown';
        }

        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += Number(r[metric]) || 0;
    });

    return Object.entries(grouped)
        .map(([period, value]) => ({ period, value }))
        .sort((a, b) => a.period.localeCompare(b.period));
}

// ── 대시보드 레이아웃 프리셋 ──
export const DASHBOARD_LAYOUTS = {
    overview: {
        id: 'overview', label: '전체 개요',
        widgets: [
            { type: 'kpi_card', span: 'full', metrics: Object.keys(DASHBOARD_KPIS).slice(0, 4) },
            { type: 'funnel', span: 'half' },
            { type: 'line_chart', span: 'half', metric: 'revenue' },
            { type: 'bar_chart', span: 'half', metric: 'channels' },
            { type: 'table', span: 'half', content: 'recent_activities' },
        ],
    },
    marketing: {
        id: 'marketing', label: '마케팅 성과',
        widgets: [
            { type: 'kpi_card', span: 'full', metrics: ['totalExposure', 'profileViews', 'conversionRate'] },
            { type: 'line_chart', span: 'full', metric: 'impressions_trend' },
            { type: 'pie_chart', span: 'half', metric: 'channel_distribution' },
            { type: 'bar_chart', span: 'half', metric: 'campaign_comparison' },
        ],
    },
};

export default {
    WIDGET_TYPES,
    DASHBOARD_KPIS,
    calculateKPIs,
    generateFunnelData,
    aggregateChannelPerformance,
    generateTrendData,
    DASHBOARD_LAYOUTS,
};
