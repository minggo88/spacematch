import { a as useAuth, b as useNavigate, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, K as Shield, Q as Database, N as Eye, aU as Server, aV as RefreshCw, o as BarChart3, aW as Table2, aX as Columns3, aY as Wrench, aZ as Rows3, a_ as HardDrive, a$ as Key, b0 as Code, a0 as ChevronDown, f as Search, T as Trash2, ad as Plus, D as Download, F as FileText, b1 as ArrowUp, b2 as ArrowDown, aI as ArrowUpDown, ae as React, d as Check, a as X, l as ChevronLeft, b as ChevronRight, b3 as Link2, b4 as Hash, A as AlertTriangle, aE as Layers, v as Users, b5 as Cpu, C as CheckCircle, an as Zap, b6 as FileX } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const typeColor = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("int")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (t.includes("varchar")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (t.includes("text")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (t.includes("date") || t.includes("time")) return "bg-purple-100 text-purple-700 border-purple-200";
  if (t.includes("decimal") || t.includes("float") || t.includes("double")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (t.includes("enum")) return "bg-pink-100 text-pink-700 border-pink-200";
  if (t.includes("json")) return "bg-cyan-100 text-cyan-700 border-cyan-200";
  if (t.includes("blob")) return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};
const formatSize = (kb) => {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb.toFixed(1)} KB`;
};
const SuperAdminDatabase = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { t } = useTranslation("admin");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const [dbEnv, setDbEnv] = reactExports.useState("production");
  const [overview, setOverview] = reactExports.useState(null);
  const [loadingOverview, setLoadingOverview] = reactExports.useState(true);
  const [selectedTable, setSelectedTable] = reactExports.useState(null);
  const [tableData, setTableData] = reactExports.useState(null);
  const [loadingTable, setLoadingTable] = reactExports.useState(false);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [sortCol, setSortCol] = reactExports.useState("");
  const [sortDir, setSortDir] = reactExports.useState("ASC");
  const [structureData, setStructureData] = reactExports.useState(null);
  const [loadingStructure, setLoadingStructure] = reactExports.useState(false);
  const [editingCell, setEditingCell] = reactExports.useState(null);
  const [editValue, setEditValue] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const [selectedRows, setSelectedRows] = reactExports.useState(/* @__PURE__ */ new Set());
  const [batchDeleting, setBatchDeleting] = reactExports.useState(false);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = reactExports.useState(false);
  const [detailTable, setDetailTable] = reactExports.useState(null);
  const [expandedRow, setExpandedRow] = reactExports.useState(null);
  const [cacheInfo, setCacheInfo] = reactExports.useState(null);
  const [loadingCache, setLoadingCache] = reactExports.useState(false);
  const [clearingCache, setClearingCache] = reactExports.useState({});
  const [clearConfirm, setClearConfirm] = reactExports.useState(null);
  const [showInsertModal, setShowInsertModal] = reactExports.useState(false);
  const [insertData, setInsertData] = reactExports.useState({});
  const [inserting, setInserting] = reactExports.useState(false);
  const [showExportMenu, setShowExportMenu] = reactExports.useState(false);
  const [optimizeResults, setOptimizeResults] = reactExports.useState(null);
  const [optimizing, setOptimizing] = reactExports.useState(false);
  const [optimizeConfirm, setOptimizeConfirm] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  reactExports.useEffect(() => {
    if (user && user.role !== "superadmin") navigate("/admin");
  }, [user, navigate]);
  const fetchOverview = reactExports.useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${API_BASE}/database/database_info.php?action=overview&db=${dbEnv}`, { credentials: "include" });
      const data = await res.json();
      if (!data.error) setOverview(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingOverview(false);
  }, [dbEnv]);
  reactExports.useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);
  const fetchCacheInfo = reactExports.useCallback(async () => {
    setLoadingCache(true);
    try {
      const res = await fetch(`${API_BASE}/database/clear_cache.php?action=scan`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setCacheInfo(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingCache(false);
  }, []);
  const clearCache = reactExports.useCallback(async (type) => {
    setClearingCache((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await fetch(`${API_BASE}/database/clear_cache.php?action=clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data.success) {
        showToast(type === "all" ? t("superAdminDbPage.allCacheCleared", "전체 캐시 정리 완료") : t("superAdminDbPage.cacheCleared", "캐시 정리 완료"));
        fetchCacheInfo();
      } else {
        showToast(data.error || t("superAdminDbPage.cacheClearFailed", "캐시 정리 실패"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t("superAdminDbPage.cacheClearError", "캐시 정리 중 오류"), "error");
    }
    setClearingCache((prev) => ({ ...prev, [type]: false }));
    setClearConfirm(null);
  }, [showToast, fetchCacheInfo, t]);
  const fetchTableData = reactExports.useCallback(async (table, page = 1, search = "", sort = "", dir = "ASC") => {
    setLoadingTable(true);
    try {
      const params = new URLSearchParams({ action: "table_data", db: dbEnv, table, page, limit: 50, search, sort, dir });
      const res = await fetch(`${API_BASE}/database/database_info.php?${params}`, { credentials: "include" });
      const data = await res.json();
      if (!data.error) setTableData(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingTable(false);
  }, [dbEnv]);
  const fetchStructure = reactExports.useCallback(async (table) => {
    setLoadingStructure(true);
    try {
      const res = await fetch(`${API_BASE}/database/database_info.php?action=table_structure&db=${dbEnv}&table=${table}`, { credentials: "include" });
      const data = await res.json();
      if (!data.error) setStructureData(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingStructure(false);
  }, [dbEnv]);
  const openTable = (tableName, tab = "tables") => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    setSearchTerm("");
    setSortCol("");
    setSortDir("ASC");
    setActiveTab(tab);
    setSelectedRows(/* @__PURE__ */ new Set());
    setBatchDeleteConfirm(false);
    if (tab === "tables") fetchTableData(tableName, 1, "", "", "ASC");
    if (tab === "structure") fetchStructure(tableName);
  };
  const handleSort = (colName) => {
    let newDir = "ASC";
    if (sortCol === colName && sortDir === "ASC") newDir = "DESC";
    setSortCol(colName);
    setSortDir(newDir);
    setCurrentPage(1);
    fetchTableData(selectedTable, 1, searchTerm, colName, newDir);
  };
  const handlePageChange = (p) => {
    setCurrentPage(p);
    setSelectedRows(/* @__PURE__ */ new Set());
    setBatchDeleteConfirm(false);
    fetchTableData(selectedTable, p, searchTerm, sortCol, sortDir);
  };
  const handleSearch = () => {
    setCurrentPage(1);
    setSelectedRows(/* @__PURE__ */ new Set());
    setBatchDeleteConfirm(false);
    fetchTableData(selectedTable, 1, searchTerm, sortCol, sortDir);
  };
  const isDevMode = dbEnv === "development";
  const startEdit = (rowIdx, field, val) => {
    if (isDevMode) {
      showToast(t("superAdminDbPage.devEditError"), "error");
      return;
    }
    setEditingCell({ row: rowIdx, field });
    setEditValue(val || "");
  };
  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };
  const saveEdit = async () => {
    if (!tableData || !editingCell) return;
    setSaving(true);
    try {
      const row = tableData.rows[editingCell.row];
      const res = await fetch(`${API_BASE}/database/database_info.php?action=update_row&db=${dbEnv}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_value: row[tableData.primary_key], field: editingCell.field, value: editValue })
      });
      const data = await res.json();
      if (data.success) {
        const newRows = [...tableData.rows];
        newRows[editingCell.row] = { ...newRows[editingCell.row], [editingCell.field]: editValue };
        setTableData({ ...tableData, rows: newRows });
        cancelEdit();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };
  const handleDelete = async (pv) => {
    if (isDevMode) {
      showToast(t("superAdminDbPage.devDeleteError"), "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/database/database_info.php?action=delete_row&db=${dbEnv}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_value: pv })
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir);
        fetchOverview();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const toggleRowSelect = (pkValue) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(pkValue)) next.delete(pkValue);
      else next.add(pkValue);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (!(tableData == null ? void 0 : tableData.rows) || !tableData.primary_key) return;
    const allPKs = tableData.rows.map((r) => r[tableData.primary_key]);
    const allSelected = allPKs.every((pk) => selectedRows.has(pk));
    if (allSelected) {
      setSelectedRows(/* @__PURE__ */ new Set());
    } else {
      setSelectedRows(new Set(allPKs));
    }
  };
  const handleBatchDelete = async () => {
    if (isDevMode) {
      showToast(t("superAdminDbPage.devDeleteError"), "error");
      return;
    }
    if (selectedRows.size === 0) return;
    setBatchDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/database/database_info.php?action=batch_delete&db=${dbEnv}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ table: selectedTable, primary_key: tableData.primary_key, primary_values: Array.from(selectedRows) })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t("superAdminDbPage.batchDeleteSuccess", { count: data.affected_rows }));
        setSelectedRows(/* @__PURE__ */ new Set());
        setBatchDeleteConfirm(false);
        fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir);
        fetchOverview();
      } else {
        showToast(data.error || t("superAdminDbPage.deleteFailed"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t("superAdminDbPage.deleteError"), "error");
    }
    setBatchDeleting(false);
  };
  const openInsertModal = () => {
    if (!(tableData == null ? void 0 : tableData.columns)) return;
    const defaults = {};
    tableData.columns.forEach((col) => {
      var _a2;
      if ((_a2 = col.Extra) == null ? void 0 : _a2.includes("auto_increment")) return;
      defaults[col.Field] = col.Default !== null ? String(col.Default) : "";
    });
    setInsertData(defaults);
    setShowInsertModal(true);
  };
  const handleInsert = async () => {
    if (!selectedTable || isDevMode) return;
    setInserting(true);
    try {
      const filteredData = {};
      for (const [k, v] of Object.entries(insertData)) {
        if (v !== "" && v !== void 0) filteredData[k] = v;
      }
      const res = await fetch(`${API_BASE}/database/database_info.php?action=insert_row&db=${dbEnv}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ table: selectedTable, data: filteredData })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || t("superAdminDbPage.insertSuccess", "행이 추가되었습니다."));
        setShowInsertModal(false);
        fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir);
        fetchOverview();
      } else {
        showToast(data.error || t("superAdminDbPage.insertFailed", "추가 실패"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t("superAdminDbPage.insertError", "추가 중 오류"), "error");
    }
    setInserting(false);
  };
  const handleExport = (format) => {
    if (!selectedTable) return;
    const params = new URLSearchParams({ action: "export_table", db: dbEnv, table: selectedTable, format, search: searchTerm });
    window.open(`${API_BASE}/database/database_info.php?${params}`, "_blank");
    setShowExportMenu(false);
  };
  const handleOptimize = async (tableName = null) => {
    setOptimizing(true);
    try {
      const body = tableName ? { table: tableName } : { all: true };
      const res = await fetch(`${API_BASE}/database/database_info.php?action=optimize_table&db=${dbEnv}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || t("superAdminDbPage.optimizeSuccess", "최적화 완료"));
        setOptimizeResults(data);
        fetchOverview();
      } else {
        showToast(data.error || t("superAdminDbPage.optimizeFailed", "최적화 실패"), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t("superAdminDbPage.optimizeError", "최적화 중 오류"), "error");
    }
    setOptimizing(false);
    setOptimizeConfirm(null);
  };
  const tableCategories = reactExports.useMemo(() => {
    if (!(overview == null ? void 0 : overview.tables)) return [];
    const cats = {
      [t("superAdminDbPage.catUsers")]: { icon: "👤", tables: [], keywords: ["user", "session", "profile", "banned", "seller_photo"] },
      [t("superAdminDbPage.catVenues")]: { icon: "🏢", tables: [], keywords: ["venue", "space", "room"] },
      [t("superAdminDbPage.catApplications")]: { icon: "📝", tables: [], keywords: ["application", "apply", "cancellation"] },
      [t("superAdminDbPage.catCommunity")]: { icon: "💬", tables: [], keywords: ["community"] },
      [t("superAdminDbPage.catNotifications")]: { icon: "🔔", tables: [], keywords: ["notification", "alert", "push_sub"] },
      [t("superAdminDbPage.catPromotions")]: { icon: "🌟", tables: [], keywords: ["promotion", "recruit", "campaign"] },
      [t("superAdminDbPage.catPayments", "결제/정산")]: { icon: "💳", tables: [], keywords: ["payment", "settlement"] },
      [t("superAdminDbPage.catChat", "채팅")]: { icon: "💬", tables: [], keywords: ["chat_", "conversation"] },
      [t("superAdminDbPage.catAds", "광고")]: { icon: "📢", tables: [], keywords: ["ads", "adsense", "ad_daily", "ad_share"] },
      [t("superAdminDbPage.catDistribution", "유통/배송")]: { icon: "🚚", tables: [], keywords: ["proposal", "shipment", "distribution"] },
      [t("superAdminDbPage.catStats", "매출통계")]: { icon: "📊", tables: [], keywords: ["seller_stat"] },
      [t("superAdminDbPage.catOther")]: { icon: "📦", tables: [], keywords: [] }
    };
    overview.tables.forEach((tbl) => {
      const name = tbl.name.toLowerCase();
      let placed = false;
      for (const [catName, cat] of Object.entries(cats)) {
        if (catName !== t("superAdminDbPage.catOther") && cat.keywords.some((kw) => name.includes(kw))) {
          cat.tables.push(tbl);
          placed = true;
          break;
        }
      }
      if (!placed) cats[t("superAdminDbPage.catOther")].tables.push(tbl);
    });
    return Object.entries(cats).filter(([, c]) => c.tables.length > 0);
  }, [overview]);
  const maxRows = overview ? Math.max(...overview.tables.map((t2) => t2.row_count), 1) : 1;
  if (!user || user.role !== "superadmin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 48, className: "mx-auto mb-4 text-red-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: t("superAdminDbPage.noAccess") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: t("superAdminDbPage.superAdminOnly") })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-extrabold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "text-indigo-600", size: 28 }),
          t("superAdminDbPage.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
          t("superAdminDbPage.subtitle"),
          overview && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-gray-400", children: [
            "· MySQL ",
            overview.version,
            " · ",
            overview.charset
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-gray-100 rounded-xl p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setDbEnv("development"),
              className: `px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${dbEnv === "development" ? "bg-amber-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 13 }),
                " Dev ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-75", children: t("superAdminDbPage.readOnly") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setDbEnv("production"),
              className: `px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${dbEnv === "production" ? "bg-red-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 13 }),
                " Prod ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-75", children: t("superAdminDbPage.editable") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: fetchOverview, className: "p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors", title: t("superAdminDbPage.refresh"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, className: `text-gray-600 ${loadingOverview ? "animate-spin" : ""}` }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-gray-100 rounded-xl p-1", children: [
      { key: "dashboard", icon: BarChart3, label: t("superAdminDbPage.tabDashboard"), shortLabel: t("superAdminDbPage.tabDashboardShort") },
      { key: "tables", icon: Table2, label: t("superAdminDbPage.tabTables"), shortLabel: t("superAdminDbPage.tabTablesShort") },
      { key: "structure", icon: Columns3, label: t("superAdminDbPage.tabStructure"), shortLabel: t("superAdminDbPage.tabStructureShort") },
      { key: "maintenance", icon: Wrench, label: t("superAdminDbPage.tabMaintenance", "유지관리"), shortLabel: "🧹" }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          setActiveTab(tab.key);
          if (tab.key === "maintenance" && !cacheInfo) fetchCacheInfo();
        },
        className: `flex-1 px-2 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 ${activeTab === tab.key ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: tab.shortLabel })
        ]
      },
      tab.key
    )) }),
    dbEnv === "development" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18, className: "text-amber-600 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-800", children: t("superAdminDbPage.devModeTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600", children: t("superAdminDbPage.devModeDesc") })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18, className: "text-red-600 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-red-800", children: t("superAdminDbPage.prodModeTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-600", children: t("superAdminDbPage.prodModeDesc") })
      ] })
    ] }),
    activeTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: loadingOverview ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 32, className: "animate-spin text-indigo-400" }) }) : overview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [
        { label: t("superAdminDbPage.database"), value: overview.database, icon: Database, color: "indigo", small: true },
        { label: t("superAdminDbPage.tableCount"), value: overview.table_count, icon: Table2, color: "violet" },
        { label: t("superAdminDbPage.totalRows"), value: overview.total_rows.toLocaleString(), icon: Rows3, color: "emerald" },
        { label: t("superAdminDbPage.totalColumns"), value: overview.total_columns, icon: Columns3, color: "blue" },
        { label: t("superAdminDbPage.dataSize"), value: formatSize(overview.total_data_kb), icon: HardDrive, color: "amber" },
        { label: t("superAdminDbPage.indexSize"), value: formatSize(overview.total_index_kb), icon: Key, color: "pink" }
      ].map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 bg-${card.color}-100 rounded-xl flex items-center justify-center mb-2`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { size: 18, className: `text-${card.color}-600` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${card.small ? "text-sm" : "text-xl"} font-extrabold text-gray-900 truncate`, children: card.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: card.label })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 18, className: "text-indigo-500" }),
          t("superAdminDbPage.tableSizeDist")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 h-8 rounded-xl overflow-hidden bg-gray-100", children: overview.tables.filter((t2) => t2.size_kb > 0).sort((a, b) => b.size_kb - a.size_kb).map((t2, i) => {
          const pct = t2.size_kb / overview.total_size_kb * 100;
          const colors = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-red-400", "bg-blue-400", "bg-orange-400", "bg-teal-400"];
          return pct >= 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `${colors[i % colors.length]} relative group cursor-pointer transition-opacity hover:opacity-80`,
              style: { width: `${pct}%` },
              title: `${t2.name}: ${formatSize(t2.size_kb)} (${pct.toFixed(1)}%)`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: t2.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                formatSize(t2.size_kb),
                " (",
                pct.toFixed(1),
                "%)"
              ] })
            },
            t2.name
          ) : null;
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 mt-3", children: overview.tables.filter((t2) => t2.size_kb > 0).sort((a, b) => b.size_kb - a.size_kb).slice(0, 8).map((t2, i) => {
          const colors = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-red-400", "bg-blue-400"];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2.5 h-2.5 rounded-sm ${colors[i % colors.length]}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t2.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: formatSize(t2.size_kb) })
          ] }, t2.name);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: tableCategories.map(([catName, cat]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-800 text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: cat.icon }),
          catName,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full", children: cat.tables.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50", children: cat.tables.sort((a, b) => b.row_count - a.row_count).map((table) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 sm:px-5 py-3 hover:bg-indigo-50/30 cursor-pointer transition-colors group",
            onClick: () => setDetailTable(detailTable === table.name ? null : table.name),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors truncate", children: table.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded font-medium hidden sm:inline", children: table.engine })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-[11px] text-gray-400 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      table.column_count,
                      " ",
                      t("superAdminDbPage.columns")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      table.indexes.length,
                      " ",
                      t("superAdminDbPage.indexes")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline", children: [
                      table.foreign_keys.length,
                      " FK"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatSize(table.size_kb) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-600", children: table.row_count.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          openTable(table.name, "tables");
                        },
                        className: "p-1.5 hover:bg-indigo-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors",
                        title: t("superAdminDbPage.viewTable"),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          openTable(table.name, "structure");
                        },
                        className: "p-1.5 hover:bg-violet-100 rounded-lg text-gray-400 hover:text-violet-600 transition-colors",
                        title: t("superAdminDbPage.viewStructure"),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 14 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: `text-gray-300 transition-transform ${detailTable === table.name ? "rotate-180" : ""}` })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-full rounded-full transition-all duration-500 ${table.row_count / maxRows > 0.7 ? "bg-red-400" : table.row_count / maxRows > 0.4 ? "bg-amber-400" : "bg-emerald-400"}`,
                  style: { width: `${Math.max(3, table.row_count / maxRows * 100)}%` }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2 sm:hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      openTable(table.name, "tables");
                    },
                    className: "flex-1 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12 }),
                      " ",
                      t("superAdminDbPage.table")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      openTable(table.name, "structure");
                    },
                    className: "flex-1 py-1.5 text-[10px] font-bold text-violet-600 bg-violet-50 rounded-lg flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 12 }),
                      " ",
                      t("superAdminDbPage.structure")
                    ]
                  }
                )
              ] })
            ]
          },
          table.name
        )) })
      ] }, catName)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-gray-400", children: t("superAdminDbPage.noData") }) }),
    activeTab === "tables" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedTable || "",
            onChange: (e) => e.target.value && openTable(e.target.value, "tables"),
            className: "flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("superAdminDbPage.selectTable") }),
              (_a = overview == null ? void 0 : overview.tables) == null ? void 0 : _a.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: t2.name, children: [
                t2.name,
                " (",
                t2.row_count.toLocaleString(),
                " ",
                t("superAdminDbPage.rows"),
                ", ",
                t2.column_count,
                " ",
                t("superAdminDbPage.columns"),
                ")"
              ] }, t2.name))
            ]
          }
        ),
        selectedTable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 sm:flex-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: t("superAdminDbPage.search"),
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleSearch(),
                className: "pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSearch, className: "px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors", children: t("superAdminDbPage.searchBtn") })
        ] })
      ] }),
      loadingTable ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 32, className: "animate-spin text-indigo-400" }) }) : tableData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
              tableData.table,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full", children: [
                tableData.total_rows.toLocaleString(),
                " ",
                t("superAdminDbPage.totalRowCount")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-gray-400 mt-0.5", children: [
              t("superAdminDbPage.page"),
              " ",
              tableData.page,
              "/",
              tableData.total_pages,
              " · PK: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-indigo-500", children: tableData.primary_key || "N/A" }),
              sortCol && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                " · ",
                t("superAdminDbPage.sortLabel"),
                ": ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  sortCol,
                  " ",
                  sortDir
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            !isDevMode && tableData.primary_key && selectedRows.size > 0 && (batchDeleteConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-red-700", children: t("superAdminDbPage.deleteCount", { count: selectedRows.size }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleBatchDelete,
                  disabled: batchDeleting,
                  className: "px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors",
                  children: batchDeleting ? t("superAdminDbPage.deleting") : t("superAdminDbPage.confirm")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setBatchDeleteConfirm(false),
                  className: "px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors",
                  children: t("superAdminDbPage.cancel")
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setBatchDeleteConfirm(true),
                className: "flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 border border-red-200 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
                  selectedRows.size,
                  t("superAdminDbPage.selectedDelete", { count: selectedRows.size }).replace(String(selectedRows.size), "")
                ]
              }
            )),
            !isDevMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: openInsertModal,
                className: "flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 border border-emerald-200 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
                  t("superAdminDbPage.addRow", "행 추가")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setShowExportMenu(!showExportMenu),
                  className: "flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                    t("superAdminDbPage.export", "내보내기")
                  ]
                }
              ),
              showExportMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleExport("csv"), className: "w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13, className: "text-emerald-500" }),
                  " CSV"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleExport("json"), className: "w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 13, className: "text-blue-500" }),
                  " JSON"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => fetchTableData(selectedTable, currentPage, searchTerm, sortCol, sortDir),
                className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "text-gray-400" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50", children: [
            !isDevMode && tableData.primary_key && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center bg-gray-50 z-10 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: tableData.rows.length > 0 && tableData.rows.every((r) => selectedRows.has(r[tableData.primary_key])),
                onChange: toggleSelectAll,
                className: "w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-8", children: "#" }),
            tableData.columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "th",
              {
                className: "px-2.5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors",
                onClick: () => handleSort(col.Field),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    col.Key === "PRI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 10, className: "text-amber-500" }),
                    col.Field,
                    sortCol === col.Field ? sortDir === "ASC" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 10, className: "text-indigo-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 10, className: "text-indigo-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 9, className: "text-gray-300" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[9px] font-medium normal-case mt-0.5 ${typeColor(col.Type)} inline-block px-1 rounded`, children: col.Type })
                ]
              },
              col.Field
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16", children: t("superAdminDbPage.actions") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: tableData.rows.map((row, rowIdx) => {
            const pkVal = tableData.primary_key ? row[tableData.primary_key] : null;
            const isSelected = pkVal !== null && selectedRows.has(pkVal);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-indigo-50/30 transition-colors ${expandedRow === rowIdx ? "bg-indigo-50/20" : ""} ${isSelected ? "bg-indigo-50/40" : ""}`, children: [
                !isDevMode && tableData.primary_key && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: () => toggleRowSelect(pkVal),
                    className: "w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-[10px] text-gray-400 sticky left-0 bg-white z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setExpandedRow(expandedRow === rowIdx ? null : rowIdx),
                    className: "hover:text-indigo-600 transition-colors font-medium",
                    children: (currentPage - 1) * 50 + rowIdx + 1
                  }
                ) }),
                tableData.columns.map((col) => {
                  const isEditing = (editingCell == null ? void 0 : editingCell.row) === rowIdx && (editingCell == null ? void 0 : editingCell.field) === col.Field;
                  const isPK = col.Field === tableData.primary_key;
                  const val = row[col.Field];
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2.5 py-2", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: editValue,
                        onChange: (e) => setEditValue(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        },
                        className: "px-2 py-1 border border-indigo-300 rounded-lg text-xs w-full min-w-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-200",
                        autoFocus: true
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: saveEdit, disabled: saving, className: "p-1 text-emerald-600 hover:bg-emerald-50 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: cancelEdit, className: "p-1 text-gray-400 hover:bg-gray-100 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `max-w-[180px] truncate text-xs ${isPK ? "font-bold text-indigo-600" : "text-gray-700"} ${!isPK && tableData.primary_key && !isDevMode ? "cursor-pointer hover:text-indigo-600" : ""}`,
                      onClick: () => !isPK && tableData.primary_key && !isDevMode && startEdit(rowIdx, col.Field, val),
                      title: val != null ? String(val) : "NULL",
                      children: val != null ? String(val).length > 45 ? String(val).substring(0, 45) + "…" : String(val) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 italic text-[10px]", children: "NULL" })
                    }
                  ) }, col.Field);
                }),
                !isDevMode && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: tableData.primary_key && (deleteConfirm === row[tableData.primary_key] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(row[tableData.primary_key]), className: "px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold", children: t("superAdminDbPage.confirm") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteConfirm(null), className: "px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold", children: t("superAdminDbPage.cancel") })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteConfirm(row[tableData.primary_key]), className: "p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }) })) })
              ] }),
              expandedRow === rowIdx && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: tableData.columns.length + (isDevMode || !tableData.primary_key ? 2 : 3), className: "px-5 py-4 bg-indigo-50/30 border-y border-indigo-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2", children: tableData.columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-gray-100 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  col.Key === "PRI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 10, className: "text-amber-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-500 uppercase", children: col.Field }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] px-1 rounded border ${typeColor(col.Type)}`, children: col.Type })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-800 break-all whitespace-pre-wrap", children: row[col.Field] != null ? String(row[col.Field]) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 italic", children: "NULL" }) })
              ] }, col.Field)) }) }) })
            ] }, rowIdx);
          }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden divide-y divide-gray-100", children: [
          !isDevMode && tableData.primary_key && tableData.rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: tableData.rows.every((r) => selectedRows.has(r[tableData.primary_key])),
                  onChange: toggleSelectAll,
                  className: "w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600", children: t("superAdminDbPage.selectAll") })
            ] }),
            selectedRows.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-indigo-600", children: t("superAdminDbPage.selectedCount", { count: selectedRows.size }) })
          ] }),
          tableData.rows.map((row, rowIdx) => {
            const pkVal = tableData.primary_key ? row[tableData.primary_key] : null;
            const isSelected = pkVal !== null && selectedRows.has(pkVal);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 ${isSelected ? "bg-indigo-50/40" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  !isDevMode && tableData.primary_key && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: () => toggleRowSelect(pkVal),
                      className: "w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full", children: [
                    "#",
                    (currentPage - 1) * 50 + rowIdx + 1,
                    tableData.primary_key && ` · ${tableData.primary_key}: ${row[tableData.primary_key]}`
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: !isDevMode && tableData.primary_key && (deleteConfirm === row[tableData.primary_key] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(row[tableData.primary_key]), className: "px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold", children: t("superAdminDbPage.confirm") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteConfirm(null), className: "px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold", children: t("superAdminDbPage.cancel") })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteConfirm(row[tableData.primary_key]), className: "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: tableData.columns.slice(0, expandedRow === rowIdx ? void 0 : 5).map((col) => {
                const val = row[col.Field];
                const isPK = col.Field === tableData.primary_key;
                const isEditing = (editingCell == null ? void 0 : editingCell.row) === rowIdx && (editingCell == null ? void 0 : editingCell.field) === col.Field;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `w-24 flex-shrink-0 font-bold truncate ${isPK ? "text-amber-600" : "text-gray-400"}`, children: [
                    isPK && "🔑 ",
                    col.Field
                  ] }),
                  isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: editValue,
                        onChange: (e) => setEditValue(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        },
                        className: "px-2 py-0.5 border border-indigo-300 rounded text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-200",
                        autoFocus: true
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: saveEdit, disabled: saving, className: "p-0.5 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: cancelEdit, className: "p-0.5 text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `flex-1 text-gray-700 truncate ${!isPK && tableData.primary_key ? "cursor-pointer active:text-indigo-600" : ""}`,
                      onClick: () => !isPK && tableData.primary_key && startEdit(rowIdx, col.Field, val),
                      children: val != null ? String(val) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 italic", children: "NULL" })
                    }
                  )
                ] }, col.Field);
              }) }),
              tableData.columns.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setExpandedRow(expandedRow === rowIdx ? null : rowIdx),
                  className: "mt-2 text-[10px] font-bold text-indigo-500 hover:text-indigo-700",
                  children: expandedRow === rowIdx ? t("superAdminDbPage.fold") : t("superAdminDbPage.showMore", { count: tableData.columns.length - 5 })
                }
              )
            ] }, rowIdx);
          })
        ] }),
        tableData.total_pages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-gray-400", children: [
            (currentPage - 1) * 50 + 1,
            "~",
            Math.min(currentPage * 50, tableData.total_rows),
            " / ",
            tableData.total_rows.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(1), disabled: currentPage <= 1, className: "px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30", children: "«" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage <= 1, className: "p-1.5 rounded hover:bg-gray-100 disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 }) }),
            Array.from({ length: Math.min(7, tableData.total_pages) }, (_, i) => {
              let pn;
              if (tableData.total_pages <= 7) pn = i + 1;
              else if (currentPage <= 4) pn = i + 1;
              else if (currentPage >= tableData.total_pages - 3) pn = tableData.total_pages - 6 + i;
              else pn = currentPage - 3 + i;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handlePageChange(pn),
                  className: `w-7 h-7 rounded-lg text-xs font-bold transition-colors ${pn === currentPage ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"}`,
                  children: pn
                },
                pn
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage >= tableData.total_pages, className: "p-1.5 rounded hover:bg-gray-100 disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(tableData.total_pages), disabled: currentPage >= tableData.total_pages, className: "px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30", children: "»" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { size: 48, className: "mx-auto mb-4 text-gray-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("superAdminDbPage.selectTablePrompt") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 mt-1", children: t("superAdminDbPage.clickToEdit") })
      ] })
    ] }),
    activeTab === "structure" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: selectedTable || "",
          onChange: (e) => e.target.value && openTable(e.target.value, "structure"),
          className: "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("superAdminDbPage.selectTable") }),
            (_b = overview == null ? void 0 : overview.tables) == null ? void 0 : _b.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t2.name, children: t2.name }, t2.name))
          ]
        }
      ),
      loadingStructure ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 32, className: "animate-spin text-indigo-400" }) }) : structureData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Columns3, { size: 18, className: "text-violet-500" }),
            structureData.table,
            " — ",
            "컨럼 상세",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-gray-400", children: structureData.columns.length })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.column") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.type") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.null") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.key") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.default") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase", children: t("superAdminDbPage.extra") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: structureData.columns.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-indigo-50/20 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-gray-400", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                col.Key === "PRI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 12, className: "text-amber-500" }),
                col.Key === "MUL" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 12, className: "text-blue-500" }),
                col.Key === "UNI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 12, className: "text-violet-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: col.Field })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-[11px] border font-medium ${typeColor(col.Type)}`, children: col.Type }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${col.Null === "YES" ? "text-emerald-600" : "text-red-500"}`, children: col.Null === "YES" ? "✔" : "✖" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: col.Key ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded text-[10px] font-bold ${col.Key === "PRI" ? "bg-amber-100 text-amber-700" : col.Key === "UNI" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`, children: col.Key }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "-" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-gray-600", children: col.Default !== null ? String(col.Default) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 italic", children: t("superAdminDbPage.noDefault") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-gray-600", children: col.Extra || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "-" }) })
            ] }, col.Field)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-gray-100", children: structureData.columns.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-400", children: [
                "#",
                i + 1
              ] }),
              col.Key === "PRI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 12, className: "text-amber-500" }),
              col.Key === "MUL" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 12, className: "text-blue-500" }),
              col.Key === "UNI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 12, className: "text-violet-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: col.Field }),
              col.Key && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded text-[10px] font-bold ${col.Key === "PRI" ? "bg-amber-100 text-amber-700" : col.Key === "UNI" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`, children: col.Key })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded border font-medium ${typeColor(col.Type)}`, children: col.Type }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-medium ${col.Null === "YES" ? "text-emerald-600" : "text-red-500"}`, children: [
                "NULL: ",
                col.Null === "YES" ? "✔" : "✖"
              ] }),
              col.Default !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-500", children: [
                t("superAdminDbPage.defaultLabel"),
                ": ",
                String(col.Default)
              ] }),
              col.Extra && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: col.Extra })
            ] })
          ] }, col.Field)) })
        ] }),
        structureData.indexes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 18, className: "text-amber-500" }),
            t("superAdminDbPage.indexInfo"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-gray-400", children: structureData.indexes.length })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50", children: structureData.indexes.map((idx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800", children: idx.Key_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-1 text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 font-medium", children: idx.Column_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: idx.Index_type }),
                idx.Cardinality && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
                  t("superAdminDbPage.cardinality"),
                  ": ",
                  idx.Cardinality
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded ${!idx.Non_unique ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`, children: !idx.Non_unique ? "Unique" : "Non-unique" })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 18, className: "text-cyan-500" }),
            "CREATE TABLE DDL"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed font-mono whitespace-pre-wrap", children: structureData.create_sql }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Columns3, { size: 48, className: "mx-auto mb-4 text-gray-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("superAdminDbPage.selectTableStructure") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 mt-1", children: t("superAdminDbPage.structureDetail") })
      ] })
    ] }),
    activeTab === "maintenance" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-extrabold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 20, className: "text-amber-500" }),
            t("superAdminDbPage.maintenanceTitle", "서버 캐시 관리")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: t("superAdminDbPage.maintenanceDesc", "서버에 쌓인 캐시 파일을 스캔하고 정리합니다") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          cacheInfo && (clearConfirm === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 14, className: "text-red-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-red-700", children: t("superAdminDbPage.clearAllConfirm", "전체 정리하시겠습니까?") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => clearCache("all"),
                disabled: clearingCache["all"],
                className: "px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors",
                children: clearingCache["all"] ? "..." : t("superAdminDbPage.confirm", "확인")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setClearConfirm(null),
                className: "px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors",
                children: t("superAdminDbPage.cancel", "취소")
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setClearConfirm("all"),
              className: "flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-md",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }),
                t("superAdminDbPage.clearAll", "전체 정리")
              ]
            }
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: fetchCacheInfo,
              className: "p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors",
              title: "Refresh",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, className: `text-gray-600 ${loadingCache ? "animate-spin" : ""}` })
            }
          )
        ] })
      ] }),
      cacheInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 18, className: "text-indigo-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: cacheInfo.totalSizeFormatted }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: t("superAdminDbPage.totalCacheSize", "전체 캐시 용량") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 18, className: "text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: cacheInfo.totalCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: t("superAdminDbPage.totalCacheItems", "전체 캐시 항목") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-violet-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: ((_d = (_c = cacheInfo.caches) == null ? void 0 : _c.sessions) == null ? void 0 : _d.count) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: t("superAdminDbPage.expiredSessions", "만료 세션") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 18, className: "text-cyan-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: ((_f = (_e = cacheInfo.caches) == null ? void 0 : _e.opcache) == null ? void 0 : _f.count) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: "OPcache Scripts" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18, className: "text-amber-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: ((_h = (_g = cacheInfo.caches) == null ? void 0 : _g.trash) == null ? void 0 : _h.count) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: t("superAdminDbPage.trashRecords", "휴지통 기록") })
        ] })
      ] }),
      loadingCache ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 32, className: "animate-spin text-indigo-400" }) }) : cacheInfo ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Object.entries(cacheInfo.caches || {}).map(([key, cache]) => {
        const iconMap = {
          sessions: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 22, className: "text-violet-500" }),
          opcache: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { size: 22, className: "text-cyan-500" }),
          temp: /* @__PURE__ */ jsxRuntimeExports.jsx(FileX, { size: 22, className: "text-orange-500" }),
          logs: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 22, className: "text-rose-500" }),
          trash: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 22, className: "text-amber-500" })
        };
        const colorMap = {
          sessions: "violet",
          opcache: "cyan",
          temp: "orange",
          logs: "rose",
          trash: "amber"
        };
        const color = colorMap[key] || "gray";
        const isClearing = clearingCache[key];
        const hasItems = cache.count > 0 || key === "opcache" && cache.available;
        const lang = t("lang", "ko");
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 bg-${color}-50 rounded-xl flex items-center justify-center`, children: iconMap[key] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-sm", children: lang === "en" ? cache.labelEn || cache.label : cache.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: lang === "en" ? cache.descriptionEn || cache.description : cache.description })
              ] })
            ] }),
            hasItems ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-2 py-1 bg-${color}-50 text-${color}-600 rounded-lg text-[11px] font-bold`, children: [
              cache.count,
              key !== "opcache" ? ` ${t("superAdminDbPage.items", "개")}` : " scripts"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[11px] font-bold", children: t("superAdminDbPage.clean", "깨끗") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-100 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full rounded-full bg-${color}-400 transition-all duration-500`,
                style: { width: `${Math.min(100, cacheInfo.totalSize > 0 ? cache.size / cacheInfo.totalSize * 100 : 0)}%` }
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600 flex-shrink-0", children: cache.sizeFormatted || "0 B" })
          ] }),
          key === "opcache" && cache.hitRate > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Hit Rate:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-cyan-600", children: [
              cache.hitRate,
              "%"
            ] })
          ] }),
          key === "trash" && cache.totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
              t("superAdminDbPage.totalTrash", "전체 휴지통"),
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-amber-600", children: [
              cache.totalCount,
              t("superAdminDbPage.items", "개")
            ] })
          ] }),
          cache.files && cache.files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "text-[11px] font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors", children: [
              t("superAdminDbPage.fileList", "파일 목록"),
              " (",
              cache.count,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2 space-y-1", children: [
              cache.files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-gray-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1 font-mono", children: f.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-shrink-0 ml-2 text-gray-400", children: [
                  f.age_hours,
                  "h ago"
                ] })
              ] }, i)),
              cache.count > cache.files.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-300 text-center pt-1", children: [
                "... +",
                cache.count - cache.files.length,
                " more"
              ] })
            ] })
          ] }),
          cache.path && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-gray-300 font-mono truncate mb-3", title: cache.path, children: [
            "📁 ",
            cache.path
          ] }),
          hasItems ? clearConfirm === key ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => clearCache(key),
                disabled: isClearing,
                className: `flex-1 py-2 bg-${color}-500 text-white rounded-xl text-xs font-bold hover:bg-${color}-600 disabled:opacity-50 transition-colors`,
                children: isClearing ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin mx-auto" }) : t("superAdminDbPage.confirmClear", "정리 실행")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setClearConfirm(null),
                className: "py-2 px-4 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors",
                children: t("superAdminDbPage.cancel", "취소")
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setClearConfirm(key),
              className: `w-full py-2.5 bg-${color}-50 text-${color}-600 rounded-xl text-xs font-bold hover:bg-${color}-100 border border-${color}-100 transition-colors flex items-center justify-center gap-1.5`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
                t("superAdminDbPage.clearThis", "정리하기")
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-2.5 bg-gray-50 text-gray-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 13 }),
            t("superAdminDbPage.noItemsToClear", "정리할 항목 없음")
          ] })
        ] }) }, key);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 48, className: "mx-auto mb-4 text-gray-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("superAdminDbPage.maintenanceEmpty", "스캔 버튼을 클릭하여 캐시 현황을 확인하세요") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18, className: "text-yellow-500" }),
              t("superAdminDbPage.optimizeTitle", "테이블 최적화")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: t("superAdminDbPage.optimizeDesc", "OPTIMIZE TABLE을 실행하여 디스크 공간을 회수하고 성능을 개선합니다") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: optimizeConfirm === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-yellow-700", children: t("superAdminDbPage.optimizeAllConfirm", "전체 테이블을 최적화하시겠습니까?") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleOptimize(null),
                disabled: optimizing,
                className: "px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors",
                children: optimizing ? "..." : t("superAdminDbPage.confirm", "확인")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setOptimizeConfirm(null),
                className: "px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors",
                children: t("superAdminDbPage.cancel", "취소")
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setOptimizeConfirm("all"),
              className: "flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl text-sm font-bold hover:from-yellow-500 hover:to-amber-600 transition-all shadow-md",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 15 }),
                t("superAdminDbPage.optimizeAll", "전체 최적화")
              ]
            }
          ) })
        ] }),
        optimizing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-8 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 24, className: "animate-spin text-yellow-400 mr-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-500", children: t("superAdminDbPage.optimizing", "최적화 중...") })
        ] }),
        optimizeResults && !optimizing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 18, className: "text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-800", children: optimizeResults.message }),
              optimizeResults.total_saved_kb !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 mt-0.5", children: [
                t("superAdminDbPage.savedSpace", "절약 용량"),
                ": ",
                formatSize(Math.abs(optimizeResults.total_saved_kb))
              ] })
            ] })
          ] }),
          optimizeResults.results && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-1", children: optimizeResults.results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs px-3 py-2 hover:bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700", children: r.table }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatSize(r.before_kb) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatSize(r.after_kb) }),
              r.saved_kb > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-500 font-bold", children: [
                "-",
                formatSize(r.saved_kb)
              ] })
            ] })
          ] }, i)) })
        ] }),
        !optimizeResults && !optimizing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 text-center text-gray-400 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 24, className: "mx-auto mb-2 text-gray-300" }),
          t("superAdminDbPage.optimizeHint", "전체 최적화 버튼을 클릭하여 모든 테이블을 최적화하세요")
        ] })
      ] })
    ] }),
    showInsertModal && tableData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4", onClick: () => setShowInsertModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18, className: "text-emerald-500" }),
          t("superAdminDbPage.insertTitle", "새 행 추가"),
          " — ",
          selectedTable
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowInsertModal(false), className: "p-1.5 hover:bg-gray-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "text-gray-400" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto max-h-[60vh] space-y-3", children: tableData.columns.map((col) => {
        var _a2;
        const isAutoIncrement = (_a2 = col.Extra) == null ? void 0 : _a2.includes("auto_increment");
        const isNullable = col.Null === "YES";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1", children: [
            col.Key === "PRI" && /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { size: 10, className: "text-amber-500" }),
            col.Field,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1 py-0.5 rounded text-[9px] border ${typeColor(col.Type)}`, children: col.Type }),
            isNullable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-gray-300", children: "NULL OK" }),
            isAutoIncrement && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-gray-300 italic", children: "AUTO" })
          ] }),
          isAutoIncrement ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", disabled: true, value: "(자동 생성)", className: "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-400 cursor-not-allowed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: insertData[col.Field] || "",
              onChange: (e) => setInsertData((prev) => ({ ...prev, [col.Field]: e.target.value })),
              placeholder: col.Default !== null ? `기본: ${col.Default}` : isNullable ? "NULL (비워 두기 가능)" : "필수 입력",
              className: "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
            }
          )
        ] }, col.Field);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowInsertModal(false),
            className: "px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors",
            children: t("superAdminDbPage.cancel", "취소")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleInsert,
            disabled: inserting,
            className: "px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-1.5",
            children: [
              inserting ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              inserting ? t("superAdminDbPage.inserting", "추가 중...") : t("superAdminDbPage.insertBtn", "행 추가")
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
export {
  SuperAdminDatabase as default
};
