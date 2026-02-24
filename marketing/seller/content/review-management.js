/**
 * Space Match 셀러 마케팅 — 리뷰 관리
 * 
 * 고객 리뷰 수집, 응답 관리, 감성 분석을 제공합니다.
 * 키워드 추출, 평점 분포, 개선 포인트 도출을 지원합니다.
 */

// ── 감성 분류 ──
export const SENTIMENTS = {
    VERY_POSITIVE: { id: 'very_positive', label: '매우 긍정', emoji: '😍', color: '#10B981', scoreRange: [4.5, 5] },
    POSITIVE: { id: 'positive', label: '긍정', emoji: '😊', color: '#34D399', scoreRange: [3.5, 4.49] },
    NEUTRAL: { id: 'neutral', label: '보통', emoji: '😐', color: '#F59E0B', scoreRange: [2.5, 3.49] },
    NEGATIVE: { id: 'negative', label: '부정', emoji: '😞', color: '#EF4444', scoreRange: [1.5, 2.49] },
    VERY_NEGATIVE: { id: 'very_negative', label: '매우 부정', emoji: '😡', color: '#DC2626', scoreRange: [1, 1.49] },
};

// ── 감성 키워드 사전 (한국어) ──
const SENTIMENT_KEYWORDS = {
    positive: ['좋아요', '추천', '만족', '최고', '예쁘', '깔끔', '친절', '빠른', '감사', '훌륭', '좋은', '맛있', '예쁜', '편리', '깨끗'],
    negative: ['별로', '실망', '불만', '느린', '비싸', '불친절', '나쁜', '더러', '찢어', '망가', '최악', '후회', '늦은', '부족', '불량'],
};

// ── 리뷰 생성 ──
export function createReview({
    userId,
    userName = '',
    rating,
    text = '',
    category = '',
    country = 'KR',
    photos = [],
    purchaseDate = null,
}) {
    if (!rating || rating < 1 || rating > 5) throw new Error('평점은 1~5 사이여야 합니다');

    const sentiment = classifySentiment(rating, text);
    const keywords = extractKeywords(text);

    return {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId,
        userName,
        rating,
        text,
        category,
        country,
        photos,
        purchaseDate,
        sentiment,
        keywords,
        response: null,
        helpful: 0,
        reported: false,
        verified: !!purchaseDate,
        createdAt: new Date().toISOString(),
    };
}

// ── 감성 분류 (평점 + 텍스트 분석) ──
export function classifySentiment(rating, text = '') {
    let textScore = 0;
    const lowerText = text.toLowerCase();

    SENTIMENT_KEYWORDS.positive.forEach(kw => {
        if (lowerText.includes(kw)) textScore += 0.2;
    });
    SENTIMENT_KEYWORDS.negative.forEach(kw => {
        if (lowerText.includes(kw)) textScore -= 0.3;
    });

    const adjustedScore = Math.max(1, Math.min(5, rating + textScore));

    for (const sentiment of Object.values(SENTIMENTS)) {
        if (adjustedScore >= sentiment.scoreRange[0] && adjustedScore <= sentiment.scoreRange[1]) {
            return { ...sentiment, adjustedScore: Math.round(adjustedScore * 10) / 10 };
        }
    }
    return { ...SENTIMENTS.NEUTRAL, adjustedScore: Math.round(adjustedScore * 10) / 10 };
}

// ── 키워드 추출 ──
export function extractKeywords(text, topN = 5) {
    if (!text) return [];
    const stopWords = new Set(['이', '그', '저', '을', '를', '에', '의', '가', '은', '는', '도', '와', '과', '로', '에서', '으로', '하고', '합니다', '있습니다', '입니다', '습니다', '이요', '해요', '돼요']);
    const words = text.replace(/[^\w가-힣\s]/g, '').split(/\s+/).filter(w => w.length >= 2 && !stopWords.has(w));

    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([word, count]) => ({ word, count }));
}

