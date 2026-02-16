/**
 * Translation utilities for multi-language support.
 *
 * Country code → language mapping and helpers to pick
 * the correct localized value for a viewer.
 */

/** Map a country/locale code to its base language */
export const countryToLang = (country) => {
    if (!country) return 'ko';
    const map = {
        'ko': 'ko',
        'en': 'en', 'en-GB': 'en', 'en-CA': 'en',
        'vi': 'vi',
        'ja': 'ja',
        'th': 'th',
        'km': 'km',
        'ru': 'ru',
        'uk': 'uk',
        'fr-CA': 'fr',
    };
    return map[country] || map[country?.substring(0, 2)] || 'ko';
};

/**
 * Given a popup with `translations` JSON and a viewer language,
 * return the best-fit title and content.
 *
 * translations shape: { "en": { "title": "...", "content": "..." }, "vi": { ... }, ... }
 */
export const getPopupLocalized = (popup, viewerLang) => {
    if (!popup) return { title: '', content: '' };
    if (!viewerLang || viewerLang === 'ko') {
        return { title: popup.title, content: popup.content };
    }

    let translations = popup.translations;
    if (typeof translations === 'string') {
        try { translations = JSON.parse(translations); } catch { translations = null; }
    }

    if (translations && translations[viewerLang]) {
        return {
            title: translations[viewerLang].title || popup.title,
            content: translations[viewerLang].content || popup.content,
        };
    }
    // Fallback: try English, then default Korean
    if (translations && translations['en'] && viewerLang !== 'en') {
        return {
            title: translations['en'].title || popup.title,
            content: translations['en'].content || popup.content,
        };
    }
    return { title: popup.title, content: popup.content };
};

/**
 * Return the appropriate display name based on viewer language.
 * If viewer language is not Korean and name_en exists, show name_en.
 */
export const getDisplayName = (user, viewerLang) => {
    if (!user) return '';
    const name = user.user_name || user.name || '';
    const nameEn = user.user_name_en || user.name_en || '';
    if (!viewerLang || viewerLang === 'ko') return name;
    return nameEn || name;
};
