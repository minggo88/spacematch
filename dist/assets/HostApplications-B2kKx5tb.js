import { a as useAuth, b as useNavigate, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, f as Search, a1 as MessageSquare, an as Zap, aM as BadgeCheck, u as Store, az as Calendar, a0 as ChevronDown, F as FileText, D as Download, C as CheckCircle, X as XCircle, M as MessageCircle, N as Eye, ac as Tag, aa as Mail, ah as Phone, aj as Instagram, aq as Clock, A as AlertTriangle, a as X, aA as Image, l as ChevronLeft, b as ChevronRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useDemoGuard } from "./useDemoGuard-CCfUj4xK.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const HostApplications = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("host");
  const { isDemoUser, demoAlert } = useDemoGuard();
  const CATEGORY_LABELS = {
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
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 6e4);
    if (mins < 60) return t("applicationsPage.minutesAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("applicationsPage.hoursAgo", { count: hrs });
    const days = Math.floor(hrs / 24);
    if (days < 7) return t("applicationsPage.daysAgo", { count: days });
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };
  const calcExperience = (joinedAt) => {
    if (!joinedAt) return null;
    const diff = Date.now() - new Date(joinedAt).getTime();
    const months = Math.floor(diff / (1e3 * 60 * 60 * 24 * 30));
    if (months < 1) return t("applicationsPage.experienceNew");
    if (months < 12) return t("applicationsPage.experienceMonths", { count: months });
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? t("applicationsPage.experienceYearsMonths", { years, months: rem }) : t("applicationsPage.experienceYears", { years });
  };
  const [applications, setApplications] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [appFilterCategory, setAppFilterCategory] = reactExports.useState("all");
  const [appFilterStatus, setAppFilterStatus] = reactExports.useState("all");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [rejectionReason, setRejectionReason] = reactExports.useState("");
  const [toast, setToast] = reactExports.useState(null);
  const [sellerDetail, setSellerDetail] = reactExports.useState(null);
  const [sellerDetailLoading, setSellerDetailLoading] = reactExports.useState(false);
  const [lightboxPhotos, setLightboxPhotos] = reactExports.useState([]);
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(0);
  const [hasViewingSub, setHasViewingSub] = reactExports.useState(false);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const fetchApplications = () => {
    setLoading(true);
    fetch(`${API_BASE}/applications/get_applications.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setApplications(data);
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  };
  reactExports.useEffect(() => {
    fetchApplications();
  }, []);
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/payments/check_subscription.php?category=priority_viewing`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.active) setHasViewingSub(true);
    }).catch(() => {
    });
  }, []);
  const fetchSellerDetail = async (userId) => {
    setSellerDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/get_public_profile.php?id=${userId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSellerDetail(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSellerDetailLoading(false);
    }
  };
  const handleApplicationAction = (appId, status, applicantName) => {
    if (isDemoUser) {
      demoAlert(status === "approved" ? "신청 승인" : "신청 거절");
      return;
    }
    const isApprove = status === "approved";
    setRejectionReason("");
    setConfirmModal({
      title: isApprove ? t("applicationsPage.approveTitle") : t("applicationsPage.rejectTitle"),
      message: isApprove ? t("applicationsPage.approveConfirm", { name: applicantName || "" }) : t("applicationsPage.rejectConfirm", { name: applicantName || "" }),
      type: isApprove ? "success" : "danger",
      confirmLabel: isApprove ? t("applicationsPage.approveLabel") : t("applicationsPage.rejectLabel"),
      showRejectionReason: !isApprove,
      onConfirm: (reason) => {
        const body = { id: appId, status };
        if (!isApprove && reason) {
          body.rejection_reason = reason;
        }
        fetch(`${API_BASE}/applications/update_status.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body)
        }).then((res) => res.json()).then((data) => {
          if (data.success) {
            showToast(isApprove ? t("applicationsPage.toastApproved") : t("applicationsPage.toastRejected"), "success");
            fetchApplications();
          } else {
            showToast(t("applicationsPage.toastFailed") + data.message, "error");
          }
        }).catch(() => showToast(t("applicationsPage.toastError"), "error"));
        setConfirmModal(null);
        setRejectionReason("");
      }
    });
  };
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;
  const filteredApplications = applications.filter((app) => {
    const matchesCategory = appFilterCategory === "all" || app.applicant_category === appFilterCategory || appFilterCategory === "other" && !Object.keys(CATEGORY_LABELS).includes(app.applicant_category);
    const matchesStatus = appFilterStatus === "all" || app.status === appFilterStatus;
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (app.applicant_name || "").toLowerCase().includes(q);
      const brandMatch = (app.applicant_brand || "").toLowerCase().includes(q);
      const emailMatch = (app.applicant_email || "").toLowerCase().includes(q);
      const venueMatch = (app.venue_name || "").toLowerCase().includes(q);
      const kwMatch = Array.isArray(app.applicant_keywords) && app.applicant_keywords.some((kw) => kw.toLowerCase().includes(q));
      const catMatch = (CATEGORY_LABELS[app.applicant_category] || app.applicant_category || "").toLowerCase().includes(q);
      matchesSearch = nameMatch || brandMatch || emailMatch || venueMatch || kwMatch || catMatch;
    }
    return matchesCategory && matchesStatus && matchesSearch;
  });
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-20 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-gray-900", children: t("applicationsPage.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("applicationsPage.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3", children: [
      { label: t("applicationsPage.statsAll"), count: applications.length, color: "text-gray-900", bg: "bg-white border-gray-200" },
      { label: t("applicationsPage.statsPending"), count: pendingApps, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
      { label: t("applicationsPage.statsApproved"), count: approvedApps, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
      { label: t("applicationsPage.statsRejected"), count: rejectedApps, color: "text-red-500", bg: "bg-red-50 border-red-200" }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${s.bg} rounded-xl p-3 border text-center`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-extrabold ${s.color}`, children: s.count }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-500 mt-0.5", children: s.label })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: t("applicationsPage.searchPlaceholder"),
            className: "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: t("applicationsPage.resultCount", { count: filteredApplications.length }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: appFilterStatus,
              onChange: (e) => setAppFilterStatus(e.target.value),
              className: "px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("applicationsPage.filterAllStatus") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: t("applicationsPage.filterPending") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approved", children: t("applicationsPage.filterApproved") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: t("applicationsPage.filterRejected") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: appFilterCategory,
              onChange: (e) => setAppFilterCategory(e.target.value),
              className: "px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("applicationsPage.filterAllCategory") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fashion", children: t("applicationsPage.catFashion") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "beauty", children: t("applicationsPage.catBeauty") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "food", children: t("applicationsPage.catFood") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "living", children: t("applicationsPage.catLiving") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "art", children: t("applicationsPage.catArt") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: t("applicationsPage.catOther") })
              ]
            }
          )
        ] })
      ] })
    ] }),
    filteredApplications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-10 h-10 mx-auto text-gray-300 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium text-sm", children: t("applicationsPage.noApplications") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredApplications.map((app) => {
      const initial = (app.applicant_name || "?")[0];
      const isExpanded = expandedId === app.id;
      const experience = calcExperience(app.applicant_joined_at);
      const keywords = Array.isArray(app.applicant_keywords) ? app.applicant_keywords : [];
      const statusConfig = {
        pending: { label: t("applicationsPage.statusPendingLabel"), dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
        approved: { label: t("applicationsPage.statusApprovedLabel"), dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
        rejected: { label: t("applicationsPage.statusRejectedLabel"), dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50" }
      }[app.status] || { label: app.status, dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white rounded-2xl border transition-all duration-200 ${app.is_priority ? "border-amber-300 shadow-md ring-1 ring-amber-200/50" : app.status === "pending" ? "border-amber-200 shadow-sm" : "border-gray-100"}`, children: [
        app.is_priority ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center gap-1.5 rounded-t-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "text-white", fill: "white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[11px] font-extrabold tracking-wide", children: t("applicationsPage.fastTrack") })
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-4 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-2xl",
            onClick: () => setExpandedId(isExpanded ? null : app.id),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-extrabold flex-shrink-0 ${app.status === "pending" ? "bg-gradient-to-br from-amber-400 to-orange-500" : app.status === "approved" ? "bg-gradient-to-br from-emerald-400 to-teal-500" : "bg-gradient-to-br from-gray-300 to-gray-400"}`, children: initial }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h4",
                    {
                      className: "font-bold text-gray-900 text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors",
                      onClick: (e) => {
                        e.stopPropagation();
                        if (app.user_id) fetchSellerDetail(app.user_id);
                      },
                      children: app.applicant_name || t("applicationsPage.noName")
                    }
                  ),
                  app.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }),
                    " ",
                    t("applicationsPage.verified")
                  ] }) : null,
                  app.applicant_brand && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-indigo-500 font-medium hidden sm:inline truncate", children: app.applicant_brand })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 11, className: "text-gray-400 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 truncate", children: app.venue_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 text-xs", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 flex-shrink-0", children: timeAgo(app.created_at) })
                ] }),
                app.selected_period && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10, className: "text-amber-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-amber-600 font-medium truncate", children: [
                    app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString("ko-KR") : "",
                    " ~ ",
                    app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString("ko-KR") : ""
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-2 py-0.5 rounded-md text-[11px] font-bold ${statusConfig.bg} ${statusConfig.text} hidden sm:inline-flex items-center gap-1`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${statusConfig.dot}` }),
                  statusConfig.label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${statusConfig.dot} sm:hidden` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}` })
              ] })
            ] })
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 border-t border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider", children: t("applicationsPage.applicationMessage") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3.5 bg-gray-50 rounded-xl min-h-[80px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm leading-relaxed ${app.message ? "text-gray-700" : "text-gray-400 italic"}`, children: app.message || t("applicationsPage.noMessage") }) }),
            (() => {
              let atts = [];
              try {
                atts = typeof app.attachments === "string" ? JSON.parse(app.attachments) : app.attachments || [];
              } catch {
              }
              if (!Array.isArray(atts) || atts.length === 0) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5", children: t("applicationsPage.attachments") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: atts.map((att, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `/${att}`,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 14, className: "text-indigo-500 flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-indigo-700 flex-1 truncate", children: att.split("/").pop() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12, className: "text-indigo-400 flex-shrink-0" })
                    ]
                  },
                  i
                )) })
              ] });
            })(),
            app.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleApplicationAction(app.id, "approved", app.applicant_name);
                  },
                  className: "flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 15 }),
                    t("applicationsPage.approve")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleApplicationAction(app.id, "rejected", app.applicant_name);
                  },
                  className: "flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 15 }),
                    t("applicationsPage.reject")
                  ]
                }
              )
            ] }),
            app.status === "approved" && (() => {
              var _a2;
              let canReject = true;
              let deadlineMsg = "";
              if ((_a2 = app.selected_period) == null ? void 0 : _a2.start) {
                const eventStart = new Date(app.selected_period.start);
                const now = /* @__PURE__ */ new Date();
                const diffMs = eventStart - now;
                const diffDays = Math.ceil(diffMs / (1e3 * 60 * 60 * 24));
                if (diffDays < 3) {
                  canReject = false;
                  deadlineMsg = t("applicationsPage.deadlineWarning");
                }
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 text-center bg-emerald-50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-emerald-600", children: t("applicationsPage.approvedMessage") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      navigate(`/host/chat?user=${app.user_id}`);
                    },
                    className: "w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-xs font-bold hover:from-indigo-400 hover:to-violet-400 transition-all flex items-center justify-center gap-1.5 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 14 }),
                      " 채팅하기"
                    ]
                  }
                ),
                canReject ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      handleApplicationAction(app.id, "rejected", app.applicant_name);
                    },
                    className: "w-full py-2 bg-white border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 13 }),
                      t("applicationsPage.cancelApproval")
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400 text-center font-medium", children: deadlineMsg })
              ] });
            })(),
            app.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 text-center bg-red-50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-red-500", children: t("applicationsPage.rejectedMessage") }) }),
              app.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-red-50/50 border border-red-100 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1", children: t("applicationsPage.rejectionReason") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 leading-relaxed", children: app.rejection_reason })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 relative", children: [
            !hasViewingSub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 24, className: "text-indigo-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 mb-1", children: t("applicationsPage.sellerDetailView") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mb-3", dangerouslySetInnerHTML: { __html: t("applicationsPage.sellerDetailSubscribe").replace("\n", "<br />") } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/host/payments", className: "inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity", children: t("applicationsPage.subscribe") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider", children: t("applicationsPage.sellerDetailInfo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 14, className: "text-indigo-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.salesCategory") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-800", children: CATEGORY_LABELS[app.applicant_category] || app.applicant_category || t("applicationsPage.notEntered") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14, className: "text-gray-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.email") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700", children: app.applicant_email || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14, className: "text-gray-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.phone") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700", children: app.applicant_phone || t("applicationsPage.notProvided") })
              ] }),
              app.applicant_instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 14, className: "text-pink-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.instagram") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `https://instagram.com/${app.applicant_instagram.replace("@", "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-pink-600 font-medium hover:underline",
                    children: [
                      "@",
                      app.applicant_instagram.replace("@", "")
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-gray-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.activityPeriod") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700", children: experience || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-gray-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 w-16 flex-shrink-0", children: t("applicationsPage.participationDate") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700", children: app.created_at ? new Date(app.created_at).toLocaleDateString("ko-KR") : "-" })
              ] }),
              app.selected_period && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-amber-500 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-700 font-medium", children: t("applicationsPage.desiredEventPeriod") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-gray-800", children: [
                  app.selected_period.start ? new Date(app.selected_period.start).toLocaleDateString("ko-KR") : t("applicationsPage.undecided"),
                  " ~ ",
                  app.selected_period.end ? new Date(app.selected_period.end).toLocaleDateString("ko-KR") : t("applicationsPage.undecided")
                ] })
              ] }) })
            ] }),
            keywords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 mb-1.5", children: t("applicationsPage.keywords") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: keywords.map((kw, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold", children: kw }, i)) })
            ] }),
            app.applicant_description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-gray-400 mb-1", children: t("applicationsPage.sellerBio") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: app.applicant_description })
            ] }),
            app.user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  fetchSellerDetail(app.user_id);
                },
                className: "w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center gap-1.5 shadow-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
                  t("applicationsPage.viewSellerInfo")
                ]
              }
            )
          ] })
        ] }) })
      ] }, app.id);
    }) }),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4", style: { backgroundColor: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 flex items-center gap-3 ${confirmModal.type === "danger" ? "bg-red-50" : confirmModal.type === "success" ? "bg-emerald-50" : "bg-amber-50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmModal.type === "danger" ? "bg-red-100" : confirmModal.type === "success" ? "bg-emerald-100" : "bg-amber-100"}`, children: confirmModal.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 20, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 20, className: confirmModal.type === "danger" ? "text-red-500" : "text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900", children: confirmModal.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed whitespace-pre-line", children: confirmModal.message }),
        confirmModal.showRejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1.5", children: t("applicationsPage.rejectionReasonLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: rejectionReason,
              onChange: (e) => setRejectionReason(e.target.value),
              placeholder: t("applicationsPage.rejectionReasonPlaceholder"),
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
            children: confirmModal.confirmLabel || t("applicationsPage.approve")
          }
        )
      ] })
    ] }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-[9999]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`, children: [
      toast.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 18, className: "text-emerald-500 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 18, className: "text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: toast.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setToast(null), className: "ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14, className: "text-gray-400" }) })
    ] }) }),
    sellerDetail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4", onClick: () => setSellerDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden ring-2 ring-white/30", children: ((_a = sellerDetail.user) == null ? void 0 : _a.profile_image) ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sellerDetail.user.profile_image, alt: "", className: "w-full h-full object-cover" }) : (((_b = sellerDetail.user) == null ? void 0 : _b.name) || "?")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-extrabold", children: (_c = sellerDetail.user) == null ? void 0 : _c.name }),
              ((_d = sellerDetail.user) == null ? void 0 : _d.category) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20", children: CATEGORY_LABELS[sellerDetail.user.category] || sellerDetail.user.category })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSellerDetail(null), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4 max-h-[65vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-violet-50 rounded-xl border border-violet-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-violet-500 uppercase tracking-wider mb-2", children: t("applicationsPage.salesInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-violet-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-violet-800", children: CATEGORY_LABELS[(_e = sellerDetail.user) == null ? void 0 : _e.category] || ((_f = sellerDetail.user) == null ? void 0 : _f.category) || t("applicationsPage.unspecified") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: ((_g = sellerDetail.user) == null ? void 0 : _g.description) || t("applicationsPage.noBrandIntro") })
        ] }),
        ((_h = sellerDetail.seller_photos) == null ? void 0 : _h.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 12 }),
            t("applicationsPage.productPhotos")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: sellerDetail.seller_photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all",
              onClick: () => {
                setLightboxPhotos(sellerDetail.seller_photos);
                setLightboxIndex(idx);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo.image_url, alt: "", className: "w-full h-full object-cover" })
            },
            photo.id || idx
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-6 py-3 border-y border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-indigo-600", children: ((_i = sellerDetail.applications) == null ? void 0 : _i.length) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.applicationCount") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("applicationsPage.contactInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-indigo-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.email") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: ((_j = sellerDetail.user) == null ? void 0 : _j.email) || "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-indigo-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.phone") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: ((_k = sellerDetail.user) == null ? void 0 : _k.phone) || t("applicationsPage.notRegistered") })
              ] })
            ] }),
            ((_l = sellerDetail.user) == null ? void 0 : _l.instagram) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 16, className: "text-violet-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("applicationsPage.instagramLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `https://instagram.com/${sellerDetail.user.instagram.replace("@", "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-sm font-medium text-violet-600 hover:text-violet-700",
                    children: [
                      "@",
                      sellerDetail.user.instagram.replace("@", "")
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    lightboxPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center", onClick: () => setLightboxPhotos([]), children: [
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
          src: ((_m = lightboxPhotos[lightboxIndex]) == null ? void 0 : _m.image_url) || "",
          alt: "",
          className: "max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl",
          onClick: (e) => e.stopPropagation()
        }
      )
    ] })
  ] });
};
export {
  HostApplications as default
};
