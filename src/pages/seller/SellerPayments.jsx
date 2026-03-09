import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    CreditCard, Banknote, Copy, CheckCircle, Clock, XCircle, Send,
    AlertTriangle, X, Sparkles, Star, Package, ChevronRight, ChevronDown,
    Layers, Tag, ShoppingBag, Zap, Crown, Calendar, CalendarDays
} from 'lucide-react';
import { countryToLang } from '../../utils/translateText';

const API_BASE = '/api/payments';

const DEFAULT_CAT_META = { icon: Layers, gradient: 'from-purple-500 to-pink-600', bgLight: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' };

const SellerPayments = () => {
    const { user } = useAuth();
    const { t } = useTranslation('seller');

    const STATUS_MAP = {
        pending: { label: t('paymentsPage.statusPending'), color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-400', icon: Clock },
        submitted: { label: t('paymentsPage.statusSubmitted'), color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400', icon: Send },
        confirmed: { label: t('paymentsPage.statusConfirmed'), color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400', icon: CheckCircle },
        rejected: { label: t('paymentsPage.statusRejected'), color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-400', icon: XCircle }
    };

    const PERIOD_LABEL = { monthly: t('paymentsPage.periodMonthly'), yearly: t('paymentsPage.periodYearly'), once: t('paymentsPage.periodOnce') };

    const CATEGORY_META = {
        [t('paymentsPage.catEntry')]: { icon: ShoppingBag, gradient: 'from-indigo-500 to-blue-600', bgLight: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
        [t('paymentsPage.catMarketing')]: { icon: Zap, gradient: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
        [t('paymentsPage.catPremium')]: { icon: Crown, gradient: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    };
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [settings, setSettings] = useState(null);
    const [plans, setPlans] = useState([]);
    const [payments, setPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('plans');

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [creating, setCreating] = useState(false);

    const [submitModal, setSubmitModal] = useState(null);
    const [depositorName, setDepositorName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Collapsed category sections
    const [collapsedCats, setCollapsedCats] = useState({});
    // Billing period toggle
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        Promise.all([fetchSettings(), fetchPlans(), fetchPayments()])
            .finally(() => setLoading(false));
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE}/get_settings.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setSettings(data.settings);
        } catch (err) { console.error(err); }
    };

    const fetchPlans = async () => {
        try {
            const userLang = countryToLang(user?.country);
            const res = await fetch(`${API_BASE}/get_plans.php?lang=${userLang}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setPlans(data.plans);
        } catch (err) { console.error(err); }
    };

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_BASE}/get_payments.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setPayments(data.payments);
        } catch (err) { console.error(err); }
    };

    const handleCreatePayment = async (plan) => {
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/create_payment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_type: 'plan',
                    amount: plan.amount,
                    plan_id: plan.id,
                    reference_label: plan.name
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('paymentsPage.paymentCreated'));
                setSelectedPlan(null);
                setActiveTab('history');
                fetchPayments();
            } else {
                showToast(data.message || t('paymentsPage.paymentCreateFailed'), 'error');
            }
        } catch (err) { showToast(t('common:error'), 'error'); }
        finally { setCreating(false); }
    };

    const handleSubmitDeposit = async () => {
        if (!depositorName.trim()) { showToast(t('paymentsPage.enterDepositor'), 'error'); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/submit_payment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_id: submitModal.id, depositor_name: depositorName.trim() })
            });
            const data = await res.json();
            if (data.success) { showToast(data.message); setSubmitModal(null); setDepositorName(''); fetchPayments(); }
            else showToast(data.message || t('paymentsPage.processFailed'), 'error');
        } catch (err) { showToast(t('common:error'), 'error'); }
        finally { setSubmitting(false); }
    };

    const copyToClipboard = (text) => { navigator.clipboard.writeText(text); showToast(t('paymentsPage.copied')); };

    const toggleCategory = (cat) => setCollapsedCats(c => ({ ...c, [cat]: !c[cat] }));

    // Group plans by category
    const groupedPlans = useMemo(() => {
        const groups = {};
        plans.forEach(plan => {
            const cat = plan.category?.trim() || t('paymentsPage.catOther');
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(plan);
        });
        // Put defined categories first, then others
        const order = [t('paymentsPage.catEntry'), t('paymentsPage.catMarketing'), t('paymentsPage.catPremium')];
        const result = [];
        order.forEach(cat => {
            if (groups[cat]) {
                result.push({ category: cat, plans: groups[cat] });
                delete groups[cat];
            }
        });
        Object.entries(groups).forEach(([cat, ps]) => result.push({ category: cat, plans: ps }));
        return result;
    }, [plans]);

    // Filter plans by billing period
    const filteredGroupedPlans = useMemo(() => {
        return groupedPlans.map(group => ({
            ...group,
            plans: group.plans.filter(plan => {
                if (billingPeriod === 'all') return true;
                return plan.period === billingPeriod;
            })
        })).filter(group => group.plans.length > 0);
    }, [groupedPlans, billingPeriod]);

    // Count plans by period
    const periodCounts = useMemo(() => {
        const counts = { monthly: 0, yearly: 0, once: 0, all: plans.length };
        plans.forEach(p => { if (counts[p.period] !== undefined) counts[p.period]++; });
        return counts;
    }, [plans]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-bold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ animation: 'popupScale 0.3s ease' }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <CreditCard size={20} />
                        </div>
                        {t('paymentsPage.title')}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">{t('paymentsPage.subtitle')}</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-gray-100 border border-gray-200 rounded-xl">
                    <button onClick={() => setActiveTab('plans')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Package size={16} /> {t('paymentsPage.tabPlans')}
                    </button>
                    <button onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Clock size={16} /> {t('paymentsPage.tabHistory')}
                        {payments.filter(p => p.status === 'pending').length > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs font-bold">
                                {payments.filter(p => p.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ═══ Account Info Card ═══ */}
            {settings && settings.bank_name && (
                <div className="bg-white rounded-2xl p-6 relative overflow-hidden border border-gray-200 shadow-sm">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Banknote size={18} className="text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{t('paymentsPage.accountTitle')}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-400 text-xs font-medium mb-1">{t('paymentsPage.bankName')}</p>
                                <p className="font-bold text-lg text-gray-900">{settings.bank_name}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-400 text-xs font-medium mb-1">{t('paymentsPage.accountNumber')}</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-lg text-gray-900">{settings.account_number}</p>
                                    <button onClick={() => copyToClipboard(settings.account_number)}
                                        className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-200 transition-all"><Copy size={14} /></button>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-400 text-xs font-medium mb-1">{t('paymentsPage.accountHolder')}</p>
                                <p className="font-bold text-lg text-gray-900">{settings.account_holder}</p>
                            </div>
                        </div>
                        {settings.payment_notice && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">{settings.payment_notice}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ Plans Tab — Category Grouped ═══ */}
            {activeTab === 'plans' && (
                <div className="space-y-6">
                    {/* 💳 Billing Period Toggle */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Calendar size={18} className="text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">{t('paymentsPage.billingPeriod', '결제 주기')}</h3>
                            </div>
                            <div className="flex p-1 bg-gray-100 rounded-xl gap-1">
                                <button
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === 'monthly'
                                        ? 'bg-white text-indigo-700 shadow-md border border-indigo-100'
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Calendar size={15} />
                                    {t('paymentsPage.periodMonthly')}
                                    {periodCounts.monthly > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === 'monthly' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>{periodCounts.monthly}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setBillingPeriod('yearly')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all relative ${billingPeriod === 'yearly'
                                        ? 'bg-white text-emerald-700 shadow-md border border-emerald-100'
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <CalendarDays size={15} />
                                    {t('paymentsPage.periodYearly')}
                                    {periodCounts.yearly > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === 'yearly' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>{periodCounts.yearly}</span>
                                    )}
                                    {periodCounts.yearly > 0 && (
                                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[9px] font-black shadow-md">
                                            SAVE
                                        </span>
                                    )}
                                </button>
                                {periodCounts.once > 0 && (
                                    <button
                                        onClick={() => setBillingPeriod('once')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === 'once'
                                            ? 'bg-white text-amber-700 shadow-md border border-amber-100'
                                            : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Sparkles size={15} />
                                        {t('paymentsPage.periodOnce')}
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === 'once' ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>{periodCounts.once}</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setBillingPeriod('all')}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === 'all'
                                        ? 'bg-white text-gray-700 shadow-md border border-gray-200'
                                        : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {t('paymentsPage.periodAll', '전체')}
                                </button>
                            </div>
                        </div>
                        {/* Period description */}
                        <div className="mt-4 flex items-center gap-3">
                            {billingPeriod === 'monthly' && (
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    {t('paymentsPage.monthlyDesc', '매월 자동 결제되는 요금제입니다. 언제든지 해지 가능합니다.')}
                                </p>
                            )}
                            {billingPeriod === 'yearly' && (
                                <p className="text-sm text-emerald-600 flex items-center gap-2 font-medium">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    {t('paymentsPage.yearlyDesc', '연간 결제 시 할인된 요금이 적용됩니다.')}
                                </p>
                            )}
                            {billingPeriod === 'once' && (
                                <p className="text-sm text-amber-600 flex items-center gap-2 font-medium">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                                    {t('paymentsPage.onceDesc', '한 번만 결제하면 영구적으로 이용 가능합니다.')}
                                </p>
                            )}
                        </div>
                    </div>

                    {filteredGroupedPlans.length > 0 ? (
                        filteredGroupedPlans.map(group => {
                            const catMeta = CATEGORY_META[group.category] || DEFAULT_CAT_META;
                            const CatIcon = catMeta.icon;
                            const isCollapsed = collapsedCats[group.category];
                            return (
                                <div key={group.category} className="space-y-4">
                                    {/* Category Header */}
                                    <button onClick={() => toggleCategory(group.category)}
                                        className="w-full flex items-center gap-3 group">
                                        <div className={`w-9 h-9 bg-gradient-to-br ${catMeta.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            <CatIcon size={18} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {group.category}
                                            </h3>
                                            <p className="text-xs text-gray-400">{t('paymentsPage.serviceCount', { count: group.plans.length })}</p>
                                        </div>
                                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`} />
                                    </button>

                                    {/* Plans Grid */}
                                    {!isCollapsed && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pl-2">
                                            {group.plans.map((plan, idx) => {
                                                const isPackage = plan.plan_type === 'package';
                                                const isFirst = idx === 0 && group === groupedPlans[0];
                                                return (
                                                    <div key={plan.id}
                                                        className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPackage
                                                            ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-md hover:shadow-amber-200/50'
                                                            : isFirst
                                                                ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-200 shadow-md hover:shadow-indigo-200/50'
                                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                                                            }`}>
                                                        {/* Plan Header */}
                                                        <div className="px-6 pt-6 pb-4">
                                                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                                {isPackage && (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                                                                        <Layers size={12} /> {t('paymentsPage.packageBadge')}
                                                                    </span>
                                                                )}
                                                                {isFirst && !isPackage && (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">
                                                                        <Star size={12} /> {t('paymentsPage.recommendBadge')}
                                                                    </span>
                                                                )}
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${catMeta.bgLight} ${catMeta.border} ${catMeta.text} border`}>
                                                                    <Tag size={10} /> {group.category}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                                            {plan.description && (
                                                                <p className="text-sm text-gray-500 mt-3 leading-relaxed whitespace-pre-line">{plan.description}</p>
                                                            )}
                                                        </div>

                                                        {/* Price */}
                                                        <div className="px-6 py-4 border-t border-gray-100">
                                                            <p className="text-3xl font-extrabold text-gray-900">
                                                                ₩{parseInt(plan.amount || 0).toLocaleString()}
                                                                <span className="text-sm text-gray-400 font-medium ml-1">/ {PERIOD_LABEL[plan.period] || t('paymentsPage.periodMonthly')}</span>
                                                            </p>
                                                            {plan.period === 'yearly' && (
                                                                <p className="text-xs text-emerald-600 mt-1 font-bold flex items-center gap-1">
                                                                    <CheckCircle size={12} />
                                                                    {t('paymentsPage.yearlySaving', '월간 결제 대비 할인 적용')}
                                                                </p>
                                                            )}
                                                            {isPackage && (
                                                                <p className="text-xs text-amber-600 mt-1 font-medium">{t('paymentsPage.packageDesc')}</p>
                                                            )}
                                                        </div>

                                                        {/* Features */}
                                                        {plan.features && plan.features.length > 0 && (
                                                            <div className="px-6 pb-4 flex-1">
                                                                <div className="space-y-2.5">
                                                                    {plan.features.map((f, i) => (
                                                                        <div key={i} className="flex items-start gap-2.5 text-sm">
                                                                            <CheckCircle size={16} className={`${isPackage ? 'text-amber-500' : 'text-emerald-500'} flex-shrink-0 mt-0.5`} />
                                                                            <span className="text-gray-600">{f}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* CTA */}
                                                        <div className="px-6 pb-6 mt-auto">
                                                            <button onClick={() => setSelectedPlan(plan)}
                                                                className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isPackage
                                                                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30'
                                                                    : isFirst
                                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}>
                                                                {t('paymentsPage.payBtn')} <ChevronRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Package size={24} />
                            </div>
                            <p className="font-bold text-gray-500 mb-1">{t('paymentsPage.noPlans')}</p>
                            <p className="text-sm text-gray-400">{t('paymentsPage.noPlansDesc')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ History Tab ═══ */}
            {activeTab === 'history' && (
                <div className="grid grid-cols-1 gap-4">
                    {payments.length > 0 ? (
                        payments.map((p) => {
                            const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.pending;
                            const StatusIcon = statusInfo.icon;
                            return (
                                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-5 md:p-6 shadow-sm hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600'
                                                : p.status === 'submitted' ? 'bg-blue-100 text-blue-600'
                                                    : p.status === 'rejected' ? 'bg-red-100 text-red-600'
                                                        : 'bg-gray-100 text-gray-500'}`}>
                                                <StatusIcon size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900">{p.reference_label || p.payment_type}</h4>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                        <span className={statusInfo.color}>{statusInfo.label}</span>
                                                    </span>
                                                </div>
                                                <p className="text-2xl font-extrabold text-gray-900">₩{parseInt(p.amount || 0).toLocaleString()}</p>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                                                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                                    {p.depositor_name && <span>{t('paymentsPage.depositor')}: <span className="text-gray-600 font-medium">{p.depositor_name}</span></span>}
                                                </div>
                                                {p.status === 'rejected' && p.admin_note && (
                                                    <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                                                        <span className="font-bold">{t('paymentsPage.adminNote')}:</span> {p.admin_note}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {p.status === 'pending' && (
                                                <button onClick={() => { setSubmitModal(p); setDepositorName(''); }}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                                                    <Send size={16} /> {t('paymentsPage.depositDone')}
                                                </button>
                                            )}
                                            {p.status === 'submitted' && (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-200">
                                                    <Clock size={16} /> {t('paymentsPage.awaitingAdmin')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-5">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                                            <div className={`h-full transition-all duration-1000 ${p.status === 'rejected' ? 'bg-red-500 w-full'
                                                : p.status === 'confirmed' ? 'bg-emerald-500 w-full'
                                                    : p.status === 'submitted' ? 'bg-blue-500 w-2/3'
                                                        : 'bg-indigo-400 w-1/3'}`} />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                                            <span className="text-indigo-500">{t('paymentsPage.progressCreated')}</span>
                                            <span className={p.status === 'submitted' || p.status === 'confirmed' ? 'text-blue-500' : ''}>{t('paymentsPage.progressDeposited')}</span>
                                            <span className={p.status === 'confirmed' ? 'text-emerald-500' : (p.status === 'rejected' ? 'text-red-500' : '')}>
                                                {p.status === 'rejected' ? t('paymentsPage.statusRejected') : t('paymentsPage.statusConfirmed')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Sparkles size={24} />
                            </div>
                            <h4 className="text-gray-700 font-bold mb-1">{t('paymentsPage.noHistory')}</h4>
                            <p className="text-gray-400 text-sm">{t('paymentsPage.noHistoryDesc')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ Plan Confirm Modal ═══ */}
            {selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlan(null)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}
                        style={{ animation: 'popupScale 0.3s ease' }}>
                        <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPlan.plan_type === 'package' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                {selectedPlan.plan_type === 'package' ? <Layers size={20} /> : <CreditCard size={20} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{t('paymentsPage.confirmTitle')}</h3>
                                <p className="text-sm text-gray-500">{t('paymentsPage.confirmDesc')}</p>
                            </div>
                        </div>

                        {/* Plan Summary */}
                        <div className={`border rounded-xl p-4 mb-5 ${selectedPlan.plan_type === 'package' ? 'bg-amber-50 border-amber-200' : 'bg-indigo-50 border-indigo-200'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {selectedPlan.plan_type === 'package' && (
                                    <span className="px-2 py-0.5 bg-amber-200 text-amber-700 rounded-full text-[10px] font-bold">{t('paymentsPage.packageBadge')}</span>
                                )}
                                <h4 className="font-bold text-gray-900 text-lg">{selectedPlan.name}</h4>
                            </div>
                            {selectedPlan.description && <p className="text-sm text-gray-600 mb-2 leading-relaxed whitespace-pre-line">{selectedPlan.description}</p>}
                            <p className={`text-2xl font-extrabold ${selectedPlan.plan_type === 'package' ? 'text-amber-600' : 'text-indigo-600'}`}>
                                ₩{parseInt(selectedPlan.amount || 0).toLocaleString()}
                                <span className="text-sm text-gray-400 font-medium ml-1">/ {PERIOD_LABEL[selectedPlan.period] || t('paymentsPage.periodMonthly')}</span>
                            </p>
                            {selectedPlan.features && selectedPlan.features.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                                    {selectedPlan.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle size={14} className={`${selectedPlan.plan_type === 'package' ? 'text-amber-500' : 'text-emerald-500'} flex-shrink-0`} /> {f}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Account Preview */}
                        {settings?.bank_name && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                                <p className="text-xs font-bold text-gray-400 mb-2">{t('paymentsPage.depositAccount')}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{settings.bank_name} {settings.account_number}</p>
                                        <p className="text-xs text-gray-400">{t('paymentsPage.holderLabel', { name: settings.account_holder })}</p>
                                    </div>
                                    <button onClick={() => copyToClipboard(settings.account_number)}
                                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700">
                            <p className="font-bold">{t('paymentsPage.paymentNotice')}</p>
                            <p className="text-amber-600">{t('paymentsPage.paymentNoticeDesc')}</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSelectedPlan(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">{t('paymentsPage.cancelBtn')}</button>
                            <button onClick={() => handleCreatePayment(selectedPlan)} disabled={creating}
                                className={`flex-1 py-3 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${selectedPlan.plan_type === 'package' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                {creating ? t('paymentsPage.creating') : t('paymentsPage.startPayment')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Submit Deposit Modal ═══ */}
            {submitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSubmitModal(null)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}
                        style={{ animation: 'popupScale 0.3s ease' }}>
                        <button onClick={() => setSubmitModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><Send size={20} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{t('paymentsPage.depositReportTitle')}</h3>
                                <p className="text-sm text-gray-500">₩{parseInt(submitModal.amount || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {settings?.bank_name && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5">
                                <p className="text-xs font-bold text-indigo-600 mb-2">{t('paymentsPage.depositInstruction')}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900">{settings.bank_name} {settings.account_number}</p>
                                        <p className="text-xs text-gray-500">{t('paymentsPage.holderLabel', { name: settings.account_holder })}</p>
                                    </div>
                                    <button onClick={() => copyToClipboard(settings.account_number)}
                                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('paymentsPage.depositorName')} <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={depositorName} onChange={e => setDepositorName(e.target.value)}
                            placeholder={t('paymentsPage.depositorPlaceholder')}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 mb-5" />

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700">
                            <p className="font-bold">{t('paymentsPage.depositNotice')}</p>
                            <p className="text-amber-600">{t('paymentsPage.depositNoticeDesc')}</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSubmitModal(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">{t('paymentsPage.closeBtn')}</button>
                            <button onClick={handleSubmitDeposit} disabled={submitting || !depositorName.trim()}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                <Send size={14} /> {submitting ? t('paymentsPage.reporting') : t('paymentsPage.reportDeposit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popupScale {
                    from { transform: scale(0.9) translateY(10px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SellerPayments;
