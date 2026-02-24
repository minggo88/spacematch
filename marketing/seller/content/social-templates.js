/**
 * Space Match 셀러 마케팅 — SNS 콘텐츠 템플릿
 * 
 * 인스타그램, 페이스북 등 SNS 마케팅용 콘텐츠 템플릿을 생성합니다.
 * 해시태그 추천, 콘텐츠 캘린더, 포스트 스케줄링을 지원합니다.
 */

// ── 플랫폼별 최적 설정 ──
export const PLATFORMS = {
    instagram: {
        id: 'instagram', label: 'Instagram', icon: '📸',
        maxHashtags: 30, optimalHashtags: 11,
        bestPostTimes: ['09:00', '12:00', '17:00', '21:00'],
        imageRatio: '1:1', storyRatio: '9:16',
    },
    facebook: {
        id: 'facebook', label: 'Facebook', icon: '👍',
        maxHashtags: 10, optimalHashtags: 3,
        bestPostTimes: ['09:00', '13:00', '16:00'],
        imageRatio: '16:9',
    },
    tiktok: {
        id: 'tiktok', label: 'TikTok', icon: '🎵',
        maxHashtags: 5, optimalHashtags: 4,
        bestPostTimes: ['07:00', '12:00', '19:00'],
        videoLength: '15-60s',
    },
    twitter: {
        id: 'twitter', label: 'X (Twitter)', icon: '🐦',
        maxHashtags: 3, optimalHashtags: 2,
        maxLength: 280,
        bestPostTimes: ['08:00', '12:00', '17:00'],
    },
};

// ── 포스트 템플릿 ──
export const POST_TEMPLATES = {
    newProduct: {
        id: 'new_product',
        label: '신상품 소개',
        icon: '✨',
        template: {
            ko: '✨ 새로운 상품이 도착했습니다!\n\n{productName}\n{description}\n\n📍 {venue}\n🗓 {date}\n💰 {price}\n\n{hashtags}',
            en: '✨ New arrival!\n\n{productName}\n{description}\n\n📍 {venue}\n🗓 {date}\n💰 {price}\n\n{hashtags}',
            ja: '✨ 新商品入荷!\n\n{productName}\n{description}\n\n📍 {venue}\n🗓 {date}\n💰 {price}\n\n{hashtags}',
        },
    },
    eventPromo: {
        id: 'event_promo',
        label: '이벤트 홍보',
        icon: '🎉',
        template: {
            ko: '🎉 특별 이벤트!\n\n{eventName}\n\n📅 {date}\n📍 {venue}\n🎁 {offer}\n\n놓지지 마세요! 선착순 {limit}명!\n\n{hashtags}',
            en: '🎉 Special Event!\n\n{eventName}\n\n📅 {date}\n📍 {venue}\n🎁 {offer}\n\nDon\'t miss it! First {limit} only!\n\n{hashtags}',
            ja: '🎉 特別イベント!\n\n{eventName}\n\n📅 {date}\n📍 {venue}\n🎁 {offer}\n\nお見逃しなく! 先着{limit}名!\n\n{hashtags}',
        },
    },
    behindScenes: {
        id: 'behind_scenes',
        label: '비하인드 스토리',
        icon: '🎬',
        template: {
            ko: '🎬 오늘의 비하인드\n\n{story}\n\n{hashtags}',
            en: '🎬 Behind the scenes\n\n{story}\n\n{hashtags}',
            ja: '🎬 舞台裏\n\n{story}\n\n{hashtags}',
        },
    },
    testimonial: {
        id: 'testimonial',
        label: '고객 후기',
        icon: '💬',
        template: {
            ko: '💬 고객님의 소중한 후기\n\n"{review}"\n- {customerName}님\n\n⭐ {rating}/5\n\n{hashtags}',
            en: '💬 Customer Review\n\n"{review}"\n- {customerName}\n\n⭐ {rating}/5\n\n{hashtags}',
            ja: '💬 お客様の声\n\n「{review}」\n- {customerName}様\n\n⭐ {rating}/5\n\n{hashtags}',
        },
    },
    flashSale: {
        id: 'flash_sale',
        label: '타임세일',
        icon: '⏰',
        template: {
            ko: '⏰ 오늘만! 한정 세일!\n\n🔥 {discountPercent}% OFF\n⏳ {endTime}까지\n📦 남은 수량: {remaining}\n\n{hashtags}',
            en: '⏰ TODAY ONLY! Flash Sale!\n\n🔥 {discountPercent}% OFF\n⏳ Until {endTime}\n📦 Only {remaining} left!\n\n{hashtags}',
            ja: '⏰ 本日限り! タイムセール!\n\n🔥 {discountPercent}% OFF\n⏳ {endTime}まで\n📦 残り{remaining}点!\n\n{hashtags}',
        },
    },
};

