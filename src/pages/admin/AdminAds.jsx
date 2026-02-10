import React, { useState, useEffect, useCallback } from 'react';
import {
    Megaphone, Plus, X, Trash2, Edit3, Eye, EyeOff, Calendar,
    Link2, Image as ImageIcon, Search, Filter, BarChart3,
    MousePointer, Monitor, Smartphone, Settings, Save,
    AlertTriangle, CheckCircle, XCircle, ChevronDown, ExternalLink
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api/ads';

const SLOT_OPTIONS = [
    { value: 'home_a', label: '\uD648\uD398\uC774\uC9C0 A (Services & How It Works)', page: '\uD648\uD398\uC774\uC9C0' },
    { value: 'home_b', label: '\uD648\uD398\uC774\uC9C0 B (Stats & CTA)', page: '\uD648\uD398\uC774\uC9C0' },
    { value: 'directory_c', label: '\uAC80\uC0C9 C (Featured \uD0C0\uC77C)', page: '\uAC80\uC0C9 \uD398\uC774\uC9C0' },
    { value: 'directory_d', label: '\uAC80\uC0C9 D (\uCE74\uB4DC \uADF8\uB9AC\uB4DC \uC911\uAC04)', page: '\uAC80\uC0C9 \uD398\uC774\uC9C0' },
    { value: 'community_e', label: '\uCEE4\uBBA4\uB2C8\uD2F0 E (\uC778\uAE30 \uAE00 \uC0C1\uB2E8)', page: '\uCEE4\uBBA4\uB2C8\uD2F0' },
    { value: 'community_f', label: '\uCEE4\uBBA4\uB2C8\uD2F0 F (\uD53C\uB4DC \uC911\uAC04)', page: '\uCEE4\uBBA4\uB2C8\uD2F0' },
];

const AdminAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSlot, setFilterSlot] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [showAdSenseSettings, setShowAdSenseSettings] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    // Form state
    const [form, setForm] = useState({
        slot_id: 'home_a',
        title: '',
        click_url: '',
        start_date: '',
        end_date: '',
        is_active: 1,
        priority: 0,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // AdSense config state
    const [adsenseForm, setAdsenseForm] = useState({
        client_id: '',
        is_enabled: 0,
        slot_configs: {},
    });

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const fetchAds = useCallback(async () => {
        try {
            const url = filterSlot
                ? `${API_BASE}/list_ads.php?slot_id=${filterSlot}`
                : `${API_BASE}/list_ads.php`;
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setAds(data.ads || []);
        } catch (err) {
            showToast('광고 목록을 불러올 수 없습니다.', 'error');
        } finally {
            setLoading(false);
        }
    }, [filterSlot, showToast]);

    const fetchAdsenseConfig = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/adsense_config.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.config) {
                setAdsenseForm({
                    client_id: data.config.client_id || '',
                    is_enabled: data.config.is_enabled || 0,
                    slot_configs: data.config.slot_configs || {},
                });
            }
        } catch { /* silent */ }
    }, []);

    useEffect(() => { fetchAds(); }, [fetchAds]);
    useEffect(() => { fetchAdsenseConfig(); }, [fetchAdsenseConfig]);

    const resetForm = () => {
        setForm({ slot_id: 'home_a', title: '', click_url: '', start_date: '', end_date: '', is_active: 1, priority: 0 });
        setImageFile(null);
        setImagePreview(null);
        setEditingAd(null);
    };

    const handleOpenForm = (ad = null) => {
        if (ad) {
            setEditingAd(ad);
            setForm({
                slot_id: ad.slot_id,
                title: ad.title,
                click_url: ad.click_url || '',
                start_date: ad.start_date || '',
                end_date: ad.end_date || '',
                is_active: ad.is_active,
                priority: ad.priority || 0,
            });
            setImagePreview(ad.image_url);
        } else {
            resetForm();
        }
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast('파일 크기는 2MB 이하여야 합니다.', 'error');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { showToast('광고 제목을 입력하세요.', 'error'); return; }
        if (!editingAd && !imageFile) { showToast('이미지를 업로드하세요.', 'error'); return; }

        setSubmitting(true);
        const formData = new FormData();
        if (editingAd) formData.append('id', editingAd.id);
        formData.append('slot_id', form.slot_id);
        formData.append('title', form.title);
        formData.append('click_url', form.click_url);
        formData.append('start_date', form.start_date);
        formData.append('end_date', form.end_date);
        formData.append('is_active', form.is_active);
        formData.append('priority', form.priority);
        if (imageFile) formData.append('image', imageFile);

        try {
            const url = editingAd ? `${API_BASE}/update_ad.php` : `${API_BASE}/create_ad.php`;
            const res = await fetch(url, { method: 'POST', credentials: 'include', body: formData });
            const data = await res.json();
            if (data.success) {
                showToast(editingAd ? '광고가 수정되었습니다.' : '광고가 등록되었습니다.', 'success');
                setShowForm(false);
                resetForm();
                fetchAds();
            } else {
                showToast(data.message || '오류가 발생했습니다.', 'error');
            }
        } catch {
            showToast('서버 연결에 실패했습니다.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (ad) => {
        setConfirmModal({
            title: '광고 삭제',
            message: `"${ad.title}" 광고를 삭제하시겠습니까?`,
            type: 'danger',
            confirmLabel: '삭제',
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/delete_ad.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ id: ad.id }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('광고가 삭제되었습니다.', 'success');
                        fetchAds();
                    } else {
                        showToast(data.message || '실패', 'error');
                    }
                } catch {
                    showToast('서버 연결에 실패했습니다.', 'error');
                }
            }
        });
    };

    const handleToggleActive = async (ad) => {
        const formData = new FormData();
        formData.append('id', ad.id);
        formData.append('slot_id', ad.slot_id);
        formData.append('title', ad.title);
        formData.append('click_url', ad.click_url || '');
        formData.append('start_date', ad.start_date || '');
        formData.append('end_date', ad.end_date || '');
        formData.append('is_active', ad.is_active == 1 ? 0 : 1);
        formData.append('priority', ad.priority || 0);

        try {
            const res = await fetch(`${API_BASE}/update_ad.php`, { method: 'POST', credentials: 'include', body: formData });
            const data = await res.json();
            if (data.success) {
                showToast(ad.is_active == 1 ? '광고가 비활성화되었습니다.' : '광고가 활성화되었습니다.', 'success');
                fetchAds();
            }
        } catch {
            showToast('서버 연결에 실패했습니다.', 'error');
        }
    };

    const handleSaveAdsense = async () => {
        try {
            const res = await fetch(`${API_BASE}/adsense_config.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(adsenseForm),
            });
            const data = await res.json();
            if (data.success) showToast('AdSense \uC124\uC815\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.', 'success');
            else showToast(data.message || '저장 실패', 'error');
        } catch {
            showToast('서버 연결에 실패했습니다.', 'error');
        }
    };

    const getSlotLabel = (slotId) => SLOT_OPTIONS.find(s => s.value === slotId)?.label || slotId;
    const getSlotPage = (slotId) => SLOT_OPTIONS.find(s => s.value === slotId)?.page || '';

    const filteredAds = ads.filter(ad => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            if (!ad.title.toLowerCase().includes(term) && !ad.slot_id.toLowerCase().includes(term)) return false;
        }
        return true;
    });

    // Group ads by page
    const grouped = {};
    filteredAds.forEach(ad => {
        const page = getSlotPage(ad.slot_id);
        if (!grouped[page]) grouped[page] = [];
        grouped[page].push(ad);
    });

    const totalImpressions = ads.reduce((sum, a) => sum + parseInt(a.impressions || 0), 0);
    const totalClicks = ads.reduce((sum, a) => sum + parseInt(a.clicks || 0), 0);
    const activeCount = ads.filter(a => a.is_active == 1).length;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Megaphone className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">광고 관리</h1>
                        <p className="text-sm text-gray-500">광고 슬롯 및 Google AdSense 설정</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAdSenseSettings(!showAdSenseSettings)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        <Settings size={16} />
                        AdSense 설정
                    </button>
                    <button
                        onClick={() => handleOpenForm()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus size={16} />
                        광고 등록
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: '전체 광고', value: ads.length, icon: <Megaphone size={18} />, color: 'from-indigo-500 to-violet-600' },
                    { label: '활성 광고', value: activeCount, icon: <Eye size={18} />, color: 'from-emerald-500 to-teal-600' },
                    { label: '총 노출수', value: totalImpressions.toLocaleString(), icon: <BarChart3 size={18} />, color: 'from-blue-500 to-indigo-600' },
                    { label: '총 클릭수', value: totalClicks.toLocaleString(), icon: <MousePointer size={18} />, color: 'from-orange-500 to-red-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className={`w-9 h-9 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* AdSense Settings Panel */}
            {showAdSenseSettings && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Settings size={20} className="text-gray-400" />
                            Google AdSense 설정
                        </h2>
                        <button onClick={() => setShowAdSenseSettings(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-600 min-w-[100px]">Client ID</label>
                            <input
                                type="text"
                                value={adsenseForm.client_id}
                                onChange={e => setAdsenseForm({ ...adsenseForm, client_id: e.target.value })}
                                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none text-sm font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-600 min-w-[100px]">활성화</label>
                            <button
                                onClick={() => setAdsenseForm({ ...adsenseForm, is_enabled: adsenseForm.is_enabled ? 0 : 1 })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${adsenseForm.is_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {adsenseForm.is_enabled ? '활성화' : '비활성화'}
                            </button>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-2 block">슬롯별 AdSense Slot ID</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {SLOT_OPTIONS.map(slot => (
                                    <div key={slot.value} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 min-w-[180px] truncate">{slot.label}</span>
                                        <input
                                            type="text"
                                            value={adsenseForm.slot_configs?.[slot.value] || ''}
                                            onChange={e => setAdsenseForm({
                                                ...adsenseForm,
                                                slot_configs: { ...adsenseForm.slot_configs, [slot.value]: e.target.value }
                                            })}
                                            placeholder="AdSense Slot ID"
                                            className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border border-transparent focus:border-indigo-500 outline-none text-xs font-medium"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleSaveAdsense}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={16} />
                            저장</button>
                    </div>
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="광고 제목으로 검색.."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none font-medium text-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filterSlot}
                            onChange={e => setFilterSlot(e.target.value)}
                            className="w-full md:w-48 px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                        >
                            <option value="">전체 슬롯</option>
                            {SLOT_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label.split(' (')[0]}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Ad List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                </div>
            ) : filteredAds.length === 0 ? (
                <div className="text-center py-20">
                    <Megaphone className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-400">등록된 광고가 없습니다</h3>
                    <p className="text-sm text-gray-400 mt-1">광고를 등록하면 여기에 표시됩니다</p>
                    <button
                        onClick={() => handleOpenForm()}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} />
                        새 광고 등록하기
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([page, pageAds]) => (
                        <div key={page}>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Monitor size={14} />
                                {page || '기타'}
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{pageAds.length}</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pageAds.map(ad => (
                                    <div key={ad.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Image Preview */}
                                        <div className="relative aspect-[3/1] bg-gray-100">
                                            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 flex items-center gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.is_active == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {ad.is_active == 1 ? '활성' : '비활성'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 truncate mb-1">{ad.title}</h4>
                                            <p className="text-xs text-gray-400 mb-2 truncate">{getSlotLabel(ad.slot_id)}</p>

                                            <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <BarChart3 size={12} />
                                                    {parseInt(ad.impressions || 0).toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MousePointer size={12} />
                                                    {parseInt(ad.clicks || 0).toLocaleString()}
                                                </span>
                                                {(ad.start_date || ad.end_date) && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {ad.start_date || '~'} ~ {ad.end_date || ''}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleActive(ad)}
                                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${ad.is_active == 1
                                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                        }`}
                                                >
                                                    {ad.is_active == 1 ? <><EyeOff size={12} className="inline mr-1" />{"\uBE44\uD65C\uC131\uD654"}</> : <><Eye size={12} className="inline mr-1" />{"\uD65C\uC131\uD654"}</>}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenForm(ad)}
                                                    className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ad)}
                                                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white flex items-center justify-between">
                            <h2 className="font-extrabold text-lg flex items-center gap-2">
                                <Megaphone size={20} />
                                {editingAd ? '광고 수정' : '새 광고 등록'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white/80 hover:text-white">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Slot Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">광고 슬롯</label>
                                <select
                                    value={form.slot_id}
                                    onChange={e => setForm({ ...form, slot_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                >
                                    {SLOT_OPTIONS.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">광고 제목</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="광고 제목 입력"
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                    광고 이미지 {editingAd ? '(선택사항)' : ''} <span className="text-gray-400 normal-case">최대 2MB</span>
                                </label>
                                {imagePreview && (
                                    <div className="relative mb-2 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={imagePreview} alt="미리보기" className="w-full h-32 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(editingAd?.image_url || null); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-white hover:bg-black/70"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
                                    <ImageIcon size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-500 font-medium">이미지 선택...</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>

                            {/* Click URL */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">클릭 URL (선택)</label>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="url"
                                        value={form.click_url}
                                        onChange={e => setForm({ ...form, click_url: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">시작일 (선택)</label>
                                    <input
                                        type="date"
                                        value={form.start_date}
                                        onChange={e => setForm({ ...form, start_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">종료일 (선택)</label>
                                    <input
                                        type="date"
                                        value={form.end_date}
                                        onChange={e => setForm({ ...form, end_date: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* Priority & Active */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">우선순위</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.priority}
                                        onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">상태</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, is_active: form.is_active ? 0 : 1 })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${form.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {form.is_active ? '✅ 활성' : '⏸️ 비활성'}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? '처리 중..' : (editingAd ? '수정 완료' : '등록 완료')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminAds;
