import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, BarChart3, Clock, CheckCircle, XCircle, Users, TrendingUp, Eye, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('vendor');
    const [venues, setVenues] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyVenues = () => {
        fetch(`${API_BASE}/venues/get_my_venues.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setVenues(data); })
            .catch(err => console.error(err));
    };

    const fetchApplications = () => {
        fetch(`${API_BASE}/applications/get_applications.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setApplications(data); })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE}/venues/get_my_venues.php`, { credentials: 'include' }).then(r => r.json()),
            fetch(`${API_BASE}/applications/get_applications.php`, { credentials: 'include' }).then(r => r.json()),
        ]).then(([venuesData, appsData]) => {
            if (Array.isArray(venuesData)) setVenues(venuesData);
            if (Array.isArray(appsData)) setApplications(appsData);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Stats
    const totalVenues = venues.length;
    const activeVenues = venues.filter(v => v.status === 'approved').length;
    const pendingVenues = venues.filter(v => v.status === 'pending').length;
    const rejectedVenues = venues.filter(v => v.status === 'rejected').length;
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    const approvedApps = applications.filter(a => a.status === 'approved').length;
    const rejectedApps = applications.filter(a => a.status === 'rejected').length;
    const totalApps = applications.length;
    const approvalRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0;

    // Per-venue stats
    const venueStats = venues.map(v => {
        const venueApps = applications.filter(a => String(a.venue_id) === String(v.id));
        return {
            id: v.id,
            name: v.name,
            status: v.status,
            location: v.location,
            total: venueApps.length,
            approved: venueApps.filter(a => a.status === 'approved').length,
            pending: venueApps.filter(a => a.status === 'pending').length,
            rejected: venueApps.filter(a => a.status === 'rejected').length,
            maxSellers: parseInt(v.max_sellers) || 0,
            deadline: v.recruitment_deadline,
            image: v.images?.[0] || null,
        };
    });

    // Recent applications (last 5)
    const recentApps = [...applications]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const getPricingUnitLabel = (unit) => {
        switch (unit) { case 'weekly': return t('pricingUnit.weekly', { ns: 'seller' }); case 'monthly': return t('pricingUnit.monthly', { ns: 'seller' }); default: return t('pricingUnit.daily', { ns: 'seller' }); }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
                        {t('heroGreeting', { name: user.name })}
                    </h1>
                    <p className="text-indigo-200 font-medium text-lg">
                        {t('heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Main KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Store size={20} className="text-indigo-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('allSpaces')}</span>
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">{totalVenues}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                        <span className="text-emerald-600">{t('operating')} {activeVenues}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-amber-500">{t('reviewing')} {pendingVenues}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('applicationRequests')}</span>
                    </div>
                    <p className="text-3xl font-extrabold text-amber-600">{pendingApps}</p>
                    <button
                        onClick={() => navigate('/vendor/applications')}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                        {t('goTo')} <ChevronRight size={14} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('applicationStatus')}</span>
                    </div>
                    <p className="text-3xl font-extrabold text-emerald-600">{approvedApps}</p>
                    <p className="mt-2 text-xs font-medium text-gray-400">{t('totalApplied', { count: totalApps })}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('approvalRateLabel')}</span>
                    </div>
                    <p className="text-3xl font-extrabold text-blue-600">{approvalRate}%</p>
                    <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700"
                            style={{ width: `${approvalRate}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Per-Venue Breakdown (3/5) */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-600" />
                            {t('venueBreakdown')}
                        </h3>
                        <button
                            onClick={() => navigate('/vendor/venues')}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            {t('manageVenues')} <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {venueStats.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Store size={40} className="mx-auto mb-3 opacity-40" />
                                <p className="font-medium">{t('noVenuesYet')}</p>
                                <button
                                    onClick={() => navigate('/vendor/venues')}
                                    className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                >
                                    {t('registerNewVenue')} </button>
                            </div>
                        ) : (
                            venueStats.map((vs) => {
                                const occupancy = vs.maxSellers > 0
                                    ? Math.min(100, Math.round((vs.approved / vs.maxSellers) * 100))
                                    : null;
                                const isFull = vs.maxSellers > 0 && vs.approved >= vs.maxSellers;

                                return (
                                    <div key={vs.id} className="p-4 md:p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* Venue Image */}
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                {vs.image ? (
                                                    <img src={vs.image} alt={vs.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Store size={20} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900 truncate">{vs.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${vs.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                                        vs.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                            'bg-red-100 text-red-600'
                                                        }`}>
                                                        {vs.status === 'approved' ? t('statusActive') : vs.status === 'pending' ? t('statusPending') : t('statusRejected')}
                                                    </span>
                                                </div>

                                                {/* Occupancy Bar */}
                                                {vs.maxSellers > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-400' : occupancy >= 80 ? 'bg-orange-400' : 'bg-emerald-400'
                                                                    }`}
                                                                style={{ width: `${occupancy}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-bold flex-shrink-0 ${isFull ? 'text-red-500' : 'text-gray-500'}`}>
                                                            {vs.approved}/{vs.maxSellers} {isFull && <span className="ml-1 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-500">{t('closed')}</span>}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400">{t('tenants')} {vs.approved} · {t('applied')} {vs.total}</p>
                                                )}
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="hidden md:flex gap-1.5 flex-shrink-0">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                                                    <CheckCircle size={11} /> {vs.approved}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg">
                                                    <Clock size={11} /> {vs.pending}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg">
                                                    <XCircle size={11} /> {vs.rejected}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Deadline */}
                                        {vs.deadline && (() => {
                                            const diff = Math.ceil((new Date(vs.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                                            return (
                                                <div className="mt-2 ml-[72px]">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff < 0 ? 'bg-gray-100 text-gray-400' :
                                                        diff <= 3 ? 'bg-red-100 text-red-500' :
                                                            diff <= 7 ? 'bg-orange-100 text-orange-500' :
                                                                'bg-blue-100 text-blue-500'
                                                        }`}>
                                                        {diff < 0 ? t('closed') : diff === 0 ? 'D-DAY' : `D-${diff}`} {t('recruitment')}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Recent Applications (2/5) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-600" />
                            {t('recentApplications')}
                        </h3>
                        <button
                            onClick={() => navigate('/vendor/applications')}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            {t('viewAll')} <ChevronRight size={14} />
                        </button>
                    </div>

                    {recentApps.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Users size={32} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm font-medium">{t('noRecentApps')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentApps.map(app => {
                                const now = new Date();
                                const created = new Date(app.created_at);
                                const diffMs = now - created;
                                const diffMin = Math.floor(diffMs / 60000);
                                const diffHr = Math.floor(diffMin / 60);
                                const diffDay = Math.floor(diffHr / 24);
                                let timeLabel = t('justNow');
                                if (diffDay > 0) timeLabel = t('daysAgo', { count: diffDay });
                                else if (diffHr > 0) timeLabel = t('hoursAgo', { count: diffHr });
                                else if (diffMin > 0) timeLabel = t('minutesAgo', { count: diffMin });

                                return (
                                    <div key={app.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${app.status === 'pending' ? 'bg-amber-400' :
                                                    app.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'
                                                    }`} />
                                                <span className="font-bold text-gray-800 text-sm truncate">
                                                    {app.applicant_name || t('applicant')}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{timeLabel}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-4">
                                            <span className="font-medium text-gray-600">{app.venue_name}</span>{t('appliedTo')}
                                        </p>
                                        {app.applicant_category && (
                                            <span className="ml-4 mt-1 inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase">
                                                {app.applicant_category}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Application Status Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                    <Eye size={18} className="text-gray-400" />
                    {t('applicationSummary')}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <Clock size={24} className="mx-auto mb-2 text-amber-500" />
                        <p className="text-2xl font-extrabold text-amber-600">{pendingApps}</p>
                        <p className="text-xs font-bold text-amber-400 mt-1">{t('waiting')}</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
                        <p className="text-2xl font-extrabold text-emerald-600">{approvedApps}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">{t('approved')}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-100">
                        <XCircle size={24} className="mx-auto mb-2 text-red-400" />
                        <p className="text-2xl font-extrabold text-red-500">{rejectedApps}</p>
                        <p className="text-xs font-bold text-red-400 mt-1">{t('rejected')}</p>
                    </div>
                </div>

                {/* Approval Rate Bar */}
                <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700">{t('overallRate')}</span>
                        <span className="text-sm font-extrabold text-indigo-600">{approvalRate}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                            style={{ width: `${approvalRate}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>{t('approved')} {approvedApps} · {t('waiting')} {pendingApps} · {t('rejected')} {rejectedApps}</span>
                        <span>{t('total')} {totalApps}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
