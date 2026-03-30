import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import AdSlot from '../components/AdSlot';
import SmartText from '../components/SmartText';
import Toast from '../components/Toast';
import { getContactLink } from '../utils/contactLinks';
import {
    ArrowRight, Store, ShoppingBag, Users, Sparkles, ChevronDown,
    MapPin, TrendingUp, Shield, Zap, CheckCircle, Star, Building,
    MessageCircle, Flame, Clock, Eye, Heart, Share2
} from 'lucide-react';

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

/* ── Stat Card component (enables hook use at top level) ── */
const StatCard = ({ stat, c, isStatsVisible }) => {
    const displayed = useCountUp(stat.value, 1800, isStatsVisible);
    return (
        <div className="text-center group bg-white dark:bg-gray-800/80 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl ${c.iconBg} flex items-center justify-center ${c.iconText} group-hover:scale-110 transition-all duration-300`}>
                {stat.icon}
            </div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-1 tabular-nums">{displayed}</p>
            <p className="text-gray-400 text-xs md:text-sm font-medium">{stat.label}</p>
            <div className="mt-4 mx-auto w-12 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className={`h-full rounded-full ${c.bar} transition-all duration-[2000ms] ${isStatsVisible ? 'w-full' : 'w-0'}`} />
            </div>
        </div>
    );
};

