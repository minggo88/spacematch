import { b as useNavigate, a as useAuth, j as jsxRuntimeExports, L as Link, q as isRequiredAgreed, h as KeywordSelector, r as TermsAgreement, v as validateSignupForm, f as formatBusinessNumber, t as formatPhone, w as validateEmail, x as validatePassword, y as validatePhone, z as validateBusinessNumber, B as validateBusinessName, D as validateRealName } from "./index-BM1FR1Lq.js";
import { r as reactExports, ae as React, W as Package, af as AlertCircle, ag as User, q as Building, ah as Phone, aa as Mail, a9 as CheckCircle2, ai as Loader2, ab as Lock, G as Globe, m as Home } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const SignupVendor = () => {
  useNavigate();
  const { signup, sendVerification, verifyEmail } = useAuth();
  const { t } = useTranslation("auth");
  const [formData, setFormData] = reactExports.useState({
    email: "",
    password: "",
    realName: "",
    name: "",
    nameEn: "",
    businessNumber: "",
    phone: "",
    country: "ko",
    role: "vendor",
    keywords: [],
    description: ""
  });
  const [error, setError] = reactExports.useState("");
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [pendingApproval, setPendingApproval] = reactExports.useState(false);
  const [agreements, setAgreements] = reactExports.useState({ terms: false, privacy: false, marketing: false });
  const [emailVerified, setEmailVerified] = reactExports.useState(false);
  const [verificationCode, setVerificationCode] = reactExports.useState("");
  const [verificationSent, setVerificationSent] = reactExports.useState(false);
  const [verificationLoading, setVerificationLoading] = reactExports.useState(false);
  const [verificationError, setVerificationError] = reactExports.useState("");
  const [cooldown, setCooldown] = reactExports.useState(0);
  const [expiresIn, setExpiresIn] = reactExports.useState(0);
  const validateField = (name, value) => {
    switch (name) {
      case "realName":
        return validateRealName(value);
      case "name":
        return validateBusinessName(value);
      case "businessNumber":
        return validateBusinessNumber(value);
      case "phone":
        return validatePhone(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return null;
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "businessNumber") value = formatBusinessNumber(value);
    if (name === "phone") value = formatPhone(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };
  const handleSendVerification = async () => {
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      setFieldErrors((prev) => ({ ...prev, email: emailErr }));
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }
    setVerificationLoading(true);
    setVerificationError("");
    const result = await sendVerification(formData.email, formData.country);
    setVerificationLoading(false);
    if (result.success) {
      setVerificationSent(true);
      setCooldown(60);
      setExpiresIn(result.expires_in || 600);
    } else {
      setVerificationError(result.message);
      if (result.cooldown) setCooldown(result.cooldown);
    }
  };
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;
    setVerificationLoading(true);
    setVerificationError("");
    const result = await verifyEmail(formData.email, verificationCode);
    setVerificationLoading(false);
    if (result.success && result.verified) setEmailVerified(true);
    else setVerificationError(result.message);
  };
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t2 = setTimeout(() => setCooldown((c) => c - 1), 1e3);
    return () => clearTimeout(t2);
  }, [cooldown]);
  React.useEffect(() => {
    if (expiresIn <= 0 || emailVerified) return;
    const t2 = setTimeout(() => setExpiresIn((e) => e - 1), 1e3);
    return () => clearTimeout(t2);
  }, [expiresIn, emailVerified]);
  React.useEffect(() => {
    setEmailVerified(false);
    setVerificationSent(false);
    setVerificationCode("");
    setVerificationError("");
  }, [formData.email]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignupForm(formData, "vendor");
    setFieldErrors(errors);
    setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });
    if (Object.keys(errors).length > 0) {
      setError(t("formValidationError"));
      return;
    }
    if (!isRequiredAgreed(agreements, "vendor")) {
      setError(t("termsRequired"));
      return;
    }
    setError("");
    signup({ ...formData, marketing_agreed: agreements.marketing }).then((result) => {
      if (result.success) {
        setPendingApproval(true);
      } else {
        setError(result.message);
      }
    });
  };
  if (pendingApproval) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg p-8 bg-white rounded-xl shadow-lg text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "text-teal-600", size: 36 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-3", children: t("signupDone") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-2", children: t("vendorSignupDone", "벤더 회원가입이 완료되었습니다.") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-teal-800 font-semibold text-sm", children: [
          "⏳ ",
          t("pendingApproval")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-teal-700 text-sm mt-1", children: [
          t("approvalMessage"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          t("approvalNotify")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          className: "inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md",
          children: t("goToLoginPage")
        }
      )
    ] }) });
  }
  const FieldError = ({ name }) => {
    if (!touched[name] || !fieldErrors[name]) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 mt-1 text-xs text-red-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 12 }),
      fieldErrors[name]
    ] });
  };
  const inputClass = (name) => `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${touched[name] && fieldErrors[name] ? "border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800 bg-red-50/30 dark:bg-red-900/20" : touched[name] && !fieldErrors[name] && formData[name] ? "border-green-400 focus:ring-green-200 dark:border-green-500 dark:focus:ring-green-800" : "border-gray-200 dark:border-gray-600 focus:ring-primary"}`;
  const hasFormErrors = Object.values(fieldErrors).some((e) => e);
  const isValid = !hasFormErrors && isRequiredAgreed(agreements, "vendor") && emailVerified;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900 py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-primary", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2", children: t("vendorSubtitle", "벤더(유통/납품) 회원가입") })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-teal-700 dark:text-teal-300 text-xs font-medium", children: [
      "ℹ️ ",
      t("vendorApprovalNotice", "벤더 계정은 관리자 승인 후 이용할 수 있습니다. 승인 완료 시 이메일로 안내드립니다.")
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
            t("realName"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "realName",
                required: true,
                value: formData.realName,
                onChange: handleChange,
                onBlur: handleBlur,
                className: inputClass("realName"),
                placeholder: t("namePlaceholder")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "realName" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
            t("vendorCompanyName", "회사명(상호)"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "name",
                required: true,
                value: formData.name,
                onChange: handleChange,
                onBlur: handleBlur,
                className: inputClass("name"),
                placeholder: t("vendorCompanyPlaceholder", "유통 회사명을 입력하세요")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "name" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
            t("businessNumber"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "businessNumber",
                required: true,
                value: formData.businessNumber,
                onChange: handleChange,
                onBlur: handleBlur,
                className: inputClass("businessNumber"),
                placeholder: "000-00-00000",
                maxLength: 12
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "businessNumber" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
            t("phone"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                name: "phone",
                required: true,
                value: formData.phone,
                onChange: handleChange,
                onBlur: handleBlur,
                className: inputClass("phone"),
                placeholder: "010-0000-0000",
                maxLength: 13
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "phone" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          t("email"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                name: "email",
                required: true,
                value: formData.email,
                onChange: handleChange,
                onBlur: handleBlur,
                disabled: emailVerified,
                className: `${inputClass("email")} ${emailVerified ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600" : ""}`,
                placeholder: "vendor@example.com"
              }
            ),
            emailVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { className: "absolute right-3 top-1/2 -translate-y-1/2 text-green-500", size: 18 })
          ] }),
          !emailVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleSendVerification,
              disabled: verificationLoading || cooldown > 0 || !formData.email,
              className: "px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex items-center gap-1.5",
              children: [
                verificationLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin" }) : null,
                cooldown > 0 ? `${cooldown}s` : verificationSent ? t("resendCode", "재발송") : t("sendVerification", "인증")
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "email" }),
        emailVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { size: 12 }),
          t("emailVerified", "이메일 인증 완료")
        ] })
      ] }),
      verificationSent && !emailVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-indigo-700 dark:text-indigo-300 font-medium", children: [
          "📧 ",
          t("verificationSentMsg", "인증 코드가 이메일로 발송되었습니다."),
          expiresIn > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs ml-2 text-indigo-400", children: [
            "(",
            Math.floor(expiresIn / 60),
            ":",
            String(expiresIn % 60).padStart(2, "0"),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: verificationCode,
              onChange: (e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
              className: "flex-1 px-4 py-3 border border-indigo-200 dark:border-indigo-600 rounded-lg text-center text-lg font-mono tracking-[0.3em] bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-300 outline-none",
              placeholder: "000000",
              maxLength: 6
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleVerifyCode,
              disabled: verificationCode.length !== 6 || verificationLoading,
              className: "px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5",
              children: [
                verificationLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin" }) : null,
                t("verify", "확인")
              ]
            }
          )
        ] }),
        verificationError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 12 }),
          verificationError
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          t("password"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              name: "password",
              required: true,
              value: formData.password,
              onChange: handleChange,
              onBlur: handleBlur,
              className: inputClass("password"),
              placeholder: t("passwordPlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "password" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          t("country"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              name: "country",
              value: formData.country,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 appearance-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ko", children: "🇰🇷 대한민국 (Korea)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vi", children: "🇻🇳 Việt Nam" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ja", children: "🇯🇵 日本 (Japan)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "🇺🇸 United States" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en-GB", children: "🇬🇧 United Kingdom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en-CA", children: "🇨🇦 Canada (English)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fr-CA", children: "🇨🇦 Canada (Français)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "th", children: "🇹🇭 ประเทศไทย (Thailand)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "km", children: "🇰🇭 កម្ពុជា (Cambodia)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ru", children: "🇷🇺 Россия (Russia)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "uk", children: "🇺🇦 Україна (Ukraine)" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          t("nameEn"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 dark:text-gray-500 text-xs", children: [
            "(",
            t("optional"),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "nameEn",
              value: formData.nameEn,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
              placeholder: t("nameEnPlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children: t("nameEnHelp") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
          t("vendorDescription", "회사 소개"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 dark:text-gray-500 text-xs", children: [
            "(",
            t("optional"),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            name: "description",
            value: formData.description,
            onChange: handleChange,
            rows: 3,
            className: "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 resize-none",
            placeholder: t("vendorDescriptionPlaceholder", "주요 취급 품목, 물류 역량, 유통 경험 등을 간략히 소개해 주세요")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KeywordSelector,
        {
          type: "seller",
          value: formData.keywords,
          onChange: (kws) => setFormData((prev) => ({ ...prev, keywords: kws }))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TermsAgreement,
        {
          userType: "vendor",
          agreements,
          onAgreementsChange: setAgreements
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: !isValid,
          className: `w-full py-3 rounded-lg font-semibold transition-colors shadow-md ${isValid ? "bg-primary text-white hover:bg-indigo-700" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`,
          children: t("submitSignup")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        t("alreadyHaveAccount"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline font-medium", children: t("goToLogin") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "mt-3 flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Home, { size: 16 }),
            t("goHome")
          ]
        }
      )
    ] })
  ] }) });
};
export {
  SignupVendor as default
};
