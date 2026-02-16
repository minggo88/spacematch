import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Building2 } from 'lucide-react';

const SignupSelection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f1117] px-4 transition-colors">
            <div className="w-full max-w-4xl p-8 bg-white dark:bg-[#1a1b2e] rounded-2xl shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-[#2e3050] transition-colors">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">SpaceMatch</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">{t('selectSignupType')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Seller Option */}
                    <button
                        onClick={() => navigate('/signup/seller')}
                        className="flex flex-col items-center p-10 border-2 border-gray-200 dark:border-[#2e3050] rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group text-left"
                    >
                        <div className="p-6 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mb-6 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
                            <ShoppingBag className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('sellerTypeTitle')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                            {t('sellerTypeDesc')}
                        </p>
                    </button>

                    {/* Vendor Option */}
                    <button
                        onClick={() => navigate('/signup/vendor')}
                        className="flex flex-col items-center p-10 border-2 border-gray-200 dark:border-[#2e3050] rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group text-left"
                    >
                        <div className="p-6 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mb-6 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
                            <Building2 className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('vendorTypeTitle')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                            {t('vendorTypeDesc')}
                        </p>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
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
