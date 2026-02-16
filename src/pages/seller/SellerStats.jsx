import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    TrendingUp, Plus, X, Edit3, Trash2, Calendar, DollarSign,
    Users, ShoppingCart, Star, MapPin, Store, FileText, Save,
    BarChart3, Package, Clock, CalendarDays, CalendarRange,
    ChevronDown, ArrowUp, ArrowDown, Target, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE = '/api/users';

const COLORS = {
    primary: '#059669',
    primaryLight: '#10b981',
    primaryBg: '#ecfdf5',
    accent: '#0d9488',
    dark: '#064e3b',
};

const SellerStats = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation('seller');

    // ── Product Category Options (15 + Other) ──
    const PRODUCT_CATEGORIES = [
        { value: t('statsPage.catFashion'), label: t('statsPage.catFashion') },
        { value: t('statsPage.catAccessory'), label: t('statsPage.catAccessory') },
        { value: t('statsPage.catBeauty'), label: t('statsPage.catBeauty') },
        { value: t('statsPage.catHandmade'), label: t('statsPage.catHandmade') },
        { value: t('statsPage.catFood'), label: t('statsPage.catFood') },
        { value: t('statsPage.catLiving'), label: t('statsPage.catLiving') },
        { value: t('statsPage.catArt'), label: t('statsPage.catArt') },
        { value: t('statsPage.catDigital'), label: t('statsPage.catDigital') },
        { value: t('statsPage.catCandle'), label: t('statsPage.catCandle') },
        { value: t('statsPage.catFlower'), label: t('statsPage.catFlower') },
        { value: t('statsPage.catVintage'), label: t('statsPage.catVintage') },
        { value: t('statsPage.catKids'), label: t('statsPage.catKids') },
        { value: t('statsPage.catPet'), label: t('statsPage.catPet') },
        { value: t('statsPage.catStationery'), label: t('statsPage.catStationery') },
        { value: t('statsPage.catHealth'), label: t('statsPage.catHealth') },
        { value: 'other', label: t('statsPage.catOtherInput') },
    ];

    const VENUE_TYPE_OPTIONS = [
        { value: 'popup', label: t('statsPage.venuePopup') },
        { value: 'fleamarket', label: t('statsPage.venueFlea') },
        { value: 'gallery', label: t('statsPage.venueGallery') },
        { value: 'showroom', label: t('statsPage.venueShowroom') },
        { value: 'cafe', label: t('statsPage.venueCafe') },
        { value: 'store', label: t('statsPage.venueStore') },
        { value: 'online', label: t('statsPage.venueOnline') },
        { value: 'other', label: t('statsPage.venueOther') },
    ];

    const REGION_OPTIONS = [
        t('statsPage.regionSeoul'), t('statsPage.regionGyeonggi'), t('statsPage.regionIncheon'),
        t('statsPage.regionBusan'), t('statsPage.regionDaegu'), t('statsPage.regionDaejeon'),
        t('statsPage.regionGwangju'), t('statsPage.regionUlsan'), t('statsPage.regionSejong'),
        t('statsPage.regionGangwon'), t('statsPage.regionChungbuk'), t('statsPage.regionChungnam'),
        t('statsPage.regionJeonbuk'), t('statsPage.regionJeonnam'), t('statsPage.regionGyeongbuk'),
        t('statsPage.regionGyeongnam'), t('statsPage.regionJeju'),
    ];

    const PERIOD_TABS = [
        { key: 'dashboard', label: t('statsPage.tabDashboard'), icon: BarChart3 },
        { key: 'daily', label: t('statsPage.tabDaily'), icon: Clock },
        { key: 'monthly', label: t('statsPage.tabMonthly'), icon: CalendarDays },
        { key: 'annual', label: t('statsPage.tabAnnual'), icon: CalendarRange },
    ];
    const [allStats, setAllStats] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const emptyForm = {
        record_type: 'monthly',
        record_date: '',
        monthly_revenue: '',
        customer_count: '',
        transaction_count: '',
        avg_unit_price: '',
        best_selling_item: '',
        best_selling_other: '',
        venue_type: '',
        region: '',
        satisfaction: 0,
        memo: '',
    };

    const [form, setForm] = useState(emptyForm);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/seller_stats.php?action=list`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setAllStats(data.stats || []);
                setSummary(data.summary || {});
            }
        } catch {
            showToast(t('statsPage.loadFailed'), 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    // ── Filtered stats by period ──
    const filteredStats = useMemo(() => {
        if (activeTab === 'dashboard') return allStats;
        return allStats.filter(s => s.record_type === activeTab);
    }, [allStats, activeTab]);

    const resetForm = () => { setForm(emptyForm); setEditingRecord(null); };

    const handleOpenForm = (record = null, periodOverride = null) => {
        const period = periodOverride || (activeTab !== 'dashboard' ? activeTab : 'monthly');
        if (record) {
            setEditingRecord(record);
            // Check if best_selling_item is a known category
            const isKnownCategory = PRODUCT_CATEGORIES.some(c => c.value === record.best_selling_item && c.value !== 'other');
            setForm({
                record_type: record.record_type || 'monthly',
                record_date: record.record_date || '',
                monthly_revenue: record.monthly_revenue || '',
                customer_count: record.customer_count || '',
                transaction_count: record.transaction_count || '',
                avg_unit_price: record.avg_unit_price || '',
                best_selling_item: isKnownCategory ? record.best_selling_item : (record.best_selling_item ? 'other' : ''),
                best_selling_other: isKnownCategory ? '' : (record.best_selling_item || ''),
                venue_type: record.venue_type || '',
                region: record.region || '',
                satisfaction: parseInt(record.satisfaction) || 0,
                memo: record.memo || '',
            });
        } else {
            resetForm();
            const now = new Date();
            let defaultDate = '';
            if (period === 'daily') {
                defaultDate = now.toISOString().slice(0, 10);
            } else if (period === 'monthly') {
                defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            } else if (period === 'annual') {
                defaultDate = String(now.getFullYear());
            }
            setForm(prev => ({ ...prev, record_type: period, record_date: defaultDate }));
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.record_date) { showToast(t('statsPage.selectDate'), 'error'); return; }

        // Resolve best_selling_item
        const bestItem = form.best_selling_item === 'other' ? form.best_selling_other : form.best_selling_item;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/seller_stats.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'save',
                    ...form,
                    best_selling_item: bestItem,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || t('statsPage.saved'), 'success');
                setShowForm(false);
                resetForm();
                fetchStats();
            } else {
                showToast(data.message || t('statsPage.saveFailed'), 'error');
            }
        } catch {
            showToast(t('statsPage.serverError'), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (record) => {
        setConfirmModal({
            title: t('statsPage.deleteTitle'),
            message: t('statsPage.deleteMsg', { date: record.record_date }),
            type: 'danger',
            confirmLabel: t('statsPage.deleteBtn'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/seller_stats.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ action: 'delete', id: record.id }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast(t('statsPage.deleted'), 'success');
                        fetchStats();
                    } else showToast(data.message || t('statsPage.deleteFailed'), 'error');
                } catch {
                    showToast(t('statsPage.serverError'), 'error');
                }
            }
        });
    };

    // ── Format helpers ──
    const formatRevenue = (val) => {
        const n = parseInt(val) || 0;
        if (n >= 100000000) return t('statsPage.currencyBillion', { value: (n / 100000000).toFixed(1) });
        if (n >= 10000) return t('statsPage.currencyMillion', { value: Math.round(n / 10000).toLocaleString() });
        return t('statsPage.currencyWon', { value: n.toLocaleString() });
    };

    const formatDateLabel = (record) => {
        const d = record.record_date;
        if (record.record_type === 'daily') return d; // YYYY-MM-DD
        if (record.record_type === 'annual') return `${d}${t('statsPage.yearSuffix')}`;
        return d; // YYYY-MM
    };

    const periodLabel = (type) => {
        if (type === 'daily') return t('statsPage.tabDaily');
        if (type === 'monthly') return t('statsPage.tabMonthly');
        if (type === 'annual') return t('statsPage.tabAnnual');
        return type;
    };

    // ── Dashboard KPIs (all data) ──
    const dashKPI = useMemo(() => {
        const daily = summary['daily'] || { count: 0, total_revenue: 0, avg_revenue: 0, total_customers: 0, total_transactions: 0, avg_unit_price: 0 };
        const monthly = summary['monthly'] || { count: 0, total_revenue: 0, avg_revenue: 0, total_customers: 0, total_transactions: 0, avg_unit_price: 0 };
        const annual = summary['annual'] || { count: 0, total_revenue: 0, avg_revenue: 0, total_customers: 0, total_transactions: 0, avg_unit_price: 0 };

        const totalRevenue = parseInt(daily.total_revenue || 0) + parseInt(monthly.total_revenue || 0) + parseInt(annual.total_revenue || 0);
        const totalCustomers = parseInt(daily.total_customers || 0) + parseInt(monthly.total_customers || 0) + parseInt(annual.total_customers || 0);
        const totalTransactions = parseInt(daily.total_transactions || 0) + parseInt(monthly.total_transactions || 0) + parseInt(annual.total_transactions || 0);
        const totalCount = parseInt(daily.count || 0) + parseInt(monthly.count || 0) + parseInt(annual.count || 0);

        return { totalRevenue, totalCustomers, totalTransactions, totalCount, daily, monthly, annual };
    }, [summary]);

    // ── Chart Data for filtered view ──
    const chartData = useMemo(() => {
        return [...filteredStats].reverse().slice(-12).map(s => ({
            label: s.record_date,
            revenue: parseInt(s.monthly_revenue) || 0,
        }));
    }, [filteredStats]);
    const maxChartVal = Math.max(...chartData.map(d => d.revenue), 1);

    // ── Period KPI ──
    const periodKPI = useMemo(() => {
        if (activeTab === 'dashboard') return null;
        const records = filteredStats;
        if (records.length === 0) return null;
        const revenues = records.map(r => parseInt(r.monthly_revenue) || 0).filter(v => v > 0);
        return {
            count: records.length,
            totalRevenue: revenues.reduce((s, v) => s + v, 0),
            avgRevenue: revenues.length > 0 ? Math.round(revenues.reduce((s, v) => s + v, 0) / revenues.length) : 0,
            totalCustomers: records.reduce((s, r) => s + (parseInt(r.customer_count) || 0), 0),
            totalTransactions: records.reduce((s, r) => s + (parseInt(r.transaction_count) || 0), 0),
        };
    }, [filteredStats, activeTab]);

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t('statsPage.title')}</h1>
                        <p className="text-sm text-gray-500">{t('statsPage.subtitle')}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    <Plus size={16} />
                    {t('statsPage.addData')}
                </button>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {PERIOD_TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const count = tab.key === 'dashboard'
                        ? allStats.length
                        : allStats.filter(s => s.record_type === tab.key).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive
                                ? 'text-white shadow-lg'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            style={isActive ? { background: COLORS.primary, boxShadow: `0 4px 14px ${COLORS.primaryBg}` } : {}}
                        >
                            <Icon size={16} />
                            {tab.label}
                            {count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent" />
                </div>
            ) : (
                <>
                    {/* ════ DASHBOARD TAB ════ */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-5">
                            {/* Hero Summary */}
                            <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                                <div className="absolute -right-8 -bottom-8 opacity-10"><TrendingUp size={120} /></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BarChart3 size={20} /></div>
                                    <div>
                                        <h3 className="font-extrabold text-lg">{t('statsPage.dashboardTitle')}</h3>
                                        <p className="text-xs text-emerald-200">{t('statsPage.dashboardSubtitle')}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                                    <DashKPICard label={t('statsPage.totalRecords')} value={`${dashKPI.totalCount}${t('statsPage.units')}`} />
                                    <DashKPICard label={t('statsPage.totalRevenue')} value={dashKPI.totalRevenue > 0 ? formatRevenue(dashKPI.totalRevenue) : '-'} />
                                    <DashKPICard label={t('statsPage.totalCustomers')} value={`${dashKPI.totalCustomers.toLocaleString()}${t('statsPage.people')}`} />
                                    <DashKPICard label={t('statsPage.totalTransactions')} value={`${dashKPI.totalTransactions.toLocaleString()}${t('statsPage.units')}`} />
                                </div>
                            </div>

                            {/* Period Breakdown Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { key: 'daily', label: t('statsPage.dailyData'), icon: <Clock size={18} />, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
                                    { key: 'monthly', label: t('statsPage.monthlyData'), icon: <CalendarDays size={18} />, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
                                    { key: 'annual', label: t('statsPage.annualData'), icon: <CalendarRange size={18} />, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
                                ].map(period => {
                                    const s = dashKPI[period.key];
                                    return (
                                        <div key={period.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-9 h-9 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white`}>
                                                        {period.icon}
                                                    </div>
                                                    <h4 className="font-extrabold text-gray-900 text-sm">{period.label}</h4>
                                                </div>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${period.bgColor} ${period.textColor}`}>
                                                    {parseInt(s.count || 0)}{t('statsPage.units')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`${period.bgColor} rounded-xl p-2.5`}>
                                                    <p className={`text-[10px] font-bold ${period.textColor} mb-0.5`}>{t('statsPage.totalSales')}</p>
                                                    <p className="text-xs font-extrabold text-gray-900">
                                                        {parseInt(s.total_revenue || 0) > 0 ? formatRevenue(s.total_revenue) : '-'}
                                                    </p>
                                                </div>
                                                <div className={`${period.bgColor} rounded-xl p-2.5`}>
                                                    <p className={`text-[10px] font-bold ${period.textColor} mb-0.5`}>{t('statsPage.avgSales')}</p>
                                                    <p className="text-xs font-extrabold text-gray-900">
                                                        {parseInt(s.avg_revenue || 0) > 0 ? formatRevenue(Math.round(s.avg_revenue)) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setActiveTab(period.key); }}
                                                className={`mt-3 w-full py-2 rounded-xl text-xs font-bold ${period.bgColor} ${period.textColor} hover:opacity-80 transition-opacity`}
                                            >
                                                {t('statsPage.viewDetails', { period: period.label })}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Recent Records */}
                            {allStats.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                                        <Calendar size={16} className="text-emerald-600" />
                                        {t('statsPage.recentRecords')}
                                    </h3>
                                    <div className="space-y-2">
                                        {allStats.slice(0, 5).map(record => (
                                            <RecentRecordRow key={record.id} record={record} formatRevenue={formatRevenue} periodLabel={periodLabel} onEdit={() => handleOpenForm(record)} onDelete={() => handleDelete(record)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {allStats.length === 0 && (
                                <EmptyPrompt onAdd={() => handleOpenForm()} />
                            )}
                        </div>
                    )}

                    {/* ════ PERIOD TABS (daily/monthly/annual) ════ */}
                    {activeTab !== 'dashboard' && (
                        <div className="space-y-5">
                            {/* Period KPI */}
                            {periodKPI && (
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                    {[
                                        { label: t('statsPage.recordCount'), value: `${periodKPI.count}${t('statsPage.units')}`, icon: <Calendar size={16} />, color: 'from-indigo-500 to-violet-600' },
                                        { label: t('statsPage.totalRevenue'), value: formatRevenue(periodKPI.totalRevenue), icon: <DollarSign size={16} />, color: 'from-emerald-500 to-teal-600' },
                                        { label: t('statsPage.avgRevenue'), value: formatRevenue(periodKPI.avgRevenue), icon: <TrendingUp size={16} />, color: 'from-blue-500 to-indigo-600' },
                                        { label: t('statsPage.totalCustomers'), value: periodKPI.totalCustomers.toLocaleString(), icon: <Users size={16} />, color: 'from-amber-500 to-orange-600' },
                                        { label: t('statsPage.totalTransactions'), value: periodKPI.totalTransactions.toLocaleString(), icon: <ShoppingCart size={16} />, color: 'from-rose-500 to-pink-600' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                            <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                                                {stat.icon}
                                            </div>
                                            <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Revenue Chart */}
                            {chartData.length > 1 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BarChart3 size={18} className="text-emerald-600" />
                                        <h3 className="font-extrabold text-gray-900">{t('statsPage.salesTrend', { period: periodLabel(activeTab) })}</h3>
                                    </div>
                                    <div className="flex items-end gap-2 h-36">
                                        {chartData.map((d, idx) => {
                                            const pct = (d.revenue / maxChartVal) * 100;
                                            return (
                                                <div key={idx} className="flex flex-col items-center flex-1 min-w-0 group">
                                                    <span className="text-[9px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {formatRevenue(d.revenue)}
                                                    </span>
                                                    <div
                                                        className="w-full max-w-[36px] rounded-t-lg transition-all duration-500 hover:opacity-80 bg-gradient-to-t from-emerald-500 to-teal-400"
                                                        style={{ height: `${Math.max(pct, 3)}%` }}
                                                    />
                                                    <span className="text-[9px] text-gray-400 mt-1 truncate w-full text-center font-medium">
                                                        {activeTab === 'daily' ? d.label.slice(5) : activeTab === 'annual' ? d.label : d.label.slice(5) + t('statsPage.chartMonthSuffix')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add Button for this period */}
                            <button
                                onClick={() => handleOpenForm(null, activeTab)}
                                className="w-full py-3 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                {t('statsPage.addPeriodData', { period: periodLabel(activeTab) })}
                            </button>

                            {/* Records List */}
                            {filteredStats.length === 0 ? (
                                <EmptyPrompt onAdd={() => handleOpenForm(null, activeTab)} />
                            ) : (
                                <div className="space-y-3">
                                    {filteredStats.map(record => (
                                        <RecordCard
                                            key={record.id}
                                            record={record}
                                            formatRevenue={formatRevenue}
                                            formatDateLabel={formatDateLabel}
                                            onEdit={() => handleOpenForm(record)}
                                            onDelete={() => handleDelete(record)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Privacy Notice */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    {t('statsPage.privacyNotice')}
                </p>
            </div>

            {/* ── Create/Edit Modal ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex items-center justify-between">
                            <h2 className="font-extrabold text-lg flex items-center gap-2">
                                <TrendingUp size={20} />
                                {editingRecord ? t('statsPage.editData') : t('statsPage.addData')}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white/80 hover:text-white"><X size={22} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Record Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.recordType')}</label>
                                <div className="flex gap-2">
                                    {['daily', 'monthly', 'annual'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                if (!editingRecord) setForm({ ...form, record_type: type, record_date: '' });
                                            }}
                                            disabled={!!editingRecord}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${form.record_type === type
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                } ${editingRecord ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        >
                                            {periodLabel(type)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Record Date */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                    {form.record_type === 'daily' ? t('statsPage.recordDateDaily') : form.record_type === 'annual' ? t('statsPage.recordDateAnnual') : t('statsPage.recordDateMonthly')}
                                </label>
                                {form.record_type === 'daily' && (
                                    <input type="date" value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                        required disabled={!!editingRecord} />
                                )}
                                {form.record_type === 'monthly' && (
                                    <input type="month" value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                        required disabled={!!editingRecord} />
                                )}
                                {form.record_type === 'annual' && (
                                    <select value={form.record_date} onChange={e => setForm({ ...form, record_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium appearance-none"
                                        required disabled={!!editingRecord}>
                                        <option value="">{t('statsPage.selectYear')}</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                            <option key={y} value={y}>{y}{t('statsPage.yearSuffix')}</option>
                                        ))}
                                    </select>
                                )}
                                {editingRecord && <p className="text-[10px] text-gray-400 mt-1">{t('statsPage.dateEditNote')}</p>}
                            </div>

                            {/* Revenue & Transactions */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.revenue')}</label>
                                    <input type="number" min="0" value={form.monthly_revenue}
                                        onChange={e => {
                                            const rev = e.target.value;
                                            const tx = parseInt(form.transaction_count) || 0;
                                            const unitPrice = rev && tx > 0 ? Math.round(parseInt(rev) / tx) : '';
                                            setForm({ ...form, monthly_revenue: rev, avg_unit_price: unitPrice.toString() });
                                        }}
                                        placeholder="5000000"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.transactionCount')}</label>
                                    <input type="number" min="0" value={form.transaction_count}
                                        onChange={e => {
                                            const tx = e.target.value;
                                            const rev = parseInt(form.monthly_revenue) || 0;
                                            const unitPrice = rev > 0 && tx && parseInt(tx) > 0 ? Math.round(rev / parseInt(tx)) : '';
                                            setForm({ ...form, transaction_count: tx, avg_unit_price: unitPrice.toString() });
                                        }}
                                        placeholder="150"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                </div>
                            </div>

                            {/* Customers & Auto-calculated Unit Price */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.customerCount')}</label>
                                    <input type="number" min="0" value={form.customer_count}
                                        onChange={e => setForm({ ...form, customer_count: e.target.value })}
                                        placeholder="200"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                        {t('statsPage.unitPrice')}
                                        <span className="ml-1 text-[10px] text-emerald-500 font-medium normal-case">{t('statsPage.autoCalc', '자동계산')}</span>
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm font-bold text-emerald-700 min-h-[42px] flex items-center">
                                        {form.avg_unit_price && parseInt(form.avg_unit_price) > 0
                                            ? `${parseInt(form.avg_unit_price).toLocaleString()}원`
                                            : <span className="text-gray-400 font-medium">{t('statsPage.autoCalcHint', '매출액과 거래건수를 입력하세요')}</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Best Selling Item — Category Selector */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.bestCategory')}</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {PRODUCT_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, best_selling_item: form.best_selling_item === cat.value ? '' : cat.value, best_selling_other: cat.value !== 'other' ? '' : form.best_selling_other })}
                                            className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border ${form.best_selling_item === cat.value
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                {form.best_selling_item === 'other' && (
                                    <input
                                        type="text"
                                        value={form.best_selling_other}
                                        onChange={e => setForm({ ...form, best_selling_other: e.target.value })}
                                        placeholder={t('statsPage.bestOtherPlaceholder')}
                                        className="w-full mt-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                                    />
                                )}
                            </div>

                            {/* Venue Type & Region */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.venueType')}</label>
                                    <select value={form.venue_type} onChange={e => setForm({ ...form, venue_type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium appearance-none">
                                        <option value="">{t('statsPage.select')}</option>
                                        {VENUE_TYPE_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.region')}</label>
                                    <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium appearance-none">
                                        <option value="">{t('statsPage.select')}</option>
                                        {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Satisfaction */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.satisfaction')}</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} type="button"
                                            onClick={() => setForm({ ...form, satisfaction: form.satisfaction === n ? 0 : n })}
                                            className={`p-2 rounded-xl transition-all ${form.satisfaction >= n ? 'bg-yellow-100 text-yellow-500 scale-110' : 'bg-gray-50 text-gray-300 hover:bg-yellow-50 hover:text-yellow-400'}`}
                                        >
                                            <Star size={20} fill={form.satisfaction >= n ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                    <span className="text-xs text-gray-400 ml-2">{form.satisfaction > 0 ? `${form.satisfaction}/5` : t('statsPage.notSelected')}</span>
                                </div>
                            </div>

                            {/* Memo */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('statsPage.memo')}</label>
                                <textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })}
                                    rows="2" placeholder={t('statsPage.memoPlaceholder')}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium resize-none" />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Save size={16} />
                                    {submitting ? t('statsPage.saving') : (editingRecord ? t('statsPage.editDone') : t('statsPage.saveData'))}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                    {t('statsPage.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
        </div>
    );
};

// ── Sub Components ──
const DashKPICard = ({ label, value }) => (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
        <p className="text-xs text-emerald-200 mb-0.5">{label}</p>
        <p className="text-xl font-extrabold">{value}</p>
    </div>
);

const ReccentRecordBadge = ({ type }) => {
    const styles = {
        daily: 'bg-blue-50 text-blue-600',
        monthly: 'bg-emerald-50 text-emerald-600',
        annual: 'bg-amber-50 text-amber-600',
    };
    const labels = { daily: 'Daily', monthly: 'Monthly', annual: 'Annual' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[type] || 'bg-gray-50 text-gray-500'}`}>
            {labels[type] || type}
        </span>
    );
};

