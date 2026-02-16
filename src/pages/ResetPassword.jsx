import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, User, Phone, Lock, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: verify, 2: new password, 3: done
    const [formData, setFormData] = useState({ email: '', name: '', phone: '' });
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    // Step 1: Verify identity
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!formData.email.trim() || !formData.name.trim() || !formData.phone.trim()) {
            setError(t('resetAllRequired'));
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify', ...formData }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success && data.verified) {
                setStep(2);
            } else {
                setError(data.message || t('resetVerifyFailed'));
            }
        } catch (err) {
            setError(t('resetError'));
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset password
    const handleReset = async (e) => {
        e.preventDefault();
        if (passwords.newPassword.length < 8) {
            setError(t('resetPasswordMinLength'));
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reset',
                    ...formData,
                    newPassword: passwords.newPassword
                }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setStep(3);
            } else {
                setError(data.message || t('resetFailed'));
            }
        } catch (err) {
            setError(t('resetError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4">
            <div className="w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]">

                {/* Step 3: Success */}
                {step === 3 ? (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('resetSuccess')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{t('resetSuccessDesc')}</p>
                        <Link
                            to="/login"
                            className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors text-center"
                        >
                            {t('goToLogin')}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="text-amber-600 dark:text-amber-400" size={28} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('resetPasswordTitle')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                {step === 1 ? t('resetStep1Desc') : t('resetStep2Desc')}
                            </p>
                            {/* Step indicator */}
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <div className={`w-8 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                <div className={`w-8 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Verify Identity */}
                        {step === 1 && (
                            <form onSubmit={handleVerify} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white"
                                            placeholder={t('namePlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white"
                                            placeholder="010-0000-0000"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '...' : t('verifyIdentity')}
                                </button>
                            </form>
                        )}

                        {/* Step 2: New Password */}
                        {step === 2 && (
                            <form onSubmit={handleReset} className="space-y-5">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400 mb-2">
                                    ✅ {t('identityVerified')}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('newPassword')}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white"
                                            placeholder={t('passwordPlaceholder')}
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('confirmPassword')}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white"
                                            placeholder={t('passwordPlaceholder')}
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                    {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">{t('passwordMismatch')}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '...' : t('changePassword')}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                                <ArrowLeft size={14} />
                                {t('backToLogin')}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
