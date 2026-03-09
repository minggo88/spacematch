import { u as useData, a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, f as Search, av as Filter, q as Building, aI as ArrowUpDown, az as Calendar, aJ as RotateCcw, an as Zap, N as Eye, d as Check, a as X, aK as Undo2, t as ClipboardList, ac as Tag, aA as Image, aa as Mail, ah as Phone, aj as Instagram, l as ChevronLeft, b as ChevronRight, C as CheckCircle, A as AlertTriangle } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const CATEGORY_KEYS = [
  "fashion",
  "beauty",
  "food",
  "living",
  "art",
  "stationery",
  "digital",
  "activity",
  "eco",
  "pet",
  "kids",
  "handmade",
  "vintage",
  "perfume",
  "book"
];
const getCategoryColor = (cat) => {
  const colors = {
    fashion: "bg-pink-50 text-pink-600",
    beauty: "bg-fuchsia-50 text-fuchsia-600",
    food: "bg-orange-50 text-orange-600",
    living: "bg-emerald-50 text-emerald-600",
    art: "bg-violet-50 text-violet-600",
    stationery: "bg-blue-50 text-blue-600",
    digital: "bg-cyan-50 text-cyan-600",
    activity: "bg-lime-50 text-lime-600",
    eco: "bg-green-50 text-green-600",
    pet: "bg-amber-50 text-amber-600",
    kids: "bg-rose-50 text-rose-600",
    handmade: "bg-yellow-50 text-yellow-600",
    vintage: "bg-stone-100 text-stone-600",
    perfume: "bg-purple-50 text-purple-600",
    book: "bg-sky-50 text-sky-600"
  };
  return colors[cat] || "bg-gray-50 text-gray-600";
};
const AdminApplications = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { applications, updateApplicationStatus, fetchApplications } = useData();
  const { user } = useAuth();
  const { t } = useTranslation("admin");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterCategory, setFilterCategory] = reactExports.useState("all");
  const [filterVenue, setFilterVenue] = reactExports.useState("all");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("newest");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [rejectionReason, setRejectionReason] = reactExports.useState("");
  const [sellerProfile, setSellerProfile] = reactExports.useState(null);
  const [sellerProfileLoading, setSellerProfileLoading] = reactExports.useState(false);
  const [lightboxPhotos, setLightboxPhotos] = reactExports.useState([]);
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(0);
  const [mobileActionId, setMobileActionId] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const fetchSellerProfile = async (userId) => {
    if (!userId) return;
    setSellerProfileLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/get_public_profile.php?id=${userId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSellerProfile(data);
      }
    } catch (err) {
      console.error("Seller profile load failed:", err);
    } finally {
      setSellerProfileLoading(false);
    }
  };
  const uniqueVenues = reactExports.useMemo(
    () => [...new Set(applications.map((a) => a.venue_name || a.venueName).filter(Boolean))].sort(),
    [applications]
  );
  const filteredApps = reactExports.useMemo(() => {
    let result = applications.filter((app) => {
      const matchesStatus = filterStatus === "all" || app.status === filterStatus;
      const cat = app.applicant_category || app.sellerCategory || "";
      const matchesCategory = filterCategory === "all" || cat === filterCategory || filterCategory === "other" && !CATEGORY_KEYS.includes(cat);
      const venueName = app.venue_name || app.venueName || "";
      const matchesVenue = filterVenue === "all" || venueName === filterVenue;
      const name = (app.applicant_name || app.sellerName || "").toLowerCase();
      const email = (app.applicant_email || app.sellerEmail || "").toLowerCase();
      const brand = (app.applicant_brand || "").toLowerCase();
      const venue = venueName.toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || name.includes(term) || email.includes(term) || venue.includes(term) || brand.includes(term);
      let matchesDate = true;
      const appDate = app.created_at || app.appliedAt;
      if (dateFrom && appDate) {
        matchesDate = new Date(appDate) >= new Date(dateFrom);
      }
      if (dateTo && appDate && matchesDate) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        matchesDate = new Date(appDate) <= end;
      }
      return matchesStatus && matchesCategory && matchesVenue && matchesSearch && matchesDate;
    });
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at || b.appliedAt) - new Date(a.created_at || a.appliedAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at || a.appliedAt) - new Date(b.created_at || b.appliedAt));
        break;
      case "priority":
        result.sort((a, b) => (b.is_priority || 0) - (a.is_priority || 0) || new Date(b.created_at || b.appliedAt) - new Date(a.created_at || a.appliedAt));
        break;
      case "name_asc":
        result.sort((a, b) => (a.applicant_name || a.sellerName || "").localeCompare(b.applicant_name || b.sellerName || "", "ko"));
        break;
      case "name_desc":
        result.sort((a, b) => (b.applicant_name || b.sellerName || "").localeCompare(a.applicant_name || a.sellerName || "", "ko"));
        break;
      case "venue_asc":
        result.sort((a, b) => (a.venue_name || a.venueName || "").localeCompare(b.venue_name || b.venueName || "", "ko"));
        break;
    }
    return result;
  }, [applications, filterStatus, filterCategory, filterVenue, searchTerm, sortBy, dateFrom, dateTo]);
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    priority: applications.filter((a) => a.is_priority == 1).length
  };
  const handleTogglePriority = async (app) => {
    const newPriority = app.is_priority == 1 ? 0 : 1;
    try {
      const res = await fetch(`${API_BASE}/applications/toggle_priority.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ application_id: app.id, is_priority: newPriority })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        fetchApplications();
      } else {
        showToast(t("applicationsPage.processFailed") + data.message, "error");
      }
    } catch (err) {
      showToast(t("applicationsPage.processError"), "error");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ko-KR");
  };
  const CATEGORY_LABEL_MAP = {
    fashion: t("applicationsPage.catFashion"),
    beauty: t("applicationsPage.catBeauty"),
    food: t("applicationsPage.catFood"),
    living: t("applicationsPage.catLiving"),
    art: t("applicationsPage.catArt"),
    stationery: t("applicationsPage.catStationery"),
    digital: t("applicationsPage.catDigital"),
    activity: t("applicationsPage.catActivity"),
    eco: t("applicationsPage.catEco"),
    pet: t("applicationsPage.catPet"),
    kids: t("applicationsPage.catKids"),
    handmade: t("applicationsPage.catHandmade"),
    vintage: t("applicationsPage.catVintage"),
    perfume: t("applicationsPage.catPerfume"),
    book: t("applicationsPage.catBook")
  };
  const getCategoryLabel = (cat) => CATEGORY_LABEL_MAP[cat] || cat || "-";
  const hasActiveFilters = filterCategory !== "all" || filterVenue !== "all" || searchTerm || dateFrom || dateTo;
  const clearFilters = () => {
    setFilterCategory("all");
    setFilterVenue("all");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setSortBy("newest");
  };
  const handleApprove = (app) => {
    setConfirmModal({
      title: t("applicationsPage.approveTitle"),
      message: t("applicationsPage.approveMsg", { name: app.applicant_name || app.sellerName, venue: app.venue_name || app.venueName }),
      type: "success",
      confirmLabel: t("applicationsPage.approve"),
      onConfirm: () => {
        updateApplicationStatus(app.id, "approved");
        showToast(t("applicationsPage.approvedToast"), "success");
        setConfirmModal(null);
      }
    });
  };
  const handleReject = (app) => {
    setRejectionReason("");
    setConfirmModal({
      title: t("applicationsPage.rejectTitle"),
      message: t("applicationsPage.rejectMsg", { name: app.applicant_name || app.sellerName, venue: app.venue_name || app.venueName }),
      type: "danger",
      confirmLabel: t("applicationsPage.rejected"),
      showRejectionReason: true,
      onConfirm: (reason) => {
        const body = { id: app.id, status: "rejected" };
        if (reason) body.rejection_reason = reason;
        fetch(`${API_BASE}/applications/update_status.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body)
        }).then((res) => res.json()).then((data) => {
          if (data.success) {
            showToast(t("applicationsPage.rejectedToast"), "success");
            updateApplicationStatus(app.id, "rejected");
          } else {
            showToast(t("applicationsPage.processFailed") + data.message, "error");
          }
        }).catch(() => showToast(t("applicationsPage.processError"), "error"));
        setConfirmModal(null);
        setRejectionReason("");
      }
    });
  };
  const handleRevert = (app, toStatus) => {
    const label = t("applicationsPage.statusPending");
    setConfirmModal({
      title: t("applicationsPage.revertTitle"),
      message: t("applicationsPage.revertMsg", { name: app.applicant_name || app.sellerName, status: label }),
      type: "warning",
      confirmLabel: t("applicationsPage.revertConfirm"),
      onConfirm: () => {
        updateApplicationStatus(app.id, toStatus);
        showToast(t("applicationsPage.revertedToast", { status: label }), "success");
        setConfirmModal(null);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: t("applicationsPage.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2 font-medium", children: t("applicationsPage.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("all"), className: `p-4 rounded-2xl border transition-all ${filterStatus === "all" ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100" : "bg-white border-gray-100 hover:border-indigo-100"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-xs font-bold uppercase", children: t("applicationsPage.totalApps") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 mt-1", children: stats.total })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("pending"), className: `p-4 rounded-2xl border transition-all ${filterStatus === "pending" ? "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-100" : "bg-white border-gray-100 hover:border-yellow-100"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-600 text-xs font-bold uppercase", children: t("applicationsPage.pendingReview") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 mt-1", children: stats.pending })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("approved"), className: `p-4 rounded-2xl border transition-all ${filterStatus === "approved" ? "bg-green-50 border-green-200 ring-2 ring-green-100" : "bg-white border-gray-100 hover:border-green-100"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-600 text-xs font-bold uppercase", children: t("applicationsPage.statusApproved") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 mt-1", children: stats.approved })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("rejected"), className: `p-4 rounded-2xl border transition-all ${filterStatus === "rejected" ? "bg-red-50 border-red-200 ring-2 ring-red-100" : "bg-white border-gray-100 hover:border-red-100"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-xs font-bold uppercase", children: t("applicationsPage.statusRejected") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 mt-1", children: stats.rejected })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: t("applicationsPage.searchPlaceholder"),
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filterCategory,
              onChange: (e) => setFilterCategory(e.target.value),
              className: "pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("applicationsPage.allCategories") }),
                CATEGORY_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: CATEGORY_LABEL_MAP[key] }, key)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: t("applicationsPage.otherCategory") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filterVenue,
              onChange: (e) => setFilterVenue(e.target.value),
              className: "pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("applicationsPage.allVenues") }),
                uniqueVenues.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v, children: v }, v))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: "pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all appearance-none cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: t("applicationsPage.sortNewest") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: t("applicationsPage.sortOldest") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "priority", children: t("applicationsPage.sortPriority") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_asc", children: t("applicationsPage.sortNameAsc") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_desc", children: t("applicationsPage.sortNameDesc") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "venue_asc", children: t("applicationsPage.sortVenue") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-gray-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: dateFrom,
              onChange: (e) => setDateFrom(e.target.value),
              className: "px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-sm", children: "~" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: dateTo,
              onChange: (e) => setDateTo(e.target.value),
              className: "px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 font-medium", children: [
            t("applicationsPage.resultCount", { total: stats.total }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-600 font-bold", children: t("applicationsPage.resultFiltered", { count: filteredApps.length }) })
          ] }),
          hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: clearFilters, className: "flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 12 }),
            t("applicationsPage.resetFilters")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider", children: t("applicationsPage.thBrand") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider", children: t("applicationsPage.thCategory") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider", children: t("applicationsPage.thVenue") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider", children: t("applicationsPage.thDate") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider", children: t("applicationsPage.thStatus") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right", children: t("applicationsPage.thActions") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-gray-100", children: [
          filteredApps.map((app) => {
            const category = app.applicant_category || app.sellerCategory || "";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `transition-colors group ${app.is_priority == 1 ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-gray-50/80"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => fetchSellerProfile(app.user_id),
                  className: "text-left hover:opacity-80 transition-opacity",
                  title: t("applicationsPage.viewProfile"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      app.is_priority == 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold rounded-md", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 9, fill: "white" }),
                        t("applicationsPage.fastTrack")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 decoration-indigo-200", children: app.applicant_name || app.sellerName })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: app.applicant_email || app.sellerEmail })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(category)}`, children: getCategoryLabel(category) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-sm text-gray-700 font-medium", children: app.venue_name || app.venueName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-sm text-gray-500", children: formatDate(app.created_at || app.appliedAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-bold
                                                ${app.status === "pending" ? "bg-yellow-100 text-yellow-700" : app.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: app.status === "pending" ? t("applicationsPage.statusPending") : app.status === "approved" ? t("applicationsPage.statusApproved") : t("applicationsPage.statusRejected") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => fetchSellerProfile(app.user_id),
                    className: "p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors",
                    title: t("applicationsPage.sellerProfile"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 15 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleTogglePriority(app),
                    className: `p-2 rounded-lg transition-colors ${app.is_priority == 1 ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-500"}`,
                    title: app.is_priority == 1 ? t("applicationsPage.fastTrackOff") : t("applicationsPage.fastTrackOn"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 15, fill: app.is_priority == 1 ? "currentColor" : "none" })
                  }
                ),
                app.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleApprove(app),
                      className: "p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors",
                      title: t("applicationsPage.approve"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 15 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleReject(app),
                      className: "p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors",
                      title: t("applicationsPage.reject"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
                    }
                  )
                ] }),
                app.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleRevert(app, "pending"),
                    className: "p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors",
                    title: t("applicationsPage.cancelApproval"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { size: 15 })
                  }
                ),
                app.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleRevert(app, "pending"),
                    className: "p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors",
                    title: t("applicationsPage.reReview"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 15 })
                  }
                )
              ] }) })
            ] }, app.id);
          }),
          filteredApps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: "6", className: "py-16 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 40, className: "mx-auto text-gray-200 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("applicationsPage.noResults") }),
            hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearFilters, className: "mt-2 text-xs text-indigo-500 font-bold hover:underline", children: t("applicationsPage.resetFilter") })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden", children: [
        filteredApps.map((app) => {
          const category = app.applicant_category || app.sellerCategory || "";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border-b border-gray-100 last:border-0 ${app.is_priority == 1 ? "bg-amber-50/40" : ""}`, children: [
            app.is_priority == 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "text-white", fill: "white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[11px] font-extrabold tracking-wide", children: t("applicationsPage.fastTrackPriority") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fetchSellerProfile(app.user_id), className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-indigo-600 underline underline-offset-2", children: app.applicant_name || app.sellerName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: app.applicant_email || app.sellerEmail })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-bold
                                        ${app.status === "pending" ? "bg-yellow-100 text-yellow-700" : app.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: app.status === "pending" ? t("applicationsPage.statusPendingShort") : app.status === "approved" ? t("applicationsPage.statusApprovedShort") : t("applicationsPage.statusRejectedShort") }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: t("applicationsPage.categoryLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${getCategoryColor(category)}`, children: getCategoryLabel(category) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: t("applicationsPage.venueLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-900", children: app.venue_name || app.venueName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: t("applicationsPage.dateLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-900", children: formatDate(app.created_at || app.appliedAt) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => fetchSellerProfile(app.user_id),
                    className: "flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
                      " ",
                      t("applicationsPage.profile")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleTogglePriority(app),
                    className: `py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${app.is_priority == 1 ? "bg-amber-100 text-amber-600 border border-amber-200" : "bg-gray-50 text-gray-400 border border-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, fill: app.is_priority == 1 ? "currentColor" : "none" }),
                      " ",
                      app.is_priority == 1 ? t("applicationsPage.priorityOff") : t("applicationsPage.priorityOn")
                    ]
                  }
                ),
                app.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleApprove(app),
                      className: "flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold",
                      children: t("applicationsPage.approve")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleReject(app),
                      className: "flex-1 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold",
                      children: t("applicationsPage.reject")
                    }
                  )
                ] }),
                app.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleRevert(app, "pending"),
                    className: "flex-1 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { size: 14 }),
                      " ",
                      t("applicationsPage.cancelApprovalShort")
                    ]
                  }
                ),
                app.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleRevert(app, "pending"),
                    className: "flex-1 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 14 }),
                      " ",
                      t("applicationsPage.reReviewShort")
                    ]
                  }
                )
              ] })
            ] })
          ] }, app.id);
        }),
        filteredApps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 40, className: "mx-auto text-gray-200 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("applicationsPage.noResultsMobile") })
        ] })
      ] })
    ] }),
    sellerProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSellerProfile(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-white/30", children: ((_a = sellerProfile.user) == null ? void 0 : _a.profile_image) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sellerProfile.user.profile_image, alt: "", className: "w-full h-full object-cover" }) : (((_b = sellerProfile.user) == null ? void 0 : _b.name) || "?")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: (_c = sellerProfile.user) == null ? void 0 : _c.name }),
              ((_d = sellerProfile.user) == null ? void 0 : _d.category) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm", children: getCategoryLabel(sellerProfile.user.category) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSellerProfile(null), className: "text-white/80 hover:text-white p-1 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[70vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-violet-50 rounded-xl border border-violet-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-violet-500 uppercase tracking-wider mb-2", children: t("applicationsPage.salesInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-violet-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-violet-800", children: getCategoryLabel((_e = sellerProfile.user) == null ? void 0 : _e.category) })
          ] }),
          ((_f = sellerProfile.user) == null ? void 0 : _f.description) ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap", children: sellerProfile.user.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 italic mt-2", children: t("applicationsPage.noBrandDesc") })
        ] }),
        ((_g = sellerProfile.seller_photos) == null ? void 0 : _g.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 12 }),
            t("applicationsPage.productPhotos")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: sellerProfile.seller_photos.map((photo, idx) => {
            var _a2, _b2;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all",
                onClick: () => {
                  setLightboxPhotos(sellerProfile.seller_photos);
                  setLightboxIndex(idx);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ((_b2 = (_a2 = photo.image_url) == null ? void 0 : _a2.startsWith) == null ? void 0 : _b2.call(_a2, "uploads/")) ? `/${photo.image_url}` : photo.image_url, alt: t("applicationsPage.productAlt", { num: idx + 1 }), className: "w-full h-full object-cover" })
              },
              photo.id || idx
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-6 py-3 border-y border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-indigo-600", children: ((_h = sellerProfile.applications) == null ? void 0 : _h.length) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.applicationCount") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("applicationsPage.contactInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-indigo-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.emailLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: ((_i = sellerProfile.user) == null ? void 0 : _i.email) || t("applicationsPage.notRegistered") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-indigo-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.phoneLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${((_j = sellerProfile.user) == null ? void 0 : _j.phone) ? "text-gray-800" : "text-gray-400 italic"}`, children: ((_k = sellerProfile.user) == null ? void 0 : _k.phone) || t("applicationsPage.notRegistered") })
              ] })
            ] }),
            ((_l = sellerProfile.user) == null ? void 0 : _l.instagram) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 16, className: "text-violet-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.instagramLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `https://instagram.com/${sellerProfile.user.instagram.replace("@", "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors",
                    children: [
                      "@",
                      sellerProfile.user.instagram.replace("@", "")
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("applicationsPage.businessInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-indigo-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.joinDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: ((_m = sellerProfile.user) == null ? void 0 : _m.created_at) ? new Date(sellerProfile.user.created_at).toLocaleDateString("ko-KR") : "-" })
            ] })
          ] }) })
        ] })
      ] })
    ] }) }),
    lightboxPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/90 z-[60] flex items-center justify-center", onClick: () => setLightboxPhotos([]), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLightboxPhotos([]), className: "absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold", children: [
        lightboxIndex + 1,
        " / ",
        lightboxPhotos.length
      ] }),
      lightboxIndex > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setLightboxIndex((i) => i - 1);
          },
          className: "absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 28 })
        }
      ),
      lightboxIndex < lightboxPhotos.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setLightboxIndex((i) => i + 1);
          },
          className: "absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 28 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: (() => {
            var _a2, _b2;
            const url = ((_a2 = lightboxPhotos[lightboxIndex]) == null ? void 0 : _a2.image_url) || "";
            return ((_b2 = url.startsWith) == null ? void 0 : _b2.call(url, "uploads/")) ? `/${url}` : url;
          })(),
          alt: "",
          className: "max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl",
          onClick: (e) => e.stopPropagation()
        }
      )
    ] }),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4", style: { backgroundColor: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 flex items-center gap-3 ${confirmModal.type === "danger" ? "bg-red-50" : confirmModal.type === "success" ? "bg-emerald-50" : "bg-amber-50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === "danger" ? "bg-red-100" : confirmModal.type === "success" ? "bg-emerald-100" : "bg-amber-100"}`, children: confirmModal.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 20, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 20, className: confirmModal.type === "danger" ? "text-red-500" : "text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900", children: confirmModal.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed whitespace-pre-line", children: confirmModal.message }),
        confirmModal.showRejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1.5", children: t("applicationsPage.rejectionLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: rejectionReason,
              onChange: (e) => setRejectionReason(e.target.value),
              placeholder: t("applicationsPage.rejectionPlaceholder"),
              rows: 3,
              className: "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setConfirmModal(null),
            className: "flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors",
            children: t("applicationsPage.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => confirmModal.onConfirm(rejectionReason),
            className: `flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === "danger" ? "bg-red-500 hover:bg-red-600" : confirmModal.type === "success" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`,
            children: confirmModal.confirmLabel || t("applicationsPage.confirm")
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
export {
  AdminApplications as default
};
