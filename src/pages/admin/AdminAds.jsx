import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Megaphone, Plus, X, Trash2, Edit3, Eye, EyeOff, Calendar,
    Link2, Image as ImageIcon, Search, Filter, BarChart3,
    MousePointer, Monitor, Smartphone, Settings, Save,
    AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Copy,
    ArrowUp, ArrowDown, TrendingUp, Percent, Layers, Share2, Pause, Play, Check, FolderOpen,
    LayoutGrid, List
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

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
import Toast from '../../components/Toast';
import AdminAdDashboard from './AdminAdDashboard';
import CampaignReportModal from './CampaignReportModal';

const API_BASE = '/api/ads';

const SLOT_OPTIONS_RAW = [
    { value: 'home_top', labelKey: 'slotHomeTop', pageKey: 'slotHomepage' },
    { value: 'home_a', labelKey: 'slotHomeA', pageKey: 'slotHomepage' },
    { value: 'home_a2', labelKey: 'slotHomeA2', pageKey: 'slotHomepage' },
    { value: 'home_b', labelKey: 'slotHomeB', pageKey: 'slotHomepage' },
    { value: 'home_b2', labelKey: 'slotHomeB2', pageKey: 'slotHomepage' },
    { value: 'home_b3', labelKey: 'slotHomeB3', pageKey: 'slotHomepage' },
    { value: 'home_b4', labelKey: 'slotHomeB4', pageKey: 'slotHomepage' },
    { value: 'home_c', labelKey: 'slotHomeC', pageKey: 'slotHomepage' },
    { value: 'home_d', labelKey: 'slotHomeD', pageKey: 'slotHomepage' },
    { value: 'home_e', labelKey: 'slotHomeE', pageKey: 'slotHomepage' },
    { value: 'home_f', labelKey: 'slotHomeF', pageKey: 'slotHomepage' },
    { value: 'directory_c', labelKey: 'slotDirectoryC', pageKey: 'slotSearch' },
    { value: 'directory_d', labelKey: 'slotDirectoryD', pageKey: 'slotSearch' },
    { value: 'seller_community_top', labelKey: 'slotSellerCommunityTop', pageKey: 'slotSellerCommunity' },
    { value: 'seller_community_feed', labelKey: 'slotSellerCommunityFeed', pageKey: 'slotSellerCommunity' },
    { value: 'host_community_top', labelKey: 'slotHostCommunityTop', pageKey: 'slotVendorCommunity' },
    { value: 'host_community_feed', labelKey: 'slotHostCommunityFeed', pageKey: 'slotVendorCommunity' },
    { value: 'general_community_top', labelKey: 'slotGeneralCommunityTop', pageKey: 'slotGeneralCommunity' },
    { value: 'general_community_feed', labelKey: 'slotGeneralCommunityFeed', pageKey: 'slotGeneralCommunity' },
];

const SLOT_SIZE_GUIDE = {
    home_top: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    home_a: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_a2: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_b: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_b2: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_b3: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_b4: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    home_c: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    home_d: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    home_e: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    home_f: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    directory_c: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    directory_c2: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    directory_d: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    directory_d2: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    seller_community_top: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    seller_community_feed: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    host_community_top: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    host_community_feed: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    general_community_top: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    general_community_feed: { format: 'native', size: '1200 × 240px', ratio: '5:1' },
    landing_a: { format: 'banner', size: '1200 × 250px', ratio: '~5:1' },
    landing_b: { format: 'card', size: '800 × 450px', ratio: '16:9' },
    landing_b2: { format: 'card', size: '800 × 450px', ratio: '16:9' },
};

