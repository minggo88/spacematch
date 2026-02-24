import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    TrendingUp, DollarSign, Users, ShoppingCart, Star, MapPin,
    Store, BarChart3, Calendar, ArrowUp, ArrowDown, Search,
    Eye, X, ChevronDown, Package, Clock, CalendarDays, CalendarRange,
    ArrowUpRight, Activity, Target, Award, Zap, FileText, RefreshCw,
    AlertCircle, Database, PlusCircle, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

const API_BASE = '/api/users';

const COLORS = {
    primary: '#5551e8',
    primaryLight: '#6d69f1',
    primaryBg: '#EEEDFD',
    accent: '#6d69f1',
    accentLight: '#9B98F5',
    dark: '#2d2b6e',
};

const COUNTRY_INFO = {
    KR: { name: '한국', flag: '🇰🇷' },
    US: { name: '미국', flag: '🇺🇸' },
    GB: { name: '영국', flag: '🇬🇧' },
    CA: { name: '캐나다', flag: '🇨🇦' },
    JP: { name: '일본', flag: '🇯🇵' },
    SG: { name: '싱가포르', flag: '🇸🇬' },
    VN: { name: '베트남', flag: '🇻🇳' },
    TH: { name: '태국', flag: '🇹🇭' },
    KH: { name: '캄보디아', flag: '🇰🇭' },
    RU: { name: '러시아', flag: '🇷🇺' },
    UA: { name: '우크라이나', flag: '🇺🇦' },
};

