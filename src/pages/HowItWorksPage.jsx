import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import SmartText from '../components/SmartText';
import {
    ArrowRight, UserPlus, Search, Handshake, CheckCircle,
    Zap, ClipboardList, MessageSquare, Star, Shield, ChevronDown, HelpCircle
} from 'lucide-react';

const HowItWorksPage = () => {
    const { t } = useTranslation('landing');
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const [openFaq, setOpenFaq] = useState(null);
    const [faqVisible, setFaqVisible] = useState(false);
    const faqSectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setFaqVisible(true); },
            { threshold: 0.15 }
        );
        if (faqSectionRef.current) observer.observe(faqSectionRef.current);
        return () => observer.disconnect();
    }, []);

    const sellerSteps = [
        { step: '01', icon: <UserPlus size={22} />, titleKey: 'howItWorksPage.sellerStep1.title', descKey: 'howItWorksPage.sellerStep1.desc', detailsKey: 'howItWorksPage.sellerStep1.details' },
        { step: '02', icon: <Search size={22} />, titleKey: 'howItWorksPage.sellerStep2.title', descKey: 'howItWorksPage.sellerStep2.desc', detailsKey: 'howItWorksPage.sellerStep2.details' },
        { step: '03', icon: <Handshake size={22} />, titleKey: 'howItWorksPage.sellerStep3.title', descKey: 'howItWorksPage.sellerStep3.desc', detailsKey: 'howItWorksPage.sellerStep3.details' }
    ];

    const hostSteps = [
        { step: '01', icon: <ClipboardList size={22} />, titleKey: 'howItWorksPage.hostStep1.title', descKey: 'howItWorksPage.hostStep1.desc', detailsKey: 'howItWorksPage.hostStep1.details' },
        { step: '02', icon: <Search size={22} />, titleKey: 'howItWorksPage.hostStep2.title', descKey: 'howItWorksPage.hostStep2.desc', detailsKey: 'howItWorksPage.hostStep2.details' },
        { step: '03', icon: <Star size={22} />, titleKey: 'howItWorksPage.hostStep3.title', descKey: 'howItWorksPage.hostStep3.desc', detailsKey: 'howItWorksPage.hostStep3.details' }
    ];

    const StepCard = ({ item, accent = 'indigo' }) => {
        const title = t(item.titleKey);
        const desc = t(item.descKey);
        const details = t(item.detailsKey, { returnObjects: true });
        const accentMap = {
            indigo: { border: 'border-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50', check: 'text-indigo-500' },
            emerald: { border: 'border-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50', check: 'text-emerald-500' }
        };
        const c = accentMap[accent] || accentMap.indigo;

        return (
            <div className="relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg p-6 md:p-8 transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-full border-2 ${c.border} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-black ${c.text}`}>{item.step}</span>
                    </div>
                    <div>
                        <span className={`text-xs font-semibold ${c.text} uppercase tracking-wider`}>STEP {item.step}</span>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5"><SmartText mobileMax={20} pcMax={36}>{desc}</SmartText></p>
                <div className={`${c.bg} rounded-xl p-4`}>
                    <ul className="space-y-2.5">
                        {Array.isArray(details) && details.map((d, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <CheckCircle size={15} className={`${c.check} flex-shrink-0 mt-0.5`} />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    const faqItems = t('howItWorksPage.faq', { returnObjects: true });

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicNav />
            <main className="flex-1">

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(167,139,250,0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(99,102,241,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-violet-300 text-sm font-semibold tracking-widest uppercase mb-4">HOW IT WORKS</p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        {t('howItWorksPage.heroTitle1')}
                        <br />
                        <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                            {t('howItWorksPage.heroTitle2')}
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        <SmartText mobileMax={20} pcMax={40}>{t('howItWorksPage.heroDesc')}</SmartText>
                    </p>
                </div>
            </section>

            {/* Seller Process */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">
                            {t('howItWorksPage.sellerBadge')}
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{t('howItWorksPage.sellerTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {sellerSteps.map((step, i) => (
                            <StepCard key={i} item={step} accent="indigo" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="h-px bg-gray-100" />
            </div>

            {/* Vendor Process */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
                            {t('howItWorksPage.hostBadge')}
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{t('howItWorksPage.hostTitle')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {hostSteps.map((step, i) => (
                            <StepCard key={i} item={step} accent="emerald" />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section ref={faqSectionRef} className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6">
                    <div className={`text-center mb-12 transition-all duration-700 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{t('howItWorksPage.faqTitle')}</h2>
                        <p className="text-gray-400 mt-2">{t('howItWorksPage.faqSubtitle')}</p>
                    </div>

                    <div className="space-y-3">
                        {Array.isArray(faqItems) && faqItems.map((faq, i) => (
                            <div
                                key={i}
                                className={`group bg-white rounded-xl border transition-all duration-300 cursor-pointer ${openFaq === i
                                    ? 'border-indigo-200 shadow-md'
                                    : 'border-gray-100 hover:border-gray-200'
                                    } ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: faqVisible ? `${200 + i * 80}ms` : '0ms' }}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <div className="flex items-center gap-4 p-5 md:p-6">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-300 ${openFaq === i
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-50 group-hover:bg-indigo-50'
                                        }`}>
                                        <span>{faq.icon}</span>
                                    </div>
                                    <h3 className={`flex-1 font-semibold text-base transition-colors duration-300 ${openFaq === i ? 'text-indigo-700' : 'text-gray-900'
                                        }`}>
                                        {faq.q}
                                    </h3>
                                    <ChevronDown
                                        size={18}
                                        className={`flex-shrink-0 transition-all duration-300 ${openFaq === i
                                            ? 'rotate-180 text-indigo-500'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </div>
                                <div
                                    className="overflow-hidden transition-all duration-300 ease-in-out"
                                    style={{
                                        maxHeight: openFaq === i ? '200px' : '0px',
                                        opacity: openFaq === i ? 1 : 0
                                    }}
                                >
                                    <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem]">
                                        <div className="h-px bg-gray-100 mb-4" />
                                        <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{t('howItWorksPage.ctaTitle')}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8">{t('howItWorksPage.ctaDesc')}</p>
                    <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300">
                        {t('howItWorksPage.ctaSignup')}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            </main>
            <PublicFooter />
        </div>
    );
};

export default HowItWorksPage;
