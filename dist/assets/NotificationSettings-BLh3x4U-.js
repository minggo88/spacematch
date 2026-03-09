import { a as useAuth, b as useNavigate, e as useLocation, o as getPushStatus, j as jsxRuntimeExports, p as unsubscribeFromPush, s as subscribeToPush } from "./index-BM1FR1Lq.js";
import { r as reactExports, ai as Loader2, e as ArrowLeft, d as Check, _ as Settings, K as Shield, f as Search, aa as Mail, aT as ChevronUp, a0 as ChevronDown, a1 as MessageSquare, q as Building, O as CircleUser, x as CreditCard, S as Smartphone, A as AlertTriangle } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const NotificationSettings = () => {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = (user == null ? void 0 : user.role) === "superadmin";
  const [settings, setSettings] = reactExports.useState({
    push_enabled: 1,
    email_enabled: 1,
    cat_application: 1,
    cat_community: 1,
    cat_venue: 1,
    cat_account: 1,
    cat_payment: 1
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [pushStatus, setPushStatus] = reactExports.useState("checking");
  const [pushToggling, setPushToggling] = reactExports.useState(false);
  const [adminMode, setAdminMode] = reactExports.useState(false);
  const [adminUsers, setAdminUsers] = reactExports.useState([]);
  const [adminLoading, setAdminLoading] = reactExports.useState(false);
  const [adminSearch, setAdminSearch] = reactExports.useState("");
  const [adminPage, setAdminPage] = reactExports.useState(1);
  const [adminTotal, setAdminTotal] = reactExports.useState(0);
  const [adminTotalPages, setAdminTotalPages] = reactExports.useState(1);
  const [expandedUser, setExpandedUser] = reactExports.useState(null);
  const [adminSaving, setAdminSaving] = reactExports.useState(null);
  reactExports.useEffect(() => {
    fetch("/api/notifications/notification_settings.php", { credentials: "include" }).then((r) => r.json()).then((data) => {
      if (data.success) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
    getPushStatus().then(setPushStatus);
  }, []);
  const loadAdminUsers = reactExports.useCallback(async (page = 1, search = "") => {
    setAdminLoading(true);
    try {
      const params = new URLSearchParams({ admin: "1", page: String(page) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/notifications/notification_settings.php?${params}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(data.users);
        setAdminTotal(data.total);
        setAdminPage(data.page);
        setAdminTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error("관리자 유저 목록 로드 실패:", e);
    } finally {
      setAdminLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    if (adminMode && isSuperAdmin) {
      loadAdminUsers(1, adminSearch);
    }
  }, [adminMode, isSuperAdmin]);
  const saveSettings = reactExports.useCallback(async (newSettings) => {
    setSaving(true);
    try {
      const res = await fetch("/api/notifications/notification_settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2e3);
      }
    } catch (e) {
      console.error("설정 저장 실패:", e);
    } finally {
      setSaving(false);
    }
  }, []);
  const saveAdminUserSettings = reactExports.useCallback(async (targetUserId, newSettings) => {
    setAdminSaving(targetUserId);
    try {
      const res = await fetch("/api/notifications/notification_settings.php?admin=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ target_user_id: targetUserId, ...newSettings })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => prev.map(
          (u) => u.id == targetUserId ? { ...u, ...newSettings } : u
        ));
      }
    } catch (e) {
      console.error("관리자 설정 저장 실패:", e);
    } finally {
      setAdminSaving(null);
    }
  }, []);
  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: settings[key] ? 0 : 1 };
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  const handleAdminToggle = (userId, field, currentValue) => {
    const userRow = adminUsers.find((u) => u.id == userId);
    if (!userRow) return;
    const newVal = currentValue ? 0 : 1;
    const newSettings = {};
    const allFields = ["push_enabled", "email_enabled", "cat_application", "cat_community", "cat_venue", "cat_account", "cat_payment"];
    allFields.forEach((f) => newSettings[f] = f === field ? newVal : parseInt(userRow[f]) || 0);
    saveAdminUserSettings(userId, newSettings);
  };
  const handlePushToggle = async () => {
    setPushToggling(true);
    try {
      if (pushStatus === "subscribed") {
        await unsubscribeFromPush();
        setPushStatus("not-subscribed");
        sessionStorage.removeItem("push_subscribed");
        const newSettings = { ...settings, push_enabled: 0 };
        setSettings(newSettings);
        saveSettings(newSettings);
      } else {
        if (Notification.permission === "denied") {
          alert("브라우저 설정에서 알림 권한을 허용해 주세요.");
          return;
        }
        if (Notification.permission === "default") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") return;
        }
        const ok = await subscribeToPush();
        if (ok) {
          setPushStatus("subscribed");
          sessionStorage.setItem("push_subscribed", "1");
          const newSettings = { ...settings, push_enabled: 1 };
          setSettings(newSettings);
          saveSettings(newSettings);
        }
      }
    } catch (e) {
      console.error("푸시 토글 오류:", e);
    } finally {
      setPushToggling(false);
    }
  };
  const handleAdminSearch = (e) => {
    e.preventDefault();
    loadAdminUsers(1, adminSearch);
  };
  const basePath = location.pathname.startsWith("/admin") ? "/admin" : location.pathname.startsWith("/host") ? "/host" : location.pathname.startsWith("/vendor") ? "/vendor" : "/seller";
  const categories = [
    { key: "cat_application", icon: ClipboardList, label: "입점 신청", desc: "신청 접수, 승인/반려 결과", color: "from-indigo-500 to-purple-500" },
    { key: "cat_community", icon: MessageSquare, label: "커뮤니티", desc: "댓글, 좋아요, 멘션", color: "from-rose-500 to-pink-500" },
    { key: "cat_venue", icon: Building, label: "공간", desc: "새 공간 등록, 상태 변경", color: "from-emerald-500 to-teal-500" },
    { key: "cat_account", icon: CircleUser, label: "계정", desc: "가입 승인, 채팅 메시지", color: "from-cyan-500 to-blue-500" },
    { key: "cat_payment", icon: CreditCard, label: "결제", desc: "입금 확인, 결제 결과", color: "from-green-500 to-emerald-500" }
  ];
  const roleLabels = { seller: "셀러", host: "호스트", admin: "관리자", superadmin: "슈퍼관리자", vendor: "벤더" };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-8 h-8 animate-spin text-indigo-500" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate(`${basePath}/profile`),
          className: "w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center transition-all text-gray-600 dark:text-white",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "알림 설정" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-white/50 mt-1", children: "받고 싶은 알림을 선택하세요" })
      ] }),
      saved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        "저장됨"
      ] })
    ] }),
    isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setAdminMode(false),
          className: `flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${!adminMode ? "bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300" : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16, className: "inline mr-2" }),
            "내 설정"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setAdminMode(true),
          className: `flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${adminMode ? "bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-300" : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "inline mr-2" }),
            "유저 알림 관리"
          ]
        }
      )
    ] }) }),
    adminMode && isSuperAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleAdminSearch, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: adminSearch,
              onChange: (e) => setAdminSearch(e.target.value),
              placeholder: "이름 또는 이메일로 검색...",
              className: "w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-indigo-500/50 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "px-4 py-3 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-all text-sm font-medium", children: "검색" })
      ] }) }),
      adminLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-6 h-6 animate-spin text-indigo-500" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 dark:text-white/40 px-1", children: [
          "전체 ",
          adminTotal,
          "명"
        ] }),
        adminUsers.map((u) => {
          var _a;
          const isExpanded = expandedUser === u.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-all",
                onClick: () => setExpandedUser(isExpanded ? null : u.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0", children: ((_a = u.name) == null ? void 0 : _a[0]) || "?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900 dark:text-white text-sm truncate", children: u.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60", children: roleLabels[u.role] || u.role })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-white/40 truncate", children: u.email })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14, className: parseInt(u.email_enabled) ? "text-blue-500 dark:text-blue-400" : "text-gray-300 dark:text-white/20" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            handleAdminToggle(u.id, "email_enabled", parseInt(u.email_enabled));
                          },
                          className: `relative w-10 h-6 rounded-full transition-all duration-300 ${parseInt(u.email_enabled) ? "bg-blue-500 shadow-lg shadow-blue-500/20" : "bg-gray-300 dark:bg-white/15"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${parseInt(u.email_enabled) ? "left-[18px]" : "left-0.5"}` })
                        }
                      )
                    ] }),
                    adminSaving === u.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 14, className: "animate-spin text-indigo-400" }),
                    isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16, className: "text-gray-400 dark:text-white/30" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: "text-gray-400 dark:text-white/30" })
                  ] })
                ]
              }
            ),
            isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-100 dark:border-white/5 p-4 pt-3 space-y-2.5 bg-gray-50 dark:bg-white/[0.02]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 dark:text-white/30 font-medium uppercase tracking-wider mb-2", children: "카테고리별 설정" }),
              categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(cat.icon, { size: 15, className: "text-gray-500 dark:text-white/40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700 dark:text-white/70", children: cat.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleAdminToggle(u.id, cat.key, parseInt(u[cat.key])),
                    className: `relative w-10 h-6 rounded-full transition-all duration-300 ${parseInt(u[cat.key]) ? "bg-emerald-500 shadow-md shadow-emerald-500/20" : "bg-gray-300 dark:bg-white/15"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${parseInt(u[cat.key]) ? "left-[18px]" : "left-0.5"}` })
                  }
                )
              ] }, cat.key))
            ] })
          ] }, u.id);
        }),
        adminTotalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 pt-4", children: Array.from({ length: Math.min(adminTotalPages, 5) }, (_, i) => {
          const p = i + 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => loadAdminUsers(p, adminSearch),
              className: `w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === adminPage ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/10"}`,
              children: p
            },
            p
          );
        }) })
      ] })
    ] }) : (
      /* ═══ 개인 설정 모드 ═══ */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-4 px-1", children: "알림 채널" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 20, className: "text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "푸시 알림" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 dark:text-white/50 mt-0.5", children: [
                    pushStatus === "subscribed" && "✅ 구독 중",
                    pushStatus === "not-subscribed" && "미구독",
                    pushStatus === "denied" && "⚠️ 브라우저에서 차단됨",
                    pushStatus === "unsupported" && "⚠️ 미지원 브라우저",
                    pushStatus === "checking" && "확인 중..."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handlePushToggle,
                  disabled: pushToggling || pushStatus === "unsupported",
                  className: `relative w-14 h-8 rounded-full transition-all duration-300 ${pushStatus === "subscribed" ? "bg-violet-500 shadow-lg shadow-violet-500/30" : "bg-gray-300 dark:bg-white/15"} ${pushToggling ? "opacity-50" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${pushStatus === "subscribed" ? "left-7" : "left-1"}` })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20, className: "text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "이메일 알림" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-white/50 mt-0.5", children: (user == null ? void 0 : user.email) || "이메일 미등록" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleToggle("email_enabled"),
                  className: `relative w-14 h-8 rounded-full transition-all duration-300 ${settings.email_enabled ? "bg-blue-500 shadow-lg shadow-blue-500/30" : "bg-gray-300 dark:bg-white/15"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${settings.email_enabled ? "left-7" : "left-1"}` })
                }
              )
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-4 px-1", children: "알림 카테고리" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(cat.icon, { size: 18, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white text-sm", children: cat.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-white/40 mt-0.5", children: cat.desc })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleToggle(cat.key),
                className: `relative w-12 h-7 rounded-full transition-all duration-300 ${settings[cat.key] ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-gray-300 dark:bg-white/15"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${settings[cat.key] ? "left-[22px]" : "left-0.5"}` })
              }
            )
          ] }) }, cat.key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 p-4 bg-amber-50 dark:bg-white/5 border border-amber-200 dark:border-white/10 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 18, className: "text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 dark:text-white/50 leading-relaxed", children: "브라우저 알림이 차단된 경우, 브라우저 설정에서 SpaceMatch의 알림 권한을 허용해 주세요. 이메일 알림은 등록된 이메일 주소로 발송됩니다." }) })
        ] }) })
      ] })
    )
  ] });
};
const ClipboardList = (props) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: props.size || 24, height: props.size || 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 11h4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 16h4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 11h.01" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 16h.01" })
] });
export {
  NotificationSettings as default
};
