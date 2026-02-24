import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart3, Eye, MousePointer, TrendingUp, Download, Share2,
    Copy, CheckCircle, X, Calendar, ArrowLeft, Clock, Percent,
    ExternalLink, Loader2
} from 'lucide-react';
import Toast from '../../components/Toast';

const API_BASE = '/api/ads';

// Slot key map for translations
const SLOT_KEY_MAP = {
    home_top: 'slotHomeTop', home_a: 'slotHomeA', home_a2: 'slotHomeA2',
    home_b: 'slotHomeB', home_b2: 'slotHomeB2', home_b3: 'slotHomeB3', home_b4: 'slotHomeB4',
    home_c: 'slotHomeC', home_d: 'slotHomeD', home_e: 'slotHomeE', home_f: 'slotHomeF',
    directory_c: 'slotDirectoryC', directory_c2: 'slotDirectoryC2', directory_d: 'slotDirectoryD', directory_d2: 'slotDirectoryD2',
    seller_community_top: 'slotSellerCommunityTop', seller_community_feed: 'slotSellerCommunityFeed',
    host_community_top: 'slotHostCommunityTop', host_community_feed: 'slotHostCommunityFeed',
    general_community_top: 'slotGeneralCommunityTop', general_community_feed: 'slotGeneralCommunityFeed',
    landing_a: 'slotLandingA', landing_b: 'slotLandingB', landing_b2: 'slotLandingB2',
};

// Simple bar chart component (pure Canvas, no external lib)
const MiniChart = ({ data, width = 600, height = 220 }) => {
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

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Max values
        const maxViews = Math.max(...data.map(d => d.views), 1);
        const maxClicks = Math.max(...data.map(d => d.clicks), 1);
        const maxVal = Math.max(maxViews, maxClicks);

        const barGroupW = chartW / data.length;
        const barW = Math.min(barGroupW * 0.35, 20);
        const gap = 2;

        // Grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Y labels
            ctx.fillStyle = '#9ca3af';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            const val = Math.round(maxVal - (maxVal / 4) * i);
            ctx.fillText(val.toLocaleString(), padding.left - 6, y + 3);
        }

        // Bars
        data.forEach((d, i) => {
            const x = padding.left + barGroupW * i + barGroupW / 2;

            // Views bar (indigo)
            const viewH = (d.views / maxVal) * chartH;
            const grad1 = ctx.createLinearGradient(0, padding.top + chartH - viewH, 0, padding.top + chartH);
            grad1.addColorStop(0, '#818cf8');
            grad1.addColorStop(1, '#4f46e5');
            ctx.fillStyle = grad1;
            ctx.beginPath();
            ctx.roundRect(x - barW - gap / 2, padding.top + chartH - viewH, barW, viewH, [3, 3, 0, 0]);
            ctx.fill();

            // Clicks bar (emerald)
            const clickH = (d.clicks / maxVal) * chartH;
            const grad2 = ctx.createLinearGradient(0, padding.top + chartH - clickH, 0, padding.top + chartH);
            grad2.addColorStop(0, '#34d399');
            grad2.addColorStop(1, '#059669');
            ctx.fillStyle = grad2;
            ctx.beginPath();
            ctx.roundRect(x + gap / 2, padding.top + chartH - clickH, barW, clickH, [3, 3, 0, 0]);
            ctx.fill();

            // X label (date)
            ctx.fillStyle = '#9ca3af';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            const label = d.stat_date.slice(5); // MM-DD
            ctx.save();
            ctx.translate(x, padding.top + chartH + 14);
            ctx.rotate(-0.5);
            ctx.fillText(label, 0, 0);
            ctx.restore();
        });

    }, [data, width, height]);

    return <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width }} />;
};

