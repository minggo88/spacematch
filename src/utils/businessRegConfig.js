/**
 * 국가별 사업자 등록 정보 설정
 * 각 국가의 사업자 번호 형식, 검증 규칙, 포맷팅 함수를 정의합니다.
 */

const BUSINESS_REG_CONFIG = {
    // 🇰🇷 한국 — 사업자등록번호
    ko: {
        labelKey: 'businessReg.ko.label',
        placeholder: '000-00-00000',
        helpKey: 'businessReg.ko.help',
        maxLength: 12,
        // 숫자 10자리 (하이픈 포함 12자)
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 10) return 'businessReg.ko.errLength';
            // 체크섬 검증
            const checkKeys = [1, 3, 7, 1, 3, 7, 1, 3, 5];
            let sum = 0;
            for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * checkKeys[i];
            sum += Math.floor((parseInt(digits[8]) * 5) / 10);
            const checkDigit = (10 - (sum % 10)) % 10;
            if (checkDigit !== parseInt(digits[9])) return 'businessReg.ko.errInvalid';
            return null;
        },
        format: (value) => {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
            if (digits.length <= 3) return digits;
            if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
            return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
        }
    },

    // 🇯🇵 일본 — 法人番号 (법인번호)
    ja: {
        labelKey: 'businessReg.ja.label',
        placeholder: '0000000000000',
        helpKey: 'businessReg.ja.help',
        maxLength: 13,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 13) return 'businessReg.ja.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9]/g, '').slice(0, 13);
        }
    },

    // 🇺🇸 미국 — EIN (Employer Identification Number)
    en: {
        labelKey: 'businessReg.en.label',
        placeholder: '00-0000000',
        helpKey: 'businessReg.en.help',
        maxLength: 10,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 9) return 'businessReg.en.errLength';
            return null;
        },
        format: (value) => {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 9);
            if (digits.length <= 2) return digits;
            return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        }
    },

    // 🇬🇧 영국 — Company Registration Number
    'en-GB': {
        labelKey: 'businessReg.enGB.label',
        placeholder: '00000000',
        helpKey: 'businessReg.enGB.help',
        maxLength: 8,
        validate: (value) => {
            const cleaned = value.replace(/\s/g, '');
            if (cleaned.length !== 8) return 'businessReg.enGB.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
        }
    },

    // 🇨🇦 캐나다 (영어) — Business Number (BN)
    'en-CA': {
        labelKey: 'businessReg.enCA.label',
        placeholder: '000000000',
        helpKey: 'businessReg.enCA.help',
        maxLength: 15,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 9 && digits.length !== 15) return 'businessReg.enCA.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9A-Za-z\s]/g, '').slice(0, 15);
        }
    },

    // 🇨🇦 캐나다 (프랑스어) — Numéro d'entreprise (NE)
    'fr-CA': {
        labelKey: 'businessReg.frCA.label',
        placeholder: '000000000',
        helpKey: 'businessReg.frCA.help',
        maxLength: 15,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 9 && digits.length !== 15) return 'businessReg.frCA.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9A-Za-z\s]/g, '').slice(0, 15);
        }
    },

    // 🇻🇳 베트남 — Mã số thuế (세금코드)
    vi: {
        labelKey: 'businessReg.vi.label',
        placeholder: '0000000000',
        helpKey: 'businessReg.vi.help',
        maxLength: 14,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length < 10 || digits.length > 13) return 'businessReg.vi.errLength';
            return null;
        },
        format: (value) => {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
            if (digits.length <= 10) return digits;
            return `${digits.slice(0, 10)}-${digits.slice(10)}`;
        }
    },

    // 🇹🇭 태국 — เลขทะเบียนนิติบุคคล (법인등록번호)
    th: {
        labelKey: 'businessReg.th.label',
        placeholder: '0000000000000',
        helpKey: 'businessReg.th.help',
        maxLength: 13,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 13) return 'businessReg.th.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9]/g, '').slice(0, 13);
        }
    },

    // 🇰🇭 캄보디아 — TIN (세금식별번호)
    km: {
        labelKey: 'businessReg.km.label',
        placeholder: 'L001-12345678',
        helpKey: 'businessReg.km.help',
        maxLength: 20,
        validate: (value) => {
            const cleaned = value.replace(/\s/g, '');
            if (cleaned.length < 5) return 'businessReg.km.errLength';
            return null;
        },
        format: (value) => {
            return value.slice(0, 20);
        }
    },

    // 🇷🇺 러시아 — ИНН (납세자번호)
    ru: {
        labelKey: 'businessReg.ru.label',
        placeholder: '0000000000',
        helpKey: 'businessReg.ru.help',
        maxLength: 12,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 10 && digits.length !== 12) return 'businessReg.ru.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9]/g, '').slice(0, 12);
        }
    },

    // 🇺🇦 우크라이나 — ЄДРПОУ / ІПН
    uk: {
        labelKey: 'businessReg.uk.label',
        placeholder: '00000000',
        helpKey: 'businessReg.uk.help',
        maxLength: 10,
        validate: (value) => {
            const digits = value.replace(/[^0-9]/g, '');
            if (digits.length !== 8 && digits.length !== 10) return 'businessReg.uk.errLength';
            return null;
        },
        format: (value) => {
            return value.replace(/[^0-9]/g, '').slice(0, 10);
        }
    }
};

/**
 * 국가 코드로 사업자 정보 설정 가져오기
 * @param {string} countryCode - 국가 코드 (ko, ja, en, en-GB, ...)
 * @returns {object} 해당 국가의 사업자 정보 설정
 */
export const getBusinessRegConfig = (countryCode) => {
    return BUSINESS_REG_CONFIG[countryCode] || BUSINESS_REG_CONFIG['en'];
};

/**
 * 국가별 사업자번호 검증 (선택사항 — 빈 값이면 통과)
 * @param {string} value - 입력값
 * @param {string} countryCode - 국가 코드
 * @returns {string|null} 에러 메시지 키 또는 null
 */
export const validateBusinessReg = (value, countryCode) => {
    if (!value || !value.trim()) return null; // 선택사항
    const config = getBusinessRegConfig(countryCode);
    return config.validate(value);
};

/**
 * 국가별 사업자번호 자동 포맷
 * @param {string} value - 입력값
 * @param {string} countryCode - 국가 코드
 * @returns {string} 포맷된 값
 */
export const formatBusinessReg = (value, countryCode) => {
    const config = getBusinessRegConfig(countryCode);
    return config.format(value);
};

export default BUSINESS_REG_CONFIG;
