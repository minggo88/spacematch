import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Flame, TrendingUp, Search, Plus, X, Calendar, Store,
    MapPin, Trash2, Edit3, ArrowUpDown, Clock, CheckCircle,
    AlertCircle, Eye, ChevronDown, Sparkles, AlertTriangle, XCircle
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const TIER_CONFIG_KEYS = {
    hot_top: { labelKey: 'promotionsPage.tierHotTop', color: 'bg-gradient-to-r from-orange-500 to-red-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50 border-orange-200' },
    hot_mid: { labelKey: 'promotionsPage.tierHotMid', color: 'bg-gradient-to-r from-violet-500 to-purple-600', textColor: 'text-violet-600', bgLight: 'bg-violet-50 border-violet-200' },
    category_featured: { labelKey: 'promotionsPage.tierCategoryFeatured', color: 'bg-gradient-to-r from-teal-500 to-cyan-600', textColor: 'text-teal-600', bgLight: 'bg-teal-50 border-teal-200' },
};

const TYPE_LABEL_KEYS = {
    popup: 'promotionsPage.typePopup', gallery: 'promotionsPage.typeGallery', cafe: 'promotionsPage.typeCafe',
    showroom: 'promotionsPage.typeShowroom', fleamarket: 'promotionsPage.typeFleamarket', store: 'promotionsPage.typeStore'
};

