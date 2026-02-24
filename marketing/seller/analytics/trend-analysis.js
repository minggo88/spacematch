/**
 * Space Match 셀러 마케팅 — 트렌드 분석
 * 
 * 시장 트렌드, 계절성, 카테고리 성과를 분석합니다.
 * 시계열 데이터에서 패턴을 감지하고 시각화용 데이터를 생성합니다.
 */

import { calculateGrowthRate } from './sales-insights.js';

// ── 계절성 지수 계산 ──
export function calculateSeasonalIndex(records) {
    const monthlyTotals = Array.from({ length: 12 }, () => ({ revenue: 0, count: 0 }));

    records.forEach(r => {
        if (!r.record_date) return;
        const month = new Date(r.record_date).getMonth();
        monthlyTotals[month].revenue += Number(r.monthly_revenue) || 0;
        monthlyTotals[month].count += 1;
    });

    const monthlyAvg = monthlyTotals.map(m => m.count > 0 ? m.revenue / m.count : 0);
    const overallAvg = monthlyAvg.reduce((s, v) => s + v, 0) / 12;

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    return monthNames.map((name, i) => ({
        month: name,
        monthIndex: i,
        avgRevenue: Math.round(monthlyAvg[i]),
        seasonalIndex: overallAvg > 0 ? Math.round((monthlyAvg[i] / overallAvg) * 100) / 100 : 0,
        classification: monthlyAvg[i] > overallAvg * 1.15 ? 'high_season'
            : monthlyAvg[i] < overallAvg * 0.85 ? 'low_season'
                : 'normal',
    }));
}

// ── 전년 동기 대비 (YoY) 분석 ──
export function calculateYoYComparison(records) {
    const yearMonthMap = {};

    records.forEach(r => {
        if (!r.record_date) return;
        const ym = r.record_date.substring(0, 7);
        if (!yearMonthMap[ym]) yearMonthMap[ym] = { revenue: 0, transactions: 0, customers: 0 };
        yearMonthMap[ym].revenue += Number(r.monthly_revenue) || 0;
        yearMonthMap[ym].transactions += Number(r.transaction_count) || 0;
        yearMonthMap[ym].customers += Number(r.customer_count) || 0;
    });

    const results = [];
    Object.keys(yearMonthMap).sort().forEach(ym => {
        const [year, month] = ym.split('-');
        const prevYM = `${Number(year) - 1}-${month}`;
        const current = yearMonthMap[ym];
        const previous = yearMonthMap[prevYM];

        results.push({
            period: ym,
            current,
            previous: previous || null,
            yoyGrowth: previous ? {
                revenue: calculateGrowthRate(current.revenue, previous.revenue),
                transactions: calculateGrowthRate(current.transactions, previous.transactions),
                customers: calculateGrowthRate(current.customers, previous.customers),
            } : null,
        });
    });

    return results;
}

