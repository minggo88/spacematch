import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { ae as React, r as reactExports, u as Store, a as X, av as Filter, a0 as ChevronDown, aq as Clock, az as Calendar, br as Minus, ad as Plus, T as Trash2, v as Users, o as BarChart3, ac as Tag, l as ChevronLeft, b as ChevronRight, bp as Camera, F as FileText, D as Download, P as Paperclip, a9 as CheckCircle2 } from "./vendor-icons-BFe5lkJJ.js";
var s = function(e, o) {
  return s = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e2, o2) {
    e2.__proto__ = o2;
  } || function(e2, o2) {
    for (var t in o2) o2.hasOwnProperty(t) && (e2[t] = o2[t]);
  }, s(e, o);
};
var p = function() {
  return p = Object.assign || function(e) {
    for (var o, t = 1, r = arguments.length; t < r; t++) for (var n in o = arguments[t]) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
    return e;
  }, p.apply(this, arguments);
};
function a(e, o) {
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && o.indexOf(r) < 0 && (t[r] = e[r]);
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var n = 0;
    for (r = Object.getOwnPropertySymbols(e); n < r.length; n++) o.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[n]) && (t[r[n]] = e[r[n]]);
  }
  return t;
}
var i, c = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", u = (i = null, function(e) {
  return void 0 === e && (e = c), i || (i = new Promise(function(o, t) {
    var r = document.createElement("script");
    r.src = e, r.onload = function() {
      var e2;
      if (null === (e2 = null === window || void 0 === window ? void 0 : window.daum) || void 0 === e2 ? void 0 : e2.Postcode) return o(window.daum.Postcode);
      t(new Error("Script is loaded successfully, but cannot find Postcode module. Check your scriptURL property."));
    }, r.onerror = function(e2) {
      return t(e2);
    }, r.id = "daum_postcode_script", document.body.appendChild(r);
  }));
}), l = React.createElement("p", null, "현재 Daum 우편번호 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요."), d = { width: "100%", height: 400 }, f = { scriptUrl: c, errorMessage: l, autoClose: true }, h = function(t) {
  function r() {
    var e = null !== t && t.apply(this, arguments) || this;
    return e.mounted = false, e.wrap = reactExports.createRef(), e.state = { hasError: false, completed: false }, e.initiate = function(o) {
      if (e.wrap.current) {
        var t2 = e.props;
        t2.scriptUrl, t2.className, t2.style;
        var r2 = t2.defaultQuery, n = t2.autoClose;
        t2.errorMessage;
        var s2 = t2.onComplete, i2 = t2.onClose, c2 = t2.onResize, u2 = t2.onSearch, l2 = a(t2, ["scriptUrl", "className", "style", "defaultQuery", "autoClose", "errorMessage", "onComplete", "onClose", "onResize", "onSearch"]);
        new o(p(p({}, l2), { oncomplete: function(o2) {
          s2 && s2(o2), e.setState({ completed: true });
        }, onsearch: u2, onresize: c2, onclose: i2, width: "100%", height: "100%" })).embed(e.wrap.current, { q: r2, autoClose: n });
      }
    }, e.onError = function(o) {
      console.error(o), e.setState({ hasError: true });
    }, e;
  }
  return function(e, o) {
    function t2() {
      this.constructor = e;
    }
    s(e, o), e.prototype = null === o ? Object.create(o) : (t2.prototype = o.prototype, new t2());
  }(r, t), r.prototype.componentDidMount = function() {
    var e = this.initiate, o = this.onError, t2 = this.props.scriptUrl;
    t2 && (this.mounted || (u(t2).then(e).catch(o), this.mounted = true));
  }, r.prototype.render = function() {
    var o = this.props, t2 = o.className, r2 = o.style, n = o.errorMessage, s2 = o.autoClose, a2 = this.state, i2 = a2.hasError, c2 = a2.completed;
    return true === s2 && true === c2 ? null : React.createElement("div", { ref: this.wrap, className: t2, style: p(p({}, d), r2) }, i2 && n);
  }, r.defaultProps = f, r;
}(reactExports.Component);
const CATEGORY_OPTIONS = [
  { value: "fashion", label: "패션/잡화" },
  { value: "beauty", label: "뷰티" },
  { value: "food", label: "푸드/음료" },
  { value: "living", label: "리빙/라이프스타일" },
  { value: "art", label: "아트/디자인" },
  { value: "stationery", label: "문구/오피스" },
  { value: "digital", label: "디지털/테크" },
  { value: "activity", label: "스포츠/액티비티" },
  { value: "eco", label: "친환경/에코라이프" },
  { value: "pet", label: "반려동물" },
  { value: "kids", label: "키즈/유아" },
  { value: "handmade", label: "핸드메이드/수공예" },
  { value: "vintage", label: "빈티지/중고" },
  { value: "perfume", label: "향수/디퓨저" },
  { value: "book", label: "도서/매거진" }
];
const TARGET_CUSTOMER_OPTIONS = [
  { value: "20대 여성", label: "20대 여성" },
  { value: "30대 여성", label: "30대 여성" },
  { value: "20대 남성", label: "20대 남성" },
  { value: "30대 남성", label: "30대 남성" },
  { value: "10대 청소년", label: "10대 청소년" },
  { value: "40대 이상", label: "40대 이상" },
  { value: "대학생", label: "대학생" },
  { value: "직장인", label: "직장인" },
  { value: "주부", label: "주부" },
  { value: "가족 단위", label: "가족 단위" },
  { value: "커플", label: "커플" },
  { value: "외국인 관광객", label: "외국인 관광객" },
  { value: "유아/어린이 동반", label: "유아/어린이 동반" },
  { value: "MZ세대", label: "MZ세대" },
  { value: "반려동물 동반", label: "반려동물 동반" },
  { value: "프리랜서/크리에이터", label: "프리랜서/크리에이터" },
  { value: "패션 관심층", label: "패션 관심층" },
  { value: "뷰티 관심층", label: "뷰티 관심층" },
  { value: "F&B 관심층", label: "F&B 관심층" },
  { value: "건강/웰니스 관심층", label: "건강/웰니스 관심층" }
];
const VenueModal = ({
  isOpen,
  onClose,
  venue,
  // null for create mode
  initialData,
  // Optional: pre-fill data for duplicate mode (venue=null + initialData=object)
  onSubmit,
  // (formData) => Promise
  isAdmin = false,
  onDelete
  // Optional: for delete action within modal if needed
}) => {
  const [formData, setFormData] = reactExports.useState({
    name: "",
    location: "",
    detailAddress: "",
    region: "",
    description: "",
    price: "",
    commission_rate: "",
    pricing_unit: "daily",
    type: "popup",
    images: [],
    attachments: [],
    recruitment_start: "",
    recruitment_end: "",
    event_periods: [{ start: "", end: "" }],
    recruitment_closed: false,
    max_sellers: "",
    avg_sales: "",
    sales_unit: "monthly",
    popular_categories: [],
    target_customers: []
  });
  const [eventPeriodCount, setEventPeriodCount] = reactExports.useState(1);
  const [customCategory, setCustomCategory] = reactExports.useState("");
  const [attachmentFiles, setAttachmentFiles] = reactExports.useState([]);
  const attachmentInputRef = reactExports.useRef(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = reactExports.useState(false);
  const [selectedFiles, setSelectedFiles] = reactExports.useState([]);
  const fileInputRef = reactExports.useRef(null);
  const isDuplicateMode = !venue && !!initialData;
  reactExports.useEffect(() => {
    if (isOpen) {
      const source = venue || initialData;
      if (source) {
        let periods = [{ start: "", end: "" }];
        if (!isDuplicateMode) {
          if (source.event_periods) {
            try {
              const parsed = typeof source.event_periods === "string" ? JSON.parse(source.event_periods) : source.event_periods;
              if (Array.isArray(parsed) && parsed.length > 0) periods = parsed;
            } catch {
            }
          } else if (source.event_start || source.event_end) {
            periods = [{ start: source.event_start || "", end: source.event_end || "" }];
          }
        }
        setFormData({
          name: source.name || "",
          location: source.location || "",
          detailAddress: "",
          region: source.region || "",
          description: source.description || "",
          price: source.price ? String(source.price) : "",
          commission_rate: source.commission_rate ? String(source.commission_rate) : "",
          pricing_unit: source.pricing_unit || "daily",
          type: source.type || "popup",
          size: source.size || "medium",
          images: source.images || [],
          // Dates: reset for duplicate, keep for edit
          recruitment_start: isDuplicateMode ? "" : source.recruitment_start || "",
          recruitment_end: isDuplicateMode ? "" : source.recruitment_end || "",
          event_periods: periods,
          recruitment_closed: isDuplicateMode ? false : source.recruitment_closed ? true : false,
          max_sellers: source.max_sellers ?? "",
          avg_sales: source.avg_sales || "",
          sales_unit: source.sales_unit || "monthly",
          popular_categories: (() => {
            try {
              const p2 = typeof source.popular_categories === "string" ? JSON.parse(source.popular_categories) : source.popular_categories;
              return Array.isArray(p2) ? p2 : [];
            } catch {
              return [];
            }
          })(),
          target_customers: (() => {
            try {
              const t = typeof source.target_customers === "string" ? JSON.parse(source.target_customers) : source.target_customers;
              return Array.isArray(t) ? t : [];
            } catch {
              return [];
            }
          })(),
          attachments: (() => {
            try {
              const a2 = typeof source.attachments === "string" ? JSON.parse(source.attachments) : source.attachments;
              return Array.isArray(a2) ? a2 : [];
            } catch {
              return [];
            }
          })()
        });
        setEventPeriodCount(periods.length);
      } else {
        setFormData({
          name: "",
          location: "",
          detailAddress: "",
          region: "",
          description: "",
          price: "",
          commission_rate: "",
          pricing_unit: "daily",
          type: "popup",
          size: "medium",
          images: [],
          recruitment_start: "",
          recruitment_end: "",
          event_periods: [{ start: "", end: "" }],
          recruitment_closed: false,
          max_sellers: "",
          avg_sales: "",
          sales_unit: "monthly",
          popular_categories: [],
          target_customers: []
        });
        setEventPeriodCount(1);
        setCustomCategory("");
      }
      setSelectedFiles([]);
      setIsPostcodeOpen(false);
    }
  }, [isOpen, venue, initialData]);
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newEntries = filesArray.map((file) => ({
        file,
        blobUrl: URL.createObjectURL(file)
      }));
      setSelectedFiles((prev) => [...prev, ...newEntries]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newEntries.map((e2) => e2.blobUrl)]
      }));
    }
  };
  const removeImage = (index) => {
    const removedUrl = formData.images[index];
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i2) => i2 !== index)
    }));
    if (removedUrl && removedUrl.startsWith("blob:")) {
      setSelectedFiles((prev) => prev.filter((entry) => entry.blobUrl !== removedUrl));
    }
  };
  const moveImage = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= formData.images.length) return;
    const currentImages = [...formData.images];
    setFormData((prev) => {
      const newImages = [...prev.images];
      [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
      return { ...prev, images: newImages };
    });
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      const fromEntry = newFiles.findIndex((e) => e.blobUrl === currentImages[fromIndex]);
      const toEntry = newFiles.findIndex((e) => e.blobUrl === currentImages[toIndex]);
      if (fromEntry !== -1 && toEntry !== -1) {
        [newFiles[fromEntry], newFiles[toEntry]] = [newFiles[toEntry], newFiles[fromEntry]];
      }
      return newFiles;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("location", `${formData.location} ${formData.detailAddress}`.trim());
    submitData.append("region", formData.region || "");
    submitData.append("price", formData.price);
    submitData.append("commission_rate", formData.commission_rate || "0");
    submitData.append("description", formData.description);
    submitData.append("pricing_unit", formData.pricing_unit);
    submitData.append("type", formData.type);
    submitData.append("size", formData.size);
    if (formData.recruitment_start) {
      submitData.append("recruitment_start", formData.recruitment_start);
    }
    if (formData.recruitment_end) {
      submitData.append("recruitment_end", formData.recruitment_end);
    }
    const periods = (formData.event_periods || []).filter((p2) => p2.start || p2.end);
    submitData.append("event_periods", JSON.stringify(periods));
    if (periods.length > 0) {
      if (periods[0].start) submitData.append("event_start", periods[0].start);
      if (periods[0].end) submitData.append("event_end", periods[0].end);
    }
    submitData.append("recruitment_closed", formData.recruitment_closed ? "1" : "0");
    submitData.append("max_sellers", formData.max_sellers || "0");
    submitData.append("avg_sales", formData.avg_sales || "");
    submitData.append("sales_unit", formData.sales_unit || "monthly");
    submitData.append("popular_categories", JSON.stringify(formData.popular_categories || []));
    submitData.append("target_customers", JSON.stringify(formData.target_customers || []));
    const existingImages = formData.images.filter((img) => typeof img === "string" && !img.startsWith("blob:"));
    existingImages.forEach((img) => submitData.append("existing_images[]", img));
    const blobOrder = formData.images.filter((img) => img.startsWith("blob:"));
    blobOrder.forEach((blobUrl) => {
      const entry = selectedFiles.find((e2) => e2.blobUrl === blobUrl);
      if (entry) submitData.append("images[]", entry.file);
    });
    const existingAttachments = (formData.attachments || []).filter((a2) => typeof a2 === "string");
    existingAttachments.forEach((a2) => submitData.append("existing_attachments[]", a2));
    attachmentFiles.forEach((f2) => submitData.append("attachments[]", f2));
    if (venue == null ? void 0 : venue.id) {
      submitData.append("id", venue.id);
    }
    await onSubmit(submitData);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold text-gray-900 dark:text-gray-100", children: venue ? "공간 정보 수정" : isDuplicateMode ? "공간 복제 등록" : "새 공간 등록" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: venue ? "등록된 공간 정보를 수정합니다" : isDuplicateMode ? "기존 공간을 복제하여 새로 등록합니다" : "새로운 공간을 등록하여 서비스해보세요" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "venue-form", onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 is-required", children: "공간 이름" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              required: true,
              name: "name",
              value: formData.name,
              onChange: handleFormChange,
              placeholder: "수원 팝업 스페이스 A",
              className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-gray-100"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "주소 *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  readOnly: true,
                  value: formData.location,
                  className: "flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed",
                  placeholder: "주소 검색 버튼을 클릭하세요"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsPostcodeOpen(true),
                  className: "px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all whitespace-nowrap",
                  children: "📍 검색"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "detailAddress",
                value: formData.detailAddress,
                onChange: handleFormChange,
                className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100",
                placeholder: "상세 주소 (예: 1층 101호)"
              }
            )
          ] }),
          isPostcodeOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 p-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsPostcodeOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              h,
              {
                onComplete: (data) => {
                  setFormData((prev) => ({
                    ...prev,
                    location: data.address,
                    region: data.sido || ""
                  }));
                  setIsPostcodeOpen(false);
                },
                style: { height: "400px" }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "공간 유형" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  name: "type",
                  value: ["popup", "gallery", "cafe", "showroom", "fleamarket"].includes(formData.type) ? formData.type : "other",
                  onChange: (e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, type: val === "other" ? "" : val }));
                  },
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all appearance-none font-medium text-gray-900 dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popup", children: "팝업스토어" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fleamarket", children: "플리마켓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gallery", children: "갤러리" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cafe", children: "카페" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "showroom", children: "쇼룸" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "기타 (직접 입력)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] }),
            !["popup", "gallery", "cafe", "showroom", "fleamarket"].includes(formData.type) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.type,
                onChange: (e) => setFormData((prev) => ({ ...prev, type: e.target.value })),
                placeholder: "유형 직접 입력",
                className: "mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "공간 크기" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  name: "size",
                  value: formData.size,
                  onChange: handleFormChange,
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all appearance-none font-medium text-gray-900 dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "small", children: "소형 (Small)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "중형 (Medium)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "large", children: "대형 (Large)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 16 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "가격" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  name: "pricing_unit",
                  value: formData.pricing_unit,
                  onChange: handleFormChange,
                  className: "w-1/3 px-2 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 outline-none font-medium text-sm text-gray-900 dark:text-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "daily", children: "일 단위" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "weekly", children: "주 단위" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: "월 단위" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    name: "price",
                    required: true,
                    min: "0",
                    value: formData.price,
                    onChange: handleFormChange,
                    placeholder: "0",
                    className: "w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100"
                  }
                )
              ] })
            ] }),
            formData.price === "0" || formData.price === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-emerald-600 font-medium", children: "💚 무료로 설정됩니다" }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "수수료 (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm", children: "%" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  name: "commission_rate",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: formData.commission_rate,
                  onChange: handleFormChange,
                  placeholder: "0",
                  className: "w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-gray-400", children: "매출 기반 수수료 퍼센트를 입력하세요" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-blue-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mb-3", children: "이 공간에서 인기 있는 카테고리를 선택하세요 (복수 선택 가능)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "모집 시작" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    name: "recruitment_start",
                    value: formData.recruitment_start,
                    onChange: handleFormChange,
                    className: "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "모집 마감" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    name: "recruitment_end",
                    value: formData.recruitment_end,
                    onChange: handleFormChange,
                    className: "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFormData((prev) => ({ ...prev, recruitment_closed: !prev.recruitment_closed })),
                className: `px-4 py-2 rounded-xl font-bold text-sm transition-all ${formData.recruitment_closed ? "bg-gray-700 text-white shadow-md" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"}`,
                children: formData.recruitment_closed ? "🔒 모집 완료" : "모집 진행 중"
              }
            ) }),
            formData.recruitment_end && !formData.recruitment_closed && (() => {
              const today = /* @__PURE__ */ new Date();
              today.setHours(0, 0, 0, 0);
              const dl = new Date(formData.recruitment_end);
              dl.setHours(0, 0, 0, 0);
              const diff = Math.ceil((dl - today) / (1e3 * 60 * 60 * 24));
              return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-2 text-xs font-bold ${diff <= 0 ? "text-red-500" : diff <= 3 ? "text-orange-500" : "text-blue-500"}`, children: diff < 0 ? "마감됨" : diff === 0 ? "오늘 마감!" : `D-${diff} (${diff}일 남음)` });
            })()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-purple-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-purple-800 dark:text-purple-300", children: "행사 기간 설정" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-purple-600 font-medium", children: "기간 " }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const n = Math.max(1, eventPeriodCount - 1);
                        setEventPeriodCount(n);
                        setFormData((prev) => ({
                          ...prev,
                          event_periods: prev.event_periods.slice(0, n)
                        }));
                      },
                      className: "px-2 py-1.5 text-purple-600 hover:bg-purple-50 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      max: "20",
                      value: eventPeriodCount,
                      onChange: (e) => {
                        const n = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                        setEventPeriodCount(n);
                        setFormData((prev) => {
                          const current = prev.event_periods || [];
                          const newPeriods = Array.from(
                            { length: n },
                            (_, i2) => current[i2] || { start: "", end: "" }
                          );
                          return { ...prev, event_periods: newPeriods };
                        });
                      },
                      className: "w-12 text-center py-1.5 text-sm font-bold text-purple-800 dark:text-purple-300 outline-none border-x border-purple-200 dark:border-purple-800 bg-transparent"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const n = Math.min(20, eventPeriodCount + 1);
                        setEventPeriodCount(n);
                        setFormData((prev) => {
                          const current = prev.event_periods || [];
                          return { ...prev, event_periods: [...current, { start: "", end: "" }] };
                        });
                      },
                      className: "px-2 py-1.5 text-purple-600 hover:bg-purple-50 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (formData.event_periods || []).map((period, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 border border-purple-100 dark:border-purple-900/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md", children: [
                  "기간 ",
                  idx + 1
                ] }),
                idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setFormData((prev) => ({
                        ...prev,
                        event_periods: prev.event_periods.filter((_, i2) => i2 !== idx)
                      }));
                    },
                    className: "ml-auto text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "시작일" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "date",
                      value: period.start || "",
                      onChange: (e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.event_periods];
                          updated[idx] = { ...updated[idx], start: val };
                          return { ...prev, event_periods: updated };
                        });
                      },
                      className: "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-500 mb-1", children: "종료일" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "date",
                      value: period.end || "",
                      onChange: (e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.event_periods];
                          updated[idx] = { ...updated[idx], end: val };
                          return { ...prev, event_periods: updated };
                        });
                      },
                      className: "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 rounded-xl outline-none transition-all font-medium text-gray-900 dark:text-gray-100"
                    }
                  )
                ] })
              ] })
            ] }, idx)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16, className: "text-emerald-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-emerald-800 dark:text-emerald-300", children: "모집 인원 설정" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                name: "max_sellers",
                value: formData.max_sellers,
                onChange: handleFormChange,
                placeholder: "0 (무제한)",
                className: "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 rounded-xl outline-none transition-all font-bold text-gray-800 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/10"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-gray-500", children: "이 공간에 입점할 수 있는 최대 셀러 수를 설정하세요. 0은 무제한입니다." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-amber-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-amber-800 dark:text-amber-300", children: "평균 매출 (선택)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                name: "avg_sales",
                value: formData.avg_sales,
                onChange: handleFormChange,
                placeholder: "예: 500만원, 약 50만원",
                className: "flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500 rounded-xl outline-none transition-all font-medium focus:ring-4 focus:ring-amber-500/10 text-gray-900 dark:text-gray-100"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden", children: [{ v: "daily", l: "일" }, { v: "weekly", l: "주" }, { v: "monthly", l: "월" }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setFormData((prev) => ({ ...prev, sales_unit: opt.v })),
                className: `px-3.5 py-3 text-sm font-bold transition-colors ${formData.sales_unit === opt.v ? "bg-amber-500 text-white" : "text-gray-500 hover:bg-amber-50"}`,
                children: opt.l
              },
              opt.v
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-gray-500", children: "이 공간에서 예상되는 평균 매출과 기준 단위를 선택하세요" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16, className: "text-teal-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-teal-800 dark:text-teal-300", children: "인기 카테고리 (선택)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            CATEGORY_OPTIONS.map((cat) => {
              const isSelected = (formData.popular_categories || []).includes(cat.value);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setFormData((prev) => {
                      const current = prev.popular_categories || [];
                      const updated = isSelected ? current.filter((c2) => c2 !== cat.value) : [...current, cat.value];
                      return { ...prev, popular_categories: updated };
                    });
                  },
                  className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isSelected ? "bg-teal-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-300"}`,
                  children: cat.label
                },
                cat.value
              );
            }),
            (formData.popular_categories || []).filter((c2) => !CATEGORY_OPTIONS.some((opt) => opt.value === c2)).map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setFormData((prev) => ({ ...prev, popular_categories: prev.popular_categories.filter((x) => x !== c2) })),
                className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-600 text-white shadow-sm flex items-center gap-1",
                children: [
                  c2,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                ]
              },
              c2
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: customCategory,
                onChange: (e) => setCustomCategory(e.target.value),
                placeholder: "기타 직접 입력 (쉼표로 여러 개 가능)",
                className: "flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-teal-500 rounded-lg outline-none text-xs font-medium text-gray-900 dark:text-gray-100",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const vals = customCategory.split(",").map((v) => v.trim()).filter((v) => v && !(formData.popular_categories || []).includes(v));
                    if (vals.length > 0) {
                      setFormData((prev) => ({ ...prev, popular_categories: [...prev.popular_categories || [], ...vals] }));
                      setCustomCategory("");
                    }
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  const vals = customCategory.split(",").map((v) => v.trim()).filter((v) => v && !(formData.popular_categories || []).includes(v));
                  if (vals.length > 0) {
                    setFormData((prev) => ({ ...prev, popular_categories: [...prev.popular_categories || [], ...vals] }));
                    setCustomCategory("");
                  }
                },
                className: "px-2.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50/50 dark:bg-orange-950/30 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13, className: "text-orange-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-orange-800 dark:text-orange-300", children: "주요 고객층 (선택, 복수 가능)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-2", children: [
            TARGET_CUSTOMER_OPTIONS.map((opt) => {
              const isSelected = (formData.target_customers || []).includes(opt.value);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setFormData((prev) => {
                      const current = prev.target_customers || [];
                      const updated = isSelected ? current.filter((c2) => c2 !== opt.value) : [...current, opt.value];
                      return { ...prev, target_customers: updated };
                    });
                  },
                  className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${isSelected ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300"}`,
                  children: opt.label
                },
                opt.value
              );
            }),
            (formData.target_customers || []).filter((c2) => !TARGET_CUSTOMER_OPTIONS.some((opt) => opt.value === c2)).map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setFormData((prev) => ({ ...prev, target_customers: prev.target_customers.filter((x) => x !== c2) })),
                className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-sm flex items-center gap-1",
                children: [
                  c2,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                ]
              },
              c2
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData._customCustomer || "",
                onChange: (e) => setFormData((prev) => ({ ...prev, _customCustomer: e.target.value })),
                placeholder: "기타 직접 입력 (쉼표로 여러 개: 시니어, 1인가구)",
                className: "flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-400 rounded-lg outline-none text-xs font-medium text-gray-900 dark:text-gray-100",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const vals = (formData._customCustomer || "").split(",").map((v) => v.trim()).filter((v) => v && !(formData.target_customers || []).includes(v));
                    if (vals.length > 0) {
                      setFormData((prev) => ({ ...prev, target_customers: [...prev.target_customers || [], ...vals], _customCustomer: "" }));
                    }
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  const vals = (formData._customCustomer || "").split(",").map((v) => v.trim()).filter((v) => v && !(formData.target_customers || []).includes(v));
                  if (vals.length > 0) {
                    setFormData((prev) => ({ ...prev, target_customers: [...prev.target_customers || [], ...vals], _customCustomer: "" }));
                  }
                },
                className: "px-2.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
              }
            )
          ] }),
          (formData.target_customers || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-orange-500 mt-2 font-medium", children: [
            (formData.target_customers || []).length,
            "개 선택됨"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "공간 소개" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              name: "description",
              value: formData.description,
              onChange: handleFormChange,
              rows: 5,
              placeholder: "공간의 매력 포인트와 특징을 자세히 적어주세요",
              className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl outline-none transition-all resize-none font-medium leading-relaxed text-gray-900 dark:text-gray-100"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: "📸 공간 이미지 갤러리" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mb-3", children: "첫 번째 사진이 대표 이미지로 사용됩니다. 드래그로 순서를 변경하세요." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 md:grid-cols-4 gap-3", children: [
            formData.images.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative group border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: "", className: "w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" }),
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10", children: "대표" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeImage(idx),
                    className: "p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors",
                    title: "삭제",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveImage(idx, -1),
                      disabled: idx === 0,
                      className: `p-1.5 rounded-lg transition-colors ${idx === 0 ? "bg-white/20 text-white/40 cursor-not-allowed" : "bg-white/80 hover:bg-white text-gray-700"}`,
                      title: "위로",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveImage(idx, 1),
                      disabled: idx === formData.images.length - 1,
                      className: `p-1.5 rounded-lg transition-colors ${idx === formData.images.length - 1 ? "bg-white/20 text-white/40 cursor-not-allowed" : "bg-white/80 hover:bg-white text-gray-700"}`,
                      title: "아래로",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                    }
                  )
                ] })
              ] })
            ] }, idx)),
            formData.images.length < 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                className: "aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all gap-2 cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 18 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "추가" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              multiple: true,
              accept: "image/*",
              ref: fileInputRef,
              onChange: handleFileSelect,
              className: "hidden"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: [
            "📎 첨부파일 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-normal", children: "(선택, 여러 파일 가능)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mb-3", children: "입점 신청서, 사업자등록증, 계약서 등 관련 서류를 첨부하세요 (PDF, DOC, HWP, 이미지)" }),
          ((formData.attachments || []).length > 0 || attachmentFiles.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-3", children: [
            (formData.attachments || []).map((att, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-indigo-500 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-700 flex-1 truncate", children: att.split("/").pop() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/${att}`, target: "_blank", rel: "noreferrer", className: "p-1 text-indigo-500 hover:text-indigo-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i2) => i2 !== idx) })), className: "p-1 text-red-400 hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }, `existing-${idx}`)),
            attachmentFiles.map((file, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl border border-indigo-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-indigo-500 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-indigo-700 flex-1 truncate", children: file.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-indigo-400", children: [
                (file.size / 1024).toFixed(0),
                "KB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAttachmentFiles((prev) => prev.filter((_, i2) => i2 !== idx)), className: "p-1 text-red-400 hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }, `new-${idx}`))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => {
                var _a;
                return (_a = attachmentInputRef.current) == null ? void 0 : _a.click();
              },
              className: "p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "파일 첨부하기" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              multiple: true,
              accept: ".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png,.gif,.webp",
              ref: attachmentInputRef,
              onChange: (e) => {
                const files = Array.from(e.target.files);
                setAttachmentFiles((prev) => [...prev, ...files]);
                e.target.value = "";
              },
              className: "hidden"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between sticky bottom-0 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: onDelete && venue && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onDelete();
            },
            className: "px-5 py-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 }),
              "삭제"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              children: "취소"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              form: "venue-form",
              className: "px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2",
              children: venue ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { size: 18 }),
                " 수정 완료"
              ] }) : isDuplicateMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
                " 복제 등록"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
                " 베뉴 등록"
              ] })
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  VenueModal as V
};
