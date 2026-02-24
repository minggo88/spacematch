/**
 * Space Match 벤더 마케팅 — 비주얼 아이덴티티
 * 
 * 벤더의 일관된 비주얼 브랜딩을 관리합니다.
 * 컬러 팔레트, 타이포그래피, 이미지 가이드를 제공합니다.
 */

// ── 브랜드 무드 프리셋 ──
export const BRAND_MOODS = {
    MODERN: {
        id: 'modern', label: '모던 & 미니멀', icon: '🔲',
        colors: { primary: '#1A1A2E', secondary: '#16213E', accent: '#0F3460', text: '#E94560' },
        fonts: { heading: 'Pretendard', body: 'Inter' },
        style: { borderRadius: '4px', shadows: 'minimal', spacing: 'spacious' },
    },
    WARM: {
        id: 'warm', label: '따뜻한 & 자연적', icon: '🌿',
        colors: { primary: '#2C3639', secondary: '#3F4E4F', accent: '#A27B5C', text: '#DCD7C9' },
        fonts: { heading: 'Noto Serif KR', body: 'Noto Sans KR' },
        style: { borderRadius: '12px', shadows: 'soft', spacing: 'comfortable' },
    },
    VIBRANT: {
        id: 'vibrant', label: '활기찬 & 에너제틱', icon: '🎨',
        colors: { primary: '#6C63FF', secondary: '#FF6384', accent: '#FFCE56', text: '#2D2D2D' },
        fonts: { heading: 'Black Han Sans', body: 'Noto Sans KR' },
        style: { borderRadius: '16px', shadows: 'bold', spacing: 'compact' },
    },
    LUXURY: {
        id: 'luxury', label: '럭셔리 & 프리미엄', icon: '✨',
        colors: { primary: '#1B1B1B', secondary: '#2D2D2D', accent: '#C9A96E', text: '#F5F5F5' },
        fonts: { heading: 'Playfair Display', body: 'Montserrat' },
        style: { borderRadius: '0px', shadows: 'elegant', spacing: 'spacious' },
    },
    PLAYFUL: {
        id: 'playful', label: '플레이풀 & 캐주얼', icon: '🎪',
        colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', text: '#2C3E50' },
        fonts: { heading: 'Jua', body: 'Gothic A1' },
        style: { borderRadius: '20px', shadows: 'fun', spacing: 'comfortable' },
    },
};

// ── 비주얼 아이덴티티 생성 ──
export function createVisualIdentity({
    brandName,
    mood = 'modern',
    customColors = null,
    customFonts = null,
    logoUrl = '',
}) {
    const preset = BRAND_MOODS[mood.toUpperCase()] || BRAND_MOODS.MODERN;

    return {
        id: `vi_${Date.now()}`,
        brandName,
        mood: preset.id,
        moodLabel: preset.label,
        colors: customColors || preset.colors,
        fonts: customFonts || preset.fonts,
        style: preset.style,
        logoUrl,
        palette: generateColorPalette(customColors || preset.colors),
        createdAt: new Date().toISOString(),
    };
}

// ── 확장 컬러 팔레트 생성 ──
export function generateColorPalette(baseColors) {
    const { primary, secondary, accent, text } = baseColors;

    return {
        primary: { base: primary, light: lightenColor(primary, 30), dark: darkenColor(primary, 20) },
        secondary: { base: secondary, light: lightenColor(secondary, 30), dark: darkenColor(secondary, 20) },
        accent: { base: accent, light: lightenColor(accent, 30), dark: darkenColor(accent, 20) },
        text: { base: text, muted: lightenColor(text, 40) },
        background: { light: '#FFFFFF', dark: '#121212', card: '#F8F9FA' },
        semantic: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
    };
}

// ── 컬러 조절 헬퍼 ──
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xFF) + Math.round(255 * percent / 100));
    const g = Math.min(255, ((num >> 8) & 0xFF) + Math.round(255 * percent / 100));
    const b = Math.min(255, (num & 0xFF) + Math.round(255 * percent / 100));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xFF) - Math.round(255 * percent / 100));
    const g = Math.max(0, ((num >> 8) & 0xFF) - Math.round(255 * percent / 100));
    const b = Math.max(0, (num & 0xFF) - Math.round(255 * percent / 100));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── CSS 변수 생성 ──
