/**
 * Space Match 셀러 마케팅 — 이메일 캠페인
 * 
 * 이메일 마케팅 캠페인 생성, 스케줄링, 성과 추적을 관리합니다.
 * HTML 이메일 템플릿, A/B 테스트, 발송 스케줄을 지원합니다.
 */

// ── 캠페인 유형 ──
export const EMAIL_CAMPAIGN_TYPES = {
    WELCOME: { id: 'welcome', label: '환영 메일', icon: '👋', trigger: 'signup' },
    PROMOTION: { id: 'promotion', label: '프로모션', icon: '🎁', trigger: 'manual' },
    NEWSLETTER: { id: 'newsletter', label: '뉴스레터', icon: '📰', trigger: 'scheduled' },
    ABANDONED: { id: 'abandoned', label: '이탈 리마인더', icon: '🛒', trigger: 'auto' },
    MILESTONE: { id: 'milestone', label: '마일스톤', icon: '🏆', trigger: 'auto' },
    RE_ENGAGE: { id: 're_engage', label: '재참여 유도', icon: '🔄', trigger: 'auto' },
};

// ── 이메일 템플릿 ──
export const EMAIL_TEMPLATES = {
    welcome: {
        subject: { ko: '🎉 Space Match에 오신 것을 환영합니다!', en: '🎉 Welcome to Space Match!', ja: '🎉 Space Matchへようこそ!' },
        preheader: { ko: '당신의 첫 번째 판매를 시작해보세요', en: 'Start your first sale today', ja: '最初の販売を始めましょう' },
    },
    promotion: {
        subject: { ko: '🔥 한정 혜택! {discountPercent}% 할인', en: '🔥 Limited offer! {discountPercent}% OFF', ja: '🔥 期間限定! {discountPercent}%オフ' },
        preheader: { ko: '놓치면 후회할 특별 기회', en: "Don't miss this special opportunity", ja: '見逃せない特別なチャンス' },
    },
    milestone: {
        subject: { ko: '🏆 축하합니다! {milestone} 달성!', en: '🏆 Congratulations! {milestone} achieved!', ja: '🏆 おめでとうございます! {milestone}達成!' },
        preheader: { ko: '당신의 성장을 축하합니다', en: 'Celebrating your growth', ja: 'あなたの成長を祝います' },
    },
    re_engage: {
        subject: { ko: '💝 보고 싶어요! 다시 만나요', en: '💝 We miss you! Come back', ja: '💝 お待ちしています! また会いましょう' },
        preheader: { ko: '당신을 위한 특별한 혜택이 준비되어 있습니다', en: 'We have a special offer waiting for you', ja: '特別なオファーをご用意しています' },
    },
};

// ── 캠페인 생성 ──
export function createEmailCampaign({
    name,
    type = 'promotion',
    templateId = null,
    subject = '',
    body = '',
    recipients = [],
    scheduledAt = null,
    abTest = null,
    lang = 'ko',
}) {
    if (!name) throw new Error('캠페인 이름은 필수입니다');

    const template = EMAIL_TEMPLATES[templateId || type];
    const resolvedSubject = subject || (template ? template.subject[lang] || template.subject.ko : '');

    return {
        id: `email_${Date.now()}`,
        name,
        type,
        subject: resolvedSubject,
        preheader: template ? template.preheader[lang] || template.preheader.ko : '',
        body,
        recipients,
        recipientCount: recipients.length,
        scheduledAt,
        status: scheduledAt ? 'scheduled' : 'draft',
        abTest: abTest ? {
            variantA: { subject: abTest.subjectA || resolvedSubject, percentage: 50 },
            variantB: { subject: abTest.subjectB, percentage: 50 },
            winner: null,
            testDuration: abTest.testDuration || 4, // 시간
        } : null,
        metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0, bounced: 0 },
        createdAt: new Date().toISOString(),
    };
}

// ── 제목줄 A/B 테스트 결과 판정 ──
export function evaluateABTest(campaign) {
    if (!campaign.abTest) return null;
    const { variantA, variantB } = campaign.abTest;

    const aOpenRate = variantA.sent > 0 ? variantA.opened / variantA.sent : 0;
    const bOpenRate = variantB.sent > 0 ? variantB.opened / variantB.sent : 0;

    return {
        winner: aOpenRate >= bOpenRate ? 'A' : 'B',
        variantA: { ...variantA, openRate: Math.round(aOpenRate * 10000) / 100 },
        variantB: { ...variantB, openRate: Math.round(bOpenRate * 10000) / 100 },
        difference: Math.abs(Math.round((aOpenRate - bOpenRate) * 10000) / 100),
        significant: Math.abs(aOpenRate - bOpenRate) > 0.05, // 5% 이상 차이
    };
}

