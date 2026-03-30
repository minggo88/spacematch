/**
 * 국가별 문의 링크 매핑
 * - 한국(ko): 카카오톡 채널
 * - 그 외 국가: Discord 채널
 */

const CONTACT_LINKS = {
    ko: { url: 'http://pf.kakao.com/_xjGxoRX/chat', type: 'kakao', label: 'KakaoTalk' },
    en: { url: 'https://discord.com/channels/1488066518620311744/1488066520612474946', type: 'discord', label: 'Discord (US)' },
    'en-GB': { url: 'https://discord.com/channels/1488066518620311744/1488067342255783997', type: 'discord', label: 'Discord (UK)' },
    'en-CA': { url: 'https://discord.com/channels/1488066518620311744/1488067368973242489', type: 'discord', label: 'Discord (CA)' },
    'fr-CA': { url: 'https://discord.com/channels/1488066518620311744/1488067368973242489', type: 'discord', label: 'Discord (CA)' },
    ja: { url: 'https://discord.com/channels/1488066518620311744/1488067433653731389', type: 'discord', label: 'Discord (JP)' },
    vi: { url: 'https://discord.com/channels/1488066518620311744/1488067463575765115', type: 'discord', label: 'Discord (VN)' },
    th: { url: 'https://discord.com/channels/1488066518620311744/1488067485134491728', type: 'discord', label: 'Discord (TH)' },
    km: { url: 'https://discord.com/channels/1488066518620311744/1488067509809844227', type: 'discord', label: 'Discord (KH)' },
    ru: { url: 'https://discord.com/channels/1488066518620311744/1488067528679751750', type: 'discord', label: 'Discord (RU)' },
    uk: { url: 'https://discord.com/channels/1488066518620311744/1488067713158090844', type: 'discord', label: 'Discord (UA)' },
};

// 기본 링크 (매핑에 없는 언어일 경우 US Discord 사용)
const DEFAULT_CONTACT = CONTACT_LINKS.en;

/**
 * 현재 i18n 언어 설정에 따라 적절한 문의 링크 반환
 * @param {string} langCode - i18n.language 값 (예: 'ko', 'en', 'en-GB')
 * @returns {{ url: string, type: 'kakao' | 'discord', label: string }}
 */
export const getContactLink = (langCode) => {
    if (!langCode) return DEFAULT_CONTACT;

    // 정확히 일치하는 코드 먼저 찾기 (en-GB, en-CA, fr-CA 등)
    if (CONTACT_LINKS[langCode]) return CONTACT_LINKS[langCode];

    // 2글자 축약 코드로 매칭 (예: 'ko-KR' → 'ko')
    const shortCode = langCode.substring(0, 2);
    if (CONTACT_LINKS[shortCode]) return CONTACT_LINKS[shortCode];

    return DEFAULT_CONTACT;
};

/**
 * 현재 언어가 한국어인지 확인
 * @param {string} langCode
 * @returns {boolean}
 */
export const isKorean = (langCode) => {
    return langCode === 'ko' || langCode?.startsWith('ko-');
};

export { CONTACT_LINKS };
export default getContactLink;
