import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    Check, X, ShieldAlert, ShieldCheck, Search, Filter, AlertTriangle, CheckCircle, XCircle,
    ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, RotateCcw, Eye, Mail, Phone, Instagram,
    Tag, Calendar, Building, ClipboardList, ImageIcon, Star, MoreHorizontal, Undo2, Zap
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const CATEGORY_KEYS = [
    'fashion', 'beauty', 'food', 'living', 'art', 'stationery',
    'digital', 'activity', 'eco', 'pet', 'kids', 'handmade',
    'vintage', 'perfume', 'book'
];

const getCategoryColor = (cat) => {
    const colors = {
        fashion: 'bg-pink-50 text-pink-600', beauty: 'bg-fuchsia-50 text-fuchsia-600',
        food: 'bg-orange-50 text-orange-600', living: 'bg-emerald-50 text-emerald-600',
        art: 'bg-violet-50 text-violet-600', stationery: 'bg-blue-50 text-blue-600',
        digital: 'bg-cyan-50 text-cyan-600', activity: 'bg-lime-50 text-lime-600',
        eco: 'bg-green-50 text-green-600', pet: 'bg-amber-50 text-amber-600',
        kids: 'bg-rose-50 text-rose-600', handmade: 'bg-yellow-50 text-yellow-600',
        vintage: 'bg-stone-100 text-stone-600', perfume: 'bg-purple-50 text-purple-600',
        book: 'bg-sky-50 text-sky-600'
    };
    return colors[cat] || 'bg-gray-50 text-gray-600';
};

