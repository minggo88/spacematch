import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    TrendingUp, BarChart3, Users, DollarSign, Target, Gift,
    Megaphone, Zap, Eye, ShoppingCart, Star, ArrowUpRight,
    ArrowDownRight, Minus, ChevronRight, RefreshCw, Download,
    Calendar, Filter, PieChart, Activity, X, Plus, Clock,
    Trash2, Copy, Check, AlertCircle,
} from 'lucide-react';
import NumberInput from '../../components/NumberInput';

// ── 마케팅 모듈 import ──
import { computeSummaryStats, analyzeCountryPerformance, calculateGrowthRate, analyzeMonthlyTrend } from '../../../marketing/seller/analytics/sales-insights';
import { calculateRFMScores, assignSegment, getSegmentDistribution, extractCustomerData, runSegmentation } from '../../../marketing/seller/analytics/customer-segmentation';

const TABS = [
    { id: 'overview', icon: BarChart3, label: '마케팅 개요' },
    { id: 'analytics', icon: TrendingUp, label: '매출 분석' },
    { id: 'segments', icon: Users, label: '고객 세그먼트' },
    { id: 'promotions', icon: Gift, label: '프로모션' },
    { id: 'targeting', icon: Target, label: '타겟팅' },
];

const COLORS = {
    primary: '#059669',
    primaryLight: '#10b981',
    accent: '#8B5CF6',
    blue: '#3B82F6',
    amber: '#F59E0B',
    rose: '#F43F5E',
};

export default function SellerMarketing() {
    const { t } = useTranslation('common');
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('month');

    // ── 데모 데이터 (API 연동 시 교체) ──
    const demoRecords = useMemo(() => generateDemoData(), []);
    const summary = useMemo(() => computeSummaryStats(demoRecords), [demoRecords]);
    const monthlyTrend = useMemo(() => analyzeMonthlyTrend(demoRecords), [demoRecords]);
    const countryData = useMemo(() => analyzeCountryPerformance(demoRecords), [demoRecords]);
    const segmentation = useMemo(() => runSegmentation(demoRecords), [demoRecords]);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 px-6 py-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Megaphone size={28} />
                        마케팅 센터
                    </h1>
                    <p className="mt-2 text-emerald-100 text-sm">
                        매출 분석 · 고객 세그먼트 · 프로모션 · 타겟팅을 한곳에서 관리하세요
                    </p>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'overview' && <OverviewTab summary={summary} monthlyTrend={monthlyTrend} countryData={countryData} segmentation={segmentation} />}
                {activeTab === 'analytics' && <AnalyticsTab records={demoRecords} summary={summary} countryData={countryData} />}
                {activeTab === 'segments' && <SegmentsTab distribution={segmentation.distribution} />}
                {activeTab === 'promotions' && <PromotionsTab />}
                {activeTab === 'targeting' && <TargetingTab />}
            </div>
        </div>
    );
}