const AdminAdDashboard = ({ ad, onClose }) => {
    const { t } = useTranslation('admin');
    const getSlotLabel = (slotId) => {
        const key = SLOT_KEY_MAP[slotId];
        return key ? t(`adDashboardPage.${key}`) : slotId;
    };
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState('');
    const [shareLoading, setShareLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        if (!ad) return;
        const fetchReport = async () => {
            try {
                const res = await fetch(`${API_BASE}/ad_report.php?ad_id=${ad.id}`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    setReport(data);
                } else {
                    // Fallback: use cumulative data from the ad prop
                    buildFallbackReport();
                }
            } catch {
                buildFallbackReport();
            } finally {
                setLoading(false);
            }
        };

        const buildFallbackReport = () => {
            const totalViews = parseInt(ad.view_count || 0);
            const totalClicks = parseInt(ad.click_count || 0);
            const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;
            const start = ad.start_date || ad.created_at?.split(' ')[0] || new Date().toISOString().split('T')[0];
            const end = ad.end_date || new Date().toISOString().split('T')[0];
            const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1);
            setReport({
                ad,
                daily_stats: [],
                summary: {
                    total_views: totalViews,
                    total_clicks: totalClicks,
                    ctr: parseFloat(ctr),
                    running_days: days,
                    avg_daily_views: Math.round((totalViews / days) * 10) / 10,
                    avg_daily_clicks: Math.round((totalClicks / days) * 10) / 10,
                }
            });
            showToast(t('adDashboardPage.dailyDataNotReady'), 'info');
        };

        fetchReport();
    }, [ad, showToast]);

    const handleExport = () => {
        const url = `${API_BASE}/ad_export_excel.php?ad_id=${ad.id}`;
        window.open(url, '_blank');
        showToast(t('adDashboardPage.excelDownloadStarted'));
    };

    const handleShare = async () => {
        setShareLoading(true);
        try {
            const res = await fetch(`${API_BASE}/ad_share_create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ad_id: ad.id, expires_days: 30 }),
            });
            const data = await res.json();
            if (data.success) {
                const url = `${window.location.origin}/ad-report/${data.token}`;
                setShareUrl(url);
                showToast(data.is_new ? t('adDashboardPage.shareLinkCreated') : t('adDashboardPage.existingLinkLoaded'));
            } else {
                showToast(data.message || t('adDashboardPage.linkCreateFailed'), 'error');
            }
        } catch {
            showToast(t('adDashboardPage.serverError'), 'error');
        } finally {
            setShareLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            showToast(t('adDashboardPage.linkCopied'));
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast(t('adDashboardPage.copyFailed'), 'error');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-12 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                    <p className="text-gray-500 font-medium">{t('adDashboardPage.reportLoading')}</p>
                </div>
            </div>
        );
    }

    if (!report) return null;

    const { summary, daily_stats } = report;
    const adData = report.ad;

    // Determine chart width based on data length
    const chartWidth = Math.max(600, daily_stats.length * 40);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white rounded-t-3xl">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={onClose} className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium">
                            <ArrowLeft size={16} /> {t('adDashboardPage.goBack')}
                        </button>
                        <button onClick={onClose} className="text-white/60 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="text-xl font-black flex items-center gap-2">
                        <BarChart3 size={22} />
                        {t('adDashboardPage.adReport')}
                    </h2>
                    <p className="text-indigo-200 text-sm mt-1 truncate">{adData.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-indigo-200">
                        <span className="bg-white/15 px-2 py-0.5 rounded-lg">{getSlotLabel(adData.slot_id)}</span>
                        {adData.start_date && <span className="flex items-center gap-1"><Calendar size={11} /> {adData.start_date} ~ {adData.end_date || t('adDashboardPage.ongoing')}</span>}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: t('adDashboardPage.totalImpressions'), value: summary.total_views.toLocaleString(), icon: <Eye size={18} />, color: 'from-blue-500 to-indigo-600' },
                            { label: t('adDashboardPage.totalClicks'), value: summary.total_clicks.toLocaleString(), icon: <MousePointer size={18} />, color: 'from-emerald-500 to-teal-600' },
                            { label: 'CTR', value: summary.ctr + '%', icon: <Percent size={18} />, color: 'from-orange-500 to-red-500' },
                            { label: t('adDashboardPage.runningDays'), value: summary.running_days + t('adDashboardPage.daysSuffix'), icon: <Clock size={18} />, color: 'from-violet-500 to-purple-600' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`}>
                                    {stat.icon}
                                </div>
                                <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                                <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Daily avg */}
                    <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-6">
                        <TrendingUp size={20} className="text-indigo-500" />
                        <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 font-medium">{t('adDashboardPage.dailyAvgViews')}</span>
                                <p className="text-lg font-extrabold text-gray-900">{summary.avg_daily_views}</p>
                            </div>
                            <div>
                                <span className="text-gray-500 font-medium">{t('adDashboardPage.dailyAvgClicks')}</span>
                                <p className="text-lg font-extrabold text-gray-900">{summary.avg_daily_clicks}</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    {daily_stats.length > 0 ? (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <BarChart3 size={16} className="text-indigo-500" />
                                {t('adDashboardPage.dailyTrend')}
                            </h3>
                            <div className="flex items-center gap-4 mb-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-b from-indigo-400 to-indigo-600" />{t('adDashboardPage.viewsLegend')}</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600" />{t('adDashboardPage.clicksLegend')}</span>
                            </div>
                            <div className="overflow-x-auto bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <MiniChart data={daily_stats} width={chartWidth} height={220} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <BarChart3 size={32} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm font-medium">{t('adDashboardPage.noDailyData')}</p>
                            <p className="text-xs mt-1">{t('adDashboardPage.noDailyDataDesc')}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <button
                            onClick={handleExport}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                        >
                            <Download size={16} />
                            {t('adDashboardPage.excelDownload')}
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={shareLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                            {shareLoading ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                            {t('adDashboardPage.createShareLink')}
                        </button>
                    </div>

                    {/* Share URL */}
                    {shareUrl && (
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                <ExternalLink size={12} /> {t('adDashboardPage.shareLink')}
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 select-all"
                                    onFocus={e => e.target.select()}
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${copied
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                        }`}
                                >
                                    {copied ? <><CheckCircle size={14} />{t('adDashboardPage.copied')}</> : <><Copy size={14} />{t('adDashboardPage.copyBtn')}</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminAdDashboard;
