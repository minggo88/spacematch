import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, z as Truck, F as FileText, af as AlertCircle, C as CheckCircle, aR as Ban, W as Package, t as ClipboardList, ag as User, az as Calendar, bn as DollarSign, ap as MapPin, N as Eye, a as X } from "./vendor-icons-BFe5lkJJ.js";
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
const SellerShipments = () => {
  var _a, _b;
  const { user } = useAuth();
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [shipments, setShipments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedShipment, setSelectedShipment] = reactExports.useState(null);
  const [updating, setUpdating] = reactExports.useState(false);
  const [sellerMemo, setSellerMemo] = reactExports.useState("");
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
  reactExports.useEffect(() => {
    fetchShipments();
  }, []);
  const filteredShipments = reactExports.useMemo(() => {
    if (statusFilter === "all") return shipments;
    return shipments.filter((s) => s.status === statusFilter);
  }, [shipments, statusFilter]);
  const stats = reactExports.useMemo(() => ({
    total: shipments.length,
    pending: shipments.filter((s) => s.status === "ordered").length,
    shipping: shipments.filter((s) => s.status === "shipping").length,
    completed: shipments.filter((s) => s.status === "completed").length
  }), [shipments]);
  const handleAction = async (action) => {
    if (!selectedShipment) return;
    setUpdating(true);
    try {
      const body = { shipment_id: selectedShipment.id, action };
      if (sellerMemo) body.memo = sellerMemo;
      const res = await fetch(`${API_BASE}/shipments/update_shipment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSelectedShipment(null);
        setSellerMemo("");
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
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "text-teal-600 dark:text-teal-400", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "배송 관리" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "입고 확인 및 배송 현황을 관리합니다" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "전체", value: stats.total, color: "teal", icon: FileText },
        { label: "대기중", value: stats.pending, color: "amber", icon: AlertCircle },
        { label: "배송중", value: stats.shipping, color: "violet", icon: Truck },
        { label: "완료", value: stats.completed, color: "emerald", icon: CheckCircle }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`, children: item.value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 24, className: `text-${item.color}-300 dark:text-${item.color}-700` })
      ] }) }, item.label)) }),
      stats.pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "text-amber-500 flex-shrink-0", size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-amber-800 dark:text-amber-300", children: [
          "확인 대기 중인 발주가 ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            stats.pending,
            "건"
          ] }),
          " 있습니다."
        ] })
      ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "배송 내역이 없습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "벤더로부터 발주를 받으면 여기에 표시됩니다" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredShipments.map((ship) => {
        const statusCfg = STATUS_CONFIG[ship.status];
        const StatusIcon = statusCfg.icon;
        const isPending = ship.status === "ordered";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => {
              setSelectedShipment(ship);
              setSellerMemo("");
            },
            className: `bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${isPending ? "border-amber-200 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30" : "border-gray-100 dark:border-gray-700"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 ${statusCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.border}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 20, className: statusCfg.text }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: ship.order_title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`, children: statusCfg.label }),
                    isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold animate-pulse", children: "확인 필요" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                      " ",
                      ship.vendor_name
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold", children: ((_a = selectedShipment.vendor_name) == null ? void 0 : _a[0]) || "V" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-gray-100", children: selectedShipment.vendor_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: selectedShipment.vendor_company || "벤더" })
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
          selectedShipment.vendor_memo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1", children: "벤더 메모" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: selectedShipment.vendor_memo })
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
          ["ordered", "shipping"].includes(selectedShipment.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "메모 (선택)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: sellerMemo,
                  onChange: (e) => setSellerMemo(e.target.value),
                  placeholder: "메모를 남기세요",
                  rows: 2,
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                }
              )
            ] }),
            selectedShipment.status === "ordered" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction("confirm"),
                disabled: updating,
                className: "w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-cyan-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
                  " ",
                  updating ? "처리 중..." : "발주 확인"
                ]
              }
            ),
            selectedShipment.status === "shipping" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction("deliver"),
                disabled: updating,
                className: "w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-sm hover:from-emerald-400 hover:to-green-400 shadow-lg transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 }),
                  " ",
                  updating ? "처리 중..." : "입고 확인"
                ]
              }
            )
          ] }),
          selectedShipment.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handleAction("complete"),
              disabled: updating,
              className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
                " ",
                updating ? "처리 중..." : "거래 완료"
              ]
            }
          ) })
        ] })
      ] }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  SellerShipments as default
};
