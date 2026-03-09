import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, Y as Wallet, ad as Plus, bn as DollarSign, aD as Percent, aq as Clock, C as CheckCircle, ag as User, az as Calendar, a as X, x as CreditCard, a0 as ChevronDown, af as AlertCircle } from "./vendor-icons-BFe5lkJJ.js";
import "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const STATUS_CONFIG = {
  pending: { label: "대기", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  confirmed: { label: "확인", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800" },
  paid: { label: "지급", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  disputed: { label: "이의", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" }
};
const VendorSettlements = () => {
  var _a;
  const { user } = useAuth();
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [settlements, setSettlements] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedSettlement, setSelectedSettlement] = reactExports.useState(null);
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [completedShipments, setCompletedShipments] = reactExports.useState([]);
  const [creating, setCreating] = reactExports.useState(false);
  const [newSettlement, setNewSettlement] = reactExports.useState({ shipment_id: "", commission_rate: 10, vendor_note: "" });
  const [updating, setUpdating] = reactExports.useState(false);
  const fetchSettlements = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settlements/settlements.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSettlements(data.settlements || []);
        setStats(data.stats || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchCompletedShipments = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/shipments/shipments.php?status=completed`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const settledIds = settlements.map((s) => String(s.shipment_id));
        setCompletedShipments((data.shipments || []).filter((s) => !settledIds.includes(String(s.id))));
      }
    } catch (e) {
      console.error(e);
    }
  }, [settlements]);
  reactExports.useEffect(() => {
    fetchSettlements();
  }, []);
  reactExports.useEffect(() => {
    if (!loading) fetchCompletedShipments();
  }, [loading, settlements]);
  const filteredSettlements = reactExports.useMemo(() => {
    if (statusFilter === "all") return settlements;
    return settlements.filter((s) => s.status === statusFilter);
  }, [settlements, statusFilter]);
  const selectedShipmentData = reactExports.useMemo(() => {
    if (!newSettlement.shipment_id) return null;
    return completedShipments.find((s) => String(s.id) === String(newSettlement.shipment_id));
  }, [newSettlement.shipment_id, completedShipments]);
  const calcCommission = reactExports.useMemo(() => {
    if (!selectedShipmentData) return { amount: 0, commission: 0, net: 0 };
    const amount = Number(selectedShipmentData.total_amount) || 0;
    const commission = Math.round(amount * (newSettlement.commission_rate || 0) / 100);
    return { amount, commission, net: amount - commission };
  }, [selectedShipmentData, newSettlement.commission_rate]);
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  const handleCreate = async () => {
    if (!newSettlement.shipment_id) {
      showToast("배송을 선택해 주세요.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/settlements/settlements.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettlement)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowCreateModal(false);
        setNewSettlement({ shipment_id: "", commission_rate: 10, vendor_note: "" });
        fetchSettlements();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("정산 등록에 실패했습니다.", "error");
    } finally {
      setCreating(false);
    }
  };
  const handlePay = async (settlementId) => {
    if (!confirm("지급 완료로 변경하시겠습니까?")) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/settlements/update_settlement.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlement_id: settlementId, action: "pay" })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSelectedSettlement(null);
        fetchSettlements();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("처리에 실패했습니다.", "error");
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "text-teal-600 dark:text-teal-400", size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "정산 관리" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "거래 정산 및 수수료를 관리합니다" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowCreateModal(true),
            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " 정산 등록"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "총 매출", value: formatCurrency(stats.total_amount), icon: DollarSign, color: "teal" },
        { label: "수수료", value: formatCurrency(stats.total_commission), icon: Percent, color: "violet" },
        { label: "미정산", value: formatCurrency(stats.pending_amount), icon: Clock, color: "amber" },
        { label: "지급 완료", value: formatCurrency(stats.paid_amount), icon: CheckCircle, color: "emerald" }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 18, className: `text-${item.color}-400 dark:text-${item.color}-600` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900 dark:text-gray-100", children: item.value })
      ] }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5 overflow-x-auto pb-1", children: ["all", "pending", "confirmed", "paid", "disputed"].map((status) => {
        const config = status === "all" ? { label: "전체" } : STATUS_CONFIG[status];
        const count = status === "all" ? settlements.length : settlements.filter((s) => s.status === status).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setStatusFilter(status),
            className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === status ? "bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,
            children: [
              config.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full ${statusFilter === status ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`, children: count })
            ]
          },
          status
        );
      }) }),
      filteredSettlements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "정산 내역이 없습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "완료된 배송을 기반으로 정산을 등록하세요" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredSettlements.map((st) => {
        const statusCfg = STATUS_CONFIG[st.status];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setSelectedSettlement(st),
            className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: st.shipment_title || `정산 #${st.id}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`, children: statusCfg.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                    " ",
                    st.seller_name
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                  "수수료 ",
                  st.commission_rate,
                  "%"
                ] })
              ] })
            ] })
          },
          st.id
        );
      }) }),
      selectedSettlement && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedSettlement(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: selectedSettlement.shipment_title || `정산 #${selectedSettlement.id}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold", children: STATUS_CONFIG[selectedSettlement.status].label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedSettlement(null), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold", children: ((_a = selectedSettlement.seller_name) == null ? void 0 : _a[0]) || "S" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-gray-100", children: selectedSettlement.seller_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: selectedSettlement.seller_category || "셀러" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
            { label: "거래 금액", value: formatCurrency(selectedSettlement.amount), highlight: false },
            { label: `수수료 (${selectedSettlement.commission_rate}%)`, value: `- ${formatCurrency(selectedSettlement.commission_amount)}`, highlight: false },
            { label: "정산 금액", value: formatCurrency(selectedSettlement.net_amount), highlight: true }
          ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between p-3 rounded-xl ${row.highlight ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800" : "bg-gray-50 dark:bg-gray-700"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${row.highlight ? "font-bold text-teal-700 dark:text-teal-300" : "text-gray-500 dark:text-gray-400"}`, children: row.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${row.highlight ? "font-extrabold text-teal-700 dark:text-teal-300" : "font-medium text-gray-800 dark:text-gray-200"}`, children: row.value })
          ] }, row.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
            { label: "등록일", date: selectedSettlement.created_at },
            { label: "확인일", date: selectedSettlement.confirmed_at },
            { label: "지급일", date: selectedSettlement.paid_at }
          ].filter((t) => t.date).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(t.date).toLocaleDateString("ko-KR") })
          ] }, t.label)) }),
          selectedSettlement.status === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePay(selectedSettlement.id),
              disabled: updating,
              className: "w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-sm hover:from-emerald-400 hover:to-green-400 shadow-lg transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 16 }),
                " ",
                updating ? "처리 중..." : "지급 완료"
              ]
            }
          )
        ] })
      ] }) }),
      showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: "정산 등록" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 mt-1", children: "완료된 배송을 기반으로 정산합니다" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCreateModal(false), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "배송 선택 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: newSettlement.shipment_id,
                  onChange: (e) => setNewSettlement((prev) => ({ ...prev, shipment_id: e.target.value })),
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "완료된 배송을 선택하세요" }),
                    completedShipments.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                      s.order_title,
                      " — ",
                      s.seller_name,
                      " (",
                      formatCurrency(s.total_amount),
                      ")"
                    ] }, s.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] }),
            completedShipments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-500 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 12 }),
              " 정산 가능한 완료 배송이 없습니다."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "수수료율 (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                step: "0.5",
                value: newSettlement.commission_rate,
                onChange: (e) => setNewSettlement((prev) => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 })),
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100"
              }
            )
          ] }),
          selectedShipmentData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "거래 금액" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: formatCurrency(calcCommission.amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-500", children: [
                "수수료 (",
                newSettlement.commission_rate,
                "%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-red-500", children: [
                "- ",
                formatCurrency(calcCommission.commission)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-teal-600 dark:text-teal-400", children: "정산 금액" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-teal-600 dark:text-teal-400", children: formatCurrency(calcCommission.net) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "메모" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: newSettlement.vendor_note,
                onChange: (e) => setNewSettlement((prev) => ({ ...prev, vendor_note: e.target.value })),
                placeholder: "메모를 입력하세요",
                rows: 2,
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCreate,
              disabled: creating || !newSettlement.shipment_id,
              className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 16 }),
                " ",
                creating ? "등록 중..." : "정산 등록"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  VendorSettlements as default
};
