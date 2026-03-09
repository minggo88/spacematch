import { j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, ae as React } from "./vendor-icons-BFe5lkJJ.js";
const NumberInput = ({
  value,
  onChange,
  allowDecimal = false,
  allowNegative = false,
  className = "",
  placeholder = "0",
  ...rest
}) => {
  const formatDisplay = reactExports.useCallback((val) => {
    if (val === "" || val === null || val === void 0) return "";
    const str = String(val);
    const isNeg = str.startsWith("-");
    const abs = isNeg ? str.slice(1) : str;
    const parts = abs.split(".");
    const intPart = parts[0].replace(/[^0-9]/g, "");
    const decPart = parts.length > 1 ? parts[1] : null;
    const formatted = intPart ? Number(intPart).toLocaleString("en-US") : "";
    let result = formatted;
    if (allowDecimal && decPart !== null) {
      result += "." + decPart;
    }
    if (allowNegative && isNeg && result) {
      result = "-" + result;
    }
    return result;
  }, [allowDecimal, allowNegative]);
  const [displayValue, setDisplayValue] = reactExports.useState(() => formatDisplay(value));
  React.useEffect(() => {
    const newDisplay = formatDisplay(value);
    setDisplayValue(newDisplay);
  }, [value, formatDisplay]);
  const handleChange = (e) => {
    let input = e.target.value;
    let pattern = allowDecimal ? /[^0-9,.-]/g : /[^0-9,-]/g;
    if (!allowNegative) {
      pattern = allowDecimal ? /[^0-9,.]/g : /[^0-9,]/g;
    }
    input = input.replace(pattern, "");
    const raw = input.replace(/,/g, "");
    const formatted = formatDisplay(raw);
    setDisplayValue(formatted);
    if (onChange) {
      onChange(raw);
    }
  };
  const handleBlur = () => {
    const raw = displayValue.replace(/,/g, "");
    setDisplayValue(formatDisplay(raw));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "text",
      inputMode: "numeric",
      value: displayValue,
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      className,
      ...rest
    }
  );
};
export {
  NumberInput as N
};
