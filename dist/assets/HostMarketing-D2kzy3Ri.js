import { a as useAuth, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, y as Megaphone, o as BarChart3, bL as Palette, G as Globe, bA as PieChart, aS as Award, bn as DollarSign, w as TrendingUp, as as Handshake, k as Sparkles, af as AlertCircle, d as Check, ad as Plus, N as Eye, at as Target, ba as Pause, bb as Play, T as Trash2, a as X, aV as RefreshCw, v as Users, b as ChevronRight } from "./vendor-icons-BFe5lkJJ.js";
import { N as NumberInput } from "./NumberInput-BjovFE9F.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const PROFILE_SECTIONS = {
  BASIC: { id: "basic", label: "기본 정보", weight: 20, fields: ["name", "location", "category", "description"] },
  VISUALS: { id: "visuals", label: "비주얼", weight: 25, fields: ["logo", "coverImage", "gallery", "virtualTour"] },
  DETAILS: { id: "details", label: "상세 정보", weight: 20, fields: ["capacity", "amenities", "policies", "hours"] },
  SOCIAL: { id: "social", label: "SNS & 연락처", weight: 15, fields: ["instagram", "website", "phone", "email"] },
  TRUST: { id: "trust", label: "신뢰 지표", weight: 20, fields: ["reviews", "certifications", "successStories", "responseRate"] }
};
function calculateProfileCompleteness(profile) {
  const sectionScores = {};
  let totalScore = 0;
  let totalWeight = 0;
  Object.values(PROFILE_SECTIONS).forEach((section) => {
    const filledFields = section.fields.filter((field) => {
      const value = profile[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== void 0 && value !== "";
    });
    const completion = section.fields.length > 0 ? filledFields.length / section.fields.length : 0;
    const score = Math.round(completion * section.weight);
    sectionScores[section.id] = {
      ...section,
      filledFields: filledFields.length,
      totalFields: section.fields.length,
      completion: Math.round(completion * 1e4) / 100,
      score,
      missingFields: section.fields.filter((f) => {
        const v = profile[f];
        if (Array.isArray(v)) return v.length === 0;
        return !v;
      })
    };
    totalScore += score;
    totalWeight += section.weight;
  });
  const overallPercent = totalWeight > 0 ? Math.round(totalScore / totalWeight * 1e4) / 100 : 0;
  return {
    overallScore: totalScore,
    overallPercent,
    sections: sectionScores,
    tier: overallPercent >= 90 ? "platinum" : overallPercent >= 70 ? "gold" : overallPercent >= 50 ? "silver" : "bronze",
    tierLabel: overallPercent >= 90 ? "🏆 Platinum" : overallPercent >= 70 ? "🥇 Gold" : overallPercent >= 50 ? "🥈 Silver" : "🥉 Bronze"
  };
}
const BRAND_MOODS = {
  MODERN: {
    id: "modern",
    label: "모던 & 미니멀",
    icon: "🔲",
    colors: { primary: "#1A1A2E", secondary: "#16213E", accent: "#0F3460", text: "#E94560" },
    fonts: { heading: "Pretendard", body: "Inter" },
    style: { borderRadius: "4px", shadows: "minimal", spacing: "spacious" }
  },
  WARM: {
    id: "warm",
    label: "따뜻한 & 자연적",
    icon: "🌿",
    colors: { primary: "#2C3639", secondary: "#3F4E4F", accent: "#A27B5C", text: "#DCD7C9" },
    fonts: { heading: "Noto Serif KR", body: "Noto Sans KR" },
    style: { borderRadius: "12px", shadows: "soft", spacing: "comfortable" }
  },
  VIBRANT: {
    id: "vibrant",
    label: "활기찬 & 에너제틱",
    icon: "🎨",
    colors: { primary: "#6C63FF", secondary: "#FF6384", accent: "#FFCE56", text: "#2D2D2D" },
    fonts: { heading: "Black Han Sans", body: "Noto Sans KR" },
    style: { borderRadius: "16px", shadows: "bold", spacing: "compact" }
  },
  LUXURY: {
    id: "luxury",
    label: "럭셔리 & 프리미엄",
    icon: "✨",
    colors: { primary: "#1B1B1B", secondary: "#2D2D2D", accent: "#C9A96E", text: "#F5F5F5" },
    fonts: { heading: "Playfair Display", body: "Montserrat" },
    style: { borderRadius: "0px", shadows: "elegant", spacing: "spacious" }
  },
  PLAYFUL: {
    id: "playful",
    label: "플레이풀 & 캐주얼",
    icon: "🎪",
    colors: { primary: "#FF6B6B", secondary: "#4ECDC4", accent: "#FFE66D", text: "#2C3E50" },
    fonts: { heading: "Jua", body: "Gothic A1" },
    style: { borderRadius: "20px", shadows: "fun", spacing: "comfortable" }
  }
};
function generateColorPalette(baseColors) {
  const { primary, secondary, accent, text } = baseColors;
  return {
    primary: { base: primary, light: lightenColor(primary, 30), dark: darkenColor(primary, 20) },
    secondary: { base: secondary, light: lightenColor(secondary, 30), dark: darkenColor(secondary, 20) },
    accent: { base: accent, light: lightenColor(accent, 30), dark: darkenColor(accent, 20) },
    text: { base: text, muted: lightenColor(text, 40) },
    background: { light: "#FFFFFF", dark: "#121212", card: "#F8F9FA" },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6"
    }
  };
}
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16 & 255) + Math.round(255 * percent / 100));
  const g = Math.min(255, (num >> 8 & 255) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 255) + Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16 & 255) - Math.round(255 * percent / 100));
  const g = Math.max(0, (num >> 8 & 255) - Math.round(255 * percent / 100));
  const b = Math.max(0, (num & 255) - Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
function calculateSimpleROI(revenue, cost) {
  if (cost === 0) return { roi: revenue > 0 ? Infinity : 0, roiPercent: revenue > 0 ? "∞" : "0%" };
  const roi = (revenue - cost) / cost;
  return {
    roi: Math.round(roi * 100) / 100,
    roiPercent: `${Math.round(roi * 1e4) / 100}%`,
    profit: revenue - cost,
    costEfficiency: revenue > cost ? "profitable" : "unprofitable"
  };
}
function calculateROAS(revenue, adSpend) {
  if (adSpend === 0) return { roas: 0, label: "광고비 없음" };
  const roas = revenue / adSpend;
  return {
    roas: Math.round(roas * 100) / 100,
    label: `${Math.round(roas * 100) / 100}x`,
    interpretation: roas >= 4 ? "우수" : roas >= 2 ? "양호" : roas >= 1 ? "손익분기점" : "적자",
    breakeven: roas >= 1
  };
}
const ANALYSIS_DIMENSIONS = {
  PRICING: { id: "pricing", label: "가격 경쟁력", icon: "💰", weight: 20 },
  QUALITY: { id: "quality", label: "공간 품질", icon: "✨", weight: 25 },
  LOCATION: { id: "location", label: "입지", icon: "📍", weight: 20 },
  SERVICE: { id: "service", label: "서비스 수준", icon: "🤝", weight: 15 },
  MARKETING: { id: "marketing", label: "마케팅 활동", icon: "📢", weight: 10 },
  REPUTATION: { id: "reputation", label: "평판", icon: "⭐", weight: 10 }
};
const TABS = [
  { id: "overview", icon: BarChart3, label: "마케팅 개요" },
  { id: "branding", icon: Palette, label: "브랜딩" },
  { id: "advertising", icon: Megaphone, label: "광고" },
  { id: "distribution", icon: Globe, label: "유통" },
  { id: "reporting", icon: PieChart, label: "리포팅" }
];
const COLORS = {
  primary: "#7C3AED",
  blue: "#3B82F6",
  emerald: "#059669",
  amber: "#F59E0B",
  rose: "#F43F5E"
};
function VendorMarketing() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const profileCompleteness = reactExports.useMemo(() => {
    const demoProfile = {
      basic: { name: (user == null ? void 0 : user.name) || "Demo Vendor", slogan: "최고의 공간 경험", category: "venue_rental", founded: 2020 },
      contact: { phone: "02-1234-5678", email: "info@demo.com" },
      story: { mission: "혁신적인 공간 매칭으로 새로운 경험을 만듭니다" },
      name: (user == null ? void 0 : user.name) || "Demo Vendor",
      location: "서울 강남구",
      category: "popup_store",
      description: "혁신적인 공간 매칭 서비스",
      logo: "/logo.png",
      coverImage: "/cover.jpg",
      gallery: ["img1.jpg", "img2.jpg"],
      phone: "02-1234-5678",
      email: "info@demo.com"
    };
    return calculateProfileCompleteness(demoProfile);
  }, [user]);
  const demoROI = reactExports.useMemo(() => calculateSimpleROI(125e5, 3e6), []);
  const demoROAS = reactExports.useMemo(() => calculateROAS(125e5, 3e6), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-800 dark:to-purple-800 px-6 py-8 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 28 }),
        "호스트 마케팅 센터"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-violet-100 text-sm", children: "브랜딩 · 광고 · 유통 · 리포팅을 한곳에서 관리하세요" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-violet-500 text-violet-600 dark:text-violet-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
          tab.label
        ]
      },
      tab.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(VendorOverviewTab, { profile: profileCompleteness, roi: demoROI, roas: demoROAS }),
      activeTab === "branding" && /* @__PURE__ */ jsxRuntimeExports.jsx(BrandingTab, { profile: profileCompleteness }),
      activeTab === "advertising" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdvertisingTab, { roi: demoROI, roas: demoROAS }),
      activeTab === "distribution" && /* @__PURE__ */ jsxRuntimeExports.jsx(DistributionTab, {}),
      activeTab === "reporting" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportingTab, { roi: demoROI, roas: demoROAS })
    ] })
  ] });
}
function VendorOverviewTab({ profile, roi, roas }) {
  const kpis = [
    { label: "브랜드 완성도", value: `${profile.overallPercent}%`, icon: Award, color: COLORS.primary, sub: profile.tierLabel },
    { label: "총 수익", value: "₩12.5M", icon: DollarSign, color: COLORS.emerald, sub: "+17.3%" },
    { label: "ROI", value: roi.roiPercent, icon: TrendingUp, color: COLORS.blue, sub: roi.costEfficiency },
    { label: "ROAS", value: roas.label, icon: PieChart, color: COLORS.amber, sub: roas.interpretation }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((kpi, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg w-fit mb-3", style: { backgroundColor: `${kpi.color}15` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(kpi.icon, { size: 20, style: { color: kpi.color } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: kpi.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: kpi.label }),
      kpi.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-violet-500 mt-1", children: kpi.sub })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(VQuickAction, { icon: Palette, title: "브랜드 프로필 완성", desc: `현재 ${profile.overallPercent}% — 나머지를 채우세요`, color: COLORS.primary }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VQuickAction, { icon: Megaphone, title: "광고 캠페인 시작", desc: "타겟 광고로 셀러에게 도달하세요", color: COLORS.rose }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VQuickAction, { icon: Handshake, title: "셀러 매칭", desc: "AI가 최적의 셀러를 추천해 드려요", color: COLORS.emerald })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18, className: "text-violet-500" }),
        " 브랜드 프로필 완성도"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(profile.sections || {}).map(([key, section]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 dark:text-gray-400", children: section.label || key }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: [
            section.completion || 0,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-violet-500 h-2 rounded-full transition-all", style: { width: `${section.completion || 0}%` } }) })
      ] }, key)) })
    ] })
  ] });
}
function BrandingTab({ profile }) {
  const moods = Object.values(BRAND_MOODS || {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "🎨 비주얼 아이덴티티 — 분위기 프리셋" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: moods.slice(0, 6).map((mood, i) => {
        const palette = generateColorPalette ? generateColorPalette(mood.colors) : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-left group", children: [
          palette && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-3", children: palette && Object.values(palette).slice(0, 5).map((c, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full", style: { backgroundColor: typeof c === "string" ? c : c.base || "#ccc" } }, j)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: mood.label || mood.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: mood.description || "" })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📖 브랜드 스토리 프레임워크" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        { name: "창립 스토리", desc: "브랜드 시작과 여정을 이야기하세요", icon: "🌱" },
        { name: "미션 선언", desc: "핵심 가치와 목표를 전달하세요", icon: "🎯" },
        { name: "사람들의 이야기", desc: "팀과 고객의 경험을 공유하세요", icon: "👥" },
        { name: "공간의 이야기", desc: "공간이 가진 특별한 가치를 전하세요", icon: "🏛️" }
      ].map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: f.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: f.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: f.desc })
        ] })
      ] }, i)) })
    ] })
  ] });
}
function AdvertisingTab({ roi, roas }) {
  const { user } = useAuth();
  const API_BASE = "/api";
  const [campaigns, setCampaigns] = reactExports.useState([
    { id: "demo_c1", name: "봄 시즌 프로모션", type: "awareness", status: "active", budget_total: 5e5, budget_spent: 18e4, impressions: 12400, clicks: 890, created_at: "2026-02-01" },
    { id: "demo_c2", name: "신규 공간 출시 캠페인", type: "conversion", status: "paused", budget_total: 3e5, budget_spent: 12e4, impressions: 8200, clicks: 340, created_at: "2026-01-15" }
  ]);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({ name: "", type: "awareness", budget_total: "", budget_daily: "", description: "" });
  const showToastMsg = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const CAMPAIGN_TYPES = [
    { value: "awareness", label: "인지도 향상", icon: Eye },
    { value: "traffic", label: "트래픽 유도", icon: TrendingUp },
    { value: "conversion", label: "전환 극대화", icon: Target }
  ];
  const handleCreate = async () => {
    if (!form.name || !form.budget_total) {
      showToastMsg("캠페인 이름과 예산을 입력하세요", "error");
      return;
    }
    setSaving(true);
    try {
      const newCampaign = {
        id: `cmp_${Date.now()}`,
        ...form,
        budget_total: Number(form.budget_total),
        budget_daily: Number(form.budget_daily) || Math.floor(Number(form.budget_total) / 30),
        budget_spent: 0,
        impressions: 0,
        clicks: 0,
        status: "draft",
        owner_id: user == null ? void 0 : user.id,
        side: "host",
        created_at: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      try {
        const res = await fetch(`${API_BASE}/../marketing/api/campaigns.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: form.name, type: form.type, side: "host", owner_id: user == null ? void 0 : user.id, description: form.description, budget: { total: newCampaign.budget_total, daily: newCampaign.budget_daily } })
        });
        const data = await res.json();
        if (data.success && data.id) newCampaign.id = data.id;
      } catch {
      }
      setCampaigns((prev) => [newCampaign, ...prev]);
      setShowModal(false);
      setForm({ name: "", type: "awareness", budget_total: "", budget_daily: "", description: "" });
      showToastMsg(`캠페인 "${newCampaign.name}"이 생성되었습니다!`);
    } finally {
      setSaving(false);
    }
  };
  const toggleStatus = (id) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c));
  };
  const deleteCampaign = (id) => {
    if (!confirm("이 캠페인을 삭제하시겠습니까?")) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToastMsg("캠페인이 삭제되었습니다");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-500" : "bg-violet-500"}`, children: [
      toast.type === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
      toast.msg
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-gray-900 dark:text-white", children: [
        "📢 광고 캠페인 ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
          "(",
          campaigns.length,
          "개)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowModal(true), className: "px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        " 새 캠페인 만들기"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: campaigns.map((c) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${c.status === "active" ? "bg-green-100 dark:bg-green-900/30" : c.status === "paused" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-gray-100 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 18, className: c.status === "active" ? "text-green-600" : c.status === "paused" ? "text-amber-600" : "text-gray-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 dark:text-white text-sm", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                ((_a = CAMPAIGN_TYPES.find((t) => t.value === c.type)) == null ? void 0 : _a.label) || c.type,
                " · ",
                c.created_at
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleStatus(c.id), className: `p-1.5 rounded-lg transition-colors ${c.status === "active" ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"}`, title: c.status === "active" ? "일시정지" : "활성화", children: c.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteCampaign(c.id), className: "p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity", title: "삭제", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "예산" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: [
              "₩",
              (c.budget_total / 1e4).toFixed(0),
              "만"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "사용" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-violet-600", children: [
              "₩",
              (c.budget_spent / 1e4).toFixed(0),
              "만"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "노출" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: c.impressions.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "클릭" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: c.clicks.toLocaleString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 dark:bg-gray-700 rounded-full h-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-violet-500 h-1.5 rounded-full transition-all", style: { width: `${Math.min(100, c.budget_spent / c.budget_total * 100)}%` } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1 text-right", children: [
            (c.budget_spent / c.budget_total * 100).toFixed(0),
            "% 사용"
          ] })
        ] })
      ] }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📈 광고 성과" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "ROI", value: roi.roiPercent, sub: roi.costEfficiency === "profitable" ? "수익" : "적자" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "ROAS", value: roas.label, sub: roas.interpretation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "이익", value: `₩${(roi.profit / 1e4).toFixed(0)}만`, sub: "광고 이익" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "손익분기", value: roas.breakeven ? "달성" : "미달", sub: "수익성" })
      ] })
    ] }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 20, className: "text-violet-500" }),
          " 새 캠페인"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "캠페인 이름 *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), placeholder: "예: 봄 시즌 프로모션", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-violet-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "캠페인 목표" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: CAMPAIGN_TYPES.map((ct) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setForm((f) => ({ ...f, type: ct.value })),
              className: `p-3 rounded-lg border-2 text-center transition-all ${form.type === ct.value ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" : "border-gray-200 dark:border-gray-600 hover:border-violet-300"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ct.icon, { size: 18, className: `mx-auto ${form.type === ct.value ? "text-violet-500" : "text-gray-400"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs mt-1 font-medium ${form.type === ct.value ? "text-violet-600 dark:text-violet-400" : "text-gray-500"}`, children: ct.label })
              ]
            },
            ct.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "총 예산 (₩) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: form.budget_total, onChange: (val) => setForm((f) => ({ ...f, budget_total: val })), placeholder: "500,000", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "일 예산 (₩)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: form.budget_daily, onChange: (val) => setForm((f) => ({ ...f, budget_daily: val })), placeholder: "자동 배분", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "설명" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })), rows: 2, placeholder: "캠페인 설명", className: "w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCreate, disabled: saving, className: "flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          saving ? "생성 중..." : "캠페인 생성"
        ] })
      ] })
    ] }) })
  ] });
}
function DistributionTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      { title: "셀러 매칭", desc: "AI 기반 최적 셀러 추천 (7가지 기준)", icon: Users, color: COLORS.emerald },
      { title: "지역 확장", desc: "8개국 시장 기회 평가 및 로드맵", icon: Globe, color: COLORS.blue },
      { title: "파트너십", desc: "6유형 파트너 관리 및 공동 프로모션", icon: Handshake, color: COLORS.primary }
    ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg w-fit mb-3", style: { backgroundColor: `${item.color}15` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 20, style: { color: item.color } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-gray-900 dark:text-white", children: item.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: item.desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-3 w-full py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-900/30 transition-colors", children: "관리하기" })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "🌏 진출 가능 시장" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        { flag: "🇰🇷", name: "한국", status: "active", color: "green" },
        { flag: "🇯🇵", name: "일본", status: "evaluating", color: "amber" },
        { flag: "🇸🇬", name: "싱가포르", status: "evaluating", color: "amber" },
        { flag: "🇻🇳", name: "베트남", status: "planned", color: "gray" },
        { flag: "🇹🇭", name: "태국", status: "planned", color: "gray" },
        { flag: "🇺🇸", name: "미국", status: "planned", color: "gray" },
        { flag: "🇰🇭", name: "캄보디아", status: "planned", color: "gray" },
        { flag: "🇬🇧", name: "영국", status: "planned", color: "gray" }
      ].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: m.flag }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: m.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full ${m.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : m.status === "evaluating" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: m.status === "active" ? "활성" : m.status === "evaluating" ? "검토 중" : "계획" })
        ] })
      ] }, i)) })
    ] })
  ] });
}
function ReportingTab({ roi, roas }) {
  const dimensions = Object.values(ANALYSIS_DIMENSIONS || {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📊 경쟁사 벤치마크 (6차원)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: dimensions.map((dim, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dim.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: dim.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-200 dark:bg-gray-600 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-violet-500 h-2 rounded-full", style: { width: `${50 + Math.random() * 40}%` } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
          "가중치: ",
          dim.weight,
          "%"
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "💰 ROI 상세" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "총 투자", value: "₩300만" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "총 수익", value: "₩1,250만" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "순이익", value: `₩${(roi.profit / 1e4).toFixed(0)}만` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "ROI", value: roi.roiPercent }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "ROAS", value: roas.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "판정", value: roi.costEfficiency === "profitable" ? "✅ 수익" : "❌ 적자" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "📋 리포트 생성" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
          { name: "대시보드 리포트", desc: "KPI 요약 및 퍼널 분석", icon: "📊" },
          { name: "ROI 리포트", desc: "캠페인별 투자 수익 분석", icon: "💰" },
          { name: "경쟁사 분석", desc: "SWOT 및 포지셔닝 맵", icon: "🏆" },
          { name: "CSV 내보내기", desc: "전체 데이터 다운로드", icon: "📥" }
        ].map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: r.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: r.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-gray-300 ml-auto" })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function VQuickAction({ icon: Icon, title, desc, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg group-hover:scale-110 transition-transform", style: { backgroundColor: `${color}15` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, style: { color } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-gray-300 ml-auto" })
  ] });
}
function MiniStat({ label, value, sub }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: label }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-violet-500 mt-0.5", children: sub })
  ] });
}
function StatRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: value })
  ] });
}
export {
  VendorMarketing as default
};