const RecentRecordRow = ({ record, formatRevenue, periodLabel, onEdit, onDelete }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={onEdit}>
        <ReccentRecordBadge type={record.record_type} />
        <span className="font-bold text-sm text-gray-900 min-w-[80px]">{record.record_date}</span>
        <span className="text-sm font-bold text-emerald-600 flex-1">
            {parseInt(record.monthly_revenue) > 0 ? formatRevenue(record.monthly_revenue) : '-'}
        </span>
        {record.best_selling_item && (
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium hidden md:inline">
                {record.best_selling_item}
            </span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
            <Edit3 size={14} className="text-gray-400" />
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 size={14} />
            </button>
        </div>
    </div>
);

const RecordCard = ({ record, formatRevenue, formatDateLabel, onEdit, onDelete }) => {
    const { t } = useTranslation('seller');
    const revenue = parseInt(record.monthly_revenue) || 0;
    const customers = parseInt(record.customer_count) || 0;
    const transactions = parseInt(record.transaction_count) || 0;
    const unitPrice = parseInt(record.avg_unit_price) || 0;
    const satisfaction = parseInt(record.satisfaction) || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
                        <Calendar size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-gray-900 text-lg">{formatDateLabel(record)}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <ReccentRecordBadge type={record.record_type} />
                            {record.venue_type && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
                                    {t(`statsPage.venue${record.venue_type.charAt(0).toUpperCase() + record.venue_type.slice(1)}`, record.venue_type)}
                                </span>
                            )}
                            {record.region && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                                    <MapPin size={8} /> {record.region}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={onEdit} className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"><Edit3 size={14} /></button>
                    <button onClick={onDelete} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-[10px] text-emerald-600 font-bold mb-0.5">{t('statsPage.salesCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900">{revenue > 0 ? formatRevenue(revenue) : '-'}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-[10px] text-blue-600 font-bold mb-0.5">{t('statsPage.customersCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900">{customers > 0 ? `${customers.toLocaleString()}${t('statsPage.peopleSuffix')}` : '-'}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-[10px] text-amber-600 font-bold mb-0.5">{t('statsPage.transactionsCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900">{transactions > 0 ? `${transactions.toLocaleString()}${t('statsPage.transactionSuffix')}` : '-'}</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-3">
                    <p className="text-[10px] text-violet-600 font-bold mb-0.5">{t('statsPage.unitPriceCardLabel')}</p>
                    <p className="text-sm font-extrabold text-gray-900">{unitPrice > 0 ? formatRevenue(unitPrice) : '-'}</p>
                </div>
            </div>

            {(record.best_selling_item || satisfaction > 0 || record.memo) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {record.best_selling_item && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <Package size={11} className="text-gray-400" />
                            <span className="font-medium">{record.best_selling_item}</span>
                        </span>
                    )}
                    {satisfaction > 0 && (
                        <span className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg text-yellow-700">
                            <Star size={11} />
                            <span className="font-bold">{satisfaction}/5</span>
                        </span>
                    )}
                    {record.memo && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg text-gray-400">
                            <FileText size={11} />
                            <span className="truncate max-w-[200px]">{record.memo}</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

const EmptyPrompt = ({ onAdd }) => {
    const { t } = useTranslation('seller');
    return (
        <div className="text-center py-16">
            <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-400">{t('statsPage.emptyTitle')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('statsPage.emptyDesc')}</p>
            <p className="text-xs text-gray-300 mt-3">{t('statsPage.emptyNote')}</p>
            <button onClick={onAdd}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                <Plus size={16} />
                {t('statsPage.firstDataBtn')}
            </button>
        </div>
    );
};


export default SellerStats;
