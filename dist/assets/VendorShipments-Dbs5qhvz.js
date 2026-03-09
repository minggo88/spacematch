import { a as useAuth, b as useNavigate, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, z as Truck, ad as Plus, F as FileText, t as ClipboardList, C as CheckCircle, aR as Ban, W as Package, ag as User, az as Calendar, bn as DollarSign, ap as MapPin, N as Eye, a as X, a0 as ChevronDown, af as AlertCircle, br as Minus } from "./vendor-icons-BFe5lkJJ.js";
import { N as NumberInput } from "./NumberInput-BjovFE9F.js";
import "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const STATUS_CONFIG = {
  ordered: { label: "발주", icon: ClipboardList, bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  confirmed: { label: "확인", icon: CheckCircle, bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800" },
  shipping: { label: "배송중", icon: Truck, bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
  delivered: { label: "입고", icon: Package, bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  completed: { label: "완료", icon: CheckCircle, bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  cancelled: { label: "취소", icon: Ban, bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-500 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700" }
};
const COURIER_LIST = ["CJ대한통운", "한진택배", "롯데택배", "로젠택배", "우체국택배", "GS Postbox", "경동택배", "대신택배", "일양로지스", "기타"];
const VendorShipments = () => {
  var _a, _b;
  const { user } = useAuth();
  useNavigate();
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [shipments, setShipments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedShipment, setSelectedShipment] = reactExports.useState(null);
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [proposals, setProposals] = reactExports.useState([]);
  const [creating, setCreating] = reactExports.useState(false);
  const [newOrder, setNewOrder] = reactExports.useState({
    proposal_id: "",
    order_title: "",
    vendor_memo: "",
    items: [{ name: "", quantity: 1, unit_price: 0 }]
  });
  const [showShipModal, setShowShipModal] = reactExports.useState(false);
  const [shipTarget, setShipTarget] = reactExports.useState(null);
  const [shipForm, setShipForm] = reactExports.useState({ courier: "", tracking_number: "" });
  const [updating, setUpdating] = reactExports.useState(false);
  const fetchShipments = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/shipments/shipments.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setShipments(data.shipments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchAcceptedProposals = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/proposals/proposals.php?status=accepted`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setProposals(data.proposals || []);
    } catch (e) {
      console.error(e);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchShipments();
    fetchAcceptedProposals();
  }, []);
  const filteredShipments = reactExports.useMemo(() => {
    if (statusFilter === "all") return shipments;
    return shipments.filter((s) => s.status === statusFilter);
  }, [shipments, statusFilter]);
  const stats = reactExports.useMemo(() => ({
    total: shipments.length,
    ordered: shipments.filter((s) => s.status === "ordered").length,
    shipping: shipments.filter((s) => s.status === "shipping").length,
    completed: shipments.filter((s) => s.status === "completed").length
  }), [shipments]);
  const handleCreate = async () => {
    if (!newOrder.proposal_id || !newOrder.order_title || newOrder.items.length === 0) {
      showToast("제안, 제목, 품목을 모두 입력해 주세요.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/shipments/shipments.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowCreateModal(false);
        setNewOrder({ proposal_id: "", order_title: "", vendor_memo: "", items: [{ name: "", quantity: 1, unit_price: 0 }] });
        fetchShipments();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("발주 등록에 실패했습니다.", "error");
    } finally {
      setCreating(false);
    }
  };
  const handleShip = async () => {
    if (!shipForm.courier || !shipForm.tracking_number) {
      showToast("택배사와 송장번호를 입력해 주세요.", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: shipTarget.id, action: "ship", ...shipForm })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowShipModal(false);
        setShipTarget(null);
        setSelectedShipment(null);
        fetchShipments();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("배송 등록에 실패했습니다.", "error");
    } finally {
      setUpdating(false);
    }
  };
  const handleAction = async (shipmentId, action) => {
    if (action === "cancel" && !confirm("이 발주를 취소하시겠습니까?")) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: shipmentId, action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSelectedShipment(null);
        fetchShipments();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("처리에 실패했습니다.", "error");
    } finally {
      setUpdating(false);
    }
  };
  const addItem = () => setNewOrder((prev) => ({ ...prev, items: [...prev.items, { name: "", quantity: 1, unit_price: 0 }] }));
  const removeItem = (idx) => setNewOrder((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, field, value) => setNewOrder((prev) => {
    const items = [...prev.items];
    items[idx] = { ...items[idx], [field]: value };
    return { ...prev, items };
  });
  const totalAmount = reactExports.useMemo(() => newOrder.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0), [newOrder.items]);
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "text-teal-600 dark:text-teal-400", size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "배송 관리" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "발주 생성 및 배송 상태를 관리합니다" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowCreateModal(true),
            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " 새 발주"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "전체", value: stats.total, color: "teal", icon: FileText },
        { label: "발주", value: stats.ordered, color: "blue", icon: ClipboardList },
        { label: "배송중", value: stats.shipping, color: "violet", icon: Truck },
        { label: "완료", value: stats.completed, color: "emerald", icon: CheckCircle }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`, children: item.value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 24, className: `text-${item.color}-300 dark:text-${item.color}-700` })
      ] }) }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5 overflow-x-auto pb-1", children: ["all", "ordered", "confirmed", "shipping", "delivered", "completed", "cancelled"].map((status) => {
        const config = status === "all" ? { label: "전체" } : STATUS_CONFIG[status];
        const count = status === "all" ? shipments.length : shipments.filter((s) => s.status === status).length;
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
      filteredShipments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "아직 발주 내역이 없습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "수락된 유통 제안을 기반으로 발주를 생성하세요" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredShipments.map((ship) => {
        const statusCfg = STATUS_CONFIG[ship.status];
        const StatusIcon = statusCfg.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setSelectedShipment(ship),
            className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 ${statusCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.border}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 20, className: statusCfg.text }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: ship.order_title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`, children: statusCfg.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                      " ",
                      ship.seller_name
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                      " ",
                      new Date(ship.ordered_at).toLocaleDateString("ko-KR")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 12 }),
                      " ",
                      formatCurrency(ship.total_amount)
                    ] })
                  ] }),
                  ship.tracking_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-violet-500 dark:text-violet-400 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                    " ",
                    ship.courier,
                    " ",
                    ship.tracking_number
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16, className: "text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" })
            ] })
          },
          ship.id
        );
      }) }),
      selectedShipment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedShipment(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: selectedShipment.order_title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold", children: STATUS_CONFIG[selectedShipment.status].label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold", children: formatCurrency(selectedShipment.total_amount) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedShipment(null), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold", children: ((_a = selectedShipment.seller_name) == null ? void 0 : _a[0]) || "S" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-gray-100", children: selectedShipment.seller_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: selectedShipment.seller_category || "" })
            ] })
          ] }),
          ((_b = selectedShipment.items) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "품목 내역" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              selectedShipment.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                  item.quantity,
                  "개 × ",
                  formatCurrency(item.unit_price)
                ] })
              ] }, i)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-teal-700 dark:text-teal-300", children: "합계" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-extrabold text-teal-700 dark:text-teal-300", children: formatCurrency(selectedShipment.total_amount) })
              ] })
            ] })
          ] }),
          selectedShipment.tracking_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-violet-500 uppercase mb-1", children: "배송 정보" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
              selectedShipment.courier,
              " — ",
              selectedShipment.tracking_number
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
            { label: "발주일", date: selectedShipment.ordered_at },
            { label: "확인일", date: selectedShipment.confirmed_at },
            { label: "배송일", date: selectedShipment.shipped_at },
            { label: "완료일", date: selectedShipment.completed_at }
          ].filter((t) => t.date).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(t.date).toLocaleDateString("ko-KR") })
          ] }, t.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700", children: [
            selectedShipment.status === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setShipTarget(selectedShipment);
                  setShowShipModal(true);
                },
                className: "w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 shadow-lg transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }),
                  " 배송 등록"
                ]
              }
            ),
            selectedShipment.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction(selectedShipment.id, "complete"),
                disabled: updating,
                className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
                  " 거래 완료"
                ]
              }
            ),
            ["ordered", "confirmed", "shipping"].includes(selectedShipment.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction(selectedShipment.id, "cancel"),
                disabled: updating,
                className: "w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 16 }),
                  " 취소"
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: "새 발주 생성" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 mt-1", children: "수락된 유통 제안을 기반으로 발주합니다" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCreateModal(false), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "유통 제안 선택 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: newOrder.proposal_id,
                  onChange: (e) => setNewOrder((prev) => ({ ...prev, proposal_id: e.target.value })),
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "수락된 제안을 선택하세요" }),
                    proposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                      p.title,
                      " — ",
                      p.seller_name
                    ] }, p.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] }),
            proposals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-500 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 12 }),
              " 수락된 유통 제안이 없습니다. 먼저 제안을 보내세요."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "발주 제목 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: newOrder.order_title,
                onChange: (e) => setNewOrder((prev) => ({ ...prev, order_title: e.target.value })),
                placeholder: "예: 2월 정기 발주",
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase", children: "품목 *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addItem, className: "text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                " 추가"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: newOrder.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "품목명",
                  value: item.name,
                  onChange: (e) => updateItem(idx, "name", e.target.value),
                  className: "flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 dark:placeholder-gray-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  placeholder: "수량",
                  value: item.quantity,
                  onChange: (val) => updateItem(idx, "quantity", parseInt(val) || 0),
                  className: "w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 text-center"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  placeholder: "단가",
                  value: item.unit_price,
                  onChange: (val) => updateItem(idx, "unit_price", parseInt(val) || 0),
                  className: "w-28 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none text-sm dark:text-gray-100 text-right"
                }
              ),
              newOrder.items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeItem(idx), className: "p-2 text-gray-400 hover:text-red-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16 }) })
            ] }, idx)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-right text-sm font-bold text-teal-600 dark:text-teal-400", children: [
              "합계: ",
              formatCurrency(totalAmount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "메모" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: newOrder.vendor_memo,
                onChange: (e) => setNewOrder((prev) => ({ ...prev, vendor_memo: e.target.value })),
                placeholder: "특이사항이 있으면 입력하세요",
                rows: 2,
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCreate,
              disabled: creating || !newOrder.proposal_id || !newOrder.order_title,
              className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 16 }),
                " ",
                creating ? "등록 중..." : "발주 등록"
              ]
            }
          )
        ] })
      ] }) }),
      showShipModal && shipTarget && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4", onClick: () => setShowShipModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-violet-600 to-purple-600 p-6 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: "배송 등록" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 mt-1", children: shipTarget.order_title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "택배사 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: shipForm.courier,
                  onChange: (e) => setShipForm((prev) => ({ ...prev, courier: e.target.value })),
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-violet-500 outline-none appearance-none font-medium text-sm dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "택배사 선택" }),
                    COURIER_LIST.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "송장번호 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: shipForm.tracking_number,
                onChange: (e) => setShipForm((prev) => ({ ...prev, tracking_number: e.target.value })),
                placeholder: "송장번호를 입력하세요",
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-violet-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleShip,
              disabled: updating || !shipForm.courier || !shipForm.tracking_number,
              className: "w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }),
                " ",
                updating ? "등록 중..." : "배송 등록"
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
  VendorShipments as default
};
