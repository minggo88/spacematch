import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3, Megaphone, Gift, TrendingUp, Users, Eye, Target,
    Search, Check, X, ChevronRight, RefreshCw, AlertCircle,
    Filter, ArrowUpRight, ArrowDownRight, Minus, Trash2,
    ShoppingBag, Star, Zap, DollarSign, PieChart, Clock,
    Shield, Ban, CheckCircle,
} from 'lucide-react';

const ADMIN_TABS = [
    { id: 'campaigns', icon: Megaphone, label: '캠페인 관리' },
    { id: 'coupons', icon: Gift, label: '쿠폰 관리' },
    { id: 'ads', icon: Eye, label: '광고 심사' },
    { id: 'analytics', icon: BarChart3, label: '통합 분석' },
];

const STATUS_MAP = {
    draft: { label: '초안', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
    review: { label: '심사중', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    approved: { label: '승인', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    active: { label: '활성', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    paused: { label: '일시정지', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    completed: { label: '완료', cls: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
    rejected: { label: '반려', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    cancelled: { label: '취소', cls: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    scheduled: { label: '예약', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
};

// ── 데모 데이터 ──
const DEMO_CAMPAIGNS = [
    { id: 'cmp_001', name: '봄 시즌 프로모션', type: 'awareness', side: 'host', owner_name: '강남 파티홀', status: 'review', budget_total: 500000, created_at: '2026-02-20' },
    { id: 'cmp_002', name: '신규 고객 쿠폰 페스타', type: 'conversion', side: 'seller', owner_name: '김셀러', status: 'active', budget_total: 300000, created_at: '2026-02-18' },
    { id: 'cmp_003', name: '겨울 한정 할인', type: 'traffic', side: 'seller', owner_name: '이벤트홀', status: 'completed', budget_total: 200000, created_at: '2026-01-10' },
    { id: 'cmp_004', name: '배너 광고 캠페인', type: 'awareness', side: 'host', owner_name: '스튜디오 A', status: 'active', budget_total: 800000, created_at: '2026-02-01' },
    { id: 'cmp_005', name: '팝업 스토어 광고', type: 'conversion', side: 'host', owner_name: '팝업존', status: 'review', budget_total: 450000, created_at: '2026-02-22' },
];

const DEMO_COUPONS = [
    { id: 'cpn_001', name: '신규 가입 환영', code: 'SM-WELCOME15', type: 'percentage', value: 15, usage_count: 342, max_usage: 1000, status: 'active', owner_name: '김셀러', side: 'seller', valid_until: '2026-12-31' },
    { id: 'cpn_002', name: '단골 감사 쿠폰', code: 'SM-LOYAL20', type: 'percentage', value: 20, usage_count: 89, max_usage: 200, status: 'active', owner_name: '이벤트홀', side: 'seller', valid_until: '2026-06-30' },
    { id: 'cpn_003', name: '시즌 한정', code: 'SM-SEASON10', type: 'fixed', value: 10000, usage_count: 0, max_usage: 500, status: 'scheduled', owner_name: '강남 파티홀', side: 'host', valid_until: '2026-03-31' },
    { id: 'cpn_004', name: '플랫폼 전체 할인', code: 'SM-PLATFORM5', type: 'percentage', value: 5, usage_count: 1250, max_usage: 5000, status: 'active', owner_name: '관리자', side: 'platform', valid_until: '2026-12-31' },
];

const DEMO_ADS = [
    { id: 'ad_001', name: '메인페이지 배너', type: 'banner', owner_name: '스튜디오 A', status: 'review', budget: 300000, duration: '2026-03-01 ~ 2026-03-31', content_url: '/banners/spring.jpg' },
    { id: 'ad_002', name: '검색 결과 스폰서', type: 'sponsored', owner_name: '팝업존', status: 'review', budget: 200000, duration: '2026-02-25 ~ 2026-03-25', content_url: null },
    { id: 'ad_003', name: '사이드바 배너', type: 'banner', owner_name: '파티룸', status: 'approved', budget: 150000, duration: '2026-02-01 ~ 2026-02-28', content_url: '/banners/party.jpg' },
];

export default function AdminMarketing() {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState('campaigns');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Shield size={28} /> 마케팅 관리 센터
                    </h1>
                    <p className="mt-2 text-indigo-100 text-sm">
                        전체 캠페인 · 쿠폰 · 광고를 모니터링하고 관리하세요
                    </p>
                </div>
            </div>

            {/* 탭 */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
                    {ADMIN_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 토스트 */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`}>
                    {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'campaigns' && <CampaignsTab showToast={showToast} />}
                {activeTab === 'coupons' && <CouponsTab showToast={showToast} />}
                {activeTab === 'ads' && <AdsTab showToast={showToast} />}
                {activeTab === 'analytics' && <AnalyticsTab />}
            </div>
        </div>
    );
}

// ── 캠페인 관리 탭 ──
function CampaignsTab({ showToast }) {
    const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSide, setFilterSide] = useState('all');

    const filtered = useMemo(() => {
        return campaigns.filter(c => {
            if (filterStatus !== 'all' && c.status !== filterStatus) return false;
            if (filterSide !== 'all' && c.side !== filterSide) return false;
            if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) && !c.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [campaigns, searchTerm, filterStatus, filterSide]);

    const handleStatusChange = (id, newStatus) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        showToast(`캠페인 상태가 "${STATUS_MAP[newStatus]?.label}"(으)로 변경되었습니다`);
    };

    const handleDelete = (id) => {
        if (!confirm('이 캠페인을 삭제하시겠습니까?')) return;
        setCampaigns(prev => prev.filter(c => c.id !== id));
        showToast('캠페인이 삭제되었습니다');
    };

    const counts = useMemo(() => ({
        total: campaigns.length,
        review: campaigns.filter(c => c.status === 'review').length,
        active: campaigns.filter(c => c.status === 'active').length,
    }), [campaigns]);

    return (
        <div className="space-y-6">
            {/* KPI 카드 */}
            <div className="grid grid-cols-3 gap-4">
                <KpiCard label="전체 캠페인" value={counts.total} icon={Megaphone} color="indigo" />
                <KpiCard label="심사 대기" value={counts.review} icon={Clock} color="amber" />
                <KpiCard label="활성 중" value={counts.active} icon={CheckCircle} color="emerald" />
            </div>

            {/* 검색 & 필터 */}
            <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="캠페인 이름 또는 담당자 검색..."
                        className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="all">상태: 전체</option>
                    <option value="review">심사중</option>
                    <option value="active">활성</option>
                    <option value="approved">승인</option>
                    <option value="paused">일시정지</option>
                    <option value="completed">완료</option>
                    <option value="rejected">반려</option>
                </select>
                <select value={filterSide} onChange={e => setFilterSide(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="all">유형: 전체</option>
                    <option value="seller">셀러</option>
                    <option value="host">호스트</option>
                </select>
            </div>

            {/* 캠페인 테이블 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">캠페인</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">담당</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">유형</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">예산</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">상태</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">작업</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                                        <p className="text-xs text-gray-400">{c.created_at}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.owner_name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.side === 'seller' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'}`}>
                                            {c.side === 'seller' ? '셀러' : '호스트'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">₩{(c.budget_total / 10000).toFixed(0)}만</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[c.status]?.cls || ''}`}>
                                            {STATUS_MAP[c.status]?.label || c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {c.status === 'review' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(c.id, 'approved')} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="승인">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(c.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="반려">
                                                        <Ban size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {c.status === 'active' && (
                                                <button onClick={() => handleStatusChange(c.id, 'paused')} className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title="일시정지">
                                                    <Clock size={16} />
                                                </button>
                                            )}
                                            {c.status === 'paused' && (
                                                <button onClick={() => handleStatusChange(c.id, 'active')} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg" title="활성화">
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="삭제">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">조건에 맞는 캠페인이 없습니다</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── 쿠폰 관리 탭 ──
function CouponsTab({ showToast }) {
    const [coupons, setCoupons] = useState(DEMO_COUPONS);
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        if (!searchTerm) return coupons;
        const term = searchTerm.toLowerCase();
        return coupons.filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term) || c.owner_name.toLowerCase().includes(term));
    }, [coupons, searchTerm]);

    const handleToggle = (id) => {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
    };

    const handleDelete = (id) => {
        if (!confirm('이 쿠폰을 삭제하시겠습니까?')) return;
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast('쿠폰이 삭제되었습니다');
    };

    const totalUsage = coupons.reduce((sum, c) => sum + c.usage_count, 0);

    return (
        <div className="space-y-6">
            {/* KPI */}
            <div className="grid grid-cols-3 gap-4">
                <KpiCard label="전체 쿠폰" value={coupons.length} icon={Gift} color="indigo" />
                <KpiCard label="활성 쿠폰" value={coupons.filter(c => c.status === 'active').length} icon={CheckCircle} color="emerald" />
                <KpiCard label="총 사용" value={totalUsage.toLocaleString() + '회'} icon={TrendingUp} color="amber" />
            </div>

            {/* 검색 */}
            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="쿠폰 이름, 코드, 담당자 검색..."
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            {/* 쿠폰 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map(coupon => (
                    <div key={coupon.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                        <div className={`px-4 py-3 ${coupon.status === 'active' ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : coupon.status === 'paused' ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}>
                            <p className="text-white font-bold text-lg">
                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₩${Number(coupon.value).toLocaleString()}`}
                            </p>
                            <p className="text-white/80 text-xs">{coupon.name}</p>
                        </div>
                        <div className="p-4">
                            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">{coupon.code}</code>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <p>담당: <span className="font-medium text-gray-900 dark:text-white">{coupon.owner_name}</span></p>
                                <p>유형: <span className={`px-1 py-0.5 rounded ${coupon.side === 'seller' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : coupon.side === 'platform' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'}`}>
                                    {coupon.side === 'seller' ? '셀러' : coupon.side === 'platform' ? '플랫폼' : '호스트'}</span></p>
                                <p>사용: <span className="font-semibold text-gray-900 dark:text-white">{coupon.usage_count}/{coupon.max_usage}</span></p>
                                <p className="flex items-center gap-1"><Clock size={10} /> ~{coupon.valid_until}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => handleToggle(coupon.id)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${coupon.status === 'active' ? 'text-amber-600 border border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20' : 'text-green-600 border border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20'}`}>
                                    {coupon.status === 'active' ? '정지' : '활성화'}
                                </button>
                                <button onClick={() => handleDelete(coupon.id)}
                                    className="py-1.5 px-3 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── 광고 심사 탭 ──
function AdsTab({ showToast }) {
    const [ads, setAds] = useState(DEMO_ADS);

    const handleApprove = (id) => {
        setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
        showToast('광고가 승인되었습니다');
    };

    const handleReject = (id) => {
        if (!confirm('이 광고를 반려하시겠습니까? 사유를 담당자에게 통보합니다.')) return;
        setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
        showToast('광고가 반려되었습니다');
    };

    const handleDelete = (id) => {
        if (!confirm('이 광고를 삭제하시겠습니까?')) return;
        setAds(prev => prev.filter(a => a.id !== id));
        showToast('광고가 삭제되었습니다');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <KpiCard label="전체 광고" value={ads.length} icon={Eye} color="indigo" />
                <KpiCard label="심사 대기" value={ads.filter(a => a.status === 'review').length} icon={Clock} color="amber" />
                <KpiCard label="승인 완료" value={ads.filter(a => a.status === 'approved').length} icon={CheckCircle} color="emerald" />
            </div>

            <div className="space-y-4">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${ad.status === 'review' ? 'bg-blue-100 dark:bg-blue-900/30' : ad.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    <Eye size={18} className={ad.status === 'review' ? 'text-blue-600' : ad.status === 'approved' ? 'text-green-600' : 'text-red-600'} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{ad.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{ad.owner_name} · {ad.type === 'banner' ? '배너 광고' : '스폰서 리스팅'}</p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_MAP[ad.status]?.cls || ''}`}>
                                {STATUS_MAP[ad.status]?.label || ad.status}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-400">예산</p>
                                <p className="font-medium text-gray-900 dark:text-white">₩{(ad.budget / 10000).toFixed(0)}만</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">기간</p>
                                <p className="font-medium text-gray-900 dark:text-white text-xs">{ad.duration}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">유형</p>
                                <p className="font-medium text-gray-900 dark:text-white">{ad.type === 'banner' ? '배너' : '스폰서'}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            {ad.status === 'review' && (
                                <>
                                    <button onClick={() => handleApprove(ad.id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
                                        <CheckCircle size={14} /> 승인
                                    </button>
                                    <button onClick={() => handleReject(ad.id)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
                                        <Ban size={14} /> 반려
                                    </button>
                                </>
                            )}
                            <button onClick={() => handleDelete(ad.id)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 transition-colors">
                                <Trash2 size={14} /> 삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── 통합 분석 탭 ──
function AnalyticsTab() {
    const stats = [
        { label: '전체 캠페인', value: '12', change: '+3', icon: Megaphone, color: 'indigo' },
        { label: '활성 쿠폰', value: '8', change: '+2', icon: Gift, color: 'emerald' },
        { label: '총 광고비', value: '₩430만', change: '+18%', icon: DollarSign, color: 'amber' },
        { label: '총 도달', value: '58.2K', change: '+24%', icon: Users, color: 'blue' },
    ];

    const topCampaigns = [
        { name: '봄 시즌 프로모션', owner: '강남 파티홀', roi: '+320%', side: 'host' },
        { name: '신규 고객 쿠폰', owner: '김셀러', roi: '+180%', side: 'seller' },
        { name: '배너 광고', owner: '스튜디오 A', roi: '+95%', side: 'host' },
    ];

    return (
        <div className="space-y-6">
            {/* KPI 대시보드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-${s.color}-100 dark:bg-${s.color}-900/30`}>
                                <s.icon size={18} className={`text-${s.color}-600 dark:text-${s.color}-400`} />
                            </div>
                            <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                                <ArrowUpRight size={12} /> {s.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* 상위 캠페인 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🏆 상위 캠페인 (ROI 기준)</h3>
                <div className="space-y-3">
                    {topCampaigns.map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{c.owner} · {c.side === 'seller' ? '셀러' : '호스트'}</p>
                            </div>
                            <span className="text-sm font-bold text-green-500">{c.roi}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 플랫폼 전체 현황 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 캠페인 유형 분포</h3>
                    <div className="space-y-3">
                        {[
                            { label: '인지도 향상', count: 5, percent: 42, color: 'bg-blue-500' },
                            { label: '전환 극대화', count: 4, percent: 33, color: 'bg-emerald-500' },
                            { label: '트래픽 유도', count: 3, percent: 25, color: 'bg-amber-500' },
                        ].map((t, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t.label}</span>
                                    <span className="text-xs text-gray-400">{t.count}개 ({t.percent}%)</span>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div className={`${t.color} h-2 rounded-full`} style={{ width: `${t.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">👤 셀러 vs 호스트</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">7</p>
                            <p className="text-xs text-gray-500 mt-1">셀러 캠페인</p>
                        </div>
                        <div className="flex-1 text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">5</p>
                            <p className="text-xs text-gray-500 mt-1">호스트 캠페인</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 flex overflow-hidden">
                        <div className="bg-teal-500 h-3" style={{ width: '58%' }} />
                        <div className="bg-violet-500 h-3" style={{ width: '42%' }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-teal-600 dark:text-teal-400">셀러 58%</span>
                        <span className="text-xs text-violet-600 dark:text-violet-400">호스트 42%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── 공통 KPI 카드 ──
function KpiCard({ label, value, icon: Icon, color }) {
    const colorMap = {
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.indigo}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    );
}
