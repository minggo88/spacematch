import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Wallet, Clock, CheckCircle, X, FileText, User, Calendar, DollarSign, Percent, AlertCircle, Eye, CreditCard, Ban, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const STATUS_CONFIG = {
    pending: { label: '대기', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    confirmed: { label: '확인', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
    paid: { label: '지급', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    disputed: { label: '이의', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' }
};

const SellerSettlements = () => {
    const { user } = useAuth();
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

    const [settlements, setSettlements] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSettlement, setSelectedSettlement] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [sellerNote, setSellerNote] = useState('');

    const fetchSettlements = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/settlements/settlements.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSettlements(data.settlements || []);
                setStats(data.stats || {});
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSettlements(); }, []);

    const filteredSettlements = useMemo(() => {
        if (statusFilter === 'all') return settlements;
        return settlements.filter(s => s.status === statusFilter);
    }, [settlements, statusFilter]);

    const pendingCount = useMemo(() => settlements.filter(s => s.status === 'pending').length, [settlements]);

    const handleAction = async (action) => {
        if (!selectedSettlement) return;
        if (action === 'dispute' && !sellerNote.trim()) {
            showToast('이의 사유를 입력해 주세요.', 'error');
            return;
        }
        setUpdating(true);
        try {
            const body = { settlement_id: selectedSettlement.id, action };
            if (sellerNote.trim()) body.note = sellerNote;

            const res = await fetch(`${API_BASE}/settlements/update_settlement.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setSelectedSettlement(null);
                setSellerNote('');
                fetchSettlements();
            } else { showToast(data.message, 'error'); }
        } catch (e) { showToast('처리에 실패했습니다.', 'error'); }
        finally { setUpdating(false); }
    };

    const formatCurrency = (n) => Number(n || 0).toLocaleString('ko-KR') + '원';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                            <Wallet className="text-teal-600 dark:text-teal-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">정산 관리</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">받은 정산을 확인하고 관리합니다</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: '총 거래', value: formatCurrency(stats.total_amount), icon: DollarSign, color: 'teal' },
                        { label: '정산 금액', value: formatCurrency(stats.total_net), icon: Wallet, color: 'violet' },
                        { label: '미확인', value: formatCurrency(stats.pending_amount), icon: Clock, color: 'amber' },
                        { label: '지급 완료', value: formatCurrency(stats.paid_amount), icon: CheckCircle, color: 'emerald' }
                    ].map(item => (
                        <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                                <item.icon size={18} className={`text-${item.color}-400 dark:text-${item.color}-600`} />
                            </div>
                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Pending Alert */}
                {pendingCount > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 flex items-center gap-3">
                        <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            확인 대기 중인 정산이 <strong>{pendingCount}건</strong> 있습니다.
                        </p>
                    </div>
                )}

                {/* Status Tabs */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                    {['all', 'pending', 'confirmed', 'paid', 'disputed'].map(status => {
                        const config = status === 'all' ? { label: '전체' } : STATUS_CONFIG[status];
                        const count = status === 'all' ? settlements.length : settlements.filter(s => s.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {config.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === status ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                {filteredSettlements.length === 0 ? (
                    <div className="text-center py-20">
                        <Wallet className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">정산 내역이 없습니다</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">벤더로부터 정산이 등록되면 여기에 표시됩니다</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSettlements.map(st => {
                            const statusCfg = STATUS_CONFIG[st.status];
                            const isPending = st.status === 'pending';
                            return (
                                <div
                                    key={st.id}
                                    onClick={() => { setSelectedSettlement(st); setSellerNote(''); }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${isPending ? 'border-amber-200 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30' : 'border-gray-100 dark:border-gray-700'}`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{st.shipment_title || `정산 #${st.id}`}</h3>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>{statusCfg.label}</span>
                                                {isPending && <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold animate-pulse">확인 필요</span>}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1"><User size={12} /> {st.vendor_name}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(st.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(st.net_amount)}</p>
                                            <p className="text-xs text-gray-400">수수료 {st.commission_rate}%</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedSettlement && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSettlement(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-extrabold">{selectedSettlement.shipment_title || `정산 #${selectedSettlement.id}`}</h2>
                                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold">{STATUS_CONFIG[selectedSettlement.status].label}</span>
                                    </div>
                                    <button onClick={() => setSelectedSettlement(null)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {selectedSettlement.vendor_name?.[0] || 'V'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{selectedSettlement.vendor_name}</p>
                                        <p className="text-xs text-gray-400">{selectedSettlement.vendor_company || '벤더'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { label: '거래 금액', value: formatCurrency(selectedSettlement.amount), highlight: false },
                                        { label: `수수료 (${selectedSettlement.commission_rate}%)`, value: `- ${formatCurrency(selectedSettlement.commission_amount)}`, highlight: false },
                                        { label: '받을 금액', value: formatCurrency(selectedSettlement.net_amount), highlight: true }
                                    ].map(row => (
                                        <div key={row.label} className={`flex items-center justify-between p-3 rounded-xl ${row.highlight ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                            <span className={`text-sm ${row.highlight ? 'font-bold text-emerald-700 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400'}`}>{row.label}</span>
                                            <span className={`text-sm ${row.highlight ? 'font-extrabold text-emerald-700 dark:text-emerald-300' : 'font-medium text-gray-800 dark:text-gray-200'}`}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {selectedSettlement.vendor_note && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">벤더 메모</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedSettlement.vendor_note}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: '등록일', date: selectedSettlement.created_at },
                                        { label: '확인일', date: selectedSettlement.confirmed_at },
                                        { label: '지급일', date: selectedSettlement.paid_at },
                                    ].filter(t => t.date).map(t => (
                                        <div key={t.label} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <p className="text-xs text-gray-400">{t.label}</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(t.date).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedSettlement.status === 'pending' && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">메모 (이의 제기 시 필수)</label>
                                            <textarea
                                                value={sellerNote}
                                                onChange={e => setSellerNote(e.target.value)}
                                                placeholder="메모를 남기세요"
                                                rows={2}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleAction('confirm')}
                                            disabled={updating}
                                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-cyan-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> {updating ? '처리 중...' : '정산 확인'}
                                        </button>
                                        <button
                                            onClick={() => handleAction('dispute')}
                                            disabled={updating}
                                            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Ban size={16} /> 이의 제기
                                        </button>
                                    </div>
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

export default SellerSettlements;
