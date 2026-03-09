import { a as useAuth, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, ad as Plus, u as Store, w as TrendingUp, N as Eye, ab as Lock, f as Search, aw as LayoutGrid, ay as List, b7 as Copy, bi as Pen, ap as MapPin, v as Users, az as Calendar, A as AlertTriangle, C as CheckCircle, X as XCircle, a as X } from "./vendor-icons-BFe5lkJJ.js";
import { V as VenueModal } from "./VenueModal-AVUCFW8r.js";
import { u as useDemoGuard } from "./useDemoGuard-CCfUj4xK.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const HostVenues = () => {
  const { user } = useAuth();
  const { t } = useTranslation("host");
  const { isDemoUser, demoAlert } = useDemoGuard();
  const TYPE_LABELS = {
    market: t("venuesPage.typeMarket"),
    popup: t("venuesPage.typePopup"),
    exhibition: t("venuesPage.typeExhibition"),
    festival: t("venuesPage.typeFestival"),
    concert: t("venuesPage.typeConcert"),
    workshop: t("venuesPage.typeWorkshop"),
    fair: t("venuesPage.typeFair"),
    other: t("venuesPage.typeOther")
  };
  const [venues, setVenues] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [isDrawerOpen, setIsDrawerOpen] = reactExports.useState(false);
  const [editingVenue, setEditingVenue] = reactExports.useState(null);
  const [duplicatingVenue, setDuplicatingVenue] = reactExports.useState(null);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const getPricingUnitLabel = (unit) => {
    switch (unit) {
      case "weekly":
        return t("venuesPage.pricingWeekly");
      case "monthly":
        return t("venuesPage.pricingMonthly");
      default:
        return t("venuesPage.pricingDaily");
    }
  };
  const fetchMyVenues = () => {
    setLoading(true);
    fetch(`${API_BASE}/venues/get_my_venues.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setVenues(data);
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  };
  reactExports.useEffect(() => {
    fetchMyVenues();
  }, []);
  const isVenueLocked = (venue) => parseInt(venue.recruitment_closed) === 1 || parseInt(venue.approved_count) > 0;
  const getLockReason = (venue) => {
    if (parseInt(venue.approved_count) > 0) return t("venuesPage.lockReasonApproved");
    if (parseInt(venue.recruitment_closed) === 1) return t("venuesPage.lockReasonClosed");
    return "";
  };
  const filteredVenues = reactExports.useMemo(() => venues.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [venues, searchTerm, filterStatus]);
  const stats = reactExports.useMemo(() => ({
    total: venues.length,
    approved: venues.filter((v) => v.status === "approved").length,
    pending: venues.filter((v) => v.status === "pending").length,
    locked: venues.filter((v) => isVenueLocked(v)).length
  }), [venues]);
  const openDrawer = (venue = null) => {
    if (isDemoUser) {
      demoAlert("공간 등록/수정");
      return;
    }
    setEditingVenue(venue);
    setDuplicatingVenue(null);
    setIsDrawerOpen(true);
  };
  const handleDuplicate = (venue) => {
    if (isDemoUser) {
      demoAlert("공간 복제");
      return;
    }
    const cloned = { ...venue, name: (venue.name || "") + t("venuesPage.copySuffix"), recruitment_start: "", recruitment_end: "", event_start: "", event_end: "", event_periods: null, recruitment_closed: false };
    delete cloned.id;
    delete cloned.status;
    delete cloned.created_at;
    setEditingVenue(null);
    setDuplicatingVenue(cloned);
    setIsDrawerOpen(true);
  };
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const handleModalSubmit = (submitData) => {
    const endpoint = editingVenue ? `${API_BASE}/venues/update_venue.php` : `${API_BASE}/venues/add_venue.php`;
    return fetch(endpoint, { method: "POST", credentials: "include", body: submitData }).then((res) => res.json()).then((data) => {
      if (data.success) {
        showToast(editingVenue ? t("venuesPage.toastVenueUpdated") : t("venuesPage.toastVenueCreated"), "success");
        setIsDrawerOpen(false);
        fetchMyVenues();
      } else {
        showToast(data.message || t("venuesPage.toastError"), "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast(t("venuesPage.toastError"), "error");
    });
  };
  const handleDelete = (id) => {
    if (isDemoUser) {
      demoAlert("공간 삭제");
      return;
    }
    const venue = venues.find((v) => String(v.id) === String(id));
    setConfirmModal({
      title: t("venuesPage.deleteTitle"),
      message: t("venuesPage.deleteMessage", { name: (venue == null ? void 0 : venue.name) || "" }),
      type: "danger",
      onConfirm: () => {
        fetch(`${API_BASE}/venues/delete_venue.php`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id }) }).then((res) => res.json()).then((data) => {
          if (data.success) {
            showToast(t("venuesPage.toastDeleted"), "success");
            setIsDrawerOpen(false);
            fetchMyVenues();
          } else {
            showToast(t("venuesPage.toastDeleteFailed") + data.message, "error");
          }
        }).catch(() => showToast(t("venuesPage.toastError"), "error"));
        setConfirmModal(null);
      }
    });
  };
  const getDday = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
    if (diff < 0) return { text: t("venuesPage.deadline"), color: "text-gray-400" };
    if (diff === 0) return { text: "D-Day", color: "text-red-500" };
    if (diff <= 3) return { text: `D-${diff}`, color: "text-orange-500" };
    return { text: `D-${diff}`, color: "text-indigo-500" };
  };
  const statusConfig = {
    approved: { label: t("venuesPage.statusApproved"), dot: "bg-emerald-500", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", listBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    pending: { label: t("venuesPage.statusPending"), dot: "bg-amber-500", bg: "bg-amber-500/15 text-amber-400 border-amber-500/20", listBg: "bg-amber-50 text-amber-700 border-amber-200" },
    rejected: { label: t("venuesPage.statusRejected"), dot: "bg-red-500", bg: "bg-red-500/15 text-red-400 border-red-500/20", listBg: "bg-red-50 text-red-700 border-red-200" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-20 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 font-bold text-sm tracking-wide mb-1", children: "SPACE MANAGEMENT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight", children: t("venuesPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm font-medium mt-1", children: t("venuesPage.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => openDrawer(),
            className: "inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200/60 hover:shadow-xl hover:shadow-indigo-300/60 hover:-translate-y-0.5 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              " ",
              t("venuesPage.addVenue")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        { label: t("venuesPage.statsTotal"), value: stats.total, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16 }), color: "from-slate-500 to-slate-700" },
        { label: t("venuesPage.statsApproved"), value: stats.approved, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }), color: "from-emerald-500 to-emerald-700" },
        { label: t("venuesPage.statsPending"), value: stats.pending, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }), color: "from-amber-500 to-amber-600" },
        { label: t("venuesPage.statsLocked"), value: stats.locked, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16 }), color: "from-red-500 to-rose-600" }
      ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-4 group hover:shadow-md transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider", children: s.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900 mt-1", children: s.value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center opacity-80`, children: s.icon })
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-sm rounded-2xl p-2.5 mb-6 flex flex-col md:flex-row gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: t("venuesPage.searchPlaceholder"),
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 w-full md:w-auto overflow-x-auto", children: ["all", "approved", "pending", "rejected"].map((status) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilterStatus(status),
            className: `px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200
                                ${filterStatus === status ? "bg-gray-900 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`,
            children: status === "all" ? t("venuesPage.filterAll") : ((_a = statusConfig[status]) == null ? void 0 : _a.label) || status
          },
          status
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-auto flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("list"), className: `p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 15 }) })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-600 border-t-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium", children: t("venuesPage.loading") })
    ] }) : filteredVenues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 32, className: "text-gray-300" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: t("venuesPage.noVenues") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm mb-6", children: t("venuesPage.noVenuesDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openDrawer(), className: "inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        " ",
        t("venuesPage.addNewVenue")
      ] })
    ] }) : viewMode === "grid" ? (
      /* Grid View */
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: filteredVenues.map((venue) => {
        const locked = isVenueLocked(venue);
        const sc = statusConfig[venue.status] || statusConfig.pending;
        const dday = getDday(venue.recruitment_deadline);
        const approved = parseInt(venue.approved_count) || 0;
        const max = parseInt(venue.max_sellers) || 0;
        const typeLabel = TYPE_LABELS[venue.type] || venue.type;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 bg-gray-100 overflow-hidden", children: [
            venue.images && venue.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: venue.images[0], alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-300 gap-2 bg-gradient-to-br from-gray-50 to-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 36, strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: t("venuesPage.noImage") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md border ${sc.bg}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${sc.dot}` }),
                sc.label
              ] }),
              locked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold rounded-lg border border-white/10", title: getLockReason(venue), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                " ",
                t("venuesPage.locked")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDuplicate(venue), className: "p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-white shadow-sm transition-all", title: t("venuesPage.duplicate"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 15 }) }),
              locked ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => alert(getLockReason(venue)), className: "p-2 bg-red-500/20 backdrop-blur-sm rounded-lg text-red-200 cursor-not-allowed", title: getLockReason(venue), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 15 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openDrawer(venue), className: "p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-white shadow-sm transition-all", title: t("venuesPage.edit"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 15 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-gray-900", children: Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: t("venuesPage.free") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: `₩${parseInt(venue.price).toLocaleString()}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-[10px] font-medium ml-0.5", children: getPricingUnitLabel(venue.pricing_unit) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-indigo-500 uppercase tracking-wider", children: typeLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 line-clamp-1 mt-0.5 group-hover:text-indigo-600 transition-colors", children: venue.name })
              ] }),
              dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-extrabold ${dday.color} flex-shrink-0`, children: dday.text })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-gray-500 text-xs mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-gray-400 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700", children: approved }),
                max > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
                  "/ ",
                  max
                ] })
              ] }),
              venue.recruitment_deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  new Date(venue.recruitment_deadline).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
                  " ",
                  t("venuesPage.deadlineSuffix")
                ] })
              ] })
            ] })
          ] })
        ] }, venue.id);
      }) })
    ) : (
      /* List View */
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: filteredVenues.map((venue) => {
        const locked = isVenueLocked(venue);
        const sc = statusConfig[venue.status] || statusConfig.pending;
        const dday = getDday(venue.recruitment_deadline);
        const approved = parseInt(venue.approved_count) || 0;
        const max = parseInt(venue.max_sellers) || 0;
        const typeLabel = TYPE_LABELS[venue.type] || venue.type;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-stretch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28 sm:w-36 flex-shrink-0 relative bg-gray-50 overflow-hidden", children: [
            venue.images && venue.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: venue.images[0], alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 24, strokeWidth: 1.5 }) }),
            locked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-red-900/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, className: "text-red-400/70" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-3.5 sm:p-4 min-w-0 flex flex-col justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${sc.listBg}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${sc.dot}` }),
                  sc.label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: typeLabel }),
                locked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-[9px] font-bold text-red-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 8 }),
                  " ",
                  t("venuesPage.locked")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 truncate", children: venue.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-gray-500 truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "text-gray-400 flex-shrink-0" }),
                  venue.location
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-gray-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10, className: "text-gray-400" }),
                  approved,
                  max > 0 ? `/${max}` : ""
                ] }),
                dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-extrabold ${dday.color}`, children: dday.text })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-900 hidden sm:block", children: Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: t("venuesPage.free") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: `₩${parseInt(venue.price).toLocaleString()}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDuplicate(venue), className: "p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors", title: t("venuesPage.duplicate"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }) }),
                locked ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => alert(getLockReason(venue)), className: "p-1.5 rounded-lg bg-red-50 text-red-400 cursor-not-allowed", title: getLockReason(venue), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 13 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openDrawer(venue), className: "p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors", title: t("venuesPage.edit"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13 }) })
              ] })
            ] })
          ] }) })
        ] }) }, venue.id);
      }) })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VenueModal,
      {
        isOpen: isDrawerOpen,
        onClose: () => {
          setIsDrawerOpen(false);
          setDuplicatingVenue(null);
        },
        venue: editingVenue,
        initialData: duplicatingVenue,
        onSubmit: handleModalSubmit,
        onDelete: editingVenue && !isVenueLocked(editingVenue) ? () => handleDelete(editingVenue.id) : null
      }
    ),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4", style: { backgroundColor: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 flex items-center gap-3 ${confirmModal.type === "danger" ? "bg-red-50" : "bg-amber-50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === "danger" ? "bg-red-100" : "bg-amber-100"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 20, className: confirmModal.type === "danger" ? "text-red-500" : "text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900", children: confirmModal.title }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed whitespace-pre-line", children: confirmModal.message }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setConfirmModal(null),
            className: "flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors",
            children: t("venuesPage.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: confirmModal.onConfirm,
            className: `flex-1 py-3 rounded-xl text-sm font-bold transition-colors text-white ${confirmModal.type === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`,
            children: confirmModal.type === "danger" ? t("venuesPage.delete") : t("venuesPage.confirm")
          }
        )
      ] })
    ] }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`, children: [
      toast.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 18, className: "text-emerald-500 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 18, className: "text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: toast.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setToast(null), className: "ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14, className: "text-gray-400" }) })
    ] }) })
  ] });
};
export {
  HostVenues as default
};