// ── 카테고리별 해시태그 ──
const HASHTAG_POOL = {
    general: ['플리마켓', '팝업스토어', 'SpaceMatch', '벤더매칭', '핸드메이드', '소상공인', '마켓', '주말마켓'],
    fashion: ['패션', '의류', '스타일', 'OOTD', '데일리룩', '패션마켓'],
    food: ['푸드', '맛집', '수제간식', '디저트', '수제음료', '푸드마켓'],
    beauty: ['뷰티', '화장품', '스킨케어', '핸드메이드비누', '자연주의'],
    art: ['아트', '작품', '일러스트', '핸드드로잉', '아트마켓'],
    handmade: ['핸드메이드', '수공예', '원오브어카인드', 'DIY', '크래프트'],
    vintage: ['빈티지', '레트로', '중고', '빈티지마켓', '세컨핸드'],
};

// ── 해시태그 생성 ──
export function generateHashtags(category = 'general', customTags = [], platform = 'instagram', lang = 'ko') {
    const config = PLATFORMS[platform] || PLATFORMS.instagram;
    const maxTags = config.optimalHashtags;

    const baseTags = HASHTAG_POOL.general.slice(0, 3);
    const categoryTags = HASHTAG_POOL[category] || [];
    const allTags = [...new Set([...baseTags, ...categoryTags, ...customTags])];

    const selected = allTags.slice(0, maxTags);
    return selected.map(tag => `#${tag}`).join(' ');
}

// ── 템플릿에 데이터 채우기 ──
export function fillTemplate(templateId, data = {}, lang = 'ko') {
    const tmpl = POST_TEMPLATES[templateId];
    if (!tmpl) throw new Error(`템플릿 '${templateId}'을 찾을 수 없습니다`);

    let text = tmpl.template[lang] || tmpl.template.ko;

    Object.entries(data).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    // 채워지지 않은 변수 제거
    text = text.replace(/\{[^}]+\}/g, '');

    return { text: text.trim(), template: tmpl, platform: data.platform || 'instagram' };
}

// ── 콘텐츠 캘린더 생성 (주간) ──
export function generateWeeklyCalendar(startDate = new Date(), options = {}) {
    const {
        postsPerDay = 1,
        platforms = ['instagram'],
        categories = ['general'],
    } = options;

    const templateRotation = Object.keys(POST_TEMPLATES);
    const calendar = [];

    for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });

        for (let post = 0; post < postsPerDay; post++) {
            const platform = platforms[post % platforms.length];
            const templateId = templateRotation[(day * postsPerDay + post) % templateRotation.length];
            const category = categories[(day + post) % categories.length];
            const config = PLATFORMS[platform];

            calendar.push({
                date: date.toISOString().split('T')[0],
                dayName,
                platform,
                time: config.bestPostTimes[post % config.bestPostTimes.length],
                templateId,
                templateLabel: POST_TEMPLATES[templateId].label,
                category,
                status: 'planned',
            });
        }
    }

    return calendar;
}

export default {
    PLATFORMS,
    POST_TEMPLATES,
    generateHashtags,
    fillTemplate,
    generateWeeklyCalendar,
};
