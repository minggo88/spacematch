import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Truck, Package, Wallet, Send, Inbox, Clock, CheckCircle, X, Ban, User, Calendar, DollarSign, Percent, Search, Filter, Eye, AlertCircle, ChevronDown, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const PROPOSAL_STATUS = {
    pending: { label: '대기', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    accepted: { label: '수락', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    rejected: { label: '거절', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    cancelled: { label: '취소', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400' },
};

const SHIPMENT_STATUS = {
    ordered: { label: '발주', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    confirmed: { label: '확인', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
    shipping: { label: '배송중', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
    delivered: { label: '배송완료', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
    completed: { label: '완료', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    cancelled: { label: '취소', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
};

const SETTLEMENT_STATUS = {
    pending: { label: '대기', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    confirmed: { label: '확인', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
    paid: { label: '지급', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    disputed: { label: '이의', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
};

const AdminVendorManagement = () => {
    const { user } = useAuth();
    const [toast, setToast] = useState(null);
    const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

    const [activeTab, setActiveTab] = useState('proposals');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Data
    const [proposals, setProposals] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [settlementStats, setSettlementStats] = useState({});

    const fetchProposals = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/proposals/proposals.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setProposals(data.proposals || []);
        } catch (e) { console.error(e); }
    }, []);

    const fetchShipments = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/shipments/shipments.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) setShipments(data.shipments || []);
        } catch (e) { console.error(e); }
    }, []);

    const fetchSettlements = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/settlements/settlements.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setSettlements(data.settlements || []);
                setSettlementStats(data.stats || {});
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchProposals(), fetchShipments(), fetchSettlements()])
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (n) => Number(n || 0).toLocaleString('ko-KR') + '원';

    // Filtered data
    const filteredProposals = useMemo(() => {
        return proposals.filter(p => {
            const matchSearch = !searchTerm ||
                (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.seller_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [proposals, searchTerm, statusFilter]);

    const filteredShipments = useMemo(() => {
        return shipments.filter(s => {
            const matchSearch = !searchTerm ||
                (s.order_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.seller_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [shipments, searchTerm, statusFilter]);

    const filteredSettlements = useMemo(() => {
        return settlements.filter(st => {
            const matchSearch = !searchTerm ||
                (st.shipment_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (st.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (st.seller_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || st.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [settlements, searchTerm, statusFilter]);

    const statusOptions = useMemo(() => {
        if (activeTab === 'proposals') return Object.entries(PROPOSAL_STATUS);
        if (activeTab === 'shipments') return Object.entries(SHIPMENT_STATUS);
        return Object.entries(SETTLEMENT_STATUS);
    }, [activeTab]);

    // Stats per tab
    const tabStats = useMemo(() => ({
        proposals: proposals.length,
        shipments: shipments.length,
        settlements: settlements.length,
    }), [proposals, shipments, settlements]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                            <Truck className="text-indigo-600 dark:text-indigo-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">벤더 거래 관리</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">유통 제안, 배송, 정산을 통합 관리합니다</p>
                        </div>
                    </div>
                </div>

                {/* Settlement Stats (always visible) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: '총 제안', value: proposals.length, icon: Send, color: 'violet' },
                        { label: '총 배송', value: shipments.length, icon: Package, color: 'blue' },
                        { label: '총 정산', value: formatCurrency(settlementStats.total_amount), icon: DollarSign, color: 'teal' },
                        { label: '미정산', value: formatCurrency(settlementStats.pending_amount), icon: Clock, color: 'amber' },
                    ].map(item => (
                        <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.label}</p>
                                <item.icon size={18} className={`text-${item.color}-400`} />
                            </div>
                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                    {[
                        { id: 'proposals', label: '유통 제안', icon: Send, count: tabStats.proposals },
                        { id: 'shipments', label: '배송 관리', icon: Package, count: tabStats.shipments },
                        { id: 'settlements', label: '정산 관리', icon: Wallet, count: tabStats.settlements },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setStatusFilter('all'); setSearchTerm(''); }}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="벤더, 셀러, 제목 검색..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:border-indigo-400 outline-none font-medium text-sm dark:text-gray-100"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:border-indigo-400 outline-none font-bold text-sm text-gray-600 dark:text-gray-300 min-w-[140px]"
                        >
                            <option value="all">전체 상태</option>
                            {statusOptions.map(([key, cfg]) => (
                                <option key={key} value={key}>{cfg.label}</option>
                            ))}
                        </select>
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* ── Proposals Tab ── */}
                {activeTab === 'proposals' && (
                    <div className="space-y-3">
                        {filteredProposals.length === 0 ? (
                            <div className="text-center py-20">
                                <Send className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">유통 제안이 없습니다</h3>
                            </div>
                        ) : filteredProposals.map(p => {
                            const cfg = PROPOSAL_STATUS[p.status] || PROPOSAL_STATUS.pending;
                            return (
                                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{p.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500">{p.proposal_type === 'supply' ? '공급' : '유통'}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1"><Truck size={12} /> {p.vendor_name || '벤더'}</span>
                                                <span className="flex items-center gap-1"><User size={12} /> {p.seller_name || '셀러'}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(p.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {p.proposed_price && <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">{formatCurrency(p.proposed_price)}</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Shipments Tab ── */}
                {activeTab === 'shipments' && (
                    <div className="space-y-3">
                        {filteredShipments.length === 0 ? (
                            <div className="text-center py-20">
                                <Package className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">배송 내역이 없습니다</h3>
                            </div>
                        ) : filteredShipments.map(s => {
                            const cfg = SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.ordered;
                            return (
                                <div key={s.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{s.order_title || `배송 #${s.id}`}</h3>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                                                <span className="flex items-center gap-1"><Truck size={12} /> {s.vendor_name || '벤더'}</span>
                                                <span className="flex items-center gap-1"><User size={12} /> {s.seller_name || '셀러'}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(s.created_at).toLocaleDateString('ko-KR')}</span>
                                                {s.carrier && <span className="flex items-center gap-1"><Package size={12} /> {s.carrier} {s.tracking_number}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{formatCurrency(s.total_amount)}</p>
                                            <p className="text-xs text-gray-400">{s.item_name} × {s.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Settlements Tab ── */}
                {activeTab === 'settlements' && (
                    <div className="space-y-3">
                        {filteredSettlements.length === 0 ? (
                            <div className="text-center py-20">
                                <Wallet className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">정산 내역이 없습니다</h3>
                            </div>
                        ) : filteredSettlements.map(st => {
                            const cfg = SETTLEMENT_STATUS[st.status] || SETTLEMENT_STATUS.pending;
                            return (
                                <div key={st.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{st.shipment_title || `정산 #${st.id}`}</h3>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1"><Truck size={12} /> {st.vendor_name || '벤더'}</span>
                                                <span className="flex items-center gap-1"><User size={12} /> {st.seller_name || '셀러'}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(st.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{formatCurrency(st.amount)}</p>
                                            <div className="text-xs text-gray-400 space-y-0.5">
                                                <p>수수료 {st.commission_rate}%: <span className="text-red-400">-{formatCurrency(st.commission_amount)}</span></p>
                                                <p>정산액: <span className="font-bold text-emerald-500">{formatCurrency(st.net_amount)}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default AdminVendorManagement;
