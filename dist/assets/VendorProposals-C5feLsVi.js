import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, i as Send, ad as Plus, F as FileText, aq as Clock, C as CheckCircle, X as XCircle, aR as Ban, p as ShoppingBag, W as Package, z as Truck, ag as User, az as Calendar, N as Eye, a as X, M as MessageCircle, a0 as ChevronDown } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const PROPOSAL_TYPES = {
  distribution: { label: "유통", icon: Truck, color: "teal" },
  consignment: { label: "위탁", icon: Package, color: "violet" },
  wholesale: { label: "도매", icon: ShoppingBag, color: "amber" }
};
const STATUS_CONFIG = {
  pending: { label: "대기", icon: Clock, color: "amber", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  accepted: { label: "수락", icon: CheckCircle, color: "emerald", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  rejected: { label: "거절", icon: XCircle, color: "rose", bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  cancelled: { label: "취소", icon: Ban, color: "gray", bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-500 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700" }
};
const VendorProposals = () => {
  var _a, _b;
  const { user } = useAuth();
  const { t } = useTranslation("host");
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((msg, type = "success") => setToast({ message: msg, type }), []);
  const [proposals, setProposals] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedProposal, setSelectedProposal] = reactExports.useState(null);
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [sellers, setSellers] = reactExports.useState([]);
  const [creating, setCreating] = reactExports.useState(false);
  const [cancelling, setCancelling] = reactExports.useState(false);
  const [newProposal, setNewProposal] = reactExports.useState({
    seller_id: "",
    title: "",
    message: "",
    proposal_type: "distribution",
    vendor_note: ""
  });
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sellerId = params.get("seller");
    params.get("name");
    if (sellerId) {
      setNewProposal((prev) => ({ ...prev, seller_id: sellerId }));
      setShowCreateModal(true);
    }
  }, []);
  const fetchProposals = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/proposals/proposals.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setProposals(data.proposals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchSellers = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/users/browse_sellers.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setSellers(data);
    } catch (e) {
      console.error(e);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchProposals();
    fetchSellers();
  }, []);
  const filteredProposals = reactExports.useMemo(() => {
    if (statusFilter === "all") return proposals;
    return proposals.filter((p) => p.status === statusFilter);
  }, [proposals, statusFilter]);
  const stats = reactExports.useMemo(() => ({
    total: proposals.length,
    pending: proposals.filter((p) => p.status === "pending").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    rejected: proposals.filter((p) => p.status === "rejected").length
  }), [proposals]);
  const handleCreate = async () => {
    if (!newProposal.seller_id || !newProposal.title) {
      showToast("셀러와 제목을 입력해 주세요.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/proposals/proposals.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProposal)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowCreateModal(false);
        setNewProposal({ seller_id: "", title: "", message: "", proposal_type: "distribution", vendor_note: "" });
        fetchProposals();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("제안 전송에 실패했습니다.", "error");
    } finally {
      setCreating(false);
    }
  };
  const handleCancel = async (proposalId) => {
    if (!confirm("이 제안을 취소하시겠습니까?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/proposals/cancel_proposal.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: proposalId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSelectedProposal(null);
        fetchProposals();
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      showToast("취소에 실패했습니다.", "error");
    } finally {
      setCancelling(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "text-teal-600 dark:text-teal-400", size: 22 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: "유통 제안 관리" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "셀러에게 보낸 유통 제안을 관리합니다" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowCreateModal(true),
            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " 새 제안"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
        { label: "전체", value: stats.total, color: "teal", icon: FileText },
        { label: "대기", value: stats.pending, color: "amber", icon: Clock },
        { label: "수락", value: stats.accepted, color: "emerald", icon: CheckCircle },
        { label: "거절", value: stats.rejected, color: "rose", icon: XCircle }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 font-medium", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-extrabold text-${item.color}-600 dark:text-${item.color}-400`, children: item.value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 24, className: `text-${item.color}-300 dark:text-${item.color}-700` })
      ] }) }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5 overflow-x-auto pb-1", children: ["all", "pending", "accepted", "rejected", "cancelled"].map((status) => {
        const config = status === "all" ? { label: "전체" } : STATUS_CONFIG[status];
        const count = status === "all" ? proposals.length : proposals.filter((p) => p.status === status).length;
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
      filteredProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: "아직 보낸 제안이 없습니다" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "셀러 탐색에서 원하는 셀러에게 유통 제안을 보내보세요" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowCreateModal(true),
            className: "mt-4 px-6 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl font-bold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors",
            children: "새 제안 보내기"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredProposals.map((proposal) => {
        const statusCfg = STATUS_CONFIG[proposal.status];
        const typeCfg = PROPOSAL_TYPES[proposal.proposal_type] || PROPOSAL_TYPES.distribution;
        const StatusIcon = statusCfg.icon;
        const TypeIcon = typeCfg.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => setSelectedProposal(proposal),
            className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 ${statusCfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.border}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 20, className: statusCfg.text }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 truncate", children: proposal.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`, children: statusCfg.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TypeIcon, { size: 10 }),
                        " ",
                        typeCfg.label
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12 }),
                        " ",
                        proposal.seller_name
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                        " ",
                        new Date(proposal.created_at).toLocaleDateString("ko-KR")
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16, className: "text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" })
              ] }),
              proposal.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-3 ml-15 pl-[60px] line-clamp-2", children: proposal.message })
            ]
          },
          proposal.id
        );
      }) }),
      selectedProposal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedProposal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: selectedProposal.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold", children: STATUS_CONFIG[selectedProposal.status].label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 bg-white/20 rounded-lg text-xs font-bold", children: ((_a = PROPOSAL_TYPES[selectedProposal.proposal_type]) == null ? void 0 : _a.label) || "유통" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedProposal(null), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold", children: ((_b = selectedProposal.seller_name) == null ? void 0 : _b[0]) || "S" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 dark:text-gray-100", children: selectedProposal.seller_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: selectedProposal.seller_category || "카테고리 없음" })
            ] })
          ] }),
          selectedProposal.message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-teal-500 dark:text-teal-400 uppercase mb-1", children: "제안 내용" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: selectedProposal.message })
          ] }),
          selectedProposal.seller_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 rounded-xl border ${selectedProposal.status === "accepted" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-bold uppercase mb-1 ${selectedProposal.status === "accepted" ? "text-emerald-500" : "text-rose-500"}`, children: "셀러 답변" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: selectedProposal.seller_note })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "보낸 날짜" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(selectedProposal.created_at).toLocaleDateString("ko-KR") })
            ] }),
            selectedProposal.responded_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "응답 날짜" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(selectedProposal.responded_at).toLocaleDateString("ko-KR") })
            ] })
          ] }),
          selectedProposal.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handleCancel(selectedProposal.id),
              disabled: cancelling,
              className: "w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 16 }),
                " ",
                cancelling ? "취소 중..." : "제안 취소"
              ]
            }
          ),
          selectedProposal.status === "accepted" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => window.location.href = `/vendor/chat?user=${selectedProposal.seller_id}`,
              className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 }),
                " 셀러와 채팅하기"
              ]
            }
          )
        ] })
      ] }) }),
      showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: "새 유통 제안" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 mt-1", children: "셀러에게 유통 제안을 보냅니다" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCreateModal(false), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "셀러 선택 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: newProposal.seller_id,
                  onChange: (e) => setNewProposal((prev) => ({ ...prev, seller_id: e.target.value })),
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "셀러를 선택하세요" }),
                    sellers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                      s.name,
                      " (",
                      s.category || "미분류",
                      ")"
                    ] }, s.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "제안 유형" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: Object.entries(PROPOSAL_TYPES).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setNewProposal((prev) => ({ ...prev, proposal_type: key })),
                  className: `flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-bold ${newProposal.proposal_type === key ? `border-${cfg.color}-500 bg-${cfg.color}-50 dark:bg-${cfg.color}-900/20 text-${cfg.color}-600 dark:text-${cfg.color}-400` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 }),
                    cfg.label
                  ]
                },
                key
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "제안 제목 *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: newProposal.title,
                onChange: (e) => setNewProposal((prev) => ({ ...prev, title: e.target.value })),
                placeholder: "예: 온라인 유통 파트너십 제안",
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: "제안 내용" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: newProposal.message,
                onChange: (e) => setNewProposal((prev) => ({ ...prev, message: e.target.value })),
                placeholder: "유통 조건, 수수료율, 기대 효과 등을 작성해 주세요",
                rows: 4,
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none font-medium text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCreate,
              disabled: creating || !newProposal.seller_id || !newProposal.title,
              className: "w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
                " ",
                creating ? "전송 중..." : "제안 보내기"
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
  VendorProposals as default
};
