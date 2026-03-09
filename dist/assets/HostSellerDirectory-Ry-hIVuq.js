import { a as useAuth, b as useNavigate, j as jsxRuntimeExports, A as AdSlot, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, p as ShoppingBag, f as Search, av as Filter, a0 as ChevronDown, aI as ArrowUpDown, a as X, a8 as Heart, N as Eye, aL as Crown, ao as Star, aM as BadgeCheck, aj as Instagram, v as Users, ae as React, ac as Tag, ab as Lock, M as MessageCircle, aA as Image, aa as Mail, ah as Phone, q as Building, az as Calendar, l as ChevronLeft, b as ChevronRight } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const HostSellerDirectory = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("host");
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
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
  const isAdmin = (user == null ? void 0 : user.role) === "admin" || (user == null ? void 0 : user.role) === "superadmin";
  const [sellers, setSellers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("newest");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [selectedSeller, setSelectedSeller] = reactExports.useState(null);
  const [contactAccess, setContactAccess] = reactExports.useState({ can_view: 0, monthly_limit: 0, remaining: 0, viewed_ids: [] });
  const [unlockedContacts, setUnlockedContacts] = reactExports.useState({});
  const [unlockLoading, setUnlockLoading] = reactExports.useState(false);
  const [favoriteIds, setFavoriteIds] = reactExports.useState([]);
  const [favoriteLoading, setFavoriteLoading] = reactExports.useState({});
  const [viewFilter, setViewFilter] = reactExports.useState("all");
  const [lightboxPhotos, setLightboxPhotos] = reactExports.useState([]);
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    fetchSellers();
  }, []);
  const fetchSellers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/browse_sellers.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSellers(data);
      }
    } catch (err) {
      console.error(t("sellerDirectoryPage.sellerLoadFailed"), err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/users/seller_contact_access.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setContactAccess({
          can_view: data.can_view_contacts,
          monthly_limit: data.monthly_limit,
          remaining: data.remaining,
          viewed_ids: data.viewed_seller_ids || []
        });
        (data.viewed_seller_ids || []).forEach((sid) => {
          fetch(`${API_BASE}/users/unlock_seller_contact.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seller_id: sid })
          }).then((r) => r.json()).then((d) => {
            if (d.success) setUnlockedContacts((prev) => ({ ...prev, [sid]: d.contact }));
          }).catch(() => {
          });
        });
      }
    }).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    fetch(`${API_BASE}/users/seller_favorites.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (data.success) setFavoriteIds(data.favorite_ids || []);
    }).catch(() => {
    });
  }, []);
  const handleToggleFavorite = reactExports.useCallback(async (e, sellerId) => {
    e.stopPropagation();
    setFavoriteLoading((prev) => ({ ...prev, [sellerId]: true }));
    try {
      const res = await fetch(`${API_BASE}/users/seller_favorites.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller_id: sellerId })
      });
      const data = await res.json();
      if (data.success) {
        setFavoriteIds((prev) => data.is_favorite ? [...prev, sellerId] : prev.filter((id) => id !== sellerId));
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [sellerId]: false }));
    }
  }, []);
  const handleUnlockContact = async (sellerId) => {
    setUnlockLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/unlock_seller_contact.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seller_id: sellerId })
      });
      const data = await res.json();
      if (data.success) {
        setUnlockedContacts((prev) => ({ ...prev, [sellerId]: data.contact }));
        if (!data.already_viewed) {
          setContactAccess((prev) => ({
            ...prev,
            remaining: data.remaining,
            viewed_ids: [...prev.viewed_ids, sellerId]
          }));
        }
      } else {
        showToast(data.message || t("sellerDirectoryPage.contactLoadFailed"), "error");
      }
    } catch (err) {
      showToast(t("sellerDirectoryPage.contactLoadFailed"), "error");
    } finally {
      setUnlockLoading(false);
    }
  };
  const allCategories = reactExports.useMemo(() => {
    const cats = /* @__PURE__ */ new Set();
    sellers.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats).sort();
  }, [sellers]);
  const filteredSellers = reactExports.useMemo(() => {
    let result = sellers.filter((seller) => {
      var _a2, _b2, _c2;
      if (viewFilter === "viewed" && !contactAccess.viewed_ids.includes(seller.id)) return false;
      if (viewFilter === "favorites" && !favoriteIds.includes(seller.id)) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (_a2 = seller.name) == null ? void 0 : _a2.toLowerCase().includes(term);
        const categoryMatch = (_b2 = seller.category) == null ? void 0 : _b2.toLowerCase().includes(term);
        const categoryLabelMatch = Object.entries(CATEGORY_LABELS).some(
          ([key, label]) => key === seller.category && label.toLowerCase().includes(term)
        );
        const instagramMatch = (_c2 = seller.instagram) == null ? void 0 : _c2.toLowerCase().includes(term);
        if (!nameMatch && !categoryMatch && !categoryLabelMatch && !instagramMatch) return false;
      }
      if (selectedCategory && seller.category !== selectedCategory) {
        return false;
      }
      return true;
    });
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "name_asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || "", "ko"));
        break;
      case "name_desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || "", "ko"));
        break;
      case "apps_desc":
        result.sort((a, b) => (b.app_count || 0) - (a.app_count || 0));
        break;
    }
    return result;
  }, [sellers, searchTerm, selectedCategory, sortBy, viewFilter, contactAccess.viewed_ids, favoriteIds]);
  const activeFilterCount = [selectedCategory].filter(Boolean).length;
  const featuredSellers = reactExports.useMemo(() => {
    return sellers.filter((s) => s.is_featured);
  }, [sellers]);
  const clearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setSortBy("newest");
  };
  const getCategoryLabel = (cat) => CATEGORY_LABELS[cat] || cat || t("sellerDirectoryPage.unspecified");
  const getCategoryColor = (cat) => {
    const colors = {
      fashion: "bg-pink-50 text-pink-600",
      beauty: "bg-fuchsia-50 text-fuchsia-600",
      food: "bg-orange-50 text-orange-600",
      living: "bg-emerald-50 text-emerald-600",
      art: "bg-violet-50 text-violet-600",
      stationery: "bg-blue-50 text-blue-600",
      digital: "bg-cyan-50 text-cyan-600",
      activity: "bg-lime-50 text-lime-600",
      eco: "bg-green-50 text-green-600",
      pet: "bg-amber-50 text-amber-600",
      kids: "bg-rose-50 text-rose-600",
      handmade: "bg-yellow-50 text-yellow-600",
      vintage: "bg-stone-100 text-stone-600",
      perfume: "bg-purple-50 text-purple-600",
      book: "bg-sky-50 text-sky-600"
    };
    return colors[cat] || "bg-gray-50 text-gray-600";
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "text-rose-600", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900", children: t("sellerDirectoryPage.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: t("sellerDirectoryPage.subtitle") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                placeholder: t("sellerDirectoryPage.searchPlaceholder"),
                className: "w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowFilters(!showFilters),
              className: `flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0 ? "bg-rose-600 text-white shadow-lg shadow-rose-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 16 }),
                t("sellerDirectoryPage.filterSort"),
                activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/20 px-1.5 py-0.5 rounded-md text-xs", children: activeFilterCount })
              ]
            }
          )
        ] }),
        showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-2", children: t("sellerDirectoryPage.categoryLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: selectedCategory,
                  onChange: (e) => setSelectedCategory(e.target.value),
                  className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("sellerDirectoryPage.allCategories") }),
                    allCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: getCategoryLabel(c) }, c))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-2", children: t("sellerDirectoryPage.sortLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: "w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: t("sellerDirectoryPage.sortNewest") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: t("sellerDirectoryPage.sortOldest") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_asc", children: t("sellerDirectoryPage.sortNameAsc") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_desc", children: t("sellerDirectoryPage.sortNameDesc") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "apps_desc", children: t("sellerDirectoryPage.sortAppsDesc") })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
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
                t("sellerDirectoryPage.clearFilters")
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-5", children: [
        { key: "all", label: t("sellerDirectoryPage.allSellers", "전체 셀러") },
        { key: "viewed", label: t("sellerDirectoryPage.viewedSellers", "열람한 셀러"), count: contactAccess.viewed_ids.length },
        { key: "favorites", label: t("sellerDirectoryPage.favoriteSellers", "좋아요"), count: favoriteIds.length }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setViewFilter(tab.key),
          className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewFilter === tab.key ? "bg-rose-600 text-white shadow-lg shadow-rose-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: [
            tab.key === "favorites" && /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, fill: viewFilter === "favorites" ? "white" : "none" }),
            tab.key === "viewed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
            tab.label,
            tab.count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full ${viewFilter === tab.key ? "bg-white/20" : "bg-gray-200"}`, children: tab.count })
          ]
        },
        tab.key
      )) }),
      featuredSellers.length > 0 && !searchTerm && !selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border border-amber-200/60 overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 18, className: "text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-extrabold text-sm", children: "PREMIUM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs ml-1", children: t("sellerDirectoryPage.premiumExposure") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredSellers.map((seller) => {
          var _a2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setSelectedSeller(seller),
              className: "relative bg-white rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, fill: "white" }),
                  "PREMIUM"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-amber-200/50 overflow-hidden ring-2 ring-amber-200", children: seller.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: seller.profile_image, alt: "seller", className: "w-full h-full object-cover" }) : ((_a2 = seller.name) == null ? void 0 : _a2[0]) || "S" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 text-lg truncate", children: seller.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`, children: getCategoryLabel(seller.category) }),
                        seller.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }),
                          " ",
                          t("sellerDirectoryPage.verified")
                        ] }) : null
                      ] })
                    ] })
                  ] }),
                  seller.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed", children: seller.description }),
                  seller.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-pink-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 12 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: seller.instagram })
                  ] })
                ] })
              ]
            },
            `featured-${seller.id}`
          );
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: t("sellerDirectoryPage.sponsor") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gray-200" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_c", format: "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_c2", format: "card" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 font-medium", children: [
        t("sellerDirectoryPage.totalSellers", { count: filteredSellers.length }),
        " "
      ] }) }),
      filteredSellers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto text-gray-300 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-400", children: t("sellerDirectoryPage.noResults") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-1", children: t("sellerDirectoryPage.noResultsHint") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredSellers.map((seller, idx) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          idx === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_d", format: "card" }),
          idx === 12 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "directory_d2", format: "card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setSelectedSeller(seller),
              className: "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm overflow-hidden", children: seller.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: seller.profile_image, alt: "seller", className: "w-full h-full object-cover" }) : ((_a2 = seller.name) == null ? void 0 : _a2[0]) || "S" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-lg truncate", children: seller.name }),
                      seller.is_featured ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 8, fill: "white" }),
                        " PREMIUM"
                      ] }) : null,
                      seller.is_verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }),
                        " ",
                        t("sellerDirectoryPage.verified")
                      ] }) : null
                    ] }),
                    isAdmin || unlockedContacts[seller.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 truncate", children: ((_b2 = unlockedContacts[seller.id]) == null ? void 0 : _b2.email) || seller.email }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 truncate", style: { filter: "blur(4px)", userSelect: "none" }, children: seller.email || "email@hidden.com" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 15, className: "text-gray-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`, children: getCategoryLabel(seller.category) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 15, className: "text-gray-300 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12 }),
                      " ",
                      t("sellerDirectoryPage.contactLocked")
                    ] })
                  ] }),
                  seller.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 line-clamp-2 leading-relaxed", children: seller.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.appCount", { count: seller.app_count }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
                    t("sellerDirectoryPage.joinDate"),
                    new Date(seller.created_at).toLocaleDateString("ko-KR")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => handleToggleFavorite(e, seller.id),
                        disabled: favoriteLoading[seller.id],
                        className: "p-1 rounded-lg hover:bg-rose-50 transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, className: favoriteIds.includes(seller.id) ? "text-rose-500 fill-rose-500" : "text-gray-300 hover:text-rose-400" })
                      }
                    ),
                    isAdmin || unlockedContacts[seller.id] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          navigate(`/${user.role}/chat?user=${seller.id}`);
                        },
                        className: "flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 12 }),
                          " 채팅"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                      " ",
                      t("sellerDirectoryPage.contact")
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ] }, seller.id);
      }) }),
      selectedSeller && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedSeller(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-white/30", children: selectedSeller.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedSeller.profile_image, alt: "셀러", className: "w-full h-full object-cover" }) : ((_a = selectedSeller.name) == null ? void 0 : _a[0]) || "S" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold", children: selectedSeller.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm", children: getCategoryLabel(selectedSeller.category) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => handleToggleFavorite(e, selectedSeller.id),
                  disabled: favoriteLoading[selectedSeller.id],
                  className: "p-2 rounded-xl hover:bg-white/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 22, className: favoriteIds.includes(selectedSeller.id) ? "text-rose-400 fill-rose-400" : "text-white/60 hover:text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedSeller(null), className: "text-white/80 hover:text-white p-1 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 max-h-[70vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-violet-50 rounded-xl border border-violet-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-violet-500 uppercase tracking-wider mb-2", children: t("sellerDirectoryPage.salesInfo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-violet-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-violet-800", children: getCategoryLabel(selectedSeller.category) })
            ] }),
            selectedSeller.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap", children: selectedSeller.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 italic mt-2", children: t("sellerDirectoryPage.noBrandIntro") })
          ] }),
          selectedSeller.photos && selectedSeller.photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 12 }),
              t("sellerDirectoryPage.productPhotos")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: selectedSeller.photos.map((photo, idx) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all",
                  onClick: () => {
                    setLightboxPhotos(selectedSeller.photos);
                    setLightboxIndex(idx);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ((_b2 = (_a2 = photo.image_url) == null ? void 0 : _a2.startsWith) == null ? void 0 : _b2.call(_a2, "uploads/")) ? `/${photo.image_url}` : photo.image_url, alt: t("sellerDirectoryPage.productPhotoAlt", { index: idx + 1 }), className: "w-full h-full object-cover" })
                },
                photo.id || idx
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-6 py-3 border-y border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-indigo-600", children: selectedSeller.app_count || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.applicationCount") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("sellerDirectoryPage.contactInfo") }),
            isAdmin || unlockedContacts[selectedSeller.id] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.email") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: isAdmin ? selectedSeller.email || t("sellerDirectoryPage.notRegistered") : ((_b = unlockedContacts[selectedSeller.id]) == null ? void 0 : _b.email) || t("sellerDirectoryPage.notRegistered") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.phone") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${(isAdmin ? selectedSeller.phone : (_c = unlockedContacts[selectedSeller.id]) == null ? void 0 : _c.phone) ? "text-gray-800" : "text-gray-400 italic"}`, children: isAdmin ? selectedSeller.phone || t("sellerDirectoryPage.notRegistered") : ((_d = unlockedContacts[selectedSeller.id]) == null ? void 0 : _d.phone) || t("sellerDirectoryPage.notRegistered") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 16, className: "text-violet-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.instagramLabel") }),
                    (isAdmin ? selectedSeller.instagram : (_e = unlockedContacts[selectedSeller.id]) == null ? void 0 : _e.instagram) ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://instagram.com/${((isAdmin ? selectedSeller.instagram : (_f = unlockedContacts[selectedSeller.id]) == null ? void 0 : _f.instagram) || "").replace("@", "")}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors", children: isAdmin ? selectedSeller.instagram : (_g = unlockedContacts[selectedSeller.id]) == null ? void 0 : _g.instagram }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-400 italic", children: t("sellerDirectoryPage.notRegistered") })
                  ] })
                ] }),
                (isAdmin || unlockedContacts[selectedSeller.id]) && (((_h = unlockedContacts[selectedSeller.id]) == null ? void 0 : _h.business_no) || selectedSeller.business_no) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 16, className: "text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.businessNo") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: ((_i = unlockedContacts[selectedSeller.id]) == null ? void 0 : _i.business_no) || selectedSeller.business_no })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate(`/${user.role}/chat?user=${selectedSeller.id}`),
                  className: "w-full mt-3 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 16 }),
                    " 채팅하기"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 rounded-2xl border border-indigo-500/30 text-center backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-indigo-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 24, className: "text-indigo-300" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white mb-1", children: t("sellerDirectoryPage.contactLockedTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-200/70 mb-4", children: t("sellerDirectoryPage.contactLockedDesc") }),
              contactAccess.can_view ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleUnlockContact(selectedSeller.id),
                    disabled: unlockLoading || contactAccess.remaining <= 0,
                    className: "w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
                      unlockLoading ? t("sellerDirectoryPage.loadingText") : contactAccess.remaining > 0 ? t("sellerDirectoryPage.unlockContact") : t("sellerDirectoryPage.monthlyExhausted")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-300/80 mt-2", children: t("sellerDirectoryPage.monthlyRemaining", { remaining: contactAccess.remaining, limit: contactAccess.monthly_limit }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-300 font-bold", children: t("sellerDirectoryPage.noPermission") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-2", children: t("sellerDirectoryPage.businessInfo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 16, className: "text-indigo-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.businessNo") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${selectedSeller.business_no ? "text-gray-800" : "text-gray-400 italic"}`, children: selectedSeller.business_no ? isAdmin ? selectedSeller.business_no : selectedSeller.business_no.slice(0, 3) + "-**-*****" : t("sellerDirectoryPage.notRegistered") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-indigo-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("sellerDirectoryPage.joinDateLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-800", children: new Date(selectedSeller.created_at).toLocaleDateString("ko-KR") })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      lightboxPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/90 z-[60] flex items-center justify-center", onClick: () => setLightboxPhotos([]), children: [
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
            src: (() => {
              var _a2, _b2;
              const url = ((_a2 = lightboxPhotos[lightboxIndex]) == null ? void 0 : _a2.image_url) || "";
              return ((_b2 = url.startsWith) == null ? void 0 : _b2.call(url, "uploads/")) ? `/${url}` : url;
            })(),
            alt: "",
            className: "max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl",
            onClick: (e) => e.stopPropagation()
          }
        )
      ] })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  HostSellerDirectory as default
};
