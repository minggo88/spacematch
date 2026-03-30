import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import SmartText from '../components/SmartText';
import { getContactLink, isKorean } from '../utils/contactLinks';
import {
    MessageCircle, Mail, MapPin, Clock,
    ArrowRight, ExternalLink, Send
} from 'lucide-react';

const ContactPage = () => {
    const { t, i18n } = useTranslation('landing');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const contact = getContactLink(i18n.language);
    const isKo = isKorean(i18n.language);

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
                        {/* 국가별 문의 채널: 한국=카카오톡, 그 외=Discord */}
                        <a
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 ${isKo ? 'bg-violet-50' : 'bg-indigo-50'} rounded-xl flex items-center justify-center`}>
                                    <span className="text-2xl">{isKo ? '💬' : '🎮'}</span>
                                </div>
                                <ExternalLink size={18} className="text-gray-300 group-hover:text-violet-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {isKo ? t('contactPage.kakaoTitle') : t('contactPage.discordTitle', 'Discord')}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                <SmartText mobileMax={16} pcMax={24}>
                                    {isKo ? t('contactPage.kakaoDesc') : t('contactPage.discordDesc', 'Join our Discord community for quick support and real-time assistance.')}
                                </SmartText>
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-violet-600 font-semibold text-sm">
                                {isKo ? t('contactPage.kakaoAction') : t('contactPage.discordAction', 'Join Discord')} <ArrowRight size={14} />
                            </span>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:spacedotmatch@gmail.com?subject=[SpaceMatch] 문의사항"
                            className="group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <Mail size={24} className="text-indigo-600" />
                                </div>
                                <ExternalLink size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('contactPage.emailTitle', '이메일 문의')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                <SmartText mobileMax={16} pcMax={24}>{t('contactPage.emailDesc', '이메일로 문의사항을 보내주시면 빠르게 답변 드립니다.')}</SmartText>
                            </p>
                            <span className="text-lg font-bold text-indigo-600">spacedotmatch@gmail.com</span>
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
                                    <a href="mailto:spacedotmatch@gmail.com" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">spacedotmatch@gmail.com</a>
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
