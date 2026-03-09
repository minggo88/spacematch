import { u as useData, a as useAuth, b as useNavigate, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, u as Store, v as Users, t as ClipboardList, o as BarChart3, B as Bell, _ as Settings, ad as Plus, F as FileText, aF as ArrowUpRight, w as TrendingUp, C as CheckCircle, af as AlertCircle, d as Check, a as X, aG as Wifi, aq as Clock } from "./vendor-icons-BFe5lkJJ.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const COLORS = {
  primary: "#5551e8",
  primaryLight: "#6d69f1",
  primaryBg: "#EEEDFD",
  accent: "#6d69f1",
  accentLight: "#9B98F5",
  dark: "#2d2b6e"
};
const AdminDashboard = () => {
  var _a, _b;
  const { venues, applications, fetchVenues } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const isSuperAdmin = (user == null ? void 0 : user.role) === "superadmin";
  const [pendingVenues, setPendingVenues] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const [activeUsersData, setActiveUsersData] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  reactExports.useEffect(() => {
    if (!isSuperAdmin) return;
    const fetchActive = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/active_users.php`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setActiveUsersData(data);
      } catch {
      }
    };
    fetchActive();
    const interval = setInterval(fetchActive, 3e4);
    return () => clearInterval(interval);
  }, [isSuperAdmin]);
  reactExports.useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const pendingRes = await fetch(`${API_BASE}/venues/get_pending_venues.php`, { credentials: "include" });
        const pendingData = await pendingRes.json();
        if (Array.isArray(pendingData)) setPendingVenues(pendingData);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);
  const formatActiveTime = (dt) => {
    if (!dt) return "";
    const diff = Date.now() - new Date(dt).getTime();
    if (diff < 6e4) return t("dashboardPage.justNow");
    if (diff < 36e5) return t("dashboardPage.minutesAgo", { count: Math.floor(diff / 6e4) });
    if (diff < 864e5) return t("dashboardPage.hoursAgo", { count: Math.floor(diff / 36e5) });
    return t("dashboardPage.daysAgo", { count: Math.floor(diff / 864e5) });
  };
  const roleLabel = (role) => ({ admin: t("dashboardPage.roleAdmin"), superadmin: t("dashboardPage.roleSuperadmin"), seller: t("dashboardPage.roleSeller"), vendor: t("dashboardPage.roleHost") })[role] || role;
  const roleColor = (role) => ({ admin: "#6d69f1", superadmin: "#e53e3e", seller: "#38a169", host: "#d69e2e" })[role] || "#718096";
  const stats = reactExports.useMemo(() => {
    const totalVenues = venues.length;
    const totalApps = applications.length;
    const pendingApps = applications.filter((a) => a.status === "pending").length;
    const approvedApps = applications.filter((a) => a.status === "approved").length;
    const rejectedApps = applications.filter((a) => a.status === "rejected").length;
    return { totalVenues, totalApps, pendingApps, approvedApps, rejectedApps };
  }, [venues, applications]);
  const donutData = reactExports.useMemo(() => {
    const total = stats.totalApps || 1;
    return {
      approved: Math.round(stats.approvedApps / total * 100),
      pending: Math.round(stats.pendingApps / total * 100),
      rejected: Math.round(stats.rejectedApps / total * 100)
    };
  }, [stats]);
  const handleVenueAction = (venueId, status) => {
    const isApprove = status === "approved";
    setConfirmModal({
      title: isApprove ? t("dashboardPage.approveVenue") : t("dashboardPage.rejectVenue"),
      message: isApprove ? t("dashboardPage.approveVenueConfirm") : t("dashboardPage.rejectVenueConfirm"),
      type: isApprove ? "success" : "danger",
      confirmLabel: isApprove ? t("dashboardPage.approve") : t("dashboardPage.reject"),
      onConfirm: () => {
        setConfirmModal(null);
        fetch(`${API_BASE}/venues/manage_venue_status.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: venueId, status })
        }).then((res) => res.json()).then((data) => {
          if (data.success) {
            showToast(t("dashboardPage.processed"), "success");
            setPendingVenues((prev) => prev.filter((v) => v.id !== venueId));
            fetchVenues();
          } else {
            showToast(data.message, "error");
          }
        });
      }
    });
  };
  const quickActions = [
    { label: t("dashboardPage.qVenues"), icon: Store, path: "/admin/venues", color: "#4CAF50" },
    { label: t("dashboardPage.qUsers"), icon: Users, path: "/admin/users", color: "#2196F3" },
    { label: t("dashboardPage.qApps"), icon: ClipboardList, path: "/admin/applications", color: "#FF9800" },
    { label: t("dashboardPage.qAds"), icon: BarChart3, path: "/admin/ads", color: "#9C27B0" },
    { label: t("dashboardPage.qPromo"), icon: Bell, path: "/admin/promotions", color: "#E91E63" },
    { label: t("dashboardPage.qSecurity"), icon: Settings, path: "/admin/security", color: "#607D8B" }
  ];
  const timeStr = currentTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: t("dashboardPage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1 text-sm font-medium", children: t("dashboardPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/admin/venues"),
            className: "flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:-translate-y-0.5",
            style: { background: COLORS.primary },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              " ",
              t("dashboardPage.addVenue")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/admin/applications"),
            className: "flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
              " ",
              t("dashboardPage.manageApps")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-0 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 80, className: "translate-x-4 -translate-y-2" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-100 text-xs font-bold", children: t("dashboardPage.totalRegisteredVenues") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 bg-white/25 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 14 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-extrabold relative z-10", children: stats.totalVenues }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-indigo-200 text-xs mt-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 12 }),
          " ",
          t("dashboardPage.operating")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: t("dashboardPage.totalAppsLabel"), value: stats.totalApps, trend: t("dashboardPage.totalAppsAll"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 14 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: t("dashboardPage.approvedComplete"), value: stats.approvedApps, trend: t("dashboardPage.matchComplete"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: t("dashboardPage.pendingReview"), value: stats.pendingApps, trend: stats.pendingApps > 0 ? t("dashboardPage.needsProcessing") : t("dashboardPage.none"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 14 }), alert: stats.pendingApps > 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900", children: t("dashboardPage.weeklyAnalysis") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full", style: { background: COLORS.primary } }),
              t("dashboardPage.visits")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full", style: { background: COLORS.accentLight } }),
              t("dashboardPage.apps")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 flex items-end justify-between gap-3 px-1", children: [t("dashboardPage.sun"), t("dashboardPage.mon"), t("dashboardPage.tue"), t("dashboardPage.wed"), t("dashboardPage.thu"), t("dashboardPage.fri"), t("dashboardPage.sat")].map((day, i) => {
          const h1 = [35, 55, 70, 45, 80, 60, 40][i];
          const h2 = [20, 35, 50, 30, 55, 40, 25][i];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 flex-1 group cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opacity-0 group-hover:opacity-100 text-[10px] font-bold text-gray-500 transition-opacity -mb-1", children: [
              h1,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[36px] flex gap-1 items-end h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { height: `${h1}%`, background: COLORS.primary },
                  className: "w-1/2 rounded-t-md transition-all duration-500 group-hover:opacity-80"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { height: `${h2}%`, background: COLORS.accentLight },
                  className: "w-1/2 rounded-t-md transition-all duration-500 group-hover:opacity-80"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-400 group-hover:text-gray-700 transition-colors", children: day })
          ] }, day);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900 mb-1", children: t("dashboardPage.pendingVenues") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mb-4", children: t("dashboardPage.pendingVenuesDesc") }),
        pendingVenues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", style: { background: COLORS.primaryBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 24, style: { color: COLORS.accent } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: t("dashboardPage.allProcessed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: t("dashboardPage.noPendingReview") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          pendingVenues.slice(0, 3).map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0", children: venue.images && venue.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: venue.images[0], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16 }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 truncate", children: venue.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 truncate", children: venue.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleVenueAction(venue.id, "approved"),
                  className: "w-7 h-7 rounded-lg flex items-center justify-center text-white",
                  style: { background: COLORS.accent },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleVenueAction(venue.id, "rejected"),
                  className: "w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                }
              )
            ] })
          ] }, venue.id)),
          pendingVenues.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-gray-400 pt-1", children: t("dashboardPage.moreItems", { count: pendingVenues.length - 3 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/admin/venues"),
            className: "w-full mt-4 py-2.5 text-sm font-bold rounded-xl transition-colors",
            style: { background: COLORS.primaryBg, color: COLORS.primary },
            children: t("dashboardPage.viewAll")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900", children: t("dashboardPage.recentActivity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold px-2 py-1 rounded-full", style: { background: COLORS.primaryBg, color: COLORS.primary }, children: t("dashboardPage.countUnit", { count: applications.length }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          applications.slice(-4).reverse().map((app, idx) => {
            const created = app.created_at ? new Date(app.created_at) : null;
            let timeLabel = "";
            if (created) {
              const diffMs = Date.now() - created.getTime();
              const diffMin = Math.floor(diffMs / 6e4);
              const diffHr = Math.floor(diffMs / 36e5);
              const diffDay = Math.floor(diffMs / 864e5);
              if (diffMin < 1) timeLabel = t("dashboardPage.justNow");
              else if (diffMin < 60) timeLabel = t("dashboardPage.minutesAgo", { count: diffMin });
              else if (diffHr < 24) timeLabel = t("dashboardPage.hoursAgo", { count: diffHr });
              else if (diffDay < 7) timeLabel = t("dashboardPage.daysAgo", { count: diffDay });
              else timeLabel = created.toLocaleDateString();
            }
            const statusColors = {
              pending: { bg: "#FFF8E1", text: "#F57F17", label: t("dashboardPage.statusPending") },
              approved: { bg: COLORS.primaryBg, text: COLORS.primary, label: t("dashboardPage.statusApproved") },
              rejected: { bg: "#FFEBEE", text: "#C62828", label: t("dashboardPage.statusRejected") }
            };
            const s = statusColors[app.status] || statusColors.pending;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                  style: { background: s.text },
                  children: (app.applicant_name || app.sellerName || app.user_name || "?")[0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 truncate", children: app.applicant_name || app.sellerName || app.user_name || t("dashboardPage.applicant") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 truncate", children: app.venue_name || app.venueName || t("dashboardPage.venue") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full", style: { background: s.bg, color: s.text }, children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-300", children: timeLabel })
              ] })
            ] }, app.id || idx);
          }),
          applications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm text-center py-4", children: t("dashboardPage.noRecentActivity") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/admin/applications"),
            className: "w-full mt-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors",
            children: t("dashboardPage.viewAllHistory")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900 mb-5", children: t("dashboardPage.appStatus") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-36 h-36", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 36 36", className: "w-full h-full -rotate-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "#f3f4f6", strokeWidth: "3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "18",
                cy: "18",
                r: "15.9",
                fill: "none",
                stroke: COLORS.accent,
                strokeWidth: "3",
                strokeDasharray: `${donutData.approved} ${100 - donutData.approved}`,
                strokeDashoffset: "0",
                className: "transition-all duration-1000"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "18",
                cy: "18",
                r: "15.9",
                fill: "none",
                stroke: "#FFC107",
                strokeWidth: "3",
                strokeDasharray: `${donutData.pending} ${100 - donutData.pending}`,
                strokeDashoffset: `${-donutData.approved}`,
                className: "transition-all duration-1000"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "18",
                cy: "18",
                r: "15.9",
                fill: "none",
                stroke: "#EF5350",
                strokeWidth: "3",
                strokeDasharray: `${donutData.rejected} ${100 - donutData.rejected}`,
                strokeDashoffset: `${-(donutData.approved + donutData.pending)}`,
                className: "transition-all duration-1000"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-extrabold text-gray-900", children: [
              donutData.approved,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-bold", children: t("dashboardPage.approvalRate") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-5 text-xs font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full", style: { background: COLORS.accent } }),
            t("dashboardPage.approved")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-yellow-400" }),
            t("dashboardPage.reviewing")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-red-400" }),
            t("dashboardPage.rejected")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 rounded-xl", style: { background: COLORS.primaryBg }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold", style: { color: COLORS.primary }, children: stats.approvedApps }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500", children: t("dashboardPage.approved") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 rounded-xl bg-yellow-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-yellow-700", children: stats.pendingApps }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500", children: t("dashboardPage.reviewing") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 rounded-xl bg-red-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-red-600", children: stats.rejectedApps }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500", children: t("dashboardPage.rejected") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 text-white relative overflow-hidden", style: { background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.dark})` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -bottom-6 w-24 h-24 rounded-full border-4 border-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -bottom-2 w-16 h-16 rounded-full border-4 border-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 text-xs font-bold mb-1 relative z-10", children: dateStr }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold tracking-wider relative z-10 font-mono", children: timeStr }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-300 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-200 text-xs font-bold", children: t("dashboardPage.systemOnline") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900 mb-4", children: t("dashboardPage.quickNav") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2.5", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate(action.path),
              className: "flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    style: { background: action.color + "15", color: action.color },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { size: 18 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-500 group-hover:text-gray-800 transition-colors", children: action.label })
              ]
            },
            action.label
          )) })
        ] })
      ] })
    ] }),
    isSuperAdmin && activeUsersData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-white to-emerald-50/30 dark:from-gray-800 dark:via-gray-800/95 dark:to-emerald-900/10 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-5 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "text-white", size: 17 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-gray-900 dark:text-white flex-1", children: t("dashboardPage.userStatus") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-300 dark:text-gray-500 font-medium", children: "30s" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-gray-500 dark:text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-gray-900 dark:text-white", children: activeUsersData.total_users }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-medium", children: t("dashboardPage.total") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 ring-1 ring-emerald-200 dark:ring-emerald-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-extrabold text-emerald-700 dark:text-emerald-400", children: activeUsersData.online_count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-emerald-500 dark:text-emerald-500 font-medium", children: t("dashboardPage.online") })
          ] }),
          Object.entries(activeUsersData.role_counts || {}).map(([role, cnt]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-1 rounded-lg text-[10px] font-bold dark:opacity-90", style: { background: roleColor(role) + "18", color: roleColor(role) }, children: [
            roleLabel(role),
            " ",
            cnt
          ] }, role))
        ] })
      ] }),
      ((_a = activeUsersData.online_users) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: activeUsersData.online_users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15 hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
          u.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.profile_image, alt: "", className: "w-8 h-8 rounded-full object-cover ring-2 ring-emerald-300 dark:ring-emerald-500/50" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-emerald-300 dark:ring-emerald-500/50", style: { background: roleColor(u.role) }, children: (u.name || "?")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-gray-800" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-100 truncate", children: u.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 truncate", children: u.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0", style: { background: roleColor(u.role) + "18", color: roleColor(u.role) }, children: roleLabel(u.role) })
      ] }, u.id)) }) }),
      ((_b = activeUsersData.recent_users) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gray-100 dark:bg-gray-700/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-300 dark:text-gray-500 font-bold flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
            " ",
            t("dashboardPage.recent24h", { count: activeUsersData.recent_count })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gray-100 dark:bg-gray-700/60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: activeUsersData.recent_users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
            u.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.profile_image, alt: "", className: "w-6 h-6 rounded-full object-cover opacity-60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold opacity-60", style: { background: roleColor(u.role) }, children: (u.name || "?")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-px -right-px w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full border border-white dark:border-gray-800" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate flex-1", children: u.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-gray-300 dark:text-gray-600 flex-shrink-0", children: formatActiveTime(u.last_active_at) })
        ] }, u.id)) })
      ] }),
      activeUsersData.online_count === 0 && activeUsersData.recent_count === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto text-gray-200 dark:text-gray-600 mb-1", size: 28 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 dark:text-gray-600 font-medium", children: t("dashboardPage.noActiveUsers") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: confirmModal, onClose: () => setConfirmModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
const StatCard = ({ label, value, trend, icon, alert }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${alert ? "border-orange-200 ring-2 ring-orange-50" : "border-gray-100"}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 14 }) })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-gray-900", children: value }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-2 flex items-center gap-1", children: [
    icon,
    " ",
    trend
  ] })
] });
export {
  AdminDashboard as default
};
