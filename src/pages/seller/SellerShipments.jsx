import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Truck, Clock, CheckCircle, XCircle, Ban, X, FileText, User, Calendar, Package, DollarSign, ClipboardList, MapPin, Eye, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const STATUS_CONFIG = {
    ordered: { label: '발주', icon: ClipboardList, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    confirmed: { label: '확인', icon: CheckCircle, bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
    shipping: { label: '배송중', icon: Truck, bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
    delivered: { label: '입고', icon: Package, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    completed: { label: '완료', icon: CheckCircle, bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
    cancelled: { label: '취소', icon: Ban, bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' }
};

const SellerShipments = () => {
    const { user } = useAuth();
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [sellerMemo, setSellerMemo] = useState('');

    const fetchShipments = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/shipments/shipments.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setShipments(data.shipments || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchShipments(); }, []);

    const filteredShipments = useMemo(() => {
        if (statusFilter === 'all') return shipments;
        return shipments.filter(s => s.status === statusFilter);
    }, [shipments, statusFilter]);

    const stats = useMemo(() => ({
        total: shipments.length,
        pending: shipments.filter(s => s.status === 'ordered').length,
        shipping: shipments.filter(s => s.status === 'shipping').length,
        completed: shipments.filter(s => s.status === 'completed').length
    }), [shipments]);

    const handleAction = async (action) => {
        if (!selectedShipment) return;
        setUpdating(true);
        try {
            const body = { shipment_id: selectedShipment.id, action };
            if (sellerMemo) body.memo = sellerMemo;

            const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setSelectedShipment(null);
                setSellerMemo('');
                fetchShipments();
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                            <Truck className="text-teal-600 dark:text-teal-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">배송 관리</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">입고 확인 및 배송 현황을 관리합니다</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: '전체', value: stats.total, color: 'teal', icon: FileText },
                        { label: '대기중', value: stats.pending, color: 'amber', icon: AlertCircle },
                        { label: '배송중', value: stats.shipping, color: 'violet', icon: Truck },
                        { label: '완료', value: stats.completed, color: 'emerald', icon: CheckCircle }
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
                    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 flex items-center gap-3">
                        <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            확인 대기 중인 발주가 <strong>{stats.pending}건</strong> 있습니다.
                        </p>
                    </div>
                )}

                {/* Status Tabs */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                    {['all', 'ordered', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled'].map(status => {
                        const config = status === 'all' ? { label: '전체' } : STATUS_CONFIG[status];
                        const count = status === 'all' ? shipments.length : shipments.filter(s => s.status === status).length;
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

                {/* Shipment List */}
                {filteredShipments.length === 0 ? (
                    <div className="text-center py-20">
                        <Truck className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">배송 내역이 없습니다</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">벤더로부터 발주를 받으면 여기에 표시됩니다</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredShipments.map(ship => {
                            const statusCfg = STATUS_CONFIG[ship.status];
                            const StatusIcon = statusCfg.icon;
                            const isPending = ship.status === 'ordered';
                            return (
                                <div
                                    key={ship.id}
                                    onClick={() => { setSelectedShipment(ship); setSellerMemo(''); }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${isPending ? 'border-amber-200 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30' : 'border-gray-100 dark:border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className={`w-11 h-11 ${statusCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.border}`}>
                                                <StatusIcon size={20} className={statusCfg.text} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{ship.order_title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                                                        {statusCfg.label}
                                                    </span>
                                                    {isPending && <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold animate-pulse">확인 필요</span>}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    <span className="flex items-center gap-1"><User size={12} /> {ship.vendor_name}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ship.ordered_at).toLocaleDateString('ko-KR')}</span>
                                                    <span className="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300"><DollarSign size={12} /> {formatCurrency(ship.total_amount)}</span>
                                                </div>
                                                {ship.tracking_number && (
                                                    <p className="text-xs text-violet-500 dark:text-violet-400 mt-1 flex items-center gap-1"><MapPin size={11} /> {ship.courier} {ship.tracking_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Eye size={16} className="text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedShipment && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedShipment(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-extrabold">{selectedShipment.order_title}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold">{STATUS_CONFIG[selectedShipment.status].label}</span>
                                            <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold">{formatCurrency(selectedShipment.total_amount)}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedShipment(null)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {/* Vendor */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {selectedShipment.vendor_name?.[0] || 'V'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{selectedShipment.vendor_name}</p>
                                        <p className="text-xs text-gray-400">{selectedShipment.vendor_company || '벤더'}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                {selectedShipment.items?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">품목 내역</p>
                                        <div className="space-y-2">
                                            {selectedShipment.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.quantity}개 × {formatCurrency(item.unit_price)}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                                                <span className="text-sm font-bold text-teal-700 dark:text-teal-300">합계</span>
                                                <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300">{formatCurrency(selectedShipment.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tracking */}
                                {selectedShipment.tracking_number && (
                                    <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                                        <p className="text-xs font-bold text-violet-500 uppercase mb-1">배송 정보</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedShipment.courier} — {selectedShipment.tracking_number}</p>
                                    </div>
                                )}

                                {/* Vendor Memo */}
                                {selectedShipment.vendor_memo && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">벤더 메모</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedShipment.vendor_memo}</p>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: '발주일', date: selectedShipment.ordered_at },
                                        { label: '확인일', date: selectedShipment.confirmed_at },
                                        { label: '배송일', date: selectedShipment.shipped_at },
                                        { label: '완료일', date: selectedShipment.completed_at },
                                    ].filter(t => t.date).map(t => (
                                        <div key={t.label} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{t.label}</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(t.date).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Seller Actions */}
                                {['ordered', 'shipping'].includes(selectedShipment.status) && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">메모 (선택)</label>
                                            <textarea
                                                value={sellerMemo}
                                                onChange={e => setSellerMemo(e.target.value)}
                                                placeholder="메모를 남기세요"
                                                rows={2}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                                            />
                                        </div>

                                        {selectedShipment.status === 'ordered' && (
                                            <button
                                                onClick={() => handleAction('confirm')}
                                                disabled={updating}
                                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-cyan-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={16} /> {updating ? '처리 중...' : '발주 확인'}
                                            </button>
                                        )}

                                        {selectedShipment.status === 'shipping' && (
                                            <button
                                                onClick={() => handleAction('deliver')}
                                                disabled={updating}
                                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-sm hover:from-emerald-400 hover:to-green-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                <Package size={16} /> {updating ? '처리 중...' : '입고 확인'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {selectedShipment.status === 'delivered' && (
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={() => handleAction('complete')}
                                            disabled={updating}
                                            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> {updating ? '처리 중...' : '거래 완료'}
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

export default SellerShipments;
