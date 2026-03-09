import { a as useAuth, i as countryToLang, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, x as CreditCard, W as Package, aq as Clock, bj as Banknote, b7 as Copy, az as Calendar, bl as CalendarDays, k as Sparkles, aL as Crown, an as Zap, p as ShoppingBag, aE as Layers, a0 as ChevronDown, ao as Star, ac as Tag, C as CheckCircle, b as ChevronRight, X as XCircle, i as Send, a as X } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api/payments";
const DEFAULT_CAT_META = { icon: Layers, gradient: "from-purple-500 to-pink-600", bgLight: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" };
const SellerPayments = () => {
  const { user } = useAuth();
  const { t } = useTranslation("seller");
  const STATUS_MAP = {
    pending: { label: t("paymentsPage.statusPending"), color: "text-amber-600", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-400", icon: Clock },
    submitted: { label: t("paymentsPage.statusSubmitted"), color: "text-blue-600", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-400", icon: Send },
    confirmed: { label: t("paymentsPage.statusConfirmed"), color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-400", icon: CheckCircle },
    rejected: { label: t("paymentsPage.statusRejected"), color: "text-red-600", bg: "bg-red-50 border-red-200", dot: "bg-red-400", icon: XCircle }
  };
  const PERIOD_LABEL = { monthly: t("paymentsPage.periodMonthly"), yearly: t("paymentsPage.periodYearly"), once: t("paymentsPage.periodOnce") };
  const CATEGORY_META = {
    [t("paymentsPage.catEntry")]: { icon: ShoppingBag, gradient: "from-indigo-500 to-blue-600", bgLight: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600" },
    [t("paymentsPage.catMarketing")]: { icon: Zap, gradient: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
    [t("paymentsPage.catPremium")]: { icon: Crown, gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" }
  };
  const [loading, setLoading] = reactExports.useState(true);
  const [toast, setToast] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState(null);
  const [plans, setPlans] = reactExports.useState([]);
  const [payments, setPayments] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("plans");
  const [selectedPlan, setSelectedPlan] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [submitModal, setSubmitModal] = reactExports.useState(null);
  const [depositorName, setDepositorName] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [collapsedCats, setCollapsedCats] = reactExports.useState({});
  const [billingPeriod, setBillingPeriod] = reactExports.useState("monthly");
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  reactExports.useEffect(() => {
    Promise.all([fetchSettings(), fetchPlans(), fetchPayments()]).finally(() => setLoading(false));
  }, []);
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_settings.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPlans = async () => {
    try {
      const userLang = countryToLang(user == null ? void 0 : user.country);
      const res = await fetch(`${API_BASE}/get_plans.php?lang=${userLang}`, { credentials: "include" });
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
  const handleCreatePayment = async (plan) => {
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/create_payment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_type: "plan",
          amount: plan.amount,
          plan_id: plan.id,
          reference_label: plan.name
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t("paymentsPage.paymentCreated"));
        setSelectedPlan(null);
        setActiveTab("history");
        fetchPayments();
      } else {
        showToast(data.message || t("paymentsPage.paymentCreateFailed"), "error");
      }
    } catch (err) {
      showToast(t("common:error"), "error");
    } finally {
      setCreating(false);
    }
  };
  const handleSubmitDeposit = async () => {
    if (!depositorName.trim()) {
      showToast(t("paymentsPage.enterDepositor"), "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/submit_payment.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: submitModal.id, depositor_name: depositorName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSubmitModal(null);
        setDepositorName("");
        fetchPayments();
      } else showToast(data.message || t("paymentsPage.processFailed"), "error");
    } catch (err) {
      showToast(t("common:error"), "error");
    } finally {
      setSubmitting(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast(t("paymentsPage.copied"));
  };
  const toggleCategory = (cat) => setCollapsedCats((c) => ({ ...c, [cat]: !c[cat] }));
  const groupedPlans = reactExports.useMemo(() => {
    const groups = {};
    plans.forEach((plan) => {
      var _a;
      const cat = ((_a = plan.category) == null ? void 0 : _a.trim()) || t("paymentsPage.catOther");
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(plan);
    });
    const order = [t("paymentsPage.catEntry"), t("paymentsPage.catMarketing"), t("paymentsPage.catPremium")];
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
  const filteredGroupedPlans = reactExports.useMemo(() => {
    return groupedPlans.map((group) => ({
      ...group,
      plans: group.plans.filter((plan) => {
        if (billingPeriod === "all") return true;
        return plan.period === billingPeriod;
      })
    })).filter((group) => group.plans.length > 0);
  }, [groupedPlans, billingPeriod]);
  const periodCounts = reactExports.useMemo(() => {
    const counts = { monthly: 0, yearly: 0, once: 0, all: plans.length };
    plans.forEach((p) => {
      if (counts[p.period] !== void 0) counts[p.period]++;
    });
    return counts;
  }, [plans]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-20", children: [
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-bold text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`,
        style: { animation: "popupScale 0.3s ease" },
        children: toast.message
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
          t("paymentsPage.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium mt-2", children: t("paymentsPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex p-1 bg-gray-100 border border-gray-200 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("plans"),
            className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "plans" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 }),
              " ",
              t("paymentsPage.tabPlans")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("history"),
            className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }),
              " ",
              t("paymentsPage.tabHistory"),
              payments.filter((p) => p.status === "pending").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs font-bold", children: payments.filter((p) => p.status === "pending").length })
            ]
          }
        )
      ] })
    ] }),
    settings && settings.bank_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 relative overflow-hidden border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full translate-y-1/2 -translate-x-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 18, className: "text-indigo-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900", children: t("paymentsPage.accountTitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs font-medium mb-1", children: t("paymentsPage.bankName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg text-gray-900", children: settings.bank_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs font-medium mb-1", children: t("paymentsPage.accountNumber") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg text-gray-900", children: settings.account_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => copyToClipboard(settings.account_number),
                  className: "p-1.5 bg-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-200 transition-all",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs font-medium mb-1", children: t("paymentsPage.accountHolder") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg text-gray-900", children: settings.account_holder })
          ] })
        ] }),
        settings.payment_notice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: settings.payment_notice }) })
      ] })
    ] }),
    activeTab === "plans" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 18, className: "text-indigo-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900", children: t("paymentsPage.billingPeriod", "결제 주기") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex p-1 bg-gray-100 rounded-xl gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setBillingPeriod("monthly"),
                className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === "monthly" ? "bg-white text-indigo-700 shadow-md border border-indigo-100" : "text-gray-500 hover:text-gray-700"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 15 }),
                  t("paymentsPage.periodMonthly"),
                  periodCounts.monthly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === "monthly" ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500"}`, children: periodCounts.monthly })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setBillingPeriod("yearly"),
                className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all relative ${billingPeriod === "yearly" ? "bg-white text-emerald-700 shadow-md border border-emerald-100" : "text-gray-500 hover:text-gray-700"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 15 }),
                  t("paymentsPage.periodYearly"),
                  periodCounts.yearly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === "yearly" ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`, children: periodCounts.yearly }),
                  periodCounts.yearly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[9px] font-black shadow-md", children: "SAVE" })
                ]
              }
            ),
            periodCounts.once > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setBillingPeriod("once"),
                className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === "once" ? "bg-white text-amber-700 shadow-md border border-amber-100" : "text-gray-500 hover:text-gray-700"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 15 }),
                  t("paymentsPage.periodOnce"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded-full text-[10px] font-bold ${billingPeriod === "once" ? "bg-amber-100 text-amber-600" : "bg-gray-200 text-gray-500"}`, children: periodCounts.once })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setBillingPeriod("all"),
                className: `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${billingPeriod === "all" ? "bg-white text-gray-700 shadow-md border border-gray-200" : "text-gray-400 hover:text-gray-600"}`,
                children: t("paymentsPage.periodAll", "전체")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
          billingPeriod === "monthly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-indigo-400 rounded-full" }),
            t("paymentsPage.monthlyDesc", "매월 자동 결제되는 요금제입니다. 언제든지 해지 가능합니다.")
          ] }),
          billingPeriod === "yearly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-600 flex items-center gap-2 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-emerald-400 rounded-full" }),
            t("paymentsPage.yearlyDesc", "연간 결제 시 할인된 요금이 적용됩니다.")
          ] }),
          billingPeriod === "once" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-600 flex items-center gap-2 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-amber-400 rounded-full" }),
            t("paymentsPage.onceDesc", "한 번만 결제하면 영구적으로 이용 가능합니다.")
          ] })
        ] })
      ] }),
      filteredGroupedPlans.length > 0 ? filteredGroupedPlans.map((group) => {
        const catMeta = CATEGORY_META[group.category] || DEFAULT_CAT_META;
        const CatIcon = catMeta.icon;
        const isCollapsed = collapsedCats[group.category];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => toggleCategory(group.category),
              className: "w-full flex items-center gap-3 group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 bg-gradient-to-br ${catMeta.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CatIcon, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors", children: group.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("paymentsPage.serviceCount", { count: group.plans.length }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 18, className: `text-gray-400 transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}` })
              ]
            }
          ),
          !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pl-2", children: group.plans.map((plan, idx) => {
            const isPackage = plan.plan_type === "package";
            const isFirst = idx === 0 && group === groupedPlans[0];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPackage ? "bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-md hover:shadow-amber-200/50" : isFirst ? "bg-gradient-to-b from-indigo-50 to-white border-indigo-200 shadow-md hover:shadow-indigo-200/50" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 flex-wrap", children: [
                      isPackage && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 12 }),
                        " ",
                        t("paymentsPage.packageBadge")
                      ] }),
                      isFirst && !isPackage && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12 }),
                        " ",
                        t("paymentsPage.recommendBadge")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${catMeta.bgLight} ${catMeta.border} ${catMeta.text} border`, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 10 }),
                        " ",
                        group.category
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900", children: plan.name }),
                    plan.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-3 leading-relaxed whitespace-pre-line", children: plan.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-gray-100", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-extrabold text-gray-900", children: [
                      "₩",
                      parseInt(plan.amount || 0).toLocaleString(),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-400 font-medium ml-1", children: [
                        "/ ",
                        PERIOD_LABEL[plan.period] || t("paymentsPage.periodMonthly")
                      ] })
                    ] }),
                    plan.period === "yearly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 mt-1 font-bold flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 12 }),
                      t("paymentsPage.yearlySaving", "월간 결제 대비 할인 적용")
                    ] }),
                    isPackage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600 mt-1 font-medium", children: t("paymentsPage.packageDesc") })
                  ] }),
                  plan.features && plan.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-4 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: plan.features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16, className: `${isPackage ? "text-amber-500" : "text-emerald-500"} flex-shrink-0 mt-0.5` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: f })
                  ] }, i)) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setSelectedPlan(plan),
                      className: `w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isPackage ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30" : isFirst ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`,
                      children: [
                        t("paymentsPage.payBtn"),
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
                      ]
                    }
                  ) })
                ]
              },
              plan.id
            );
          }) })
        ] }, group.category);
      }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-500 mb-1", children: t("paymentsPage.noPlans") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: t("paymentsPage.noPlansDesc") })
      ] })
    ] }),
    activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: payments.length > 0 ? payments.map((p) => {
      const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.pending;
      const StatusIcon = statusInfo.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-5 md:p-6 shadow-sm hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : p.status === "submitted" ? "bg-blue-100 text-blue-600" : p.status === "rejected" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 22 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900", children: p.reference_label || p.payment_type }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-1.5 h-1.5 rounded-full ${statusInfo.dot}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusInfo.color, children: statusInfo.label })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-extrabold text-gray-900", children: [
                "₩",
                parseInt(p.amount || 0).toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(p.created_at).toLocaleDateString() }),
                p.depositor_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  t("paymentsPage.depositor"),
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 font-medium", children: p.depositor_name })
                ] })
              ] }),
              p.status === "rejected" && p.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                  t("paymentsPage.adminNote"),
                  ":"
                ] }),
                " ",
                p.admin_note
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setSubmitModal(p);
                  setDepositorName("");
                },
                className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
                  " ",
                  t("paymentsPage.depositDone")
                ]
              }
            ),
            p.status === "submitted" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16 }),
              " ",
              t("paymentsPage.awaitingAdmin")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full transition-all duration-1000 ${p.status === "rejected" ? "bg-red-500 w-full" : p.status === "confirmed" ? "bg-emerald-500 w-full" : p.status === "submitted" ? "bg-blue-500 w-2/3" : "bg-indigo-400 w-1/3"}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-500", children: t("paymentsPage.progressCreated") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: p.status === "submitted" || p.status === "confirmed" ? "text-blue-500" : "", children: t("paymentsPage.progressDeposited") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: p.status === "confirmed" ? "text-emerald-500" : p.status === "rejected" ? "text-red-500" : "", children: p.status === "rejected" ? t("paymentsPage.statusRejected") : t("paymentsPage.statusConfirmed") })
          ] })
        ] })
      ] }, p.id);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-gray-700 font-bold mb-1", children: t("paymentsPage.noHistory") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: t("paymentsPage.noHistoryDesc") })
    ] }) }),
    selectedPlan && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setSelectedPlan(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          style: { animation: "popupScale 0.3s ease" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedPlan(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${selectedPlan.plan_type === "package" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"}`, children: selectedPlan.plan_type === "package" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("paymentsPage.confirmTitle") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("paymentsPage.confirmDesc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-xl p-4 mb-5 ${selectedPlan.plan_type === "package" ? "bg-amber-50 border-amber-200" : "bg-indigo-50 border-indigo-200"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                selectedPlan.plan_type === "package" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-amber-200 text-amber-700 rounded-full text-[10px] font-bold", children: t("paymentsPage.packageBadge") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 text-lg", children: selectedPlan.name })
              ] }),
              selectedPlan.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-2 leading-relaxed whitespace-pre-line", children: selectedPlan.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-2xl font-extrabold ${selectedPlan.plan_type === "package" ? "text-amber-600" : "text-indigo-600"}`, children: [
                "₩",
                parseInt(selectedPlan.amount || 0).toLocaleString(),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-400 font-medium ml-1", children: [
                  "/ ",
                  PERIOD_LABEL[selectedPlan.period] || t("paymentsPage.periodMonthly")
                ] })
              ] }),
              selectedPlan.features && selectedPlan.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-gray-200 space-y-1.5", children: selectedPlan.features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 14, className: `${selectedPlan.plan_type === "package" ? "text-amber-500" : "text-emerald-500"} flex-shrink-0` }),
                " ",
                f
              ] }, i)) })
            ] }),
            (settings == null ? void 0 : settings.bank_name) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-400 mb-2", children: t("paymentsPage.depositAccount") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-gray-900", children: [
                    settings.bank_name,
                    " ",
                    settings.account_number
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("paymentsPage.holderLabel", { name: settings.account_holder }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => copyToClipboard(settings.account_number),
                    className: "p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 16 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: t("paymentsPage.paymentNotice") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-600", children: t("paymentsPage.paymentNoticeDesc") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSelectedPlan(null),
                  className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors",
                  children: t("paymentsPage.cancelBtn")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleCreatePayment(selectedPlan),
                  disabled: creating,
                  className: `flex-1 py-3 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${selectedPlan.plan_type === "package" ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`,
                  children: creating ? t("paymentsPage.creating") : t("paymentsPage.startPayment")
                }
              )
            ] })
          ]
        }
      )
    ] }),
    submitModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: () => setSubmitModal(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          style: { animation: "popupScale 0.3s ease" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubmitModal(null), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("paymentsPage.depositReportTitle") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
                  "₩",
                  parseInt(submitModal.amount || 0).toLocaleString()
                ] })
              ] })
            ] }),
            (settings == null ? void 0 : settings.bank_name) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-indigo-600 mb-2", children: t("paymentsPage.depositInstruction") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-gray-900", children: [
                    settings.bank_name,
                    " ",
                    settings.account_number
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("paymentsPage.holderLabel", { name: settings.account_holder }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => copyToClipboard(settings.account_number),
                    className: "p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 16 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [
              t("paymentsPage.depositorName"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: depositorName,
                onChange: (e) => setDepositorName(e.target.value),
                placeholder: t("paymentsPage.depositorPlaceholder"),
                className: "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 mb-5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: t("paymentsPage.depositNotice") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-600", children: t("paymentsPage.depositNoticeDesc") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSubmitModal(null),
                  className: "flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors",
                  children: t("paymentsPage.closeBtn")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleSubmitDeposit,
                  disabled: submitting || !depositorName.trim(),
                  className: "flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
                    " ",
                    submitting ? t("paymentsPage.reporting") : t("paymentsPage.reportDeposit")
                  ]
                }
              )
            ] })
          ]
        }
      )
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
  SellerPayments as default
};
