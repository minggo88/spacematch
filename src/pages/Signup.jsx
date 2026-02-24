import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Building, Tag, Instagram, Phone, AlertCircle, Globe, Home } from 'lucide-react';
import TermsAgreement, { isRequiredAgreed } from '../components/TermsAgreement';
import KeywordSelector from '../components/KeywordSelector';
import {
    validateRealName, validateBusinessName, validateBusinessNumber,
    validatePhone, validateEmail, validatePassword, validateSignupForm,
    formatBusinessNumber, formatPhone
} from '../utils/validation';
import { getBusinessRegConfig } from '../utils/businessRegConfig';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, login } = useAuth();
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        realName: '',
        name: '',
        nameEn: '',
        businessNumber: '',
        phone: '',
        country: 'ko',
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
            case 'businessNumber': return validateBusinessNumber(value, formData.country);
            case 'phone': return validatePhone(value);
            case 'email': return validateEmail(value);
            case 'password': return validatePassword(value);
            default: return null;
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-format
        if (name === 'businessNumber') value = formatBusinessNumber(value, formData.country);
        if (name === 'phone') value = formatPhone(value);

        // 국가 변경 시 사업자번호 초기화 및 에러 클리어
        if (name === 'country') {
            setFormData(prev => ({ ...prev, country: value, businessNumber: '' }));
            setFieldErrors(prev => ({ ...prev, businessNumber: null }));
            setTouched(prev => ({ ...prev, businessNumber: false }));
            return;
        }

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
            setError(t('formValidationError'));
            return;
        }

        if (!isRequiredAgreed(agreements, 'seller')) {
            setError(t('termsRequired'));
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
        `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${touched[name] && fieldErrors[name]
            ? 'border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800 bg-red-50/30 dark:bg-red-900/20'
            : touched[name] && !fieldErrors[name] && formData[name]
                ? 'border-green-400 focus:ring-green-200 dark:border-green-500 dark:focus:ring-green-800'
                : 'border-gray-200 dark:border-gray-600 focus:ring-primary'
        }`;

    const hasFormErrors = Object.values(fieldErrors).some(e => e);
    const isValid = !hasFormErrors && isRequiredAgreed(agreements, 'seller');

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900 py-10 px-4">
            <div className="w-full max-w-lg p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('sellerSignupTitle')}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('realName')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="realName"
                                    required
                                    value={formData.realName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('realName')}
                                    placeholder={t('namePlaceholder')}
                                />
                            </div>
                            <FieldError name="realName" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('brandNameLabel')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('name')}
                                    placeholder={t('brandPlaceholder')}
                                />
                            </div>
                            <FieldError name="name" />
                        </div>
                    </div>

                    {/* 국가 선택 — 사업자번호 필드 위에 배치 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('country')} <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 appearance-none"
                            >
                                <option value="ko">🇰🇷 대한민국 (Korea)</option>
                                <option value="vi">🇻🇳 Việt Nam</option>
                                <option value="ja">🇯🇵 日本 (Japan)</option>
                                <option value="en">🇺🇸 United States</option>
                                <option value="en-GB">🇬🇧 United Kingdom</option>
                                <option value="en-CA">🇨🇦 Canada (English)</option>
                                <option value="fr-CA">🇨🇦 Canada (Français)</option>
                                <option value="th">🇹🇭 ประเทศไทย (Thailand)</option>
                                <option value="km">🇰🇭 កម្ពុជា (Cambodia)</option>
                                <option value="ru">🇷🇺 Россия (Russia)</option>
                                <option value="uk">🇺🇦 Україна (Ukraine)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {(() => {
                                const bizConfig = getBusinessRegConfig(formData.country);
                                return (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t(bizConfig.labelKey, t('businessNumber'))}{' '}
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">({t('optional')})</span>
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                name="businessNumber"
                                                value={formData.businessNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={inputClass('businessNumber')}
                                                placeholder={bizConfig.placeholder}
                                                maxLength={bizConfig.maxLength}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t(bizConfig.helpKey, '')}</p>
                                        <FieldError name="businessNumber" />
                                    </>
                                );
                            })()}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')} <span className="text-red-500">*</span></label>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')} <span className="text-red-500">*</span></label>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')} <span className="text-red-500">*</span></label>
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
                                placeholder={t('passwordPlaceholder')}
                            />
                        </div>
                        <FieldError name="password" />
                    </div>



                    {/* English Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('nameEn')} <span className="text-gray-400 dark:text-gray-500 text-xs">({t('optional')})</span></label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                            <input
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                                placeholder={t('nameEnPlaceholder')}
                            />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('nameEnHelp')}</p>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('categoryLabel')}</label>
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 appearance-none"
                            >
                                <option value="fashion">{t('categories.fashion')}</option>
                                <option value="beauty">{t('categories.beauty')}</option>
                                <option value="food">{t('categories.food')}</option>
                                <option value="living">{t('categories.living')}</option>
                                <option value="art">{t('categories.art')}</option>
                                <option value="stationery">{t('categories.stationery')}</option>
                                <option value="digital">{t('categories.digital')}</option>
                                <option value="activity">{t('categories.activity')}</option>
                                <option value="eco">{t('categories.eco')}</option>
                                <option value="pet">{t('categories.pet')}</option>
                                <option value="kids">{t('categories.kids')}</option>
                                <option value="handmade">{t('categories.handmade')}</option>
                                <option value="vintage">{t('categories.vintage')}</option>
                                <option value="perfume">{t('categories.perfume')}</option>
                                <option value="book">{t('categories.book')}</option>
                                <option value="other">{t('categories.other')}</option>
                            </select>
                        </div>

                        {/* Custom Category Input */}
                        {!['fashion', 'beauty', 'food', 'living', 'art', 'stationery', 'digital', 'activity', 'eco', 'pet', 'kids', 'handmade', 'vintage', 'perfume', 'book'].includes(formData.category) && (
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder={t('customCategoryPlaceholder')}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                                required
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('instagramAccount')}</label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                                placeholder="@brand_official"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('brandDescription')}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                            placeholder={t('brandDescPlaceholder')}
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
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {t('submitSignup')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            {t('goToLogin')}
                        </Link>
                    </p>
                    <Link
                        to="/"
                        className="mt-3 flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        <Home size={16} />
                        {t('goHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
