import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { detectLanguageByIP } from '../utils/geolocate';

/**
 * 앱 마운트 시 한 번만 실행되는 IP 기반 언어/통화 자동 감지 훅.
 *
 * 동작 규칙:
 * 1. localStorage에 'i18nextLng'가 이미 있으면 → 사용자가 직접 언어를 선택한 것이므로
 *    IP 감지를 건너뛰고 기존 선택을 유지합니다.
 * 2. 'i18nextLng'가 없으면 (첫 방문) → IP API를 호출하여 국가를 감지하고
 *    해당 국가의 언어와 통화를 자동으로 설정합니다.
 */
export function useGeoLanguage() {
    const { i18n } = useTranslation();
    const { setCurrencyFromLanguage } = useCurrency();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        // 사용자가 이미 언어를 선택한 적이 있으면 건너뜀
        const savedLang = localStorage.getItem('i18nextLng');
        if (savedLang) return;

        (async () => {
            try {
                const detectedLang = await detectLanguageByIP();
                if (detectedLang) {
                    await i18n.changeLanguage(detectedLang);
                    document.documentElement.lang = detectedLang.substring(0, 2);
                    localStorage.setItem('i18nextLng', detectedLang);
                    setCurrencyFromLanguage(detectedLang);
                    console.log(`[GeoLanguage] IP 기반 언어 자동 설정: ${detectedLang}`);
                }
            } catch (err) {
                console.warn('[GeoLanguage] IP 기반 언어 감지 실패:', err);
            }
        })();
    }, [i18n, setCurrencyFromLanguage]);
}
