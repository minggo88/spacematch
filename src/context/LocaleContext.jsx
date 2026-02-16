import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from './CurrencyContext';
import { LANGUAGES } from '../components/LanguageSelector';

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const { setCurrencyFromLanguage } = useCurrency();

    const currentLanguage = i18n.language || 'ko';

    const changeLanguage = useCallback(async (langCode) => {
        await i18n.changeLanguage(langCode);
        setCurrencyFromLanguage(langCode);
        document.documentElement.lang = langCode.substring(0, 2);
    }, [i18n, setCurrencyFromLanguage]);

    const formatDate = useCallback((dateStr, options = {}) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const defaultOpts = { year: 'numeric', month: 'long', day: 'numeric', ...options };
        try { return new Intl.DateTimeFormat(currentLanguage, defaultOpts).format(date); }
        catch { return dateStr; }
    }, [currentLanguage]);

    const formatDateShort = useCallback((dateStr) => {
        return formatDate(dateStr, { month: 'short', day: 'numeric' });
    }, [formatDate]);

    const formatNumber = useCallback((num) => {
        if (num == null || isNaN(num)) return '0';
        try { return new Intl.NumberFormat(currentLanguage).format(Number(num)); }
        catch { return Number(num).toLocaleString(); }
    }, [currentLanguage]);

    return (
        <LocaleContext.Provider value={{
            currentLanguage, changeLanguage, languages: LANGUAGES,
            formatDate, formatDateShort, formatNumber,
        }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
    return ctx;
};
