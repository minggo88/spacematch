import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, Phone, AlertCircle } from 'lucide-react';
import TermsAgreement, { isRequiredAgreed } from '../components/TermsAgreement';
import KeywordSelector from '../components/KeywordSelector';
import {
    validateRealName, validateBusinessName, validateBusinessNumber,
    validatePhone, validateEmail, validatePassword, validateSignupForm,
    formatBusinessNumber, formatPhone
} from '../utils/validation';

const SignupVendor = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        realName: '',
        name: '',
        businessNumber: '',
        phone: '',
        role: 'vendor',
        keywords: []
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [pendingApproval, setPendingApproval] = useState(false);
    const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

    // Validate single field
    const validateField = (name, value) => {
        switch (name) {
            case 'realName': return validateRealName(value);
            case 'name': return validateBusinessName(value);
            case 'businessNumber': return validateBusinessNumber(value);
            case 'phone': return validatePhone(value);
            case 'email': return validateEmail(value);
            case 'password': return validatePassword(value);
            default: return null;
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-format
        if (name === 'businessNumber') value = formatBusinessNumber(value);
        if (name === 'phone') value = formatPhone(value);

        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const err = validateField(name, value);
            setFieldErrors(prev => ({ ...prev, [name]: err }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const err = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateSignupForm(formData, 'vendor');
        setFieldErrors(errors);
        setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });

        if (Object.keys(errors).length > 0) {
            setError('입력 정보를 다시 확인해주세요.');
            return;
        }

        if (!isRequiredAgreed(agreements, 'vendor')) {
            setError('필수 약관에 모두 동의해야 가입이 가능합니다.');
            return;
        }

        setError('');
        signup({ ...formData, marketing_agreed: agreements.marketing }).then(result => {
            if (result.success) {
                setPendingApproval(true);
            } else {
                setError(result.message);
            }
        });
    };

    // Show approval pending screen after successful signup
    if (pendingApproval) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-secondary py-10 px-4">
                <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building className="text-amber-600" size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">가입 완료!</h2>
                    <p className="text-gray-600 mb-2">
                        벤더 회원가입이 성공적으로 완료되었습니다.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-amber-800 font-semibold text-sm">
                            ⏳ 관리자 승인 대기 중
                        </p>
                        <p className="text-amber-700 text-sm mt-1">
                            관리자의 승인이 완료되면 로그인할 수 있습니다.<br />
                            승인 완료 시 알림이 전송됩니다.
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md"
                    >
                        로그인 페이지로 이동
                    </Link>
                </div>
            </div>
        );
    }

    // Field error message component
    const FieldError = ({ name }) => {
        if (!touched[name] || !fieldErrors[name]) return null;
        return (
            <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle size={12} />
                {fieldErrors[name]}
            </p>
        );
    };

    const inputClass = (name) =>
        `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${touched[name] && fieldErrors[name]
            ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
            : touched[name] && !fieldErrors[name] && formData[name]
                ? 'border-green-400 focus:ring-green-200'
                : 'border-gray-200 focus:ring-primary'
        }`;

    const hasFormErrors = Object.values(fieldErrors).some(e => e);
    const isValid = !hasFormErrors && isRequiredAgreed(agreements, 'vendor');

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary py-10 px-4">
            <div className="w-full max-w-lg p-6 md:p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 mt-2">벤더(공간 호스트)로 시작하기</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="mb-5 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-700 text-xs font-medium">
                        ℹ️ 벤더 가입 후 관리자 승인이 필요합니다. 승인이 완료되면 로그인할 수 있습니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">실명 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="realName"
                                    required
                                    value={formData.realName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('realName')}
                                    placeholder="홍길동"
                                />
                            </div>
                            <FieldError name="realName" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">업체명 (호스트명) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('name')}
                                    placeholder="업체명 또는 호스트명"
                                />
                            </div>
                            <FieldError name="name" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="businessNumber"
                                    required
                                    value={formData.businessNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('businessNumber')}
                                    placeholder="000-00-00000"
                                    maxLength={12}
                                />
                            </div>
                            <FieldError name="businessNumber" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('phone')}
                                    placeholder="010-0000-0000"
                                    maxLength={13}
                                />
                            </div>
                            <FieldError name="phone" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={inputClass('email')}
                                placeholder="host@example.com"
                            />
                        </div>
                        <FieldError name="email" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={inputClass('password')}
                                placeholder="8자 이상 입력"
                            />
                        </div>
                        <FieldError name="password" />
                    </div>

                    {/* 키워드 선택 */}
                    <KeywordSelector
                        type="vendor"
                        value={formData.keywords}
                        onChange={(kws) => setFormData(prev => ({ ...prev, keywords: kws }))}
                    />

                    {/* 약관 동의 */}
                    <TermsAgreement
                        userType="vendor"
                        agreements={agreements}
                        onAgreementsChange={setAgreements}
                    />

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors shadow-md ${isValid
                            ? 'bg-primary text-white hover:bg-indigo-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        가입하기
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupVendor;
