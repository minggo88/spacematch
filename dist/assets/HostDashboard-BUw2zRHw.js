import { a as useAuth, b as useNavigate, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, u as Store, aq as Clock, b as ChevronRight, v as Users, o as BarChart3, C as CheckCircle, X as XCircle, w as TrendingUp, N as Eye } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const HostDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("host");
  const [venues, setVenues] = reactExports.useState([]);
  const [applications, setApplications] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/venues/get_my_venues.php`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE}/applications/get_applications.php`, { credentials: "include" }).then((r) => r.json())
    ]).then(([venuesData, appsData]) => {
      if (Array.isArray(venuesData)) setVenues(venuesData);
      if (Array.isArray(appsData)) setApplications(appsData);
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, []);
  const totalVenues = venues.length;
  const activeVenues = venues.filter((v) => v.status === "approved").length;
  const pendingVenues = venues.filter((v) => v.status === "pending").length;
  venues.filter((v) => v.status === "rejected").length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;
  const totalApps = applications.length;
  const approvalRate = totalApps > 0 ? Math.round(approvedApps / totalApps * 100) : 0;
  const venueStats = venues.map((v) => {
    var _a;
    const venueApps = applications.filter((a) => String(a.venue_id) === String(v.id));
    return {
      id: v.id,
      name: v.name,
      status: v.status,
      location: v.location,
      total: venueApps.length,
      approved: venueApps.filter((a) => a.status === "approved").length,
      pending: venueApps.filter((a) => a.status === "pending").length,
      rejected: venueApps.filter((a) => a.status === "rejected").length,
      maxSellers: parseInt(v.max_sellers) || 0,
      deadline: v.recruitment_deadline,
      image: ((_a = v.images) == null ? void 0 : _a[0]) || null
    };
  });
  const recentApps = [...applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold mb-2", children: t("heroGreeting", { name: user.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 font-medium text-lg", children: t("heroSubtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20, className: "text-indigo-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: t("allSpaces") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold text-gray-900", children: totalVenues }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600", children: [
            t("operating"),
            " ",
            activeVenues
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-500", children: [
            t("reviewing"),
            " ",
            pendingVenues
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, className: "text-amber-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: t("applicationRequests") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold text-amber-600", children: pendingApps }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/host/applications"),
            className: "mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1",
            children: [
              t("goTo"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20, className: "text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: t("applicationStatus") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-extrabold text-emerald-600", children: approvedApps }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs font-medium text-gray-400", children: t("totalApplied", { count: totalApps }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 20, className: "text-blue-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: t("approvalRateLabel") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-extrabold text-blue-600", children: [
          approvalRate,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700",
            style: { width: `${approvalRate}%` }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-extrabold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 18, className: "text-indigo-600" }),
            t("venueBreakdown")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/host/venues"),
              className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1",
              children: [
                t("manageVenues"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50", children: venueStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 40, className: "mx-auto mb-3 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: t("noVenuesYet") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/host/venues"),
              className: "mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700",
              children: [
                t("registerNewVenue"),
                " "
              ]
            }
          )
        ] }) : venueStats.map((vs) => {
          const occupancy = vs.maxSellers > 0 ? Math.min(100, Math.round(vs.approved / vs.maxSellers * 100)) : null;
          const isFull = vs.maxSellers > 0 && vs.approved >= vs.maxSellers;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100", children: vs.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: vs.image, alt: vs.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20 }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 truncate", children: vs.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${vs.status === "approved" ? "bg-emerald-100 text-emerald-600" : vs.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`, children: vs.status === "approved" ? t("statusActive") : vs.status === "pending" ? t("statusPending") : t("statusRejected") })
                ] }),
                vs.maxSellers > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-full rounded-full transition-all duration-500 ${isFull ? "bg-red-400" : occupancy >= 80 ? "bg-orange-400" : "bg-emerald-400"}`,
                      style: { width: `${occupancy}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold flex-shrink-0 ${isFull ? "text-red-500" : "text-gray-500"}`, children: [
                    vs.approved,
                    "/",
                    vs.maxSellers,
                    " ",
                    isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-500", children: t("closed") })
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                  t("tenants"),
                  " ",
                  vs.approved,
                  " · ",
                  t("applied"),
                  " ",
                  vs.total
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex gap-1.5 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 11 }),
                  " ",
                  vs.approved
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                  " ",
                  vs.pending
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 11 }),
                  " ",
                  vs.rejected
                ] })
              ] })
            ] }),
            vs.deadline && (() => {
              const diff = Math.ceil((new Date(vs.deadline) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 ml-[72px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold px-2 py-0.5 rounded-full ${diff < 0 ? "bg-gray-100 text-gray-400" : diff <= 3 ? "bg-red-100 text-red-500" : diff <= 7 ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-blue-500"}`, children: [
                diff < 0 ? t("closed") : diff === 0 ? "D-DAY" : `D-${diff}`,
                " ",
                t("recruitment")
              ] }) });
            })()
          ] }, vs.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-extrabold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18, className: "text-emerald-600" }),
            t("recentApplications")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate("/host/applications"),
              className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1",
              children: [
                t("viewAll"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
              ]
            }
          )
        ] }),
        recentApps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32, className: "mx-auto mb-2 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: t("noRecentApps") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50", children: recentApps.map((app) => {
          const now = /* @__PURE__ */ new Date();
          const created = new Date(app.created_at);
          const diffMs = now - created;
          const diffMin = Math.floor(diffMs / 6e4);
          const diffHr = Math.floor(diffMin / 60);
          const diffDay = Math.floor(diffHr / 24);
          let timeLabel = t("justNow");
          if (diffDay > 0) timeLabel = t("daysAgo", { count: diffDay });
          else if (diffHr > 0) timeLabel = t("hoursAgo", { count: diffHr });
          else if (diffMin > 0) timeLabel = t("minutesAgo", { count: diffMin });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full flex-shrink-0 ${app.status === "pending" ? "bg-amber-400" : app.status === "approved" ? "bg-emerald-400" : "bg-red-400"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800 text-sm truncate", children: app.applicant_name || t("applicant") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-400 flex-shrink-0 ml-2", children: timeLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 pl-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-600", children: app.venue_name }),
              t("appliedTo")
            ] }),
            app.applicant_category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-4 mt-1 inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-bold uppercase", children: app.applicant_category })
          ] }, app.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18, className: "text-gray-400" }),
        t("applicationSummary")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-amber-50 rounded-2xl border border-amber-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 24, className: "mx-auto mb-2 text-amber-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-amber-600", children: pendingApps }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-amber-400 mt-1", children: t("waiting") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 24, className: "mx-auto mb-2 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-emerald-600", children: approvedApps }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-emerald-400 mt-1", children: t("approved") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-red-50 rounded-2xl border border-red-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 24, className: "mx-auto mb-2 text-red-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-red-500", children: rejectedApps }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-red-400 mt-1", children: t("rejected") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 bg-gray-50 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-700", children: t("overallRate") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-extrabold text-indigo-600", children: [
            approvalRate,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700",
            style: { width: `${approvalRate}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2 text-xs text-gray-400 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t("approved"),
            " ",
            approvedApps,
            " · ",
            t("waiting"),
            " ",
            pendingApps,
            " · ",
            t("rejected"),
            " ",
            rejectedApps
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t("total"),
            " ",
            totalApps
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  HostDashboard as default
};
