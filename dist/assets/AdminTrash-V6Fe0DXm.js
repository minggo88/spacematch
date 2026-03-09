import { j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, T as Trash2, aV as RefreshCw, f as Search, a0 as ChevronDown, aJ as RotateCcw, X as XCircle, W as Package } from "./vendor-icons-BFe5lkJJ.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const TABLE_LABEL_KEYS = {
  ads: "ads",
  venues: "venues",
  community_posts: "communityPosts",
  seller_photos: "sellerPhotos",
  applications: "applications",
  users: "users",
  popups: "popups"
};
const AdminTrash = () => {
  const { t } = useTranslation("admin");
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [tables, setTables] = reactExports.useState([]);
  const [filterTable, setFilterTable] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const [total, setTotal] = reactExports.useState(0);
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const perPage = 20;
  const showToast = reactExports.useCallback((message, type = "success") => setToast({ message, type }), []);
  const fetchTrash = reactExports.useCallback(async () => {
    try {
      const params = new URLSearchParams({ page });
      if (filterTable) params.append("table_name", filterTable);
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(`/api/trash/list_trash.php?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTables(data.tables || []);
      }
    } catch {
      showToast(t("trashPage.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [filterTable, searchTerm, page, showToast]);
  reactExports.useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);
  const handleRestore = async (id) => {
    try {
      const res = await fetch("/api/trash/restore.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) fetchTrash();
    } catch {
      showToast(t("trashPage.restoreFailed"), "error");
    }
  };
  const handlePermanentDelete = async (id) => {
    setConfirmModal({
      title: t("trashPage.confirmDelete"),
      message: t("trashPage.confirmDeleteMsg", { title: "" }),
      onConfirm: async () => {
        try {
          const res = await fetch("/api/trash/permanent_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          showToast(data.message, data.success ? "success" : "error");
          if (data.success) fetchTrash();
        } catch {
          showToast(t("trashPage.deleteFailed"), "error");
        }
        setConfirmModal(null);
      }
    });
  };
  const handleBatchRestore = async () => {
    for (const id of selectedIds) {
      await handleRestore(id);
    }
    setSelectedIds(/* @__PURE__ */ new Set());
  };
  const handleBatchPermanentDelete = () => {
    setConfirmModal({
      title: t("trashPage.batchDelete"),
      message: t("trashPage.batchDeleteMsg", { count: selectedIds.size }),
      onConfirm: async () => {
        try {
          const res = await fetch("/api/trash/permanent_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ids: [...selectedIds] })
          });
          const data = await res.json();
          showToast(data.message, data.success ? "success" : "error");
          if (data.success) {
            setSelectedIds(/* @__PURE__ */ new Set());
            fetchTrash();
          }
        } catch {
          showToast(t("trashPage.deleteFailed"), "error");
        }
        setConfirmModal(null);
      }
    });
  };
  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const toggleAll = () => {
    if (items.every((i) => selectedIds.has(i.id))) setSelectedIds(/* @__PURE__ */ new Set());
    else setSelectedIds(new Set(items.map((i) => i.id)));
  };
  const totalPages = Math.ceil(total / perPage);
  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const now = /* @__PURE__ */ new Date();
    const diff = now - date;
    if (diff < 6e4) return t("trashPage.justNow");
    if (diff < 36e5) return t("trashPage.minutesAgo", { count: Math.floor(diff / 6e4) });
    if (diff < 864e5) return t("trashPage.hoursAgo", { count: Math.floor(diff / 36e5) });
    if (diff < 6048e5) return t("trashPage.daysAgo", { count: Math.floor(diff / 864e5) });
    return date.toLocaleDateString();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "text-white", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white", children: t("trashPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t("trashPage.subtitle") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: fetchTrash, className: "flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
        " ",
        t("trashPage.refresh")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchTerm, onChange: (e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }, placeholder: t("trashPage.searchPlaceholder"), className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-medium text-sm dark:text-white" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterTable, onChange: (e) => {
            setFilterTable(e.target.value);
            setPage(1);
          }, className: "w-full md:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("trashPage.allTables") }),
            tables.map((tbl) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tbl, children: t(`trashPage.table_${TABLE_LABEL_KEYS[tbl]}`, tbl) }, tbl))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("trashPage.totalItems", { count: total }) })
    ] }),
    selectedIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-3 flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-indigo-700 dark:text-indigo-300", children: t("trashPage.selectedCount", { count: selectedIds.size }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-px bg-indigo-200 dark:bg-indigo-500/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBatchRestore, className: "px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 13 }),
        " ",
        t("trashPage.batchRestore")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBatchPermanentDelete, className: "px-3 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 13 }),
        " ",
        t("trashPage.batchDeleteBtn")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedIds(/* @__PURE__ */ new Set()), className: "ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium", children: t("trashPage.deselectAll") })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mx-auto text-gray-300 dark:text-gray-600 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: t("trashPage.noItems") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 dark:text-gray-600 mt-1", children: t("trashPage.noItemsDesc") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: allSelected, onChange: toggleAll, className: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("trashPage.title_col") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("trashPage.sourceTable") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("trashPage.deletedBy") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3", children: t("trashPage.deletedAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 w-28", children: t("trashPage.action") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50 dark:divide-gray-700/30", children: items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20 ${isSelected ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(item.id), className: "rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-gray-400 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 dark:text-white truncate max-w-[250px]", children: item.item_label || `#${item.record_id}` })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-[11px] font-bold", children: t(`trashPage.table_${TABLE_LABEL_KEYS[item.table_name]}`, item.table_name) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-gray-500 dark:text-gray-400", children: item.deleted_by_name || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-gray-400", title: item.deleted_at, children: formatDate(item.deleted_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRestore(item.id), className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors", title: t("trashPage.restore"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 13 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePermanentDelete(item.id), className: "p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors", title: t("trashPage.permanentDelete"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 13 }) })
            ] }) })
          ] }, item.id);
        }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700/30 flex items-center justify-center gap-1", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage(p), className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${page === p ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"}`, children: p }, p)) })
    ] }),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: { ...confirmModal, type: "danger", confirmLabel: confirmModal.title }, onClose: () => setConfirmModal(null) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  AdminTrash as default
};
