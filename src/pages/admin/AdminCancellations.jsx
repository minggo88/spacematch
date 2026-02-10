import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, CheckCircle, XCircle, Clock, Search, User, MapPin, Store, ChevronDown, ChevronUp, MessageSquare, Shield, ArrowRight, FileText, X } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminCancellations = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [decisionNote, setDecisionNote] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/applications/get_cancellation_requests.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setRequests(data.requests || []);
        } catch (err) {
            console.error('취소 신청 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        const actionLabel = action === 'approved' ? '승인' : '거절';
        setConfirmModal({
            title: `취소 신청 ${actionLabel}`,
            message: `이 취소 신청을 ${actionLabel}하시겠습니까?`,
            type: action === 'approved' ? 'success' : 'danger',
            confirmLabel: actionLabel,
            onConfirm: async () => {
                setConfirmModal(null);
                setProcessing(requestId);
                try {
                    const res = await fetch(`${API_BASE}/applications/handle_cancellation.php`, {
                        method: 'POST', credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ request_id: requestId, action, decision_note: decisionNote })
                    });
                    const data = await res.json();
                    if (data.success) { showToast(data.message, 'success'); setDecisionNote(''); setExpandedId(null); fetchRequests(); }
                    else { showToast(data.message || '처리에 실패했습니다.', 'error'); }
                } catch { showToast('오류가 발생했습니다.', 'error'); }
                finally { setProcessing(null); }
            }
        });
    };

    const stats = useMemo(() => ({
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    }), [requests]);

    const filteredRequests = useMemo(() => {
        let filtered = requests;
        if (activeTab !== 'all') filtered = filtered.filter(r => r.status === activeTab);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r =>
                (r.seller_name || '').toLowerCase().includes(term) ||
                (r.venue_title || '').toLowerCase().includes(term) ||
                (r.reason || '').toLowerCase().includes(term)
            );
        }
        return filtered;
    }, [requests, activeTab, searchTerm]);

    const formatDate = (str) => {
        if (!str) return '-';
        return new Date(str).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const relativeTime = (str) => {
        if (!str) return '';
        const diff = Math.floor((new Date() - new Date(str)) / 1000);
        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
        return formatDate(str);
    };

    const isVendor = user?.role === 'vendor';

    const tabConfig = [
        { id: 'pending', label: '대기중', count: stats.pending, icon: <Clock size={14} />, activeColor: 'bg-amber-500 text-white', dotColor: 'bg-amber-500' },
        { id: 'approved', label: '승인됨', count: stats.approved, icon: <CheckCircle size={14} />, activeColor: 'bg-emerald-500 text-white', dotColor: 'bg-emerald-500' },
        { id: 'rejected', label: '거절됨', count: stats.rejected, icon: <XCircle size={14} />, activeColor: 'bg-red-500 text-white', dotColor: 'bg-red-500' },
        { id: 'all', label: '전체', count: stats.total, icon: <FileText size={14} />, activeColor: 'bg-gray-800 text-white', dotColor: 'bg-gray-500' },
    ];

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start gap-4 mb-1">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200/40 flex-shrink-0">
                        {isVendor ? <Shield size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div>
                        <p className="text-amber-600 font-bold text-xs tracking-widest uppercase mb-0.5">Cancellation Requests</p>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            취소 신청 {isVendor ? '' : '모니터링'}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            {isVendor ? '나의 입점 취소 신청을 확인하고 처리하세요.' : '전체 취소 신청 현황을 모니터링합니다.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { label: '전체', value: stats.total, icon: <MessageSquare size={16} />, gradient: 'from-slate-600 to-slate-800', light: 'bg-slate-50 border-slate-100' },
                    { label: '대기중', value: stats.pending, icon: <Clock size={16} />, gradient: 'from-amber-500 to-orange-500', light: 'bg-amber-50 border-amber-100', pulse: stats.pending > 0 },
                    { label: '승인됨', value: stats.approved, icon: <CheckCircle size={16} />, gradient: 'from-emerald-500 to-green-600', light: 'bg-emerald-50 border-emerald-100' },
                    { label: '거절됨', value: stats.rejected, icon: <XCircle size={16} />, gradient: 'from-red-500 to-rose-600', light: 'bg-red-50 border-red-100' },
                ].map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden ${stat.light} border rounded-2xl p-4 group hover:shadow-md transition-all`}>
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                                    {stat.pulse && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>}
                                </div>
                            </div>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} text-white flex items-center justify-center opacity-80`}>{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text" placeholder="\uc774\ub984, \uacf5\uac04\uba85, \uc0ac\uc720 \uac80\uc0c9.."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all"
                    />
                </div>
                <div className="flex gap-1.5 p-1 bg-gray-100/80 rounded-xl overflow-x-auto">
                    {tabConfig.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                                ${activeTab === tab.id ? tab.activeColor + ' shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
                        >
                            {tab.icon} {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/25' : 'bg-gray-200/60'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Request List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-amber-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-400 font-medium">신청 목록을 불러오는 중...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">취소 요청이 없습니다</h3>
                    <p className="text-gray-500 text-sm">
                        {activeTab !== 'all' ? '다른 상태를 확인해보세요.' : '아직 접수된 취소 요청이 없습니다.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRequests.map(req => {
                        const isExpanded = expandedId === req.id;
                        const isPending = req.status === 'pending';

                        return (
                            <div key={req.id}
                                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300
                                    ${isPending ? 'border-amber-200/80 shadow-sm hover:shadow-md' : 'border-gray-100 hover:border-gray-200'}
                                    ${isExpanded ? 'shadow-lg ring-1 ring-gray-100' : ''}`}
                            >
                                {/* Main Row */}
                                <div
                                    className="p-4 md:p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
                                    onClick={() => { setExpandedId(isExpanded ? null : req.id); setDecisionNote(''); }}
                                >
                                    {/* Status Indicator */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                            ${isPending ? 'bg-amber-100 text-amber-600' :
                                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-red-100 text-red-500'}`}
                                        >
                                            {isPending && <Clock size={18} />}
                                            {req.status === 'approved' && <CheckCircle size={18} />}
                                            {req.status === 'rejected' && <XCircle size={18} />}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                            <span className="text-sm font-bold text-gray-900">{req.seller_name || ''}</span>
                                            <ArrowRight size={12} className="text-gray-300" />
                                            <span className="text-sm font-medium text-gray-600 truncate">{req.venue_title || req.venue_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded
                                                ${isPending ? 'bg-amber-50 text-amber-600' :
                                                    req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-red-50 text-red-500'}`}
                                            >
                                                {isPending ? '대기' : req.status === 'approved' ? '승인' : '거절'}
                                            </span>
                                            <span className="text-[11px] text-gray-400">{relativeTime(req.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Reason Preview (desktop) */}
                                    <p className="hidden lg:block text-xs text-gray-400 truncate max-w-[180px] flex-shrink-0 italic">
                                        "{(req.reason || '').substring(0, 40)}{(req.reason || '').length > 40 ? '...' : ''}"
                                    </p>

                                    {/* Expand */}
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-gray-100 text-gray-600' : 'text-gray-300'}`}>
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {/* Expanded Panel */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/50">
                                        <div className="p-4 md:p-5 space-y-4">
                                            {/* Reason */}
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">취소 사유</label>
                                                <div className="bg-white rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 shadow-sm">
                                                    {req.reason}
                                                </div>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {req.venue_location && (
                                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <MapPin size={12} className="text-gray-400" /> {req.venue_location}
                                                    </span>
                                                )}
                                                {req.seller_email && (
                                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <User size={12} className="text-gray-400" /> {req.seller_email}
                                                    </span>
                                                )}
                                                {req.vendor_name && (
                                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Store size={12} className="text-gray-400" /> {req.vendor_name}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Clock size={12} className="text-gray-400" /> {formatDate(req.created_at)}
                                                </span>
                                            </div>

                                            {/* Decision Result */}
                                            {req.status !== 'pending' && (
                                                <div className={`rounded-xl p-4 border ${req.status === 'approved'
                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                                    : 'bg-red-50 border-red-100 text-red-800'}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {req.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        <span className="text-sm font-bold">
                                                            {req.status === 'approved' ? '취소 승인됨' : '취소 거절됨'}
                                                        </span>
                                                        {req.decided_by_name && (
                                                            <span className="text-xs opacity-60">by {req.decided_by_name}</span>
                                                        )}
                                                    </div>
                                                    {req.decision_note && <p className="text-sm mt-1 opacity-80">{req.decision_note}</p>}
                                                    {req.decided_at && <p className="text-[11px] opacity-50 mt-2">{formatDate(req.decided_at)}</p>}
                                                </div>
                                            )}

                                            {/* Action Area */}
                                            {isPending && (
                                                <div className="pt-2 space-y-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">결정 사유 (선택)</label>
                                                        <textarea
                                                            value={decisionNote}
                                                            onChange={e => setDecisionNote(e.target.value)}
                                                            placeholder="승인 또는 거절 사유를 입력해주세요..."
                                                            rows={2}
                                                            className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleAction(req.id, 'approved')}
                                                            disabled={processing === req.id}
                                                            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-200/50 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                                        >
                                                            <CheckCircle size={16} />
                                                            {processing === req.id ? '처리 중...' : '취소 승인'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, 'rejected')}
                                                            disabled={processing === req.id}
                                                            className="flex-1 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle size={16} />
                                                            {processing === req.id ? '처리 중...' : '취소 거절'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminCancellations;
