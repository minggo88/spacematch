import { a as useAuth, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, q as Building, C as CheckCircle, af as AlertCircle, bp as Camera, ag as User, aa as Mail, ah as Phone, F as FileText, aO as Briefcase, ap as MapPin, G as Globe, W as Package, b9 as Save } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const VendorProfile = () => {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation("common");
  const fileInputRef = reactExports.useRef(null);
  const [toast, setToast] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    business_no: "",
    company_name: "",
    description: "",
    address: "",
    website: "",
    categories: ""
  });
  const [passwords, setPasswords] = reactExports.useState({ current: "", new_password: "", confirm: "" });
  const [showPasswordSection, setShowPasswordSection] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        business_no: user.business_no || "",
        company_name: user.company_name || "",
        description: user.description || "",
        address: user.address || "",
        website: user.website || "",
        categories: user.categories || ""
      });
    }
  }, [user]);
  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("이미지 크기는 5MB 이하여야 합니다.", "error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_image", file);
      const res = await fetch(`${API_BASE}/users/upload_profile_image.php`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        if (refreshUser) refreshUser();
        showToast("프로필 이미지가 업데이트되었습니다.");
      } else {
        showToast(data.message || "업로드 실패", "error");
      }
    } catch (e2) {
      showToast("이미지 업로드에 실패했습니다.", "error");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users/update_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showToast("프로필이 저장되었습니다.");
        if (refreshUser) refreshUser();
      } else {
        showToast(data.message || "저장 실패", "error");
      }
    } catch (e2) {
      showToast("프로필 저장에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new_password) {
      showToast("현재 비밀번호와 새 비밀번호를 입력해주세요.", "error");
      return;
    }
    if (passwords.new_password !== passwords.confirm) {
      showToast("새 비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    if (passwords.new_password.length < 6) {
      showToast("비밀번호는 6자 이상이어야 합니다.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users/change_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new_password })
      });
      const data = await res.json();
      if (data.success) {
        showToast("비밀번호가 변경되었습니다.");
        setPasswords({ current: "", new_password: "", confirm: "" });
        setShowPasswordSection(false);
      } else {
        showToast(data.message || "비밀번호 변경 실패", "error");
      }
    } catch (e) {
      showToast("비밀번호 변경에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };
  const completionItems = [
    { label: "이름", done: !!form.name },
    { label: "이메일", done: !!form.email },
    { label: "전화번호", done: !!form.phone },
    { label: "사업자번호", done: !!form.business_no },
    { label: "회사명", done: !!form.company_name },
    { label: "소개", done: !!form.description }
  ];
  const completionPercent = Math.round(completionItems.filter((i) => i.done).length / completionItems.length * 100);
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "text-teal-600 dark:text-teal-400", size: 28 }),
          "벤더 프로필 관리"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "회사 정보와 계정 설정을 관리합니다" })
      ] }),
      completionPercent < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-700/50 rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-teal-800 dark:text-teal-300", children: [
          "프로필 완성도 ",
          completionPercent,
          "%"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-teal-200/50 dark:bg-teal-800/30 rounded-full h-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500", style: { width: `${completionPercent}%` } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: completionItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${item.done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"}`, children: [
          item.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 10 }),
          item.label
        ] }, item.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center overflow-hidden shadow-lg", children: user.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.profile_image, alt: user.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "text-white", size: 40 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              disabled: uploading,
              className: "absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-lg text-xs font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 10 }),
            " 벤더"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, className: "text-indigo-500" }),
            " 기본 정보"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            { name: "name", label: "이름", icon: User, type: "text" },
            { name: "email", label: "이메일", icon: Mail, type: "email", disabled: true },
            { name: "phone", label: "전화번호", icon: Phone, type: "tel" },
            { name: "business_no", label: "사업자등록번호", icon: FileText, type: "text" }
          ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: field.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(field.icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: field.type,
                  name: field.name,
                  value: form[field.name],
                  onChange: handleChange,
                  disabled: field.disabled,
                  className: `w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100 ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`
                }
              )
            ] })
          ] }, field.name)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 16, className: "text-teal-500" }),
            " 회사 정보"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: "회사명" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    name: "company_name",
                    value: form.company_name,
                    onChange: handleChange,
                    placeholder: "회사명을 입력하세요",
                    className: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: "회사 소개" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  name: "description",
                  value: form.description,
                  onChange: handleChange,
                  rows: 4,
                  placeholder: "회사를 소개해 주세요 (유통 분야, 취급 품목 등)",
                  className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100 resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: "주소" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    name: "address",
                    value: form.address,
                    onChange: handleChange,
                    placeholder: "사무실 주소",
                    className: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: "웹사이트" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "url",
                      name: "website",
                      value: form.website,
                      onChange: handleChange,
                      placeholder: "https://",
                      className: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block", children: "취급 품목" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      name: "categories",
                      value: form.categories,
                      onChange: handleChange,
                      placeholder: "예: 화장품, 건강식품",
                      className: "w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "submit",
            disabled: saving,
            className: "w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-200 dark:shadow-teal-900/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
              saving ? "저장 중..." : "프로필 저장"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowPasswordSection(!showPasswordSection),
            className: "w-full flex items-center justify-between text-sm font-bold text-gray-700 dark:text-gray-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒 비밀번호 변경" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: showPasswordSection ? "접기" : "펼치기" })
            ]
          }
        ),
        showPasswordSection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "현재 비밀번호",
              value: passwords.current,
              onChange: (e) => setPasswords((p) => ({ ...p, current: e.target.value })),
              className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "새 비밀번호 (6자 이상)",
              value: passwords.new_password,
              onChange: (e) => setPasswords((p) => ({ ...p, new_password: e.target.value })),
              className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "새 비밀번호 확인",
              value: passwords.confirm,
              onChange: (e) => setPasswords((p) => ({ ...p, confirm: e.target.value })),
              className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium dark:text-gray-100"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handlePasswordChange,
              disabled: saving,
              className: "w-full py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-colors",
              children: "비밀번호 변경"
            }
          )
        ] })
      ] })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })
  ] });
};
export {
  VendorProfile as default
};
