import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SELLER_KEYWORD_KEYS = [
    'handmade', 'vintage', 'eco', 'premium', 'costEffective',
    'trendy', 'organic', 'local', 'aesthetic', 'minimal',
    'luxury', 'natural', 'modern', 'classic', 'unique'
];

const VENDOR_KEYWORD_KEYS = [
    'departmentStore', 'shoppingMall', 'popupStore', 'fleaMarket', 'roadShop',
    'cafe', 'gallery', 'hotel', 'office', 'coworking',
    'exhibition', 'selectShop', 'market', 'festival', 'otherSpace'
];

const KeywordSelector = ({ type = 'seller', value = [], onChange, maxKeywords = 10 }) => {
    const [customInput, setCustomInput] = useState('');
    const { t } = useTranslation('auth');
    const keywordKeys = type === 'vendor' ? VENDOR_KEYWORD_KEYS : SELLER_KEYWORD_KEYS;
    const prefix = type === 'vendor' ? 'vendorKeywords' : 'sellerKeywords';

    const getLabel = (key) => t(`${prefix}.${key}`);

    const toggleKeyword = (kw) => {
        if (value.includes(kw)) {
            onChange(value.filter(v => v !== kw));
        } else if (value.length < maxKeywords) {
            onChange([...value, kw]);
        }
    };

    const addCustomKeyword = () => {
        const trimmed = customInput.trim();
        if (!trimmed) return;
        if (value.includes(trimmed)) {
            setCustomInput('');
            return;
        }
        if (value.length >= maxKeywords) return;
        onChange([...value, trimmed]);
        setCustomInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomKeyword();
        }
    };

    const removeKeyword = (kw) => {
        onChange(value.filter(v => v !== kw));
    };

    // Display label: if the keyword matches a preset key's translated value, show that; otherwise show the raw value (custom keyword)
    const displayLabel = (kw) => {
        const idx = keywordKeys.indexOf(kw);
        if (idx >= 0) return getLabel(kw);
        return kw;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('keywordSelection')} <span className="text-gray-400 font-normal text-xs">({t('keywordMax', { max: maxKeywords })})</span>
            </label>

            {/* Preset keyword chips */}
            <div className="flex flex-wrap gap-2 mb-3">
                {keywordKeys.map(kw => {
                    const isSelected = value.includes(kw);
                    return (
                        <button
                            key={kw}
                            type="button"
                            onClick={() => toggleKeyword(kw)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            {getLabel(kw)}
                        </button>
                    );
                })}
            </div>

            {/* Custom keyword input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('keywordCustomPlaceholder')}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        maxLength={20}
                        disabled={value.length >= maxKeywords}
                    />
                </div>
                <button
                    type="button"
                    onClick={addCustomKeyword}
                    disabled={!customInput.trim() || value.length >= maxKeywords}
                    className="px-3 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <Plus size={14} />
                    {t('keywordAdd')}
                </button>
            </div>

            {/* Selected keywords display */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {value.map(kw => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-bold">
                            {displayLabel(kw)}
                            <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 transition-colors">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <span className="text-[10px] text-gray-400 self-center ml-1">{value.length}/{maxKeywords}</span>
                </div>
            )}
        </div>
    );
};

export default KeywordSelector;
