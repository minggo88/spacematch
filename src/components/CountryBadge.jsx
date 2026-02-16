import React from 'react';

const COUNTRY_FLAGS = {
    'ko': { flag: '🇰🇷', name: '한국', nameEn: 'Korea' },
    'en': { flag: '🇺🇸', name: '미국', nameEn: 'USA' },
    'en-GB': { flag: '🇬🇧', name: '영국', nameEn: 'UK' },
    'en-CA': { flag: '🇨🇦', name: '캐나다', nameEn: 'Canada' },
    'fr-CA': { flag: '🇨🇦', name: '캐나다', nameEn: 'Canada' },
    'ja': { flag: '🇯🇵', name: '일본', nameEn: 'Japan' },
    'vi': { flag: '🇻🇳', name: '베트남', nameEn: 'Vietnam' },
    'th': { flag: '🇹🇭', name: '태국', nameEn: 'Thailand' },
    'km': { flag: '🇰🇭', name: '캄보디아', nameEn: 'Cambodia' },
    'ru': { flag: '🇷🇺', name: '러시아', nameEn: 'Russia' },
    'uk': { flag: '🇺🇦', name: '우크라이나', nameEn: 'Ukraine' },
};

/**
 * CountryBadge — Displays a country flag + name badge.
 * 
 * Usage:
 *   <CountryBadge country="ko" />
 *   <CountryBadge country="ja" size="sm" showName={false} />
 */
const CountryBadge = ({
    country,
    size = 'sm',
    showName = true,
    showFlag = true,
    className = '',
    lang = 'ko', // display language for the name
}) => {
    if (!country) return null;

    const info = COUNTRY_FLAGS[country] || COUNTRY_FLAGS[country?.substring(0, 2)];
    if (!info) return null;

    const displayName = lang === 'ko' ? info.name : info.nameEn;

    const sizeClasses = {
        xs: 'text-[10px] px-1 py-0.5 gap-0.5',
        sm: 'text-xs px-1.5 py-0.5 gap-1',
        md: 'text-sm px-2 py-1 gap-1.5',
        lg: 'text-base px-3 py-1.5 gap-2',
    };

    return (
        <span className={`inline-flex items-center ${sizeClasses[size] || sizeClasses.sm} bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-600 font-medium whitespace-nowrap ${className}`}>
            {showFlag && <span>{info.flag}</span>}
            {showName && <span>{displayName}</span>}
        </span>
    );
};

export { COUNTRY_FLAGS };
export default CountryBadge;
