import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    TrendingUp, BarChart3, Users, DollarSign, Target, Palette,
    Megaphone, Eye, ShoppingBag, Star, ArrowUpRight, ArrowDownRight,
    Minus, ChevronRight, Globe, Handshake, Award, PieChart,
    Layers, Sparkles, MapPin, FileText, X, Plus, RefreshCw,
    Check, AlertCircle, Trash2, Pause, Play,
} from 'lucide-react';
import NumberInput from '../../components/NumberInput';

// ── 마케팅 모듈 import ──
import { calculateProfileCompleteness } from '../../../marketing/host/branding/brand-profile';
import { BRAND_MOODS, generateColorPalette } from '../../../marketing/host/branding/visual-identity';
import { calculateSimpleROI, calculateROAS } from '../../../marketing/host/reporting/roi-calculator';
import { ANALYSIS_DIMENSIONS } from '../../../marketing/host/reporting/competitor-analysis';

const TABS = [
    { id: 'overview', icon: BarChart3, label: '마케팅 개요' },
    { id: 'branding', icon: Palette, label: '브랜딩' },
    { id: 'advertising', icon: Megaphone, label: '광고' },
    { id: 'distribution', icon: Globe, label: '유통' },
    { id: 'reporting', icon: PieChart, label: '리포팅' },
];

const COLORS = {
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    blue: '#3B82F6',
    emerald: '#059669',
    amber: '#F59E0B',
    rose: '#F43F5E',
};

export default function VendorMarketing() {
    const { t } = useTranslation('common');
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // ── 데모: 브랜드 프로필 완성도 ──
    const profileCompleteness = useMemo(() => {
        const demoProfile = {
            basic: { name: user?.name || 'Demo Vendor', slogan: '최고의 공간 경험', category: 'venue_rental', founded: 2020 },
            contact: { phone: '02-1234-5678', email: 'info@demo.com' },
            story: { mission: '혁신적인 공간 매칭으로 새로운 경험을 만듭니다' },
            name: user?.name || 'Demo Vendor',
            location: '서울 강남구',
            category: 'popup_store',
            description: '혁신적인 공간 매칭 서비스',
            logo: '/logo.png',
            coverImage: '/cover.jpg',
            gallery: ['img1.jpg', 'img2.jpg'],
            phone: '02-1234-5678',
            email: 'info@demo.com',
        };
        return calculateProfileCompleteness(demoProfile);
    }, [user]);

    // ── 데모: ROI ──
    const demoROI = useMemo(() => calculateSimpleROI(12500000, 3000000), []);
    const demoROAS = useMemo(() => calculateROAS(12500000, 3000000), []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-800 dark:to-purple-800 px-6 py-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Megaphone size={28} />
                        호스트 마케팅 센터
                    </h1>
                    <p className="mt-2 text-violet-100 text-sm">
                        브랜딩 · 광고 · 유통 · 리포팅을 한곳에서 관리하세요
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
                                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
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
                {activeTab === 'overview' && <VendorOverviewTab profile={profileCompleteness} roi={demoROI} roas={demoROAS} />}
                {activeTab === 'branding' && <BrandingTab profile={profileCompleteness} />}
                {activeTab === 'advertising' && <AdvertisingTab roi={demoROI} roas={demoROAS} />}
                {activeTab === 'distribution' && <DistributionTab />}
                {activeTab === 'reporting' && <ReportingTab roi={demoROI} roas={demoROAS} />}
            </div>
        </div>
    );
}

