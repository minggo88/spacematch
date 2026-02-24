/**
 * Space Match 벤더 마케팅 — ROI 계산기
 * 
 * 마케팅 투자 대비 수익률을 다양한 방법으로 계산합니다.
 * 캠페인별, 채널별, 기간별 ROI 분석을 지원합니다.
 */

// ── ROI 계산 방법 ──
export const ROI_METHODS = {
    SIMPLE: { id: 'simple', label: '단순 ROI', formula: '(수익 - 비용) / 비용 × 100' },
    ROAS: { id: 'roas', label: 'ROAS', formula: '수익 / 광고비' },
    LTV: { id: 'ltv', label: 'LTV 기반', formula: '고객 생애 가치 / 획득 비용' },
    INCREMENTAL: { id: 'incremental', label: '증분 ROI', formula: '(마케팅 후 매출 - 기준 매출) / 비용' },
};

// ── 단순 ROI 계산 ──
export function calculateSimpleROI(revenue, cost) {
    if (cost === 0) return { roi: revenue > 0 ? Infinity : 0, roiPercent: revenue > 0 ? '∞' : '0%' };
    const roi = (revenue - cost) / cost;
    return {
        roi: Math.round(roi * 100) / 100,
        roiPercent: `${Math.round(roi * 10000) / 100}%`,
        profit: revenue - cost,
        costEfficiency: revenue > cost ? 'profitable' : 'unprofitable',
    };
}

// ── ROAS (Return on Ad Spend) ──
export function calculateROAS(revenue, adSpend) {
    if (adSpend === 0) return { roas: 0, label: '광고비 없음' };
    const roas = revenue / adSpend;
    return {
        roas: Math.round(roas * 100) / 100,
        label: `${Math.round(roas * 100) / 100}x`,
        interpretation: roas >= 4 ? '우수' : roas >= 2 ? '양호' : roas >= 1 ? '손익분기점' : '적자',
        breakeven: roas >= 1,
    };
}

// ── LTV (고객 생애 가치) 기반 ROI ──
export function calculateLTVBasedROI({
    avgRevenuePerCustomer = 0,
    avgVisitsPerYear = 1,
    avgRetentionYears = 2,
    grossMarginPercent = 40,
    acquisitionCost = 0,
}) {
    const ltv = avgRevenuePerCustomer * avgVisitsPerYear * avgRetentionYears * (grossMarginPercent / 100);
    const ltvToCAC = acquisitionCost > 0 ? ltv / acquisitionCost : 0;

    return {
        ltv: Math.round(ltv),
        acquisitionCost,
        ltvToCAC: Math.round(ltvToCAC * 100) / 100,
        profitable: ltvToCAC > 1,
        interpretation: ltvToCAC >= 3 ? '매우 효율적' : ltvToCAC >= 1 ? '효율적' : '비효율적',
        paybackMonths: acquisitionCost > 0 && avgRevenuePerCustomer > 0
            ? Math.ceil(acquisitionCost / (avgRevenuePerCustomer * (grossMarginPercent / 100) / 12))
            : null,
    };
}

// ── 캠페인별 ROI 비교 ──
export function compareCampaignROI(campaigns = []) {
    const results = campaigns.map(c => ({
        name: c.name,
        type: c.type || 'unknown',
        spend: c.spend || 0,
        revenue: c.revenue || 0,
        ...calculateSimpleROI(c.revenue || 0, c.spend || 0),
        roas: calculateROAS(c.revenue || 0, c.spend || 0),
        conversions: c.conversions || 0,
        cpa: c.conversions > 0 ? Math.round((c.spend || 0) / c.conversions) : 0,
    }));

    results.sort((a, b) => b.roi - a.roi);

    const totalSpend = results.reduce((s, r) => s + r.spend, 0);
    const totalRevenue = results.reduce((s, r) => s + r.revenue, 0);

    return {
        campaigns: results,
        summary: {
            totalSpend,
            totalRevenue,
            ...calculateSimpleROI(totalRevenue, totalSpend),
            bestPerformer: results[0]?.name || 'N/A',
            worstPerformer: results[results.length - 1]?.name || 'N/A',
        },
    };
}

// ── 월별 ROI 추이 ──
export function calculateMonthlyROI(monthlyData = []) {
    return monthlyData.map(m => ({
        month: m.month,
        revenue: m.revenue || 0,
        cost: m.cost || 0,
        ...calculateSimpleROI(m.revenue || 0, m.cost || 0),
        roas: calculateROAS(m.revenue || 0, m.cost || 0),
    }));
}

// ── 예산 최적화 추천 ──
export function optimizeBudgetAllocation(campaigns = [], totalBudget = null) {
    if (campaigns.length === 0) return { allocations: [], message: '캠페인 데이터가 없습니다' };

    const withROI = campaigns.map(c => ({
        ...c,
        roi: c.spend > 0 ? (c.revenue - c.spend) / c.spend : 0,
    })).sort((a, b) => b.roi - a.roi);

    const budget = totalBudget || withROI.reduce((s, c) => s + (c.spend || 0), 0);
    const totalROI = withROI.reduce((s, c) => s + Math.max(0, c.roi), 0) || 1;

    const allocations = withROI.map(c => {
        const roiShare = Math.max(0, c.roi) / totalROI;
        const recommendedBudget = Math.round(budget * roiShare);
        const currentBudget = c.spend || 0;

        return {
            name: c.name,
            currentBudget,
            recommendedBudget,
            change: recommendedBudget - currentBudget,
            changePercent: currentBudget > 0 ? Math.round(((recommendedBudget - currentBudget) / currentBudget) * 100) : 0,
            currentROI: Math.round(c.roi * 10000) / 100,
            action: recommendedBudget > currentBudget ? '증액' : recommendedBudget < currentBudget ? '감액' : '유지',
        };
    });

    return {
        totalBudget: budget,
        allocations,
        expectedImprovement: '예산 재배분으로 전체 ROI 10~25% 개선 예상',
    };
}

// ── 손익분기점 계산 ──
export function calculateBreakeven(fixedCosts, revenuePerUnit, variableCostPerUnit = 0) {
    const marginPerUnit = revenuePerUnit - variableCostPerUnit;
    if (marginPerUnit <= 0) return { breakeven: Infinity, message: '단위당 수익이 비용보다 낮습니다' };

    const breakevenUnits = Math.ceil(fixedCosts / marginPerUnit);

    return {
        breakevenUnits,
        breakevenRevenue: breakevenUnits * revenuePerUnit,
        fixedCosts,
        marginPerUnit,
        marginPercent: Math.round((marginPerUnit / revenuePerUnit) * 10000) / 100,
    };
}

export default {
    ROI_METHODS,
    calculateSimpleROI,
    calculateROAS,
    calculateLTVBasedROI,
    compareCampaignROI,
    calculateMonthlyROI,
    optimizeBudgetAllocation,
    calculateBreakeven,
};
