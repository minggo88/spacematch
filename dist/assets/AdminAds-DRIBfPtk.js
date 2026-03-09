import { j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, ai as Loader2, e as ArrowLeft, a as X, o as BarChart3, az as Calendar, N as Eye, aC as MousePointer, aD as Percent, aq as Clock, w as TrendingUp, D as Download, ar as Share2, $ as ExternalLink, C as CheckCircle, b7 as Copy, aE as Layers, y as Megaphone, _ as Settings, ad as Plus, J as Monitor, S as Smartphone, E as EyeOff, aH as PenLine, f as Search, a0 as ChevronDown, b8 as FolderOpen, T as Trash2, b9 as Save, ay as List, aw as LayoutGrid, aA as Image, b3 as Link2, d as Check, ba as Pause, bb as Play } from "./vendor-icons-BFe5lkJJ.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE$2 = "/api/ads";
const SLOT_KEY_MAP$1 = {
  home_top: "slotHomeTop",
  home_a: "slotHomeA",
  home_a2: "slotHomeA2",
  home_b: "slotHomeB",
  home_b2: "slotHomeB2",
  home_b3: "slotHomeB3",
  home_b4: "slotHomeB4",
  home_c: "slotHomeC",
  home_d: "slotHomeD",
  home_e: "slotHomeE",
  home_f: "slotHomeF",
  directory_c: "slotDirectoryC",
  directory_c2: "slotDirectoryC2",
  directory_d: "slotDirectoryD",
  directory_d2: "slotDirectoryD2",
  seller_community_top: "slotSellerCommunityTop",
  seller_community_feed: "slotSellerCommunityFeed",
  host_community_top: "slotHostCommunityTop",
  host_community_feed: "slotHostCommunityFeed",
  general_community_top: "slotGeneralCommunityTop",
  general_community_feed: "slotGeneralCommunityFeed",
  landing_a: "slotLandingA",
  landing_b: "slotLandingB",
  landing_b2: "slotLandingB2"
};
const MiniChart = ({ data, width = 600, height = 220 }) => {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    ctx.clearRect(0, 0, width, height);
    const maxViews = Math.max(...data.map((d) => d.views), 1);
    const maxClicks = Math.max(...data.map((d) => d.clicks), 1);
    const maxVal = Math.max(maxViews, maxClicks);
    const barGroupW = chartW / data.length;
    const barW = Math.min(barGroupW * 0.35, 20);
    const gap = 2;
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH / 4 * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      const val = Math.round(maxVal - maxVal / 4 * i);
      ctx.fillText(val.toLocaleString(), padding.left - 6, y + 3);
    }
    data.forEach((d, i) => {
      const x = padding.left + barGroupW * i + barGroupW / 2;
      const viewH = d.views / maxVal * chartH;
      const grad1 = ctx.createLinearGradient(0, padding.top + chartH - viewH, 0, padding.top + chartH);
      grad1.addColorStop(0, "#818cf8");
      grad1.addColorStop(1, "#4f46e5");
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.roundRect(x - barW - gap / 2, padding.top + chartH - viewH, barW, viewH, [3, 3, 0, 0]);
      ctx.fill();
      const clickH = d.clicks / maxVal * chartH;
      const grad2 = ctx.createLinearGradient(0, padding.top + chartH - clickH, 0, padding.top + chartH);
      grad2.addColorStop(0, "#34d399");
      grad2.addColorStop(1, "#059669");
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, padding.top + chartH - clickH, barW, clickH, [3, 3, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      const label = d.stat_date.slice(5);
      ctx.save();
      ctx.translate(x, padding.top + chartH + 14);
      ctx.rotate(-0.5);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  }, [data, width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { width: "100%", maxWidth: width } });
};
const AdminAdDashboard = ({ ad, onClose }) => {
  const { t } = useTranslation("admin");
  const getSlotLabel = (slotId) => {
    const key = SLOT_KEY_MAP$1[slotId];
    return key ? t(`adDashboardPage.${key}`) : slotId;
  };
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [shareUrl, setShareUrl] = reactExports.useState("");
  const [shareLoading, setShareLoading] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  reactExports.useEffect(() => {
    if (!ad) return;
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE$2}/ad_report.php?ad_id=${ad.id}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setReport(data);
        } else {
          buildFallbackReport();
        }
      } catch {
        buildFallbackReport();
      } finally {
        setLoading(false);
      }
    };
    const buildFallbackReport = () => {
      var _a;
      const totalViews = parseInt(ad.view_count || 0);
      const totalClicks = parseInt(ad.click_count || 0);
      const ctr = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(2) : 0;
      const start = ad.start_date || ((_a = ad.created_at) == null ? void 0 : _a.split(" ")[0]) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const end = ad.end_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 864e5) + 1);
      setReport({
        ad,
        daily_stats: [],
        summary: {
          total_views: totalViews,
          total_clicks: totalClicks,
          ctr: parseFloat(ctr),
          running_days: days,
          avg_daily_views: Math.round(totalViews / days * 10) / 10,
          avg_daily_clicks: Math.round(totalClicks / days * 10) / 10
        }
      });
      showToast(t("adDashboardPage.dailyDataNotReady"), "info");
    };
    fetchReport();
  }, [ad, showToast]);
  const handleExport = () => {
    const url = `${API_BASE$2}/ad_export_excel.php?ad_id=${ad.id}`;
    window.open(url, "_blank");
    showToast(t("adDashboardPage.excelDownloadStarted"));
  };
  const handleShare = async () => {
    setShareLoading(true);
    try {
      const res = await fetch(`${API_BASE$2}/ad_share_create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ad_id: ad.id, expires_days: 30 })
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.origin}/ad-report/${data.token}`;
        setShareUrl(url);
        showToast(data.is_new ? t("adDashboardPage.shareLinkCreated") : t("adDashboardPage.existingLinkLoaded"));
      } else {
        showToast(data.message || t("adDashboardPage.linkCreateFailed"), "error");
      }
    } catch {
      showToast(t("adDashboardPage.serverError"), "error");
    } finally {
      setShareLoading(false);
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast(t("adDashboardPage.linkCopied"));
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      showToast(t("adDashboardPage.copyFailed"), "error");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-12 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "animate-spin text-indigo-600", size: 32 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium", children: t("adDashboardPage.reportLoading") })
    ] }) });
  }
  if (!report) return null;
  const { summary, daily_stats } = report;
  const adData = report.ad;
  const chartWidth = Math.max(600, daily_stats.length * 40);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white rounded-t-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onClose, className: "flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
                " ",
                t("adDashboardPage.goBack")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-white/60 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-black flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 22 }),
              t("adDashboardPage.adReport")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 text-sm mt-1 truncate", children: adData.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-indigo-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/15 px-2 py-0.5 rounded-lg", children: getSlotLabel(adData.slot_id) }),
              adData.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                " ",
                adData.start_date,
                " ~ ",
                adData.end_date || t("adDashboardPage.ongoing")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
              { label: t("adDashboardPage.totalImpressions"), value: summary.total_views.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }), color: "from-blue-500 to-indigo-600" },
              { label: t("adDashboardPage.totalClicks"), value: summary.total_clicks.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 18 }), color: "from-emerald-500 to-teal-600" },
              { label: "CTR", value: summary.ctr + "%", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 18 }), color: "from-orange-500 to-red-500" },
              { label: t("adDashboardPage.runningDays"), value: summary.running_days + t("adDashboardPage.daysSuffix"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18 }), color: "from-violet-500 to-purple-600" }
            ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 border border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`, children: stat.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 font-medium", children: stat.label })
            ] }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-2xl p-4 flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-indigo-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-2 gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: t("adDashboardPage.dailyAvgViews") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900", children: summary.avg_daily_views })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: t("adDashboardPage.dailyAvgClicks") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900", children: summary.avg_daily_clicks })
                ] })
              ] })
            ] }),
            daily_stats.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-indigo-500" }),
                t("adDashboardPage.dailyTrend")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2 text-xs text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-gradient-to-b from-indigo-400 to-indigo-600" }),
                  t("adDashboardPage.viewsLegend")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600" }),
                  t("adDashboardPage.clicksLegend")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto bg-gray-50 rounded-2xl p-4 border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniChart, { data: daily_stats, width: chartWidth, height: 220 }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 32, className: "mx-auto mb-2 text-gray-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: t("adDashboardPage.noDailyData") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: t("adDashboardPage.noDailyDataDesc") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleExport,
                  className: "flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
                    t("adDashboardPage.excelDownload")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleShare,
                  disabled: shareLoading,
                  className: "flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50",
                  children: [
                    shareLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }),
                    t("adDashboardPage.createShareLink")
                  ]
                }
              )
            ] }),
            shareUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
                " ",
                t("adDashboardPage.shareLink")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    readOnly: true,
                    value: shareUrl,
                    className: "flex-1 px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 select-all",
                    onFocus: (e) => e.target.select()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleCopy,
                    className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${copied ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`,
                    children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14 }),
                      t("adDashboardPage.copied")
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }),
                      t("adDashboardPage.copyBtn")
                    ] })
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
const SLOT_KEY_MAP = {
  home_top: "slotHomeTop",
  home_a: "slotHomeA",
  home_a2: "slotHomeA2",
  home_b: "slotHomeB",
  home_b2: "slotHomeB2",
  home_c: "slotHomeC",
  home_d: "slotHomeD",
  home_hero_bg: "slotHomeHeroBg",
  directory_a: "slotDirectoryA",
  directory_b: "slotDirectoryB",
  directory_c: "slotDirectoryC",
  directory_d: "slotDirectoryD",
  seller_community_top: "slotSellerCommunityTop",
  seller_community_feed: "slotSellerCommunityFeed",
  host_community_top: "slotHostCommunityTop",
  host_community_feed: "slotHostCommunityFeed",
  general_community_top: "slotGeneralCommunityTop",
  general_community_feed: "slotGeneralCommunityFeed",
  landing_a: "slotLandingA",
  landing_b: "slotLandingB",
  landing_b2: "slotLandingB2"
};
const API_BASE$1 = "/api/ads";
function CampaignChart({ data, width = 600, height = 200 }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map((d) => parseInt(d.views || 0)), 1);
    const barW = Math.max(Math.min(cw / data.length - 4, 24), 6);
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ch / 4 * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal * (1 - i / 4)).toLocaleString(), pad.left - 8, y + 3);
    }
    data.forEach((d, i) => {
      const x = pad.left + cw / data.length * i + (cw / data.length - barW) / 2;
      const v = parseInt(d.views || 0);
      const c = parseInt(d.clicks || 0);
      const vh = v / maxVal * ch;
      const ch2 = c / maxVal * ch;
      const grad = ctx.createLinearGradient(x, pad.top + ch - vh, x, pad.top + ch);
      grad.addColorStop(0, "#818cf8");
      grad.addColorStop(1, "#6366f1");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, pad.top + ch - vh, barW, vh, [3, 3, 0, 0]);
      ctx.fill();
      if (ch2 > 0) {
        const grad2 = ctx.createLinearGradient(x, pad.top + ch - ch2, x, pad.top + ch);
        grad2.addColorStop(0, "#34d399");
        grad2.addColorStop(1, "#10b981");
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.roundRect(x, pad.top + ch - ch2, barW, ch2, [3, 3, 0, 0]);
        ctx.fill();
      }
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      const label = d.stat_date ? d.stat_date.substring(5) : "";
      ctx.fillText(label, x + barW / 2, height - pad.bottom + 16);
    });
  }, [data, width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { width, height }, className: "w-full" });
}
function ContribBar({ ads }) {
  const total = Math.max(ads.reduce((s, a) => s + parseInt(a.view_count || 0), 0), 1);
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-full h-3 overflow-hidden mb-3", children: ads.map((a, i) => {
      const pct = parseInt(a.view_count || 0) / total * 100;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: { width: `${pct}%`, backgroundColor: colors[i % colors.length] },
          className: "transition-all duration-500",
          title: `${a.title}: ${pct.toFixed(1)}%`
        },
        a.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ads.map((a, i) => {
      const v = parseInt(a.view_count || 0);
      const c = parseInt(a.click_count || 0);
      const ctr = v > 0 ? (c / v * 100).toFixed(2) : "0.00";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full flex-shrink-0", style: { backgroundColor: colors[i % colors.length] } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-200 truncate", children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500", children: SLOT_KEY_MAP[a.slot_id] || a.slot_id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-900 dark:text-white", children: v.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-600 font-bold", children: [
            ctr,
            "%"
          ] })
        ] })
      ] }, a.id);
    }) })
  ] });
}
const CampaignReportModal = ({ campaignId, onClose }) => {
  var _a, _b, _c, _d, _e;
  const { t } = useTranslation("admin");
  const statusLabels = {
    active: t("campaignReportPage.statusActive"),
    paused: t("campaignReportPage.statusPaused"),
    completed: t("campaignReportPage.statusCompleted")
  };
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [shareUrl, setShareUrl] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!campaignId) return;
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE$1}/campaign_api.php?action=report&campaign_id=${campaignId}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setReport(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [campaignId]);
  const handleShare = async () => {
    try {
      const res = await fetch(`${API_BASE$1}/campaign_api.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "share", campaign_id: campaignId })
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.origin}/ad-campaign-report/${data.token}`;
        setShareUrl(url);
      }
    } catch {
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  if (!campaignId) return null;
  const statusColors = { active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400", completed: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-5 rounded-t-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "opacity-80", size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-extrabold", children: loading ? t("campaignReportPage.loading") : ((_a = report == null ? void 0 : report.campaign) == null ? void 0 : _a.name) || t("campaignReportPage.campaignReport") }),
            (report == null ? void 0 : report.campaign) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-200 text-xs", children: report.campaign.advertiser || t("campaignReportPage.advertiserUnassigned") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[report.campaign.status] || ""}`, children: statusLabels[report.campaign.status] || report.campaign.status })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleShare, className: "px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 13 }),
            " ",
            t("campaignReportPage.share")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
        ] })
      ] }),
      shareUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 bg-white/10 rounded-lg p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shareUrl, readOnly: true, className: "flex-1 bg-transparent text-xs text-white/90 outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCopy, className: "px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center gap-1", children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 12 }),
          " ",
          t("campaignReportPage.copied")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 12 }),
          " ",
          t("campaignReportPage.copyBtn")
        ] }) })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "animate-spin mx-auto text-indigo-400", size: 32 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-3", children: t("campaignReportPage.reportLoading") })
    ] }) : report ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        { label: t("campaignReportPage.totalImpressions"), value: (_b = report.summary.total_views) == null ? void 0 : _b.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }), color: "#6366f1" },
        { label: t("campaignReportPage.totalClicks"), value: (_c = report.summary.total_clicks) == null ? void 0 : _c.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 16 }), color: "#10b981" },
        { label: "CTR", value: report.summary.ctr + "%", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 16 }), color: "#f59e0b" },
        { label: t("campaignReportPage.runningDays"), value: report.summary.running_days + t("campaignReportPage.daysSuffix"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }), color: "#8b5cf6" }
      ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { backgroundColor: s.color + "15", color: s.color }, children: s.icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900 dark:text-white", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 dark:text-gray-500 font-medium", children: s.label })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-indigo-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-indigo-700 dark:text-indigo-300", children: report.summary.avg_daily_views }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-indigo-400 font-medium", children: t("campaignReportPage.dailyAvgViews") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 20, className: "text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-emerald-700 dark:text-emerald-300", children: report.summary.avg_daily_clicks }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-emerald-400 font-medium", children: t("campaignReportPage.dailyAvgClicks") })
          ] })
        ] })
      ] }),
      ((_d = report.ads) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-indigo-500" }),
          " ",
          t("campaignReportPage.adContribution", { count: report.ads.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContribBar, { ads: report.ads })
      ] }),
      ((_e = report.daily_stats) == null ? void 0 : _e.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-violet-500" }),
          " ",
          t("campaignReportPage.dailyTrend")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-2 rounded bg-indigo-500 inline-block" }),
            " ",
            t("campaignReportPage.impressionsLegend")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-2 rounded bg-emerald-500 inline-block" }),
            " ",
            t("campaignReportPage.clicksLegend")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignChart, { data: report.daily_stats })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1", children: [
        report.campaign.budget && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          t("campaignReportPage.budgetLabel"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-gray-700 dark:text-gray-200", children: [
            "₩",
            Number(report.campaign.budget).toLocaleString()
          ] })
        ] }),
        report.campaign.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          t("campaignReportPage.periodLabel"),
          " ",
          report.campaign.start_date,
          " ~ ",
          report.campaign.end_date || t("campaignReportPage.ongoing")
        ] }),
        report.campaign.memo && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          t("campaignReportPage.memoLabel"),
          " ",
          report.campaign.memo
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-gray-400", children: t("campaignReportPage.reportLoadFailed") })
  ] }) });
};
const COUNTRY_OPTIONS = [
  { code: "ko", label: "한국", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Việt Nam", flag: "🇻🇳" },
  { code: "ja", label: "日本", flag: "🇯🇵" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "ru", label: "Россия", flag: "🇷🇺" },
  { code: "uk", label: "Україна", flag: "🇺🇦" }
];
const API_BASE = "/api/ads";
const SLOT_OPTIONS_RAW = [
  { value: "home_top", labelKey: "slotHomeTop", pageKey: "slotHomepage" },
  { value: "home_a", labelKey: "slotHomeA", pageKey: "slotHomepage" },
  { value: "home_a2", labelKey: "slotHomeA2", pageKey: "slotHomepage" },
  { value: "home_b", labelKey: "slotHomeB", pageKey: "slotHomepage" },
  { value: "home_b2", labelKey: "slotHomeB2", pageKey: "slotHomepage" },
  { value: "home_b3", labelKey: "slotHomeB3", pageKey: "slotHomepage" },
  { value: "home_b4", labelKey: "slotHomeB4", pageKey: "slotHomepage" },
  { value: "home_c", labelKey: "slotHomeC", pageKey: "slotHomepage" },
  { value: "home_d", labelKey: "slotHomeD", pageKey: "slotHomepage" },
  { value: "home_e", labelKey: "slotHomeE", pageKey: "slotHomepage" },
  { value: "home_f", labelKey: "slotHomeF", pageKey: "slotHomepage" },
  { value: "directory_c", labelKey: "slotDirectoryC", pageKey: "slotSearch" },
  { value: "directory_d", labelKey: "slotDirectoryD", pageKey: "slotSearch" },
  { value: "seller_community_top", labelKey: "slotSellerCommunityTop", pageKey: "slotSellerCommunity" },
  { value: "seller_community_feed", labelKey: "slotSellerCommunityFeed", pageKey: "slotSellerCommunity" },
  { value: "host_community_top", labelKey: "slotHostCommunityTop", pageKey: "slotVendorCommunity" },
  { value: "host_community_feed", labelKey: "slotHostCommunityFeed", pageKey: "slotVendorCommunity" },
  { value: "general_community_top", labelKey: "slotGeneralCommunityTop", pageKey: "slotGeneralCommunity" },
  { value: "general_community_feed", labelKey: "slotGeneralCommunityFeed", pageKey: "slotGeneralCommunity" },
  { value: "calc_top", labelKey: "slotCalcTop", pageKey: "slotSellerCalc" },
  { value: "calc_between", labelKey: "slotCalcBetween", pageKey: "slotSellerCalc" },
  { value: "calc_bottom", labelKey: "slotCalcBottom", pageKey: "slotSellerCalc" }
];
const SLOT_SIZE_GUIDE = {
  home_top: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  home_a: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_a2: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_b: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_b2: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_b3: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_b4: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  home_c: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  home_d: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  home_e: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  home_f: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  directory_c: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  directory_c2: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  directory_d: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  directory_d2: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  seller_community_top: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  seller_community_feed: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  host_community_top: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  host_community_feed: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  general_community_top: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  general_community_feed: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  landing_a: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  landing_b: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  landing_b2: { format: "card", pc: { size: "800 × 450px", ratio: "16:9" }, mobile: { size: "480 × 270px", ratio: "16:9" } },
  calc_top: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } },
  calc_between: { format: "native", pc: { size: "1200 × 240px", ratio: "5:1" }, mobile: { size: "720 × 144px", ratio: "5:1" } },
  calc_bottom: { format: "banner", pc: { size: "1200 × 250px", ratio: "~5:1" }, mobile: { size: "720 × 150px", ratio: "~5:1" } }
};
const AdminAds = () => {
  const { t } = useTranslation("admin");
  const SLOT_OPTIONS = SLOT_OPTIONS_RAW.map((s) => ({ ...s, label: t(`adsPage.${s.labelKey}`), page: t(`adsPage.${s.pageKey}`) }));
  const [ads, setAds] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filterSlot, setFilterSlot] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingAd, setEditingAd] = reactExports.useState(null);
  const [showAdSenseSettings, setShowAdSenseSettings] = reactExports.useState(false);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [reportAd, setReportAd] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const [sortBy, setSortBy] = reactExports.useState("views");
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [countryFilter, setCountryFilter] = reactExports.useState("all");
  const [showBatchEdit, setShowBatchEdit] = reactExports.useState(false);
  const [batchEditForm, setBatchEditForm] = reactExports.useState({
    target_countries: { enabled: false, value: "all" },
    slot_id: { enabled: false, value: "home_a" },
    priority: { enabled: false, value: 0 },
    start_date: { enabled: false, value: "" },
    end_date: { enabled: false, value: "" },
    is_active: { enabled: false, value: 1 }
  });
  const [campaigns, setCampaigns] = reactExports.useState([]);
  const [unassignedAds, setUnassignedAds] = reactExports.useState([]);
  const [expandedCampaign, setExpandedCampaign] = reactExports.useState(null);
  const [showCampaignForm, setShowCampaignForm] = reactExports.useState(false);
  const [editingCampaign, setEditingCampaign] = reactExports.useState(null);
  const [campaignForm, setCampaignForm] = reactExports.useState({ name: "", advertiser: "", budget: "", start_date: "", end_date: "", status: "active", memo: "", target_countries: "all" });
  const [campaignReportId, setCampaignReportId] = reactExports.useState(null);
  const [assigningCampaignId, setAssigningCampaignId] = reactExports.useState(null);
  const [assignSelectedAds, setAssignSelectedAds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [campaignSearch, setCampaignSearch] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    slot_id: "home_a",
    title: "",
    click_url: "",
    start_date: "",
    end_date: "",
    is_active: 1,
    priority: 0,
    target_countries: "all"
  });
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [mobileImageFile, setMobileImageFile] = reactExports.useState(null);
  const [mobileImagePreview, setMobileImagePreview] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [adsenseForm, setAdsenseForm] = reactExports.useState({ client_id: "", is_enabled: 0, slot_configs: {} });
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const fetchAds = reactExports.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterSlot) params.set("slot_id", filterSlot);
      if (countryFilter && countryFilter !== "all") params.set("country", countryFilter);
      const qs = params.toString();
      const url = `${API_BASE}/list_ads.php${qs ? "?" + qs : ""}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) setAds(data.ads || []);
    } catch {
      showToast(t("adsPage.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [filterSlot, countryFilter, showToast]);
  const fetchAdsenseConfig = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/adsense_config.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.config) {
        setAdsenseForm({ client_id: data.config.client_id || "", is_enabled: data.config.is_enabled || 0, slot_configs: data.config.slot_configs || {} });
      }
    } catch {
    }
  }, []);
  const fetchCampaigns = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/campaign_api.php?action=list`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
        setUnassignedAds(data.unassigned_ads || []);
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    fetchAds();
  }, [fetchAds]);
  reactExports.useEffect(() => {
    fetchAdsenseConfig();
  }, [fetchAdsenseConfig]);
  reactExports.useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);
  const handleCampaignSubmit = async () => {
    if (!campaignForm.name.trim()) {
      showToast(t("adsPage.campaignNameRequired"), "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/campaign_api.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: editingCampaign ? "update" : "create", id: editingCampaign == null ? void 0 : editingCampaign.id, ...campaignForm, budget: campaignForm.budget || null })
      });
      const data = await res.json();
      showToast(data.message || (data.success ? t("adsPage.done") : t("adsPage.failed")), data.success ? "success" : "error");
      if (data.success) {
        setShowCampaignForm(false);
        setEditingCampaign(null);
        setCampaignForm({ name: "", advertiser: "", budget: "", start_date: "", end_date: "", status: "active", memo: "", target_countries: "all" });
        fetchCampaigns();
      }
    } catch {
      showToast(t("adsPage.errorOccurred"), "error");
    }
  };
  const handleCampaignDelete = (c) => {
    setConfirmModal({
      title: t("adsPage.deleteCampaign"),
      message: t("adsPage.deleteCampaignMsg", { name: c.name }),
      type: "danger",
      onConfirm: async () => {
        const res = await fetch(`${API_BASE}/campaign_api.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id: c.id }) });
        const data = await res.json();
        showToast(data.message, data.success ? "success" : "error");
        if (data.success) fetchCampaigns();
        setConfirmModal(null);
      }
    });
  };
  const handleAssignAds = async (campaignId) => {
    if (assignSelectedAds.size === 0) {
      showToast(t("adsPage.selectAdsToAssign"), "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/campaign_api.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign", campaign_id: campaignId, ad_ids: [...assignSelectedAds] })
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        setAssigningCampaignId(null);
        setAssignSelectedAds(/* @__PURE__ */ new Set());
        fetchCampaigns();
        fetchAds();
      }
    } catch {
      showToast(t("adsPage.errorOccurred"), "error");
    }
  };
  const handleUnassignAd = async (adId) => {
    try {
      const res = await fetch(`${API_BASE}/campaign_api.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign", campaign_id: null, ad_ids: [adId] })
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
        fetchAds();
      }
    } catch {
    }
  };
  const resetForm = () => {
    setForm({ slot_id: "home_a", title: "", click_url: "", start_date: "", end_date: "", is_active: 1, priority: 0, target_countries: "all" });
    setImageFile(null);
    setImagePreview(null);
    setMobileImageFile(null);
    setMobileImagePreview(null);
    setEditingAd(null);
  };
  const handleOpenForm = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setForm({ slot_id: ad.slot_id, title: ad.title, click_url: ad.click_url || "", start_date: ad.start_date || "", end_date: ad.end_date || "", is_active: ad.is_active, priority: ad.priority || 0, target_countries: ad.target_countries || "all" });
      setImagePreview(ad.image_url);
      setMobileImagePreview(ad.mobile_image_url || null);
    } else {
      resetForm();
    }
    setShowForm(true);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMobileImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setMobileImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast(t("adsPage.adTitleRequired"), "error");
      return;
    }
    if (!editingAd && !imageFile) {
      showToast(t("adsPage.uploadImage"), "error");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    if (editingAd) formData.append("id", editingAd.id);
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (imageFile) formData.append("image", imageFile);
    if (mobileImageFile) formData.append("mobile_image", mobileImageFile);
    try {
      const url = editingAd ? `${API_BASE}/update_ad.php` : `${API_BASE}/create_ad.php`;
      const res = await fetch(url, { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (data.success) {
        showToast(editingAd ? t("adsPage.adUpdated") : t("adsPage.adCreated"));
        setShowForm(false);
        resetForm();
        fetchAds();
      } else showToast(data.message || t("adsPage.errorOccurred"), "error");
    } catch {
      showToast(t("adsPage.serverError"), "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = (ad) => {
    setConfirmModal({
      title: t("adsPage.deleteAd"),
      message: t("adsPage.deleteAdMsg", { title: ad.title }),
      type: "danger",
      confirmLabel: t("adsPage.deleteLabel"),
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await fetch(`${API_BASE}/delete_ad.php`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: ad.id }) });
          const data = await res.json();
          if (data.success) {
            showToast(t("adsPage.adDeleted"));
            fetchAds();
          } else showToast(data.message || t("adsPage.failed"), "error");
        } catch {
          showToast(t("adsPage.serverError"), "error");
        }
      }
    });
  };
  const handleToggleActive = async (ad) => {
    const formData = new FormData();
    formData.append("id", ad.id);
    formData.append("slot_id", ad.slot_id);
    formData.append("title", ad.title);
    formData.append("click_url", ad.click_url || "");
    formData.append("start_date", ad.start_date || "");
    formData.append("end_date", ad.end_date || "");
    formData.append("is_active", ad.is_active == 1 ? 0 : 1);
    formData.append("priority", ad.priority || 0);
    formData.append("target_countries", ad.target_countries || "all");
    try {
      const res = await fetch(`${API_BASE}/update_ad.php`, { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (data.success) {
        showToast(ad.is_active == 1 ? t("adsPage.adDeactivated") : t("adsPage.adActivated"));
        fetchAds();
      }
    } catch {
      showToast(t("adsPage.serverError"), "error");
    }
  };
  const handleCopyAd = async (ad) => {
    try {
      const res = await fetch(`${API_BASE}/copy_ad.php`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: ad.id }) });
      const data = await res.json();
      if (data.success) {
        showToast(t("adsPage.adCopied"));
        fetchAds();
      } else showToast(data.message || t("adsPage.copyFailed"), "error");
    } catch {
      showToast(t("adsPage.serverError"), "error");
    }
  };
  const handleDateShortcut = (days) => {
    const today = /* @__PURE__ */ new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + days);
    const fmt = (d) => d.toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, start_date: fmt(today), end_date: fmt(end) }));
  };
  const handleBatchEditOpen = () => {
    setBatchEditForm({
      target_countries: { enabled: false, value: "all" },
      slot_id: { enabled: false, value: "home_a" },
      priority: { enabled: false, value: 0 },
      start_date: { enabled: false, value: "" },
      end_date: { enabled: false, value: "" },
      is_active: { enabled: false, value: 1 }
    });
    setShowBatchEdit(true);
  };
  const handleBatchEditSubmit = async () => {
    const fields = {};
    Object.entries(batchEditForm).forEach(([key, { enabled, value }]) => {
      if (enabled) fields[key] = value;
    });
    if (Object.keys(fields).length === 0) {
      showToast(t("adsPage.noFieldsSelected"), "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/batch_update_ads.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedIds], fields })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || t("adsPage.batchEditSuccess"));
        setShowBatchEdit(false);
        setSelectedIds(/* @__PURE__ */ new Set());
        fetchAds();
      } else {
        showToast(data.message || t("adsPage.errorOccurred"), "error");
      }
    } catch {
      showToast(t("adsPage.serverError"), "error");
    }
  };
  const handleSaveAdsense = async () => {
    try {
      const res = await fetch(`${API_BASE}/adsense_config.php`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(adsenseForm) });
      const data = await res.json();
      if (data.success) showToast(t("adsPage.adsenseSaved"));
      else showToast(data.message || t("adsPage.saveFailed"), "error");
    } catch {
      showToast(t("adsPage.serverError"), "error");
    }
  };
  const getSlotLabel = (slotId) => {
    var _a;
    return ((_a = SLOT_OPTIONS.find((s) => s.value === slotId)) == null ? void 0 : _a.label) || slotId;
  };
  const getSlotPage = (slotId) => {
    var _a;
    return ((_a = SLOT_OPTIONS.find((s) => s.value === slotId)) == null ? void 0 : _a.page) || "";
  };
  const filteredAds = ads.filter((ad) => {
    if (searchTerm) {
      const t2 = searchTerm.toLowerCase();
      if (!ad.title.toLowerCase().includes(t2) && !ad.slot_id.toLowerCase().includes(t2)) return false;
    }
    return true;
  });
  const grouped = {};
  filteredAds.forEach((ad) => {
    const page = getSlotPage(ad.slot_id);
    if (!grouped[page]) grouped[page] = [];
    grouped[page].push(ad);
  });
  Object.values(grouped).forEach((arr) => arr.sort((a, b) => (parseInt(a.priority) || 0) - (parseInt(b.priority) || 0)));
  const totalImpressions = ads.reduce((s, a) => s + parseInt(a.view_count || 0), 0);
  const totalClicks = ads.reduce((s, a) => s + parseInt(a.click_count || 0), 0);
  const activeCount = ads.filter((a) => a.is_active == 1).length;
  const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0.00";
  const sortedAds = [...ads].sort((a, b) => {
    if (sortBy === "views") return parseInt(b.view_count || 0) - parseInt(a.view_count || 0);
    if (sortBy === "clicks") return parseInt(b.click_count || 0) - parseInt(a.click_count || 0);
    if (sortBy === "ctr") {
      const ca = parseInt(a.view_count || 0) > 0 ? parseInt(a.click_count || 0) / parseInt(a.view_count || 0) : 0;
      const cb = parseInt(b.view_count || 0) > 0 ? parseInt(b.click_count || 0) / parseInt(b.view_count || 0) : 0;
      return cb - ca;
    }
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  const usedSlots = new Set(ads.filter((a) => a.is_active == 1).map((a) => a.slot_id));
  const usedSlotCount = [...usedSlots].filter((s) => SLOT_OPTIONS.some((o) => o.value === s)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "text-white", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900", children: t("adsPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("adsPage.subtitle") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowAdSenseSettings(!showAdSenseSettings), className: "flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }),
          " AdSense"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setActiveTab("manage");
          handleOpenForm();
        }, className: "flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
          " ",
          t("adsPage.addAd")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1", children: [{ key: "dashboard", label: t("adsPage.tabDashboard"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 15 }) }, { key: "campaigns", label: t("adsPage.tabCampaigns"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15 }) }, { key: "manage", label: t("adsPage.tabManage"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 15 }) }].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.key), className: `flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.key ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`, children: [
      tab.icon,
      " ",
      tab.label
    ] }, tab.key)) }),
    activeTab === "dashboard" && (() => {
      const maxViews = Math.max(...ads.map((a) => parseInt(a.view_count || 0)), 1);
      const maxClicks = Math.max(...ads.map((a) => parseInt(a.click_count || 0)), 1);
      const slotPct = SLOT_OPTIONS.length > 0 ? Math.round(usedSlotCount / SLOT_OPTIONS.length * 100) : 0;
      const activePct = ads.length > 0 ? Math.round(activeCount / ads.length * 100) : 0;
      const circumference = 2 * Math.PI * 40;
      const pageDistribution = {};
      ads.forEach((a) => {
        const p = getSlotPage(a.slot_id) || t("adsPage.other");
        pageDistribution[p] = (pageDistribution[p] || 0) + 1;
      });
      const pageColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
      const pageEntries = Object.entries(pageDistribution).sort((a, b) => b[1] - a[1]);
      const totalForDist = Math.max(pageEntries.reduce((s, [, c]) => s + c, 0), 1);
      const top5 = sortedAds.slice(0, 5);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
          { label: t("adsPage.totalAds"), value: ads.length, suffix: t("adsPage.countSuffix"), pct: 100, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 16 }), gradient: ["#6366f1", "#8b5cf6"] },
          { label: t("adsPage.activeAds"), value: activeCount, suffix: t("adsPage.countSuffix"), pct: activePct, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }), gradient: ["#10b981", "#14b8a6"] },
          { label: t("adsPage.totalImpressions"), value: totalImpressions.toLocaleString(), suffix: "", pct: 100, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16 }), gradient: ["#3b82f6", "#6366f1"] },
          { label: t("adsPage.totalClicks"), value: totalClicks.toLocaleString(), suffix: "", pct: totalImpressions > 0 ? Math.min(Math.round(totalClicks / totalImpressions * 100 * 10), 100) : 0, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 16 }), gradient: ["#f59e0b", "#ef4444"] },
          { label: t("adsPage.overallCTR"), value: overallCTR, suffix: "%", pct: Math.min(parseFloat(overallCTR) * 10, 100), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }), gradient: ["#8b5cf6", "#a855f7"] }
        ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-12 h-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "transform -rotate-90 w-full h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "40", stroke: "#f3f4f6", strokeWidth: "8", fill: "none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "50",
                    cy: "50",
                    r: "40",
                    stroke: `url(#grad-${i})`,
                    strokeWidth: "8",
                    fill: "none",
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference * (1 - stat.pct / 100),
                    strokeLinecap: "round",
                    className: "transition-all duration-1000"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `grad-${i}`, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: stat.gradient[0] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: stat.gradient[1] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-gray-600", children: stat.icon })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md", children: [
              stat.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-gray-900 leading-tight", children: [
            stat.value,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 font-bold ml-0.5", children: stat.suffix })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 font-medium mt-0.5", children: stat.label })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 14, className: "text-indigo-500" }),
              " ",
              t("adsPage.slotUtilization")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-36 h-36", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full transform -rotate-90", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "38", stroke: "#f3f4f6", strokeWidth: "12", fill: "none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "50",
                    cy: "50",
                    r: "38",
                    stroke: "url(#donut-grad)",
                    strokeWidth: "12",
                    fill: "none",
                    strokeDasharray: 2 * Math.PI * 38,
                    strokeDashoffset: 2 * Math.PI * 38 * (1 - slotPct / 100),
                    strokeLinecap: "round",
                    className: "transition-all duration-1000"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "donut-grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#6366f1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#a855f7" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-black text-gray-900", children: [
                  slotPct,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400 font-medium", children: [
                  usedSlotCount,
                  "/",
                  SLOT_OPTIONS.length
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-indigo-500" }),
                " ",
                t("adsPage.inUse"),
                " ",
                usedSlotCount
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-gray-200" }),
                " ",
                t("adsPage.unused"),
                " ",
                SLOT_OPTIONS.length - usedSlotCount
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 14, className: "text-emerald-500" }),
              " ",
              t("adsPage.adDistribution")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-full h-4 overflow-hidden mb-4", children: pageEntries.map(([page, count], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: { width: `${count / totalForDist * 100}%`, backgroundColor: pageColors[i % pageColors.length] },
                className: "transition-all duration-500 first:rounded-l-full last:rounded-r-full",
                title: `${page}: ${count}`
              },
              page
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: pageEntries.map(([page, count], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full flex-shrink-0", style: { backgroundColor: pageColors[i % pageColors.length] } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600 font-medium flex-1 truncate", children: page }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-900", children: count }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400", children: [
                Math.round(count / totalForDist * 100),
                "%"
              ] })
            ] }, page)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "text-orange-500" }),
              " ",
              t("adsPage.top5Ads"),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-gray-400 font-medium normal-case", children: sortBy === "views" ? t("adsPage.sortByViews") : sortBy === "clicks" ? t("adsPage.sortByClicks") : t("adsPage.sortByCTR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: top5.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 text-center py-8", children: t("adsPage.noData") }) : top5.map((ad, idx) => {
              const v = parseInt(ad.view_count || 0);
              const c = parseInt(ad.click_count || 0);
              const val = sortBy === "views" ? v : sortBy === "clicks" ? c : v > 0 ? c / v * 100 : 0;
              const maxVal = sortBy === "views" ? maxViews : sortBy === "clicks" ? maxClicks : Math.max(...ads.map((a) => {
                const vv = parseInt(a.view_count || 0);
                return vv > 0 ? parseInt(a.click_count || 0) / vv * 100 : 0;
              }), 1);
              const barPct = Math.max(val / maxVal * 100, 2);
              const barColors = ["bg-indigo-500", "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500"];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-gray-300 w-4", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 truncate flex-1", children: ad.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-gray-900", children: sortBy === "ctr" ? val.toFixed(2) + "%" : val.toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-6 h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${barColors[idx]} transition-all duration-700`, style: { width: `${barPct}%` } }) })
              ] }, ad.id);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 14, className: "text-indigo-500 dark:text-indigo-400" }),
            " ",
            t("adsPage.allSlotStatus"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-medium normal-case ml-auto", children: t("adsPage.activeSlots", { count: usedSlotCount }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2", children: SLOT_OPTIONS.map((slot) => {
            const slotAd = ads.find((a) => a.slot_id === slot.value && a.is_active == 1);
            const slotViews = ads.filter((a) => a.slot_id === slot.value).reduce((s, a) => s + parseInt(a.view_count || 0), 0);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-xl border p-3 transition-all hover:shadow-sm ${slotAd ? "bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/30 dark:from-indigo-500/20 dark:to-violet-500/20 dark:border-indigo-400/30" : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/40"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${slotAd ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-bold truncate ${slotAd ? "text-indigo-700 dark:text-indigo-300" : "text-gray-400 dark:text-gray-500"}`, children: slot.label.split(" (")[0] })
              ] }),
              slotAd ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-gray-500 dark:text-gray-400 pl-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  slotAd.title.substring(0, 12),
                  slotAd.title.length > 12 ? ".." : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-500 dark:text-indigo-400 font-bold", children: [
                  slotViews.toLocaleString(),
                  " views"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-300 dark:text-gray-600 pl-4", children: t("adsPage.empty") })
            ] }, slot.value);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-gray-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-indigo-500" }),
              " ",
              t("adsPage.adPerformanceRank")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [{ key: "views", label: t("adsPage.sortViews") }, { key: "clicks", label: t("adsPage.sortClicks") }, { key: "ctr", label: t("adsPage.sortCTR") }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSortBy(s.key), className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortBy === s.key ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`, children: s.label }, s.key)) })
          ] }),
          sortedAds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 32, className: "mx-auto mb-2 text-gray-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: t("adsPage.noAdsRegistered") })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("adsPage.ad") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("adsPage.slot") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3 min-w-[140px]", children: t("adsPage.impressions") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3 min-w-[120px]", children: t("adsPage.clicks") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-3", children: "CTR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3", children: t("adsPage.status") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3", children: t("adsPage.action") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedAds.map((ad, idx) => {
              const views = parseInt(ad.view_count || 0);
              const clicks = parseInt(ad.click_count || 0);
              const ctr = views > 0 ? (clicks / views * 100).toFixed(2) : "0.00";
              const viewPct = Math.max(views / maxViews * 100, 0);
              const clickPct = Math.max(clicks / maxClicks * 100, 0);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-gray-50 hover:bg-gray-50/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black ${idx < 3 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-gray-100 text-gray-400"}`, children: idx + 1 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  ad.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ad.image_url, alt: "", className: "w-10 h-7 object-cover rounded-lg border" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 truncate max-w-[160px]", children: ad.title })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-gray-400", children: getSlotLabel(ad.slot_id).split(" (")[0] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 w-14 text-right", children: views.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500", style: { width: `${viewPct}%` } }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-emerald-600 w-10 text-right", children: clicks.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500", style: { width: `${clickPct}%` } }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 text-right font-bold text-indigo-600", children: [
                  ctr,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.is_active == 1 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`, children: ad.is_active == 1 ? t("adsPage.active") : t("adsPage.inactive") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReportAd(ad), className: "p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100", title: t("adsPage.reportTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 13 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleActive(ad), className: "p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100", title: ad.is_active == 1 ? t("adsPage.deactivate") : t("adsPage.activate"), children: ad.is_active == 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 13 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                    setActiveTab("manage");
                    handleOpenForm(ad);
                  }, className: "p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100", title: t("adsPage.edit"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }) })
                ] }) })
              ] }, ad.id);
            }) })
          ] }) })
        ] })
      ] });
    })(),
    activeTab === "campaigns" && (() => {
      const statusColors = { active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400", completed: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400" };
      const statusLabels = { active: t("adsPage.statusActive"), paused: t("adsPage.statusPaused"), completed: t("adsPage.statusCompleted") };
      const statusIcons = { active: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 11 }), paused: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 11 }), completed: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }) };
      const filteredCampaigns = campaigns.filter((c) => !campaignSearch || c.name.toLowerCase().includes(campaignSearch.toLowerCase()) || (c.advertiser || "").toLowerCase().includes(campaignSearch.toLowerCase()));
      const getCampaignAds = (cid) => ads.filter((a) => a.campaign_id == cid);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: campaignSearch, onChange: (e) => setCampaignSearch(e.target.value), placeholder: t("adsPage.searchCampaign"), className: "w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setEditingCampaign(null);
                setCampaignForm({ name: "", advertiser: "", budget: "", start_date: "", end_date: "", status: "active", memo: "" });
                setShowCampaignForm(true);
              },
              className: "flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                " ",
                t("adsPage.createCampaign")
              ]
            }
          )
        ] }),
        showCampaignForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-lg p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-gray-900 dark:text-white mb-4", children: editingCampaign ? t("adsPage.editCampaign") : t("adsPage.newCampaign") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.campaignName") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: campaignForm.name, onChange: (e) => setCampaignForm({ ...campaignForm, name: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm", placeholder: t("adsPage.campaignNamePlaceholder") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.advertiser") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: campaignForm.advertiser, onChange: (e) => setCampaignForm({ ...campaignForm, advertiser: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm", placeholder: t("adsPage.advertiserPlaceholder") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.budget") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: campaignForm.budget, onChange: (e) => setCampaignForm({ ...campaignForm, budget: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm", placeholder: t("adsPage.budgetOptional") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.campaignStatus") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: campaignForm.status, onChange: (e) => setCampaignForm({ ...campaignForm, status: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: t("adsPage.statusActive") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paused", children: t("adsPage.statusPaused") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: t("adsPage.statusCompleted") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.startDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: campaignForm.start_date, onChange: (e) => setCampaignForm({ ...campaignForm, start_date: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.endDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: campaignForm.end_date, onChange: (e) => setCampaignForm({ ...campaignForm, end_date: e.target.value }), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1", children: t("adsPage.memo") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: campaignForm.memo, onChange: (e) => setCampaignForm({ ...campaignForm, memo: e.target.value }), rows: 2, className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm resize-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5", children: t("adsPage.targetCountries", "타겟 국가") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCampaignForm({ ...campaignForm, target_countries: "all" }), className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${campaignForm.target_countries === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200"}`, children: [
                  "🌍 ",
                  t("adsPage.allCountriesTarget", "전체")
                ] }),
                COUNTRY_OPTIONS.map((co) => {
                  const countries = campaignForm.target_countries || "all";
                  const arr = countries === "all" ? [] : countries.split(",");
                  const isOn = countries === "all" || arr.includes(co.code);
                  const toggle = () => {
                    if (countries === "all") {
                      setCampaignForm({ ...campaignForm, target_countries: co.code });
                    } else if (isOn) {
                      const next = arr.filter((c) => c !== co.code);
                      setCampaignForm({ ...campaignForm, target_countries: next.length ? next.join(",") : "all" });
                    } else {
                      setCampaignForm({ ...campaignForm, target_countries: [...arr, co.code].join(",") });
                    }
                  };
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: toggle, className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${countries !== "all" && isOn ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200"}`, children: [
                    co.flag,
                    " ",
                    co.label
                  ] }, co.code);
                })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setShowCampaignForm(false);
              setEditingCampaign(null);
            }, className: "px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold", children: t("adsPage.cancel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCampaignSubmit, className: "px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700", children: editingCampaign ? t("adsPage.update") : t("adsPage.create") })
          ] })
        ] }),
        filteredCampaigns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-3", size: 40 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium", children: t("adsPage.noCampaigns") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 dark:text-gray-600 mt-1", children: t("adsPage.noCampaignsDesc") })
        ] }),
        filteredCampaigns.map((c) => {
          const cAds = getCampaignAds(c.id);
          const isExpanded = expandedCampaign === c.id;
          const totalViews = parseInt(c.total_views || 0);
          const totalClicks2 = parseInt(c.total_clicks || 0);
          const ctr = totalViews > 0 ? (totalClicks2 / totalViews * 100).toFixed(2) : "0.00";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all hover:shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 cursor-pointer", onClick: () => setExpandedCampaign(isExpanded ? null : c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-gray-400 dark:text-gray-500 transition-transform", style: { transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 18 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-extrabold text-gray-900 dark:text-white truncate", children: c.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${statusColors[c.status] || ""}`, children: [
                    statusIcons[c.status],
                    " ",
                    statusLabels[c.status]
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg font-bold", children: t("adsPage.adsCount", { count: c.ad_count || 0 }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
                  c.advertiser && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-400 dark:text-gray-500", children: c.advertiser }),
                  c.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-300 dark:text-gray-600", children: [
                    c.start_date,
                    " ~ ",
                    c.end_date || t("adsPage.ongoing")
                  ] }),
                  c.target_countries && c.target_countries !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5", children: c.target_countries.split(",").map((cc) => {
                    const opt = COUNTRY_OPTIONS.find((o) => o.code === cc);
                    return opt ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-bold", children: opt.flag }, cc) : null;
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-5 text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900 dark:text-white", children: totalViews.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 font-medium", children: t("adsPage.impressionLabel") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-emerald-600 dark:text-emerald-400", children: totalClicks2.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 font-medium", children: t("adsPage.clickLabel") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-extrabold text-indigo-600 dark:text-indigo-400", children: [
                    ctr,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 font-medium", children: "CTR" })
                ] })
              ] })
            ] }) }),
            isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-100 dark:border-gray-700", children: [
              cAds.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: cAds.map((a) => {
                  var _a, _b;
                  const av = parseInt(a.view_count || 0);
                  const ac = parseInt(a.click_count || 0);
                  const aCtr = av > 0 ? (ac / av * 100).toFixed(2) : "0.00";
                  const slotLabel = ((_b = (_a = SLOT_OPTIONS.find((s) => s.value === a.slot_id)) == null ? void 0 : _a.label) == null ? void 0 : _b.split(" (")[0]) || a.slot_id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors", children: [
                    a.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image_url, alt: "", className: "w-12 h-8 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-200 truncate", children: a.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500", children: slotLabel })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 dark:text-gray-300", children: av.toLocaleString() }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 ml-1", children: t("adsPage.impressionLabel") })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-emerald-600 dark:text-emerald-400", children: ac.toLocaleString() }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 ml-1", children: t("adsPage.clickLabel") })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 w-14 text-right", children: [
                        aCtr,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      handleUnassignAd(a.id);
                    }, className: "p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10", title: t("adsPage.removeFromCampaign"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
                  ] }, a.id);
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-indigo-700 dark:text-indigo-300", children: t("adsPage.total") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-300", children: [
                      t("adsPage.impressionLabel"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-indigo-700 dark:text-indigo-300", children: totalViews.toLocaleString() })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-300", children: [
                      t("adsPage.clickLabel"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-emerald-600 dark:text-emerald-400", children: totalClicks2.toLocaleString() })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-300", children: [
                      "CTR ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-indigo-700 dark:text-indigo-300", children: [
                        ctr,
                        "%"
                      ] })
                    ] }),
                    c.budget && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-300", children: [
                      t("adsPage.budgetLabel"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-amber-600 dark:text-amber-400", children: [
                        "₩",
                        Number(c.budget).toLocaleString()
                      ] })
                    ] })
                  ] })
                ] }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-2", size: 28 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: t("adsPage.noAssignedAds") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-gray-50 dark:border-gray-700/50 flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCampaignReportId(c.id), className: "flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 13 }),
                  " ",
                  t("adsPage.report")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                  setAssigningCampaignId(c.id);
                  setAssignSelectedAds(/* @__PURE__ */ new Set());
                }, className: "flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
                  " ",
                  t("adsPage.assignAds")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      setEditingCampaign(c);
                      setCampaignForm({ name: c.name, advertiser: c.advertiser || "", budget: c.budget || "", start_date: c.start_date || "", end_date: c.end_date || "", status: c.status, memo: c.memo || "", target_countries: c.target_countries || "all" });
                      setShowCampaignForm(true);
                    },
                    className: "flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }),
                      " ",
                      t("adsPage.edit")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleCampaignDelete(c), className: "flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 ml-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
                  " ",
                  t("adsPage.deleteAction")
                ] })
              ] }),
              assigningCampaignId === c.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-emerald-50/50 dark:bg-emerald-500/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-emerald-700 dark:text-emerald-400", children: t("adsPage.selectFromUnassigned") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAssigningCampaignId(null), className: "px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg text-xs font-bold", children: t("adsPage.cancel") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleAssignAds(c.id), disabled: assignSelectedAds.size === 0, className: "px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold disabled:opacity-50", children: t("adsPage.assign", { count: assignSelectedAds.size }) })
                  ] })
                ] }),
                unassignedAds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: t("adsPage.noUnassignedAds") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-48 overflow-y-auto", children: unassignedAds.map((ua) => {
                  var _a, _b;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${assignSelectedAds.has(ua.id) ? "bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30" : "bg-white dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 hover:border-emerald-300"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: assignSelectedAds.has(ua.id), onChange: () => {
                      const n = new Set(assignSelectedAds);
                      n.has(ua.id) ? n.delete(ua.id) : n.add(ua.id);
                      setAssignSelectedAds(n);
                    }, className: "accent-emerald-600" }),
                    ua.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ua.image_url, alt: "", className: "w-10 h-7 object-cover rounded border" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-200 truncate", children: ua.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: ((_b = (_a = SLOT_OPTIONS.find((s) => s.value === ua.slot_id)) == null ? void 0 : _a.label) == null ? void 0 : _b.split(" (")[0]) || ua.slot_id })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400", children: [
                      parseInt(ua.view_count || 0).toLocaleString(),
                      " ",
                      t("adsPage.impressionLabel")
                    ] })
                  ] }, ua.id);
                }) })
              ] })
            ] })
          ] }, c.id);
        }),
        unassignedAds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 14 }),
            " ",
            t("adsPage.unassignedAds", { count: unassignedAds.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: unassignedAds.slice(0, 6).map((ua) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30", children: [
              ua.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ua.image_url, alt: "", className: "w-10 h-7 object-cover rounded border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 truncate", children: ua.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: ((_b = (_a = SLOT_OPTIONS.find((s) => s.value === ua.slot_id)) == null ? void 0 : _a.label) == null ? void 0 : _b.split(" (")[0]) || ua.slot_id })
              ] })
            ] }, ua.id);
          }) }),
          unassignedAds.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 text-center mt-2", children: t("adsPage.andMore", { count: unassignedAds.length - 6 }) })
        ] })
      ] });
    })(),
    activeTab === "manage" && (() => {
      const statusFiltered = statusFilter === "all" ? filteredAds : filteredAds.filter((a) => statusFilter === "active" ? a.is_active == 1 : a.is_active != 1);
      const allSelected = statusFiltered.length > 0 && statusFiltered.every((a) => selectedIds.has(a.id));
      const someSelected = selectedIds.size > 0;
      const toggleSelect = (id) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
      };
      const toggleAll = () => {
        if (allSelected) {
          setSelectedIds(/* @__PURE__ */ new Set());
        } else {
          setSelectedIds(new Set(statusFiltered.map((a) => a.id)));
        }
      };
      const handleBatchToggle = async (activate) => {
        try {
          const res = await fetch(`${API_BASE}/batch_update_ads.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [...selectedIds], fields: { is_active: activate ? 1 : 0 } })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message || (activate ? t("adsPage.batchActivated") : t("adsPage.batchDeactivated")));
            setSelectedIds(/* @__PURE__ */ new Set());
            fetchAds();
          } else {
            showToast(data.message || t("adsPage.errorOccurred"), "error");
          }
        } catch {
          showToast(t("adsPage.serverError"), "error");
        }
      };
      const handleBatchDelete = () => {
        setConfirmModal({
          title: t("adsPage.batchDeleteTitle"),
          message: t("adsPage.batchDeleteMsg", { count: selectedIds.size }),
          onConfirm: async () => {
            for (const id of selectedIds) {
              const ad = ads.find((a) => a.id === id);
              if (ad) await handleDelete(ad);
            }
            setSelectedIds(/* @__PURE__ */ new Set());
            setConfirmModal(null);
          }
        });
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setCountryFilter("all");
                setSelectedIds(/* @__PURE__ */ new Set());
              },
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700"}`,
              children: [
                "🌐 ",
                t("adsPage.allCountries") || "전체"
              ]
            }
          ),
          COUNTRY_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setCountryFilter(c.code);
                setSelectedIds(/* @__PURE__ */ new Set());
              },
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === c.code ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700"}`,
              children: [
                c.flag,
                " ",
                c.label
              ]
            },
            c.code
          ))
        ] }),
        showAdSenseSettings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20, className: "text-gray-400" }),
              " ",
              t("adsPage.adsenseSettings")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAdSenseSettings(false), className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: adsenseForm.client_id, onChange: (e) => setAdsenseForm({ ...adsenseForm, client_id: e.target.value }), placeholder: "ca-pub-XXXXXXXXXX", className: "flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none text-sm font-medium dark:text-white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAdsenseForm({ ...adsenseForm, is_enabled: adsenseForm.is_enabled ? 0 : 1 }), className: `px-4 py-2.5 rounded-xl text-sm font-bold ${adsenseForm.is_enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: adsenseForm.is_enabled ? t("adsPage.adsenseEnabled") : t("adsPage.adsenseDisabled") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto", children: SLOT_OPTIONS.map((slot) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 min-w-[180px] truncate", children: slot.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: ((_a = adsenseForm.slot_configs) == null ? void 0 : _a[slot.value]) || "", onChange: (e) => setAdsenseForm({ ...adsenseForm, slot_configs: { ...adsenseForm.slot_configs, [slot.value]: e.target.value } }), placeholder: "Slot ID", className: "flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-transparent focus:border-indigo-500 outline-none text-xs font-medium dark:text-white" })
              ] }, slot.value);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSaveAdsense, className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
            " ",
            t("adsPage.save")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: t("adsPage.searchAdTitle"), className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 outline-none font-medium text-sm dark:text-white" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterSlot, onChange: (e) => setFilterSlot(e.target.value), className: "w-full md:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm dark:text-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("adsPage.allSlots") }),
                SLOT_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label.split(" (")[0] }, s.value))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
              { key: "all", label: t("adsPage.all"), count: filteredAds.length },
              { key: "active", label: t("adsPage.active"), count: filteredAds.filter((a) => a.is_active == 1).length },
              { key: "inactive", label: t("adsPage.inactive"), count: filteredAds.filter((a) => a.is_active != 1).length }
            ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setStatusFilter(f.key);
                  setSelectedIds(/* @__PURE__ */ new Set());
                },
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${statusFilter === f.key ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" : "bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-500 dark:hover:bg-gray-700"}`,
                children: [
                  f.label,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/50 dark:bg-gray-600/50 px-1.5 rounded-md", children: f.count })
                ]
              },
              f.key
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("list"), className: `p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`, title: t("adsPage.listView") || "리스트 보기", children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 16 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("grid"), className: `p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`, title: t("adsPage.gridView") || "박스 보기", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 16 }) })
            ] })
          ] })
        ] }),
        someSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-indigo-700 dark:text-indigo-300", children: t("adsPage.batchSelected", { count: selectedIds.size }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-px bg-indigo-200 dark:bg-indigo-500/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleBatchToggle(true), className: "px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 13 }),
            " ",
            t("adsPage.batchActivate")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleBatchToggle(false), className: "px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 13 }),
            " ",
            t("adsPage.batchDeactivate")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBatchDelete, className: "px-3 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
            " ",
            t("adsPage.batchDelete")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBatchEditOpen, className: "px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }),
            " ",
            t("adsPage.batchEdit") || "일괄 수정"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedIds(/* @__PURE__ */ new Set()), className: "ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium", children: t("adsPage.deselectAll") })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) }) : statusFiltered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: t("adsPage.noAdsRegistered") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleOpenForm(), className: "mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " ",
            t("adsPage.newAdRegistration")
          ] })
        ] }) : viewMode === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: allSelected, onChange: toggleAll, className: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("adsPage.adTable") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("adsPage.slot") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3", children: t("adsPage.status") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-3", children: t("adsPage.impressions") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-3", children: t("adsPage.clicks") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3", children: t("adsPage.period") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 w-28", children: t("adsPage.manage") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50 dark:divide-gray-700/30", children: statusFiltered.map((ad) => {
              const isSelected = selectedIds.has(ad.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20 ${isSelected ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(ad.id), className: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  ad.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ad.image_url, alt: "", className: "w-12 h-8 object-cover rounded-lg border dark:border-gray-700 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-white truncate max-w-[200px]", children: ad.title }),
                    ad.click_url && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 truncate max-w-[200px]", children: ad.click_url })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: getSlotLabel(ad.slot_id).split(" (")[0] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleActive(ad), className: `px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${ad.is_active == 1 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"}`, children: ad.is_active == 1 ? t("adsPage.active") : t("adsPage.inactive") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-bold text-gray-700 dark:text-gray-300 tabular-nums", children: parseInt(ad.view_count || 0).toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums", children: parseInt(ad.click_count || 0).toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: ad.start_date || ad.end_date ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-gray-400", children: [
                  ad.start_date || "~",
                  " ~ ",
                  ad.end_date || ""
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-300 dark:text-gray-600", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenForm(ad), className: "p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors", title: t("adsPage.edit"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCopyAd(ad), className: "p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-colors", title: t("adsPage.copy"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReportAd(ad), className: "p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 transition-colors", title: t("adsPage.reportTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 13 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(ad), className: "p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors", title: t("adsPage.deleteLabel"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }) })
                ] }) })
              ] }, ad.id);
            }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: t("adsPage.totalAdsCount", { count: statusFiltered.length }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                t("adsPage.impressionTotal"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-gray-600 dark:text-gray-300", children: statusFiltered.reduce((s, a) => s + parseInt(a.view_count || 0), 0).toLocaleString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                t("adsPage.clickTotal"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-emerald-600 dark:text-emerald-400", children: statusFiltered.reduce((s, a) => s + parseInt(a.click_count || 0), 0).toLocaleString() })
              ] })
            ] })
          ] })
        ] }) : (
          /* ===== GRID / BOX VIEW ===== */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: statusFiltered.map((ad) => {
              const isSelected = selectedIds.has(ad.id);
              const views = parseInt(ad.view_count || 0);
              const clicks = parseInt(ad.click_count || 0);
              const ctr = views > 0 ? (clicks / views * 100).toFixed(2) : "0.00";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white dark:bg-gray-800/50 rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-lg group ${isSelected ? "border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30" : "border-gray-100 dark:border-gray-700/50"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video bg-gray-100 dark:bg-gray-700/50", children: [
                  ad.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ad.image_url, alt: ad.title, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 36, className: "text-gray-300 dark:text-gray-600" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: () => toggleSelect(ad.id),
                      className: "w-4 h-4 rounded border-2 border-white/80 text-indigo-600 focus:ring-indigo-500 shadow-sm"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${ad.is_active == 1 ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"}`, children: ad.is_active == 1 ? t("adsPage.active") : t("adsPage.inactive") }) }),
                  ad.click_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: ad.click_url, target: "_blank", rel: "noreferrer", className: "absolute bottom-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-gray-900 dark:text-white truncate mb-1", children: ad.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 dark:text-gray-500 mb-3", children: getSlotLabel(ad.slot_id).split(" (")[0] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-800 dark:text-gray-200", children: views.toLocaleString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 font-medium mt-0.5", children: t("adsPage.impressions") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-emerald-600 dark:text-emerald-400", children: clicks.toLocaleString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 font-medium mt-0.5", children: t("adsPage.clicks") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-extrabold text-indigo-600 dark:text-indigo-400", children: [
                        ctr,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 font-medium mt-0.5", children: "CTR" })
                    ] })
                  ] }),
                  (ad.start_date || ad.end_date) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10 }),
                    " ",
                    ad.start_date || "~",
                    " ~ ",
                    ad.end_date || ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-700/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleActive(ad), className: `p-1.5 rounded-lg transition-colors ${ad.is_active == 1 ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-500"}`, title: ad.is_active == 1 ? t("adsPage.deactivate") : t("adsPage.activate"), children: ad.is_active == 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenForm(ad), className: "p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors", title: t("adsPage.edit"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCopyAd(ad), className: "p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 transition-colors", title: t("adsPage.copy"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReportAd(ad), className: "p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 transition-colors", title: t("adsPage.reportTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(ad), className: "p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors ml-auto", title: t("adsPage.deleteLabel"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
                  ] })
                ] })
              ] }, ad.id);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 px-4 py-3 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: t("adsPage.totalAdsCount", { count: statusFiltered.length }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  t("adsPage.impressionTotal"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-gray-600 dark:text-gray-300", children: statusFiltered.reduce((s, a) => s + parseInt(a.view_count || 0), 0).toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  t("adsPage.clickTotal"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-emerald-600 dark:text-emerald-400", children: statusFiltered.reduce((s, a) => s + parseInt(a.click_count || 0), 0).toLocaleString() })
                ] })
              ] })
            ] })
          ] })
        )
      ] });
    })(),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => {
      setShowForm(false);
      resetForm();
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-extrabold text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 20 }),
          editingAd ? t("adsPage.editAd") : t("adsPage.createAd")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowForm(false);
          resetForm();
        }, className: "text-white/80 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.adSlot") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.slot_id, onChange: (e) => setForm({ ...form, slot_id: e.target.value }), className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium", children: SLOT_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.adTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: t("adsPage.adTitlePlaceholder"), className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium", required: true })
        ] }),
        (() => {
          const guide = SLOT_SIZE_GUIDE[form.slot_id];
          const fl = guide ? guide.format === "banner" ? t("adsPage.bannerType") : guide.format === "card" ? t("adsPage.cardType") : t("adsPage.nativeType") : "";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-200 bg-blue-50/30 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 16, className: "text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-blue-700 uppercase", children: t("adsPage.pcImage", "PC용 광고 이미지") }),
                !editingAd && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-red-400 font-bold", children: [
                  "*",
                  t("adsPage.required", "필수")
                ] }),
                editingAd && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-medium", children: t("adsPage.adImageOptional") })
              ] }),
              guide && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 px-3 py-2 bg-blue-100/60 rounded-lg border border-blue-200/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-blue-600 font-bold", children: [
                  "📐 ",
                  t("adsPage.recommendedSizeLabel", "권장 사이즈"),
                  ":"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-blue-800 font-extrabold", children: guide.pc.size }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-blue-500 font-medium", children: [
                  "(",
                  t("adsPage.ratioLabel", "비율"),
                  " ",
                  guide.pc.ratio,
                  " · ",
                  fl,
                  ")"
                ] })
              ] }),
              imagePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2 rounded-xl overflow-hidden border border-blue-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imagePreview, alt: t("adsPage.preview"), className: "w-full h-32 object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setImageFile(null);
                  setImagePreview((editingAd == null ? void 0 : editingAd.image_url) || null);
                }, className: "absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-white hover:bg-black/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-dashed border-blue-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18, className: "text-blue-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-blue-600 font-medium", children: t("adsPage.selectPcImage", "PC용 이미지 선택") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "hidden" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50/30 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 16, className: "text-emerald-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-emerald-700 uppercase", children: t("adsPage.mobileImage", "모바일용 광고 이미지") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400 font-medium", children: [
                  "(",
                  t("adsPage.optional", "선택"),
                  ")"
                ] })
              ] }),
              guide && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 px-3 py-2 bg-emerald-100/60 rounded-lg border border-emerald-200/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-emerald-600 font-bold", children: [
                  "📐 ",
                  t("adsPage.recommendedSizeLabel", "권장 사이즈"),
                  ":"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-emerald-800 font-extrabold", children: guide.mobile.size }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-500 font-medium", children: [
                  "(",
                  t("adsPage.ratioLabel", "비율"),
                  " ",
                  guide.mobile.ratio,
                  " · ",
                  fl,
                  ")"
                ] })
              ] }),
              mobileImagePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2 rounded-xl overflow-hidden border border-emerald-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: mobileImagePreview, alt: t("adsPage.mobilePreview", "모바일 미리보기"), className: "w-full h-28 object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setMobileImageFile(null);
                  setMobileImagePreview((editingAd == null ? void 0 : editingAd.mobile_image_url) || null);
                }, className: "absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-white hover:bg-black/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-dashed border-emerald-300 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18, className: "text-emerald-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-emerald-600 font-medium", children: t("adsPage.selectMobileImage", "모바일용 이미지 선택") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleMobileImageChange, className: "hidden" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 mt-1.5 leading-relaxed", children: [
                "💡 ",
                t("adsPage.mobileImageHint", "모바일 이미지를 등록하지 않으면 PC용 이미지가 모바일에서도 사용됩니다.")
              ] })
            ] })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.clickUrl") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value: form.click_url, onChange: (e) => setForm({ ...form, click_url: e.target.value }), placeholder: "https://example.com", className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.startDate") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.start_date, onChange: (e) => setForm({ ...form, start_date: e.target.value }), className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.endDate") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.end_date, onChange: (e) => setForm({ ...form, end_date: e.target.value }), className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 self-center mr-1", children: t("adsPage.quickSetup") }),
          [{ label: t("adsPage.days7"), days: 7 }, { label: t("adsPage.days15"), days: 15 }, { label: t("adsPage.days30"), days: 30 }, { label: t("adsPage.months2"), days: 60 }, { label: t("adsPage.months3"), days: 90 }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleDateShortcut(opt.days), className: "px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors", children: opt.label }, opt.days))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.priority") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", value: form.priority, onChange: (e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.statusLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setForm({ ...form, is_active: form.is_active ? 0 : 1 }), className: `w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${form.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`, children: form.is_active ? t("adsPage.activeStatus") : t("adsPage.inactiveStatus") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1.5", children: t("adsPage.targetCountries") || "대상 국가" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setForm({ ...form, target_countries: "all" }),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${form.target_countries === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
                children: [
                  "🌐 ",
                  t("adsPage.allCountries") || "전체"
                ]
              }
            ),
            COUNTRY_OPTIONS.map((c) => {
              const selected = form.target_countries !== "all" && form.target_countries.split(",").includes(c.code);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (form.target_countries === "all") {
                      setForm({ ...form, target_countries: c.code });
                    } else {
                      const codes = form.target_countries.split(",").filter(Boolean);
                      if (selected) {
                        const next = codes.filter((x) => x !== c.code);
                        setForm({ ...form, target_countries: next.length ? next.join(",") : "all" });
                      } else {
                        setForm({ ...form, target_countries: [...codes, c.code].join(",") });
                      }
                    }
                  },
                  className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
                  children: [
                    c.flag,
                    " ",
                    c.label
                  ]
                },
                c.code
              );
            })
          ] }),
          form.target_countries !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-indigo-400 mt-1.5", children: [
            t("adsPage.selectedCountries") || "선택된 국가",
            ": ",
            form.target_countries.split(",").map((c) => {
              var _a;
              return ((_a = COUNTRY_OPTIONS.find((o) => o.code === c)) == null ? void 0 : _a.flag) || c;
            }).join(" ")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50", children: submitting ? t("adsPage.submitting") : editingAd ? t("adsPage.submitEdit") : t("adsPage.submitCreate") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setShowForm(false);
            resetForm();
          }, className: "px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors", children: t("adsPage.cancel") })
        ] })
      ] })
    ] }) }),
    showBatchEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setShowBatchEdit(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-extrabold text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 20 }),
          t("adsPage.batchEdit") || "일괄 수정",
          " (",
          selectedIds.size,
          t("adsPage.batchCount") || "개",
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowBatchEdit(false), className: "text-white/80 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("adsPage.batchEditDesc") || "수정할 항목을 체크한 후 값을 설정하세요. 체크된 항목만 일괄 적용됩니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 transition-colors ${batchEditForm.target_countries.enabled ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.target_countries.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.targetCountries") || "대상 국가" })
          ] }),
          batchEditForm.target_countries.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: "all" } }),
                className: `px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${batchEditForm.target_countries.value === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"}`,
                children: [
                  "🌐 ",
                  t("adsPage.allCountries") || "전체"
                ]
              }
            ),
            COUNTRY_OPTIONS.map((c) => {
              const sel = batchEditForm.target_countries.value !== "all" && batchEditForm.target_countries.value.split(",").includes(c.code);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const cur = batchEditForm.target_countries.value;
                    if (cur === "all") {
                      setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: c.code } });
                    } else {
                      const codes = cur.split(",").filter(Boolean);
                      const next = sel ? codes.filter((x) => x !== c.code) : [...codes, c.code];
                      setBatchEditForm({ ...batchEditForm, target_countries: { ...batchEditForm.target_countries, value: next.length ? next.join(",") : "all" } });
                    }
                  },
                  className: `px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${sel ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"}`,
                  children: [
                    c.flag,
                    " ",
                    c.label
                  ]
                },
                c.code
              );
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 transition-colors ${batchEditForm.slot_id.enabled ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.slot_id.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, slot_id: { ...batchEditForm.slot_id, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.adSlot") })
          ] }),
          batchEditForm.slot_id.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: batchEditForm.slot_id.value, onChange: (e) => setBatchEditForm({ ...batchEditForm, slot_id: { ...batchEditForm.slot_id, value: e.target.value } }), className: "w-full mt-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none", children: SLOT_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 transition-colors ${batchEditForm.priority.enabled ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.priority.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, priority: { ...batchEditForm.priority, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.priority") })
            ] }),
            batchEditForm.priority.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", value: batchEditForm.priority.value, onChange: (e) => setBatchEditForm({ ...batchEditForm, priority: { ...batchEditForm.priority, value: parseInt(e.target.value) || 0 } }), className: "w-full mt-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 transition-colors ${batchEditForm.is_active.enabled ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.is_active.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, is_active: { ...batchEditForm.is_active, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.statusLabel") })
            ] }),
            batchEditForm.is_active.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setBatchEditForm({ ...batchEditForm, is_active: { ...batchEditForm.is_active, value: batchEditForm.is_active.value ? 0 : 1 } }), className: `w-full mt-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${batchEditForm.is_active.value ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: batchEditForm.is_active.value ? t("adsPage.activeStatus") : t("adsPage.inactiveStatus") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl border p-3 transition-colors ${batchEditForm.start_date.enabled || batchEditForm.end_date.enabled ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.start_date.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, start_date: { ...batchEditForm.start_date, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.startDate") })
            ] }),
            batchEditForm.start_date.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: batchEditForm.start_date.value, onChange: (e) => setBatchEditForm({ ...batchEditForm, start_date: { ...batchEditForm.start_date, value: e.target.value } }), className: "w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: batchEditForm.end_date.enabled, onChange: (e) => setBatchEditForm({ ...batchEditForm, end_date: { ...batchEditForm.end_date, enabled: e.target.checked } }), className: "w-4 h-4 rounded accent-indigo-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase", children: t("adsPage.endDate") })
            ] }),
            batchEditForm.end_date.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: batchEditForm.end_date.value, onChange: (e) => setBatchEditForm({ ...batchEditForm, end_date: { ...batchEditForm.end_date, value: e.target.value } }), className: "w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium dark:text-white outline-none" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBatchEditSubmit, className: "flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors", children: t("adsPage.applyBatchEdit") || "일괄 적용" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowBatchEdit(false), className: "px-5 py-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors", children: t("adsPage.cancel") })
        ] })
      ] })
    ] }) }),
    reportAd && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminAdDashboard, { ad: reportAd, onClose: () => setReportAd(null) }),
    campaignReportId && /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignReportModal, { campaignId: campaignReportId, onClose: () => setCampaignReportId(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: confirmModal, onClose: () => setConfirmModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
export {
  AdminAds as default
};
