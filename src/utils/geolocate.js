/**
 * IP 기반 지오로케이션 유틸리티
 * ip-api.com (무료, API 키 불필요)을 사용하여 사용자 국가를 감지하고
 * 해당 국가에 맞는 언어 코드를 반환합니다.
 */

// 국가코드(ISO 3166-1 alpha-2) → 지원 언어 코드 매핑
const COUNTRY_LANGUAGE_MAP = {
    KR: 'ko',        // 한국
    US: 'en',         // 미국
    GB: 'en-GB',      // 영국
    CA: 'en-CA',      // 캐나다 (기본 영어)
    JP: 'ja',         // 일본
    VN: 'vi',         // 베트남
    TH: 'th',         // 태국
    KH: 'km',         // 캄보디아
    RU: 'ru',         // 러시아
    UA: 'uk',         // 우크라이나
};

const CACHE_KEY = 'geoCountryCode';

/**
 * IP 주소로부터 국가코드를 가져옵니다.
 * sessionStorage에 캐싱하여 세션 내 중복 API 호출을 방지합니다.
 * @returns {Promise<string|null>} ISO 국가코드 (예: 'KR') 또는 실패 시 null
 */
export async function fetchCountryCode() {
    // sessionStorage 캐시 확인
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return cached;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

        const res = await fetch('http://ip-api.com/json/?fields=status,countryCode', {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) return null;

        const data = await res.json();
        if (data.status === 'success' && data.countryCode) {
            sessionStorage.setItem(CACHE_KEY, data.countryCode);
            return data.countryCode;
        }
        return null;
    } catch {
        // 네트워크 오류, 타임아웃 등 → 조용히 null 반환
        return null;
    }
}

/**
 * 국가코드를 지원되는 언어 코드로 변환합니다.
 * @param {string} countryCode - ISO 국가코드 (예: 'KR')
 * @returns {string|null} 언어 코드 (예: 'ko') 또는 미지원 국가 시 null
 */
export function getLanguageFromCountry(countryCode) {
    if (!countryCode) return null;
    return COUNTRY_LANGUAGE_MAP[countryCode.toUpperCase()] || null;
}

/**
 * IP 기반으로 감지된 언어 코드를 반환합니다.
 * @returns {Promise<string|null>} 언어 코드 또는 null
 */
export async function detectLanguageByIP() {
    const countryCode = await fetchCountryCode();
    return getLanguageFromCountry(countryCode);
}

export { COUNTRY_LANGUAGE_MAP };