const AdminSellerStats = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation('admin');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countryFilter, setCountryFilter] = useState('ALL');
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Seller detail modal state
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [sellerDetail, setSellerDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE}/seller_stats_admin.php?action=overview&country_code=${countryFilter}`, { credentials: 'include' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.message || t('sellerStatsPage.dataLoadFailed'));
                showToast(json.message || t('sellerStatsPage.dataLoadFailed'), 'error');
            }
        } catch (err) {
            const msg = err.message?.includes('HTTP') ? t('sellerStatsPage.serverError', { msg: err.message }) : t('sellerStatsPage.serverConnFailed');
            setError(msg);
            showToast(msg, 'error');
        } finally { setLoading(false); }
    }, [showToast, t, countryFilter]);

    useEffect(() => { fetchOverview(); }, [fetchOverview]);

    const fetchSellerDetail = async (sellerId) => {
        setDetailLoading(true);
        try {
            const res = await fetch(`${API_BASE}/seller_stats_admin.php?action=seller_detail&seller_id=${sellerId}`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) {
                setSellerDetail(json);
                setSelectedSeller(sellerId);
            } else showToast(json.message || t('sellerStatsPage.dataLoadFailed'), 'error');
        } catch {
            showToast(t('sellerStatsPage.serverConnFailed'), 'error');
        } finally { setDetailLoading(false); }
    };

    const formatRevenue = (val) => {
        const n = parseInt(val) || 0;
        if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`;
        if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만원`;
        return `${n.toLocaleString()}원`;
    };

    // Filtered sellers for ranking tab
    const filteredSellers = useMemo(() => {
        if (!data?.topSellers) return [];
        if (!searchQuery.trim()) return data.topSellers;
        const q = searchQuery.toLowerCase();
        return data.topSellers.filter(s =>
            (s.name || '').toLowerCase().includes(q) ||
            (s.brand_name || '').toLowerCase().includes(q) ||
            (s.category || '').toLowerCase().includes(q)
        );
    }, [data, searchQuery]);

    // Safe accessors
    const sellerCount = data?.sellerCount || 0;
    const totals = data?.totals || {};
    const topSellers = data?.topSellers || [];
    const monthlyTrend = data?.monthlyTrend || [];
    const categoryDist = data?.categoryDist || [];
    const regionDist = data?.regionDist || [];
    const availableCountries = data?.availableCountries || [];
    const countryBreakdown = data?.countryBreakdown || [];
    const recentActivity = data?.recentActivity || [];
    const typeSummary = {};
    (data?.typeSummary || []).forEach(ts => { typeSummary[ts.record_type] = ts; });

    const tabs = [
        { key: 'overview', label: t('sellerStatsPage.tabOverview'), icon: BarChart3 },
        { key: 'sellers', label: t('sellerStatsPage.tabSellers'), icon: Award },
        { key: 'insights', label: t('sellerStatsPage.tabInsights'), icon: Target },
    ];

    const isEmpty = sellerCount === 0 && topSellers.length === 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary }} />
            </div>
        );
    }

    // Error state with retry
    if (error && !data) {
        return (
            <div className="max-w-md mx-auto text-center py-20">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: COLORS.primaryBg }}>
                    <AlertCircle size={32} style={{ color: COLORS.primary }} />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{t('sellerStatsPage.cannotLoadData')}</h3>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                <button onClick={fetchOverview}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg"
                    style={{ background: COLORS.primary }}>
                    <RefreshCw size={16} /> {t('sellerStatsPage.retry')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }}>
                        <TrendingUp className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t('sellerStatsPage.title')}</h1>
                        <p className="text-sm text-gray-500">{t('sellerStatsPage.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchOverview}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title={t('sellerStatsPage.refresh')}>
                        <RefreshCw size={16} />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Activity size={14} />
                        <span>{t('sellerStatsPage.analyzingSellers', { count: sellerCount })}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive
                                ? 'text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            style={isActive ? { background: COLORS.primary } : {}}>
                            <Icon size={16} />{tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Country Filter */}
            {availableCountries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <Globe size={14} className="text-gray-400 flex-shrink-0" />
                    <button
                        onClick={() => setCountryFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === 'ALL'
                            ? 'text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        style={countryFilter === 'ALL' ? { background: COLORS.primary } : {}}
                    >
                        {t('sellerStatsPage.allCountries', '전체')}
                    </button>
                    {availableCountries.map(code => {
                        const info = COUNTRY_INFO[code] || { name: code, flag: '🏳️' };
                        const bd = countryBreakdown.find(b => b.country_code === code);
                        return (
                            <button key={code}
                                onClick={() => setCountryFilter(code)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${countryFilter === code
                                    ? 'text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                style={countryFilter === code ? { background: COLORS.primary } : {}}
                            >
                                <span>{info.flag}</span>
                                <span>{info.name}</span>
                                {bd && <span className={`text-[9px] ${countryFilter === code ? 'text-indigo-200' : 'text-gray-400'}`}>({bd.user_count})</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ════ EMPTY STATE ════ */}
            {isEmpty && activeTab === 'overview' && (
                <div className="space-y-5">
                    {/* Empty Hero */}
                    <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                        <div className="absolute -right-8 -bottom-8 opacity-10"><TrendingUp size={120} /></div>
                        <div className="relative z-10 text-center max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Database size={32} />
                            </div>
                            <h2 className="text-xl font-extrabold mb-2">{t('sellerStatsPage.emptyDashboardTitle')}</h2>
                            <p className="text-indigo-200 text-sm leading-relaxed">
                                {t('sellerStatsPage.emptyDashboardDesc1')}<br />
                                {t('sellerStatsPage.emptyDashboardDesc2')}<br />
                                {t('sellerStatsPage.emptyDashboardDesc3')}
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Guide Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: <BarChart3 size={22} />, title: t('sellerStatsPage.guideOverview'), desc: t('sellerStatsPage.guideOverviewDesc') },
                            { icon: <Award size={22} />, title: t('sellerStatsPage.guideRanking'), desc: t('sellerStatsPage.guideRankingDesc') },
                            { icon: <Target size={22} />, title: t('sellerStatsPage.guideInsights'), desc: t('sellerStatsPage.guideInsightsDesc') },
                        ].map((card, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: COLORS.primaryBg, color: COLORS.primary }}>
                                    {card.icon}
                                </div>
                                <h4 className="text-sm font-extrabold text-gray-900 mb-1">{card.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Data Input Guide */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                            <PlusCircle size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.dataCollectionGuide')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: COLORS.primary }}>1</span>
                                    <span className="text-xs font-bold text-gray-800">{t('sellerStatsPage.sellerDirectInput')}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed pl-8">
                                    {t('sellerStatsPage.sellerDirectInputDesc')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: COLORS.accent }}>2</span>
                                    <span className="text-xs font-bold text-gray-800">{t('sellerStatsPage.autoDashboard')}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed pl-8">
                                    {t('sellerStatsPage.autoDashboardDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Period Summary (empty) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: t('sellerStatsPage.daily'), icon: <Clock size={18} />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
                            { label: t('sellerStatsPage.monthly'), icon: <CalendarDays size={18} />, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                            { label: t('sellerStatsPage.annual'), icon: <CalendarRange size={18} />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
                        ].map(period => (
                            <div key={period.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-9 h-9 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white`}>
                                        {period.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-gray-900 text-sm">{t('sellerStatsPage.periodData', { period: period.label })}</h4>
                                        <p className="text-[10px] text-gray-400">{t('sellerStatsPage.recordsLogged', { count: 0 })}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`${period.bg} rounded-xl p-2.5`}>
                                        <p className={`text-[10px] font-bold ${period.text} mb-0.5`}>{t('sellerStatsPage.totalRevenue')}</p>
                                        <p className="text-xs font-extrabold text-gray-900">-</p>
                                    </div>
                                    <div className={`${period.bg} rounded-xl p-2.5`}>
                                        <p className={`text-[10px] font-bold ${period.text} mb-0.5`}>{t('sellerStatsPage.avgRevenue')}</p>
                                        <p className="text-xs font-extrabold text-gray-900">-</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ════ OVERVIEW TAB (with data) ════ */}
            {activeTab === 'overview' && !isEmpty && (
                <div className="space-y-5">
                    {/* Hero KPI */}
                    <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                        <div className="absolute -right-8 -bottom-8 opacity-10"><TrendingUp size={120} /></div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                            <KPICard label={t('sellerStatsPage.participatingSellers')} value={t('sellerStatsPage.sellersCount', { count: sellerCount })} icon={<Users size={16} />} />
                            <KPICard label={t('sellerStatsPage.totalData')} value={t('sellerStatsPage.recordsCount', { count: parseInt(totals.total_records || 0) })} icon={<FileText size={16} />} />
                            <KPICard label={t('sellerStatsPage.totalRevenue')} value={formatRevenue(totals.total_revenue)} icon={<DollarSign size={16} />} />
                            <KPICard label={t('sellerStatsPage.avgRevenue')} value={formatRevenue(Math.round(totals.avg_revenue || 0))} icon={<TrendingUp size={16} />} />
                            <KPICard label={t('sellerStatsPage.avgSatisfaction')} value={`${parseFloat(totals.avg_satisfaction || 0).toFixed(1)}/5`} icon={<Star size={16} />} />
                        </div>
                    </div>

                    {/* Period Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { key: 'daily', label: t('sellerStatsPage.daily'), icon: <Clock size={18} />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
                            { key: 'monthly', label: t('sellerStatsPage.monthly'), icon: <CalendarDays size={18} />, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                            { key: 'annual', label: t('sellerStatsPage.annual'), icon: <CalendarRange size={18} />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
                        ].map(period => {
                            const s = typeSummary[period.key] || {};
                            return (
                                <div key={period.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-9 h-9 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white`}>
                                            {period.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 text-sm">{t('sellerStatsPage.periodData', { period: period.label })}</h4>
                                            <p className="text-[10px] text-gray-400">{t('sellerStatsPage.recordsLogged', { count: parseInt(s.count || 0) })}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`${period.bg} rounded-xl p-2.5`}>
                                            <p className={`text-[10px] font-bold ${period.text} mb-0.5`}>{t('sellerStatsPage.totalRevenue')}</p>
                                            <p className="text-xs font-extrabold text-gray-900">{parseInt(s.total_revenue || 0) > 0 ? formatRevenue(s.total_revenue) : '-'}</p>
                                        </div>
                                        <div className={`${period.bg} rounded-xl p-2.5`}>
                                            <p className={`text-[10px] font-bold ${period.text} mb-0.5`}>{t('sellerStatsPage.avgRevenue')}</p>
                                            <p className="text-xs font-extrabold text-gray-900">{parseInt(s.avg_revenue || 0) > 0 ? formatRevenue(Math.round(s.avg_revenue)) : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Monthly Trend Chart */}
                        {monthlyTrend.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                    <TrendingUp size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.monthlyTrend')}
                                </h3>
                                <div className="flex items-end gap-2 h-36">
                                    {monthlyTrend.map((d, idx) => {
                                        const max = Math.max(...monthlyTrend.map(m => parseInt(m.total_revenue) || 0), 1);
                                        const pct = ((parseInt(d.total_revenue) || 0) / max) * 100;
                                        return (
                                            <div key={idx} className="flex flex-col items-center flex-1 min-w-0 group">
                                                <span className="text-[9px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {formatRevenue(d.total_revenue)}
                                                </span>
                                                <div className="w-full max-w-[36px] rounded-t-lg transition-all duration-500 hover:opacity-80"
                                                    style={{ height: `${Math.max(pct, 3)}%`, background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.primaryLight})` }} />
                                                <span className="text-[9px] text-gray-400 mt-1 truncate w-full text-center font-medium">
                                                    {(d.period || '').slice(5)}{t('sellerStatsPage.monthSuffix')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Category Distribution */}
                        {categoryDist.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                    <Package size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.popularCategory')}
                                </h3>
                                <div className="space-y-2.5">
                                    {categoryDist.slice(0, 8).map((cat, idx) => {
                                        const maxRevenue = Math.max(...categoryDist.map(c => parseInt(c.total_revenue) || 0), 1);
                                        const pct = ((parseInt(cat.total_revenue) || 0) / maxRevenue) * 100;
                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-gray-700 truncate">{cat.category}</span>
                                                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                                        {formatRevenue(cat.total_revenue)} · {t('sellerStatsPage.sellersLabel', { count: cat.seller_count })}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: COLORS.accent }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Region + Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Region Distribution */}
                        {regionDist.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                    <MapPin size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.regionRevenue')}
                                </h3>
                                <div className="space-y-2.5">
                                    {regionDist.slice(0, 10).map((r, idx) => {
                                        const maxRevenue = Math.max(...regionDist.map(x => parseInt(x.total_revenue) || 0), 1);
                                        const pct = ((parseInt(r.total_revenue) || 0) / maxRevenue) * 100;
                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-gray-700">{r.region}</span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {formatRevenue(r.total_revenue)} · {t('sellerStatsPage.sellersLabel', { count: r.seller_count })}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: '#10b981' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                <Activity size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.recentDataEntry')}
                            </h3>
                            <div className="space-y-2.5">
                                {recentActivity.slice(0, 6).map((act, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => fetchSellerDetail(act.user_id)}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                            style={{ background: COLORS.accent }}>
                                            {(act.brand_name || act.name || '?')[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 truncate">{act.brand_name || act.name}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{act.record_date} · {formatRevenue(act.monthly_revenue)}</p>
                                        </div>
                                        <RecordTypeBadge type={act.record_type} t={t} />
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">{t('sellerStatsPage.noRecentActivity')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Sellers Quick View */}
                    {topSellers.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                    <Award size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.topSellers')}
                                </h3>
                                <button onClick={() => setActiveTab('sellers')}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: COLORS.primaryBg, color: COLORS.primary }}>
                                    {t('sellerStatsPage.viewAll')}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                            <th className="pb-2 pl-2">#</th>
                                            <th className="pb-2">{t('sellerStatsPage.seller')}</th>
                                            <th className="pb-2 text-right">{t('sellerStatsPage.totalRevenueHeader')}</th>
                                            <th className="pb-2 text-right">{t('sellerStatsPage.avgRevenueHeader')}</th>
                                            <th className="pb-2 text-right hidden md:table-cell">{t('sellerStatsPage.customers')}</th>
                                            <th className="pb-2 text-right hidden md:table-cell">{t('sellerStatsPage.recordCount')}</th>
                                            <th className="pb-2 text-center">{t('sellerStatsPage.detail')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topSellers.slice(0, 5).map((seller, idx) => (
                                            <tr key={seller.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 pl-2">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 3 ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                                                        style={idx < 3 ? { background: [COLORS.primary, COLORS.accent, COLORS.accentLight][idx] } : {}}>
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <p className="font-bold text-gray-900 text-xs">{seller.brand_name || seller.name}</p>
                                                    <p className="text-[10px] text-gray-400">{seller.category || t('sellerStatsPage.uncategorized')}</p>
                                                </td>
                                                <td className="py-3 text-right font-extrabold text-gray-900 text-xs">{formatRevenue(seller.total_revenue)}</td>
                                                <td className="py-3 text-right text-xs font-bold text-gray-600">{formatRevenue(Math.round(seller.avg_revenue || 0))}</td>
                                                <td className="py-3 text-right text-xs text-gray-500 hidden md:table-cell">{t('sellerStatsPage.customersUnit', { count: parseInt(seller.total_customers || 0).toLocaleString() })}</td>
                                                <td className="py-3 text-right text-xs text-gray-500 hidden md:table-cell">{t('sellerStatsPage.recordsUnit', { count: seller.record_count })}</td>
                                                <td className="py-3 text-center">
                                                    <button onClick={() => fetchSellerDetail(seller.user_id)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: COLORS.primary }}>
                                                        <Eye size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ════ SELLERS RANKING TAB ════ */}
            {activeTab === 'sellers' && (
                <div className="space-y-5">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t('sellerStatsPage.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-indigo-400 outline-none" />
                    </div>

                    {/* Sellers Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-[10px] text-gray-400 uppercase tracking-wider">
                                        <th className="p-3">#</th>
                                        <th className="p-3">{t('sellerStatsPage.seller')}</th>
                                        <th className="p-3">{t('sellerStatsPage.categoryCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.totalRevenueCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.avgRevenueCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.customersCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.transactionsCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.recordCountCol')}</th>
                                        <th className="p-3 text-right">{t('sellerStatsPage.latestRecord')}</th>
                                        <th className="p-3 text-center">{t('sellerStatsPage.detail')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSellers.map((seller, idx) => (
                                        <tr key={seller.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-3">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 3 ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                                                    style={idx < 3 ? { background: ['#FFD700', '#C0C0C0', '#CD7F32'][idx] } : {}}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <p className="font-bold text-gray-900 text-xs">{seller.brand_name || seller.name}</p>
                                                <p className="text-[10px] text-gray-400">{seller.email}</p>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: COLORS.primaryBg, color: COLORS.primary }}>
                                                    {seller.category || t('sellerStatsPage.uncategorized')}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-extrabold text-gray-900 text-xs">{formatRevenue(seller.total_revenue)}</td>
                                            <td className="p-3 text-right text-xs font-bold text-gray-600">{formatRevenue(Math.round(seller.avg_revenue || 0))}</td>
                                            <td className="p-3 text-right text-xs text-gray-500">{parseInt(seller.total_customers || 0).toLocaleString()}</td>
                                            <td className="p-3 text-right text-xs text-gray-500">{parseInt(seller.total_transactions || 0).toLocaleString()}</td>
                                            <td className="p-3 text-right text-xs text-gray-500">{seller.record_count}</td>
                                            <td className="p-3 text-right text-[10px] text-gray-400">{seller.latest_record}</td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => fetchSellerDetail(seller.user_id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                    style={{ background: COLORS.primaryBg, color: COLORS.primary }}>
                                                    {t('sellerStatsPage.viewDetail')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredSellers.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                {searchQuery ? t('sellerStatsPage.noSearchResults') : t('sellerStatsPage.noSellerData')}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ════ INSIGHTS TAB ════ */}
            {activeTab === 'insights' && (
                <div className="space-y-5">
                    {/* Performance Alerts */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                            <Zap size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.performanceInsights')}
                        </h3>
                        <div className="space-y-3">
                            {isEmpty && (
                                <InsightCard
                                    icon={<Database size={14} />}
                                    title={t('sellerStatsPage.dataWaiting')}
                                    description={t('sellerStatsPage.dataWaitingDesc')}
                                    type="info"
                                />
                            )}
                            {sellerCount > 0 && (
                                <InsightCard
                                    icon={<Users size={14} />}
                                    title={t('sellerStatsPage.sellerParticipation')}
                                    description={t('sellerStatsPage.sellerParticipationDesc', { count: sellerCount })}
                                    type="info"
                                />
                            )}
                            {parseInt(totals.total_revenue || 0) > 0 && (
                                <InsightCard
                                    icon={<DollarSign size={14} />}
                                    title={t('sellerStatsPage.overallRevenue')}
                                    description={t('sellerStatsPage.overallRevenueDesc', { total: formatRevenue(totals.total_revenue), avg: formatRevenue(Math.round(totals.avg_revenue || 0)) })}
                                    type="success"
                                />
                            )}
                            {parseFloat(totals.avg_satisfaction || 0) > 0 && (
                                <InsightCard
                                    icon={<Star size={14} />}
                                    title={t('sellerStatsPage.avgOperSatisfaction')}
                                    description={t('sellerStatsPage.satisfactionDesc', {
                                        score: parseFloat(totals.avg_satisfaction).toFixed(1),
                                        level: parseFloat(totals.avg_satisfaction) >= 4
                                            ? t('sellerStatsPage.satisfactionHigh')
                                            : parseFloat(totals.avg_satisfaction) >= 3
                                                ? t('sellerStatsPage.satisfactionNormal')
                                                : t('sellerStatsPage.satisfactionNeedsImprovement')
                                    })}
                                    type={parseFloat(totals.avg_satisfaction) >= 4 ? 'success' : parseFloat(totals.avg_satisfaction) >= 3 ? 'info' : 'warning'}
                                />
                            )}
                            {topSellers.length > 0 && (
                                <InsightCard
                                    icon={<Award size={14} />}
                                    title={t('sellerStatsPage.topRevenueSellerInsight')}
                                    description={t('sellerStatsPage.topSellerDesc', { name: topSellers[0].brand_name || topSellers[0].name, revenue: formatRevenue(topSellers[0].total_revenue) })}
                                    type="success"
                                />
                            )}
                            {categoryDist.length > 0 && (
                                <InsightCard
                                    icon={<Package size={14} />}
                                    title={t('sellerStatsPage.popularCategoryInsight')}
                                    description={t('sellerStatsPage.popularCategoryDesc', { category: categoryDist[0].category, count: categoryDist[0].seller_count })}
                                    type="info"
                                />
                            )}
                            {regionDist.length > 0 && (
                                <InsightCard
                                    icon={<MapPin size={14} />}
                                    title={t('sellerStatsPage.hotRegion')}
                                    description={t('sellerStatsPage.hotRegionDesc', { region: regionDist[0].region, revenue: formatRevenue(regionDist[0].total_revenue) })}
                                    type="info"
                                />
                            )}
                        </div>
                    </div>

                    {/* Data Health */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                            <Activity size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.dataHealth')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <DataHealthCard label={t('sellerStatsPage.dailyRecords')} value={t('sellerStatsPage.recordsUnit', { count: parseInt(typeSummary.daily?.count || 0) })} color="bg-blue-50 text-blue-600" />
                            <DataHealthCard label={t('sellerStatsPage.monthlyRecords')} value={t('sellerStatsPage.recordsUnit', { count: parseInt(typeSummary.monthly?.count || 0) })} color="bg-emerald-50 text-emerald-600" />
                            <DataHealthCard label={t('sellerStatsPage.annualRecords')} value={t('sellerStatsPage.recordsUnit', { count: parseInt(typeSummary.annual?.count || 0) })} color="bg-amber-50 text-amber-600" />
                            <DataHealthCard label={t('sellerStatsPage.categoryCount')} value={t('sellerStatsPage.countUnit', { count: categoryDist.length })} color="bg-violet-50 text-violet-600" />
                        </div>
                    </div>

                    {/* Revenue Comparison by Category */}
                    {categoryDist.length > 1 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                <BarChart3 size={16} style={{ color: COLORS.primary }} />{t('sellerStatsPage.revenueByCategoryComparison')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {categoryDist.map((cat, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                                        <p className="text-xs font-bold text-gray-700 mb-1 truncate">{cat.category}</p>
                                        <p className="text-sm font-extrabold text-gray-900">{formatRevenue(cat.total_revenue)}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{t('sellerStatsPage.sellersAndRecords', { sellers: cat.seller_count, records: cat.count })}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ════ SELLER DETAIL MODAL ════ */}
            {selectedSeller && sellerDetail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setSelectedSeller(null); setSellerDetail(null); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="p-5 text-white flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                            <div>
                                <h2 className="font-extrabold text-lg">{sellerDetail.seller?.brand_name || sellerDetail.seller?.name || t('sellerStatsPage.sellerModalDefault')}</h2>
                                <p className="text-xs text-indigo-200">{sellerDetail.seller?.email} · {sellerDetail.seller?.category || t('sellerStatsPage.uncategorized')}</p>
                            </div>
                            <button onClick={() => { setSelectedSeller(null); setSellerDetail(null); }} className="text-white/80 hover:text-white"><X size={22} /></button>
                        </div>

                        {/* Summary */}
                        <div className="p-5 space-y-4">
                            {/* Type Summary KPIs */}
                            <div className="grid grid-cols-3 gap-3">
                                {['daily', 'monthly', 'annual'].map(type => {
                                    const s = (sellerDetail.summary || {})[type] || {};
                                    const labels = { daily: t('sellerStatsPage.daily'), monthly: t('sellerStatsPage.monthly'), annual: t('sellerStatsPage.annual') };
                                    const colors = { daily: 'bg-blue-50 text-blue-600', monthly: 'bg-emerald-50 text-emerald-600', annual: 'bg-amber-50 text-amber-600' };
                                    return (
                                        <div key={type} className="p-3 rounded-xl bg-gray-50">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[type]}`}>{labels[type]}</span>
                                            <p className="text-sm font-extrabold text-gray-900 mt-2">{parseInt(s.total_revenue || 0) > 0 ? formatRevenue(s.total_revenue) : '-'}</p>
                                            <p className="text-[10px] text-gray-400">{t('sellerStatsPage.sellerDetailRecordCount', { count: parseInt(s.count || 0) })}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Records List */}
                            <div>
                                <h4 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar size={14} style={{ color: COLORS.primary }} />{t('sellerStatsPage.allRecords', { count: (sellerDetail.stats || []).length })}
                                </h4>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {(sellerDetail.stats || []).map(record => (
                                        <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <RecordTypeBadge type={record.record_type} t={t} />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{record.record_date}</p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {record.venue_type || ''} {record.region ? `· ${record.region}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-extrabold text-gray-900">{parseInt(record.monthly_revenue) > 0 ? formatRevenue(record.monthly_revenue) : '-'}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                    {parseInt(record.customer_count) > 0 && <span>{t('sellerStatsPage.customersUnit', { count: parseInt(record.customer_count).toLocaleString() })}</span>}
                                                    {parseInt(record.transaction_count) > 0 && <span>{t('sellerStatsPage.recordsUnit', { count: parseInt(record.transaction_count).toLocaleString() })}</span>}
                                                    {record.best_selling_item && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold">{record.best_selling_item}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!sellerDetail.stats || sellerDetail.stats.length === 0) && (
                                        <p className="text-sm text-gray-400 text-center py-4">{t('sellerStatsPage.noRecordedData')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary }} />
                </div>
            )}
        </div>
    );
};

// ── Sub Components ──
const KPICard = ({ label, value, icon }) => (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-1 text-indigo-200">{icon}<span className="text-[10px] font-bold">{label}</span></div>
        <p className="text-xl font-extrabold">{value}</p>
    </div>
);

const RecordTypeBadge = ({ type, t }) => {
    const styles = { daily: 'bg-blue-50 text-blue-600', monthly: 'bg-emerald-50 text-emerald-600', annual: 'bg-amber-50 text-amber-600' };
    const labelKeys = { daily: 'sellerStatsPage.daily', monthly: 'sellerStatsPage.monthly', annual: 'sellerStatsPage.annual' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[type] || 'bg-gray-50 text-gray-500'}`}>{t(labelKeys[type]) || type}</span>;
};

const InsightCard = ({ icon, title, description, type }) => {
    const styles = {
        info: 'bg-blue-50 border-blue-100 text-blue-700',
        success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        warning: 'bg-amber-50 border-amber-100 text-amber-700',
    };
    return (
        <div className={`p-3 rounded-xl border ${styles[type] || styles.info}`}>
            <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">{icon}</div>
                <div>
                    <p className="text-xs font-bold">{title}</p>
                    <p className="text-[11px] opacity-80">{description}</p>
                </div>
            </div>
        </div>
    );
};

const DataHealthCard = ({ label, value, color }) => (
    <div className={`p-3 rounded-xl ${color.split(' ')[0]}`}>
        <p className={`text-[10px] font-bold ${color.split(' ')[1]} mb-0.5`}>{label}</p>
        <p className="text-sm font-extrabold text-gray-900">{value}</p>
    </div>
);

export default AdminSellerStats;
