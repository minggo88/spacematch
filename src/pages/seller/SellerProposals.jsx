import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Inbox, Clock, CheckCircle, XCircle, Ban, X, FileText, User, Calendar, MessageCircle, Package, Truck, ShoppingBag, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const PROPOSAL_TYPES = {
    distribution: { label: '유통', icon: Truck, color: 'teal' },
    consignment: { label: '위탁', icon: Package, color: 'violet' },
    wholesale: { label: '도매', icon: ShoppingBag, color: 'amber' }
};

const STATUS_CONFIG = {
    pending: { label: '대기', icon: Clock, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    accepted: { label: '수락', icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    rejected: { label: '거절', icon: XCircle, bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
    cancelled: { label: '취소됨', icon: Ban, bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' }
};

const SellerProposals = () => {
    const { user } = useAuth();
    const { t } = useTranslation('seller');
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [responding, setResponding] = useState(false);
    const [responseNote, setResponseNote] = useState('');

    const fetchProposals = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/proposals/proposals.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setProposals(data.proposals || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProposals(); }, []);

    const filteredProposals = useMemo(() => {
        if (statusFilter === 'all') return proposals;
        return proposals.filter(p => p.status === statusFilter);
    }, [proposals, statusFilter]);

    const stats = useMemo(() => ({
        total: proposals.length,
        pending: proposals.filter(p => p.status === 'pending').length,
        accepted: proposals.filter(p => p.status === 'accepted').length,
        rejected: proposals.filter(p => p.status === 'rejected').length
    }), [proposals]);

    const handleRespond = async (action) => {
        if (!selectedProposal) return;
        setResponding(true);
        try {
            const res = await fetch(`${API_BASE}/proposals/respond_proposal.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proposal_id: selectedProposal.id,
                    action,
                    seller_note: responseNote
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setSelectedProposal(null);
                setResponseNote('');
                fetchProposals();
            } else {
                showToast(data.message, 'error');
            }
        } catch (e) {
            showToast('처리에 실패했습니다.', 'error');
        } finally { setResponding(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                            <Inbox className="text-violet-600 dark:text-violet-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">유통 제안 수신함</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">벤더로부터 받은 유통 제안을 확인하세요</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: '전체', value: stats.total, color: 'violet', icon: FileText },
                        { label: '대기', value: stats.pending, color: 'amber', icon: Clock },
                        { label: '수락', value: stats.accepted, color: 'emerald', icon: CheckCircle },
                        { label: '거절', value: stats.rejected, color: 'rose', icon: XCircle }
                    ].map(item => (
                        <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                                    <p className={`text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</p>
                                </div>
                                <item.icon size={24} className={`text-${item.color}-300 dark:text-${item.color}-700`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pending Alert */}
                {stats.pending > 0 && (
                    <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3">
                        <Clock size={20} className="text-amber-500 flex-shrink-0" />
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            응답 대기 중인 제안이 <strong>{stats.pending}건</strong> 있습니다. 확인해 주세요!
                        </p>
                    </div>
                )}

                {/* Status Filter */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                    {['all', 'pending', 'accepted', 'rejected', 'cancelled'].map(status => {
                        const config = status === 'all' ? { label: '전체' } : STATUS_CONFIG[status];
                        const count = status === 'all' ? proposals.length : proposals.filter(p => p.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/50'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {config.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === status ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Proposals List */}
                {filteredProposals.length === 0 ? (
                    <div className="text-center py-20">
                        <Inbox className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">받은 제안이 없습니다</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">벤더가 유통 제안을 보내면 여기에 표시됩니다</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredProposals.map(proposal => {
                            const statusCfg = STATUS_CONFIG[proposal.status];
                            const typeCfg = PROPOSAL_TYPES[proposal.proposal_type] || PROPOSAL_TYPES.distribution;
                            const StatusIcon = statusCfg.icon;
                            const TypeIcon = typeCfg.icon;
                            const isPending = proposal.status === 'pending';
                            return (
                                <div
                                    key={proposal.id}
                                    onClick={() => { setSelectedProposal(proposal); setResponseNote(''); }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl border ${isPending ? 'border-amber-200 dark:border-amber-800 ring-1 ring-amber-100 dark:ring-amber-900/30' : 'border-gray-100 dark:border-gray-700'} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className={`w-11 h-11 ${statusCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.border}`}>
                                                <StatusIcon size={20} className={statusCfg.text} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{proposal.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                                                        {statusCfg.label}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                                                        <TypeIcon size={10} /> {typeCfg.label}
                                                    </span>
                                                    {isPending && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    <span className="flex items-center gap-1"><User size={12} /> {proposal.vendor_name || proposal.vendor_company || '벤더'}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(proposal.created_at).toLocaleDateString('ko-KR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {isPending ? (
                                            <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg whitespace-nowrap">응답 필요</span>
                                        ) : (
                                            <Eye size={16} className="text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                    {proposal.message && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pl-[60px] line-clamp-2">{proposal.message}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detail & Response Modal */}
                {selectedProposal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProposal(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-extrabold">{selectedProposal.title}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold">{STATUS_CONFIG[selectedProposal.status].label}</span>
                                            <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold">{PROPOSAL_TYPES[selectedProposal.proposal_type]?.label || '유통'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedProposal(null)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {/* Vendor info */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {(selectedProposal.vendor_name || selectedProposal.vendor_company)?.[0] || 'V'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{selectedProposal.vendor_name || '벤더'}</p>
                                        <p className="text-xs text-gray-400">{selectedProposal.vendor_company || ''}</p>
                                    </div>
                                </div>

                                {/* Message */}
                                {selectedProposal.message && (
                                    <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
                                        <p className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase mb-1">제안 상세 내용</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedProposal.message}</p>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">받은 날짜</p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(selectedProposal.created_at).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                    {selectedProposal.responded_at && (
                                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">응답 날짜</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(selectedProposal.responded_at).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Already responded */}
                                {selectedProposal.status !== 'pending' && selectedProposal.seller_note && (
                                    <div className={`p-4 rounded-xl border ${selectedProposal.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}>
                                        <p className={`text-xs font-bold uppercase mb-1 ${selectedProposal.status === 'accepted' ? 'text-emerald-500' : 'text-rose-500'}`}>내 답변</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedProposal.seller_note}</p>
                                    </div>
                                )}

                                {/* Response form (pending only) */}
                                {selectedProposal.status === 'pending' && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">답변하기</p>
                                        <textarea
                                            value={responseNote}
                                            onChange={e => setResponseNote(e.target.value)}
                                            placeholder="답변 메시지를 작성하세요 (선택사항)"
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-violet-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleRespond('reject')}
                                                disabled={responding}
                                                className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ThumbsDown size={16} /> 거절
                                            </button>
                                            <button
                                                onClick={() => handleRespond('accept')}
                                                disabled={responding}
                                                className="py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <ThumbsUp size={16} /> {responding ? '처리 중...' : '수락'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Chat button for accepted */}
                                {selectedProposal.status === 'accepted' && (
                                    <button
                                        onClick={() => window.location.href = `/seller/chat?user=${selectedProposal.vendor_id}`}
                                        className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={16} /> 벤더와 채팅하기
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default SellerProposals;
