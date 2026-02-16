import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
    BarChart3, Eye, MousePointer, TrendingUp, Calendar,
    Clock, Percent, AlertTriangle, Loader2, Download, Layers
} from 'lucide-react';

// SLOT_LABELS moved into component

// ─── Canvas Chart ───
function ReportChart({ data, width = 600, height = 220 }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current || !data || data.length === 0) return;
        const ctx = canvasRef.current.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const pad = { top: 20, right: 20, bottom: 40, left: 50 };
        const cw = width - pad.left - pad.right;
        const ch = height - pad.top - pad.bottom;
        const maxVal = Math.max(...data.map(d => parseInt(d.views || 0)), 1);
        const barW = Math.max(Math.min(cw / data.length - 4, 24), 6);

        ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (ch / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
            ctx.fillStyle = '#9ca3af'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal * (1 - i / 4)).toLocaleString(), pad.left - 8, y + 3);
        }

        data.forEach((d, i) => {
            const x = pad.left + (cw / data.length) * i + (cw / data.length - barW) / 2;
            const v = parseInt(d.views || 0);
            const c = parseInt(d.clicks || 0);
            const vh = (v / maxVal) * ch;
            const ch2 = (c / maxVal) * ch;

            const grad = ctx.createLinearGradient(x, pad.top + ch - vh, x, pad.top + ch);
            grad.addColorStop(0, '#818cf8'); grad.addColorStop(1, '#6366f1');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.roundRect(x, pad.top + ch - vh, barW, vh, [3, 3, 0, 0]); ctx.fill();

            if (ch2 > 0) {
                const grad2 = ctx.createLinearGradient(x, pad.top + ch - ch2, x, pad.top + ch);
                grad2.addColorStop(0, '#34d399'); grad2.addColorStop(1, '#10b981');
                ctx.fillStyle = grad2;
                ctx.beginPath(); ctx.roundRect(x, pad.top + ch - ch2, barW, ch2, [3, 3, 0, 0]); ctx.fill();
            }

            ctx.fillStyle = '#9ca3af'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
            const label = d.stat_date ? d.stat_date.substring(5) : '';
            ctx.fillText(label, x + barW / 2, height - pad.bottom + 16);
        });
    }, [data, width, height]);
    return <canvas ref={canvasRef} style={{ width, height }} className="w-full" />;
}