const AdminApplications = () => {
    const { applications, updateApplicationStatus, fetchApplications } = useData();
    const { user } = useAuth();
    const { t } = useTranslation('admin');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterVenue, setFilterVenue] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Seller profile modal state
    const [sellerProfile, setSellerProfile] = useState(null);
    const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
    // Lightbox
    const [lightboxPhotos, setLightboxPhotos] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    // Mobile action menu
    const [mobileActionId, setMobileActionId] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // 입점 목록은 관리자 화면 진입 시 한 번 더 동기화 (세션 역할 보정은 API에서 처리)
    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            fetchApplications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchApplications는 Context에서 비안정 참조
    }, [user?.id, user?.role]);

    // Fetch seller profile via API (same format as seller directory)
    const fetchSellerProfile = async (userId) => {
        if (!userId) return;
        setSellerProfileLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/get_public_profile.php?id=${userId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSellerProfile(data);
            }
        } catch (err) {
            console.error('Seller profile load failed:', err);
        } finally {
            setSellerProfileLoading(false);
        }
    };

    // Derived Data
    const uniqueVenues = useMemo(() =>
        [...new Set(applications.map(a => a.venue_name || a.venueName).filter(Boolean))].sort(),
        [applications]
    );

    const filteredApps = useMemo(() => {
        let result = applications.filter(app => {
            const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
            const cat = app.applicant_category || app.sellerCategory || '';
            const matchesCategory = filterCategory === 'all' || cat === filterCategory ||
                (filterCategory === 'other' && !CATEGORY_KEYS.includes(cat));
            const venueName = app.venue_name || app.venueName || '';
            const matchesVenue = filterVenue === 'all' || venueName === filterVenue;
            const name = (app.applicant_name || app.sellerName || '').toLowerCase();
            const email = (app.applicant_email || app.sellerEmail || '').toLowerCase();
            const brand = (app.applicant_brand || '').toLowerCase();
            const venue = venueName.toLowerCase();
            const term = searchTerm.toLowerCase();
            const matchesSearch = !term || name.includes(term) || email.includes(term) || venue.includes(term) || brand.includes(term);

            // Date range filter
            let matchesDate = true;
            const appDate = app.created_at || app.appliedAt;
            if (dateFrom && appDate) {
                matchesDate = new Date(appDate) >= new Date(dateFrom);
            }
            if (dateTo && appDate && matchesDate) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59, 999);
                matchesDate = new Date(appDate) <= end;
            }

            return matchesStatus && matchesCategory && matchesVenue && matchesSearch && matchesDate;
        });

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at || b.appliedAt) - new Date(a.created_at || a.appliedAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at || a.appliedAt) - new Date(b.created_at || b.appliedAt));
                break;
            case 'priority':
                result.sort((a, b) => (b.is_priority || 0) - (a.is_priority || 0) || new Date(b.created_at || b.appliedAt) - new Date(a.created_at || a.appliedAt));
                break;
            case 'name_asc':
                result.sort((a, b) => (a.applicant_name || a.sellerName || '').localeCompare(b.applicant_name || b.sellerName || '', 'ko'));
                break;
            case 'name_desc':
                result.sort((a, b) => (b.applicant_name || b.sellerName || '').localeCompare(a.applicant_name || a.sellerName || '', 'ko'));
                break;
            case 'venue_asc':
                result.sort((a, b) => (a.venue_name || a.venueName || '').localeCompare(b.venue_name || b.venueName || '', 'ko'));
                break;
            default:
                break;
        }

        return result;
    }, [applications, filterStatus, filterCategory, filterVenue, searchTerm, sortBy, dateFrom, dateTo]);

    // Stats
    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        priority: applications.filter(a => a.is_priority == 1).length
    };

    // Toggle priority handler
    const handleTogglePriority = async (app) => {
        const newPriority = app.is_priority == 1 ? 0 : 1;
        try {
            const res = await fetch(`${API_BASE}/applications/toggle_priority.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ application_id: app.id, is_priority: newPriority })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                fetchApplications();
            } else {
                showToast(t('applicationsPage.processFailed') + data.message, 'error');
            }
        } catch (err) {
            showToast(t('applicationsPage.processError'), 'error');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR');
    };

    const CATEGORY_LABEL_MAP = {
        fashion: t('applicationsPage.catFashion'), beauty: t('applicationsPage.catBeauty'), food: t('applicationsPage.catFood'),
        living: t('applicationsPage.catLiving'), art: t('applicationsPage.catArt'), stationery: t('applicationsPage.catStationery'),
        digital: t('applicationsPage.catDigital'), activity: t('applicationsPage.catActivity'), eco: t('applicationsPage.catEco'),
        pet: t('applicationsPage.catPet'), kids: t('applicationsPage.catKids'), handmade: t('applicationsPage.catHandmade'),
        vintage: t('applicationsPage.catVintage'), perfume: t('applicationsPage.catPerfume'), book: t('applicationsPage.catBook')
    };
    const getCategoryLabel = (cat) => CATEGORY_LABEL_MAP[cat] || cat || '-';

    const hasActiveFilters = filterCategory !== 'all' || filterVenue !== 'all' || searchTerm || dateFrom || dateTo;

    const clearFilters = () => {
        setFilterCategory('all');
        setFilterVenue('all');
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
        setSortBy('newest');
    };

    // Application actions with confirmation
    const handleApprove = (app) => {
        setConfirmModal({
            title: t('applicationsPage.approveTitle'),
            message: t('applicationsPage.approveMsg', { name: app.applicant_name || app.sellerName, venue: app.venue_name || app.venueName }),
            type: 'success',
            confirmLabel: t('applicationsPage.approve'),
            onConfirm: () => {
                updateApplicationStatus(app.id, 'approved');
                showToast(t('applicationsPage.approvedToast'), 'success');
                setConfirmModal(null);
            }
        });
    };

    const handleReject = (app) => {
        setRejectionReason('');
        setConfirmModal({
            title: t('applicationsPage.rejectTitle'),
            message: t('applicationsPage.rejectMsg', { name: app.applicant_name || app.sellerName, venue: app.venue_name || app.venueName }),
            type: 'danger',
            confirmLabel: t('applicationsPage.rejected'),
            showRejectionReason: true,
            onConfirm: (reason) => {
                const body = { id: app.id, status: 'rejected' };
                if (reason) body.rejection_reason = reason;
                fetch(`${API_BASE}/applications/update_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(body)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast(t('applicationsPage.rejectedToast'), 'success');
                            updateApplicationStatus(app.id, 'rejected');
                        } else {
                            showToast(t('applicationsPage.processFailed') + data.message, 'error');
                        }
                    })
                    .catch(() => showToast(t('applicationsPage.processError'), 'error'));
                setConfirmModal(null);
                setRejectionReason('');
            }
        });
    };

    const handleRevert = (app, toStatus) => {
        const label = toStatus === 'pending' ? t('applicationsPage.statusPending') : toStatus;
        setConfirmModal({
            title: t('applicationsPage.revertTitle'),
            message: t('applicationsPage.revertMsg', { name: app.applicant_name || app.sellerName, status: label }),
            type: 'warning',
            confirmLabel: t('applicationsPage.revertConfirm'),
            onConfirm: () => {
                updateApplicationStatus(app.id, toStatus);
                showToast(t('applicationsPage.revertedToast', { status: label }), 'success');
                setConfirmModal(null);
            }
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('applicationsPage.title')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('applicationsPage.subtitle')}</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setFilterStatus('all')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'all' ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
                    <p className="text-gray-500 text-xs font-bold uppercase">{t('applicationsPage.totalApps')}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.total}</p>
                </button>
                <button onClick={() => setFilterStatus('pending')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'pending' ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100' : 'bg-white border-gray-100 hover:border-yellow-100'}`}>
                    <p className="text-yellow-600 text-xs font-bold uppercase">{t('applicationsPage.pendingReview')}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.pending}</p>
                </button>
                <button onClick={() => setFilterStatus('approved')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'approved' ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white border-gray-100 hover:border-green-100'}`}>
                    <p className="text-green-600 text-xs font-bold uppercase">{t('applicationsPage.statusApproved')}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.approved}</p>
                </button>
                <button onClick={() => setFilterStatus('rejected')} className={`p-4 rounded-2xl border transition-all ${filterStatus === 'rejected' ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-white border-gray-100 hover:border-red-100'}`}>
                    <p className="text-red-500 text-xs font-bold uppercase">{t('applicationsPage.statusRejected')}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.rejected}</p>
                </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder={t('applicationsPage.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                        />
                    </div>
                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">{t('applicationsPage.allCategories')}</option>
                            {CATEGORY_KEYS.map(key => (
                                <option key={key} value={key}>{CATEGORY_LABEL_MAP[key]}</option>
                            ))}
                            <option value="other">{t('applicationsPage.otherCategory')}</option>
                        </select>
                    </div>
                    {/* Venue Filter */}
                    <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={filterVenue}
                            onChange={(e) => setFilterVenue(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all">{t('applicationsPage.allVenues')}</option>
                            {uniqueVenues.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    {/* Sort */}
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                        >
                            <option value="newest">{t('applicationsPage.sortNewest')}</option>
                            <option value="oldest">{t('applicationsPage.sortOldest')}</option>
                            <option value="priority">{t('applicationsPage.sortPriority')}</option>
                            <option value="name_asc">{t('applicationsPage.sortNameAsc')}</option>
                            <option value="name_desc">{t('applicationsPage.sortNameDesc')}</option>
                            <option value="venue_asc">{t('applicationsPage.sortVenue')}</option>
                        </select>
                    </div>
                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                        <span className="text-gray-400 text-sm">~</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                    </div>
                    {/* Result Count & Reset */}
                    <div className="flex items-center gap-3 ml-auto">
                        <span className="text-xs text-gray-400 font-medium">
                            {t('applicationsPage.resultCount', { total: stats.total })} <span className="text-indigo-600 font-bold">{t('applicationsPage.resultFiltered', { count: filteredApps.length })}</span>
                        </span>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                                <RotateCcw size={12} />
                                {t('applicationsPage.resetFilters')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('applicationsPage.thBrand')}</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('applicationsPage.thCategory')}</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('applicationsPage.thVenue')}</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('applicationsPage.thDate')}</th>
                                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('applicationsPage.thStatus')}</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">{t('applicationsPage.thActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApps.map(app => {
                                const category = app.applicant_category || app.sellerCategory || '';
                                return (
                                    <tr key={app.id} className={`transition-colors group ${app.is_priority == 1 ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-gray-50/80'}`}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => fetchSellerProfile(app.user_id)}
                                                className="text-left hover:opacity-80 transition-opacity"
                                                title={t('applicationsPage.viewProfile')}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {app.is_priority == 1 && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold rounded-md">
                                                            <Zap size={9} fill="white" />{t('applicationsPage.fastTrack')}
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 decoration-indigo-200">
                                                        {app.applicant_name || app.sellerName}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">{app.applicant_email || app.sellerEmail}</div>
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(category)}`}>
                                                {getCategoryLabel(category)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700 font-medium">{app.venue_name || app.venueName}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {formatDate(app.created_at || app.appliedAt)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {app.status === 'pending' ? t('applicationsPage.statusPending') : app.status === 'approved' ? t('applicationsPage.statusApproved') : t('applicationsPage.statusRejected')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {/* View Profile */}
                                                <button
                                                    onClick={() => fetchSellerProfile(app.user_id)}
                                                    className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                    title={t('applicationsPage.sellerProfile')}
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                {/* Priority Toggle */}
                                                <button
                                                    onClick={() => handleTogglePriority(app)}
                                                    className={`p-2 rounded-lg transition-colors ${app.is_priority == 1 ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-500'}`}
                                                    title={app.is_priority == 1 ? t('applicationsPage.fastTrackOff') : t('applicationsPage.fastTrackOn')}
                                                >
                                                    <Zap size={15} fill={app.is_priority == 1 ? 'currentColor' : 'none'} />
                                                </button>
                                                {/* Pending: Approve + Reject */}
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(app)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title={t('applicationsPage.approve')}
                                                        >
                                                            <Check size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(app)}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title={t('applicationsPage.reject')}
                                                        >
                                                            <X size={15} />
                                                        </button>
                                                    </>
                                                )}
                                                {/* Approved: Revert to pending */}
                                                {app.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleRevert(app, 'pending')}
                                                        className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                                                        title={t('applicationsPage.cancelApproval')}
                                                    >
                                                        <Undo2 size={15} />
                                                    </button>
                                                )}
                                                {/* Rejected: Re-review */}
                                                {app.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleRevert(app, 'pending')}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title={t('applicationsPage.reReview')}
                                                    >
                                                        <RotateCcw size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <ClipboardList size={40} className="mx-auto text-gray-200 mb-3" />
                                        <p className="text-gray-400 font-medium">{t('applicationsPage.noResults')}</p>
                                        {hasActiveFilters && (
                                            <button onClick={clearFilters} className="mt-2 text-xs text-indigo-500 font-bold hover:underline">
                                                {t('applicationsPage.resetFilter')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden">
                    {filteredApps.map(app => {
                        const category = app.applicant_category || app.sellerCategory || '';
                        return (
                            <div key={app.id} className={`border-b border-gray-100 last:border-0 ${app.is_priority == 1 ? 'bg-amber-50/40' : ''}`}>
                                {app.is_priority == 1 && (
                                    <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center gap-1.5">
                                        <Zap size={12} className="text-white" fill="white" />
                                        <span className="text-white text-[11px] font-extrabold tracking-wide">{t('applicationsPage.fastTrackPriority')}</span>
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <button onClick={() => fetchSellerProfile(app.user_id)} className="text-left">
                                            <h3 className="font-bold text-indigo-600 underline underline-offset-2">{app.applicant_name || app.sellerName}</h3>
                                            <p className="text-xs text-gray-500">{app.applicant_email || app.sellerEmail}</p>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold
                                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {app.status === 'pending' ? t('applicationsPage.statusPendingShort') : app.status === 'approved' ? t('applicationsPage.statusApprovedShort') : t('applicationsPage.statusRejectedShort')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t('applicationsPage.categoryLabel')}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getCategoryColor(category)}`}>
                                                {getCategoryLabel(category)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t('applicationsPage.venueLabel')}</span>
                                            <span className="text-gray-900">{app.venue_name || app.venueName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t('applicationsPage.dateLabel')}</span>
                                            <span className="text-gray-900">{formatDate(app.created_at || app.appliedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => fetchSellerProfile(app.user_id)}
                                            className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                                            <Eye size={14} /> {t('applicationsPage.profile')}
                                        </button>
                                        <button onClick={() => handleTogglePriority(app)}
                                            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${app.is_priority == 1 ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                                            <Zap size={14} fill={app.is_priority == 1 ? 'currentColor' : 'none'} /> {app.is_priority == 1 ? t('applicationsPage.priorityOff') : t('applicationsPage.priorityOn')}
                                        </button>
                                        {app.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleApprove(app)}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold">
                                                    {t('applicationsPage.approve')}
                                                </button>
                                                <button onClick={() => handleReject(app)}
                                                    className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold">
                                                    {t('applicationsPage.reject')}
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'approved' && (
                                            <button onClick={() => handleRevert(app, 'pending')}
                                                className="flex-1 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                                                <Undo2 size={14} /> {t('applicationsPage.cancelApprovalShort')}
                                            </button>
                                        )}
                                        {app.status === 'rejected' && (
                                            <button onClick={() => handleRevert(app, 'pending')}
                                                className="flex-1 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                                                <RotateCcw size={14} /> {t('applicationsPage.reReviewShort')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredApps.length === 0 && (
                        <div className="py-16 text-center">
                            <ClipboardList size={40} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400 font-medium">{t('applicationsPage.noResultsMobile')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Seller Profile Modal (same format as Seller Directory) */}
            {sellerProfile && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSellerProfile(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                            <div className="relative flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-white/30">
                                        {sellerProfile.user?.profile_image ? (
                                            <img src={sellerProfile.user.profile_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            (sellerProfile.user?.name || '?')[0]
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold">{sellerProfile.user?.name}</h2>
                                        {sellerProfile.user?.category && (
                                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm">
                                                {getCategoryLabel(sellerProfile.user.category)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setSellerProfile(null)} className="text-white/80 hover:text-white p-1 transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Sales Info */}
                            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">{t('applicationsPage.salesInfo')}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={16} className="text-violet-600" />
                                    <span className="text-sm font-bold text-violet-800">{getCategoryLabel(sellerProfile.user?.category)}</span>
                                </div>
                                {sellerProfile.user?.description ? (
                                    <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">{sellerProfile.user.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic mt-2">{t('applicationsPage.noBrandDesc')}</p>
                                )}
                            </div>

                            {/* Product Photos */}
                            {sellerProfile.seller_photos?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <ImageIcon size={12} />
                                        {t('applicationsPage.productPhotos')}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sellerProfile.seller_photos.map((photo, idx) => (
                                            <div key={photo.id || idx}
                                                className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                                                onClick={() => { setLightboxPhotos(sellerProfile.seller_photos); setLightboxIndex(idx); }}
                                            >
                                                <img src={photo.image_url?.startsWith?.('uploads/') ? `/${photo.image_url}` : photo.image_url} alt={t('applicationsPage.productAlt', { num: idx + 1 })} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 py-3 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600">{sellerProfile.applications?.length || 0}</p>
                                    <p className="text-xs text-gray-400">{t('applicationsPage.applicationCount')}</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('applicationsPage.contactInfo')}</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">{t('applicationsPage.emailLabel')}</p>
                                            <p className="text-sm font-medium text-gray-800">{sellerProfile.user?.email || t('applicationsPage.notRegistered')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">{t('applicationsPage.phoneLabel')}</p>
                                            <p className={`text-sm font-medium ${sellerProfile.user?.phone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {sellerProfile.user?.phone || t('applicationsPage.notRegistered')}
                                            </p>
                                        </div>
                                    </div>
                                    {sellerProfile.user?.instagram && (
                                        <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                            <Instagram size={16} className="text-violet-500" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('applicationsPage.instagramLabel')}</p>
                                                <a href={`https://instagram.com/${sellerProfile.user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                                                    className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                                                    @{sellerProfile.user.instagram.replace('@', '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Business Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('applicationsPage.businessInfo')}</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Calendar size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">{t('applicationsPage.joinDate')}</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {sellerProfile.user?.created_at ? new Date(sellerProfile.user.created_at).toLocaleDateString('ko-KR') : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Lightbox */}
            {lightboxPhotos.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center" onClick={() => setLightboxPhotos([])}>
                    <button onClick={() => setLightboxPhotos([])} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
                        <X size={28} />
                    </button>
                    <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold">{lightboxIndex + 1} / {lightboxPhotos.length}</p>
                    {lightboxIndex > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <ChevronLeft size={28} />
                        </button>
                    )}
                    {lightboxIndex < lightboxPhotos.length - 1 && (
                        <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <ChevronRight size={28} />
                        </button>
                    )}
                    <img
                        src={(() => { const url = lightboxPhotos[lightboxIndex]?.image_url || ''; return url.startsWith?.('uploads/') ? `/${url}` : url; })()}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Confirm Modal with Rejection Reason */}
            {confirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className={`p-5 flex items-center gap-3 ${confirmModal.type === 'danger' ? 'bg-red-50' : confirmModal.type === 'success' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === 'danger' ? 'bg-red-100' : confirmModal.type === 'success' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                {confirmModal.type === 'success'
                                    ? <CheckCircle size={20} className="text-emerald-500" />
                                    : <AlertTriangle size={20} className={confirmModal.type === 'danger' ? 'text-red-500' : 'text-amber-500'} />}
                            </div>
                            <h3 className="text-base font-bold text-gray-900">{confirmModal.title}</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{confirmModal.message}</p>
                            {confirmModal.showRejectionReason && (
                                <div className="mt-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('applicationsPage.rejectionLabel')}</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder={t('applicationsPage.rejectionPlaceholder')}
                                        rows={3}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="px-5 pb-5 flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                            >
                                {t('applicationsPage.cancel')}
                            </button>
                            <button
                                onClick={() => confirmModal.onConfirm(rejectionReason)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600'
                                    : confirmModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-amber-500 hover:bg-amber-600'
                                    }`}
                            >
                                {confirmModal.confirmLabel || t('applicationsPage.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminApplications;
