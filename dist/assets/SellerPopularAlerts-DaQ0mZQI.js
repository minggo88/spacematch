import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, ab as Lock, s as Flame, aV as RefreshCw, w as TrendingUp, u as Store, N as Eye, v as Users, at as Target, o as BarChart3, bc as Activity, ap as MapPin, an as Zap, b as ChevronRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const SellerPopularAlerts = () => {
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  const [hasAccess, setHasAccess] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("cards");
  const { t } = useTranslation("seller");
  const TREND_CONFIG = {
    hot: { label: t("popularAlertsPage.trendHot"), color: "bg-red-500", ring: "ring-red-500/30", glow: "shadow-red-500/20" },
    rising: { label: t("popularAlertsPage.trendRising"), color: "bg-amber-500", ring: "ring-amber-500/30", glow: "shadow-amber-500/20" },
    steady: { label: t("popularAlertsPage.trendSteady"), color: "bg-sky-500", ring: "ring-sky-500/30", glow: "shadow-sky-500/20" }
  };
  const fetchPopular = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/venues/popular_venues.php?limit=30`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Popular venues load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/users/check_service.php?service=popular_alerts`, { credentials: "include" }).then((res) => res.json()).then((data2) => {
      setHasAccess(data2.hasAccess ?? false);
      if (data2.hasAccess) fetchPopular();
      else setLoading(false);
    }).catch(() => {
      setHasAccess(false);
      setLoading(false);
    });
  }, []);
  if (loading || hasAccess === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-3 border-orange-200 dark:border-orange-800 border-t-orange-500 rounded-full animate-spin" }) });
  }
  if (hasAccess === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 32, className: "text-orange-500 dark:text-orange-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold text-gray-900 dark:text-white mb-2", children: t("popularAlertsPage.lockedTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-6 leading-relaxed", dangerouslySetInnerHTML: { __html: t("popularAlertsPage.lockedDesc") } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50 dark:bg-orange-950/50 rounded-2xl p-4 border border-orange-100 dark:border-orange-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-orange-600 dark:text-orange-400 mb-2", children: t("popularAlertsPage.lockedFeatures") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("popularAlertsPage.lockedFeat1") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("popularAlertsPage.lockedFeat2") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("popularAlertsPage.lockedFeat3") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("popularAlertsPage.lockedFeat4") })
        ] })
      ] })
    ] }) });
  }
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: t("popularAlertsPage.noData") })
    ] });
  }
  const { venues, stats, typeDistribution } = data;
  const filteredVenues = filter === "all" ? venues : venues.filter((v) => v.trend === filter);
  const getCompetitionLevel = (ratio) => {
    if (ratio >= 30) return { label: t("popularAlertsPage.competitionFierce"), color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" };
    if (ratio >= 15) return { label: t("popularAlertsPage.competitionModerate"), color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" };
    return { label: t("popularAlertsPage.competitionLow"), color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" };
  };
  const Bar = ({ value, max, color = "bg-indigo-500" }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full ${color} transition-all duration-500`,
      style: { width: `${max > 0 ? Math.min(value / max * 100, 100) : 0}%` }
    }
  ) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight", children: t("popularAlertsPage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2 font-medium", children: t("popularAlertsPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("cards"),
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "cards" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`,
              children: t("popularAlertsPage.viewCards")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("table"),
              className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "table" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`,
              children: t("popularAlertsPage.viewTable")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: fetchPopular, className: "flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors border border-orange-200 dark:border-orange-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
          " ",
          t("popularAlertsPage.refresh")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [
      { label: t("popularAlertsPage.statsHot"), value: stats.hot, icon: Flame, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40", borderColor: "border-red-100 dark:border-red-800" },
      { label: t("popularAlertsPage.statsRising"), value: stats.rising, icon: TrendingUp, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", borderColor: "border-amber-100 dark:border-amber-800" },
      { label: t("popularAlertsPage.statsTotal"), value: stats.total, icon: Store, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/40", borderColor: "border-sky-100 dark:border-sky-800" },
      { label: t("popularAlertsPage.statsAvgViews"), value: stats.avgViews, icon: Eye, color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40", borderColor: "border-violet-100 dark:border-violet-800" },
      { label: t("popularAlertsPage.statsAvgApps"), value: stats.avgApps, icon: Users, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", borderColor: "border-emerald-100 dark:border-emerald-800" },
      { label: t("popularAlertsPage.statsAvgCompetition"), value: `${stats.avgCompetition}%`, icon: Target, color: "text-pink-500 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/40", borderColor: "border-pink-100 dark:border-pink-800" }
    ].map((kpi, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${kpi.bg} rounded-2xl p-4 border ${kpi.borderColor}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(kpi.icon, { size: 14, className: kpi.color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: kpi.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 dark:text-white", children: kpi.value })
    ] }, i)) }),
    typeDistribution && typeDistribution.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 14 }),
          " ",
          t("popularAlertsPage.typeDistribution")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: typeDistribution.slice(0, 6).map((td, i) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-400 w-16 flex-shrink-0 truncate", children: td.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: td.count, max: ((_a = typeDistribution[0]) == null ? void 0 : _a.count) || 1, color: i === 0 ? "bg-orange-500" : i === 1 ? "bg-amber-500" : "bg-gray-400 dark:bg-gray-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 dark:text-gray-300 flex-shrink-0 w-8 text-right", children: td.count })
          ] }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
          " ",
          t("popularAlertsPage.marketInsight")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 border border-orange-100 dark:border-orange-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-700 dark:text-gray-300", dangerouslySetInnerHTML: { __html: t("popularAlertsPage.insightHot", { count: stats.hot }) } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-700 dark:text-gray-300", dangerouslySetInnerHTML: { __html: stats.avgCompetition < 20 ? t("popularAlertsPage.insightCompLow", { rate: stats.avgCompetition }) : t("popularAlertsPage.insightCompHigh", { rate: stats.avgCompetition }) } }) }),
          typeDistribution.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-100 dark:border-violet-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-700 dark:text-gray-300", dangerouslySetInnerHTML: { __html: t("popularAlertsPage.insightTopType", { type: typeDistribution[0].type, count: typeDistribution[0].count }) + (typeDistribution.length > 1 ? t("popularAlertsPage.insightNextType", { type: typeDistribution[1].type, count: typeDistribution[1].count }) : "") } }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl overflow-x-auto flex-1", children: [
      { id: "all", label: t("popularAlertsPage.filterAll"), count: stats.total },
      { id: "hot", label: t("popularAlertsPage.trendHot"), count: stats.hot },
      { id: "rising", label: t("popularAlertsPage.trendRising"), count: stats.rising },
      { id: "steady", label: t("popularAlertsPage.trendSteady"), count: stats.total - stats.hot - stats.rising }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setFilter(tab.id),
        className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                                ${filter === tab.id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`,
        children: [
          tab.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] py-0.5 px-1.5 rounded-full ${filter === tab.id ? "bg-gray-100 dark:bg-gray-600" : "bg-gray-200/50 dark:bg-gray-700/50"}`, children: tab.count })
        ]
      },
      tab.id
    )) }) }),
    viewMode === "cards" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredVenues.map((venue, idx) => {
      const trend = TREND_CONFIG[venue.trend] || TREND_CONFIG.steady;
      const firstImage = Array.isArray(venue.images) && venue.images.length > 0 ? venue.images[0] : null;
      const competition = getCompetitionLevel(venue.competition_ratio);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 group
                                ${venue.trend === "hot" ? "border-red-200 dark:border-red-800 shadow-sm " + trend.glow : venue.trend === "rising" ? "border-amber-200 dark:border-amber-800" : "border-gray-200 dark:border-gray-700"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 bg-gray-100 dark:bg-gray-800", children: [
          firstImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: firstImage, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 32 }) }),
          idx < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shadow-lg
                                            ${idx === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" : "bg-gradient-to-br from-amber-500 to-amber-700"}`, children: idx + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white ${trend.color} shadow-md`, children: trend.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold ${competition.bg} ${competition.color} backdrop-blur-sm`, children: [
            t("popularAlertsPage.competitionLabel"),
            " ",
            competition.label
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-1", children: venue.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
              " ",
              venue.location || t("popularAlertsPage.locationUnknown")
            ] }),
            venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded font-medium", children: venue.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-sky-600 dark:text-sky-400", children: venue.view_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 dark:text-gray-500 font-bold", children: t("popularAlertsPage.views") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-violet-600 dark:text-violet-400", children: venue.app_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 dark:text-gray-500 font-bold", children: t("popularAlertsPage.applications") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-sm font-extrabold ${competition.color}`, children: [
                venue.competition_ratio,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 dark:text-gray-500 font-bold", children: t("popularAlertsPage.competitionRate") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-sm font-extrabold ${venue.approval_rate >= 50 ? "text-emerald-600 dark:text-emerald-400" : venue.approval_rate > 0 ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`, children: [
                venue.approval_rate,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-400 dark:text-gray-500 font-bold", children: t("popularAlertsPage.approvalRate") })
            ] })
          ] }),
          venue.recent_app_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3 px-2 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 11, className: "text-amber-500", fill: "currentColor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-amber-700 dark:text-amber-400", children: t("popularAlertsPage.weeklyApps", { count: venue.recent_app_count }) }),
            venue.monthly_app_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 ml-auto", children: t("popularAlertsPage.monthlyApps", { count: venue.monthly_app_count }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-900 dark:text-white", children: [
                "₩",
                parseInt(venue.price || 0).toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                "/",
                venue.pricing_unit || t("perDay")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `/seller/hosts`,
                className: "flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors",
                children: [
                  t("popularAlertsPage.viewDetails"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                ]
              }
            )
          ] })
        ] })
      ] }, venue.id);
    }) }),
    viewMode === "table" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thVenue") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thLocation") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thTrend") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thViews") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thApps") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thCompetition") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thApproval") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase", children: t("popularAlertsPage.thPrice") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredVenues.map((venue, idx) => {
        const trend = TREND_CONFIG[venue.trend] || TREND_CONFIG.steady;
        const competition = getCompetitionLevel(venue.competition_ratio);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-extrabold
                                                    ${idx === 0 ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400" : idx === 1 ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : idx === 2 ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`, children: idx + 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]", children: venue.name }),
            venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500", children: venue.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]", children: venue.location || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${trend.color}`, children: trend.label }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300", children: venue.view_count }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 dark:text-gray-300", children: venue.app_count }),
            venue.recent_app_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-amber-500 ml-1", children: [
              "+",
              venue.recent_app_count
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold ${competition.color}`, children: [
            venue.competition_ratio,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold ${venue.approval_rate >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`, children: [
            venue.approval_rate,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4 text-right text-xs font-bold text-gray-900 dark:text-white", children: [
            "₩",
            parseInt(venue.price || 0).toLocaleString()
          ] })
        ] }, venue.id);
      }) })
    ] }) }) }),
    filteredVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-3", size: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 font-medium", children: t("popularAlertsPage.emptyFilter") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3", children: t("popularAlertsPage.tipsTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        { title: t("popularAlertsPage.tip1Title"), desc: t("popularAlertsPage.tip1Desc"), icon: "⚡", color: "text-amber-600 dark:text-amber-400" },
        { title: t("popularAlertsPage.tip2Title"), desc: t("popularAlertsPage.tip2Desc"), icon: "🎯", color: "text-emerald-600 dark:text-emerald-400" },
        { title: t("popularAlertsPage.tip3Title"), desc: t("popularAlertsPage.tip3Desc"), icon: "📈", color: "text-violet-600 dark:text-violet-400" }
      ].map((tip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: tip.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: `text-sm font-bold mt-2 ${tip.color}`, children: tip.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed", children: tip.desc })
      ] }, i)) })
    ] })
  ] });
};
export {
  SellerPopularAlerts as default
};
