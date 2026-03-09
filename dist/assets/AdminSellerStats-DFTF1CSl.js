import { a as useAuth, d as useToast, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, o as BarChart3, aS as Award, at as Target, af as AlertCircle, aV as RefreshCw, w as TrendingUp, bc as Activity, G as Globe, Q as Database, bk as PlusCircle, aq as Clock, bl as CalendarDays, bm as CalendarRange, v as Users, F as FileText, bn as DollarSign, ao as Star, W as Package, ap as MapPin, N as Eye, f as Search, an as Zap, a as X, az as Calendar } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api/users";
const COLORS = {
  primary: "#5551e8",
  primaryLight: "#6d69f1",
  primaryBg: "#EEEDFD",
  accent: "#6d69f1",
  accentLight: "#9B98F5",
  dark: "#2d2b6e"
};
const COUNTRY_INFO = {
  KR: { name: "한국", flag: "🇰🇷" },
  US: { name: "미국", flag: "🇺🇸" },
  GB: { name: "영국", flag: "🇬🇧" },
  CA: { name: "캐나다", flag: "🇨🇦" },
  JP: { name: "일본", flag: "🇯🇵" },
  SG: { name: "싱가포르", flag: "🇸🇬" },
  VN: { name: "베트남", flag: "🇻🇳" },
  TH: { name: "태국", flag: "🇹🇭" },
  KH: { name: "캄보디아", flag: "🇰🇭" },
  RU: { name: "러시아", flag: "🇷🇺" },
  UA: { name: "우크라이나", flag: "🇺🇦" }
};
const AdminSellerStats = () => {
  var _a, _b, _c, _d, _e, _f, _g;
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation("admin");
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [countryFilter, setCountryFilter] = reactExports.useState("ALL");
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedSeller, setSelectedSeller] = reactExports.useState(null);
  const [sellerDetail, setSellerDetail] = reactExports.useState(null);
  const [detailLoading, setDetailLoading] = reactExports.useState(false);
  const fetchOverview = reactExports.useCallback(async () => {
    var _a2;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/seller_stats_admin.php?action=overview&country_code=${countryFilter}`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || t("sellerStatsPage.dataLoadFailed"));
        showToast(json.message || t("sellerStatsPage.dataLoadFailed"), "error");
      }
    } catch (err) {
      const msg = ((_a2 = err.message) == null ? void 0 : _a2.includes("HTTP")) ? t("sellerStatsPage.serverError", { msg: err.message }) : t("sellerStatsPage.serverConnFailed");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, t, countryFilter]);
  reactExports.useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);
  const fetchSellerDetail = async (sellerId) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seller_stats_admin.php?action=seller_detail&seller_id=${sellerId}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setSellerDetail(json);
        setSelectedSeller(sellerId);
      } else showToast(json.message || t("sellerStatsPage.dataLoadFailed"), "error");
    } catch {
      showToast(t("sellerStatsPage.serverConnFailed"), "error");
    } finally {
      setDetailLoading(false);
    }
  };
  const formatRevenue = (val) => {
    const n = parseInt(val) || 0;
    if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억원`;
    if (n >= 1e4) return `${Math.round(n / 1e4).toLocaleString()}만원`;
    return `${n.toLocaleString()}원`;
  };
  const filteredSellers = reactExports.useMemo(() => {
    if (!(data == null ? void 0 : data.topSellers)) return [];
    if (!searchQuery.trim()) return data.topSellers;
    const q = searchQuery.toLowerCase();
    return data.topSellers.filter(
      (s) => (s.name || "").toLowerCase().includes(q) || (s.brand_name || "").toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q)
    );
  }, [data, searchQuery]);
  const sellerCount = (data == null ? void 0 : data.sellerCount) || 0;
  const totals = (data == null ? void 0 : data.totals) || {};
  const topSellers = (data == null ? void 0 : data.topSellers) || [];
  const monthlyTrend = (data == null ? void 0 : data.monthlyTrend) || [];
  const categoryDist = (data == null ? void 0 : data.categoryDist) || [];
  const regionDist = (data == null ? void 0 : data.regionDist) || [];
  const availableCountries = (data == null ? void 0 : data.availableCountries) || [];
  const countryBreakdown = (data == null ? void 0 : data.countryBreakdown) || [];
  const recentActivity = (data == null ? void 0 : data.recentActivity) || [];
  const typeSummary = {};
  ((data == null ? void 0 : data.typeSummary) || []).forEach((ts) => {
    typeSummary[ts.record_type] = ts;
  });
  const tabs = [
    { key: "overview", label: t("sellerStatsPage.tabOverview"), icon: BarChart3 },
    { key: "sellers", label: t("sellerStatsPage.tabSellers"), icon: Award },
    { key: "insights", label: t("sellerStatsPage.tabInsights"), icon: Target }
  ];
  const isEmpty = sellerCount === 0 && topSellers.length === 0;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 border-4 rounded-full animate-spin", style: { borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary } }) });
  }
  if (error && !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", style: { background: COLORS.primaryBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 32, style: { color: COLORS.primary } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-extrabold text-gray-900 mb-2", children: t("sellerStatsPage.cannotLoadData") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-6", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: fetchOverview,
          className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg",
          style: { background: COLORS.primary },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
            " ",
            t("sellerStatsPage.retry")
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto pb-20 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "text-white", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900", children: t("sellerStatsPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("sellerStatsPage.subtitle") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchOverview,
            className: "p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors",
            title: t("sellerStatsPage.refresh"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sellerStatsPage.analyzingSellers", { count: sellerCount }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive ? "text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`,
          style: isActive ? { background: COLORS.primary } : {},
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16 }),
            tab.label
          ]
        },
        tab.key
      );
    }) }),
    availableCountries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14, className: "text-gray-400 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCountryFilter("ALL"),
          className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${countryFilter === "ALL" ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`,
          style: countryFilter === "ALL" ? { background: COLORS.primary } : {},
          children: t("sellerStatsPage.allCountries", "전체")
        }
      ),
      availableCountries.map((code) => {
        const info = COUNTRY_INFO[code] || { name: code, flag: "🏳️" };
        const bd = countryBreakdown.find((b) => b.country_code === code);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setCountryFilter(code),
            className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${countryFilter === code ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`,
            style: countryFilter === code ? { background: COLORS.primary } : {},
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.flag }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.name }),
              bd && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[9px] ${countryFilter === code ? "text-indigo-200" : "text-gray-400"}`, children: [
                "(",
                bd.user_count,
                ")"
              ] })
            ]
          },
          code
        );
      })
    ] }),
    isEmpty && activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-8 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -bottom-8 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 120 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold mb-2", children: t("sellerStatsPage.emptyDashboardTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-indigo-200 text-sm leading-relaxed", children: [
            t("sellerStatsPage.emptyDashboardDesc1"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            t("sellerStatsPage.emptyDashboardDesc2"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            t("sellerStatsPage.emptyDashboardDesc3")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 22 }), title: t("sellerStatsPage.guideOverview"), desc: t("sellerStatsPage.guideOverviewDesc") },
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 22 }), title: t("sellerStatsPage.guideRanking"), desc: t("sellerStatsPage.guideRankingDesc") },
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 22 }), title: t("sellerStatsPage.guideInsights"), desc: t("sellerStatsPage.guideInsightsDesc") }
      ].map((card, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3", style: { background: COLORS.primaryBg, color: COLORS.primary }, children: card.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-extrabold text-gray-900 mb-1", children: card.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: card.desc })
      ] }, idx)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlusCircle, { size: 16, style: { color: COLORS.primary } }),
          t("sellerStatsPage.dataCollectionGuide")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", style: { background: COLORS.primary }, children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-800", children: t("sellerStatsPage.sellerDirectInput") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500 leading-relaxed pl-8", children: t("sellerStatsPage.sellerDirectInputDesc") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", style: { background: COLORS.accent }, children: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-800", children: t("sellerStatsPage.autoDashboard") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500 leading-relaxed pl-8", children: t("sellerStatsPage.autoDashboardDesc") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        { label: t("sellerStatsPage.daily"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18 }), color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-600" },
        { label: t("sellerStatsPage.monthly"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 18 }), color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600" },
        { label: t("sellerStatsPage.annual"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { size: 18 }), color: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-600" }
      ].map((period) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white`, children: period.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-extrabold text-gray-900 text-sm", children: t("sellerStatsPage.periodData", { period: period.label }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("sellerStatsPage.recordsLogged", { count: 0 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${period.bg} rounded-xl p-2.5`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-bold ${period.text} mb-0.5`, children: t("sellerStatsPage.totalRevenue") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-900", children: "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${period.bg} rounded-xl p-2.5`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-bold ${period.text} mb-0.5`, children: t("sellerStatsPage.avgRevenue") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-900", children: "-" })
          ] })
        ] })
      ] }, period.label)) })
    ] }),
    activeTab === "overview" && !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-6 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -bottom-8 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 120 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("sellerStatsPage.participatingSellers"), value: t("sellerStatsPage.sellersCount", { count: sellerCount }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("sellerStatsPage.totalData"), value: t("sellerStatsPage.recordsCount", { count: parseInt(totals.total_records || 0) }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("sellerStatsPage.totalRevenue"), value: formatRevenue(totals.total_revenue), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("sellerStatsPage.avgRevenue"), value: formatRevenue(Math.round(totals.avg_revenue || 0)), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPICard, { label: t("sellerStatsPage.avgSatisfaction"), value: `${parseFloat(totals.avg_satisfaction || 0).toFixed(1)}/5`, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 16 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        { key: "daily", label: t("sellerStatsPage.daily"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18 }), color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-600" },
        { key: "monthly", label: t("sellerStatsPage.monthly"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 18 }), color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600" },
        { key: "annual", label: t("sellerStatsPage.annual"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { size: 18 }), color: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-600" }
      ].map((period) => {
        const s = typeSummary[period.key] || {};
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 bg-gradient-to-br ${period.color} rounded-lg flex items-center justify-center text-white`, children: period.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-extrabold text-gray-900 text-sm", children: t("sellerStatsPage.periodData", { period: period.label }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("sellerStatsPage.recordsLogged", { count: parseInt(s.count || 0) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${period.bg} rounded-xl p-2.5`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-bold ${period.text} mb-0.5`, children: t("sellerStatsPage.totalRevenue") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-900", children: parseInt(s.total_revenue || 0) > 0 ? formatRevenue(s.total_revenue) : "-" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${period.bg} rounded-xl p-2.5`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-bold ${period.text} mb-0.5`, children: t("sellerStatsPage.avgRevenue") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-900", children: parseInt(s.avg_revenue || 0) > 0 ? formatRevenue(Math.round(s.avg_revenue)) : "-" })
            ] })
          ] })
        ] }, period.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
        monthlyTrend.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, style: { color: COLORS.primary } }),
            t("sellerStatsPage.monthlyTrend")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2 h-36", children: monthlyTrend.map((d, idx) => {
            const max = Math.max(...monthlyTrend.map((m) => parseInt(m.total_revenue) || 0), 1);
            const pct = (parseInt(d.total_revenue) || 0) / max * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-1 min-w-0 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap", children: formatRevenue(d.total_revenue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full max-w-[36px] rounded-t-lg transition-all duration-500 hover:opacity-80",
                  style: { height: `${Math.max(pct, 3)}%`, background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.primaryLight})` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-gray-400 mt-1 truncate w-full text-center font-medium", children: [
                (d.period || "").slice(5),
                t("sellerStatsPage.monthSuffix")
              ] })
            ] }, idx);
          }) })
        ] }),
        categoryDist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, style: { color: COLORS.primary } }),
            t("sellerStatsPage.popularCategory")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: categoryDist.slice(0, 8).map((cat, idx) => {
            const maxRevenue = Math.max(...categoryDist.map((c) => parseInt(c.total_revenue) || 0), 1);
            const pct = (parseInt(cat.total_revenue) || 0) / maxRevenue * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 truncate", children: cat.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400 flex-shrink-0 ml-2", children: [
                  formatRevenue(cat.total_revenue),
                  " · ",
                  t("sellerStatsPage.sellersLabel", { count: cat.seller_count })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-700", style: { width: `${pct}%`, background: COLORS.accent } }) })
            ] }, idx);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
        regionDist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, style: { color: COLORS.primary } }),
            t("sellerStatsPage.regionRevenue")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: regionDist.slice(0, 10).map((r, idx) => {
            const maxRevenue = Math.max(...regionDist.map((x) => parseInt(x.total_revenue) || 0), 1);
            const pct = (parseInt(r.total_revenue) || 0) / maxRevenue * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700", children: r.region }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400", children: [
                  formatRevenue(r.total_revenue),
                  " · ",
                  t("sellerStatsPage.sellersLabel", { count: r.seller_count })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-700", style: { width: `${pct}%`, background: "#10b981" } }) })
            ] }, idx);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16, style: { color: COLORS.primary } }),
            t("sellerStatsPage.recentDataEntry")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            recentActivity.slice(0, 6).map((act, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer",
                onClick: () => fetchSellerDetail(act.user_id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                      style: { background: COLORS.accent },
                      children: (act.brand_name || act.name || "?")[0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 truncate", children: act.brand_name || act.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 truncate", children: [
                      act.record_date,
                      " · ",
                      formatRevenue(act.monthly_revenue)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RecordTypeBadge, { type: act.record_type, t })
                ]
              },
              idx
            )),
            recentActivity.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 text-center py-4", children: t("sellerStatsPage.noRecentActivity") })
          ] })
        ] })
      ] }),
      topSellers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 16, style: { color: COLORS.primary } }),
            t("sellerStatsPage.topSellers")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveTab("sellers"),
              className: "text-xs font-bold px-3 py-1.5 rounded-lg",
              style: { background: COLORS.primaryBg, color: COLORS.primary },
              children: t("sellerStatsPage.viewAll")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 pl-2", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: t("sellerStatsPage.seller") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right", children: t("sellerStatsPage.totalRevenueHeader") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right", children: t("sellerStatsPage.avgRevenueHeader") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right hidden md:table-cell", children: t("sellerStatsPage.customers") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right hidden md:table-cell", children: t("sellerStatsPage.recordCount") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-center", children: t("sellerStatsPage.detail") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: topSellers.slice(0, 5).map((seller, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pl-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 3 ? "text-white" : "bg-gray-100 text-gray-500"}`,
                style: idx < 3 ? { background: [COLORS.primary, COLORS.accent, COLORS.accentLight][idx] } : {},
                children: idx + 1
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 text-xs", children: seller.brand_name || seller.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: seller.category || t("sellerStatsPage.uncategorized") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right font-extrabold text-gray-900 text-xs", children: formatRevenue(seller.total_revenue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right text-xs font-bold text-gray-600", children: formatRevenue(Math.round(seller.avg_revenue || 0)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right text-xs text-gray-500 hidden md:table-cell", children: t("sellerStatsPage.customersUnit", { count: parseInt(seller.total_customers || 0).toLocaleString() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right text-xs text-gray-500 hidden md:table-cell", children: t("sellerStatsPage.recordsUnit", { count: seller.record_count }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => fetchSellerDetail(seller.user_id),
                className: "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                style: { color: COLORS.primary },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
              }
            ) })
          ] }, seller.user_id)) })
        ] }) })
      ] })
    ] }),
    activeTab === "sellers" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: t("sellerStatsPage.searchPlaceholder"),
            className: "w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium focus:border-indigo-400 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 text-left text-[10px] text-gray-400 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: t("sellerStatsPage.seller") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: t("sellerStatsPage.categoryCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.totalRevenueCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.avgRevenueCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.customersCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.transactionsCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.recordCountCol") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: t("sellerStatsPage.latestRecord") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-center", children: t("sellerStatsPage.detail") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredSellers.map((seller, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < 3 ? "text-white" : "bg-gray-100 text-gray-500"}`,
                style: idx < 3 ? { background: ["#FFD700", "#C0C0C0", "#CD7F32"][idx] } : {},
                children: idx + 1
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 text-xs", children: seller.brand_name || seller.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: seller.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full font-bold", style: { background: COLORS.primaryBg, color: COLORS.primary }, children: seller.category || t("sellerStatsPage.uncategorized") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right font-extrabold text-gray-900 text-xs", children: formatRevenue(seller.total_revenue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-xs font-bold text-gray-600", children: formatRevenue(Math.round(seller.avg_revenue || 0)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-xs text-gray-500", children: parseInt(seller.total_customers || 0).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-xs text-gray-500", children: parseInt(seller.total_transactions || 0).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-xs text-gray-500", children: seller.record_count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-[10px] text-gray-400", children: seller.latest_record }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => fetchSellerDetail(seller.user_id),
                className: "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                style: { background: COLORS.primaryBg, color: COLORS.primary },
                children: t("sellerStatsPage.viewDetail")
              }
            ) })
          ] }, seller.user_id)) })
        ] }) }),
        filteredSellers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-gray-400 text-sm", children: searchQuery ? t("sellerStatsPage.noSearchResults") : t("sellerStatsPage.noSellerData") })
      ] })
    ] }),
    activeTab === "insights" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, style: { color: COLORS.primary } }),
          t("sellerStatsPage.performanceInsights")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 14 }),
              title: t("sellerStatsPage.dataWaiting"),
              description: t("sellerStatsPage.dataWaitingDesc"),
              type: "info"
            }
          ),
          sellerCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
              title: t("sellerStatsPage.sellerParticipation"),
              description: t("sellerStatsPage.sellerParticipationDesc", { count: sellerCount }),
              type: "info"
            }
          ),
          parseInt(totals.total_revenue || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 14 }),
              title: t("sellerStatsPage.overallRevenue"),
              description: t("sellerStatsPage.overallRevenueDesc", { total: formatRevenue(totals.total_revenue), avg: formatRevenue(Math.round(totals.avg_revenue || 0)) }),
              type: "success"
            }
          ),
          parseFloat(totals.avg_satisfaction || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14 }),
              title: t("sellerStatsPage.avgOperSatisfaction"),
              description: t("sellerStatsPage.satisfactionDesc", {
                score: parseFloat(totals.avg_satisfaction).toFixed(1),
                level: parseFloat(totals.avg_satisfaction) >= 4 ? t("sellerStatsPage.satisfactionHigh") : parseFloat(totals.avg_satisfaction) >= 3 ? t("sellerStatsPage.satisfactionNormal") : t("sellerStatsPage.satisfactionNeedsImprovement")
              }),
              type: parseFloat(totals.avg_satisfaction) >= 4 ? "success" : parseFloat(totals.avg_satisfaction) >= 3 ? "info" : "warning"
            }
          ),
          topSellers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 14 }),
              title: t("sellerStatsPage.topRevenueSellerInsight"),
              description: t("sellerStatsPage.topSellerDesc", { name: topSellers[0].brand_name || topSellers[0].name, revenue: formatRevenue(topSellers[0].total_revenue) }),
              type: "success"
            }
          ),
          categoryDist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 }),
              title: t("sellerStatsPage.popularCategoryInsight"),
              description: t("sellerStatsPage.popularCategoryDesc", { category: categoryDist[0].category, count: categoryDist[0].seller_count }),
              type: "info"
            }
          ),
          regionDist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InsightCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
              title: t("sellerStatsPage.hotRegion"),
              description: t("sellerStatsPage.hotRegionDesc", { region: regionDist[0].region, revenue: formatRevenue(regionDist[0].total_revenue) }),
              type: "info"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16, style: { color: COLORS.primary } }),
          t("sellerStatsPage.dataHealth")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataHealthCard, { label: t("sellerStatsPage.dailyRecords"), value: t("sellerStatsPage.recordsUnit", { count: parseInt(((_a = typeSummary.daily) == null ? void 0 : _a.count) || 0) }), color: "bg-blue-50 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataHealthCard, { label: t("sellerStatsPage.monthlyRecords"), value: t("sellerStatsPage.recordsUnit", { count: parseInt(((_b = typeSummary.monthly) == null ? void 0 : _b.count) || 0) }), color: "bg-emerald-50 text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataHealthCard, { label: t("sellerStatsPage.annualRecords"), value: t("sellerStatsPage.recordsUnit", { count: parseInt(((_c = typeSummary.annual) == null ? void 0 : _c.count) || 0) }), color: "bg-amber-50 text-amber-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DataHealthCard, { label: t("sellerStatsPage.categoryCount"), value: t("sellerStatsPage.countUnit", { count: categoryDist.length }), color: "bg-violet-50 text-violet-600" })
        ] })
      ] }),
      categoryDist.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, style: { color: COLORS.primary } }),
          t("sellerStatsPage.revenueByCategoryComparison")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: categoryDist.map((cat, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-700 mb-1 truncate", children: cat.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: formatRevenue(cat.total_revenue) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 mt-0.5", children: t("sellerStatsPage.sellersAndRecords", { sellers: cat.seller_count, records: cat.count }) })
        ] }, idx)) })
      ] })
    ] }),
    selectedSeller && sellerDetail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => {
      setSelectedSeller(null);
      setSellerDetail(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 text-white flex items-center justify-between", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-extrabold text-lg", children: ((_d = sellerDetail.seller) == null ? void 0 : _d.brand_name) || ((_e = sellerDetail.seller) == null ? void 0 : _e.name) || t("sellerStatsPage.sellerModalDefault") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-indigo-200", children: [
            (_f = sellerDetail.seller) == null ? void 0 : _f.email,
            " · ",
            ((_g = sellerDetail.seller) == null ? void 0 : _g.category) || t("sellerStatsPage.uncategorized")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setSelectedSeller(null);
          setSellerDetail(null);
        }, className: "text-white/80 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["daily", "monthly", "annual"].map((type) => {
          const s = (sellerDetail.summary || {})[type] || {};
          const labels = { daily: t("sellerStatsPage.daily"), monthly: t("sellerStatsPage.monthly"), annual: t("sellerStatsPage.annual") };
          const colors = { daily: "bg-blue-50 text-blue-600", monthly: "bg-emerald-50 text-emerald-600", annual: "bg-amber-50 text-amber-600" };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[type]}`, children: labels[type] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900 mt-2", children: parseInt(s.total_revenue || 0) > 0 ? formatRevenue(s.total_revenue) : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("sellerStatsPage.sellerDetailRecordCount", { count: parseInt(s.count || 0) }) })
          ] }, type);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, style: { color: COLORS.primary } }),
            t("sellerStatsPage.allRecords", { count: (sellerDetail.stats || []).length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-64 overflow-y-auto space-y-2", children: [
            (sellerDetail.stats || []).map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RecordTypeBadge, { type: record.record_type, t }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-900", children: record.record_date }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400", children: [
                    record.venue_type || "",
                    " ",
                    record.region ? `· ${record.region}` : ""
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-extrabold text-gray-900", children: parseInt(record.monthly_revenue) > 0 ? formatRevenue(record.monthly_revenue) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-gray-400", children: [
                  parseInt(record.customer_count) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sellerStatsPage.customersUnit", { count: parseInt(record.customer_count).toLocaleString() }) }),
                  parseInt(record.transaction_count) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sellerStatsPage.recordsUnit", { count: parseInt(record.transaction_count).toLocaleString() }) }),
                  record.best_selling_item && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold", children: record.best_selling_item })
                ] })
              ] })
            ] }, record.id)),
            (!sellerDetail.stats || sellerDetail.stats.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 text-center py-4", children: t("sellerStatsPage.noRecordedData") })
          ] })
        ] })
      ] })
    ] }) }),
    detailLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 border-4 rounded-full animate-spin", style: { borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary } }) })
  ] });
};
const KPICard = ({ label, value, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1 text-indigo-200", children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold", children: label })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: value })
] });
const RecordTypeBadge = ({ type, t }) => {
  const styles = { daily: "bg-blue-50 text-blue-600", monthly: "bg-emerald-50 text-emerald-600", annual: "bg-amber-50 text-amber-600" };
  const labelKeys = { daily: "sellerStatsPage.daily", monthly: "sellerStatsPage.monthly", annual: "sellerStatsPage.annual" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[type] || "bg-gray-50 text-gray-500"}`, children: t(labelKeys[type]) || type });
};
const InsightCard = ({ icon, title, description, type }) => {
  const styles = {
    info: "bg-blue-50 border-blue-100 text-blue-700",
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl border ${styles[type] || styles.info}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex-shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] opacity-80", children: description })
    ] })
  ] }) });
};
const DataHealthCard = ({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl ${color.split(" ")[0]}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-bold ${color.split(" ")[1]} mb-0.5`, children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: value })
] });
export {
  AdminSellerStats as default
};
