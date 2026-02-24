import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Truck, Clock, CheckCircle, XCircle, Ban, Plus, X, ChevronDown, FileText, User, Calendar, Package, ShoppingBag, Eye, Send, MapPin, Hash, DollarSign, ClipboardList, AlertCircle, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const COURIER_LIST = ['CJ대한통운', '한진택배', '롯데택배', '로젠택배', '우체국택배', 'GS Postbox', '경동택배', '대신택배', '일양로지스', '기타'];

const VendorShipments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedShipment, setSelectedShipment] = useState(null);

    // Create modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [creating, setCreating] = useState(false);
    const [newOrder, setNewOrder] = useState({
        proposal_id: '', order_title: '', vendor_memo: '',
        items: [{ name: '', quantity: 1, unit_price: 0 }]
    });

    // Ship modal
    const [showShipModal, setShowShipModal] = useState(false);
    const [shipTarget, setShipTarget] = useState(null);
    const [shipForm, setShipForm] = useState({ courier: '', tracking_number: '' });
    const [updating, setUpdating] = useState(false);

    const fetchShipments = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/shipments/shipments.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setShipments(data.shipments || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    const fetchAcceptedProposals = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/proposals/proposals.php?status=accepted`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setProposals(data.proposals || []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchShipments(); fetchAcceptedProposals(); }, []);

    const filteredShipments = useMemo(() => {
        if (statusFilter === 'all') return shipments;
        return shipments.filter(s => s.status === statusFilter);
    }, [shipments, statusFilter]);

    const stats = useMemo(() => ({
        total: shipments.length,
        ordered: shipments.filter(s => s.status === 'ordered').length,
        shipping: shipments.filter(s => s.status === 'shipping').length,
        completed: shipments.filter(s => s.status === 'completed').length
    }), [shipments]);

    const handleCreate = async () => {
        if (!newOrder.proposal_id || !newOrder.order_title || newOrder.items.length === 0) {
            showToast('제안, 제목, 품목을 모두 입력해 주세요.', 'error');
            return;
        }
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/shipments/shipments.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setShowCreateModal(false);
                setNewOrder({ proposal_id: '', order_title: '', vendor_memo: '', items: [{ name: '', quantity: 1, unit_price: 0 }] });
                fetchShipments();
            } else {
                showToast(data.message, 'error');
            }
        } catch (e) { showToast('발주 등록에 실패했습니다.', 'error'); }
        finally { setCreating(false); }
    };

    const handleShip = async () => {
        if (!shipForm.courier || !shipForm.tracking_number) {
            showToast('택배사와 송장번호를 입력해 주세요.', 'error');
            return;
        }
        setUpdating(true);
        try {
            const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipment_id: shipTarget.id, action: 'ship', ...shipForm })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setShowShipModal(false);
                setShipTarget(null);
                setSelectedShipment(null);
                fetchShipments();
            } else { showToast(data.message, 'error'); }
        } catch (e) { showToast('배송 등록에 실패했습니다.', 'error'); }
        finally { setUpdating(false); }
    };

    const handleAction = async (shipmentId, action) => {
        if (action === 'cancel' && !confirm('이 발주를 취소하시겠습니까?')) return;
        setUpdating(true);
        try {
            const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipment_id: shipmentId, action })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setSelectedShipment(null);
                fetchShipments();
            } else { showToast(data.message, 'error'); }
        } catch (e) { showToast('처리에 실패했습니다.', 'error'); }
        finally { setUpdating(false); }
    };

    // Items helpers
    const addItem = () => setNewOrder(prev => ({ ...prev, items: [...prev.items, { name: '', quantity: 1, unit_price: 0 }] }));
    const removeItem = (idx) => setNewOrder(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
    const updateItem = (idx, field, value) => setNewOrder(prev => {
        const items = [...prev.items];
        items[idx] = { ...items[idx], [field]: value };
        return { ...prev, items };
    });
    const totalAmount = useMemo(() => newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0), [newOrder.items]);

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                            <Truck className="text-teal-600 dark:text-teal-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">배송 관리</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">발주 생성 및 배송 상태를 관리합니다</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all"
                    >
                        <Plus size={18} /> 새 발주
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: '전체', value: stats.total, color: 'teal', icon: FileText },
                        { label: '발주', value: stats.ordered, color: 'blue', icon: ClipboardList },
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
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">아직 발주 내역이 없습니다</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">수락된 유통 제안을 기반으로 발주를 생성하세요</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredShipments.map(ship => {
                            const statusCfg = STATUS_CONFIG[ship.status];
                            const StatusIcon = statusCfg.icon;
                            return (
                                <div
                                    key={ship.id}
                                    onClick={() => setSelectedShipment(ship)}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
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
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    <span className="flex items-center gap-1"><User size={12} /> {ship.seller_name}</span>
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
                                {/* Seller */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {selectedShipment.seller_name?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{selectedShipment.seller_name}</p>
                                        <p className="text-xs text-gray-400">{selectedShipment.seller_category || ''}</p>
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
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.quantity}개 × {formatCurrency(item.unit_price)}
                                                    </span>
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

                                {/* Actions */}
                                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    {selectedShipment.status === 'confirmed' && (
                                        <button
                                            onClick={() => { setShipTarget(selectedShipment); setShowShipModal(true); }}
                                            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Truck size={16} /> 배송 등록
                                        </button>
                                    )}
                                    {selectedShipment.status === 'delivered' && (
                                        <button
                                            onClick={() => handleAction(selectedShipment.id, 'complete')}
                                            disabled={updating}
                                            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> 거래 완료
                                        </button>
                                    )}
                                    {['ordered', 'confirmed', 'shipping'].includes(selectedShipment.status) && (
                                        <button
                                            onClick={() => handleAction(selectedShipment.id, 'cancel')}
                                            disabled={updating}
                                            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Ban size={16} /> 취소
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-extrabold">새 발주 생성</h2>
                                        <p className="text-sm text-white/70 mt-1">수락된 유통 제안을 기반으로 발주합니다</p>
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {/* Proposal select */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">유통 제안 선택 *</label>
                                    <div className="relative">
                                        <select
                                            value={newOrder.proposal_id}
                                            onChange={e => setNewOrder(prev => ({ ...prev, proposal_id: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100"
                                        >
                                            <option value="">수락된 제안을 선택하세요</option>
                                            {proposals.map(p => (
                                                <option key={p.id} value={p.id}>{p.title} — {p.seller_name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                    {proposals.length === 0 && (
                                        <p className="text-xs text-amber-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> 수락된 유통 제안이 없습니다. 먼저 제안을 보내세요.</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">발주 제목 *</label>
                                    <input
                                        type="text"
                                        value={newOrder.order_title}
                                        onChange={e => setNewOrder(prev => ({ ...prev, order_title: e.target.value }))}
                                        placeholder="예: 2월 정기 발주"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500"
                                    />
                                </div>

                                {/* Items */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">품목 *</label>
                                        <button onClick={addItem} className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline"><Plus size={12} /> 추가</button>
                                    </div>
                                    <div className="space-y-2">
                                        {newOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 items-start">
                                                <input
                                                    type="text"
                                                    placeholder="품목명"
                                                    value={item.name}
                                                    onChange={e => updateItem(idx, 'name', e.target.value)}
                                                    className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 dark:placeholder-gray-500"
                                                />
                                                <input
                                                    type="number" min="1" placeholder="수량"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 text-center"
                                                />
                                                <input
                                                    type="number" min="0" placeholder="단가"
                                                    value={item.unit_price}
                                                    onChange={e => updateItem(idx, 'unit_price', parseInt(e.target.value) || 0)}
                                                    className="w-28 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 text-right"
                                                />
                                                {newOrder.items.length > 1 && (
                                                    <button onClick={() => removeItem(idx)} className="p-2 text-gray-400 hover:text-red-500"><Minus size={16} /></button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-right text-sm font-bold text-teal-600 dark:text-teal-400">
                                        합계: {formatCurrency(totalAmount)}
                                    </div>
                                </div>

                                {/* Memo */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">메모</label>
                                    <textarea
                                        value={newOrder.vendor_memo}
                                        onChange={e => setNewOrder(prev => ({ ...prev, vendor_memo: e.target.value }))}
                                        placeholder="특이사항이 있으면 입력하세요"
                                        rows={2}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={creating || !newOrder.proposal_id || !newOrder.order_title}
                                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <ClipboardList size={16} /> {creating ? '등록 중...' : '발주 등록'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ship Modal */}
                {showShipModal && shipTarget && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowShipModal(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-6 text-white">
                                <h2 className="text-xl font-extrabold">배송 등록</h2>
                                <p className="text-sm text-white/70 mt-1">{shipTarget.order_title}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">택배사 *</label>
                                    <div className="relative">
                                        <select
                                            value={shipForm.courier}
                                            onChange={e => setShipForm(prev => ({ ...prev, courier: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-violet-500 outline-none appearance-none font-medium text-sm dark:text-gray-100"
                                        >
                                            <option value="">택배사 선택</option>
                                            {COURIER_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">송장번호 *</label>
                                    <input
                                        type="text"
                                        value={shipForm.tracking_number}
                                        onChange={e => setShipForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                                        placeholder="송장번호를 입력하세요"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-violet-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500"
                                    />
                                </div>
                                <button
                                    onClick={handleShip}
                                    disabled={updating || !shipForm.courier || !shipForm.tracking_number}
                                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Truck size={16} /> {updating ? '등록 중...' : '배송 등록'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default VendorShipments;