const CampaignSharePage = () => {
    const { t } = useTranslation('ads');
    const SLOT_LABELS = {
        seller_community_top: t('slots.sellerCommunityTop', 'Seller Community Top'),
        seller_community_feed: t('slots.sellerCommunityFeed', 'Seller Community Feed'),
        seller_dashboard_top: t('slots.sellerDashboardTop', 'Seller Dashboard Top'),
        seller_dashboard_mid: t('slots.sellerDashboardMid', 'Seller Dashboard Mid'),
        vendor_dashboard_top: t('slots.vendorDashboardTop', 'Vendor Dashboard Top'),
        vendor_dashboard_mid: t('slots.vendorDashboardMid', 'Vendor Dashboard Mid'),
        general_community_top: t('slots.generalCommunityTop', 'General Community'),
        general_community_feed: t('slots.generalCommunityFeed', 'General Feed'),
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
                const res = await fetch(`/api/ads/campaign_share_report.php?token=${token}`);
                const data = await res.json();
                if (data.success) { setReport(data); }
                else { setError(data.message || 'Failed to load report'); }
            } catch { setError('서버 연결에 실패했습니다.'); }
            finally { setLoading(false); }
        };
        fetchReport();
    }, [token]);

    const handleExcelDownload = () => {
        if (!report) return;
        let csv = '\uFEFF캠페인 통합 리포트\n';
        csv += `캠페인명,${report.campaign.name}\n`;
        csv += `광고주,${report.campaign.advertiser || '-'}\n`;
        csv += `기간,${report.campaign.start_date || '-'} ~ ${report.campaign.end_date || '진행 중'}\n\n`;
        csv += '광고,슬롯,노출,클릭,CTR\n';
        (report.ads || []).forEach(a => {
            const v = parseInt(a.view_count || 0);
            const c = parseInt(a.click_count || 0);
            const ctr = v > 0 ? ((c / v) * 100).toFixed(2) : '0.00';
            csv += `"${a.title}",${SLOT_LABELS[a.slot_id] || a.slot_id},${v},${c},${ctr}%\n`;
        });
        csv += `\n합계,,${report.summary.total_views},${report.summary.total_clicks},${report.summary.ctr}%\n`;
        if (report.daily_stats?.length > 0) {
            csv += '\n날짜,노출,클릭\n';
            report.daily_stats.forEach(d => { csv += `${d.stat_date},${d.views},${d.clicks}\n`; });
        }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `campaign_report_${report.campaign.name}.csv`;
        link.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={40} /><p className="text-sm text-gray-400 mt-4">리포트 로딩 중...</p></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
                    <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">리포트를 확인할 수 없습니다</h2>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    const s = report.summary;
    const statusLabels = { active: '진행 중', paused: '일시정지', completed: '완료' };
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
    const totalViewsForBar = Math.max(s.total_views, 1);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Layers className="opacity-80" size={24} />
                        <span className="text-indigo-200 text-sm font-medium">캠페인 통합 리포트</span>
                    </div>
                    <h1 className="text-2xl font-extrabold mb-1">{report.campaign.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-indigo-200">
                        {report.campaign.advertiser && <span>{report.campaign.advertiser}</span>}
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">{statusLabels[report.campaign.status] || report.campaign.status}</span>
                        {report.campaign.start_date && <span>{report.campaign.start_date} ~ {report.campaign.end_date || '진행 중'}</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-4 pb-12">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: '총 노출', value: s.total_views.toLocaleString(), icon: <Eye size={18} />, bg: 'bg-indigo-500' },
                        { label: '총 클릭', value: s.total_clicks.toLocaleString(), icon: <MousePointer size={18} />, bg: 'bg-emerald-500' },
                        { label: 'CTR', value: s.ctr + '%', icon: <Percent size={18} />, bg: 'bg-amber-500' },
                        { label: '집행일', value: s.running_days + '일', icon: <Calendar size={18} />, bg: 'bg-violet-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center text-white mb-3`}>{stat.icon}</div>
                            <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                            <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Daily avg */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
                        <TrendingUp size={20} className="text-indigo-500" />
                        <div>
                            <p className="text-lg font-extrabold text-indigo-700">{s.avg_daily_views}</p>
                            <p className="text-[11px] text-indigo-400 font-medium">일평균 노출</p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
                        <MousePointer size={20} className="text-emerald-500" />
                        <div>
                            <p className="text-lg font-extrabold text-emerald-700">{s.avg_daily_clicks}</p>
                            <p className="text-[11px] text-emerald-400 font-medium">일평균 클릭</p>
                        </div>
                    </div>
                </div>

                {/* Ad Breakdown */}
                {report.ads?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <BarChart3 size={16} className="text-indigo-500" /> 광고별 성과 ({report.ads.length}개)
                        </h3>
                        {/* Stacked Bar */}
                        <div className="flex rounded-full h-3 overflow-hidden mb-4">
                            {report.ads.map((a, i) => {
                                const pct = (parseInt(a.view_count || 0) / totalViewsForBar) * 100;
                                return <div key={i} style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} className="transition-all" title={`${a.title}: ${pct.toFixed(1)}%`} />;
                            })}
                        </div>
                        {/* Ad List */}
                        <div className="space-y-2">
                            {report.ads.map((a, i) => {
                                const v = parseInt(a.view_count || 0);
                                const c = parseInt(a.click_count || 0);
                                const ctr = v > 0 ? ((c / v) * 100).toFixed(2) : '0.00';
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                                        {a.image_url && <img src={a.image_url} alt="" className="w-12 h-8 object-cover rounded-lg border" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 truncate">{a.title}</p>
                                            <p className="text-[10px] text-gray-400">{SLOT_LABELS[a.slot_id] || a.slot_id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-700">{v.toLocaleString()} <span className="text-gray-400 font-medium">Impressions</span></p>
                                            <p className="text-[10px]"><span className="text-emerald-600 font-bold">{c.toLocaleString()}</span> 클릭 · <span className="text-indigo-600 font-bold">{ctr}%</span></p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Daily Chart */}
                {report.daily_stats?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <Clock size={16} className="text-violet-500" /> 일별 추이
                        </h3>
                        <div className="flex items-center gap-4 mb-2 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-indigo-500 inline-block" /> 노출</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-emerald-500 inline-block" /> 클릭</span>
                        </div>
                        <ReportChart data={report.daily_stats} />
                    </div>
                )}

                {/* Excel Download */}
                <div className="text-center">
                    <button onClick={handleExcelDownload} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                        <Download size={16} /> Excel 다운로드
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-gray-300 mt-8">Spacematch Campaign Report · Generated at {new Date().toLocaleDateString('ko-KR')}</p>
            </div>
        </div>
    );
};

export default CampaignSharePage;
