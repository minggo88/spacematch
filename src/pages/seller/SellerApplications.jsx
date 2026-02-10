import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Store, MapPin, Sparkles, XCircle, AlertTriangle, Send, Clock, CheckCircle, X } from 'lucide-react';

const API_BASE = '/api';

const SellerApplications = () => {
    const { applications, fetchApplications } = useData();

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
        if (!confirm(`"${venueName}" 입점 신청을 취소하시겠습니까?\n취소 후 되돌릴 수 없습니다.`)) return;
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
                alert('신청이 취소되었습니다.');
                fetchApplications();
            } else {
                alert(data.message || '취소에 실패했습니다.');
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        } finally {
            setCancelling(null);
        }
    };

    // Submit cancellation request (approved only)
    const handleCancelRequest = async () => {
        if (!cancelReason.trim()) {
            alert('취소 사유를 반드시 작성해주세요.');
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
                alert(data.message || '취소 신청에 실패했습니다.');
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        } finally {
            setSubmittingRequest(false);
        }
    };

    const filteredApplications = useMemo(() => {
        if (activeTab === 'all') return myApplications;
        return myApplications.filter(app => app.status === activeTab);
    }, [myApplications, activeTab]);

    const tabs = [
        { id: 'all', label: '전체' },
        { id: 'pending', label: '심사중' },
        { id: 'approved', label: '승인' },
        { id: 'rejected', label: '거절' }
    ];

    // Helper: get cancel request info for an application
    const getCancelInfo = (appId) => cancelRequestStatus[appId] || null;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
                        내 신청 현황
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        입점 신청한 베뉴의 진행 현황을 확인하세요.
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
                            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row">
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
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{app.venue_name}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <MapPin size={14} /> {app.venue_location || "위치 정보 없음"}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                                                ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        app.status === 'cancelled' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                            'bg-red-50 text-red-700 border-red-200'}`}>
                                                <div className={`w-2 h-2 rounded-full ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'approved' ? 'bg-emerald-500' : app.status === 'cancelled' ? 'bg-gray-400' : 'bg-red-500'}`}></div>
                                                {app.status === 'pending' ? '대기 중' : app.status === 'approved' ? '승인' : app.status === 'cancelled' ? '취소' : '거절'}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 text-sm">
                                            <div className="px-3 py-1 bg-gray-50 rounded-lg text-gray-600 font-medium">
                                                ₩{app.venue_price ? parseInt(app.venue_price).toLocaleString() : '0'} /일</div>
                                            <div className="text-gray-400 text-xs">
                                                신청일: {new Date(app.created_at || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Cancel Request Status Banner */}
                                        {cancelInfo && (
                                            <div className={`mt-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2
                                                ${cancelInfo.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    cancelInfo.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                        'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {cancelInfo.status === 'pending' && <><Clock size={13} /> {"\ucde8\uc18c \uc2e0\uccad \uc911 \u2014 \ubca4\ub354 \ud655\uc778\uc744 \uae30\ub2e4\ub9ac\uace0 \uc788\uc2b5\ub2c8\ub2e4"}</>}
                                                {cancelInfo.status === 'approved' && <><CheckCircle size={13} /> {"\ucde8\uc18c \uc2e0\uccad\uc774 \uc2b9\uc778\ub418\uc5c8\uc2b5\ub2c8\ub2e4"}</>}
                                                {cancelInfo.status === 'rejected' && <><X size={13} /> {"\ucde8\uc18c \uc2e0\uccad\uc774 \uac70\uc808\ub418\uc5c8\uc2b5\ub2c8\ub2e4"}{cancelInfo.decision_note ? ` \u2014 ${cancelInfo.decision_note}` : ''}</>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Progress Bar */}
                                    <div className="mt-5">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                                            <div className={`h-full ${app.status === 'rejected' || app.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-indigo-500'} ${app.status === 'pending' ? 'w-1/3' : 'w-full'} transition-all duration-1000`}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                                            <span className="text-indigo-600">신청 완료</span>
                                            <span className={app.status !== 'pending' ? (app.status === 'rejected' || app.status === 'cancelled' ? 'text-red-500' : 'text-indigo-600') : ''}>
                                                {app.status === 'pending' ? '심사 중' : (app.status === 'approved' ? '승인 완료' : app.status === 'cancelled' ? '취소' : '거절')}
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
                                                취소 신청
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
                                                {cancelling === app.id ? '취소 중..' : '신청 취소'}
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
                                ? '아직 입점 신청한 베뉴가 없습니다.'
                                : `${tabs.find(t => t.id === activeTab)?.label} 상태의 신청이 없습니다.`}
                        </h4>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'all' ? '\ub9c8\uc74c\uc5d0 \ub4dc\ub294 \ubca0\ub274\ub97c \ucc3e\uc544 \uc785\uc810\uc744 \uc81c\uc548\ud574\ubcf4\uc138\uc694!' : '\ub2e4\ub978 \ud0ed\uc744 \ud655\uc778\ud574\ubcf4\uc138\uc694.'}
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
                                    <h3 className="text-lg font-bold text-gray-900">취소 신청</h3>
                                    <p className="text-sm text-gray-500">{cancelRequestModal.venue_name}</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
                                <p className="font-bold mb-1">?️ \uC2B9\uC778\uB41C \uC2E0\uCCAD\uC740 \uC9C1\uC811 \uCDE8\uC18C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
                                <p>취소 사유를 작성하면 벤더에게 전달되며, 벤더 확인 후 취소가 처리됩니다.</p>
                            </div>

                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                취소 사유 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder="취소 사유를 자세히 작성해주세요. (필수)"
                                rows={4}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 resize-none"
                            />

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => setCancelRequestModal(null)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handleCancelRequest}
                                    disabled={submittingRequest || !cancelReason.trim()}
                                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send size={14} />
                                    {submittingRequest ? '발송 중...' : '취소 신청 발송'}
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
