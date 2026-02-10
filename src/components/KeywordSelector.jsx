import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';

const SELLER_KEYWORDS = [
    '핸드메이드', '빈티지', '친환경', '프리미엄', '가성비',
    '트렌디', '유기농', '로컬', '감성', '미니멀',
    '럭셔리', '내추럴', '모던', '클래식', '유니크'
];

const VENDOR_KEYWORDS = [
    '백화점', '복합쇼핑몰', '팝업스토어', '플리마켓', '로드숍',
    '카페', '갤러리', '호텔', '오피스', '공유공간',
    '전시장', '편집숍', '마켓', '페스티벌', '기타공간'
];

const KeywordSelector = ({ type = 'seller', value = [], onChange, maxKeywords = 10 }) => {
    const [customInput, setCustomInput] = useState('');
    const presetKeywords = type === 'vendor' ? VENDOR_KEYWORDS : SELLER_KEYWORDS;

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

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                키워드 선택 <span className="text-gray-400 font-normal text-xs">(최대 {maxKeywords}개)</span>
            </label>

            {/* Preset keyword chips */}
            <div className="flex flex-wrap gap-2 mb-3">
                {presetKeywords.map(kw => {
                    const isSelected = value.includes(kw);
                    return (
                        <button
                            key={kw}
                            type="button"
                            onClick={() => toggleKeyword(kw)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            {kw}
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
                        placeholder="직접 키워드 입력 후 Enter"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    추가
                </button>
            </div>

            {/* Selected keywords display */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-gray-50 rounded-lg">
                    {value.map(kw => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold">
                            {kw}
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
