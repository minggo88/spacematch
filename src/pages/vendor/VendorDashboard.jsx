import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, CheckCircle, AlertCircle, ArrowRight, UserCircle, Building, BarChart3, Send, Truck, Wallet, Clock, DollarSign } from 'lucide-react';
import { getProfileCompletenessPercent } from '../../utils/profileCompleteness';

const API_BASE = '/api';

const VendorDashboard = () => {
    const { user } = useAuth();
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalSellers: 0, pendingProposals: 0, activeDeals: 0, totalShipments: 0, totalSettlements: 0, pendingSettlementAmount: 0 });
    const [profileComplete, setProfileComplete] = useState(0);
    const [recentProposals, setRecentProposals] = useState([]);
    const [recentShipments, setRecentShipments] = useState([]);

    // Calculate profile completion
    useEffect(() => {
        setProfileComplete(getProfileCompletenessPercent(user));
    }, [user]);

    // Fetch all stats
    useEffect(() => {
        // Seller count
        fetch(`${API_BASE}/users/list.php?role=seller`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                if (d.success) setStats(prev => ({ ...prev, totalSellers: d.users?.length || 0 }));
            })
            .catch(() => { });

        // Proposals
        fetch(`${API_BASE}/proposals/proposals.php`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                if (d.success && Array.isArray(d.proposals)) {
                    const pending = d.proposals.filter(p => p.status === 'pending').length;
                    const active = d.proposals.filter(p => p.status === 'accepted').length;
                    setStats(prev => ({ ...prev, pendingProposals: pending, activeDeals: active }));
                    setRecentProposals(d.proposals.slice(0, 3));
                }
            })
            .catch(() => { });

        // Shipments
        fetch(`${API_BASE}/shipments/shipments.php`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                if (d.success && Array.isArray(d.shipments)) {
                    setStats(prev => ({ ...prev, totalShipments: d.shipments.length }));
                    setRecentShipments(d.shipments.slice(0, 3));
                }
            })
            .catch(() => { });

        // Settlements
        fetch(`${API_BASE}/settlements/settlements.php`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setStats(prev => ({
                        ...prev,
                        totalSettlements: d.settlements?.length || 0,
                        pendingSettlementAmount: Number(d.stats?.pending_amount || 0)
                    }));
                }
            })
            .catch(() => { });
    }, []);

    if (!user) return null;

    const formatCurrency = (n) => Number(n || 0).toLocaleString('ko-KR') + '원';

    const quickActions = [
        {
            icon: ShoppingBag,
            title: t('vendorDashboard.exploreSellers', '셀러 탐색'),
            desc: t('vendorDashboard.exploreSellersDesc', '카테고리와 지역으로 셀러를 검색하세요'),
            color: 'from-indigo-500 to-violet-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            action: () => navigate('/vendor/sellers'),
        },
        {
            icon: Send,
            title: t('vendorDashboard.proposals', '유통 제안'),
            desc: t('vendorDashboard.proposalsDesc', '셀러에게 유통 제안을 보내세요'),
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            action: () => navigate('/vendor/proposals'),
        },
        {
            icon: Truck,
            title: t('vendorDashboard.shipments', '배송 관리'),
            desc: t('vendorDashboard.shipmentsDesc', '발주 및 배송 상태를 관리하세요'),
            color: 'from-cyan-500 to-blue-600',
            bg: 'bg-cyan-50 dark:bg-cyan-900/20',
            action: () => navigate('/vendor/shipments'),
        },
        {
            icon: Wallet,
            title: t('vendorDashboard.settlements', '정산 관리'),
            desc: t('vendorDashboard.settlementsDesc', '거래 정산을 확인하고 관리하세요'),
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            action: () => navigate('/vendor/settlements'),
        },
    ];

    const statCards = [
        {
            icon: Users,
            label: t('vendorDashboard.activeSellers', '활동 셀러'),
            value: stats.totalSellers,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        },
        {
            icon: Send,
            label: t('vendorDashboard.pendingProposals', '대기 중 제안'),
            value: stats.pendingProposals,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/30',
        },
        {
            icon: TrendingUp,
            label: t('vendorDashboard.activeDeals', '진행 중 거래'),
            value: stats.activeDeals,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        },
        {
            icon: Truck,
            label: t('vendorDashboard.totalShipments', '총 배송'),
            value: stats.totalShipments,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/30',
        },
        {
            icon: Wallet,
            label: t('vendorDashboard.totalSettlements', '총 정산'),
            value: stats.totalSettlements,
            color: 'text-teal-600 dark:text-teal-400',
            bg: 'bg-teal-50 dark:bg-teal-900/30',
        },
        {
            icon: Clock,
            label: t('vendorDashboard.pendingAmount', '미정산 금액'),
            value: formatCurrency(stats.pendingSettlementAmount),
            isText: true,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/30',
        },
    ];

    const PROPOSAL_STATUS = {
        pending: { label: '대기', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        accepted: { label: '수락', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        rejected: { label: '거절', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        cancelled: { label: '취소', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
    };

    const SHIPMENT_STATUS = {
        ordered: { label: '발주', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        confirmed: { label: '확인', cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
        shipping: { label: '배송중', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
        delivered: { label: '배송완료', cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
        completed: { label: '완료', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        cancelled: { label: '취소', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        {user.profile_image ? (
                            <img src={user.profile_image} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <Package className="text-white" size={28} />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('vendorDashboard.welcome', '안녕하세요')}, {user.name}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t('vendorDashboard.subtitle', '벤더 대시보드에 오신 것을 환영합니다')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Completion Alert */}
            {profileComplete < 100 && (
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                            {t('completeProfile', '프로필을 완성해 주세요')}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                            {t('profileProgress', '프로필 완성도')}: {profileComplete}%
                        </p>
                        <div className="w-full bg-amber-200/50 dark:bg-amber-800/30 rounded-full h-2 mt-2">
                            <div
                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${profileComplete}%` }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/vendor/profile')}
                        className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                        {t('goComplete', '완성하기')}
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <card.icon size={16} className={card.color} />
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{card.label}</p>
                        <p className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${card.isText ? 'text-sm' : ''}`}>
                            {card.isText ? card.value : card.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {t('vendorDashboard.quickActions', '빠른 작업')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={action.action}
                            className={`${action.bg} rounded-2xl p-6 text-left border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <action.icon className="text-white" size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{action.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Proposals */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Send size={16} className="text-violet-500" /> 최근 유통 제안
                        </h3>
                        <button onClick={() => navigate('/vendor/proposals')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            전체보기 <ArrowRight size={12} />
                        </button>
                    </div>
                    {recentProposals.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">아직 유통 제안이 없습니다</div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentProposals.map(p => {
                                const cfg = PROPOSAL_STATUS[p.status] || PROPOSAL_STATUS.pending;
                                return (
                                    <div key={p.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{p.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{p.seller_name || '셀러'} · {new Date(p.created_at).toLocaleDateString('ko-KR')}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${cfg.cls}`}>{cfg.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Shipments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Truck size={16} className="text-blue-500" /> 최근 배송
                        </h3>
                        <button onClick={() => navigate('/vendor/shipments')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            전체보기 <ArrowRight size={12} />
                        </button>
                    </div>
                    {recentShipments.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">아직 배송 내역이 없습니다</div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentShipments.map(s => {
                                const cfg = SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.ordered;
                                return (
                                    <div key={s.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{s.order_title || `배송 #${s.id}`}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{s.seller_name || '셀러'} · {Number(s.total_amount || 0).toLocaleString()}원</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${cfg.cls}`}>{cfg.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
