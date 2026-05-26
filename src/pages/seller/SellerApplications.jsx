import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { Store, MapPin, Sparkles, XCircle, AlertTriangle, Send, Clock, CheckCircle, X, Zap } from 'lucide-react';
import { useDemoGuard } from '../../hooks/useDemoGuard';

const API_BASE = '/api';

const SellerApplications = () => {
    const { applications, fetchApplications } = useData();
    const { t } = useTranslation('seller');
    const { isDemoUser, demoAlert } = useDemoGuard();

    React.useEffect(() => {
        fetchApplications();
    }, []);

    const myApplications = applications;

    const [activeTab, setActiveTab] = useState('all');
    const [cancelling, setCancelling] = useState(null);
    // Cancellation request modal state
    const [cancelRequestModal, setCancelRequestModal] = useState(null); // app object
    const [cancelReason, setCancelReason] = useState('');
    const [submittingRequest, setSubmittingRequest] = useState(false);
    // Track which apps have pending cancel requests
    const [cancelRequestStatus, setCancelRequestStatus] = useState({});

    // Fetch cancellation request statuses on mount
    React.useEffect(() => {
        fetchCancelStatuses();
    }, []);

    const fetchCancelStatuses = async () => {
        try {
            const res = await fetch(`${API_BASE}/applications/get_cancellation_requests.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && Array.isArray(data.requests)) {
                const statusMap = {};
                data.requests.forEach(req => {
                    // Store the latest request per application_id
                    if (!statusMap[req.application_id] || req.id > statusMap[req.application_id].id) {
                        statusMap[req.application_id] = req;
                    }
                });
                setCancelRequestStatus(statusMap);
            }
        } catch (err) {
            console.error('취소 신청 현황 로드 실패:', err);
        }
    };

    // Direct cancel (pending/rejected only)
    const handleCancel = async (appId, venueName) => {
        if (isDemoUser) { demoAlert('신청 취소'); return; }
        if (!confirm(t('appPage.confirmCancel', { venue: venueName }))) return;
        setCancelling(appId);
        try {
            const res = await fetch(`${API_BASE}/applications/cancel_application.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: appId })
            });
            const data = await res.json();
            if (data.success) {
                alert(t('appPage.cancelSuccess'));
                fetchApplications();
            } else {
                alert(data.message || t('appPage.cancelFailed'));
            }
        } catch (err) {
            alert(t('common:error'));
        } finally {
            setCancelling(null);
        }
    };

    // Submit cancellation request (approved only)
    const handleCancelRequest = async () => {
        if (isDemoUser) { demoAlert('취소 요청'); return; }
        if (!cancelReason.trim()) {
            alert(t('appPage.cancelReasonRequired'));
            return;
        }
        setSubmittingRequest(true);
        try {
            const res = await fetch(`${API_BASE}/applications/request_cancellation.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    application_id: cancelRequestModal.id,
                    reason: cancelReason.trim()
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setCancelRequestModal(null);
                setCancelReason('');
                fetchCancelStatuses();
            } else {
                alert(data.message || t('appPage.cancelRequestFailed'));
            }
        } catch (err) {
            alert(t('common:error'));
        } finally {
            setSubmittingRequest(false);
        }
    };

    const filteredApplications = useMemo(() => {
        if (activeTab === 'all') return myApplications;
        return myApplications.filter(app => app.status === activeTab);
    }, [myApplications, activeTab]);

    const tabs = [
        { id: 'all', label: t('appPage.tabAll') },
        { id: 'pending', label: t('appPage.tabPending') },
        { id: 'approved', label: t('appPage.tabApproved') },
        { id: 'rejected', label: t('appPage.tabRejected') }
    ];

    // Helper: get cancel request info for an application
    const getCancelInfo = (appId) => cancelRequestStatus[appId] || null;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
                        {t('appPage.title')}
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {t('appPage.subtitle')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100/80 rounded-xl overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                            <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-200/50'}`}>
                                {tab.id === 'all' ? myApplications.length
                                    : myApplications.filter(a => a.status === tab.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Application List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApplications.length > 0 ? (
                    filteredApplications.map(app => {
                        const cancelInfo = getCancelInfo(app.id);
                        return (
                            <div key={app.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row ${app.is_priority == 1 ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-100'}`}>
                                {/* Image Section */}
                                <div className="sm:w-40 h-40 sm:h-auto bg-gray-100 relative shrink-0">
                                    {app.venue_images && app.venue_images.length > 0 ? (
                                        <img
                                            src={app.venue_images[0]}
                                            alt={app.venue_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Store size={32} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 md:p-6 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{app.venue_name}</h4>
                                                    {app.is_priority == 1 && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold rounded-md flex-shrink-0">
                                                            <Zap size={9} fill="white" />패스트트랙
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <MapPin size={14} /> {app.venue_location || t('appPage.noLocation')}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center shrink-0 self-start whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold border
                                                ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        app.status === 'cancelled' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                            'bg-red-50 text-red-700 border-red-200'}`}>
                                                {app.status === 'pending' ? t('appPage.statusPending') : app.status === 'approved' ? t('appPage.statusApproved') : app.status === 'cancelled' ? t('appPage.statusCancelled') : t('appPage.statusRejected')}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 text-sm">
                                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600 font-medium">
                                                ₩{app.venue_price ? parseInt(app.venue_price).toLocaleString() : '0'} /일</div>
                                            <div className="text-gray-400 text-xs">
                                                {t('appPage.appliedDate')}: {new Date(app.created_at || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Cancel Request Status Banner */}
                                        {cancelInfo && (
                                            <div className={`mt-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2
                                                ${cancelInfo.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    cancelInfo.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                        'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {cancelInfo.status === 'pending' && <><Clock size={13} /> {t('appPage.cancelPending')}</>}
                                                {cancelInfo.status === 'approved' && <><CheckCircle size={13} /> {t('appPage.cancelApproved')}</>}
                                                {cancelInfo.status === 'rejected' && <><X size={13} /> {t('appPage.cancelRejected')}{cancelInfo.decision_note ? ` — ${cancelInfo.decision_note}` : ''}</>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Progress Bar */}
                                    <div className="mt-5">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                                            <div className={`h-full ${app.status === 'rejected' || app.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-indigo-500'} ${app.status === 'pending' ? 'w-1/3' : 'w-full'} transition-all duration-1000`}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                                            <span className="text-indigo-600">{t('appPage.applicationDone')}</span>
                                            <span className={app.status !== 'pending' ? (app.status === 'rejected' || app.status === 'cancelled' ? 'text-red-500' : 'text-indigo-600') : ''}>
                                                {app.status === 'pending' ? t('appPage.reviewing') : (app.status === 'approved' ? t('appPage.approvedDone') : app.status === 'cancelled' ? t('appPage.statusCancelled') : t('appPage.statusRejected'))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex justify-end gap-2">
                                        {/* Show cancel request button for approved apps WITHOUT a pending request */}
                                        {app.status === 'approved' && (!cancelInfo || cancelInfo.status === 'rejected') && (
                                            <button
                                                onClick={() => { setCancelRequestModal(app); setCancelReason(''); }}
                                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-xl transition-all"
                                            >
                                                <AlertTriangle size={16} />
                                                {t('appPage.cancelRequest')}
                                            </button>
                                        )}
                                        {/* Show direct cancel for pending only */}
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(app.id, app.venue_name)}
                                                disabled={cancelling === app.id}
                                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                                            >
                                                <XCircle size={16} />
                                                {cancelling === app.id ? t('appPage.cancelling') : t('appPage.cancelApplication')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="text-gray-900 font-bold mb-1">
                            {activeTab === 'all'
                                ? t('appPage.noAppsAll')
                                : t('appPage.noAppsFiltered', { tab: tabs.find(tb => tb.id === activeTab)?.label })}
                        </h4>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'all' ? t('appPage.noAppsHint') : t('appPage.noAppsOther')}
                        </p>
                    </div>
                )}
            </div>

            {/* Cancellation Request Modal */}
            {
                cancelRequestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setCancelRequestModal(null)}>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setCancelRequestModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{t('appPage.cancelModalTitle')}</h3>
                                    <p className="text-sm text-gray-500">{cancelRequestModal.venue_name}</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
                                <p className="font-bold mb-1">⚠️ {t('appPage.cancelNotice')}</p>
                                <p>{t('appPage.cancelNoticeDesc')}</p>
                            </div>

                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {t('appPage.cancelReasonLabel')} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder={t('appPage.cancelReasonPlaceholder')}
                                rows={4}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 resize-none"
                            />

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => setCancelRequestModal(null)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    {t('appPage.closeBtn')}
                                </button>
                                <button
                                    onClick={handleCancelRequest}
                                    disabled={submittingRequest || !cancelReason.trim()}
                                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send size={14} />
                                    {submittingRequest ? t('appPage.sending') : t('appPage.sendCancelRequest')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SellerApplications;
