import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    CreditCard, Settings, History, Save, ToggleLeft, ToggleRight,
    CheckCircle, XCircle, Clock, Search, Filter, ChevronDown, ChevronUp,
    Copy, AlertTriangle, Banknote, Eye, X, Send, Plus, Edit2,
    Trash2, GripVertical, Package, List, Star, ArrowUp, ArrowDown,
    Tag, Layers, ShoppingBag, Zap, Crown, Globe, Languages, RefreshCw
} from 'lucide-react';

const API_BASE = '/api/payments';

const STATUS_MAP_KEYS = {
    pending: { labelKey: 'paymentsPage.statusPending', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-400', icon: Clock },
    submitted: { labelKey: 'paymentsPage.statusSubmitted', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', icon: Send },
    confirmed: { labelKey: 'paymentsPage.statusConfirmed', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle },
    rejected: { labelKey: 'paymentsPage.statusRejected', color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', icon: XCircle }
};

const PERIOD_MAP_KEYS = { monthly: 'paymentsPage.periodMonthly', yearly: 'paymentsPage.periodYearly', once: 'paymentsPage.periodOnce' };
const ROLE_MAP_KEYS = { all: 'paymentsPage.roleAll', vendor: 'paymentsPage.roleVendor', seller: 'paymentsPage.roleSeller' };

const LANG_OPTIONS = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Việt Nam', flag: '🇻🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const CATEGORY_KEY_OPTIONS = ['categoryListing', 'categoryMarketing', 'categoryPremium', 'categoryOther'];
const CATEGORY_META_KEYS = {
    categoryListing: { icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    categoryMarketing: { icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    categoryPremium: { icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};
const DEFAULT_CAT_META = { icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };

const AdminPayments = () => {
    const { t } = useTranslation('admin');
    const [activeTab, setActiveTab] = useState('plans');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Settings state
    const [settings, setSettings] = useState({
        is_payment_enabled: 0,
        bank_name: '',
        account_number: '',
        account_holder: '',
        payment_notice: '',
        platform_fee_amount: 0,
        platform_fee_period: 'monthly'
    });

    // Plans state
    const [plans, setPlans] = useState([]);
    const [planModal, setPlanModal] = useState(null); // null | 'new' | plan object
    const [planForm, setPlanForm] = useState({ name: '', description: '', amount: 0, period: 'monthly', features: [], target_role: 'all', category: '', plan_type: 'single', is_active: 1, sort_order: 0 });
    const [customCategory, setCustomCategory] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [planSaving, setPlanSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    // Translation state
    const [transLang, setTransLang] = useState('en');
    const [translating, setTranslating] = useState(false);

    // Payments state
    const [payments, setPayments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Confirm modal
    const [confirmModal, setConfirmModal] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    // Detail modal
    const [detailModal, setDetailModal] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchSettings();
        fetchPlans();
        fetchPayments();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE}/get_settings.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setSettings(data.settings);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchPlans = async () => {
        try {
            const res = await fetch(`${API_BASE}/manage_plans.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'list' })
            });
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

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/update_settings.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            showToast(data.success ? t('paymentsPage.settingsSaved') : (data.message || t('paymentsPage.saveFailed')), data.success ? 'success' : 'error');
        } catch (err) { showToast(t('paymentsPage.errorOccurred'), 'error'); }
        finally { setSaving(false); }
    };

    // ─── Plan CRUD ───
    const openPlanModal = (plan = null) => {
        if (plan) {
            const cat = plan.category || '';
            const isCustom = cat && !CATEGORY_OPTIONS.includes(cat);
            setPlanForm({
                name: plan.name || '', description: plan.description || '', amount: plan.amount || 0,
                period: plan.period || 'monthly', features: plan.features || [], target_role: plan.target_role || 'all',
                category: isCustom ? '__custom__' : cat, plan_type: plan.plan_type || 'single',
                is_active: plan.is_active ?? 1, sort_order: plan.sort_order || 0,
                translations: plan.translations || {}
            });
            setCustomCategory(isCustom ? cat : '');
            setPlanModal(plan);
        } else {
            setPlanForm({ name: '', description: '', amount: 0, period: 'monthly', features: [], target_role: 'all', category: '', plan_type: 'single', is_active: 1, sort_order: plans.length, translations: {} });
            setCustomCategory('');
            setPlanModal('new');
        }
        setFeatureInput('');
        setTransLang('en');
    };

    // ─── Translation helpers ───
    const updateTranslation = (lang, field, value) => {
        setPlanForm(f => ({
            ...f,
            translations: {
                ...f.translations,
                [lang]: { ...(f.translations?.[lang] || {}), [field]: value }
            }
        }));
    };

    const updateTransFeature = (lang, idx, value) => {
        setPlanForm(f => {
            const current = f.translations?.[lang]?.features || [];
            const updated = [...current];
            updated[idx] = value;
            return {
                ...f,
                translations: {
                    ...f.translations,
                    [lang]: { ...(f.translations?.[lang] || {}), features: updated }
                }
            };
        });
    };

    const autoTranslateAll = async () => {
        if (!planForm.name.trim()) {
            showToast(t('paymentsPage.enterServiceName'), 'error');
            return;
        }
        setTranslating(true);
        try {
            const myMemoryLangMap = { en: 'en', vi: 'vi', ja: 'ja', th: 'th', km: 'km', ru: 'ru', uk: 'uk' };
            const newTranslations = { ...planForm.translations };

            for (const lang of LANG_OPTIONS) {
                const targetLang = myMemoryLangMap[lang.code] || lang.code;
                const translateOne = async (text) => {
                    if (!text || !text.trim()) return '';
                    try {
                        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|${targetLang}`);
                        const data = await response.json();
                        if (data.responseStatus === 200 && data.responseData?.translatedText) {
                            return data.responseData.translatedText;
                        }
                        return text;
                    } catch {
                        return text;
                    }
                };

                const translatedName = await translateOne(planForm.name);
                const translatedDesc = await translateOne(planForm.description);
                const translatedFeatures = [];
                for (const f of planForm.features) {
                    translatedFeatures.push(await translateOne(f));
                }

                newTranslations[lang.code] = {
                    name: translatedName,
                    description: translatedDesc,
                    features: translatedFeatures
                };
            }

            setPlanForm(f => ({ ...f, translations: newTranslations }));
            showToast(t('paymentsPage.autoTranslateSuccess', '자동 번역이 완료되었습니다!'));
        } catch (err) {
            console.error('Auto-translate error:', err);
            showToast(t('paymentsPage.autoTranslateFailed', '자동 번역에 실패했습니다.'), 'error');
        } finally {
            setTranslating(false);
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setPlanForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (idx) => {
        setPlanForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
    };

    const handleSavePlan = async () => {
        if (!planForm.name.trim()) { showToast(t('paymentsPage.enterServiceName'), 'error'); return; }
        if (planForm.amount <= 0) { showToast(t('paymentsPage.enterAmount'), 'error'); return; }
        setPlanSaving(true);
        try {
            const isEdit = planModal !== 'new';
            const finalCategory = planForm.category === '__custom__' ? customCategory.trim() : planForm.category;
            const res = await fetch(`${API_BASE}/manage_plans.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isEdit ? 'update' : 'create',
                    ...(isEdit ? { id: planModal.id } : {}),
                    ...planForm,
                    category: finalCategory,
                    translations: planForm.translations || {}
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setPlanModal(null);
                fetchPlans();
            } else {
                const debugInfo = data.debug_role !== undefined ? ` (role: ${data.debug_role || 'empty'})` : '';
                showToast((data.message || t('paymentsPage.saveFailed')) + debugInfo, 'error');
            }
        } catch (err) { showToast(t('paymentsPage.errorOccurred') + ': ' + err.message, 'error'); }
        finally { setPlanSaving(false); }
    };

    const handleDeletePlan = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/manage_plans.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
            });
            const data = await res.json();
            if (data.success) { showToast(data.message); fetchPlans(); }
            else showToast(data.message || t('paymentsPage.deleteFailed'), 'error');
        } catch (err) { showToast(t('paymentsPage.errorOccurred'), 'error'); }
        setDeleteConfirm(null);
    };

    const handleTogglePlan = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/manage_plans.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggle', id })
            });
            const data = await res.json();
            if (data.success) fetchPlans();
        } catch (err) { console.error(err); }
    };

    const handleMovePlan = async (index, direction) => {
        const newPlans = [...plans];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newPlans.length) return;
        [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
        setPlans(newPlans);
        try {
            const res = await fetch(`${API_BASE}/manage_plans.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reorder', ordered_ids: newPlans.map(p => p.id) })
            });
            const data = await res.json();
            if (data.success) showToast(t('paymentsPage.orderChanged'));
            else { showToast(data.message || t('paymentsPage.orderFailed'), 'error'); fetchPlans(); }
        } catch (err) { showToast(t('paymentsPage.errorOccurred'), 'error'); fetchPlans(); }
    };

    // ─── Payment Actions ───
    const handleConfirmAction = async (action) => {
        if (!confirmModal) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_BASE}/confirm_payment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_id: confirmModal.id, action, admin_note: adminNote })
            });
            const data = await res.json();
            if (data.success) { showToast(data.message); setConfirmModal(null); setAdminNote(''); fetchPayments(); }
            else showToast(data.message || t('paymentsPage.processFailed'), 'error');
        } catch (err) { showToast(t('paymentsPage.errorOccurred'), 'error'); }
        finally { setProcessing(false); }
    };

    const filteredPayments = useMemo(() => {
        let result = payments;
        if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
        if (typeFilter !== 'all') result = result.filter(p => p.payment_type === typeFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                (p.user_name || '').toLowerCase().includes(q) ||
                (p.depositor_name || '').toLowerCase().includes(q) ||
                (p.reference_label || '').toLowerCase().includes(q)
            );
        }
        return result;
    }, [payments, statusFilter, typeFilter, searchQuery]);

    // Group plans by category for display
    const groupedPlans = useMemo(() => {
        const catKeyMap = {
            '입점 서비스': 'categoryListing', '마케팅 서비스': 'categoryMarketing',
            '프리미엄 서비스': 'categoryPremium'
        };
        const groups = {};
        plans.forEach(plan => {
            const rawCat = plan.category?.trim() || '';
            const catKey = catKeyMap[rawCat] || rawCat || 'categoryOther';
            if (!groups[catKey]) groups[catKey] = [];
            groups[catKey].push(plan);
        });
        const order = ['categoryListing', 'categoryMarketing', 'categoryPremium'];
        const result = [];
        order.forEach(cat => {
            if (groups[cat]) { result.push({ category: cat, plans: groups[cat] }); delete groups[cat]; }
        });
        Object.entries(groups).forEach(([cat, ps]) => result.push({ category: cat, plans: ps }));
        return result;
    }, [plans]);

    const stats = useMemo(() => ({
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        submitted: payments.filter(p => p.status === 'submitted').length,
        confirmed: payments.filter(p => p.status === 'confirmed').length,
        totalConfirmed: payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + parseInt(p.amount || 0), 0),
    }), [payments]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-bold text-white transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ animation: 'popupScale 0.3s ease' }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <CreditCard size={20} />
                        </div>
                        {t('paymentsPage.title')}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">{t('paymentsPage.subtitle')}</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-gray-100/80 rounded-xl">
                    {[
                        { id: 'plans', icon: Package, label: t('paymentsPage.tabPlans') },
                        { id: 'settings', icon: Settings, label: t('paymentsPage.tabSettings') },
                        { id: 'history', icon: History, label: t('paymentsPage.tabHistory'), badge: stats.submitted },
                    ].map(tab => (
                        <button key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                            {tab.badge > 0 && <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">{tab.badge}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* ═══ Plans Tab ═══ */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'plans' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {t('paymentsPage.planDesc', { count: plans.length })}
                        </p>
                        <button onClick={() => openPlanModal()} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            <Plus size={16} /> {t('paymentsPage.addService')}
                        </button>
                    </div>

                    {/* Plans — Category Grouped */}
                    {groupedPlans.length > 0 ? (
                        <div className="space-y-8">
                            {groupedPlans.map(group => {
                                const catMeta = CATEGORY_META_KEYS[group.category] || DEFAULT_CAT_META;
                                const CatIcon = catMeta.icon;
                                return (
                                    <div key={group.category}>
                                        {/* Category Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${catMeta.bg} ${catMeta.color}`}>
                                                <CatIcon size={16} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-extrabold text-gray-900">{t(`paymentsPage.${group.category}`)}</h3>
                                                <p className="text-xs text-gray-400">{t('paymentsPage.serviceCount', { count: group.plans.length })}</p>
                                            </div>
                                        </div>

                                        {/* Plans Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {group.plans.map((plan, index) => {
                                                const globalIndex = plans.indexOf(plan);
                                                const isPackage = plan.plan_type === 'package';
                                                return (
                                                    <div key={plan.id}
                                                        className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all hover:shadow-lg ${plan.is_active == 1 ? 'border-gray-100' : 'border-gray-200 opacity-60'} ${isPackage ? 'ring-2 ring-amber-200/50' : ''}`}>
                                                        {/* Top Bar: Reorder + Actions */}
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleMovePlan(globalIndex, 'up')} disabled={globalIndex === 0}
                                                                    className={`p-1 rounded-md transition-colors ${globalIndex === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                                    title={t('paymentsPage.moveForward')}>
                                                                    <ArrowUp size={14} />
                                                                </button>
                                                                <span className="text-xs font-bold text-gray-300 min-w-[18px] text-center">{globalIndex + 1}</span>
                                                                <button onClick={() => handleMovePlan(globalIndex, 'down')} disabled={globalIndex === plans.length - 1}
                                                                    className={`p-1 rounded-md transition-colors ${globalIndex === plans.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                                    title={t('paymentsPage.moveBack')}>
                                                                    <ArrowDown size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleTogglePlan(plan.id)}
                                                                    className={`p-1.5 rounded-lg transition-colors ${plan.is_active == 1 ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                                    title={plan.is_active == 1 ? t('paymentsPage.deactivate') : t('paymentsPage.activate')}>
                                                                    {plan.is_active == 1 ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                                                </button>
                                                                <button onClick={() => openPlanModal(plan)}
                                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title={t('paymentsPage.edit')}>
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button onClick={() => setDeleteConfirm(plan)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t('paymentsPage.delete')}>
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Name + Badges */}
                                                        <h4 className="font-bold text-gray-900 text-lg">{plan.name}</h4>
                                                        <div className="mt-1 mb-3 flex flex-wrap gap-1">
                                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${plan.is_active == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {plan.is_active == 1 ? t('paymentsPage.active') : t('paymentsPage.inactive')}
                                                            </span>
                                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                                                {t(ROLE_MAP_KEYS[plan.target_role] || 'paymentsPage.roleAll')}
                                                            </span>
                                                            {isPackage && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                                    <Layers size={10} /> {t('paymentsPage.package')}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Price */}
                                                        <p className="text-2xl font-extrabold text-gray-900 mb-2">
                                                            ₩{parseInt(plan.amount || 0).toLocaleString()}
                                                            <span className="text-sm text-gray-400 font-medium ml-1">/ {t(PERIOD_MAP_KEYS[plan.period] || 'paymentsPage.periodMonthly')}</span>
                                                        </p>

                                                        {/* Description */}
                                                        {plan.description && (
                                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{plan.description}</p>
                                                        )}

                                                        {/* Features */}
                                                        {plan.features && plan.features.length > 0 && (
                                                            <div className="space-y-1.5 pt-3 border-t border-gray-100">
                                                                {plan.features.map((f, i) => (
                                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                                        <CheckCircle size={14} className={`${isPackage ? 'text-amber-500' : 'text-emerald-500'} flex-shrink-0`} />
                                                                        <span>{f}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                                <Package size={24} />
                            </div>
                            <p className="font-bold text-gray-400 mb-1">{t('paymentsPage.noServicesTitle')}</p>
                            <p className="text-sm text-gray-300 mb-4">{t('paymentsPage.noServicesDesc')}</p>
                            <button onClick={() => openPlanModal()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                                <Plus size={14} className="inline mr-1" /> {t('paymentsPage.addFirstService')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* ═══ Settings Tab ═══ */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    {/* Payment Toggle */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{t('paymentsPage.paymentFeature')}</h3>
                                <p className="text-sm text-gray-500 mt-1">{t('paymentsPage.paymentFeatureDesc')}</p>
                            </div>
                            <button
                                onClick={() => setSettings(s => ({ ...s, is_payment_enabled: s.is_payment_enabled ? 0 : 1 }))}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${settings.is_payment_enabled
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                            >
                                {settings.is_payment_enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                {settings.is_payment_enabled ? t('paymentsPage.paymentOn') : t('paymentsPage.paymentOff')}
                            </button>
                        </div>
                        {!settings.is_payment_enabled && (
                            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-bold">{t('paymentsPage.paymentDisabledTitle')}</p>
                                    <p>{t('paymentsPage.paymentDisabledDesc')}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bank Account */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Banknote size={20} className="text-indigo-500" /> {t('paymentsPage.bankInfo')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { key: 'bank_name', label: t('paymentsPage.bankName'), placeholder: t('paymentsPage.bankNamePlaceholder') },
                                { key: 'account_number', label: t('paymentsPage.accountNumber'), placeholder: t('paymentsPage.accountNumberPlaceholder') },
                                { key: 'account_holder', label: t('paymentsPage.accountHolder'), placeholder: t('paymentsPage.accountHolderPlaceholder') }
                            ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                                    <input type="text" value={settings[field.key]} onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                                        placeholder={field.placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">{t('paymentsPage.paymentNotice')}</h3>
                        <textarea value={settings.payment_notice} onChange={e => setSettings(s => ({ ...s, payment_notice: e.target.value }))}
                            placeholder={t('paymentsPage.paymentNoticePlaceholder')} rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none" />
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleSaveSettings} disabled={saving}
                            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200">
                            <Save size={18} /> {saving ? t('paymentsPage.saving') : t('paymentsPage.saveSettings')}
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* ═══ History Tab ═══ */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            { label: t('paymentsPage.statsAll'), value: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
                            { label: t('paymentsPage.statsAwaitPayment'), value: stats.pending, color: 'text-gray-600', bg: 'bg-gray-50' },
                            { label: t('paymentsPage.statsAwaitConfirm'), value: stats.submitted, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: t('paymentsPage.statsConfirmed'), value: stats.confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: t('paymentsPage.statsTotalAmount'), value: `₩${stats.totalConfirmed.toLocaleString()}`, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
                                <p className="text-xs font-bold text-gray-500 mb-1">{s.label}</p>
                                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder={t('paymentsPage.searchPlaceholder')} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                <option value="all">{t('paymentsPage.allStatus')}</option>
                                <option value="pending">{t('paymentsPage.statusPending')}</option>
                                <option value="submitted">{t('paymentsPage.statusSubmitted')}</option>
                                <option value="confirmed">{t('paymentsPage.statusConfirmed')}</option>
                                <option value="rejected">{t('paymentsPage.statusRejected')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {filteredPayments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            {[t('paymentsPage.colNo'), t('paymentsPage.colUser'), t('paymentsPage.colService'), t('paymentsPage.colAmount'), t('paymentsPage.colDepositor'), t('paymentsPage.colStatus'), t('paymentsPage.colDate'), t('paymentsPage.colManage')].map((h, hi) => (
                                                <th key={h} className={`${hi === 3 ? 'text-right' : hi === 7 ? 'text-center' : 'text-left'} px-5 py-3.5 font-bold text-gray-500 text-xs`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((p, idx) => {
                                            const si = STATUS_MAP_KEYS[p.status] || STATUS_MAP_KEYS.pending;
                                            return (
                                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 text-gray-400 font-medium">{filteredPayments.length - idx}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-gray-900">{p.user_name || '—'}</div>
                                                        <div className="text-xs text-gray-400">{p.user_role === 'vendor' ? t('paymentsPage.vendor') : t('paymentsPage.seller')}</div>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-700 font-medium">{p.reference_label || p.payment_type}</td>
                                                    <td className="px-5 py-4 text-right font-bold text-gray-900">₩{parseInt(p.amount || 0).toLocaleString()}</td>
                                                    <td className="px-5 py-4 text-gray-700 font-medium">{p.depositor_name || '—'}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${si.bg}`}>
                                                            <div className={`w-2 h-2 rounded-full ${si.dot}`} />
                                                            {t(si.labelKey)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button onClick={() => setDetailModal(p)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye size={16} /></button>
                                                            {p.status === 'submitted' && (
                                                                <>
                                                                    <button onClick={() => { setConfirmModal(p); setAdminNote(''); }}
                                                                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors">{t('paymentsPage.confirm')}</button>
                                                                    <button onClick={() => { setConfirmModal({ ...p, _rejectMode: true }); setAdminNote(''); }}
                                                                        className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">{t('paymentsPage.reject')}</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300"><CreditCard size={24} /></div>
                                <p className="font-bold text-gray-400 mb-1">{t('paymentsPage.noPaymentsTitle')}</p>
                                <p className="text-sm text-gray-300">{t('paymentsPage.noPaymentsDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ Plan Add/Edit Modal ═══ */}
            {planModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPlanModal(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPlanModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <Package size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {planModal === 'new' ? t('paymentsPage.newService') : t('paymentsPage.editService')}
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.serviceName')} <span className="text-red-500">*</span></label>
                                <input type="text" value={planForm.name} onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder={t('paymentsPage.serviceNamePlaceholder')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.description')}</label>
                                <textarea value={planForm.description} onChange={e => setPlanForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder={t('paymentsPage.descriptionPlaceholder')} rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.amountLabel')} <span className="text-red-500">*</span></label>
                                    <input type="number" value={planForm.amount} onChange={e => setPlanForm(f => ({ ...f, amount: parseInt(e.target.value) || 0 }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.paymentCycle')}</label>
                                    <select value={planForm.period} onChange={e => setPlanForm(f => ({ ...f, period: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <option value="monthly">{t('paymentsPage.monthlyLabel')}</option>
                                        <option value="yearly">{t('paymentsPage.yearlyLabel')}</option>
                                        <option value="once">{t('paymentsPage.onceLabel')}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.target')}</label>
                                <select value={planForm.target_role} onChange={e => setPlanForm(f => ({ ...f, target_role: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                    <option value="all">{t('paymentsPage.targetAll')}</option>
                                    <option value="vendor">{t('paymentsPage.targetVendor')}</option>
                                    <option value="seller">{t('paymentsPage.targetSeller')}</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.category')}</label>
                                    <select value={planForm.category} onChange={e => { setPlanForm(f => ({ ...f, category: e.target.value })); if (e.target.value !== '__custom__') setCustomCategory(''); }}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <option value="">{t('paymentsPage.noSelection')}</option>
                                        {CATEGORY_KEY_OPTIONS.map(c => <option key={c} value={t(`paymentsPage.${c}`)}>{t(`paymentsPage.${c}`)}</option>)}
                                        <option value="__custom__">{t('paymentsPage.customInput')}</option>
                                    </select>
                                    {planForm.category === '__custom__' && (
                                        <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                                            placeholder={t('paymentsPage.categoryPlaceholder')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 mt-2" />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.serviceType')}</label>
                                    <select value={planForm.plan_type} onChange={e => setPlanForm(f => ({ ...f, plan_type: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                        <option value="single">{t('paymentsPage.singleService')}</option>
                                        <option value="package">{t('paymentsPage.packageService')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.includedFeatures')}</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={featureInput}
                                        onChange={e => setFeatureInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                                        placeholder={t('paymentsPage.featurePlaceholder')}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                    <button onClick={addFeature} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">{t('paymentsPage.add')}</button>
                                </div>
                                {planForm.features.length > 0 && (
                                    <div className="space-y-1.5 bg-gray-50 rounded-xl p-3">
                                        {planForm.features.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                                                <span className="text-sm text-gray-700 flex items-center gap-2">
                                                    <CheckCircle size={14} className="text-emerald-500" /> {f}
                                                </span>
                                                <button onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ═══ Translations Section ═══ */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Languages size={16} className="text-indigo-500" />
                                        {t('paymentsPage.translations', '다국어 번역')}
                                    </label>
                                    <button type="button" onClick={autoTranslateAll} disabled={translating}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors disabled:opacity-50">
                                        <RefreshCw size={12} className={translating ? 'animate-spin' : ''} />
                                        {translating ? t('paymentsPage.translating', '번역 중...') : t('paymentsPage.autoTranslate', '자동 번역')}
                                    </button>
                                </div>

                                {/* Language tabs */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {LANG_OPTIONS.map(lang => {
                                        const hasTrans = planForm.translations?.[lang.code]?.name;
                                        return (
                                            <button key={lang.code} type="button" onClick={() => setTransLang(lang.code)}
                                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${transLang === lang.code
                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                    : hasTrans
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                                    }`}>
                                                {lang.flag} {lang.label}
                                                {hasTrans && transLang !== lang.code && <CheckCircle size={10} className="text-emerald-500" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Translation inputs for selected language */}
                                <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {LANG_OPTIONS.find(l => l.code === transLang)?.flag} {LANG_OPTIONS.find(l => l.code === transLang)?.label} {t('paymentsPage.translationLabel', '번역')}
                                    </p>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t('paymentsPage.serviceName')}</label>
                                        <input type="text"
                                            value={planForm.translations?.[transLang]?.name || ''}
                                            onChange={e => updateTranslation(transLang, 'name', e.target.value)}
                                            placeholder={planForm.name || t('paymentsPage.serviceNamePlaceholder')}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t('paymentsPage.description')}</label>
                                        <textarea
                                            value={planForm.translations?.[transLang]?.description || ''}
                                            onChange={e => updateTranslation(transLang, 'description', e.target.value)}
                                            placeholder={planForm.description || t('paymentsPage.descriptionPlaceholder')}
                                            rows={2}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                                    </div>
                                    {planForm.features.length > 0 && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">{t('paymentsPage.includedFeatures')}</label>
                                            <div className="space-y-1.5">
                                                {planForm.features.map((origFeature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400 w-4 flex-shrink-0">{idx + 1}.</span>
                                                        <input type="text"
                                                            value={planForm.translations?.[transLang]?.features?.[idx] || ''}
                                                            onChange={e => updateTransFeature(transLang, idx, e.target.value)}
                                                            placeholder={origFeature}
                                                            className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('paymentsPage.sortOrder')}</label>
                                <input type="number" value={planForm.sort_order} onChange={e => setPlanForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setPlanModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">{t('paymentsPage.cancel')}</button>
                            <button onClick={handleSavePlan} disabled={planSaving}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {planSaving ? t('paymentsPage.savingPlan') : (planModal === 'new' ? t('paymentsPage.addPlan') : t('paymentsPage.editPlan'))}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Delete Confirm Modal ═══ */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-red-600"><Trash2 size={24} /></div>
                            <h3 className="text-lg font-bold text-gray-900">{t('paymentsPage.deleteService')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t('paymentsPage.deleteConfirm', { name: deleteConfirm.name })}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">{t('paymentsPage.cancel')}</button>
                            <button onClick={() => handleDeletePlan(deleteConfirm.id)} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">{t('paymentsPage.delete')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Detail Modal ═══ */}
            {detailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setDetailModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><CreditCard size={20} className="text-indigo-500" /> {t('paymentsPage.paymentDetail')}</h3>
                        <div className="space-y-3 text-sm">
                            {[
                                [t('paymentsPage.detailUser'), `${detailModal.user_name} (${detailModal.user_role === 'vendor' ? t('paymentsPage.vendor') : t('paymentsPage.seller')})`],
                                [t('paymentsPage.detailService'), detailModal.reference_label || detailModal.payment_type],
                                [t('paymentsPage.detailAmount'), `₩${parseInt(detailModal.amount || 0).toLocaleString()}`],
                                [t('paymentsPage.detailDepositor'), detailModal.depositor_name || '—'],
                                [t('paymentsPage.detailStatus'), t((STATUS_MAP_KEYS[detailModal.status] || {}).labelKey || 'paymentsPage.statusPending')],
                                [t('paymentsPage.detailAdminNote'), detailModal.admin_note || '—'],
                                [t('paymentsPage.detailCreatedAt'), new Date(detailModal.created_at).toLocaleString()],
                                [t('paymentsPage.detailSubmittedAt'), detailModal.submitted_at ? new Date(detailModal.submitted_at).toLocaleString() : '—'],
                                [t('paymentsPage.detailConfirmedAt'), detailModal.confirmed_at ? new Date(detailModal.confirmed_at).toLocaleString() : '—'],
                            ].map(([l, v], i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-500 font-medium">{l}</span>
                                    <span className="text-gray-900 font-bold text-right max-w-[60%]">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Confirm/Reject Modal ═══ */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmModal(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setConfirmModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confirmModal._rejectMode ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {confirmModal._rejectMode ? <XCircle size={20} /> : <CheckCircle size={20} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{confirmModal._rejectMode ? t('paymentsPage.rejectDeposit') : t('paymentsPage.confirmDeposit')}</h3>
                                <p className="text-sm text-gray-500">{confirmModal.user_name} — ₩{parseInt(confirmModal.amount || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-500">{t('paymentsPage.depositorNameLabel')}</span><span className="font-bold">{confirmModal.depositor_name || '—'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">{t('paymentsPage.submittedAtLabel')}</span><span className="font-medium">{confirmModal.submitted_at ? new Date(confirmModal.submitted_at).toLocaleString() : '—'}</span></div>
                        </div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('paymentsPage.adminNoteLabel')}</label>
                        <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder={t('paymentsPage.adminNotePlaceholder')} rows={3}
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">{t('paymentsPage.close')}</button>
                            <button onClick={() => handleConfirmAction(confirmModal._rejectMode ? 'reject' : 'confirm')} disabled={processing}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${confirmModal._rejectMode ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                {processing ? t('paymentsPage.processing') : (confirmModal._rejectMode ? t('paymentsPage.rejectProcess') : t('paymentsPage.confirmProcess'))}
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

export default AdminPayments;
