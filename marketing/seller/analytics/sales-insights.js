/**
 * Space Match 셀러 마케팅 — 매출 인사이트 분석
 * 
 * 셀러의 매출 데이터를 분석하여 실행 가능한 인사이트를 도출합니다.
 * 기존 SellerStats 데이터(monthly_revenue, transaction_count, customer_count 등)를 활용합니다.
 */

// ── 매출 성장률 계산 ──
export function calculateGrowthRate(currentValue, previousValue) {
    if (!previousValue || previousValue === 0) return currentValue > 0 ? 100 : 0;
    return Math.round(((currentValue - previousValue) / previousValue) * 10000) / 100;
}

// ── 이동 평균 계산 (Simple Moving Average) ──
export function calculateSMA(data, period = 7) {
    if (!data || data.length < period) return [];
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const avg = slice.reduce((sum, v) => sum + v, 0) / period;
        result.push(Math.round(avg));
    }
    return result;
}

// ── 가중 이동 평균 (최근 데이터에 가중치 부여) ──
export function calculateWMA(data, period = 7) {
    if (!data || data.length < period) return [];
    const result = [];
    const totalWeight = (period * (period + 1)) / 2;
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        let wma = 0;
        slice.forEach((v, idx) => { wma += v * (idx + 1); });
        result.push(Math.round(wma / totalWeight));
    }
    return result;
}

// ── 매출 기록 배열에서 요약 통계 추출 ──
export function computeSummaryStats(records) {
    if (!records || records.length === 0) {
        return { count: 0, totalRevenue: 0, avgRevenue: 0, maxRevenue: 0, minRevenue: 0, medianRevenue: 0, stdDev: 0 };
    }

    const revenues = records.map(r => Number(r.monthly_revenue) || 0).filter(v => v > 0);
    if (revenues.length === 0) {
        return { count: records.length, totalRevenue: 0, avgRevenue: 0, maxRevenue: 0, minRevenue: 0, medianRevenue: 0, stdDev: 0 };
    }

    const sorted = [...revenues].sort((a, b) => a - b);
    const total = revenues.reduce((s, v) => s + v, 0);
    const avg = total / revenues.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const variance = revenues.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / revenues.length;

    return {
        count: records.length,
        totalRevenue: total,
        avgRevenue: Math.round(avg),
        maxRevenue: sorted[sorted.length - 1],
        minRevenue: sorted[0],
        medianRevenue: Math.round(median),
        stdDev: Math.round(Math.sqrt(variance)),
    };
}

// ── 요일별 매출 패턴 분석 ──
export function analyzeWeekdayPattern(records) {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayStats = Array.from({ length: 7 }, () => ({ total: 0, count: 0 }));

    records.forEach(r => {
        if (r.record_type !== 'daily' || !r.record_date) return;
        const day = new Date(r.record_date).getDay();
        dayStats[day].total += Number(r.monthly_revenue) || 0;
        dayStats[day].count += 1;
    });

    return dayNames.map((name, i) => ({
        day: name,
        dayIndex: i,
        totalRevenue: dayStats[i].total,
        avgRevenue: dayStats[i].count > 0 ? Math.round(dayStats[i].total / dayStats[i].count) : 0,
        recordCount: dayStats[i].count,
    }));
}

// ── 월별 매출 추이 분석 ──
export function analyzeMonthlyTrend(records) {
    const monthMap = {};

    records.forEach(r => {
        if (!r.record_date) return;
        const date = r.record_date.substring(0, 7); // YYYY-MM
        if (!monthMap[date]) {
            monthMap[date] = { revenue: 0, transactions: 0, customers: 0, count: 0 };
        }
        monthMap[date].revenue += Number(r.monthly_revenue) || 0;
        monthMap[date].transactions += Number(r.transaction_count) || 0;
        monthMap[date].customers += Number(r.customer_count) || 0;
        monthMap[date].count += 1;
    });

    const months = Object.keys(monthMap).sort();
    return months.map((month, i) => {
        const current = monthMap[month];
        const previous = i > 0 ? monthMap[months[i - 1]] : null;
        return {
            month,
            revenue: current.revenue,
            transactions: current.transactions,
            customers: current.customers,
            recordCount: current.count,
            revenueGrowth: previous ? calculateGrowthRate(current.revenue, previous.revenue) : 0,
            transactionGrowth: previous ? calculateGrowthRate(current.transactions, previous.transactions) : 0,
        };
    });
}

