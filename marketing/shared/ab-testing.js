/**
 * Space Match 공통 — A/B 테스트 프레임워크
 * 
 * 마케팅 요소의 A/B 테스트를 관리합니다.
 * 실험 설계, 트래픽 분배, 통계적 유의성 판정을 지원합니다.
 */

// ── 테스트 상태 ──
export const TEST_STATES = {
    DRAFT: { id: 'draft', label: '설계 중' },
    RUNNING: { id: 'running', label: '실행 중' },
    PAUSED: { id: 'paused', label: '일시정지' },
    COMPLETED: { id: 'completed', label: '완료' },
    CANCELLED: { id: 'cancelled', label: '취소' },
};

// ── 테스트 가능 요소 ──
export const TESTABLE_ELEMENTS = {
    HEADLINE: { id: 'headline', label: '헤드라인', category: 'content' },
    CTA_TEXT: { id: 'cta_text', label: 'CTA 버튼 텍스트', category: 'content' },
    IMAGE: { id: 'image', label: '이미지', category: 'visual' },
    COLOR: { id: 'color', label: '색상/테마', category: 'visual' },
    LAYOUT: { id: 'layout', label: '레이아웃', category: 'structure' },
    PRICING: { id: 'pricing', label: '가격/할인율', category: 'offer' },
    EMAIL_SUBJECT: { id: 'email_subject', label: '이메일 제목줄', category: 'email' },
    SEND_TIME: { id: 'send_time', label: '발송 시간', category: 'timing' },
};

// ── A/B 테스트 생성 ──
export function createABTest({
    name,
    element = 'headline',
    variants = [],
    trafficSplit = null,
    targetMetric = 'conversion_rate',
    minSampleSize = 100,
    maxDuration = 14, // 일
    confidenceLevel = 0.95,
}) {
    if (!name) throw new Error('테스트 이름은 필수입니다');
    if (variants.length < 2) throw new Error('최소 2개 변형이 필요합니다');

    // 기본 트래픽 분배: 균등
    const split = trafficSplit || variants.map(() => Math.round(100 / variants.length));

    return {
        id: `ab_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        element,
        elementLabel: TESTABLE_ELEMENTS[element.toUpperCase()]?.label || element,
        variants: variants.map((v, i) => ({
            id: `var_${String.fromCharCode(65 + i)}`, // A, B, C...
            label: v.label || `변형 ${String.fromCharCode(65 + i)}`,
            content: v.content,
            trafficPercent: split[i] || Math.round(100 / variants.length),
            metrics: { visitors: 0, conversions: 0, revenue: 0, clicks: 0 },
        })),
        targetMetric,
        minSampleSize,
        maxDuration,
        confidenceLevel,
        status: 'draft',
        winner: null,
        startedAt: null,
        completedAt: null,
        createdAt: new Date().toISOString(),
    };
}

// ── 사용자를 변형에 배정 ──
export function assignVariant(test, userId) {
    if (test.status !== 'running') return null;

    // 결정적 해싱으로 일관된 변형 배정
    let hash = 0;
    const key = `${test.id}_${userId}`;
    for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) - hash) + key.charCodeAt(i);
        hash |= 0;
    }
    const bucket = Math.abs(hash) % 100;

    let cumulative = 0;
    for (const variant of test.variants) {
        cumulative += variant.trafficPercent;
        if (bucket < cumulative) return variant;
    }
    return test.variants[test.variants.length - 1];
}

// ── 전환 기록 ──
export function recordConversion(test, variantId, revenue = 0) {
    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) return test;

    variant.metrics.conversions += 1;
    variant.metrics.revenue += revenue;
    return test;
}

// ── 통계적 유의성 테스트 (Z-test) ──
export function calculateSignificance(variantA, variantB) {
    const nA = variantA.metrics.visitors;
    const nB = variantB.metrics.visitors;
    const pA = nA > 0 ? variantA.metrics.conversions / nA : 0;
    const pB = nB > 0 ? variantB.metrics.conversions / nB : 0;

    if (nA === 0 || nB === 0) {
        return { significant: false, confidence: 0, zScore: 0, pValue: 1, message: '데이터 부족' };
    }

    const pooledP = (variantA.metrics.conversions + variantB.metrics.conversions) / (nA + nB);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / nA + 1 / nB));

    if (se === 0) return { significant: false, confidence: 0, zScore: 0, pValue: 1, message: '표준오차 0' };

    const zScore = (pA - pB) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    return {
        significant: pValue < 0.05,
        confidence: Math.round((1 - pValue) * 10000) / 100,
        zScore: Math.round(zScore * 1000) / 1000,
        pValue: Math.round(pValue * 10000) / 10000,
        conversionRateA: Math.round(pA * 10000) / 100,
        conversionRateB: Math.round(pB * 10000) / 100,
        lift: pB > 0 ? Math.round(((pA - pB) / pB) * 10000) / 100 : 0,
        winner: pA > pB ? variantA.id : pA < pB ? variantB.id : 'tie',
    };
}

// 정규분포 CDF 근사값
function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
}

// ── 테스트 결과 분석 ──
export function analyzeTestResults(test) {
    if (test.variants.length < 2) return { error: '변형이 부족합니다' };

    const results = [];
    for (let i = 0; i < test.variants.length; i++) {
        for (let j = i + 1; j < test.variants.length; j++) {
            const significance = calculateSignificance(test.variants[i], test.variants[j]);
            results.push({
                comparison: `${test.variants[i].id} vs ${test.variants[j].id}`,
                ...significance,
            });
        }
    }

    // 전체 최고 전환율 변형
    const ranked = [...test.variants]
        .map(v => ({
            ...v,
            conversionRate: v.metrics.visitors > 0 ? (v.metrics.conversions / v.metrics.visitors) * 100 : 0,
        }))
        .sort((a, b) => b.conversionRate - a.conversionRate);

    const totalSample = test.variants.reduce((s, v) => s + v.metrics.visitors, 0);
    const hasSufficientData = totalSample >= test.minSampleSize;

    return {
        testId: test.id,
        name: test.name,
        element: test.elementLabel,
        rankedVariants: ranked,
        comparisons: results,
        suggestedWinner: hasSufficientData && results.some(r => r.significant) ? ranked[0].id : null,
        hasSufficientData,
        totalSample,
        recommendation: !hasSufficientData
            ? '더 많은 데이터가 필요합니다'
            : results.some(r => r.significant)
                ? `${ranked[0].label}(이)가 통계적으로 유의미한 승자입니다`
                : '유의미한 차이가 없습니다. 테스트를 계속하거나 더 큰 차이의 변형을 시도하세요',
    };
}

// ── 테스트 종료 및 승자 적용 ──
export function concludeTest(test, winnerVariantId = null) {
    const results = analyzeTestResults(test);

    return {
        ...test,
        status: 'completed',
        winner: winnerVariantId || results.suggestedWinner,
        results,
        completedAt: new Date().toISOString(),
    };
}

export default {
    TEST_STATES,
    TESTABLE_ELEMENTS,
    createABTest,
    assignVariant,
    recordConversion,
    calculateSignificance,
    analyzeTestResults,
    concludeTest,
};
