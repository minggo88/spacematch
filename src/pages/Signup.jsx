import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, Tag, Instagram, Phone, AlertCircle } from 'lucide-react';
import TermsAgreement, { isRequiredAgreed } from '../components/TermsAgreement';
import KeywordSelector from '../components/KeywordSelector';
import {
    validateRealName, validateBusinessName, validateBusinessNumber,
    validatePhone, validateEmail, validatePassword, validateSignupForm,
    formatBusinessNumber, formatPhone
} from '../utils/validation';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        realName: '',
        name: '',
        businessNumber: '',
        phone: '',
        category: 'fashion',
        instagram: '',
        description: '',
        keywords: []
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
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

        // Real-time validation if field was already touched
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

        // Full validation
        const errors = validateSignupForm(formData, 'seller');
        setFieldErrors(errors);
        setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });

        if (Object.keys(errors).length > 0) {
            setError('입력 정보를 다시 확인해주세요.');
            return;
        }

        if (!isRequiredAgreed(agreements, 'seller')) {
            setError('필수 약관에 모두 동의해야 가입이 가능합니다.');
            return;
        }

        setError('');
        signup({ ...formData, marketing_agreed: agreements.marketing }).then(result => {
            if (result.success) {
                login(formData.email, formData.password).then(() => {
                    navigate('/seller');
                });
            } else {
                setError(result.message);
            }
        });
    };

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
    const isValid = !hasFormErrors && isRequiredAgreed(agreements, 'seller');

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary py-10 px-4">
            <div className="w-full max-w-lg p-6 md:p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 mt-2">셀러로 시작하기</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">브랜드명 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('name')}
                                    placeholder="브랜드명"
                                />
                            </div>
                            <FieldError name="name" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 <span className="text-red-500">*</span></label>
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
                                placeholder="contact@brand.com"
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

                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                    <div className="relative space-y-2">
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                name="category"
                                value={['fashion', 'beauty', 'food', 'living', 'art', 'stationery', 'digital', 'activity', 'eco', 'pet', 'kids', 'handmade', 'vintage', 'perfume', 'book'].includes(formData.category) ? formData.category : 'other'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'other') {
                                        setFormData({ ...formData, category: '' });
                                    } else {
                                        setFormData({ ...formData, category: val });
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white appearance-none"
                            >
                                <option value="fashion">패션/잡화</option>
                                <option value="beauty">뷰티</option>
                                <option value="food">푸드/음료</option>
                                <option value="living">리빙/라이프스타일</option>
                                <option value="art">아트/디자인</option>
                                <option value="stationery">문구/오피스</option>
                                <option value="digital">디지털/가전</option>
                                <option value="activity">스포츠/액티비티</option>
                                <option value="eco">친환경/제로웨이스트</option>
                                <option value="pet">반려동물</option>
                                <option value="kids">키즈/육아</option>
                                <option value="handmade">핸드메이드/수공예</option>
                                <option value="vintage">빈티지/중고</option>
                                <option value="perfume">향수/디퓨저</option>
                                <option value="book">도서/매거진</option>
                                <option value="other">기타 (직접 입력)</option>
                            </select>
                        </div>

                        {/* Custom Category Input */}
                        {!['fashion', 'beauty', 'food', 'living', 'art', 'stationery', 'digital', 'activity', 'eco', 'pet', 'kids', 'handmade', 'vintage', 'perfume', 'book'].includes(formData.category) && (
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="판매 품목을 직접 입력해주세요 (예: 수제 비누)"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                                required
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">인스타그램 계정</label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="@brand_official"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">브랜드 설명</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="브랜드에 대해 간단히 소개해 주세요."
                        ></textarea>
                    </div>

                    {/* 키워드 선택 */}
                    <KeywordSelector
                        type="seller"
                        value={formData.keywords}
                        onChange={(kws) => setFormData(prev => ({ ...prev, keywords: kws }))}
                    />

                    {/* 약관 동의 */}
                    <TermsAgreement
                        userType="seller"
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

export default Signup;
