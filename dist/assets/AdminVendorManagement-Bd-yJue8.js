import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, z as Truck, i as Send, W as Package, bn as DollarSign, aq as Clock, Y as Wallet, f as Search, av as Filter, a0 as ChevronDown, ag as User, az as Calendar } from "./vendor-icons-BFe5lkJJ.js";
import "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const PROPOSAL_STATUS = {
  pending: { label: "대기", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
  accepted: { label: "수락", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
  rejected: { label: "거절", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
  cancelled: { label: "취소", bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-600 dark:text-gray-400" }
};
const SHIPMENT_STATUS = {
  ordered: { label: "발주", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
  confirmed: { label: "확인", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400" },
  shipping: { label: "배송중", bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400" },
  delivered: { label: "배송완료", bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-600 dark:text-teal-400" },
  completed: { label: "완료", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
  cancelled: { label: "취소", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" }
};
const SETTLEMENT_STATUS = {
  pending: { label: "대기", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
  confirmed: { label: "확인", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400" },
  paid: { label: "지급", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
  disputed: { label: "이의", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" }
};
const AdminVendorManagement = () => {
  const { user } = useAuth();
  const [toast, setToast] = reactExports.useState(null);
  reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [activeTab, setActiveTab] = reactExports.useState("proposals");
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [proposals, setProposals] = reactExports.useState([]);
  const [shipments, setShipments] = reactExports.useState([]);
  const [settlements, setSettlements] = reactExports.useState([]);
  const [settlementStats, setSettlementStats] = reactExports.useState({});
  const fetchProposals = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/proposals/proposals.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setProposals(data.proposals || []);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const fetchShipments = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/shipments/shipments.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setShipments(data.shipments || []);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const fetchSettlements = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settlements/settlements.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSettlements(data.settlements || []);
        setSettlementStats(data.stats || {});
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  reactExports.useEffect(() => {
    setLoading(true);
    Promise.all([fetchProposals(), fetchShipments(), fetchSettlements()]).finally(() => setLoading(false));
  }, []);
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  const filteredProposals = reactExports.useMemo(() => {
    return proposals.filter((p) => {
      const matchSearch = !searchTerm || (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (p.vendor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (p.seller_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [proposals, searchTerm, statusFilter]);
  const filteredShipments = reactExports.useMemo(() => {
    return shipments.filter((s) => {
      const matchSearch = !searchTerm || (s.order_title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.vendor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.seller_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shipments, searchTerm, statusFilter]);
  const filteredSettlements = reactExports.useMemo(() => {
    return settlements.filter((st) => {
      const matchSearch = !searchTerm || (st.shipment_title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (st.vendor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (st.seller_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || st.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [settlements, searchTerm, statusFilter]);
  const statusOptions = reactExports.useMemo(() => {
    if (activeTab === "proposals") return Object.entries(PROPOSAL_STATUS);
    if (activeTab === "shipments") return Object.entries(SHIPMENT_STATUS);
    return Object.entries(SETTLEMENT_STATUS);
  }, [activeTab]);
  const tabStats = reactExports.useMemo(() => ({
    proposals: proposals.length,
    shipments: shipments.length,
    settlements: settlements.length
  }), [proposals, shipments, settlements]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "text-indigo-600 dark:text-indigo-400", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "벤더 거래 관리" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "유통 제안, 배송, 정산을 통합 관리합니다" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "총 제안", value: proposals.length, icon: Send, color: "violet" },
        { label: "총 배송", value: shipments.length, icon: Package, color: "blue" },
        { label: "총 정산", value: formatCurrency(settlementStats.total_amount), icon: DollarSign, color: "teal" },
        { label: "미정산", value: formatCurrency(settlementStats.pending_amount), icon: Clock, color: "amber" }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 18, className: `text-${item.color}-400` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900 dark:text-gray-100", children: item.value })
      ] }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5 overflow-x-auto pb-1", children: [
        { id: "proposals", label: "유통 제안", icon: Send, count: tabStats.proposals },
        { id: "shipments", label: "배송 관리", icon: Package, count: tabStats.shipments },
        { id: "settlements", label: "정산 관리", icon: Wallet, count: tabStats.settlements }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setActiveTab(tab.id);
            setStatusFilter("all");
            setSearchTerm("");
          },
          className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
            " ",
            tab.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`, children: tab.count })
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "벤더, 셀러, 제목 검색...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:border-indigo-400 outline-none font-medium text-sm dark:text-gray-100"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: "appearance-none pl-10 pr-10 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 focus:border-indigo-400 outline-none font-bold text-sm text-gray-600 dark:text-gray-300 min-w-[140px]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "전체 상태" }),
                statusOptions.map(([key, cfg]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: cfg.label }, key))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
        ] })
      ] }),
      activeTab === "proposals" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "유통 제안이 없습니다" })
      ] }) : filteredProposals.map((p) => {
        const cfg = PROPOSAL_STATUS[p.status] || PROPOSAL_STATUS.pending;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: p.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`, children: cfg.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500", children: p.proposal_type === "supply" ? "공급" : "유통" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
                " ",
                p.vendor_name || "벤더"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                " ",
                p.seller_name || "셀러"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                " ",
                new Date(p.created_at).toLocaleDateString("ko-KR")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right flex-shrink-0", children: p.proposed_price && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900 dark:text-gray-100", children: formatCurrency(p.proposed_price) }) })
        ] }) }, p.id);
      }) }),
      activeTab === "shipments" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredShipments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "배송 내역이 없습니다" })
      ] }) : filteredShipments.map((s) => {
        const cfg = SHIPMENT_STATUS[s.status] || SHIPMENT_STATUS.ordered;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: s.order_title || `배송 #${s.id}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`, children: cfg.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
                " ",
                s.vendor_name || "벤더"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                " ",
                s.seller_name || "셀러"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                " ",
                new Date(s.created_at).toLocaleDateString("ko-KR")
              ] }),
              s.carrier && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 12 }),
                " ",
                s.carrier,
                " ",
                s.tracking_number
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900 dark:text-gray-100", children: formatCurrency(s.total_amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
              s.item_name,
              " × ",
              s.quantity
            ] })
          ] })
        ] }) }, s.id);
      }) }),
      activeTab === "settlements" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredSettlements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "정산 내역이 없습니다" })
      ] }) : filteredSettlements.map((st) => {
        const cfg = SETTLEMENT_STATUS[st.status] || SETTLEMENT_STATUS.pending;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: st.shipment_title || `정산 #${st.id}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`, children: cfg.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
                " ",
                st.vendor_name || "벤더"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                " ",
                st.seller_name || "셀러"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                " ",
                new Date(st.created_at).toLocaleDateString("ko-KR")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900 dark:text-gray-100", children: formatCurrency(st.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "수수료 ",
                st.commission_rate,
                "%: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400", children: [
                  "-",
                  formatCurrency(st.commission_amount)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "정산액: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-500", children: formatCurrency(st.net_amount) })
              ] })
            ] })
          ] })
        ] }) }, st.id);
      }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  AdminVendorManagement as default
};
