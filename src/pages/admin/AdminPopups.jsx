import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Monitor, Plus, X, Trash2, Edit3, Eye, EyeOff, Calendar,
    Link2, Image as ImageIcon, Save, AlertTriangle, CheckCircle,
    Megaphone, Bell, Target, ArrowUp, ArrowDown, ExternalLink, Search, Globe, Languages
} from 'lucide-react';

const API_BASE = '/api/popups';

const TYPE_OPTIONS = [
    { value: 'notice', labelKey: 'popupsPage.typeNotice', color: 'bg-blue-100 text-blue-700', icon: '📢' },
    { value: 'ad', labelKey: 'popupsPage.typeAd', color: 'bg-amber-100 text-amber-700', icon: '📣' },
];

const TARGET_OPTIONS = [
    { value: 'all', labelKey: 'popupsPage.targetAll' },
    { value: 'seller', labelKey: 'popupsPage.targetSeller' },
    { value: 'host', labelKey: 'popupsPage.targetVendor' },
];

const COUNTRY_OPTIONS = [
    { code: 'ko', label: '한국', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Việt Nam', flag: '🇻🇳' },
    { code: 'ja', label: '日本', flag: '🇯🇵' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'ru', label: 'Россия', flag: '🇷🇺' },
    { code: 'uk', label: 'Україна', flag: '🇺🇦' },
];

const LANG_TABS = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uk', label: 'Українська', flag: '🇺🇦' },
];

