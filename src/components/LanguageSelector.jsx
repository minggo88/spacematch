import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Globe, X, Check, ChevronRight, Languages, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency, CURRENCY_CONFIG } from '../context/CurrencyContext';

const LANGUAGES = [
    { code: 'ko', name: '한국어', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
    { code: 'en-CA', name: 'English (Canada)', nativeName: 'English (Canada)', flag: '🇨🇦' },
    { code: 'fr-CA', name: 'Français (Canada)', nativeName: 'Français (Canada)', flag: '🇨🇦' },
    { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'ภาษาไทย', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'km', name: 'ខ្មែរ', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'ru', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'uk', name: 'Українська', nativeName: 'Українська', flag: '🇺🇦' },
];

const LanguageSelector = ({ compact = false }) => {
    const { i18n, t } = useTranslation('common');
    const { currency, setCurrency } = useCurrency();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('lang');
    const modalRef = useRef(null);

    const currentLang = i18n.language?.substring(0, 5) || 'ko';
    const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES.find(l => currentLang.startsWith(l.code)) || LANGUAGES[0];

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const handleLanguageChange = async (langCode) => {
        await i18n.changeLanguage(langCode);
        document.documentElement.lang = langCode.substring(0, 2);
        localStorage.setItem('i18nextLng', langCode);
        setOpen(false);
    };

    const handleCurrencyChange = (code) => {
        setCurrency(code);
        localStorage.setItem('currencyManuallySet', 'true');
        setOpen(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-indigo-400 transition-colors w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
                <Globe size={20} />
                {!compact && (
                    <span className="text-sm font-medium whitespace-nowrap">
                        {currentLangObj.flag} {currentLangObj.nativeName}
                    </span>
                )}
                {!compact && <ChevronRight size={14} className="ml-auto text-gray-400" />}
                {compact && <span className="text-sm">{currentLangObj.flag}</span>}
            </button>

            {/* Full-screen Centered Modal — rendered via portal to avoid parent transform/overflow issues */}
            {open && createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
                    style={{ zIndex: 99999 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    />

                    {/* Modal Card — max-h prevents overflow, margin auto ensures centering */}
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-[420px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col m-auto"
                        style={{
                            animation: 'modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)'
                        }}
                    >
                        {/* Header */}
                        <div className="relative px-6 pt-6 pb-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-[0.07]" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50">
                                        <Globe size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('globalSettings')}</h3>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Language & Currency</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                                >
                                    <X size={16} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6">
                            <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 gap-1">
                                <button
                                    onClick={() => setTab('lang')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${tab === 'lang'
                                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Languages size={15} />
                                    {t('selectLanguage')}
                                </button>
                                <button
                                    onClick={() => setTab('currency')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${tab === 'currency'
                                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Coins size={15} />
                                    {t('selectCurrency')}
                                </button>
                            </div>
                        </div>

                        {/* Content — flex-1 + overflow-auto ensures it takes remaining space within the max-h-[90vh] card */}
                        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                            {tab === 'lang' && (
                                <div className="space-y-1">
                                    {LANGUAGES.map(lang => {
                                        const isExactMatch = currentLang === lang.code;
                                        return (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${isExactMatch
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200/80 dark:ring-indigo-500/30'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.98]'
                                                    }`}
                                            >
                                                <span className="text-2xl leading-none">{lang.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold truncate ${isExactMatch
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-800 dark:text-gray-200'
                                                        }`}>
                                                        {lang.nativeName}
                                                    </p>
                                                    {lang.name !== lang.nativeName && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{lang.name}</p>
                                                    )}
                                                </div>
                                                {isExactMatch ? (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50 flex-shrink-0">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {tab === 'currency' && (
                                <div className="space-y-1">
                                    {Object.values(CURRENCY_CONFIG).map(cur => {
                                        const isSelected = currency === cur.code;
                                        return (
                                            <button
                                                key={cur.code}
                                                onClick={() => handleCurrencyChange(cur.code)}
                                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${isSelected
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200/80 dark:ring-indigo-500/30'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.98]'
                                                    }`}
                                            >
                                                <span className="text-2xl leading-none">{cur.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold truncate ${isSelected
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-800 dark:text-gray-200'
                                                        }`}>
                                                        {cur.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {cur.symbol} · {cur.code}
                                                    </p>
                                                </div>
                                                {isSelected ? (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50 flex-shrink-0">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3.5 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    {currentLangObj.flag} {currentLangObj.nativeName}
                                </span>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    {CURRENCY_CONFIG[currency]?.symbol || '₩'} {currency}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Inline Keyframes */}
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes modalSlideUp {
                            from { opacity: 0; transform: translateY(20px) scale(0.96); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>
                </div>,
                document.body
            )}
        </>
    );
};

export default LanguageSelector;
export { LANGUAGES };
