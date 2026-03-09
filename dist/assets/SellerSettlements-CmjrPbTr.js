import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, Y as Wallet, bn as DollarSign, aq as Clock, C as CheckCircle, af as AlertCircle, ag as User, az as Calendar, a as X, aR as Ban } from "./vendor-icons-BFe5lkJJ.js";
import "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const STATUS_CONFIG = {
  pending: { label: "대기", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  confirmed: { label: "확인", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800" },
  paid: { label: "지급", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  disputed: { label: "이의", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" }
};
const SellerSettlements = () => {
  var _a;
  const { user } = useAuth();
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [settlements, setSettlements] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedSettlement, setSelectedSettlement] = reactExports.useState(null);
  const [updating, setUpdating] = reactExports.useState(false);
  const [sellerNote, setSellerNote] = reactExports.useState("");
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
  reactExports.useEffect(() => {
    fetchSettlements();
  }, []);
  const filteredSettlements = reactExports.useMemo(() => {
    if (statusFilter === "all") return settlements;
    return settlements.filter((s) => s.status === statusFilter);
  }, [settlements, statusFilter]);
  const pendingCount = reactExports.useMemo(() => settlements.filter((s) => s.status === "pending").length, [settlements]);
  const handleAction = async (action) => {
    if (!selectedSettlement) return;
    if (action === "dispute" && !sellerNote.trim()) {
      showToast("이의 사유를 입력해 주세요.", "error");
      return;
    }
    setUpdating(true);
    try {
      const body = { settlement_id: selectedSettlement.id, action };
      if (sellerNote.trim()) body.note = sellerNote;
      const res = await fetch(`${API_BASE}/settlements/update_settlement.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSelectedSettlement(null);
        setSellerNote("");
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
  const formatCurrency = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "text-teal-600 dark:text-teal-400", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "정산 관리" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "받은 정산을 확인하고 관리합니다" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "총 거래", value: formatCurrency(stats.total_amount), icon: DollarSign, color: "teal" },
        { label: "정산 금액", value: formatCurrency(stats.total_net), icon: Wallet, color: "violet" },
        { label: "미확인", value: formatCurrency(stats.pending_amount), icon: Clock, color: "amber" },
        { label: "지급 완료", value: formatCurrency(stats.paid_amount), icon: CheckCircle, color: "emerald" }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 18, className: `text-${item.color}-400 dark:text-${item.color}-600` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900 dark:text-gray-100", children: item.value })
      ] }, item.label)) }),
      pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "text-amber-500 flex-shrink-0", size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-amber-800 dark:text-amber-300", children: [
          "확인 대기 중인 정산이 ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            pendingCount,
            "건"
          ] }),
          " 있습니다."
        ] })
      ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "벤더로부터 정산이 등록되면 여기에 표시됩니다" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredSettlements.map((st) => {
        const statusCfg = STATUS_CONFIG[st.status];
        const isPending = st.status === "pending";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => {
              setSelectedSettlement(st);
              setSellerNote("");
            },
            className: `bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${isPending ? "border-amber-200 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30" : "border-gray-100 dark:border-gray-700"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: st.shipment_title || `정산 #${st.id}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`, children: statusCfg.label }),
                  isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-bold animate-pulse", children: "확인 필요" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                    " ",
                    st.vendor_name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                    " ",
                    new Date(st.created_at).toLocaleDateString("ko-KR")
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-emerald-600 dark:text-emerald-400", children: formatCurrency(st.net_amount) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold", children: ((_a = selectedSettlement.vendor_name) == null ? void 0 : _a[0]) || "V" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-gray-100", children: selectedSettlement.vendor_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: selectedSettlement.vendor_company || "벤더" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
            { label: "거래 금액", value: formatCurrency(selectedSettlement.amount), highlight: false },
            { label: `수수료 (${selectedSettlement.commission_rate}%)`, value: `- ${formatCurrency(selectedSettlement.commission_amount)}`, highlight: false },
            { label: "받을 금액", value: formatCurrency(selectedSettlement.net_amount), highlight: true }
          ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between p-3 rounded-xl ${row.highlight ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-gray-50 dark:bg-gray-700"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${row.highlight ? "font-bold text-emerald-700 dark:text-emerald-300" : "text-gray-500 dark:text-gray-400"}`, children: row.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${row.highlight ? "font-extrabold text-emerald-700 dark:text-emerald-300" : "font-medium text-gray-800 dark:text-gray-200"}`, children: row.value })
          ] }, row.label)) }),
          selectedSettlement.vendor_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1", children: "벤더 메모" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: selectedSettlement.vendor_note })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
            { label: "등록일", date: selectedSettlement.created_at },
            { label: "확인일", date: selectedSettlement.confirmed_at },
            { label: "지급일", date: selectedSettlement.paid_at }
          ].filter((t) => t.date).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(t.date).toLocaleDateString("ko-KR") })
          ] }, t.label)) }),
          selectedSettlement.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "메모 (이의 제기 시 필수)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: sellerNote,
                  onChange: (e) => setSellerNote(e.target.value),
                  placeholder: "메모를 남기세요",
                  rows: 2,
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction("confirm"),
                disabled: updating,
                className: "w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:from-cyan-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
                  " ",
                  updating ? "처리 중..." : "정산 확인"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleAction("dispute"),
                disabled: updating,
                className: "w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 16 }),
                  " 이의 제기"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  SellerSettlements as default
};