const AdminPopups = () => {
    const { t } = useTranslation('admin');
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form, setForm] = useState({
        popup_type: 'notice', title: '', content: '', click_url: '',
        target_role: 'all', target_countries: 'all', priority: 0, is_active: 1,
        start_date: '', end_date: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [previewPopup, setPreviewPopup] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [translations, setTranslations] = useState({});
    const [activeLangTab, setActiveLangTab] = useState('ko');
    const [translating, setTranslating] = useState(false);

    // Auto-translate Korean title/content to the selected language
    const handleAutoTranslate = async (targetLang) => {
        if (!form.title.trim() && !form.content.trim()) {
            showToast('한국어 제목 또는 내용을 먼저 입력해 주세요.', 'error');
            return;
        }
        setTranslating(true);
        try {
            const texts = [form.title || '', form.content || ''].filter(t => t.trim());
            const res = await fetch('/api/translate.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ texts, source: 'ko', target: targetLang })
            });
            const data = await res.json();
            if (data.success && data.translations) {
                const translated = {};
                if (form.title.trim()) translated.title = data.translations[0] || '';
                if (form.content.trim()) {
                    translated.content = data.translations[form.title.trim() ? 1 : 0] || '';
                }
                setTranslations(prev => ({
                    ...prev,
                    [targetLang]: { ...(prev[targetLang] || {}), ...translated }
                }));
                showToast(`${LANG_TABS.find(l => l.code === targetLang)?.label || targetLang} 번역 완료!`, 'success');
            } else {
                showToast(data.message || '번역에 실패했습니다.', 'error');
            }
        } catch (err) {
            console.error('Auto-translate error:', err);
            showToast('번역 중 오류가 발생했습니다.', 'error');
        } finally {
            setTranslating(false);
        }
    };

    // Translate Korean text to ALL languages at once
    const handleTranslateAll = async () => {
        if (!form.title.trim() && !form.content.trim()) {
            showToast('한국어 제목 또는 내용을 먼저 입력해 주세요.', 'error');
            return;
        }
        setTranslating(true);
        const nonKoLangs = LANG_TABS.filter(l => l.code !== 'ko');
        let successCount = 0;
        for (const lang of nonKoLangs) {
            try {
                const texts = [form.title || '', form.content || ''].filter(t => t.trim());
                const res = await fetch('/api/translate.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ texts, source: 'ko', target: lang.code })
                });
                const data = await res.json();
                if (data.success && data.translations) {
                    const translated = {};
                    if (form.title.trim()) translated.title = data.translations[0] || '';
                    if (form.content.trim()) {
                        translated.content = data.translations[form.title.trim() ? 1 : 0] || '';
                    }
                    setTranslations(prev => ({
                        ...prev,
                        [lang.code]: { ...(prev[lang.code] || {}), ...translated }
                    }));
                    successCount++;
                }
            } catch (err) {
                console.error(`Translate to ${lang.code} failed:`, err);
            }
        }
        showToast(`${successCount}/${nonKoLangs.length}개 언어 번역 완료!`, 'success');
        setTranslating(false);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPopups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/popups.php?admin=1`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setPopups(data.popups || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPopups(); }, [fetchPopups]);

    const resetForm = () => {
        setForm({ popup_type: 'notice', title: '', content: '', click_url: '', target_role: 'all', target_countries: 'all', priority: 0, is_active: 1, start_date: '', end_date: '' });
        setImageFile(null);
        setImagePreview('');
        setEditingPopup(null);
        setTranslations({});
        setActiveLangTab('ko');
    };

    const openForm = (popup = null) => {
        if (popup) {
            setEditingPopup(popup);
            setForm({
                popup_type: popup.popup_type || 'notice',
                title: popup.title || '',
                content: popup.content || '',
                click_url: popup.click_url || '',
                target_role: popup.target_role || 'all',
                target_countries: popup.target_countries || 'all',
                priority: popup.priority || 0,
                is_active: popup.is_active ? 1 : 0,
                start_date: popup.start_date || '',
                end_date: popup.end_date || ''
            });
            setImagePreview(popup.image_url || '');
            // Parse existing translations
            let trans = popup.translations;
            if (typeof trans === 'string') {
                try { trans = JSON.parse(trans); } catch { trans = {}; }
            }
            setTranslations(trans || {});
            setActiveLangTab('ko');
        } else {
            resetForm();
        }
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Accept title from any language, not just Korean
        const hasTitle = form.title.trim() || Object.values(translations).some(tr => tr?.title?.trim());
        if (!hasTitle) { showToast(t('popupsPage.enterTitle'), 'error'); return; }

        // If Korean title is empty, use first available translation as fallback
        let submitForm = { ...form };
        if (!submitForm.title.trim()) {
            const fallbackTitle = Object.values(translations).find(tr => tr?.title?.trim())?.title || '';
            submitForm.title = fallbackTitle;
        }
        if (!submitForm.content.trim()) {
            const fallbackContent = Object.values(translations).find(tr => tr?.content?.trim())?.content || '';
            submitForm.content = fallbackContent;
        }
        setSubmitting(true);
        try {
            if (editingPopup) {
                // PUT update (JSON)
                const body = { id: editingPopup.id, ...submitForm, translations: JSON.stringify(translations) };
                const res = await fetch(`${API_BASE}/popups.php`, {
                    method: 'PUT', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if (data.success) { showToast(t('popupsPage.popupEdited')); fetchPopups(); setShowForm(false); resetForm(); }
                else showToast(data.message || t('popupsPage.editFailed'), 'error');
            } else {
                // POST create (FormData)
                const fd = new FormData();
                Object.entries(submitForm).forEach(([k, v]) => fd.append(k, v));
                if (imageFile) fd.append('image', imageFile);
                fd.append('translations', JSON.stringify(translations));
                const res = await fetch(`${API_BASE}/popups.php`, {
                    method: 'POST', credentials: 'include', body: fd
                });
                const data = await res.json();
                if (data.success) { showToast(t('popupsPage.popupCreated')); fetchPopups(); setShowForm(false); resetForm(); }
                else showToast(data.message || t('popupsPage.createFailed'), 'error');
            }
        } catch (err) { showToast(t('popupsPage.errorOccurred'), 'error'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = (popup) => {
        setConfirmModal({
            title: t('popupsPage.deletePopup'), message: t('popupsPage.deleteConfirm', { title: popup.title }),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/popups.php`, {
                        method: 'DELETE', credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: popup.id })
                    });
                    const data = await res.json();
                    if (data.success) { showToast(t('popupsPage.popupDeleted')); fetchPopups(); }
                    else showToast(t('popupsPage.deleteFailed'), 'error');
                } catch (err) { showToast(t('popupsPage.errorOccurred'), 'error'); }
            }
        });
    };

    const handleToggle = async (popup) => {
        try {
            const res = await fetch(`${API_BASE}/popups.php`, {
                method: 'PUT', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: popup.id, is_active: popup.is_active ? 0 : 1 })
            });
            const data = await res.json();
            if (data.success) {
                setPopups(prev => prev.map(p => p.id === popup.id ? { ...p, is_active: popup.is_active ? 0 : 1 } : p));
                showToast(popup.is_active ? t('popupsPage.popupDeactivated') : t('popupsPage.popupActivated'));
            }
        } catch (err) { showToast(t('popupsPage.errorOccurred'), 'error'); }
    };

    const getTypeInfo = (type) => {
        const opt = TYPE_OPTIONS.find(t2 => t2.value === type) || TYPE_OPTIONS[0];
        return { ...opt, label: t(`popupsPage.${type === 'notice' ? 'typeNotice' : 'typeAd'}`) };
    };

    const filtered = filterType ? popups.filter(p => p.popup_type === filterType) : popups;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full"></div>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Monitor size={28} />
                            <h1 className="text-2xl md:text-3xl font-extrabold">{t('popupsPage.title')}</h1>
                        </div>
                        <p className="text-white/80 text-sm">{t('popupsPage.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => openForm()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
                    >
                        <Plus size={16} />
                        {t('popupsPage.addPopup')}
                    </button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="bg-white/15 px-3 py-1 rounded-full">{t('popupsPage.totalCount', { count: popups.length })}</span>
                    <span className="bg-green-400/20 px-3 py-1 rounded-full">{t('popupsPage.activeCount', { count: popups.filter(p => parseInt(p.is_active)).length })}</span>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setFilterType('')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${!filterType ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{t('popupsPage.filterAll')}</button>
                {TYPE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setFilterType(opt.value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterType === opt.value ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        <span>{opt.icon}</span>{t(opt.labelKey)}
                    </button>
                ))}
            </div>

            {/* Popup List */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <Monitor className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">{t('popupsPage.noPopups')}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('popupsPage.noPopupsDesc')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(popup => {
                        const typeInfo = getTypeInfo(popup.popup_type);
                        const isActive = parseInt(popup.is_active);
                        const isExpired = popup.end_date && new Date(popup.end_date) < new Date();
                        const targetLabel = TARGET_OPTIONS.find(t2 => t2.value === popup.target_role)?.labelKey;

                        return (
                            <div key={popup.id}
                                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${!isActive ? 'border-gray-200 opacity-60' : isExpired ? 'border-orange-200' : 'border-gray-100'}`}>
                                {/* Image preview */}
                                {popup.image_url && (
                                    <div className="h-32 bg-gray-50 relative overflow-hidden cursor-pointer" onClick={() => setPreviewPopup(popup)}>
                                        <img src={popup.image_url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        <div className="absolute top-2 right-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.icon} {typeInfo.label}</span>
                                        </div>
                                        {!isActive && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><span className="text-xs font-bold text-gray-500 bg-white/80 px-3 py-1 rounded-full">{t('popupsPage.inactive')}</span></div>}
                                    </div>
                                )}

                                <div className="p-4">
                                    {/* Top bar */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            {!popup.image_url && (
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${typeInfo.color}`}>{typeInfo.icon} {typeInfo.label}</span>
                                            )}
                                            <h3 className="font-bold text-gray-900 text-sm truncate">{popup.title}</h3>
                                            {popup.content && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{popup.content}</p>}
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-2 flex-wrap mt-3 text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                                            <Target size={9} /> {t(targetLabel || 'popupsPage.targetAll')}
                                        </span>
                                        {/* Country badges */}
                                        {popup.target_countries && popup.target_countries !== 'all' ? (
                                            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                                                <Globe size={9} />
                                                {popup.target_countries.split(',').map(c => COUNTRY_OPTIONS.find(co => co.code === c.trim())?.flag || c).join(' ')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                                                <Globe size={9} /> {t('popupsPage.allCountries', '전체 국가')}
                                            </span>
                                        )}
                                        {popup.start_date && (
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                                                <Calendar size={9} /> {popup.start_date} ~ {popup.end_date || t('popupsPage.noExpiry')}
                                            </span>
                                        )}
                                        {popup.click_url && (
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                                                <Link2 size={9} /> {t('popupsPage.link')}
                                            </span>
                                        )}
                                        <span className="bg-gray-50 px-2 py-0.5 rounded-full">{t('popupsPage.priority', { value: popup.priority })}</span>
                                        {isExpired && <span className="text-orange-500 font-bold">{t('popupsPage.periodExpired')}</span>}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                                        <button onClick={() => handleToggle(popup)}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                            {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {isActive ? t('popupsPage.activeLabel') : t('popupsPage.inactiveLabel')}
                                        </button>
                                        <button onClick={() => setPreviewPopup(popup)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all">
                                            <Monitor size={12} /> {t('popupsPage.preview')}
                                        </button>
                                        <button onClick={() => openForm(popup)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all">
                                            <Edit3 size={12} /> {t('popupsPage.edit')}
                                        </button>
                                        <button onClick={() => handleDelete(popup)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-all ml-auto">
                                            <Trash2 size={12} /> {t('popupsPage.delete')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                {editingPopup ? <Edit3 size={18} /> : <Plus size={18} />}
                                {editingPopup ? t('popupsPage.editPopup') : t('popupsPage.addNewPopup')}
                            </h3>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">{t('popupsPage.popupType')}</label>
                                <div className="flex gap-2">
                                    {TYPE_OPTIONS.map(opt => (
                                        <button key={opt.value} type="button"
                                            onClick={() => setForm(f => ({ ...f, popup_type: opt.value }))}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${form.popup_type === opt.value ? (opt.value === 'notice' ? 'bg-blue-500 text-white border-blue-500' : 'bg-amber-500 text-white border-amber-500') : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                                            {opt.icon} {t(opt.labelKey)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title & Content with Language Tabs */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                                    <Globe size={14} className="text-gray-400 flex-shrink-0 ml-1" />
                                    {/* "전체" tab */}
                                    <button type="button"
                                        onClick={() => setActiveLangTab('all')}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${activeLangTab === 'all'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-200/60'}`}>
                                        🌐 {t('popupsPage.allLangs') || '전체'}
                                    </button>
                                    {LANG_TABS.map(lang => (
                                        <button key={lang.code} type="button"
                                            onClick={() => setActiveLangTab(lang.code)}
                                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${activeLangTab === lang.code
                                                ? 'bg-indigo-500 text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-200/60'}`}>
                                            <span>{lang.flag}</span> {lang.label}
                                            {lang.code !== 'ko' && translations[lang.code]?.title && (
                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 space-y-3">
                                    {activeLangTab === 'all' ? (
                                        /* ── 전체 언어 통합 뷰 ── */
                                        <div className="space-y-3">
                                            {/* 한국어 원문 */}
                                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm">🇰🇷</span>
                                                    <span className="text-xs font-bold text-indigo-700">{t('popupsPage.titleLabel')} (한국어 · 원문)</span>
                                                </div>
                                                <input type="text" value={form.title}
                                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                                    placeholder={t('popupsPage.titlePlaceholder')}
                                                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none mb-2" />
                                                <textarea value={form.content}
                                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                                    placeholder={t('popupsPage.contentPlaceholder')}
                                                    rows={2} className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none resize-none" />
                                            </div>

                                            {/* 전체 언어 자동 번역 버튼 */}
                                            {(form.title.trim() || form.content.trim()) && (
                                                <button type="button" onClick={handleTranslateAll} disabled={translating}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-md">
                                                    {translating ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Languages size={16} />
                                                    )}
                                                    {translating ? (t('popupsPage.translatingAll') || '번역 중...') : (t('popupsPage.translateAll') || '🌐 전체 언어 자동 번역')}
                                                </button>
                                            )}

                                            {/* 각 언어별 번역 상태 */}
                                            <div className="grid gap-2">
                                                {LANG_TABS.filter(l => l.code !== 'ko').map(lang => {
                                                    const hasTitle = !!translations[lang.code]?.title;
                                                    const hasContent = !!translations[lang.code]?.content;
                                                    const completed = hasTitle || hasContent;
                                                    return (
                                                        <div key={lang.code} className={`p-3 rounded-xl border transition-colors ${completed ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">{lang.flag}</span>
                                                                    <span className="text-xs font-bold text-gray-700">{lang.label}</span>
                                                                    {completed ? (
                                                                        <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-bold">✓ {t('popupsPage.translated') || '번역됨'}</span>
                                                                    ) : (
                                                                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-bold">{t('popupsPage.notTranslated') || '미번역'}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button type="button" onClick={() => handleAutoTranslate(lang.code)} disabled={translating || (!form.title.trim() && !form.content.trim())}
                                                                        className="px-2 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-40">
                                                                        {t('popupsPage.autoTranslateShort') || '번역'}
                                                                    </button>
                                                                    <button type="button" onClick={() => setActiveLangTab(lang.code)}
                                                                        className="px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                                                        {t('popupsPage.editLabel') || '편집'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {completed && (
                                                                <div className="text-xs text-gray-600 space-y-0.5">
                                                                    {hasTitle && <p className="truncate"><span className="text-gray-400">{t('popupsPage.titleLabel')}:</span> {translations[lang.code].title}</p>}
                                                                    {hasContent && <p className="truncate"><span className="text-gray-400">{t('popupsPage.contentLabel')}:</span> {translations[lang.code].content}</p>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── 개별 언어 편집 뷰 (기존) ── */
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                                    {t('popupsPage.titleLabel')} {activeLangTab !== 'ko' && <span className="text-indigo-500">({LANG_TABS.find(l => l.code === activeLangTab)?.label})</span>}
                                                </label>
                                                <input type="text"
                                                    value={activeLangTab === 'ko' ? form.title : (translations[activeLangTab]?.title || '')}
                                                    onChange={e => {
                                                        if (activeLangTab === 'ko') {
                                                            setForm(f => ({ ...f, title: e.target.value }));
                                                        } else {
                                                            setTranslations(prev => ({
                                                                ...prev,
                                                                [activeLangTab]: { ...(prev[activeLangTab] || {}), title: e.target.value }
                                                            }));
                                                        }
                                                    }}
                                                    placeholder={activeLangTab === 'ko' ? t('popupsPage.titlePlaceholder') : `${LANG_TABS.find(l => l.code === activeLangTab)?.label} title`}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                                    {t('popupsPage.contentLabel')} {activeLangTab !== 'ko' && <span className="text-indigo-500">({LANG_TABS.find(l => l.code === activeLangTab)?.label})</span>}
                                                </label>
                                                <textarea
                                                    value={activeLangTab === 'ko' ? form.content : (translations[activeLangTab]?.content || '')}
                                                    onChange={e => {
                                                        if (activeLangTab === 'ko') {
                                                            setForm(f => ({ ...f, content: e.target.value }));
                                                        } else {
                                                            setTranslations(prev => ({
                                                                ...prev,
                                                                [activeLangTab]: { ...(prev[activeLangTab] || {}), content: e.target.value }
                                                            }));
                                                        }
                                                    }}
                                                    placeholder={activeLangTab === 'ko' ? t('popupsPage.contentPlaceholder') : `${LANG_TABS.find(l => l.code === activeLangTab)?.label} content`}
                                                    rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none resize-none" />
                                            </div>
                                            {activeLangTab !== 'ko' && !translations[activeLangTab]?.title && (
                                                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <Globe size={11} /> 번역을 입력하지 않으면 한국어(기본)가 표시됩니다.
                                                </p>
                                            )}
                                            {/* Auto-translate buttons */}
                                            {activeLangTab !== 'ko' && (form.title.trim() || form.content.trim()) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoTranslate(activeLangTab)}
                                                    disabled={translating}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                                                >
                                                    {translating ? (
                                                        <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Languages size={12} />
                                                    )}
                                                    한국어 → {LANG_TABS.find(l => l.code === activeLangTab)?.label} 자동 번역
                                                </button>
                                            )}
                                            {activeLangTab === 'ko' && (form.title.trim() || form.content.trim()) && (
                                                <button
                                                    type="button"
                                                    onClick={handleTranslateAll}
                                                    disabled={translating}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:from-indigo-100 hover:to-purple-100 transition-all disabled:opacity-50"
                                                >
                                                    {translating ? (
                                                        <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Languages size={12} />
                                                    )}
                                                    🌐 전체 언어 자동 번역
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t('popupsPage.imageLabel')}</label>
                                {imagePreview && (
                                    <div className="mb-2 rounded-xl overflow-hidden border border-gray-200 relative">
                                        <img src={imagePreview} alt="" className="w-full h-40 object-cover" />
                                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg"><X size={12} /></button>
                                    </div>
                                )}
                                {!editingPopup && (
                                    <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                                        <ImageIcon size={16} className="text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium">{t('popupsPage.imageUpload')}</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                )}
                            </div>

                            {/* Click URL */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t('popupsPage.clickUrl')}</label>
                                <input type="text" value={form.click_url} onChange={e => setForm(f => ({ ...f, click_url: e.target.value }))}
                                    placeholder="https://example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
                            </div>

                            {/* Target + Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t('popupsPage.targetLabel')}</label>
                                    <select value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none">
                                        {TARGET_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t('popupsPage.priorityLabel')}</label>
                                    <input type="number" min="0" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" />
                                </div>
                            </div>

                            {/* Target Countries */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">
                                    <Globe size={12} className="inline mr-1" />
                                    {t('popupsPage.targetCountries', '대상 국가')}
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    <button type="button"
                                        onClick={() => setForm(f => ({ ...f, target_countries: 'all' }))}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${form.target_countries === 'all'
                                            ? 'bg-indigo-500 text-white border-indigo-500'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        🌍 {t('popupsPage.allCountries', '전체')}
                                    </button>
                                    {COUNTRY_OPTIONS.map(c => {
                                        const selected = form.target_countries !== 'all' && form.target_countries.split(',').includes(c.code);
                                        return (
                                            <button key={c.code} type="button"
                                                onClick={() => {
                                                    if (form.target_countries === 'all') {
                                                        setForm(f => ({ ...f, target_countries: c.code }));
                                                    } else {
                                                        const codes = form.target_countries.split(',').filter(Boolean);
                                                        if (codes.includes(c.code)) {
                                                            const next = codes.filter(x => x !== c.code);
                                                            setForm(f => ({ ...f, target_countries: next.length > 0 ? next.join(',') : 'all' }));
                                                        } else {
                                                            setForm(f => ({ ...f, target_countries: [...codes, c.code].join(',') }));
                                                        }
                                                    }
                                                }}
                                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${selected
                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {c.flag} {c.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {form.target_countries !== 'all' && (
                                    <p className="text-[10px] text-indigo-500 mt-1.5 flex items-center gap-1">
                                        <Globe size={10} />
                                        {t('popupsPage.countryNote', '선택한 국가의 사용자에게만 팝업이 표시됩니다.')}
                                    </p>
                                )}
                            </div>

                            {/* Dates */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500">{t('popupsPage.dateRange')}</label>
                                    <div className="flex gap-1.5">
                                        {[7, 14, 30, 60, 90].map(days => {
                                            const fmt = d => d.toISOString().split('T')[0];
                                            return (
                                                <button key={days} type="button"
                                                    onClick={() => {
                                                        const start = new Date();
                                                        const end = new Date();
                                                        end.setDate(end.getDate() + days);
                                                        setForm(f => ({ ...f, start_date: fmt(start), end_date: fmt(end) }));
                                                    }}
                                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                                                >{days}{t('popupsPage.daysLabel', { days: '' }).replace(/\d+/g, '').trim()}</button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-400 mb-1">{t('popupsPage.startDate')}</label>
                                        <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-400 mb-1">{t('popupsPage.endDate')}</label>
                                        <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                <span className="text-xs font-bold text-gray-600">{t('popupsPage.activeStatus')}</span>
                                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: f.is_active ? 0 : 1 }))}
                                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${form.is_active ? 'bg-green-400' : 'bg-gray-300'}`}>
                                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
                                        style={{ left: form.is_active ? '1.25rem' : '0.125rem' }} />
                                </button>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm">{t('popupsPage.cancelBtn')}</button>
                                <button type="submit" disabled={submitting}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                                    <Save size={14} />
                                    {submitting ? t('popupsPage.saving') : (editingPopup ? t('popupsPage.editSubmit') : t('popupsPage.createSubmit'))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewPopup && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewPopup(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}
                        style={{ animation: 'popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        {previewPopup.image_url && (
                            <div className="relative">
                                <img src={previewPopup.image_url} alt="" className="w-full max-h-72 object-cover" />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTypeInfo(previewPopup.popup_type).color}`}>
                                    {getTypeInfo(previewPopup.popup_type).icon} {getTypeInfo(previewPopup.popup_type).label}
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">{previewPopup.title}</h2>
                            {previewPopup.content && <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{previewPopup.content}</p>}
                            {previewPopup.click_url && (
                                <a href={previewPopup.click_url} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors mb-4">
                                    <ExternalLink size={14} /> {t('popupsPage.viewDetails')}
                                </a>
                            )}
                            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                <button onClick={() => setPreviewPopup(null)}
                                    className="flex-1 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50">{t('popupsPage.closeBtn')}</button>
                                <button onClick={() => setPreviewPopup(null)}
                                    className="flex-1 py-2.5 text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-50">{t('popupsPage.dontShowToday')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
                        <p className="text-sm text-gray-500 mb-5">{confirmModal.message}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmModal(null)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">{t('popupsPage.cancelLabel')}</button>
                            <button onClick={confirmModal.onConfirm}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">{t('popupsPage.deleteLabel')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}
                    style={{ animation: 'popupScale 0.3s ease' }}>
                    {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <style>{`
                @keyframes popupScale {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AdminPopups;
