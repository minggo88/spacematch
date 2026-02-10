import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Flame, TrendingUp, Search, Plus, X, Calendar, Store,
    MapPin, Trash2, Edit3, ArrowUpDown, Clock, CheckCircle,
    AlertCircle, Eye, ChevronDown, Sparkles, AlertTriangle, XCircle
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const TIER_CONFIG = {
    hot_top: { label: '핫보 모집', color: 'bg-gradient-to-r from-orange-500 to-red-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50 border-orange-200' },
    hot_mid: { label: '엄선한 모집 정보', color: 'bg-gradient-to-r from-violet-500 to-purple-600', textColor: 'text-violet-600', bgLight: 'bg-violet-50 border-violet-200' },
    category_featured: { label: '카테고리 상위', color: 'bg-gradient-to-r from-teal-500 to-cyan-600', textColor: 'text-teal-600', bgLight: 'bg-teal-50 border-teal-200' },
};

const TYPE_LABELS = {
    popup: '팝업스토어', gallery: '갤러리', cafe: '카페',
    showroom: '쇼룸', fleamarket: '플리마켓', store: '매장'
};

const AdminPromotions = () => {
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
            const res = await fetch(`${API_BASE}/promotions/get_admin_promotions.php`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) {
                setPromotions(json.promotions || []);
                setAllVenues(json.venues || []);
            }
        } catch (err) {
            console.error('프로모션 데이터 로드 실패:', err);
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
            showToast('필수 항목을 모두 입력해주세요', 'error');
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
                showToast('프로모션이 등록되었습니다!', 'success');
            } else {
                showToast(json.message || '오류가 발생했습니다.', 'error');
            }
        } catch (err) {
            showToast('서버 연결에 실패했습니다.', 'error');
        }
    };

    const handleRemove = async (promotionId) => {
        setConfirmModal({
            title: '프로모션 삭제',
            message: '이 프로모션을 삭제하시겠습니까?',
            type: 'danger',
            confirmLabel: '삭제',
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
                        showToast('프로모션이 삭제되었습니다.', 'success');
                    }
                } catch (err) {
                    showToast('서버 연결에 실패했습니다.', 'error');
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
                        모집 관리</h1>
                    <p className="text-sm text-gray-500 mt-1">베뉴별 상세 정보 또는 한정 모집 영역으로 홍보하고 노출 기간을 관리합니다.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} />
                    프로모션 추가
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-2xl font-black text-gray-900">{promotions.length}</p>
                    <p className="text-xs text-gray-500 font-medium">전체 프로모션</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                    <p className="text-xs text-emerald-600 font-medium">활성</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-2xl font-black text-gray-400">{expiredCount}</p>
                    <p className="text-xs text-gray-400 font-medium">만료</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {[
                    { value: '', label: '전체' },
                    { value: 'hot_top', label: '핫보' },
                    { value: 'hot_mid', label: '엄선한 모집' },
                    { value: 'category_featured', label: '카테고리 상위' },
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
                        <p className="text-gray-400 font-medium">등록된 프로모션이 없습니다.</p>
                        <button onClick={handleOpenAdd} className="text-indigo-600 font-bold text-sm mt-2 hover:underline">
                            + 새 프로모션 추가하기
                        </button>
                    </div>
                ) : (
                    filteredPromotions.map(promo => {
                        const isExpired = promo.promo_status === 'expired';
                        const tierConf = TIER_CONFIG[promo.tier];
                        const daysLeft = Math.ceil((new Date(promo.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                        return (
                            <div key={promo.id}
                                className={`bg-white rounded-2xl p-4 md:p-5 border transition-all ${isExpired ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    {/* Venue Info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                            {promo.venue_images?.[0] ? (() => {
                                                const img = promo.venue_images[0];
                                                const src = img.startsWith('/') ? img : `/${img}`;
                                                return <img src={src} alt="" className="w-full h-full object-cover" />;
                                            })() : (
                                                <div className="w-full h-full flex items-center justify-center"><Store size={20} className="text-gray-400" /></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 truncate">{promo.venue_name}</h3>
                                                <span className={`px-2 py-0.5 ${tierConf.color} text-white rounded-md text-xs font-bold`}>
                                                    {tierConf.label}
                                                </span>
                                                {promo.tier === 'category_featured' && promo.featured_category && (
                                                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md text-xs font-bold">
                                                        {TYPE_LABELS[promo.featured_category] || promo.featured_category}
                                                    </span>
                                                )}
                                                {isExpired && (
                                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded-md text-xs font-bold">만료</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {promo.venue_location} · {TYPE_LABELS[promo.venue_type] || promo.venue_type}
                                            </p>
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
                                                    {daysLeft <= 0 ? '오늘 만료' : `${daysLeft}일 남음`}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(promo)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="수정"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(promo.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="삭제"
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
                                    {editTarget ? '프로모션 수정' : '프로모션 추가'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Venue Select */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">베뉴 선택 *</label>
                                {!editTarget && (
                                    <div className="relative mb-2">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="베뉴 검색.."
                                            value={searchVenue}
                                            onChange={e => setSearchVenue(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                )}
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                                    {availableVenues.length === 0 ? (
                                        <p className="text-center py-4 text-sm text-gray-400">선택 가능한 베뉴가 없습니다.</p>
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
                                <label className="text-sm font-bold text-gray-700 mb-2 block">노출 등급 *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(TIER_CONFIG).map(([key, conf]) => (
                                        <button
                                            key={key}
                                            onClick={() => setForm(prev => ({ ...prev, tier: key, featured_category: key === 'category_featured' ? prev.featured_category : '' }))}
                                            className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition-all ${form.tier === key
                                                ? `${conf.bgLight} ${conf.textColor}`
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {conf.label}
                                        </button>
                                    ))}
                                </div>
                                {form.tier === 'category_featured' && (
                                    <div className="mt-3">
                                        <label className="text-xs font-bold text-teal-700 mb-1.5 block">카테고리 선택 *</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.entries(TYPE_LABELS).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setForm(prev => ({ ...prev, featured_category: key }))}
                                                    className={`px-3 py-2 rounded-lg border text-xs font-bold text-center transition-all ${form.featured_category === key
                                                        ? 'bg-teal-50 border-teal-300 text-teal-700'
                                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Date Range */}
                            <div className="mb-5">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">노출 기간 *</label>
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">시작일</label>
                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={e => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">종료</label>
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
                                <label className="text-sm font-bold text-gray-700 mb-2 block">관리자 메모 / 카피라이트</label>
                                <input
                                    type="text"
                                    value={form.admin_note}
                                    onChange={e => setForm(prev => ({ ...prev, admin_note: e.target.value }))}
                                    placeholder="예: 강남 최고 인기 팝업 공간!"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    maxLength={100}
                                />
                                <p className="text-xs text-gray-400 mt-1">공개 페이지에 표시됩니다 (선택사항)</p>
                            </div>

                            {/* Display Order */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-gray-700 mb-2 block">정렬 순서</label>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={e => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    min={0}
                                />
                                <p className="text-xs text-gray-400 mt-1">낮은 숫자가 먼저 노출됩니다 (0이 최우선)</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    {editTarget ? '수정 완료' : '프로모션 등록'}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    취소
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