const LandingPage = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation('landing');
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
            : user.role === 'host'
                ? '/host'
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

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
            <PublicNav transparent />

            {/* ━━━━━━ Hero Section — Bright & Airy Light Mode ━━━━━━ */}
            <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
                {/* Light gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/40" />

                {/* Soft decorative orbs */}
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-violet-200/25 dark:bg-violet-800/15 rounded-full blur-[100px] animate-float-slow" />
                <div className="absolute top-[40%] left-[40%] w-[350px] h-[350px] bg-purple-100/20 dark:bg-purple-900/15 rounded-full blur-[80px] animate-glow" />
                <div className="absolute top-[15%] right-[25%] w-[250px] h-[250px] bg-blue-100/20 dark:bg-blue-900/15 rounded-full blur-[60px] animate-float" style={{ animationDelay: '2s' }} />

                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Main content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 md:pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen lg:min-h-0 py-12 lg:py-0">

                        {/* Left — Text & CTA */}
                        <div className="flex flex-col justify-center order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-700/50 rounded-full mb-6 w-fit animate-fadeIn">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                                </span>
                                <span className="text-indigo-600 dark:text-indigo-300 text-xs md:text-sm font-semibold">{t('heroBadge')}</span>
                            </div>

                            <h1 className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-gray-900 dark:text-white mb-5 md:mb-6 tracking-tight" style={{ fontWeight: 1000 }}>
                                <div className="mb-3 md:mb-4">{t('heroHeading1')}</div>
                                <div className="mb-3 md:mb-4">
                                    <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                        {t('heroHeading2')}</span>
                                </div>
                                <div>{t('heroHeading3')}</div>
                            </h1>

                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-8 md:mb-10 leading-relaxed">
                                {t('heroDesc').split('\n').map((line, i, arr) => (
                                    <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                                ))}
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-10">
                                <Link
                                    to={dashboardPath || "/signup/seller"}
                                    className="group w-full sm:w-auto px-10 md:px-12 py-4.5 md:py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-extrabold text-lg md:text-xl shadow-xl shadow-indigo-200/60 hover:shadow-indigo-300/70 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {dashboardPath ? t('cta.learnMore') : t('heroBestSpaces')}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/services"
                                    className="w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {t('heroLearnMore')}
                                    <ArrowRight size={18} className="opacity-40" />
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center gap-5 md:gap-8">
                                {[
                                    { icon: <Shield size={15} />, text: t('heroSafeMatch') },
                                    { icon: <Zap size={15} />, text: t('heroFastEntry') },
                                    { icon: <CheckCircle size={15} />, text: t('heroVerifiedSpaces') },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs md:text-sm font-medium">
                                        <div className="text-indigo-500">{item.icon}</div>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Floating glass cards (light) */}
                        <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[280px] md:min-h-[400px] lg:min-h-[520px]">
                            {/* Soft glow behind cards */}
                            <div className="absolute w-[80%] h-[80%] bg-gradient-to-br from-indigo-100/50 via-violet-100/40 to-purple-100/30 dark:from-indigo-900/30 dark:via-violet-900/20 dark:to-purple-900/15 rounded-full blur-[80px]" />

                            {/* Card 1 — Main large */}
                            <div className="absolute top-[10%] left-[5%] md:left-[10%] w-[200px] md:w-[260px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-5 animate-float shadow-xl shadow-indigo-100/40 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50">
                                <div className="w-full h-24 md:h-32 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-xl mb-3 flex items-center justify-center">
                                    <Store size={36} className="text-indigo-400" />
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-2 w-3/4" />
                                <div className="h-2 bg-gray-50 dark:bg-gray-600 rounded-full w-1/2" />
                            </div>

                            {/* Card 2 — Stat card */}
                            <div className="absolute top-[5%] right-[5%] md:right-[10%] w-[140px] md:w-[170px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 animate-float-slow shadow-xl shadow-emerald-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center">
                                        <TrendingUp size={16} className="text-emerald-500" />
                                    </div>
                                    <span className="text-emerald-600 text-xs font-bold">+24%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-1.5 w-full" />
                                <div className="h-2 bg-gray-50 dark:bg-gray-600 rounded-full w-2/3" />
                            </div>

                            {/* Card 3 — Match card */}
                            <div className="absolute bottom-[10%] right-[0%] md:right-[5%] w-[180px] md:w-[220px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 animate-float shadow-xl shadow-violet-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-2.5 mb-2.5">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                                        <Users size={14} className="text-violet-500" />
                                    </div>
                                    <div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-16 mb-1" />
                                        <div className="h-1.5 bg-gray-50 dark:bg-gray-600 rounded-full w-10" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold rounded-md">MATCHED</span>
                                    <div className="flex -space-x-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 border-2 border-white" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 — Micro badge */}
                            <div className="absolute bottom-[20%] left-[0%] md:left-[5%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float-slow shadow-lg shadow-amber-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '3s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-amber-50 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                                        <Star size={12} className="text-amber-500" />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold">4.9 Rating</span>
                                </div>
                            </div>

                            {/* Card 5 — Notification badge */}
                            <div className="absolute top-[38%] right-[2%] md:right-[3%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float shadow-lg shadow-rose-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '0.5s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/40 rounded-full flex items-center justify-center relative">
                                        <MessageCircle size={12} className="text-rose-500" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800" />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-300 text-[11px] font-semibold">3 New</span>
                                </div>
                            </div>

                            {/* Card 6 — Likes counter */}
                            <div className="absolute bottom-[35%] left-[8%] md:left-[15%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float shadow-lg shadow-pink-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '4s' }}>
                                <div className="flex items-center gap-1.5">
                                    <Heart size={13} className="text-pink-500 fill-pink-500" />
                                    <span className="text-gray-600 dark:text-gray-300 text-[11px] font-bold">2.4k</span>
                                </div>
                            </div>

                            {/* Card 7 — Location pin */}
                            <div className="hidden md:flex absolute top-[25%] left-[35%] md:left-[38%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-1.5 animate-float-slow shadow-lg shadow-blue-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50 items-center gap-1.5" style={{ animationDelay: '1.5s' }}>
                                <MapPin size={12} className="text-blue-500" />
                                <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">서울 · 강남</span>
                            </div>

                            {/* Card 8 — Verified badge */}
                            <div className="absolute bottom-[5%] left-[25%] md:left-[30%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full px-3 py-1.5 animate-float shadow-lg shadow-emerald-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50" style={{ animationDelay: '2.5s' }}>
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-emerald-500" />
                                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-gray-300 dark:text-gray-600 text-xs font-medium hidden md:block tracking-[0.2em]">SCROLL</span>
                    <ChevronDown size={20} className="text-gray-300 dark:text-gray-600" />
                </div>
            </section>

            {/* ━━━━━━ Hot Recruitment Preview ━━━━━━ */}
            {!promosLoading && hotPromos.length > 0 && (
                <section id="hot-promos" data-animate className="py-14 md:py-24 bg-gray-50/50 dark:bg-gray-900/50 relative">
                    <div className={`max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible('hot-promos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="text-center mb-10 md:mb-14">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold mb-5">
                                <Flame size={14} />
                                {t('hotRecruitment')}
                            </div>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">
                                {t('hotTitle1')} <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t('hotTitle2')}</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{t('hotDesc')}</p>
                        </div>

                        {/* Horizontal scroll on mobile, grid on desktop */}
                        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
                            {hotPromos.map((venue, i) => {
                                const imgSrc = getImageSrc(venue.images);
                                const dday = getDday(venue.recruitment_deadline);
                                const typeLabel = getVenueTypeLabel(venue.type);
                                return (
                                    <div key={venue.promotion_id || i}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex-shrink-0 w-[300px] md:w-auto"
                                        onClick={() => window.location.href = '/recruitment'}
                                        style={{ transitionDelay: `${i * 80}ms` }}
                                    >
                                        <div className="relative h-44 md:h-52 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 overflow-hidden">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Store size={44} className="text-orange-200" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-500/25">
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
                                        <div className="p-4 md:p-5 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Building size={12} className="flex-shrink-0" />
                                                    <span className="truncate font-medium">{venue.owner_name || t('hotSpaceProvider')}</span>
                                                </div>
                                                {venue.type && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full border border-orange-100 dark:border-orange-800/50">
                                                        <Store size={10} />{typeLabel}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-extrabold text-gray-900 dark:text-white text-base md:text-lg truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{venue.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <MapPin size={13} className="flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{venue.location || t('hotLocationTBD')}</span>
                                            </div>
                                            {venue.recruitment_deadline && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Clock size={12} className="flex-shrink-0" />
                                                    <span>{t('hotDeadline', { date: venue.recruitment_deadline })}</span>
                                                    {dday && <span className={`ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`}>{dday.text}</span>}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                <Link
                                                    to={user ? (user.role === 'seller' ? '/seller' : user.role === 'host' ? '/host' : '/admin') : '/login'}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold text-center hover:shadow-lg hover:shadow-indigo-200/50 transition-all"
                                                >
                                                    {t('hotApply')}
                                                </Link>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-200 hover:shadow-md transition-all"
                                                    title={t('hotLike')}
                                                >
                                                    <Heart size={14} />
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try { await navigator.clipboard.writeText(`${window.location.origin}/recruitment`); showToast(t('hotCopied')); } catch (e) { console.error(e); }
                                                    }}
                                                    className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 hover:shadow-md transition-all"
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
                            <Link to="/recruitment" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-orange-100/60 hover:-translate-y-0.5 transition-all duration-300">
                                <Eye size={16} />
                                {t('hotUsageGuide')}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ━━━━━━ Services Preview — Uniform Card Grid ━━━━━━ */}
            <section id="services-preview" data-animate className="py-16 md:py-28 bg-white dark:bg-gray-950 relative">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible('services-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-indigo-600 dark:text-indigo-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                            {t('servicesSection.badge')}
                        </p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                            {t('servicesSection.heading1')} {t('servicesSection.heading2')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{t('servicesSection.desc')}</p>
                    </div>

                    {/* Uniform 2×2 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
                        {[
                            {
                                icon: <TrendingUp size={24} />,
                                title: t('servicesSection.salesDashboard'),
                                desc: t('servicesSection.salesDashboardDesc'),
                                accent: 'indigo'
                            },
                            {
                                icon: <Shield size={24} />,
                                title: t('servicesSection.taxSupport'),
                                desc: t('servicesSection.taxSupportDesc'),
                                accent: 'violet'
                            },
                            {
                                icon: <MapPin size={24} />,
                                title: t('servicesSection.spaceSearch'),
                                desc: t('servicesSection.spaceSearchDesc'),
                                accent: 'emerald'
                            },
                            {
                                icon: <Users size={24} />,
                                title: t('servicesSection.community'),
                                desc: t('servicesSection.communityDesc'),
                                accent: 'amber'
                            }
                        ].map((service, i) => {
                            const colorMap = {
                                indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'hover:border-indigo-200 dark:hover:border-indigo-700', glow: 'hover:shadow-indigo-100/40' },
                                violet: { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/30', border: 'hover:border-violet-200 dark:hover:border-violet-700', glow: 'hover:shadow-violet-100/40' },
                                emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'hover:border-emerald-200 dark:hover:border-emerald-700', glow: 'hover:shadow-emerald-100/40' },
                                amber: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'hover:border-amber-200 dark:hover:border-amber-700', glow: 'hover:shadow-amber-100/40' }
                            };
                            const c = colorMap[service.accent];
                            return (
                                <div key={i}
                                    className={`group relative bg-white dark:bg-gray-800/80 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 ${c.border} ${c.glow} hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-default overflow-hidden text-center`}
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text} mb-5 mx-auto group-hover:scale-110 transition-all duration-300`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        {service.desc.split('\n').map((line, j, arr) => (
                                            <React.Fragment key={j}>{line}{j < arr.length - 1 && <br />}</React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 rounded-xl transition-all">
                            {t('servicesSection.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Ad Section ━━━━━━ */}
            <section className="py-6 md:py-10 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('adRecommended')}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <AdSlot slotId="landing_a" format="banner" />
                </div>
            </section>

            {/* ━━━━━━ How It Works — Uniform Card Steps ━━━━━━ */}
            <section id="how-preview" data-animate className="py-16 md:py-28 bg-white dark:bg-gray-950 relative">
                <div className={`max-w-6xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('how-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-violet-600 dark:text-violet-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                            {t('howSection.badge')}
                        </p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                            {t('howSection.heading1')} {t('howSection.heading2')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{t('howSection.desc')}</p>
                    </div>

                    {/* Uniform 3-column cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {[
                            { step: '01', title: t('howSection.step1'), desc: t('howSection.step1Desc'), gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                            { step: '02', title: t('howSection.step2'), desc: t('howSection.step2Desc'), gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
                            { step: '03', title: t('howSection.step3'), desc: t('howSection.step3Desc'), gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' }
                        ].map((item, i) => (
                            <div key={i}
                                className="group bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-500 hover:-translate-y-1 text-center"
                                style={{ transitionDelay: `${i * 120}ms` }}
                            >
                                {/* Step Number */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-white text-lg font-black">{item.step}</span>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                    {item.desc.split('\n').map((line, j, arr) => (
                                        <React.Fragment key={j}>{line}{j < arr.length - 1 && <br />}</React.Fragment>
                                    ))}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10 md:mt-14">
                        <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 text-violet-600 font-semibold text-sm hover:bg-violet-50 rounded-xl transition-all">
                            {t('howSection.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ For Who — Uniform Card Columns ━━━━━━ */}
            <section id="for-who" data-animate className="py-16 md:py-28 bg-gray-50/50 dark:bg-gray-900/50 relative">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible('for-who') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                            {t('forWho.badge')}
                        </p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                            {t('forWho.heading1')} {t('forWho.heading2')}
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Seller Card — Full Width */}
                        <div className="group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 hover:-translate-y-1">
                            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" />
                            <div className="p-6 md:p-8">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300">
                                    <ShoppingBag size={22} className="text-indigo-600" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">{t('forWho.sellerTitle')}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-5 leading-relaxed text-sm md:text-base">{t('forWho.sellerDesc')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(t('forWho.sellerFeatures', { returnObjects: true }) || []).map((item, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-100/50 dark:border-indigo-800/50">
                                            <CheckCircle size={12} className="flex-shrink-0" />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vendor hint — tiny text */}
                        <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-600">
                            행사를 주최하시나요?{' '}
                            <Link to="/signup/host" className="text-gray-500 dark:text-gray-500 hover:text-indigo-500 underline transition-colors">
                                호스트로 가입
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-10 md:mt-12">
                        <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 rounded-xl transition-all">
                            {t('forWho.viewMore')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Ad Section ━━━━━━ */}
            <section className="py-6 md:py-10 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('adSponsor')}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdSlot slotId="landing_b" format="card" />
                        <AdSlot slotId="landing_b2" format="card" />
                    </div>
                </div>
            </section>

            {/* ━━━━━━ Stats Section — Light with Soft Colors ━━━━━━ */}
            <section data-animate id="stats" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-gray-900 dark:to-violet-950/30">
                {/* Soft decorative blobs */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[250px] h-[250px] bg-violet-100/40 dark:bg-violet-900/20 rounded-full blur-[80px]" />

                <div className={`relative z-10 max-w-5xl mx-auto px-4 md:px-6 transition-all duration-1000 ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}>
                    <div className="text-center mb-12 md:mb-16">
                        <p className="text-indigo-600 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">NUMBERS</p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{t('stats.provenResults')}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { value: '500+', label: t('stats.sellers'), icon: <ShoppingBag size={22} />, color: 'indigo' },
                            { value: '50+', label: t('stats.regions'), icon: <MapPin size={22} />, color: 'violet' },
                            { value: '10,000+', label: t('stats.salesRecords'), icon: <TrendingUp size={22} />, color: 'emerald' },
                            { value: '98%', label: t('stats.satisfaction'), icon: <Star size={22} />, color: 'amber' },
                        ].map((stat, i) => {
                            const colors = {
                                indigo: { iconBg: 'bg-indigo-100 dark:bg-indigo-900/40', iconText: 'text-indigo-600 dark:text-indigo-400', bar: 'bg-indigo-500' },
                                violet: { iconBg: 'bg-violet-100 dark:bg-violet-900/40', iconText: 'text-violet-600 dark:text-violet-400', bar: 'bg-violet-500' },
                                emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-900/40', iconText: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
                                amber: { iconBg: 'bg-amber-100 dark:bg-amber-900/40', iconText: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
                            };
                            const c = colors[stat.color];
                            return (
                                <StatCard key={i} stat={stat} c={c} isStatsVisible={isVisible('stats')} />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ━━━━━━ CTA Section — Gradient Banner ━━━━━━ */}
            <section id="cta" data-animate className="py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden">
                <div className={`relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl md:rounded-[2rem] p-8 md:p-14 lg:p-16 relative overflow-hidden shadow-2xl shadow-indigo-200/50">
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}
                        />

                        <div className="relative z-10">
                            <p className="text-indigo-200 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                                {t('cta.badge')}
                            </p>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
                                {t('cta.heading')}
                            </h2>
                            <p className="text-white/70 text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed">{t('cta.desc')}</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
                                <Link
                                    to={dashboardPath || "/signup/seller"}
                                    className="group w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {dashboardPath ? t('cta.learnMore') : t('cta.freeSignup')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href={getContactLink(i18n.language).url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-2xl font-bold text-base md:text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-xl"
                                >
                                    {t('cta.inquiry')}
                                </a>
                            </div>

                            {!dashboardPath && (
                                <p className="text-sm text-white/50">
                                    {t('cta.alreadyHaveAccount')}{' '}
                                    <Link to="/login" className="text-white font-bold hover:underline">
                                        {t('cta.login')}</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <PublicFooter />
        </div>
    );
};

export default LandingPage;
