/**
 * Space Match 벤더 마케팅 — 브랜드 스토리텔링
 * 
 * 벤더의 공간/브랜드 스토리를 구조화하고
 * 다양한 채널에 맞는 콘텐츠를 생성합니다.
 */

// ── 스토리 프레임워크 ──
export const STORY_FRAMEWORKS = {
    ORIGIN: {
        id: 'origin', label: '탄생 이야기', icon: '🌱',
        structure: ['동기', '도전', '전환점', '현재'],
        prompt: '이 공간은 어떤 계기로 시작되었나요?',
    },
    MISSION: {
        id: 'mission', label: '미션 & 비전', icon: '🎯',
        structure: ['문제 인식', '해결 방법', '핵심 가치', '미래 비전'],
        prompt: '이 공간이 해결하고자 하는 문제는 무엇인가요?',
    },
    PEOPLE: {
        id: 'people', label: '사람들의 이야기', icon: '👥',
        structure: ['운영진 소개', '셀러 성공사례', '고객 경험', '커뮤니티'],
        prompt: '이 공간에서 특별한 경험을 한 사람의 이야기를 들려주세요.',
    },
    SPACE: {
        id: 'space', label: '공간의 특별함', icon: '🏛️',
        structure: ['역사/배경', '설계 철학', '특별한 요소', '분위기'],
        prompt: '이 공간이 다른 곳과 다른 특별한 점은 무엇인가요?',
    },
    IMPACT: {
        id: 'impact', label: '임팩트 & 성과', icon: '📊',
        structure: ['시작점', '성장 과정', '주요 성과', '다음 목표'],
        prompt: '지금까지 이 공간이 만들어낸 가장 의미 있는 변화는?',
    },
};

// ── 스토리 생성 ──
export function createStory({
    framework = 'origin',
    title,
    sections = [],
    media = [],
    tags = [],
    lang = 'ko',
}) {
    const fw = STORY_FRAMEWORKS[framework.toUpperCase()] || STORY_FRAMEWORKS.ORIGIN;

    const storyContent = fw.structure.map((sectionName, i) => ({
        name: sectionName,
        content: sections[i] || '',
        media: media.filter(m => m.sectionIndex === i),
        filled: !!(sections[i] && sections[i].trim()),
    }));

    const completeness = storyContent.filter(s => s.filled).length / storyContent.length;

    return {
        id: `story_${Date.now()}`,
        framework: fw.id,
        frameworkLabel: fw.label,
        title: title || fw.label,
        sections: storyContent,
        tags,
        lang,
        completeness: Math.round(completeness * 100),
        status: completeness >= 1 ? 'complete' : completeness > 0 ? 'draft' : 'empty',
        wordCount: sections.join(' ').split(/\s+/).filter(Boolean).length,
        createdAt: new Date().toISOString(),
    };
}

// ── 채널별 스토리 변환 ──
export function adaptStoryForChannel(story, channel = 'website') {
    const fullText = story.sections.filter(s => s.filled).map(s => s.content).join('\n\n');

    const adapters = {
        website: () => ({
            format: 'long_form',
            title: story.title,
            content: fullText,
            maxLength: null,
            sections: story.sections,
        }),
        instagram: () => ({
            format: 'carousel',
            slides: story.sections.filter(s => s.filled).map(s => ({
                text: truncateText(s.content, 200),
                heading: s.name,
            })),
            caption: truncateText(fullText, 2200),
            maxSlides: 10,
        }),
        email: () => ({
            format: 'newsletter',
            subject: `📖 ${story.title}`,
            preheader: truncateText(fullText, 100),
            body: fullText,
            cta: '자세히 보기',
        }),
        short: () => ({
            format: 'elevator_pitch',
            text: truncateText(fullText, 150),
            maxLength: 150,
        }),
        press: () => ({
            format: 'press_release',
            headline: story.title,
            lead: truncateText(story.sections[0]?.content || fullText, 300),
            body: fullText,
            boilerplate: `Space Match는 셀러와 벤더를 연결하는 통합 매칭 플랫폼입니다.`,
        }),
    };

    const adapter = adapters[channel] || adapters.website;
    return { channel, ...adapter() };
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength - 3) + '...';
}

// ── 성공 사례 템플릿 ──
export function createSuccessStory({
    sellerName,
    sellerCategory = '',
    venue = '',
    period = '',
    challenge = '',
    solution = '',
    result = '',
    metrics = {},
    quote = '',
}) {
    return {
        id: `success_${Date.now()}`,
        sellerName,
        sellerCategory,
        venue,
        period,
        sections: {
            challenge: { label: '도전', content: challenge },
            solution: { label: '해결', content: solution },
            result: { label: '결과', content: result },
        },
        metrics: {
            revenueBefore: metrics.revenueBefore || 0,
            revenueAfter: metrics.revenueAfter || 0,
            growthPercent: metrics.revenueBefore > 0
                ? Math.round(((metrics.revenueAfter - metrics.revenueBefore) / metrics.revenueBefore) * 100)
                : 0,
            customerIncrease: metrics.customerIncrease || 0,
            satisfactionScore: metrics.satisfactionScore || 0,
        },
        quote,
        published: false,
        createdAt: new Date().toISOString(),
    };
}

// ── 콘텐츠 캘린더 (브랜딩 중심) ──
export function generateBrandingCalendar(weeks = 4) {
    const contentTypes = [
        { type: 'origin_story', label: '탄생 이야기', frequency: 'monthly' },
        { type: 'success_story', label: '셀러 성공사례', frequency: 'biweekly' },
        { type: 'behind_scenes', label: '비하인드 스토리', frequency: 'weekly' },
        { type: 'space_highlight', label: '공간 하이라이트', frequency: 'weekly' },
        { type: 'community', label: '커뮤니티 소식', frequency: 'biweekly' },
        { type: 'upcoming', label: '다가오는 이벤트', frequency: 'weekly' },
    ];

    const calendar = [];
    const startDate = new Date();

    for (let week = 0; week < weeks; week++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + week * 7);

        const weekPlan = contentTypes
            .filter(ct => {
                if (ct.frequency === 'weekly') return true;
                if (ct.frequency === 'biweekly') return week % 2 === 0;
                if (ct.frequency === 'monthly') return week === 0;
                return false;
            })
            .map((ct, i) => {
                const postDate = new Date(weekStart);
                postDate.setDate(weekStart.getDate() + Math.min(i, 6));
                return {
                    date: postDate.toISOString().split('T')[0],
                    week: week + 1,
                    ...ct,
                    status: 'planned',
                };
            });

        calendar.push(...weekPlan);
    }

    return calendar;
}

export default {
    STORY_FRAMEWORKS,
    createStory,
    adaptStoryForChannel,
    createSuccessStory,
    generateBrandingCalendar,
};
