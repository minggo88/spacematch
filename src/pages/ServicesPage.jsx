import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import SmartText from '../components/SmartText';
import {
    MapPin, ShoppingBag, TrendingUp, Users, ArrowRight,
    CheckCircle, BarChart3, Globe, Layers, Zap, Target, HeartHandshake
} from 'lucide-react';

const ServicesPage = () => {
    const { t } = useTranslation('landing');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const services = [
        {
            icon: <MapPin size={28} />,
            titleKey: 'servicesPage.service1.title',
            subtitleKey: 'servicesPage.service1.subtitle',
            accent: 'text-indigo-600',
            iconBg: 'bg-indigo-50',
            descKey: 'servicesPage.service1.desc',
            featuresKey: 'servicesPage.service1.features',
        },
        {
            icon: <ShoppingBag size={28} />,
            titleKey: 'servicesPage.service2.title',
            subtitleKey: 'servicesPage.service2.subtitle',
            accent: 'text-violet-600',
            iconBg: 'bg-violet-50',
            descKey: 'servicesPage.service2.desc',
            featuresKey: 'servicesPage.service2.features',
        },
        {
            icon: <TrendingUp size={28} />,
            titleKey: 'servicesPage.service3.title',
            subtitleKey: 'servicesPage.service3.subtitle',
            accent: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
            descKey: 'servicesPage.service3.desc',
            featuresKey: 'servicesPage.service3.features',
        },
        {
            icon: <Users size={28} />,
            titleKey: 'servicesPage.service4.title',
            subtitleKey: 'servicesPage.service4.subtitle',
            accent: 'text-amber-600',
            iconBg: 'bg-amber-50',
            descKey: 'servicesPage.service4.desc',
            featuresKey: 'servicesPage.service4.features',
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicNav />
            <main className="flex-1">

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120,119,198,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4">SERVICES</p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        {t('servicesPage.heroTitle1')}
                        <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                            {t('servicesPage.heroTitle2')}
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        <SmartText mobileMax={16} pcMax={24}>{t('servicesPage.heroDesc')}</SmartText>
                    </p>
                </div>
            </section>

            {/* Services Detail */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
                    {services.map((service, i) => {
                        const title = t(service.titleKey);
                        const subtitle = t(service.subtitleKey);
                        const desc = t(service.descKey);
                        const features = t(service.featuresKey, { returnObjects: true });

                        return (
                            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}>
                                {/* Content */}
                                <div className="flex-1 w-full">
                                    <div className={`inline-flex w-14 h-14 rounded-xl ${service.iconBg} items-center justify-center ${service.accent} mb-6`}>
                                        {service.icon}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{subtitle}</p>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                                    <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6"><SmartText mobileMax={16} pcMax={24}>{desc}</SmartText></p>
                                    <ul className="space-y-3">
                                        {Array.isArray(features) && features.map((f, j) => (
                                            <li key={j} className="flex items-start gap-3 text-sm md:text-base text-gray-600">
                                                <CheckCircle size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Visual Card — refined monochrome */}
                                <div className="flex-1 w-full">
                                    <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 min-h-[240px] md:min-h-[320px] flex items-center justify-center">
                                        <div className="text-center">
                                            <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 ${service.iconBg} rounded-2xl flex items-center justify-center`}>
                                                {React.cloneElement(service.icon, { size: 40, className: service.accent })}
                                            </div>
                                            <p className="text-lg md:text-xl font-bold text-gray-900">{title}</p>
                                            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{t('servicesPage.ctaTitle')}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8">
                        <SmartText mobileMax={16} pcMax={24}>{t('servicesPage.ctaDesc')}</SmartText>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            {t('servicesPage.ctaSignup')}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center">
                            {t('servicesPage.ctaHowItWorks')}
                        </Link>
                    </div>
                </div>
            </section>

            </main>
            <PublicFooter />
        </div>
    );
};

export default ServicesPage;
