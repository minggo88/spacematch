/**
 * Space Match 셀러 마케팅 — 고객 세그먼테이션
 * 
 * RFM(Recency, Frequency, Monetary) 분석 기반 고객 분류
 * 셀러의 거래 데이터를 활용하여 고객을 세그먼트로 분류하고
 * 각 세그먼트에 맞는 마케팅 전략을 제시합니다.
 */

// ── 고객 세그먼트 정의 ──
export const SEGMENTS = {
    CHAMPION: {
        id: 'champion',
        label: '챔피언',
        description: '최근 구매, 자주 구매, 높은 소비',
        color: '#10B981',
        icon: '👑',
        strategy: '로열티 프로그램, VIP 혜택 제공',
    },
    LOYAL: {
        id: 'loyal',
        label: '충성 고객',
        description: '자주 방문하고 꾸준히 구매',
        color: '#3B82F6',
        icon: '💎',
        strategy: '업셀링, 신상품 먼저 안내',
    },
    POTENTIAL: {
        id: 'potential',
        label: '잠재 충성',
        description: '최근 구매, 아직 빈도가 낮음',
        color: '#8B5CF6',
        icon: '⭐',
        strategy: '멤버십 가입 유도, 재구매 쿠폰',
    },
    NEW: {
        id: 'new',
        label: '신규 고객',
        description: '최근 첫 구매',
        color: '#06B6D4',
        icon: '🆕',
        strategy: '환영 쿠폰, 온보딩 가이드',
    },
    PROMISING: {
        id: 'promising',
        label: '유망 고객',
        description: '최근 구매, 보통 빈도/금액',
        color: '#F59E0B',
        icon: '📈',
        strategy: '한정 혜택, 교차 판매 추천',
    },
    NEEDS_ATTENTION: {
        id: 'needs_attention',
        label: '관심 필요',
        description: '과거 자주 구매했으나 최근 방문 감소',
        color: '#EF4444',
        icon: '⚠️',
        strategy: '재방문 쿠폰, 맞춤 프로모션',
    },
    AT_RISK: {
        id: 'at_risk',
        label: '이탈 위험',
        description: '오래전 구매, 빈도 낮아짐',
        color: '#DC2626',
        icon: '🚨',
        strategy: '특별 할인, 설문조사 발송',
    },
    HIBERNATING: {
        id: 'hibernating',
        label: '휴면 고객',
        description: '오랜 기간 구매 없음',
        color: '#6B7280',
        icon: '💤',
        strategy: '대폭 할인 이벤트, 재활성화 캠페인',
    },
};

