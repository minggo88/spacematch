import { a as useAuth, b as useNavigate, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, p as ShoppingBag, i as Send, z as Truck, Y as Wallet, v as Users, w as TrendingUp, aq as Clock, W as Package, af as AlertCircle, ak as ArrowRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const VendorDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [stats, setStats] = reactExports.useState({ totalSellers: 0, pendingProposals: 0, activeDeals: 0, totalShipments: 0, totalSettlements: 0, pendingSettlementAmount: 0 });
  const [profileComplete, setProfileComplete] = reactExports.useState(0);
  const [recentProposals, setRecentProposals] = reactExports.useState([]);
  const [recentShipments, setRecentShipments] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user) return;
    let filled = 0;
    let total = 6;
    if (user.name) filled++;
    if (user.email) filled++;
    if (user.phone) filled++;
    if (user.business_no) filled++;
    if (user.description) filled++;
    if (user.profile_image) filled++;
    setProfileComplete(Math.round(filled / total * 100));
  }, [user]);
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/users/list.php?role=seller`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.success) setStats((prev) => {
        var _a;
        return { ...prev, totalSellers: ((_a = d.users) == null ? void 0 : _a.length) || 0 };
      });
    }).catch(() => {
    });
    fetch(`${API_BASE}/proposals/proposals.php`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.success && Array.isArray(d.proposals)) {
        const pending = d.proposals.filter((p) => p.status === "pending").length;
        const active = d.proposals.filter((p) => p.status === "accepted").length;
        setStats((prev) => ({ ...prev, pendingProposals: pending, activeDeals: active }));
        setRecentProposals(d.proposals.slice(0, 3));
      }
    }).catch(() => {
    });
    fetch(`${API_BASE}/shipments/shipments.php`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.success && Array.isArray(d.shipments)) {
        setStats((prev) => ({ ...prev, totalShipments: d.shipments.length }));
        setRecentShipments(d.shipments.slice(0, 3));
      }
    }).catch(() => {
    });
    fetch(`${API_BASE}/settlements/settlements.php`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.success) {
        setStats((prev) => {
          var _a, _b;
          return {
            ...prev,
            totalSettlements: ((_a = d.settlements) == null ? void 0 : _a.length) || 0,
            pendingSettlementAmount: Number(((_b = d.stats) == null ? void 0 : _b.pending_amount) || 0)
          };
        });
      }
    }).catch(() => {
    });
  }, []);
  if (!user) return null;
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  const quickActions = [
    {
      icon: ShoppingBag,
      title: t("vendorDashboard.exploreSellers", "셀러 탐색"),
      desc: t("vendorDashboard.exploreSellersDesc", "카테고리와 지역으로 셀러를 검색하세요"),
      color: "from-indigo-500 to-violet-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      action: () => navigate("/vendor/sellers")
    },
    {
      icon: Send,
      title: t("vendorDashboard.proposals", "유통 제안"),
      desc: t("vendorDashboard.proposalsDesc", "셀러에게 유통 제안을 보내세요"),
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      action: () => navigate("/vendor/proposals")
    },
    {
      icon: Truck,
      title: t("vendorDashboard.shipments", "배송 관리"),
      desc: t("vendorDashboard.shipmentsDesc", "발주 및 배송 상태를 관리하세요"),
      color: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      action: () => navigate("/vendor/shipments")
    },
    {
      icon: Wallet,
      title: t("vendorDashboard.settlements", "정산 관리"),
      desc: t("vendorDashboard.settlementsDesc", "거래 정산을 확인하고 관리하세요"),
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      action: () => navigate("/vendor/settlements")
    }
  ];
  const statCards = [
    {
      icon: Users,
      label: t("vendorDashboard.activeSellers", "활동 셀러"),
      value: stats.totalSellers,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30"
    },
    {
      icon: Send,
      label: t("vendorDashboard.pendingProposals", "대기 중 제안"),
      value: stats.pendingProposals,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30"
    },
    {
      icon: TrendingUp,
      label: t("vendorDashboard.activeDeals", "진행 중 거래"),
      value: stats.activeDeals,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30"
    },
    {
      icon: Truck,
      label: t("vendorDashboard.totalShipments", "총 배송"),
      value: stats.totalShipments,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      icon: Wallet,
      label: t("vendorDashboard.totalSettlements", "총 정산"),
      value: stats.totalSettlements,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/30"
    },
    {
      icon: Clock,
      label: t("vendorDashboard.pendingAmount", "미정산 금액"),
      value: formatCurrency(stats.pendingSettlementAmount),
      isText: true,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/30"
    }
  ];
  const PROPOSAL_STATUS = {
    pending: { label: "대기", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    accepted: { label: "수락", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    rejected: { label: "거절", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    cancelled: { label: "취소", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" }
  };
  const SHIPMENT_STATUS = {
    ordered: { label: "발주", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    confirmed: { label: "확인", cls: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    shipping: { label: "배송중", cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    delivered: { label: "배송완료", cls: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
    completed: { label: "완료", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    cancelled: { label: "취소", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg", children: user.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.profile_image, alt: user.name, className: "w-full h-full rounded-2xl object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "text-white", size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100", children: [
          t("vendorDashboard.welcome", "안녕하세요"),
          ", ",
          user.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: t("vendorDashboard.subtitle", "벤더 대시보드에 오신 것을 환영합니다") })
      ] })
    ] }) }),
    profileComplete < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "text-amber-600 dark:text-amber-400", size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-800 dark:text-amber-300", children: t("vendorDashboard.completeProfile", "프로필을 완성해 주세요") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-400 mt-0.5", children: [
          t("vendorDashboard.profileProgress", "프로필 완성도"),
          ": ",
          profileComplete,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-amber-200/50 dark:bg-amber-800/30 rounded-full h-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500",
            style: { width: `${profileComplete}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/vendor/profile"),
          className: "flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-colors",
          children: t("vendorDashboard.goComplete", "완성하기")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8", children: statCards.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { size: 16, className: card.color }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5", children: card.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-bold text-gray-900 dark:text-gray-100 ${card.isText ? "text-sm" : ""}`, children: card.isText ? card.value : card.value.toLocaleString() })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 dark:text-gray-100 mb-4", children: t("vendorDashboard.quickActions", "빠른 작업") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: quickActions.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: action.action,
          className: `${action.bg} rounded-2xl p-6 text-left border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: "text-white", size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 dark:text-gray-100", children: action.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children: action.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "text-gray-400 group-hover:translate-x-1 transition-transform" })
          ] })
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16, className: "text-violet-500" }),
            " 최근 유통 제안"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate("/vendor/proposals"), className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1", children: [
            "전체보기 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
          ] })
        ] }),
        recentProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-gray-400 text-sm", children: "아직 유통 제안이 없습니다" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: recentProposals.map((p) => {
          const cfg = PROPOSAL_STATUS[p.status] || PROPOSAL_STATUS.pending;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 truncate", children: p.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                p.seller_name || "셀러",
                " · ",
                new Date(p.created_at).toLocaleDateString("ko-KR")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${cfg.cls}`, children: cfg.label })
          ] }) }, p.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-blue-500" }),
            " 최근 배송"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate("/vendor/shipments"), className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1", children: [
            "전체보기 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
          ] })
        ] }),
        recentShipments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-gray-400 text-sm", children: "아직 배송 내역이 없습니다" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100 dark:divide-gray-700", children: recentShipments.map((s) => {
          const cfg = SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.ordered;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 truncate", children: s.order_title || `배송 #${s.id}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                s.seller_name || "셀러",
                " · ",
                Number(s.total_amount || 0).toLocaleString(),
                "원"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${cfg.cls}`, children: cfg.label })
          ] }) }, s.id);
        }) })
      ] })
    ] })
  ] });
};
export {
  VendorDashboard as default
};
