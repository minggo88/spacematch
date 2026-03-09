import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, J as Monitor, ad as Plus, at as Target, G as Globe, az as Calendar, b3 as Link2, N as Eye, E as EyeOff, aH as PenLine, T as Trash2, a as X, L as Languages, aA as Image, b9 as Save, $ as ExternalLink, A as AlertTriangle, C as CheckCircle } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api/popups";
const TYPE_OPTIONS = [
  { value: "notice", labelKey: "popupsPage.typeNotice", color: "bg-blue-100 text-blue-700", icon: "📢" },
  { value: "ad", labelKey: "popupsPage.typeAd", color: "bg-amber-100 text-amber-700", icon: "📣" }
];
const TARGET_OPTIONS = [
  { value: "all", labelKey: "popupsPage.targetAll" },
  { value: "seller", labelKey: "popupsPage.targetSeller" },
  { value: "host", labelKey: "popupsPage.targetVendor" }
];
const COUNTRY_OPTIONS = [
  { code: "ko", label: "한국", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Việt Nam", flag: "🇻🇳" },
  { code: "ja", label: "日本", flag: "🇯🇵" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "ru", label: "Россия", flag: "🇷🇺" },
  { code: "uk", label: "Україна", flag: "🇺🇦" }
];
const LANG_TABS = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" }
];
const AdminPopups = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { t } = useTranslation("admin");
  const [popups, setPopups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingPopup, setEditingPopup] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    popup_type: "notice",
    title: "",
    content: "",
    click_url: "",
    target_role: "all",
    target_countries: "all",
    priority: 0,
    is_active: 1,
    start_date: "",
    end_date: ""
  });
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState(null);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [previewPopup, setPreviewPopup] = reactExports.useState(null);
  const [filterType, setFilterType] = reactExports.useState("");
  const [translations, setTranslations] = reactExports.useState({});
  const [activeLangTab, setActiveLangTab] = reactExports.useState("ko");
  const [translating, setTranslating] = reactExports.useState(false);
  const handleAutoTranslate = async (targetLang) => {
    var _a2;
    if (!form.title.trim() && !form.content.trim()) {
      showToast("한국어 제목 또는 내용을 먼저 입력해 주세요.", "error");
      return;
    }
    setTranslating(true);
    try {
      const texts = [form.title || "", form.content || ""].filter((t2) => t2.trim());
      const res = await fetch("/api/translate.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ texts, source: "ko", target: targetLang })
      });
      const data = await res.json();
      if (data.success && data.translations) {
        const translated = {};
        if (form.title.trim()) translated.title = data.translations[0] || "";
        if (form.content.trim()) {
          translated.content = data.translations[form.title.trim() ? 1 : 0] || "";
        }
        setTranslations((prev) => ({
          ...prev,
          [targetLang]: { ...prev[targetLang] || {}, ...translated }
        }));
        showToast(`${((_a2 = LANG_TABS.find((l) => l.code === targetLang)) == null ? void 0 : _a2.label) || targetLang} 번역 완료!`, "success");
      } else {
        showToast(data.message || "번역에 실패했습니다.", "error");
      }
    } catch (err) {
      console.error("Auto-translate error:", err);
      showToast("번역 중 오류가 발생했습니다.", "error");
    } finally {
      setTranslating(false);
    }
  };
  const handleTranslateAll = async () => {
    if (!form.title.trim() && !form.content.trim()) {
      showToast("한국어 제목 또는 내용을 먼저 입력해 주세요.", "error");
      return;
    }
    setTranslating(true);
    const nonKoLangs = LANG_TABS.filter((l) => l.code !== "ko");
    let successCount = 0;
    for (const lang of nonKoLangs) {
      try {
        const texts = [form.title || "", form.content || ""].filter((t2) => t2.trim());
        const res = await fetch("/api/translate.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ texts, source: "ko", target: lang.code })
        });
        const data = await res.json();
        if (data.success && data.translations) {
          const translated = {};
          if (form.title.trim()) translated.title = data.translations[0] || "";
          if (form.content.trim()) {
            translated.content = data.translations[form.title.trim() ? 1 : 0] || "";
          }
          setTranslations((prev) => ({
            ...prev,
            [lang.code]: { ...prev[lang.code] || {}, ...translated }
          }));
          successCount++;
        }
      } catch (err) {
        console.error(`Translate to ${lang.code} failed:`, err);
      }
    }
    showToast(`${successCount}/${nonKoLangs.length}개 언어 번역 완료!`, "success");
    setTranslating(false);
  };
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const fetchPopups = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/popups.php?admin=1`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setPopups(data.popups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);
  const resetForm = () => {
    setForm({ popup_type: "notice", title: "", content: "", click_url: "", target_role: "all", target_countries: "all", priority: 0, is_active: 1, start_date: "", end_date: "" });
    setImageFile(null);
    setImagePreview("");
    setEditingPopup(null);
    setTranslations({});
    setActiveLangTab("ko");
  };
  const openForm = (popup = null) => {
    if (popup) {
      setEditingPopup(popup);
      setForm({
        popup_type: popup.popup_type || "notice",
        title: popup.title || "",
        content: popup.content || "",
        click_url: popup.click_url || "",
        target_role: popup.target_role || "all",
        target_countries: popup.target_countries || "all",
        priority: popup.priority || 0,
        is_active: popup.is_active ? 1 : 0,
        start_date: popup.start_date || "",
        end_date: popup.end_date || ""
      });
      setImagePreview(popup.image_url || "");
      let trans = popup.translations;
      if (typeof trans === "string") {
        try {
          trans = JSON.parse(trans);
        } catch {
          trans = {};
        }
      }
      setTranslations(trans || {});
      setActiveLangTab("ko");
    } else {
      resetForm();
    }
    setShowForm(true);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    var _a2, _b2;
    e.preventDefault();
    const hasTitle = form.title.trim() || Object.values(translations).some((tr) => {
      var _a3;
      return (_a3 = tr == null ? void 0 : tr.title) == null ? void 0 : _a3.trim();
    });
    if (!hasTitle) {
      showToast(t("popupsPage.enterTitle"), "error");
      return;
    }
    let submitForm = { ...form };
    if (!submitForm.title.trim()) {
      const fallbackTitle = ((_a2 = Object.values(translations).find((tr) => {
        var _a3;
        return (_a3 = tr == null ? void 0 : tr.title) == null ? void 0 : _a3.trim();
      })) == null ? void 0 : _a2.title) || "";
      submitForm.title = fallbackTitle;
    }
    if (!submitForm.content.trim()) {
      const fallbackContent = ((_b2 = Object.values(translations).find((tr) => {
        var _a3;
        return (_a3 = tr == null ? void 0 : tr.content) == null ? void 0 : _a3.trim();
      })) == null ? void 0 : _b2.content) || "";
      submitForm.content = fallbackContent;
    }
    setSubmitting(true);
    try {
      if (editingPopup) {
        const body = { id: editingPopup.id, ...submitForm, translations: JSON.stringify(translations) };
        const res = await fetch(`${API_BASE}/popups.php`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
          showToast(t("popupsPage.popupEdited"));
          fetchPopups();
          setShowForm(false);
          resetForm();
        } else showToast(data.message || t("popupsPage.editFailed"), "error");
      } else {
        const fd = new FormData();
        Object.entries(submitForm).forEach(([k, v]) => fd.append(k, v));
        if (imageFile) fd.append("image", imageFile);
        fd.append("translations", JSON.stringify(translations));
        const res = await fetch(`${API_BASE}/popups.php`, {
          method: "POST",
          credentials: "include",
          body: fd
        });
        const data = await res.json();
        if (data.success) {
          showToast(t("popupsPage.popupCreated"));
          fetchPopups();
          setShowForm(false);
          resetForm();
        } else showToast(data.message || t("popupsPage.createFailed"), "error");
      }
    } catch (err) {
      showToast(t("popupsPage.errorOccurred"), "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = (popup) => {
    setConfirmModal({
      title: t("popupsPage.deletePopup"),
      message: t("popupsPage.deleteConfirm", { title: popup.title }),
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await fetch(`${API_BASE}/popups.php`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: popup.id })
          });
          const data = await res.json();
          if (data.success) {
            showToast(t("popupsPage.popupDeleted"));
            fetchPopups();
          } else showToast(t("popupsPage.deleteFailed"), "error");
        } catch (err) {
          showToast(t("popupsPage.errorOccurred"), "error");
        }
      }
    });
  };
  const handleToggle = async (popup) => {
    try {
      const res = await fetch(`${API_BASE}/popups.php`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: popup.id, is_active: popup.is_active ? 0 : 1 })
      });
      const data = await res.json();
      if (data.success) {
        setPopups((prev) => prev.map((p) => p.id === popup.id ? { ...p, is_active: popup.is_active ? 0 : 1 } : p));
        showToast(popup.is_active ? t("popupsPage.popupDeactivated") : t("popupsPage.popupActivated"));
      }
    } catch (err) {
      showToast(t("popupsPage.errorOccurred"), "error");
    }
  };
  const getTypeInfo = (type) => {
    const opt = TYPE_OPTIONS.find((t2) => t2.value === type) || TYPE_OPTIONS[0];
    return { ...opt, label: t(`popupsPage.${type === "notice" ? "typeNotice" : "typeAd"}`) };
  };
  const filtered = filterType ? popups.filter((p) => p.popup_type === filterType) : popups;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-6 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 28 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold", children: t("popupsPage.title") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm", children: t("popupsPage.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => openForm(),
            className: "flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-xl font-bold text-sm hover:bg-white/30 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              t("popupsPage.addPopup")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/15 px-3 py-1 rounded-full", children: t("popupsPage.totalCount", { count: popups.length }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-green-400/20 px-3 py-1 rounded-full", children: t("popupsPage.activeCount", { count: popups.filter((p) => parseInt(p.is_active)).length }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilterType(""),
          className: `px-4 py-2 rounded-xl text-xs font-bold border transition-all ${!filterType ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`,
          children: t("popupsPage.filterAll")
        }
      ),
      TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setFilterType(opt.value),
          className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterType === opt.value ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.icon }),
            t(opt.labelKey)
          ]
        },
        opt.value
      ))
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "mx-auto text-gray-300 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium", children: t("popupsPage.noPopups") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1", children: t("popupsPage.noPopupsDesc") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map((popup) => {
      var _a2;
      const typeInfo = getTypeInfo(popup.popup_type);
      const isActive = parseInt(popup.is_active);
      const isExpired = popup.end_date && new Date(popup.end_date) < /* @__PURE__ */ new Date();
      const targetLabel = (_a2 = TARGET_OPTIONS.find((t2) => t2.value === popup.target_role)) == null ? void 0 : _a2.labelKey;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${!isActive ? "border-gray-200 opacity-60" : isExpired ? "border-orange-200" : "border-gray-100"}`,
          children: [
            popup.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-32 bg-gray-50 relative overflow-hidden cursor-pointer", onClick: () => setPreviewPopup(popup), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: popup.image_url, alt: "", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${typeInfo.color}`, children: [
                typeInfo.icon,
                " ",
                typeInfo.label
              ] }) }),
              !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-white/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-500 bg-white/80 px-3 py-1 rounded-full", children: t("popupsPage.inactive") }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                !popup.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${typeInfo.color}`, children: [
                  typeInfo.icon,
                  " ",
                  typeInfo.label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 text-sm truncate", children: popup.title }),
                popup.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1 line-clamp-2", children: popup.content })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mt-3 text-[10px] text-gray-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 9 }),
                  " ",
                  t(targetLabel || "popupsPage.targetAll")
                ] }),
                popup.target_countries && popup.target_countries !== "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 9 }),
                  popup.target_countries.split(",").map((c) => {
                    var _a3;
                    return ((_a3 = COUNTRY_OPTIONS.find((co) => co.code === c.trim())) == null ? void 0 : _a3.flag) || c;
                  }).join(" ")
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 9 }),
                  " ",
                  t("popupsPage.allCountries", "전체 국가")
                ] }),
                popup.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 9 }),
                  " ",
                  popup.start_date,
                  " ~ ",
                  popup.end_date || t("popupsPage.noExpiry")
                ] }),
                popup.click_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 9 }),
                  " ",
                  t("popupsPage.link")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gray-50 px-2 py-0.5 rounded-full", children: t("popupsPage.priority", { value: popup.priority }) }),
                isExpired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-500 font-bold", children: t("popupsPage.periodExpired") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 pt-3 border-t border-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleToggle(popup),
                    className: `flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`,
                    children: [
                      isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 12 }),
                      isActive ? t("popupsPage.activeLabel") : t("popupsPage.inactiveLabel")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setPreviewPopup(popup),
                    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 12 }),
                      " ",
                      t("popupsPage.preview")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => openForm(popup),
                    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 12 }),
                      " ",
                      t("popupsPage.edit")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleDelete(popup),
                    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-all ml-auto",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 }),
                      " ",
                      t("popupsPage.delete")
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        popup.id
      );
    }) }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", onClick: () => {
      setShowForm(false);
      resetForm();
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [
          editingPopup ? /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          editingPopup ? t("popupsPage.editPopup") : t("popupsPage.addNewPopup")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowForm(false);
          resetForm();
        }, className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-2", children: t("popupsPage.popupType") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setForm((f) => ({ ...f, popup_type: opt.value })),
              className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${form.popup_type === opt.value ? opt.value === "notice" ? "bg-blue-500 text-white border-blue-500" : "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`,
              children: [
                opt.icon,
                " ",
                t(opt.labelKey)
              ]
            },
            opt.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14, className: "text-gray-400 flex-shrink-0 ml-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveLangTab("all"),
                className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${activeLangTab === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-200/60"}`,
                children: [
                  "🌐 ",
                  t("popupsPage.allLangs") || "전체"
                ]
              }
            ),
            LANG_TABS.map((lang) => {
              var _a2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveLangTab(lang.code),
                  className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${activeLangTab === lang.code ? "bg-indigo-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-200/60"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang.flag }),
                    " ",
                    lang.label,
                    lang.code !== "ko" && ((_a2 = translations[lang.code]) == null ? void 0 : _a2.title) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-green-400 rounded-full" })
                  ]
                },
                lang.code
              );
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: activeLangTab === "all" ? (
            /* ── 전체 언어 통합 뷰 ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-indigo-50/50 rounded-xl border border-indigo-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "🇰🇷" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-indigo-700", children: [
                    t("popupsPage.titleLabel"),
                    " (한국어 · 원문)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: form.title,
                    onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                    placeholder: t("popupsPage.titlePlaceholder"),
                    className: "w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none mb-2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: form.content,
                    onChange: (e) => setForm((f) => ({ ...f, content: e.target.value })),
                    placeholder: t("popupsPage.contentPlaceholder"),
                    rows: 2,
                    className: "w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none resize-none"
                  }
                )
              ] }),
              (form.title.trim() || form.content.trim()) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleTranslateAll,
                  disabled: translating,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-md",
                  children: [
                    translating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 16 }),
                    translating ? t("popupsPage.translatingAll") || "번역 중..." : t("popupsPage.translateAll") || "🌐 전체 언어 자동 번역"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: LANG_TABS.filter((l) => l.code !== "ko").map((lang) => {
                var _a2, _b2;
                const hasTitle = !!((_a2 = translations[lang.code]) == null ? void 0 : _a2.title);
                const hasContent = !!((_b2 = translations[lang.code]) == null ? void 0 : _b2.content);
                const completed = hasTitle || hasContent;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl border transition-colors ${completed ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/30"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: lang.flag }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700", children: lang.label }),
                      completed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-bold", children: [
                        "✓ ",
                        t("popupsPage.translated") || "번역됨"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-bold", children: t("popupsPage.notTranslated") || "미번역" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleAutoTranslate(lang.code),
                          disabled: translating || !form.title.trim() && !form.content.trim(),
                          className: "px-2 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-40",
                          children: t("popupsPage.autoTranslateShort") || "번역"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setActiveLangTab(lang.code),
                          className: "px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors",
                          children: t("popupsPage.editLabel") || "편집"
                        }
                      )
                    ] })
                  ] }),
                  completed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 space-y-0.5", children: [
                    hasTitle && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
                        t("popupsPage.titleLabel"),
                        ":"
                      ] }),
                      " ",
                      translations[lang.code].title
                    ] }),
                    hasContent && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
                        t("popupsPage.contentLabel"),
                        ":"
                      ] }),
                      " ",
                      translations[lang.code].content
                    ] })
                  ] })
                ] }, lang.code);
              }) })
            ] })
          ) : (
            /* ── 개별 언어 편집 뷰 (기존) ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: [
                  t("popupsPage.titleLabel"),
                  " ",
                  activeLangTab !== "ko" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-500", children: [
                    "(",
                    (_a = LANG_TABS.find((l) => l.code === activeLangTab)) == null ? void 0 : _a.label,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: activeLangTab === "ko" ? form.title : ((_b = translations[activeLangTab]) == null ? void 0 : _b.title) || "",
                    onChange: (e) => {
                      if (activeLangTab === "ko") {
                        setForm((f) => ({ ...f, title: e.target.value }));
                      } else {
                        setTranslations((prev) => ({
                          ...prev,
                          [activeLangTab]: { ...prev[activeLangTab] || {}, title: e.target.value }
                        }));
                      }
                    },
                    placeholder: activeLangTab === "ko" ? t("popupsPage.titlePlaceholder") : `${(_c = LANG_TABS.find((l) => l.code === activeLangTab)) == null ? void 0 : _c.label} title`,
                    className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: [
                  t("popupsPage.contentLabel"),
                  " ",
                  activeLangTab !== "ko" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-500", children: [
                    "(",
                    (_d = LANG_TABS.find((l) => l.code === activeLangTab)) == null ? void 0 : _d.label,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: activeLangTab === "ko" ? form.content : ((_e = translations[activeLangTab]) == null ? void 0 : _e.content) || "",
                    onChange: (e) => {
                      if (activeLangTab === "ko") {
                        setForm((f) => ({ ...f, content: e.target.value }));
                      } else {
                        setTranslations((prev) => ({
                          ...prev,
                          [activeLangTab]: { ...prev[activeLangTab] || {}, content: e.target.value }
                        }));
                      }
                    },
                    placeholder: activeLangTab === "ko" ? t("popupsPage.contentPlaceholder") : `${(_f = LANG_TABS.find((l) => l.code === activeLangTab)) == null ? void 0 : _f.label} content`,
                    rows: 3,
                    className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none resize-none"
                  }
                )
              ] }),
              activeLangTab !== "ko" && !((_g = translations[activeLangTab]) == null ? void 0 : _g.title) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-gray-400 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 11 }),
                " 번역을 입력하지 않으면 한국어(기본)가 표시됩니다."
              ] }),
              activeLangTab !== "ko" && (form.title.trim() || form.content.trim()) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleAutoTranslate(activeLangTab),
                  disabled: translating,
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-all disabled:opacity-50",
                  children: [
                    translating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 12 }),
                    "한국어 → ",
                    (_h = LANG_TABS.find((l) => l.code === activeLangTab)) == null ? void 0 : _h.label,
                    " 자동 번역"
                  ]
                }
              ),
              activeLangTab === "ko" && (form.title.trim() || form.content.trim()) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleTranslateAll,
                  disabled: translating,
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:from-indigo-100 hover:to-purple-100 transition-all disabled:opacity-50",
                  children: [
                    translating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 12 }),
                    "🌐 전체 언어 자동 번역"
                  ]
                }
              )
            ] })
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("popupsPage.imageLabel") }),
          imagePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 rounded-xl overflow-hidden border border-gray-200 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imagePreview, alt: "", className: "w-full h-40 object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setImageFile(null);
                  setImagePreview("");
                },
                className: "absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
              }
            )
          ] }),
          !editingPopup && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 font-medium", children: t("popupsPage.imageUpload") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "hidden" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("popupsPage.clickUrl") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: form.click_url,
              onChange: (e) => setForm((f) => ({ ...f, click_url: e.target.value })),
              placeholder: "https://example.com",
              className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("popupsPage.targetLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: form.target_role,
                onChange: (e) => setForm((f) => ({ ...f, target_role: e.target.value })),
                className: "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none",
                children: TARGET_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: t(opt.labelKey) }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-1", children: t("popupsPage.priorityLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                value: form.priority,
                onChange: (e) => setForm((f) => ({ ...f, priority: parseInt(e.target.value) || 0 })),
                className: "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-bold text-gray-500 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12, className: "inline mr-1" }),
            t("popupsPage.targetCountries", "대상 국가")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setForm((f) => ({ ...f, target_countries: "all" })),
                className: `flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${form.target_countries === "all" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`,
                children: [
                  "🌍 ",
                  t("popupsPage.allCountries", "전체")
                ]
              }
            ),
            COUNTRY_OPTIONS.map((c) => {
              const selected = form.target_countries !== "all" && form.target_countries.split(",").includes(c.code);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (form.target_countries === "all") {
                      setForm((f) => ({ ...f, target_countries: c.code }));
                    } else {
                      const codes = form.target_countries.split(",").filter(Boolean);
                      if (codes.includes(c.code)) {
                        const next = codes.filter((x) => x !== c.code);
                        setForm((f) => ({ ...f, target_countries: next.length > 0 ? next.join(",") : "all" }));
                      } else {
                        setForm((f) => ({ ...f, target_countries: [...codes, c.code].join(",") }));
                      }
                    }
                  },
                  className: `flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${selected ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`,
                  children: [
                    c.flag,
                    " ",
                    c.label
                  ]
                },
                c.code
              );
            })
          ] }),
          form.target_countries !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-indigo-500 mt-1.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 10 }),
            t("popupsPage.countryNote", "선택한 국가의 사용자에게만 팝업이 표시됩니다.")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500", children: t("popupsPage.dateRange") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: [7, 14, 30, 60, 90].map((days) => {
              const fmt = (d) => d.toISOString().split("T")[0];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const start = /* @__PURE__ */ new Date();
                    const end = /* @__PURE__ */ new Date();
                    end.setDate(end.getDate() + days);
                    setForm((f) => ({ ...f, start_date: fmt(start), end_date: fmt(end) }));
                  },
                  className: "px-2.5 py-1 rounded-lg text-[11px] font-bold border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all",
                  children: [
                    days,
                    t("popupsPage.daysLabel", { days: "" }).replace(/\d+/g, "").trim()
                  ]
                },
                days
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-medium text-gray-400 mb-1", children: t("popupsPage.startDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: form.start_date,
                  onChange: (e) => setForm((f) => ({ ...f, start_date: e.target.value })),
                  className: "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-medium text-gray-400 mb-1", children: t("popupsPage.endDate") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: form.end_date,
                  onChange: (e) => setForm((f) => ({ ...f, end_date: e.target.value })),
                  className: "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600", children: t("popupsPage.activeStatus") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setForm((f) => ({ ...f, is_active: f.is_active ? 0 : 1 })),
              className: `relative w-11 h-6 rounded-full transition-all duration-300 ${form.is_active ? "bg-green-400" : "bg-gray-300"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300",
                  style: { left: form.is_active ? "1.25rem" : "0.125rem" }
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowForm(false);
                resetForm();
              },
              className: "px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm",
              children: t("popupsPage.cancelBtn")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              disabled: submitting,
              className: "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                submitting ? t("popupsPage.saving") : editingPopup ? t("popupsPage.editSubmit") : t("popupsPage.createSubmit")
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    previewPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4", onClick: () => setPreviewPopup(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden",
        onClick: (e) => e.stopPropagation(),
        style: { animation: "popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" },
        children: [
          previewPopup.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: previewPopup.image_url, alt: "", className: "w-full max-h-72 object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${getTypeInfo(previewPopup.popup_type).color}`, children: [
              getTypeInfo(previewPopup.popup_type).icon,
              " ",
              getTypeInfo(previewPopup.popup_type).label
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-2", children: previewPopup.title }),
            previewPopup.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 whitespace-pre-wrap mb-4", children: previewPopup.content }),
            previewPopup.click_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: previewPopup.click_url,
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors mb-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
                  " ",
                  t("popupsPage.viewDetails")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-3 border-t border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setPreviewPopup(null),
                  className: "flex-1 py-2.5 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50",
                  children: t("popupsPage.closeBtn")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setPreviewPopup(null),
                  className: "flex-1 py-2.5 text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-50",
                  children: t("popupsPage.dontShowToday")
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    confirmModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 24, className: "text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 mb-2", children: confirmModal.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-5", children: confirmModal.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setConfirmModal(null),
            className: "flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50",
            children: t("popupsPage.cancelLabel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: confirmModal.onConfirm,
            className: "flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600",
            children: t("popupsPage.deleteLabel")
          }
        )
      ] })
    ] }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 ${toast.type === "error" ? "bg-red-500 text-white" : "bg-gray-900 text-white"}`,
        style: { animation: "popupScale 0.3s ease" },
        children: [
          toast.type === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
          toast.message
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes popupScale {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            ` })
  ] });
};
export {
  AdminPopups as default
};