// ── 베스트/워스트 기간 식별 ──
export function identifyPeakPeriods(records, topN = 5) {
    const sorted = [...records]
        .filter(r => (Number(r.monthly_revenue) || 0) > 0)
        .sort((a, b) => (Number(b.monthly_revenue) || 0) - (Number(a.monthly_revenue) || 0));

    return {
        best: sorted.slice(0, topN).map(r => ({
            date: r.record_date,
            type: r.record_type,
            revenue: Number(r.monthly_revenue),
            country: r.country_code || 'KR',
        })),
        worst: sorted.slice(-topN).reverse().map(r => ({
            date: r.record_date,
            type: r.record_type,
            revenue: Number(r.monthly_revenue),
            country: r.country_code || 'KR',
        })),
    };
}

// ── 객단가 트렌드 분석 ──
export function analyzeUnitPriceTrend(records) {
    return records
        .filter(r => (Number(r.monthly_revenue) || 0) > 0 && (Number(r.transaction_count) || 0) > 0)
        .map(r => ({
            date: r.record_date,
            type: r.record_type,
            unitPrice: Math.round(Number(r.monthly_revenue) / Number(r.transaction_count)),
            revenue: Number(r.monthly_revenue),
            transactions: Number(r.transaction_count),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

// ── 국가별 매출 비교 분석 ──
export function analyzeCountryPerformance(records) {
    const countryMap = {};

    records.forEach(r => {
        const cc = r.country_code || 'KR';
        if (!countryMap[cc]) {
            countryMap[cc] = { revenue: 0, transactions: 0, customers: 0, count: 0 };
        }
        countryMap[cc].revenue += Number(r.monthly_revenue) || 0;
        countryMap[cc].transactions += Number(r.transaction_count) || 0;
        countryMap[cc].customers += Number(r.customer_count) || 0;
        countryMap[cc].count += 1;
    });

    const totalRevenue = Object.values(countryMap).reduce((s, c) => s + c.revenue, 0);

    return Object.entries(countryMap)
        .map(([code, data]) => ({
            countryCode: code,
            revenue: data.revenue,
            transactions: data.transactions,
            customers: data.customers,
            recordCount: data.count,
            avgRevenue: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
            sharePercent: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 10000) / 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);
}

// ── 인기 상품 카테고리 분석 ──
export function analyzeBestSellingCategories(records) {
    const categoryMap = {};

    records.forEach(r => {
        const item = r.best_selling_item;
        if (!item) return;
        if (!categoryMap[item]) {
            categoryMap[item] = { count: 0, totalRevenue: 0 };
        }
        categoryMap[item].count += 1;
        categoryMap[item].totalRevenue += Number(r.monthly_revenue) || 0;
    });

    return Object.entries(categoryMap)
        .map(([name, data]) => ({
            category: name,
            frequency: data.count,
            totalRevenue: data.totalRevenue,
            avgRevenue: data.count > 0 ? Math.round(data.totalRevenue / data.count) : 0,
        }))
        .sort((a, b) => b.frequency - a.frequency);
}

// ── 단순 선형 회귀 기반 매출 예측 ──
export function forecastRevenue(records, periodsAhead = 3) {
    const monthlyData = analyzeMonthlyTrend(records);
    if (monthlyData.length < 3) return { forecast: [], confidence: 'low', trend: 'insufficient_data' };

    const revenues = monthlyData.map(m => m.revenue);
    const n = revenues.length;
    const xMean = (n - 1) / 2;
    const yMean = revenues.reduce((s, v) => s + v, 0) / n;

    let numerator = 0, denominator = 0;
    revenues.forEach((y, x) => {
        numerator += (x - xMean) * (y - yMean);
        denominator += Math.pow(x - xMean, 2);
    });

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    // R² 계산 (결정계수)
    const ssRes = revenues.reduce((s, y, x) => s + Math.pow(y - (intercept + slope * x), 2), 0);
    const ssTot = revenues.reduce((s, y) => s + Math.pow(y - yMean, 2), 0);
    const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

    const lastMonth = monthlyData[monthlyData.length - 1].month;
    const forecast = [];
    for (let i = 1; i <= periodsAhead; i++) {
        const predictedRevenue = Math.max(0, Math.round(intercept + slope * (n - 1 + i)));
        const [y, m] = lastMonth.split('-').map(Number);
        const futureDate = new Date(y, m - 1 + i, 1);
        forecast.push({
            month: `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`,
            predictedRevenue,
            lowerBound: Math.max(0, Math.round(predictedRevenue * 0.85)),
            upperBound: Math.round(predictedRevenue * 1.15),
        });
    }

    return {
        forecast,
        confidence: rSquared > 0.7 ? 'high' : rSquared > 0.4 ? 'medium' : 'low',
        rSquared: Math.round(rSquared * 100) / 100,
        trend: slope > 0 ? 'growing' : slope < 0 ? 'declining' : 'stable',
        monthlyGrowthRate: revenues.length > 1 ? calculateGrowthRate(revenues[revenues.length - 1], revenues[revenues.length - 2]) : 0,
    };
}

// ── 종합 인사이트 리포트 생성 ──
export function generateInsightReport(records) {
    const summary = computeSummaryStats(records);
    const weekdayPattern = analyzeWeekdayPattern(records);
    const monthlyTrend = analyzeMonthlyTrend(records);
    const peaks = identifyPeakPeriods(records);
    const unitPriceTrend = analyzeUnitPriceTrend(records);
    const countryPerformance = analyzeCountryPerformance(records);
    const categories = analyzeBestSellingCategories(records);
    const forecast = forecastRevenue(records);

    // 핵심 인사이트 자동 생성
    const insights = [];

    // 성장 트렌드
    if (forecast.trend === 'growing') {
        insights.push({ type: 'positive', key: 'growthTrend', message: `매출이 성장 추세입니다. 월간 성장률: ${forecast.monthlyGrowthRate}%` });
    } else if (forecast.trend === 'declining') {
        insights.push({ type: 'warning', key: 'declineTrend', message: `매출이 하락 추세입니다. 프로모션 전략을 검토하세요.` });
    }

    // 최고 매출 요일
    const bestDay = weekdayPattern.reduce((best, d) => d.avgRevenue > best.avgRevenue ? d : best, weekdayPattern[0]);
    if (bestDay && bestDay.avgRevenue > 0) {
        insights.push({ type: 'info', key: 'bestDay', message: `${bestDay.day}요일이 평균 매출이 가장 높습니다.` });
    }

    // 주력 카테고리
    if (categories.length > 0) {
        insights.push({ type: 'info', key: 'topCategory', message: `인기 카테고리: ${categories[0].category} (${categories[0].frequency}회)` });
    }

    // 국가 다양성
    if (countryPerformance.length > 1) {
        insights.push({ type: 'positive', key: 'multiCountry', message: `${countryPerformance.length}개 국가에서 매출이 발생하고 있습니다.` });
    }

    return {
        summary,
        weekdayPattern,
        monthlyTrend,
        peaks,
        unitPriceTrend,
        countryPerformance,
        categories,
        forecast,
        insights,
        generatedAt: new Date().toISOString(),
    };
}

export default {
    calculateGrowthRate,
    calculateSMA,
    calculateWMA,
    computeSummaryStats,
    analyzeWeekdayPattern,
    analyzeMonthlyTrend,
    identifyPeakPeriods,
    analyzeUnitPriceTrend,
    analyzeCountryPerformance,
    analyzeBestSellingCategories,
    forecastRevenue,
    generateInsightReport,
};
