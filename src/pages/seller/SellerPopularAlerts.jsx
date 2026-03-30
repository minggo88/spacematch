import React, { useState, useEffect } from 'react';
import {
    Flame, TrendingUp, Eye, Users, MapPin, Store, Clock, ArrowUpRight,
    RefreshCw, Star, Zap, ChevronRight, Lock, BarChart3, Target,
    Percent, Award, ArrowDownRight, Minus, Activity, Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE = '/api';

const SellerPopularAlerts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [hasAccess, setHasAccess] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // cards | table
    const { t } = useTranslation('seller');

    const TREND_CONFIG = {
        hot: { label: t('popularAlertsPage.trendHot'), color: 'bg-red-500', ring: 'ring-red-500/30', glow: 'shadow-red-500/20' },
        rising: { label: t('popularAlertsPage.trendRising'), color: 'bg-amber-500', ring: 'ring-amber-500/30', glow: 'shadow-amber-500/20' },
        steady: { label: t('popularAlertsPage.trendSteady'), color: 'bg-sky-500', ring: 'ring-sky-500/30', glow: 'shadow-sky-500/20' },
    };

    const fetchPopular = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/venues/popular_venues.php?limit=30`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) setData(json.data);
        } catch (err) {
            // error silently handled
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE}/users/check_service.php?service=popular_alerts`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setHasAccess(data.hasAccess ?? false);
                if (data.hasAccess) fetchPopular();
                else setLoading(false);
            })
            .catch(() => { setHasAccess(false); setLoading(false); });
    }, []);

    if (loading || hasAccess === null) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-3 border-orange-200 dark:border-orange-800 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (hasAccess === false) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-orange-500 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('popularAlertsPage.lockedTitle')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('popularAlertsPage.lockedDesc') }} />
                    <div className="bg-orange-50 dark:bg-orange-950/50 rounded-2xl p-4 border border-orange-100 dark:border-orange-800">
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">{t('popularAlertsPage.lockedFeatures')}</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
                            <li>{t('popularAlertsPage.lockedFeat1')}</li>
                            <li>{t('popularAlertsPage.lockedFeat2')}</li>
                            <li>{t('popularAlertsPage.lockedFeat3')}</li>
                            <li>{t('popularAlertsPage.lockedFeat4')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <Flame className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">{t('popularAlertsPage.noData')}</h3>
            </div>
        );
    }

    const { venues, stats, typeDistribution } = data;
    const filteredVenues = filter === 'all' ? venues : venues.filter(v => v.trend === filter);

    // Competition level helper
    const getCompetitionLevel = (ratio) => {
        if (ratio >= 30) return { label: t('popularAlertsPage.competitionFierce'), color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' };
        if (ratio >= 15) return { label: t('popularAlertsPage.competitionModerate'), color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' };
        return { label: t('popularAlertsPage.competitionLow'), color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' };
    };

    // Bar component
    const Bar = ({ value, max, color = 'bg-indigo-500' }) => (
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full ${color} transition-all duration-500`}
                style={{ width: `${max > 0 ? Math.min(value / max * 100, 100) : 0}%` }} />
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('popularAlertsPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('popularAlertsPage.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button onClick={() => setViewMode('cards')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {t('popularAlertsPage.viewCards')}
                        </button>
                        <button onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {t('popularAlertsPage.viewTable')}
                        </button>
                    </div>
                    <button onClick={fetchPopular} className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors border border-orange-200 dark:border-orange-800">
                        <RefreshCw size={16} /> {t('popularAlertsPage.refresh')}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: t('popularAlertsPage.statsHot'), value: stats.hot, icon: Flame, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', borderColor: 'border-red-100 dark:border-red-800' },
                    { label: t('popularAlertsPage.statsRising'), value: stats.rising, icon: TrendingUp, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', borderColor: 'border-amber-100 dark:border-amber-800' },
                    { label: t('popularAlertsPage.statsTotal'), value: stats.total, icon: Store, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40', borderColor: 'border-sky-100 dark:border-sky-800' },
                    { label: t('popularAlertsPage.statsAvgViews'), value: stats.avgViews, icon: Eye, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', borderColor: 'border-violet-100 dark:border-violet-800' },
                    { label: t('popularAlertsPage.statsAvgApps'), value: stats.avgApps, icon: Users, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-100 dark:border-emerald-800' },
                    { label: t('popularAlertsPage.statsAvgCompetition'), value: `${stats.avgCompetition}%`, icon: Target, color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/40', borderColor: 'border-pink-100 dark:border-pink-800' },
                ].map((kpi, i) => (
                    <div key={i} className={`${kpi.bg} rounded-2xl p-4 border ${kpi.borderColor}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <kpi.icon size={14} className={kpi.color} />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{kpi.label}</span>
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Type Distribution + Market Insight */}
            {typeDistribution && typeDistribution.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Type Distribution */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BarChart3 size={14} /> {t('popularAlertsPage.typeDistribution')}
                        </h3>
                        <div className="space-y-2.5">
                            {typeDistribution.slice(0, 6).map((td, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-16 flex-shrink-0 truncate">{td.type}</span>
                                    <div className="flex-1">
                                        <Bar value={td.count} max={typeDistribution[0]?.count || 1} color={i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-amber-500' : 'bg-gray-400 dark:bg-gray-500'} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex-shrink-0 w-8 text-right">{td.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Insight */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={14} /> {t('popularAlertsPage.marketInsight')}
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 border border-orange-100 dark:border-orange-800">
                                <p className="text-xs text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: t('popularAlertsPage.insightHot', { count: stats.hot }) }} />
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800">
                                <p className="text-xs text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: stats.avgCompetition < 20 ? t('popularAlertsPage.insightCompLow', { rate: stats.avgCompetition }) : t('popularAlertsPage.insightCompHigh', { rate: stats.avgCompetition }) }} />
                            </div>
                            {typeDistribution.length > 0 && (
                                <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-100 dark:border-violet-800">
                                    <p className="text-xs text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: t('popularAlertsPage.insightTopType', { type: typeDistribution[0].type, count: typeDistribution[0].count }) + (typeDistribution.length > 1 ? t('popularAlertsPage.insightNextType', { type: typeDistribution[1].type, count: typeDistribution[1].count }) : '') }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-3">
                <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl overflow-x-auto flex-1">
                    {[
                        { id: 'all', label: t('popularAlertsPage.filterAll'), count: stats.total },
                        { id: 'hot', label: t('popularAlertsPage.trendHot'), count: stats.hot },
                        { id: 'rising', label: t('popularAlertsPage.trendRising'), count: stats.rising },
                        { id: 'steady', label: t('popularAlertsPage.trendSteady'), count: stats.total - stats.hot - stats.rising },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                ${filter === tab.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {tab.label}
                            <span className={`text-[10px] py-0.5 px-1.5 rounded-full ${filter === tab.id ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-200/50 dark:bg-gray-700/50'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Card View */}
            {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVenues.map((venue, idx) => {
                        const trend = TREND_CONFIG[venue.trend] || TREND_CONFIG.steady;
                        const firstImage = Array.isArray(venue.images) && venue.images.length > 0 ? venue.images[0] : null;
                        const competition = getCompetitionLevel(venue.competition_ratio);

                        return (
                            <div key={venue.id} className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 group
                                ${venue.trend === 'hot' ? 'border-red-200 dark:border-red-800 shadow-sm ' + trend.glow : venue.trend === 'rising' ? 'border-amber-200 dark:border-amber-800' : 'border-gray-200 dark:border-gray-700'}`}>
                                {/* Image */}
                                <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                                    {firstImage ? (
                                        <img src={firstImage} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <Store size={32} />
                                        </div>
                                    )}
                                    {/* Rank Badge */}
                                    {idx < 3 && (
                                        <div className={`absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shadow-lg
                                            ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-amber-500 to-amber-700'}`}>
                                            {idx + 1}
                                        </div>
                                    )}
                                    {/* Trend Badge */}
                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white ${trend.color} shadow-md`}>
                                        {trend.label}
                                    </div>
                                    {/* Competition Badge */}
                                    <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold ${competition.bg} ${competition.color} backdrop-blur-sm`}>
                                        {t('popularAlertsPage.competitionLabel')} {competition.label}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{venue.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <MapPin size={11} /> {venue.location || t('popularAlertsPage.locationUnknown')}
                                        </p>
                                        {venue.type && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded font-medium">{venue.type}</span>
                                        )}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        <div className="text-center">
                                            <p className="text-sm font-extrabold text-sky-600 dark:text-sky-400">{venue.view_count}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{t('popularAlertsPage.views')}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{venue.app_count}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{t('popularAlertsPage.applications')}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-extrabold ${competition.color}`}>{venue.competition_ratio}%</p>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{t('popularAlertsPage.competitionRate')}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-extrabold ${venue.approval_rate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : venue.approval_rate > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {venue.approval_rate}%
                                            </p>
                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{t('popularAlertsPage.approvalRate')}</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    {venue.recent_app_count > 0 && (
                                        <div className="flex items-center gap-1.5 mb-3 px-2 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800">
                                            <Zap size={11} className="text-amber-500" fill="currentColor" />
                                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{t('popularAlertsPage.weeklyApps', { count: venue.recent_app_count })}</span>
                                            {venue.monthly_app_count > 0 && (
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">{t('popularAlertsPage.monthlyApps', { count: venue.monthly_app_count })}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Price + CTA */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <div className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">₩{parseInt(venue.price || 0).toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">/{venue.pricing_unit || t('perDay')}</span>
                                        </div>
                                        <a href={`/seller/hosts`}
                                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                            {t('popularAlertsPage.viewDetails')} <ChevronRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">#</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thVenue')}</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thLocation')}</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thTrend')}</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thViews')}</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thApps')}</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thCompetition')}</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thApproval')}</th>
                                    <th className="text-right py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{t('popularAlertsPage.thPrice')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVenues.map((venue, idx) => {
                                    const trend = TREND_CONFIG[venue.trend] || TREND_CONFIG.steady;
                                    const competition = getCompetitionLevel(venue.competition_ratio);
                                    return (
                                        <tr key={venue.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-extrabold
                                                    ${idx === 0 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' : idx === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : idx === 2 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{venue.name}</p>
                                                {venue.type && <span className="text-[10px] text-gray-400 dark:text-gray-500">{venue.type}</span>}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{venue.location || '-'}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${trend.color}`}>{trend.label}</span>
                                            </td>
                                            <td className="py-3 px-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300">{venue.view_count}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{venue.app_count}</span>
                                                {venue.recent_app_count > 0 && <span className="text-[10px] text-amber-500 ml-1">+{venue.recent_app_count}</span>}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`text-xs font-bold ${competition.color}`}>{venue.competition_ratio}%</span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`text-xs font-bold ${venue.approval_rate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>{venue.approval_rate}%</span>
                                            </td>
                                            <td className="py-3 px-4 text-right text-xs font-bold text-gray-900 dark:text-white">₩{parseInt(venue.price || 0).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredVenues.length === 0 && (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <Store className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                    <p className="text-gray-400 dark:text-gray-500 font-medium">{t('popularAlertsPage.emptyFilter')}</p>
                </div>
            )}

            {/* Tips Banner */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">{t('popularAlertsPage.tipsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: t('popularAlertsPage.tip1Title'), desc: t('popularAlertsPage.tip1Desc'), icon: '⚡', color: 'text-amber-600 dark:text-amber-400' },
                        { title: t('popularAlertsPage.tip2Title'), desc: t('popularAlertsPage.tip2Desc'), icon: '🎯', color: 'text-emerald-600 dark:text-emerald-400' },
                        { title: t('popularAlertsPage.tip3Title'), desc: t('popularAlertsPage.tip3Desc'), icon: '📈', color: 'text-violet-600 dark:text-violet-400' },
                    ].map((tip, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <span className="text-2xl">{tip.icon}</span>
                            <h4 className={`text-sm font-bold mt-2 ${tip.color}`}>{tip.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerPopularAlerts;
