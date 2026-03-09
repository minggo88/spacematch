import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, K as Shield, y as Megaphone, bK as Gift, N as Eye, o as BarChart3, af as AlertCircle, d as Check, aq as Clock, C as CheckCircle, f as Search, aR as Ban, T as Trash2, w as TrendingUp, bn as DollarSign, v as Users, aF as ArrowUpRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const ADMIN_TABS = [
  { id: "campaigns", icon: Megaphone, label: "캠페인 관리" },
  { id: "coupons", icon: Gift, label: "쿠폰 관리" },
  { id: "ads", icon: Eye, label: "광고 심사" },
  { id: "analytics", icon: BarChart3, label: "통합 분석" }
];
const STATUS_MAP = {
  draft: { label: "초안", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" },
  review: { label: "심사중", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  approved: { label: "승인", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  active: { label: "활성", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  paused: { label: "일시정지", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  completed: { label: "완료", cls: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400" },
  rejected: { label: "반려", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  cancelled: { label: "취소", cls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  scheduled: { label: "예약", cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" }
};
const DEMO_CAMPAIGNS = [
  { id: "cmp_001", name: "봄 시즌 프로모션", type: "awareness", side: "host", owner_name: "강남 파티홀", status: "review", budget_total: 5e5, created_at: "2026-02-20" },
  { id: "cmp_002", name: "신규 고객 쿠폰 페스타", type: "conversion", side: "seller", owner_name: "김셀러", status: "active", budget_total: 3e5, created_at: "2026-02-18" },
  { id: "cmp_003", name: "겨울 한정 할인", type: "traffic", side: "seller", owner_name: "이벤트홀", status: "completed", budget_total: 2e5, created_at: "2026-01-10" },
  { id: "cmp_004", name: "배너 광고 캠페인", type: "awareness", side: "host", owner_name: "스튜디오 A", status: "active", budget_total: 8e5, created_at: "2026-02-01" },
  { id: "cmp_005", name: "팝업 스토어 광고", type: "conversion", side: "host", owner_name: "팝업존", status: "review", budget_total: 45e4, created_at: "2026-02-22" }
];
const DEMO_COUPONS = [
  { id: "cpn_001", name: "신규 가입 환영", code: "SM-WELCOME15", type: "percentage", value: 15, usage_count: 342, max_usage: 1e3, status: "active", owner_name: "김셀러", side: "seller", valid_until: "2026-12-31" },
  { id: "cpn_002", name: "단골 감사 쿠폰", code: "SM-LOYAL20", type: "percentage", value: 20, usage_count: 89, max_usage: 200, status: "active", owner_name: "이벤트홀", side: "seller", valid_until: "2026-06-30" },
  { id: "cpn_003", name: "시즌 한정", code: "SM-SEASON10", type: "fixed", value: 1e4, usage_count: 0, max_usage: 500, status: "scheduled", owner_name: "강남 파티홀", side: "host", valid_until: "2026-03-31" },
  { id: "cpn_004", name: "플랫폼 전체 할인", code: "SM-PLATFORM5", type: "percentage", value: 5, usage_count: 1250, max_usage: 5e3, status: "active", owner_name: "관리자", side: "platform", valid_until: "2026-12-31" }
];
const DEMO_ADS = [
  { id: "ad_001", name: "메인페이지 배너", type: "banner", owner_name: "스튜디오 A", status: "review", budget: 3e5, duration: "2026-03-01 ~ 2026-03-31", content_url: "/banners/spring.jpg" },
  { id: "ad_002", name: "검색 결과 스폰서", type: "sponsored", owner_name: "팝업존", status: "review", budget: 2e5, duration: "2026-02-25 ~ 2026-03-25", content_url: null },
  { id: "ad_003", name: "사이드바 배너", type: "banner", owner_name: "파티룸", status: "approved", budget: 15e4, duration: "2026-02-01 ~ 2026-02-28", content_url: "/banners/party.jpg" }
];
function AdminMarketing() {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = reactExports.useState("campaigns");
  const [toast, setToast] = reactExports.useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 28 }),
        " 마케팅 관리 센터"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-indigo-100 text-sm", children: "전체 캠페인 · 쿠폰 · 광고를 모니터링하고 관리하세요" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto", children: ADMIN_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
          tab.label
        ]
      },
      tab.id
    )) }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-500" : "bg-indigo-500"}`, children: [
      toast.type === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
      toast.msg
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      activeTab === "campaigns" && /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignsTab, { showToast }),
      activeTab === "coupons" && /* @__PURE__ */ jsxRuntimeExports.jsx(CouponsTab, { showToast }),
      activeTab === "ads" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdsTab, { showToast }),
      activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsTab, {})
    ] })
  ] });
}
function CampaignsTab({ showToast }) {
  const [campaigns, setCampaigns] = reactExports.useState(DEMO_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterSide, setFilterSide] = reactExports.useState("all");
  const filtered = reactExports.useMemo(() => {
    return campaigns.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterSide !== "all" && c.side !== filterSide) return false;
      if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) && !c.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, searchTerm, filterStatus, filterSide]);
  const handleStatusChange = (id, newStatus) => {
    var _a;
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`캠페인 상태가 "${(_a = STATUS_MAP[newStatus]) == null ? void 0 : _a.label}"(으)로 변경되었습니다`);
  };
  const handleDelete = (id) => {
    if (!confirm("이 캠페인을 삭제하시겠습니까?")) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast("캠페인이 삭제되었습니다");
  };
  const counts = reactExports.useMemo(() => ({
    total: campaigns.length,
    review: campaigns.filter((c) => c.status === "review").length,
    active: campaigns.filter((c) => c.status === "active").length
  }), [campaigns]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "전체 캠페인", value: counts.total, icon: Megaphone, color: "indigo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "심사 대기", value: counts.review, icon: Clock, color: "amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "활성 중", value: counts.active, icon: CheckCircle, color: "emerald" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px] relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "캠페인 이름 또는 담당자 검색...",
            className: "w-full pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filterStatus,
          onChange: (e) => setFilterStatus(e.target.value),
          className: "px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "상태: 전체" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "review", children: "심사중" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "활성" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approved", children: "승인" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paused", children: "일시정지" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "완료" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "반려" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filterSide,
          onChange: (e) => setFilterSide(e.target.value),
          className: "px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "유형: 전체" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "seller", children: "셀러" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "host", children: "호스트" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 dark:bg-gray-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "캠페인" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "담당" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "유형" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "예산" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "상태" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "작업" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: [
        filtered.map((c) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: c.created_at })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600 dark:text-gray-300", children: c.owner_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${c.side === "seller" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"}`, children: c.side === "seller" ? "셀러" : "호스트" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium text-gray-900 dark:text-white", children: [
              "₩",
              (c.budget_total / 1e4).toFixed(0),
              "만"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${((_a = STATUS_MAP[c.status]) == null ? void 0 : _a.cls) || ""}`, children: ((_b = STATUS_MAP[c.status]) == null ? void 0 : _b.label) || c.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              c.status === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStatusChange(c.id, "approved"), className: "p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg", title: "승인", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStatusChange(c.id, "rejected"), className: "p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg", title: "반려", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 16 }) })
              ] }),
              c.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStatusChange(c.id, "paused"), className: "p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg", title: "일시정지", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }) }),
              c.status === "paused" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStatusChange(c.id, "active"), className: "p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg", title: "활성화", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(c.id), className: "p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg", title: "삭제", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
            ] }) })
          ] }, c.id);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-gray-400", children: "조건에 맞는 캠페인이 없습니다" }) })
      ] })
    ] }) }) })
  ] });
}
function CouponsTab({ showToast }) {
  const [coupons, setCoupons] = reactExports.useState(DEMO_COUPONS);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    if (!searchTerm) return coupons;
    const term = searchTerm.toLowerCase();
    return coupons.filter((c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term) || c.owner_name.toLowerCase().includes(term));
  }, [coupons, searchTerm]);
  const handleToggle = (id) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c));
  };
  const handleDelete = (id) => {
    if (!confirm("이 쿠폰을 삭제하시겠습니까?")) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast("쿠폰이 삭제되었습니다");
  };
  const totalUsage = coupons.reduce((sum, c) => sum + c.usage_count, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "전체 쿠폰", value: coupons.length, icon: Gift, color: "indigo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "활성 쿠폰", value: coupons.filter((c) => c.status === "active").length, icon: CheckCircle, color: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "총 사용", value: totalUsage.toLocaleString() + "회", icon: TrendingUp, color: "amber" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "쿠폰 이름, 코드, 담당자 검색...",
          className: "w-full pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: filtered.map((coupon) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 ${coupon.status === "active" ? "bg-gradient-to-r from-indigo-500 to-blue-500" : coupon.status === "paused" ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-lg", children: coupon.type === "percentage" ? `${coupon.value}% OFF` : `₩${Number(coupon.value).toLocaleString()}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: coupon.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono", children: coupon.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "담당: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: coupon.owner_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "유형: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1 py-0.5 rounded ${coupon.side === "seller" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : coupon.side === "platform" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"}`, children: coupon.side === "seller" ? "셀러" : coupon.side === "platform" ? "플랫폼" : "호스트" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "사용: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-gray-900 dark:text-white", children: [
              coupon.usage_count,
              "/",
              coupon.max_usage
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
            " ~",
            coupon.valid_until
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleToggle(coupon.id),
              className: `flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${coupon.status === "active" ? "text-amber-600 border border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20" : "text-green-600 border border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"}`,
              children: coupon.status === "active" ? "정지" : "활성화"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleDelete(coupon.id),
              className: "py-1.5 px-3 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity",
              children: "삭제"
            }
          )
        ] })
      ] })
    ] }, coupon.id)) })
  ] });
}
function AdsTab({ showToast }) {
  const [ads, setAds] = reactExports.useState(DEMO_ADS);
  const handleApprove = (id) => {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
    showToast("광고가 승인되었습니다");
  };
  const handleReject = (id) => {
    if (!confirm("이 광고를 반려하시겠습니까? 사유를 담당자에게 통보합니다.")) return;
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
    showToast("광고가 반려되었습니다");
  };
  const handleDelete = (id) => {
    if (!confirm("이 광고를 삭제하시겠습니까?")) return;
    setAds((prev) => prev.filter((a) => a.id !== id));
    showToast("광고가 삭제되었습니다");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "전체 광고", value: ads.length, icon: Eye, color: "indigo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "심사 대기", value: ads.filter((a) => a.status === "review").length, icon: Clock, color: "amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "승인 완료", value: ads.filter((a) => a.status === "approved").length, icon: CheckCircle, color: "emerald" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ads.map((ad) => {
      var _a, _b;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${ad.status === "review" ? "bg-blue-100 dark:bg-blue-900/30" : ad.status === "approved" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18, className: ad.status === "review" ? "text-blue-600" : ad.status === "approved" ? "text-green-600" : "text-red-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: ad.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                ad.owner_name,
                " · ",
                ad.type === "banner" ? "배너 광고" : "스폰서 리스팅"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${((_a = STATUS_MAP[ad.status]) == null ? void 0 : _a.cls) || ""}`, children: ((_b = STATUS_MAP[ad.status]) == null ? void 0 : _b.label) || ad.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "예산" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-gray-900 dark:text-white", children: [
              "₩",
              (ad.budget / 1e4).toFixed(0),
              "만"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "기간" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white text-xs", children: ad.duration })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "유형" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: ad.type === "banner" ? "배너" : "스폰서" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
          ad.status === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleApprove(ad.id), className: "px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14 }),
              " 승인"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleReject(ad.id), className: "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 14 }),
              " 반려"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleDelete(ad.id), className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
            " 삭제"
          ] })
        ] })
      ] }, ad.id);
    }) })
  ] });
}
function AnalyticsTab() {
  const stats = [
    { label: "전체 캠페인", value: "12", change: "+3", icon: Megaphone, color: "indigo" },
    { label: "활성 쿠폰", value: "8", change: "+2", icon: Gift, color: "emerald" },
    { label: "총 광고비", value: "₩430만", change: "+18%", icon: DollarSign, color: "amber" },
    { label: "총 도달", value: "58.2K", change: "+24%", icon: Users, color: "blue" }
  ];
  const topCampaigns = [
    { name: "봄 시즌 프로모션", owner: "강남 파티홀", roi: "+320%", side: "host" },
    { name: "신규 고객 쿠폰", owner: "김셀러", roi: "+180%", side: "seller" },
    { name: "배너 광고", owner: "스튜디오 A", roi: "+95%", side: "host" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg bg-${s.color}-100 dark:bg-${s.color}-900/30`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { size: 18, className: `text-${s.color}-600 dark:text-${s.color}-400` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-green-500 flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 12 }),
          " ",
          s.change
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: s.label })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "🏆 상위 캠페인 (ROI 기준)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: topCampaigns.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400", children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
            c.owner,
            " · ",
            c.side === "seller" ? "셀러" : "호스트"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-green-500", children: c.roi })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📊 캠페인 유형 분포" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
          { label: "인지도 향상", count: 5, percent: 42, color: "bg-blue-500" },
          { label: "전환 극대화", count: 4, percent: 33, color: "bg-emerald-500" },
          { label: "트래픽 유도", count: 3, percent: 25, color: "bg-amber-500" }
        ].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
              t.count,
              "개 (",
              t.percent,
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${t.color} h-2 rounded-full`, style: { width: `${t.percent}%` } }) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "👤 셀러 vs 호스트" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-teal-600 dark:text-teal-400", children: "7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "셀러 캠페인" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-violet-600 dark:text-violet-400", children: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "호스트 캠페인" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 dark:bg-gray-700 rounded-full h-3 flex overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-teal-500 h-3", style: { width: "58%" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-violet-500 h-3", style: { width: "42%" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-teal-600 dark:text-teal-400", children: "셀러 58%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-violet-600 dark:text-violet-400", children: "호스트 42%" })
        ] })
      ] })
    ] })
  ] });
}
function KpiCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${colorMap[color] || colorMap.indigo}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: label })
    ] })
  ] });
}
export {
  AdminMarketing as default
};
