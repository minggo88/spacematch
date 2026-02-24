import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import SmartText from '../components/SmartText';
import {
    ArrowRight, Target, Eye, Heart, Shield, Lightbulb,
    ShoppingBag, Building, Users, TrendingUp, Globe, CheckCircle
} from 'lucide-react';

const AboutPage = () => {
    const { t } = useTranslation('landing');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const sellerFeatures = t('aboutPage.sellerFeatures', { returnObjects: true });
    const hostFeatures = t('aboutPage.hostFeatures', { returnObjects: true });

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4">ABOUT US</p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        {t('aboutPage.heroTitle1')}
                        <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                            {t('aboutPage.heroTitle2')}
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        <SmartText mobileMax={16} pcMax={24}>{t('aboutPage.heroDesc')}</SmartText>
                    </p>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Mission */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Mission</h3>
                            <p className="text-gray-400 leading-relaxed text-base">
                                <SmartText mobileMax={16} pcMax={24}>{t('aboutPage.missionDesc')}</SmartText>
                            </p>
                        </div>
                        {/* Vision */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-6">
                                <Eye size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Vision</h3>
                            <p className="text-gray-400 leading-relaxed text-base">
                                <SmartText mobileMax={16} pcMax={24}>{t('aboutPage.visionDesc')}</SmartText>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">VALUES</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">{t('aboutPage.valuesTitle')}</h2>
                        <p className="text-gray-400 text-base md:text-lg">{t('aboutPage.valuesSubtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {[
                            { icon: <Shield size={22} />, titleKey: 'aboutPage.trust.title', descKey: 'aboutPage.trust.desc', accent: 'text-blue-600', iconBg: 'bg-blue-50' },
                            { icon: <Lightbulb size={22} />, titleKey: 'aboutPage.innovation.title', descKey: 'aboutPage.innovation.desc', accent: 'text-amber-600', iconBg: 'bg-amber-50' },
                            { icon: <Heart size={22} />, titleKey: 'aboutPage.winwin.title', descKey: 'aboutPage.winwin.desc', accent: 'text-rose-600', iconBg: 'bg-rose-50' }
                        ].map((value, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-center">
                                <div className={`w-12 h-12 mx-auto rounded-xl ${value.iconBg} flex items-center justify-center ${value.accent} mb-5`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{t(value.titleKey)}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed"><SmartText mobileMax={16} pcMax={22}>{t(value.descKey)}</SmartText></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">FOR YOU</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">{t('aboutPage.whoTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Seller */}
                        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                            <div className="p-7 md:p-8 pl-8 md:pl-9">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <ShoppingBag size={22} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{t('aboutPage.sellerTitle')}</h3>
                                        <p className="text-sm text-gray-400">{t('aboutPage.sellerSubtitle')}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-5 leading-relaxed text-sm">{t('aboutPage.sellerDesc')}</p>
                                <ul className="space-y-2.5">
                                    {Array.isArray(sellerFeatures) && sellerFeatures.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={15} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Vendor */}
                        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
                            <div className="p-7 md:p-8 pl-8 md:pl-9">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <Building size={22} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{t('aboutPage.hostTitle')}</h3>
                                        <p className="text-sm text-gray-400">{t('aboutPage.hostSubtitle')}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-5 leading-relaxed text-sm">{t('aboutPage.hostDesc')}</p>
                                <ul className="space-y-2.5">
                                    {Array.isArray(hostFeatures) && hostFeatures.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('aboutPage.ctaTitle')}
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8">
                        <SmartText mobileMax={16} pcMax={24}>{t('aboutPage.ctaDesc')}</SmartText>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            {t('aboutPage.ctaSignup')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center">
                            {t('aboutPage.ctaServices')}
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default AboutPage;
