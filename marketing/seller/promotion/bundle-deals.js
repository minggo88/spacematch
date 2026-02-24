/**
 * Space Match 셀러 마케팅 — 번들 딜 생성
 * 
 * 상품을 묶어 세트 할인을 제공하는 번들 딜을 관리합니다.
 * 크로스셀링, 업셀링 전략과 연계됩니다.
 */

// ── 번들 유형 ──
export const BUNDLE_TYPES = {
    FIXED_SET: { id: 'fixed_set', label: '고정 세트', icon: '📦', description: '지정된 상품 조합' },
    MIX_MATCH: { id: 'mix_match', label: '조합 자유', icon: '🎨', description: 'N개 선택 시 할인' },
    TIERED: { id: 'tiered', label: '단계별 할인', icon: '📊', description: '구매 수량에 따라 할인 증가' },
    CROSS_SELL: { id: 'cross_sell', label: '교차 판매', icon: '🔄', description: '관련 카테고리 조합' },
};

// ── 번들 딜 생성 ──
export function createBundle({
    name,
    type = 'fixed_set',
    items = [],
    discountPercent = 10,
    discountAmount = null,
    minItems = 2,
    maxItems = null,
    validFrom = new Date().toISOString().split('T')[0],
    validUntil = null,
    description = '',
    tieredDiscounts = null, // { 2: 5, 3: 10, 5: 15 } — 수량별 할인율
}) {
    if (!name) throw new Error('번들 이름은 필수입니다');

    if (!validUntil) {
        const d = new Date(validFrom);
        d.setDate(d.getDate() + 30);
        validUntil = d.toISOString().split('T')[0];
    }

    return {
        id: `bundle_${Date.now()}`,
        name,
        description,
        type,
        items: items.map(item => ({
            id: item.id || `item_${Math.random().toString(36).substr(2, 6)}`,
            name: item.name,
            category: item.category || '',
            originalPrice: item.originalPrice || 0,
            quantity: item.quantity || 1,
        })),
        discountPercent,
        discountAmount,
        minItems,
        maxItems,
        validFrom,
        validUntil,
        tieredDiscounts,
        status: 'active',
        salesCount: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString(),
    };
}

// ── 번들 가격 계산 ──
export function calculateBundlePrice(bundle, selectedItems = null) {
    const items = selectedItems || bundle.items;
    const originalTotal = items.reduce((sum, item) => sum + (item.originalPrice * (item.quantity || 1)), 0);

    let discount = 0;

    if (bundle.type === 'tiered' && bundle.tieredDiscounts) {
        const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const tiers = Object.entries(bundle.tieredDiscounts)
            .map(([qty, pct]) => ({ qty: Number(qty), pct }))
            .sort((a, b) => b.qty - a.qty);

        const applicableTier = tiers.find(t => totalQuantity >= t.qty);
        const percent = applicableTier ? applicableTier.pct : 0;
        discount = Math.round(originalTotal * (percent / 100));
    } else if (bundle.discountAmount) {
        discount = bundle.discountAmount;
    } else {
        discount = Math.round(originalTotal * (bundle.discountPercent / 100));
    }

    discount = Math.min(discount, originalTotal); // 원가 초과 방지

    return {
        originalTotal,
        discount,
        bundlePrice: originalTotal - discount,
        savings: discount,
        savingsPercent: originalTotal > 0 ? Math.round((discount / originalTotal) * 10000) / 100 : 0,
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    };
}

// ── 교차 판매 추천 번들 자동 생성 ──
export function suggestCrossSellBundles(salesRecords, topN = 5) {
    // 같은 날짜에 팔린 카테고리 조합 분석
    const dateCategories = {};

    salesRecords.forEach(r => {
        if (!r.record_date || !r.best_selling_item) return;
        if (!dateCategories[r.record_date]) dateCategories[r.record_date] = new Set();
        dateCategories[r.record_date].add(r.best_selling_item);
    });

    // 카테고리 쌍 빈도 계산
    const pairFrequency = {};
    Object.values(dateCategories).forEach(catSet => {
        const cats = [...catSet];
        for (let i = 0; i < cats.length; i++) {
            for (let j = i + 1; j < cats.length; j++) {
                const pair = [cats[i], cats[j]].sort().join(' + ');
                pairFrequency[pair] = (pairFrequency[pair] || 0) + 1;
            }
        }
    });

    return Object.entries(pairFrequency)
        .map(([pair, count]) => ({
            categories: pair.split(' + '),
            coOccurrence: count,
            suggestion: `"${pair}" 번들 딜`,
        }))
        .sort((a, b) => b.coOccurrence - a.coOccurrence)
        .slice(0, topN);
}

// ── 단계별 할인 설정 헬퍼 ──
export function createTieredDiscountBundle(name, items, tiers = { 2: 5, 3: 10, 4: 15, 5: 20 }) {
    return createBundle({
        name,
        type: 'tiered',
        items,
        tieredDiscounts: tiers,
        minItems: Math.min(...Object.keys(tiers).map(Number)),
    });
}

// ── 번들 성과 분석 ──
export function analyzeBundlePerformance(bundle) {
    const pricing = calculateBundlePrice(bundle);
    return {
        bundleId: bundle.id,
        name: bundle.name,
        type: bundle.type,
        salesCount: bundle.salesCount,
        totalRevenue: bundle.totalRevenue,
        avgOrderValue: bundle.salesCount > 0 ? Math.round(bundle.totalRevenue / bundle.salesCount) : 0,
        pricing,
        isPopular: bundle.salesCount > 10,
        daysActive: Math.ceil((new Date() - new Date(bundle.createdAt)) / (1000 * 60 * 60 * 24)),
    };
}

export default {
    BUNDLE_TYPES,
    createBundle,
    calculateBundlePrice,
    suggestCrossSellBundles,
    createTieredDiscountBundle,
    analyzeBundlePerformance,
};
