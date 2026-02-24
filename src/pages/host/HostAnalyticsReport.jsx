import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3, TrendingUp, Eye, Users, Store, CheckCircle, Clock, XCircle,
    Zap, ArrowUpRight, ArrowDownRight, Trophy, PieChart, Activity, Calendar,
    RefreshCw, Lock, Download, ArrowRight, Minus
} from 'lucide-react';

const API_BASE = '/api';

// CATEGORY_LABELS moved into component

const HostAnalyticsReport = () => {
    const { t } = useTranslation('host');
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [hasAccess, setHasAccess] = useState(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/venues/host_report.php`, { credentials: 'include' });
            const json = await res.json();
            if (json.success) setData(json.data);
        } catch (err) {
            console.error('리포트 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE}/users/check_service.php?service=analytics_report`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setHasAccess(data.hasAccess ?? false);
                if (data.hasAccess) fetchReport();
                else setLoading(false);
            })
            .catch(() => { setHasAccess(false); setLoading(false); });
    }, []);

    const getCatLabel = (cat) => CATEGORY_LABELS[cat] || cat || '기타';

    // CSV export helper
    const exportCSV = () => {
        if (!data?.venues) return;
        const headers = ['공간명', '위치', '상태', '가격', '조회수', '신청수', '승인수', '거절수', '대기수', '전환율(%)'];
        const rows = data.venues.map(v => [
            v.name, v.location, v.status === 'approved' ? '운영 중' : v.status,
            v.price, v.view_count, v.app_count, v.approved_count, v.rejected_count, v.pending_count, v.conversion_rate
        ]);
        const csv = '\uFEFF' + [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `공간분석_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (loading || hasAccess === null) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            </div>
        );
    }

    if (hasAccess === false) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-violet-500 dark:text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">분석 리포트 서비스</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                        이 서비스는 유료 구독 후 이용할 수 있습니다.<br />
                        관리자에게 문의하여 서비스를 활성화하세요.
                    </p>
                    <div className="bg-violet-50 dark:bg-violet-950/50 rounded-2xl p-4 border border-violet-100 dark:border-violet-800">
                        <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2">📊 포함된 기능</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
                            <li>• 공간별 조회수/신청수/전환율 분석</li>
                            <li>• vs Last Month 성과 비교 및 증감률</li>
                            <li>• 전환 퍼널 및 요일별 히트맵</li>
                            <li>• CSV 데이터 내보내기</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <BarChart3 className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">Unable to load report</h3>
            </div>
        );
    }

    const { summary, venues, monthlyTrend, appsByCategory, recentApps, venueRanking, previousPeriod, weekdayStats } = data;

    // Growth indicator helper
    const GrowthBadge = ({ value }) => {
        if (value === 0 || value === undefined) return <span className="flex items-center gap-0.5 text-xs font-bold text-gray-400"><Minus size={12} /> 0%</span>;
        const isPositive = value > 0;
        return (
            <span className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {isPositive ? '+' : ''}{value}%
            </span>
        );
    };

    // Bar component with dark mode
    const Bar = ({ value, max, color = 'bg-indigo-500' }) => (
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div className={`h-full rounded-full ${color} transition-all duration-500`}
                style={{ width: `${max > 0 ? Math.min(value / max * 100, 100) : 0}%` }} />
        </div>
    );

    const tabs = [
        { id: 'overview', label: '개요', icon: PieChart },
        { id: 'venues', label: '공간별 분석', icon: Store },
        { id: 'trends', label: '트렌드', icon: Activity },
    ];

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">📊 분석 리포트</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">내 공간의 성과를 한눈에 확인하세요</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800">
                        <Download size={16} /> CSV 내보내기
                    </button>
                    <button onClick={fetchReport} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800">
                        <RefreshCw size={16} /> 새로고침
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: '등록 공간', value: summary.totalVenues, icon: Store, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', borderColor: 'border-indigo-100 dark:border-indigo-800' },
                    { label: '운영 중', value: summary.activeVenues, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-100 dark:border-emerald-800' },
                    { label: '총 조회수', value: summary.totalViews?.toLocaleString(), icon: Eye, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40', borderColor: 'border-sky-100 dark:border-sky-800' },
                    { label: 'Total Applications수', value: summary.totalApps, icon: Users, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', borderColor: 'border-violet-100 dark:border-violet-800' },
                    { label: '승인 수', value: summary.totalApproved, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-green-50 dark:bg-green-950/40', borderColor: 'border-green-100 dark:border-green-800' },
                    { label: '전환율', value: `${summary.conversionRate}%`, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', borderColor: 'border-amber-100 dark:border-amber-800' },
                ].map((kpi, i) => (
                    <div key={i} className={`${kpi.bg} rounded-2xl p-4 border ${kpi.borderColor}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <kpi.icon size={16} className={kpi.color} />
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{kpi.label}</span>
                        </div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Period Comparison */}
                    {previousPeriod && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Calendar size={14} /> vs Last Month 성과 비교
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: '신청수', current: previousPeriod.currentApps, prev: previousPeriod.prevApps, growth: previousPeriod.appsGrowth, color: 'indigo' },
                                    { label: '승인수', current: previousPeriod.currentApproved, prev: previousPeriod.prevApproved, growth: previousPeriod.approvedGrowth, color: 'emerald' },
                                    { label: '전환율', current: `${previousPeriod.currentConversion}%`, prev: `${previousPeriod.prevConversion}%`, growth: previousPeriod.prevConversion > 0 ? parseFloat(((previousPeriod.currentConversion - previousPeriod.prevConversion) / previousPeriod.prevConversion * 100).toFixed(1)) : 0, color: 'amber' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{item.label}</span>
                                            <GrowthBadge value={item.growth} />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">이번 달</p>
                                                <p className={`text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`}>{item.current}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 mb-1.5" />
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">지난 달</p>
                                                <p className="text-lg font-bold text-gray-400 dark:text-gray-500">{item.prev}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Conversion Funnel */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={14} /> 전환 퍼널
                        </h3>
                        <div className="flex items-center justify-center gap-0">
                            {[
                                { label: '조회', value: summary.totalViews, color: 'bg-sky-500', width: '100%' },
                                { label: '신청', value: summary.totalApps, color: 'bg-violet-500', width: summary.totalViews > 0 ? `${Math.max(Math.round(summary.totalApps / summary.totalViews * 100), 30)}%` : '60%' },
                                { label: '승인', value: summary.totalApproved, color: 'bg-emerald-500', width: summary.totalViews > 0 ? `${Math.max(Math.round(summary.totalApproved / summary.totalViews * 100), 20)}%` : '30%' },
                            ].map((step, i, arr) => {
                                const convRate = i > 0 && arr[i - 1].value > 0
                                    ? (step.value / arr[i - 1].value * 100).toFixed(1)
                                    : null;
                                return (
                                    <React.Fragment key={i}>
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{step.label}</span>
                                            <div
                                                className={`${step.color} rounded-xl flex items-center justify-center transition-all duration-500`}
                                                style={{ width: step.width, height: '64px', minWidth: '80px' }}
                                            >
                                                <span className="text-white font-extrabold text-lg">{typeof step.value === 'number' ? step.value.toLocaleString() : step.value}</span>
                                            </div>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="flex flex-col items-center mx-1 flex-shrink-0">
                                                <ArrowRight size={20} className="text-gray-300 dark:text-gray-600" />
                                                {convRate && (
                                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">{convRate}%</span>
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Trend */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Calendar size={14} /> Monthly Application Trend
                            </h3>
                            {monthlyTrend.length > 0 ? (
                                <div className="space-y-3">
                                    {monthlyTrend.map((m, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-16 flex-shrink-0">{m.month}</span>
                                            <div className="flex-1">
                                                <Bar value={m.count} max={Math.max(...monthlyTrend.map(t => t.count))} color="bg-indigo-500" />
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{m.count} applications</span>
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{m.approved || 0} 승인</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">데이터가 없습니다</p>
                            )}
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <PieChart size={14} /> 신청자 카테고리 분포
                            </h3>
                            {appsByCategory.length > 0 ? (
                                <div className="space-y-3">
                                    {appsByCategory.map((cat, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-24 flex-shrink-0 truncate">{getCatLabel(cat.category)}</span>
                                            <div className="flex-1">
                                                <Bar value={cat.count} max={appsByCategory[0]?.count || 1} color="bg-violet-500" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">{cat.count} applications</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">데이터가 없습니다</p>
                            )}
                        </div>

                        {/* Recent Applications */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Clock size={14} /> 최근 신청 내역
                            </h3>
                            {recentApps.length > 0 ? (
                                <div className="space-y-2">
                                    {recentApps.map((app, i) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${app.is_priority == 1 ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${app.status === 'approved' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        {app.is_priority == 1 && <Zap size={11} className="text-amber-500" fill="currentColor" />}
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{app.seller_name}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">{app.venue_name} · {getCatLabel(app.seller_category)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                                                    ${app.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' :
                                                        app.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400'}`}>
                                                    {app.status === 'approved' ? '승인' : app.status === 'rejected' ? '거절' : '대기'}
                                                </span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(app.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">신청 내역이 없습니다</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Venues Tab */}
            {activeTab === 'venues' && (
                <div className="space-y-4">
                    {venues.length > 0 ? venues.map((v, i) => {
                        return (
                            <div key={v.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">{v.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                                {v.status === 'approved' ? '운영 중' : v.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{v.location} · {v.type} · ₩{parseInt(v.price || 0).toLocaleString()}/{v.pricing_unit || '일'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="text-center">
                                            <p className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{v.view_count}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">조회</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-extrabold text-violet-600 dark:text-violet-400">{v.app_count}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">신청</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{v.approved_count}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">승인</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-lg font-extrabold ${v.conversion_rate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : v.conversion_rate >= 20 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {v.conversion_rate}%
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">전환율</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">신청 현황</span>
                                        <div className="flex items-center gap-3 ml-auto">
                                            <span className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 승인 {v.approved_count}</span>
                                            <span className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 대기 {v.pending_count}</span>
                                            <span className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400"><span className="w-2 h-2 rounded-full bg-red-400" /> 거절 {v.rejected_count}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                        {v.app_count > 0 ? (
                                            <>
                                                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${v.approved_count / v.app_count * 100}%` }} />
                                                <div className="bg-yellow-400 h-full transition-all" style={{ width: `${v.pending_count / v.app_count * 100}%` }} />
                                                <div className="bg-red-400 h-full transition-all" style={{ width: `${v.rejected_count / v.app_count * 100}%` }} />
                                            </>
                                        ) : (
                                            <div className="bg-gray-200 dark:bg-gray-600 h-full w-full" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16">
                            <Store className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                            <p className="text-gray-400 dark:text-gray-500 font-medium">등록된 공간이 없습니다</p>
                        </div>
                    )}
                </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
                <div className="space-y-6">
                    {/* Weekday Heatmap */}
                    {weekdayStats && weekdayStats.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Calendar size={14} /> 요일별 신청 패턴
                                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 normal-case tracking-normal ml-1">최근 3개월</span>
                            </h3>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {(() => {
                                    const maxCount = Math.max(...weekdayStats.map(d => d.count), 1);
                                    return weekdayStats.map((d, i) => {
                                        const intensity = d.count / maxCount;
                                        const bgClass = intensity >= 0.8 ? 'bg-indigo-600 text-white' :
                                            intensity >= 0.5 ? 'bg-indigo-400 text-white' :
                                                intensity >= 0.2 ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' :
                                                    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
                                        return (
                                            <div key={i} className={`rounded-xl p-3 text-center transition-all ${bgClass}`}>
                                                <p className="text-xs font-bold mb-1">{d.day}</p>
                                                <p className="text-xl font-extrabold">{d.count}</p>
                                                <p className="text-[10px] opacity-70"> applications</p>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                            {/* Auto insight */}
                            {(() => {
                                const maxDay = weekdayStats.reduce((max, d) => d.count > max.count ? d : max, weekdayStats[0]);
                                const minDay = weekdayStats.reduce((min, d) => d.count < min.count ? d : min, weekdayStats[0]);
                                const total = weekdayStats.reduce((s, d) => s + d.count, 0);
                                if (total === 0) return null;
                                return (
                                    <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            💡 <strong className="text-indigo-600 dark:text-indigo-400">{maxDay.day}요일</strong>에 가장 많은 신청({maxDay.count} applications)이 들어오고,
                                            <strong className="text-gray-500 dark:text-gray-400"> {minDay.day}요일</strong>이 가장 적습니다({minDay.count} applications).
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Venue Performance Ranking */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Trophy size={14} /> 공간 성과 순위
                        </h3>
                        {venueRanking.length > 0 ? (
                            <div className="space-y-2">
                                {venueRanking.map((v, i) => (
                                    <div key={v.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0
                                            ${i === 0 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' : i === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : i === 2 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{v.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{v.location}</p>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Eye size={12} className="text-sky-500 dark:text-sky-400" />
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{v.view_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Users size={12} className="text-violet-500 dark:text-violet-400" />
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{v.app_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <TrendingUp size={12} className={v.conversion_rate >= 50 ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'} />
                                                <span className="font-bold text-gray-700 dark:text-gray-300">{v.conversion_rate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">데이터가 없습니다</p>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-gray-700 p-6">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">💡 성과 개선 팁</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: '사진을 추가하세요', desc: '사진이 5장 이상인 공간은 신청률이 평균 2배 높습니다.', icon: '📷' },
                                { title: '가격을 검토하세요', desc: '시세보다 10~20% 낮은 가격대가 가장 높은 전환율을 보입니다.', icon: '💰' },
                                { title: '빠른 응답이 핵심', desc: '24시간 내 승인/거절 응답하면 재신청률이 3배 높아집니다.', icon: '⚡' },
                            ].map((tip, i) => (
                                <div key={i} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur rounded-xl p-4">
                                    <span className="text-2xl">{tip.icon}</span>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-2">{tip.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostAnalyticsReport;