// ── 캠페인 성과 분석 ──
export function analyzeEmailPerformance(campaign) {
    const { sent, delivered, opened, clicked, unsubscribed, bounced } = campaign.metrics;

    return {
        campaignId: campaign.id,
        name: campaign.name,
        type: campaign.type,
        deliveryRate: sent > 0 ? Math.round((delivered / sent) * 10000) / 100 : 0,
        openRate: delivered > 0 ? Math.round((opened / delivered) * 10000) / 100 : 0,
        clickRate: opened > 0 ? Math.round((clicked / opened) * 10000) / 100 : 0,
        clickToOpenRate: opened > 0 ? Math.round((clicked / opened) * 10000) / 100 : 0,
        unsubscribeRate: sent > 0 ? Math.round((unsubscribed / sent) * 10000) / 100 : 0,
        bounceRate: sent > 0 ? Math.round((bounced / sent) * 10000) / 100 : 0,
        ...campaign.metrics,
        // 업계 벤치마크 비교
        benchmark: {
            openRate: 21.33,  // 이커머스 평균
            clickRate: 2.62,
            unsubscribeRate: 0.26,
        },
    };
}

// ── 최적 발송 시간 추천 ──
export function suggestSendTime(historicalMetrics = [], timezone = 'Asia/Seoul') {
    // 기본 시간대별 권장 (이커머스 기준)
    const defaultSlots = [
        { time: '10:00', label: '오전 출근 후', score: 85 },
        { time: '13:00', label: '점심시간', score: 80 },
        { time: '20:00', label: '저녁 이후', score: 90 },
        { time: '08:00', label: '출근길', score: 70 },
    ];

    if (historicalMetrics.length === 0) {
        return { recommended: defaultSlots[2], options: defaultSlots, source: 'default' };
    }

    // 과거 데이터 기반 최적 시간
    const timeSlots = {};
    historicalMetrics.forEach(m => {
        const hour = m.sentHour || 10;
        const key = `${String(hour).padStart(2, '0')}:00`;
        if (!timeSlots[key]) timeSlots[key] = { time: key, totalOpened: 0, totalSent: 0 };
        timeSlots[key].totalOpened += m.opened || 0;
        timeSlots[key].totalSent += m.sent || 0;
    });

    const ranked = Object.values(timeSlots)
        .map(s => ({ ...s, openRate: s.totalSent > 0 ? (s.totalOpened / s.totalSent) * 100 : 0 }))
        .sort((a, b) => b.openRate - a.openRate);

    return {
        recommended: ranked[0] || defaultSlots[2],
        options: ranked.length > 0 ? ranked : defaultSlots,
        source: ranked.length > 0 ? 'historical' : 'default',
    };
}

// ── 마일스톤 자동 감지 ──
export function detectMilestones(records) {
    const milestones = [];
    const totalRevenue = records.reduce((s, r) => s + (Number(r.monthly_revenue) || 0), 0);
    const totalTransactions = records.reduce((s, r) => s + (Number(r.transaction_count) || 0), 0);

    const revenueMilestones = [1000000, 5000000, 10000000, 50000000, 100000000];
    revenueMilestones.forEach(m => {
        if (totalRevenue >= m) {
            milestones.push({ type: 'revenue', value: m, label: `총 매출 ${(m / 10000).toLocaleString()}만원 돌파`, achieved: true });
        }
    });

    const transactionMilestones = [100, 500, 1000, 5000, 10000];
    transactionMilestones.forEach(m => {
        if (totalTransactions >= m) {
            milestones.push({ type: 'transactions', value: m, label: `총 거래 ${m.toLocaleString()}건 돌파`, achieved: true });
        }
    });

    if (records.length >= 30) milestones.push({ type: 'records', value: records.length, label: `${records.length}일 연속 기록`, achieved: true });

    return milestones;
}

export default {
    EMAIL_CAMPAIGN_TYPES,
    EMAIL_TEMPLATES,
    createEmailCampaign,
    evaluateABTest,
    analyzeEmailPerformance,
    suggestSendTime,
    detectMilestones,
};
