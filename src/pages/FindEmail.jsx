import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Phone, Search, ArrowLeft, Mail } from 'lucide-react';

const FindEmail = () => {
    const { t } = useTranslation('auth');
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) {
            setError(t('findEmailAllRequired'));
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/auth/find_email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.email);
            } else {
                setError(data.message || t('findEmailNoResult'));
            }
        } catch (err) {
            setError(t('findEmailError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4">
            <div className="w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-primary" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('findEmailTitle')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{t('findEmailDesc')}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {result ? (
                    <div className="text-center">
                        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <Mail className="mx-auto text-green-600 dark:text-green-400 mb-3" size={32} />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('findEmailResult')}</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">{result}</p>
                        </div>
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors text-center"
                            >
                                {t('goToLogin')}
                            </Link>
                            <Link
                                to="/reset-password"
                                className="block w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-center"
                            >
                                {t('resetPasswordTitle')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            {loading ? '...' : t('findEmailBtn')}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                        <ArrowLeft size={14} />
                        {t('backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FindEmail;
