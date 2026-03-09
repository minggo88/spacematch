import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart3, Eye, MousePointer, TrendingUp, X, Calendar, Clock, Percent,
    Share2, Copy, CheckCircle, ExternalLink, Loader2, Download, Layers
} from 'lucide-react';

const SLOT_KEY_MAP = {
    home_top: 'slotHomeTop', home_a: 'slotHomeA', home_a2: 'slotHomeA2', home_b: 'slotHomeB', home_b2: 'slotHomeB2',
    home_c: 'slotHomeC', home_d: 'slotHomeD', home_hero_bg: 'slotHomeHeroBg',
    directory_a: 'slotDirectoryA', directory_b: 'slotDirectoryB', directory_c: 'slotDirectoryC', directory_d: 'slotDirectoryD',
    seller_community_top: 'slotSellerCommunityTop', seller_community_feed: 'slotSellerCommunityFeed',
    host_community_top: 'slotHostCommunityTop', host_community_feed: 'slotHostCommunityFeed',
    general_community_top: 'slotGeneralCommunityTop', general_community_feed: 'slotGeneralCommunityFeed',
    landing_a: 'slotLandingA', landing_b: 'slotLandingB', landing_b2: 'slotLandingB2',
};

const API_BASE = '/api/ads';

// ─── Mini stacked bar chart (Canvas) ───
function CampaignChart({ data, width = 600, height = 200 }) {
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

        // Grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.top + (ch / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
            ctx.fillStyle = '#9ca3af'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal * (1 - i / 4)).toLocaleString(), pad.left - 8, y + 3);
        }

        // Bars (views = indigo, clicks = emerald overlay)
        data.forEach((d, i) => {
            const x = pad.left + (cw / data.length) * i + (cw / data.length - barW) / 2;
            const v = parseInt(d.views || 0);
            const c = parseInt(d.clicks || 0);
            const vh = (v / maxVal) * ch;
            const ch2 = (c / maxVal) * ch;

            // Views bar
            const grad = ctx.createLinearGradient(x, pad.top + ch - vh, x, pad.top + ch);
            grad.addColorStop(0, '#818cf8'); grad.addColorStop(1, '#6366f1');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, pad.top + ch - vh, barW, vh, [3, 3, 0, 0]);
            ctx.fill();

            // Clicks bar overlay
            if (ch2 > 0) {
                const grad2 = ctx.createLinearGradient(x, pad.top + ch - ch2, x, pad.top + ch);
                grad2.addColorStop(0, '#34d399'); grad2.addColorStop(1, '#10b981');
                ctx.fillStyle = grad2;
                ctx.beginPath();
                ctx.roundRect(x, pad.top + ch - ch2, barW, ch2, [3, 3, 0, 0]);
                ctx.fill();
            }

            // X label
            ctx.fillStyle = '#9ca3af'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
            const label = d.stat_date ? d.stat_date.substring(5) : '';
            ctx.fillText(label, x + barW / 2, height - pad.bottom + 16);
        });
    }, [data, width, height]);

    return <canvas ref={canvasRef} style={{ width, height }} className="w-full" />;
}

