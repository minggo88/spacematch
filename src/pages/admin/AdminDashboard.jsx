import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Store, ClipboardList, CheckCircle, AlertCircle, Check, X, MapPin,
    TrendingUp, Users, Activity, Calendar, ArrowRight, ArrowUpRight,
    Clock, Plus, FileText, Settings, BarChart3, Eye, Bell, Wifi
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

// ── Color Palette (#6d69f1 Purple Theme) ──
const COLORS = {
    primary: '#5551e8',
    primaryLight: '#6d69f1',
    primaryBg: '#EEEDFD',
    accent: '#6d69f1',
    accentLight: '#9B98F5',
    dark: '#2d2b6e',
};

const AdminDashboard = () => {
    const { venues, applications, fetchVenues } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('admin');
    const isSuperAdmin = user?.role === 'superadmin';

    const [pendingVenues, setPendingVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeUsersData, setActiveUsersData] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Real-time clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch active users (superadmin only, every 30s)
    useEffect(() => {
        if (!isSuperAdmin) return;
        const fetchActive = async () => {
            try {
                const res = await fetch(`${API_BASE}/admin/active_users.php`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) setActiveUsersData(data);
            } catch { /* ignore */ }
        };
        fetchActive();
        const interval = setInterval(fetchActive, 30000);
        return () => clearInterval(interval);
    }, [isSuperAdmin]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const pendingRes = await fetch(`${API_BASE}/venues/get_pending_venues.php`, { credentials: 'include' });
                const pendingData = await pendingRes.json();
                if (Array.isArray(pendingData)) setPendingVenues(pendingData);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const formatActiveTime = (dt) => {
        if (!dt) return '';
        const diff = Date.now() - new Date(dt).getTime();
        if (diff < 60000) return t('dashboardPage.justNow');
        if (diff < 3600000) return t('dashboardPage.minutesAgo', { count: Math.floor(diff / 60000) });
        if (diff < 86400000) return t('dashboardPage.hoursAgo', { count: Math.floor(diff / 3600000) });
        return t('dashboardPage.daysAgo', { count: Math.floor(diff / 86400000) });
    };

    const roleLabel = (role) => ({ admin: t('dashboardPage.roleAdmin'), superadmin: t('dashboardPage.roleSuperadmin'), seller: t('dashboardPage.roleSeller'), vendor: t('dashboardPage.roleVendor') }[role] || role);
    const roleColor = (role) => ({ admin: '#6d69f1', superadmin: '#e53e3e', seller: '#38a169', vendor: '#d69e2e' }[role] || '#718096');

    const stats = useMemo(() => {
        const totalVenues = venues.length;
        const totalApps = applications.length;
        const pendingApps = applications.filter(a => a.status === 'pending').length;
        const approvedApps = applications.filter(a => a.status === 'approved').length;
        const rejectedApps = applications.filter(a => a.status === 'rejected').length;
        return { totalVenues, totalApps, pendingApps, approvedApps, rejectedApps };
    }, [venues, applications]);

    // Donut chart percentages
    const donutData = useMemo(() => {
        const total = stats.totalApps || 1;
        return {
            approved: Math.round((stats.approvedApps / total) * 100),
            pending: Math.round((stats.pendingApps / total) * 100),
            rejected: Math.round((stats.rejectedApps / total) * 100),
        };
    }, [stats]);

    const handleVenueAction = (venueId, status) => {
        const isApprove = status === 'approved';
        setConfirmModal({
            title: isApprove ? t('dashboardPage.approveVenue') : t('dashboardPage.rejectVenue'),
            message: isApprove ? t('dashboardPage.approveVenueConfirm') : t('dashboardPage.rejectVenueConfirm'),
            type: isApprove ? 'success' : 'danger',
            confirmLabel: isApprove ? t('dashboardPage.approve') : t('dashboardPage.reject'),
            onConfirm: () => {
                setConfirmModal(null);
                fetch(`${API_BASE}/venues/manage_venue_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: venueId, status })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast(t('dashboardPage.processed'), 'success');
                            setPendingVenues(prev => prev.filter(v => v.id !== venueId));
                            fetchVenues();
                        } else {
                            showToast(data.message, 'error');
                        }
                    });
            }
        });
    };

    // Quick action items
    const quickActions = [
        { label: t('dashboardPage.qVenues'), icon: Store, path: '/admin/venues', color: '#4CAF50' },
        { label: t('dashboardPage.qUsers'), icon: Users, path: '/admin/users', color: '#2196F3' },
        { label: t('dashboardPage.qApps'), icon: ClipboardList, path: '/admin/applications', color: '#FF9800' },
        { label: t('dashboardPage.qAds'), icon: BarChart3, path: '/admin/ads', color: '#9C27B0' },
        { label: t('dashboardPage.qPromo'), icon: Bell, path: '/admin/promotions', color: '#E91E63' },
        { label: t('dashboardPage.qSecurity'), icon: Settings, path: '/admin/security', color: '#607D8B' },
    ];

    const timeStr = currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('dashboardPage.title')}</h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">{t('dashboardPage.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/venues')}
                        className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                        style={{ background: COLORS.primary }}
                    >
                        <Plus size={16} /> {t('dashboardPage.addVenue')}
                    </button>
                    <button
                        onClick={() => navigate('/admin/applications')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <FileText size={16} /> {t('dashboardPage.manageApps')}
                    </button>
                </div>
            </div>

            {/* ── KPI Summary Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Highlighted First Card */}
                <div className="p-5 rounded-2xl text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }}>
                    <div className="absolute top-3 right-0 opacity-10">
                        <Store size={80} className="translate-x-4 -translate-y-2" />
                    </div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <span className="text-indigo-100 text-xs font-bold">{t('dashboardPage.totalRegisteredVenues')}</span>
                        <div className="w-7 h-7 bg-white/25 rounded-lg flex items-center justify-center">
                            <ArrowUpRight size={14} />
                        </div>
                    </div>
                    <h2 className="text-4xl font-extrabold relative z-10">{stats.totalVenues}</h2>
                    <p className="text-indigo-200 text-xs mt-2 flex items-center gap-1">
                        <TrendingUp size={12} /> {t('dashboardPage.operating')}
                    </p>
                </div>

                {/* White Cards */}
                <StatCard label={t('dashboardPage.totalAppsLabel')} value={stats.totalApps} trend={t('dashboardPage.totalAppsAll')} icon={<ClipboardList size={14} />} />
                <StatCard label={t('dashboardPage.approvedComplete')} value={stats.approvedApps} trend={t('dashboardPage.matchComplete')} icon={<CheckCircle size={14} />} />
                <StatCard label={t('dashboardPage.pendingReview')} value={stats.pendingApps} trend={stats.pendingApps > 0 ? t('dashboardPage.needsProcessing') : t('dashboardPage.none')} icon={<AlertCircle size={14} />} alert={stats.pendingApps > 0} />
            </div>

            {/* ── Main Grid (Bento) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ─── Left: Weekly Analytics ─── */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-extrabold text-gray-900">{t('dashboardPage.weeklyAnalysis')}</h3>
                        <div className="flex gap-3 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.primary }}></span>{t('dashboardPage.visits')}</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.accentLight }}></span>{t('dashboardPage.apps')}</span>
                        </div>
                    </div>
                    <div className="h-44 flex items-end justify-between gap-3 px-1">
                        {[t('dashboardPage.sun'), t('dashboardPage.mon'), t('dashboardPage.tue'), t('dashboardPage.wed'), t('dashboardPage.thu'), t('dashboardPage.fri'), t('dashboardPage.sat')].map((day, i) => {
                            const h1 = [35, 55, 70, 45, 80, 60, 40][i];
                            const h2 = [20, 35, 50, 30, 55, 40, 25][i];
                            return (
                                <div key={day} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-gray-500 transition-opacity -mb-1">{h1}%</div>
                                    <div className="w-full max-w-[36px] flex gap-1 items-end h-full">
                                        <div
                                            style={{ height: `${h1}%`, background: COLORS.primary }}
                                            className="w-1/2 rounded-t-md transition-all duration-500 group-hover:opacity-80"
                                        ></div>
                                        <div
                                            style={{ height: `${h2}%`, background: COLORS.accentLight }}
                                            className="w-1/2 rounded-t-md transition-all duration-500 group-hover:opacity-80"
                                        ></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-700 transition-colors">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Right: Pending Review Summary ─── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-extrabold text-gray-900 mb-1">{t('dashboardPage.pendingVenues')}</h3>
                    <p className="text-xs text-gray-400 mb-4">{t('dashboardPage.pendingVenuesDesc')}</p>

                    {pendingVenues.length === 0 ? (
                        <div className="py-8 text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: COLORS.primaryBg }}>
                                <CheckCircle size={24} style={{ color: COLORS.accent }} />
                            </div>
                            <p className="text-sm font-bold text-gray-700">{t('dashboardPage.allProcessed')}</p>
                            <p className="text-xs text-gray-400 mt-1">{t('dashboardPage.noPendingReview')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingVenues.slice(0, 3).map(venue => (
                                <div key={venue.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {venue.images && venue.images[0] ? (
                                            <img src={venue.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Store size={16} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{venue.name}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{venue.location}</p>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleVenueAction(venue.id, 'approved')}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                                            style={{ background: COLORS.accent }}
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleVenueAction(venue.id, 'rejected')}
                                            className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {pendingVenues.length > 3 && (
                                <p className="text-xs text-center text-gray-400 pt-1">{t('dashboardPage.moreItems', { count: pendingVenues.length - 3 })}</p>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/admin/venues')}
                        className="w-full mt-4 py-2.5 text-sm font-bold rounded-xl transition-colors"
                        style={{ background: COLORS.primaryBg, color: COLORS.primary }}
                    >
                        {t('dashboardPage.viewAll')}
                    </button>
                </div>
            </div>

            {/* ── Second Row: Activity + Donut + Quick Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ─── Recent Activity ─── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-base font-extrabold text-gray-900">{t('dashboardPage.recentActivity')}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: COLORS.primaryBg, color: COLORS.primary }}>
                            {t('dashboardPage.countUnit', { count: applications.length })}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {applications.slice(-4).reverse().map((app, idx) => {
                            const created = app.created_at ? new Date(app.created_at) : null;
                            let timeLabel = '';
                            if (created) {
                                const diffMs = Date.now() - created.getTime();
                                const diffMin = Math.floor(diffMs / 60000);
                                const diffHr = Math.floor(diffMs / 3600000);
                                const diffDay = Math.floor(diffMs / 86400000);
                                if (diffMin < 1) timeLabel = t('dashboardPage.justNow');
                                else if (diffMin < 60) timeLabel = t('dashboardPage.minutesAgo', { count: diffMin });
                                else if (diffHr < 24) timeLabel = t('dashboardPage.hoursAgo', { count: diffHr });
                                else if (diffDay < 7) timeLabel = t('dashboardPage.daysAgo', { count: diffDay });
                                else timeLabel = created.toLocaleDateString();
                            }
                            const statusColors = {
                                pending: { bg: '#FFF8E1', text: '#F57F17', label: t('dashboardPage.statusPending') },
                                approved: { bg: COLORS.primaryBg, text: COLORS.primary, label: t('dashboardPage.statusApproved') },
                                rejected: { bg: '#FFEBEE', text: '#C62828', label: t('dashboardPage.statusRejected') },
                            };
                            const s = statusColors[app.status] || statusColors.pending;
                            return (
                                <div key={app.id || idx} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                        style={{ background: s.text }}>
                                        {(app.applicant_name || app.sellerName || app.user_name || '?')[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {app.applicant_name || app.sellerName || app.user_name || t('dashboardPage.applicant')}
                                        </p>
                                        <p className="text-[11px] text-gray-400 truncate">{app.venue_name || app.venueName || t('dashboardPage.venue')}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                                        <span className="text-[10px] text-gray-300">{timeLabel}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {applications.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">{t('dashboardPage.noRecentActivity')}</p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/admin/applications')}
                        className="w-full mt-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        {t('dashboardPage.viewAllHistory')}
                    </button>
                </div>

                {/* ─── Application Progress Donut ─── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-extrabold text-gray-900 mb-5">{t('dashboardPage.appStatus')}</h3>
                    <div className="flex justify-center mb-5">
                        <div className="relative w-36 h-36">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                {/* Background circle */}
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                {/* Approved (green) */}
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke={COLORS.accent} strokeWidth="3"
                                    strokeDasharray={`${donutData.approved} ${100 - donutData.approved}`}
                                    strokeDashoffset="0"
                                    className="transition-all duration-1000"
                                />
                                {/* Pending (yellow) */}
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFC107" strokeWidth="3"
                                    strokeDasharray={`${donutData.pending} ${100 - donutData.pending}`}
                                    strokeDashoffset={`${-(donutData.approved)}`}
                                    className="transition-all duration-1000"
                                />
                                {/* Rejected (red) */}
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EF5350" strokeWidth="3"
                                    strokeDasharray={`${donutData.rejected} ${100 - donutData.rejected}`}
                                    strokeDashoffset={`${-(donutData.approved + donutData.pending)}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-extrabold text-gray-900">{donutData.approved}%</span>
                                <span className="text-[10px] text-gray-400 font-bold">{t('dashboardPage.approvalRate')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-5 text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.accent }}></span>{t('dashboardPage.approved')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>{t('dashboardPage.reviewing')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>{t('dashboardPage.rejected')}
                        </span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                        <div className="py-2 rounded-xl" style={{ background: COLORS.primaryBg }}>
                            <p className="text-lg font-extrabold" style={{ color: COLORS.primary }}>{stats.approvedApps}</p>
                            <p className="text-[10px] text-gray-500">{t('dashboardPage.approved')}</p>
                        </div>
                        <div className="py-2 rounded-xl bg-yellow-50">
                            <p className="text-lg font-extrabold text-yellow-700">{stats.pendingApps}</p>
                            <p className="text-[10px] text-gray-500">{t('dashboardPage.reviewing')}</p>
                        </div>
                        <div className="py-2 rounded-xl bg-red-50">
                            <p className="text-lg font-extrabold text-red-600">{stats.rejectedApps}</p>
                            <p className="text-[10px] text-gray-500">{t('dashboardPage.rejected')}</p>
                        </div>
                    </div>
                </div>

                {/* ─── Quick Actions + Clock + Live Users ─── */}
                <div className="space-y-5">
                    {/* Real-time Clock */}
                    <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }}>
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border-4 border-white/10"></div>
                        <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full border-4 border-white/10"></div>
                        <p className="text-indigo-200 text-xs font-bold mb-1 relative z-10">{dateStr}</p>
                        <p className="text-3xl font-extrabold tracking-wider relative z-10 font-mono">{timeStr}</p>
                        <div className="flex items-center gap-2 mt-3 relative z-10">
                            <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse"></span>
                            <span className="text-indigo-200 text-xs font-bold">{t('dashboardPage.systemOnline')}</span>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-base font-extrabold text-gray-900 mb-4">{t('dashboardPage.quickNav')}</h3>
                        <div className="grid grid-cols-3 gap-2.5">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => navigate(action.path)}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 group"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                        style={{ background: action.color + '15', color: action.color }}>
                                        <action.icon size={18} />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Superadmin: Live User Activity Panel ── */}
            {isSuperAdmin && activeUsersData && (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-white to-emerald-50/30 dark:from-gray-800 dark:via-gray-800/95 dark:to-emerald-900/10 shadow-sm overflow-hidden">
                    {/* Compact Header */}
                    <div className="px-5 pt-5 pb-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Wifi className="text-white" size={17} />
                            </div>
                            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex-1">{t('dashboardPage.userStatus')}</h3>
                            <span className="text-[10px] text-gray-300 dark:text-gray-500 font-medium">30s</span>
                        </div>

                        {/* Stat pills row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700/60">
                                <Users size={12} className="text-gray-500 dark:text-gray-400" />
                                <span className="text-xs font-extrabold text-gray-900 dark:text-white">{activeUsersData.total_users}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('dashboardPage.total')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 ring-1 ring-emerald-200 dark:ring-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{activeUsersData.online_count}</span>
                                <span className="text-[10px] text-emerald-500 dark:text-emerald-500 font-medium">{t('dashboardPage.online')}</span>
                            </div>
                            {Object.entries(activeUsersData.role_counts || {}).map(([role, cnt]) => (
                                <span key={role} className="px-2 py-1 rounded-lg text-[10px] font-bold dark:opacity-90" style={{ background: roleColor(role) + '18', color: roleColor(role) }}>
                                    {roleLabel(role)} {cnt}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Online Users — compact list */}
                    {activeUsersData.online_users?.length > 0 && (
                        <div className="px-5 pb-4">
                            <div className="space-y-1.5">
                                {activeUsersData.online_users.map(u => (
                                    <div key={u.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15 hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-colors">
                                        <div className="relative flex-shrink-0">
                                            {u.profile_image ? (
                                                <img src={u.profile_image} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-300 dark:ring-emerald-500/50" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-emerald-300 dark:ring-emerald-500/50" style={{ background: roleColor(u.role) }}>
                                                    {(u.name || '?')[0]}
                                                </div>
                                            )}
                                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-gray-800"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{u.name}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{u.email}</p>
                                        </div>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: roleColor(u.role) + '18', color: roleColor(u.role) }}>
                                            {roleLabel(u.role)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recently Active — separator + compact list */}
                    {activeUsersData.recent_users?.length > 0 && (
                        <div className="px-5 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/60"></div>
                                <span className="text-[10px] text-gray-300 dark:text-gray-500 font-bold flex items-center gap-1">
                                    <Clock size={10} /> {t('dashboardPage.recent24h', { count: activeUsersData.recent_count })}
                                </span>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/60"></div>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {activeUsersData.recent_users.map(u => (
                                    <div key={u.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <div className="relative flex-shrink-0">
                                            {u.profile_image ? (
                                                <img src={u.profile_image} alt="" className="w-6 h-6 rounded-full object-cover opacity-60" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold opacity-60" style={{ background: roleColor(u.role) }}>
                                                    {(u.name || '?')[0]}
                                                </div>
                                            )}
                                            <span className="absolute -bottom-px -right-px w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full border border-white dark:border-gray-800"></span>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate flex-1">{u.name}</span>
                                        <span className="text-[9px] text-gray-300 dark:text-gray-600 flex-shrink-0">{formatActiveTime(u.last_active_at)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeUsersData.online_count === 0 && activeUsersData.recent_count === 0 && (
                        <div className="px-5 pb-5 text-center">
                            <Users className="mx-auto text-gray-200 dark:text-gray-600 mb-1" size={28} />
                            <p className="text-xs text-gray-300 dark:text-gray-600 font-medium">{t('dashboardPage.noActiveUsers')}</p>
                        </div>
                    )}
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

// ── Stat Card Component ──
const StatCard = ({ label, value, trend, icon, alert }) => (
    <div className={`bg-white p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${alert ? 'border-orange-200 ring-2 ring-orange-50' : 'border-gray-100'}`}>
        <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-gray-400">{label}</span>
            <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">{value}</h2>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">{icon} {trend}</p>
    </div>
);

export default AdminDashboard;
