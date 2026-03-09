import { j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, s as Flame, ad as Plus, u as Store, k as Sparkles, az as Calendar, aH as PenLine, T as Trash2, a as X, f as Search } from "./vendor-icons-BFe5lkJJ.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const TIER_CONFIG_KEYS = {
  hot_top: { labelKey: "promotionsPage.tierHotTop", color: "bg-gradient-to-r from-orange-500 to-red-500", textColor: "text-orange-600", bgLight: "bg-orange-50 border-orange-200" },
  hot_mid: { labelKey: "promotionsPage.tierHotMid", color: "bg-gradient-to-r from-violet-500 to-purple-600", textColor: "text-violet-600", bgLight: "bg-violet-50 border-violet-200" },
  category_featured: { labelKey: "promotionsPage.tierCategoryFeatured", color: "bg-gradient-to-r from-teal-500 to-cyan-600", textColor: "text-teal-600", bgLight: "bg-teal-50 border-teal-200" }
};
const TYPE_LABEL_KEYS = {
  popup: "promotionsPage.typePopup",
  gallery: "promotionsPage.typeGallery",
  cafe: "promotionsPage.typeCafe",
  showroom: "promotionsPage.typeShowroom",
  fleamarket: "promotionsPage.typeFleamarket",
  store: "promotionsPage.typeStore"
};
const AdminPromotions = () => {
  const { t } = useTranslation("admin");
  const [promotions, setPromotions] = reactExports.useState([]);
  const [allVenues, setAllVenues] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showModal, setShowModal] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [searchVenue, setSearchVenue] = reactExports.useState("");
  const [filterTier, setFilterTier] = reactExports.useState("");
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const [form, setForm] = reactExports.useState({
    venue_id: "",
    tier: "hot_top",
    featured_category: "",
    start_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    end_date: "",
    admin_note: "",
    display_order: 0
  });
  reactExports.useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/promotions/get_admin_promotions.php`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setPromotions(json.promotions || []);
        setAllVenues(json.venues || []);
      }
    } catch (err) {
      console.error(t("promotionsPage.loadFailed"), err);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenAdd = () => {
    setEditTarget(null);
    setForm({
      venue_id: "",
      tier: "hot_top",
      featured_category: "",
      start_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      end_date: "",
      admin_note: "",
      display_order: 0
    });
    setSearchVenue("");
    setShowModal(true);
  };
  const handleOpenEdit = (promo) => {
    setEditTarget(promo);
    setForm({
      venue_id: promo.venue_id,
      tier: promo.tier,
      featured_category: promo.featured_category || "",
      start_date: promo.start_date,
      end_date: promo.end_date,
      admin_note: promo.admin_note || "",
      display_order: promo.display_order || 0
    });
    setShowModal(true);
  };
  const handleQuickDate = (days) => {
    const start = new Date(form.start_date || /* @__PURE__ */ new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setForm((prev) => ({ ...prev, end_date: end.toISOString().slice(0, 10) }));
  };
  const handleSubmit = async () => {
    if (!form.venue_id || !form.start_date || !form.end_date) {
      showToast(t("promotionsPage.requiredFields"), "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/promotions/set_promotion.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchData();
        showToast(t("promotionsPage.promotionRegistered"), "success");
      } else {
        showToast(json.message || t("promotionsPage.errorOccurred"), "error");
      }
    } catch (err) {
      showToast(t("promotionsPage.serverError"), "error");
    }
  };
  const handleRemove = async (promotionId) => {
    setConfirmModal({
      title: t("promotionsPage.deletePromotion"),
      message: t("promotionsPage.deleteConfirm"),
      type: "danger",
      confirmLabel: t("promotionsPage.deleteLabel"),
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await fetch(`${API_BASE}/promotions/remove_promotion.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ promotion_id: promotionId })
          });
          const json = await res.json();
          if (json.success) {
            fetchData();
            showToast(t("promotionsPage.promotionDeleted"), "success");
          }
        } catch (err) {
          showToast(t("promotionsPage.serverError"), "error");
        }
      }
    });
  };
  const promotedVenueIds = reactExports.useMemo(() => new Set(promotions.map((p) => parseInt(p.venue_id))), [promotions]);
  const availableVenues = reactExports.useMemo(() => {
    return allVenues.filter((v) => {
      var _a, _b;
      if (editTarget && parseInt(v.id) === parseInt(editTarget.venue_id)) return true;
      if (promotedVenueIds.has(parseInt(v.id))) return false;
      if (searchVenue) {
        const term = searchVenue.toLowerCase();
        return ((_a = v.name) == null ? void 0 : _a.toLowerCase().includes(term)) || ((_b = v.location) == null ? void 0 : _b.toLowerCase().includes(term));
      }
      return true;
    });
  }, [allVenues, promotedVenueIds, searchVenue, editTarget]);
  const filteredPromotions = reactExports.useMemo(() => {
    if (!filterTier) return promotions;
    return promotions.filter((p) => p.tier === filterTier);
  }, [promotions, filterTier]);
  const activeCount = promotions.filter((p) => p.promo_status === "active").length;
  const expiredCount = promotions.filter((p) => p.promo_status === "expired").length;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 24, className: "text-orange-500" }),
          t("promotionsPage.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("promotionsPage.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleOpenAdd,
          className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
            t("promotionsPage.addPromotion")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-gray-100 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-gray-900", children: promotions.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-medium", children: t("promotionsPage.totalPromotions") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-emerald-600", children: activeCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600 font-medium", children: t("promotionsPage.active") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-4 border border-gray-100 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-gray-400", children: expiredCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 font-medium", children: t("promotionsPage.expired") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4 overflow-x-auto pb-1", children: [
      { value: "", label: t("promotionsPage.filterAll") },
      { value: "hot_top", label: t("promotionsPage.filterHot") },
      { value: "hot_mid", label: t("promotionsPage.filterCurated") },
      { value: "category_featured", label: t("promotionsPage.filterCategoryFeatured") }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setFilterTier(tab.value),
        className: `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filterTier === tab.value ? "bg-indigo-600 text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
        children: tab.label
      },
      tab.value
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredPromotions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-12 text-center border border-gray-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 40, className: "mx-auto text-gray-300 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-medium", children: t("promotionsPage.noPromotions") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleOpenAdd, className: "text-indigo-600 font-bold text-sm mt-2 hover:underline", children: t("promotionsPage.addNewPromotion") })
    ] }) : filteredPromotions.map((promo) => {
      var _a;
      const isExpired = promo.promo_status === "expired";
      const tierConf = TIER_CONFIG_KEYS[promo.tier];
      const daysLeft = Math.ceil((new Date(promo.end_date) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `bg-white rounded-2xl p-4 md:p-5 border transition-all ${isExpired ? "border-gray-100 opacity-60" : "border-gray-100 hover:shadow-md"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 md:w-12 md:h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0", children: ((_a = promo.venue_images) == null ? void 0 : _a[0]) ? (() => {
                const img = promo.venue_images[0];
                const src = img.startsWith("/") ? img : `/${img}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", className: "w-full h-full object-cover" });
              })() : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20, className: "text-gray-400" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 truncate", children: promo.venue_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 ${tierConf.color} text-white rounded-md text-xs font-bold`, children: t(tierConf.labelKey) }),
                  promo.tier === "category_featured" && promo.featured_category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md text-xs font-bold", children: t(TYPE_LABEL_KEYS[promo.featured_category]) || promo.featured_category }),
                  isExpired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-gray-200 text-gray-500 rounded-md text-xs font-bold", children: t("promotionsPage.expired") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 truncate mt-0.5", children: [
                  promo.venue_location,
                  " · ",
                  t(TYPE_LABEL_KEYS[promo.venue_type]) || promo.venue_type
                ] }),
                promo.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-orange-600 font-medium mt-1 truncate flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 10 }),
                  promo.admin_note
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 md:gap-4 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                  promo.start_date,
                  " ~ ",
                  promo.end_date
                ] }),
                !isExpired && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-bold mt-0.5 ${daysLeft <= 3 ? "text-red-500" : daysLeft <= 7 ? "text-orange-500" : "text-emerald-600"}`, children: daysLeft <= 0 ? t("promotionsPage.expiresToday") : t("promotionsPage.daysLeft", { days: daysLeft }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleOpenEdit(promo),
                    className: "p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors",
                    title: t("promotionsPage.editTitle"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleRemove(promo.id),
                    className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                    title: t("promotionsPage.deleteTitle"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                  }
                )
              ] })
            ] })
          ] })
        },
        promo.id
      );
    }) }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm", onClick: () => setShowModal(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black text-gray-900", children: editTarget ? t("promotionsPage.editPromotion") : t("promotionsPage.addPromotionTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowModal(false), className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700 mb-2 block", children: t("promotionsPage.selectVenue") }),
          !editTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: t("promotionsPage.searchVenue"),
                value: searchVenue,
                onChange: (e) => setSearchVenue(e.target.value),
                className: "w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-y-auto border border-gray-200 rounded-xl", children: availableVenues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-4 text-sm text-gray-400", children: t("promotionsPage.noAvailableVenues") }) : availableVenues.map((v) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setForm((prev) => ({ ...prev, venue_id: v.id })),
                className: `w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 border-b border-gray-50 last:border-0 ${parseInt(form.venue_id) === parseInt(v.id) ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-700"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14, className: "text-gray-400 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: v.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 ml-auto flex-shrink-0", children: (_a = v.location) == null ? void 0 : _a.split(" ").slice(0, 2).join(" ") })
                ]
              },
              v.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700 mb-2 block", children: t("promotionsPage.exposureTier") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: Object.entries(TIER_CONFIG_KEYS).map(([key, conf]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setForm((prev) => ({ ...prev, tier: key, featured_category: key === "category_featured" ? prev.featured_category : "" })),
              className: `p-3 rounded-xl border-2 text-xs font-bold text-center transition-all ${form.tier === key ? `${conf.bgLight} ${conf.textColor}` : "border-gray-200 text-gray-500 hover:border-gray-300"}`,
              children: t(conf.labelKey)
            },
            key
          )) }),
          form.tier === "category_featured" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-teal-700 mb-1.5 block", children: t("promotionsPage.selectCategory") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: Object.entries(TYPE_LABEL_KEYS).map(([key, labelKey]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setForm((prev) => ({ ...prev, featured_category: key })),
                className: `px-3 py-2 rounded-lg border text-xs font-bold text-center transition-all ${form.featured_category === key ? "bg-teal-50 border-teal-300 text-teal-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`,
                children: t(labelKey)
              },
              key
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700 mb-2 block", children: t("promotionsPage.exposurePeriod") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-gray-400 mb-1 block", children: t("promotionsPage.startDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: form.start_date,
                  onChange: (e) => setForm((prev) => ({ ...prev, start_date: e.target.value })),
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-gray-400 mb-1 block", children: t("promotionsPage.endDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: form.end_date,
                  onChange: (e) => setForm((prev) => ({ ...prev, end_date: e.target.value })),
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
            { days: 7, label: "7" },
            { days: 14, label: "14" },
            { days: 30, label: "30" },
            { days: 60, label: "60" }
          ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleQuickDate(opt.days),
              className: "flex-1 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors",
              children: opt.label
            },
            opt.days
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700 mb-2 block", children: t("promotionsPage.adminNote") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: form.admin_note,
              onChange: (e) => setForm((prev) => ({ ...prev, admin_note: e.target.value })),
              placeholder: t("promotionsPage.adminNotePlaceholder"),
              className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
              maxLength: 100
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: t("promotionsPage.adminNotePublic") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-gray-700 mb-2 block", children: t("promotionsPage.sortOrder") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: form.display_order,
              onChange: (e) => setForm((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 })),
              className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200",
              min: 0
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: t("promotionsPage.sortOrderDesc") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSubmit,
              className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors",
              children: editTarget ? t("promotionsPage.editComplete") : t("promotionsPage.registerPromotion")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowModal(false),
              className: "px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors",
              children: t("promotionsPage.cancel")
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: confirmModal, onClose: () => setConfirmModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
export {
  AdminPromotions as default
};