// ── RFM 점수 계산 (1~5점) ──
export function calculateRFMScores(customers, referenceDate = new Date()) {
    if (!customers || customers.length === 0) return [];

    // 각 지표의 경계값 계산 (5분위수)
    const recencies = customers.map(c => c.lastPurchaseDaysAgo).sort((a, b) => a - b);
    const frequencies = customers.map(c => c.purchaseCount).sort((a, b) => a - b);
    const monetaries = customers.map(c => c.totalSpent).sort((a, b) => a - b);

    const getQuantile = (sorted, q) => {
        const pos = (sorted.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        return sorted[base] + (sorted[base + 1] !== undefined ? rest * (sorted[base + 1] - sorted[base]) : 0);
    };

    const rQuintiles = [0.2, 0.4, 0.6, 0.8].map(q => getQuantile(recencies, q));
    const fQuintiles = [0.2, 0.4, 0.6, 0.8].map(q => getQuantile(frequencies, q));
    const mQuintiles = [0.2, 0.4, 0.6, 0.8].map(q => getQuantile(monetaries, q));

    const scoreValue = (value, quintiles, inverse = false) => {
        let score = 1;
        for (let i = 0; i < quintiles.length; i++) {
            if (value > quintiles[i]) score = i + 2;
        }
        return inverse ? (6 - score) : score; // Recency는 낮을수록 좋으므로 inverse
    };

    return customers.map(c => ({
        ...c,
        rfm: {
            recency: scoreValue(c.lastPurchaseDaysAgo, rQuintiles, true),  // 최근일수록 높은 점수
            frequency: scoreValue(c.purchaseCount, fQuintiles, false),
            monetary: scoreValue(c.totalSpent, mQuintiles, false),
        },
    }));
}

// ── RFM 점수 기반 세그먼트 분류 ──
export function assignSegment(rfmScores) {
    const { recency: r, frequency: f, monetary: m } = rfmScores;
    const fm = (f + m) / 2; // 빈도+금액 평균

    if (r >= 4 && fm >= 4) return SEGMENTS.CHAMPION;
    if (r >= 3 && fm >= 4) return SEGMENTS.LOYAL;
    if (r >= 4 && fm >= 2 && fm < 4) return SEGMENTS.POTENTIAL;
    if (r >= 4 && fm < 2) return SEGMENTS.NEW;
    if (r >= 3 && fm >= 2 && fm < 4) return SEGMENTS.PROMISING;
    if (r >= 2 && r < 3 && fm >= 3) return SEGMENTS.NEEDS_ATTENTION;
    if (r < 3 && fm >= 2) return SEGMENTS.AT_RISK;
    return SEGMENTS.HIBERNATING;
}

// ── 판매 기록에서 고객 데이터 추출 ──
export function extractCustomerData(records, referenceDate = new Date()) {
    const customerMap = {};

    records.forEach(r => {
        const customers = Number(r.customer_count) || 0;
        const revenue = Number(r.monthly_revenue) || 0;
        const transactions = Number(r.transaction_count) || 0;
        const date = r.record_date;
        const country = r.country_code || 'KR';

        // 국가+기간으로 시뮬레이션된 고객 그룹 생성
        const key = `${country}_${r.record_type}`;
        if (!customerMap[key]) {
            customerMap[key] = {
                id: key,
                country,
                recordType: r.record_type,
                totalSpent: 0,
                purchaseCount: 0,
                totalCustomers: 0,
                lastPurchaseDate: null,
                firstPurchaseDate: null,
                records: [],
            };
        }

        customerMap[key].totalSpent += revenue;
        customerMap[key].purchaseCount += transactions;
        customerMap[key].totalCustomers += customers;
        customerMap[key].records.push(r);

        if (!customerMap[key].lastPurchaseDate || date > customerMap[key].lastPurchaseDate) {
            customerMap[key].lastPurchaseDate = date;
        }
        if (!customerMap[key].firstPurchaseDate || date < customerMap[key].firstPurchaseDate) {
            customerMap[key].firstPurchaseDate = date;
        }
    });

    return Object.values(customerMap).map(c => ({
        ...c,
        avgOrderValue: c.purchaseCount > 0 ? Math.round(c.totalSpent / c.purchaseCount) : 0,
        lastPurchaseDaysAgo: c.lastPurchaseDate
            ? Math.floor((referenceDate - new Date(c.lastPurchaseDate)) / (1000 * 60 * 60 * 24))
            : 999,
    }));
}

// ── 세그먼트별 분포 통계 ──
export function getSegmentDistribution(segmentedCustomers) {
    const distribution = {};

    Object.values(SEGMENTS).forEach(seg => {
        distribution[seg.id] = {
            ...seg,
            count: 0,
            totalRevenue: 0,
            avgRevenue: 0,
            percentage: 0,
        };
    });

    segmentedCustomers.forEach(c => {
        const segId = c.segment.id;
        distribution[segId].count += 1;
        distribution[segId].totalRevenue += c.totalSpent;
    });

    const total = segmentedCustomers.length || 1;
    Object.values(distribution).forEach(seg => {
        seg.percentage = Math.round((seg.count / total) * 10000) / 100;
        seg.avgRevenue = seg.count > 0 ? Math.round(seg.totalRevenue / seg.count) : 0;
    });

    return Object.values(distribution).sort((a, b) => b.count - a.count);
}

// ── 전체 세그먼테이션 실행 ──
export function runSegmentation(records) {
    const customers = extractCustomerData(records);
    const scored = calculateRFMScores(customers);
    const segmented = scored.map(c => ({
        ...c,
        segment: assignSegment(c.rfm),
    }));
    const distribution = getSegmentDistribution(segmented);

    return {
        customers: segmented,
        distribution,
        totalCustomers: segmented.length,
        topSegment: distribution[0] || null,
        generatedAt: new Date().toISOString(),
    };
}

export default {
    SEGMENTS,
    calculateRFMScores,
    assignSegment,
    extractCustomerData,
    getSegmentDistribution,
    runSegmentation,
};
