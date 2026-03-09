import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, m as Home, t as ClipboardList, q as Building, s as Flame, V as Inbox, W as Package, Y as Wallet, w as TrendingUp, o as BarChart3, y as Megaphone, p as ShoppingBag, v as Users, O as CircleUser, x as CreditCard, i as Send, n as LayoutDashboard, u as Store, A as AlertTriangle, _ as Settings, z as Truck, G as Globe, ap as MapPin, ag as User, f as Search, a as X, N as Eye, T as Trash2, aV as RefreshCw, b9 as Save, E as EyeOff } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api/admin/menu_visibility.php";
const SELLER_MENUS = [
  { key: "/seller", label: "sidebar.home", icon: Home, group: "main" },
  { key: "/seller/applications", label: "sidebar.applicationStatus", icon: ClipboardList, group: "main" },
  { key: "/seller/hosts", label: "sidebar.hostDirectory", icon: Building, group: "main" },
  { key: "/seller/popular", label: "sidebar.popularSpaces", icon: Flame, group: "main" },
  { key: "/seller/proposals", label: "sidebar.distributionProposals", icon: Inbox, group: "main" },
  { key: "/seller/shipments", label: "sidebar.shippingManagement", icon: Package, group: "main" },
  { key: "/seller/settlements", label: "sidebar.settlements", icon: Wallet, group: "main" },
  { key: "/seller/stats", label: "sidebar.salesManagement", icon: TrendingUp, group: "main" },
  { key: "/seller/analytics", label: "sidebar.analytics", icon: BarChart3, group: "main" },
  { key: "/seller/marketing", label: "sidebar.marketing", icon: Megaphone, group: "main" },
  { key: "/seller/community", label: "sidebar.sellerCommunity", icon: ShoppingBag, group: "community" },
  { key: "/seller/community/general", label: "sidebar.integratedCommunity", icon: Users, group: "community" },
  { key: "/seller/profile", label: "sidebar.myProfile", icon: CircleUser, group: "bottom" },
  { key: "/seller/payments", label: "sidebar.servicePayment", icon: CreditCard, group: "bottom" }
];
const VENDOR_MENUS = [
  { key: "/host", label: "sidebar.home", icon: Home, group: "main" },
  { key: "/host/dashboard", label: "sidebar.dashboard", icon: LayoutDashboard, group: "main" },
  { key: "/host/sellers", label: "sidebar.sellerDirectory", icon: ShoppingBag, group: "main" },
  { key: "/host/analytics", label: "sidebar.analytics", icon: BarChart3, group: "main" },
  { key: "/host/report", label: "sidebar.analyticsReport", icon: TrendingUp, group: "main" },
  { key: "/host/venues", label: "sidebar.spaceManagement", icon: Store, group: "management" },
  { key: "/host/applications", label: "sidebar.applicationManagement", icon: ClipboardList, group: "management" },
  { key: "/host/cancellations", label: "sidebar.cancellationRequests", icon: AlertTriangle, group: "management" },
  { key: "/host/marketing", label: "sidebar.marketing", icon: Megaphone, group: "main" },
  { key: "/host/community", label: "sidebar.hostCommunity", icon: Store, group: "community" },
  { key: "/host/community/general", label: "sidebar.integratedCommunity", icon: Users, group: "community" },
  { key: "/host/profile", label: "sidebar.myProfile", icon: CircleUser, group: "bottom" },
  { key: "/host/payments", label: "sidebar.servicePayment", icon: CreditCard, group: "bottom" }
];
const VENDOR_ROLE_MENUS = [
  { key: "/vendor", label: "sidebar.home", icon: Home, group: "main" },
  { key: "/vendor/sellers", label: "sidebar.sellerDirectory", icon: ShoppingBag, group: "main" },
  { key: "/vendor/proposals", label: "sidebar.distributionProposals", icon: Send, group: "main" },
  { key: "/vendor/shipments", label: "sidebar.shippingManagement", icon: Package, group: "main" },
  { key: "/vendor/settlements", label: "sidebar.settlements", icon: Wallet, group: "main" },
  { key: "/vendor/profile", label: "sidebar.myProfile", icon: CircleUser, group: "bottom" }
];
const COUNTRY_FLAGS = {
  KR: "🇰🇷",
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  JP: "🇯🇵",
  VN: "🇻🇳",
  TH: "🇹🇭",
  KH: "🇰🇭",
  RU: "🇷🇺",
  UA: "🇺🇦",
  // Lowercase DB aliases
  ko: "🇰🇷",
  ja: "🇯🇵",
  vi: "🇻🇳",
  th: "🇹🇭",
  km: "🇰🇭",
  ru: "🇷🇺",
  uk: "🇺🇦"
};
const AdminMenuVisibility = () => {
  const { t } = useTranslation("common");
  const [activeRole, setActiveRole] = reactExports.useState("seller");
  const [activeTab, setActiveTab] = reactExports.useState("global");
  const [rules, setRules] = reactExports.useState([]);
  const [countries, setCountries] = reactExports.useState([]);
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [selectedCountry, setSelectedCountry] = reactExports.useState("");
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [userSearch, setUserSearch] = reactExports.useState("");
  const [localVisibility, setLocalVisibility] = reactExports.useState({});
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const menus = activeRole === "seller" ? SELLER_MENUS : activeRole === "vendor" ? VENDOR_ROLE_MENUS : VENDOR_MENUS;
  const groupLabels = {
    main: t("menuVis.mainMenu"),
    management: t("menuVis.managementMenu"),
    community: t("menuVis.communityMenu"),
    bottom: t("menuVis.otherMenu")
  };
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const fetchRules = reactExports.useCallback(async (opts = {}) => {
    setLoading(true);
    try {
      let url = `${API_BASE}?role=${activeRole}&fetch_users=1&user_role=${activeRole}`;
      const search = opts.search ?? userSearch;
      if (search.trim()) url += `&user_search=${encodeURIComponent(search)}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setRules(data.rules || []);
        setCountries(data.countries || []);
        setUsers(data.users || []);
        buildLocalVisibility(data.rules || []);
      }
    } catch {
      showToast(t("menuVis.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [activeRole, activeTab, userSearch]);
  const buildLocalVisibility = reactExports.useCallback((rulesData, country, user) => {
    const cs = country ?? selectedCountry;
    const us = user ?? selectedUser;
    const vis = {};
    menus.forEach((m) => {
      vis[m.key] = 1;
      if (activeTab === "global") {
        const rule = rulesData.find((r) => r.menu_key === m.key && r.scope === "global");
        if (rule) vis[m.key] = parseInt(rule.is_visible);
      } else if (activeTab === "country" && cs) {
        const globalRule = rulesData.find((r) => r.menu_key === m.key && r.scope === "global");
        if (globalRule) vis[m.key] = parseInt(globalRule.is_visible);
        const countryRule = rulesData.find((r) => r.menu_key === m.key && r.scope === "country" && r.scope_value === cs);
        if (countryRule) vis[m.key] = parseInt(countryRule.is_visible);
      } else if (activeTab === "user" && us) {
        const globalRule = rulesData.find((r) => r.menu_key === m.key && r.scope === "global");
        if (globalRule) vis[m.key] = parseInt(globalRule.is_visible);
        if (us.country) {
          const countryRule = rulesData.find((r) => r.menu_key === m.key && r.scope === "country" && r.scope_value === us.country);
          if (countryRule) vis[m.key] = parseInt(countryRule.is_visible);
        }
        const userRule = rulesData.find((r) => r.menu_key === m.key && r.scope === "user" && r.scope_value == us.id);
        if (userRule) vis[m.key] = parseInt(userRule.is_visible);
      }
    });
    setLocalVisibility(vis);
    setIsDirty(false);
  }, [menus, activeTab, selectedCountry, selectedUser]);
  reactExports.useEffect(() => {
    setSelectedCountry("");
    setSelectedUser(null);
    setUserSearch("");
    setIsDirty(false);
    fetchRules({ search: "" });
  }, [activeRole, activeTab]);
  reactExports.useEffect(() => {
    if (rules.length > 0) {
      buildLocalVisibility(rules);
    }
  }, [selectedCountry, selectedUser]);
  reactExports.useEffect(() => {
    if (activeTab !== "user") return;
    const timer = setTimeout(() => fetchRules(), 300);
    return () => clearTimeout(timer);
  }, [userSearch]);
  const toggleVisibility = (menuKey) => {
    setLocalVisibility((prev) => ({
      ...prev,
      [menuKey]: prev[menuKey] === 1 ? 0 : 1
    }));
    setIsDirty(true);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      let rulesToSave = [];
      if (activeTab === "country" && selectedCountry === "__ALL__") {
        countries.forEach((c) => {
          menus.forEach((m) => {
            rulesToSave.push({
              role: activeRole,
              menu_key: m.key,
              scope: "country",
              scope_value: c,
              is_visible: localVisibility[m.key] ?? 1
            });
          });
        });
      } else {
        const scopeValue = activeTab === "country" ? selectedCountry : activeTab === "user" ? String(selectedUser == null ? void 0 : selectedUser.id) : "";
        rulesToSave = menus.map((m) => ({
          role: activeRole,
          menu_key: m.key,
          scope: activeTab,
          scope_value: scopeValue,
          is_visible: localVisibility[m.key] ?? 1
        }));
      }
      const res = await fetch(API_BASE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: rulesToSave })
      });
      const data = await res.json();
      if (data.success) {
        showToast(selectedCountry === "__ALL__" ? t("menuVis.allCountriesSaved") || "전체 국가에 저장되었습니다" : t("menuVis.saved"));
        setIsDirty(false);
        fetchRules();
      } else {
        showToast(data.message || t("menuVis.saveFailed"), "error");
      }
    } catch {
      showToast(t("menuVis.serverError"), "error");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteOverride = async () => {
    if (activeTab === "global") return;
    const scopeValue = activeTab === "country" ? selectedCountry : String(selectedUser == null ? void 0 : selectedUser.id);
    if (!scopeValue) return;
    try {
      const res = await fetch(API_BASE, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: activeRole, scope: activeTab, scope_value: scopeValue })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t("menuVis.overrideDeleted"));
        setIsDirty(false);
        fetchRules();
      }
    } catch {
      showToast(t("menuVis.serverError"), "error");
    }
  };
  const groupedMenus = {};
  menus.forEach((m) => {
    if (!groupedMenus[m.group]) groupedMenus[m.group] = [];
    groupedMenus[m.group].push(m);
  });
  const canEdit = activeTab === "global" || activeTab === "country" && selectedCountry || activeTab === "user" && selectedUser;
  const scopeHasOverrides = () => {
    if (activeTab === "country" && selectedCountry)
      return rules.some((r) => r.scope === "country" && r.scope_value === selectedCountry);
    if (activeTab === "user" && selectedUser)
      return rules.some((r) => r.scope === "user" && r.scope_value == selectedUser.id);
    return false;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 28 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold", children: t("menuVis.title") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm", children: t("menuVis.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: [
        { key: "seller", label: t("menuVis.seller"), icon: ShoppingBag },
        { key: "host", label: t("menuVis.vendor"), icon: Store },
        { key: "vendor", label: t("menuVis.vendorRole", "Vendor"), icon: Truck }
      ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveRole(r.key),
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeRole === r.key ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 ring-2 ring-violet-300" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { size: 16 }),
            r.label,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs opacity-60", children: [
              "(",
              t("menuVis.menuCount", { count: (r.key === "seller" ? SELLER_MENUS : r.key === "vendor" ? VENDOR_ROLE_MENUS : VENDOR_MENUS).length }),
              ")"
            ] })
          ]
        },
        r.key
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
        { key: "global", label: t("menuVis.globalTab"), icon: Globe, desc: t("menuVis.globalDesc") },
        { key: "country", label: t("menuVis.countryTab"), icon: MapPin, desc: t("menuVis.countryDesc") },
        { key: "user", label: t("menuVis.userTab"), icon: User, desc: t("menuVis.userDesc") }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 ring-2 ring-indigo-300" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: tab.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-normal opacity-60", children: tab.desc })
            ] })
          ]
        },
        tab.key
      )) })
    ] }),
    activeTab === "country" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-indigo-500" }),
        t("menuVis.selectCountry")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSelectedCountry("__ALL__"),
            className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCountry === "__ALL__" ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300 dark:bg-violet-500/20 dark:text-violet-400" : "bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-700/30 dark:text-violet-400"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14 }),
              t("menuVis.allCountries") || "전체 국가"
            ]
          }
        ),
        countries.length > 0 ? countries.map((c) => {
          const hasOvr = rules.some((r) => r.scope === "country" && r.scope_value === c);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedCountry(c),
              className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCountry === c ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-400" : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: COUNTRY_FLAGS[c] || "🏳️" }),
                t(`menuVis.countries.${c}`) || c,
                hasOvr && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-amber-400 rounded-full", title: t("menuVis.hasOverride") })
              ]
            },
            c
          );
        }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: t("menuVis.noCountries") })
      ] })
    ] }),
    activeTab === "user" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, className: "text-indigo-500" }),
        t("menuVis.searchUser"),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-gray-400", children: [
          "— ",
          t("menuVis.allUsers"),
          ": ",
          users.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: userSearch,
            onChange: (e) => setUserSearch(e.target.value),
            placeholder: t("menuVis.searchPlaceholder"),
            className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-medium text-sm dark:text-white"
          }
        ),
        userSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setUserSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
      ] }),
      users.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-1 border border-gray-100 dark:border-gray-700 rounded-xl p-2", children: users.map((u) => {
        var _a;
        const hasOvr = rules.some((r) => r.scope === "user" && r.scope_value == u.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSelectedUser(u),
            className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${(selectedUser == null ? void 0 : selectedUser.id) === u.id ? "bg-indigo-100 dark:bg-indigo-500/20 ring-1 ring-indigo-300" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0", children: ((_a = u.name) == null ? void 0 : _a[0]) || "?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-gray-800 dark:text-gray-200 truncate", children: u.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 truncate", children: [
                  u.email,
                  " · ID: ",
                  u.id
                ] })
              ] }),
              u.country && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-shrink-0", children: COUNTRY_FLAGS[u.country] || u.country }),
              hasOvr && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-amber-400 rounded-full flex-shrink-0", title: t("menuVis.hasOverride") })
            ]
          },
          u.id
        );
      }) })
    ] }),
    canEdit && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-800 dark:text-white flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18, className: "text-indigo-500" }),
            activeRole === "seller" ? t("menuVis.seller") : t("menuVis.vendor"),
            " ",
            t("menuVis.menuSettings"),
            activeTab === "country" && selectedCountry && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
              "— ",
              selectedCountry === "__ALL__" ? `🌐 ${t("menuVis.allCountries")}` : `${COUNTRY_FLAGS[selectedCountry] || ""} ${t(`menuVis.countries.${selectedCountry}`) || selectedCountry}`
            ] }),
            activeTab === "user" && selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
              "— ",
              selectedUser.name,
              " (",
              selectedUser.email,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
            activeTab === "global" && t("menuVis.globalNote"),
            activeTab === "country" && t("menuVis.countryNote"),
            activeTab === "user" && t("menuVis.userNote")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          activeTab !== "global" && scopeHasOverrides() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleDeleteOverride,
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 }),
                t("menuVis.deleteOverride")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleSave,
              disabled: saving,
              className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${isDirty ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`,
              children: [
                saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                t("menuVis.save")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50 dark:divide-gray-700/30", children: Object.entries(groupedMenus).map(([group, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-2 bg-gray-50/50 dark:bg-gray-700/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: groupLabels[group] || group }) }),
        items.map((menu) => {
          const visible = localVisibility[menu.key] ?? 1;
          const Icon = menu.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${visible ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: visible ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-bold transition-colors ${visible ? "text-gray-800 dark:text-gray-200" : "text-gray-400"}`, children: t(menu.label) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-gray-400 font-mono", children: menu.key })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => toggleVisibility(menu.key),
                    className: `relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${visible ? "bg-indigo-500 shadow-inner shadow-indigo-600" : "bg-gray-300 dark:bg-gray-600 shadow-inner"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${visible ? "left-[22px]" : "left-0.5"}`, children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12, className: "text-indigo-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 12, className: "text-gray-400" }) })
                  }
                )
              ]
            },
            menu.key
          );
        })
      ] }, group)) })
    ] }),
    !canEdit && (activeTab === "country" || activeTab === "user") && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4", children: activeTab === "country" ? /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 28, className: "text-gray-300" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28, className: "text-gray-300" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400 dark:text-gray-500", children: activeTab === "country" ? t("menuVis.selectCountryPrompt") : t("menuVis.selectUserPrompt") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 mt-1", children: activeTab === "country" ? t("menuVis.selectCountryDesc") : t("menuVis.selectUserDesc") })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`, children: toast.message })
  ] });
};
export {
  AdminMenuVisibility as default
};