// ── 리뷰 응답 생성 ──
export function generateResponseSuggestion(review, lang = 'ko') {
    const responses = {
        very_positive: {
            ko: `${review.userName || '고객'}님, 멋진 리뷰 감사합니다! 😊 앞으로도 좋은 상품과 서비스로 보답하겠습니다.`,
            en: `Thank you for the wonderful review, ${review.userName || 'dear customer'}! 😊 We'll continue to provide great products and service.`,
        },
        positive: {
            ko: `${review.userName || '고객'}님, 좋은 평가 감사합니다! 더 나은 경험을 위해 노력하겠습니다. 🙏`,
            en: `Thank you for your positive feedback, ${review.userName || 'dear customer'}! We'll keep working to improve. 🙏`,
        },
        neutral: {
            ko: `${review.userName || '고객'}님, 소중한 의견 감사합니다. 개선할 부분이 있다면 말씀해주세요!`,
            en: `Thank you for your feedback, ${review.userName || 'dear customer'}. Please let us know how we can improve!`,
        },
        negative: {
            ko: `${review.userName || '고객'}님, 불편을 드려 죄송합니다. 😔 말씀하신 부분을 즉시 개선하겠습니다. 직접 연락 드려도 될까요?`,
            en: `We're sorry for the inconvenience, ${review.userName || 'dear customer'}. 😔 We'll address your concerns right away. May we contact you directly?`,
        },
        very_negative: {
            ko: `${review.userName || '고객'}님, 깊이 사과드립니다. 🙇 불쾌한 경험을 드려 정말 죄송합니다. 담당자가 직접 연락드리겠습니다.`,
            en: `We sincerely apologize, ${review.userName || 'dear customer'}. 🙇 A manager will contact you directly to resolve this.`,
        },
    };

    const sentimentId = review.sentiment?.id || 'neutral';
    return responses[sentimentId]?.[lang] || responses[sentimentId]?.ko || responses.neutral.ko;
}

// ── 평점 분포 분석 ──
export function analyzeRatingDistribution(reviews) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
        const rating = Math.round(r.rating);
        if (distribution[rating] !== undefined) distribution[rating]++;
    });

    const total = reviews.length || 1;
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / total;

    return {
        distribution: Object.entries(distribution).map(([star, count]) => ({
            star: Number(star),
            count,
            percentage: Math.round((count / total) * 10000) / 100,
        })),
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        positivePercent: Math.round(((distribution[4] + distribution[5]) / total) * 10000) / 100,
        negativePercent: Math.round(((distribution[1] + distribution[2]) / total) * 10000) / 100,
    };
}

// ── 개선 포인트 도출 ──
export function identifyImprovementAreas(reviews) {
    const negativeReviews = reviews.filter(r => r.rating <= 2);
    if (negativeReviews.length === 0) return { areas: [], message: '부정적 리뷰가 없습니다! 🎉' };

    const allKeywords = {};
    negativeReviews.forEach(r => {
        const keywords = r.keywords || extractKeywords(r.text);
        keywords.forEach(kw => {
            allKeywords[kw.word] = (allKeywords[kw.word] || 0) + kw.count;
        });
    });

    return {
        areas: Object.entries(allKeywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([keyword, frequency]) => ({
                keyword,
                frequency,
                severity: frequency >= 5 ? 'high' : frequency >= 3 ? 'medium' : 'low',
            })),
        negativeCount: negativeReviews.length,
        negativePercent: Math.round((negativeReviews.length / reviews.length) * 10000) / 100,
    };
}

// ── 리뷰 요약 리포트 ──
export function generateReviewReport(reviews) {
    const ratingDist = analyzeRatingDistribution(reviews);
    const improvements = identifyImprovementAreas(reviews);

    const sentimentDist = {};
    Object.values(SENTIMENTS).forEach(s => { sentimentDist[s.id] = 0; });
    reviews.forEach(r => {
        const sid = r.sentiment?.id || classifySentiment(r.rating, r.text).id;
        sentimentDist[sid]++;
    });

    // 국가별 평점
    const countryRatings = {};
    reviews.forEach(r => {
        const cc = r.country || 'KR';
        if (!countryRatings[cc]) countryRatings[cc] = { total: 0, count: 0 };
        countryRatings[cc].total += r.rating;
        countryRatings[cc].count += 1;
    });

    return {
        ratingDistribution: ratingDist,
        sentimentDistribution: sentimentDist,
        improvementAreas: improvements,
        countryRatings: Object.entries(countryRatings).map(([code, data]) => ({
            country: code,
            avgRating: Math.round((data.total / data.count) * 10) / 10,
            reviewCount: data.count,
        })),
        responseRate: reviews.length > 0
            ? Math.round((reviews.filter(r => r.response).length / reviews.length) * 10000) / 100
            : 0,
        generatedAt: new Date().toISOString(),
    };
}

export default {
    SENTIMENTS,
    createReview,
    classifySentiment,
    extractKeywords,
    generateResponseSuggestion,
    analyzeRatingDistribution,
    identifyImprovementAreas,
    generateReviewReport,
};
