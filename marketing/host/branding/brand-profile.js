/**
 * Space Match 벤더 마케팅 — 브랜드 프로필 강화
 * 
 * 벤더(공간 제공자)의 브랜드 프로필을 체계적으로 구축하고 관리합니다.
 * 프로필 완성도 점수, 최적화 가이드, SEO 메타데이터 생성을 지원합니다.
 */

// ── 프로필 섹션 정의 ──
export const PROFILE_SECTIONS = {
    BASIC: { id: 'basic', label: '기본 정보', weight: 20, fields: ['name', 'location', 'category', 'description'] },
    VISUALS: { id: 'visuals', label: '비주얼', weight: 25, fields: ['logo', 'coverImage', 'gallery', 'virtualTour'] },
    DETAILS: { id: 'details', label: '상세 정보', weight: 20, fields: ['capacity', 'amenities', 'policies', 'hours'] },
    SOCIAL: { id: 'social', label: 'SNS & 연락처', weight: 15, fields: ['instagram', 'website', 'phone', 'email'] },
    TRUST: { id: 'trust', label: '신뢰 지표', weight: 20, fields: ['reviews', 'certifications', 'successStories', 'responseRate'] },
};

// ── 벤더 카테고리 ──
export const VENDOR_CATEGORIES = {
    POPUP_STORE: { id: 'popup_store', label: '팝업스토어', icon: '🏪' },
    MARKET: { id: 'market', label: '플리마켓/마켓', icon: '🏬' },
    GALLERY: { id: 'gallery', label: '갤러리/전시', icon: '🖼️' },
    COWORKING: { id: 'coworking', label: '코워킹 스페이스', icon: '💼' },
    EVENT_HALL: { id: 'event_hall', label: '이벤트홀', icon: '🎪' },
    CAFE: { id: 'cafe', label: '카페/레스토랑', icon: '☕' },
    OUTDOOR: { id: 'outdoor', label: '야외 공간', icon: '🌳' },
    STUDIO: { id: 'studio', label: '스튜디오', icon: '📷' },
};

// ── 프로필 완성도 계산 ──
export function calculateProfileCompleteness(profile) {
    const sectionScores = {};
    let totalScore = 0;
    let totalWeight = 0;

    Object.values(PROFILE_SECTIONS).forEach(section => {
        const filledFields = section.fields.filter(field => {
            const value = profile[field];
            if (Array.isArray(value)) return value.length > 0;
            return value !== null && value !== undefined && value !== '';
        });

        const completion = section.fields.length > 0 ? filledFields.length / section.fields.length : 0;
        const score = Math.round(completion * section.weight);

        sectionScores[section.id] = {
            ...section,
            filledFields: filledFields.length,
            totalFields: section.fields.length,
            completion: Math.round(completion * 10000) / 100,
            score,
            missingFields: section.fields.filter(f => {
                const v = profile[f];
                if (Array.isArray(v)) return v.length === 0;
                return !v;
            }),
        };

        totalScore += score;
        totalWeight += section.weight;
    });

    const overallPercent = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10000) / 100 : 0;

    return {
        overallScore: totalScore,
        overallPercent,
        sections: sectionScores,
        tier: overallPercent >= 90 ? 'platinum' : overallPercent >= 70 ? 'gold' : overallPercent >= 50 ? 'silver' : 'bronze',
        tierLabel: overallPercent >= 90 ? '🏆 Platinum' : overallPercent >= 70 ? '🥇 Gold' : overallPercent >= 50 ? '🥈 Silver' : '🥉 Bronze',
    };
}

// ── 프로필 최적화 추천 ──
export function getOptimizationTips(profile) {
    const completeness = calculateProfileCompleteness(profile);
    const tips = [];
    let priority = 1;

    Object.values(completeness.sections).forEach(section => {
        if (section.completion >= 100) return;

        section.missingFields.forEach(field => {
            const tip = getFieldTip(field);
            tips.push({
                priority: priority++,
                section: section.label,
                field,
                ...tip,
                impact: section.weight >= 20 ? 'high' : 'medium',
            });
        });
    });

    return tips.sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return (impactOrder[a.impact] || 2) - (impactOrder[b.impact] || 2);
    });
}