// ── 개요 탭 ──
function OverviewTab({ summary, monthlyTrend, countryData, segmentation }) {
    const lastGrowth = monthlyTrend.length >= 2 ? monthlyTrend[monthlyTrend.length - 1].revenueGrowth : 0;
    const kpis = [
        { label: '총 매출', value: formatKRW(summary.totalRevenue), change: lastGrowth, icon: DollarSign, color: COLORS.primary },
        { label: '데이터 건수', value: formatNum(summary.count), change: null, icon: ShoppingCart, color: COLORS.blue },
        { label: '최대 월 매출', value: formatKRW(summary.maxRevenue), change: null, icon: Star, color: COLORS.amber },
        { label: '활성 국가', value: `${countryData.length}개국`, change: null, icon: Eye, color: COLORS.accent },
    ];

    return (
        <div className="space-y-6">
            {/* KPI 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}15` }}>
                                <kpi.icon size={20} style={{ color: kpi.color }} />
                            </div>
                            {kpi.change !== null && <ChangeIndicator value={kpi.change} />}
                        </div>
                        <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* 퀵 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickAction icon={Gift} title="쿠폰 발행" desc="신규 할인 쿠폰을 만들어 매출을 높이세요" color={COLORS.rose} />
                <QuickAction icon={Zap} title="타임세일 시작" desc="한정 시간 특별 할인으로 긴급성을 높이세요" color={COLORS.amber} />
                <QuickAction icon={Target} title="타겟 오디언스" desc="맞춤 타겟팅으로 전환율을 극대화하세요" color={COLORS.accent} />
            </div>

            {/* 세그먼트 미니 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users size={18} /> 고객 세그먼트 분포
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {segmentation.distribution.slice(0, 4).map((seg, i) => (
                        <div key={i} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{seg.count}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{seg.label}</p>
                            <p className="text-xs text-emerald-500 font-medium">{seg.percentage}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 분석 탭 ──
function AnalyticsTab({ records, summary, countryData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 국가별 매출 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🌍 국가별 매출</h3>
                    <div className="space-y-3">
                        {countryData.slice(0, 6).map((c, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-12 text-gray-600 dark:text-gray-400">{c.countryCode}</span>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (c.revenue / (countryData[0]?.revenue || 1)) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white w-24 text-right">
                                    {formatKRW(c.revenue)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 매출 요약 통계 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 매출 요약</h3>
                    <div className="space-y-4">
                        <StatRow label="총 매출" value={formatKRW(summary.totalRevenue)} />
                        <StatRow label="평균 월 매출" value={formatKRW(summary.avgRevenue)} />
                        <StatRow label="최고 월 매출" value={formatKRW(summary.maxRevenue)} />
                        <StatRow label="총 거래" value={`${formatNum(summary.count)}건`} />
                        <StatRow label="평균 객단가" value={formatKRW(summary.avgRevenue)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── 세그먼트 탭 ──
function SegmentsTab({ distribution }) {
    const SEGMENT_COLORS = {
        champion: '#059669', loyal: '#10B981', potential_loyalist: '#34D399',
        new_customer: '#3B82F6', promising: '#8B5CF6', needs_attention: '#F59E0B',
        at_risk: '#F97316', lost: '#EF4444',
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">👥 RFM 고객 세그먼트</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {distribution.map((seg, i) => (
                        <div key={i} className="rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                            style={{ borderLeftWidth: '4px', borderLeftColor: SEGMENT_COLORS[seg.id] || '#6B7280' }}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{seg.icon} {seg.label}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ backgroundColor: SEGMENT_COLORS[seg.id] || '#6B7280' }}>
                                    {seg.count}명
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{seg.description || '고객 세그먼트'}</p>
                            <div className="mt-3 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full" style={{ width: `${seg.percentage}%`, backgroundColor: SEGMENT_COLORS[seg.id] || '#6B7280' }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">{seg.percentage}%</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">💡 세그먼트별 전략</h3>
                <div className="space-y-3">
                    {distribution.slice(0, 5).map((seg, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: SEGMENT_COLORS[seg.id] || '#6B7280' }} />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{seg.icon} {seg.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{seg.strategy || '맞춤형 마케팅 전략을 수립하세요'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 프로모션 탭 ──
function PromotionsTab() {
    const { user } = useAuth();
    const API_BASE = '/api';
    const [coupons, setCoupons] = useState([
        { id: 'demo1', name: '신규 고객 환영', code: 'SM-WELCOME15', type: 'percentage', value: 15, usage_count: 42, max_usage: 100, status: 'active', valid_from: '2026-01-01', valid_until: '2026-12-31' },
        { id: 'demo2', name: '단골 감사 쿠폰', code: 'SM-LOYAL20', type: 'percentage', value: 20, usage_count: 18, max_usage: 50, status: 'active', valid_from: '2026-01-01', valid_until: '2026-06-30' },
        { id: 'demo3', name: '시즌 한정', code: 'SM-SEASON10', type: 'fixed', value: 10000, usage_count: 0, max_usage: 200, status: 'scheduled', valid_from: '2026-03-01', valid_until: '2026-03-31' },
    ]);
    const [flashSales, setFlashSales] = useState([]);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [showFlashModal, setShowFlashModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // 쿠폰 생성 폼
    const [couponForm, setCouponForm] = useState({
        name: '', type: 'percentage', value: '', max_usage: '', min_order_amount: '',
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });

    // 타임세일 폼
    const [flashForm, setFlashForm] = useState({
        name: '', discount_percent: '', start_time: '', end_time: '', description: '',
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'SM-';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    };

    const handleCreateCoupon = async () => {
        if (!couponForm.name || !couponForm.value) { showToast('쿠폰 이름과 할인 값을 입력하세요', 'error'); return; }
        setSaving(true);
        try {
            const code = generateCode();
            const newCoupon = {
                id: `coupon_${Date.now()}`,
                ...couponForm,
                code,
                value: Number(couponForm.value),
                max_usage: Number(couponForm.max_usage) || 999,
                min_order_amount: Number(couponForm.min_order_amount) || 0,
                usage_count: 0,
                status: 'active',
                owner_id: user?.id,
            };
            // API 호출 (서버 미연결 시 로컬 추가)
            try {
                const res = await fetch(`${API_BASE}/../marketing/api/promotions.php?resource=coupons`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                    body: JSON.stringify(newCoupon),
                });
                const data = await res.json();
                if (data.success && data.id) newCoupon.id = data.id;
            } catch { /* 서버 미연결 시 로컬로 진행 */ }
            setCoupons(prev => [newCoupon, ...prev]);
            setShowCouponModal(false);
            setCouponForm({ name: '', type: 'percentage', value: '', max_usage: '', min_order_amount: '', valid_from: new Date().toISOString().split('T')[0], valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] });
            showToast(`쿠폰 "${newCoupon.name}" (${code})이 생성되었습니다!`);
        } finally { setSaving(false); }
    };

    const handleDeleteCoupon = (id) => {
        if (!confirm('이 쿠폰을 삭제하시겠습니까?')) return;
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast('쿠폰이 삭제되었습니다');
    };

    const handleToggleCouponStatus = (id) => {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => showToast(`쿠폰 코드 ${code} 복사됨`));
    };

    const handleCreateFlashSale = async () => {
        if (!flashForm.name || !flashForm.discount_percent || !flashForm.start_time || !flashForm.end_time) {
            showToast('모든 필수 항목을 입력하세요', 'error'); return;
        }
        setSaving(true);
        try {
            const newFlash = {
                id: `flash_${Date.now()}`, ...flashForm,
                discount_percent: Number(flashForm.discount_percent),
                status: 'scheduled', owner_id: user?.id,
            };
            try {
                const res = await fetch(`${API_BASE}/../marketing/api/promotions.php?resource=flash_sales`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                    body: JSON.stringify(newFlash),
                });
                const data = await res.json();
                if (data.success && data.id) newFlash.id = data.id;
            } catch { /* 로컬 진행 */ }
            setFlashSales(prev => [newFlash, ...prev]);
            setShowFlashModal(false);
            setFlashForm({ name: '', discount_percent: '', start_time: '', end_time: '', description: '' });
            showToast(`타임세일 "${newFlash.name}"이 생성되었습니다!`);
        } finally { setSaving(false); }
    };

    return (
        <div className="space-y-6">
            {/* 토스트 알림 */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* ── 쿠폰 관리 ── */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">🎟️ 쿠폰 관리 <span className="text-sm font-normal text-gray-400">({coupons.length}개)</span></h3>
                <button onClick={() => setShowCouponModal(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus size={16} /> 새 쿠폰 만들기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                        <div className={`px-4 py-3 ${coupon.status === 'active' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : coupon.status === 'paused' ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}>
                            <p className="text-white font-bold text-lg">
                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₩${Number(coupon.value).toLocaleString()}`}
                            </p>
                            <p className="text-white/80 text-xs">{coupon.name}</p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <button onClick={() => handleCopyCode(coupon.code)} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="클릭하여 복사">
                                    {coupon.code} <Copy size={10} />
                                </button>
                                <button onClick={() => handleToggleCouponStatus(coupon.id)}
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${coupon.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' :
                                        coupon.status === 'paused' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400' :
                                            'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                    {coupon.status === 'active' ? '✅ 활성' : coupon.status === 'paused' ? '⏸ 일시정지' : '📅 예약'}
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>사용: <span className="font-semibold text-gray-900 dark:text-white">{coupon.usage_count}/{coupon.max_usage || '∞'}</span></span>
                                <button onClick={() => handleDeleteCoupon(coupon.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1" title="삭제">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            {coupon.valid_until && (
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock size={10} /> ~{coupon.valid_until}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── 타임세일 섹션 ── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">⚡ 타임세일 <span className="text-sm font-normal text-gray-400">({flashSales.length}개)</span></h3>
                    <button onClick={() => setShowFlashModal(true)} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 px-3 py-1.5 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                        <Plus size={14} /> 새 타임세일
                    </button>
                </div>
                {flashSales.length > 0 ? (
                    <div className="space-y-3">
                        {flashSales.map(fs => (
                            <div key={fs.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg"><Zap size={18} className="text-amber-600 dark:text-amber-400" /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{fs.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{fs.discount_percent}% 할인 · {fs.start_time} ~ {fs.end_time}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${fs.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {fs.status === 'active' ? '진행 중' : '예약됨'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                        <Zap size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">현재 진행 중인 타임세일이 없습니다</p>
                        <p className="text-xs mt-1">타임세일을 시작하여 한정 시간 특별 할인을 제공하세요</p>
                    </div>
                )}
            </div>

            {/* ── 쿠폰 생성 모달 ── */}
            {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCouponModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Gift size={20} className="text-emerald-500" /> 새 쿠폰 만들기</h3>
                            <button onClick={() => setShowCouponModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">쿠폰 이름 *</label>
                                <input value={couponForm.name} onChange={e => setCouponForm(f => ({ ...f, name: e.target.value }))} placeholder="예: 신규 가입 환영 쿠폰" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">할인 유형</label>
                                    <select value={couponForm.type} onChange={e => setCouponForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option value="percentage">% 할인</option>
                                        <option value="fixed">₩ 정액 할인</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">할인 값 *</label>
                                    <NumberInput value={couponForm.value} onChange={val => setCouponForm(f => ({ ...f, value: val }))} placeholder={couponForm.type === 'percentage' ? '15' : '10,000'} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">최대 사용 횟수</label>
                                    <NumberInput value={couponForm.max_usage} onChange={val => setCouponForm(f => ({ ...f, max_usage: val }))} placeholder="100" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">최소 주문 금액</label>
                                    <NumberInput value={couponForm.min_order_amount} onChange={val => setCouponForm(f => ({ ...f, min_order_amount: val }))} placeholder="50,000" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">시작일</label>
                                    <input type="date" value={couponForm.valid_from} onChange={e => setCouponForm(f => ({ ...f, valid_from: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">종료일</label>
                                    <input type="date" value={couponForm.valid_until} onChange={e => setCouponForm(f => ({ ...f, valid_until: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            {/* 미리보기 */}
                            {couponForm.name && couponForm.value && (
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4 text-white">
                                    <p className="text-xs opacity-80">미리보기</p>
                                    <p className="font-bold text-xl mt-1">{couponForm.type === 'percentage' ? `${couponForm.value}% OFF` : `₩${Number(couponForm.value).toLocaleString()}`}</p>
                                    <p className="text-sm opacity-90 mt-0.5">{couponForm.name}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                            <button onClick={() => setShowCouponModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">취소</button>
                            <button onClick={handleCreateCoupon} disabled={saving} className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                {saving ? '생성 중...' : '쿠폰 생성'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 타임세일 생성 모달 ── */}
            {showFlashModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowFlashModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Zap size={20} className="text-amber-500" /> 새 타임세일</h3>
                            <button onClick={() => setShowFlashModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">세일 이름 *</label>
                                <input value={flashForm.name} onChange={e => setFlashForm(f => ({ ...f, name: e.target.value }))} placeholder="예: 봄맞이 특별 세일" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">할인율 (%) *</label>
                                <input type="number" min="1" max="90" value={flashForm.discount_percent} onChange={e => setFlashForm(f => ({ ...f, discount_percent: e.target.value }))} placeholder="30" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">시작 시간 *</label>
                                    <input type="datetime-local" value={flashForm.start_time} onChange={e => setFlashForm(f => ({ ...f, start_time: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">종료 시간 *</label>
                                    <input type="datetime-local" value={flashForm.end_time} onChange={e => setFlashForm(f => ({ ...f, end_time: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">설명</label>
                                <textarea value={flashForm.description} onChange={e => setFlashForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="타임세일 설명을 입력하세요" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                            <button onClick={() => setShowFlashModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">취소</button>
                            <button onClick={handleCreateFlashSale} disabled={saving} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                                {saving ? '생성 중...' : '타임세일 시작'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 타겟팅 탭 ──
function TargetingTab() {
    const PRESETS = [
        { id: 'vip', name: '고가치 고객 (VIP)', desc: '월 매출 상위 20% 고객', icon: '💎', conditions: { segment: 'champion', minRevenue: 500000 }, estimatedReach: 156 },
        { id: 'churn', name: '이탈 위험 고객', desc: '최근 3개월 비활성 고객', icon: '⚠️', conditions: { segment: 'at_risk', inactiveDays: 90 }, estimatedReach: 89 },
        { id: 'new', name: '신규 고객', desc: '최근 30일 내 첫 거래', icon: '🆕', conditions: { segment: 'new_customer', daysSinceFirst: 30 }, estimatedReach: 234 },
        { id: 'loyal', name: '충성 고객', desc: '6개월 이상 연속 거래', icon: '👑', conditions: { segment: 'loyal', minMonths: 6 }, estimatedReach: 312 },
        { id: 'dormant', name: '휴면 고객', desc: '6개월 이상 미접속', icon: '😴', conditions: { segment: 'hibernating', inactiveDays: 180 }, estimatedReach: 45 },
        { id: 'potential', name: '성장 잠재 고객', desc: '최근 활동이 증가하는 고객', icon: '🚀', conditions: { segment: 'potential_loyalist' }, estimatedReach: 178 },
    ];

    const COUNTRIES = ['전체', 'KR', 'US', 'JP', 'SG', 'VN', 'TH', 'KH', 'GB'];

    const [selectedPreset, setSelectedPreset] = useState(null);
    const [customFilters, setCustomFilters] = useState({ country: '전체', minRevenue: '', maxRevenue: '', segment: '' });
    const [showResult, setShowResult] = useState(false);

    const estimatedReach = useMemo(() => {
        if (selectedPreset) return PRESETS.find(p => p.id === selectedPreset)?.estimatedReach || 0;
        let base = 1024;
        if (customFilters.country !== '전체') base = Math.floor(base * 0.3);
        if (customFilters.minRevenue) base = Math.floor(base * 0.5);
        if (customFilters.segment) base = Math.floor(base * 0.4);
        return base;
    }, [selectedPreset, customFilters]);

    const handleApplyTarget = () => {
        setShowResult(true);
        setTimeout(() => setShowResult(false), 5000);
    };

    return (
        <div className="space-y-6">
            {/* 결과 알림 */}
            {showResult && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
                    <Check size={20} className="text-emerald-500" />
                    <div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">타겟 그룹이 설정되었습니다</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">예상 도달 {estimatedReach}명 · 프로모션 탭에서 쿠폰을 연결하세요</p>
                    </div>
                </div>
            )}

            {/* 빠른 타겟 프리셋 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📋 빠른 타겟 설정</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRESETS.map(preset => (
                        <button key={preset.id}
                            onClick={() => { setSelectedPreset(selectedPreset === preset.id ? null : preset.id); setCustomFilters({ country: '전체', minRevenue: '', maxRevenue: '', segment: '' }); }}
                            className={`flex items-center gap-3 p-4 rounded-lg transition-all text-left border-2 ${selectedPreset === preset.id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                                : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}>
                            <span className="text-2xl">{preset.icon}</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{preset.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{preset.desc}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{preset.estimatedReach}</p>
                                <p className="text-xs text-gray-400">예상 도달</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 커스텀 필터 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Filter size={16} /> 커스텀 필터</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">국가</label>
                        <select value={customFilters.country} onChange={e => { setCustomFilters(f => ({ ...f, country: e.target.value })); setSelectedPreset(null); }}
                            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">최소 매출</label>
                        <NumberInput value={customFilters.minRevenue} onChange={val => { setCustomFilters(f => ({ ...f, minRevenue: val })); setSelectedPreset(null); }}
                            placeholder="₩0" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">최대 매출</label>
                        <NumberInput value={customFilters.maxRevenue} onChange={val => { setCustomFilters(f => ({ ...f, maxRevenue: val })); setSelectedPreset(null); }}
                            placeholder="무제한" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">RFM 세그먼트</label>
                        <select value={customFilters.segment} onChange={e => { setCustomFilters(f => ({ ...f, segment: e.target.value })); setSelectedPreset(null); }}
                            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">전체</option>
                            <option value="champion">챔피언</option>
                            <option value="loyal">충성 고객</option>
                            <option value="potential_loyalist">잠재 충성</option>
                            <option value="new_customer">신규</option>
                            <option value="at_risk">이탈 위험</option>
                            <option value="hibernating">휴면</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 예상 결과 & 적용 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Target size={16} className="text-emerald-500" /> 예상 도달 범위
                        </h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{estimatedReach.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">명</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {selectedPreset ? `프리셋: ${PRESETS.find(p => p.id === selectedPreset)?.name}` : '커스텀 필터 기반 추정치'}
                        </p>
                    </div>
                    <button onClick={handleApplyTarget}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20">
                        <Target size={16} /> 타겟 그룹 설정
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── 공통 컴포넌트 ──
function QuickAction({ icon: Icon, title, desc, color }) {
    return (
        <button className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group">
            <div className="p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15` }}>
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 ml-auto" />
        </button>
    );
}

function ChangeIndicator({ value }) {
    if (value === null || value === undefined) return null;
    const isUp = value > 0;
    const Icon = isUp ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
    const color = isUp ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-400';
    return (
        <span className={`flex items-center gap-0.5 text-xs font-medium ${color}`}>
            <Icon size={14} />
            {Math.abs(value).toFixed(1)}%
        </span>
    );
}

function StatRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}

// ── 유틸리티 ──
function formatKRW(val) {
    if (!val) return '₩0';
    if (val >= 100000000) return `₩${(val / 100000000).toFixed(1)}억`;
    if (val >= 10000) return `₩${(val / 10000).toFixed(0)}만`;
    return `₩${val.toLocaleString()}`;
}

function formatNum(val) {
    if (!val) return '0';
    return val.toLocaleString();
}

function generateDemoData() {
    const records = [];
    const countries = ['KR', 'US', 'JP', 'SG', 'VN', 'TH'];
    const categories = ['웨딩홀', '스튜디오', '파티룸', '세미나실', '공유오피스'];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        countries.forEach(country => {
            records.push({
                record_date: date.toISOString().split('T')[0],
                record_type: 'monthly',
                country_code: country,
                monthly_revenue: Math.floor(Math.random() * 5000000) + 500000,
                transaction_count: Math.floor(Math.random() * 50) + 5,
                customer_count: Math.floor(Math.random() * 30) + 3,
                best_selling_item: categories[Math.floor(Math.random() * categories.length)],
            });
        });
    }
    return records;
}