// ── 개요 탭 ──
function VendorOverviewTab({ profile, roi, roas }) {
    const kpis = [
        { label: '브랜드 완성도', value: `${profile.overallPercent}%`, icon: Award, color: COLORS.primary, sub: profile.tierLabel },
        { label: '총 수익', value: '₩12.5M', icon: DollarSign, color: COLORS.emerald, sub: '+17.3%' },
        { label: 'ROI', value: roi.roiPercent, icon: TrendingUp, color: COLORS.blue, sub: roi.costEfficiency },
        { label: 'ROAS', value: roas.label, icon: PieChart, color: COLORS.amber, sub: roas.interpretation },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${kpi.color}15` }}>
                            <kpi.icon size={20} style={{ color: kpi.color }} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
                        {kpi.sub && <p className="text-xs text-violet-500 mt-1">{kpi.sub}</p>}
                    </div>
                ))}
            </div>

            {/* 퀵 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VQuickAction icon={Palette} title="브랜드 프로필 완성" desc={`현재 ${profile.overallPercent}% — 나머지를 채우세요`} color={COLORS.primary} />
                <VQuickAction icon={Megaphone} title="광고 캠페인 시작" desc="타겟 광고로 셀러에게 도달하세요" color={COLORS.rose} />
                <VQuickAction icon={Handshake} title="셀러 매칭" desc="AI가 최적의 셀러를 추천해 드려요" color={COLORS.emerald} />
            </div>

            {/* 프로필 완성도 바 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-violet-500" /> 브랜드 프로필 완성도
                </h3>
                <div className="space-y-3">
                    {Object.entries(profile.sections || {}).map(([key, section]) => (
                        <div key={key}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">{section.label || key}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{section.completion || 0}%</span>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${section.completion || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 브랜딩 탭 ──
function BrandingTab({ profile }) {
    const moods = Object.values(BRAND_MOODS || {});

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🎨 비주얼 아이덴티티 — 분위기 프리셋</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moods.slice(0, 6).map((mood, i) => {
                        const palette = generateColorPalette ? generateColorPalette(mood.colors) : null;
                        return (
                            <button key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-left group">
                                {palette && (
                                    <div className="flex gap-1 mb-3">
                                        {palette && Object.values(palette).slice(0, 5).map((c, j) => (
                                            <div key={j} className="w-8 h-8 rounded-full" style={{ backgroundColor: typeof c === 'string' ? c : c.base || '#ccc' }} />
                                        ))}
                                    </div>
                                )}
                                <p className="font-medium text-gray-900 dark:text-white">{mood.label || mood.id}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mood.description || ''}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📖 브랜드 스토리 프레임워크</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { name: '창립 스토리', desc: '브랜드 시작과 여정을 이야기하세요', icon: '🌱' },
                        { name: '미션 선언', desc: '핵심 가치와 목표를 전달하세요', icon: '🎯' },
                        { name: '사람들의 이야기', desc: '팀과 고객의 경험을 공유하세요', icon: '👥' },
                        { name: '공간의 이야기', desc: '공간이 가진 특별한 가치를 전하세요', icon: '🏛️' },
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-2xl">{f.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{f.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 광고 탭 ──
function AdvertisingTab({ roi, roas }) {
    const { user } = useAuth();
    const API_BASE = '/api';
    const [campaigns, setCampaigns] = useState([
        { id: 'demo_c1', name: '봄 시즌 프로모션', type: 'awareness', status: 'active', budget_total: 500000, budget_spent: 180000, impressions: 12400, clicks: 890, created_at: '2026-02-01' },
        { id: 'demo_c2', name: '신규 공간 출시 캠페인', type: 'conversion', status: 'paused', budget_total: 300000, budget_spent: 120000, impressions: 8200, clicks: 340, created_at: '2026-01-15' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [form, setForm] = useState({ name: '', type: 'awareness', budget_total: '', budget_daily: '', description: '' });

    const showToastMsg = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const CAMPAIGN_TYPES = [
        { value: 'awareness', label: '인지도 향상', icon: Eye },
        { value: 'traffic', label: '트래픽 유도', icon: TrendingUp },
        { value: 'conversion', label: '전환 극대화', icon: Target },
    ];

    const handleCreate = async () => {
        if (!form.name || !form.budget_total) { showToastMsg('캠페인 이름과 예산을 입력하세요', 'error'); return; }
        setSaving(true);
        try {
            const newCampaign = {
                id: `cmp_${Date.now()}`, ...form, budget_total: Number(form.budget_total),
                budget_daily: Number(form.budget_daily) || Math.floor(Number(form.budget_total) / 30),
                budget_spent: 0, impressions: 0, clicks: 0, status: 'draft',
                owner_id: user?.id, side: 'host', created_at: new Date().toISOString().split('T')[0],
            };
            try {
                const res = await fetch(`${API_BASE}/../marketing/api/campaigns.php`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                    body: JSON.stringify({ name: form.name, type: form.type, side: 'host', owner_id: user?.id, description: form.description, budget: { total: newCampaign.budget_total, daily: newCampaign.budget_daily } }),
                });
                const data = await res.json();
                if (data.success && data.id) newCampaign.id = data.id;
            } catch { /* locally */ }
            setCampaigns(prev => [newCampaign, ...prev]);
            setShowModal(false);
            setForm({ name: '', type: 'awareness', budget_total: '', budget_daily: '', description: '' });
            showToastMsg(`캠페인 "${newCampaign.name}"이 생성되었습니다!`);
        } finally { setSaving(false); }
    };

    const toggleStatus = (id) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
    };

    const deleteCampaign = (id) => {
        if (!confirm('이 캠페인을 삭제하시겠습니까?')) return;
        setCampaigns(prev => prev.filter(c => c.id !== id));
        showToastMsg('캠페인이 삭제되었습니다');
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-violet-500'}`}>
                    {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* 광고 유형 카드 */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">📢 광고 캠페인 <span className="text-sm font-normal text-gray-400">({campaigns.length}개)</span></h3>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus size={16} /> 새 캠페인 만들기
                </button>
            </div>

            {/* 캠페인 목록 */}
            <div className="space-y-3">
                {campaigns.map(c => (
                    <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${c.status === 'active' ? 'bg-green-100 dark:bg-green-900/30' : c.status === 'paused' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <Megaphone size={18} className={c.status === 'active' ? 'text-green-600' : c.status === 'paused' ? 'text-amber-600' : 'text-gray-400'} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{CAMPAIGN_TYPES.find(t => t.value === c.type)?.label || c.type} · {c.created_at}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleStatus(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.status === 'active' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`} title={c.status === 'active' ? '일시정지' : '활성화'}>
                                    {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <button onClick={() => deleteCampaign(c.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity" title="삭제">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">예산</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">₩{(c.budget_total / 10000).toFixed(0)}만</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">사용</p>
                                <p className="text-sm font-semibold text-violet-600">₩{(c.budget_spent / 10000).toFixed(0)}만</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">노출</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.impressions.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">클릭</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.clicks.toLocaleString()}</p>
                            </div>
                        </div>
                        {/* 예산 사용률 바 */}
                        <div className="mt-2">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="bg-violet-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (c.budget_spent / c.budget_total) * 100)}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">{((c.budget_spent / c.budget_total) * 100).toFixed(0)}% 사용</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 성과 미니 카드 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📈 광고 성과</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStat label="ROI" value={roi.roiPercent} sub={roi.costEfficiency === 'profitable' ? '수익' : '적자'} />
                    <MiniStat label="ROAS" value={roas.label} sub={roas.interpretation} />
                    <MiniStat label="이익" value={`₩${(roi.profit / 10000).toFixed(0)}만`} sub="광고 이익" />
                    <MiniStat label="손익분기" value={roas.breakeven ? '달성' : '미달'} sub="수익성" />
                </div>
            </div>

            {/* 캠페인 생성 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Megaphone size={20} className="text-violet-500" /> 새 캠페인</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">캠페인 이름 *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="예: 봄 시즌 프로모션" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-violet-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">캠페인 목표</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CAMPAIGN_TYPES.map(ct => (
                                        <button key={ct.value} onClick={() => setForm(f => ({ ...f, type: ct.value }))}
                                            className={`p-3 rounded-lg border-2 text-center transition-all ${form.type === ct.value ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-violet-300'}`}>
                                            <ct.icon size={18} className={`mx-auto ${form.type === ct.value ? 'text-violet-500' : 'text-gray-400'}`} />
                                            <p className={`text-xs mt-1 font-medium ${form.type === ct.value ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500'}`}>{ct.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">총 예산 (₩) *</label>
                                    <NumberInput value={form.budget_total} onChange={val => setForm(f => ({ ...f, budget_total: val }))} placeholder="500,000" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">일 예산 (₩)</label>
                                    <NumberInput value={form.budget_daily} onChange={val => setForm(f => ({ ...f, budget_daily: val }))} placeholder="자동 배분" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">설명</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="캠페인 설명" className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none" />
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">취소</button>
                            <button onClick={handleCreate} disabled={saving} className="flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                {saving ? '생성 중...' : '캠페인 생성'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 유통 탭 ──
function DistributionTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: '셀러 매칭', desc: 'AI 기반 최적 셀러 추천 (7가지 기준)', icon: Users, color: COLORS.emerald },
                    { title: '지역 확장', desc: '8개국 시장 기회 평가 및 로드맵', icon: Globe, color: COLORS.blue },
                    { title: '파트너십', desc: '6유형 파트너 관리 및 공동 프로모션', icon: Handshake, color: COLORS.primary },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${item.color}15` }}>
                            <item.icon size={20} style={{ color: item.color }} />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                        <button className="mt-3 w-full py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-900/30 transition-colors">
                            관리하기
                        </button>
                    </div>
                ))}
            </div>

            {/* 지역 확장 지도 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🌏 진출 가능 시장</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { flag: '🇰🇷', name: '한국', status: 'active', color: 'green' },
                        { flag: '🇯🇵', name: '일본', status: 'evaluating', color: 'amber' },
                        { flag: '🇸🇬', name: '싱가포르', status: 'evaluating', color: 'amber' },
                        { flag: '🇻🇳', name: '베트남', status: 'planned', color: 'gray' },
                        { flag: '🇹🇭', name: '태국', status: 'planned', color: 'gray' },
                        { flag: '🇺🇸', name: '미국', status: 'planned', color: 'gray' },
                        { flag: '🇰🇭', name: '캄보디아', status: 'planned', color: 'gray' },
                        { flag: '🇬🇧', name: '영국', status: 'planned', color: 'gray' },
                    ].map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-2xl">{m.flag}</span>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    m.status === 'evaluating' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    {m.status === 'active' ? '활성' : m.status === 'evaluating' ? '검토 중' : '계획'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 리포팅 탭 ──
function ReportingTab({ roi, roas }) {
    const dimensions = Object.values(ANALYSIS_DIMENSIONS || {});

    return (
        <div className="space-y-6">
            {/* 경쟁사 벤치마크 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 경쟁사 벤치마크 (6차원)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dimensions.map((dim, i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span>{dim.icon}</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{dim.label}</span>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${50 + Math.random() * 40}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">가중치: {dim.weight}%</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ROI 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">💰 ROI 상세</h3>
                    <div className="space-y-3">
                        <StatRow label="총 투자" value="₩300만" />
                        <StatRow label="총 수익" value="₩1,250만" />
                        <StatRow label="순이익" value={`₩${(roi.profit / 10000).toFixed(0)}만`} />
                        <StatRow label="ROI" value={roi.roiPercent} />
                        <StatRow label="ROAS" value={roas.label} />
                        <StatRow label="판정" value={roi.costEfficiency === 'profitable' ? '✅ 수익' : '❌ 적자'} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📋 리포트 생성</h3>
                    <div className="space-y-3">
                        {[
                            { name: '대시보드 리포트', desc: 'KPI 요약 및 퍼널 분석', icon: '📊' },
                            { name: 'ROI 리포트', desc: '캠페인별 투자 수익 분석', icon: '💰' },
                            { name: '경쟁사 분석', desc: 'SWOT 및 포지셔닝 맵', icon: '🏆' },
                            { name: 'CSV 내보내기', desc: '전체 데이터 다운로드', icon: '📥' },
                        ].map((r, i) => (
                            <button key={i} className="flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                                <span className="text-xl">{r.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</p>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 ml-auto" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── 공통 컴포넌트 ──
function VQuickAction({ icon: Icon, title, desc, color }) {
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

function MiniStat({ label, value, sub }) {
    return (
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            {sub && <p className="text-xs text-violet-500 mt-0.5">{sub}</p>}
        </div>
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
