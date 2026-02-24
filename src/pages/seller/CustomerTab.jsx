import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Users, Plus, X, Edit3, Trash2, Search, Star, Phone, Mail, Building2,
    Tag, MessageSquare, Calendar, PhoneCall, Video, ShoppingCart, FileText,
    ChevronDown, ChevronRight, Clock, Filter, ArrowUpDown, User, Activity
} from 'lucide-react';

const API_BASE = '/api/users';

const STATUS_CONFIG = {
    active: { label: '활성', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    vip: { label: 'VIP', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    lead: { label: '리드', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    inactive: { label: '비활성', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
};

const ACTIVITY_TYPES = {
    note: { label: '메모', icon: FileText, color: 'text-gray-500' },
    call: { label: '전화', icon: PhoneCall, color: 'text-blue-500' },
    meeting: { label: '미팅', icon: Video, color: 'text-purple-500' },
    email: { label: '이메일', icon: Mail, color: 'text-orange-500' },
    purchase: { label: '구매', icon: ShoppingCart, color: 'text-emerald-500' },
    other: { label: '기타', icon: Activity, color: 'text-gray-400' },
};

const CustomerTab = ({ selectedCountry = 'KR', t, formatRevenue, toast }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [summary, setSummary] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [activities, setActivities] = useState([]);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const defaultForm = { name: '', email: '', phone: '', company: '', tags: '', memo: '', status: 'active', source: '' };
    const [form, setForm] = useState(defaultForm);

    const defaultActivityForm = { activity_type: 'note', title: '', description: '' };
    const [activityForm, setActivityForm] = useState(defaultActivityForm);

    // ── Translate helper ──
    const tr = useCallback((key, fallback) => t ? t(`statsPage.crm.${key}`, fallback) : fallback, [t]);

    // ── Fetch customers ──
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ action: 'list', country_code: selectedCountry });
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            const res = await fetch(`${API_BASE}/seller_customers.php?${params}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setCustomers(data.customers || []);
                setSummary(data.summary || {});
            }
        } catch { /* ignore */ }
        setLoading(false);
    }, [selectedCountry, search, statusFilter]);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    // ── Fetch activities ──
    const fetchActivities = useCallback(async (customerId) => {
        try {
            const res = await fetch(`${API_BASE}/seller_customers.php?action=activities&customer_id=${customerId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setActivities(data.activities || []);
        } catch { /* ignore */ }
    }, []);

    // ── Save customer ──
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSubmitting(true);
        try {
            const body = { action: 'save', ...form, country_code: selectedCountry };
            if (editingCustomer) body.id = editingCustomer.id;
            const res = await fetch(`${API_BASE}/seller_customers.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                credentials: 'include', body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                toast?.({ type: 'success', message: tr('saved', '저장되었습니다.') });
                setShowForm(false);
                setEditingCustomer(null);
                setForm(defaultForm);
                fetchCustomers();
            }
        } catch { toast?.({ type: 'error', message: tr('saveFailed', '저장에 실패했습니다.') }); }
        setSubmitting(false);
    };

    // ── Delete customer ──
    const handleDelete = async (customer) => {
        if (!confirm(tr('deleteConfirm', `"${customer.name}" 고객을 삭제하시겠습니까?`))) return;
        try {
            const res = await fetch(`${API_BASE}/seller_customers.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                credentials: 'include', body: JSON.stringify({ action: 'delete', id: customer.id }),
            });
            const data = await res.json();
            if (data.success) {
                toast?.({ type: 'success', message: tr('deleted', '삭제되었습니다.') });
                if (selectedCustomer?.id === customer.id) setSelectedCustomer(null);
                fetchCustomers();
            }
        } catch { /* ignore */ }
    };

    // ── Add activity ──
    const handleAddActivity = async (e) => {
        e.preventDefault();
        if (!activityForm.title.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/seller_customers.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                credentials: 'include', body: JSON.stringify({
                    action: 'add_activity',
                    customer_id: selectedCustomer.id,
                    ...activityForm,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowActivityForm(false);
                setActivityForm(defaultActivityForm);
                fetchActivities(selectedCustomer.id);
            }
        } catch { /* ignore */ }
        setSubmitting(false);
    };

    // ── Open edit ──
    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setForm({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            company: customer.company || '',
            tags: customer.tags || '',
            memo: customer.memo || '',
            status: customer.status || 'active',
            source: customer.source || '',
        });
        setShowForm(true);
    };

    // ── Select customer ──
    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        fetchActivities(customer.id);
    };

    const stats = useMemo(() => ({
        total: parseInt(summary.total_count) || 0,
        active: parseInt(summary.active_count) || 0,
        vip: parseInt(summary.vip_count) || 0,
        lead: parseInt(summary.lead_count) || 0,
        inactive: parseInt(summary.inactive_count) || 0,
        revenue: parseInt(summary.sum_revenue) || 0,
    }), [summary]);

    return (
        <div className="space-y-4">
            {/* ── KPI Summary Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: tr('totalCustomers', '총 고객'), value: stats.total, icon: Users, gradient: 'from-emerald-500 to-teal-600' },
                    { label: 'VIP', value: stats.vip, icon: Star, gradient: 'from-amber-500 to-orange-600' },
                    { label: tr('activeCustomers', '활성 고객'), value: stats.active, icon: Activity, gradient: 'from-blue-500 to-indigo-600' },
                    { label: tr('totalRevenue', '총 매출'), value: formatRevenue ? formatRevenue(stats.revenue) : stats.revenue.toLocaleString(), icon: ShoppingCart, gradient: 'from-purple-500 to-pink-600' },
                ].map((card, i) => (
                    <div key={i} className={`bg-gradient-to-br ${card.gradient} rounded-xl p-4 text-white shadow-md`}>
                        <div className="flex items-center justify-between mb-2">
                            <card.icon size={18} className="opacity-80" />
                        </div>
                        <p className="text-2xl font-extrabold">{card.value}</p>
                        <p className="text-[11px] opacity-80 mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Search & Filter Bar ── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={tr('searchPlaceholder', '이름, 이메일, 회사로 검색...')}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex gap-1.5">
                        {['', 'active', 'vip', 'lead', 'inactive'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${statusFilter === s
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-emerald-400'
                                    }`}>
                                {s ? STATUS_CONFIG[s]?.label : tr('all', '전체')}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { setEditingCustomer(null); setForm(defaultForm); setShowForm(true); }}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm">
                        <Plus size={14} /> {tr('addCustomer', '고객 추가')}
                    </button>
                </div>
            </div>

            {/* ── Customer List + Detail Panel ── */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Customer List */}
                <div className={`${selectedCustomer ? 'lg:w-1/2' : 'w-full'} space-y-2`}>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-600 border-t-transparent" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{tr('noCustomers', '아직 등록된 고객이 없습니다')}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{tr('addFirstCustomer', '첫 번째 고객을 추가해보세요!')}</p>
                            <button onClick={() => { setEditingCustomer(null); setForm(defaultForm); setShowForm(true); }}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                                <Plus size={14} className="inline mr-1" /> {tr('addCustomer', '고객 추가')}
                            </button>
                        </div>
                    ) : (
                        customers.map(customer => {
                            const statusConf = STATUS_CONFIG[customer.status] || STATUS_CONFIG.active;
                            const isSelected = selectedCustomer?.id === customer.id;
                            return (
                                <button key={customer.id} onClick={() => selectCustomer(customer)}
                                    className={`w-full text-left bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all group cursor-pointer ${isSelected
                                        ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800 shadow-md'
                                        : 'border-gray-100 dark:border-gray-700 hover:border-emerald-300 hover:shadow-sm'
                                        }`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${customer.status === 'vip' ? 'from-amber-400 to-orange-500' : 'from-emerald-400 to-teal-500'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                                {(customer.name || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{customer.name}</p>
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusConf.color}`}>{statusConf.label}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    {customer.company && <span className="text-[11px] text-gray-400 truncate flex items-center gap-0.5"><Building2 size={10} />{customer.company}</span>}
                                                    {customer.email && <span className="text-[11px] text-gray-400 truncate flex items-center gap-0.5"><Mail size={10} />{customer.email}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{formatRevenue ? formatRevenue(parseInt(customer.total_revenue) || 0) : (parseInt(customer.total_revenue) || 0).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400">{customer.total_purchases || 0}{tr('purchases', '건 구매')}</p>
                                        </div>
                                    </div>
                                    {customer.tags && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {customer.tags.split(',').map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px] font-medium text-gray-500 dark:text-gray-400">#{tag.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* ── Customer Detail Panel ── */}
                {selectedCustomer && (
                    <div className="lg:w-1/2 space-y-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full ${selectedCustomer.status === 'vip' ? 'bg-amber-400' : 'bg-white/20'} flex items-center justify-center font-bold text-lg`}>
                                            {(selectedCustomer.name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg">{selectedCustomer.name}</h3>
                                            <p className="text-emerald-100 text-xs">{selectedCustomer.company || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => openEdit(selectedCustomer)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                            <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(selectedCustomer)} className="p-1.5 bg-white/20 rounded-lg hover:bg-red-400/50 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                        <button onClick={() => setSelectedCustomer(null)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors lg:hidden">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                                {/* Quick stats */}
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="bg-white/10 rounded-lg p-2 text-center">
                                        <p className="text-lg font-extrabold">{formatRevenue ? formatRevenue(parseInt(selectedCustomer.total_revenue) || 0) : (parseInt(selectedCustomer.total_revenue) || 0).toLocaleString()}</p>
                                        <p className="text-[10px] text-emerald-200">{tr('totalRevenue', '총 매출')}</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2 text-center">
                                        <p className="text-lg font-extrabold">{selectedCustomer.total_purchases || 0}</p>
                                        <p className="text-[10px] text-emerald-200">{tr('totalPurchasesLabel', '총 구매')}</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2 text-center">
                                        <p className="text-lg font-extrabold">{selectedCustomer.avg_satisfaction ? `${selectedCustomer.avg_satisfaction}⭐` : '-'}</p>
                                        <p className="text-[10px] text-emerald-200">{tr('satisfaction', '만족도')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">{tr('contactInfo', '연락처')}</h4>
                                <div className="space-y-1.5">
                                    {selectedCustomer.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Phone size={13} className="text-gray-400" /> {selectedCustomer.phone}
                                        </div>
                                    )}
                                    {selectedCustomer.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Mail size={13} className="text-gray-400" /> {selectedCustomer.email}
                                        </div>
                                    )}
                                    {selectedCustomer.company && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Building2 size={13} className="text-gray-400" /> {selectedCustomer.company}
                                        </div>
                                    )}
                                    {selectedCustomer.source && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Tag size={13} /> {tr('source', '유입 경로')}: {selectedCustomer.source}
                                        </div>
                                    )}
                                </div>
                                {selectedCustomer.memo && (
                                    <div className="mt-3 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                                        📝 {selectedCustomer.memo}
                                    </div>
                                )}
                            </div>

                            {/* Activity Log */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">{tr('activityLog', '활동 기록')}</h4>
                                    <button onClick={() => { setActivityForm(defaultActivityForm); setShowActivityForm(true); }}
                                        className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition-colors">
                                        <Plus size={12} /> {tr('addActivity', '활동 추가')}
                                    </button>
                                </div>
                                {activities.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-4">{tr('noActivities', '아직 활동 기록이 없습니다')}</p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {activities.map(act => {
                                            const typeConf = ACTIVITY_TYPES[act.activity_type] || ACTIVITY_TYPES.other;
                                            const Icon = typeConf.icon;
                                            return (
                                                <div key={act.id} className="flex items-start gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg group">
                                                    <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-600 ${typeConf.color}`}>
                                                        <Icon size={12} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{act.title}</span>
                                                            <span className="text-[9px] text-gray-400">{typeConf.label}</span>
                                                        </div>
                                                        {act.description && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{act.description}</p>}
                                                        <p className="text-[10px] text-gray-400 mt-1">{new Date(act.activity_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Add/Edit Customer Modal ── */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-extrabold text-gray-900 dark:text-white">{editingCustomer ? tr('editCustomer', '고객 수정') : tr('addCustomer', '고객 추가')}</h3>
                            <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('customerName', '고객 이름')} *</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                                    placeholder={tr('namePlaceholder', '이름을 입력하세요')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm font-medium" />
                            </div>
                            {/* Email + Phone */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('email', '이메일')}</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('phone', '연락처')}</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="010-0000-0000"
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                                </div>
                            </div>
                            {/* Company */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('company', '회사/소속')}</label>
                                <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                                    placeholder={tr('companyPlaceholder', '회사명을 입력하세요')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            {/* Status + Source */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('status', '상태')}</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm">
                                        {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('source', '유입 경로')}</label>
                                    <input type="text" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
                                        placeholder={tr('sourcePlaceholder', '온라인, 소개, 직접 등')}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                                </div>
                            </div>
                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('tags', '태그')}</label>
                                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                                    placeholder={tr('tagsPlaceholder', '콤마로 구분 (예: VIP, 리피터, 패션)')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            {/* Memo */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('memo', '메모')}</label>
                                <textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} rows="2"
                                    placeholder={tr('memoPlaceholder', '고객에 대한 메모를 자유롭게 작성하세요')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm resize-none" />
                            </div>
                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                    {submitting ? tr('saving', '저장 중...') : (editingCustomer ? tr('editDone', '수정 완료') : tr('saveCustomer', '고객 저장'))}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                    {tr('cancel', '취소')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Add Activity Modal ── */}
            {showActivityForm && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) setShowActivityForm(false); }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-extrabold text-gray-900 dark:text-white">{tr('addActivity', '활동 추가')}</h3>
                            <button onClick={() => setShowActivityForm(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddActivity} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('activityType', '활동 유형')}</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {Object.entries(ACTIVITY_TYPES).map(([key, conf]) => {
                                        const Icon = conf.icon;
                                        return (
                                            <button key={key} type="button" onClick={() => setActivityForm({ ...activityForm, activity_type: key })}
                                                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-bold border transition-all ${activityForm.activity_type === key
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                                                    }`}>
                                                <Icon size={12} className={conf.color} /> {conf.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('activityTitle', '제목')} *</label>
                                <input type="text" value={activityForm.title} onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} required
                                    placeholder={tr('activityTitlePlaceholder', '활동 제목을 입력하세요')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{tr('description', '상세 내용')}</label>
                                <textarea value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} rows="3"
                                    placeholder={tr('activityDescPlaceholder', '상세 내용을 입력하세요')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-emerald-500 outline-none text-sm resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                    {submitting ? tr('saving', '저장 중...') : tr('saveActivity', '활동 저장')}
                                </button>
                                <button type="button" onClick={() => setShowActivityForm(false)}
                                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                    {tr('cancel', '취소')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerTab;
