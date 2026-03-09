import { u as useData, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, _ as Settings, ad as Plus, v as Users, f as Search, av as Filter, aw as LayoutGrid, ay as List, o as BarChart3, a as X, ap as MapPin, aH as PenLine, T as Trash2, u as Store } from "./vendor-icons-BFe5lkJJ.js";
import { V as VenueModal } from "./VenueModal-AVUCFW8r.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const AdminVenues = () => {
  var _a;
  const { deleteVenue, fetchVenues } = useData();
  const { t } = useTranslation("admin");
  const [adminVenues, setAdminVenues] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const fetchAdminVenues = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/venues/get_all_venues_admin.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setAdminVenues(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchAdminVenues();
  }, [fetchAdminVenues]);
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [isDrawerOpen, setIsDrawerOpen] = reactExports.useState(false);
  const [selectedVenue, setSelectedVenue] = reactExports.useState(null);
  const [statsVenue, setStatsVenue] = reactExports.useState(null);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [sortOption, setSortOption] = reactExports.useState("newest");
  const [filterCategory, setFilterCategory] = reactExports.useState("all");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [filterHost, setFilterHost] = reactExports.useState("all");
  const hostList = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    adminVenues.forEach((v) => {
      if (v.owner_name && v.owner_email) {
        map.set(v.owner_email, v.owner_name);
      }
    });
    return Array.from(map.entries());
  }, [adminVenues]);
  const filteredVenues = reactExports.useMemo(() => {
    let result = adminVenues.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.location.toLowerCase().includes(searchTerm.toLowerCase()) || (venue.owner_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSize = filterCategory === "all" || venue.size === filterCategory;
      const matchesStatus = filterStatus === "all" || venue.status === filterStatus;
      const matchesType = filterType === "all" || venue.type === filterType;
      const matchesVendor = filterHost === "all" || venue.owner_email === filterHost;
      return matchesSearch && matchesSize && matchesStatus && matchesType && matchesVendor;
    });
    return result.sort((a, b) => {
      switch (sortOption) {
        case "price_high":
          return parseInt(b.price) - parseInt(a.price);
        case "price_low":
          return parseInt(a.price) - parseInt(b.price);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "host":
          return (a.owner_name || "").localeCompare(b.owner_name || "");
        case "newest":
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });
  }, [adminVenues, searchTerm, filterCategory, filterStatus, filterType, filterHost, sortOption]);
  const stats = reactExports.useMemo(() => {
    const total = adminVenues.length;
    const approved = adminVenues.filter((v) => v.status === "approved").length;
    const pending = adminVenues.filter((v) => v.status === "pending").length;
    const rejected = adminVenues.filter((v) => v.status === "rejected").length;
    const avgPrice = total > 0 ? Math.round(adminVenues.reduce((acc, v) => acc + parseInt(v.price || 0), 0) / total) : 0;
    const hostCount = new Set(adminVenues.map((v) => v.owner_email).filter(Boolean)).size;
    return { total, approved, pending, rejected, avgPrice, hostCount };
  }, [adminVenues]);
  const venueStats = reactExports.useMemo(() => {
    if (!statsVenue) return null;
    const v = statsVenue;
    return {
      name: v.name,
      type: v.type,
      status: v.status,
      location: v.location,
      price: parseInt(v.price || 0),
      owner: v.owner_name || t("venuesPage.unassigned"),
      ownerEmail: v.owner_email || "",
      createdAt: v.created_at,
      maxSellers: parseInt(v.max_sellers || 0),
      // Count matching venues from same owner
      ownerVenueCount: adminVenues.filter((x) => x.owner_email === v.owner_email).length
    };
  }, [statsVenue, adminVenues]);
  const handleOpenDrawer = (venue = null) => {
    setSelectedVenue(venue);
    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedVenue(null), 300);
  };
  const handleModalSubmit = async (submitData) => {
    const endpoint = selectedVenue ? `${API_BASE}/venues/update_venue.php` : `${API_BASE}/venues/add_venue.php`;
    try {
      const res = await fetch(endpoint, { method: "POST", body: submitData });
      const data = await res.json();
      if (data.success) {
        showToast(selectedVenue ? t("venuesPage.updatedToast") : t("venuesPage.registeredToast"), "success");
        setIsDrawerOpen(false);
        fetchAdminVenues();
        fetchVenues();
      } else {
        showToast(data.message || t("venuesPage.errorOccurred"), "error");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = (id) => {
    const venue = adminVenues.find((v) => String(v.id) === String(id));
    setConfirmModal({
      title: t("venuesPage.deleteTitle"),
      message: t("venuesPage.deleteMsg", { name: (venue == null ? void 0 : venue.name) || "this venue" }),
      type: "danger",
      confirmLabel: t("venuesPage.deleteConfirm"),
      onConfirm: () => {
        setConfirmModal(null);
        deleteVenue(id);
        setAdminVenues((prev) => prev.filter((v) => String(v.id) !== String(id)));
        showToast(t("venuesPage.deletedToast"), "success");
      }
    });
  };
  const [isTypeModalOpen, setIsTypeModalOpen] = reactExports.useState(false);
  const [venueTypes, setVenueTypes] = reactExports.useState([]);
  const [newTypeName, setNewTypeName] = reactExports.useState("");
  const [newTypeCode, setNewTypeCode] = reactExports.useState("");
  const fetchVenueTypes = () => {
    fetch(`${API_BASE}/venues/manage_types.php`).then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setVenueTypes(data);
    }).catch((err) => console.error("Error fetching types:", err));
  };
  const handleOpenTypeModal = () => {
    fetchVenueTypes();
    setIsTypeModalOpen(true);
  };
  const handleAddType = () => {
    if (!newTypeName || !newTypeCode) {
      showToast(t("venuesPage.typeAddError"), "error");
      return;
    }
    fetch(`${API_BASE}/venues/manage_types.php`, {
      method: "POST",
      body: JSON.stringify({ name: newTypeName, code: newTypeCode })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setNewTypeName("");
        setNewTypeCode("");
        fetchVenueTypes();
        showToast(t("venuesPage.typeAddedToast"), "success");
      } else showToast(data.message, "error");
    });
  };
  const handleToggleType = (id, currentStatus) => {
    fetch(`${API_BASE}/venues/manage_types.php`, {
      method: "PUT",
      body: JSON.stringify({ id, is_active: currentStatus == 1 ? 0 : 1 })
    }).then((res) => res.json()).then((data) => {
      if (data.success) fetchVenueTypes();
      else showToast(data.message, "error");
    });
  };
  const StatusBadge = ({ status }) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      rejected: "bg-red-100 text-red-700"
    };
    const labels = { approved: t("venuesPage.statusApproved"), pending: t("venuesPage.statusPending"), rejected: t("venuesPage.statusRejected") };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[status] || "bg-gray-100 text-gray-500"}`, children: labels[status] || status });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 md:space-y-6 pb-20 animate-fadeIn relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white shadow-lg shadow-indigo-200/50 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold opacity-90", children: t("venuesPage.totalVenues") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleOpenTypeModal, className: "p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors", title: t("venuesPage.typeSettings"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-extrabold mt-1", children: stats.total })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleOpenDrawer(),
            className: "mt-3 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-xl transition-all font-bold text-xs md:text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              " ",
              t("venuesPage.registerVenue")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-[10px] md:text-xs font-bold mb-1", children: t("venuesPage.statApproved") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl md:text-2xl font-extrabold text-emerald-600", children: stats.approved })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-[10px] md:text-xs font-bold mb-1", children: t("venuesPage.statPending") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl md:text-2xl font-extrabold text-amber-600", children: stats.pending })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-[10px] md:text-xs font-bold mb-1", children: t("venuesPage.statAvgRent") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg md:text-2xl font-extrabold text-gray-900", children: `₩${stats.avgPrice.toLocaleString()}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-[10px] md:text-xs font-bold mb-1", children: t("venuesPage.statHosts") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl md:text-2xl font-extrabold text-indigo-600", children: stats.hostCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16, className: "text-indigo-400" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 md:gap-4 py-3 md:py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-80 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: t("venuesPage.searchPlaceholder"),
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 ring-indigo-100 dark:ring-indigo-900 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto hide-scrollbar", children: ["all", "approved", "pending", "rejected"].map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilterStatus(status),
            className: `px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${filterStatus === status ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
            children: status === "all" ? t("venuesPage.filterAll") : status === "approved" ? t("venuesPage.filterApproved") : status === "pending" ? t("venuesPage.filterPending") : t("venuesPage.filterRejected")
          },
          status
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: filterHost,
            onChange: (e) => setFilterHost(e.target.value),
            className: "px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors max-w-[140px] md:max-w-[200px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("venuesPage.allHosts") }),
              hostList.map(([email, name]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: email, children: name }, email))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: filterType,
            onChange: (e) => setFilterType(e.target.value),
            className: "px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("venuesPage.allTypes") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popup", children: t("venuesPage.typePopup") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gallery", children: t("venuesPage.typeGallery") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cafe", children: t("venuesPage.typeCafe") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "flea_market", children: t("venuesPage.typeFleaMarket") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "showroom", children: t("venuesPage.typeShowroom") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm shrink-0", children: ["all", "small", "medium", "large"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilterCategory(size),
            className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${filterCategory === size ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
            children: size === "all" ? t("venuesPage.filterAll") : size
          },
          size
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: sortOption,
                onChange: (e) => setSortOption(e.target.value),
                className: "pl-3 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: t("venuesPage.sortNewest") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: t("venuesPage.sortOldest") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price_high", children: t("venuesPage.sortPriceHigh") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price_low", children: t("venuesPage.sortPriceLow") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_asc", children: t("venuesPage.sortName") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "host", children: t("venuesPage.sortHost") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 14 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setViewMode("grid"),
                className: `p-1.5 md:p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `p-1.5 md:p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 16 })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-600", children: filteredVenues.length }),
        t("venuesPage.venueCount"),
        filterHost !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-500", children: [
          "· ",
          (_a = hostList.find(([e]) => e === filterHost)) == null ? void 0 : _a[1],
          " ",
          t("venuesPage.hostFilter")
        ] })
      ] })
    ] }),
    venueStats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl md:rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50 overflow-hidden animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-sm md:text-base", children: venueStats.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("venuesPage.venueDetailStats") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatsVenue(null), className: "p-2 hover:bg-white/80 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18, className: "text-gray-400" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs text-gray-400 font-bold mb-1", children: t("venuesPage.statStatus") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: venueStats.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs text-gray-400 font-bold mb-1", children: t("venuesPage.statRent") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base md:text-lg font-bold text-gray-900", children: `₩${venueStats.price.toLocaleString()}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs text-gray-400 font-bold mb-1", children: t("venuesPage.statType") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-gray-700 uppercase", children: venueStats.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] md:text-xs text-gray-400 font-bold mb-1", children: t("venuesPage.statCapacity") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base md:text-lg font-bold text-gray-900", children: venueStats.maxSellers > 0 ? t("venuesPage.capacityCount", { count: venueStats.maxSellers }) : t("venuesPage.noLimit") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-indigo-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-indigo-500 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: t("venuesPage.hostLabel") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-gray-900", children: venueStats.owner }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-gray-400", children: venueStats.ownerEmail })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: t("venuesPage.ownedVenues") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-indigo-600", children: venueStats.ownerVenueCount })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-xl p-3 md:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18, className: "text-gray-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: t("venuesPage.locationLabel") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-gray-900 truncate", children: venueStats.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: t("venuesPage.registeredLabel") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-gray-700", children: venueStats.createdAt ? new Date(venueStats.createdAt).toLocaleDateString("ko-KR") : "-" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                handleOpenDrawer(statsVenue);
              },
              className: "flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 }),
                " ",
                t("venuesPage.editButton")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setFilterHost(venueStats.ownerEmail);
                setStatsVenue(null);
              },
              className: "px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 14 }),
                " ",
                t("venuesPage.filterThisHost")
              ]
            }
          )
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" }) }) : viewMode === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[320px] md:auto-rows-[350px]", children: [
      filteredVenues.map((venue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `group relative rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100
                                    ${idx % 7 === 0 ? "md:col-span-2 md:row-span-1" : ""} 
                            `,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: venue.images && venue.images[0] ? venue.images[0] : `https://source.unsplash.com/random/800x600?interior,${idx}`,
                  alt: venue.name,
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 md:top-4 left-3 md:left-4 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/90 backdrop-blur text-gray-900 text-[10px] md:text-xs font-extrabold px-2 md:px-3 py-1 rounded-full uppercase tracking-wide", children: venue.type }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 md:top-4 right-3 md:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatsVenue(venue), className: "p-2 bg-white text-indigo-600 rounded-full hover:bg-indigo-500 hover:text-white transition-colors shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenDrawer(venue), className: "p-2 bg-white text-gray-900 rounded-full hover:bg-indigo-500 hover:text-white transition-colors shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(venue.id), className: "p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300", children: [
              venue.owner_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-indigo-200 font-bold mb-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10 }),
                " ",
                venue.owner_name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-2/3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg md:text-xl font-bold truncate leading-tight mb-1", children: venue.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-300 text-xs md:text-sm flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl font-extrabold text-indigo-300", children: `₩${parseInt(venue.price).toLocaleString()}` }) })
              ] })
            ] })
          ]
        },
        venue.id
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleOpenDrawer(),
          className: "rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 transition-all gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-gray-100 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 28 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", children: t("venuesPage.addNewVenue") })
          ]
        }
      )
    ] }) : (
      /* List View — Mobile-optimized card rows instead of table */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:space-y-3", children: [
        filteredVenues.map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-stretch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 sm:w-28 md:w-36 flex-shrink-0 relative bg-gray-100 overflow-hidden", children: venue.images && venue.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: venue.images[0], alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 24, strokeWidth: 1 }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-3 md:p-4 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm md:text-base font-bold text-gray-900 truncate", children: venue.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: venue.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] md:text-xs text-gray-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "text-gray-400 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location })
                ] }),
                venue.owner_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5 text-[10px] md:text-[11px] text-indigo-500 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10, className: "flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.owner_name })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setStatsVenue(venue),
                    className: "p-1.5 md:p-2 rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors",
                    title: t("venuesPage.viewStats"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleOpenDrawer(venue),
                    className: "p-1.5 md:p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors",
                    title: t("venuesPage.editVenue"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleDelete(venue.id),
                    className: "p-1.5 md:p-2 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors",
                    title: t("venuesPage.deleteVenue"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm md:text-base font-bold text-gray-900", children: `₩${parseInt(venue.price).toLocaleString()}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase", children: venue.type })
            ] })
          ] })
        ] }) }, venue.id)),
        filteredVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: t("venuesPage.noVenuesTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("venuesPage.noVenuesDesc") })
        ] })
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VenueModal,
      {
        isOpen: isDrawerOpen,
        onClose: handleCloseDrawer,
        venue: selectedVenue,
        onSubmit: handleModalSubmit,
        onDelete: selectedVenue ? () => handleDelete(selectedVenue.id) : null,
        isAdmin: true
      }
    ),
    isTypeModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setIsTypeModalOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base md:text-lg font-bold", children: t("venuesPage.typeManageTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsTypeModalOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20, className: "text-gray-400 hover:text-gray-600" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: t("venuesPage.typeCodePlaceholder"),
                className: "flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500",
                value: newTypeCode,
                onChange: (e) => setNewTypeCode(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: t("venuesPage.typeNamePlaceholder"),
                className: "flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500",
                value: newTypeName,
                onChange: (e) => setNewTypeName(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAddType, className: "bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 whitespace-nowrap", children: t("venuesPage.addButton") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar", children: venueTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-gray-800", children: type.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: type.code })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleToggleType(type.id, type.is_active),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${type.is_active == 1 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
                children: type.is_active == 1 ? t("venuesPage.typeActive") : t("venuesPage.typeInactive")
              }
            )
          ] }, type.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: confirmModal, onClose: () => setConfirmModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
export {
  AdminVenues as default
};
