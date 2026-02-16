import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import AdSlot from '../components/AdSlot';
import SmartText from '../components/SmartText';
import Toast from '../components/Toast';
import {
    ArrowRight, Store, ShoppingBag, Users, Sparkles, ChevronDown,
    MapPin, TrendingUp, Shield, Zap, CheckCircle, Star, Building,
    MessageCircle, Flame, Clock, Eye, Heart, Share2
} from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation('landing');
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [hotPromos, setHotPromos] = useState([]);
    const [promosLoading, setPromosLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const dashboardPath = user
        ? user.role === 'superadmin' || user.role === 'admin'
            ? '/admin'
            : user.role === 'vendor'
                ? '/vendor'
                : '/seller'
        : null;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
        );
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Fetch hot promotions from API
    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const res = await fetch('/api/promotions/get_promotions.php');
                const json = await res.json();
                if (json.success) {
                    const combined = [...(json.hot_top || []), ...(json.hot_mid || [])].slice(0, 6);
                    setHotPromos(combined);
                }
            } catch (e) { console.error('Promo load failed:', e); }
            finally { setPromosLoading(false); }
        };
        fetchPromos();
    }, []);

    const getDday = (deadline) => {
        if (!deadline) return null;
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: t('hotClosed'), color: 'bg-gray-500' };
        if (diff === 0) return { text: 'D-DAY', color: 'bg-red-500' };
        if (diff <= 3) return { text: `D-${diff}`, color: 'bg-red-500' };
        if (diff <= 7) return { text: `D-${diff}`, color: 'bg-orange-500' };
        return { text: `D-${diff}`, color: 'bg-blue-500' };
    };

    const getImageSrc = (images) => {
        if (!images || images.length === 0) return null;
        const img = images[0];
        if (typeof img === 'string') {
            return img.startsWith('/') ? img : `/${img}`;
        }
        return null;
    };

    const getVenueTypeLabel = (type) => {
        const map = { popup: t('hotVenueType.popup'), gallery: t('hotVenueType.gallery'), cafe: t('hotVenueType.cafe'), showroom: t('hotVenueType.showroom'), fleamarket: t('hotVenueType.fleamarket') };
        return map[type] || type || t('hotVenueType.other');
    };

    const isVisible = (id) => visibleSections.has(id);

    /* ── Counter animation hook ── */
    const useCountUp = (target, duration = 2000, start = false) => {
        const [count, setCount] = useState(0);
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        useEffect(() => {
            if (!start || !numericTarget) return;
            let startTime;
            const animate = (ts) => {
                if (!startTime) startTime = ts;
                const progress = Math.min((ts - startTime) / duration, 1);
                setCount(Math.floor(progress * numericTarget));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, [start, numericTarget, duration]);
        const suffix = target.replace(/[0-9,]/g, '');
        const formatted = count.toLocaleString();
        return `${formatted}${suffix}`;
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <PublicNav transparent />

            {/* ━━━━━━ Hero Section ━━━━━━ */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
                    <div className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)'
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 right-1/3 w-48 md:w-64 h-48 md:h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}
                />

                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center pt-20 md:pt-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 md:mb-8 animate-fadeIn">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs md:text-sm font-medium">{t('heroBadge')}</span>
                    </div>

                    <h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.3] sm:leading-tight mb-4 md:mb-6 tracking-tight px-2 sm:px-0">
                        {t('heroHeading1')}
                        <br />
                        <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
                            {t('heroHeading2')}</span>{t('heroHeading3')}
                    </h1>

                    <p className="text-[0.95rem] sm:text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-medium px-6 sm:px-4">
                        <SmartText mobileMax={16} pcMax={24}>{t('heroDesc')}</SmartText>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4">
                        <Link
                            to={dashboardPath || "/signup"}
                            className="group w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white text-indigo-700 rounded-2xl font-extrabold text-base md:text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <p className="text-gray-400 text-sm mt-1">{t('heroBestSpaces')}</p>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/services"
                            className="w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {t('heroLearnMore')}
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/40 text-xs md:text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Shield size={14} />
                            <span>{t('heroSafeMatch')}</span>
                        </div>
                        <div className="w-px h-3 md:h-4 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <Zap size={14} />
                            <span>{t('heroFastEntry')}</span>
                        </div>
                        <div className="w-px h-3 md:h-4 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} />
                            <span>{t('heroVerifiedSpaces')}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-white/30 text-xs font-medium hidden md:block">SCROLL</span>
                    <ChevronDown size={20} className="text-white/30" />
                </div>
            </section>

            {/* ━━━━━━ Hot Recruitment Preview ━━━━━━ */}
            {!promosLoading && hotPromos.length > 0 && (
                <section id="hot-promos" className="py-6 md:py-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="text-center mb-8 md:mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-full text-sm font-bold mb-4">
                                <Flame size={14} />
                                {t('hotRecruitment')}
                            </div>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                                {t('hotTitle1')} <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t('hotTitle2')}</span>
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
                                {t('hotDesc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                            {hotPromos.map((venue, i) => {
                                const imgSrc = getImageSrc(venue.images);
                                const dday = getDday(venue.recruitment_deadline);
                                const typeLabel = getVenueTypeLabel(venue.type);
                                return (
                                    <div key={venue.promotion_id || i}
                                        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                        onClick={() => window.location.href = '/recruitment'}
                                    >
                                        <div className="relative h-40 md:h-48 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Store size={40} className="text-orange-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                                    <Flame size={12} /> HOT
                                                </span>
                                            </div>
                                            {dday && (
                                                <div className="absolute top-3 right-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${dday.color} text-white text-xs font-bold rounded-lg shadow-lg`}>
                                                        <Clock size={11} /> {dday.text}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 md:p-5 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Building size={12} className="flex-shrink-0" />
                                                <span className="truncate font-medium">{venue.owner_name || t('hotSpaceProvider')}</span>
                                            </div>
                                            {venue.type && (
                                                <span className="inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
                                                    <Store size={11} />{typeLabel}
                                                </span>
                                            )}
                                            <h3 className="font-extrabold text-gray-900 text-base md:text-lg truncate group-hover:text-orange-600 transition-colors">{venue.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <MapPin size={13} className="flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{venue.location || t('hotLocationTBD')}</span>
                                            </div>
                                            {venue.recruitment_deadline && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Clock size={12} className="flex-shrink-0 text-gray-400" />
                                                    <span>{t('hotDeadline', { date: venue.recruitment_deadline })}</span>
                                                    {dday && <span className={`ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`}>{dday.text}</span>}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                                                <Link
                                                    to={user ? (user.role === 'seller' ? '/seller' : user.role === 'vendor' ? '/vendor' : '/admin') : '/login'}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors"
                                                >
                                                    {t('hotApply')}
                                                </Link>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors"
                                                    title={t('hotLike')}
                                                >
                                                    <Heart size={14} />
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try { await navigator.clipboard.writeText(`${window.location.origin}/recruitment`); showToast(t('hotCopied')); } catch (e) { console.error(e); }
                                                    }}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors"
                                                    title={t('hotShare')}
                                                >
                                                    <Share2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center">
                            <Link to="/recruitment" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-300">
                                <Eye size={16} />
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{t('hotUsageGuide')}</h2>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ━━━━━━ Services Preview — Bento Grid ━━━━━━ */}
            <section id="services-preview" data-animate className="py-16 md:py-24 bg-gray-50">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('services-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">
                            {t('servicesSection.badge')}
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            {t('servicesSection.heading1')}
                            <br className="block sm:hidden" />
                            {' '}{t('servicesSection.heading2')}
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto">
                            {t('servicesSection.desc')}
                        </p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
                        {[
                            {
                                icon: <MapPin size={24} />,
                                title: t('servicesSection.spaceSearch'),
                                desc: t('servicesSection.spaceSearchDesc'),
                                accent: 'text-indigo-600',
                                iconBg: 'bg-indigo-50',
                                span: 'lg:col-span-2', // Hero card — wider
                                featured: true
                            },
                            {
                                icon: <ShoppingBag size={24} />,
                                title: t('servicesSection.applicationMgmt'),
                                desc: t('servicesSection.applicationMgmtDesc'),
                                accent: 'text-violet-600',
                                iconBg: 'bg-violet-50',
                                span: ''
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: t('servicesSection.statsAnalytics'),
                                desc: t('servicesSection.statsAnalyticsDesc'),
                                accent: 'text-emerald-600',
                                iconBg: 'bg-emerald-50',
                                span: ''
                            },
                            {
                                icon: <Users size={24} />,
                                title: t('servicesSection.community'),
                                desc: t('servicesSection.communityDesc'),
                                accent: 'text-amber-600',
                                iconBg: 'bg-amber-50',
                                span: 'lg:col-span-2'
                            }
                        ].map((service, i) => (
                            <div key={i}
                                className={`group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-default ${service.span}`}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center ${service.accent} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed"><SmartText mobileMax={16} pcMax={22}>{service.desc}</SmartText></p>
                                {service.featured && (
                                    <div className="mt-5">
                                        <Link to="/services" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${service.accent} group-hover:gap-2.5 transition-all`}>
                                            {t('servicesSection.viewMore')} <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 rounded-xl transition-all">
                            {t('servicesSection.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Ad Section ━━━━━━ */}
            <section className="py-6 md:py-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('adRecommended')}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <AdSlot slotId="landing_a" format="banner" />
                </div>
            </section>

            {/* ━━━━━━ How It Works — Timeline ━━━━━━ */}
            <section id="how-preview" data-animate className="py-16 md:py-24 bg-white">
                <div className={`max-w-6xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('how-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">
                            {t('howSection.badge')}
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            {t('howSection.heading1')}
                            <br className="block sm:hidden" />
                            {' '}{t('howSection.heading2')}
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto">
                            {t('howSection.desc')}
                        </p>
                    </div>

                    {/* Timeline Steps */}
                    <div className="relative">
                        {/* Connecting timeline line — desktop only */}
                        <div className="hidden md:block absolute top-8 left-[calc(16.67%-12px)] right-[calc(16.67%-12px)] h-[2px]">
                            <div className="w-full h-full bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200 rounded-full" />
                        </div>
                        {/* Connecting line — mobile (vertical) */}
                        <div className="md:hidden absolute top-0 bottom-0 left-6 w-[2px] bg-gradient-to-b from-indigo-200 via-violet-200 to-purple-200 rounded-full" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                            {[
                                {
                                    step: '01',
                                    title: t('howSection.step1'),
                                    desc: t('howSection.step1Desc'),
                                },
                                {
                                    step: '02',
                                    title: t('howSection.step2'),
                                    desc: t('howSection.step2Desc'),
                                },
                                {
                                    step: '03',
                                    title: t('howSection.step3'),
                                    desc: t('howSection.step3Desc'),
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative flex md:flex-col items-start md:items-center md:text-center gap-5 md:gap-0 pl-14 md:pl-0">
                                    {/* Step Circle */}
                                    <div className="absolute left-0 md:relative md:left-auto z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center md:mb-6 shadow-sm">
                                        <span className="text-indigo-600 text-sm md:text-lg font-black">{item.step}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs"><SmartText mobileMax={16} pcMax={22}>{item.desc}</SmartText></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-10 md:mt-12">
                        <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 text-violet-600 font-semibold text-sm hover:bg-violet-50 rounded-xl transition-all">
                            {t('howSection.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ For Who — Refined Cards ━━━━━━ */}
            <section id="for-who" data-animate className="py-16 md:py-24 bg-gray-50">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('for-who') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
                            {t('forWho.badge')}
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            {t('forWho.heading1')}
                            <br className="block sm:hidden" />
                            {' '}{t('forWho.heading2')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Seller Card */}
                        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                            <div className="p-7 md:p-9 pl-8 md:pl-10">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                                    <ShoppingBag size={22} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{t('forWho.sellerTitle')}</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                                    <SmartText mobileMax={16} pcMax={24}>{t('forWho.sellerDesc')}</SmartText>
                                </p>
                                <ul className="space-y-2.5">
                                    {(t('forWho.sellerFeatures', { returnObjects: true }) || []).map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={15} className="text-indigo-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Vendor Card */}
                        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
                            <div className="p-7 md:p-9 pl-8 md:pl-10">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5">
                                    <Building size={22} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{t('forWho.vendorTitle')}</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                                    <SmartText mobileMax={16} pcMax={24}>{t('forWho.vendorDesc')}</SmartText>
                                </p>
                                <ul className="space-y-2.5">
                                    {(t('forWho.vendorFeatures', { returnObjects: true }) || []).map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8 md:mt-10">
                        <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 rounded-xl transition-all">
                            {t('forWho.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Ad Section ━━━━━━ */}
            <section className="py-6 md:py-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('adSponsor')}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdSlot slotId="landing_b" format="card" />
                        <AdSlot slotId="landing_b2" format="card" />
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Stats Section — Light with Count-up ━━━━━━ */}
            <section data-animate id="stats" className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
                <div className={`relative z-10 max-w-5xl mx-auto px-4 md:px-6 transition-all duration-1000 ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}>
                    <div className="text-center mb-12">
                        <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">NUMBERS</p>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{t('stats.provenResults')}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { value: '500+', label: t('stats.sellers'), icon: <ShoppingBag size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { value: '200+', label: t('stats.spaces'), icon: <Store size={20} />, color: 'text-violet-600', bg: 'bg-violet-50' },
                            { value: '1,000+', label: t('stats.matches'), icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { value: '98%', label: t('stats.satisfaction'), icon: <Star size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((stat, i) => {
                            const displayed = useCountUp(stat.value, 1800, isVisible('stats'));
                            return (
                                <div key={i} className="text-center group">
                                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-1 tabular-nums">{displayed}</p>
                                    <p className="text-gray-400 text-xs md:text-sm font-medium">{stat.label}</p>
                                    <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-gray-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')} transition-all duration-[2000ms] ${isVisible('stats') ? 'w-full' : 'w-0'}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ━━━━━━ CTA Section ━━━━━━ */}
            <section id="cta" data-animate className="py-16 md:py-24 bg-gray-50">
                <div className={`max-w-4xl mx-auto px-4 md:px-6 text-center transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
                        {t('cta.badge')}
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                        {t('cta.heading')}
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto">
                        <SmartText mobileMax={16} pcMax={24}>{t('cta.desc')}</SmartText>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 px-4">
                        <Link
                            to={dashboardPath || "/signup"}
                            className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {dashboardPath ? t('cta.learnMore') : t('cta.freeSignup')}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="http://pf.kakao.com/_xjGxoRX/chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-gray-900 rounded-2xl font-bold text-base md:text-lg hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
                        >
                            {t('cta.inquiry')}
                        </a>
                    </div>

                    {!dashboardPath && (
                        <p className="text-sm text-gray-400">
                            {t('cta.alreadyHaveAccount')}{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                                {t('cta.login')}</Link>
                        </p>
                    )}
                </div>
            </section>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <PublicFooter />
        </div>
    );
};

export default LandingPage;