function getFieldTip(field) {
    const tips = {
        name: { message: '브랜드명을 입력하세요', advice: '기억하기 쉽고 독특한 이름이 효과적입니다' },
        location: { message: '위치 정보를 추가하세요', advice: '정확한 주소와 교통 안내를 포함하세요' },
        category: { message: '공간 카테고리를 선택하세요', advice: '올바른 카테고리가 셀러 매칭 정확도를 높입니다' },
        description: { message: '공간 소개글을 작성하세요', advice: '150~300자 사이가 최적입니다. 핵심 장점을 먼저 언급하세요' },
        logo: { message: '로고를 업로드하세요', advice: '정사각형 PNG, 최소 512x512px 권장' },
        coverImage: { message: '커버 이미지를 추가하세요', advice: '공간의 첫인상을 결정합니다. 1920x1080px 이상 권장' },
        gallery: { message: '갤러리 사진을 추가하세요', advice: '최소 5장 이상, 다양한 각도의 사진이 효과적입니다' },
        virtualTour: { message: '가상 투어를 추가하면 신뢰도가 크게 올라갑니다', advice: '360° 파노라마 또는 영상 투어' },
        capacity: { message: '수용 가능 인원을 입력하세요', advice: '최소/최대 인원을 명시하면 매칭 정확도가 높아집니다' },
        amenities: { message: '편의시설 정보를 추가하세요', advice: 'Wi-Fi, 주차, 화장실 등 기본 정보부터 시작하세요' },
        policies: { message: '이용 정책을 작성하세요', advice: '취소 정책, 이용 규칙을 명확히 하면 분쟁이 줄어듭니다' },
        hours: { message: '운영 시간을 설정하세요', advice: '요일별 시간을 설정하면 예약 편의성이 높아집니다' },
        instagram: { message: 'Instagram 계정을 연결하세요', advice: 'SNS 연결 시 신뢰도가 40% 향상됩니다' },
        website: { message: '웹사이트를 등록하세요', advice: '공식 웹사이트 또는 네이버 플레이스 주소' },
        phone: { message: '연락처를 추가하세요', advice: '빠른 소통이 가능하면 셀러 만족도가 높아집니다' },
        email: { message: '이메일을 등록하세요', advice: '비즈니스 이메일을 사용하면 전문성이 높아집니다' },
        reviews: { message: '리뷰를 수집하세요', advice: '이용한 셀러에게 리뷰를 요청하세요' },
        certifications: { message: '인증/자격을 등록하세요', advice: '사업자등록증, 인테리어 인증 등' },
        successStories: { message: '성공 사례를 공유하세요', advice: '셀러의 성공 경험을 소개하면 신뢰도가 크게 올라갑니다' },
        responseRate: { message: '응답률을 높이세요', advice: '24시간 이내 응답률 90% 이상이 이상적입니다' },
    };
    return tips[field] || { message: `${field} 정보를 추가하세요`, advice: '' };
}

// ── SEO 메타데이터 생성 ──
export function generateSEOMetadata(profile, lang = 'ko') {
    const name = profile.name || 'Space Match 공간';
    const category = VENDOR_CATEGORIES[profile.category]?.label || '공간';
    const location = profile.location || '';
    const description = profile.description || '';

    const titles = {
        ko: `${name} - ${category} | Space Match`,
        en: `${name} - ${category} | Space Match`,
        ja: `${name} - ${category} | Space Match`,
    };

    const metaDescriptions = {
        ko: `${location} ${category} ${name}. ${description.substring(0, 120)}`,
        en: `${category} ${name} in ${location}. ${description.substring(0, 120)}`,
        ja: `${location}の${category} ${name}。${description.substring(0, 120)}`,
    };

    const keywords = [name, category, location, 'Space Match', '팝업', '마켓', '공간대여']
        .filter(Boolean)
        .join(', ');

    return {
        title: titles[lang] || titles.ko,
        description: (metaDescriptions[lang] || metaDescriptions.ko).trim(),
        keywords,
        ogTitle: titles[lang] || titles.ko,
        ogDescription: (metaDescriptions[lang] || metaDescriptions.ko).trim(),
        ogImage: profile.coverImage || profile.logo || '',
        structured: {
            '@type': 'LocalBusiness',
            name,
            description: description.substring(0, 250),
            address: location,
            image: profile.coverImage || profile.logo || '',
        },
    };
}

// ── 프로필 비교 (경쟁사 대비) ──
export function compareProfiles(myProfile, competitorProfiles = []) {
    const myScore = calculateProfileCompleteness(myProfile);
    const comparisons = competitorProfiles.map(cp => ({
        name: cp.name || 'Competitor',
        score: calculateProfileCompleteness(cp),
    }));

    const avgCompetitorScore = comparisons.length > 0
        ? Math.round(comparisons.reduce((s, c) => s + c.score.overallPercent, 0) / comparisons.length)
        : 0;

    return {
        myScore: myScore.overallPercent,
        myTier: myScore.tierLabel,
        avgCompetitorScore,
        ranking: comparisons.filter(c => myScore.overallPercent > c.score.overallPercent).length + 1,
        totalCompetitors: comparisons.length,
        advantage: myScore.overallPercent > avgCompetitorScore ? 'above_average' : 'below_average',
        gapPercent: myScore.overallPercent - avgCompetitorScore,
    };
}

export default {
    PROFILE_SECTIONS,
    VENDOR_CATEGORIES,
    calculateProfileCompleteness,
    getOptimizationTips,
    generateSEOMetadata,
    compareProfiles,
};
