import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, MessageSquare, CheckCircle, XCircle, ChevronDown, ChevronLeft, ChevronRight, Mail, Phone, Instagram, Search, Calendar, Clock, Tag, AlertTriangle, X, Paperclip, FileText, Download, Eye, User, ImageIcon, Zap, BadgeCheck, MessageCircle } from 'lucide-react';

const API_BASE = '/api';

const VendorApplications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('vendor');

    const CATEGORY_LABELS = {
        fashion: t('applicationsPage.catFashion'), beauty: t('applicationsPage.catBeauty'), food: t('applicationsPage.catFood'),
        living: t('applicationsPage.catLiving'), art: t('applicationsPage.catArt'), stationery: t('applicationsPage.catStationery'),
        digital: t('applicationsPage.catDigital'), activity: t('applicationsPage.catActivity'), eco: t('applicationsPage.catEco'),
        pet: t('applicationsPage.catPet'), kids: t('applicationsPage.catKids'), handmade: t('applicationsPage.catHandmade'),
        vintage: t('applicationsPage.catVintage'), perfume: t('applicationsPage.catPerfume'), book: t('applicationsPage.catBook')
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return t('applicationsPage.minutesAgo', { count: mins });
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return t('applicationsPage.hoursAgo', { count: hrs });
        const days = Math.floor(hrs / 24);
        if (days < 7) return t('applicationsPage.daysAgo', { count: days });
        return new Date(dateStr).toLocaleDateString('ko-KR');
    };

    const calcExperience = (joinedAt) => {
        if (!joinedAt) return null;
        const diff = Date.now() - new Date(joinedAt).getTime();
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        if (months < 1) return t('applicationsPage.experienceNew');
        if (months < 12) return t('applicationsPage.experienceMonths', { count: months });
        const years = Math.floor(months / 12);
        const rem = months % 12;
        return rem > 0 ? t('applicationsPage.experienceYearsMonths', { years, months: rem }) : t('applicationsPage.experienceYears', { years });
    };
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appFilterCategory, setAppFilterCategory] = useState('all');
    const [appFilterStatus, setAppFilterStatus] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    // Toast notification state
    const [toast, setToast] = useState(null);
    // Seller detail modal state
    const [sellerDetail, setSellerDetail] = useState(null);
    const [sellerDetailLoading, setSellerDetailLoading] = useState(false);
    // Lightbox state  
    const [lightboxPhotos, setLightboxPhotos] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    // Priority viewing subscription state
    const [hasViewingSub, setHasViewingSub] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchApplications = () => {
        setLoading(true);
        fetch(`${API_BASE}/applications/get_applications.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setApplications(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchApplications(); }, []);

    // Check priority_viewing subscription
    useEffect(() => {
        fetch(`${API_BASE}/payments/check_subscription.php?category=priority_viewing`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => { if (d.active) setHasViewingSub(true); })
            .catch(() => { });
    }, []);

    const fetchSellerDetail = async (userId) => {
        setSellerDetailLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/get_public_profile.php?id=${userId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSellerDetail(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSellerDetailLoading(false);
        }
    };

    const handleApplicationAction = (appId, status, applicantName) => {
        const isApprove = status === 'approved';
        setRejectionReason('');
        setConfirmModal({
            title: isApprove ? t('applicationsPage.approveTitle') : t('applicationsPage.rejectTitle'),
            message: isApprove ? t('applicationsPage.approveConfirm', { name: applicantName || '' }) : t('applicationsPage.rejectConfirm', { name: applicantName || '' }),
            type: isApprove ? 'success' : 'danger',
            confirmLabel: isApprove ? t('applicationsPage.approveLabel') : t('applicationsPage.rejectLabel'),
            showRejectionReason: !isApprove,
            onConfirm: (reason) => {
                const body = { id: appId, status: status };
                if (!isApprove && reason) {
                    body.rejection_reason = reason;
                }
                fetch(`${API_BASE}/applications/update_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(body)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast(isApprove ? t('applicationsPage.toastApproved') : t('applicationsPage.toastRejected'), 'success');
                            fetchApplications();
                        } else {
                            showToast(t('applicationsPage.toastFailed') + data.message, 'error');
                        }
                    })
                    .catch(() => showToast(t('applicationsPage.toastError'), 'error'));
                setConfirmModal(null);
                setRejectionReason('');
            }
        });
    };

    // Stats
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    const approvedApps = applications.filter(a => a.status === 'approved').length;
    const rejectedApps = applications.filter(a => a.status === 'rejected').length;

    // Filtered
    const filteredApplications = applications.filter(app => {
        const matchesCategory = appFilterCategory === 'all' || app.applicant_category === appFilterCategory ||
            (appFilterCategory === 'other' && !Object.keys(CATEGORY_LABELS).includes(app.applicant_category));
        const matchesStatus = appFilterStatus === 'all' || app.status === appFilterStatus;

        // Search by name, brand, keywords, email
        let matchesSearch = true;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = (app.applicant_name || '').toLowerCase().includes(q);
            const brandMatch = (app.applicant_brand || '').toLowerCase().includes(q);
            const emailMatch = (app.applicant_email || '').toLowerCase().includes(q);
            const venueMatch = (app.venue_name || '').toLowerCase().includes(q);
            const kwMatch = Array.isArray(app.applicant_keywords) && app.applicant_keywords.some(kw => kw.toLowerCase().includes(q));
            const catMatch = (CATEGORY_LABELS[app.applicant_category] || app.applicant_category || '').toLowerCase().includes(q);
            matchesSearch = nameMatch || brandMatch || emailMatch || venueMatch || kwMatch || catMatch;
        }

        return matchesCategory && matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{t('applicationsPage.title')}</h1>
                <p className="text-sm text-gray-500 mt-1">{t('applicationsPage.subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: t('applicationsPage.statsAll'), count: applications.length, color: 'text-gray-900', bg: 'bg-white border-gray-200' },
                    { label: t('applicationsPage.statsPending'), count: pendingApps, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                    { label: t('applicationsPage.statsApproved'), count: approvedApps, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                    { label: t('applicationsPage.statsRejected'), count: rejectedApps, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 border text-center`}>
                        <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
                        <p className="text-[11px] font-bold text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('applicationsPage.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">
                        {t('applicationsPage.resultCount', { count: filteredApplications.length })}
                    </p>
                    <div className="flex gap-2">
                        <select value={appFilterStatus} onChange={(e) => setAppFilterStatus(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="all">{t('applicationsPage.filterAllStatus')}</option>
                            <option value="pending">{t('applicationsPage.filterPending')}</option>
                            <option value="approved">{t('applicationsPage.filterApproved')}</option>
                            <option value="rejected">{t('applicationsPage.filterRejected')}</option>
                        </select>
                        <select value={appFilterCategory} onChange={(e) => setAppFilterCategory(e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="all">{t('applicationsPage.filterAllCategory')}</option>
                            <option value="fashion">{t('applicationsPage.catFashion')}</option>
                            <option value="beauty">{t('applicationsPage.catBeauty')}</option>
                            <option value="food">{t('applicationsPage.catFood')}</option>
                            <option value="living">{t('applicationsPage.catLiving')}</option>
                            <option value="art">{t('applicationsPage.catArt')}</option>
                            <option value="other">{t('applicationsPage.catOther')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Application List */}
            {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 font-medium text-sm">{t('applicationsPage.noApplications')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApplications.map(app => {
                        const initial = (app.applicant_name || '?')[0];
                        const isExpanded = expandedId === app.id;
                        const experience = calcExperience(app.applicant_joined_at);
                        const keywords = Array.isArray(app.applicant_keywords) ? app.applicant_keywords : [];
                        const statusConfig = {
                            pending: { label: t('applicationsPage.statusPendingLabel'), dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
                            approved: { label: t('applicationsPage.statusApprovedLabel'), dot: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                            rejected: { label: t('applicationsPage.statusRejectedLabel'), dot: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50' },
                        }[app.status] || { label: app.status, dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' };

                        return (
                            <div key={app.id} className={`bg-white rounded-2xl border transition-all duration-200 ${app.is_priority ? 'border-amber-300 shadow-md ring-1 ring-amber-200/50' : app.status === 'pending' ? 'border-amber-200 shadow-sm' : 'border-gray-100'}`}>
                                {/* Priority Badge Bar */}
                                {app.is_priority ? (
                                    <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center gap-1.5 rounded-t-2xl">
                                        <Zap size={12} className="text-white" fill="white" />
                                        <span className="text-white text-[11px] font-extrabold tracking-wide">{t('applicationsPage.fastTrack')}</span>
                                    </div>
                                ) : null}
                                {/* Summary Row */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-2xl"
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-extrabold flex-shrink-0 ${app.status === 'pending'
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                            : app.status === 'approved'
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                                : 'bg-gradient-to-br from-gray-300 to-gray-400'
                                            }`}>
                                            {initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900 text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors"
                                                    onClick={(e) => { e.stopPropagation(); if (app.user_id) fetchSellerDetail(app.user_id); }}>
                                                    {app.applicant_name || t('applicationsPage.noName')}
                                                </h4>
                                                {app.is_verified ? (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold flex-shrink-0">
                                                        <BadgeCheck size={9} /> {t('applicationsPage.verified')}
                                                    </span>
                                                ) : null}
                                                {app.applicant_brand && (
                                                    <span className="text-xs text-indigo-500 font-medium hidden sm:inline truncate">{app.applicant_brand}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Store size={11} className="text-gray-400 flex-shrink-0" />
                                                <span className="text-xs text-gray-500 truncate">{app.venue_name}</span>
                                                <span className="text-gray-300 text-xs">·</span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(app.created_at)}</span>
                                            </div>
                                            {app.selected_period && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Calendar size={10} className="text-amber-500 flex-shrink-0" />
                                                    <span className="text-[11px] text-amber-600 font-medium truncate">
                                                        {app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString('ko-KR') : ''} ~ {app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString('ko-KR') : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${statusConfig.bg} ${statusConfig.text} hidden sm:inline-flex items-center gap-1`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                                {statusConfig.label}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} sm:hidden`}></span>
                                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-gray-100">
                                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Left: Message + Actions (moved to top) */}
                                            <div className="space-y-3">
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('applicationsPage.applicationMessage')}</p>
                                                <div className="p-3.5 bg-gray-50 rounded-xl min-h-[80px]">
                                                    <p className={`text-sm leading-relaxed ${app.message ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                                                        {app.message || t('applicationsPage.noMessage')}
                                                    </p>
                                                </div>

                                                {/* Attachments */}
                                                {(() => {
                                                    let atts = [];
                                                    try {
                                                        atts = typeof app.attachments === 'string' ? JSON.parse(app.attachments) : (app.attachments || []);
                                                    } catch { }
                                                    if (!Array.isArray(atts) || atts.length === 0) return null;
                                                    return (
                                                        <div className="pt-2">
                                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('applicationsPage.attachments')}</p>
                                                            <div className="space-y-1.5">
                                                                {atts.map((att, i) => (
                                                                    <a key={i} href={`/${att}`} target="_blank" rel="noreferrer"
                                                                        className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                                                    >
                                                                        <FileText size={14} className="text-indigo-500 flex-shrink-0" />
                                                                        <span className="text-xs font-medium text-indigo-700 flex-1 truncate">{att.split('/').pop()}</span>
                                                                        <Download size={12} className="text-indigo-400 flex-shrink-0" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {app.status === 'pending' && (
                                                    <div className="flex gap-2 pt-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApplicationAction(app.id, 'approved', app.applicant_name); }}
                                                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                                        >
                                                            <CheckCircle size={15} />
                                                            {t('applicationsPage.approve')}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApplicationAction(app.id, 'rejected', app.applicant_name); }}
                                                            className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <XCircle size={15} />
                                                            {t('applicationsPage.reject')}
                                                        </button>
                                                    </div>
                                                )}
                                                {app.status === 'approved' && (
                                                    (() => {
                                                        let canReject = true;
                                                        let deadlineMsg = '';
                                                        if (app.selected_period?.start) {
                                                            const eventStart = new Date(app.selected_period.start);
                                                            const now = new Date();
                                                            const diffMs = eventStart - now;
                                                            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                                            if (diffDays < 3) {
                                                                canReject = false;
                                                                deadlineMsg = t('applicationsPage.deadlineWarning');
                                                            }
                                                        }
                                                        return (
                                                            <div className="space-y-2">
                                                                <div className="p-2.5 text-center bg-emerald-50 rounded-xl">
                                                                    <p className="text-xs font-bold text-emerald-600">{t('applicationsPage.approvedMessage')}</p>
                                                                </div>
                                                                {/* Chat with approved seller */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/vendor/chat?user=${app.user_id}`); }}
                                                                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-xs font-bold hover:from-indigo-400 hover:to-violet-400 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                                                >
                                                                    <MessageCircle size={14} /> 채팅하기
                                                                </button>
                                                                {canReject ? (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleApplicationAction(app.id, 'rejected', app.applicant_name); }}
                                                                        className="w-full py-2 bg-white border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                                                                    >
                                                                        <XCircle size={13} />
                                                                        {t('applicationsPage.cancelApproval')}
                                                                    </button>
                                                                ) : (
                                                                    <p className="text-[11px] text-red-400 text-center font-medium">{deadlineMsg}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })()
                                                )}
                                                {app.status === 'rejected' && (
                                                    <div className="space-y-2">
                                                        <div className="p-2.5 text-center bg-red-50 rounded-xl">
                                                            <p className="text-xs font-bold text-red-500">{t('applicationsPage.rejectedMessage')}</p>
                                                        </div>
                                                        {app.rejection_reason && (
                                                            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                                                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">{t('applicationsPage.rejectionReason')}</p>
                                                                <p className="text-sm text-red-600 leading-relaxed">{app.rejection_reason}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Seller Profile (subscription gated) */}
                                            <div className="space-y-3 relative">
                                                {!hasViewingSub && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                                                        <div className="text-center p-6">
                                                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                                                <Eye size={24} className="text-indigo-500" />
                                                            </div>
                                                            <p className="text-sm font-bold text-gray-800 mb-1">{t('applicationsPage.sellerDetailView')}</p>
                                                            <p className="text-xs text-gray-500 mb-3" dangerouslySetInnerHTML={{ __html: t('applicationsPage.sellerDetailSubscribe').replace('\n', '<br />') }} />
                                                            <a href="/vendor/payments" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                                                                {t('applicationsPage.subscribe')}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('applicationsPage.sellerDetailInfo')}</p>

                                                {/* Info Items */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Tag size={14} className="text-indigo-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.salesCategory')}</span>
                                                        <span className="font-medium text-gray-800">{CATEGORY_LABELS[app.applicant_category] || app.applicant_category || t('applicationsPage.notEntered')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.email')}</span>
                                                        <span className="text-gray-700">{app.applicant_email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.phone')}</span>
                                                        <span className="text-gray-700">{app.applicant_phone || t('applicationsPage.notProvided')}</span>
                                                    </div>
                                                    {app.applicant_instagram && (
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <Instagram size={14} className="text-pink-400 flex-shrink-0" />
                                                            <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.instagram')}</span>
                                                            <a href={`https://instagram.com/${app.applicant_instagram.replace('@', '')}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-pink-600 font-medium hover:underline">
                                                                @{app.applicant_instagram.replace('@', '')}
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.activityPeriod')}</span>
                                                        <span className="text-gray-700">{experience || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500 w-16 flex-shrink-0">{t('applicationsPage.participationDate')}</span>
                                                        <span className="text-gray-700">{app.created_at ? new Date(app.created_at).toLocaleDateString('ko-KR') : '-'}</span>
                                                    </div>
                                                    {/* Selected Event Period */}
                                                    {app.selected_period && (
                                                        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Calendar size={14} className="text-amber-500 flex-shrink-0" />
                                                                <span className="text-amber-700 font-medium">{t('applicationsPage.desiredEventPeriod')}</span>
                                                                <span className="font-bold text-gray-800">
                                                                    {app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString('ko-KR') : t('applicationsPage.undecided')}
                                                                    {' ~ '}
                                                                    {app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString('ko-KR') : t('applicationsPage.undecided')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Keywords */}
                                                {keywords.length > 0 && (
                                                    <div className="pt-1">
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1.5">{t('applicationsPage.keywords')}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {keywords.map((kw, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold">{kw}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Bio */}
                                                {app.applicant_description && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1">{t('applicationsPage.sellerBio')}</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">{app.applicant_description}</p>
                                                    </div>
                                                )}

                                                {/* Seller Detail Button */}
                                                {app.user_id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); fetchSellerDetail(app.user_id); }}
                                                        className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                                    >
                                                        <Eye size={14} />
                                                        {t('applicationsPage.viewSellerInfo')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className={`p-5 flex items-center gap-3 ${confirmModal.type === 'danger' ? 'bg-red-50' : confirmModal.type === 'success' ? 'bg-emerald-50' : 'bg-amber-50'
                            }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === 'danger' ? 'bg-red-100' : confirmModal.type === 'success' ? 'bg-emerald-100' : 'bg-amber-100'
                                }`}>
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
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('applicationsPage.rejectionReasonLabel')}</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder={t('applicationsPage.rejectionReasonPlaceholder')}
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
                                {confirmModal.confirmLabel || t('applicationsPage.approve')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
                    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm ${toast.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {toast.type === 'success'
                            ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                            : <XCircle size={18} className="text-red-500 flex-shrink-0" />}
                        <span className="text-sm font-bold">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors">
                            <X size={14} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Seller Detail Modal */}
            {sellerDetail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4" onClick={() => setSellerDetail(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
                            <div className="relative flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden ring-2 ring-white/30">
                                        {sellerDetail.user?.profile_image ? (
                                            <img src={sellerDetail.user.profile_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            (sellerDetail.user?.name || '?')[0]
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold">{sellerDetail.user?.name}</h2>
                                        {sellerDetail.user?.category && (
                                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20">
                                                {CATEGORY_LABELS[sellerDetail.user.category] || sellerDetail.user.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setSellerDetail(null)} className="text-white/80 hover:text-white p-1">
                                    <X size={22} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                            {/* Sales Info */}
                            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">{t('applicationsPage.salesInfo')}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={16} className="text-violet-600" />
                                    <span className="text-sm font-bold text-violet-800">{CATEGORY_LABELS[sellerDetail.user?.category] || sellerDetail.user?.category || t('applicationsPage.unspecified')}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{sellerDetail.user?.description || t('applicationsPage.noBrandIntro')}</p>
                            </div>

                            {/* Product Photos */}
                            {sellerDetail.seller_photos?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <ImageIcon size={12} />
                                        {t('applicationsPage.productPhotos')}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sellerDetail.seller_photos.map((photo, idx) => (
                                            <div key={photo.id || idx}
                                                className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                                                onClick={() => { setLightboxPhotos(sellerDetail.seller_photos); setLightboxIndex(idx); }}
                                            >
                                                <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 py-3 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600">{sellerDetail.applications?.length || 0}</p>
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
                                            <p className="text-xs text-gray-400">{t('applicationsPage.email')}</p>
                                            <p className="text-sm font-medium text-gray-800">{sellerDetail.user?.email || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">{t('applicationsPage.phone')}</p>
                                            <p className="text-sm font-medium text-gray-800">{sellerDetail.user?.phone || t('applicationsPage.notRegistered')}</p>
                                        </div>
                                    </div>
                                    {sellerDetail.user?.instagram && (
                                        <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                            <Instagram size={16} className="text-violet-500" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('applicationsPage.instagramLabel')}</p>
                                                <a href={`https://instagram.com/${sellerDetail.user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                                                    className="text-sm font-medium text-violet-600 hover:text-violet-700">@{sellerDetail.user.instagram.replace('@', '')}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Lightbox */}
            {lightboxPhotos.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center" onClick={() => setLightboxPhotos([])}>
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
                        src={lightboxPhotos[lightboxIndex]?.image_url || ''}
                        alt=""
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default VendorApplications;
