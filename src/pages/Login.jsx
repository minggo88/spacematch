import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Home } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');
    const [searchParams] = useSearchParams();

    // URL 파라미터에서 redirect_uri와 email 읽기
    const redirectUri = searchParams.get('redirect_uri');
    const prefillEmail = searchParams.get('email');

    useEffect(() => {
        if (prefillEmail) {
            setEmail(prefillEmail);
        }
    }, [prefillEmail]);

    /**
     * 안전한 리다이렉트 URL인지 검증
     * - 같은 도메인이거나 spacematch.net 서브도메인만 허용
     */
    const isSafeRedirect = (url) => {
        try {
            const parsed = new URL(url);
            const currentHost = window.location.hostname;
            return parsed.hostname === currentHost
                || parsed.hostname === 'spacematch.net'
                || parsed.hostname.endsWith('.spacematch.net');
        } catch {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password).then(result => {
            if (result.success) {
                // redirect_uri가 있고 안전한 URL이면 해당 페이지로 이동
                if (redirectUri && isSafeRedirect(redirectUri)) {
                    window.location.href = redirectUri;
                    return;
                }

                // 기본 역할 기반 라우팅
                const role = result.user?.role;
                if (role === 'superadmin' || role === 'admin') {
                    navigate('/admin');
                } else if (role === 'host') {
                    navigate('/host');
                } else if (role === 'vendor') {
                    navigate('/vendor');
                } else {
                    navigate('/seller');
                }
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4">
            <div className="w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">SpaceMatch</h1>
                    <p className="text-gray-500 mt-2">{t('loginSubtitle')}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg"
                    >
                        {t('login')}
                    </button>
                </form>

                <div className="mt-4 flex justify-center gap-4 text-sm">
                    <Link to="/find-email" className="text-gray-500 hover:text-primary transition-colors">
                        {t('findEmailTitle')}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/reset-password" className="text-gray-500 hover:text-primary transition-colors">
                        {t('resetPasswordTitle')}
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        {t('noAccount')}{' '}
                        <Link
                            to={`/signup${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}${prefillEmail ? `&email=${encodeURIComponent(prefillEmail)}` : ''}` : ''}`}
                            className="text-primary hover:underline font-medium"
                        >
                            {t('signup')}
                        </Link>
                    </p>
                    <a
                        href="mailto:spacedotmatch@gmail.com?subject=[SpaceMatch] 문의사항"
                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-center bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium transition-colors border border-indigo-100"
                    >
                        <Mail size={16} />
                        {t('inquiry')}
                    </a>
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

export default Login;