const AdminPromotions = () => {
    const { t } = useTranslation('admin');
    const [promotions, setPromotions] = useState([]);
    const [allVenues, setAllVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [searchVenue, setSearchVenue] = useState('');
    const [filterTier, setFilterTier] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Form state
    const [form, setForm] = useState({
        venue_id: '',
        tier: 'hot_top',
        featured_category: '',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: '',
        admin_note: '',
        display_order: 0,
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/promotions/get_admin_promotions.php`, { credentials: 'include', cache: 'no-store' });
            const json = await res.json();
            if (json.success) {
                setPromotions(json.promotions || []);
                setAllVenues(json.venues || []);
            } else {
                setPromotions([]);
                setAllVenues([]);
                showToast(json.message || t('promotionsPage.loadFailed'), 'error');
            }
        } catch (err) {
            console.error(t('promotionsPage.loadFailed'), err);
            setPromotions([]);
            setAllVenues([]);
            showToast(t('promotionsPage.loadFailed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditTarget(null);
        setForm({
            venue_id: '',
            tier: 'hot_top',
            featured_category: '',
            start_date: new Date().toISOString().slice(0, 10),
            end_date: '',
            admin_note: '',
            display_order: 0,
        });
        setSearchVenue('');
        setShowModal(true);
    };

    const handleOpenEdit = (promo) => {
        setEditTarget(promo);
        setForm({
            venue_id: promo.venue_id,
            tier: promo.tier,
            featured_category: promo.featured_category || '',
            start_date: promo.start_date,
            end_date: promo.end_date,
            admin_note: promo.admin_note || '',
            display_order: promo.display_order || 0,
        });
        setShowModal(true);
    };

    const handleQuickDate = (days) => {
        const start = new Date(form.start_date || new Date());
        const end = new Date(start);
        end.setDate(end.getDate() + days);
        setForm(prev => ({ ...prev, end_date: end.toISOString().slice(0, 10) }));
    };

    const handleSubmit = async () => {
        if (!form.venue_id || !form.start_date || !form.end_date) {
            showToast(t('promotionsPage.requiredFields'), 'error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/promotions/set_promotion.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) {
                setShowModal(false);
                fetchData();
                showToast(t('promotionsPage.promotionRegistered'), 'success');
            } else {
                showToast(json.message || t('promotionsPage.errorOccurred'), 'error');
            }
        } catch (err) {
            showToast(t('promotionsPage.serverError'), 'error');
        }
    };

    const handleRemove = async (promotionId) => {
        setConfirmModal({
            title: t('promotionsPage.deletePromotion'),
            message: t('promotionsPage.deleteConfirm'),
            type: 'danger',
            confirmLabel: t('promotionsPage.deleteLabel'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/promotions/remove_promotion.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ promotion_id: promotionId }),
                    });
                    const json = await res.json();
                    if (json.success) {
                        fetchData();
                        showToast(t('promotionsPage.promotionDeleted'), 'success');
                    }
                } catch (err) {
                    showToast(t('promotionsPage.serverError'), 'error');
                }
            }
        });
    };

    // Filter venues not already promoted (for the venue selector)
    const promotedVenueIds = useMemo(() => new Set(promotions.map(p => parseInt(p.venue_id))), [promotions]);

    const availableVenues = useMemo(() => {
        return allVenues.filter(v => {
            // When editing, include the currently edited venue
            if (editTarget && parseInt(v.id) === parseInt(editTarget.venue_id)) return true;
            if (promotedVenueIds.has(parseInt(v.id))) return false;
            if (searchVenue) {
                const term = searchVenue.toLowerCase();
                return v.name?.toLowerCase().includes(term) || v.location?.toLowerCase().includes(term);
            }
            return true;
        });
    }, [allVenues, promotedVenueIds, searchVenue, editTarget]);

    const filteredPromotions = useMemo(() => {
        if (!filterTier) return promotions;
        return promotions.filter(p => p.tier === filterTier);
    }, [promotions, filterTier]);

    /** API 조인이 비어도 동일 응답의 venues 배열로 표시 보강 */
    const venueById = useMemo(() => {
        const m = {};
        (allVenues || []).forEach((v) => {
            if (v == null || v.id == null || v.id === '') return;
            const k = String(v.id).trim();
            if (k) m[k] = v;
        });
        return m;
    }, [allVenues]);

    const activeCount = promotions.filter(p => p.promo_status === 'active').length;
    const expiredCount = promotions.filter(p => p.promo_status === 'expired').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Flame size={24} className="text-orange-500" />
                        {t('promotionsPage.title')}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t('promotionsPage.subtitle')}</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} />
                    {t('promotionsPage.addPromotion')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-2xl font-black text-gray-900">{promotions.length}</p>
                    <p className="text-xs text-gray-500 font-medium">{t('promotionsPage.totalPromotions')}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                    <p className="text-xs text-emerald-600 font-medium">{t('promotionsPage.active')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-2xl font-black text-gray-400">{expiredCount}</p>
                    <p className="text-xs text-gray-400 font-medium">{t('promotionsPage.expired')}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {[
                    { value: '', label: t('promotionsPage.filterAll') },
                    { value: 'hot_top', label: t('promotionsPage.filterHot') },
                    { value: 'hot_mid', label: t('promotionsPage.filterCurated') },
                    { value: 'category_featured', label: t('promotionsPage.filterCategoryFeatured') },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterTier(tab.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filterTier === tab.value
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Promotions List */}
            <div className="space-y-3">
                {filteredPromotions.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                        <Store size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-400 font-medium">{t('promotionsPage.noPromotions')}</p>
                        <button onClick={handleOpenAdd} className="text-indigo-600 font-bold text-sm mt-2 hover:underline">
                            {t('promotionsPage.addNewPromotion')}
                        </button>
                    </div>
                ) : (
                    filteredPromotions.map(promo => {
                        const isExpired = promo.promo_status === 'expired';
                        const tierConf = TIER_CONFIG_KEYS[promo.tier];
                        const daysLeft = Math.ceil((new Date(promo.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                        const vidKey = promo.venue_id != null && String(promo.venue_id) !== ''
                            ? String(promo.venue_id).trim()
                            : '';
                        const vRow = vidKey ? venueById[vidKey] : null;
                        const loc = (promo.venue_location || '').trim() || (vRow?.location || '').trim() || '';
                        const typeRaw = promo.venue_type || vRow?.type || '';
                        const typ = typeRaw ? (t(TYPE_LABEL_KEYS[typeRaw]) || typeRaw) : '';
                        const titleExtras = [loc, typ].filter(Boolean);
                        const rawTitle = (promo.venue_name || '').trim();
                        const fromList = (vRow?.name || '').trim();
                        const looksGeneric = !rawTitle || rawTitle === '(연결되지 않은 공간)' || /^공간 #\d+$/.test(rawTitle);
                        const baseTitle = (looksGeneric && fromList) ? fromList : (rawTitle || `ID ${promo.venue_id ?? ''}`);
                        const headline = titleExtras.length ? `${baseTitle} · ${titleExtras.join(' · ')}` : baseTitle;
                        const vst = (promo.venue_status || '').trim() || (vRow?.status || '').trim() || '';
                        let thumbImg = promo.venue_images?.[0];
                        if (!thumbImg && vRow?.images) {
                            let arr = [];
                            if (Array.isArray(vRow.images)) arr = vRow.images;
                            else if (typeof vRow.images === 'string') {
                                try {
                                    const p = JSON.parse(vRow.images);
                                    if (Array.isArray(p)) arr = p;
                                } catch { /* ignore */ }
                            }
                            thumbImg = arr[0];
                        }
                        const metaBits = [];
                        if (vst) metaBits.push(vst);
                        if (promo.venue_id != null && String(promo.venue_id) !== '') {
                            metaBits.push(`venue_id ${promo.venue_id}`);
                        }
                        const metaLine = metaBits.filter(Boolean).join(' · ');
                        return (
                            <div key={promo.id}
                                className={`bg-white rounded-2xl p-4 md:p-5 border transition-all ${isExpired ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    {/* Venue Info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                            {thumbImg ? (() => {
                                                const img = thumbImg;
                                                const src = img.startsWith('/') ? img : `/${img}`;
                                                return <img src={src} alt="" className="w-full h-full object-cover" />;
                                            })() : (
                                                <div className="w-full h-full flex items-center justify-center"><Store size={20} className="text-gray-400" /></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 truncate">{headline}</h3>
                                                <span className={`px-2 py-0.5 ${tierConf.color} text-white rounded-md text-xs font-bold`}>
                                                    {t(tierConf.labelKey)}
                                                </span>
                                                {promo.tier === 'category_featured' && promo.featured_category && (
                                                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md text-xs font-bold">
                                                        {t(TYPE_LABEL_KEYS[promo.featured_category]) || promo.featured_category}
                                                    </span>
                                                )}
                                                {isExpired && (
                                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded-md text-xs font-bold">{t('promotionsPage.expired')}</span>
                                                )}
                                            </div>
                                            {metaLine ? (
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{metaLine}</p>
                                            ) : null}
                                            {promo.admin_note && (
                                                <p className="text-xs text-orange-600 font-medium mt-1 truncate flex items-center gap-1">
                                                    <Sparkles size={10} />{promo.admin_note}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & Actions */}
                                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={11} />
                                                {promo.start_date} ~ {promo.end_date}
                                            </p>
                                            {!isExpired && (
                                                <p className={`text-xs font-bold mt-0.5 ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                                    {daysLeft <= 0 ? t('promotionsPage.expiresToday') : t('promotionsPage.daysLeft', { days: daysLeft })}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(promo)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title={t('promotionsPage.editTitle')}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(promo.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title={t('promotionsPage.deleteTitle')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ??' Add/Edit Modal '????? */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-gray-900">
                                    {editTarget ? t('promotionsPage.editPromotion') : t('promotionsPage.addPromotionTitle')}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Venue Select */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">{t('promotionsPage.selectVenue')}</label>
                                {!editTarget && (
                                    <div className="relative mb-2">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('promotionsPage.searchVenue')}
                                            value={searchVenue}
                                            onChange={e => setSearchVenue(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                )}
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                                    {availableVenues.length === 0 ? (
                                        <p className="text-center py-4 text-sm text-gray-400">{t('promotionsPage.noAvailableVenues')}</p>
                                    ) : (
                                        availableVenues.map(v => (
                                            <button
                                                key={v.id}
                                                onClick={() => setForm(prev => ({ ...prev, venue_id: v.id }))}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0 ${parseInt(form.venue_id) === parseInt(v.id) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700'
                                                    }`}
                                            >
                                                <Store size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{v.name}</span>
                                                <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{v.location?.split(' ').slice(0, 2).join(' ')}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Tier Select */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">{t('promotionsPage.exposureTier')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(TIER_CONFIG_KEYS).map(([key, conf]) => (
                                        <button
                                            key={key}
                                            onClick={() => setForm(prev => ({ ...prev, tier: key, featured_category: key === 'category_featured' ? prev.featured_category : '' }))}
                                            className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition-all ${form.tier === key
                                                ? `${conf.bgLight} ${conf.textColor}`
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {t(conf.labelKey)}
                                        </button>
                                    ))}
                                </div>
                                {form.tier === 'category_featured' && (
                                    <div className="mt-3">
                                        <label className="text-xs font-bold text-teal-700 mb-1.5 block">{t('promotionsPage.selectCategory')}</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.entries(TYPE_LABEL_KEYS).map(([key, labelKey]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setForm(prev => ({ ...prev, featured_category: key }))}
                                                    className={`px-3 py-2 rounded-lg border text-xs font-bold text-center transition-all ${form.featured_category === key
                                                        ? 'bg-teal-50 border-teal-300 text-teal-700'
                                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {t(labelKey)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Date Range */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">{t('promotionsPage.exposurePeriod')}</label>
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">{t('promotionsPage.startDate')}</label>
                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={e => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">{t('promotionsPage.endDate')}</label>
                                        <input
                                            type="date"
                                            value={form.end_date}
                                            onChange={e => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {[
                                        { days: 7, label: '7' },
                                        { days: 14, label: '14' },
                                        { days: 30, label: '30' },
                                        { days: 60, label: '60' },
                                    ].map(opt => (
                                        <button
                                            key={opt.days}
                                            onClick={() => handleQuickDate(opt.days)}
                                            className="flex-1 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Note */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">{t('promotionsPage.adminNote')}</label>
                                <input
                                    type="text"
                                    value={form.admin_note}
                                    onChange={e => setForm(prev => ({ ...prev, admin_note: e.target.value }))}
                                    placeholder={t('promotionsPage.adminNotePlaceholder')}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    maxLength={100}
                                />
                                <p className="text-xs text-gray-400 mt-1">{t('promotionsPage.adminNotePublic')}</p>
                            </div>

                            {/* Display Order */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">{t('promotionsPage.sortOrder')}</label>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={e => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    min={0}
                                />
                                <p className="text-xs text-gray-400 mt-1">{t('promotionsPage.sortOrderDesc')}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    {editTarget ? t('promotionsPage.editComplete') : t('promotionsPage.registerPromotion')}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    {t('promotionsPage.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminPromotions;
