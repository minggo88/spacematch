import React, { useMemo } from 'react';
import { breakKoreanText } from '../utils/koreanLineBreak';

/**
 * SmartText – 한국어 스마트 줄바꿈 컴포넌트
 * 
 * 모바일과 PC에서 각각 다른 최대 글자 수로 줄바꿈을 적용합니다.
 * 의미 단위(조사, 쉼표, 절 경계)에서 자연스럽게 줄이 바뀝니다.
 * 
 * @param {string} children - 원본 텍스트 (문자열)
 * @param {number} mobileMax - 모바일 최대 글자 수 (기본: 16)
 * @param {number} pcMax - PC 최대 글자 수 (기본: 22)
 * @param {string} className - 추가 CSS 클래스
 * @param {string} as - 렌더링할 HTML 요소 (기본: span, 예: 'p', 'h2')
 * 
 * @example
 *   <p><SmartText>전국 팝업, 갤러리, 카페, 쇼룸 등 다양한 공간을 한곳에서 검색하세요.</SmartText></p>
 *   <SmartText as="p" mobileMax={14} pcMax={20}>긴 한국어 텍스트...</SmartText>
 */
const SmartText = ({
    children,
    mobileMax = 16,
    pcMax = 22,
    className = '',
    as: Component
}) => {
    const text = typeof children === 'string' ? children : '';

    const { mobileText, pcText, isSame } = useMemo(() => {
        const mLines = breakKoreanText(text, mobileMax);
        const pLines = breakKoreanText(text, pcMax);
        const mText = mLines.join('\n');
        const pText = pLines.join('\n');
        return {
            mobileText: mText,
            pcText: pText,
            isSame: mText === pText
        };
    }, [text, mobileMax, pcMax]);

    const style = { whiteSpace: 'pre-line' };

    // 모바일/PC 줄바꿈이 동일하면 한 번만 렌더
    if (isSame) {
        if (Component) {
            return <Component className={className} style={style}>{mobileText}</Component>;
        }
        return <span className={className} style={style}>{mobileText}</span>;
    }

    // 모바일/PC 다르면 이중 렌더
    if (Component) {
        return (
            <>
                <Component className={`${className} md:hidden`} style={style}>{mobileText}</Component>
                <Component className={`${className} hidden md:block`} style={style}>{pcText}</Component>
            </>
        );
    }

    return (
        <>
            <span className={`${className} md:hidden`} style={style}>{mobileText}</span>
            <span className={`${className} hidden md:inline`} style={style}>{pcText}</span>
        </>
    );
};

export default SmartText;
