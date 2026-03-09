import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, bc as Activity, ap as MapPin, bn as DollarSign, w as TrendingUp, ac as Tag, v as Users, p as ShoppingBag, q as Building, bA as PieChart, aE as Layers, b2 as ArrowDown, br as Minus, b1 as ArrowUp, u as Store, o as BarChart3, f as Search, a0 as ChevronDown, aI as ArrowUpDown, ao as Star, h as Smile, W as Package } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const COLORS = {
  primary: "#5551e8",
  primaryLight: "#6d69f1",
  primaryBg: "#EEEDFD",
  accent: "#6d69f1",
  accentLight: "#9B98F5",
  dark: "#2d2b6e"
};
const HBarChart = ({ data, valueKey, labelKey = "label", unit = "", maxItems = 10, formatValue, t }) => {
  const items = data.slice(0, maxItems);
  const maxVal = Math.max(...items.map((d) => d[valueKey] || 0), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
    items.map((item, idx) => {
      const val = item[valueKey] || 0;
      const pct = val / maxVal * 100;
      const displayVal = formatValue ? formatValue(val) : `${val.toLocaleString()}${unit}`;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-gray-700 truncate max-w-[60%]", children: [
            idx + 1,
            ". ",
            item[labelKey],
            item.count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 font-normal ml-1", children: [
              "(",
              t("analyticsPage.unitItems", { count: item.count }),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-800", children: displayVal })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-5 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all duration-700 ease-out",
            style: { width: `${Math.max(pct, 2)}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentLight})` }
          }
        ) })
      ] }, idx);
    }),
    items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-400 text-sm py-4", children: t("analyticsPage.noData") })
  ] });
};
const VBarChart = ({ data, valueKey, labelKey = "label" }) => {
  const maxVal = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-center gap-2 h-40 pt-4", children: data.map((item, idx) => {
    const val = item[valueKey] || 0;
    const pct = val / maxVal * 100;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-1 min-w-0 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity", children: val }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-full max-w-[40px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-80",
          style: { height: `${Math.max(pct, 4)}%`, background: `linear-gradient(0deg, ${COLORS.primary}, ${COLORS.accentLight})` }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 mt-1.5 truncate w-full text-center font-medium", children: item[labelKey] })
    ] }, idx);
  }) });
};
const Analytics = () => {
  const { t } = useTranslation("seller");
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [lastUpdated, setLastUpdated] = reactExports.useState(null);
  const [expandedRegions, setExpandedRegions] = reactExports.useState(/* @__PURE__ */ new Set());
  const [districtSort, setDistrictSort] = reactExports.useState({});
  const [selectedRegions, setSelectedRegions] = reactExports.useState(/* @__PURE__ */ new Set());
  const [sellerData, setSellerData] = reactExports.useState(null);
  const [sellerLoading, setSellerLoading] = reactExports.useState(false);
  const toggleSelectedRegion = (label) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };
  const toggleRegion = (label) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };
  reactExports.useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 3e4);
    return () => clearInterval(interval);
  }, []);
  const fetchAnalytics = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`${API_BASE}/venues/venue_analytics.php`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastUpdated(/* @__PURE__ */ new Date());
        setError(null);
      } else {
        if (!silent) setError(json.message || t("analyticsPage.loadFailed"));
      }
    } catch (err) {
      if (!silent) setError(t("analyticsPage.serverFailed"));
    } finally {
      if (!silent) setLoading(false);
    }
  };
  const fetchSellerInsights = async () => {
    try {
      setSellerLoading(true);
      const res = await fetch(`${API_BASE}/users/seller_stats_public.php`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setSellerData(json.data);
    } catch {
    } finally {
      setSellerLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (activeTab === "seller" && !sellerData) fetchSellerInsights();
  }, [activeTab]);
  const formatPrice = (val) => {
    if (val >= 1e4) return `${(val / 1e4).toFixed(0)}${t("analyticsPage.unitMan")}`;
    return `${val.toLocaleString()}`;
  };
  const formatSales = (val) => {
    if (val >= 1e4) return `${(val / 1e4).toFixed(1)}${t("analyticsPage.unitEok")}`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}${t("analyticsPage.unitCheonman")}`;
    return `${val.toLocaleString()}${t("analyticsPage.unitMan")}`;
  };
  const typeLabels = {
    popup: t("analyticsPage.typePopup"),
    fleamarket: t("analyticsPage.typeFleamarket"),
    gallery: t("analyticsPage.typeGallery"),
    cafe: t("analyticsPage.typeCafe"),
    showroom: t("analyticsPage.typeShowroom")
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4", style: { borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium", children: t("analyticsPage.loadingData") })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 rounded-2xl p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-600 font-bold text-lg mb-2", children: t("analyticsPage.errorOccurred") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-sm", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: fetchAnalytics, className: "mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors", children: t("analyticsPage.retry") })
    ] }) });
  }
  if (!data) return null;
  const { summary, priceByRegion, priceByType, priceBySize, commission, topCategories, salesByRegion, salesByType, priceDistribution, monthlyTrend, venuesByRegion, districtStats, topCustomerTypes, customersByRegion, priceByCustomer, salesByCustomer } = data;
  const tabs = [
    { key: "overview", label: t("analyticsPage.tabOverview"), icon: Activity },
    { key: "region", label: t("analyticsPage.tabRegion"), icon: MapPin },
    { key: "price", label: t("analyticsPage.tabPrice"), icon: DollarSign },
    { key: "sales", label: t("analyticsPage.tabSales"), icon: TrendingUp },
    { key: "category", label: t("analyticsPage.tabCategory"), icon: Tag },
    { key: "customer", label: t("analyticsPage.tabCustomer"), icon: Users },
    { key: "seller", label: t("analyticsPage.tabSeller"), icon: ShoppingBag }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto animate-fadeIn pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: t("analyticsPage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("analyticsPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: COLORS.accent } }),
          t("analyticsPage.realtime"),
          " ·",
          lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("analyticsPage.lastUpdated", { time: lastUpdated.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => fetchAnalytics(true),
            className: "p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500",
            style: { "--hover-color": COLORS.primary },
            title: "Refresh",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16 })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-0 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 70, className: "translate-x-3 -translate-y-2" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-100 text-xs font-bold", children: t("analyticsPage.totalVenues") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold mt-2 relative z-10", children: summary.totalVenues }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 text-xs mt-1", children: t("analyticsPage.activeVenues") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: t("analyticsPage.avgPrice"), value: formatPrice(summary.avgPrice), sub: t("analyticsPage.avgPriceSub"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: t("analyticsPage.avgSales"), value: summary.salesDataCount > 0 ? formatSales(summary.avgSales) : "-", sub: t("analyticsPage.salesDataCount", { count: summary.salesDataCount }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: t("analyticsPage.avgCommission"), value: `${summary.avgCommission}%`, sub: t("analyticsPage.commissionRange", { min: commission.min, max: commission.max }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { size: 16 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 overflow-x-auto pb-1", children: tabs.map((tab) => {
      const Icon = tab.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.key ? "text-white shadow-lg" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`,
          style: activeTab === tab.key ? { background: COLORS.primary, boxShadow: `0 4px 14px ${COLORS.primaryBg}` } : {},
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16 }),
            tab.label
          ]
        },
        tab.key
      );
    }) }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.monthlyTrend"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 18 }), children: monthlyTrend.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VBarChart, { data: monthlyTrend, valueKey: "count", labelKey: "month" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceDistribution"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(VBarChart, { data: priceDistribution, valueKey: "count", labelKey: "label" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.topCategories"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: topCategories, valueKey: "count", unit: t("analyticsPage.categoryUnit"), t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: t("analyticsPage.commissionStatus"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { size: 18 }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mb-1 text-indigo-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: t("analyticsPage.commMin") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-extrabold text-gray-900", children: [
              commission.min,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mb-1 text-indigo-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: t("analyticsPage.commAvg") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-extrabold text-gray-900", children: [
              commission.avg,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50 rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-rose-600 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: t("analyticsPage.commMax") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-extrabold text-gray-900", children: [
              commission.max,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 text-center", children: t("analyticsPage.commTotal", { count: commission.count }) })
      ] })
    ] }),
    activeTab === "price" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: priceByRegion, valueKey: "avgPrice", formatValue: formatPrice, t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceByType"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: priceByType.map((d) => ({ ...d, label: typeLabels[d.label] || d.label })), valueKey: "avgPrice", formatValue: formatPrice, t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceBySize"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: priceBySize, valueKey: "avgPrice", formatValue: formatPrice, t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceDistribution"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(VBarChart, { data: priceDistribution, valueKey: "count", labelKey: "label" }) })
    ] }),
    activeTab === "sales" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-2xl p-6 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -bottom-8 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 120 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold", children: t("analyticsPage.salesSummary") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200", children: t("analyticsPage.salesSummaryDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200 mb-1", children: t("analyticsPage.dataCount") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: t("analyticsPage.dataCountUnit", { count: summary.salesDataCount }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200 mb-1", children: t("analyticsPage.overallAvgSales") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: summary.salesDataCount > 0 ? formatSales(summary.avgSales) : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200 mb-1", children: t("analyticsPage.dataRatio") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-extrabold", children: [
              summary.totalVenues > 0 ? Math.round(summary.salesDataCount / summary.totalVenues * 100) : 0,
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.salesByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: salesByRegion, valueKey: "avgSales", formatValue: formatSales, t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.salesByType"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: salesByType.map((d) => ({ ...d, label: typeLabels[d.label] || d.label })), valueKey: "avgSales", formatValue: formatSales, t }) })
    ] }),
    activeTab === "region" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.venuesByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }), extra: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: t("analyticsPage.totalVenuesCount", { count: summary.totalVenues }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: venuesByRegion || [], valueKey: "count", unit: t("analyticsPage.categoryUnit"), t }) }),
      venuesByRegion && venuesByRegion.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { color: COLORS.primary } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700", children: t("analyticsPage.regionFilter") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 ml-1", children: selectedRegions.size === 0 ? t("analyticsPage.allShowing") : t("analyticsPage.regionsSelected", { count: selectedRegions.size }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedRegions(/* @__PURE__ */ new Set()),
              className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegions.size === 0 ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              style: selectedRegions.size === 0 ? { background: COLORS.primary } : {},
              children: t("analyticsPage.all")
            }
          ),
          venuesByRegion.map((r, ri) => {
            const isSelected = selectedRegions.has(r.label);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => toggleSelectedRegion(r.label),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                style: isSelected ? { background: COLORS.primary } : {},
                children: [
                  r.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `ml-1 text-[10px] ${isSelected ? "text-indigo-200" : "text-gray-400"}`, children: [
                    "(",
                    r.count,
                    ")"
                  ] })
                ]
              },
              ri
            );
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start", children: (venuesByRegion || []).filter((r) => selectedRegions.size === 0 || selectedRegions.has(r.label)).map((region, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-5 cursor-pointer hover:bg-gray-50/50 transition-colors",
            onClick: () => toggleRegion(region.label),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-indigo-600" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-extrabold text-gray-900 text-sm", children: region.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("analyticsPage.numVenues", { count: region.count }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `text-gray-400 transition-transform duration-200 ${expandedRegions.has(region.label) ? "rotate-180" : ""}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-xl p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold mb-0.5 text-indigo-600", children: t("analyticsPage.avgPriceLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: region.avgPrice > 0 ? formatPrice(region.avgPrice) : "-" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 rounded-xl p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600 font-bold mb-0.5", children: t("analyticsPage.avgSalesLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: region.avgSales > 0 ? formatSales(region.avgSales) : "-" })
                ] })
              ] }),
              region.topCategories && region.topCategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 font-bold mb-1.5", children: t("analyticsPage.topCategoriesLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: region.topCategories.map((cat, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-600", children: cat }, ci)) })
              ] }),
              region.topTypes && region.topTypes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 font-bold mb-1.5", children: t("analyticsPage.topTypesLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: region.topTypes.map((tp, ti) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-medium rounded-full", children: typeLabels[tp] || tp }, ti)) })
              ] })
            ]
          }
        ),
        expandedRegions.has(region.label) && districtStats && districtStats[region.label] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-100 bg-gray-50/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-wider", children: t("analyticsPage.districtDetail") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [
              { key: "name", label: t("analyticsPage.sortName") },
              { key: "count", label: t("analyticsPage.sortCount") },
              { key: "price", label: t("analyticsPage.sortPrice") },
              { key: "sales", label: t("analyticsPage.sortSales") }
            ].map((s) => {
              const currentSort = districtSort[region.label];
              const isActive = (currentSort == null ? void 0 : currentSort.key) === s.key;
              const isDesc = isActive && (currentSort == null ? void 0 : currentSort.desc);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setDistrictSort((prev) => ({
                    ...prev,
                    [region.label]: { key: s.key, desc: isActive ? !currentSort.desc : true }
                  })),
                  className: `flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${isActive ? "text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`,
                  style: isActive ? { background: COLORS.primary } : {},
                  children: [
                    s.label,
                    isActive && (isDesc ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 10 })),
                    !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 10, className: "opacity-40" })
                  ]
                },
                s.key
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [...districtStats[region.label]].sort((a, b) => {
            const sort = districtSort[region.label];
            if (!sort) return 0;
            const dir = sort.desc ? -1 : 1;
            switch (sort.key) {
              case "name":
                return dir * a.label.localeCompare(b.label, "ko");
              case "count":
                return dir * ((a.count || 0) - (b.count || 0));
              case "price":
                return dir * ((a.avgPrice || 0) - (b.avgPrice || 0));
              case "sales":
                return dir * ((a.avgSales || 0) - (b.avgSales || 0));
              default:
                return 0;
            }
          }).map((d, di) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-3.5 border border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-gray-900", children: d.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600", children: t("analyticsPage.numVenues", { count: d.count }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-lg p-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold mb-0.5 text-indigo-600", children: t("analyticsPage.avgPriceLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: d.avgPrice > 0 ? formatPrice(d.avgPrice) : "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 rounded-lg p-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600 font-bold mb-0.5", children: t("analyticsPage.avgSalesLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: d.avgSales > 0 ? formatSales(d.avgSales) : "-" })
              ] })
            ] }),
            (d.topCustomers || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-bold mr-0.5 self-center", children: t("analyticsPage.customerLayer") }),
              d.topCustomers.map((c, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700", children: c }, ci))
            ] })
          ] }, di)) })
        ] })
      ] }, idx)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: priceByRegion, valueKey: "avgPrice", formatValue: formatPrice, t }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.salesByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: salesByRegion, valueKey: "avgSales", formatValue: formatSales, t }) })
      ] })
    ] }),
    activeTab === "category" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.categoryRanking"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }), extra: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: t("analyticsPage.categoryRankingDesc") }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: topCategories, valueKey: "count", unit: t("analyticsPage.categoryUnit"), t }) }),
    activeTab === "customer" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -bottom-6 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 100 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-sm md:text-base", children: t("analyticsPage.customerAnalysis") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] md:text-xs text-indigo-200", children: t("analyticsPage.customerAnalysisDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-indigo-200 font-bold mb-0.5", children: t("analyticsPage.customerTypes") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold", children: t("analyticsPage.customerTypeCount", { count: (topCustomerTypes || []).length }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-indigo-200 font-bold mb-0.5", children: t("analyticsPage.dataRegions") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold", children: t("analyticsPage.customerTypeCount", { count: customersByRegion ? Object.keys(customersByRegion).length : 0 }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.customerDistribution"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: topCustomerTypes || [], valueKey: "count", unit: t("analyticsPage.categoryUnit"), t }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.priceByCustomer"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 16 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: priceByCustomer || [], valueKey: "avgPrice", formatValue: formatPrice, t }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.salesByCustomer"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: salesByCustomer || [], valueKey: "avgSales", formatValue: formatSales, t }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.customerByRegion"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }), children: customersByRegion && Object.keys(customersByRegion).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: Object.entries(customersByRegion).map(([region, custs]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0", style: { background: COLORS.primaryBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, style: { color: COLORS.primary } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-800 text-xs truncate", children: region })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: custs.map((c, ci) => {
          var _a;
          const maxCount = ((_a = custs[0]) == null ? void 0 : _a.count) || 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-700 truncate mr-2", children: c.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold flex-shrink-0", style: { color: COLORS.primary }, children: c.count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: { width: `${c.count / maxCount * 100}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentLight})` }
              }
            ) })
          ] }, ci);
        }) })
      ] }, region)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) })
    ] }),
    activeTab === "seller" && (sellerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 border-4 rounded-full animate-spin", style: { borderColor: COLORS.primaryBg, borderTopColor: COLORS.primary } }) }) : !sellerData || sellerData.summary.totalSellers === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mx-auto text-gray-300 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400", children: t("analyticsPage.noSellerData") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-1", children: t("analyticsPage.noSellerDataDesc") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-6 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, #059669, ${COLORS.dark})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -bottom-8 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 120 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold", children: t("analyticsPage.sellerInsight") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-200", children: t("analyticsPage.sellerInsightDesc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-200 mb-0.5", children: t("analyticsPage.participatingSellers") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: t("analyticsPage.sellerCount", { count: sellerData.summary.totalSellers }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-200 mb-0.5", children: t("analyticsPage.overallAvgRevenue") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: sellerData.summary.avgRevenue > 0 ? formatPrice(sellerData.summary.avgRevenue) : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-200 mb-0.5", children: t("analyticsPage.avgOrderValue") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: sellerData.summary.avgUnitPrice > 0 ? formatPrice(sellerData.summary.avgUnitPrice) : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 backdrop-blur-sm rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-200 mb-0.5", children: t("analyticsPage.recordCount") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: t("analyticsPage.recordCountUnit", { count: sellerData.summary.totalRecords }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.categoryAvgRevenue"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18 }), extra: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: t("analyticsPage.minDataNotice") }), children: sellerData.byCategory.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: sellerData.byCategory, valueKey: "avgRevenue", formatValue: formatPrice, t }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.regionAvgRevenue"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }), children: sellerData.byRegion.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: sellerData.byRegion, valueKey: "avgRevenue", formatValue: formatPrice, t }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.venueTypeAvgRevenue"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 18 }), children: sellerData.byVenueType.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(HBarChart, { data: sellerData.byVenueType, valueKey: "avgRevenue", formatValue: formatPrice, t }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.revenueDistribution"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 18 }), children: sellerData.revenueDistribution.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VBarChart, { data: sellerData.revenueDistribution, valueKey: "count", labelKey: "label" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { t }) })
      ] }),
      sellerData.monthlyTrend.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.monthlyRevenueTrend"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(VBarChart, { data: sellerData.monthlyTrend.map((d) => ({ ...d, label: d.month })), valueKey: "avgRevenue", labelKey: "label" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
        sellerData.satisfactionByType.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.satisfactionByType"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sellerData.satisfactionByType.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-700", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, className: n <= Math.round(item.avgSatisfaction) ? "text-yellow-400" : "text-gray-200", fill: n <= Math.round(item.avgSatisfaction) ? "currentColor" : "none" }, n)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600", children: item.avgSatisfaction }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400", children: [
              "(",
              t("analyticsPage.recordCountUnit", { count: item.count }),
              ")"
            ] })
          ] })
        ] }, idx)) }) }),
        sellerData.topKeywords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: t("analyticsPage.topKeywords"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: sellerData.topKeywords.map((kw, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold",
            style: {
              background: idx < 3 ? COLORS.primaryBg : "#f3f4f6",
              color: idx < 3 ? COLORS.primary : "#6b7280",
              fontSize: idx < 3 ? "13px" : "11px"
            },
            children: [
              kw.label,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] opacity-60", children: [
                "(",
                kw.count,
                ")"
              ] })
            ]
          },
          idx
        )) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-700 font-medium", children: t("analyticsPage.privacyNotice") }) })
    ] })),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 mb-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("analyticsPage.footerNotice") }) })
  ] });
};
const Card = ({ title, icon, extra, children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-600", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900", children: title }),
    extra && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto", children: extra })
  ] }),
  children
] });
const SummaryCard = ({ label, value, sub, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400", children: label })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900", children: value }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: sub })
] });
const EmptyState = ({ t }) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-400 text-sm py-8", children: t("analyticsPage.noData") });
export {
  Analytics as default
};
