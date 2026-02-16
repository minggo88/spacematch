import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import SmartText from '../components/SmartText';
import {
    MessageCircle, Phone, Mail, MapPin, Clock,
    ArrowRight, ExternalLink, Send
} from 'lucide-react';

const ContactPage = () => {
    const { t } = useTranslation('landing');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(167,139,250,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4">CONTACT</p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        {t('contactPage.heroTitle1')}
                        <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                            {t('contactPage.heroTitle2')}</span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        <SmartText mobileMax={16} pcMax={24}>{t('contactPage.heroDesc')}</SmartText>
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-12 md:mb-16">
                        {/* KakaoTalk */}
                        <a
                            href="http://pf.kakao.com/_xjGxoRX/chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <ExternalLink size={18} className="text-gray-300 group-hover:text-yellow-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('contactPage.kakaoTitle')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                <SmartText mobileMax={16} pcMax={24}>{t('contactPage.kakaoDesc')}</SmartText>
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-yellow-600 font-semibold text-sm">
                                {t('contactPage.kakaoAction')} <ArrowRight size={14} />
                            </span>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:050407775410"
                            className="group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <Phone size={24} className="text-indigo-600" />
                                </div>
                                <ExternalLink size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('contactPage.phoneTitle')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                <SmartText mobileMax={16} pcMax={24}>{t('contactPage.phoneDesc')}</SmartText>
                            </p>
                            <span className="text-2xl font-bold text-indigo-600">0504-0777-5410</span>
                        </a>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 rounded-2xl p-7 md:p-10 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">{t('contactPage.otherInfo')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                                    <MapPin size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('contactPage.address')}</p>
                                    <p className="text-sm text-gray-700">{t('contactPage.addressValue')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                                    <Clock size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('contactPage.hours')}</p>
                                    <p className="text-sm text-gray-700">{t('contactPage.hoursValue')}</p>
                                    <p className="text-xs text-gray-400">{t('contactPage.hoursNote')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                                    <Send size={18} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('contactPage.quickResponse')}</p>
                                    <p className="text-sm text-gray-700">{t('contactPage.quickResponseValue')}</p>
                                    <p className="text-xs text-gray-400">{t('contactPage.quickResponseNote')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{t('contactPage.ctaTitle')}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8">
                        <SmartText mobileMax={16} pcMax={24}>{t('contactPage.ctaDesc')}</SmartText>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            {t('contactPage.ctaSignup')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center">
                            {t('contactPage.ctaLogin')}
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default ContactPage;
