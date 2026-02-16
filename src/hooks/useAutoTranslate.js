import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// In-memory cache shared across all hook instances
const translationCache = new Map();

/**
 * Auto-translate text when the user's language differs from the source language.
 * 
 * @param {string|string[]} texts - Text(s) to translate
 * @param {string} sourceLang - Original language code (e.g. 'ko')
 * @returns {{ translated: string|string[], loading: boolean, isTranslated: boolean, error: string|null }}
 */
export function useAutoTranslate(texts, sourceLang) {
    const { i18n } = useTranslation();
    const userLang = i18n.language?.substring(0, 5) || 'ko';

    const isSingle = typeof texts === 'string';
    const textArray = useMemo(() => isSingle ? [texts] : (texts || []), [texts, isSingle]);

    const [translated, setTranslated] = useState(textArray);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);
    const lastRequestRef = useRef('');

    // Normalize lang codes for comparison
    const normalizeForCompare = (lang) => {
        if (!lang) return '';
        const map = { 'en-GB': 'en', 'en-CA': 'en', 'fr-CA': 'fr' };
        return map[lang] || lang.substring(0, 2);
    };

    const srcNorm = normalizeForCompare(sourceLang);
    const userNorm = normalizeForCompare(userLang);

    const needsTranslation = !!sourceLang &&
        srcNorm !== '' &&
        userNorm !== srcNorm &&
        textArray.some(t => t && t.trim().length > 0);

    // Stable request key to prevent duplicate calls
    const requestKey = useMemo(
        () => `${srcNorm}→${userNorm}:${textArray.join('|||')}`,
        [srcNorm, userNorm, textArray]
    );

    useEffect(() => {
        // Skip if no translation needed
        if (!needsTranslation || textArray.length === 0) {
            setTranslated(textArray);
            return;
        }

        // Skip duplicate requests
        if (lastRequestRef.current === requestKey) return;

        // Check cache for all texts
        const cacheKey = (text) => `${srcNorm}→${userNorm}:${text}`;
        const allCached = textArray.every(t => !t || !t.trim() || translationCache.has(cacheKey(t)));

        if (allCached) {
            setTranslated(textArray.map(t => (!t || !t.trim()) ? t : translationCache.get(cacheKey(t))));
            lastRequestRef.current = requestKey;
            return;
        }

        // Find which texts need translating
        const uncachedIndices = [];
        const uncachedTexts = [];
        const result = [...textArray];

        textArray.forEach((t, i) => {
            if (!t || !t.trim()) {
                result[i] = t;
            } else if (translationCache.has(cacheKey(t))) {
                result[i] = translationCache.get(cacheKey(t));
            } else {
                uncachedIndices.push(i);
                uncachedTexts.push(t);
            }
        });

        if (uncachedTexts.length === 0) {
            setTranslated(result);
            lastRequestRef.current = requestKey;
            return;
        }

        // Start async translation
        setLoading(true);
        setError(null);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        lastRequestRef.current = requestKey;

        const doTranslate = async () => {
            try {
                const res = await fetch('/api/translate.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        texts: uncachedTexts,
                        source: sourceLang,
                        target: userLang,
                    }),
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                if (data.success && Array.isArray(data.translations)) {
                    data.translations.forEach((t, idx) => {
                        const origIdx = uncachedIndices[idx];
                        result[origIdx] = t;
                        translationCache.set(cacheKey(textArray[origIdx]), t);
                    });
                    setTranslated(result);
                } else {
                    setTranslated(textArray);
                    setError('Translation failed');
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setTranslated(textArray);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        // Debounce
        const timer = setTimeout(doTranslate, 200);
        return () => {
            clearTimeout(timer);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [requestKey, needsTranslation]);

    return {
        translated: isSingle ? translated[0] : translated,
        loading,
        isTranslated: needsTranslation && !loading && !error,
        error,
    };
}

/**
 * Translate a single text (simplified)
 */
export function useTranslateText(text, sourceLang) {
    return useAutoTranslate(text, sourceLang);
}

export default useAutoTranslate;
