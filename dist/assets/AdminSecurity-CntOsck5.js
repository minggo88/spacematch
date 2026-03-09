import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, ai as Loader2, al as ShieldCheck, aV as RefreshCw, b9 as Save, f as Search, aY as Wrench, K as Shield, bc as Activity, bd as Code2, aq as Clock, ab as Lock, an as Zap, v as Users, A as AlertTriangle, be as ShieldOff, a9 as CheckCircle2, X as XCircle, af as AlertCircle } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const SETTINGS_META = {
  maintenance_mode: {
    labelKey: "maintenanceMode",
    descKey: "maintenanceModeDesc",
    icon: AlertTriangle,
    type: "toggle",
    danger: true
  },
  force_https: {
    labelKey: "forceHttps",
    descKey: "forceHttpsDesc",
    icon: Lock,
    type: "toggle"
  },
  block_suspicious_ips: {
    labelKey: "blockSuspiciousIps",
    descKey: "blockSuspiciousIpsDesc",
    icon: Shield,
    type: "toggle"
  },
  allow_registration: {
    labelKey: "allowRegistration",
    descKey: "allowRegistrationDesc",
    icon: Users,
    type: "toggle"
  },
  enable_api_rate_limit: {
    labelKey: "apiRateLimit",
    descKey: "apiRateLimitDesc",
    icon: Zap,
    type: "toggle"
  },
  max_login_attempts: {
    labelKey: "maxLoginAttempts",
    descKey: "maxLoginAttemptsDesc",
    icon: Lock,
    type: "number",
    min: 1,
    max: 20
  },
  session_timeout_minutes: {
    labelKey: "sessionTimeout",
    descKey: "sessionTimeoutDesc",
    icon: Clock,
    type: "number",
    min: 5,
    max: 1440
  },
  disable_devtools_block: {
    labelKey: "disableDevtoolsBlock",
    descKey: "disableDevtoolsBlockDesc",
    icon: Code2,
    type: "toggle"
  }
};
const SEVERITY_CONFIG = {
  critical: { color: "red", label: "심각", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  high: { color: "orange", label: "높음", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
  medium: { color: "yellow", label: "보통", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-amber-100 text-amber-700" },
  low: { color: "blue", label: "낮음", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" }
};
const GRADE_CONFIG = {
  A: { color: "text-emerald-500", bg: "bg-emerald-50", label: "매우 안전" },
  B: { color: "text-blue-500", bg: "bg-blue-50", label: "양호" },
  C: { color: "text-yellow-500", bg: "bg-yellow-50", label: "주의 필요" },
  D: { color: "text-orange-500", bg: "bg-orange-50", label: "위험" },
  F: { color: "text-red-500", bg: "bg-red-50", label: "매우 위험" }
};
const AdminSecurity = () => {
  var _a, _b, _c, _d;
  const { t } = useTranslation("admin");
  const [activeTab, setActiveTab] = reactExports.useState("settings");
  const [settings, setSettings] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [dirty, setDirty] = reactExports.useState(false);
  const [lastSaved, setLastSaved] = reactExports.useState(null);
  const [auditData, setAuditData] = reactExports.useState(null);
  const [auditLoading, setAuditLoading] = reactExports.useState(false);
  const [fixingItems, setFixingItems] = reactExports.useState({});
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/security_settings.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setDirty(false);
      }
    } catch (err) {
      console.error(t("securityPage.settingsLoadFailed"), err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchSettings();
  }, []);
  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: prev[key] === "1" ? "0" : "1" }));
    setDirty(true);
  };
  const handleNumber = (key, value) => {
    const meta = SETTINGS_META[key];
    const num = Math.max(meta.min || 1, Math.min(meta.max || 9999, parseInt(value) || 0));
    setSettings((prev) => ({ ...prev, [key]: String(num) }));
    setDirty(true);
  };
  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/security_settings.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (data.success) {
        setDirty(false);
        setLastSaved(/* @__PURE__ */ new Date());
      } else {
        alert(t("securityPage.saveFailed") + (data.message || t("securityPage.unknownError")));
      }
    } catch (err) {
      alert(t("securityPage.saveError") + err.message);
    } finally {
      setSaving(false);
    }
  };
  const runAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/security_audit.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error("Security audit failed:", err);
    } finally {
      setAuditLoading(false);
    }
  };
  const applyFix = async (fixId) => {
    var _a2, _b2, _c2, _d2;
    setFixingItems((prev) => ({ ...prev, [fixId]: true }));
    try {
      const res = await fetch(`${API_BASE}/admin/security_audit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fix_id: fixId })
      });
      const data = await res.json();
      if (data.success && ((_b2 = (_a2 = data.results) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.success)) {
        await runAudit();
      } else {
        alert("수정 실패: " + (((_d2 = (_c2 = data.results) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.message) || "알 수 없는 오류"));
      }
    } catch (err) {
      alert("수정 중 오류: " + err.message);
    } finally {
      setFixingItems((prev) => ({ ...prev, [fixId]: false }));
    }
  };
  const fixAll = async () => {
    if (!auditData) return;
    const fixableChecks = auditData.checks.filter((c) => c.fixable && c.status !== "pass");
    for (const check of fixableChecks) {
      await applyFix(check.fix_id);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "animate-spin text-indigo-500", size: 32 }) });
  }
  const StatusIcon = ({ status }) => {
    if (status === "pass") return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { size: 18, className: "text-emerald-500" });
    if (status === "fail") return /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 18, className: "text-red-500" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 18, className: "text-amber-500" });
  };
  const fixableFailCount = ((_a = auditData == null ? void 0 : auditData.checks) == null ? void 0 : _a.filter((c) => c.fixable && c.status !== "pass").length) || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 20 }) }),
          t("securityPage.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1 text-sm", children: t("securityPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: fetchSettings,
              className: "flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
                t("securityPage.refresh")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: saveSettings,
              disabled: !dirty || saving,
              className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${dirty ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`,
              children: [
                saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                saving ? t("securityPage.saving") : t("securityPage.saveChanges")
              ]
            }
          )
        ] }),
        activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: runAudit,
              disabled: auditLoading,
              className: "flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-200",
              children: [
                auditLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14 }),
                auditLoading ? "점검 중..." : "보안 점검 실행"
              ]
            }
          ),
          fixableFailCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: fixAll,
              className: "flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-emerald-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 14 }),
                "전체 자동 수정 (",
                fixableFailCount,
                ")"
              ]
            }
          )
        ] })
      ] })
    ] }),
    lastSaved && activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }),
      t("securityPage.lastSaved"),
      " ",
      lastSaved.toLocaleTimeString()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 bg-gray-100 p-1 rounded-xl w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setActiveTab("settings"),
          className: `px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14 }),
            "보안 설정"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("audit");
            if (!auditData) runAudit();
          },
          className: `px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "audit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
            "서버 보안 점검",
            auditData && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${auditData.summary.failed > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`, children: auditData.summary.grade })
          ] })
        }
      )
    ] }),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: Object.entries(SETTINGS_META).map(([key, meta]) => {
        const Icon = meta.icon;
        const isOn = settings[key] === "1";
        const isDanger = meta.danger;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `bg-white rounded-2xl border p-5 transition-all duration-300 ${isDanger && isOn ? "border-red-200 bg-red-50/30 shadow-sm shadow-red-100" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3.5 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDanger && isOn ? "bg-red-100 text-red-600" : isOn ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 text-sm flex items-center gap-2", children: [
                    t(`securityPage.${meta.labelKey}`),
                    isDanger && isOn && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full", children: t("securityPage.danger") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5 leading-relaxed", children: t(`securityPage.${meta.descKey}`) })
                ] })
              ] }),
              meta.type === "toggle" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleToggle(key),
                  className: `relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${isOn ? isDanger ? "bg-red-500" : "bg-emerald-500" : "bg-gray-300"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${isOn ? "left-[26px]" : "left-0.5"}` })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  value: settings[key] || "",
                  onChange: (e) => handleNumber(key, e.target.value),
                  min: meta.min,
                  max: meta.max,
                  className: "w-20 px-3 py-1.5 text-sm font-bold text-center bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                }
              )
            ] })
          },
          key
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18 }),
          t("securityPage.securitySummary")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
          { label: "HTTPS", active: settings.force_https === "1" },
          { label: t("securityPage.ipBlock"), active: settings.block_suspicious_ips === "1" },
          { label: t("securityPage.apiLimit"), active: settings.enable_api_rate_limit === "1" },
          { label: t("securityPage.maintenanceLabel"), active: settings.maintenance_mode === "1", warn: true },
          { label: t("securityPage.devtoolsLabel"), active: settings.disable_devtools_block === "1", warn: true }
        ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${item.active ? item.warn ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-gray-400"}`, children: [
          item.active ? item.warn ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { size: 14 }),
          item.label
        ] }, i)) })
      ] })
    ] }),
    activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      auditLoading && !auditData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 32, className: "animate-spin text-indigo-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium", children: "서버 보안 점검 중..." })
      ] }),
      auditData && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `col-span-1 md:col-span-1 rounded-2xl border p-6 flex flex-col items-center justify-center gap-2 ${((_b = GRADE_CONFIG[auditData.summary.grade]) == null ? void 0 : _b.bg) || "bg-gray-50"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-6xl font-black ${((_c = GRADE_CONFIG[auditData.summary.grade]) == null ? void 0 : _c.color) || "text-gray-500"}`, children: auditData.summary.grade }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-600", children: (_d = GRADE_CONFIG[auditData.summary.grade]) == null ? void 0 : _d.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-extrabold text-gray-900", children: [
              auditData.summary.score,
              "점"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 md:col-span-3 grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { size: 24, className: "text-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-emerald-600", children: auditData.summary.passed }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-400", children: "통과" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 24, className: "text-red-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-red-600", children: auditData.summary.failed }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-400", children: "실패" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 24, className: "text-amber-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-amber-600", children: auditData.summary.warned }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-400", children: "경고" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18 }),
            "점검 항목 (",
            auditData.checks.length,
            "개)"
          ] }),
          auditData.checks.map((check, idx) => {
            const sev = SEVERITY_CONFIG[check.severity] || SEVERITY_CONFIG.medium;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `bg-white rounded-2xl border p-5 transition-all ${check.status === "fail" ? "border-red-200 shadow-sm shadow-red-50" : check.status === "warn" ? "border-amber-200" : "border-gray-100"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { status: check.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 text-sm", children: check.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${sev.badge}`, children: sev.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${check.status === "pass" ? "bg-emerald-100 text-emerald-700" : check.status === "fail" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`, children: check.status === "pass" ? "통과" : check.status === "fail" ? "실패" : "경고" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: check.description }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs mt-1.5 font-medium ${check.status === "pass" ? "text-emerald-600" : check.status === "fail" ? "text-red-600" : "text-amber-600"}`, children: check.detail })
                    ] })
                  ] }),
                  check.fixable && check.status !== "pass" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => applyFix(check.fix_id),
                      disabled: fixingItems[check.fix_id],
                      className: "flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex-shrink-0 disabled:opacity-50",
                      children: [
                        fixingItems[check.fix_id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 12 }),
                        fixingItems[check.fix_id] ? "수정 중..." : "자동 수정"
                      ]
                    }
                  )
                ] })
              },
              idx
            );
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-gray-400 mt-4", children: [
          "마지막 점검: ",
          auditData.timestamp
        ] })
      ] }),
      !auditLoading && !auditData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 32, className: "text-indigo-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900", children: "서버 보안 점검" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 text-center max-w-md", children: [
          "서버의 보안 상태를 자동으로 점검합니다.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          ".htaccess 보호, 파일 업로드 보안, SQL Injection 방어 등을 확인합니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: runAudit,
            className: "flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200 mt-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
              "보안 점검 시작"
            ]
          }
        )
      ] })
    ] })
  ] });
};
export {
  AdminSecurity as default
};
