import React, { createContext, useState, useContext, useEffect } from 'react';

const CURRENCY_CONFIG = {
    KRW: { code: 'KRW', symbol: '₩', locale: 'ko-KR', decimals: 0, name: '원 (KRW)', flag: '🇰🇷' },
    USD: { code: 'USD', symbol: '$', locale: 'en-US', decimals: 2, name: 'USD ($)', flag: '🇺🇸' },
    GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', decimals: 2, name: 'GBP (£)', flag: '🇬🇧' },
    CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', decimals: 2, name: 'CAD (C$)', flag: '🇨🇦' },
    JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', decimals: 0, name: '円 (JPY)', flag: '🇯🇵' },
    VND: { code: 'VND', symbol: '₫', locale: 'vi-VN', decimals: 0, name: 'VND (₫)', flag: '🇻🇳' },
    THB: { code: 'THB', symbol: '฿', locale: 'th-TH', decimals: 2, name: 'THB (฿)', flag: '🇹🇭' },
    KHR: { code: 'KHR', symbol: '៛', locale: 'km-KH', decimals: 0, name: 'KHR (៛)', flag: '🇰🇭' },
    RUB: { code: 'RUB', symbol: '₽', locale: 'ru-RU', decimals: 2, name: 'RUB (₽)', flag: '🇷🇺' },
    UAH: { code: 'UAH', symbol: '₴', locale: 'uk-UA', decimals: 2, name: 'UAH (₴)', flag: '🇺🇦' },
};

const LANGUAGE_CURRENCY_MAP = {
    ko: 'KRW', en: 'USD', 'en-GB': 'GBP', 'en-CA': 'CAD', 'fr-CA': 'CAD',
    ja: 'JPY', vi: 'VND', th: 'THB', km: 'KHR', ru: 'RUB', uk: 'UAH',
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('preferredCurrency') || 'KRW';
    });
    const [rates, setRates] = useState({
        KRW: 1, USD: 0.00074, GBP: 0.00058, CAD: 0.001, JPY: 0.11,
        VND: 18.5, THB: 0.025, KHR: 3.0, RUB: 0.066, UAH: 0.031
    });

    useEffect(() => {
        const fetchRates = async () => {
            const cached = localStorage.getItem('exchangeRates');
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 86400000) { setRates(data); return; }
            }
            try {
                const res = await fetch('/api/currency/rates.php');
                const data = await res.json();
                if (data.success && data.rates) {
                    setRates(data.rates);
                    localStorage.setItem('exchangeRates', JSON.stringify({ data: data.rates, timestamp: Date.now() }));
                }
            } catch { /* Use fallback rates */ }
        };
        fetchRates();
    }, []);

    useEffect(() => { localStorage.setItem('preferredCurrency', currency); }, [currency]);

    const convert = (amountKRW) => {
        if (!amountKRW || isNaN(amountKRW)) return 0;
        const rate = rates[currency] || 1;
        return Math.round(Number(amountKRW) * rate * 100) / 100;
    };

    const formatCurrency = (amountKRW) => {
        const converted = convert(amountKRW);
        const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KRW;
        try {
            return new Intl.NumberFormat(config.locale, {
                style: 'currency', currency: config.code,
                minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals,
            }).format(converted);
        } catch { return `${config.symbol}${converted.toLocaleString()}`; }
    };

    const formatCurrencyCompact = (amountKRW) => {
        const converted = convert(amountKRW);
        const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KRW;
        try {
            return new Intl.NumberFormat(config.locale, {
                style: 'currency', currency: config.code, notation: 'compact', maximumFractionDigits: 1,
            }).format(converted);
        } catch { return formatCurrency(amountKRW); }
    };

    const setCurrencyFromLanguage = (lang) => {
        const mapped = LANGUAGE_CURRENCY_MAP[lang];
        if (mapped && !localStorage.getItem('currencyManuallySet')) {
            setCurrency(mapped);
        }
    };

    // Pure number formatting with commas (no currency symbol)
    const formatNumber = (value) => {
        const num = Number(String(value).replace(/[^0-9.-]/g, ''));
        if (isNaN(num)) return '0';
        return num.toLocaleString('en-US');
    };

    return (
        <CurrencyContext.Provider value={{
            currency, setCurrency, convert, formatCurrency, formatCurrencyCompact,
            rates, setCurrencyFromLanguage, currencies: CURRENCY_CONFIG, formatNumber,
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
    return ctx;
};

export { CURRENCY_CONFIG, LANGUAGE_CURRENCY_MAP };
