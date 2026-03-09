import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { C as CheckCircle, A as AlertTriangle, a as X } from "./vendor-icons-BFe5lkJJ.js";
const ConfirmModal = ({ modal, onClose }) => {
  if (!modal) return null;
  const isDanger = modal.type === "danger";
  const isWarning = modal.type === "warning";
  const isPositive = !isDanger && !isWarning;
  const theme = isDanger ? { bg: "bg-red-50", border: "border-red-100", iconBg: "bg-red-100", iconColor: "text-red-600", btnBg: "bg-red-600 hover:bg-red-700 active:bg-red-800" } : isWarning ? { bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-100", iconColor: "text-amber-600", btnBg: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800" } : { bg: "bg-green-50", border: "border-green-100", iconBg: "bg-green-100", iconColor: "text-green-600", btnBg: "bg-green-600 hover:bg-green-700 active:bg-green-800" };
  const Icon = isPositive ? CheckCircle : AlertTriangle;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", style: { animation: "fadeIn 0.15s ease-out" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
        onClick: isDanger ? void 0 : onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden",
        style: { animation: "scaleIn 0.2s ease-out" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-5 py-4 ${theme.bg} border-b ${theme.border}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.iconBg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20, className: theme.iconColor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 leading-snug", children: modal.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "ml-auto p-1.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0",
                "aria-label": "닫기",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "text-gray-400" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed whitespace-pre-line", children: modal.message }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-5 py-4 border-t border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-[0.97] transition-all",
                children: "취소"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: modal.onConfirm,
                className: `flex-1 py-3 rounded-xl font-bold text-sm text-white active:scale-[0.97] transition-all shadow-sm ${theme.btnBg}`,
                children: modal.confirmLabel
              }
            )
          ] })
        ]
      }
    )
  ] });
};
export {
  ConfirmModal as C
};
