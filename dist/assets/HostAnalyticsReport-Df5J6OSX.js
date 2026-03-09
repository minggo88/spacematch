import { a as useAuth, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, ab as Lock, o as BarChart3, D as Download, aV as RefreshCw, u as Store, C as CheckCircle, N as Eye, v as Users, w as TrendingUp, bA as PieChart, bc as Activity, az as Calendar, ak as ArrowRight, ae as React, aq as Clock, an as Zap, bB as Trophy, br as Minus, aF as ArrowUpRight, bC as ArrowDownRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const HostAnalyticsReport = () => {
  var _a;
  const { t } = useTranslation("host");
  const { user } = useAuth();
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [hasAccess, setHasAccess] = reactExports.useState(null);
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/venues/host_report.php`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("리포트 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/users/check_service.php?service=analytics_report`, { credentials: "include" }).then((res) => res.json()).then((data2) => {
      setHasAccess(data2.hasAccess ?? false);
      if (data2.hasAccess) fetchReport();
      else setLoading(false);
    }).catch(() => {
      setHasAccess(false);
      setLoading(false);
    });
  }, []);
  const CATEGORY_LABELS = {
    fashion: "패션",
    beauty: "뷰티",
    food: "푸드",
    living: "리빙",
    art: "아트",
    stationery: "문구",
    digital: "디지털",
    activity: "액티비티",
    eco: "에코",
    pet: "반려동물",
    kids: "키즈",
    handmade: "핸드메이드",
    vintage: "빈티지",
    perfume: "향수",
    book: "도서"
  };
  const getCatLabel = (cat) => CATEGORY_LABELS[cat] || cat || "기타";
  const exportCSV = () => {
    if (!(data == null ? void 0 : data.venues)) return;
    const headers = ["공간명", "위치", "상태", "가격", "조회수", "신청수", "승인수", "거절수", "대기수", "전환율(%)"];
    const rows = data.venues.map((v) => [
      v.name,
      v.location,
      v.status === "approved" ? "운영 중" : v.status,
      v.price,
      v.view_count,
      v.app_count,
      v.approved_count,
      v.rejected_count,
      v.pending_count,
      v.conversion_rate
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `공간분석_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  if (loading || hasAccess === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-3 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" }) });
  }
  if (hasAccess === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 32, className: "text-violet-500 dark:text-violet-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold text-gray-900 dark:text-white mb-2", children: "분석 리포트 서비스" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 dark:text-gray-400 mb-6 leading-relaxed", children: [
        "이 서비스는 유료 구독 후 이용할 수 있습니다.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "관리자에게 문의하여 서비스를 활성화하세요."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-violet-50 dark:bg-violet-950/50 rounded-2xl p-4 border border-violet-100 dark:border-violet-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-violet-600 dark:text-violet-400 mb-2", children: "📊 포함된 기능" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 공간별 조회수/신청수/전환율 분석" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• vs Last Month 성과 비교 및 증감률" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• 전환 퍼널 및 요일별 히트맵" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• CSV 데이터 내보내기" })
        ] })
      ] })
    ] }) });
  }
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "Unable to load report" })
    ] });
  }
  const { summary, venues, monthlyTrend, appsByCategory, recentApps, venueRanking, previousPeriod, weekdayStats } = data;
  const GrowthBadge = ({ value }) => {
    if (value === 0 || value === void 0) return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs font-bold text-gray-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 12 }),
      " 0%"
    ] });
    const isPositive = value > 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-0.5 text-xs font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`, children: [
      isPositive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { size: 12 }),
      isPositive ? "+" : "",
      value,
      "%"
    ] });
  };
  const Bar = ({ value, max, color = "bg-indigo-500" }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full ${color} transition-all duration-500`,
      style: { width: `${max > 0 ? Math.min(value / max * 100, 100) : 0}%` }
    }
  ) });
  const tabs = [
    { id: "overview", label: "개요", icon: PieChart },
    { id: "venues", label: "공간별 분석", icon: Store },
    { id: "trends", label: "트렌드", icon: Activity }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight", children: "📊 분석 리포트" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2 font-medium", children: "내 공간의 성과를 한눈에 확인하세요" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCSV, className: "flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
          " CSV 내보내기"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: fetchReport, className: "flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
          " 새로고침"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [
      { label: "등록 공간", value: summary.totalVenues, icon: Store, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40", borderColor: "border-indigo-100 dark:border-indigo-800" },
      { label: "운영 중", value: summary.activeVenues, icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", borderColor: "border-emerald-100 dark:border-emerald-800" },
      { label: "총 조회수", value: (_a = summary.totalViews) == null ? void 0 : _a.toLocaleString(), icon: Eye, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/40", borderColor: "border-sky-100 dark:border-sky-800" },
      { label: "Total Applications수", value: summary.totalApps, icon: Users, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40", borderColor: "border-violet-100 dark:border-violet-800" },
      { label: "승인 수", value: summary.totalApproved, icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-green-50 dark:bg-green-950/40", borderColor: "border-green-100 dark:border-green-800" },
      { label: "전환율", value: `${summary.conversionRate}%`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", borderColor: "border-amber-100 dark:border-amber-800" }
    ].map((kpi, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${kpi.bg} rounded-2xl p-4 border ${kpi.borderColor}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(kpi.icon, { size: 16, className: kpi.color }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase", children: kpi.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 dark:text-white", children: kpi.value })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl overflow-x-auto", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 14 }),
          " ",
          tab.label
        ]
      },
      tab.id
    )) }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      previousPeriod && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
          " vs Last Month 성과 비교"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          { label: "신청수", current: previousPeriod.currentApps, prev: previousPeriod.prevApps, growth: previousPeriod.appsGrowth, color: "indigo" },
          { label: "승인수", current: previousPeriod.currentApproved, prev: previousPeriod.prevApproved, growth: previousPeriod.approvedGrowth, color: "emerald" },
          { label: "전환율", current: `${previousPeriod.currentConversion}%`, prev: `${previousPeriod.prevConversion}%`, growth: previousPeriod.prevConversion > 0 ? parseFloat(((previousPeriod.currentConversion - previousPeriod.prevConversion) / previousPeriod.prevConversion * 100).toFixed(1)) : 0, color: "amber" }
        ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(GrowthBadge, { value: item.growth })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "이번 달" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`, children: item.current })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "text-gray-300 dark:text-gray-600 mb-1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "지난 달" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: item.prev })
            ] })
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
          " 전환 퍼널"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-0", children: [
          { label: "조회", value: summary.totalViews, color: "bg-sky-500", width: "100%" },
          { label: "신청", value: summary.totalApps, color: "bg-violet-500", width: summary.totalViews > 0 ? `${Math.max(Math.round(summary.totalApps / summary.totalViews * 100), 30)}%` : "60%" },
          { label: "승인", value: summary.totalApproved, color: "bg-emerald-500", width: summary.totalViews > 0 ? `${Math.max(Math.round(summary.totalApproved / summary.totalViews * 100), 20)}%` : "30%" }
        ].map((step, i, arr) => {
          const convRate = i > 0 && arr[i - 1].value > 0 ? (step.value / arr[i - 1].value * 100).toFixed(1) : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-2", children: step.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `${step.color} rounded-xl flex items-center justify-center transition-all duration-500`,
                  style: { width: step.width, height: "64px", minWidth: "80px" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-extrabold text-lg", children: typeof step.value === "number" ? step.value.toLocaleString() : step.value })
                }
              )
            ] }),
            i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mx-1 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "text-gray-300 dark:text-gray-600" }),
              convRate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1", children: [
                convRate,
                "%"
              ] })
            ] })
          ] }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
            " Monthly Application Trend"
          ] }),
          monthlyTrend.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: monthlyTrend.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 w-16 flex-shrink-0", children: m.month }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: m.count, max: Math.max(...monthlyTrend.map((t2) => t2.count)), color: "bg-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-700 dark:text-gray-300", children: [
                m.count,
                " applications"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-600 dark:text-emerald-400 font-bold", children: [
                m.approved || 0,
                " 승인"
              ] })
            ] })
          ] }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 text-sm text-center py-8", children: "데이터가 없습니다" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { size: 14 }),
            " 신청자 카테고리 분포"
          ] }),
          appsByCategory.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: appsByCategory.map((cat, i) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 dark:text-gray-400 w-24 flex-shrink-0 truncate", children: getCatLabel(cat.category) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: cat.count, max: ((_a2 = appsByCategory[0]) == null ? void 0 : _a2.count) || 1, color: "bg-violet-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-700 dark:text-gray-300 flex-shrink-0", children: [
                cat.count,
                " applications"
              ] })
            ] }, i);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 text-sm text-center py-8", children: "데이터가 없습니다" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }),
            " 최근 신청 내역"
          ] }),
          recentApps.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentApps.map((app, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between p-3 rounded-xl ${app.is_priority == 1 ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800" : "bg-gray-50 dark:bg-gray-800"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full flex-shrink-0 ${app.status === "approved" ? "bg-emerald-500" : app.status === "rejected" ? "bg-red-500" : "bg-yellow-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  app.is_priority == 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 11, className: "text-amber-500", fill: "currentColor" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-900 dark:text-white truncate", children: app.seller_name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 truncate block", children: [
                  app.venue_name,
                  " · ",
                  getCatLabel(app.seller_category)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold
                                                    ${app.status === "approved" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" : app.status === "rejected" ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400" : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400"}`, children: app.status === "approved" ? "승인" : app.status === "rejected" ? "거절" : "대기" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500", children: new Date(app.created_at).toLocaleDateString("ko-KR") })
            ] })
          ] }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 text-sm text-center py-8", children: "신청 내역이 없습니다" })
        ] })
      ] })
    ] }),
    activeTab === "venues" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: venues.length > 0 ? venues.map((v, i) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-gray-900 dark:text-white truncate", children: v.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${v.status === "approved" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`, children: v.status === "approved" ? "운영 중" : v.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
              v.location,
              " · ",
              v.type,
              " · ₩",
              parseInt(v.price || 0).toLocaleString(),
              "/",
              v.pricing_unit || "일"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-sky-600 dark:text-sky-400", children: v.view_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-bold", children: "조회" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-violet-600 dark:text-violet-400", children: v.app_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-bold", children: "신청" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-emerald-600 dark:text-emerald-400", children: v.approved_count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-bold", children: "승인" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-lg font-extrabold ${v.conversion_rate >= 50 ? "text-emerald-600 dark:text-emerald-400" : v.conversion_rate >= 20 ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`, children: [
                v.conversion_rate,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-bold", children: "전환율" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 dark:text-gray-500", children: "신청 현황" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
                " 승인 ",
                v.approved_count
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-yellow-500" }),
                " 대기 ",
                v.pending_count
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-red-400" }),
                " 거절 ",
                v.rejected_count
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex", children: v.app_count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-500 h-full transition-all", style: { width: `${v.approved_count / v.app_count * 100}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-400 h-full transition-all", style: { width: `${v.pending_count / v.app_count * 100}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-400 h-full transition-all", style: { width: `${v.rejected_count / v.app_count * 100}%` } })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-200 dark:bg-gray-600 h-full w-full" }) })
        ] })
      ] }, v.id);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-3", size: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 font-medium", children: "등록된 공간이 없습니다" })
    ] }) }),
    activeTab === "trends" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      weekdayStats && weekdayStats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
          " 요일별 신청 패턴",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-gray-400 dark:text-gray-500 normal-case tracking-normal ml-1", children: "최근 3개월" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2 mb-4", children: (() => {
          const maxCount = Math.max(...weekdayStats.map((d) => d.count), 1);
          return weekdayStats.map((d, i) => {
            const intensity = d.count / maxCount;
            const bgClass = intensity >= 0.8 ? "bg-indigo-600 text-white" : intensity >= 0.5 ? "bg-indigo-400 text-white" : intensity >= 0.2 ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl p-3 text-center transition-all ${bgClass}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold mb-1", children: d.day }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold", children: d.count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-70", children: " applications" })
            ] }, i);
          });
        })() }),
        (() => {
          const maxDay = weekdayStats.reduce((max, d) => d.count > max.count ? d : max, weekdayStats[0]);
          const minDay = weekdayStats.reduce((min, d) => d.count < min.count ? d : min, weekdayStats[0]);
          const total = weekdayStats.reduce((s, d) => s + d.count, 0);
          if (total === 0) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: [
            "💡 ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-indigo-600 dark:text-indigo-400", children: [
              maxDay.day,
              "요일"
            ] }),
            "에 가장 많은 신청(",
            maxDay.count,
            " applications)이 들어오고,",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-gray-500 dark:text-gray-400", children: [
              " ",
              minDay.day,
              "요일"
            ] }),
            "이 가장 적습니다(",
            minDay.count,
            " applications)."
          ] }) });
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 14 }),
          " 공간 성과 순위"
        ] }),
        venueRanking.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: venueRanking.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0
                                            ${i === 0 ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400" : i === 1 ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : i === 2 ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`, children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-white truncate", children: v.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: v.location })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12, className: "text-sky-500 dark:text-sky-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700 dark:text-gray-300", children: v.view_count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-violet-500 dark:text-violet-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700 dark:text-gray-300", children: v.app_count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 12, className: v.conversion_rate >= 50 ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-gray-700 dark:text-gray-300", children: [
                v.conversion_rate,
                "%"
              ] })
            ] })
          ] })
        ] }, v.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 dark:text-gray-500 text-sm text-center py-8", children: "데이터가 없습니다" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3", children: "💡 성과 개선 팁" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          { title: "사진을 추가하세요", desc: "사진이 5장 이상인 공간은 신청률이 평균 2배 높습니다.", icon: "📷" },
          { title: "가격을 검토하세요", desc: "시세보다 10~20% 낮은 가격대가 가장 높은 전환율을 보입니다.", icon: "💰" },
          { title: "빠른 응답이 핵심", desc: "24시간 내 승인/거절 응답하면 재신청률이 3배 높아집니다.", icon: "⚡" }
        ].map((tip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/60 dark:bg-gray-900/60 backdrop-blur rounded-xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: tip.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-gray-900 dark:text-white mt-2", children: tip.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed", children: tip.desc })
        ] }, i)) })
      ] })
    ] })
  ] });
};
export {
  HostAnalyticsReport as default
};
