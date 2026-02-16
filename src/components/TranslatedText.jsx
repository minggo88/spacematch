import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, RotateCcw } from 'lucide-react';
import { useTranslateText } from '../hooks/useAutoTranslate';

/**
 * TranslatedText — Displays auto-translated text with a toggle to view original.
 * 
 * Usage:
 *   <TranslatedText text="안녕하세요" sourceLang="ko" />
 *   <TranslatedText text="안녕하세요" sourceLang="ko" as="h2" className="text-xl font-bold" />
 */
const TranslatedText = ({
    text,
    sourceLang,
    as: Tag = 'span',
    className = '',
    showBadge = true,
    ...rest
}) => {
    const { i18n } = useTranslation();
    const [showOriginal, setShowOriginal] = useState(false);

    // Default to 'ko' for existing posts that don't have original_lang set
    const effectiveLang = sourceLang || 'ko';
    const { translated, loading, isTranslated, error } = useTranslateText(text, effectiveLang);

    const userLang = i18n.language?.substring(0, 2) || 'ko';
    const srcLang = effectiveLang?.substring(0, 2) || 'ko';

    // No translation needed — same language
    if (userLang === srcLang) {
        return <Tag className={className} {...rest}>{text}</Tag>;
    }

    // No text to translate
    if (!text || !text.trim()) {
        return <Tag className={className} {...rest}>{text}</Tag>;
    }

    // Loading state
    if (loading) {
        return (
            <Tag className={className} {...rest}>
                <span className="inline-flex items-center gap-1">
                    {text}
                    <span className="inline-flex items-center gap-0.5 text-xs text-gray-400 animate-pulse ml-1">
                        <Globe size={10} />
                    </span>
                </span>
            </Tag>
        );
    }

    // Error state — just show original
    if (error) {
        return <Tag className={className} {...rest}>{text}</Tag>;
    }

    // Show translated or original
    const displayText = showOriginal ? text : (translated || text);

    return (
        <Tag className={className} {...rest}>
            {displayText}
            {isTranslated && showBadge && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowOriginal(!showOriginal);
                    }}
                    className="inline-flex items-center gap-0.5 ml-1.5 px-1.5 py-0.5 text-[10px] font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer align-middle"
                    title={showOriginal ? 'Show translation' : 'Show original'}
                >
                    {showOriginal ? (
                        <><Globe size={9} /> 번역</>
                    ) : (
                        <><RotateCcw size={9} /> 원문</>
                    )}
                </button>
            )}
        </Tag>
    );
};

/**
 * TranslatedBlock — Like TranslatedText but for multi-line content (div-based).
 */
export const TranslatedBlock = (props) => <TranslatedText {...props} as="div" />;

export default TranslatedText;