// ─── Contribution bar ───
function ContribBar({ ads }) {
    const total = Math.max(ads.reduce((s, a) => s + parseInt(a.view_count || 0), 0), 1);
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];
    return (
        <div>
            <div className="flex rounded-full h-3 overflow-hidden mb-3">
                {ads.map((a, i) => {
                    const pct = (parseInt(a.view_count || 0) / total) * 100;
                    return <div key={a.id} style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                        className="transition-all duration-500" title={`${a.title}: ${pct.toFixed(1)}%`} />;
                })}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {ads.map((a, i) => {
                    const v = parseInt(a.view_count || 0);
                    const c = parseInt(a.click_count || 0);
                    const ctr = v > 0 ? ((c / v) * 100).toFixed(2) : '0.00';
                    return (
                        <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{a.title}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">{SLOT_KEY_MAP[a.slot_id] || a.slot_id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{v.toLocaleString()}</p>
                                <p className="text-[10px] text-emerald-600 font-bold">{ctr}%</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main Modal ───
const CampaignReportModal = ({ campaignId, onClose }) => {
    const { t } = useTranslation('admin');
    const getSlotLabel = (slotId) => {
        const key = SLOT_KEY_MAP[slotId];
        return key ? t(`campaignReportPage.${key}`) : slotId;
    };
    const statusLabels = {
        active: t('campaignReportPage.statusActive'),
        paused: t('campaignReportPage.statusPaused'),
        completed: t('campaignReportPage.statusCompleted'),
    };
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!campaignId) return;
        const fetch_ = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/campaign_api.php?action=report&campaign_id=${campaignId}`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) setReport(data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetch_();
    }, [campaignId]);

    const handleShare = async () => {
        try {
            const res = await fetch(`${API_BASE}/campaign_api.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'share', campaign_id: campaignId })
            });
            const data = await res.json();
            if (data.success) {
                const url = `${window.location.origin}/ad-campaign-report/${data.token}`;
                setShareUrl(url);
            }
        } catch { /* ignore */ }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!campaignId) return null;

    const statusColors = { active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', paused: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-5 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Layers className="opacity-80" size={22} />
                            <div>
                                <h2 className="text-lg font-extrabold">{loading ? t('campaignReportPage.loading') : report?.campaign?.name || t('campaignReportPage.campaignReport')}</h2>
                                {report?.campaign && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-indigo-200 text-xs">{report.campaign.advertiser || t('campaignReportPage.advertiserUnassigned')}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[report.campaign.status] || ''}`}>
                                            {statusLabels[report.campaign.status] || report.campaign.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleShare} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold flex items-center gap-1">
                                <Share2 size={13} /> {t('campaignReportPage.share')}
                            </button>
                            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    {/* Share URL */}
                    {shareUrl && (
                        <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-lg p-2">
                            <input value={shareUrl} readOnly className="flex-1 bg-transparent text-xs text-white/90 outline-none" />
                            <button onClick={handleCopy} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center gap-1">
                                {copied ? <><CheckCircle size={12} /> {t('campaignReportPage.copied')}</> : <><Copy size={12} /> {t('campaignReportPage.copyBtn')}</>}
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-400" size={32} /><p className="text-sm text-gray-400 mt-3">{t('campaignReportPage.reportLoading')}</p></div>
                ) : report ? (
                    <div className="p-6 space-y-6">
                        {/* KPI Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: t('campaignReportPage.totalImpressions'), value: report.summary.total_views?.toLocaleString(), icon: <Eye size={16} />, color: '#6366f1' },
                                { label: t('campaignReportPage.totalClicks'), value: report.summary.total_clicks?.toLocaleString(), icon: <MousePointer size={16} />, color: '#10b981' },
                                { label: 'CTR', value: report.summary.ctr + '%', icon: <Percent size={16} />, color: '#f59e0b' },
                                { label: t('campaignReportPage.runningDays'), value: report.summary.running_days + t('campaignReportPage.daysSuffix'), icon: <Calendar size={16} />, color: '#8b5cf6' },
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.icon}</div>
                                    </div>
                                    <p className="text-xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Daily avg */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 flex items-center gap-3">
                                <TrendingUp size={20} className="text-indigo-500" />
                                <div>
                                    <p className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300">{report.summary.avg_daily_views}</p>
                                    <p className="text-[11px] text-indigo-400 font-medium">{t('campaignReportPage.dailyAvgViews')}</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 flex items-center gap-3">
                                <MousePointer size={20} className="text-emerald-500" />
                                <div>
                                    <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{report.summary.avg_daily_clicks}</p>
                                    <p className="text-[11px] text-emerald-400 font-medium">{t('campaignReportPage.dailyAvgClicks')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ad contribution */}
                        {report.ads?.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-indigo-500" /> {t('campaignReportPage.adContribution', { count: report.ads.length })}
                                </h3>
                                <ContribBar ads={report.ads} />
                            </div>
                        )}

                        {/* Daily chart */}
                        {report.daily_stats?.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <Clock size={16} className="text-violet-500" /> {t('campaignReportPage.dailyTrend')}
                                </h3>
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-3 h-2 rounded bg-indigo-500 inline-block" /> {t('campaignReportPage.impressionsLegend')}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-3 h-2 rounded bg-emerald-500 inline-block" /> {t('campaignReportPage.clicksLegend')}</span>
                                </div>
                                <CampaignChart data={report.daily_stats} />
                            </div>
                        )}

                        {/* Campaign info */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            {report.campaign.budget && <p>{t('campaignReportPage.budgetLabel')} <span className="font-bold text-gray-700 dark:text-gray-200">₩{Number(report.campaign.budget).toLocaleString()}</span></p>}
                            {report.campaign.start_date && <p>{t('campaignReportPage.periodLabel')} {report.campaign.start_date} ~ {report.campaign.end_date || t('campaignReportPage.ongoing')}</p>}
                            {report.campaign.memo && <p>{t('campaignReportPage.memoLabel')} {report.campaign.memo}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">{t('campaignReportPage.reportLoadFailed')}</div>
                )}
            </div>
        </div>
    );
};

export default CampaignReportModal;
