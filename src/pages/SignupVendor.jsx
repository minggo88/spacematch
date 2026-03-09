import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Building, Phone, AlertCircle, Globe, Home, Package, CheckCircle2, Loader2 } from 'lucide-react';
import TermsAgreement, { isRequiredAgreed } from '../components/TermsAgreement';
import KeywordSelector from '../components/KeywordSelector';
import {
    validateRealName, validateBusinessName, validateBusinessNumber,
    validatePhone, validateEmail, validatePassword, validateSignupForm,
    formatBusinessNumber, formatPhone
} from '../utils/validation';

const SignupVendor = () => {
    const navigate = useNavigate();
    const { signup, sendVerification, verifyEmail } = useAuth();
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
        role: 'vendor',
        keywords: [],
        description: ''
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [pendingApproval, setPendingApproval] = useState(false);
    const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

    // Email verification state
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [expiresIn, setExpiresIn] = useState(0);

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

    // Email verification handlers
    const handleSendVerification = async () => {
        const emailErr = validateEmail(formData.email);
        if (emailErr) { setFieldErrors(prev => ({ ...prev, email: emailErr })); setTouched(prev => ({ ...prev, email: true })); return; }
        setVerificationLoading(true); setVerificationError('');
        const result = await sendVerification(formData.email, formData.country);
        setVerificationLoading(false);
        if (result.success) { setVerificationSent(true); setCooldown(60); setExpiresIn(result.expires_in || 600); }
        else { setVerificationError(result.message); if (result.cooldown) setCooldown(result.cooldown); }
    };
    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) return;
        setVerificationLoading(true); setVerificationError('');
        const result = await verifyEmail(formData.email, verificationCode);
        setVerificationLoading(false);
        if (result.success && result.verified) setEmailVerified(true);
        else setVerificationError(result.message);
    };
    React.useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);
    React.useEffect(() => { if (expiresIn <= 0 || emailVerified) return; const t = setTimeout(() => setExpiresIn(e => e - 1), 1000); return () => clearTimeout(t); }, [expiresIn, emailVerified]);
    React.useEffect(() => { setEmailVerified(false); setVerificationSent(false); setVerificationCode(''); setVerificationError(''); }, [formData.email]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateSignupForm(formData, 'vendor');
        setFieldErrors(errors);
        setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });

        if (Object.keys(errors).length > 0) {
            setError(t('formValidationError'));
            return;
        }

        if (!isRequiredAgreed(agreements, 'vendor')) {
            setError(t('termsRequired'));
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
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="text-teal-600" size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('signupDone')}</h2>
                    <p className="text-gray-600 mb-2">
                        {t('vendorSignupDone', '벤더 회원가입이 완료되었습니다.')}
                    </p>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                        <p className="text-teal-800 font-semibold text-sm">
                            ⏳ {t('pendingApproval')}
                        </p>
                        <p className="text-teal-700 text-sm mt-1">
                            {t('approvalMessage')}<br />
                            {t('approvalNotify')}
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md"
                    >
                        {t('goToLoginPage')}
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
        `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${touched[name] && fieldErrors[name]
            ? 'border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800 bg-red-50/30 dark:bg-red-900/20'
            : touched[name] && !fieldErrors[name] && formData[name]
                ? 'border-green-400 focus:ring-green-200 dark:border-green-500 dark:focus:ring-green-800'
                : 'border-gray-200 dark:border-gray-600 focus:ring-primary'
        }`;

    const hasFormErrors = Object.values(fieldErrors).some(e => e);
    const isValid = !hasFormErrors && isRequiredAgreed(agreements, 'vendor') && emailVerified;

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900 py-10 px-4">
            <div className="w-full max-w-lg p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('vendorSubtitle', '벤더(유통/납품) 회원가입')}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="mb-5 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3">
                    <p className="text-teal-700 dark:text-teal-300 text-xs font-medium">
                        ℹ️ {t('vendorApprovalNotice', '벤더 계정은 관리자 승인 후 이용할 수 있습니다. 승인 완료 시 이메일로 안내드립니다.')}
                    </p>
                </div>

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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vendorCompanyName', '회사명(상호)')} <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={inputClass('name')}
                                    placeholder={t('vendorCompanyPlaceholder', '유통 회사명을 입력하세요')}
                                />
                            </div>
                            <FieldError name="name" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('businessNumber')} <span className="text-red-500">*</span></label>
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
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} onBlur={handleBlur} disabled={emailVerified}
                                    className={`${inputClass('email')} ${emailVerified ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' : ''}`} placeholder="vendor@example.com" />
                                {emailVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />}
                            </div>
                            {!emailVerified && (
                                <button type="button" onClick={handleSendVerification} disabled={verificationLoading || cooldown > 0 || !formData.email}
                                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex items-center gap-1.5">
                                    {verificationLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {cooldown > 0 ? `${cooldown}s` : (verificationSent ? t('resendCode', '재발송') : t('sendVerification', '인증'))}
                                </button>
                            )}
                        </div>
                        <FieldError name="email" />
                        {emailVerified && <p className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400"><CheckCircle2 size={12} />{t('emailVerified', '이메일 인증 완료')}</p>}
                    </div>
                    {verificationSent && !emailVerified && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 space-y-3">
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">📧 {t('verificationSentMsg', '인증 코드가 이메일로 발송되었습니다.')}
                                {expiresIn > 0 && <span className="text-xs ml-2 text-indigo-400">({Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, '0')})</span>}
                            </p>
                            <div className="flex gap-2">
                                <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="flex-1 px-4 py-3 border border-indigo-200 dark:border-indigo-600 rounded-lg text-center text-lg font-mono tracking-[0.3em] bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="000000" maxLength={6} />
                                <button type="button" onClick={handleVerifyCode} disabled={verificationCode.length !== 6 || verificationLoading}
                                    className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5">
                                    {verificationLoading ? <Loader2 size={16} className="animate-spin" /> : null}{t('verify', '확인')}
                                </button>
                            </div>
                            {verificationError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{verificationError}</p>}
                        </div>
                    )}

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

                    {/* Country Selection */}
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

                    {/* English Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('nameEn')} <span className="text-gray-400 dark:text-gray-500 text-xs">({t('optional')})</span></label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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

                    {/* Company Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vendorDescription', '회사 소개')} <span className="text-gray-400 dark:text-gray-500 text-xs">({t('optional')})</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                            placeholder={t('vendorDescriptionPlaceholder', '주요 취급 품목, 물류 역량, 유통 경험 등을 간략히 소개해 주세요')}
                        />
                    </div>

                    {/* 키워드 선택 */}
                    <KeywordSelector
                        type="seller"
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

export default SignupVendor;
