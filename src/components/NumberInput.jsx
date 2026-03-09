import React, { useState, useCallback } from 'react';

/**
 * NumberInput — 숫자 입력 시 3자리마다 콤마를 자동으로 표시해주는 input 컴포넌트
 * 
 * Props:
 *  - value: 숫자 (number or string) — 콤마 없는 raw 값
 *  - onChange: (rawValue: string) => void — 콤마가 제거된 순수 숫자 문자열 전달
 *  - allowDecimal: boolean — 소수점 허용 여부 (default: false)
 *  - allowNegative: boolean — 음수 허용 여부 (default: false)
 *  - className, placeholder, min, max, step 등 기타 input props 전달
 */
const NumberInput = ({
    value,
    onChange,
    allowDecimal = false,
    allowNegative = false,
    className = '',
    placeholder = '0',
    ...rest
}) => {
    // Format a raw number value to display with commas
    const formatDisplay = useCallback((val) => {
        if (val === '' || val === null || val === undefined) return '';
        const str = String(val);

        // Handle negative sign
        const isNeg = str.startsWith('-');
        const abs = isNeg ? str.slice(1) : str;

        // Split integer and decimal parts
        const parts = abs.split('.');
        const intPart = parts[0].replace(/[^0-9]/g, '');
        const decPart = parts.length > 1 ? parts[1] : null;

        // Format integer part with commas
        const formatted = intPart ? Number(intPart).toLocaleString('en-US') : '';

        let result = formatted;
        if (allowDecimal && decPart !== null) {
            result += '.' + decPart;
        }
        if (allowNegative && isNeg && result) {
            result = '-' + result;
        }

        return result;
    }, [allowDecimal, allowNegative]);

    const [displayValue, setDisplayValue] = useState(() => formatDisplay(value));

    // Sync display value when external value changes
    React.useEffect(() => {
        const newDisplay = formatDisplay(value);
        setDisplayValue(newDisplay);
    }, [value, formatDisplay]);

    const handleChange = (e) => {
        let input = e.target.value;

        // Allow only digits, commas, and optionally decimal/negative
        let pattern = allowDecimal ? /[^0-9,.-]/g : /[^0-9,-]/g;
        if (!allowNegative) {
            pattern = allowDecimal ? /[^0-9,.]/g : /[^0-9,]/g;
        }
        input = input.replace(pattern, '');

        // Remove commas to get raw value
        const raw = input.replace(/,/g, '');

        // Reformat with commas
        const formatted = formatDisplay(raw);
        setDisplayValue(formatted);

        // Pass raw numeric value to parent
        if (onChange) {
            onChange(raw);
        }
    };

    const handleBlur = () => {
        // Re-format on blur to clean up any partial input
        const raw = displayValue.replace(/,/g, '');
        setDisplayValue(formatDisplay(raw));
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={className}
            {...rest}
        />
    );
};

export default NumberInput;
