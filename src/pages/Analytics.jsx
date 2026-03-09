import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, MapPin, Store, Users, DollarSign, Tag, Activity, ArrowUp, ArrowDown, Minus, Building, Layers, PieChart, ChevronDown, ArrowUpDown, Search, ShoppingBag, Smile, Star, Package } from 'lucide-react';

const API_BASE = '/api';

// ── Color Palette (#6d69f1 Purple Theme — matches AdminDashboard) ──
const COLORS = {
    primary: '#5551e8',
    primaryLight: '#6d69f1',
    primaryBg: '#EEEDFD',
    accent: '#6d69f1',
    accentLight: '#9B98F5',
    dark: '#2d2b6e',
};

// Simple horizontal bar chart component
const HBarChart = ({ data, valueKey, labelKey = 'label', unit = '', maxItems = 10, formatValue, t }) => {
    const items = data.slice(0, maxItems);
    const maxVal = Math.max(...items.map(d => d[valueKey] || 0), 1);

    return (
        <div className="space-y-2.5">
            {items.map((item, idx) => {
                const val = item[valueKey] || 0;
                const pct = (val / maxVal) * 100;
                const displayVal = formatValue ? formatValue(val) : `${val.toLocaleString()}${unit}`;
                return (
                    <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-700 truncate max-w-[60%]">
                                {idx + 1}. {item[labelKey]}
                                {item.count !== undefined && <span className="text-gray-400 font-normal ml-1">({t('analyticsPage.unitItems', { count: item.count })})</span>}
                            </span>
                            <span className="text-xs font-bold text-gray-800">{displayVal}</span>
                        </div>
                        <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${Math.max(pct, 2)}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentLight})` }}
                            />
                        </div>
                    </div>
                );
            })}
            {items.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">{t('analyticsPage.noData')}</p>
            )}
        </div>
    );
};

// Vertical bar chart
const VBarChart = ({ data, valueKey, labelKey = 'label' }) => {
    const maxVal = Math.max(...data.map(d => d[valueKey] || 0), 1);

    return (
        <div className="flex items-end justify-center gap-2 h-40 pt-4">
            {data.map((item, idx) => {
                const val = item[valueKey] || 0;
                const pct = (val / maxVal) * 100;
                return (
                    <div key={idx} className="flex flex-col items-center flex-1 min-w-0 group">
                        <span className="text-[10px] font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}
                        </span>
                        <div
                            className="w-full max-w-[40px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-80"
                            style={{ height: `${Math.max(pct, 4)}%`, background: `linear-gradient(0deg, ${COLORS.primary}, ${COLORS.accentLight})` }}
                        />
                        <span className="text-[10px] text-gray-500 mt-1.5 truncate w-full text-center font-medium">
                            {item[labelKey]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const Analytics = () => {
    const { t } = useTranslation('seller');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [expandedRegions, setExpandedRegions] = useState(new Set());

    const [districtSort, setDistrictSort] = useState({});
    const [selectedRegions, setSelectedRegions] = useState(new Set());

    // Seller insights data
    const [sellerData, setSellerData] = useState(null);
    const [sellerLoading, setSellerLoading] = useState(false);

    const toggleSelectedRegion = (label) => {
        setSelectedRegions(prev => {
            const next = new Set(prev);
            if (next.has(label)) next.delete(label);
            else next.add(label);
            return next;
        });
    };

    const toggleRegion = (label) => {
        setExpandedRegions(prev => {
            const next = new Set(prev);
            if (next.has(label)) next.delete(label);
            else next.add(label);
            return next;
        });
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(() => { fetchAnalytics(true); }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAnalytics = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await fetch(`${API_BASE}/venues/venue_analytics.php`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setLastUpdated(new Date());
                setError(null);
            } else {
                if (!silent) setError(json.message || t('analyticsPage.loadFailed'));
            }
        } catch (err) {
            if (!silent) setError(t('analyticsPage.serverFailed'));
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchSellerInsights = async () => {
        try {
            setSellerLoading(true);
            const res = await fetch(`${API_BASE}/users/seller_stats_public.php`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) setSellerData(json.data);
        } catch { /* ignored */ }
        finally { setSellerLoading(false); }
    };

    useEffect(() => {
        if (activeTab === 'seller' && !sellerData) fetchSellerInsights();
    }, [activeTab]);

    const formatPrice = (val) => {
        if (val >= 10000) return `${(val / 10000).toFixed(0)}${t('analyticsPage.unitMan')}`;
        return `${val.toLocaleString()}`;
    };

    const formatSales = (val) => {
        if (val >= 10000) return `${(val / 10000).toFixed(1)}${t('analyticsPage.unitEok')}`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}${t('analyticsPage.unitCheonman')}`;
        return `${val.toLocaleString()}${t('analyticsPage.unitMan')}`;
    };

    const typeLabels = {
        popup: t('analyticsPage.typePopup'),
        fleamarket: t('analyticsPage.typeFleamarket'),
        gallery: t('analyticsPage.typeGallery'),
        cafe: t('analyticsPage.typeCafe'),
        showroom: t('analyticsPage.typeShowroom'),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary }}></div>
                    <p className="text-gray-500 font-medium">{t('analyticsPage.loadingData')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-bold text-lg mb-2">{t('analyticsPage.errorOccurred')}</p>
                    <p className="text-red-500 text-sm">{error}</p>
                    <button onClick={fetchAnalytics} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                        {t('analyticsPage.retry')}
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { summary, priceByRegion, priceByType, priceBySize, commission, topCategories, salesByRegion, salesByType, priceDistribution, monthlyTrend, venuesByRegion, districtStats, topCustomerTypes, customersByRegion, priceByCustomer, salesByCustomer } = data;

    const tabs = [
        { key: 'overview', label: t('analyticsPage.tabOverview'), icon: Activity },
        { key: 'region', label: t('analyticsPage.tabRegion'), icon: MapPin },
        { key: 'price', label: t('analyticsPage.tabPrice'), icon: DollarSign },
        { key: 'sales', label: t('analyticsPage.tabSales'), icon: TrendingUp },
        { key: 'category', label: t('analyticsPage.tabCategory'), icon: Tag },
        { key: 'customer', label: t('analyticsPage.tabCustomer'), icon: Users },
        { key: 'seller', label: t('analyticsPage.tabSeller'), icon: ShoppingBag },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fadeIn pb-24">
            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('analyticsPage.title')}</h1>
                        <p className="text-sm text-gray-500 mt-1">{t('analyticsPage.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.accent }}></span>
                            {t('analyticsPage.realtime')} ·
                            {lastUpdated && (
                                <span>{t('analyticsPage.lastUpdated', { time: lastUpdated.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) })}</span>
                            )}
                        </div>
                        <button
                            onClick={() => fetchAnalytics(true)}
                            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
                            style={{ '--hover-color': COLORS.primary }}
                            title="Refresh"
                        >
                            <Activity size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Summary KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Highlighted first card */}
                <div className="p-5 rounded-2xl text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }}>
                    <div className="absolute top-3 right-0 opacity-10">
                        <Building size={70} className="translate-x-3 -translate-y-2" />
                    </div>
                    <span className="text-indigo-100 text-xs font-bold">{t('analyticsPage.totalVenues')}</span>
                    <p className="text-3xl font-extrabold mt-2 relative z-10">{summary.totalVenues}</p>
                    <p className="text-indigo-200 text-xs mt-1">{t('analyticsPage.activeVenues')}</p>
                </div>

                <SummaryCard label={t('analyticsPage.avgPrice')} value={formatPrice(summary.avgPrice)} sub={t('analyticsPage.avgPriceSub')} icon={<DollarSign size={16} />} />
                <SummaryCard label={t('analyticsPage.avgSales')} value={summary.salesDataCount > 0 ? formatSales(summary.avgSales) : '-'} sub={t('analyticsPage.salesDataCount', { count: summary.salesDataCount })} icon={<TrendingUp size={16} />} />
                <SummaryCard label={t('analyticsPage.avgCommission')} value={`${summary.avgCommission}%`} sub={t('analyticsPage.commissionRange', { min: commission.min, max: commission.max })} icon={<PieChart size={16} />} />
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                                ? 'text-white shadow-lg'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            style={activeTab === tab.key ? { background: COLORS.primary, boxShadow: `0 4px 14px ${COLORS.primaryBg}` } : {}}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ════ Tab Content ════ */}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Monthly Trend */}
                    <Card title={t('analyticsPage.monthlyTrend')} icon={<Activity size={18} />}>
                        {monthlyTrend.length > 0 ? (
                            <VBarChart data={monthlyTrend} valueKey="count" labelKey="month" />
                        ) : <EmptyState t={t} />}
                    </Card>

                    {/* Price distribution */}
                    <Card title={t('analyticsPage.priceDistribution')} icon={<Layers size={18} />}>
                        <VBarChart data={priceDistribution} valueKey="count" labelKey="label" />
                    </Card>

                    {/* Top Categories */}
                    <Card title={t('analyticsPage.topCategories')} icon={<Tag size={18} />}>
                        <HBarChart data={topCategories} valueKey="count" unit={t('analyticsPage.categoryUnit')} t={t} />
                    </Card>

                    {/* Commission Info */}
                    <Card title={t('analyticsPage.commissionStatus')} icon={<PieChart size={18} />}>
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1 text-indigo-600">
                                    <ArrowDown size={14} />
                                    <span className="text-xs font-bold">{t('analyticsPage.commMin')}</span>
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{commission.min}%</p>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1 text-indigo-600">
                                    <Minus size={14} />
                                    <span className="text-xs font-bold">{t('analyticsPage.commAvg')}</span>
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{commission.avg}%</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
                                    <ArrowUp size={14} />
                                    <span className="text-xs font-bold">{t('analyticsPage.commMax')}</span>
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{commission.max}%</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center">{t('analyticsPage.commTotal', { count: commission.count })}</p>
                    </Card>
                </div>
            )}

            {activeTab === 'price' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Card title={t('analyticsPage.priceByRegion')} icon={<MapPin size={18} />}>
                        <HBarChart data={priceByRegion} valueKey="avgPrice" formatValue={formatPrice} t={t} />
                    </Card>
                    <Card title={t('analyticsPage.priceByType')} icon={<Store size={18} />}>
                        <HBarChart data={priceByType.map(d => ({ ...d, label: typeLabels[d.label] || d.label }))} valueKey="avgPrice" formatValue={formatPrice} t={t} />
                    </Card>
                    <Card title={t('analyticsPage.priceBySize')} icon={<Layers size={18} />}>
                        <HBarChart data={priceBySize} valueKey="avgPrice" formatValue={formatPrice} t={t} />
                    </Card>
                    <Card title={t('analyticsPage.priceDistribution')} icon={<BarChart3 size={18} />}>
                        <VBarChart data={priceDistribution} valueKey="count" labelKey="label" />
                    </Card>
                </div>
            )}

            {activeTab === 'sales' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Sales summary hero */}
                    <div className="lg:col-span-2 rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <TrendingUp size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold">{t('analyticsPage.salesSummary')}</h3>
                                <p className="text-xs text-indigo-200">{t('analyticsPage.salesSummaryDesc')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-xs text-indigo-200 mb-1">{t('analyticsPage.dataCount')}</p>
                                <p className="text-xl font-extrabold">{t('analyticsPage.dataCountUnit', { count: summary.salesDataCount })}</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-xs text-indigo-200 mb-1">{t('analyticsPage.overallAvgSales')}</p>
                                <p className="text-xl font-extrabold">{summary.salesDataCount > 0 ? formatSales(summary.avgSales) : '-'}</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-xs text-indigo-200 mb-1">{t('analyticsPage.dataRatio')}</p>
                                <p className="text-xl font-extrabold">
                                    {summary.totalVenues > 0 ? Math.round((summary.salesDataCount / summary.totalVenues) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <Card title={t('analyticsPage.salesByRegion')} icon={<MapPin size={18} />}>
                        <HBarChart data={salesByRegion} valueKey="avgSales" formatValue={formatSales} t={t} />
                    </Card>
                    <Card title={t('analyticsPage.salesByType')} icon={<Store size={18} />}>
                        <HBarChart data={salesByType.map(d => ({ ...d, label: typeLabels[d.label] || d.label }))} valueKey="avgSales" formatValue={formatSales} t={t} />
                    </Card>
                </div>
            )}

            {activeTab === 'region' && (
                <div className="space-y-5">
                    {/* Region venue count */}
                    <Card title={t('analyticsPage.venuesByRegion')} icon={<MapPin size={18} />} extra={<span className="text-xs text-gray-400">{t('analyticsPage.totalVenuesCount', { count: summary.totalVenues })}</span>}>
                        <HBarChart data={venuesByRegion || []} valueKey="count" unit={t('analyticsPage.categoryUnit')} t={t} />
                    </Card>

                    {/* Region Filter Chips */}
                    {venuesByRegion && venuesByRegion.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Search size={14} style={{ color: COLORS.primary }} />
                                <span className="text-xs font-bold text-gray-700">{t('analyticsPage.regionFilter')}</span>
                                <span className="text-[10px] text-gray-400 ml-1">
                                    {selectedRegions.size === 0 ? t('analyticsPage.allShowing') : t('analyticsPage.regionsSelected', { count: selectedRegions.size })}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    onClick={() => setSelectedRegions(new Set())}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegions.size === 0
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    style={selectedRegions.size === 0 ? { background: COLORS.primary } : {}}
                                >
                                    {t('analyticsPage.all')}
                                </button>
                                {venuesByRegion.map((r, ri) => {
                                    const isSelected = selectedRegions.has(r.label);
                                    return (
                                        <button
                                            key={ri}
                                            onClick={() => toggleSelectedRegion(r.label)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected
                                                ? 'text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            style={isSelected ? { background: COLORS.primary } : {}}
                                        >
                                            {r.label}
                                            <span className={`ml-1 text-[10px] ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>({r.count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Region detail cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {(venuesByRegion || []).filter(r => selectedRegions.size === 0 || selectedRegions.has(r.label)).map((region, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div
                                    className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => toggleRegion(region.label)}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50">
                                            <MapPin size={14} className="text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-gray-900 text-sm">{region.label}</h4>
                                            <p className="text-xs text-gray-400">{t('analyticsPage.numVenues', { count: region.count })}</p>
                                        </div>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandedRegions.has(region.label) ? 'rotate-180' : ''}`} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-indigo-50 rounded-xl p-3">
                                            <p className="text-[10px] font-bold mb-0.5 text-indigo-600">{t('analyticsPage.avgPriceLabel')}</p>
                                            <p className="text-sm font-extrabold text-gray-900">{region.avgPrice > 0 ? formatPrice(region.avgPrice) : '-'}</p>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-3">
                                            <p className="text-[10px] text-amber-600 font-bold mb-0.5">{t('analyticsPage.avgSalesLabel')}</p>
                                            <p className="text-sm font-extrabold text-gray-900">{region.avgSales > 0 ? formatSales(region.avgSales) : '-'}</p>
                                        </div>
                                    </div>
                                    {region.topCategories && region.topCategories.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-[10px] text-gray-500 font-bold mb-1.5">{t('analyticsPage.topCategoriesLabel')}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {region.topCategories.map((cat, ci) => (
                                                    <span key={ci} className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-600">{cat}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {region.topTypes && region.topTypes.length > 0 && (
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold mb-1.5">{t('analyticsPage.topTypesLabel')}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {region.topTypes.map((tp, ti) => (
                                                    <span key={ti} className="inline-block px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-medium rounded-full">
                                                        {typeLabels[tp] || tp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {expandedRegions.has(region.label) && districtStats && districtStats[region.label] && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t('analyticsPage.districtDetail')}</p>
                                            <div className="flex gap-1">
                                                {[
                                                    { key: 'name', label: t('analyticsPage.sortName') },
                                                    { key: 'count', label: t('analyticsPage.sortCount') },
                                                    { key: 'price', label: t('analyticsPage.sortPrice') },
                                                    { key: 'sales', label: t('analyticsPage.sortSales') },
                                                ].map(s => {
                                                    const currentSort = districtSort[region.label];
                                                    const isActive = currentSort?.key === s.key;
                                                    const isDesc = isActive && currentSort?.desc;
                                                    return (
                                                        <button
                                                            key={s.key}
                                                            onClick={() => setDistrictSort(prev => ({
                                                                ...prev,
                                                                [region.label]: { key: s.key, desc: isActive ? !currentSort.desc : true }
                                                            }))}
                                                            className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${isActive
                                                                ? 'text-white'
                                                                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            style={isActive ? { background: COLORS.primary } : {}}
                                                        >
                                                            {s.label}
                                                            {isActive && (isDesc ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}
                                                            {!isActive && <ArrowUpDown size={10} className="opacity-40" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            {[...districtStats[region.label]].sort((a, b) => {
                                                const sort = districtSort[region.label];
                                                if (!sort) return 0;
                                                const dir = sort.desc ? -1 : 1;
                                                switch (sort.key) {
                                                    case 'name': return dir * a.label.localeCompare(b.label, 'ko');
                                                    case 'count': return dir * ((a.count || 0) - (b.count || 0));
                                                    case 'price': return dir * ((a.avgPrice || 0) - (b.avgPrice || 0));
                                                    case 'sales': return dir * ((a.avgSales || 0) - (b.avgSales || 0));
                                                    default: return 0;
                                                }
                                            }).map((d, di) => (
                                                <div key={di} className="bg-white rounded-xl p-3.5 border border-gray-100">
                                                    {/* District name + count */}
                                                    <div className="flex items-center justify-between mb-2.5">
                                                        <span className="font-bold text-sm text-gray-900">{d.label}</span>
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{t('analyticsPage.numVenues', { count: d.count })}</span>
                                                    </div>
                                                    {/* Price + Sales row */}
                                                    <div className="grid grid-cols-2 gap-2 mb-2.5">
                                                        <div className="bg-indigo-50 rounded-lg p-2.5">
                                                            <p className="text-[10px] font-bold mb-0.5 text-indigo-600">{t('analyticsPage.avgPriceLabel')}</p>
                                                            <p className="text-sm font-extrabold text-gray-900">{d.avgPrice > 0 ? formatPrice(d.avgPrice) : '-'}</p>
                                                        </div>
                                                        <div className="bg-amber-50 rounded-lg p-2.5">
                                                            <p className="text-[10px] text-amber-600 font-bold mb-0.5">{t('analyticsPage.avgSalesLabel')}</p>
                                                            <p className="text-sm font-extrabold text-gray-900">{d.avgSales > 0 ? formatSales(d.avgSales) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    {/* Customer tags */}
                                                    {(d.topCustomers || []).length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span className="text-[10px] text-gray-400 font-bold mr-0.5 self-center">{t('analyticsPage.customerLayer')}</span>
                                                            {d.topCustomers.map((c, ci) => (
                                                                <span key={ci} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700">{c}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Region comparisons */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <Card title={t('analyticsPage.priceByRegion')} icon={<DollarSign size={18} />}>
                            <HBarChart data={priceByRegion} valueKey="avgPrice" formatValue={formatPrice} t={t} />
                        </Card>
                        <Card title={t('analyticsPage.salesByRegion')} icon={<TrendingUp size={18} />}>
                            <HBarChart data={salesByRegion} valueKey="avgSales" formatValue={formatSales} t={t} />
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'category' && (
                <Card title={t('analyticsPage.categoryRanking')} icon={<Tag size={18} />} extra={<span className="text-xs text-gray-400">{t('analyticsPage.categoryRankingDesc')}</span>}>
                    <HBarChart data={topCategories} valueKey="count" unit={t('analyticsPage.categoryUnit')} t={t} />
                </Card>
            )}

            {activeTab === 'customer' && (
                <div className="space-y-5">
                    {/* Hero */}
                    <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                        <div className="absolute -right-6 -bottom-6 opacity-10"><Users size={100} /></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Users size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-extrabold text-sm md:text-base">{t('analyticsPage.customerAnalysis')}</h3>
                                <p className="text-[11px] md:text-xs text-indigo-200">{t('analyticsPage.customerAnalysisDesc')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-[10px] text-indigo-200 font-bold mb-0.5">{t('analyticsPage.customerTypes')}</p>
                                <p className="text-lg font-extrabold">{t('analyticsPage.customerTypeCount', { count: (topCustomerTypes || []).length })}</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-[10px] text-indigo-200 font-bold mb-0.5">{t('analyticsPage.dataRegions')}</p>
                                <p className="text-lg font-extrabold">{t('analyticsPage.customerTypeCount', { count: customersByRegion ? Object.keys(customersByRegion).length : 0 })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Type Distribution */}
                    <Card title={t('analyticsPage.customerDistribution')} icon={<Users size={16} />}>
                        <HBarChart data={topCustomerTypes || []} valueKey="count" unit={t('analyticsPage.categoryUnit')} t={t} />
                    </Card>

                    {/* Price & Sales by Customer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card title={t('analyticsPage.priceByCustomer')} icon={<DollarSign size={16} />}>
                            <HBarChart data={priceByCustomer || []} valueKey="avgPrice" formatValue={formatPrice} t={t} />
                        </Card>
                        <Card title={t('analyticsPage.salesByCustomer')} icon={<TrendingUp size={16} />}>
                            <HBarChart data={salesByCustomer || []} valueKey="avgSales" formatValue={formatSales} t={t} />
                        </Card>
                    </div>

                    {/* Customers by Region */}
                    <Card title={t('analyticsPage.customerByRegion')} icon={<MapPin size={16} />}>
                        {customersByRegion && Object.keys(customersByRegion).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(customersByRegion).map(([region, custs]) => (
                                    <div key={region} className="bg-gray-50 rounded-xl p-3">
                                        <div className="flex items-center gap-1.5 mb-2.5">
                                            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: COLORS.primaryBg }}>
                                                <MapPin size={10} style={{ color: COLORS.primary }} />
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-xs truncate">{region}</h4>
                                        </div>
                                        <div className="space-y-1.5">
                                            {custs.map((c, ci) => {
                                                const maxCount = custs[0]?.count || 1;
                                                return (
                                                    <div key={ci}>
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-[11px] font-medium text-gray-700 truncate mr-2">{c.label}</span>
                                                            <span className="text-[10px] font-bold flex-shrink-0" style={{ color: COLORS.primary }}>{c.count}</span>
                                                        </div>
                                                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{ width: `${(c.count / maxCount) * 100}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentLight})` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState t={t} />}
                    </Card>
                </div>
            )}

            {/* Footer */}

            {activeTab === 'seller' && (
                sellerLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary }}></div>
                    </div>
                ) : !sellerData || sellerData.summary.totalSellers === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400">{t('analyticsPage.noSellerData')}</h3>
                        <p className="text-sm text-gray-400 mt-1">{t('analyticsPage.noSellerDataDesc')}</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Hero Summary */}
                        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, #059669, ${COLORS.dark})` }}>
                            <div className="absolute -right-8 -bottom-8 opacity-10">
                                <TrendingUp size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold">{t('analyticsPage.sellerInsight')}</h3>
                                    <p className="text-xs text-emerald-200">{t('analyticsPage.sellerInsightDesc')}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-xs text-emerald-200 mb-0.5">{t('analyticsPage.participatingSellers')}</p>
                                    <p className="text-xl font-extrabold">{t('analyticsPage.sellerCount', { count: sellerData.summary.totalSellers })}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-xs text-emerald-200 mb-0.5">{t('analyticsPage.overallAvgRevenue')}</p>
                                    <p className="text-xl font-extrabold">{sellerData.summary.avgRevenue > 0 ? formatPrice(sellerData.summary.avgRevenue) : '-'}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-xs text-emerald-200 mb-0.5">{t('analyticsPage.avgOrderValue')}</p>
                                    <p className="text-xl font-extrabold">{sellerData.summary.avgUnitPrice > 0 ? formatPrice(sellerData.summary.avgUnitPrice) : '-'}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-xs text-emerald-200 mb-0.5">{t('analyticsPage.recordCount')}</p>
                                    <p className="text-xl font-extrabold">{t('analyticsPage.recordCountUnit', { count: sellerData.summary.totalRecords })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Category Revenue */}
                            <Card title={t('analyticsPage.categoryAvgRevenue')} icon={<Tag size={18} />} extra={<span className="text-xs text-gray-400">{t('analyticsPage.minDataNotice')}</span>}>
                                {sellerData.byCategory.length > 0 ? (
                                    <HBarChart data={sellerData.byCategory} valueKey="avgRevenue" formatValue={formatPrice} t={t} />
                                ) : <EmptyState t={t} />}
                            </Card>

                            {/* Region Revenue */}
                            <Card title={t('analyticsPage.regionAvgRevenue')} icon={<MapPin size={18} />}>
                                {sellerData.byRegion.length > 0 ? (
                                    <HBarChart data={sellerData.byRegion} valueKey="avgRevenue" formatValue={formatPrice} t={t} />
                                ) : <EmptyState t={t} />}
                            </Card>

                            {/* Venue Type Revenue */}
                            <Card title={t('analyticsPage.venueTypeAvgRevenue')} icon={<Store size={18} />}>
                                {sellerData.byVenueType.length > 0 ? (
                                    <HBarChart data={sellerData.byVenueType} valueKey="avgRevenue" formatValue={formatPrice} t={t} />
                                ) : <EmptyState t={t} />}
                            </Card>

                            {/* Revenue Distribution */}
                            <Card title={t('analyticsPage.revenueDistribution')} icon={<BarChart3 size={18} />}>
                                {sellerData.revenueDistribution.length > 0 ? (
                                    <VBarChart data={sellerData.revenueDistribution} valueKey="count" labelKey="label" />
                                ) : <EmptyState t={t} />}
                            </Card>
                        </div>

                        {/* Monthly Trend */}
                        {sellerData.monthlyTrend.length > 0 && (
                            <Card title={t('analyticsPage.monthlyRevenueTrend')} icon={<TrendingUp size={18} />}>
                                <VBarChart data={sellerData.monthlyTrend.map(d => ({ ...d, label: d.month }))} valueKey="avgRevenue" labelKey="label" />
                            </Card>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Satisfaction */}
                            {sellerData.satisfactionByType.length > 0 && (
                                <Card title={t('analyticsPage.satisfactionByType')} icon={<Smile size={18} />}>
                                    <div className="space-y-3">
                                        {sellerData.satisfactionByType.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(n => (
                                                            <Star key={n} size={14} className={n <= Math.round(item.avgSatisfaction) ? 'text-yellow-400' : 'text-gray-200'} fill={n <= Math.round(item.avgSatisfaction) ? 'currentColor' : 'none'} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600">{item.avgSatisfaction}</span>
                                                    <span className="text-[10px] text-gray-400">({t('analyticsPage.recordCountUnit', { count: item.count })})</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Top Keywords */}
                            {sellerData.topKeywords.length > 0 && (
                                <Card title={t('analyticsPage.topKeywords')} icon={<Package size={18} />}>
                                    <div className="flex flex-wrap gap-2">
                                        {sellerData.topKeywords.map((kw, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                                                style={{
                                                    background: idx < 3 ? COLORS.primaryBg : '#f3f4f6',
                                                    color: idx < 3 ? COLORS.primary : '#6b7280',
                                                    fontSize: idx < 3 ? '13px' : '11px',
                                                }}
                                            >
                                                {kw.label}
                                                <span className="text-[10px] opacity-60">({kw.count})</span>
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Privacy Notice */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                            <p className="text-xs text-emerald-700 font-medium">
                                {t('analyticsPage.privacyNotice')}
                            </p>
                        </div>
                    </div>
                )
            )}

            <div className="mt-8 mb-4 text-center">
                <p className="text-xs text-gray-400">
                    {t('analyticsPage.footerNotice')}
                </p>
            </div>
        </div>
    );
};

// ── Reusable Card Component ──
const Card = ({ title, icon, extra, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-5">
            <span className="text-indigo-600">{icon}</span>
            <h3 className="font-extrabold text-gray-900">{title}</h3>
            {extra && <span className="ml-auto">{extra}</span>}
        </div>
        {children}
    </div>
);

// ── Summary Card Component ──
const SummaryCard = ({ label, value, sub, icon }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-400">{label}</span>
        </div>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
);

// ── Empty State ──
const EmptyState = ({ t }) => (
    <p className="text-center text-gray-400 text-sm py-8">{t('analyticsPage.noData')}</p>
);

export default Analytics;
