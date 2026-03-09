import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, x as CreditCard, W as Package, _ as Settings, bf as History, ad as Plus, aL as Crown, an as Zap, p as ShoppingBag, aE as Layers, b1 as ArrowUp, b2 as ArrowDown, bg as ToggleRight, bh as ToggleLeft, bi as Pen, T as Trash2, C as CheckCircle, A as AlertTriangle, bj as Banknote, b9 as Save, f as Search, X as XCircle, i as Send, aq as Clock, N as Eye, a as X, L as Languages, aV as RefreshCw } from "./vendor-icons-BFe5lkJJ.js";
import { N as NumberInput } from "./NumberInput-BjovFE9F.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api/payments";
const STATUS_MAP_KEYS = {
  pending: { labelKey: "paymentsPage.statusPending", color: "text-gray-500", bg: "bg-gray-50 border-gray-200", dot: "bg-gray-400", icon: Clock },
  submitted: { labelKey: "paymentsPage.statusSubmitted", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500", icon: Send },
  confirmed: { labelKey: "paymentsPage.statusConfirmed", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  rejected: { labelKey: "paymentsPage.statusRejected", color: "text-red-600", bg: "bg-red-50 border-red-200", dot: "bg-red-500", icon: XCircle }
};
const PERIOD_MAP_KEYS = { monthly: "paymentsPage.periodMonthly", yearly: "paymentsPage.periodYearly", once: "paymentsPage.periodOnce" };
const ROLE_MAP_KEYS = { all: "paymentsPage.roleAll", host: "paymentsPage.roleHost", seller: "paymentsPage.roleSeller" };
const LANG_OPTIONS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Việt Nam", flag: "🇻🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" }
];
const CATEGORY_KEY_OPTIONS = ["categoryListing", "categoryMarketing", "categoryPremium", "categoryOther"];
const CATEGORY_META_KEYS = {
  categoryListing: { icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  categoryMarketing: { icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  categoryPremium: { icon: Crown, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" }
};
const DEFAULT_CAT_META = { icon: Layers, color: "text-purple-600", bg: "bg-purple-50" };
const AdminPayments = () => {
  var _a, _b, _c, _d, _e, _f;
  const { t } = useTranslation("admin");
  const [activeTab, setActiveTab] = reactExports.useState("plans");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState({
    is_payment_enabled: 0,
    bank_name: "",
    account_number: "",
    account_holder: "",
    payment_notice: "",
    platform_fee_amount: 0,
    platform_fee_period: "monthly"
  });
  const [plans, setPlans] = reactExports.useState([]);
  const [planModal, setPlanModal] = reactExports.useState(null);
  const [planForm, setPlanForm] = reactExports.useState({ name: "", description: "", amount: 0, period: "monthly", features: [], target_role: "all", category: "", plan_type: "single", is_active: 1, sort_order: 0 });
  const [customCategory, setCustomCategory] = reactExports.useState("");
  const [featureInput, setFeatureInput] = reactExports.useState("");
  const [planSaving, setPlanSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const [transLang, setTransLang] = reactExports.useState("en");
  const [translating, setTranslating] = reactExports.useState(false);
  const [payments, setPayments] = reactExports.useState([]);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [adminNote, setAdminNote] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [detailModal, setDetailModal] = reactExports.useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  reactExports.useEffect(() => {
    fetchSettings();
    fetchPlans();
    fetchPayments();
  }, []);
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_settings.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/manage_plans.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" })
      });
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_payments.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setPayments(data.payments);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/update_settings.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      showToast(data.success ? t("paymentsPage.settingsSaved") : data.message || t("paymentsPage.saveFailed"), data.success ? "success" : "error");
    } catch (err) {
      showToast(t("paymentsPage.errorOccurred"), "error");
    } finally {
      setSaving(false);
    }
  };
  const openPlanModal = (plan = null) => {
    if (plan) {
      const cat = plan.category || "";
      const isCustom = cat && !CATEGORY_KEY_OPTIONS.includes(cat);
      setPlanForm({
        name: plan.name || "",
        description: plan.description || "",
        amount: plan.amount || 0,
        period: plan.period || "monthly",
        features: plan.features || [],
        target_role: plan.target_role || "all",
        category: isCustom ? "__custom__" : cat,
        plan_type: plan.plan_type || "single",
        is_active: plan.is_active ?? 1,
        sort_order: plan.sort_order || 0,
        translations: plan.translations || {}
      });
      setCustomCategory(isCustom ? cat : "");
      setPlanModal(plan);
    } else {
      setPlanForm({ name: "", description: "", amount: 0, period: "monthly", features: [], target_role: "all", category: "", plan_type: "single", is_active: 1, sort_order: plans.length, translations: {} });
      setCustomCategory("");
      setPlanModal("new");
    }
    setFeatureInput("");
    setTransLang("en");
  };
  const updateTranslation = (lang, field, value) => {
    setPlanForm((f) => {
      var _a2;
      return {
        ...f,
        translations: {
          ...f.translations,
          [lang]: { ...((_a2 = f.translations) == null ? void 0 : _a2[lang]) || {}, [field]: value }
        }
      };
    });
  };
  const updateTransFeature = (lang, idx, value) => {
    setPlanForm((f) => {
      var _a2, _b2, _c2;
      const current = ((_b2 = (_a2 = f.translations) == null ? void 0 : _a2[lang]) == null ? void 0 : _b2.features) || [];
      const updated = [...current];
      updated[idx] = value;
      return {
        ...f,
        translations: {
          ...f.translations,
          [lang]: { ...((_c2 = f.translations) == null ? void 0 : _c2[lang]) || {}, features: updated }
        }
      };
    });
  };
  const autoTranslateAll = async () => {
    if (!planForm.name.trim()) {
      showToast(t("paymentsPage.enterServiceName"), "error");
      return;
    }
    setTranslating(true);
    try {
      const myMemoryLangMap = { en: "en", vi: "vi", ja: "ja", th: "th", km: "km", ru: "ru", uk: "uk" };
      const newTranslations = { ...planForm.translations };
      for (const lang of LANG_OPTIONS) {
        const targetLang = myMemoryLangMap[lang.code] || lang.code;
        const translateOne = async (text) => {
          var _a2;
          if (!text || !text.trim()) return "";
          try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|${targetLang}`);
            const data = await response.json();
            if (data.responseStatus === 200 && ((_a2 = data.responseData) == null ? void 0 : _a2.translatedText)) {
              return data.responseData.translatedText;
            }
            return text;
          } catch {
            return text;
          }
        };
        const translatedName = await translateOne(planForm.name);
        const translatedDesc = await translateOne(planForm.description);
        const translatedFeatures = [];
        for (const f of planForm.features) {
          translatedFeatures.push(await translateOne(f));
        }
        newTranslations[lang.code] = {
          name: translatedName,
          description: translatedDesc,
          features: translatedFeatures
        };
      }
      setPlanForm((f) => ({ ...f, translations: newTranslations }));
      showToast(t("paymentsPage.autoTranslateSuccess", "자동 번역이 완료되었습니다!"));
    } catch (err) {
      console.error("Auto-translate error:", err);
      showToast(t("paymentsPage.autoTranslateFailed", "자동 번역에 실패했습니다."), "error");
    } finally {
      setTranslating(false);
    }
  };
  const addFeature = () => {
    if (featureInput.trim()) {
      setPlanForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };
  const removeFeature = (idx) => {
    setPlanForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  };
  const handleSavePlan = async () => {
    if (!planForm.name.trim()) {
      showToast(t("paymentsPage.enterServiceName"), "error");
      return;
    }
    if (planForm.amount <= 0) {
      showToast(t("paymentsPage.enterAmount"), "error");
      return;
    }
    setPlanSaving(true);
    try {
      const isEdit = planModal !== "new";
      const finalCategory = planForm.category === "__custom__" ? customCategory.trim() : planForm.category;
      const res = await fetch(`${API_BASE}/manage_plans.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "create",
          ...isEdit ? { id: planModal.id } : {},
          ...planForm,
          category: finalCategory,
          translations: planForm.translations || {}
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPlanModal(null);
        fetchPlans();
      } else {
        const debugInfo = data.debug_role !== void 0 ? ` (role: ${data.debug_role || "empty"})` : "";
        showToast((data.message || t("paymentsPage.saveFailed")) + debugInfo, "error");
      }
    } catch (err) {
      showToast(t("paymentsPage.errorOccurred") + ": " + err.message, "error");
    } finally {
      setPlanSaving(false);
    }
  };
  const handleDeletePlan = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/manage_plans.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchPlans();
      } else showToast(data.message || t("paymentsPage.deleteFailed"), "error");
    } catch (err) {
      showToast(t("paymentsPage.errorOccurred"), "error");
    }
    setDeleteConfirm(null);
  };
  const handleTogglePlan = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/manage_plans.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id })
      });
      const data = await res.json();
      if (data.success) fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };
  const handleMovePlan = async (index, direction) => {
    const newPlans = [...plans];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPlans.length) return;
    [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
    setPlans(newPlans);
    try {
      const res = await fetch(`${API_BASE}/manage_plans.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", ordered_ids: newPlans.map((p) => p.id) })
      });
      const data = await res.json();
      if (data.success) showToast(t("paymentsPage.orderChanged"));
      else {
        showToast(data.message || t("paymentsPage.orderFailed"), "error");
        fetchPlans();
      }
    } catch (err) {
      showToast(t("paymentsPage.errorOccurred"), "error");
      fetchPlans();
    }
  };
  const handleConfirmAction = async (action) => {
    if (!confirmModal) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/confirm_payment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: confirmModal.id, action, admin_note: adminNote })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setConfirmModal(null);
        setAdminNote("");
        fetchPayments();
      } else showToast(data.message || t("paymentsPage.processFailed"), "error");
    } catch (err) {
      showToast(t("paymentsPage.errorOccurred"), "error");
    } finally {
      setProcessing(false);
    }
  };
  const filteredPayments = reactExports.useMemo(() => {
    let result = payments;
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);
    if (typeFilter !== "all") result = result.filter((p) => p.payment_type === typeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => (p.user_name || "").toLowerCase().includes(q) || (p.depositor_name || "").toLowerCase().includes(q) || (p.reference_label || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [payments, statusFilter, typeFilter, searchQuery]);
  const groupedPlans = reactExports.useMemo(() => {
    const catKeyMap = {
      "입점 서비스": "categoryListing",
      "마케팅 서비스": "categoryMarketing",
      "프리미엄 서비스": "categoryPremium"
    };
    const groups = {};
    plans.forEach((plan) => {
      var _a2;
      const rawCat = ((_a2 = plan.category) == null ? void 0 : _a2.trim()) || "";
      const catKey = catKeyMap[rawCat] || rawCat || "categoryOther";
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(plan);
    });
    const order = ["categoryListing", "categoryMarketing", "categoryPremium"];
    const result = [];
    order.forEach((cat) => {
      if (groups[cat]) {
        result.push({ category: cat, plans: groups[cat] });
        delete groups[cat];
      }
    });
    Object.entries(groups).forEach(([cat, ps]) => result.push({ category: cat, plans: ps }));
    return result;
  }, [plans]);
  const stats = reactExports.useMemo(() => ({
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    submitted: payments.filter((p) => p.status === "submitted").length,
    confirmed: payments.filter((p) => p.status === "confirmed").length,
    totalConfirmed: payments.filter((p) => p.status === "confirmed").reduce((s, p) => s + parseInt(p.amount || 0), 0)
  }), [payments]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-20", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-bold text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`,
        style: { animation: "popupScale 0.3s ease" },
        children: toast.message
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
          t("paymentsPage.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium mt-2", children: t("paymentsPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-gray-100/80 rounded-xl", children: [
        { id: "plans", icon: Package, label: t("paymentsPage.tabPlans") },
        { id: "settings", icon: Settings, label: t("paymentsPage.tabSettings") },
        { id: "history", icon: History, label: t("paymentsPage.tabHistory"), badge: stats.submitted }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
            " ",
            tab.label,
            tab.badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold", children: tab.badge })
          ]
        },
        tab.id
      )) })
    ] }),
    activeTab === "plans" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("paymentsPage.planDesc", { count: plans.length }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openPlanModal(), className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
          " ",
          t("paymentsPage.addService")
        ] })
      ] }),
      groupedPlans.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: groupedPlans.map((group) => {
        const catMeta = CATEGORY_META_KEYS[group.category] || DEFAULT_CAT_META;
        const CatIcon = catMeta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${catMeta.bg} ${catMeta.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CatIcon, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900", children: t(`paymentsPage.${group.category}`) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("paymentsPage.serviceCount", { count: group.plans.length }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: group.plans.map((plan, index) => {
            const globalIndex = plans.indexOf(plan);
            const isPackage = plan.plan_type === "package";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `bg-white rounded-2xl border shadow-sm p-5 relative transition-all hover:shadow-lg ${plan.is_active == 1 ? "border-gray-100" : "border-gray-200 opacity-60"} ${isPackage ? "ring-2 ring-amber-200/50" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => handleMovePlan(globalIndex, "up"),
                          disabled: globalIndex === 0,
                          className: `p-1 rounded-md transition-colors ${globalIndex === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"}`,
                          title: t("paymentsPage.moveForward"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 14 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-300 min-w-[18px] text-center", children: globalIndex + 1 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => handleMovePlan(globalIndex, "down"),
                          disabled: globalIndex === plans.length - 1,
                          className: `p-1 rounded-md transition-colors ${globalIndex === plans.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"}`,
                          title: t("paymentsPage.moveBack"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 14 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => handleTogglePlan(plan.id),
                          className: `p-1.5 rounded-lg transition-colors ${plan.is_active == 1 ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`,
                          title: plan.is_active == 1 ? t("paymentsPage.deactivate") : t("paymentsPage.activate"),
                          children: plan.is_active == 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { size: 18 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => openPlanModal(plan),
                          className: "p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors",
                          title: t("paymentsPage.edit"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setDeleteConfirm(plan),
                          className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                          title: t("paymentsPage.delete"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 text-lg", children: plan.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 mb-3 flex flex-wrap gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${plan.is_active == 1 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`, children: plan.is_active == 1 ? t("paymentsPage.active") : t("paymentsPage.inactive") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700", children: t(ROLE_MAP_KEYS[plan.target_role] || "paymentsPage.roleAll") }),
                    isPackage && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 10 }),
                      " ",
                      t("paymentsPage.package")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-gray-900 mb-2", children: [
                    "₩",
                    parseInt(plan.amount || 0).toLocaleString(),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-400 font-medium ml-1", children: [
                      "/ ",
                      t(PERIOD_MAP_KEYS[plan.period] || "paymentsPage.periodMonthly")
                    ] })
                  ] }),
                  plan.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-3 line-clamp-2", children: plan.description }),
                  plan.features && plan.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 pt-3 border-t border-gray-100", children: plan.features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14, className: `${isPackage ? "text-amber-500" : "text-emerald-500"} flex-shrink-0` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
                  ] }, i)) })
                ]
              },
              plan.id
            );
          }) })
        ] }, group.category);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-400 mb-1", children: t("paymentsPage.noServicesTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 mb-4", children: t("paymentsPage.noServicesDesc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openPlanModal(), className: "px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "inline mr-1" }),
          " ",
          t("paymentsPage.addFirstService")
        ] })
      ] })
    ] }),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("paymentsPage.paymentFeature") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("paymentsPage.paymentFeatureDesc") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSettings((s) => ({ ...s, is_payment_enabled: s.is_payment_enabled ? 0 : 1 })),
              className: `flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${settings.is_payment_enabled ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
              children: [
                settings.is_payment_enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { size: 20 }),
                settings.is_payment_enabled ? t("paymentsPage.paymentOn") : t("paymentsPage.paymentOff")
              ]
            }
          )
        ] }),
        !settings.is_payment_enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 18, className: "text-amber-500 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: t("paymentsPage.paymentDisabledTitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("paymentsPage.paymentDisabledDesc") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 20, className: "text-indigo-500" }),
          " ",
          t("paymentsPage.bankInfo")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          { key: "bank_name", label: t("paymentsPage.bankName"), placeholder: t("paymentsPage.bankNamePlaceholder") },
          { key: "account_number", label: t("paymentsPage.accountNumber"), placeholder: t("paymentsPage.accountNumberPlaceholder") },
          { key: "account_holder", label: t("paymentsPage.accountHolder"), placeholder: t("paymentsPage.accountHolderPlaceholder") }
        ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: field.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: settings[field.key],
              onChange: (e) => setSettings((s) => ({ ...s, [field.key]: e.target.value })),
              placeholder: field.placeholder,
              className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            }
          )
        ] }, field.key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-5", children: t("paymentsPage.paymentNotice") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: settings.payment_notice,
            onChange: (e) => setSettings((s) => ({ ...s, payment_notice: e.target.value })),
            placeholder: t("paymentsPage.paymentNoticePlaceholder"),
            rows: 4,
            className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleSaveSettings,
          disabled: saving,
          className: "flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
            " ",
            saving ? t("paymentsPage.saving") : t("paymentsPage.saveSettings")
          ]
        }
      ) })
    ] }),
    activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
        { label: t("paymentsPage.statsAll"), value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
        { label: t("paymentsPage.statsAwaitPayment"), value: stats.pending, color: "text-gray-600", bg: "bg-gray-50" },
        { label: t("paymentsPage.statsAwaitConfirm"), value: stats.submitted, color: "text-blue-600", bg: "bg-blue-50" },
        { label: t("paymentsPage.statsConfirmed"), value: stats.confirmed, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: t("paymentsPage.statsTotalAmount"), value: `₩${stats.totalConfirmed.toLocaleString()}`, color: "text-indigo-600", bg: "bg-indigo-50" }
      ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${s.bg} rounded-2xl p-4 border border-gray-100`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 mb-1", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-extrabold ${s.color}`, children: s.value })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: t("paymentsPage.searchPlaceholder"),
              className: "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("paymentsPage.allStatus") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: t("paymentsPage.statusPending") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "submitted", children: t("paymentsPage.statusSubmitted") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "confirmed", children: t("paymentsPage.statusConfirmed") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: t("paymentsPage.statusRejected") })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: filteredPayments.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: [t("paymentsPage.colNo"), t("paymentsPage.colUser"), t("paymentsPage.colService"), t("paymentsPage.colAmount"), t("paymentsPage.colDepositor"), t("paymentsPage.colStatus"), t("paymentsPage.colDate"), t("paymentsPage.colManage")].map((h, hi) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${hi === 3 ? "text-right" : hi === 7 ? "text-center" : "text-left"} px-5 py-3.5 font-bold text-gray-500 text-xs`, children: h }, h)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredPayments.map((p, idx) => {
          const si = STATUS_MAP_KEYS[p.status] || STATUS_MAP_KEYS.pending;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-gray-400 font-medium", children: filteredPayments.length - idx }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-gray-900", children: p.user_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: p.user_role === "host" ? t("paymentsPage.host") : t("paymentsPage.seller") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-gray-700 font-medium", children: p.reference_label || p.payment_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4 text-right font-bold text-gray-900", children: [
              "₩",
              parseInt(p.amount || 0).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-gray-700 font-medium", children: p.depositor_name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${si.bg}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${si.dot}` }),
              t(si.labelKey)
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-gray-500 text-xs", children: new Date(p.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDetailModal(p), className: "p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
              p.status === "submitted" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setConfirmModal(p);
                      setAdminNote("");
                    },
                    className: "px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors",
                    children: t("paymentsPage.confirm")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setConfirmModal({ ...p, _rejectMode: true });
                      setAdminNote("");
                    },
                    className: "px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors",
                    children: t("paymentsPage.reject")
                  }
                )
              ] })
            ] }) })
          ] }, p.id);
        }) })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-400 mb-1", children: t("paymentsPage.noPaymentsTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300", children: t("paymentsPage.noPaymentsDesc") })
      ] }) })
    ] }),
    planModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setPlanModal(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPlanModal(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: planModal === "new" ? t("paymentsPage.newService") : t("paymentsPage.editService") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: [
              t("paymentsPage.serviceName"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: planForm.name,
                onChange: (e) => setPlanForm((f) => ({ ...f, name: e.target.value })),
                placeholder: t("paymentsPage.serviceNamePlaceholder"),
                className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.description") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: planForm.description,
                onChange: (e) => setPlanForm((f) => ({ ...f, description: e.target.value })),
                placeholder: t("paymentsPage.descriptionPlaceholder"),
                rows: 3,
                className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: [
                t("paymentsPage.amountLabel"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: planForm.amount, onChange: (val) => setPlanForm((f) => ({ ...f, amount: parseInt(val) || 0 })), className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.paymentCycle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: planForm.period,
                  onChange: (e) => setPlanForm((f) => ({ ...f, period: e.target.value })),
                  className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: t("paymentsPage.monthlyLabel") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yearly", children: t("paymentsPage.yearlyLabel") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "once", children: t("paymentsPage.onceLabel") })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.target") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: planForm.target_role,
                onChange: (e) => setPlanForm((f) => ({ ...f, target_role: e.target.value })),
                className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("paymentsPage.targetAll") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "host", children: t("paymentsPage.targetVendor") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "seller", children: t("paymentsPage.targetSeller") })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.category") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: planForm.category,
                  onChange: (e) => {
                    setPlanForm((f) => ({ ...f, category: e.target.value }));
                    if (e.target.value !== "__custom__") setCustomCategory("");
                  },
                  className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("paymentsPage.noSelection") }),
                    CATEGORY_KEY_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t(`paymentsPage.${c}`), children: t(`paymentsPage.${c}`) }, c)),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__custom__", children: t("paymentsPage.customInput") })
                  ]
                }
              ),
              planForm.category === "__custom__" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: customCategory,
                  onChange: (e) => setCustomCategory(e.target.value),
                  placeholder: t("paymentsPage.categoryPlaceholder"),
                  className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.serviceType") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: planForm.plan_type,
                  onChange: (e) => setPlanForm((f) => ({ ...f, plan_type: e.target.value })),
                  className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "single", children: t("paymentsPage.singleService") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "package", children: t("paymentsPage.packageService") })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.includedFeatures") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: featureInput,
                  onChange: (e) => setFeatureInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  },
                  placeholder: t("paymentsPage.featurePlaceholder"),
                  className: "flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: addFeature, className: "px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors", children: t("paymentsPage.add") })
            ] }),
            planForm.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 bg-gray-50 rounded-xl p-3", children: planForm.features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-700 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14, className: "text-emerald-500" }),
                " ",
                f
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeFeature(i), className: "text-gray-400 hover:text-red-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-200 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-bold text-gray-700 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 16, className: "text-indigo-500" }),
                t("paymentsPage.translations", "다국어 번역")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: autoTranslateAll,
                  disabled: translating,
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: translating ? "animate-spin" : "" }),
                    translating ? t("paymentsPage.translating", "번역 중...") : t("paymentsPage.autoTranslate", "자동 번역")
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-3", children: LANG_OPTIONS.map((lang) => {
              var _a2, _b2;
              const hasTrans = (_b2 = (_a2 = planForm.translations) == null ? void 0 : _a2[lang.code]) == null ? void 0 : _b2.name;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setTransLang(lang.code),
                  className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${transLang === lang.code ? "bg-indigo-500 text-white border-indigo-500" : hasTrans ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`,
                  children: [
                    lang.flag,
                    " ",
                    lang.label,
                    hasTrans && transLang !== lang.code && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 10, className: "text-emerald-500" })
                  ]
                },
                lang.code
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 font-medium", children: [
                (_a = LANG_OPTIONS.find((l) => l.code === transLang)) == null ? void 0 : _a.flag,
                " ",
                (_b = LANG_OPTIONS.find((l) => l.code === transLang)) == null ? void 0 : _b.label,
                " ",
                t("paymentsPage.translationLabel", "번역")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("paymentsPage.serviceName") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: ((_d = (_c = planForm.translations) == null ? void 0 : _c[transLang]) == null ? void 0 : _d.name) || "",
                    onChange: (e) => updateTranslation(transLang, "name", e.target.value),
                    placeholder: planForm.name || t("paymentsPage.serviceNamePlaceholder"),
                    className: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("paymentsPage.description") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: ((_f = (_e = planForm.translations) == null ? void 0 : _e[transLang]) == null ? void 0 : _f.description) || "",
                    onChange: (e) => updateTranslation(transLang, "description", e.target.value),
                    placeholder: planForm.description || t("paymentsPage.descriptionPlaceholder"),
                    rows: 2,
                    className: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                  }
                )
              ] }),
              planForm.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("paymentsPage.includedFeatures") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: planForm.features.map((origFeature, idx) => {
                  var _a2, _b2, _c2;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400 w-4 flex-shrink-0", children: [
                      idx + 1,
                      "."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: ((_c2 = (_b2 = (_a2 = planForm.translations) == null ? void 0 : _a2[transLang]) == null ? void 0 : _b2.features) == null ? void 0 : _c2[idx]) || "",
                        onChange: (e) => updateTransFeature(transLang, idx, e.target.value),
                        placeholder: origFeature,
                        className: "flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      }
                    )
                  ] }, idx);
                }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1.5", children: t("paymentsPage.sortOrder") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: planForm.sort_order, onChange: (val) => setPlanForm((f) => ({ ...f, sort_order: parseInt(val) || 0 })), className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPlanModal(null), className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors", children: t("paymentsPage.cancel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSavePlan,
              disabled: planSaving,
              className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50",
              children: planSaving ? t("paymentsPage.savingPlan") : planModal === "new" ? t("paymentsPage.addPlan") : t("paymentsPage.editPlan")
            }
          )
        ] })
      ] })
    ] }),
    deleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setDeleteConfirm(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("paymentsPage.deleteService") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("paymentsPage.deleteConfirm", { name: deleteConfirm.name }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteConfirm(null), className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50", children: t("paymentsPage.cancel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeletePlan(deleteConfirm.id), className: "flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600", children: t("paymentsPage.delete") })
        ] })
      ] })
    ] }),
    detailModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setDetailModal(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDetailModal(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20, className: "text-indigo-500" }),
          " ",
          t("paymentsPage.paymentDetail")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-sm", children: [
          [t("paymentsPage.detailUser"), `${detailModal.user_name} (${detailModal.user_role === "host" ? t("paymentsPage.host") : t("paymentsPage.seller")})`],
          [t("paymentsPage.detailService"), detailModal.reference_label || detailModal.payment_type],
          [t("paymentsPage.detailAmount"), `₩${parseInt(detailModal.amount || 0).toLocaleString()}`],
          [t("paymentsPage.detailDepositor"), detailModal.depositor_name || "—"],
          [t("paymentsPage.detailStatus"), t((STATUS_MAP_KEYS[detailModal.status] || {}).labelKey || "paymentsPage.statusPending")],
          [t("paymentsPage.detailAdminNote"), detailModal.admin_note || "—"],
          [t("paymentsPage.detailCreatedAt"), new Date(detailModal.created_at).toLocaleString()],
          [t("paymentsPage.detailSubmittedAt"), detailModal.submitted_at ? new Date(detailModal.submitted_at).toLocaleString() : "—"],
          [t("paymentsPage.detailConfirmedAt"), detailModal.confirmed_at ? new Date(detailModal.confirmed_at).toLocaleString() : "—"]
        ].map(([l, v], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-2 border-b border-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: l }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-900 font-bold text-right max-w-[60%]", children: v })
        ] }, i)) })
      ] })
    ] }),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setConfirmModal(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmModal(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${confirmModal._rejectMode ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`, children: confirmModal._rejectMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: confirmModal._rejectMode ? t("paymentsPage.rejectDeposit") : t("paymentsPage.confirmDeposit") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
              confirmModal.user_name,
              " — ₩",
              parseInt(confirmModal.amount || 0).toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: t("paymentsPage.depositorNameLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: confirmModal.depositor_name || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: t("paymentsPage.submittedAtLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: confirmModal.submitted_at ? new Date(confirmModal.submitted_at).toLocaleString() : "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: t("paymentsPage.adminNoteLabel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: adminNote,
            onChange: (e) => setAdminNote(e.target.value),
            placeholder: t("paymentsPage.adminNotePlaceholder"),
            rows: 3,
            className: "w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmModal(null), className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors", children: t("paymentsPage.close") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleConfirmAction(confirmModal._rejectMode ? "reject" : "confirm"),
              disabled: processing,
              className: `flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${confirmModal._rejectMode ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`,
              children: processing ? t("paymentsPage.processing") : confirmModal._rejectMode ? t("paymentsPage.rejectProcess") : t("paymentsPage.confirmProcess")
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes popupScale {
                    from { transform: scale(0.9) translateY(10px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            ` })
  ] });
};
export {
  AdminPayments as default
};
