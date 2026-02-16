import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
    BarChart3, Eye, MousePointer, TrendingUp, Calendar,
    Clock, Percent, AlertTriangle, Loader2, Download
} from 'lucide-react';

const API_BASE = '/api/ads';

// SLOT_LABELS moved into component

// Same chart as AdminAdDashboard but standalone
const ReportChart = ({ data, width = 600, height = 220 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const padding = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        ctx.clearRect(0, 0, width, height);

        const maxVal = Math.max(...data.map(d => Math.max(d.views, d.clicks)), 1);
        const barGroupW = chartW / data.length;
        const barW = Math.min(barGroupW * 0.35, 20);
        const gap = 2;

        // Grid
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            ctx.fillStyle = '#9ca3af';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toLocaleString(), padding.left - 6, y + 3);
        }

        // Bars
        data.forEach((d, i) => {
            const x = padding.left + barGroupW * i + barGroupW / 2;

            const viewH = (d.views / maxVal) * chartH;
            const g1 = ctx.createLinearGradient(0, padding.top + chartH - viewH, 0, padding.top + chartH);
            g1.addColorStop(0, '#818cf8');
            g1.addColorStop(1, '#4f46e5');
            ctx.fillStyle = g1;
            ctx.beginPath();
            ctx.roundRect(x - barW - gap / 2, padding.top + chartH - viewH, barW, viewH, [3, 3, 0, 0]);
            ctx.fill();

            const clickH = (d.clicks / maxVal) * chartH;
            const g2 = ctx.createLinearGradient(0, padding.top + chartH - clickH, 0, padding.top + chartH);
            g2.addColorStop(0, '#34d399');
            g2.addColorStop(1, '#059669');
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.roundRect(x + gap / 2, padding.top + chartH - clickH, barW, clickH, [3, 3, 0, 0]);
            ctx.fill();

            ctx.fillStyle = '#9ca3af';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x, padding.top + chartH + 14);
            ctx.rotate(-0.5);
            ctx.fillText(d.stat_date.slice(5), 0, 0);
            ctx.restore();
        });
    }, [data, width, height]);

    return <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width }} />;
};

const AdSharePage = () => {
    const { t } = useTranslation('ads');
    const SLOT_LABELS = {
        seller_community_top: t('slots.sellerCommunityTop', 'Seller Community Top'),
        seller_community_feed: t('slots.sellerCommunityFeed', 'Seller Community Feed'),
        seller_dashboard_top: t('slots.sellerDashboardTop', 'Seller Dashboard Top'),
        seller_dashboard_mid: t('slots.sellerDashboardMid', 'Seller Dashboard Mid'),
        vendor_dashboard_top: t('slots.vendorDashboardTop', 'Vendor Dashboard Top'),
        vendor_dashboard_mid: t('slots.vendorDashboardMid', 'Vendor Dashboard Mid'),
        general_community_top: t('slots.generalCommunityTop', 'General Community Top'),
        general_community_feed: t('slots.generalCommunityFeed', 'General Community Feed'),
        landing_a: t('slots.landingA', 'Landing A'),
        landing_b: t('slots.landingB', 'Landing B'),
        landing_b2: t('slots.landingB2', 'Landing B2'),
    };
    const { token } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`${API_BASE}/ad_share_report.php?token=${token}`);
                const data = await res.json();
                if (data.success) {
                    setReport(data);
                } else {
                    setError(data.message || 'Failed to load report');
                }
            } catch {
                setError('서버에 연결할 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
                    <p className="text-gray-500 font-medium">리포트 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center">
                    <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">접근 불가</h1>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    const { ad, summary, daily_stats } = report;
    const chartWidth = Math.max(600, daily_stats.length * 40);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            {/* Top branding */}
            <header className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                        <BarChart3 size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-sm font-black text-gray-900">SpaceMatch</h1>
                        <p className="text-[10px] text-gray-400 font-medium">광고 성과 리포트</p>
                    </div>
                    <a href={`${API_BASE}/ad_share_export.php?token=${token}`} download className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md">
                        <Download size={14} />
                        Export Excel
                    </a>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Ad info card */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                        <h2 className="text-xl font-black">{ad.title}</h2>
                        <div className="flex items-center gap-3 mt-2 text-xs text-indigo-200">
                            <span className="bg-white/15 px-2 py-0.5 rounded-lg">{SLOT_LABELS[ad.slot_id] || ad.slot_id}</span>
                            {ad.start_date && (
                                <span className="flex items-center gap-1"><Calendar size={11} /> {ad.start_date} ~ {ad.end_date || '진행중'}</span>
                            )}
                        </div>
                    </div>

                    {/* Image preview */}
                    {ad.image_url && (
                        <div className="p-4">
                            <img src={ad.image_url} alt={ad.title} className="w-full max-h-48 object-cover rounded-2xl" />
                        </div>
                    )}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: '총 노출수', value: summary.total_views.toLocaleString(), icon: <Eye size={18} />, color: 'from-blue-500 to-indigo-600' },
                        { label: '총 클릭수', value: summary.total_clicks.toLocaleString(), icon: <MousePointer size={18} />, color: 'from-emerald-500 to-teal-600' },
                        { label: 'CTR', value: summary.ctr + '%', icon: <Percent size={18} />, color: 'from-orange-500 to-red-500' },
                        { label: '집행 일수', value: summary.running_days + '일', icon: <Clock size={18} />, color: 'from-violet-500 to-purple-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                            <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`}>
                                {stat.icon}
                            </div>
                            <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                            <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Daily avg */}
                <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-6">
                    <TrendingUp size={20} className="text-indigo-500" />
                    <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 font-medium">Daily Avg Impressions</span>
                            <p className="text-lg font-extrabold text-gray-900">{summary.avg_daily_views}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">일평균 클릭</span>
                            <p className="text-lg font-extrabold text-gray-900">{summary.avg_daily_clicks}</p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                {daily_stats.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <BarChart3 size={16} className="text-indigo-500" />
                            일별 추이
                        </h3>
                        <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-b from-indigo-400 to-indigo-600" />노출수</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600" />클릭수</span>
                        </div>
                        <div className="overflow-x-auto">
                            <ReportChart data={daily_stats} width={chartWidth} height={220} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center text-gray-400">
                        <BarChart3 size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium">일별 데이터가 아직 없습니다</p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-6">
                    <p className="text-xs text-gray-300 font-medium">Powered by SpaceMatch · 광고 성과 리포트</p>
                </div>
            </main>
        </div>
    );
};

export default AdSharePage;
