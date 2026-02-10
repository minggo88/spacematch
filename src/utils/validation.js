/**
 * 회원가입 입력값 유효성 검사 유틸리티
 * - 실명, 브랜드명/업체명, 사업자등록번호, 전화번호, 이메일
 */

// ─── 실명 검증 ───
// 한글 2자 이상, 특수문자/숫자 불가
export const validateRealName = (value) => {
    if (!value || !value.trim()) return '실명을 입력해주세요.';
    const trimmed = value.trim();
    if (trimmed.length < 2) return '실명은 2자 이상 입력해주세요.';
    if (trimmed.length > 20) return '실명은 20자 이하로 입력해주세요.';
    if (/[0-9]/.test(trimmed)) return '실명에 숫자를 포함할 수 없습니다.';
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?`~]/.test(trimmed)) return '실명에 특수문자를 포함할 수 없습니다.';
    return null;
};

// ─── 브랜드명 / 업체명 검증 ───
// 2자 이상, 공백만 불가, 기본적인 이름 형식
export const validateBusinessName = (value) => {
    if (!value || !value.trim()) return '브랜드명(업체명)을 입력해주세요.';
    const trimmed = value.trim();
    if (trimmed.length < 2) return '브랜드명은 2자 이상 입력해주세요.';
    if (trimmed.length > 50) return '브랜드명은 50자 이하로 입력해주세요.';
    if (/^[0-9\s]+$/.test(trimmed)) return '브랜드명을 올바르게 입력해주세요.';
    return null;
};

// ─── 사업자등록번호 검증 ───
// 한국 사업자등록번호 형식: XXX-XX-XXXXX (10자리 숫자)
// 체크섬 검증 포함
export const validateBusinessNumber = (value) => {
    if (!value || !value.trim()) return '사업자등록번호를 입력해주세요.';

    // 숫자만 추출
    const digits = value.replace(/[^0-9]/g, '');

    if (digits.length !== 10) return '사업자등록번호는 10자리 숫자입니다. (예: 123-45-67890)';

    // 한국 사업자등록번호 체크섬 검증
    const checkKeys = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(digits[i]) * checkKeys[i];
    }
    sum += Math.floor((parseInt(digits[8]) * 5) / 10);
    const checkDigit = (10 - (sum % 10)) % 10;

    if (checkDigit !== parseInt(digits[9])) {
        return '유효하지 않은 사업자등록번호입니다. 다시 확인해주세요.';
    }

    return null;
};

// ─── 사업자등록번호 자동 포맷 (XXX-XX-XXXXX) ───
export const formatBusinessNumber = (value) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

// ─── 전화번호 검증 ───
// 한국 휴대폰: 010-XXXX-XXXX, 일반 전화: 02-XXX-XXXX 등
export const validatePhone = (value) => {
    if (!value || !value.trim()) return '전화번호를 입력해주세요.';

    const digits = value.replace(/[^0-9]/g, '');

    // 010 시작 휴대폰
    if (digits.startsWith('010')) {
        if (digits.length !== 11) return '휴대폰 번호는 11자리입니다. (예: 010-1234-5678)';
        return null;
    }

    // 02 서울 지역번호
    if (digits.startsWith('02')) {
        if (digits.length < 9 || digits.length > 10) return '전화번호 형식이 올바르지 않습니다.';
        return null;
    }

    // 기타 지역번호 (031, 032, etc.) 또는 011, 016, 017, 018, 019
    if (/^0[1-9]/.test(digits)) {
        if (digits.length < 10 || digits.length > 11) return '전화번호 형식이 올바르지 않습니다.';
        return null;
    }

    return '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)';
};

// ─── 전화번호 자동 포맷 ───
export const formatPhone = (value) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 11);

    if (digits.startsWith('02')) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

// ─── 이메일 검증 ───
export const validateEmail = (value) => {
    if (!value || !value.trim()) return '이메일을 입력해주세요.';
    const trimmed = value.trim();

    // 기본 형식 체크
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return '올바른 이메일 형식으로 입력해주세요. (예: example@email.com)';

    // 도메인 부분 추가 체크
    const domain = trimmed.split('@')[1];
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..'))
        return '이메일 도메인이 올바르지 않습니다.';

    return null;
};

// ─── 비밀번호 검증 ───
export const validatePassword = (value) => {
    if (!value) return '비밀번호를 입력해주세요.';
    if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    return null;
};

// ─── 전체 폼 유효성 검사 ───
export const validateSignupForm = (formData, userType = 'seller') => {
    const errors = {};

    const realNameErr = validateRealName(formData.realName);
    if (realNameErr) errors.realName = realNameErr;

    const nameErr = validateBusinessName(formData.name);
    if (nameErr) errors.name = nameErr;

    const bnErr = validateBusinessNumber(formData.businessNumber);
    if (bnErr) errors.businessNumber = bnErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) errors.password = passErr;

    return errors;
};