export function generateCSSVariables(identity) {
    const { colors, fonts, style } = identity;
    return {
        '--brand-primary': colors.primary,
        '--brand-secondary': colors.secondary,
        '--brand-accent': colors.accent,
        '--brand-text': colors.text,
        '--font-heading': fonts.heading,
        '--font-body': fonts.body,
        '--border-radius': style.borderRadius,
    };
}

// ── 이미지 가이드라인 ──
export const IMAGE_GUIDELINES = {
    logo: { minWidth: 512, minHeight: 512, ratio: '1:1', format: 'PNG/SVG', maxSize: '2MB' },
    cover: { minWidth: 1920, minHeight: 1080, ratio: '16:9', format: 'JPG/PNG', maxSize: '5MB' },
    gallery: { minWidth: 1200, minHeight: 800, ratio: '3:2', format: 'JPG', maxSize: '3MB' },
    thumbnail: { minWidth: 400, minHeight: 400, ratio: '1:1', format: 'JPG/PNG', maxSize: '500KB' },
    socialPost: { minWidth: 1080, minHeight: 1080, ratio: '1:1', format: 'JPG/PNG', maxSize: '2MB' },
    story: { minWidth: 1080, minHeight: 1920, ratio: '9:16', format: 'JPG/PNG/MP4', maxSize: '10MB' },
};

// ── 이미지 검증 ──
export function validateImage(imageInfo, type = 'gallery') {
    const guide = IMAGE_GUIDELINES[type];
    if (!guide) return { valid: true, warnings: [] };

    const warnings = [];
    if (imageInfo.width < guide.minWidth) warnings.push(`최소 너비 ${guide.minWidth}px 미달 (현재: ${imageInfo.width}px)`);
    if (imageInfo.height < guide.minHeight) warnings.push(`최소 높이 ${guide.minHeight}px 미달 (현재: ${imageInfo.height}px)`);

    return { valid: warnings.length === 0, warnings, guidelines: guide };
}

// ── 브랜드 일관성 점수 ──
export function assessBrandConsistency(identity, usedAssets = []) {
    let score = 0;
    const checks = [];

    // 로고 존재
    if (identity.logoUrl) { score += 20; checks.push({ item: '로고', status: 'pass' }); }
    else checks.push({ item: '로고', status: 'missing', impact: 'high' });

    // 컬러 정의
    if (identity.colors.primary && identity.colors.accent) { score += 20; checks.push({ item: '브랜드 컬러', status: 'pass' }); }
    else checks.push({ item: '브랜드 컬러', status: 'incomplete', impact: 'high' });

    // 폰트 정의
    if (identity.fonts.heading && identity.fonts.body) { score += 15; checks.push({ item: '타이포그래피', status: 'pass' }); }
    else checks.push({ item: '타이포그래피', status: 'incomplete', impact: 'medium' });

    // 에셋 일관성
    const colorUsage = usedAssets.filter(a => a.usesColor).length;
    if (usedAssets.length > 0 && colorUsage / usedAssets.length >= 0.8) {
        score += 25; checks.push({ item: '컬러 일관성', status: 'pass' });
    } else if (usedAssets.length > 0) {
        checks.push({ item: '컬러 일관성', status: 'inconsistent', impact: 'medium' });
    }

    // 무드 설정
    if (identity.mood) { score += 20; checks.push({ item: '브랜드 무드', status: 'pass' }); }
    else checks.push({ item: '브랜드 무드', status: 'undefined', impact: 'low' });

    return {
        score,
        maxScore: 100,
        percent: score,
        grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
        checks,
    };
}

export default {
    BRAND_MOODS,
    createVisualIdentity,
    generateColorPalette,
    generateCSSVariables,
    IMAGE_GUIDELINES,
    validateImage,
    assessBrandConsistency,
};
