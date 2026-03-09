import { j as jsxRuntimeExports, K as KakaoMap, L as Link, u as useData, a as useAuth, b as useNavigate, e as useLocation, A as AdSlot, C as COUNTRY_FLAGS } from "./index-BM1FR1Lq.js";
import { r as reactExports, a as X, l as ChevronLeft, b as ChevronRight, u as Store, ap as MapPin, o as BarChart3, ac as Tag, bo as Ruler, c as Coins, v as Users, az as Calendar, aq as Clock, a8 as Heart, ar as Share2, d as Check, b3 as Link2, $ as ExternalLink, k as Sparkles, s as Flame, G as Globe, a0 as ChevronDown, aw as LayoutGrid, N as Eye, w as TrendingUp, ax as Map, ay as List, f as Search, av as Filter, ae as React, F as FileText, P as Paperclip, an as Zap, ao as Star } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
import { u as useDemoGuard } from "./useDemoGuard-CCfUj4xK.js";
const CATEGORY_OPTIONS = { food: "음식/요리", fashion: "패션/의류", beauty: "뷰티/화장품", art: "예술/공예", digital: "디지털/전자", lifestyle: "라이프스타일", pet: "반려동물", kids: "키즈/유아", sports: "스포츠/아웃도어", book: "도서/문구", eco: "친환경/에코", local: "지역특산물", health: "건강/웰빙", handmade: "핸드메이드", vintage: "빈티지/레트로", other: "기타" };
const VenueDetailModal = ({ venue, onClose, onApply, onToggleWishlist, isApplied, isWishlisted, getPricingUnitLabel, isHost = false }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = reactExports.useState(0);
  const [showShareMenu, setShowShareMenu] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const shareMenuRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShareMenu]);
  if (!venue) return null;
  const images = Array.isArray(venue.images) ? venue.images : [];
  const prevImage = () => setCurrentImageIndex((i) => i === 0 ? images.length - 1 : i - 1);
  const nextImage = () => setCurrentImageIndex((i) => i === images.length - 1 ? 0 : i + 1);
  const typeLabels = {
    popup: t("venueDetail.typePopup"),
    gallery: t("venueDetail.typeGallery"),
    cafe: t("venueDetail.typeCafe"),
    showroom: t("venueDetail.typeShowroom"),
    fleamarket: t("venueDetail.typeFleamarket"),
    store: t("venueDetail.typeStore")
  };
  const sizeLabels = {
    small: t("venueDetail.sizeSmall"),
    medium: t("venueDetail.sizeMedium"),
    large: t("venueDetail.sizeLarge")
  };
  const unitLabels = {
    daily: t("venueDetail.unitDaily"),
    weekly: t("venueDetail.unitWeekly"),
    monthly: t("venueDetail.unitMonthly")
  };
  const venueUrl = `${window.location.origin}/venues/${venue.id}`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(venueUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = venueUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: venue.name,
        text: `${venue.name} - ${venue.location}`,
        url: venueUrl
      });
    } catch {
    }
    setShowShareMenu(false);
  };
  const handleKakaoShare = () => {
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=javascript_key&url=${encodeURIComponent(venueUrl)}&text=${encodeURIComponent(venue.name)}`;
    window.open(kakaoUrl, "_blank", "width=500,height=600");
    setShowShareMenu(false);
  };
  const handleShareClick = () => {
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      handleNativeShare();
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };
  const commissionRate = parseFloat(venue.commission_rate) || 0;
  const approvedCount = venue.approved_count || 0;
  const maxSellers = venue.max_sellers || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-3 right-3 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-1/2 bg-gray-900 relative group flex-shrink-0", style: { minHeight: "280px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-full h-72 md:h-full md:min-h-[500px] relative overflow-hidden select-none",
          onTouchStart: (e) => {
            const touch = e.touches[0];
            e.currentTarget._touchStartX = touch.clientX;
            e.currentTarget._touchStartY = touch.clientY;
            e.currentTarget._swiping = false;
          },
          onTouchMove: (e) => {
            if (!e.currentTarget._touchStartX) return;
            const dx = e.touches[0].clientX - e.currentTarget._touchStartX;
            const dy = e.touches[0].clientY - e.currentTarget._touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
              e.currentTarget._swiping = true;
            }
          },
          onTouchEnd: (e) => {
            if (!e.currentTarget._touchStartX) return;
            const dx = e.changedTouches[0].clientX - e.currentTarget._touchStartX;
            if (e.currentTarget._swiping && Math.abs(dx) > 50 && images.length > 1) {
              if (dx < 0) nextImage();
              else prevImage();
            }
            e.currentTarget._touchStartX = null;
            e.currentTarget._swiping = false;
          },
          onMouseDown: (e) => {
            e.currentTarget._dragStartX = e.clientX;
          },
          onMouseUp: (e) => {
            if (!e.currentTarget._dragStartX) return;
            const dx = e.clientX - e.currentTarget._dragStartX;
            if (Math.abs(dx) > 50 && images.length > 1) {
              if (dx < 0) nextImage();
              else prevImage();
            }
            e.currentTarget._dragStartX = null;
          },
          children: images.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: images[currentImageIndex],
                alt: venue.name,
                className: "w-full h-full object-contain"
              }
            ),
            images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    prevImage();
                  },
                  className: "absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 22 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    nextImage();
                  },
                  className: "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 22 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-medium", children: [
                currentImageIndex + 1,
                " / ",
                images.length
              ] }),
              images.length > 1 && images.length <= 10 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5", children: images.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  },
                  className: `rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`
                },
                idx
              )) })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center text-gray-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 64, strokeWidth: 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-4 text-sm", children: t("venueDetail.noImages") })
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-1/2 flex flex-col overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 md:p-7 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider", children: typeLabels[venue.type] || venue.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-gray-500 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[200px]", children: venue.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold text-gray-900 leading-tight", children: venue.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 mb-3", children: Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-emerald-600", children: t("venueDetail.free") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500 font-medium", children: t("venueDetail.monthlyRent") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-indigo-600 ml-1", children: `₩${Number(venue.price).toLocaleString()}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-medium mb-0.5 text-sm", children: unitLabels[venue.pricing_unit] || (getPricingUnitLabel ? getPricingUnitLabel(venue.pricing_unit) : "") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl border ${commissionRate > 0 ? "bg-orange-50 border-orange-100" : "bg-gray-50 border-gray-100"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm font-bold flex items-center gap-1.5 ${commissionRate > 0 ? "text-orange-700" : "text-gray-500"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 14 }),
                t("venueDetail.commission")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-lg font-extrabold ${commissionRate > 0 ? "text-orange-600" : "text-gray-400"}`, children: commissionRate > 0 ? `${commissionRate}%` : t("venueDetail.noCommission") })
            ] }),
            commissionRate > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-500 mt-1", children: t("venueDetail.commissionNote") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-indigo-500" }),
              t("venueDetail.spaceDetails")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500", children: t("venueDetail.spaceType") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: typeLabels[venue.type] || venue.type })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500", children: t("venueDetail.region") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: venue.region || t("venueDetail.undecided") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { size: 12, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500", children: t("venueDetail.spaceSize") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: sizeLabels[venue.size] || venue.size || t("venueDetail.undecided") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 12, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500", children: t("venueDetail.pricingUnit") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: venue.pricing_unit === "daily" ? t("venueDetail.daily") : venue.pricing_unit === "weekly" ? t("venueDetail.weekly") : venue.pricing_unit === "monthly" ? t("venueDetail.monthly") : venue.pricing_unit || t("venueDetail.undecided") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-gray-500", children: t("venueDetail.maxSellers") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-800", children: [
                  venue.max_sellers || t("venueDetail.noLimit"),
                  " ",
                  t("venueDetail.maxSellersUnit")
                ] })
              ] })
            ] })
          ] }),
          (venue.avg_sales || (() => {
            try {
              const p = typeof venue.popular_categories === "string" ? JSON.parse(venue.popular_categories) : venue.popular_categories;
              return Array.isArray(p) && p.length > 0;
            } catch {
              return false;
            }
          })()) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-amber-500" }),
              t("venueDetail.salesAndCategory")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              venue.avg_sales && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-amber-50 border border-amber-100 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 12, className: "text-amber-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-amber-700", children: t("venueDetail.avgSales") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-800", children: venue.avg_sales }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md", children: venue.sales_unit === "daily" ? t("venueDetail.unitDaily") : venue.sales_unit === "weekly" ? t("venueDetail.unitWeekly") : t("venueDetail.unitMonthly") })
                ] })
              ] }),
              (() => {
                let cats = [];
                try {
                  cats = typeof venue.popular_categories === "string" ? JSON.parse(venue.popular_categories) : venue.popular_categories;
                  if (!Array.isArray(cats)) cats = [];
                } catch {
                  cats = [];
                }
                if (cats.length === 0) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-teal-50 border border-teal-100 rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12, className: "text-teal-600" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-teal-700", children: t("venueDetail.popularCategories") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: cats.map((cat, i) => {
                    const found = Object.entries(CATEGORY_OPTIONS).find(([k]) => k === cat);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold", children: found ? found[1] : cat }, i);
                  }) })
                ] });
              })()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-indigo-500" }),
              t("venueDetail.scheduleInfo")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13, className: "text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-blue-800", children: t("venueDetail.recruitmentPeriod") })
              ] }),
              venue.recruitment_start || venue.recruitment_end ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: venue.recruitment_start ? new Date(venue.recruitment_start).toLocaleDateString() : t("venueDetail.undecided") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "~" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: venue.recruitment_end ? new Date(venue.recruitment_end).toLocaleDateString() : t("venueDetail.undecided") })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-500", children: t("venueDetail.recruitmentNotSet") })
            ] }),
            (() => {
              let periods = [];
              if (venue.event_periods) {
                try {
                  const parsed = typeof venue.event_periods === "string" ? JSON.parse(venue.event_periods) : venue.event_periods;
                  if (Array.isArray(parsed)) periods = parsed.filter((p) => p.start || p.end);
                } catch {
                }
              }
              if (periods.length === 0 && (venue.event_start || venue.event_end)) {
                periods = [{ start: venue.event_start || "", end: venue.event_end || "" }];
              }
              return periods.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: periods.map((period, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-purple-50 border border-purple-100 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-purple-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-purple-800", children: periods.length > 1 ? t("venueDetail.eventPeriodN", { n: idx + 1 }) : t("venueDetail.eventPeriod") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: period.start ? new Date(period.start).toLocaleDateString() : t("venueDetail.undecided") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "~" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-800", children: period.end ? new Date(period.end).toLocaleDateString() : t("venueDetail.undecided") })
                ] })
              ] }, idx)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-purple-50 border border-purple-100 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-purple-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-purple-800", children: t("venueDetail.eventPeriod") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-500", children: t("venueDetail.eventNotSet") })
              ] });
            })()
          ] }),
          maxSellers > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 pb-5 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-indigo-50 border border-indigo-100 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-indigo-700 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                t("venueDetail.recruitmentStatus")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-indigo-600", children: t("venueDetail.recruitmentCount", { current: approvedCount, max: maxSellers }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-indigo-200 rounded-full h-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-indigo-600 h-2.5 rounded-full transition-all duration-500",
                style: { width: `${Math.min(100, approvedCount / maxSellers * 100)}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-500 mt-1.5", children: approvedCount >= maxSellers ? t("venueDetail.recruitmentFull") : t("venueDetail.spotsRemaining", { count: maxSellers - approvedCount }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 mb-2", children: t("venueDetail.spaceIntro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap leading-relaxed text-sm text-gray-600", children: venue.description || t("venueDetail.noDescription") })
          ] }),
          venue.latitude && venue.longitude && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-indigo-500" }),
              t("venueDetail.location")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              KakaoMap,
              {
                venues: [venue],
                singleMode: true,
                height: "220px"
              }
            )
          ] })
        ] }),
        venue.owner_name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: `/profile/${encodeURIComponent(venue.owner_name)}`,
            className: "flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl hover:from-indigo-100 hover:to-purple-100 transition-all group border border-indigo-100/50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md", children: venue.owner_name.charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors", children: venue.owner_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500", children: t("venueDetail.spaceProvider") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-gray-300 group-hover:text-indigo-500 transition-colors" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onToggleWishlist(venue.id),
              className: `p-3 rounded-xl border transition-all duration-300 flex items-center justify-center flex-shrink-0
                                ${isWishlisted ? "border-rose-200 bg-rose-50 text-rose-500" : "border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:text-rose-500"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 22, fill: isWishlisted ? "currentColor" : "none" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: shareMenuRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleShareClick,
                className: "p-3 rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-indigo-200 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center flex-shrink-0",
                title: t("venueDetail.shareTitle"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 22 })
              }
            ),
            showShareMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50",
                style: { animation: "fadeInUp 0.2s ease-out" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-gray-50 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-700", children: t("venueDetail.shareTitle") }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: handleCopyLink,
                        className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors group",
                        children: [
                          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-emerald-600" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16, className: "text-gray-500 group-hover:text-indigo-600" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold ${copied ? "text-emerald-600" : "text-gray-700"}`, children: copied ? t("venueDetail.linkCopied") : t("venueDetail.copyLink") }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("venueDetail.copyDesc") })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: handleKakaoShare,
                        className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 transition-colors group",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "#3C1E1E", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3C6.48 3 2 6.36 2 10.5c0 2.69 1.76 5.04 4.4 6.38l-1.12 4.12c-.1.36.3.65.6.44L10.5 18.5c.49.06 1 .1 1.5.1 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" }) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: t("venueDetail.kakaoTalk") }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("venueDetail.kakaoDesc") })
                          ] })
                        ]
                      }
                    ),
                    navigator.share && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: handleNativeShare,
                        className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16, className: "text-blue-600" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: t("venueDetail.shareOther") }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: t("venueDetail.shareOtherDesc") })
                          ] })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onApply(venue),
              disabled: isApplied || isHost,
              className: `flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-base py-3 transition-all shadow-lg
                                ${isHost ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" : isApplied ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none" : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200"}`,
              children: isHost ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("venueDetail.hostCantApply") }) : isApplied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("venueDetail.applied") })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("venueDetail.applyNow") })
            }
          )
        ] })
      ] }) })
    ] })
  ] });
};
const API_BASE = "/api";
const REGION_OPTIONS_BY_COUNTRY = {
  "ko": [
    { value: "서울특별시", label: "서울" },
    { value: "경기도", label: "경기도" },
    { value: "인천광역시", label: "인천" },
    { value: "대전광역시", label: "대전" },
    { value: "대구광역시", label: "대구" },
    { value: "광주광역시", label: "광주" },
    { value: "울산광역시", label: "울산" },
    { value: "부산광역시", label: "부산" },
    { value: "제주특별자치도", label: "제주" },
    { value: "강원도", label: "강원" }
  ],
  "en": [
    { value: "New York", label: "New York" },
    { value: "California", label: "California" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
    { value: "Illinois", label: "Illinois" },
    { value: "Washington", label: "Washington" },
    { value: "Georgia", label: "Georgia" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Nevada", label: "Nevada" },
    { value: "Hawaii", label: "Hawaii" }
  ],
  "en-GB": [
    { value: "London", label: "London" },
    { value: "Manchester", label: "Manchester" },
    { value: "Birmingham", label: "Birmingham" },
    { value: "Edinburgh", label: "Edinburgh" },
    { value: "Glasgow", label: "Glasgow" },
    { value: "Liverpool", label: "Liverpool" },
    { value: "Bristol", label: "Bristol" },
    { value: "Cardiff", label: "Cardiff" },
    { value: "Belfast", label: "Belfast" },
    { value: "Leeds", label: "Leeds" }
  ],
  "en-CA": [
    { value: "Ontario", label: "Ontario" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Quebec", label: "Quebec" },
    { value: "Alberta", label: "Alberta" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Nova Scotia", label: "Nova Scotia" }
  ],
  "fr-CA": [
    { value: "Ontario", label: "Ontario" },
    { value: "Colombie-Britannique", label: "Colombie-Britannique" },
    { value: "Québec", label: "Québec" },
    { value: "Alberta", label: "Alberta" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Nouvelle-Écosse", label: "Nouvelle-Écosse" }
  ],
  "ja": [
    { value: "東京都", label: "東京都" },
    { value: "大阪府", label: "大阪府" },
    { value: "京都府", label: "京都府" },
    { value: "北海道", label: "北海道" },
    { value: "愛知県", label: "愛知県" },
    { value: "福岡県", label: "福岡県" },
    { value: "神奈川県", label: "神奈川県" },
    { value: "兵庫県", label: "兵庫県" },
    { value: "広島県", label: "広島県" },
    { value: "沖縄県", label: "沖縄県" }
  ],
  "vi": [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP. Hồ Chí Minh", label: "TP. HCM" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Hải Phòng", label: "Hải Phòng" },
    { value: "Cần Thơ", label: "Cần Thơ" },
    { value: "Nha Trang", label: "Nha Trang" },
    { value: "Huế", label: "Huế" },
    { value: "Đà Lạt", label: "Đà Lạt" },
    { value: "Vũng Tàu", label: "Vũng Tàu" }
  ],
  "th": [
    { value: "กรุงเทพมหานคร", label: "กรุงเทพฯ" },
    { value: "เชียงใหม่", label: "เชียงใหม่" },
    { value: "ภูเก็ต", label: "ภูเก็ต" },
    { value: "พัทยา", label: "พัทยา" },
    { value: "เชียงราย", label: "เชียงราย" },
    { value: "ขอนแก่น", label: "ขอนแก่น" },
    { value: "สงขลา", label: "สงขลา" }
  ],
  "km": [
    { value: "ភ្នំពេញ", label: "ភ្នំពេញ" },
    { value: "សៀមរាប", label: "សៀមរាប" },
    { value: "បាត់ដំបង", label: "បាត់ដំបង" },
    { value: "ព្រះសីហនុ", label: "ព្រះសីហនុ" },
    { value: "កំពង់ចាម", label: "កំពង់ចាម" },
    { value: "កំពត", label: "កំពត" }
  ],
  "ru": [
    { value: "Москва", label: "Москва" },
    { value: "Санкт-Петербург", label: "С.-Петербург" },
    { value: "Новосибирск", label: "Новосибирск" },
    { value: "Екатеринбург", label: "Екатеринбург" },
    { value: "Казань", label: "Казань" },
    { value: "Владивосток", label: "Владивосток" },
    { value: "Сочи", label: "Сочи" }
  ],
  "uk": [
    { value: "Київ", label: "Київ" },
    { value: "Харків", label: "Харків" },
    { value: "Одеса", label: "Одеса" },
    { value: "Дніпро", label: "Дніпро" },
    { value: "Львів", label: "Львів" },
    { value: "Запоріжжя", label: "Запоріжжя" },
    { value: "Вінниця", label: "Вінниця" }
  ]
};
const getRegionOptions = (code) => {
  if (!code || code === "all") return REGION_OPTIONS_BY_COUNTRY["ko"];
  return REGION_OPTIONS_BY_COUNTRY[code] || REGION_OPTIONS_BY_COUNTRY["ko"];
};
const SellerDashboard = () => {
  var _a, _b, _c;
  const { venues, applyForVenue, applications, wishlist, toggleWishlist } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("seller");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [filterLocation, setFilterLocation] = reactExports.useState("all");
  const [priceRange, setPriceRange] = reactExports.useState("all");
  const [showWishlistOnly, setShowWishlistOnly] = reactExports.useState(false);
  const [showMyVenuesOnly, setShowMyVenuesOnly] = reactExports.useState(false);
  const [selectedVenue, setSelectedVenue] = reactExports.useState(null);
  const [showMap, setShowMap] = reactExports.useState(true);
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [countryFilter, setCountryFilter] = reactExports.useState((user == null ? void 0 : user.country) || "all");
  const [sortOrder, setSortOrder] = reactExports.useState("latest");
  const [heroIndex, setHeroIndex] = reactExports.useState(0);
  const [showCountryDropdown, setShowCountryDropdown] = reactExports.useState(false);
  const [detectedCountry, setDetectedCountry] = reactExports.useState(null);
  const trendingRef = reactExports.useRef(null);
  const hotPromoRef = reactExports.useRef(null);
  const countryDropdownRef = reactExports.useRef(null);
  const [curatedVenues, setCuratedVenues] = reactExports.useState([]);
  const [hotPromoVenues, setHotPromoVenues] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetchHotPlaces();
  }, []);
  reactExports.useEffect(() => {
    if (hotPromoVenues.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % hotPromoVenues.length);
    }, 5e3);
    return () => clearInterval(timer);
  }, [hotPromoVenues.length]);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const venueId = params.get("venue");
    if (venueId && venues && venues.length > 0) {
      const found = venues.find((v) => String(v.id) === String(venueId));
      if (found) {
        setSelectedVenue(found);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [location.search, venues]);
  reactExports.useEffect(() => {
    setFilterLocation("all");
  }, [countryFilter]);
  reactExports.useEffect(() => {
    if (user == null ? void 0 : user.country) return;
    fetch("/api/auth/detect_country.php", { credentials: "include" }).then((r) => r.json()).then((data) => {
      if (data.success && data.country_code) {
        setDetectedCountry(data.country_code);
        setCountryFilter(data.country_code);
      }
    }).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const fetchHotPlaces = async () => {
    try {
      const res = await fetch(`${API_BASE}/promotions/get_promotions.php`, { credentials: "include" });
      if (!res.ok) {
        console.error("레퍼런스 API 응답 오류:", res.status, res.statusText);
        return;
      }
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("레퍼런스 JSON 파싱 실패:", text.substring(0, 500));
        return;
      }
      if (json.success) {
        const normalize = (arr) => (arr || []).map((v) => ({ ...v, id: v.venue_id || v.id }));
        setCuratedVenues(normalize(json.hot_top));
        setHotPromoVenues(normalize(json.hot_mid));
      }
    } catch (err) {
      console.error("레퍼런스 로드 실패:", err);
    }
  };
  const getPricingUnitLabel = (unit) => {
    switch (unit) {
      case "weekly":
        return t("pricingUnit.weekly");
      case "monthly":
        return t("pricingUnit.monthly");
      default:
        return t("pricingUnit.daily");
    }
  };
  const [applyModalVenue, setApplyModalVenue] = reactExports.useState(null);
  const [applyMessage, setApplyMessage] = reactExports.useState("");
  const [applyLoading, setApplyLoading] = reactExports.useState(false);
  const [selectedPeriod, setSelectedPeriod] = reactExports.useState(null);
  const [applyFiles, setApplyFiles] = reactExports.useState([]);
  const [useFasttrack, setUseFasttrack] = reactExports.useState(false);
  const [fasttrackInfo, setFasttrackInfo] = reactExports.useState(null);
  const isHost = (user == null ? void 0 : user.role) === "host";
  (user == null ? void 0 : user.role) === "admin" || (user == null ? void 0 : user.role) === "superadmin";
  const { isDemoUser, demoAlert } = useDemoGuard();
  const handleApply = (venue) => {
    if (isDemoUser) {
      demoAlert("입점 신청");
      return;
    }
    if (isHost) {
      alert(t("hostCannotApplyAlert"));
      return;
    }
    setApplyModalVenue(venue);
    setApplyMessage("");
    let periods = [];
    if (venue.event_periods) {
      try {
        const parsed = typeof venue.event_periods === "string" ? JSON.parse(venue.event_periods) : venue.event_periods;
        if (Array.isArray(parsed)) periods = parsed.filter((p) => p.start || p.end);
      } catch {
      }
    }
    setSelectedPeriod(periods.length === 1 ? periods[0] : null);
    if ((user == null ? void 0 : user.role) === "seller") {
      fetch(`${API_BASE}/users/check_service.php?service=priority_application`, { credentials: "include" }).then((r) => r.json()).then((info) => {
        setFasttrackInfo(info);
        setUseFasttrack(info.hasAccess && info.auto_apply === 1);
      }).catch(() => {
        setFasttrackInfo(null);
        setUseFasttrack(false);
      });
    }
  };
  const submitApply = async () => {
    if (!applyModalVenue) return;
    setApplyLoading(true);
    try {
      const formData = new FormData();
      formData.append("venue_id", applyModalVenue.id);
      formData.append("venue_name", applyModalVenue.name);
      formData.append("seller_id", user.id);
      formData.append("seller_name", user.name);
      formData.append("message", applyMessage.trim());
      if (selectedPeriod) {
        formData.append("selected_period", JSON.stringify(selectedPeriod));
      }
      applyFiles.forEach((f) => formData.append("attachments[]", f));
      if (useFasttrack && (fasttrackInfo == null ? void 0 : fasttrackInfo.hasAccess)) {
        formData.append("use_fasttrack", "1");
      }
      const result = await applyForVenue(formData);
      if (result.success) {
        alert(t("applicationSuccess"));
        setApplyModalVenue(null);
        setApplyFiles([]);
        const role = user == null ? void 0 : user.role;
        if (role === "admin" || role === "superadmin") {
          navigate("/admin/applications");
        } else if (role === "host") {
          navigate("/host/dashboard");
        } else {
          navigate("/seller/applications");
        }
      } else {
        alert(t("applicationFailed", { message: result.message }));
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert(t("systemError", { message: error.message }));
    } finally {
      setApplyLoading(false);
    }
  };
  const myApplications = applications;
  const [trendingVenues, setTrendingVenues] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetchTrendingVenues();
  }, []);
  const fetchTrendingVenues = async () => {
    try {
      const res = await fetch(`${API_BASE}/venues/get_trending.php`, { credentials: "include" });
      const json = await res.json();
      if (json.success && Array.isArray(json.trending)) {
        setTrendingVenues(json.trending);
      }
    } catch (err) {
      console.error("급상승 공간 로드 실패:", err);
    }
  };
  const REGION_SHORT = {
    "서울": "서울",
    "경기": "경기",
    "인천광역시": "인천",
    "대전광역시": "대전",
    "대구광역시": "대구",
    "광주광역시": "광주",
    "부산광역시": "부산",
    "울산광역시": "울산",
    "제주특별자치": "제주",
    "강원": "강원"
  };
  const filteredVenues = reactExports.useMemo(() => {
    const filtered = venues.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || venue.type === filterType;
      let matchesLocation = true;
      if (filterLocation !== "all") {
        const shortName = REGION_SHORT[filterLocation] || filterLocation;
        matchesLocation = venue.region === filterLocation || venue.region === shortName || venue.location && (venue.location.includes(filterLocation) || venue.location.includes(shortName));
      }
      let matchesPrice = true;
      const price = parseInt(venue.price);
      if (priceRange === "low") matchesPrice = price <= 1e5;
      if (priceRange === "mid") matchesPrice = price > 1e5 && price <= 3e5;
      if (priceRange === "high") matchesPrice = price > 3e5;
      const matchesWishlist = !showWishlistOnly || wishlist.some((w) => w.userId === user.email && w.venueId === venue.id);
      const matchesMine = !showMyVenuesOnly || String(venue.owner_id) === String(user.id);
      const matchesCountry = countryFilter === "all" || venue.owner_country === countryFilter;
      return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesWishlist && matchesMine && matchesCountry;
    });
    const sorted = [...filtered];
    if (sortOrder === "priceAsc") sorted.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
    else if (sortOrder === "priceDesc") sorted.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
    else if (sortOrder === "popular") sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    else sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return sorted;
  }, [venues, searchTerm, filterType, filterLocation, priceRange, showWishlistOnly, showMyVenuesOnly, wishlist, user.email, user.id, countryFilter, sortOrder]);
  const countryStats = reactExports.useMemo(() => {
    const target = countryFilter === "all" ? venues : venues.filter((v) => v.owner_country === countryFilter);
    const totalCount = target.length;
    const prices = target.map((v) => parseInt(v.price) || 0).filter((p) => p > 0);
    const avgPrice = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;
    const activeCount = target.filter((v) => {
      const cur = parseInt(v.current_sellers) || 0;
      const max = parseInt(v.max_sellers) || 0;
      return max === 0 || cur < max;
    }).length;
    return { totalCount, avgPrice, activeCount };
  }, [venues, countryFilter]);
  const HotPlaceCard = ({ venue }) => {
    var _a2, _b2, _c2;
    const firstImage = (_a2 = venue.images) == null ? void 0 : _a2[0];
    const imgSrc = ((_b2 = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b2.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex-shrink-0 w-72 md:w-80",
        onClick: () => setSelectedVenue(venue),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-56 md:h-64 bg-gradient-to-br from-gray-800 to-gray-900", children: [
          imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, className: "text-gray-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-extrabold shadow-lg shadow-orange-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-lg bg-orange-400 animate-ping opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 13 }),
            "HOT"
          ] }) }),
          venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-white/15 backdrop-blur-md text-white/90 rounded-lg text-[11px] font-semibold border border-white/10", children: t(`typeLabels.${venue.type}`, venue.type) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
            venue.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-bold text-orange-300 mb-1 flex items-center gap-1 truncate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 11 }),
              venue.admin_note
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[15px] font-extrabold text-white mb-1.5 group-hover:text-orange-200 transition-colors truncate drop-shadow-sm", children: venue.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs text-white/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                (_c2 = venue.location) == null ? void 0 : _c2.split(" ").slice(0, 2).join(" ")
              ] }),
              venue.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-300/80 font-semibold", children: [
                "₩",
                Number(venue.price).toLocaleString()
              ] })
            ] })
          ] })
        ] })
      }
    );
  };
  const TrendingCard = ({ venue }) => {
    var _a2, _b2, _c2;
    const firstImage = (_a2 = venue.images) == null ? void 0 : _a2[0];
    const imgSrc = ((_b2 = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b2.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
    const isWishlisted = wishlist.some((w) => w.userId === user.email && w.venueId === venue.id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-1 cursor-pointer",
        onClick: () => setSelectedVenue(venue),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden", children: [
            imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 36, className: "text-violet-300" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white rounded-lg text-xs font-bold shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 11 }),
              t("trending")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleWishlist(user.email, venue.id);
                },
                className: "absolute top-2.5 right-2.5 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, className: isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 mb-1.5 group-hover:text-violet-600 transition-colors text-sm truncate", children: venue.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                (_c2 = venue.location) == null ? void 0 : _c2.split(" ").slice(0, 2).join(" ")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t(`typeLabels.${venue.type}`, venue.type) })
            ] })
          ] })
        ]
      }
    );
  };
  const VenueCard = ({ venue }) => {
    var _a2, _b2;
    const isApplied = myApplications.some((app) => String(app.venue_id) === String(venue.id) || String(app.venueId) === String(venue.id));
    const isWishlisted = wishlist.some((w) => String(w.venueId) === String(venue.id));
    const firstImage = (_a2 = venue.images) == null ? void 0 : _a2[0];
    const imgSrc = ((_b2 = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b2.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
    let typeLabel = t(`typeLabels.${venue.type}`, venue.type);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setSelectedVenue(venue),
        className: "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-52 relative bg-gray-100 overflow-hidden", children: [
            imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, strokeWidth: 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm mt-2 font-medium", children: "No Image" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-lg", children: [
              Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: t("free") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "₩",
                parseInt(venue.price).toLocaleString(),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-normal text-xs ml-1", children: getPricingUnitLabel(venue.pricing_unit) })
              ] }),
              parseFloat(venue.commission_rate) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] text-orange-500 font-medium mt-0.5", children: t("commission", { rate: venue.commission_rate }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleWishlist(user.email, venue.id);
                },
                className: "absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 group-hover:opacity-100",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 18, className: `transition-colors ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"}` })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-4 left-4 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/20", children: typeLabel }),
            venue.is_premium ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-14 left-4 inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg text-[10px] font-extrabold text-white shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, className: "fill-white" }),
              " PREMIUM"
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1", children: [
              venue.is_premium ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, className: "inline text-amber-400 fill-amber-400 mr-1" }) : null,
              venue.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-gray-500 text-sm mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1 bg-gray-50 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-gray-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: venue.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1", children: venue.description || t("noDescription") }),
            (() => {
              const approved = parseInt(venue.approved_count) || 0;
              const max = parseInt(venue.max_sellers) || 0;
              const isFull = max > 0 && approved >= max;
              const isAlmostFull = max > 0 && approved >= max - 1 && !isFull;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-4 text-sm font-bold ${isFull ? "bg-red-50 text-red-600 border border-red-100" : isAlmostFull ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                  t("occupancyStatus")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  approved,
                  max > 0 ? t("occupancyCount", { max }) : "",
                  isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full", children: t("closed") })
                ] })
              ] });
            })(),
            isHost ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-3 rounded-xl text-sm font-bold text-center bg-gray-100 text-gray-400", children: t("hostCannotApply") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleApply(venue);
                },
                disabled: isApplied,
                className: `w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isApplied ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98]"}`,
                children: isApplied ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 }),
                  " ",
                  t("applicationComplete")
                ] }) : t("applyForSpace")
              }
            )
          ] })
        ]
      },
      venue.id
    );
  };
  const VenueListItem = ({ venue }) => {
    var _a2, _b2;
    const isApplied = myApplications.some((app) => String(app.venue_id) === String(venue.id) || String(app.venueId) === String(venue.id));
    const isWishlisted = wishlist.some((w) => String(w.venueId) === String(venue.id));
    const firstImage = (_a2 = venue.images) == null ? void 0 : _a2[0];
    const imgSrc = ((_b2 = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b2.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
    let typeLabel = t(`typeLabels.${venue.type}`, venue.type);
    const approved = parseInt(venue.approved_count) || 0;
    const max = parseInt(venue.max_sellers) || 0;
    const isFull = max > 0 && approved >= max;
    const occupancyPct = max > 0 ? Math.min(approved / max * 100, 100) : 0;
    const commission = parseFloat(venue.commission_rate) || 0;
    const typeColors = {
      popup: "from-pink-500 to-rose-500",
      gallery: "from-violet-500 to-purple-500",
      cafe: "from-amber-500 to-orange-500",
      flea_market: "from-emerald-500 to-teal-500",
      showroom: "from-blue-500 to-cyan-500"
    };
    const badgeGradient = typeColors[venue.type] || "from-gray-500 to-gray-600";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: () => setSelectedVenue(venue),
        className: "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 cursor-pointer",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-stretch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28 sm:w-36 md:w-44 flex-shrink-0 relative bg-gray-100 overflow-hidden", children: [
            imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center h-full text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 28, strokeWidth: 1 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleWishlist(user.email, venue.id);
                },
                className: "absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, className: isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-3 sm:p-4 min-w-0 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `bg-gradient-to-r ${badgeGradient} text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm`, children: typeLabel }),
                commission > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100", children: t("commission", { rate: commission }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors mb-1", children: venue.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] sm:text-xs text-gray-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11, className: "text-gray-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location })
              ] }),
              venue.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] sm:text-xs text-gray-400 mt-1.5 line-clamp-1 leading-relaxed", children: venue.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2 mt-2 pt-2 border-t border-gray-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm sm:text-base font-bold text-emerald-600", children: t("free") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm sm:text-base font-bold text-gray-900", children: [
                  "₩",
                  parseInt(venue.price).toLocaleString(),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-normal ml-0.5", children: getPricingUnitLabel(venue.pricing_unit) })
                ] }) }),
                max > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 11, className: isFull ? "text-red-400" : "text-gray-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-bold ${isFull ? "text-red-500" : "text-gray-500"}`, children: [
                      approved,
                      "/",
                      max
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-full rounded-full transition-all ${isFull ? "bg-red-400" : occupancyPct > 70 ? "bg-amber-400" : "bg-emerald-400"}`,
                      style: { width: `${occupancyPct}%` }
                    }
                  ) }),
                  isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded", children: t("closed") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: !isHost && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleApply(venue);
                  },
                  disabled: isApplied || isFull,
                  className: `px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${isApplied ? "bg-gray-100 text-gray-400" : isFull ? "bg-red-50 text-red-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm mb-4", children: t("spacematchFindSpace") })
                }
              ) })
            ] })
          ] })
        ] })
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200/60 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_top", format: "native", className: "!shadow-none !border-none" }) }) }),
    hotPromoVenues.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative rounded-3xl overflow-hidden shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[250px] md:h-[400px] bg-gray-900", children: [
      hotPromoVenues.map((venue, i) => {
        var _a2, _b2, _c2;
        const firstImage = (_a2 = venue.images) == null ? void 0 : _a2[0];
        const imgSrc = ((_b2 = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b2.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${i === heroIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}`,
            onClick: () => setSelectedVenue(venue),
            children: [
              imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 64, className: "text-white/30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 11 }),
                    " HOT"
                  ] }),
                  venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium", children: t(`typeLabels.${venue.type}`, venue.type) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-3xl font-black text-white mb-1.5 line-clamp-1", children: venue.name }),
                venue.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-orange-200 font-medium mb-1 line-clamp-1", children: venue.admin_note }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-white/70 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                  (_c2 = venue.location) == null ? void 0 : _c2.split(" ").slice(0, 2).join(" ")
                ] }) })
              ] })
            ]
          },
          venue.promotion_id || i
        );
      }),
      hotPromoVenues.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setHeroIndex((prev) => (prev - 1 + hotPromoVenues.length) % hotPromoVenues.length);
            },
            className: "absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setHeroIndex((prev) => (prev + 1) % hotPromoVenues.length);
            },
            className: "absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 20 })
          }
        )
      ] }),
      hotPromoVenues.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-6 md:right-10 flex gap-1.5 z-10", children: hotPromoVenues.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setHeroIndex(i);
          },
          className: `rounded-full transition-all ${i === heroIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`
        },
        i
      )) })
    ] }) }) : (
      /* Fallback header if no hot places */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300", children: "Find Your Space" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-2 font-medium", children: t("heroSubtitle") })
      ] })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg md:text-xl font-black text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20, className: "text-indigo-500" }),
          t("countryFilter")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: countryDropdownRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowCountryDropdown(!showCountryDropdown),
              className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${showCountryDropdown ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-md" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: countryFilter === "all" ? "🌍" : ((_a = COUNTRY_FLAGS[countryFilter]) == null ? void 0 : _a.flag) || "🌍" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: countryFilter === "all" ? t("allCountries") : (i18n.language === "ko" ? (_b = COUNTRY_FLAGS[countryFilter]) == null ? void 0 : _b.name : (_c = COUNTRY_FLAGS[countryFilter]) == null ? void 0 : _c.nameEn) || t("allCountries") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: `transition-transform ${showCountryDropdown ? "rotate-180" : ""}` })
              ]
            }
          ),
          showCountryDropdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setCountryFilter("all");
                  setShowCountryDropdown(false);
                },
                className: `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${countryFilter === "all" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌍" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: t("allCountries") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-1.5 py-0.5 bg-gray-100 rounded-md text-gray-500", children: venues.length })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gray-100 my-1" }),
            Object.entries(COUNTRY_FLAGS).map(([code, info]) => {
              const cnt = venues.filter((v) => v.owner_country === code).length;
              const isDetected = code === detectedCountry;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setCountryFilter(code);
                    setShowCountryDropdown(false);
                  },
                  className: `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${countryFilter === code ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.flag }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: i18n.language === "ko" ? info.name : info.nameEn }),
                    isDetected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold", children: "IP" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-1.5 py-0.5 bg-gray-100 rounded-md text-gray-500", children: cnt })
                  ]
                },
                code
              );
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: sortOrder,
            onChange: (e) => setSortOrder(e.target.value),
            className: "px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-indigo-400 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "latest", children: t("sortLatest") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "priceAsc", children: t("sortPriceAsc") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "priceDesc", children: t("sortPriceDesc") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popular", children: t("sortPopular") })
            ]
          }
        )
      ] }),
      countryFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-800/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-indigo-600 dark:text-indigo-400", children: countryStats.totalCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-indigo-400 dark:text-indigo-300/70 mt-0.5", children: t("venueCountLabel") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-emerald-600 dark:text-emerald-400", children: countryStats.avgPrice > 0 ? `${Math.round(countryStats.avgPrice / 1e4)}만` : "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-emerald-400 dark:text-emerald-300/70 mt-0.5", children: t("avgPriceLabel") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-amber-600 dark:text-amber-400", children: countryStats.activeCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-amber-400 dark:text-amber-300/70 mt-0.5", children: t("activeRecruitLabel") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg md:text-xl font-black text-gray-900", children: t("category") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 scrollbar-thin", children: [
        { key: "all", label: t("allTypes"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 14 }) },
        { key: "popup", label: t("popupStore"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 }) },
        { key: "fleamarket", label: t("fleamarket"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
        { key: "gallery", label: t("gallery"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }) },
        { key: "cafe", label: t("cafeRestaurant"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
        { key: "showroom", label: t("showroom"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
        { key: "store", label: t("store"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) }
      ].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setFilterType(cat.key),
          className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${filterType === cat.key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`,
          children: [
            cat.icon,
            cat.label
          ]
        },
        cat.key
      )) })
    ] }),
    curatedVenues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black", children: t("curatedRecruitment") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("curatedDesc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a2;
                return (_a2 = hotPromoRef.current) == null ? void 0 : _a2.scrollBy({ left: -300, behavior: "smooth" });
              },
              className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a2;
                return (_a2 = hotPromoRef.current) == null ? void 0 : _a2.scrollBy({ left: 300, behavior: "smooth" });
              },
              className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: hotPromoRef, className: "flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth", children: curatedVenues.map((venue, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(HotPlaceCard, { venue }, venue.promotion_id || i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-wider", children: t("recommendedAds") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_a", format: "card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_a2", format: "card" })
      ] })
    ] }),
    trendingVenues.length > 0 && !showWishlistOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black", children: t("trendingSpaces") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("trendingDesc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a2;
                return (_a2 = trendingRef.current) == null ? void 0 : _a2.scrollBy({ left: -300, behavior: "smooth" });
              },
              className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a2;
                return (_a2 = trendingRef.current) == null ? void 0 : _a2.scrollBy({ left: 300, behavior: "smooth" });
              },
              className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: trendingRef, className: "flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth", children: trendingVenues.map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-64 md:w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingCard, { venue }) }, venue.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-wider", children: t("sponsor") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_b", format: "card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_b2", format: "card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_b3", format: "card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_b4", format: "card" })
      ] })
    ] }),
    !showWishlistOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowMap(!showMap),
            className: `flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-lg ${showMap ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { size: 18 }),
              t("mapViewLabel")
            ]
          }
        ),
        showMap && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("mapHint") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" })
      ] }),
      showMap && /* @__PURE__ */ jsxRuntimeExports.jsx(
        KakaoMap,
        {
          venues: filteredVenues,
          height: "450px",
          onMarkerClick: (venue) => setSelectedVenue(venue),
          countryCode: countryFilter,
          className: "mb-2"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base sm:text-lg font-black", children: t("allSpaces") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 font-medium", children: filteredVenues.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent hidden sm:block" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowWishlistOnly(!showWishlistOnly),
            className: `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${showWishlistOnly ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-[1.02]" : "bg-white border border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:shadow-md"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, className: `transition-all duration-300 ${showWishlistOnly ? "fill-white scale-110" : ""}`, fill: showWishlistOnly ? "currentColor" : "none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("favoritesView") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: t("favoritesShort") }),
              showWishlistOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full", children: "ON" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("grid"),
              className: `p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`,
              title: t("gridViewTitle"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("list"),
              className: `p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`,
              title: t("listViewTitle"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-2 sm:p-3 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 flex flex-col gap-2 sm:gap-3 sticky top-4 z-30 transition-all mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 15 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: t("searchPlaceholderFull"),
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 bg-transparent text-gray-700 placeholder-gray-400 font-medium text-sm sm:text-base"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: filterType,
                onChange: (e) => setFilterType(e.target.value),
                className: "w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("spaceType") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popup", children: t("popupStore") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fleamarket", children: t("fleamarket") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gallery", children: t("gallery") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cafe", children: t("cafeRestaurant") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "showroom", children: t("showroom") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 12 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: filterLocation,
                onChange: (e) => setFilterLocation(e.target.value),
                className: "w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("region") }),
                  getRegionOptions(countryFilter).map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 12 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium", children: "₩" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: priceRange,
                onChange: (e) => setPriceRange(e.target.value),
                className: "w-full pl-7 sm:pl-9 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("priceRangeLabel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: t("priceLow") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mid", children: t("priceMid") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: t("priceHigh") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 12 })
          ] }),
          isHost && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowMyVenuesOnly(!showMyVenuesOnly),
              className: `col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${showMyVenuesOnly ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }),
                t("myVenues")
              ]
            }
          )
        ] })
      ] }),
      viewMode === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [
        filteredVenues.map((venue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VenueCard, { venue }),
          idx === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_d", format: "native" }) }),
          idx === 7 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_e", format: "native" }) })
        ] }, venue.id)),
        filteredVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-32 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 40 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: t("noMatchingVenues") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: t("tryOtherFilters") })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        filteredVenues.map((venue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VenueListItem, { venue }),
          idx === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_d", format: "native" }),
          idx === 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_e", format: "native" })
        ] }, venue.id)),
        filteredVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-32 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 40 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: t("noMatchingVenues") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: t("tryOtherFilters") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-wider", children: t("recommended") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "home_f", format: "banner" })
    ] }),
    selectedVenue && /* @__PURE__ */ jsxRuntimeExports.jsx(
      VenueDetailModal,
      {
        venue: selectedVenue,
        onClose: () => setSelectedVenue(null),
        onApply: (v) => {
          handleApply(v);
          if (!isHost) setSelectedVenue(null);
        },
        onToggleWishlist: (id) => toggleWishlist(user.email, id),
        isApplied: myApplications.some((app) => String(app.venue_id) === String(selectedVenue.id) || String(app.venueId) === String(selectedVenue.id)),
        isWishlisted: wishlist.some((w) => String(w.venueId) === String(selectedVenue.id)),
        getPricingUnitLabel,
        isHost
      }
    ),
    applyModalVenue && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setApplyModalVenue(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-extrabold", children: t("applyModalTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 text-sm mt-1", children: applyModalVenue.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setApplyModalVenue(null), className: "w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        (() => {
          let periods = [];
          if (applyModalVenue.event_periods) {
            try {
              const parsed = typeof applyModalVenue.event_periods === "string" ? JSON.parse(applyModalVenue.event_periods) : applyModalVenue.event_periods;
              if (Array.isArray(parsed)) periods = parsed.filter((p) => p.start || p.end);
            } catch {
            }
          }
          if (periods.length > 1) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [
                t("eventPeriodLabel"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: periods.map((p, idx) => {
                const isSelected = selectedPeriod && selectedPeriod.start === p.start && selectedPeriod.end === p.end;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedPeriod(p),
                    className: `w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300 bg-white"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-indigo-600" : "border-gray-300"}`, children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-indigo-600" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: isSelected ? "text-indigo-600" : "text-gray-400" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${isSelected ? "text-indigo-700" : "text-gray-700"}`, children: t("periodLabel", { num: idx + 1, start: p.start ? new Date(p.start).toLocaleDateString() : t("periodTbd"), end: p.end ? new Date(p.end).toLocaleDateString() : t("periodTbd") }) })
                      ] })
                    ]
                  },
                  idx
                );
              }) })
            ] });
          }
          return null;
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [
            t("applyMessageLabel"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-normal", children: t("applyMessageOptional") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: applyMessage,
              onChange: (e) => setApplyMessage(e.target.value),
              placeholder: t("applyMessagePlaceholderLong"),
              rows: 4,
              className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-sm resize-none",
              maxLength: 500
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1 text-right", children: [
            applyMessage.length,
            "/500"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: [
            t("attachmentsLabel"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-normal", children: t("applyMessageOptional") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mb-2", children: t("attachmentsDesc") }),
          applyFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 mb-2", children: applyFiles.map((file, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 14, className: "text-indigo-500 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-indigo-700 flex-1 truncate", children: file.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-indigo-400", children: [
              (file.size / 1024).toFixed(0),
              "KB"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setApplyFiles((prev) => prev.filter((_, i) => i !== idx)), className: "p-0.5 text-red-400 hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
          ] }, idx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl text-gray-400 hover:text-indigo-600 cursor-pointer transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: t("attachFile") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                multiple: true,
                onChange: (e) => {
                  const files = Array.from(e.target.files);
                  const videoExts = ["mp4", "avi", "mov", "wmv", "mkv", "flv", "webm", "m4v", "3gp", "mpeg", "mpg"];
                  const blocked = files.filter((f) => {
                    const ext = f.name.split(".").pop().toLowerCase();
                    return videoExts.includes(ext) || f.type.startsWith("video/");
                  });
                  if (blocked.length > 0) {
                    alert(t("videoNotAllowed"));
                    e.target.value = "";
                    return;
                  }
                  setApplyFiles((prev) => [...prev, ...files]);
                  e.target.value = "";
                },
                className: "hidden"
              }
            )
          ] })
        ] }),
        (fasttrackInfo == null ? void 0 : fasttrackInfo.hasAccess) && (() => {
          const limit = fasttrackInfo.monthly_limit || 0;
          const used = fasttrackInfo.monthly_used || 0;
          const remaining = limit > 0 ? limit - used : -1;
          const isExhausted = limit > 0 && used >= limit;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-xl border-2 transition-all ${useFasttrack && !isExhausted ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${useFasttrack && !isExhausted ? "bg-amber-400 dark:bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: useFasttrack && !isExhausted ? "text-white" : "text-gray-400 dark:text-gray-500", fill: useFasttrack && !isExhausted ? "white" : "none" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold ${useFasttrack && !isExhausted ? "text-amber-700 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"}`, children: t("fasttrackLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: isExhausted ? t("fasttrackMonthlyExhausted") : limit > 0 ? t("fasttrackMonthlyRemaining", { remaining, used, limit }) : t("fasttrackPriorityReview") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => !isExhausted && setUseFasttrack(!useFasttrack),
                disabled: isExhausted,
                className: `relative w-12 h-6 rounded-full transition-all duration-300 ${useFasttrack && !isExhausted ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gray-200 dark:bg-gray-600"} ${isExhausted ? "opacity-50 cursor-not-allowed" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300", style: { left: useFasttrack && !isExhausted ? "1.5rem" : "0.125rem" } })
              }
            )
          ] }) });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setApplyModalVenue(null),
              className: "flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm",
              children: t("cancel", { ns: "common" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: submitApply,
              disabled: applyLoading || (() => {
                let periods = [];
                try {
                  const parsed = typeof applyModalVenue.event_periods === "string" ? JSON.parse(applyModalVenue.event_periods) : applyModalVenue.event_periods;
                  if (Array.isArray(parsed)) periods = parsed.filter((p) => p.start || p.end);
                } catch {
                }
                return periods.length > 1 && !selectedPeriod;
              })(),
              className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed",
              children: applyLoading ? t("applying") : t("submitApplication")
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
export {
  SellerDashboard as default
};
