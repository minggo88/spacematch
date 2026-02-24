import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Building2, TrendingUp, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';

const SignupSelection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f1117] px-4 transition-colors">
            <div className="w-full max-w-2xl p-8 bg-white dark:bg-[#1a1b2e] rounded-2xl shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-[#2e3050] transition-colors">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">SpaceMatch</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{t('selectSignupType')}</p>
                </div>

                {/* Seller — Main CTA (Full Width) */}
                <button
                    onClick={() => navigate('/signup/seller')}
                    className="w-full flex flex-col items-center p-10 border-2 border-indigo-200 dark:border-indigo-700/50 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/10 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 transition-all group mb-6"
                >
                    <div className="p-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-200/50">
                        <ShoppingBag className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{t('sellerTypeTitle')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-5">
                        {t('sellerTypeDesc')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-5">
                        {[
                            { icon: <TrendingUp size={13} />, text: '매출 대시보드' },
                            { icon: <Shield size={13} />, text: '세무 자동 알림' },
                            { icon: <Users size={13} />, text: '셀러 커뮤니티' },
                        ].map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg">
                                <CheckCircle size={12} className="flex-shrink-0" />
                                {item.text}
                            </span>
                        ))}
                    </div>
                    <span className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-base shadow-lg group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all">
                        매출 관리 시작하기
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>

                {/* Vendor & Host — Small text links at bottom */}
                <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700/50 space-y-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        행사를 주최하시나요?{' '}
                        <button
                            onClick={() => navigate('/signup/host')}
                            className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors"
                        >
                            호스트로 가입하기
                        </button>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        유통/납품 사업자이신가요?{' '}
                        <button
                            onClick={() => navigate('/signup/vendor')}
                            className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors"
                        >
                            벤더로 가입하기
                        </button>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                            {t('login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupSelection;
