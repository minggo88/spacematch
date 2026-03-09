import { b as useNavigate, a as useAuth, j as jsxRuntimeExports, A as AdSlot, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, q as Building, f as Search, av as Filter, a0 as ChevronDown, a as X, aL as Crown, ao as Star, aM as BadgeCheck, v as Users, ae as React, u as Store, ap as MapPin, M as MessageCircle, ab as Lock, s as Flame, $ as ExternalLink, b as ChevronRight, aq as Clock, aa as Mail, ah as Phone, N as Eye, az as Calendar, e as ArrowLeft } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const SellerHostDirectory = () => {
  var _a, _b, _c, _d, _e, _f;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation("seller");
  const isAdmin = (user == null ? void 0 : user.role) === "admin" || (user == null ? void 0 : user.role) === "superadmin";
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const TYPE_LABELS = {
    popup: t("hostDirectoryPage.typePopup"),
    gallery: t("hostDirectoryPage.typeGallery"),
    cafe: t("hostDirectoryPage.typeCafe"),
    showroom: t("hostDirectoryPage.typeShowroom"),
    fleamarket: t("hostDirectoryPage.typeFleamarket")
  };
  const [hosts, setHosts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedRegion, setSelectedRegion] = reactExports.useState("");
  const [selectedType, setSelectedType] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [selectedHost, setSelectedHost] = reactExports.useState(null);
  const [selectedVenue, setSelectedVenue] = reactExports.useState(null);
  const [venueImageIndex, setVenueImageIndex] = reactExports.useState(0);
  const [promotions, setPromotions] = reactExports.useState([]);
  const [contactAccess, setContactAccess] = reactExports.useState({ can_view: false, monthly_limit: 0, remaining: 0 });
  const [unlockedHosts, setUnlockedHosts] = reactExports.useState({});
  const [unlockLoading, setUnlockLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchHosts();
    fetchPromotions();
    if ((user == null ? void 0 : user.role) === "seller") fetchHostContactAccess();
  }, []);
  const fetchHostContactAccess = async () => {
    var _a2;
    try {
      const res = await fetch(`${API_BASE}/users/host_contact_access.php`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setContactAccess({
          can_view: data.can_view_contacts,
          monthly_limit: data.monthly_limit,
          remaining: data.remaining
        });
        if (((_a2 = data.viewed_host_ids) == null ? void 0 : _a2.length) > 0) {
          for (const vid of data.viewed_host_ids) {
            fetchUnlockedHostContact(vid);
          }
        }
      }
    } catch (err) {
      console.error("Host contact access fetch failed:", err);
    }
  };
  const fetchUnlockedHostContact = async (hostId) => {
    try {
      const res = await fetch(`${API_BASE}/users/unlock_host_contact.php?host_id=${hostId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.already_viewed) {
        setUnlockedHosts((prev) => ({ ...prev, [hostId]: data.contact }));
      }
    } catch (err) {
    }
  };
  const handleUnlockHost = async (hostId) => {
    setUnlockLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/unlock_host_contact.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ host_id: hostId })
      });
      const data = await res.json();
      if (data.success) {
        setUnlockedHosts((prev) => ({ ...prev, [hostId]: data.contact }));
        setContactAccess((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
      } else {
        showToast(data.message || t("hostDirectoryPage.unlockFailed"), "error");
      }
    } catch (err) {
      showToast(t("hostDirectoryPage.errorOccurred"), "error");
    } finally {
      setUnlockLoading(false);
    }
  };
  const fetchPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}/promotions/get_promotions.php`);
      const data = await res.json();
      if (data.success) {
        const all = [
          ...data.hot_top || [],
          ...data.hot_mid || [],
          ...Object.values(data.category_featured || {}).flat()
        ];
        setPromotions(all);
      }
    } catch (err) {
      console.error("Promotion load failed:", err);
    }
  };
  const getPromotionForVenue = (venueId) => {
    return promotions.find((p) => parseInt(p.venue_id) === parseInt(venueId));
  };
  const fetchHosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/browse_hosts.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHosts(data);
      }
    } catch (err) {
      console.error("Host list load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const allRegions = reactExports.useMemo(() => {
    const regions = /* @__PURE__ */ new Set();
    hosts.forEach((v) => {
      var _a2;
      return (_a2 = v.regions) == null ? void 0 : _a2.forEach((r) => regions.add(r));
    });
    return Array.from(regions).sort();
  }, [hosts]);
  const allTypes = reactExports.useMemo(() => {
    const types = /* @__PURE__ */ new Set();
    hosts.forEach((v) => {
      var _a2;
      return (_a2 = v.types) == null ? void 0 : _a2.forEach((tp) => types.add(tp));
    });
    return Array.from(types).sort();
  }, [hosts]);
  const filteredHosts = reactExports.useMemo(() => {
    return hosts.filter((host) => {
      var _a2, _b2;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (_a2 = host.name) == null ? void 0 : _a2.toLowerCase().includes(term);
        const emailMatch = (_b2 = host.email) == null ? void 0 : _b2.toLowerCase().includes(term);
        if (!nameMatch && !emailMatch) return false;
      }
      if (selectedRegion && !(host.regions || []).some((r) => r.includes(selectedRegion))) {
        return false;
      }
      if (selectedType && !(host.types || []).includes(selectedType)) {
        return false;
      }
      return true;
    });
  }, [hosts, searchTerm, selectedRegion, selectedType]);
  const activeFilterCount = [selectedRegion, selectedType].filter(Boolean).length;
  const clearFilters = () => {
    setSelectedRegion("");
    setSelectedType("");
    setSearchTerm("");
  };
  const featuredHosts = reactExports.useMemo(() => {
    return hosts.filter((v) => v.is_featured);
  }, [hosts]);
  const getDdayBadge = (host) => {
    if (host.has_closed) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
        t("hostDirectoryPage.recruitDone")
      ] });
    }
    if (host.nearest_deadline) {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(host.nearest_deadline);
      deadline.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((deadline - today) / (1e3 * 60 * 60 * 24));
      if (diffDays < 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
          t("hostDirectoryPage.closed")
        ] });
      }
      if (diffDays === 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }),
          "D-Day"
        ] });
      }
      if (diffDays <= 3) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }),
          "D-",
          diffDays
        ] });
      }
      if (diffDays <= 7) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }),
          "D-",
          diffDays
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }),
        "D-",
        diffDays
      ] });
    }
    return null;
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "text-indigo-600 dark:text-indigo-400", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100", children: t("hostDirectoryPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t("hostDirectoryPage.subtitle") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                placeholder: t("hostDirectoryPage.searchPlaceholder"),
                className: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all font-medium"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowFilters(!showFilters),
              className: `flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 16 }),
                t("hostDirectoryPage.filter"),
                activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/20 px-1.5 py-0.5 rounded-md text-xs", children: activeFilterCount })
              ]
            }
          )
        ] }),
        showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: t("hostDirectoryPage.filterRegion") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: selectedRegion,
                  onChange: (e) => setSelectedRegion(e.target.value),
                  className: "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("hostDirectoryPage.filterAllRegions") }),
                    allRegions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2", children: t("hostDirectoryPage.filterVenueType") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: selectedType,
                  onChange: (e) => setSelectedType(e.target.value),
                  className: "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 italic mt-2", children: t("hostDirectoryPage.noRegisteredVenues") }),
                    allTypes.map((tp) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tp, children: TYPE_LABELS[tp] || tp }, tp))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: clearFilters,
              className: "text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }),
                " ",
                t("hostDirectoryPage.filterClear")
              ]
            }
          ) })
        ] })
      ] }),
      featuredHosts.length > 0 && !searchTerm && !selectedRegion && !selectedType && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-700/40 overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 18, className: "text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-extrabold text-sm", children: t("hostDirectoryPage.premiumHosts") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs ml-1", children: t("hostDirectoryPage.premiumTopExposure") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredHosts.map((host) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setSelectedHost(host),
              className: "relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-amber-200 dark:border-amber-700/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, fill: "white" }),
                  "PREMIUM"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-amber-200/50 ring-2 ring-amber-200", children: ((_a2 = host.name) == null ? void 0 : _a2[0]) || "V" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 dark:text-gray-100 text-lg truncate", children: host.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-indigo-600 font-bold", children: t("hostDirectoryPage.venueCount", { count: host.venue_count }) }),
                        host.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 rounded-full text-[9px] font-extrabold", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }),
                          " ",
                          t("hostDirectoryPage.verified")
                        ] }) : null,
                        getDdayBadge(host)
                      ] })
                    ] })
                  ] }),
                  ((_b2 = host.regions) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-3", children: host.regions.slice(0, 2).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-md text-[10px] font-medium", children: r }, i)) })
                ] })
              ]
            },
            `featured-${host.id}`
          );
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: t("hostDirectoryPage.sponsor") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gray-200 dark:bg-gray-700" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_c", format: "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_c2", format: "card" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 font-medium", children: t("hostDirectoryPage.totalHosts", { count: filteredHosts.length }) }) }),
      filteredHosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto text-gray-300 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400", children: t("hostDirectoryPage.noResults") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-1", children: t("hostDirectoryPage.noResultsHint") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredHosts.map((host, idx) => {
        var _a2, _b2, _c2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          idx === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_d", format: "card" }),
          idx === 12 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_d2", format: "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setSelectedHost(host),
              className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm", children: ((_a2 = host.name) == null ? void 0 : _a2[0]) || "V" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 dark:text-gray-100 text-lg truncate", children: host.name }),
                      host.is_featured ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 8, fill: "white" }),
                        " PREMIUM"
                      ] }) : null,
                      host.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 rounded-full text-[9px] font-extrabold", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }),
                        " ",
                        t("hostDirectoryPage.verified")
                      ] }) : null
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 truncate", children: isAdmin || unlockedHosts[host.id] ? host.email : "●●●●@●●●●.com" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 15, className: "text-indigo-500 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [
                      t("hostDirectoryPage.registeredVenues"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-indigo-600 dark:text-indigo-400", children: host.venue_count })
                    ] })
                  ] }),
                  ((_b2 = host.regions) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 15, className: "text-rose-400 flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                      host.regions.slice(0, 3).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-md text-xs font-medium", children: r }, i)),
                      host.regions.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 self-center", children: [
                        "+",
                        host.regions.length - 3
                      ] })
                    ] })
                  ] }),
                  ((_c2 = host.types) == null ? void 0 : _c2.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: host.types.map((tp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium", children: TYPE_LABELS[tp] || tp }, i)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
                    t("hostDirectoryPage.joinDate"),
                    " ",
                    new Date(host.created_at).toLocaleDateString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    getDdayBadge(host),
                    isAdmin || unlockedHosts[host.id] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          navigate(`/${user.role}/chat?user=${host.id}`);
                        },
                        className: "flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 12 }),
                          " 채팅"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                      " 연락처"
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ] }, host.id);
      }) }),
      selectedHost && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedHost(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden", children: selectedHost.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedHost.profile_image, alt: selectedHost.name, className: "w-full h-full object-cover" }) : ((_a = selectedHost.name) == null ? void 0 : _a[0]) || "V" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: selectedHost.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20", children: t("hostDirectoryPage.hostRole") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedHost(null), className: "text-white/80 hover:text-white p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[70vh] overflow-y-auto dark:text-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2", children: t("hostDirectoryPage.hostIntro") }),
            selectedHost.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap", children: selectedHost.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 italic", children: t("hostDirectoryPage.hostIntroEmpty") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-8 py-3 border-y border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-indigo-600", children: selectedHost.venue_count || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("hostDirectoryPage.registeredVenues") })
          ] }) }),
          (() => {
            const activeVenues = (selectedHost.venues || []).filter((v) => v.is_active !== 0);
            const pastVenues = (selectedHost.venues || []).filter((v) => v.is_active === 0);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              activeVenues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 12 }),
                  t("hostDirectoryPage.activeVenues")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: activeVenues.map((venue) => {
                  const promo = getPromotionForVenue(venue.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50 hover:shadow-md transition-all cursor-pointer group",
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedVenue(venue);
                        setVenueImageIndex(0);
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 dark:text-gray-200 truncate", children: venue.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                            venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium", children: TYPE_LABELS[venue.type] || venue.type }),
                            venue.size && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: venue.size })
                          ] }),
                          venue.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1 flex items-center gap-1 truncate", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                            venue.location
                          ] }),
                          promo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              className: "mt-2 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all",
                              onClick: (e) => {
                                e.stopPropagation();
                                navigate("/recruitment");
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 12 }),
                                t("hostDirectoryPage.eventOngoing"),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-indigo-500 group-hover:text-indigo-700 transition-colors flex-shrink-0 ml-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium hidden sm:inline", children: t("hostDirectoryPage.viewDetail") }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
                        ] })
                      ] })
                    },
                    venue.id
                  );
                }) })
              ] }),
              pastVenues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                  t("hostDirectoryPage.pastVenues")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: pastVenues.map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: venue.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                        venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium", children: TYPE_LABELS[venue.type] || venue.type }),
                        venue.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                          venue.location
                        ] })
                      ] })
                    ]
                  },
                  venue.id
                )) })
              ] }),
              activeVenues.length === 0 && pastVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 italic", children: t("hostDirectoryPage.noRegisteredVenues") })
            ] });
          })(),
          ((_b = selectedHost.regions) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
              t("hostDirectoryPage.activeRegions")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: selectedHost.regions.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-medium border border-rose-100 dark:border-rose-800/50", children: r }, i)) })
          ] }),
          ((_c = selectedHost.types) == null ? void 0 : _c.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12 }),
              t("hostDirectoryPage.venueTypeStatus")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: selectedHost.types.map((tp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium border border-indigo-100 dark:border-indigo-800/50", children: TYPE_LABELS[tp] || tp }, i)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("hostDirectoryPage.contactInfo") }),
            isAdmin || unlockedHosts[selectedHost.id] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("hostDirectoryPage.email") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: isAdmin ? selectedHost.email : ((_d = unlockedHosts[selectedHost.id]) == null ? void 0 : _d.email) || selectedHost.email })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("hostDirectoryPage.phone") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${(isAdmin ? selectedHost.phone : (_e = unlockedHosts[selectedHost.id]) == null ? void 0 : _e.phone) ? "text-gray-800" : "text-gray-400 italic"}`, children: isAdmin ? selectedHost.phone || t("hostDirectoryPage.notRegistered") : ((_f = unlockedHosts[selectedHost.id]) == null ? void 0 : _f.phone) || t("hostDirectoryPage.notRegistered") })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate(`/${user.role}/chat?user=${selectedHost.id}`),
                  className: "w-full mt-3 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 }),
                    " 채팅하기"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 rounded-2xl border border-indigo-500/30 text-center backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-indigo-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 24, className: "text-indigo-300" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white mb-1", children: "연락처 비공개" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200/70 mb-4", children: "열람권을 사용하여 연락처를 확인하세요" }),
              contactAccess.can_view ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleUnlockHost(selectedHost.id),
                    disabled: unlockLoading || contactAccess.remaining <= 0,
                    className: "w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
                      unlockLoading ? "처리 중..." : contactAccess.remaining > 0 ? "연락처 열람" : "월간 횟수 소진"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-indigo-300/80 mt-2", children: [
                  "잔여 ",
                  contactAccess.remaining,
                  " / ",
                  contactAccess.monthly_limit,
                  "회"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-300 font-bold", children: "열람 권한이 없습니다. 관리자에게 문의하세요." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("hostDirectoryPage.businessInfo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 16, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("hostDirectoryPage.businessNo") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${selectedHost.business_no ? "text-gray-800" : "text-gray-400 italic"}`, children: selectedHost.business_no ? isAdmin ? selectedHost.business_no : selectedHost.business_no.slice(0, 3) + "-**-*****" : t("hostDirectoryPage.notRegistered") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("hostDirectoryPage.joinDate") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: new Date(selectedHost.created_at).toLocaleDateString() })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      selectedVenue && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4", onClick: () => setSelectedVenue(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-56 bg-gray-900", children: [
          (() => {
            const imgs = (selectedVenue.images || []).map(
              (img) => {
                var _a2;
                return ((_a2 = img == null ? void 0 : img.startsWith) == null ? void 0 : _a2.call(img, "uploads/")) ? `/${img}` : img;
              }
            );
            return imgs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgs[venueImageIndex], alt: selectedVenue.name, className: "w-full h-full object-contain" }),
              imgs.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVenueImageIndex((p) => (p - 1 + imgs.length) % imgs.length), className: "absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVenueImageIndex((p) => (p + 1) % imgs.length), className: "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors rotate-180", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-white text-xs font-medium", children: [
                  venueImageIndex + 1,
                  " / ",
                  imgs.length
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, strokeWidth: 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 text-sm", children: t("hostDirectoryPage.noImages") })
            ] });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedVenue(null), className: "absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[50vh] overflow-y-auto dark:text-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              selectedVenue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold", children: TYPE_LABELS[selectedVenue.type] || selectedVenue.type }),
              selectedVenue.size && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold", children: selectedVenue.size })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold text-gray-900 dark:text-gray-100", children: selectedVenue.name }),
            selectedVenue.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
              selectedVenue.location
            ] })
          ] }),
          selectedVenue.price !== void 0 && selectedVenue.price !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1", children: t("hostDirectoryPage.priceLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1", children: Number(selectedVenue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-emerald-600", children: t("hostDirectoryPage.priceFree") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-indigo-600", children: `₩${Number(selectedVenue.price).toLocaleString()}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 mb-0.5", children: selectedVenue.pricing_unit === "daily" ? t("hostDirectoryPage.priceDaily") : selectedVenue.pricing_unit === "weekly" ? t("hostDirectoryPage.priceWeekly") : selectedVenue.pricing_unit === "monthly" ? t("hostDirectoryPage.priceMonthly") : "" })
            ] }) }),
            parseFloat(selectedVenue.commission_rate) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-600 mt-2 font-medium", children: t("hostDirectoryPage.commissionRate", { rate: selectedVenue.commission_rate }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("hostDirectoryPage.venueIntro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap", children: selectedVenue.description || t("hostDirectoryPage.venueIntroEmpty") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedVenue(null),
              className: "w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
                t("hostDirectoryPage.backToHost")
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  SellerHostDirectory as default
};