// ── 카테고리별 성장 추이 ──
export function analyzeCategoryGrowth(records) {
    const categoryTimeline = {};

    records.forEach(r => {
        const cat = r.best_selling_item;
        if (!cat || !r.record_date) return;

        const ym = r.record_date.substring(0, 7);
        if (!categoryTimeline[cat]) categoryTimeline[cat] = {};
        if (!categoryTimeline[cat][ym]) categoryTimeline[cat][ym] = { revenue: 0, count: 0 };
        categoryTimeline[cat][ym].revenue += Number(r.monthly_revenue) || 0;
        categoryTimeline[cat][ym].count += 1;
    });

    return Object.entries(categoryTimeline).map(([category, timeline]) => {
        const periods = Object.keys(timeline).sort();
        const revenueValues = periods.map(p => timeline[p].revenue);
        const latestRevenue = revenueValues[revenueValues.length - 1] || 0;
        const previousRevenue = revenueValues.length > 1 ? revenueValues[revenueValues.length - 2] : 0;

        return {
            category,
            periods: periods.length,
            totalRevenue: revenueValues.reduce((s, v) => s + v, 0),
            latestRevenue,
            growth: calculateGrowthRate(latestRevenue, previousRevenue),
            trend: latestRevenue > previousRevenue ? 'rising' : latestRevenue < previousRevenue ? 'falling' : 'stable',
            timeline: periods.map(p => ({ period: p, ...timeline[p] })),
        };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// ── 이상치(Outlier) 감지 — IQR 방법 ──
export function detectOutliers(records) {
    const revenues = records
        .map(r => ({ date: r.record_date, revenue: Number(r.monthly_revenue) || 0, type: r.record_type }))
        .filter(r => r.revenue > 0)
        .sort((a, b) => a.revenue - b.revenue);

    if (revenues.length < 4) return { outliers: [], upperBound: 0, lowerBound: 0 };

    const q1 = revenues[Math.floor(revenues.length * 0.25)].revenue;
    const q3 = revenues[Math.floor(revenues.length * 0.75)].revenue;
    const iqr = q3 - q1;
    const lowerBound = Math.max(0, q1 - 1.5 * iqr);
    const upperBound = q3 + 1.5 * iqr;

    return {
        outliers: revenues.filter(r => r.revenue < lowerBound || r.revenue > upperBound),
        upperBound: Math.round(upperBound),
        lowerBound: Math.round(lowerBound),
        q1: Math.round(q1),
        q3: Math.round(q3),
        iqr: Math.round(iqr),
    };
}

// ── 고객 전환율 트렌드 ──
export function analyzeConversionTrend(records) {
    return records
        .filter(r => r.record_date && (Number(r.customer_count) || 0) > 0)
        .map(r => {
            const customers = Number(r.customer_count) || 0;
            const transactions = Number(r.transaction_count) || 0;
            return {
                date: r.record_date,
                type: r.record_type,
                customers,
                transactions,
                conversionRate: customers > 0 ? Math.round((transactions / customers) * 10000) / 100 : 0,
            };
        })
        .sort((a, b) => a.date.localeCompare(b.date));
}

// ── 만족도 트렌드 분석 ──
export function analyzeSatisfactionTrend(records) {
    return records
        .filter(r => r.record_date && (Number(r.satisfaction_score) || 0) > 0)
        .map(r => ({
            date: r.record_date,
            type: r.record_type,
            score: Number(r.satisfaction_score),
            country: r.country_code || 'KR',
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

// ── 지역별 매출 히트맵 데이터 ──
export function generateRegionHeatmap(records) {
    const regionMap = {};

    records.forEach(r => {
        const region = r.region || 'unknown';
        const country = r.country_code || 'KR';
        const key = `${country}:${region}`;

        if (!regionMap[key]) {
            regionMap[key] = { country, region, revenue: 0, transactions: 0, count: 0 };
        }
        regionMap[key].revenue += Number(r.monthly_revenue) || 0;
        regionMap[key].transactions += Number(r.transaction_count) || 0;
        regionMap[key].count += 1;
    });

    return Object.values(regionMap)
        .filter(r => r.region !== 'unknown')
        .sort((a, b) => b.revenue - a.revenue);
}

// ── 종합 트렌드 리포트 생성 ──
export function generateTrendReport(records) {
    const seasonality = calculateSeasonalIndex(records);
    const yoy = calculateYoYComparison(records);
    const categoryGrowth = analyzeCategoryGrowth(records);
    const outliers = detectOutliers(records);
    const conversion = analyzeConversionTrend(records);
    const satisfaction = analyzeSatisfactionTrend(records);
    const regionHeatmap = generateRegionHeatmap(records);

    // 시즌 인사이트
    const highSeasons = seasonality.filter(s => s.classification === 'high_season');
    const lowSeasons = seasonality.filter(s => s.classification === 'low_season');
    const risingCategories = categoryGrowth.filter(c => c.trend === 'rising');

    return {
        seasonality,
        yoyComparison: yoy,
        categoryGrowth,
        outliers,
        conversionTrend: conversion,
        satisfactionTrend: satisfaction,
        regionHeatmap,
        summary: {
            highSeasons: highSeasons.map(s => s.month),
            lowSeasons: lowSeasons.map(s => s.month),
            risingCategories: risingCategories.map(c => c.category),
            outliersDetected: outliers.outliers.length,
        },
        generatedAt: new Date().toISOString(),
    };
}

export default {
    calculateSeasonalIndex,
    calculateYoYComparison,
    analyzeCategoryGrowth,
    detectOutliers,
    analyzeConversionTrend,
    analyzeSatisfactionTrend,
    generateRegionHeatmap,
    generateTrendReport,
};
