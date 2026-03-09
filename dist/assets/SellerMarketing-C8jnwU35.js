import { a as useAuth, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, y as Megaphone, o as BarChart3, w as TrendingUp, v as Users, bK as Gift, at as Target, bn as DollarSign, bD as ShoppingCart, ao as Star, N as Eye, an as Zap, af as AlertCircle, d as Check, ad as Plus, b7 as Copy, T as Trash2, aq as Clock, a as X, aV as RefreshCw, av as Filter, aF as ArrowUpRight, bC as ArrowDownRight, br as Minus, b as ChevronRight } from "./vendor-icons-BFe5lkJJ.js";
import { N as NumberInput } from "./NumberInput-BjovFE9F.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
function calculateGrowthRate(currentValue, previousValue) {
  if (!previousValue || previousValue === 0) return currentValue > 0 ? 100 : 0;
  return Math.round((currentValue - previousValue) / previousValue * 1e4) / 100;
}
function computeSummaryStats(records) {
  if (!records || records.length === 0) {
    return { count: 0, totalRevenue: 0, avgRevenue: 0, maxRevenue: 0, minRevenue: 0, medianRevenue: 0, stdDev: 0 };
  }
  const revenues = records.map((r) => Number(r.monthly_revenue) || 0).filter((v) => v > 0);
  if (revenues.length === 0) {
    return { count: records.length, totalRevenue: 0, avgRevenue: 0, maxRevenue: 0, minRevenue: 0, medianRevenue: 0, stdDev: 0 };
  }
  const sorted = [...revenues].sort((a, b) => a - b);
  const total = revenues.reduce((s, v) => s + v, 0);
  const avg = total / revenues.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const variance = revenues.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / revenues.length;
  return {
    count: records.length,
    totalRevenue: total,
    avgRevenue: Math.round(avg),
    maxRevenue: sorted[sorted.length - 1],
    minRevenue: sorted[0],
    medianRevenue: Math.round(median),
    stdDev: Math.round(Math.sqrt(variance))
  };
}
function analyzeMonthlyTrend(records) {
  const monthMap = {};
  records.forEach((r) => {
    if (!r.record_date) return;
    const date = r.record_date.substring(0, 7);
    if (!monthMap[date]) {
      monthMap[date] = { revenue: 0, transactions: 0, customers: 0, count: 0 };
    }
    monthMap[date].revenue += Number(r.monthly_revenue) || 0;
    monthMap[date].transactions += Number(r.transaction_count) || 0;
    monthMap[date].customers += Number(r.customer_count) || 0;
    monthMap[date].count += 1;
  });
  const months = Object.keys(monthMap).sort();
  return months.map((month, i) => {
    const current = monthMap[month];
    const previous = i > 0 ? monthMap[months[i - 1]] : null;
    return {
      month,
      revenue: current.revenue,
      transactions: current.transactions,
      customers: current.customers,
      recordCount: current.count,
      revenueGrowth: previous ? calculateGrowthRate(current.revenue, previous.revenue) : 0,
      transactionGrowth: previous ? calculateGrowthRate(current.transactions, previous.transactions) : 0
    };
  });
}
function analyzeCountryPerformance(records) {
  const countryMap = {};
  records.forEach((r) => {
    const cc = r.country_code || "KR";
    if (!countryMap[cc]) {
      countryMap[cc] = { revenue: 0, transactions: 0, customers: 0, count: 0 };
    }
    countryMap[cc].revenue += Number(r.monthly_revenue) || 0;
    countryMap[cc].transactions += Number(r.transaction_count) || 0;
    countryMap[cc].customers += Number(r.customer_count) || 0;
    countryMap[cc].count += 1;
  });
  const totalRevenue = Object.values(countryMap).reduce((s, c) => s + c.revenue, 0);
  return Object.entries(countryMap).map(([code, data]) => ({
    countryCode: code,
    revenue: data.revenue,
    transactions: data.transactions,
    customers: data.customers,
    recordCount: data.count,
    avgRevenue: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
    sharePercent: totalRevenue > 0 ? Math.round(data.revenue / totalRevenue * 1e4) / 100 : 0
  })).sort((a, b) => b.revenue - a.revenue);
}
const SEGMENTS = {
  CHAMPION: {
    id: "champion",
    label: "챔피언",
    description: "최근 구매, 자주 구매, 높은 소비",
    color: "#10B981",
    icon: "👑",
    strategy: "로열티 프로그램, VIP 혜택 제공"
  },
  LOYAL: {
    id: "loyal",
    label: "충성 고객",
    description: "자주 방문하고 꾸준히 구매",
    color: "#3B82F6",
    icon: "💎",
    strategy: "업셀링, 신상품 먼저 안내"
  },
  POTENTIAL: {
    id: "potential",
    label: "잠재 충성",
    description: "최근 구매, 아직 빈도가 낮음",
    color: "#8B5CF6",
    icon: "⭐",
    strategy: "멤버십 가입 유도, 재구매 쿠폰"
  },
  NEW: {
    id: "new",
    label: "신규 고객",
    description: "최근 첫 구매",
    color: "#06B6D4",
    icon: "🆕",
    strategy: "환영 쿠폰, 온보딩 가이드"
  },
  PROMISING: {
    id: "promising",
    label: "유망 고객",
    description: "최근 구매, 보통 빈도/금액",
    color: "#F59E0B",
    icon: "📈",
    strategy: "한정 혜택, 교차 판매 추천"
  },
  NEEDS_ATTENTION: {
    id: "needs_attention",
    label: "관심 필요",
    description: "과거 자주 구매했으나 최근 방문 감소",
    color: "#EF4444",
    icon: "⚠️",
    strategy: "재방문 쿠폰, 맞춤 프로모션"
  },
  AT_RISK: {
    id: "at_risk",
    label: "이탈 위험",
    description: "오래전 구매, 빈도 낮아짐",
    color: "#DC2626",
    icon: "🚨",
    strategy: "특별 할인, 설문조사 발송"
  },
  HIBERNATING: {
    id: "hibernating",
    label: "휴면 고객",
    description: "오랜 기간 구매 없음",
    color: "#6B7280",
    icon: "💤",
    strategy: "대폭 할인 이벤트, 재활성화 캠페인"
  }
};
function calculateRFMScores(customers, referenceDate = /* @__PURE__ */ new Date()) {
  if (!customers || customers.length === 0) return [];
  const recencies = customers.map((c) => c.lastPurchaseDaysAgo).sort((a, b) => a - b);
  const frequencies = customers.map((c) => c.purchaseCount).sort((a, b) => a - b);
  const monetaries = customers.map((c) => c.totalSpent).sort((a, b) => a - b);
  const getQuantile = (sorted, q) => {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base] + (sorted[base + 1] !== void 0 ? rest * (sorted[base + 1] - sorted[base]) : 0);
  };
  const rQuintiles = [0.2, 0.4, 0.6, 0.8].map((q) => getQuantile(recencies, q));
  const fQuintiles = [0.2, 0.4, 0.6, 0.8].map((q) => getQuantile(frequencies, q));
  const mQuintiles = [0.2, 0.4, 0.6, 0.8].map((q) => getQuantile(monetaries, q));
  const scoreValue = (value, quintiles, inverse = false) => {
    let score = 1;
    for (let i = 0; i < quintiles.length; i++) {
      if (value > quintiles[i]) score = i + 2;
    }
    return inverse ? 6 - score : score;
  };
  return customers.map((c) => ({
    ...c,
    rfm: {
      recency: scoreValue(c.lastPurchaseDaysAgo, rQuintiles, true),
      // 최근일수록 높은 점수
      frequency: scoreValue(c.purchaseCount, fQuintiles, false),
      monetary: scoreValue(c.totalSpent, mQuintiles, false)
    }
  }));
}
function assignSegment(rfmScores) {
  const { recency: r, frequency: f, monetary: m } = rfmScores;
  const fm = (f + m) / 2;
  if (r >= 4 && fm >= 4) return SEGMENTS.CHAMPION;
  if (r >= 3 && fm >= 4) return SEGMENTS.LOYAL;
  if (r >= 4 && fm >= 2 && fm < 4) return SEGMENTS.POTENTIAL;
  if (r >= 4 && fm < 2) return SEGMENTS.NEW;
  if (r >= 3 && fm >= 2 && fm < 4) return SEGMENTS.PROMISING;
  if (r >= 2 && r < 3 && fm >= 3) return SEGMENTS.NEEDS_ATTENTION;
  if (r < 3 && fm >= 2) return SEGMENTS.AT_RISK;
  return SEGMENTS.HIBERNATING;
}
function extractCustomerData(records, referenceDate = /* @__PURE__ */ new Date()) {
  const customerMap = {};
  records.forEach((r) => {
    const customers = Number(r.customer_count) || 0;
    const revenue = Number(r.monthly_revenue) || 0;
    const transactions = Number(r.transaction_count) || 0;
    const date = r.record_date;
    const country = r.country_code || "KR";
    const key = `${country}_${r.record_type}`;
    if (!customerMap[key]) {
      customerMap[key] = {
        id: key,
        country,
        recordType: r.record_type,
        totalSpent: 0,
        purchaseCount: 0,
        totalCustomers: 0,
        lastPurchaseDate: null,
        firstPurchaseDate: null,
        records: []
      };
    }
    customerMap[key].totalSpent += revenue;
    customerMap[key].purchaseCount += transactions;
    customerMap[key].totalCustomers += customers;
    customerMap[key].records.push(r);
    if (!customerMap[key].lastPurchaseDate || date > customerMap[key].lastPurchaseDate) {
      customerMap[key].lastPurchaseDate = date;
    }
    if (!customerMap[key].firstPurchaseDate || date < customerMap[key].firstPurchaseDate) {
      customerMap[key].firstPurchaseDate = date;
    }
  });
  return Object.values(customerMap).map((c) => ({
    ...c,
    avgOrderValue: c.purchaseCount > 0 ? Math.round(c.totalSpent / c.purchaseCount) : 0,
    lastPurchaseDaysAgo: c.lastPurchaseDate ? Math.floor((referenceDate - new Date(c.lastPurchaseDate)) / (1e3 * 60 * 60 * 24)) : 999
  }));
}
function getSegmentDistribution(segmentedCustomers) {
  const distribution = {};
  Object.values(SEGMENTS).forEach((seg) => {
    distribution[seg.id] = {
      ...seg,
      count: 0,
      totalRevenue: 0,
      avgRevenue: 0,
      percentage: 0
    };
  });
  segmentedCustomers.forEach((c) => {
    const segId = c.segment.id;
    distribution[segId].count += 1;
    distribution[segId].totalRevenue += c.totalSpent;
  });
  const total = segmentedCustomers.length || 1;
  Object.values(distribution).forEach((seg) => {
    seg.percentage = Math.round(seg.count / total * 1e4) / 100;
    seg.avgRevenue = seg.count > 0 ? Math.round(seg.totalRevenue / seg.count) : 0;
  });
  return Object.values(distribution).sort((a, b) => b.count - a.count);
}
function runSegmentation(records) {
  const customers = extractCustomerData(records);
  const scored = calculateRFMScores(customers);
  const segmented = scored.map((c) => ({
    ...c,
    segment: assignSegment(c.rfm)
  }));
  const distribution = getSegmentDistribution(segmented);
  return {
    customers: segmented,
    distribution,
    totalCustomers: segmented.length,
    topSegment: distribution[0] || null,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
const TABS = [
  { id: "overview", icon: BarChart3, label: "마케팅 개요" },
  { id: "analytics", icon: TrendingUp, label: "매출 분석" },
  { id: "segments", icon: Users, label: "고객 세그먼트" },
  { id: "promotions", icon: Gift, label: "프로모션" },
  { id: "targeting", icon: Target, label: "타겟팅" }
];
const COLORS = {
  primary: "#059669",
  accent: "#8B5CF6",
  blue: "#3B82F6",
  amber: "#F59E0B",
  rose: "#F43F5E"
};
function SellerMarketing() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [dateRange, setDateRange] = reactExports.useState("month");
  const demoRecords = reactExports.useMemo(() => generateDemoData(), []);
  const summary = reactExports.useMemo(() => computeSummaryStats(demoRecords), [demoRecords]);
  const monthlyTrend = reactExports.useMemo(() => analyzeMonthlyTrend(demoRecords), [demoRecords]);
  const countryData = reactExports.useMemo(() => analyzeCountryPerformance(demoRecords), [demoRecords]);
  const segmentation = reactExports.useMemo(() => runSegmentation(demoRecords), [demoRecords]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 px-6 py-8 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 28 }),
        "마케팅 센터"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-emerald-100 text-sm", children: "매출 분석 · 고객 세그먼트 · 프로모션 · 타겟팅을 한곳에서 관리하세요" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
          tab.label
        ]
      },
      tab.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { summary, monthlyTrend, countryData, segmentation }),
      activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsTab, { records: demoRecords, summary, countryData }),
      activeTab === "segments" && /* @__PURE__ */ jsxRuntimeExports.jsx(SegmentsTab, { distribution: segmentation.distribution }),
      activeTab === "promotions" && /* @__PURE__ */ jsxRuntimeExports.jsx(PromotionsTab, {}),
      activeTab === "targeting" && /* @__PURE__ */ jsxRuntimeExports.jsx(TargetingTab, {})
    ] })
  ] });
}
function OverviewTab({ summary, monthlyTrend, countryData, segmentation }) {
  const lastGrowth = monthlyTrend.length >= 2 ? monthlyTrend[monthlyTrend.length - 1].revenueGrowth : 0;
  const kpis = [
    { label: "총 매출", value: formatKRW(summary.totalRevenue), change: lastGrowth, icon: DollarSign, color: COLORS.primary },
    { label: "데이터 건수", value: formatNum(summary.count), change: null, icon: ShoppingCart, color: COLORS.blue },
    { label: "최대 월 매출", value: formatKRW(summary.maxRevenue), change: null, icon: Star, color: COLORS.amber },
    { label: "활성 국가", value: `${countryData.length}개국`, change: null, icon: Eye, color: COLORS.accent }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((kpi, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${kpi.color}15` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(kpi.icon, { size: 20, style: { color: kpi.color } }) }),
        kpi.change !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeIndicator, { value: kpi.change })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-bold text-gray-900 dark:text-white", children: kpi.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: kpi.label })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: Gift, title: "쿠폰 발행", desc: "신규 할인 쿠폰을 만들어 매출을 높이세요", color: COLORS.rose }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: Zap, title: "타임세일 시작", desc: "한정 시간 특별 할인으로 긴급성을 높이세요", color: COLORS.amber }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: Target, title: "타겟 오디언스", desc: "맞춤 타겟팅으로 전환율을 극대화하세요", color: COLORS.accent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18 }),
        " 고객 세그먼트 분포"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: segmentation.distribution.slice(0, 4).map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: seg.count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: seg.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-500 font-medium", children: [
          seg.percentage,
          "%"
        ] })
      ] }, i)) })
    ] })
  ] });
}
function AnalyticsTab({ records, summary, countryData }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "🌍 국가별 매출" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: countryData.slice(0, 6).map((c, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium w-12 text-gray-600 dark:text-gray-400", children: c.countryCode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-emerald-500 h-2 rounded-full transition-all",
              style: { width: `${Math.min(100, c.revenue / (((_a = countryData[0]) == null ? void 0 : _a.revenue) || 1) * 100)}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white w-24 text-right", children: formatKRW(c.revenue) })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📊 매출 요약" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "총 매출", value: formatKRW(summary.totalRevenue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "평균 월 매출", value: formatKRW(summary.avgRevenue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "최고 월 매출", value: formatKRW(summary.maxRevenue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "총 거래", value: `${formatNum(summary.count)}건` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "평균 객단가", value: formatKRW(summary.avgRevenue) })
      ] })
    ] })
  ] }) });
}
function SegmentsTab({ distribution }) {
  const SEGMENT_COLORS = {
    champion: "#059669",
    loyal: "#10B981",
    potential_loyalist: "#34D399",
    new_customer: "#3B82F6",
    promising: "#8B5CF6",
    needs_attention: "#F59E0B",
    at_risk: "#F97316",
    lost: "#EF4444"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "👥 RFM 고객 세그먼트" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: distribution.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow",
          style: { borderLeftWidth: "4px", borderLeftColor: SEGMENT_COLORS[seg.id] || "#6B7280" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: [
                seg.icon,
                " ",
                seg.label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-xs font-bold px-2 py-0.5 rounded-full text-white",
                  style: { backgroundColor: SEGMENT_COLORS[seg.id] || "#6B7280" },
                  children: [
                    seg.count,
                    "명"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: seg.description || "고객 세그먼트" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full", style: { width: `${seg.percentage}%`, backgroundColor: SEGMENT_COLORS[seg.id] || "#6B7280" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1 text-right", children: [
              seg.percentage,
              "%"
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "💡 세그먼트별 전략" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: distribution.slice(0, 5).map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full mt-2 flex-shrink-0", style: { backgroundColor: SEGMENT_COLORS[seg.id] || "#6B7280" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [
            seg.icon,
            " ",
            seg.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: seg.strategy || "맞춤형 마케팅 전략을 수립하세요" })
        ] })
      ] }, i)) })
    ] })
  ] });
}
function PromotionsTab() {
  const { user } = useAuth();
  const API_BASE = "/api";
  const [coupons, setCoupons] = reactExports.useState([
    { id: "demo1", name: "신규 고객 환영", code: "SM-WELCOME15", type: "percentage", value: 15, usage_count: 42, max_usage: 100, status: "active", valid_from: "2026-01-01", valid_until: "2026-12-31" },
    { id: "demo2", name: "단골 감사 쿠폰", code: "SM-LOYAL20", type: "percentage", value: 20, usage_count: 18, max_usage: 50, status: "active", valid_from: "2026-01-01", valid_until: "2026-06-30" },
    { id: "demo3", name: "시즌 한정", code: "SM-SEASON10", type: "fixed", value: 1e4, usage_count: 0, max_usage: 200, status: "scheduled", valid_from: "2026-03-01", valid_until: "2026-03-31" }
  ]);
  const [flashSales, setFlashSales] = reactExports.useState([]);
  const [showCouponModal, setShowCouponModal] = reactExports.useState(false);
  const [showFlashModal, setShowFlashModal] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [couponForm, setCouponForm] = reactExports.useState({
    name: "",
    type: "percentage",
    value: "",
    max_usage: "",
    min_order_amount: "",
    valid_from: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0]
  });
  const [flashForm, setFlashForm] = reactExports.useState({
    name: "",
    discount_percent: "",
    start_time: "",
    end_time: "",
    description: ""
  });
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SM-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };
  const handleCreateCoupon = async () => {
    if (!couponForm.name || !couponForm.value) {
      showToast("쿠폰 이름과 할인 값을 입력하세요", "error");
      return;
    }
    setSaving(true);
    try {
      const code = generateCode();
      const newCoupon = {
        id: `coupon_${Date.now()}`,
        ...couponForm,
        code,
        value: Number(couponForm.value),
        max_usage: Number(couponForm.max_usage) || 999,
        min_order_amount: Number(couponForm.min_order_amount) || 0,
        usage_count: 0,
        status: "active",
        owner_id: user == null ? void 0 : user.id
      };
      try {
        const res = await fetch(`${API_BASE}/../marketing/api/promotions.php?resource=coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newCoupon)
        });
        const data = await res.json();
        if (data.success && data.id) newCoupon.id = data.id;
      } catch {
      }
      setCoupons((prev) => [newCoupon, ...prev]);
      setShowCouponModal(false);
      setCouponForm({ name: "", type: "percentage", value: "", max_usage: "", min_order_amount: "", valid_from: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], valid_until: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0] });
      showToast(`쿠폰 "${newCoupon.name}" (${code})이 생성되었습니다!`);
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteCoupon = (id) => {
    if (!confirm("이 쿠폰을 삭제하시겠습니까?")) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast("쿠폰이 삭제되었습니다");
  };
  const handleToggleCouponStatus = (id) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c));
  };
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => showToast(`쿠폰 코드 ${code} 복사됨`));
  };
  const handleCreateFlashSale = async () => {
    if (!flashForm.name || !flashForm.discount_percent || !flashForm.start_time || !flashForm.end_time) {
      showToast("모든 필수 항목을 입력하세요", "error");
      return;
    }
    setSaving(true);
    try {
      const newFlash = {
        id: `flash_${Date.now()}`,
        ...flashForm,
        discount_percent: Number(flashForm.discount_percent),
        status: "scheduled",
        owner_id: user == null ? void 0 : user.id
      };
      try {
        const res = await fetch(`${API_BASE}/../marketing/api/promotions.php?resource=flash_sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newFlash)
        });
        const data = await res.json();
        if (data.success && data.id) newFlash.id = data.id;
      } catch {
      }
      setFlashSales((prev) => [newFlash, ...prev]);
      setShowFlashModal(false);
      setFlashForm({ name: "", discount_percent: "", start_time: "", end_time: "", description: "" });
      showToast(`타임세일 "${newFlash.name}"이 생성되었습니다!`);
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`, children: [
      toast.type === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
      toast.msg
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white", children: [
        "🎟️ 쿠폰 관리 ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
          "(",
          coupons.length,
          "개)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowCouponModal(true), className: "px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        " 새 쿠폰 만들기"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: coupons.map((coupon) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 ${coupon.status === "active" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : coupon.status === "paused" ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-lg", children: coupon.type === "percentage" ? `${coupon.value}% OFF` : `₩${Number(coupon.value).toLocaleString()}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: coupon.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleCopyCode(coupon.code), className: "flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors", title: "클릭하여 복사", children: [
            coupon.code,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 10 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleToggleCouponStatus(coupon.id),
              className: `text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${coupon.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : coupon.status === "paused" ? "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400" : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"}`,
              children: coupon.status === "active" ? "✅ 활성" : coupon.status === "paused" ? "⏸ 일시정지" : "📅 예약"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "사용: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-gray-900 dark:text-white", children: [
              coupon.usage_count,
              "/",
              coupon.max_usage || "∞"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteCoupon(coupon.id), className: "opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1", title: "삭제", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] }),
        coupon.valid_until && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
          " ~",
          coupon.valid_until
        ] })
      ] })
    ] }, coupon.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white", children: [
          "⚡ 타임세일 ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
            "(",
            flashSales.length,
            "개)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowFlashModal(true), className: "text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 px-3 py-1.5 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
          " 새 타임세일"
        ] })
      ] }),
      flashSales.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: flashSales.map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18, className: "text-amber-600 dark:text-amber-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: fs.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
            fs.discount_percent,
            "% 할인 · ",
            fs.start_time,
            " ~ ",
            fs.end_time
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${fs.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`, children: fs.status === "active" ? "진행 중" : "예약됨" })
      ] }, fs.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-400 dark:text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 40, className: "mx-auto mb-3 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "현재 진행 중인 타임세일이 없습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "타임세일을 시작하여 한정 시간 특별 할인을 제공하세요" })
      ] })
    ] }),
    showCouponModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: () => setShowCouponModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 20, className: "text-emerald-500" }),
          " 새 쿠폰 만들기"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCouponModal(false), className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "쿠폰 이름 *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: couponForm.name, onChange: (e) => setCouponForm((f) => ({ ...f, name: e.target.value })), placeholder: "예: 신규 가입 환영 쿠폰", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "할인 유형" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: couponForm.type, onChange: (e) => setCouponForm((f) => ({ ...f, type: e.target.value })), className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "percentage", children: "% 할인" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fixed", children: "₩ 정액 할인" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "할인 값 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: couponForm.value, onChange: (val) => setCouponForm((f) => ({ ...f, value: val })), placeholder: couponForm.type === "percentage" ? "15" : "10,000", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "최대 사용 횟수" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: couponForm.max_usage, onChange: (val) => setCouponForm((f) => ({ ...f, max_usage: val })), placeholder: "100", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "최소 주문 금액" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: couponForm.min_order_amount, onChange: (val) => setCouponForm((f) => ({ ...f, min_order_amount: val })), placeholder: "50,000", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "시작일" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: couponForm.valid_from, onChange: (e) => setCouponForm((f) => ({ ...f, valid_from: e.target.value })), className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "종료일" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: couponForm.valid_until, onChange: (e) => setCouponForm((f) => ({ ...f, valid_until: e.target.value })), className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] })
        ] }),
        couponForm.name && couponForm.value && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-80", children: "미리보기" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xl mt-1", children: couponForm.type === "percentage" ? `${couponForm.value}% OFF` : `₩${Number(couponForm.value).toLocaleString()}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-90 mt-0.5", children: couponForm.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCouponModal(false), className: "flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCreateCoupon, disabled: saving, className: "flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          saving ? "생성 중..." : "쿠폰 생성"
        ] })
      ] })
    ] }) }),
    showFlashModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: () => setShowFlashModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, className: "text-amber-500" }),
          " 새 타임세일"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFlashModal(false), className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "세일 이름 *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: flashForm.name, onChange: (e) => setFlashForm((f) => ({ ...f, name: e.target.value })), placeholder: "예: 봄맞이 특별 세일", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-amber-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "할인율 (%) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "1", max: "90", value: flashForm.discount_percent, onChange: (e) => setFlashForm((f) => ({ ...f, discount_percent: e.target.value })), placeholder: "30", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "시작 시간 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: flashForm.start_time, onChange: (e) => setFlashForm((f) => ({ ...f, start_time: e.target.value })), className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "종료 시간 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: flashForm.end_time, onChange: (e) => setFlashForm((f) => ({ ...f, end_time: e.target.value })), className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "설명" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: flashForm.description, onChange: (e) => setFlashForm((f) => ({ ...f, description: e.target.value })), rows: 2, placeholder: "타임세일 설명을 입력하세요", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFlashModal(false), className: "flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCreateFlashSale, disabled: saving, className: "flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
          saving ? "생성 중..." : "타임세일 시작"
        ] })
      ] })
    ] }) })
  ] });
}
function TargetingTab() {
  var _a;
  const PRESETS = [
    { id: "vip", name: "고가치 고객 (VIP)", desc: "월 매출 상위 20% 고객", icon: "💎", conditions: { segment: "champion", minRevenue: 5e5 }, estimatedReach: 156 },
    { id: "churn", name: "이탈 위험 고객", desc: "최근 3개월 비활성 고객", icon: "⚠️", conditions: { segment: "at_risk", inactiveDays: 90 }, estimatedReach: 89 },
    { id: "new", name: "신규 고객", desc: "최근 30일 내 첫 거래", icon: "🆕", conditions: { segment: "new_customer", daysSinceFirst: 30 }, estimatedReach: 234 },
    { id: "loyal", name: "충성 고객", desc: "6개월 이상 연속 거래", icon: "👑", conditions: { segment: "loyal", minMonths: 6 }, estimatedReach: 312 },
    { id: "dormant", name: "휴면 고객", desc: "6개월 이상 미접속", icon: "😴", conditions: { segment: "hibernating", inactiveDays: 180 }, estimatedReach: 45 },
    { id: "potential", name: "성장 잠재 고객", desc: "최근 활동이 증가하는 고객", icon: "🚀", conditions: { segment: "potential_loyalist" }, estimatedReach: 178 }
  ];
  const COUNTRIES = ["전체", "KR", "US", "JP", "SG", "VN", "TH", "KH", "GB"];
  const [selectedPreset, setSelectedPreset] = reactExports.useState(null);
  const [customFilters, setCustomFilters] = reactExports.useState({ country: "전체", minRevenue: "", maxRevenue: "", segment: "" });
  const [showResult, setShowResult] = reactExports.useState(false);
  const estimatedReach = reactExports.useMemo(() => {
    var _a2;
    if (selectedPreset) return ((_a2 = PRESETS.find((p) => p.id === selectedPreset)) == null ? void 0 : _a2.estimatedReach) || 0;
    let base = 1024;
    if (customFilters.country !== "전체") base = Math.floor(base * 0.3);
    if (customFilters.minRevenue) base = Math.floor(base * 0.5);
    if (customFilters.segment) base = Math.floor(base * 0.4);
    return base;
  }, [selectedPreset, customFilters]);
  const handleApplyTarget = () => {
    setShowResult(true);
    setTimeout(() => setShowResult(false), 5e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    showResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20, className: "text-emerald-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-emerald-800 dark:text-emerald-300", children: "타겟 그룹이 설정되었습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 dark:text-emerald-400", children: [
          "예상 도달 ",
          estimatedReach,
          "명 · 프로모션 탭에서 쿠폰을 연결하세요"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📋 빠른 타겟 설정" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setSelectedPreset(selectedPreset === preset.id ? null : preset.id);
            setCustomFilters({ country: "전체", minRevenue: "", maxRevenue: "", segment: "" });
          },
          className: `flex items-center gap-3 p-4 rounded-lg transition-all text-left border-2 ${selectedPreset === preset.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md" : "border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: preset.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: preset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: preset.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-600 dark:text-emerald-400", children: preset.estimatedReach }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "예상 도달" })
            ] })
          ]
        },
        preset.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 16 }),
        " 커스텀 필터"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "국가" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: customFilters.country,
              onChange: (e) => {
                setCustomFilters((f) => ({ ...f, country: e.target.value }));
                setSelectedPreset(null);
              },
              className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "최소 매출" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              value: customFilters.minRevenue,
              onChange: (val) => {
                setCustomFilters((f) => ({ ...f, minRevenue: val }));
                setSelectedPreset(null);
              },
              placeholder: "₩0",
              className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "최대 매출" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              value: customFilters.maxRevenue,
              onChange: (val) => {
                setCustomFilters((f) => ({ ...f, maxRevenue: val }));
                setSelectedPreset(null);
              },
              placeholder: "무제한",
              className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "RFM 세그먼트" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: customFilters.segment,
              onChange: (e) => {
                setCustomFilters((f) => ({ ...f, segment: e.target.value }));
                setSelectedPreset(null);
              },
              className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "전체" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "champion", children: "챔피언" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "loyal", children: "충성 고객" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "potential_loyalist", children: "잠재 충성" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new_customer", children: "신규" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "at_risk", children: "이탈 위험" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hibernating", children: "휴면" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 16, className: "text-emerald-500" }),
          " 예상 도달 범위"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-emerald-600 dark:text-emerald-400", children: estimatedReach.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "명" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: selectedPreset ? `프리셋: ${(_a = PRESETS.find((p) => p.id === selectedPreset)) == null ? void 0 : _a.name}` : "커스텀 필터 기반 추정치" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleApplyTarget,
          className: "px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 16 }),
            " 타겟 그룹 설정"
          ]
        }
      )
    ] }) })
  ] });
}
function QuickAction({ icon: Icon, title, desc, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg group-hover:scale-110 transition-transform", style: { backgroundColor: `${color}15` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, style: { color } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-gray-300 ml-auto" })
  ] });
}
function ChangeIndicator({ value }) {
  if (value === null || value === void 0) return null;
  const isUp = value > 0;
  const Icon = isUp ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const color = isUp ? "text-green-500" : value < 0 ? "text-red-500" : "text-gray-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-0.5 text-xs font-medium ${color}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
    Math.abs(value).toFixed(1),
    "%"
  ] });
}
function StatRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: value })
  ] });
}
function formatKRW(val) {
  if (!val) return "₩0";
  if (val >= 1e8) return `₩${(val / 1e8).toFixed(1)}억`;
  if (val >= 1e4) return `₩${(val / 1e4).toFixed(0)}만`;
  return `₩${val.toLocaleString()}`;
}
function formatNum(val) {
  if (!val) return "0";
  return val.toLocaleString();
}
function generateDemoData() {
  const records = [];
  const countries = ["KR", "US", "JP", "SG", "VN", "TH"];
  const categories = ["웨딩홀", "스튜디오", "파티룸", "세미나실", "공유오피스"];
  const now = /* @__PURE__ */ new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    countries.forEach((country) => {
      records.push({
        record_date: date.toISOString().split("T")[0],
        record_type: "monthly",
        country_code: country,
        monthly_revenue: Math.floor(Math.random() * 5e6) + 5e5,
        transaction_count: Math.floor(Math.random() * 50) + 5,
        customer_count: Math.floor(Math.random() * 30) + 3,
        best_selling_item: categories[Math.floor(Math.random() * categories.length)]
      });
    });
  }
  return records;
}
export {
  SellerMarketing as default
};
