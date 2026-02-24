import React, { useState } from 'react';
import { ChevronDown, Check, Shield, FileText, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Term structure: keys and icons (content comes from i18n)
const TERM_KEYS = ['terms', 'privacy', 'marketing'];
const TERM_ICONS = { terms: FileText, privacy: Shield, marketing: Megaphone };
const TERM_REQUIRED = { terms: true, privacy: true, marketing: false };

// ─── 약관 아코디언 아이템 ───
const TermItem = ({ termKey, title, required, requiredLabel, optionalLabel, content, checked, onCheck, expanded, onToggle }) => {
    const Icon = TERM_ICONS[termKey];
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${checked ? 'border-indigo-200 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Checkbox */}
                <button
                    type="button"
                    onClick={onCheck}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 dark:border-gray-500 hover:border-indigo-400'
                        }`}
                >
                    {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>

                {/* Label */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <Icon size={16} className={`flex-shrink-0 ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${checked ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {title}
                    </span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${required ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {required ? requiredLabel : optionalLabel}
                    </span>
                </div>

                {/* Expand button */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pb-4">
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg p-4 max-h-[260px] overflow-y-auto">
                        <pre className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-sans">
                            {content}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───
const TermsAgreement = ({ userType = 'seller', agreements, onAgreementsChange }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const { t } = useTranslation('auth');
    const prefix = userType === 'host' ? 'hostTerms' : 'sellerTerms';

    const allChecked = TERM_KEYS.every(key => agreements[key]);
    const requiredAllChecked = TERM_KEYS.filter(k => TERM_REQUIRED[k]).every(k => agreements[k]);

    const handleToggleExpand = (key) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCheck = (key) => {
        onAgreementsChange({ ...agreements, [key]: !agreements[key] });
    };

    const handleAllCheck = () => {
        const newVal = !allChecked;
        const updated = {};
        TERM_KEYS.forEach(key => { updated[key] = newVal; });
        onAgreementsChange(updated);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('termsTitle')}</label>

            {/* All agree */}
            <div
                onClick={handleAllCheck}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${allChecked
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
            >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${allChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-500'
                    }`}>
                    {allChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm font-extrabold ${allChecked ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                    {t('termsAgreeAll')}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{t('termsIncludesOptional')}</span>
            </div>

            {/* Individual terms */}
            <div className="space-y-2">
                {TERM_KEYS.map(key => (
                    <TermItem
                        key={key}
                        termKey={key}
                        title={t(`${prefix}.${key}.title`)}
                        required={TERM_REQUIRED[key]}
                        requiredLabel={t('termsRequired')}
                        optionalLabel={t('termsOptional')}
                        content={t(`${prefix}.${key}.content`)}
                        checked={!!agreements[key]}
                        onCheck={() => handleCheck(key)}
                        expanded={!!expandedItems[key]}
                        onToggle={() => handleToggleExpand(key)}
                    />
                ))}
            </div>

            {/* Warning if required not checked */}
            {!requiredAllChecked && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">
                    {t('termsRequiredWarning')}
                </p>
            )}
        </div>
    );
};

// Export helper to check if required terms are agreed
export const isRequiredAgreed = (agreements, userType = 'seller') => {
    return TERM_KEYS.filter(k => TERM_REQUIRED[k]).every(k => agreements[k]);
};

export default TermsAgreement;