const AdminAds = () => {
    const { t } = useTranslation('admin');
    const SLOT_OPTIONS = SLOT_OPTIONS_RAW.map(s => ({ ...s, label: t(`adsPage.${s.labelKey}`), page: t(`adsPage.${s.pageKey}`) }));
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSlot, setFilterSlot] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [showAdSenseSettings, setShowAdSenseSettings] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [reportAd, setReportAd] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sortBy, setSortBy] = useState('views');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [countryFilter, setCountryFilter] = useState('all'); // country filter
    const [showBatchEdit, setShowBatchEdit] = useState(false);
    const [batchEditForm, setBatchEditForm] = useState({
        target_countries: { enabled: false, value: 'all' },
        slot_id: { enabled: false, value: 'home_a' },
        priority: { enabled: false, value: 0 },
        start_date: { enabled: false, value: '' },
        end_date: { enabled: false, value: '' },
        is_active: { enabled: false, value: 1 },
    });

    // Campaign state
    const [campaigns, setCampaigns] = useState([]);
    const [unassignedAds, setUnassignedAds] = useState([]);
    const [expandedCampaign, setExpandedCampaign] = useState(null);
    const [showCampaignForm, setShowCampaignForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [campaignForm, setCampaignForm] = useState({ name: '', advertiser: '', budget: '', start_date: '', end_date: '', status: 'active', memo: '', target_countries: 'all' });
    const [campaignReportId, setCampaignReportId] = useState(null);
    const [assigningCampaignId, setAssigningCampaignId] = useState(null);
    const [assignSelectedAds, setAssignSelectedAds] = useState(new Set());
    const [campaignSearch, setCampaignSearch] = useState('');

    const [form, setForm] = useState({
        slot_id: 'home_a', title: '', click_url: '',
        start_date: '', end_date: '', is_active: 1, priority: 0, target_countries: 'all',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [adsenseForm, setAdsenseForm] = useState({ client_id: '', is_enabled: 0, slot_configs: {} });

    const showToast = useCallback((message, type = 'success') => { setToast({ message, type }); }, []);

    const fetchAds = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filterSlot) params.set('slot_id', filterSlot);
            if (countryFilter && countryFilter !== 'all') params.set('country', countryFilter);
            const qs = params.toString();
            const url = `${API_BASE}/list_ads.php${qs ? '?' + qs : ''}`;
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setAds(data.ads || []);
        } catch { showToast(t('adsPage.loadFailed'), 'error'); }
        finally { setLoading(false); }
    }, [filterSlot, countryFilter, showToast]);

    const fetchAdsenseConfig = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/adsense_config.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.config) {
                setAdsenseForm({ client_id: data.config.client_id || '', is_enabled: data.config.is_enabled || 0, slot_configs: data.config.slot_configs || {} });
            }
        } catch { /* silent */ }
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/campaign_api.php?action=list`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setCampaigns(data.campaigns || []);
                setUnassignedAds(data.unassigned_ads || []);
            }
        } catch { /* silent */ }
    }, []);

    useEffect(() => { fetchAds(); }, [fetchAds]);
    useEffect(() => { fetchAdsenseConfig(); }, [fetchAdsenseConfig]);
    useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

    const handleCampaignSubmit = async () => {
        if (!campaignForm.name.trim()) { showToast(t('adsPage.campaignNameRequired'), 'error'); return; }
        try {
            const res = await fetch(`${API_BASE}/campaign_api.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: editingCampaign ? 'update' : 'create', id: editingCampaign?.id, ...campaignForm, budget: campaignForm.budget || null })
            });
            const data = await res.json();
            showToast(data.message || (data.success ? t('adsPage.done') : t('adsPage.failed')), data.success ? 'success' : 'error');
            if (data.success) { setShowCampaignForm(false); setEditingCampaign(null); setCampaignForm({ name: '', advertiser: '', budget: '', start_date: '', end_date: '', status: 'active', memo: '', target_countries: 'all' }); fetchCampaigns(); }
        } catch { showToast(t('adsPage.errorOccurred'), 'error'); }
    };

    const handleCampaignDelete = (c) => {
        setConfirmModal({
            title: t('adsPage.deleteCampaign'), message: t('adsPage.deleteCampaignMsg', { name: c.name }), type: 'danger',
            onConfirm: async () => {
                const res = await fetch(`${API_BASE}/campaign_api.php`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id: c.id }) });
                const data = await res.json();
                showToast(data.message, data.success ? 'success' : 'error');
                if (data.success) fetchCampaigns();
                setConfirmModal(null);
            }
        });
    };

    const handleAssignAds = async (campaignId) => {
        if (assignSelectedAds.size === 0) { showToast(t('adsPage.selectAdsToAssign'), 'error'); return; }
        try {
            const res = await fetch(`${API_BASE}/campaign_api.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'assign', campaign_id: campaignId, ad_ids: [...assignSelectedAds] })
            });
            const data = await res.json();
            showToast(data.message, data.success ? 'success' : 'error');
            if (data.success) { setAssigningCampaignId(null); setAssignSelectedAds(new Set()); fetchCampaigns(); fetchAds(); }
        } catch { showToast(t('adsPage.errorOccurred'), 'error'); }
    };

    const handleUnassignAd = async (adId) => {
        try {
            const res = await fetch(`${API_BASE}/campaign_api.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'assign', campaign_id: null, ad_ids: [adId] })
            });
            const data = await res.json();
            if (data.success) { fetchCampaigns(); fetchAds(); }
        } catch { /* silent */ }
    };

    const resetForm = () => {
        setForm({ slot_id: 'home_a', title: '', click_url: '', start_date: '', end_date: '', is_active: 1, priority: 0, target_countries: 'all' });
        setImageFile(null); setImagePreview(null); setEditingAd(null);
    };

    const handleOpenForm = (ad = null) => {
        if (ad) {
            setEditingAd(ad);
            setForm({ slot_id: ad.slot_id, title: ad.title, click_url: ad.click_url || '', start_date: ad.start_date || '', end_date: ad.end_date || '', is_active: ad.is_active, priority: ad.priority || 0, target_countries: ad.target_countries || 'all' });
            setImagePreview(ad.image_url);
        } else { resetForm(); }
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { showToast(t('adsPage.adTitleRequired'), 'error'); return; }
        if (!editingAd && !imageFile) { showToast(t('adsPage.uploadImage'), 'error'); return; }
        setSubmitting(true);
        const formData = new FormData();
        if (editingAd) formData.append('id', editingAd.id);
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (imageFile) formData.append('image', imageFile);
        try {
            const url = editingAd ? `${API_BASE}/update_ad.php` : `${API_BASE}/create_ad.php`;
            const res = await fetch(url, { method: 'POST', credentials: 'include', body: formData });
            const data = await res.json();
            if (data.success) { showToast(editingAd ? t('adsPage.adUpdated') : t('adsPage.adCreated')); setShowForm(false); resetForm(); fetchAds(); }
            else showToast(data.message || t('adsPage.errorOccurred'), 'error');
        } catch { showToast(t('adsPage.serverError'), 'error'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = (ad) => {
        setConfirmModal({
            title: t('adsPage.deleteAd'), message: t('adsPage.deleteAdMsg', { title: ad.title }), type: 'danger', confirmLabel: t('adsPage.deleteLabel'),
            onConfirm: async () => {
                setConfirmModal(null);
                try {
                    const res = await fetch(`${API_BASE}/delete_ad.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id: ad.id }) });
                    const data = await res.json();
                    if (data.success) { showToast(t('adsPage.adDeleted')); fetchAds(); }
                    else showToast(data.message || t('adsPage.failed'), 'error');
                } catch { showToast(t('adsPage.serverError'), 'error'); }
            }
        });
    };

    const handleToggleActive = async (ad) => {
        const formData = new FormData();
        formData.append('id', ad.id); formData.append('slot_id', ad.slot_id); formData.append('title', ad.title);
        formData.append('click_url', ad.click_url || ''); formData.append('start_date', ad.start_date || '');
        formData.append('end_date', ad.end_date || ''); formData.append('is_active', ad.is_active == 1 ? 0 : 1);
        formData.append('priority', ad.priority || 0);
        formData.append('target_countries', ad.target_countries || 'all');
        try {
            const res = await fetch(`${API_BASE}/update_ad.php`, { method: 'POST', credentials: 'include', body: formData });
            const data = await res.json();
            if (data.success) { showToast(ad.is_active == 1 ? t('adsPage.adDeactivated') : t('adsPage.adActivated')); fetchAds(); }
        } catch { showToast(t('adsPage.serverError'), 'error'); }
    };

    const handleCopyAd = async (ad) => {
        try {
            const res = await fetch(`${API_BASE}/copy_ad.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id: ad.id }) });
            const data = await res.json();
            if (data.success) { showToast(t('adsPage.adCopied')); fetchAds(); }
            else showToast(data.message || t('adsPage.copyFailed'), 'error');
        } catch { showToast(t('adsPage.serverError'), 'error'); }
    };

    const handleDateShortcut = (days) => {
        const today = new Date(); const end = new Date(today); end.setDate(end.getDate() + days);
        const fmt = (d) => d.toISOString().split('T')[0];
        setForm(prev => ({ ...prev, start_date: fmt(today), end_date: fmt(end) }));
    };

    const handleBatchEditOpen = () => {
        setBatchEditForm({
            target_countries: { enabled: false, value: 'all' },
            slot_id: { enabled: false, value: 'home_a' },
            priority: { enabled: false, value: 0 },
            start_date: { enabled: false, value: '' },
            end_date: { enabled: false, value: '' },
            is_active: { enabled: false, value: 1 },
        });
        setShowBatchEdit(true);
    };

    const handleBatchEditSubmit = async () => {
        const fields = {};
        Object.entries(batchEditForm).forEach(([key, { enabled, value }]) => {
            if (enabled) fields[key] = value;
        });
        if (Object.keys(fields).length === 0) {
            showToast(t('adsPage.noFieldsSelected'), 'error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/batch_update_ads.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [...selectedIds], fields })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || t('adsPage.batchEditSuccess'));
                setShowBatchEdit(false);
                setSelectedIds(new Set());
                fetchAds();
            } else {
                showToast(data.message || t('adsPage.errorOccurred'), 'error');
            }
        } catch { showToast(t('adsPage.serverError'), 'error'); }
    };

    const handleSaveAdsense = async () => {
        try {
            const res = await fetch(`${API_BASE}/adsense_config.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(adsenseForm) });
            const data = await res.json();
            if (data.success) showToast(t('adsPage.adsenseSaved'));
            else showToast(data.message || t('adsPage.saveFailed'), 'error');
        } catch { showToast(t('adsPage.serverError'), 'error'); }
    };

    const getSlotLabel = (slotId) => SLOT_OPTIONS.find(s => s.value === slotId)?.label || slotId;
    const getSlotPage = (slotId) => SLOT_OPTIONS.find(s => s.value === slotId)?.page || '';

    const handleReorder = async (ad, direction) => {
        const sameSlotAds = [...ads].filter(a => getSlotPage(a.slot_id) === getSlotPage(ad.slot_id)).sort((a, b) => (parseInt(a.priority) || 0) - (parseInt(b.priority) || 0));
        const idx = sameSlotAds.findIndex(a => a.id === ad.id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sameSlotAds.length) return;
        const orders = sameSlotAds.map((a, i) => {
            if (i === idx) return { id: a.id, priority: swapIdx };
            if (i === swapIdx) return { id: a.id, priority: idx };
            return { id: a.id, priority: i };
        });
        try {
            const res = await fetch(`${API_BASE}/reorder_ads.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ orders }) });
            const data = await res.json();
            if (data.success) { showToast(t('adsPage.orderChanged')); fetchAds(); }
            else showToast(data.message || t('adsPage.changeFailed'), 'error');
        } catch { showToast(t('adsPage.serverError'), 'error'); }
    };

    // Computed
    const filteredAds = ads.filter(ad => { if (searchTerm) { const t = searchTerm.toLowerCase(); if (!ad.title.toLowerCase().includes(t) && !ad.slot_id.toLowerCase().includes(t)) return false; } return true; });
    const grouped = {};
    filteredAds.forEach(ad => { const page = getSlotPage(ad.slot_id); if (!grouped[page]) grouped[page] = []; grouped[page].push(ad); });
    Object.values(grouped).forEach(arr => arr.sort((a, b) => (parseInt(a.priority) || 0) - (parseInt(b.priority) || 0)));

    const totalImpressions = ads.reduce((s, a) => s + parseInt(a.view_count || 0), 0);
    const totalClicks = ads.reduce((s, a) => s + parseInt(a.click_count || 0), 0);
    const activeCount = ads.filter(a => a.is_active == 1).length;
    const overallCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    const sortedAds = [...ads].sort((a, b) => {
        if (sortBy === 'views') return parseInt(b.view_count || 0) - parseInt(a.view_count || 0);
        if (sortBy === 'clicks') return parseInt(b.click_count || 0) - parseInt(a.click_count || 0);
        if (sortBy === 'ctr') {
            const ca = parseInt(a.view_count || 0) > 0 ? parseInt(a.click_count || 0) / parseInt(a.view_count || 0) : 0;
            const cb = parseInt(b.view_count || 0) > 0 ? parseInt(b.click_count || 0) / parseInt(b.view_count || 0) : 0;
            return cb - ca;
        }
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    const usedSlots = new Set(ads.filter(a => a.is_active == 1).map(a => a.slot_id));
    const usedSlotCount = [...usedSlots].filter(s => SLOT_OPTIONS.some(o => o.value === s)).length;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Megaphone className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t('adsPage.title')}</h1>
                        <p className="text-sm text-gray-500">{t('adsPage.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowAdSenseSettings(!showAdSenseSettings)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                        <Settings size={16} /> AdSense
                    </button>
                    <button onClick={() => { setActiveTab('manage'); handleOpenForm(); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        <Plus size={16} /> {t('adsPage.addAd')}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                {[{ key: 'dashboard', label: t('adsPage.tabDashboard'), icon: <BarChart3 size={15} /> }, { key: 'campaigns', label: t('adsPage.tabCampaigns'), icon: <Layers size={15} /> }, { key: 'manage', label: t('adsPage.tabManage'), icon: <Settings size={15} /> }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ===== DASHBOARD TAB ===== */}
            {activeTab === 'dashboard' && (() => {
                // Pre-compute infographic data
                const maxViews = Math.max(...ads.map(a => parseInt(a.view_count || 0)), 1);
                const maxClicks = Math.max(...ads.map(a => parseInt(a.click_count || 0)), 1);
                const slotPct = SLOT_OPTIONS.length > 0 ? Math.round((usedSlotCount / SLOT_OPTIONS.length) * 100) : 0;
                const activePct = ads.length > 0 ? Math.round((activeCount / ads.length) * 100) : 0;
                const circumference = 2 * Math.PI * 40;

                // Page distribution
                const pageDistribution = {};
                ads.forEach(a => { const p = getSlotPage(a.slot_id) || t('adsPage.other'); pageDistribution[p] = (pageDistribution[p] || 0) + 1; });
                const pageColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
                const pageEntries = Object.entries(pageDistribution).sort((a, b) => b[1] - a[1]);
                const totalForDist = Math.max(pageEntries.reduce((s, [, c]) => s + c, 0), 1);

                // Top 5 for bar chart
                const top5 = sortedAds.slice(0, 5);

                return (
                    <div className="space-y-6">
                        {/* KPI Cards with circular progress */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { label: t('adsPage.totalAds'), value: ads.length, suffix: t('adsPage.countSuffix'), pct: 100, icon: <Megaphone size={16} />, gradient: ['#6366f1', '#8b5cf6'] },
                                { label: t('adsPage.activeAds'), value: activeCount, suffix: t('adsPage.countSuffix'), pct: activePct, icon: <Eye size={16} />, gradient: ['#10b981', '#14b8a6'] },
                                { label: t('adsPage.totalImpressions'), value: totalImpressions.toLocaleString(), suffix: '', pct: 100, icon: <BarChart3 size={16} />, gradient: ['#3b82f6', '#6366f1'] },
                                { label: t('adsPage.totalClicks'), value: totalClicks.toLocaleString(), suffix: '', pct: totalImpressions > 0 ? Math.min(Math.round((totalClicks / totalImpressions) * 100 * 10), 100) : 0, icon: <MousePointer size={16} />, gradient: ['#f59e0b', '#ef4444'] },
                                { label: t('adsPage.overallCTR'), value: overallCTR, suffix: '%', pct: Math.min(parseFloat(overallCTR) * 10, 100), icon: <TrendingUp size={16} />, gradient: ['#8b5cf6', '#a855f7'] },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="relative w-12 h-12">
                                            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                                <circle cx="50" cy="50" r="40" stroke={`url(#grad-${i})`} strokeWidth="8" fill="none"
                                                    strokeDasharray={circumference} strokeDashoffset={circumference * (1 - stat.pct / 100)}
                                                    strokeLinecap="round" className="transition-all duration-1000" />
                                                <defs><linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor={stat.gradient[0]} /><stop offset="100%" stopColor={stat.gradient[1]} />
                                                </linearGradient></defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-600">{stat.icon}</div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md">{stat.pct}%</span>
                                    </div>
                                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{stat.value}<span className="text-sm text-gray-400 font-bold ml-0.5">{stat.suffix}</span></p>
                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Middle Row: Donut Chart + Page Distribution + Top 5 Bar Chart */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Donut Chart — Slot Utilization */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Monitor size={14} className="text-indigo-500" /> {t('adsPage.slotUtilization')}
                                </h3>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative w-36 h-36">
                                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                            <circle cx="50" cy="50" r="38" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                            <circle cx="50" cy="50" r="38" stroke="url(#donut-grad)" strokeWidth="12" fill="none"
                                                strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - slotPct / 100)}
                                                strokeLinecap="round" className="transition-all duration-1000" />
                                            <defs><linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient></defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-gray-900">{slotPct}%</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{usedSlotCount}/{SLOT_OPTIONS.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-4 text-[11px]">
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> {t('adsPage.inUse')} {usedSlotCount}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-200" /> {t('adsPage.unused')} {SLOT_OPTIONS.length - usedSlotCount}</span>
                                </div>
                            </div>

                            {/* Page Distribution */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Smartphone size={14} className="text-emerald-500" /> {t('adsPage.adDistribution')}
                                </h3>
                                {/* Stacked bar */}
                                <div className="flex rounded-full h-4 overflow-hidden mb-4">
                                    {pageEntries.map(([page, count], i) => (
                                        <div key={page} style={{ width: `${(count / totalForDist) * 100}%`, backgroundColor: pageColors[i % pageColors.length] }}
                                            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full" title={`${page}: ${count}`} />
                                    ))}
                                </div>
                                <div className="space-y-2.5">
                                    {pageEntries.map(([page, count], i) => (
                                        <div key={page} className="flex items-center gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pageColors[i % pageColors.length] }} />
                                            <span className="text-xs text-gray-600 font-medium flex-1 truncate">{page}</span>
                                            <span className="text-xs font-bold text-gray-900">{count}</span>
                                            <span className="text-[10px] text-gray-400">{Math.round((count / totalForDist) * 100)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top 5 Bar Chart */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-orange-500" /> {t('adsPage.top5Ads')}
                                    <span className="ml-auto text-[10px] text-gray-400 font-medium normal-case">
                                        {sortBy === 'views' ? t('adsPage.sortByViews') : sortBy === 'clicks' ? t('adsPage.sortByClicks') : t('adsPage.sortByCTR')}
                                    </span>
                                </h3>
                                <div className="space-y-3">
                                    {top5.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-8">{t('adsPage.noData')}</p>
                                    ) : top5.map((ad, idx) => {
                                        const v = parseInt(ad.view_count || 0);
                                        const c = parseInt(ad.click_count || 0);
                                        const val = sortBy === 'views' ? v : sortBy === 'clicks' ? c : (v > 0 ? (c / v) * 100 : 0);
                                        const maxVal = sortBy === 'views' ? maxViews : sortBy === 'clicks' ? maxClicks : Math.max(...ads.map(a => { const vv = parseInt(a.view_count || 0); return vv > 0 ? parseInt(a.click_count || 0) / vv * 100 : 0; }), 1);
                                        const barPct = Math.max((val / maxVal) * 100, 2);
                                        const barColors = ['bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
                                        return (
                                            <div key={ad.id} className="group">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-gray-300 w-4">{idx + 1}</span>
                                                    <span className="text-xs font-bold text-gray-700 truncate flex-1">{ad.title}</span>
                                                    <span className="text-xs font-extrabold text-gray-900">{sortBy === 'ctr' ? val.toFixed(2) + '%' : val.toLocaleString()}</span>
                                                </div>
                                                <div className="ml-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${barColors[idx]} transition-all duration-700`} style={{ width: `${barPct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Slot Grid — Visual */}
                        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Monitor size={14} className="text-indigo-500 dark:text-indigo-400" /> {t('adsPage.allSlotStatus')}
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium normal-case ml-auto">{t('adsPage.activeSlots', { count: usedSlotCount })}</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {SLOT_OPTIONS.map(slot => {
                                    const slotAd = ads.find(a => a.slot_id === slot.value && a.is_active == 1);
                                    const slotViews = ads.filter(a => a.slot_id === slot.value).reduce((s, a) => s + parseInt(a.view_count || 0), 0);
                                    return (
                                        <div key={slot.value} className={`relative rounded-xl border p-3 transition-all hover:shadow-sm ${slotAd ? 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/30 dark:from-indigo-500/20 dark:to-violet-500/20 dark:border-indigo-400/30' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/40'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`w-2 h-2 rounded-full ${slotAd ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                <span className={`text-[11px] font-bold truncate ${slotAd ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-500'}`}>{slot.label.split(' (')[0]}</span>
                                            </div>
                                            {slotAd ? (
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400 pl-4">
                                                    <span className="font-medium">{slotAd.title.substring(0, 12)}{slotAd.title.length > 12 ? '..' : ''}</span>
                                                    <br /><span className="text-indigo-500 dark:text-indigo-400 font-bold">{slotViews.toLocaleString()} views</span>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-gray-300 dark:text-gray-600 pl-4">{t('adsPage.empty')}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Performance Table with visual bars */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-500" /> {t('adsPage.adPerformanceRank')}</h3>
                                <div className="flex gap-1">
                                    {[{ key: 'views', label: t('adsPage.sortViews') }, { key: 'clicks', label: t('adsPage.sortClicks') }, { key: 'ctr', label: t('adsPage.sortCTR') }].map(s => (
                                        <button key={s.key} onClick={() => setSortBy(s.key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortBy === s.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{s.label}</button>
                                    ))}
                                </div>
                            </div>
                            {sortedAds.length === 0 ? (
                                <div className="text-center py-12 text-gray-400"><Megaphone size={32} className="mx-auto mb-2 text-gray-300" /><p className="text-sm font-medium">{t('adsPage.noAdsRegistered')}</p></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
                                            <th className="text-left px-5 py-3">#</th><th className="text-left px-3 py-3">{t('adsPage.ad')}</th><th className="text-left px-3 py-3">{t('adsPage.slot')}</th>
                                            <th className="text-left px-3 py-3 min-w-[140px]">{t('adsPage.impressions')}</th><th className="text-left px-3 py-3 min-w-[120px]">{t('adsPage.clicks')}</th><th className="text-right px-3 py-3">CTR</th>
                                            <th className="text-center px-3 py-3">{t('adsPage.status')}</th><th className="text-center px-3 py-3">{t('adsPage.action')}</th>
                                        </tr></thead>
                                        <tbody>
                                            {sortedAds.map((ad, idx) => {
                                                const views = parseInt(ad.view_count || 0);
                                                const clicks = parseInt(ad.click_count || 0);
                                                const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';
                                                const viewPct = Math.max((views / maxViews) * 100, 0);
                                                const clickPct = Math.max((clicks / maxClicks) * 100, 0);
                                                return (
                                                    <tr key={ad.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-5 py-3">
                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${idx < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{idx + 1}</span>
                                                        </td>
                                                        <td className="px-3 py-3"><div className="flex items-center gap-3">{ad.image_url && <img src={ad.image_url} alt="" className="w-10 h-7 object-cover rounded-lg border" />}<span className="font-bold text-gray-900 truncate max-w-[160px]">{ad.title}</span></div></td>
                                                        <td className="px-3 py-3 text-xs text-gray-400">{getSlotLabel(ad.slot_id).split(' (')[0]}</td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-gray-700 w-14 text-right">{views.toLocaleString()}</span>
                                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${viewPct}%` }} /></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-emerald-600 w-10 text-right">{clicks.toLocaleString()}</span>
                                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${clickPct}%` }} /></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-right font-bold text-indigo-600">{ctr}%</td>
                                                        <td className="px-3 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.is_active == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{ad.is_active == 1 ? t('adsPage.active') : t('adsPage.inactive')}</span></td>
                                                        <td className="px-3 py-3 text-center"><div className="flex items-center justify-center gap-1">
                                                            <button onClick={() => setReportAd(ad)} className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100" title={t('adsPage.reportTitle')}><BarChart3 size={13} /></button>
                                                            <button onClick={() => handleToggleActive(ad)} className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100" title={ad.is_active == 1 ? t('adsPage.deactivate') : t('adsPage.activate')}>{ad.is_active == 1 ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                                                            <button onClick={() => { setActiveTab('manage'); handleOpenForm(ad); }} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100" title={t('adsPage.edit')}><Edit3 size={13} /></button>
                                                        </div></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* ===== CAMPAIGNS TAB ===== */}
            {activeTab === 'campaigns' && (() => {
                const statusColors = { active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', paused: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', completed: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
                const statusLabels = { active: t('adsPage.statusActive'), paused: t('adsPage.statusPaused'), completed: t('adsPage.statusCompleted') };
                const statusIcons = { active: <Play size={11} />, paused: <Pause size={11} />, completed: <Check size={11} /> };
                const filteredCampaigns = campaigns.filter(c => !campaignSearch || c.name.toLowerCase().includes(campaignSearch.toLowerCase()) || (c.advertiser || '').toLowerCase().includes(campaignSearch.toLowerCase()));

                // Get ads belonging to a campaign
                const getCampaignAds = (cid) => ads.filter(a => a.campaign_id == cid);

                return (
                    <div className="space-y-4">
                        {/* Campaign Header */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input value={campaignSearch} onChange={e => setCampaignSearch(e.target.value)} placeholder={t('adsPage.searchCampaign')} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <button onClick={() => { setEditingCampaign(null); setCampaignForm({ name: '', advertiser: '', budget: '', start_date: '', end_date: '', status: 'active', memo: '' }); setShowCampaignForm(true); }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
                                <Plus size={16} /> {t('adsPage.createCampaign')}
                            </button>
                        </div>

                        {/* Campaign Form Modal */}
                        {showCampaignForm && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-lg p-5">
                                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4">{editingCampaign ? t('adsPage.editCampaign') : t('adsPage.newCampaign')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.campaignName')}</label><input value={campaignForm.name} onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" placeholder={t('adsPage.campaignNamePlaceholder')} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.advertiser')}</label><input value={campaignForm.advertiser} onChange={e => setCampaignForm({ ...campaignForm, advertiser: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" placeholder={t('adsPage.advertiserPlaceholder')} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.budget')}</label><input type="number" value={campaignForm.budget} onChange={e => setCampaignForm({ ...campaignForm, budget: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" placeholder={t('adsPage.budgetOptional')} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.campaignStatus')}</label><select value={campaignForm.status} onChange={e => setCampaignForm({ ...campaignForm, status: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"><option value="active">{t('adsPage.statusActive')}</option><option value="paused">{t('adsPage.statusPaused')}</option><option value="completed">{t('adsPage.statusCompleted')}</option></select></div>
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.startDate')}</label><input type="date" value={campaignForm.start_date} onChange={e => setCampaignForm({ ...campaignForm, start_date: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div>
                                    <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.endDate')}</label><input type="date" value={campaignForm.end_date} onChange={e => setCampaignForm({ ...campaignForm, end_date: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">{t('adsPage.memo')}</label><textarea value={campaignForm.memo} onChange={e => setCampaignForm({ ...campaignForm, memo: e.target.value })} rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm resize-none" /></div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">{t('adsPage.targetCountries', '타겟 국가')}</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button type="button" onClick={() => setCampaignForm({ ...campaignForm, target_countries: 'all' })} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${campaignForm.target_countries === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}>🌍 {t('adsPage.allCountriesTarget', '전체')}</button>
                                            {COUNTRY_OPTIONS.map(co => {
                                                const countries = campaignForm.target_countries || 'all';
                                                const arr = countries === 'all' ? [] : countries.split(',');
                                                const isOn = countries === 'all' || arr.includes(co.code);
                                                const toggle = () => {
                                                    if (countries === 'all') {
                                                        setCampaignForm({ ...campaignForm, target_countries: co.code });
                                                    } else if (isOn) {
                                                        const next = arr.filter(c => c !== co.code);
                                                        setCampaignForm({ ...campaignForm, target_countries: next.length ? next.join(',') : 'all' });
                                                    } else {
                                                        setCampaignForm({ ...campaignForm, target_countries: [...arr, co.code].join(',') });
                                                    }
                                                };
                                                return (
                                                    <button key={co.code} type="button" onClick={toggle} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${countries !== 'all' && isOn ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}>{co.flag} {co.label}</button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button onClick={() => { setShowCampaignForm(false); setEditingCampaign(null); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold">{t('adsPage.cancel')}</button>
                                    <button onClick={handleCampaignSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">{editingCampaign ? t('adsPage.update') : t('adsPage.create')}</button>
                                </div>
                            </div>
                        )}

                        {/* Campaign List */}
                        {filteredCampaigns.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <Layers className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                                <p className="text-sm text-gray-400 font-medium">{t('adsPage.noCampaigns')}</p>
                                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{t('adsPage.noCampaignsDesc')}</p>
                            </div>
                        )}

                        {filteredCampaigns.map(c => {
                            const cAds = getCampaignAds(c.id);
                            const isExpanded = expandedCampaign === c.id;
                            const totalViews = parseInt(c.total_views || 0);
                            const totalClicks = parseInt(c.total_clicks || 0);
                            const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

                            return (
                                <div key={c.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                    {/* Campaign Row */}
                                    <div className="px-5 py-4 cursor-pointer" onClick={() => setExpandedCampaign(isExpanded ? null : c.id)}>
                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-400 dark:text-gray-500 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                <ChevronDown size={18} />
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{c.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${statusColors[c.status] || ''}`}>{statusIcons[c.status]} {statusLabels[c.status]}</span>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg font-bold">{t('adsPage.adsCount', { count: c.ad_count || 0 })}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {c.advertiser && <span className="text-[11px] text-gray-400 dark:text-gray-500">{c.advertiser}</span>}
                                                    {c.start_date && <span className="text-[10px] text-gray-300 dark:text-gray-600">{c.start_date} ~ {c.end_date || t('adsPage.ongoing')}</span>}
                                                    {c.target_countries && c.target_countries !== 'all' && (
                                                        <span className="flex items-center gap-0.5">
                                                            {c.target_countries.split(',').map(cc => {
                                                                const opt = COUNTRY_OPTIONS.find(o => o.code === cc);
                                                                return opt ? <span key={cc} className="text-[11px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-bold">{opt.flag}</span> : null;
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="hidden md:flex items-center gap-5 text-right">
                                                <div><p className="text-sm font-extrabold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p><p className="text-[10px] text-gray-400 font-medium">{t('adsPage.impressionLabel')}</p></div>
                                                <div><p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{totalClicks.toLocaleString()}</p><p className="text-[10px] text-gray-400 font-medium">{t('adsPage.clickLabel')}</p></div>
                                                <div><p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{ctr}%</p><p className="text-[10px] text-gray-400 font-medium">CTR</p></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 dark:border-gray-700">
                                            {/* Ads in campaign */}
                                            {cAds.length > 0 ? (
                                                <div className="px-5 py-3">
                                                    <div className="space-y-2">
                                                        {cAds.map(a => {
                                                            const av = parseInt(a.view_count || 0);
                                                            const ac = parseInt(a.click_count || 0);
                                                            const aCtr = av > 0 ? ((ac / av) * 100).toFixed(2) : '0.00';
                                                            const slotLabel = SLOT_OPTIONS.find(s => s.value === a.slot_id)?.label?.split(' (')[0] || a.slot_id;
                                                            return (
                                                                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors">
                                                                    {a.image_url && <img src={a.image_url} alt="" className="w-12 h-8 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0" />}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{a.title}</p>
                                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{slotLabel}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-right">
                                                                        <div><span className="text-xs font-bold text-gray-700 dark:text-gray-300">{av.toLocaleString()}</span><span className="text-[10px] text-gray-400 ml-1">{t('adsPage.impressionLabel')}</span></div>
                                                                        <div><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ac.toLocaleString()}</span><span className="text-[10px] text-gray-400 ml-1">{t('adsPage.clickLabel')}</span></div>
                                                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 w-14 text-right">{aCtr}%</span>
                                                                    </div>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleUnassignAd(a.id); }} className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" title={t('adsPage.removeFromCampaign')}>
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Campaign Summary Bar */}
                                                    <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-indigo-700 dark:text-indigo-300">{t('adsPage.total')}</span>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-gray-600 dark:text-gray-300">{t('adsPage.impressionLabel')} <b className="text-indigo-700 dark:text-indigo-300">{totalViews.toLocaleString()}</b></span>
                                                                <span className="text-gray-600 dark:text-gray-300">{t('adsPage.clickLabel')} <b className="text-emerald-600 dark:text-emerald-400">{totalClicks.toLocaleString()}</b></span>
                                                                <span className="text-gray-600 dark:text-gray-300">CTR <b className="text-indigo-700 dark:text-indigo-300">{ctr}%</b></span>
                                                                {c.budget && <span className="text-gray-600 dark:text-gray-300">{t('adsPage.budgetLabel')} <b className="text-amber-600 dark:text-amber-400">₩{Number(c.budget).toLocaleString()}</b></span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="px-5 py-6 text-center">
                                                    <FolderOpen className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={28} />
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{t('adsPage.noAssignedAds')}</p>
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="px-5 py-3 border-t border-gray-50 dark:border-gray-700/50 flex items-center gap-2 flex-wrap">
                                                <button onClick={() => setCampaignReportId(c.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20"><BarChart3 size={13} /> {t('adsPage.report')}</button>
                                                <button onClick={() => { setAssigningCampaignId(c.id); setAssignSelectedAds(new Set()); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20"><Plus size={13} /> {t('adsPage.assignAds')}</button>
                                                <button onClick={() => { setEditingCampaign(c); setCampaignForm({ name: c.name, advertiser: c.advertiser || '', budget: c.budget || '', start_date: c.start_date || '', end_date: c.end_date || '', status: c.status, memo: c.memo || '', target_countries: c.target_countries || 'all' }); setShowCampaignForm(true); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20"><Edit3 size={13} /> {t('adsPage.edit')}</button>
                                                <button onClick={() => handleCampaignDelete(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 ml-auto"><Trash2 size={13} /> {t('adsPage.deleteAction')}</button>
                                            </div>

                                            {/* Assign ads modal */}
                                            {assigningCampaignId === c.id && (
                                                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-500/5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t('adsPage.selectFromUnassigned')}</h4>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setAssigningCampaignId(null)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg text-xs font-bold">{t('adsPage.cancel')}</button>
                                                            <button onClick={() => handleAssignAds(c.id)} disabled={assignSelectedAds.size === 0} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold disabled:opacity-50">{t('adsPage.assign', { count: assignSelectedAds.size })}</button>
                                                        </div>
                                                    </div>
                                                    {unassignedAds.length === 0 ? (
                                                        <p className="text-xs text-gray-400 text-center py-4">{t('adsPage.noUnassignedAds')}</p>
                                                    ) : (
                                                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                                            {unassignedAds.map(ua => (
                                                                <label key={ua.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${assignSelectedAds.has(ua.id) ? 'bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30' : 'bg-white dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 hover:border-emerald-300'}`}>
                                                                    <input type="checkbox" checked={assignSelectedAds.has(ua.id)} onChange={() => { const n = new Set(assignSelectedAds); n.has(ua.id) ? n.delete(ua.id) : n.add(ua.id); setAssignSelectedAds(n); }} className="accent-emerald-600" />
                                                                    {ua.image_url && <img src={ua.image_url} alt="" className="w-10 h-7 object-cover rounded border" />}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{ua.title}</p>
                                                                        <p className="text-[10px] text-gray-400">{SLOT_OPTIONS.find(s => s.value === ua.slot_id)?.label?.split(' (')[0] || ua.slot_id}</p>
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-400">{parseInt(ua.view_count || 0).toLocaleString()} {t('adsPage.impressionLabel')}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Unassigned ads section */}
                        {unassignedAds.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-5">
                                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <FolderOpen size={14} /> {t('adsPage.unassignedAds', { count: unassignedAds.length })}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {unassignedAds.slice(0, 6).map(ua => (
                                        <div key={ua.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                            {ua.image_url && <img src={ua.image_url} alt="" className="w-10 h-7 object-cover rounded border" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{ua.title}</p>
                                                <p className="text-[10px] text-gray-400">{SLOT_OPTIONS.find(s => s.value === ua.slot_id)?.label?.split(' (')[0] || ua.slot_id}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {unassignedAds.length > 6 && <p className="text-[10px] text-gray-400 text-center mt-2">{t('adsPage.andMore', { count: unassignedAds.length - 6 })}</p>}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* ===== MANAGE TAB ===== */}
            {activeTab === 'manage' && (() => {
                const statusFiltered = statusFilter === 'all' ? filteredAds : filteredAds.filter(a => statusFilter === 'active' ? a.is_active == 1 : a.is_active != 1);
                const allSelected = statusFiltered.length > 0 && statusFiltered.every(a => selectedIds.has(a.id));
                const someSelected = selectedIds.size > 0;

                const toggleSelect = (id) => {
                    const next = new Set(selectedIds);
                    next.has(id) ? next.delete(id) : next.add(id);
                    setSelectedIds(next);
                };
                const toggleAll = () => {
                    if (allSelected) { setSelectedIds(new Set()); }
                    else { setSelectedIds(new Set(statusFiltered.map(a => a.id))); }
                };

                const handleBatchToggle = async (activate) => {
                    try {
                        const res = await fetch(`${API_BASE}/batch_update_ads.php`, {
                            method: 'POST', credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ids: [...selectedIds], fields: { is_active: activate ? 1 : 0 } })
                        });
                        const data = await res.json();
                        if (data.success) {
                            showToast(data.message || (activate ? t('adsPage.batchActivated') : t('adsPage.batchDeactivated')));
                            setSelectedIds(new Set());
                            fetchAds();
                        } else {
                            showToast(data.message || t('adsPage.errorOccurred'), 'error');
                        }
                    } catch { showToast(t('adsPage.serverError'), 'error'); }
                };
                const handleBatchDelete = () => {
                    setConfirmModal({
                        title: t('adsPage.batchDeleteTitle'),
                        message: t('adsPage.batchDeleteMsg', { count: selectedIds.size }),
                        onConfirm: async () => {
                            for (const id of selectedIds) {
                                const ad = ads.find(a => a.id === id);
                                if (ad) await handleDelete(ad);
                            }
                            setSelectedIds(new Set());
                            setConfirmModal(null);
                        }
                    });
                };

                return (
                    <div className="space-y-4">
                        {/* Country Filter Tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button onClick={() => { setCountryFilter('all'); setSelectedIds(new Set()); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                                🌐 {t('adsPage.allCountries') || '전체'}
                            </button>
                            {COUNTRY_OPTIONS.map(c => (
                                <button key={c.code} onClick={() => { setCountryFilter(c.code); setSelectedIds(new Set()); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === c.code ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                                    {c.flag} {c.label}
                                </button>
                            ))}
                        </div>
                        {showAdSenseSettings && (
                            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Settings size={20} className="text-gray-400" /> {t('adsPage.adsenseSettings')}</h2>
                                    <button onClick={() => setShowAdSenseSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input type="text" value={adsenseForm.client_id} onChange={e => setAdsenseForm({ ...adsenseForm, client_id: e.target.value })} placeholder="ca-pub-XXXXXXXXXX" className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none text-sm font-medium dark:text-white" />
                                        <button onClick={() => setAdsenseForm({ ...adsenseForm, is_enabled: adsenseForm.is_enabled ? 0 : 1 })} className={`px-4 py-2.5 rounded-xl text-sm font-bold ${adsenseForm.is_enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{adsenseForm.is_enabled ? t('adsPage.adsenseEnabled') : t('adsPage.adsenseDisabled')}</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {SLOT_OPTIONS.map(slot => (
                                            <div key={slot.value} className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[180px] truncate">{slot.label}</span>
                                                <input type="text" value={adsenseForm.slot_configs?.[slot.value] || ''} onChange={e => setAdsenseForm({ ...adsenseForm, slot_configs: { ...adsenseForm.slot_configs, [slot.value]: e.target.value } })} placeholder="Slot ID" className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-transparent focus:border-indigo-500 outline-none text-xs font-medium dark:text-white" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleSaveAdsense} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-3"><Save size={16} /> {t('adsPage.save')}</button>
                            </div>
                        )}

                        {/* Search, Filter & Status Pills */}
                        <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-4">
                            <div className="flex flex-col md:flex-row gap-3 mb-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('adsPage.searchAdTitle')} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 outline-none font-medium text-sm dark:text-white" />
                                </div>
                                <div className="relative">
                                    <select value={filterSlot} onChange={e => setFilterSlot(e.target.value)} className="w-full md:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm dark:text-white">
                                        <option value="">{t('adsPage.allSlots')}</option>
                                        {SLOT_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label.split(' (')[0]}</option>))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            {/* Status filter pills + View toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {[{ key: 'all', label: t('adsPage.all'), count: filteredAds.length },
                                    { key: 'active', label: t('adsPage.active'), count: filteredAds.filter(a => a.is_active == 1).length },
                                    { key: 'inactive', label: t('adsPage.inactive'), count: filteredAds.filter(a => a.is_active != 1).length }
                                    ].map(f => (
                                        <button key={f.key} onClick={() => { setStatusFilter(f.key); setSelectedIds(new Set()); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${statusFilter === f.key ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-500 dark:hover:bg-gray-700'}`}>
                                            {f.label} <span className="bg-white/50 dark:bg-gray-600/50 px-1.5 rounded-md">{f.count}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title={t('adsPage.listView') || '리스트 보기'}>
                                        <List size={16} />
                                    </button>
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title={t('adsPage.gridView') || '박스 보기'}>
                                        <LayoutGrid size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Batch action toolbar */}
                        {someSelected && (
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-in">
                                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{t('adsPage.batchSelected', { count: selectedIds.size })}</span>
                                <div className="h-5 w-px bg-indigo-200 dark:bg-indigo-500/30" />
                                <button onClick={() => handleBatchToggle(true)} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors flex items-center gap-1">
                                    <Eye size={13} /> {t('adsPage.batchActivate')}
                                </button>
                                <button onClick={() => handleBatchToggle(false)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1">
                                    <EyeOff size={13} /> {t('adsPage.batchDeactivate')}
                                </button>
                                <button onClick={handleBatchDelete} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex items-center gap-1">
                                    <Trash2 size={13} /> {t('adsPage.batchDelete')}
                                </button>
                                <button onClick={handleBatchEditOpen} className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors flex items-center gap-1">
                                    <Edit3 size={13} /> {t('adsPage.batchEdit') || '일괄 수정'}
                                </button>
                                <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium">{t('adsPage.deselectAll')}</button>
                            </div>
                        )}

                        {/* Compact table */}
                        {loading ? (
                            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" /></div>
                        ) : statusFiltered.length === 0 ? (
                            <div className="text-center py-20">
                                <Megaphone className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">{t('adsPage.noAdsRegistered')}</h3>
                                <button onClick={() => handleOpenForm()} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"><Plus size={16} /> {t('adsPage.newAdRegistration')}</button>
                            </div>
                        ) : viewMode === 'list' ? (
                            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                                                <th className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" /></th>
                                                <th className="text-left px-3 py-3">{t('adsPage.adTable')}</th>
                                                <th className="text-left px-3 py-3">{t('adsPage.slot')}</th>
                                                <th className="text-center px-3 py-3">{t('adsPage.status')}</th>
                                                <th className="text-right px-3 py-3">{t('adsPage.impressions')}</th>
                                                <th className="text-right px-3 py-3">{t('adsPage.clicks')}</th>
                                                <th className="text-center px-3 py-3">{t('adsPage.period')}</th>
                                                <th className="text-center px-3 py-3 w-28">{t('adsPage.manage')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                                            {statusFiltered.map(ad => {
                                                const isSelected = selectedIds.has(ad.id);
                                                return (
                                                    <tr key={ad.id} className={`transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                                                        <td className="px-4 py-3 text-center">
                                                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(ad.id)} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center gap-3">
                                                                {ad.image_url && <img src={ad.image_url} alt="" className="w-12 h-8 object-cover rounded-lg border dark:border-gray-700 flex-shrink-0" />}
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{ad.title}</p>
                                                                    {ad.click_url && <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{ad.click_url}</p>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{getSlotLabel(ad.slot_id).split(' (')[0]}</span>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <button onClick={() => handleToggleActive(ad)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${ad.is_active == 1 ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}>
                                                                {ad.is_active == 1 ? t('adsPage.active') : t('adsPage.inactive')}
                                                            </button>
                                                        </td>
                                                        <td className="px-3 py-3 text-right font-bold text-gray-700 dark:text-gray-300 tabular-nums">{parseInt(ad.view_count || 0).toLocaleString()}</td>
                                                        <td className="px-3 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{parseInt(ad.click_count || 0).toLocaleString()}</td>
                                                        <td className="px-3 py-3 text-center">
                                                            {(ad.start_date || ad.end_date) ? (
                                                                <span className="text-[11px] text-gray-400">{ad.start_date || '~'} ~ {ad.end_date || ''}</span>
                                                            ) : <span className="text-[11px] text-gray-300 dark:text-gray-600">—</span>}
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => handleOpenForm(ad)} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors" title={t('adsPage.edit')}><Edit3 size={13} /></button>
                                                                <button onClick={() => handleCopyAd(ad)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-colors" title={t('adsPage.copy')}><Copy size={13} /></button>
                                                                <button onClick={() => setReportAd(ad)} className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 transition-colors" title={t('adsPage.reportTitle')}><BarChart3 size={13} /></button>
                                                                <button onClick={() => handleDelete(ad)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors" title={t('adsPage.deleteLabel')}><Trash2 size={13} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Footer summary */}
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{t('adsPage.totalAdsCount', { count: statusFiltered.length })}</span>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>{t('adsPage.impressionTotal')} <b className="text-gray-600 dark:text-gray-300">{statusFiltered.reduce((s, a) => s + parseInt(a.view_count || 0), 0).toLocaleString()}</b></span>
                                        <span>{t('adsPage.clickTotal')} <b className="text-emerald-600 dark:text-emerald-400">{statusFiltered.reduce((s, a) => s + parseInt(a.click_count || 0), 0).toLocaleString()}</b></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ===== GRID / BOX VIEW ===== */
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {statusFiltered.map(ad => {
                                        const isSelected = selectedIds.has(ad.id);
                                        const views = parseInt(ad.view_count || 0);
                                        const clicks = parseInt(ad.click_count || 0);
                                        const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';
                                        return (
                                            <div key={ad.id} className={`bg-white dark:bg-gray-800/50 rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-lg group ${isSelected ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30' : 'border-gray-100 dark:border-gray-700/50'}`}>
                                                {/* Image area */}
                                                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700/50">
                                                    {ad.image_url ? (
                                                        <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon size={36} className="text-gray-300 dark:text-gray-600" />
                                                        </div>
                                                    )}
                                                    {/* Checkbox overlay */}
                                                    <div className="absolute top-2 left-2">
                                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(ad.id)}
                                                            className="w-4 h-4 rounded border-2 border-white/80 text-indigo-600 focus:ring-indigo-500 shadow-sm" />
                                                    </div>
                                                    {/* Status badge */}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${ad.is_active == 1 ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                                                            {ad.is_active == 1 ? t('adsPage.active') : t('adsPage.inactive')}
                                                        </span>
                                                    </div>
                                                    {/* Click URL indicator */}
                                                    {ad.click_url && (
                                                        <a href={ad.click_url} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors" onClick={e => e.stopPropagation()}>
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                                {/* Content */}
                                                <div className="p-4">
                                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1">{ad.title}</h3>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">{getSlotLabel(ad.slot_id).split(' (')[0]}</p>
                                                    {/* Stats row */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                            <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">{views.toLocaleString()}</p>
                                                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{t('adsPage.impressions')}</p>
                                                        </div>
                                                        <div className="flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{clicks.toLocaleString()}</p>
                                                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{t('adsPage.clicks')}</p>
                                                        </div>
                                                        <div className="flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                            <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{ctr}%</p>
                                                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">CTR</p>
                                                        </div>
                                                    </div>
                                                    {/* Period */}
                                                    {(ad.start_date || ad.end_date) && (
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3">
                                                            <Calendar size={10} /> {ad.start_date || '~'} ~ {ad.end_date || ''}
                                                        </p>
                                                    )}
                                                    {/* Action buttons */}
                                                    <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-700/30">
                                                        <button onClick={() => handleToggleActive(ad)} className={`p-1.5 rounded-lg transition-colors ${ad.is_active == 1 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-500'}`} title={ad.is_active == 1 ? t('adsPage.deactivate') : t('adsPage.activate')}>
                                                            {ad.is_active == 1 ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                        <button onClick={() => handleOpenForm(ad)} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors" title={t('adsPage.edit')}><Edit3 size={14} /></button>
                                                        <button onClick={() => handleCopyAd(ad)} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-colors" title={t('adsPage.copy')}><Copy size={14} /></button>
                                                        <button onClick={() => setReportAd(ad)} className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 transition-colors" title={t('adsPage.reportTitle')}><BarChart3 size={14} /></button>
                                                        <button onClick={() => handleDelete(ad)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors ml-auto" title={t('adsPage.deleteLabel')}><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Footer summary */}
                                <div className="mt-4 px-4 py-3 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{t('adsPage.totalAdsCount', { count: statusFiltered.length })}</span>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>{t('adsPage.impressionTotal')} <b className="text-gray-600 dark:text-gray-300">{statusFiltered.reduce((s, a) => s + parseInt(a.view_count || 0), 0).toLocaleString()}</b></span>
                                        <span>{t('adsPage.clickTotal')} <b className="text-emerald-600 dark:text-emerald-400">{statusFiltered.reduce((s, a) => s + parseInt(a.click_count || 0), 0).toLocaleString()}</b></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white flex items-center justify-between">
                            <h2 className="font-extrabold text-lg flex items-center gap-2"><Megaphone size={20} />{editingAd ? t('adsPage.editAd') : t('adsPage.createAd')}</h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white/80 hover:text-white"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.adSlot')}</label>
                                <select value={form.slot_id} onChange={e => setForm({ ...form, slot_id: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium">
                                    {SLOT_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.adTitle')}</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t('adsPage.adTitlePlaceholder')} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.adImage')} {editingAd ? t('adsPage.adImageOptional') : ''}</label>
                                {(() => { const guide = SLOT_SIZE_GUIDE[form.slot_id]; if (!guide) return null; const fl = guide.format === 'banner' ? t('adsPage.bannerType') : guide.format === 'card' ? t('adsPage.cardType') : t('adsPage.nativeType'); return (<p className="text-[11px] text-indigo-400 font-medium mb-1.5 flex items-center gap-1">{t('adsPage.recommendedSize', { size: guide.size, ratio: guide.ratio, format: fl })}</p>); })()}
                                {imagePreview && (<div className="relative mb-2 rounded-xl overflow-hidden border border-gray-200"><img src={imagePreview} alt={t('adsPage.preview')} className="w-full h-32 object-cover" /><button type="button" onClick={() => { setImageFile(null); setImagePreview(editingAd?.image_url || null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-white hover:bg-black/70"><X size={14} /></button></div>)}
                                <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
                                    <ImageIcon size={18} className="text-gray-400" /><span className="text-sm text-gray-500 font-medium">{t('adsPage.selectImage')}</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.clickUrl')}</label>
                                <div className="relative"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="url" value={form.click_url} onChange={e => setForm({ ...form, click_url: e.target.value })} placeholder="https://example.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.startDate')}</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.endDate')}</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" /></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-bold text-gray-400 self-center mr-1">{t('adsPage.quickSetup')}</span>
                                {[{ label: t('adsPage.days7'), days: 7 }, { label: t('adsPage.days15'), days: 15 }, { label: t('adsPage.days30'), days: 30 }, { label: t('adsPage.months2'), days: 60 }, { label: t('adsPage.months3'), days: 90 }].map(opt => (
                                    <button key={opt.days} type="button" onClick={() => handleDateShortcut(opt.days)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">{opt.label}</button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.priority')}</label><input type="number" min="0" max="100" value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.statusLabel')}</label><button type="button" onClick={() => setForm({ ...form, is_active: form.is_active ? 0 : 1 })} className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${form.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{form.is_active ? t('adsPage.activeStatus') : t('adsPage.inactiveStatus')}</button></div>
                            </div>
                            {/* Target Countries */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('adsPage.targetCountries') || '대상 국가'}</label>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => setForm({ ...form, target_countries: 'all' })}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${form.target_countries === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                        🌐 {t('adsPage.allCountries') || '전체'}
                                    </button>
                                    {COUNTRY_OPTIONS.map(c => {
                                        const selected = form.target_countries !== 'all' && form.target_countries.split(',').includes(c.code);
                                        return (
                                            <button key={c.code} type="button" onClick={() => {
                                                if (form.target_countries === 'all') {
                                                    setForm({ ...form, target_countries: c.code });
                                                } else {
                                                    const codes = form.target_countries.split(',').filter(Boolean);
                                                    if (selected) {
                                                        const next = codes.filter(x => x !== c.code);
                                                        setForm({ ...form, target_countries: next.length ? next.join(',') : 'all' });
                                                    } else {
                                                        setForm({ ...form, target_countries: [...codes, c.code].join(',') });
                                                    }
                                                }
                                            }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                                {c.flag} {c.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {form.target_countries !== 'all' && (
                                    <p className="text-[10px] text-indigo-400 mt-1.5">{t('adsPage.selectedCountries') || '선택된 국가'}: {form.target_countries.split(',').map(c => COUNTRY_OPTIONS.find(o => o.code === c)?.flag || c).join(' ')}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">{submitting ? t('adsPage.submitting') : (editingAd ? t('adsPage.submitEdit') : t('adsPage.submitCreate'))}</button>
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">{t('adsPage.cancel')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Batch Edit Modal */}
            {showBatchEdit && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBatchEdit(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
                            <h2 className="font-extrabold text-lg flex items-center gap-2"><Edit3 size={20} />{t('adsPage.batchEdit') || '일괄 수정'} ({selectedIds.size}{t('adsPage.batchCount') || '개'})</h2>
                            <button onClick={() => setShowBatchEdit(false)} className="text-white/80 hover:text-white"><X size={22} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-xs text-gray-400">{t('adsPage.batchEditDesc') || '수정할 항목을 체크한 후 값을 설정하세요. 체크된 항목만 일괄 적용됩니다.'}</p>

                            {/* Target Countries */}
                            <div className={`rounded-xl border p-3 transition-colors ${batchEditForm.target_countries.enabled ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" checked={batchEditForm.target_countries.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.targetCountries') || '대상 국가'}</span>
                                </label>
                                {batchEditForm.target_countries.enabled && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <button type="button" onClick={() => setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: 'all' } })}
                                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${batchEditForm.target_countries.value === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            🌐 {t('adsPage.allCountries') || '전체'}
                                        </button>
                                        {COUNTRY_OPTIONS.map(c => {
                                            const sel = batchEditForm.target_countries.value !== 'all' && batchEditForm.target_countries.value.split(',').includes(c.code);
                                            return (
                                                <button key={c.code} type="button" onClick={() => {
                                                    const cur = batchEditForm.target_countries.value;
                                                    if (cur === 'all') {
                                                        setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: c.code } });
                                                    } else {
                                                        const codes = cur.split(',').filter(Boolean);
                                                        const next = sel ? codes.filter(x => x !== c.code) : [...codes, c.code];
                                                        setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: next.length ? next.join(',') : 'all' } });
                                                    }
                                                }}
                                                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${sel ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {c.flag} {c.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Slot */}
                            <div className={`rounded-xl border p-3 transition-colors ${batchEditForm.slot_id.enabled ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={batchEditForm.slot_id.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, slot_id: { ...batchEditForm.slot_id, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.adSlot')}</span>
                                </label>
                                {batchEditForm.slot_id.enabled && (
                                    <select value={batchEditForm.slot_id.value} onChange={e => setBatchEditForm({ ...batchEditForm, slot_id: { ...batchEditForm.slot_id, value: e.target.value } })} className="w-full mt-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none">
                                        {SLOT_OPTIONS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}
                                    </select>
                                )}
                            </div>

                            {/* Priority & Status */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`rounded-xl border p-3 transition-colors ${batchEditForm.priority.enabled ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={batchEditForm.priority.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, priority: { ...batchEditForm.priority, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.priority')}</span>
                                    </label>
                                    {batchEditForm.priority.enabled && (
                                        <input type="number" min="0" max="100" value={batchEditForm.priority.value} onChange={e => setBatchEditForm({ ...batchEditForm, priority: { ...batchEditForm.priority, value: parseInt(e.target.value) || 0 } })} className="w-full mt-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" />
                                    )}
                                </div>
                                <div className={`rounded-xl border p-3 transition-colors ${batchEditForm.is_active.enabled ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={batchEditForm.is_active.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, is_active: { ...batchEditForm.is_active, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.statusLabel')}</span>
                                    </label>
                                    {batchEditForm.is_active.enabled && (
                                        <button type="button" onClick={() => setBatchEditForm({ ...batchEditForm, is_active: { ...batchEditForm.is_active, value: batchEditForm.is_active.value ? 0 : 1 } })} className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${batchEditForm.is_active.value ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            {batchEditForm.is_active.value ? t('adsPage.activeStatus') : t('adsPage.inactiveStatus')}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className={`rounded-xl border p-3 transition-colors ${batchEditForm.start_date.enabled || batchEditForm.end_date.enabled ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                                            <input type="checkbox" checked={batchEditForm.start_date.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, start_date: { ...batchEditForm.start_date, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.startDate')}</span>
                                        </label>
                                        {batchEditForm.start_date.enabled && (
                                            <input type="date" value={batchEditForm.start_date.value} onChange={e => setBatchEditForm({ ...batchEditForm, start_date: { ...batchEditForm.start_date, value: e.target.value } })} className="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" />
                                        )}
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                                            <input type="checkbox" checked={batchEditForm.end_date.enabled} onChange={e => setBatchEditForm({ ...batchEditForm, end_date: { ...batchEditForm.end_date, enabled: e.target.checked } })} className="w-4 h-4 rounded accent-indigo-600" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{t('adsPage.endDate')}</span>
                                        </label>
                                        {batchEditForm.end_date.enabled && (
                                            <input type="date" value={batchEditForm.end_date.value} onChange={e => setBatchEditForm({ ...batchEditForm, end_date: { ...batchEditForm.end_date, value: e.target.value } })} className="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={handleBatchEditSubmit} className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">{t('adsPage.applyBatchEdit') || '일괄 적용'}</button>
                                <button onClick={() => setShowBatchEdit(false)} className="px-5 py-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{t('adsPage.cancel')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {reportAd && <AdminAdDashboard ad={reportAd} onClose={() => setReportAd(null)} />}
            {campaignReportId && <CampaignReportModal campaignId={campaignReportId} onClose={() => setCampaignReportId(null)} />}
            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminAds;
