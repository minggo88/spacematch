import { u as useData, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { ae as React, r as reactExports, u as Store, an as Zap, ap as MapPin, aq as Clock, C as CheckCircle, a as X, A as AlertTriangle, X as XCircle, k as Sparkles, i as Send } from "./vendor-icons-BFe5lkJJ.js";
import { u as useDemoGuard } from "./useDemoGuard-CCfUj4xK.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const SellerApplications = () => {
  var _a;
  const { applications, fetchApplications } = useData();
  const { t } = useTranslation("seller");
  const { isDemoUser, demoAlert } = useDemoGuard();
  React.useEffect(() => {
    fetchApplications();
  }, []);
  const myApplications = applications;
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [cancelling, setCancelling] = reactExports.useState(null);
  const [cancelRequestModal, setCancelRequestModal] = reactExports.useState(null);
  const [cancelReason, setCancelReason] = reactExports.useState("");
  const [submittingRequest, setSubmittingRequest] = reactExports.useState(false);
  const [cancelRequestStatus, setCancelRequestStatus] = reactExports.useState({});
  React.useEffect(() => {
    fetchCancelStatuses();
  }, []);
  const fetchCancelStatuses = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications/get_cancellation_requests.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        const statusMap = {};
        data.requests.forEach((req) => {
          if (!statusMap[req.application_id] || req.id > statusMap[req.application_id].id) {
            statusMap[req.application_id] = req;
          }
        });
        setCancelRequestStatus(statusMap);
      }
    } catch (err) {
      console.error("취소 신청 현황 로드 실패:", err);
    }
  };
  const handleCancel = async (appId, venueName) => {
    if (isDemoUser) {
      demoAlert("신청 취소");
      return;
    }
    if (!confirm(t("appPage.confirmCancel", { venue: venueName }))) return;
    setCancelling(appId);
    try {
      const res = await fetch(`${API_BASE}/applications/cancel_application.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId })
      });
      const data = await res.json();
      if (data.success) {
        alert(t("appPage.cancelSuccess"));
        fetchApplications();
      } else {
        alert(data.message || t("appPage.cancelFailed"));
      }
    } catch (err) {
      alert(t("common:error"));
    } finally {
      setCancelling(null);
    }
  };
  const handleCancelRequest = async () => {
    if (isDemoUser) {
      demoAlert("취소 요청");
      return;
    }
    if (!cancelReason.trim()) {
      alert(t("appPage.cancelReasonRequired"));
      return;
    }
    setSubmittingRequest(true);
    try {
      const res = await fetch(`${API_BASE}/applications/request_cancellation.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: cancelRequestModal.id,
          reason: cancelReason.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setCancelRequestModal(null);
        setCancelReason("");
        fetchCancelStatuses();
      } else {
        alert(data.message || t("appPage.cancelRequestFailed"));
      }
    } catch (err) {
      alert(t("common:error"));
    } finally {
      setSubmittingRequest(false);
    }
  };
  const filteredApplications = reactExports.useMemo(() => {
    if (activeTab === "all") return myApplications;
    return myApplications.filter((app) => app.status === activeTab);
  }, [myApplications, activeTab]);
  const tabs = [
    { id: "all", label: t("appPage.tabAll") },
    { id: "pending", label: t("appPage.tabPending") },
    { id: "approved", label: t("appPage.tabApproved") },
    { id: "rejected", label: t("appPage.tabRejected") }
  ];
  const getCancelInfo = (appId) => cancelRequestStatus[appId] || null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900", children: t("appPage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium mt-2", children: t("appPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-gray-100/80 rounded-xl overflow-x-auto", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap
                                ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: [
            tab.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 text-xs py-0.5 px-1.5 rounded-full ${activeTab === tab.id ? "bg-gray-100" : "bg-gray-200/50"}`, children: tab.id === "all" ? myApplications.length : myApplications.filter((a) => a.status === tab.id).length })
          ]
        },
        tab.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredApplications.length > 0 ? filteredApplications.map((app) => {
      const cancelInfo = getCancelInfo(app.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row ${app.is_priority == 1 ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-100"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:w-40 h-40 sm:h-auto bg-gray-100 relative shrink-0", children: [
          app.venue_images && app.venue_images.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: app.venue_images[0],
              alt: app.venue_name,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 md:p-6 flex flex-col justify-between flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-gray-900 line-clamp-1", children: app.venue_name }),
                  app.is_priority == 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold rounded-md flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 9, fill: "white" }),
                    "패스트트랙"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                  " ",
                  app.venue_location || t("appPage.noLocation")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                                                ${app.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : app.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : app.status === "cancelled" ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-red-50 text-red-700 border-red-200"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${app.status === "pending" ? "bg-yellow-500" : app.status === "approved" ? "bg-emerald-500" : app.status === "cancelled" ? "bg-gray-400" : "bg-red-500"}` }),
                app.status === "pending" ? t("appPage.statusPending") : app.status === "approved" ? t("appPage.statusApproved") : app.status === "cancelled" ? t("appPage.statusCancelled") : t("appPage.statusRejected")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 bg-gray-50 rounded-lg text-gray-600 font-medium", children: [
                "₩",
                app.venue_price ? parseInt(app.venue_price).toLocaleString() : "0",
                " /일"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-400 text-xs", children: [
                t("appPage.appliedDate"),
                ": ",
                new Date(app.created_at || Date.now()).toLocaleDateString()
              ] })
            ] }),
            cancelInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2
                                                ${cancelInfo.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200" : cancelInfo.status === "approved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: [
              cancelInfo.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
                " ",
                t("appPage.cancelPending")
              ] }),
              cancelInfo.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 13 }),
                " ",
                t("appPage.cancelApproved")
              ] }),
              cancelInfo.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
                " ",
                t("appPage.cancelRejected"),
                cancelInfo.decision_note ? ` — ${cancelInfo.decision_note}` : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${app.status === "rejected" || app.status === "cancelled" ? "bg-red-500 w-full" : "bg-indigo-500"} ${app.status === "pending" ? "w-1/3" : "w-full"} transition-all duration-1000` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-600", children: t("appPage.applicationDone") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: app.status !== "pending" ? app.status === "rejected" || app.status === "cancelled" ? "text-red-500" : "text-indigo-600" : "", children: app.status === "pending" ? t("appPage.reviewing") : app.status === "approved" ? t("appPage.approvedDone") : app.status === "cancelled" ? t("appPage.statusCancelled") : t("appPage.statusRejected") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
            app.status === "approved" && (!cancelInfo || cancelInfo.status === "rejected") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setCancelRequestModal(app);
                  setCancelReason("");
                },
                className: "flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-xl transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 16 }),
                  t("appPage.cancelRequest")
                ]
              }
            ),
            app.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleCancel(app.id, app.venue_name),
                disabled: cancelling === app.id,
                className: "flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 16 }),
                  cancelling === app.id ? t("appPage.cancelling") : t("appPage.cancelApplication")
                ]
              }
            )
          ] })
        ] })
      ] }, app.id);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-gray-900 font-bold mb-1", children: activeTab === "all" ? t("appPage.noAppsAll") : t("appPage.noAppsFiltered", { tab: (_a = tabs.find((tb) => tb.id === activeTab)) == null ? void 0 : _a.label }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: activeTab === "all" ? t("appPage.noAppsHint") : t("appPage.noAppsOther") })
    ] }) }),
    cancelRequestModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setCancelRequestModal(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCancelRequestModal(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("appPage.cancelModalTitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: cancelRequestModal.venue_name })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold mb-1", children: [
            "⚠️ ",
            t("appPage.cancelNotice")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("appPage.cancelNoticeDesc") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [
          t("appPage.cancelReasonLabel"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: cancelReason,
            onChange: (e) => setCancelReason(e.target.value),
            placeholder: t("appPage.cancelReasonPlaceholder"),
            rows: 4,
            className: "w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 resize-none"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setCancelRequestModal(null),
              className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors",
              children: t("appPage.closeBtn")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCancelRequest,
              disabled: submittingRequest || !cancelReason.trim(),
              className: "flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
                submittingRequest ? t("appPage.sending") : t("appPage.sendCancelRequest")
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  SellerApplications as default
};
