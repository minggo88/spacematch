import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: {
            'ko': ['ko'],
            'en-GB': ['en'],
            'en-CA': ['en'],
            'fr-CA': ['en'],
            default: ['en'],
        },
        supportedLngs: ['ko', 'en', 'en-GB', 'en-CA', 'fr-CA', 'ja', 'vi', 'th', 'km', 'ru', 'uk'],
        ns: ['common', 'auth', 'admin', 'seller', 'vendor', 'venue', 'ads', 'community', 'landing', 'chat'],
        defaultNS: 'common',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            lookupQuerystring: 'lang',
            caches: ['localStorage'],
        },
        react: {
            useSuspense: true,
        },
        // Load only the exact selected locale (e.g. fr-CA, not fr+fr-CA)
        load: 'currentOnly',
    });

export default i18n;
