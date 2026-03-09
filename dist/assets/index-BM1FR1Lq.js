const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/AdminDashboard-CuCi2HzO.js","assets/vendor-icons-BFe5lkJJ.js","assets/ConfirmModal-C7hQ6Ai9.js","assets/vendor-i18n-NBK24oRL.js","assets/AdminVenues-BVaUwWEk.js","assets/VenueModal-AVUCFW8r.js","assets/AdminApplications-el11hro6.js","assets/AdminUsers-BCX62YXd.js","assets/AdminUserDetail-BJCv34zo.js","assets/AdminPromotions-hBS_5lgs.js","assets/AdminCancellations-D877OAtt.js","assets/SuperAdminDatabase-B--rNmfa.js","assets/AdminAds-DRIBfPtk.js","assets/AdminTrash-V6Fe0DXm.js","assets/AdminPopups-CQwQZ7ND.js","assets/AdminSecurity-CntOsck5.js","assets/AdminPayments-soyRi8wb.js","assets/NumberInput-BjovFE9F.js","assets/AdminSellerStats-DFTF1CSl.js","assets/SellerDashboard-DJHPTi1P.js","assets/useDemoGuard-CCfUj4xK.js","assets/SellerApplications-Dq7PZhcv.js","assets/SellerProfile-C1gda0HS.js","assets/SellerPayments-dsSaBK-s.js","assets/SellerStats-CseEb4G0.js","assets/vendor-xlsx-DgH9Ct63.js","assets/HostDashboard-BUw2zRHw.js","assets/HostVenues-j4exWlbX.js","assets/SellerHostDirectory-CaBbv733.js","assets/HostSellerDirectory-Ry-hIVuq.js","assets/SellerCommunity-DPIL9Qyb.js","assets/CommunityPage-B8S4URSZ.js","assets/HostCommunity-BNhITol1.js","assets/HostApplications-B2kKx5tb.js","assets/GeneralCommunity--i5cQtbc.js","assets/Analytics-CKWIszeM.js","assets/HostAnalyticsReport-Df5J6OSX.js","assets/HostStats-DvY4dIWK.js","assets/SellerPopularAlerts-DaQ0mZQI.js","assets/SellerMarketing-C8jnwU35.js","assets/HostMarketing-D2kzy3Ri.js","assets/AdminCS-BPlDj94i.js","assets/NotificationSettings-BLh3x4U-.js","assets/AdminMenuVisibility-CjcWm0pG.js","assets/AdminMarketing-_Nvaa0JD.js","assets/AdminVendorManagement-Bd-yJue8.js","assets/VendorDashboard-BE2Y8OcX.js","assets/VendorSellerDirectory--yRBnv4z.js","assets/VendorProposals-C5feLsVi.js","assets/VendorShipments-Dbs5qhvz.js","assets/VendorSettlements-Dz8a8c2v.js","assets/SellerProposals-yl3pZTyQ.js","assets/SellerShipments-DJ5IsGkH.js","assets/SellerSettlements-CmjrPbTr.js","assets/VendorProfile-CHKdw6eX.js","assets/SignupVendor-CsdKwEz_.js"])))=>i.map(i=>d[i]);
import { r as reactExports, R as React, I as Info, A as AlertTriangle, X as XCircle, C as CheckCircle, a as X$1, G as Globe, b as ChevronRight, L as Languages, c as Coins, d as Check, B as Bell, S as Smartphone, M as MessageCircle, H as Headset, e as ArrowLeft, U as UserPlus, f as Search, g as MoreVertical, T as Trash2, h as Smile, P as Paperclip, i as Send, F as FileText, D as Download, j as CheckCheck, k as Sparkles, l as ChevronLeft, E as EyeOff, m as Home, n as LayoutDashboard, o as BarChart3, p as ShoppingBag, q as Building, s as Flame, t as ClipboardList, u as Store, v as Users, w as TrendingUp, x as CreditCard, y as Megaphone, z as Truck, J as Monitor, K as Shield, N as Eye, O as CircleUser, Q as Database, V as Inbox, W as Package, Y as Wallet, Z as Menu, _ as Settings, $ as ExternalLink, a0 as ChevronDown, a1 as MessageSquare, a2 as Sun, a3 as Moon, a4 as LogOut, a5 as Headphones, a6 as UserCheck, a7 as AtSign, a8 as Heart, a9 as CheckCircle2, aa as Mail, ab as Lock, ac as Tag, ad as Plus, ae as React$1, af as AlertCircle, ag as User, ah as Phone, ai as Loader2, aj as Instagram, ak as ArrowRight, al as ShieldCheck, am as LogIn, an as Zap, ao as Star, ap as MapPin, aq as Clock, ar as Share2, as as Handshake, at as Target, au as Lightbulb, av as Filter, aw as LayoutGrid, ax as Map$1, ay as List, az as Calendar, aA as Image$1, aB as ZoomIn, aC as MousePointer, aD as Percent, aE as Layers } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation, _ as __vitePreload, i as instance, B as Backend, a as Browser, b as initReactI18next } from "./vendor-i18n-NBK24oRL.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x, C2) ? (a[d] = x, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x, c)) a[d] = x, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r = [], t = [], u = 1, v2 = null, y = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t); null !== b; ) {
      if (null === b.callback) k2(t);
      else if (b.startTime <= a) k2(t), b.sortIndex = b.expirationTime, f2(r, b);
      else break;
      b = h(t);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r)) A2 = true, I2(J);
    else {
      var b = h(t);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y;
    try {
      G2(b);
      for (v2 = h(r); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports$1.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r) && k2(r);
          G2(b);
        } else k2(r);
        v2 = h(r);
      }
      if (null !== v2) var w = true;
      else {
        var m2 = h(t);
        null !== m2 && K2(H2, m2.startTime - b);
        w = false;
      }
      return w;
    } finally {
      v2 = null, y = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports$1.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F) S2 = function() {
    F(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports$1.unstable_now());
    }, b);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J));
  };
  exports$1.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h(r);
  };
  exports$1.unstable_next = function(a) {
    switch (y) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y;
    }
    var c = y;
    y = b;
    try {
      return a();
    } finally {
      y = c;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y;
    y = a;
    try {
      return b();
    } finally {
      y = c;
    }
  };
  exports$1.unstable_scheduleCallback = function(a, b, c) {
    var d = exports$1.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t, a), null === h(r) && a === h(t) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r, a), A2 || z2 || (A2 = true, I2(J)));
    return a;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a) {
    var b = y;
    return function() {
      var c = y;
      y = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
        t = [];
        for (var w = d2, u; null !== w; ) {
          u = w;
          var F = u.stateNode;
          5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
          if (J) break;
          w = w.return;
        }
        0 < t.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J = Vb(n2), n2 !== J || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t = Bd;
            F = "onMouseLeave";
            x = "onMouseEnter";
            w = "mouse";
            if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
            J = null == k3 ? h2 : ue(k3);
            u = null == n2 ? h2 : ue(n2);
            h2 = new t(F, w + "leave", k3, c, e2);
            h2.target = J;
            h2.relatedTarget = u;
            F = null;
            Wc(e2) === d2 && (t = new t(x, w + "enter", n2, c, e2), t.target = u, t.relatedTarget = J, F = t);
            J = F;
            if (k3 && n2) b: {
              t = k3;
              x = n2;
              w = 0;
              for (u = t; u; u = vf(u)) w++;
              u = 0;
              for (F = x; F; F = vf(F)) u++;
              for (; 0 < w - u; ) t = vf(t), w--;
              for (; 0 < u - w; ) x = vf(x), u--;
              for (; w--; ) {
                if (t === x || null !== x && t === x.alternate) break b;
                t = vf(t);
                x = vf(x);
              }
              t = null;
            }
            else t = null;
            null !== k3 && wf(g2, h2, k3, t, false);
            null !== n2 && null !== J && wf(g2, J, n2, t, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
      u.index > w ? (x = u, u = null) : x = u.sibling;
      var n3 = r(e2, u, h2[w], k3);
      if (null === n3) {
        null === u && (u = x);
        break;
      }
      a && u && null === n3.alternate && b(e2, u);
      g2 = f2(n3, g2, w);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u = x;
    }
    if (w === h2.length) return c(e2, u), I && tg(e2, w), l3;
    if (null === u) {
      for (; w < h2.length; w++) u = q2(e2, h2[w], k3), null !== u && (g2 = f2(u, g2, w), null === m3 ? l3 = u : m3.sibling = u, m3 = u);
      I && tg(e2, w);
      return l3;
    }
    for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k3), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f2(x, g2, w), null === m3 ? l3 = x : m3.sibling = x, m3 = x);
    a && u.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w);
    return l3;
  }
  function t(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u = l3 = null, m3 = g2, w = g2 = 0, x = null, n3 = h2.next(); null !== m3 && !n3.done; w++, n3 = h2.next()) {
      m3.index > w ? (x = m3, m3 = null) : x = m3.sibling;
      var t2 = r(e2, m3, n3.value, k3);
      if (null === t2) {
        null === m3 && (m3 = x);
        break;
      }
      a && m3 && null === t2.alternate && b(e2, m3);
      g2 = f2(t2, g2, w);
      null === u ? l3 = t2 : u.sibling = t2;
      u = t2;
      m3 = x;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w), l3;
    if (null === m3) {
      for (; !n3.done; w++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w), null === u ? l3 = n3 : u.sibling = n3, u = n3);
      I && tg(e2, w);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w++, n3 = h2.next()) n3 = y(m3, e2, w, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w : n3.key), g2 = f2(n3, g2, w), null === u ? l3 = n3 : u.sibling = n3, u = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w);
    return l3;
  }
  function J(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r = h.lane, y = h.eventTime;
      if ((d & r) === r) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t = h;
          r = b;
          y = c;
          switch (t.tag) {
            case 1:
              n2 = t.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y, q2, r);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t.payload;
              r = "function" === typeof n2 ? n2.call(y, q2, r) : n2;
              if (null === r || void 0 === r) break a;
              q2 = A({}, q2, r);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
      } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y, k2 = q2) : m2 = m2.next = y, g |= r;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r = b.memoizedState;
    g.state = r;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r !== k2) && Hi(b, g, d, k2);
    jh = false;
    r = b.memoizedState;
    g.state = r;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r !== n2 || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r = null;
        b: for (; ; ) {
          for (var y; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y = q2.firstChild)) break;
            r = q2;
            q2 = y;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r === c && ++l2 === e && (h = g);
            r === f2 && ++m2 === d && (k2 = g);
            if (null !== (y = q2.nextSibling)) break;
            q2 = r;
            r = q2.parentNode;
          }
          q2 = y;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t = n2.memoizedProps, J = n2.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
            x.__reactInternalSnapshotBeforeUpdate = w;
          }
          break;
        case 3:
          var u = b.stateNode.containerInfo;
          1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F) {
      W(b, b.return, F);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t) {
          W(a, a.return, t);
        }
        try {
          Pj(5, a, a.return);
        } catch (t) {
          W(a, a.return, t);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t) {
          W(a, a.return, t);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y = f2.value;
              null != y ? fb(e, !!f2.multiple, y, false) : r !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t) {
          W(a, a.return, t);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t) {
          W(a, a.return, t);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t) {
        W(a, a.return, t);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r = V;
            y = r.child;
            switch (r.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r, r.return);
                break;
              case 1:
                Lj(r, r.return);
                var n2 = r.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r;
                  c = r.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t) {
                    W(d, c, t);
                  }
                }
                break;
              case 5:
                Lj(r, r.return);
                break;
              case 22:
                if (null !== r.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y ? (y.return = r, V = y) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t) {
                W(a, a.return, t);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t) {
              W(a, a.return, t);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r) {
        W(b, b.return, r);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r = m2.alternate;
            r ? (m2.updateQueue = r.updateQueue, m2.memoizedState = r.memoizedState, m2.lanes = r.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y = Ui(g);
          if (null !== y) {
            y.flags &= -257;
            Vi(y, g, h, f2, b);
            y.mode & 1 && Si(f2, l2, b);
            b = y;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t = /* @__PURE__ */ new Set();
              t.add(k2);
              b.updateQueue = t;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J = Ui(g);
          if (null !== J) {
            0 === (J.flags & 65536) && (J.flags |= 256);
            Vi(J, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x = Ni(f2, k2, b);
              ph(f2, x);
              break a;
            case 1:
              h = k2;
              var w = f2.type, u = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F = Qi(f2, h, b);
                ph(f2, F);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r = m2.sibling, y = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r) {
                      r.return = y;
                      V = r;
                      break;
                    }
                    V = y;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t = n2.child;
                if (null !== t) {
                  n2.child = null;
                  do {
                    var J = t.sibling;
                    t.sibling = null;
                    t = J;
                  } while (null !== t);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x = f2.sibling;
            if (null !== x) {
              x.return = f2.return;
              V = x;
              break b;
            }
            V = f2.return;
          }
        }
        var w = a.current;
        for (V = w; null !== V; ) {
          g = V;
          var u = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
          else b: for (g = w; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F = h.sibling;
            if (null !== F) {
              F.return = h.return;
              V = F;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n2, i) => n2 === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX$1.test(url);
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = toPathname.replace(/\/\/+/g, "/");
        warning(false, "Pathnames cannot have embedded double slashes - normalizing " + (oldPathname + " -> " + toPathname));
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
const OutletContext = /* @__PURE__ */ reactExports.createContext(null);
function useOutlet(context) {
  let outlet = reactExports.useContext(RouteContext).outlet;
  if (outlet) {
    return /* @__PURE__ */ reactExports.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}
function useParams() {
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext$1(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState();
  let routeId = useCurrentRouteId();
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options));
    }
  }, [router, id2]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
}
function Navigate(_ref4) {
  let {
    to,
    replace: replace2,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace: replace2,
    state,
    relative
  }), [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Outlet(props) {
  return useOutlet(props.context);
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map((v2) => [key, v2]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ reactExports.createContext({
  isTransitioning: false
});
const START_TRANSITION = "startTransition";
const startTransitionImpl = React[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace: replace2,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
const NavLink = /* @__PURE__ */ reactExports.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = reactExports.useContext(DataRouterStateContext);
  let {
    navigator: navigator2,
    basename
  } = reactExports.useContext(NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ reactExports.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace: replace2,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useSearchParams(defaultInit) {
  let defaultSearchParamsRef = reactExports.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = reactExports.useRef(false);
  let location = useLocation();
  let searchParams = reactExports.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = reactExports.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = reactExports.useContext(ViewTransitionContext);
  !(vtContext != null) ? invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
const AuthContext = reactExports.createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const API_BASE2 = "/api/auth";
  reactExports.useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_BASE2}/me.php`, { credentials: "include" });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE2}/me.php`, { credentials: "include" });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn("Session heartbeat failed:", e);
      }
    }, 15 * 60 * 1e3);
  }, []);
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE2}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error", error);
      return { success: false, message: "서버 오류가 발생했습니다." };
    }
  };
  const logout = async () => {
    try {
      await fetch(`${API_BASE2}/logout.php`, { credentials: "include" });
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE2}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Signup error", error);
      return { success: false, message: "회원가입 처리 중 오류" };
    }
  };
  const sendVerification = async (email, country) => {
    try {
      const response = await fetch(`${API_BASE2}/send_verification.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, country })
      });
      return await response.json();
    } catch (error) {
      console.error("Send verification error", error);
      return { success: false, message: "인증 코드 발송 중 오류" };
    }
  };
  const verifyEmail = async (email, code) => {
    try {
      const response = await fetch(`${API_BASE2}/verify_email.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code })
      });
      return await response.json();
    } catch (error) {
      console.error("Verify email error", error);
      return { success: false, message: "인증 중 오류" };
    }
  };
  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_BASE2}/me.php`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
  };
  const updateUserProfile = async (updatedData) => {
    try {
      const response = await fetch("/api/users/update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "프로필 수정에 실패했습니다." };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, message: "서버 오류가 발생했습니다. 다시 시도해주세요." };
    }
  };
  const toggleUserBlock = async (targetEmail) => {
    try {
      const response = await fetch(`/api/users/toggle_block.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await response.json();
      if (data.success) {
        return data.status;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const changePassword = async (targetEmail, newPassword) => {
    try {
      const response = await fetch("/api/users/change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: targetEmail, new_password: newPassword })
      });
      const data = await response.json();
      return data.success;
    } catch (e) {
      console.error("Password change error:", e);
      return false;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, login, logout, signup, sendVerification, verifyEmail, loading, updateUserProfile, refreshUser, toggleUserBlock, changePassword }, children: !loading && children });
};
const useAuth = () => reactExports.useContext(AuthContext);
const DataContext = reactExports.createContext(null);
const DataProvider = ({ children }) => {
  const [venues, setVenues] = reactExports.useState([]);
  const [applications, setApplications] = reactExports.useState([]);
  const [wishlist, setWishlist] = reactExports.useState([]);
  const [notifications, setNotifications] = reactExports.useState([]);
  const seenNotifIds = reactExports.useRef(/* @__PURE__ */ new Set());
  const isFirstLoad = reactExports.useRef(true);
  const API_BASE2 = "/api";
  const showBrowserNotification = reactExports.useCallback((title, body, link) => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body,
          icon: "/favicon.png",
          badge: "/favicon.png",
          tag: "spacematch-" + Date.now(),
          requireInteraction: false,
          silent: false
        });
        if (link) {
          notif.onclick = () => {
            window.focus();
            window.location.href = link;
            notif.close();
          };
        }
        setTimeout(() => notif.close(), 8e3);
      } catch (e) {
        console.warn("Browser notification failed:", e);
      }
    }
  }, []);
  const fetchVenues = async () => {
    try {
      const res = await fetch(`${API_BASE2}/venues/get_venues.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setVenues(data);
    } catch (e) {
      console.error(e);
    }
  };
  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE2}/applications/get_applications.php`, { cache: "no-store", credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setApplications(data);
      else if (data.message) console.warn(data.message);
    } catch (e) {
      console.error(e);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE2}/notifications/get_notifications.php`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        if (!isFirstLoad.current) {
          data.forEach((n2) => {
            const nId = String(n2.id);
            if (!seenNotifIds.current.has(nId) && n2.is_read == 0) {
              showBrowserNotification("SpaceMatch", n2.message, n2.link);
            }
          });
        }
        const currentIds = new Set(data.map((n2) => String(n2.id)));
        seenNotifIds.current = currentIds;
        isFirstLoad.current = false;
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  reactExports.useEffect(() => {
    fetchVenues();
    fetchApplications();
    fetchWishlist();
    let notifInterval = null;
    const startPolling = async () => {
      await fetchNotifications();
      notifInterval = setInterval(fetchNotifications, 1e4);
    };
    fetch(`${API_BASE2}/auth/me.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (data.success) startPolling();
    }).catch(() => {
    });
    return () => {
      if (notifInterval) clearInterval(notifInterval);
    };
  }, []);
  const addVenue = async (venue) => {
    try {
      const res = await fetch(`${API_BASE2}/venues/add_venue.php`, {
        method: "POST",
        credentials: "include",
        body: venue instanceof FormData ? venue : JSON.stringify(venue),
        ...venue instanceof FormData ? {} : { headers: { "Content-Type": "application/json" } }
      });
      const data = await res.json();
      if (data.success) {
        fetchVenues();
        return { ...venue, id: data.id };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };
  const applyForVenue = async (application) => {
    try {
      const isFormData = application instanceof FormData;
      const res = await fetch(`${API_BASE2}/applications/submit_application.php`, {
        method: "POST",
        credentials: "include",
        ...isFormData ? {} : { headers: { "Content-Type": "application/json" } },
        body: isFormData ? application : JSON.stringify(application)
      });
      const data = await res.json();
      if (data.success) {
        await fetchApplications();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Network or Server Error" };
    }
  };
  const updateApplicationStatus = async (appId, status) => {
    try {
      const res = await fetch(`${API_BASE2}/applications/update_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: appId, status })
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, status } : app));
        if (status === "approved" || status === "rejected" || status === "cancelled") {
          fetchVenues();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem("spacematch_wishlist", JSON.stringify(newWishlist));
  };
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE2}/wishlist/get_wishlist.php`, { credentials: "include" });
      const serverVenueIds = await res.json();
      if (Array.isArray(serverVenueIds) && serverVenueIds.length > 0) {
        const localWishlist = JSON.parse(localStorage.getItem("spacematch_wishlist") || "[]");
        const serverEntries = serverVenueIds.map((vid) => ({
          userId: "server",
          venueId: String(vid),
          addedAt: (/* @__PURE__ */ new Date()).toISOString()
        }));
        const merged = [...localWishlist];
        serverEntries.forEach((se2) => {
          if (!merged.some((m2) => String(m2.venueId) === String(se2.venueId))) {
            merged.push(se2);
          }
        });
        saveWishlist(merged);
      }
    } catch (e) {
    }
  };
  const toggleWishlist = (userId, venueId) => {
    const exists = wishlist.find((w) => w.userId === userId && w.venueId === venueId);
    let newWishlist;
    if (exists) {
      newWishlist = wishlist.filter((w) => !(w.userId === userId && w.venueId === venueId));
    } else {
      newWishlist = [...wishlist, { userId, venueId, addedAt: (/* @__PURE__ */ new Date()).toISOString() }];
    }
    saveWishlist(newWishlist);
    fetch(`${API_BASE2}/wishlist/toggle_wishlist.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ venue_id: venueId })
    }).catch(() => {
    });
    return !exists;
  };
  const markAsRead = async (notifId) => {
    try {
      await fetch(`${API_BASE2}/notifications/mark_read.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: notifId })
      });
      setNotifications((prev) => prev.map((n2) => n2.id === notifId ? { ...n2, is_read: 1 } : n2));
    } catch (e) {
      console.error(e);
    }
  };
  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE2}/notifications/mark_read.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ all: true })
      });
      setNotifications((prev) => prev.map((n2) => ({ ...n2, is_read: 1 })));
    } catch (e) {
      console.error(e);
    }
  };
  const deleteReadNotifications = async () => {
    try {
      await fetch(`${API_BASE2}/notifications/delete_read.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      setNotifications((prev) => prev.filter((n2) => n2.is_read == 0));
    } catch (e) {
      console.error(e);
    }
  };
  const deleteVenue = async (id2) => {
    try {
      const res = await fetch(`${API_BASE2}/venues/delete_venue.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: id2 })
      });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) => prev.filter((v2) => v2.id !== id2 && v2.id !== String(id2)));
        return { success: true };
      } else {
        alert(data.message || "삭제 실패");
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error(e);
      alert("오류가 발생했습니다.");
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataContext.Provider, { value: {
    venues,
    applications,
    wishlist,
    notifications,
    addVenue,
    deleteVenue,
    applyForVenue,
    updateApplicationStatus,
    toggleWishlist,
    markAsRead,
    markAllAsRead,
    deleteReadNotifications,
    fetchVenues,
    fetchApplications,
    fetchNotifications
  }, children });
};
const useData = () => reactExports.useContext(DataContext);
const ToastContext = reactExports.createContext(null);
const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};
const TOAST_STYLES = {
  success: {
    light: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/80 text-emerald-900",
    dark: "dark:from-emerald-950/80 dark:to-teal-950/80 dark:border-emerald-700/40 dark:text-emerald-100",
    icon: "text-emerald-500 dark:text-emerald-400",
    progress: "bg-emerald-500 dark:bg-emerald-400",
    glow: "shadow-emerald-200/40 dark:shadow-emerald-900/40"
  },
  error: {
    light: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200/80 text-red-900",
    dark: "dark:from-red-950/80 dark:to-rose-950/80 dark:border-red-700/40 dark:text-red-100",
    icon: "text-red-500 dark:text-red-400",
    progress: "bg-red-500 dark:bg-red-400",
    glow: "shadow-red-200/40 dark:shadow-red-900/40"
  },
  warning: {
    light: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/80 text-amber-900",
    dark: "dark:from-amber-950/80 dark:to-yellow-950/80 dark:border-amber-700/40 dark:text-amber-100",
    icon: "text-amber-500 dark:text-amber-400",
    progress: "bg-amber-500 dark:bg-amber-400",
    glow: "shadow-amber-200/40 dark:shadow-amber-900/40"
  },
  info: {
    light: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/80 text-blue-900",
    dark: "dark:from-blue-950/80 dark:to-indigo-950/80 dark:border-blue-700/40 dark:text-blue-100",
    icon: "text-blue-500 dark:text-blue-400",
    progress: "bg-blue-500 dark:bg-blue-400",
    glow: "shadow-blue-200/40 dark:shadow-blue-900/40"
  }
};
const DURATION = 3500;
const ToastItem = ({ toast, onDismiss }) => {
  const [entering, setEntering] = reactExports.useState(true);
  const [exiting, setExiting] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon = TOAST_ICONS[toast.type] || Info;
  reactExports.useEffect(() => {
    requestAnimationFrame(() => setEntering(false));
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 350);
    }, toast.duration || DURATION);
    return () => clearTimeout(timerRef.current);
  }, []);
  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 350);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `
                relative flex items-center gap-3 w-full max-w-md px-5 py-4 
                rounded-2xl border backdrop-blur-xl
                shadow-xl ${style.glow}
                ${style.light} ${style.dark}
                transition-all duration-350 ease-out
                ${entering ? "opacity-0 translate-y-[-20px] scale-95" : exiting ? "opacity-0 translate-y-[-10px] scale-95" : "opacity-100 translate-y-0 scale-100"}
            `,
      role: "alert",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 rounded-full ${style.icon} opacity-20 animate-ping`, style: { animationDuration: "2s" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, className: `${style.icon} relative z-10`, strokeWidth: 2.5 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm font-semibold leading-snug", children: toast.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDismiss,
            className: "flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 14, className: "opacity-50 hover:opacity-100 transition-opacity" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden bg-black/5 dark:bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full ${style.progress} opacity-60`,
            style: {
              animation: `toast-progress ${toast.duration || DURATION}ms linear forwards`
            }
          }
        ) })
      ]
    }
  );
};
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = reactExports.useState([]);
  const idRef = reactExports.useRef(0);
  const showToast = reactExports.useCallback((message, type = "success", duration = DURATION) => {
    const id2 = ++idRef.current;
    setToasts((prev) => [...prev, { id: id2, message, type, duration }]);
  }, []);
  const dismissToast = reactExports.useCallback((id2) => {
    setToasts((prev) => prev.filter((t) => t.id !== id2));
  }, []);
  const toast = {
    success: (msg, dur) => showToast(msg, "success", dur),
    error: (msg, dur) => showToast(msg, "error", dur),
    warning: (msg, dur) => showToast(msg, "warning", dur),
    info: (msg, dur) => showToast(msg, "info", dur)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastContext.Provider, { value: { showToast, toast }, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-4 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 pointer-events-none w-full px-4", children: toasts.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastItem, { toast: t, onDismiss: dismissToast }) }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            ` })
  ] });
};
const useToast = () => {
  const ctx = reactExports.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
const CURRENCY_CONFIG = {
  KRW: { code: "KRW", symbol: "₩", locale: "ko-KR", decimals: 0, name: "원 (KRW)", flag: "🇰🇷" },
  USD: { code: "USD", symbol: "$", locale: "en-US", decimals: 2, name: "USD ($)", flag: "🇺🇸" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", decimals: 2, name: "GBP (£)", flag: "🇬🇧" },
  CAD: { code: "CAD", symbol: "C$", locale: "en-CA", decimals: 2, name: "CAD (C$)", flag: "🇨🇦" },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", decimals: 0, name: "円 (JPY)", flag: "🇯🇵" },
  VND: { code: "VND", symbol: "₫", locale: "vi-VN", decimals: 0, name: "VND (₫)", flag: "🇻🇳" },
  THB: { code: "THB", symbol: "฿", locale: "th-TH", decimals: 2, name: "THB (฿)", flag: "🇹🇭" },
  KHR: { code: "KHR", symbol: "៛", locale: "km-KH", decimals: 0, name: "KHR (៛)", flag: "🇰🇭" },
  RUB: { code: "RUB", symbol: "₽", locale: "ru-RU", decimals: 2, name: "RUB (₽)", flag: "🇷🇺" },
  UAH: { code: "UAH", symbol: "₴", locale: "uk-UA", decimals: 2, name: "UAH (₴)", flag: "🇺🇦" }
};
const LANGUAGE_CURRENCY_MAP = {
  ko: "KRW",
  en: "USD",
  "en-GB": "GBP",
  "en-CA": "CAD",
  "fr-CA": "CAD",
  ja: "JPY",
  vi: "VND",
  th: "THB",
  km: "KHR",
  ru: "RUB",
  uk: "UAH"
};
const CurrencyContext = reactExports.createContext();
const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = reactExports.useState(() => {
    return localStorage.getItem("preferredCurrency") || "KRW";
  });
  const [rates, setRates] = reactExports.useState({
    KRW: 1,
    USD: 74e-5,
    GBP: 58e-5,
    CAD: 1e-3,
    JPY: 0.11,
    VND: 18.5,
    THB: 0.025,
    KHR: 3,
    RUB: 0.066,
    UAH: 0.031
  });
  reactExports.useEffect(() => {
    const fetchRates = async () => {
      const cached = localStorage.getItem("exchangeRates");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 864e5) {
          setRates(data);
          return;
        }
      }
      try {
        const res = await fetch("/api/currency/rates.php");
        const data = await res.json();
        if (data.success && data.rates) {
          setRates(data.rates);
          localStorage.setItem("exchangeRates", JSON.stringify({ data: data.rates, timestamp: Date.now() }));
        }
      } catch {
      }
    };
    fetchRates();
  }, []);
  reactExports.useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);
  const convert = (amountKRW) => {
    if (!amountKRW || isNaN(amountKRW)) return 0;
    const rate = rates[currency] || 1;
    return Math.round(Number(amountKRW) * rate * 100) / 100;
  };
  const formatCurrency = (amountKRW) => {
    const converted = convert(amountKRW);
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KRW;
    try {
      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.code,
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals
      }).format(converted);
    } catch {
      return `${config.symbol}${converted.toLocaleString()}`;
    }
  };
  const formatCurrencyCompact = (amountKRW) => {
    const converted = convert(amountKRW);
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.KRW;
    try {
      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.code,
        notation: "compact",
        maximumFractionDigits: 1
      }).format(converted);
    } catch {
      return formatCurrency(amountKRW);
    }
  };
  const setCurrencyFromLanguage = (lang) => {
    const mapped = LANGUAGE_CURRENCY_MAP[lang];
    if (mapped && !localStorage.getItem("currencyManuallySet")) {
      setCurrency(mapped);
    }
  };
  const formatNumber = (value) => {
    const num = Number(String(value).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyContext.Provider, { value: {
    currency,
    setCurrency,
    convert,
    formatCurrency,
    formatCurrencyCompact,
    rates,
    setCurrencyFromLanguage,
    currencies: CURRENCY_CONFIG,
    formatNumber
  }, children });
};
const useCurrency = () => {
  const ctx = reactExports.useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
const LANGUAGES = [
  { code: "ko", name: "한국어", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", nativeName: "English (UK)", flag: "🇬🇧" },
  { code: "en-CA", name: "English (Canada)", nativeName: "English (Canada)", flag: "🇨🇦" },
  { code: "fr-CA", name: "Français (Canada)", nativeName: "Français (Canada)", flag: "🇨🇦" },
  { code: "ja", name: "日本語", nativeName: "日本語", flag: "🇯🇵" },
  { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "ภาษาไทย", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "km", name: "ខ្មែរ", nativeName: "ខ្មែរ", flag: "🇰🇭" },
  { code: "ru", name: "Русский", nativeName: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Українська", nativeName: "Українська", flag: "🇺🇦" }
];
const LanguageSelector = ({ compact = false }) => {
  var _a, _b;
  const { i18n, t } = useTranslation("common");
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("lang");
  const modalRef = reactExports.useRef(null);
  const currentLang = ((_a = i18n.language) == null ? void 0 : _a.substring(0, 5)) || "ko";
  const currentLangObj = LANGUAGES.find((l2) => l2.code === currentLang) || LANGUAGES.find((l2) => currentLang.startsWith(l2.code)) || LANGUAGES[0];
  reactExports.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const handleLanguageChange = async (langCode) => {
    await i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode.substring(0, 2);
    localStorage.setItem("i18nextLng", langCode);
    setOpen(false);
  };
  const handleCurrencyChange = (code) => {
    setCurrency(code);
    localStorage.setItem("currencyManuallySet", "true");
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(true),
        className: "flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-indigo-400 transition-colors w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20 }),
          !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium whitespace-nowrap", children: [
            currentLangObj.flag,
            " ",
            currentLangObj.nativeName
          ] }),
          !compact && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "ml-auto text-gray-400" }),
          compact && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: currentLangObj.flag })
        ]
      }
    ),
    open && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "fixed inset-0 flex items-center justify-center p-4 sm:p-6",
          style: { zIndex: 99999 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                onClick: () => setOpen(false),
                style: { animation: "fadeIn 0.2s ease-out" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                ref: modalRef,
                className: "relative w-full max-w-[420px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col m-auto",
                style: {
                  animation: "modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-6 pt-6 pb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-[0.07]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20, className: "text-white" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900 dark:text-white", children: t("globalSettings") }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "Language & Currency" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setOpen(false),
                          className: "w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 16, className: "text-gray-500 dark:text-gray-400" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex bg-gray-100/80 dark:bg-gray-700/60 rounded-2xl p-1.5 gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setTab("lang"),
                        className: `flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${tab === "lang" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 scale-[1.02]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/30"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 16 }),
                          t("selectLanguage")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setTab("currency"),
                        className: `flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${tab === "currency" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 scale-[1.02]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/30"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 16 }),
                          t("selectCurrency")
                        ]
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto px-4 py-3 scroll-smooth", style: { scrollbarWidth: "thin" }, children: [
                    tab === "lang" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: LANGUAGES.map((lang) => {
                      const isExactMatch = currentLang === lang.code;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => handleLanguageChange(lang.code),
                          className: `w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${isExactMatch ? "bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200/80 dark:ring-indigo-500/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.98]"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none", children: lang.flag }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold truncate ${isExactMatch ? "text-indigo-600 dark:text-indigo-400" : "text-gray-800 dark:text-gray-200"}`, children: lang.nativeName }),
                              lang.name !== lang.nativeName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 truncate", children: lang.name })
                            ] }),
                            isExactMatch ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "text-white" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" })
                          ]
                        },
                        lang.code
                      );
                    }) }),
                    tab === "currency" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: Object.values(CURRENCY_CONFIG).map((cur) => {
                      const isSelected = currency === cur.code;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => handleCurrencyChange(cur.code),
                          className: `w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${isSelected ? "bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200/80 dark:ring-indigo-500/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.98]"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none", children: cur.flag }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold truncate ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-800 dark:text-gray-200"}`, children: cur.name }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: [
                                cur.symbol,
                                " · ",
                                cur.code
                              ] })
                            ] }),
                            isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200/50 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "text-white" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" })
                          ]
                        },
                        cur.code
                      );
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-3.5 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", children: [
                      currentLangObj.flag,
                      " ",
                      currentLangObj.nativeName
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", children: [
                      ((_b = CURRENCY_CONFIG[currency]) == null ? void 0 : _b.symbol) || "₩",
                      " ",
                      currency
                    ] })
                  ] }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes modalSlideUp {
                            from { opacity: 0; transform: translateY(20px) scale(0.96); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    ` })
          ]
        }
      ),
      document.body
    )
  ] });
};
const LocaleContext = reactExports.createContext();
const LocaleProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { setCurrencyFromLanguage } = useCurrency();
  const currentLanguage = i18n.language || "ko";
  const changeLanguage = reactExports.useCallback(async (langCode) => {
    await i18n.changeLanguage(langCode);
    setCurrencyFromLanguage(langCode);
    document.documentElement.lang = langCode.substring(0, 2);
  }, [i18n, setCurrencyFromLanguage]);
  const formatDate = reactExports.useCallback((dateStr, options = {}) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const defaultOpts = { year: "numeric", month: "long", day: "numeric", ...options };
    try {
      return new Intl.DateTimeFormat(currentLanguage, defaultOpts).format(date);
    } catch {
      return dateStr;
    }
  }, [currentLanguage]);
  const formatDateShort = reactExports.useCallback((dateStr) => {
    return formatDate(dateStr, { month: "short", day: "numeric" });
  }, [formatDate]);
  const formatNumber = reactExports.useCallback((num) => {
    if (num == null || isNaN(num)) return "0";
    try {
      return new Intl.NumberFormat(currentLanguage).format(Number(num));
    } catch {
      return Number(num).toLocaleString();
    }
  }, [currentLanguage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleContext.Provider, { value: {
    currentLanguage,
    changeLanguage,
    languages: LANGUAGES,
    formatDate,
    formatDateShort,
    formatNumber
  }, children });
};
const ThemeContext = reactExports.createContext();
const useTheme = () => {
  const context = reactExports.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = reactExports.useState(() => {
    var _a;
    const saved = localStorage.getItem("spacematch-theme");
    if (saved) return saved === "dark";
    return ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) || false;
  });
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("spacematch-theme", isDark ? "dark" : "light");
  }, [isDark]);
  const toggleTheme = () => setIsDark((prev) => !prev);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value: { isDark, toggleTheme }, children });
};
const API_BASE$5 = "/api/notifications/push_subscription.php";
async function getVapidPublicKey() {
  try {
    const res = await fetch(API_BASE$5, {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    if (data.success && data.publicKey) {
      return data.publicKey;
    }
    return null;
  } catch (e) {
    console.error("[Push] VAPID 키 가져오기 실패:", e);
    return null;
  }
}
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function subscribeToPush() {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[Push] 이 브라우저에서 웹 푸시를 지원하지 않습니다.");
      return false;
    }
    if (Notification.permission === "denied") {
      console.warn("[Push] 알림 권한이 거부되어 있습니다.");
      return false;
    }
    if (Notification.permission !== "granted") {
      return false;
    }
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const vapidPublicKey = await getVapidPublicKey();
      if (!vapidPublicKey) {
        console.error("[Push] VAPID 공개키를 가져올 수 없습니다.");
        return false;
      }
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
    }
    const res = await fetch(API_BASE$5, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(subscription.toJSON())
    });
    const data = await res.json();
    if (data.success) {
      console.log("[Push] ✅ 푸시 알림 구독 완료");
      return true;
    } else {
      console.error("[Push] 구독 저장 실패:", data.message);
      return false;
    }
  } catch (e) {
    console.error("[Push] 구독 오류:", e);
    return false;
  }
}
async function unsubscribeFromPush() {
  try {
    if (!("serviceWorker" in navigator)) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch(API_BASE$5, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      await subscription.unsubscribe();
      console.log("[Push] ✅ 푸시 알림 구독 해제 완료");
    }
    return true;
  } catch (e) {
    console.error("[Push] 구독 해제 오류:", e);
    return false;
  }
}
async function getPushStatus() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "denied") {
    return "denied";
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription ? "subscribed" : "not-subscribed";
  } catch (e) {
    return "not-subscribed";
  }
}
const NotificationPrompt = () => {
  const [visible, setVisible] = reactExports.useState(false);
  const [animateIn, setAnimateIn] = reactExports.useState(false);
  const { t } = useTranslation("common");
  const isSupported = "Notification" in window;
  reactExports.useEffect(() => {
    if (!isSupported) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    const dismissData = localStorage.getItem("spacematch_notif_dismiss");
    if (dismissData) {
      try {
        const { count, lastDismissed } = JSON.parse(dismissData);
        const now = Date.now();
        const elapsed = now - lastDismissed;
        const delays = [3e4, 12e4, 6e5, 18e5];
        const delay = delays[Math.min(count - 1, delays.length - 1)] || 18e5;
        if (elapsed < delay) {
          const remaining = delay - elapsed;
          const timer2 = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setAnimateIn(true), 50);
          }, remaining);
          return () => clearTimeout(timer2);
        }
      } catch (e) {
      }
    }
    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setAnimateIn(true), 50);
    }, 3e3);
    return () => clearTimeout(timer);
  }, [isSupported]);
  const handleAllow = reactExports.useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        localStorage.removeItem("spacematch_notif_dismiss");
        localStorage.setItem("spacematch_notif_granted", "true");
        try {
          await subscribeToPush();
        } catch (pushErr) {
          console.warn("Push subscription failed:", pushErr);
        }
        new Notification(t("notifPrompt.enabled"), {
          body: t("notifPrompt.enabledBody"),
          icon: "/favicon.png",
          tag: "welcome"
        });
      }
    } catch (e) {
      console.error("Notification permission error:", e);
    }
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }, [t]);
  const handleDismiss = reactExports.useCallback(() => {
    const dismissData = localStorage.getItem("spacematch_notif_dismiss");
    let count = 1;
    if (dismissData) {
      try {
        count = JSON.parse(dismissData).count + 1;
      } catch (e) {
      }
    }
    localStorage.setItem("spacematch_notif_dismiss", JSON.stringify({
      count,
      lastDismissed: Date.now()
    }));
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }, []);
  if (!visible || !isSupported) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${animateIn ? "bg-black/40 backdrop-blur-sm" : "bg-transparent"}`,
      onClick: handleDismiss,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transition-all duration-300 ${animateIn ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}`,
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white text-center relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 32, className: "text-white animate-bounce", style: { animationDuration: "2s" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold mb-1", children: t("notifPrompt.title") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm", children: t("notifPrompt.subtitle") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-emerald-600" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800", children: t("notifPrompt.applicationResult") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("notifPrompt.applicationResultDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 16, className: "text-blue-600" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800", children: t("notifPrompt.communityActivity") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("notifPrompt.communityActivityDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16, className: "text-purple-600" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800", children: t("notifPrompt.newSpaceInfo") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("notifPrompt.newSpaceInfoDesc") })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleAllow,
                    className: "w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 18 }),
                      t("notifPrompt.allow")
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleDismiss,
                    className: "w-full py-3 text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors",
                    children: t("notifPrompt.later")
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
};
const countryToLang = (country) => {
  if (!country) return "ko";
  const map = {
    "ko": "ko",
    "en": "en",
    "en-GB": "en",
    "en-CA": "en",
    "vi": "vi",
    "ja": "ja",
    "th": "th",
    "km": "km",
    "ru": "ru",
    "uk": "uk",
    "fr-CA": "fr"
  };
  return map[country] || map[country == null ? void 0 : country.substring(0, 2)] || "ko";
};
const getPopupLocalized = (popup, viewerLang) => {
  if (!popup) return { title: "", content: "" };
  if (!viewerLang || viewerLang === "ko") {
    return { title: popup.title, content: popup.content };
  }
  let translations = popup.translations;
  if (typeof translations === "string") {
    try {
      translations = JSON.parse(translations);
    } catch {
      translations = null;
    }
  }
  if (translations && translations[viewerLang]) {
    return {
      title: translations[viewerLang].title || popup.title,
      content: translations[viewerLang].content || popup.content
    };
  }
  if (translations && translations["en"] && viewerLang !== "en") {
    return {
      title: translations["en"].title || popup.title,
      content: translations["en"].content || popup.content
    };
  }
  return { title: popup.title, content: popup.content };
};
const getDisplayName = (user, viewerLang) => {
  if (!user) return "";
  const name = user.user_name || user.name || "";
  const nameEn = user.user_name_en || user.name_en || "";
  if (!viewerLang || viewerLang === "ko") return name;
  return nameEn || name;
};
const COUNTRY_FLAGS = {
  "ko": { flag: "🇰🇷", name: "한국", nameEn: "Korea" },
  "en": { flag: "🇺🇸", name: "미국", nameEn: "USA" },
  "en-GB": { flag: "🇬🇧", name: "영국", nameEn: "UK" },
  "en-CA": { flag: "🇨🇦", name: "캐나다", nameEn: "Canada" },
  "fr-CA": { flag: "🇨🇦", name: "캐나다", nameEn: "Canada" },
  "ja": { flag: "🇯🇵", name: "일본", nameEn: "Japan" },
  "vi": { flag: "🇻🇳", name: "베트남", nameEn: "Vietnam" },
  "th": { flag: "🇹🇭", name: "태국", nameEn: "Thailand" },
  "km": { flag: "🇰🇭", name: "캄보디아", nameEn: "Cambodia" },
  "ru": { flag: "🇷🇺", name: "러시아", nameEn: "Russia" },
  "uk": { flag: "🇺🇦", name: "우크라이나", nameEn: "Ukraine" }
};
const CountryBadge = ({
  country,
  size = "sm",
  showName = true,
  showFlag = true,
  className = "",
  lang = "ko"
  // display language for the name
}) => {
  if (!country) return null;
  const info = COUNTRY_FLAGS[country] || COUNTRY_FLAGS[country == null ? void 0 : country.substring(0, 2)];
  if (!info) return null;
  const displayName = lang === "ko" ? info.name : info.nameEn;
  const sizeClasses = {
    xs: "text-[10px] px-1 py-0.5 gap-0.5",
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center ${sizeClasses[size] || sizeClasses.sm} bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full border border-gray-100 dark:border-gray-600 font-medium whitespace-nowrap ${className}`, children: [
    showFlag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.flag }),
    showName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayName })
  ] });
};
const API_BASE$4 = "/api";
const POLL_INTERVAL = 2e3;
const LANG_OPTIONS = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧" },
  { code: "en-CA", label: "English (CA)", flag: "🇨🇦" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "km", label: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "fr-CA", label: "Français", flag: "🇨🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" }
];
const ChatPage$1 = ({ isPopup = false }) => {
  var _a;
  const { user } = useAuth();
  const { t, i18n } = useTranslation("chat");
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = reactExports.useState([]);
  const [activeConv, setActiveConv] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [inputText, setInputText] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [sending, setSending] = reactExports.useState(false);
  const [showTranslation, setShowTranslation] = reactExports.useState(true);
  const [mobileShowMessages, setMobileShowMessages] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [csConnecting, setCsConnecting] = reactExports.useState(false);
  const [sortBy, setSortBy] = reactExports.useState("latest");
  const [adminViewLang, setAdminViewLang] = reactExports.useState((user == null ? void 0 : user.country) || "ko");
  const [showNewChatModal, setShowNewChatModal] = reactExports.useState(false);
  const [userSearchTerm, setUserSearchTerm] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [searchingUsers, setSearchingUsers] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [showChatMenu, setShowChatMenu] = reactExports.useState(false);
  const chatMenuRef = reactExports.useRef(null);
  const isAdmin = (user == null ? void 0 : user.role) === "admin" || (user == null ? void 0 : user.role) === "superadmin";
  const isSuperAdmin = (user == null ? void 0 : user.role) === "superadmin";
  const messagesEndRef = reactExports.useRef(null);
  const messagesContainerRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const lastMsgIdRef = reactExports.useRef(0);
  const pollRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const isNearBottomRef = reactExports.useRef(true);
  const fetchConversations = reactExports.useCallback(async () => {
    try {
      const url = isAdmin ? `${API_BASE$4}/chat/conversations.php?type=cs` : `${API_BASE$4}/chat/conversations.php`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);
  const fetchMessages = reactExports.useCallback(async (convId, isPolling = false) => {
    var _a2, _b;
    if (!convId) return;
    try {
      const afterParam = isPolling && lastMsgIdRef.current > 0 ? `&after_id=${lastMsgIdRef.current}` : "";
      const res = await fetch(`${API_BASE$4}/chat/messages.php?conversation_id=${convId}${afterParam}`, { credentials: "include" });
      const data = await res.json();
      if (data.success && ((_a2 = data.messages) == null ? void 0 : _a2.length) > 0) {
        if (isPolling) {
          setMessages((prev) => [...prev, ...data.messages]);
        } else {
          setMessages(data.messages);
        }
        const maxId = Math.max(...data.messages.map((m2) => parseInt(m2.id)));
        lastMsgIdRef.current = maxId;
      } else if (!isPolling) {
        setMessages([]);
      }
      if (isPolling && ((_b = data.updated_translations) == null ? void 0 : _b.length) > 0) {
        setMessages((prev) => prev.map((msg) => {
          const update = data.updated_translations.find((u) => String(u.id) === String(msg.id));
          if (update && (!msg.translated_texts || Object.keys(msg.translated_texts).length === 0)) {
            return { ...msg, translated_texts: update.translated_texts };
          }
          return msg;
        }));
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  }, []);
  const markAsRead = reactExports.useCallback(async (convId) => {
    try {
      await fetch(`${API_BASE$4}/chat/messages.php`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: convId })
      });
    } catch (e) {
    }
  }, []);
  reactExports.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  reactExports.useEffect(() => {
    const targetUser = searchParams.get("user");
    if (targetUser && conversations.length > 0) {
      const existing = conversations.find(
        (c) => String(c.other_user_id) === String(targetUser) || String(c.participant_1) === String(targetUser) || String(c.participant_2) === String(targetUser)
      );
      if (existing) {
        handleSelectConversation(existing);
      } else {
        createConversation(parseInt(targetUser));
      }
    }
  }, [searchParams, conversations.length]);
  const createConversation = async (targetUserId) => {
    try {
      const permRes = await fetch(`${API_BASE$4}/chat/chat_permission.php?target_id=${targetUserId}`, { credentials: "include" });
      const permData = await permRes.json();
      if (permData.success && !permData.allowed) {
        alert(permData.message || "채팅 권한이 없습니다.");
        return;
      }
      const res = await fetch(`${API_BASE$4}/chat/conversations.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUserId })
      });
      const data = await res.json();
      if (data.success) {
        await fetchConversations();
        setActiveConv(data.conversation);
        setMobileShowMessages(true);
        lastMsgIdRef.current = 0;
        fetchMessages(data.conversation.id);
      } else if (data.error_code === "NO_PERMISSION") {
        alert(data.message || "채팅 권한이 없습니다.");
      }
    } catch (e) {
      console.error("Failed to create conversation:", e);
    }
  };
  const connectToCS = async () => {
    if (csConnecting) return;
    setCsConnecting(true);
    try {
      const res = await fetch(`${API_BASE$4}/chat/cs_admin.php`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || t("csConnectFailed", "CS 연결에 실패했습니다."));
        return;
      }
      if (data.is_existing && data.existing_conversation_id) {
        const existing = conversations.find((c) => String(c.id) === String(data.existing_conversation_id));
        if (existing) {
          handleSelectConversation(existing);
          return;
        }
      }
      const convRes = await fetch(`${API_BASE$4}/chat/conversations.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: data.admin_id, type: "cs" })
      });
      const convData = await convRes.json();
      if (convData.success) {
        await fetchConversations();
        setActiveConv(convData.conversation);
        setMobileShowMessages(true);
        lastMsgIdRef.current = 0;
        fetchMessages(convData.conversation.id);
      } else {
        alert(convData.message || t("csCreateFailed", "CS 대화 생성에 실패했습니다."));
      }
    } catch (e) {
      console.error("CS connect error:", e);
      alert(t("csConnectError", "CS 연결 중 오류가 발생했습니다."));
    } finally {
      setCsConnecting(false);
    }
  };
  const handleSelectConversation = (conv) => {
    setActiveConv(conv);
    setMobileShowMessages(true);
    lastMsgIdRef.current = 0;
    fetchMessages(conv.id);
    markAsRead(conv.id);
  };
  reactExports.useEffect(() => {
    if (!activeConv) return;
    pollRef.current = setInterval(() => {
      fetchMessages(activeConv.id, true);
      fetchConversations();
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [activeConv, fetchMessages, fetchConversations]);
  const handleMessagesScroll = reactExports.useCallback(() => {
    const el2 = messagesContainerRef.current;
    if (!el2) return;
    const threshold = 100;
    isNearBottomRef.current = el2.scrollHeight - el2.scrollTop - el2.clientHeight < threshold;
  }, []);
  reactExports.useEffect(() => {
    var _a2;
    if (isNearBottomRef.current) {
      (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleSend = async () => {
    var _a2;
    if (!inputText.trim() || !activeConv || sending) return;
    const text = inputText.trim();
    setInputText("");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE$4}/chat/messages.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConv.id, text })
      });
      const data = await res.json();
      if (data.success) {
        isNearBottomRef.current = true;
        setMessages((prev) => [...prev, data.message]);
        lastMsgIdRef.current = parseInt(data.message.id);
        fetchConversations();
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    } finally {
      setSending(false);
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }
  };
  const handleFileUpload = async (file) => {
    if (!activeConv || uploading) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversation_id", activeConv.id);
    try {
      const res = await fetch(`${API_BASE$4}/chat/upload.php`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        isNearBottomRef.current = true;
        setMessages((prev) => [...prev, data.message]);
        lastMsgIdRef.current = parseInt(data.message.id);
        fetchConversations();
      }
    } catch (e) {
      console.error("Failed to upload file:", e);
    } finally {
      setUploading(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    var _a2;
    e.preventDefault();
    setDragOver(false);
    if ((_a2 = e.dataTransfer.files) == null ? void 0 : _a2[0]) handleFileUpload(e.dataTransfer.files[0]);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleDeleteMessage = async (messageId) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE$4}/chat/messages.php`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m2) => String(m2.id) !== String(messageId)));
      } else {
        alert(data.message || "삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("Failed to delete message:", e);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };
  const handleDeleteConversation = async (convId) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE$4}/chat/conversations.php`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: convId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveConv(null);
        setMessages([]);
        setMobileShowMessages(false);
        fetchConversations();
      } else {
        alert(data.message || "삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("Failed to delete conversation:", e);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
      setShowChatMenu(false);
    }
  };
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target)) {
        setShowChatMenu(false);
      }
    };
    if (showChatMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showChatMenu]);
  const countryToLang2 = { jp: "ja", kr: "ko", vn: "vi", cn: "zh-CN", kh: "km", ua: "uk", gb: "en", us: "en", ca: "en" };
  const getDisplayText = (msg) => {
    if (!showTranslation || !msg.translated_texts || Object.keys(msg.translated_texts).length === 0) {
      return msg.original_text;
    }
    let viewerLang = isAdmin ? adminViewLang : (user == null ? void 0 : user.country) || i18n.language || "ko";
    viewerLang = countryToLang2[viewerLang == null ? void 0 : viewerLang.toLowerCase()] || (viewerLang == null ? void 0 : viewerLang.toLowerCase());
    if (!isAdmin && String(msg.sender_id) === String(user.id)) {
      return msg.original_text;
    }
    if (msg.translated_texts[viewerLang]) {
      return msg.translated_texts[viewerLang];
    }
    const baseLang = viewerLang.split("-")[0];
    if (baseLang !== viewerLang && msg.translated_texts[baseLang]) {
      return msg.translated_texts[baseLang];
    }
    return msg.original_text;
  };
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diff = (now - d) / 1e3;
    if (diff < 60) return t("justNow");
    if (diff < 3600) return t("minutesAgo", { count: Math.floor(diff / 60) });
    if (diff < 86400) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800) return t("daysAgo", { count: Math.floor(diff / 86400) });
    return d.toLocaleDateString();
  };
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1048576 * 1024) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / (1048576 * 1024)).toFixed(2) + " GB";
  };
  const searchUsers = reactExports.useCallback(async (term) => {
    if (!term || term.length < 1) {
      setSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const res = await fetch(`${API_BASE$4}/users/get_users.php?search=${encodeURIComponent(term)}&limit=10`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setSearchResults((data.users || []).filter((u) => u.id !== user.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingUsers(false);
    }
  }, [user == null ? void 0 : user.id]);
  const startNewCSChat = async (targetUserId) => {
    setShowNewChatModal(false);
    setUserSearchTerm("");
    setSearchResults([]);
    try {
      const res = await fetch(`${API_BASE$4}/chat/conversations.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUserId, type: "cs" })
      });
      const data = await res.json();
      if (data.success) {
        await fetchConversations();
        setActiveConv(data.conversation);
        setMobileShowMessages(true);
        lastMsgIdRef.current = 0;
        fetchMessages(data.conversation.id);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const filteredConvs = (() => {
    let result = conversations.filter(
      (c) => {
        var _a2;
        return !searchTerm || ((_a2 = c.other_name) == null ? void 0 : _a2.toLowerCase().includes(searchTerm.toLowerCase()));
      }
    );
    switch (sortBy) {
      case "unread":
        result = [...result].sort((a, b) => (parseInt(b.unread_count) || 0) - (parseInt(a.unread_count) || 0));
        break;
      case "name":
        result = [...result].sort((a, b) => (a.other_name || "").localeCompare(b.other_name || ""));
        break;
    }
    return result;
  })();
  const renderConvItem = (conv) => {
    var _a2;
    const isActive = (activeConv == null ? void 0 : activeConv.id) === conv.id;
    const unread = parseInt(conv.unread_count || 0);
    const flag = COUNTRY_FLAGS[conv.other_country];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => handleSelectConversation(conv),
        className: `flex items-center gap-3 p-3.5 cursor-pointer transition-all rounded-2xl mx-2 my-1 ${isActive ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-100 dark:border-indigo-800 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden", children: conv.other_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: conv.other_profile_image, alt: "", className: "w-full h-full object-cover" }) : ((_a2 = conv.other_name) == null ? void 0 : _a2[0]) || "?" }),
            flag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 text-sm", children: flag.flag })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold truncate ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-gray-100"}`, children: conv.other_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0", children: conv.last_message_at ? formatTime(conv.last_message_at) : "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]", children: conv.last_message_type === "image" ? "📷 " + t("photo") : conv.last_message_type === "video" ? "🎥 " + t("video") : conv.last_message_type === "file" ? "📎 " + t("file") : conv.last_message || t("noMessages") }),
              unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm", children: unread > 99 ? "99+" : unread })
            ] })
          ] })
        ]
      },
      conv.id
    );
  };
  const renderMessage = (msg, idx) => {
    var _a2;
    const isMine = String(msg.sender_id) === String(user.id);
    const displayText = getDisplayText(msg);
    const isTranslated = showTranslation && !isMine && displayText !== msg.original_text;
    ["image", "video", "file"].includes(msg.message_type);
    const canDeleteMsg = isAdmin && isMine;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex ${isMine ? "justify-end" : "justify-start"} mb-3 group`, children: [
      !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 mr-2 mt-1", children: msg.sender_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.sender_profile_image, alt: "", className: "w-full h-full object-cover" }) : ((_a2 = msg.sender_name) == null ? void 0 : _a2[0]) || "?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`, children: [
        !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1 ml-1", children: msg.sender_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl px-4 py-2.5 shadow-sm ${isMine ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md"}`, children: [
          msg.message_type === "image" && msg.file_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: msg.file_url, target: "_blank", rel: "noreferrer", className: "block mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.file_url, alt: "", className: "max-w-full rounded-xl max-h-60 object-cover" }) }),
          msg.message_type === "video" && msg.file_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: msg.file_url, controls: true, className: "max-w-full rounded-xl max-h-60" }) }),
          msg.message_type === "file" && msg.file_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: msg.file_url, download: msg.file_name, className: `flex items-center gap-2 mb-1 px-3 py-2 rounded-xl ${isMine ? "bg-white/20" : "bg-gray-50 dark:bg-gray-700"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18, className: isMine ? "text-white/80" : "text-gray-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium truncate ${isMine ? "text-white" : "text-gray-700 dark:text-gray-200"}`, children: msg.file_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] ${isMine ? "text-white/60" : "text-gray-400 dark:text-gray-500"}`, children: formatFileSize(msg.file_size) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: isMine ? "text-white/70" : "text-gray-400" })
          ] }),
          msg.message_type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words leading-relaxed", children: displayText }),
          isTranslated && msg.message_type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 mt-1.5 pt-1.5 border-t ${isMine ? "border-white/20" : "border-gray-100 dark:border-gray-600"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 10, className: isMine ? "text-white/50" : "text-gray-400 dark:text-gray-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] ${isMine ? "text-white/50" : "text-gray-400 dark:text-gray-500"}`, children: t("autoTranslated") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 mt-0.5 ${isMine ? "mr-1 justify-end" : "ml-1"}`, children: [
          canDeleteMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setDeleteConfirm({ type: "message", id: msg.id });
              },
              className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200",
              title: t("deleteMessage", "메시지 삭제"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11, className: "text-red-400 hover:text-red-500" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 dark:text-gray-500", children: formatTime(msg.created_at) }),
          isMine && (msg.is_read == 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 12, className: "text-indigo-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, className: "text-gray-300" }))
        ] })
      ] })
    ] }, msg.id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isPopup ? "h-full flex flex-col" : "h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] flex flex-col", children: [
    !isPopup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 20, className: "text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-black text-gray-900", children: t("title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("subtitle") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowTranslation(!showTranslation),
          className: `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${showTranslation ? "bg-indigo-100 text-indigo-600 shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 14 }),
            t("autoTranslate")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full lg:w-80 border-r border-gray-100 dark:border-gray-700 flex flex-col ${mobileShowMessages ? "hidden lg:flex" : "flex"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-gray-100 dark:border-gray-700 space-y-2", children: [
          !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: connectToCS,
              disabled: csConnecting,
              className: "w-full flex items-center gap-3 px-3.5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0", children: csConnecting ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Headset, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-tight", children: t("csConnect", "CS 상담 연결") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70 mt-0.5", children: t("csConnectDesc", "관리자와 바로 대화할 수 있습니다") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14, className: "rotate-180 opacity-60 group-hover:translate-x-0.5 transition-transform" })
              ]
            }
          ),
          isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowNewChatModal(true),
              className: "w-full flex items-center gap-3 px-3.5 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-tight", children: t("newChat", "새 채팅") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70 mt-0.5", children: t("newChatDesc", "사용자와 새 대화를 시작합니다") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14, className: "rotate-180 opacity-60 group-hover:translate-x-0.5 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: t("searchPlaceholder"),
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: "w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 border-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                className: "px-2 py-2.5 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 border-none cursor-pointer",
                title: t("sort", "정렬"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "latest", children: t("sortLatest", "최신순") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unread", children: t("sortUnread", "안 읽은 순") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: t("sortName", "이름순") })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" }) }) : filteredConvs.length > 0 ? filteredConvs.map(renderConvItem) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 28, className: "text-gray-300 dark:text-gray-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-400 dark:text-gray-300 mb-1", children: t("noConversations") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 dark:text-gray-500", style: { wordBreak: "keep-all" }, children: t("noConversationsDesc") })
        ] }) }),
        showNewChatModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4", onClick: () => setShowNewChatModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900", children: t("newChat", "새 채팅") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowNewChatModal(false), className: "p-1.5 hover:bg-gray-100 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: t("searchUser", "사용자 검색..."),
                value: userSearchTerm,
                onChange: (e) => {
                  setUserSearchTerm(e.target.value);
                  searchUsers(e.target.value);
                },
                className: "w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 border-none",
                autoFocus: true
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 pb-4 space-y-1", children: searchingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" }) }) : searchResults.length > 0 ? searchResults.map((u) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => startNewCSChat(u.id),
                className: "w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold overflow-hidden", children: u.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.profile_image, alt: "", className: "w-full h-full object-cover" }) : ((_a2 = u.name) == null ? void 0 : _a2[0]) || "?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 truncate", children: u.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${u.role === "host" ? "bg-emerald-100 text-emerald-600" : u.role === "seller" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"}`, children: u.role }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 truncate", children: u.email })
                    ] })
                  ] })
                ]
              },
              u.id
            );
          }) : userSearchTerm ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-gray-400 py-8", children: t("noResults", "검색 결과가 없습니다") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-gray-400 py-8", children: t("searchUserHint", "이름이나 이메일로 검색하세요") }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex-1 flex flex-col ${!mobileShowMessages ? "hidden lg:flex" : "flex"}`,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
          children: activeConv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setMobileShowMessages(false);
                    setActiveConv(null);
                  },
                  className: "lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold overflow-hidden", children: activeConv.other_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeConv.other_profile_image, alt: "", className: "w-full h-full object-cover" }) : ((_a = activeConv.other_name) == null ? void 0 : _a[0]) || "?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 dark:text-gray-100 truncate", children: activeConv.other_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeConv.other_role === "host" ? "bg-emerald-100 text-emerald-600" : activeConv.other_role === "admin" || activeConv.other_role === "superadmin" ? "bg-teal-100 text-teal-600" : "bg-indigo-100 text-indigo-600"}`, children: activeConv.other_role === "host" ? t("host") : activeConv.other_role === "admin" || activeConv.other_role === "superadmin" ? "CS" : t("seller") }),
                  COUNTRY_FLAGS[activeConv.other_country] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: COUNTRY_FLAGS[activeConv.other_country].flag })
                ] })
              ] }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: adminViewLang,
                  onChange: (e) => setAdminViewLang(e.target.value),
                  className: "px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 border border-gray-200 dark:border-gray-600 dark:text-gray-200 cursor-pointer",
                  title: t("viewLanguage", "보기 언어"),
                  children: LANG_OPTIONS.map((l2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: l2.code, children: [
                    l2.flag,
                    " ",
                    l2.label
                  ] }, l2.code))
                }
              ),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: chatMenuRef, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setShowChatMenu(!showChatMenu),
                    className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreVertical, { size: 16 })
                  }
                ),
                showChatMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      setDeleteConfirm({ type: "conversation", id: activeConv.id });
                      setShowChatMenu(false);
                    },
                    className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t("deleteConversation", "대화 삭제") })
                    ]
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: messagesContainerRef, onScroll: handleMessagesScroll, className: `flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-850 ${dragOver ? "ring-2 ring-indigo-300 ring-inset bg-indigo-50/30 dark:bg-indigo-900/30" : ""}`, children: [
              messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-indigo-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { size: 28, className: "text-indigo-300 dark:text-indigo-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-400 dark:text-gray-300", children: t("startConversation") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 dark:text-gray-500 mt-1", children: t("startConversationDesc") })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                messages.map(renderMessage),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
              ] }),
              dragOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-indigo-500/10 flex items-center justify-center pointer-events-none z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 20, className: "text-indigo-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-indigo-600", children: t("dropFile") })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      var _a2;
                      return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                    },
                    disabled: uploading,
                    className: "p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 18 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    type: "file",
                    className: "hidden",
                    accept: "*/*",
                    onChange: (e) => {
                      var _a2;
                      if ((_a2 = e.target.files) == null ? void 0 : _a2[0]) handleFileUpload(e.target.files[0]);
                      e.target.value = "";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    ref: inputRef,
                    value: inputText,
                    onChange: (e) => setInputText(e.target.value),
                    onKeyDown: handleKeyDown,
                    placeholder: t("inputPlaceholder"),
                    rows: 1,
                    className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800 resize-none border-none max-h-32",
                    style: { minHeight: "44px" }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleSend,
                    disabled: !inputText.trim() || sending,
                    className: `p-2.5 rounded-xl transition-all flex-shrink-0 ${inputText.trim() ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
                  }
                )
              ] }),
              uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-indigo-200 dark:border-indigo-700 border-t-indigo-500 rounded-full animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-indigo-600 dark:text-indigo-400 font-medium", children: t("uploading") })
              ] })
            ] })
          ] }) : (
            /* No conversation selected */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center px-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-4 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 36, className: "text-indigo-300 dark:text-indigo-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-black text-gray-700 dark:text-gray-200 mb-1.5 whitespace-nowrap", children: t("selectConversation") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap", children: t("selectConversationDesc") })
            ] })
          )
        }
      )
    ] }),
    deleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4", onClick: () => !deleting && setDeleteConfirm(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6", onClick: (e) => e.stopPropagation(), style: { animation: "modalSlideUp 0.25s ease-out" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 28, className: "text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-gray-100 mb-2", children: deleteConfirm.type === "message" ? t("deleteMessage", "메시지 삭제") : t("deleteConversation", "대화 삭제") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-6", style: { wordBreak: "keep-all" }, children: deleteConfirm.type === "message" ? t("deleteMessageConfirm", "이 메시지를 삭제하시겠습니까? 삭제된 메시지는 복구할 수 없습니다.") : t("deleteConversationConfirm", "전체 대화 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setDeleteConfirm(null),
              disabled: deleting,
              className: "flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50",
              children: t("cancel", "취소")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                if (deleteConfirm.type === "message") handleDeleteMessage(deleteConfirm.id);
                else handleDeleteConversation(deleteConfirm.id);
              },
              disabled: deleting,
              className: "flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-200/50 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2",
              children: deleting ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                t("deleteMessage", "삭제")
              ] })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        @keyframes modalSlideUp {
                            from { opacity: 0; transform: translateY(10px) scale(0.98); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    ` })
    ] })
  ] });
};
const ChatPage$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ChatPage$1
}, Symbol.toStringTag, { value: "Module" }));
const GUIDE_STEPS = {
  seller: [
    { menuPath: "/seller", key: "home", icon: "🏠" },
    { menuPath: "/seller/applications", key: "applications", icon: "📋" },
    { menuPath: "/seller/hosts", key: "hosts", icon: "🏢" },
    { menuPath: "/seller/stats", key: "stats", icon: "📊" },
    { menuPath: "/seller/community", key: "community", icon: "💬" },
    { menuPath: "/seller/profile", key: "profile", icon: "👤" }
  ],
  host: [
    { menuPath: "/host", key: "home", icon: "🏠" },
    { menuPath: "/host/dashboard", key: "dashboard", icon: "📊" },
    { menuPath: "/host/venues", key: "venues", icon: "🏪" },
    { menuPath: "/host/sellers", key: "sellers", icon: "🛍️" },
    { menuPath: "/host/stats", key: "hostStats", icon: "📈" },
    { menuPath: "/host/community", key: "community", icon: "💬" }
  ],
  vendor: [
    { menuPath: "/vendor", key: "home", icon: "🏠" },
    { menuPath: "/vendor/sellers", key: "vendorSellers", icon: "🛍️" },
    { menuPath: "/vendor/proposals", key: "proposals", icon: "📩" },
    { menuPath: "/vendor/shipments", key: "shipments", icon: "📦" },
    { menuPath: "/vendor/settlements", key: "settlements", icon: "💰" },
    { menuPath: "/vendor/profile", key: "profile", icon: "👤" }
  ],
  admin: [
    { menuPath: "/admin", key: "adminHome", icon: "🏠" },
    { menuPath: "/admin/dashboard", key: "adminDashboard", icon: "📊" },
    { menuPath: "/admin/sellers", key: "adminSellers", icon: "🛍️" },
    { menuPath: "/admin/hosts", key: "adminHosts", icon: "🏢" },
    { menuPath: "/admin/applications", key: "adminApps", icon: "📋" },
    { menuPath: "/admin/venues", key: "adminVenues", icon: "🏪" },
    { menuPath: "/admin/users", key: "adminUsers", icon: "👥" },
    { menuPath: "/admin/payments", key: "adminPayments", icon: "💳" },
    { menuPath: "/admin/community/general", key: "adminCommunity", icon: "💬" },
    { menuPath: "/admin/profile", key: "profile", icon: "👤" }
  ],
  superadmin: [
    { menuPath: "/admin", key: "adminHome", icon: "🏠" },
    { menuPath: "/admin/dashboard", key: "adminDashboard", icon: "📊" },
    { menuPath: "/admin/sellers", key: "adminSellers", icon: "🛍️" },
    { menuPath: "/admin/hosts", key: "adminHosts", icon: "🏢" },
    { menuPath: "/admin/applications", key: "adminApps", icon: "📋" },
    { menuPath: "/admin/venues", key: "adminVenues", icon: "🏪" },
    { menuPath: "/admin/users", key: "adminUsers", icon: "👥" },
    { menuPath: "/admin/payments", key: "adminPayments", icon: "💳" },
    { menuPath: "/admin/security", key: "adminSecurity", icon: "🔒" },
    { menuPath: "/admin/database", key: "adminDB", icon: "🗄️" },
    { menuPath: "/admin/community/general", key: "adminCommunity", icon: "💬" },
    { menuPath: "/admin/profile", key: "profile", icon: "👤" }
  ]
};
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1e3;
const OnboardingGuide = () => {
  const { user } = useAuth();
  const { t } = useTranslation("common");
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [visible, setVisible] = reactExports.useState(true);
  const [highlightRect, setHighlightRect] = reactExports.useState(null);
  const tooltipRef = reactExports.useRef(null);
  const [ready, setReady] = reactExports.useState(false);
  const userId = user == null ? void 0 : user.id;
  const role = user == null ? void 0 : user.role;
  const createdAt = (user == null ? void 0 : user.created_at) ? new Date(user.created_at) : null;
  const guideRole = role === "superadmin" ? "superadmin" : role === "admin" ? "admin" : role === "host" ? "host" : role === "vendor" ? "vendor" : role ? "seller" : null;
  const isAfterFirstWeek = createdAt ? Date.now() - createdAt.getTime() > ONE_WEEK_MS : false;
  const steps = guideRole ? GUIDE_STEPS[guideRole] || [] : [];
  reactExports.useEffect(() => {
    if (!user) {
      setReady(false);
      return;
    }
    if (!guideRole || steps.length === 0) {
      setVisible(false);
      setReady(true);
      return;
    }
    const uid = userId || (user == null ? void 0 : user.email) || "default";
    const foreverKey = `onboarding_dismiss_forever_${uid}`;
    if (localStorage.getItem(foreverKey) === "true") {
      setVisible(false);
      setReady(true);
      return;
    }
    const todayKey = `onboarding_dismiss_today_${uid}`;
    const today = (/* @__PURE__ */ new Date()).toDateString();
    if (localStorage.getItem(todayKey) === today) {
      setVisible(false);
      setReady(true);
      return;
    }
    setVisible(true);
    setCurrentStep(0);
    setReady(true);
  }, [user, userId, guideRole, steps.length]);
  const updateHighlight = reactExports.useCallback(() => {
    if (!visible || !ready || steps.length === 0) return;
    const step2 = steps[currentStep];
    if (!step2) return;
    const el2 = document.querySelector(`a[href="${step2.menuPath}"]`);
    if (el2) {
      const rect = el2.getBoundingClientRect();
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setHighlightRect(null);
    }
  }, [visible, ready, currentStep, steps]);
  reactExports.useEffect(() => {
    if (!visible || !ready) return;
    updateHighlight();
    const timer = setTimeout(updateHighlight, 500);
    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight);
    };
  }, [updateHighlight, visible, ready]);
  const getUid = () => userId || (user == null ? void 0 : user.email) || "default";
  const dismissToday = () => {
    const todayKey = `onboarding_dismiss_today_${getUid()}`;
    localStorage.setItem(todayKey, (/* @__PURE__ */ new Date()).toDateString());
    setVisible(false);
  };
  const dismissForever = () => {
    const foreverKey = `onboarding_dismiss_forever_${getUid()}`;
    localStorage.setItem(foreverKey, "true");
    setVisible(false);
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      dismissToday();
    }
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };
  if (!user || !ready || !visible || steps.length === 0) return null;
  const step = steps[currentStep];
  const stepTitle = t(`onboarding.steps.${step.key}.title`, step.key);
  const stepDesc = t(`onboarding.steps.${step.key}.desc`, "");
  const progress = (currentStep + 1) / steps.length * 100;
  const isLastStep = currentStep === steps.length - 1;
  const tooltipStyle = highlightRect ? {
    position: "fixed",
    top: Math.max(16, Math.min(highlightRect.top - 20, window.innerHeight - 320)),
    left: highlightRect.left + highlightRect.width + 16,
    zIndex: 10001
  } : {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10001
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  if (isMobile) {
    tooltipStyle.top = "auto";
    tooltipStyle.left = "50%";
    tooltipStyle.bottom = "24px";
    tooltipStyle.transform = "translateX(-50%)";
    delete tooltipStyle.right;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" },
        onClick: dismissToday
      }
    ),
    highlightRect && !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "fixed",
          zIndex: 1e4,
          borderRadius: "12px",
          transition: "all 0.3s ease-out",
          top: highlightRect.top - 4,
          left: highlightRect.left - 4,
          width: highlightRect.width + 8,
          height: highlightRect.height + 8,
          boxShadow: "0 0 0 4000px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.6)",
          border: "2px solid rgba(99,102,241,0.8)",
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: tooltipRef,
        style: { ...tooltipStyle, width: 340, maxWidth: "calc(100vw - 32px)", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", overflow: "hidden" },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, backgroundColor: "#f1f5f9" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: { height: "100%", background: "linear-gradient(to right, #6366f1, #a855f7)", transition: "width 0.5s ease-out", width: `${progress}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, background: "linear-gradient(135deg, #6366f1, #9333ea)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16, color: "white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12, fontWeight: 700, color: "#6366f1", margin: 0 }, children: t("onboarding.title", "시작 가이드") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 10, color: "#9ca3af", fontWeight: 500, margin: 0 }, children: [
                  currentStep + 1,
                  " / ",
                  steps.length
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: dismissToday,
                style: { width: 28, height: 28, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 20px 16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 30, flexShrink: 0, marginTop: 2 }, children: step.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { style: { fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4, marginTop: 0 }, children: stepTitle }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }, children: stepDesc })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 16, justifyContent: "center" }, children: steps.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setCurrentStep(i),
                style: {
                  height: 6,
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  width: i === currentStep ? 24 : 6,
                  backgroundColor: i === currentStep ? "#6366f1" : i < currentStep ? "#a5b4fc" : "#e2e8f0"
                }
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              currentStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: prevStep,
                  style: { display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#6b7280", background: "transparent", border: "none", borderRadius: 12, cursor: "pointer" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 }),
                    t("onboarding.prev", "이전")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: nextStep,
                  style: { display: "flex", alignItems: "center", gap: 4, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "white", background: "linear-gradient(to right, #6366f1, #9333ea)", border: "none", borderRadius: 12, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" },
                  children: [
                    isLastStep ? t("onboarding.finish", "완료") : t("onboarding.next", "다음"),
                    !isLastStep && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: dismissToday,
                  style: { fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontWeight: 500 },
                  children: t("onboarding.dismissToday", "오늘 그만 보기")
                }
              ),
              isAfterFirstWeek && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e2e8f0" }, children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: dismissForever,
                    style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontWeight: 500 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 11 }),
                      t("onboarding.dismissForever", "더 이상 보지 않기")
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
};
const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation("common");
  const { notifications, markAsRead, markAllAsRead, deleteReadNotifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/admin") ? "/admin" : location.pathname.startsWith("/host") ? "/host" : location.pathname.startsWith("/vendor") ? "/vendor" : "/seller";
  const [showNotifs, setShowNotifs] = reactExports.useState(false);
  const notifRef = reactExports.useRef(null);
  const [paymentEnabled, setPaymentEnabled] = reactExports.useState(false);
  const [showChatPopup, setShowChatPopup] = reactExports.useState(false);
  const [hiddenMenus, setHiddenMenus] = reactExports.useState([]);
  const [loginPopups, setLoginPopups] = reactExports.useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = reactExports.useState(0);
  const [showLoginPopup, setShowLoginPopup] = reactExports.useState(false);
  const allPopupsRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    fetch("/api/payments/get_settings.php", { credentials: "include" }).then((r) => r.json()).then((d) => {
      var _a;
      if (d.success) setPaymentEnabled(!!parseInt((_a = d.settings) == null ? void 0 : _a.is_payment_enabled));
    }).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    if (!user || user.role === "admin" || user.role === "superadmin") return;
    fetch("/api/menu/get_menu_visibility.php", { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.success) setHiddenMenus(d.hiddenMenus || []);
    }).catch(() => {
    });
  }, [user]);
  reactExports.useEffect(() => {
    if (!user) return;
    if (sessionStorage.getItem("push_subscribed")) return;
    if ("Notification" in window && Notification.permission === "granted") {
      subscribeToPush().then((ok2) => {
        if (ok2) sessionStorage.setItem("push_subscribed", "1");
      }).catch(() => {
      });
    }
  }, [user]);
  reactExports.useEffect(() => {
    if (!user) return;
    const userLang = i18n.language || countryToLang(user == null ? void 0 : user.country);
    console.log("[Popup] i18n.language =", i18n.language, "user.country =", user == null ? void 0 : user.country, "→ userLang =", userLang);
    fetch(`/api/popups/popups.php?lang=${userLang}`, { credentials: "include" }).then((r) => r.json()).then((data) => {
      var _a;
      console.log("[Popup] API response:", data);
      if (data.popups) {
        data.popups.forEach((p2) => console.log(`[Popup] id=${p2.id} title="${p2.title}" translations=`, p2.translations));
      }
      if (data.success && ((_a = data.popups) == null ? void 0 : _a.length) > 0) {
        const filtered = data.popups.filter((p2) => {
          const tc2 = p2.target_countries;
          if (!tc2 || tc2 === "all") return true;
          return tc2.split(",").map((c) => c.trim()).includes(userLang);
        });
        console.log("[Popup] Total popups from API:", data.popups.length, "→ After country filter:", filtered.length, "userLang:", userLang);
        allPopupsRef.current = filtered;
        const today = (/* @__PURE__ */ new Date()).toDateString();
        const visible = filtered.filter((p2) => {
          const dismissKey = `popup_dismiss_${p2.id}`;
          const dismissed = localStorage.getItem(dismissKey);
          console.log(`[Popup] id=${p2.id} dismissKey=${dismissKey} dismissed=${dismissed} today=${today} show=${dismissed !== today}`);
          return dismissed !== today;
        });
        console.log("[Popup] Visible after dismiss filter:", visible.length);
        if (visible.length > 0) {
          setLoginPopups(visible);
          setCurrentPopupIndex(0);
          setShowLoginPopup(true);
        }
      }
    }).catch((err) => {
      console.error("[Popup] Fetch error:", err);
    });
  }, [user, i18n.language]);
  const isHomePath = ["/admin", "/seller", "/host", "/vendor", "/"].includes(location.pathname) || location.pathname === "";
  reactExports.useEffect(() => {
    if (!user || !isHomePath || allPopupsRef.current.length === 0) return;
    const today = (/* @__PURE__ */ new Date()).toDateString();
    const visible = allPopupsRef.current.filter((p2) => {
      const dismissKey = `popup_dismiss_${p2.id}`;
      return localStorage.getItem(dismissKey) !== today;
    });
    if (visible.length > 0) {
      setLoginPopups(visible);
      setCurrentPopupIndex(0);
      setShowLoginPopup(true);
    }
  }, [location.pathname]);
  reactExports.useEffect(() => {
    if (!showNotifs) return;
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showNotifs]);
  const [mobileMenuOpen, setMobileMenuOpen] = reactExports.useState(false);
  const [communityOpen, setCommunityOpen] = reactExports.useState(false);
  const [managementOpen, setManagementOpen] = reactExports.useState(false);
  const myNotifs = notifications;
  const unreadCount = myNotifs.filter((n2) => n2.is_read == 0).length;
  reactExports.useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) SpaceMatch` : "SpaceMatch";
  }, [unreadCount]);
  const [notifFilter, setNotifFilter] = reactExports.useState("all");
  const [unreadOnly, setUnreadOnly] = reactExports.useState(false);
  const NOTIF_CATEGORIES = {
    application: { label: t("notif.application"), types: ["application_new", "application_status", "cancellation_request", "cancellation_result"], accent: "border-l-indigo-500" },
    community: { label: t("notif.community"), types: ["community_post", "community_comment", "community_reply", "community_mention"], accent: "border-l-rose-500" },
    venue: { label: t("notif.venue"), types: ["venue_status", "venue_new"], accent: "border-l-emerald-500" },
    account: { label: t("notif.account"), types: ["vendor_approved", "user_registered", "test", "chat_message", "cs_message"], accent: "border-l-cyan-500" },
    payment: { label: t("notif.payment"), types: ["payment_submitted", "payment_result"], accent: "border-l-green-500" }
  };
  const getNotifAccent = (type) => {
    for (const [, cat] of Object.entries(NOTIF_CATEGORIES)) {
      if (cat.types.includes(type)) return cat.accent;
    }
    return "border-l-gray-300";
  };
  const getNotifMeta = (type) => {
    switch (type) {
      case "application_new":
        return { icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-100", tag: t("notif.tagNewApplication"), tagColor: "bg-indigo-100 text-indigo-600" };
      case "application_status":
        return { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100", tag: t("notif.tagApplicationResult"), tagColor: "bg-blue-100 text-blue-600" };
      case "cancellation_request":
        return { icon: XCircle, color: "text-orange-600", bg: "bg-orange-100", tag: t("notif.tagCancellationRequest"), tagColor: "bg-orange-100 text-orange-600" };
      case "cancellation_result":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-100", tag: t("notif.tagCancellationResult"), tagColor: "bg-red-100 text-red-600" };
      case "venue_status":
        return { icon: Store, color: "text-emerald-600", bg: "bg-emerald-100", tag: t("notif.tagVenueStatus"), tagColor: "bg-emerald-100 text-emerald-600" };
      case "venue_new":
        return { icon: Building, color: "text-teal-600", bg: "bg-teal-100", tag: t("notif.tagNewVenue"), tagColor: "bg-teal-100 text-teal-600" };
      case "community_post":
        return { icon: Heart, color: "text-rose-600", bg: "bg-rose-100", tag: t("notif.tagLike"), tagColor: "bg-rose-100 text-rose-600" };
      case "community_comment":
        return { icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-100", tag: t("notif.tagComment"), tagColor: "bg-violet-100 text-violet-600" };
      case "community_reply":
        return { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100", tag: t("notif.tagReply"), tagColor: "bg-purple-100 text-purple-600" };
      case "community_mention":
        return { icon: AtSign, color: "text-pink-600", bg: "bg-pink-100", tag: t("notif.tagMention"), tagColor: "bg-pink-100 text-pink-600" };
      case "vendor_approved":
        return { icon: UserCheck, color: "text-green-600", bg: "bg-green-100", tag: t("notif.tagApproved"), tagColor: "bg-green-100 text-green-600" };
      case "user_registered":
        return { icon: UserPlus, color: "text-cyan-600", bg: "bg-cyan-100", tag: t("notif.tagRegistered"), tagColor: "bg-cyan-100 text-cyan-600" };
      case "payment_submitted":
        return { icon: CreditCard, color: "text-green-600", bg: "bg-green-100", tag: t("notif.tagPaymentSubmitted"), tagColor: "bg-green-100 text-green-600" };
      case "payment_result":
        return { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100", tag: t("notif.tagPaymentResult"), tagColor: "bg-emerald-100 text-emerald-600" };
      case "chat_message":
        return { icon: MessageCircle, color: "text-violet-600", bg: "bg-violet-100", tag: t("sidebar.chat"), tagColor: "bg-violet-100 text-violet-600" };
      case "cs_message":
        return { icon: Headphones, color: "text-teal-600", bg: "bg-teal-100", tag: "CS", tagColor: "bg-teal-100 text-teal-600" };
      default:
        return { icon: Bell, color: "text-gray-600", bg: "bg-gray-100", tag: t("notif.tagDefault"), tagColor: "bg-gray-100 text-gray-600" };
    }
  };
  const getRelativeTime = (dateStr) => {
    const now = /* @__PURE__ */ new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1e3);
    if (diff < 60) return t("time.justNow");
    if (diff < 3600) return t("time.minutesAgo", { count: Math.floor(diff / 60) });
    if (diff < 86400) return t("time.hoursAgo", { count: Math.floor(diff / 3600) });
    if (diff < 604800) return t("time.daysAgo", { count: Math.floor(diff / 86400) });
    return date.toLocaleDateString();
  };
  const filteredNotifs = (() => {
    let result = notifFilter === "all" ? myNotifs : myNotifs.filter((n2) => {
      var _a;
      return (_a = NOTIF_CATEGORIES[notifFilter]) == null ? void 0 : _a.types.includes(n2.type);
    });
    if (unreadOnly) result = result.filter((n2) => n2.is_read == 0);
    return result;
  })();
  const handleNotifClick = (notif) => {
    if (notif.is_read == 0) {
      markAsRead(notif.id);
    }
    setShowNotifs(false);
    if (notif.type === "chat_message" || notif.type === "cs_message") {
      setShowChatPopup(true);
      return;
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const adminLinks = [
    { to: "/admin", icon: Home, label: t("sidebar.home") },
    { to: "/admin/dashboard", icon: LayoutDashboard, label: t("sidebar.adminDashboard") },
    { to: "/admin/analytics", icon: BarChart3, label: t("sidebar.analytics") },
    { to: "/admin/sellers", icon: ShoppingBag, label: t("sidebar.sellerDirectory") },
    { to: "/admin/hosts", icon: Building, label: t("sidebar.hostDirectory") },
    { to: "/admin/popular", icon: Flame, label: t("sidebar.popularSpaces") }
  ];
  const adminManagementLinks = [
    { to: "/admin/applications", icon: ClipboardList, label: t("sidebar.applicationManagement") },
    { to: "/admin/cancellations", icon: AlertTriangle, label: t("sidebar.cancellationRequests") },
    { to: "/admin/venues", icon: Store, label: t("sidebar.venueManagement") },
    { to: "/admin/promotions", icon: Flame, label: t("sidebar.recruitmentManagement") },
    { to: "/admin/users", icon: Users, label: t("sidebar.userManagement") },
    { to: "/admin/seller-stats", icon: TrendingUp, label: t("sidebar.sellerStatsManagement") },
    { to: "/admin/payments", icon: CreditCard, label: t("sidebar.paymentManagement") },
    { to: "/admin/host-report", icon: BarChart3, label: t("sidebar.analyticsReport") },
    { to: "/admin/ads", icon: Megaphone, label: t("sidebar.adManagement") },
    { to: "/admin/marketing", icon: Megaphone, label: t("sidebar.marketingManagement", "마케팅 관리") },
    { to: "/admin/vendor-management", icon: Truck, label: t("sidebar.vendorTransactionManagement", "벤더 거래 관리") },
    { to: "/admin/popups", icon: Monitor, label: t("sidebar.popupManagement") },
    { to: "/admin/security", icon: Shield, label: t("sidebar.securitySettings") },
    { to: "/admin/menu-visibility", icon: Eye, label: t("sidebar.menuVisibility") }
  ];
  const adminBottomLinks = [
    { to: "/admin/trash", icon: Trash2, label: t("sidebar.trash") },
    { to: "/admin/profile", icon: CircleUser, label: t("sidebar.myProfile") },
    { to: "/admin/notification-settings", icon: Bell, label: t("sidebar.notificationSettings", "알림 설정") },
    ...(user == null ? void 0 : user.role) === "superadmin" ? [{ to: "/admin/database", icon: Database, label: t("sidebar.dbManagement") }] : []
  ];
  const adminCommunityLinks = [
    { to: "/admin/community/general", icon: Users, label: t("sidebar.integratedCommunity") },
    { to: "/admin/community/seller", icon: ShoppingBag, label: t("sidebar.sellerCommunity") },
    { to: "/admin/community/host", icon: Store, label: t("sidebar.hostCommunity") }
  ];
  const sellerLinks = [
    { to: "/seller", icon: Home, label: t("sidebar.home") },
    { to: "/seller/applications", icon: ClipboardList, label: t("sidebar.applicationStatus") },
    { to: "/seller/hosts", icon: Building, label: t("sidebar.hostDirectory") },
    { to: "/seller/popular", icon: Flame, label: t("sidebar.popularSpaces") },
    { to: "/seller/proposals", icon: Inbox, label: t("sidebar.distributionProposals", "유통 제안") },
    { to: "/seller/shipments", icon: Package, label: t("sidebar.shippingManagement", "배송 관리") },
    { to: "/seller/settlements", icon: Wallet, label: t("sidebar.settlements", "정산") },
    { to: "/seller/stats", icon: TrendingUp, label: t("sidebar.salesManagement") },
    { to: "/seller/analytics", icon: BarChart3, label: t("sidebar.analytics") },
    { to: "/seller/marketing", icon: Megaphone, label: t("sidebar.marketing", "마케팅") }
  ];
  const sellerBottomLinks = [
    { to: "/seller/profile", icon: CircleUser, label: t("sidebar.myProfile") },
    { to: "/seller/notification-settings", icon: Bell, label: t("sidebar.notificationSettings", "알림 설정") },
    ...paymentEnabled ? [{ to: "/seller/payments", icon: CreditCard, label: t("sidebar.servicePayment") }] : []
  ];
  const sellerCommunityLinks = [
    { to: "/seller/community", icon: ShoppingBag, label: t("sidebar.sellerCommunity") },
    { to: "/seller/community/general", icon: Users, label: t("sidebar.integratedCommunity") }
  ];
  const hostLinks = [
    { to: "/host", icon: Home, label: t("sidebar.home") },
    { to: "/host/dashboard", icon: LayoutDashboard, label: t("sidebar.dashboard") },
    { to: "/host/sellers", icon: ShoppingBag, label: t("sidebar.sellerDirectory") },
    { to: "/host/stats", icon: TrendingUp, label: t("sidebar.salesManagement") },
    { to: "/host/analytics", icon: BarChart3, label: t("sidebar.analytics") },
    { to: "/host/report", icon: TrendingUp, label: t("sidebar.analyticsReport") },
    { to: "/host/marketing", icon: Megaphone, label: t("sidebar.marketing", "마케팅") }
  ];
  const hostManagementLinks = [
    { to: "/host/venues", icon: Store, label: t("sidebar.spaceManagement") },
    { to: "/host/applications", icon: ClipboardList, label: t("sidebar.applicationManagement") },
    { to: "/host/cancellations", icon: AlertTriangle, label: t("sidebar.cancellationRequests") }
  ];
  const hostBottomLinks = [
    { to: "/host/profile", icon: CircleUser, label: t("sidebar.myProfile") },
    { to: "/host/notification-settings", icon: Bell, label: t("sidebar.notificationSettings", "알림 설정") },
    ...paymentEnabled ? [{ to: "/host/payments", icon: CreditCard, label: t("sidebar.servicePayment") }] : []
  ];
  const hostCommunityLinks = [
    { to: "/host/community", icon: Store, label: t("sidebar.hostCommunity") },
    { to: "/host/community/general", icon: Users, label: t("sidebar.integratedCommunity") }
  ];
  const vendorLinks = [
    { to: "/vendor", icon: Home, label: t("sidebar.home") },
    { to: "/vendor/sellers", icon: ShoppingBag, label: t("sidebar.sellerDirectory") },
    { to: "/vendor/proposals", icon: Send, label: t("sidebar.distributionProposals", "유통 제안") },
    { to: "/vendor/shipments", icon: Package, label: t("sidebar.shippingManagement", "배송 관리") },
    { to: "/vendor/settlements", icon: Wallet, label: t("sidebar.settlements", "정산") },
    { to: "/vendor/chat", icon: MessageCircle, label: t("sidebar.chat", "채팅") }
  ];
  const vendorBottomLinks = [
    { to: "/vendor/profile", icon: CircleUser, label: t("sidebar.myProfile") },
    { to: "/vendor/notification-settings", icon: Bell, label: t("sidebar.notificationSettings", "알림 설정") }
  ];
  const isAdmin = (user == null ? void 0 : user.role) === "admin" || (user == null ? void 0 : user.role) === "superadmin";
  const isHost = (user == null ? void 0 : user.role) === "host";
  const isVendor = (user == null ? void 0 : user.role) === "vendor";
  const filterHidden = (items) => isAdmin ? items.filter((l2) => l2.to === "/admin/marketing" ? !hiddenMenus.includes(l2.to) : true) : items.filter((l2) => !hiddenMenus.includes(l2.to));
  const links = filterHidden(isAdmin ? adminLinks : isHost ? hostLinks : isVendor ? vendorLinks : sellerLinks);
  const managementLinks = filterHidden(isAdmin ? adminManagementLinks : isHost ? hostManagementLinks : []);
  const communityLinks = filterHidden(isAdmin ? adminCommunityLinks : isHost ? hostCommunityLinks : isVendor ? [] : sellerCommunityLinks);
  const bottomLinks = filterHidden(isAdmin ? adminBottomLinks : isHost ? hostBottomLinks : isVendor ? vendorBottomLinks : sellerBottomLinks);
  const allVisibleLinks = [...links, ...managementLinks, ...communityLinks, ...bottomLinks];
  reactExports.useEffect(() => {
    if (!user || isAdmin || hiddenMenus.length === 0 || allVisibleLinks.length === 0) return;
    const currentPath = location.pathname;
    const isIndex = currentPath === basePath || currentPath === basePath + "/";
    const isHidden = hiddenMenus.includes(currentPath);
    if (isIndex || isHidden) {
      const firstVisible = allVisibleLinks[0];
      if (firstVisible && firstVisible.to !== currentPath) {
        navigate(firstVisible.to, { replace: true });
      }
    }
  }, [hiddenMenus, location.pathname, allVisibleLinks, basePath, isAdmin, user]);
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  const renderSidebar = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-primary flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/favicon.png", alt: "SpaceMatch", className: "w-8 h-8 rounded-lg object-contain dark:brightness-0 dark:invert" }),
        "SpaceMatch"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setMobileMenuOpen(false),
          className: "lg:hidden text-gray-500 hover:text-gray-700 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 24 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mt-6 flex-1 overflow-y-auto pb-4", children: [
      links.map((link) => {
        const needsEnd = link.to === "/admin" || link.to === "/seller" || link.to === "/host" || link.to === "/vendor" || links.some((other) => other.to !== link.to && other.to.startsWith(link.to + "/"));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: link.to,
            onClick: () => setMobileMenuOpen(false),
            end: needsEnd,
            className: ({ isActive }) => `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary bg-indigo-50 border-r-4 border-primary" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { size: 20 }),
              link.label
            ]
          },
          link.to
        );
      }),
      isHost && managementLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setManagementOpen(!managementOpen),
            className: `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${managementOpen ? "text-primary bg-indigo-50/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: t("sidebar.mySpaceManagement") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `transition-transform duration-200 ${managementOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        managementOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50/50", children: managementLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: link.to,
            onClick: () => setMobileMenuOpen(false),
            className: ({ isActive }) => `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-primary bg-indigo-50 border-r-4 border-primary" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { size: 16 }),
              link.label
            ]
          },
          link.to
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setCommunityOpen(!communityOpen),
            className: `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${communityOpen ? "text-primary bg-indigo-50/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: t("sidebar.community") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `transition-transform duration-200 ${communityOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        communityOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50/50", children: communityLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: link.to,
            onClick: () => setMobileMenuOpen(false),
            end: communityLinks.some((other) => other.to !== link.to && other.to.startsWith(link.to + "/")),
            className: ({ isActive }) => `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-primary bg-indigo-50 border-r-4 border-primary" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { size: 16 }),
              link.label
            ]
          },
          link.to
        )) })
      ] }),
      !isHost && managementLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setManagementOpen(!managementOpen),
            className: `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${managementOpen ? "text-primary bg-indigo-50/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: t("sidebar.management") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `transition-transform duration-200 ${managementOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        managementOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50/50", children: managementLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: link.to,
            onClick: () => setMobileMenuOpen(false),
            className: ({ isActive }) => `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-primary bg-indigo-50 border-r-4 border-primary" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { size: 16 }),
              link.label
            ]
          },
          link.to
        )) })
      ] }),
      bottomLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        NavLink,
        {
          to: link.to,
          onClick: () => setMobileMenuOpen(false),
          className: ({ isActive }) => `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive ? "text-primary bg-indigo-50 border-r-4 border-primary" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { size: 20 }),
            link.label
          ]
        },
        link.to
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0 shadow-md", children: user.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.profile_image, alt: user.name, className: "w-full h-full object-cover" }) : user.name[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-white truncate", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500 dark:text-gray-400 font-medium", children: user.role === "superadmin" ? t("roleSuperAdmin") : user.role === "admin" ? t("roleAdmin") : user.role === "host" ? t("roleHost") : user.role === "vendor" ? t("roleVendor", "Vendor") : t("roleSeller") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: toggleTheme,
            className: "flex-1 h-9 flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all",
            title: isDark ? t("lightMode") : t("darkMode"),
            children: [
              isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold", children: isDark ? t("lightMode") : t("darkMode") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowNotifs(!showNotifs),
            className: "relative flex-1 h-9 flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all",
            title: t("notifications"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold", children: t("notifications") }),
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none", children: unreadCount > 99 ? "99+" : unreadCount })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSelector, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleLogout,
          className: "flex items-center justify-center gap-2 w-full h-9 text-[12px] font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 15 }),
            t("logout")
          ]
        }
      ) })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-950", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-primary", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileMenuOpen(true), className: "text-gray-600 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 24 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0", children: renderSidebar() }),
    mobileMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-40 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50", onClick: () => setMobileMenuOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-hidden", children: renderSidebar() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationPrompt, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingGuide, {}),
    showNotifs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/40 backdrop-blur-md",
          onClick: () => setShowNotifs(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-[480px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/50",
          style: { animation: "popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-shrink-0 relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, className: "text-white" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-white text-lg", children: t("notif.center") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-white/70", children: t("notif.countSummary", { total: myNotifs.length, unread: unreadCount }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => markAllAsRead(),
                      className: "text-xs text-white/90 hover:text-white font-bold hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all backdrop-blur-sm",
                      children: t("notif.markAllRead")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        setShowNotifs(false);
                        navigate(`${basePath}/notification-settings`);
                      },
                      className: "w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all",
                      title: "알림 설정",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setShowNotifs(false),
                      className: "w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 20 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 relative", children: [
                [{ key: "all", label: t("notif.all") }, { key: "application", label: t("notif.application") }, { key: "community", label: t("notif.community") }, { key: "venue", label: t("notif.venue") }, { key: "account", label: t("notif.account") }].map((tab) => {
                  const tabCount = tab.key === "all" ? myNotifs.filter((n2) => n2.is_read == 0).length : myNotifs.filter((n2) => {
                    var _a;
                    return ((_a = NOTIF_CATEGORIES[tab.key]) == null ? void 0 : _a.types.includes(n2.type)) && n2.is_read == 0;
                  }).length;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setNotifFilter(tab.key),
                      className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${notifFilter === tab.key ? "bg-white text-indigo-600 shadow-lg" : "bg-white/15 text-white/80 hover:bg-white/25 hover:text-white"}`,
                      children: [
                        tab.label,
                        tabCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-1 text-[10px] ${notifFilter === tab.key ? "text-indigo-400" : "text-white/50"}`, children: tabCount })
                      ]
                    },
                    tab.key
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setUnreadOnly(!unreadOnly),
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${unreadOnly ? "bg-white text-rose-500 shadow-lg" : "bg-white/15 text-white/80 hover:bg-white/25"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${unreadOnly ? "border-rose-500" : "border-white/60"}`, children: unreadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }) }),
                      t("notif.unreadOnly")
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filteredNotifs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2", children: filteredNotifs.map((n2) => {
              const meta = getNotifMeta(n2.type);
              const IconComp = meta.icon;
              const accent = getNotifAccent(n2.type);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-start gap-3 mx-3 my-1.5 px-4 py-3.5 cursor-pointer transition-all duration-200 rounded-2xl border-l-[3px] ${accent} ${n2.is_read == 0 ? "bg-indigo-50/60 hover:bg-indigo-50 shadow-sm" : "bg-gray-50/50 hover:bg-gray-100/50 opacity-60"}`,
                  onClick: () => handleNotifClick(n2),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shadow-sm`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComp, { size: 18, className: meta.color }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.tagColor}`, children: meta.tag }),
                        n2.is_read == 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-300 flex-shrink-0 animate-pulse" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm leading-relaxed line-clamp-2 ${n2.is_read == 0 ? "text-gray-900 font-semibold" : "text-gray-600"}`, children: n2.message }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400", children: getRelativeTime(n2.created_at) }),
                        n2.link && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-indigo-500 font-semibold", children: t("notif.goTo") })
                      ] })
                    ] })
                  ]
                },
                n2.id
              );
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mb-5 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 32, className: "text-gray-300" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-gray-400 mb-1", children: unreadOnly ? t("notif.emptyUnreadTitle") : t("notif.emptyTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300", children: unreadOnly ? t("notif.emptyUnreadDesc") : t("notif.emptyDesc") })
            ] }) }),
            myNotifs.some((n2) => n2.is_read == 1) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-gray-100 bg-gray-50/80 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => deleteReadNotifications(),
                className: "w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-colors font-bold",
                children: t("notif.deleteRead")
              }
            ) })
          ]
        }
      )
    ] }),
    showLoginPopup && loginPopups.length > 0 && (() => {
      const popup = loginPopups[currentPopupIndex];
      if (!popup) return null;
      const viewerLang = i18n.language || countryToLang(user == null ? void 0 : user.country);
      const localized = getPopupLocalized(popup, viewerLang);
      console.log("[Popup Render] i18n.language:", i18n.language, "user.country:", user == null ? void 0 : user.country, "→ viewerLang:", viewerLang, "| popup.translations:", popup.translations, "| showing:", localized);
      const dismissToday = () => {
        const today = (/* @__PURE__ */ new Date()).toDateString();
        localStorage.setItem(`popup_dismiss_${popup.id}`, today);
        if (currentPopupIndex < loginPopups.length - 1) setCurrentPopupIndex((i) => i + 1);
        else setShowLoginPopup(false);
      };
      const closePopup = () => {
        if (currentPopupIndex < loginPopups.length - 1) setCurrentPopupIndex((i) => i + 1);
        else setShowLoginPopup(false);
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4", onClick: closePopup, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden",
          onClick: (e) => e.stopPropagation(),
          style: { animation: "popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" },
          children: [
            popup.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              popup.click_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: popup.click_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: popup.image_url, alt: "", className: "w-full max-h-80 object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: popup.image_url, alt: "", className: "w-full max-h-80 object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closePopup, className: "absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 16 }) }),
              loginPopups.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 left-3 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full", children: [
                currentPopupIndex + 1,
                " / ",
                loginPopups.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              !popup.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${popup.popup_type === "notice" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`, children: popup.popup_type === "notice" ? t("popup.notice") : t("popup.ad") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closePopup, className: "text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 18 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-2", children: localized.title }),
              localized.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 whitespace-pre-wrap mb-4", children: localized.content }),
              popup.click_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: popup.click_url,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors mb-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
                    " ",
                    t("popup.viewDetails")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-3 border-t border-gray-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: closePopup,
                    className: "flex-1 py-2.5 text-gray-700 font-bold border border-gray-200 rounded-xl text-xs hover:bg-gray-50 transition-colors",
                    children: t("popup.close")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: dismissToday,
                    className: "flex-1 py-2.5 text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors",
                    children: t("popup.dismissToday")
                  }
                )
              ] })
            ] })
          ]
        }
      ) }, popup.id);
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes popupScale {
                    from { transform: scale(0.85) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen px-6 py-4 lg:px-20 lg:py-8 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-screen-xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowChatPopup(!showChatPopup),
            className: `fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 z-[9999] ${showChatPopup ? "bg-gray-800 hover:bg-gray-900 text-white shadow-xl shadow-gray-500/30 scale-90 rotate-90" : "bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-400 hover:via-violet-400 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110"}`,
            title: t("sidebar.chat"),
            children: [
              showChatPopup ? /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 24 }),
              !showChatPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" })
            ]
          }
        ),
        showChatPopup && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9997] lg:hidden",
              onClick: () => setShowChatPopup(false)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed z-[9998] flex flex-col overflow-hidden\r\n                                    bottom-4 right-4 left-4 top-20\r\n                                    sm:left-auto sm:top-auto sm:bottom-24 sm:right-6 sm:w-[620px] sm:h-[580px]\r\n                                    lg:bottom-28 lg:right-10 lg:w-[680px] lg:h-[640px]\r\n                                    bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-100",
              style: { animation: "chatPopupSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white flex-shrink-0 overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0 opacity-10",
                      style: { backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.2) 0%, transparent 40%)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm leading-tight", children: t("sidebar.chat") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-emerald-400 rounded-full" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/70 font-medium", children: "Online" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setShowChatPopup(false),
                      className: "relative w-8 h-8 flex items-center justify-center hover:bg-white/15 rounded-xl transition-colors duration-200",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 18 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPage$1, { isPopup: true }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        @keyframes chatPopupSlide {
                            from { transform: translateY(24px) scale(0.92); opacity: 0; }
                            to { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    ` })
      ] })
    ] })
  ] });
};
const Login = () => {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");
  const prefillEmail = searchParams.get("email");
  reactExports.useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);
  const isSafeRedirect = (url) => {
    try {
      const parsed = new URL(url);
      const currentHost = window.location.hostname;
      return parsed.hostname === currentHost || parsed.hostname === "spacematch.net" || parsed.hostname.endsWith(".spacematch.net");
    } catch {
      return false;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((result) => {
      var _a;
      if (result.success) {
        if (redirectUri && isSafeRedirect(redirectUri)) {
          window.location.href = redirectUri;
          return;
        }
        const role = (_a = result.user) == null ? void 0 : _a.role;
        if (role === "superadmin" || role === "admin") {
          navigate("/admin");
        } else if (role === "host") {
          navigate("/host");
        } else if (role === "vendor") {
          navigate("/vendor");
        } else {
          navigate("/seller");
        }
      } else {
        setError(result.message);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-primary", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-2", children: t("loginSubtitle") })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all",
              placeholder: "email@example.com",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("password") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all",
              placeholder: "••••••••",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          className: "w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg",
          children: t("login")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-center gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/find-email", className: "text-gray-500 hover:text-primary transition-colors", children: t("findEmailTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reset-password", className: "text-gray-500 hover:text-primary transition-colors", children: t("resetPasswordTitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
        t("noAccount"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: `/signup${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}${prefillEmail ? `&email=${encodeURIComponent(prefillEmail)}` : ""}` : ""}`,
            className: "text-primary hover:underline font-medium",
            children: t("signup")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "mailto:spacedotmatch@gmail.com?subject=[SpaceMatch] 문의사항",
          className: "mt-4 flex items-center justify-center gap-2 w-full py-2 text-center bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium transition-colors border border-indigo-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16 }),
            t("inquiry")
          ]
        }
      ),
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
const TERM_KEYS = ["terms", "privacy", "marketing"];
const TERM_ICONS = { terms: FileText, privacy: Shield, marketing: Megaphone };
const TERM_REQUIRED = { terms: true, privacy: true, marketing: false };
const TermItem = ({ termKey, title, required, requiredLabel, optionalLabel, content, checked, onCheck, expanded, onToggle }) => {
  const Icon = TERM_ICONS[termKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-xl overflow-hidden transition-all duration-300 ${checked ? "border-indigo-200 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-600"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCheck,
          className: `flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-500 hover:border-indigo-400"}`,
          children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, className: "text-white", strokeWidth: 3 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: `flex-shrink-0 ${checked ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${checked ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`, children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-bold px-1.5 py-0.5 rounded ${required ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`, children: required ? requiredLabel : optionalLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onToggle,
          className: "flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 16,
              className: `text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg p-4 max-h-[260px] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-sans", children: content }) }) })
      }
    )
  ] });
};
const TermsAgreement = ({ userType = "seller", agreements, onAgreementsChange }) => {
  const [expandedItems, setExpandedItems] = reactExports.useState({});
  const { t } = useTranslation("auth");
  const prefix = userType === "host" ? "hostTerms" : "sellerTerms";
  const allChecked = TERM_KEYS.every((key) => agreements[key]);
  const requiredAllChecked = TERM_KEYS.filter((k2) => TERM_REQUIRED[k2]).every((k2) => agreements[k2]);
  const handleToggleExpand = (key) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleCheck = (key) => {
    onAgreementsChange({ ...agreements, [key]: !agreements[key] });
  };
  const handleAllCheck = () => {
    const newVal = !allChecked;
    const updated = {};
    TERM_KEYS.forEach((key) => {
      updated[key] = newVal;
    });
    onAgreementsChange(updated);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2", children: t("termsTitle") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: handleAllCheck,
        className: `flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${allChecked ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${allChecked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-500"}`, children: allChecked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "text-white", strokeWidth: 3 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-extrabold ${allChecked ? "text-indigo-700 dark:text-indigo-300" : "text-gray-800 dark:text-gray-200"}`, children: t("termsAgreeAll") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500 ml-auto", children: t("termsIncludesOptional") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: TERM_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TermItem,
      {
        termKey: key,
        title: t(`${prefix}.${key}.title`),
        required: TERM_REQUIRED[key],
        requiredLabel: t("termsRequired"),
        optionalLabel: t("termsOptional"),
        content: t(`${prefix}.${key}.content`),
        checked: !!agreements[key],
        onCheck: () => handleCheck(key),
        expanded: !!expandedItems[key],
        onToggle: () => handleToggleExpand(key)
      },
      key
    )) }),
    !requiredAllChecked && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 dark:text-red-400 font-medium mt-1", children: t("termsRequiredWarning") })
  ] });
};
const isRequiredAgreed = (agreements, userType = "seller") => {
  return TERM_KEYS.filter((k2) => TERM_REQUIRED[k2]).every((k2) => agreements[k2]);
};
const SELLER_KEYWORD_KEYS = [
  "handmade",
  "vintage",
  "eco",
  "premium",
  "costEffective",
  "trendy",
  "organic",
  "local",
  "aesthetic",
  "minimal",
  "luxury",
  "natural",
  "modern",
  "classic",
  "unique"
];
const VENDOR_KEYWORD_KEYS = [
  "departmentStore",
  "shoppingMall",
  "popupStore",
  "fleaMarket",
  "roadShop",
  "cafe",
  "gallery",
  "hotel",
  "office",
  "coworking",
  "exhibition",
  "selectShop",
  "market",
  "festival",
  "otherSpace"
];
const KeywordSelector = ({ type = "seller", value = [], onChange, maxKeywords = 10 }) => {
  const [customInput, setCustomInput] = reactExports.useState("");
  const { t } = useTranslation("auth");
  const keywordKeys = type === "host" ? VENDOR_KEYWORD_KEYS : SELLER_KEYWORD_KEYS;
  const prefix = type === "host" ? "hostKeywords" : "sellerKeywords";
  const getLabel = (key) => t(`${prefix}.${key}`);
  const toggleKeyword = (kw) => {
    if (value.includes(kw)) {
      onChange(value.filter((v2) => v2 !== kw));
    } else if (value.length < maxKeywords) {
      onChange([...value, kw]);
    }
  };
  const addCustomKeyword = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setCustomInput("");
      return;
    }
    if (value.length >= maxKeywords) return;
    onChange([...value, trimmed]);
    setCustomInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomKeyword();
    }
  };
  const removeKeyword = (kw) => {
    onChange(value.filter((v2) => v2 !== kw));
  };
  const displayLabel = (kw) => {
    const idx = keywordKeys.indexOf(kw);
    if (idx >= 0) return getLabel(kw);
    return kw;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [
      t("keywordSelection"),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 font-normal text-xs", children: [
        "(",
        t("keywordMax", { max: maxKeywords }),
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: keywordKeys.map((kw) => {
      const isSelected = value.includes(kw);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => toggleKeyword(kw),
          className: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`,
          children: getLabel(kw)
        },
        kw
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 14 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: customInput,
            onChange: (e) => setCustomInput(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: t("keywordCustomPlaceholder"),
            className: "w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
            maxLength: 20,
            disabled: value.length >= maxKeywords
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: addCustomKeyword,
          disabled: !customInput.trim() || value.length >= maxKeywords,
          className: "px-3 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            t("keywordAdd")
          ]
        }
      )
    ] }),
    value.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
      value.map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-bold", children: [
        displayLabel(kw),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeKeyword(kw), className: "hover:text-red-500 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 12 }) })
      ] }, kw)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-400 self-center ml-1", children: [
        value.length,
        "/",
        maxKeywords
      ] })
    ] })
  ] });
};
const BUSINESS_REG_CONFIG = {
  // 🇰🇷 한국 — 사업자등록번호
  ko: {
    labelKey: "businessReg.ko.label",
    placeholder: "000-00-00000",
    helpKey: "businessReg.ko.help",
    maxLength: 12,
    // 숫자 10자리 (하이픈 포함 12자)
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 10) return "businessReg.ko.errLength";
      const checkKeys = [1, 3, 7, 1, 3, 7, 1, 3, 5];
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * checkKeys[i];
      sum += Math.floor(parseInt(digits[8]) * 5 / 10);
      const checkDigit = (10 - sum % 10) % 10;
      if (checkDigit !== parseInt(digits[9])) return "businessReg.ko.errInvalid";
      return null;
    },
    format: (value) => {
      const digits = value.replace(/[^0-9]/g, "").slice(0, 10);
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }
  },
  // 🇯🇵 일본 — 法人番号 (법인번호)
  ja: {
    labelKey: "businessReg.ja.label",
    placeholder: "0000000000000",
    helpKey: "businessReg.ja.help",
    maxLength: 13,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 13) return "businessReg.ja.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9]/g, "").slice(0, 13);
    }
  },
  // 🇺🇸 미국 — EIN (Employer Identification Number)
  en: {
    labelKey: "businessReg.en.label",
    placeholder: "00-0000000",
    helpKey: "businessReg.en.help",
    maxLength: 10,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 9) return "businessReg.en.errLength";
      return null;
    },
    format: (value) => {
      const digits = value.replace(/[^0-9]/g, "").slice(0, 9);
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
  },
  // 🇬🇧 영국 — Company Registration Number
  "en-GB": {
    labelKey: "businessReg.enGB.label",
    placeholder: "00000000",
    helpKey: "businessReg.enGB.help",
    maxLength: 8,
    validate: (value) => {
      const cleaned = value.replace(/\s/g, "");
      if (cleaned.length !== 8) return "businessReg.enGB.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
    }
  },
  // 🇨🇦 캐나다 (영어) — Business Number (BN)
  "en-CA": {
    labelKey: "businessReg.enCA.label",
    placeholder: "000000000",
    helpKey: "businessReg.enCA.help",
    maxLength: 15,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 9 && digits.length !== 15) return "businessReg.enCA.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9A-Za-z\s]/g, "").slice(0, 15);
    }
  },
  // 🇨🇦 캐나다 (프랑스어) — Numéro d'entreprise (NE)
  "fr-CA": {
    labelKey: "businessReg.frCA.label",
    placeholder: "000000000",
    helpKey: "businessReg.frCA.help",
    maxLength: 15,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 9 && digits.length !== 15) return "businessReg.frCA.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9A-Za-z\s]/g, "").slice(0, 15);
    }
  },
  // 🇻🇳 베트남 — Mã số thuế (세금코드)
  vi: {
    labelKey: "businessReg.vi.label",
    placeholder: "0000000000",
    helpKey: "businessReg.vi.help",
    maxLength: 14,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length < 10 || digits.length > 13) return "businessReg.vi.errLength";
      return null;
    },
    format: (value) => {
      const digits = value.replace(/[^0-9]/g, "").slice(0, 13);
      if (digits.length <= 10) return digits;
      return `${digits.slice(0, 10)}-${digits.slice(10)}`;
    }
  },
  // 🇹🇭 태국 — เลขทะเบียนนิติบุคคล (법인등록번호)
  th: {
    labelKey: "businessReg.th.label",
    placeholder: "0000000000000",
    helpKey: "businessReg.th.help",
    maxLength: 13,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 13) return "businessReg.th.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9]/g, "").slice(0, 13);
    }
  },
  // 🇰🇭 캄보디아 — TIN (세금식별번호)
  km: {
    labelKey: "businessReg.km.label",
    placeholder: "L001-12345678",
    helpKey: "businessReg.km.help",
    maxLength: 20,
    validate: (value) => {
      const cleaned = value.replace(/\s/g, "");
      if (cleaned.length < 5) return "businessReg.km.errLength";
      return null;
    },
    format: (value) => {
      return value.slice(0, 20);
    }
  },
  // 🇷🇺 러시아 — ИНН (납세자번호)
  ru: {
    labelKey: "businessReg.ru.label",
    placeholder: "0000000000",
    helpKey: "businessReg.ru.help",
    maxLength: 12,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 10 && digits.length !== 12) return "businessReg.ru.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9]/g, "").slice(0, 12);
    }
  },
  // 🇺🇦 우크라이나 — ЄДРПОУ / ІПН
  uk: {
    labelKey: "businessReg.uk.label",
    placeholder: "00000000",
    helpKey: "businessReg.uk.help",
    maxLength: 10,
    validate: (value) => {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length !== 8 && digits.length !== 10) return "businessReg.uk.errLength";
      return null;
    },
    format: (value) => {
      return value.replace(/[^0-9]/g, "").slice(0, 10);
    }
  }
};
const getBusinessRegConfig = (countryCode) => {
  return BUSINESS_REG_CONFIG[countryCode] || BUSINESS_REG_CONFIG["en"];
};
const validateBusinessReg = (value, countryCode) => {
  if (!value || !value.trim()) return null;
  const config = getBusinessRegConfig(countryCode);
  return config.validate(value);
};
const formatBusinessReg = (value, countryCode) => {
  const config = getBusinessRegConfig(countryCode);
  return config.format(value);
};
const validateRealName = (value) => {
  if (!value || !value.trim()) return "실명을 입력해주세요.";
  const trimmed = value.trim();
  if (trimmed.length < 2) return "실명은 2자 이상 입력해주세요.";
  if (trimmed.length > 20) return "실명은 20자 이하로 입력해주세요.";
  if (/[0-9]/.test(trimmed)) return "실명에 숫자를 포함할 수 없습니다.";
  if (/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]/.test(trimmed)) return "실명에 특수문자를 포함할 수 없습니다.";
  return null;
};
const validateBusinessName = (value) => {
  if (!value || !value.trim()) return "브랜드명(업체명)을 입력해주세요.";
  const trimmed = value.trim();
  if (trimmed.length < 2) return "브랜드명은 2자 이상 입력해주세요.";
  if (trimmed.length > 50) return "브랜드명은 50자 이하로 입력해주세요.";
  if (/^[0-9\s]+$/.test(trimmed)) return "브랜드명을 올바르게 입력해주세요.";
  return null;
};
const validateBusinessNumber = (value, countryCode = "ko") => {
  return validateBusinessReg(value, countryCode);
};
const formatBusinessNumber = (value, countryCode = "ko") => {
  return formatBusinessReg(value, countryCode);
};
const validatePhone = (value) => {
  if (!value || !value.trim()) return "전화번호를 입력해주세요.";
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.startsWith("010")) {
    if (digits.length !== 11) return "휴대폰 번호는 11자리입니다. (예: 010-1234-5678)";
    return null;
  }
  if (digits.startsWith("02")) {
    if (digits.length < 9 || digits.length > 10) return "전화번호 형식이 올바르지 않습니다.";
    return null;
  }
  if (/^0[1-9]/.test(digits)) {
    if (digits.length < 10 || digits.length > 11) return "전화번호 형식이 올바르지 않습니다.";
    return null;
  }
  return "올바른 전화번호를 입력해주세요. (예: 010-1234-5678)";
};
const formatPhone = (value) => {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};
const validateEmail = (value) => {
  if (!value || !value.trim()) return "이메일을 입력해주세요.";
  const trimmed = value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return "올바른 이메일 형식으로 입력해주세요. (예: example@email.com)";
  const domain = trimmed.split("@")[1];
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes(".."))
    return "이메일 도메인이 올바르지 않습니다.";
  return null;
};
const validatePassword = (value) => {
  if (!value) return "비밀번호를 입력해주세요.";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  return null;
};
const validateSignupForm = (formData, userType = "seller") => {
  const errors = {};
  const realNameErr = validateRealName(formData.realName);
  if (realNameErr) errors.realName = realNameErr;
  const nameErr = validateBusinessName(formData.name);
  if (nameErr) errors.name = nameErr;
  const bnErr = validateBusinessNumber(formData.businessNumber, formData.country || "ko");
  if (bnErr) errors.businessNumber = bnErr;
  const phoneErr = validatePhone(formData.phone);
  if (phoneErr) errors.phone = phoneErr;
  const emailErr = validateEmail(formData.email);
  if (emailErr) errors.email = emailErr;
  const passErr = validatePassword(formData.password);
  if (passErr) errors.password = passErr;
  return errors;
};
const Signup = () => {
  const navigate = useNavigate();
  const { signup, login, sendVerification, verifyEmail } = useAuth();
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");
  const prefillEmail = searchParams.get("email");
  const [formData, setFormData] = reactExports.useState({
    email: "",
    password: "",
    realName: "",
    name: "",
    nameEn: "",
    businessNumber: "",
    phone: "",
    country: "ko",
    category: "fashion",
    instagram: "",
    description: "",
    keywords: []
  });
  reactExports.useEffect(() => {
    if (prefillEmail) {
      setFormData((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);
  const isSafeRedirect = (url) => {
    try {
      const parsed = new URL(url);
      const currentHost = window.location.hostname;
      return parsed.hostname === currentHost || parsed.hostname === "spacematch.net" || parsed.hostname.endsWith(".spacematch.net");
    } catch {
      return false;
    }
  };
  const [error, setError] = reactExports.useState("");
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
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
        return validateBusinessNumber(value, formData.country);
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
    if (name === "businessNumber") value = formatBusinessNumber(value, formData.country);
    if (name === "phone") value = formatPhone(value);
    if (name === "country") {
      setFormData((prev) => ({ ...prev, country: value, businessNumber: "" }));
      setFieldErrors((prev) => ({ ...prev, businessNumber: null }));
      setTouched((prev) => ({ ...prev, businessNumber: false }));
      return;
    }
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
    if (result.success && result.verified) {
      setEmailVerified(true);
    } else {
      setVerificationError(result.message);
    }
  };
  React$1.useEffect(() => {
    if (cooldown <= 0) return;
    const t2 = setTimeout(() => setCooldown((c) => c - 1), 1e3);
    return () => clearTimeout(t2);
  }, [cooldown]);
  React$1.useEffect(() => {
    if (expiresIn <= 0 || emailVerified) return;
    const t2 = setTimeout(() => setExpiresIn((e) => e - 1), 1e3);
    return () => clearTimeout(t2);
  }, [expiresIn, emailVerified]);
  React$1.useEffect(() => {
    setEmailVerified(false);
    setVerificationSent(false);
    setVerificationCode("");
    setVerificationError("");
  }, [formData.email]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignupForm(formData, "seller");
    setFieldErrors(errors);
    setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });
    if (Object.keys(errors).length > 0) {
      setError(t("formValidationError"));
      return;
    }
    if (!isRequiredAgreed(agreements, "seller")) {
      setError(t("termsRequired"));
      return;
    }
    setError("");
    signup({ ...formData, marketing_agreed: agreements.marketing }).then((result) => {
      if (result.success) {
        login(formData.email, formData.password).then(() => {
          if (redirectUri && isSafeRedirect(redirectUri)) {
            window.location.href = redirectUri;
            return;
          }
          navigate("/seller");
        });
      } else {
        setError(result.message);
      }
    });
  };
  const FieldError = ({ name }) => {
    if (!touched[name] || !fieldErrors[name]) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 mt-1 text-xs text-red-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 12 }),
      fieldErrors[name]
    ] });
  };
  const inputClass = (name) => `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${touched[name] && fieldErrors[name] ? "border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800 bg-red-50/30 dark:bg-red-900/20" : touched[name] && !fieldErrors[name] && formData[name] ? "border-green-400 focus:ring-green-200 dark:border-green-500 dark:focus:ring-green-800" : "border-gray-200 dark:border-gray-600 focus:ring-primary"}`;
  const hasFormErrors = Object.values(fieldErrors).some((e) => e);
  const isValid = !hasFormErrors && isRequiredAgreed(agreements, "seller") && emailVerified;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900 py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-primary", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2", children: t("sellerSignupTitle") })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
      error
    ] }),
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
            t("brandNameLabel"),
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
                placeholder: t("brandPlaceholder")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "name" })
        ] })
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: (() => {
          const bizConfig = getBusinessRegConfig(formData.country);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: [
              t(bizConfig.labelKey, t("businessNumber")),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 dark:text-gray-500 text-xs", children: [
                "(",
                t("optional"),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  name: "businessNumber",
                  value: formData.businessNumber,
                  onChange: handleChange,
                  onBlur: handleBlur,
                  className: inputClass("businessNumber"),
                  placeholder: bizConfig.placeholder,
                  maxLength: bizConfig.maxLength
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children: t(bizConfig.helpKey, "") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { name: "businessNumber" })
          ] });
        })() }),
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
                placeholder: "contact@brand.com"
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
          t("nameEn"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 dark:text-gray-500 text-xs", children: [
            "(",
            t("optional"),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500", size: 18 }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("categoryLabel") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              name: "category",
              value: ["fashion", "beauty", "food", "living", "art", "stationery", "digital", "activity", "eco", "pet", "kids", "handmade", "vintage", "perfume", "book"].includes(formData.category) ? formData.category : "other",
              onChange: (e) => {
                const val = e.target.value;
                if (val === "other") {
                  setFormData({ ...formData, category: "" });
                } else {
                  setFormData({ ...formData, category: val });
                }
              },
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 appearance-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fashion", children: t("categories.fashion") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "beauty", children: t("categories.beauty") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "food", children: t("categories.food") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "living", children: t("categories.living") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "art", children: t("categories.art") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "stationery", children: t("categories.stationery") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "digital", children: t("categories.digital") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "activity", children: t("categories.activity") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "eco", children: t("categories.eco") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pet", children: t("categories.pet") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "kids", children: t("categories.kids") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "handmade", children: t("categories.handmade") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vintage", children: t("categories.vintage") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "perfume", children: t("categories.perfume") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "book", children: t("categories.book") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: t("categories.other") })
              ]
            }
          )
        ] }),
        !["fashion", "beauty", "food", "living", "art", "stationery", "digital", "activity", "eco", "pet", "kids", "handmade", "vintage", "perfume", "book"].includes(formData.category) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            name: "category",
            value: formData.category,
            onChange: handleChange,
            placeholder: t("customCategoryPlaceholder"),
            className: "w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("instagramAccount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "instagram",
              value: formData.instagram,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
              placeholder: "@brand_official"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("brandDescription") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            name: "description",
            value: formData.description,
            onChange: handleChange,
            rows: "3",
            className: "w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
            placeholder: t("brandDescPlaceholder")
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
          userType: "seller",
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
const SignupHost = () => {
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
    role: "host",
    keywords: []
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
  React$1.useEffect(() => {
    if (cooldown <= 0) return;
    const t2 = setTimeout(() => setCooldown((c) => c - 1), 1e3);
    return () => clearTimeout(t2);
  }, [cooldown]);
  React$1.useEffect(() => {
    if (expiresIn <= 0 || emailVerified) return;
    const t2 = setTimeout(() => setExpiresIn((e) => e - 1), 1e3);
    return () => clearTimeout(t2);
  }, [expiresIn, emailVerified]);
  React$1.useEffect(() => {
    setEmailVerified(false);
    setVerificationSent(false);
    setVerificationCode("");
    setVerificationError("");
  }, [formData.email]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignupForm(formData, "host");
    setFieldErrors(errors);
    setTouched({ realName: true, name: true, businessNumber: true, phone: true, email: true, password: true });
    if (Object.keys(errors).length > 0) {
      setError(t("formValidationError"));
      return;
    }
    if (!isRequiredAgreed(agreements, "host")) {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "text-amber-600", size: 36 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-3", children: t("signupDone") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-2", children: t("hostSignupDone") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-800 font-semibold text-sm", children: [
          "⏳ ",
          t("pendingApproval")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-700 text-sm mt-1", children: [
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
  const isValid = !hasFormErrors && isRequiredAgreed(agreements, "host") && emailVerified;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-gray-900 py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-primary", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2", children: t("hostSubtitle") })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-700 dark:text-blue-300 text-xs font-medium", children: [
      "ℹ️ ",
      t("hostApprovalNotice")
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
            t("companyHostName"),
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
                placeholder: t("companyPlaceholder")
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
                placeholder: "host@example.com"
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KeywordSelector,
        {
          type: "host",
          value: formData.keywords,
          onChange: (kws) => setFormData((prev) => ({ ...prev, keywords: kws }))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TermsAgreement,
        {
          userType: "host",
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
const SignupSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f1117] px-4 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl p-8 bg-white dark:bg-[#1a1b2e] rounded-2xl shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-[#2e3050] transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4", children: "SpaceMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-gray-500 dark:text-gray-400", children: t("selectSignupType") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => navigate("/signup/seller"),
        className: "w-full flex flex-col items-center p-10 border-2 border-indigo-200 dark:border-indigo-700/50 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/10 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 transition-all group mb-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-indigo-200/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-12 h-12 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3", children: t("sellerTypeTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-5", children: t("sellerTypeDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2 mb-5", children: [
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 13 }), text: "매출 대시보드" },
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 13 }), text: "세무 자동 알림" },
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }), text: "셀러 커뮤니티" }
          ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 12, className: "flex-shrink-0" }),
            item.text
          ] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-base shadow-lg group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all", children: [
            "매출 관리 시작하기",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center pt-4 border-t border-gray-100 dark:border-gray-700/50 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: [
        "행사를 주최하시나요?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/signup/host"),
            className: "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors",
            children: "호스트로 가입하기"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: [
        "유통/납품 사업자이신가요?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/signup/vendor"),
            className: "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors",
            children: "벤더로 가입하기"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: [
      t("alreadyHaveAccount"),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-indigo-600 dark:text-indigo-400 hover:underline font-bold", children: t("login") })
    ] }) })
  ] }) });
};
const FindEmail = () => {
  const { t } = useTranslation("auth");
  const [formData, setFormData] = reactExports.useState({ name: "", phone: "" });
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError(t("findEmailAllRequired"));
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/auth/find_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.email);
      } else {
        setError(data.message || t("findEmailNoResult"));
      }
    } catch (err) {
      setError(t("findEmailError"));
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "text-primary", size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t("findEmailTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2 text-sm", children: t("findEmailDesc") })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm", children: error }),
    result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mx-auto text-green-600 dark:text-green-400 mb-3", size: 32 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: t("findEmailResult") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-gray-900 dark:text-white tracking-wide", children: result })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            className: "block w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors text-center",
            children: t("goToLogin")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/reset-password",
            className: "block w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-center",
            children: t("resetPasswordTitle")
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: t("namePlaceholder"),
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("phone") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              name: "phone",
              value: formData.phone,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: "010-0000-0000",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "..." : t("findEmailBtn")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
      t("backToLogin")
    ] }) })
  ] }) });
};
const ResetPassword = () => {
  const { t } = useTranslation("auth");
  useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [formData, setFormData] = reactExports.useState({ email: "", name: "", phone: "" });
  const [passwords, setPasswords] = reactExports.useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.name.trim() || !formData.phone.trim()) {
      setError(t("resetAllRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", ...formData }),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setStep(2);
      } else {
        setError(data.message || t("resetVerifyFailed"));
      }
    } catch (err) {
      setError(t("resetError"));
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      setError(t("resetPasswordMinLength"));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          ...formData,
          newPassword: passwords.newPassword
        }),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || t("resetFailed"));
      }
    } catch (err) {
      setError(t("resetError"));
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-secondary dark:bg-[#0f1117] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md p-6 md:p-8 bg-white dark:bg-[#1a1b2e] rounded-xl shadow-lg dark:shadow-black/40 dark:border dark:border-[#2e3050]", children: step === 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "text-green-600 dark:text-green-400", size: 40 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-3", children: t("resetSuccess") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-8", children: t("resetSuccessDesc") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/login",
        className: "block w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors text-center",
        children: t("goToLogin")
      }
    )
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-amber-600 dark:text-amber-400", size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t("resetPasswordTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-2 text-sm", children: step === 1 ? t("resetStep1Desc") : t("resetStep2Desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}` })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm", children: error }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerify, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              name: "email",
              value: formData.email,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: "email@example.com",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: t("namePlaceholder"),
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("phone") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              name: "phone",
              value: formData.phone,
              onChange: handleChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: "010-0000-0000",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "..." : t("verifyIdentity")
        }
      )
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleReset, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400 mb-2", children: [
        "✅ ",
        t("identityVerified")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("newPassword") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              name: "newPassword",
              value: passwords.newPassword,
              onChange: handlePasswordChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: t("passwordPlaceholder"),
              minLength: 8,
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t("confirmPassword") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              name: "confirmPassword",
              value: passwords.confirmPassword,
              onChange: handlePasswordChange,
              className: "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-[#0f1117] dark:text-white",
              placeholder: t("passwordPlaceholder"),
              minLength: 8,
              required: true
            }
          )
        ] }),
        passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: t("passwordMismatch") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
          children: loading ? "..." : t("changePassword")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
      t("backToLogin")
    ] }) })
  ] }) }) });
};
const PublicNav = ({ transparent = false }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation("landing");
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [mobileMenu, setMobileMenu] = reactExports.useState(false);
  const location = useLocation();
  reactExports.useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);
  reactExports.useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);
  const navLinks = [
    { label: t("nav.services"), path: "/services" },
    { label: t("nav.howItWorks"), path: "/how-it-works" },
    { label: t("recruitment.title"), path: "/recruitment" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.contact"), path: "/contact" }
  ];
  const isActive = (path) => location.pathname === path;
  const shouldBeTransparent = transparent && !scrolled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shouldBeTransparent ? "bg-transparent py-4 md:py-5" : "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)] py-2.5 md:py-3"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/favicon.png",
            alt: "SpaceMatch",
            className: "w-8 h-8 md:w-9 md:h-9 rounded-xl object-contain transition-all duration-300"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg md:text-xl font-extrabold tracking-tight transition-colors duration-300 text-gray-900", children: "SpaceMatch" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-1 lg:gap-1.5", children: [
        navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: link.path,
            className: `px-3 lg:px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${isActive(link.path) ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"}`,
            children: link.label
          },
          link.path
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 mx-2 bg-gray-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/login",
            className: "flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 shadow-lg hover:-translate-y-0.5 ml-2 bg-indigo-600 text-white shadow-indigo-200/60 hover:bg-indigo-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 15 }),
              t("nav.login")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggleTheme,
            className: "ml-1 p-2 rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100",
            children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSelector, { compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggleTheme,
            className: "p-2 rounded-xl transition-all text-gray-500 hover:bg-gray-100",
            children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSelector, { compact: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileMenu(!mobileMenu),
            className: "p-2 rounded-xl transition-all text-gray-700 hover:bg-gray-100",
            children: mobileMenu ? /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 22 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 22 })
          }
        )
      ] })
    ] }),
    mobileMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border-t border-gray-100 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-0.5", children: [
      navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: link.path,
          className: `block w-full text-left px-4 py-3 font-semibold rounded-xl transition-colors ${isActive(link.path) ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"}`,
          children: link.label
        },
        link.path
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-gray-100 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16 }),
        t("nav.login")
      ] }) })
    ] }) })
  ] });
};
const PublicFooter = () => {
  const { t } = useTranslation("landing");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-gray-950 text-white py-5 md:py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap justify-center md:justify-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-1.5 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/favicon.png", alt: "SpaceMatch", className: "w-6 h-6 rounded-md object-contain brightness-0 invert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-sm", children: "SpaceMatch" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "hover:text-white transition-colors", children: t("nav.services") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/how-it-works", className: "hover:text-white transition-colors", children: t("nav.howItWorks") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-white transition-colors", children: t("nav.about") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-white transition-colors", children: t("nav.contact") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup/host", className: "text-gray-600 hover:text-gray-400 transition-colors", children: "행사 주최자" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-gray-600 text-center md:text-right leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("footer.businessInfo") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1.5 hidden md:inline", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "md:hidden" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:spacedotmatch@gmail.com", className: "text-indigo-400 hover:underline", children: "spacedotmatch@gmail.com" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1.5", children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("footer.copyright", { year: (/* @__PURE__ */ new Date()).getFullYear() }) })
    ] })
  ] }) }) });
};
const API_BASE$3 = "/api/ads";
const AdSlot = ({ slotId, format = "banner", className = "", country = "" }) => {
  var _a;
  const [ad2, setAd] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [adsenseConfig, setAdsenseConfig] = reactExports.useState(null);
  const [isMobile, setIsMobile] = reactExports.useState(window.innerWidth <= 768);
  reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  reactExports.useEffect(() => {
    let cancelled = false;
    const fetchAd = async () => {
      try {
        const params = new URLSearchParams({ slot_id: slotId });
        if (country) params.set("country", country);
        const res = await fetch(`${API_BASE$3}/get_ads.php?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setAd(data.ad || null);
        }
        if (!data.ad) {
          try {
            const res2 = await fetch(`${API_BASE$3}/adsense_config.php`, { credentials: "include" });
            if (res2.ok) {
              const data2 = await res2.json();
              if (!cancelled && data2.success && data2.config) {
                setAdsenseConfig(data2.config);
              }
            }
          } catch {
          }
        }
      } catch (err) {
      }
      if (!cancelled) setLoading(false);
    };
    fetchAd();
    return () => {
      cancelled = true;
    };
  }, [slotId, country]);
  const getImageUrl = () => {
    if (!ad2) return null;
    if (isMobile && ad2.mobile_image_url) return ad2.mobile_image_url;
    return ad2.image_url;
  };
  const handleClick = async () => {
    if (!ad2) return;
    try {
      await fetch(`${API_BASE$3}/track_click.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_id: ad2.id })
      });
    } catch {
    }
    if (ad2.click_url) {
      window.open(ad2.click_url, "_blank", "noopener,noreferrer");
    }
  };
  if (loading) {
    if (format === "card") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden animate-pulse ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] bg-gray-100" }) });
    }
    if (format === "native") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-gray-100 rounded w-16 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-100 rounded w-3/4 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 bg-gray-50 rounded-xl" })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full flex justify-center py-3 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[150px] md:h-[250px] bg-gray-50 rounded-2xl border border-dashed border-gray-200 animate-pulse" }) });
  }
  if (ad2) {
    if (format === "card") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group ${className}`,
          onClick: handleClick,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-300 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded", children: "광고 · AD" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: getImageUrl(),
                alt: ad2.title,
                className: "w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-300"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700 truncate", children: ad2.title }) })
          ]
        }
      );
    }
    if (format === "native") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group ${className}`,
          onClick: handleClick,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100", children: "스폰서드" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-300", children: "· AD" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors", children: ad2.title }),
            getImageUrl() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-xl overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: getImageUrl(),
                alt: ad2.title,
                className: "w-full max-h-[240px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              }
            ) }),
            ad2.click_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "자세히 보기 →" }) })
          ] })
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full flex justify-center py-4 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative w-full cursor-pointer group",
        onClick: handleClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-3 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-300 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded", children: "광고 · AD" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: getImageUrl(),
              alt: ad2.title,
              className: "w-full h-[150px] md:h-[250px] object-cover rounded-2xl border border-gray-200 group-hover:shadow-lg transition-shadow duration-300"
            }
          ),
          ad2.title && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-sm md:text-base truncate", children: ad2.title }) })
        ]
      }
    ) });
  }
  if (adsenseConfig && adsenseConfig.is_enabled && adsenseConfig.client_id) {
    const slotConfig = (_a = adsenseConfig.slot_configs) == null ? void 0 : _a[slotId];
    if (slotConfig) {
      if (format === "card") {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 overflow-hidden ${className}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded", children: "광고 · AD" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 min-h-[200px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ins",
            {
              className: "adsbygoogle",
              style: { display: "block", width: "100%", height: "200px" },
              "data-ad-client": adsenseConfig.client_id,
              "data-ad-slot": slotConfig,
              "data-ad-format": "auto",
              "data-full-width-responsive": "true"
            }
          ) })
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full flex justify-center py-3 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full rounded-2xl border border-dashed border-gray-200 overflow-hidden bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-3 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded", children: "광고 · AD" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ins",
          {
            className: "adsbygoogle",
            style: { display: "block", width: "100%", height: "250px" },
            "data-ad-client": adsenseConfig.client_id,
            "data-ad-slot": slotConfig,
            "data-ad-format": "auto",
            "data-full-width-responsive": "true"
          }
        )
      ] }) });
    }
  }
  return null;
};
const CLAUSE_ENDING = /[,.]$/;
const COMPOUND_PARTICLES = /(에서|까지|부터|에게|한테|처럼|만큼|보다|라고|라는|라서|이라|으며|하고|지만|는데|인데|니까|에는|에도|으로|면서|해서|하면|고서|아서|서는|에선|고도|다면|려고|도록|서도|든지|거나|이나|가요|세요|에요|어요|니다|이다|아요|해요|나요|대요|에도)$/;
const SIMPLE_PARTICLES = /(은|는|이|가|을|를|에|와|과|로|의|도|만|서|며|고|죠|요|다|등|후|중|때)$/;
function getBreakScore(word) {
  if (CLAUSE_ENDING.test(word)) return 3;
  if (COMPOUND_PARTICLES.test(word)) return 2;
  if (SIMPLE_PARTICLES.test(word)) return 1;
  return 0;
}
function breakKoreanText(text, maxChars = 20) {
  if (!text || typeof text !== "string") return [""];
  const segments = text.split("\n");
  const allLines = [];
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) {
      allLines.push("");
      continue;
    }
    const words = trimmed.split(/\s+/);
    if (words.length === 0) {
      allLines.push("");
      continue;
    }
    const lines = greedyBreak(words, maxChars);
    allLines.push(...lines);
  }
  return allLines;
}
function greedyBreak(words, maxChars) {
  const lines = [];
  let lineWords = [];
  let lineLen = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const newLen = lineLen === 0 ? word.length : lineLen + 1 + word.length;
    if (newLen <= maxChars) {
      lineWords.push(word);
      lineLen = newLen;
    } else if (lineWords.length === 0) {
      lines.push(word);
    } else {
      const breakIdx = findBestBreak(lineWords);
      lines.push(lineWords.slice(0, breakIdx + 1).join(" "));
      const remaining = lineWords.slice(breakIdx + 1);
      remaining.push(word);
      lineWords = remaining;
      lineLen = remaining.join(" ").length;
    }
  }
  if (lineWords.length > 0) {
    lines.push(lineWords.join(" "));
  }
  return lines;
}
function findBestBreak(lineWords, maxChars) {
  if (lineWords.length <= 1) return 0;
  let bestIdx = lineWords.length - 1;
  let bestScore = -1;
  for (let i = 0; i < lineWords.length; i++) {
    const score = getBreakScore(lineWords[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    } else if (score === bestScore && score > 0) {
      bestIdx = i;
    }
  }
  if (bestScore === 0) {
    bestIdx = lineWords.length - 1;
  }
  return bestIdx;
}
const SmartText = ({
  children,
  mobileMax = 16,
  pcMax = 22,
  className = "",
  as: Component
}) => {
  const text = typeof children === "string" ? children : "";
  const { mobileText, pcText, isSame } = reactExports.useMemo(() => {
    const mLines = breakKoreanText(text, mobileMax);
    const pLines = breakKoreanText(text, pcMax);
    const mText = mLines.join("\n");
    const pText = pLines.join("\n");
    return {
      mobileText: mText,
      pcText: pText,
      isSame: mText === pText
    };
  }, [text, mobileMax, pcMax]);
  const style = { whiteSpace: "pre-line" };
  if (isSame) {
    if (Component) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { className, style, children: mobileText });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, style, children: mobileText });
  }
  if (Component) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { className: `${className} md:hidden`, style, children: mobileText }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { className: `${className} hidden md:block`, style, children: pcText })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${className} md:hidden`, style, children: mobileText }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${className} hidden md:inline`, style, children: pcText })
  ] });
};
const Toast = ({ toast, onClose, duration = 3e3 }) => {
  const [isExiting, setIsExiting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!toast) return;
    setIsExiting(false);
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);
    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [toast, duration, onClose]);
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  const isWarning = toast.type === "warning";
  toast.type === "error";
  const theme = isSuccess ? { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", progress: "bg-green-400" } : isWarning ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", progress: "bg-amber-400" } : { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", progress: "bg-red-400" };
  const Icon = isSuccess ? CheckCircle : isWarning ? AlertTriangle : XCircle;
  const iconColor = isSuccess ? "text-green-500" : isWarning ? "text-amber-500" : "text-red-500";
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed top-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm pointer-events-auto",
      style: {
        transform: "translateX(-50%)",
        animation: isExiting ? "slideUp 0.25s ease-in forwards" : "slideDown 0.3s ease-out"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${theme.bg} ${theme.border} ${theme.text} relative overflow-hidden`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: `${iconColor} flex-shrink-0` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold flex-1 leading-snug", children: toast.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleClose,
            className: "p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0",
            "aria-label": "닫기",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full ${theme.progress} rounded-full`,
            style: {
              animation: `toastProgress ${duration}ms linear`
            }
          }
        ) })
      ] })
    }
  );
};
const useCountUp = (target, duration = 2e3, start = false) => {
  const [count, setCount] = reactExports.useState(0);
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ""));
  reactExports.useEffect(() => {
    if (!start || !numericTarget) return;
    let startTime;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * numericTarget));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, numericTarget, duration]);
  const suffix = target.replace(/[0-9,]/g, "");
  const formatted = count.toLocaleString();
  return `${formatted}${suffix}`;
};
const StatCard = ({ stat, c, isStatsVisible }) => {
  const displayed = useCountUp(stat.value, 1800, isStatsVisible);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center group bg-white dark:bg-gray-800/80 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 mx-auto mb-4 rounded-xl ${c.iconBg} flex items-center justify-center ${c.iconText} group-hover:scale-110 transition-all duration-300`, children: stat.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-1 tabular-nums", children: displayed }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-xs md:text-sm font-medium", children: stat.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 mx-auto w-12 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${c.bar} transition-all duration-[2000ms] ${isStatsVisible ? "w-full" : "w-0"}` }) })
  ] });
};
const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation("landing");
  const [visibleSections, setVisibleSections] = reactExports.useState(/* @__PURE__ */ new Set());
  const [hotPromos, setHotPromos] = reactExports.useState([]);
  const [promosLoading, setPromosLoading] = reactExports.useState(true);
  const [toast, setToast] = reactExports.useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const dashboardPath = user ? user.role === "superadmin" || user.role === "admin" ? "/admin" : user.role === "host" ? "/host" : "/seller" : null;
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => /* @__PURE__ */ new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10px 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el2) => observer.observe(el2));
    return () => observer.disconnect();
  }, []);
  reactExports.useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promotions/get_promotions.php");
        const json = await res.json();
        if (json.success) {
          const combined = [...json.hot_top || [], ...json.hot_mid || []].slice(0, 6);
          setHotPromos(combined);
        }
      } catch (e) {
        console.error("Promo load failed:", e);
      } finally {
        setPromosLoading(false);
      }
    };
    fetchPromos();
  }, []);
  const getDday = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
    if (diff < 0) return { text: t("hotClosed"), color: "bg-gray-500" };
    if (diff === 0) return { text: "D-DAY", color: "bg-red-500" };
    if (diff <= 3) return { text: `D-${diff}`, color: "bg-red-500" };
    if (diff <= 7) return { text: `D-${diff}`, color: "bg-orange-500" };
    return { text: `D-${diff}`, color: "bg-blue-500" };
  };
  const getImageSrc = (images) => {
    if (!images || images.length === 0) return null;
    const img = images[0];
    if (typeof img === "string") {
      return img.startsWith("/") ? img : `/${img}`;
    }
    return null;
  };
  const getVenueTypeLabel = (type) => {
    const map = { popup: t("hotVenueType.popup"), gallery: t("hotVenueType.gallery"), cafe: t("hotVenueType.cafe"), showroom: t("hotVenueType.showroom"), fleamarket: t("hotVenueType.fleamarket") };
    return map[type] || type || t("hotVenueType.other");
  };
  const isVisible = (id2) => visibleSections.has(id2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, { transparent: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "hero", className: "relative min-h-screen flex items-center overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-[120px] animate-float" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-violet-200/25 dark:bg-violet-800/15 rounded-full blur-[100px] animate-float-slow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[40%] left-[40%] w-[350px] h-[350px] bg-purple-100/20 dark:bg-purple-900/15 rounded-full blur-[80px] animate-glow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[15%] right-[25%] w-[250px] h-[250px] bg-blue-100/20 dark:bg-blue-900/15 rounded-full blur-[60px] animate-float", style: { animationDelay: "2s" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.04]",
          style: {
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 md:pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen lg:min-h-0 py-12 lg:py-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center order-2 lg:order-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-700/50 rounded-full mb-6 w-fit animate-fadeIn", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-indigo-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-600 dark:text-indigo-300 text-xs md:text-sm font-semibold", children: t("heroBadge") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl text-gray-900 dark:text-white mb-5 md:mb-6 tracking-tight", style: { fontWeight: 1e3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 md:mb-4", children: t("heroHeading1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 md:mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent", children: t("heroHeading2") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: t("heroHeading3") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-8 md:mb-10 leading-relaxed", children: t("heroDesc").split("\n").map((line, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1.Fragment, { children: [
            line,
            i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
          ] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: dashboardPath || "/signup/seller",
                className: "group w-full sm:w-auto px-10 md:px-12 py-4.5 md:py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-extrabold text-lg md:text-xl shadow-xl shadow-indigo-200/60 hover:shadow-indigo-300/70 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2",
                children: [
                  dashboardPath ? t("cta.learnMore") : t("heroBestSpaces"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/services",
                className: "w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm",
                children: [
                  t("heroLearnMore"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18, className: "opacity-40" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-5 md:gap-8", children: [
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15 }), text: t("heroSafeMatch") },
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 15 }), text: t("heroFastEntry") },
            { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 15 }), text: t("heroVerifiedSpaces") }
          ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs md:text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-indigo-500", children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.text })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative order-1 lg:order-2 flex items-center justify-center min-h-[280px] md:min-h-[400px] lg:min-h-[520px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-[80%] h-[80%] bg-gradient-to-br from-indigo-100/50 via-violet-100/40 to-purple-100/30 dark:from-indigo-900/30 dark:via-violet-900/20 dark:to-purple-900/15 rounded-full blur-[80px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-[10%] left-[5%] md:left-[10%] w-[200px] md:w-[260px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 md:p-5 animate-float shadow-xl shadow-indigo-100/40 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-24 md:h-32 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-xl mb-3 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 36, className: "text-indigo-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-2 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-50 dark:bg-gray-600 rounded-full w-1/2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-[5%] right-[5%] md:right-[10%] w-[140px] md:w-[170px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 animate-float-slow shadow-xl shadow-emerald-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "1s" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-emerald-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 text-xs font-bold", children: "+24%" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-1.5 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-50 dark:bg-gray-600 rounded-full w-2/3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-[10%] right-[0%] md:right-[5%] w-[180px] md:w-[220px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 animate-float shadow-xl shadow-violet-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "2s" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "text-violet-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-16 mb-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-gray-50 dark:bg-gray-600 rounded-full w-10" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold rounded-md", children: "MATCHED" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-1.5", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 border-2 border-white" }, i)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[20%] left-[0%] md:left-[5%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float-slow shadow-lg shadow-amber-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "3s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-amber-50 dark:bg-amber-900/40 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, className: "text-amber-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 dark:text-gray-300 text-xs font-semibold", children: "4.9 Rating" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[38%] right-[2%] md:right-[3%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float shadow-lg shadow-rose-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "0.5s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-6 h-6 bg-rose-50 dark:bg-rose-900/40 rounded-full flex items-center justify-center relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 12, className: "text-rose-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 dark:text-gray-300 text-[11px] font-semibold", children: "3 New" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[35%] left-[8%] md:left-[15%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-2 animate-float shadow-lg shadow-pink-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "4s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 13, className: "text-pink-500 fill-pink-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 dark:text-gray-300 text-[11px] font-bold", children: "2.4k" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex absolute top-[25%] left-[35%] md:left-[38%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-3 py-1.5 animate-float-slow shadow-lg shadow-blue-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50 items-center gap-1.5", style: { animationDelay: "1.5s" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-blue-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 dark:text-gray-400 text-[10px] font-medium", children: "서울 · 강남" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[5%] left-[25%] md:left-[30%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full px-3 py-1.5 animate-float shadow-lg shadow-emerald-100/30 dark:shadow-black/30 border border-gray-100/80 dark:border-gray-700/50", style: { animationDelay: "2.5s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12, className: "text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 text-[10px] font-bold", children: "Verified" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 dark:text-gray-600 text-xs font-medium hidden md:block tracking-[0.2em]", children: "SCROLL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 20, className: "text-gray-300 dark:text-gray-600" })
      ] })
    ] }),
    !promosLoading && hotPromos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "hot-promos", "data-animate": true, className: "py-14 md:py-24 bg-gray-50/50 dark:bg-gray-900/50 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible("hot-promos") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10 md:mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14 }),
          t("hotRecruitment")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight", children: [
          t("hotTitle1"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent", children: t("hotTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed", children: t("hotDesc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar", children: hotPromos.map((venue, i) => {
        const imgSrc = getImageSrc(venue.images);
        const dday = getDday(venue.recruitment_deadline);
        const typeLabel = getVenueTypeLabel(venue.type);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex-shrink-0 w-[300px] md:w-auto",
            onClick: () => window.location.href = "/recruitment",
            style: { transitionDelay: `${i * 80}ms` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 md:h-52 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 overflow-hidden", children: [
                imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 44, className: "text-orange-200" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-orange-500/25", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 12 }),
                  " HOT"
                ] }) }),
                dday && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-1 ${dday.color} text-white text-xs font-bold rounded-lg shadow-lg`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                  " ",
                  dday.text
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 12, className: "flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: venue.owner_name || t("hotSpaceProvider") })
                  ] }),
                  venue.type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full border border-orange-100 dark:border-orange-800/50", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 10 }),
                    typeLabel
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 dark:text-white text-base md:text-lg truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors", children: venue.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-gray-500 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13, className: "flex-shrink-0 text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location || t("hotLocationTBD") })
                ] }),
                venue.recruitment_deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("hotDeadline", { date: venue.recruitment_deadline }) }),
                  dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`, children: dday.text })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: user ? user.role === "seller" ? "/seller" : user.role === "host" ? "/host" : "/admin" : "/login",
                      onClick: (e) => e.stopPropagation(),
                      className: "flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold text-center hover:shadow-lg hover:shadow-indigo-200/50 transition-all",
                      children: t("hotApply")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => e.stopPropagation(),
                      className: "p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-200 hover:shadow-md transition-all",
                      title: t("hotLike"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: async (e) => {
                        e.stopPropagation();
                        try {
                          await navigator.clipboard.writeText(`${window.location.origin}/recruitment`);
                          showToast(t("hotCopied"));
                        } catch (e2) {
                          console.error(e2);
                        }
                      },
                      className: "p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 hover:shadow-md transition-all",
                      title: t("hotShare"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 14 })
                    }
                  )
                ] })
              ] })
            ]
          },
          venue.promotion_id || i
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/recruitment", className: "inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-orange-100/60 hover:-translate-y-0.5 transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
        t("hotUsageGuide"),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "services-preview", "data-animate": true, className: "py-16 md:py-28 bg-white dark:bg-gray-950 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible("services-preview") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 dark:text-indigo-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4", children: t("servicesSection.badge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight", children: [
          t("servicesSection.heading1"),
          " ",
          t("servicesSection.heading2")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed", children: t("servicesSection.desc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10", children: [
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }),
          title: t("servicesSection.salesDashboard"),
          desc: t("servicesSection.salesDashboardDesc"),
          accent: "indigo"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }),
          title: t("servicesSection.taxSupport"),
          desc: t("servicesSection.taxSupportDesc"),
          accent: "violet"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 24 }),
          title: t("servicesSection.spaceSearch"),
          desc: t("servicesSection.spaceSearchDesc"),
          accent: "emerald"
        },
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
          title: t("servicesSection.community"),
          desc: t("servicesSection.communityDesc"),
          accent: "amber"
        }
      ].map((service, i) => {
        const colorMap = {
          indigo: { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "hover:border-indigo-200 dark:hover:border-indigo-700", glow: "hover:shadow-indigo-100/40" },
          violet: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30", border: "hover:border-violet-200 dark:hover:border-violet-700", glow: "hover:shadow-violet-100/40" },
          emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "hover:border-emerald-200 dark:hover:border-emerald-700", glow: "hover:shadow-emerald-100/40" },
          amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30", border: "hover:border-amber-200 dark:hover:border-amber-700", glow: "hover:shadow-amber-100/40" }
        };
        const c = colorMap[service.accent];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `group relative bg-white dark:bg-gray-800/80 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 ${c.border} ${c.glow} hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-default overflow-hidden text-center`,
            style: { transitionDelay: `${i * 80}ms` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text} mb-5 mx-auto group-hover:scale-110 transition-all duration-300`, children: service.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3", children: service.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed", children: service.desc.split("\n").map((line, j, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1.Fragment, { children: [
                line,
                j < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
              ] }, j)) })
            ]
          },
          i
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/services", className: "inline-flex items-center gap-2 px-6 py-3 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 rounded-xl transition-all", children: [
        t("servicesSection.viewMore"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-6 md:py-10 bg-gray-50/50 dark:bg-gray-900/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: t("adRecommended") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gray-200 dark:bg-gray-700" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "landing_a", format: "banner" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how-preview", "data-animate": true, className: "py-16 md:py-28 bg-white dark:bg-gray-950 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-6xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible("how-preview") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-violet-600 dark:text-violet-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4", children: t("howSection.badge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight", children: [
          t("howSection.heading1"),
          " ",
          t("howSection.heading2")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed", children: t("howSection.desc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6", children: [
        { step: "01", title: t("howSection.step1"), desc: t("howSection.step1Desc"), gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
        { step: "02", title: t("howSection.step2"), desc: t("howSection.step2Desc"), gradient: "from-violet-500 to-violet-600", bg: "bg-violet-50", text: "text-violet-600" },
        { step: "03", title: t("howSection.step3"), desc: t("howSection.step3Desc"), gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" }
      ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-500 hover:-translate-y-1 text-center",
          style: { transitionDelay: `${i * 120}ms` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-lg font-black", children: item.step }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed", children: item.desc.split("\n").map((line, j, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1.Fragment, { children: [
              line,
              j < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
            ] }, j)) })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10 md:mt-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/how-it-works", className: "inline-flex items-center gap-2 px-6 py-3 text-violet-600 font-semibold text-sm hover:bg-violet-50 rounded-xl transition-all", children: [
        t("howSection.viewMore"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "for-who", "data-animate": true, className: "py-16 md:py-28 bg-gray-50/50 dark:bg-gray-900/50 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-700 ${isVisible("for-who") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4", children: t("forWho.badge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight", children: [
          t("forWho.heading1"),
          " ",
          t("forWho.heading2")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 hover:-translate-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 22, className: "text-indigo-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3", children: t("forWho.sellerTitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-5 leading-relaxed text-sm md:text-base", children: t("forWho.sellerDesc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: (t("forWho.sellerFeatures", { returnObjects: true }) || []).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-100/50 dark:border-indigo-800/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 12, className: "flex-shrink-0" }),
              item
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center mt-6 text-xs text-gray-400 dark:text-gray-600", children: [
          "행사를 주최하시나요?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup/host", className: "text-gray-500 dark:text-gray-500 hover:text-indigo-500 underline transition-colors", children: "호스트로 가입" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10 md:mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/about", className: "inline-flex items-center gap-2 px-6 py-3 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 rounded-xl transition-all", children: [
        t("forWho.viewMore"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-6 md:py-10 bg-white dark:bg-gray-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: t("adSponsor") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gray-200 dark:bg-gray-700" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "landing_b", format: "card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdSlot, { slotId: "landing_b2", format: "card" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-animate": true, id: "stats", className: "py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-gray-900 dark:to-violet-950/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-[100px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 right-1/4 -translate-y-1/2 w-[250px] h-[250px] bg-violet-100/40 dark:bg-violet-900/20 rounded-full blur-[80px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative z-10 max-w-5xl mx-auto px-4 md:px-6 transition-all duration-1000 ${isVisible("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 md:mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4", children: "NUMBERS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight", children: t("stats.provenResults") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8", children: [
          { value: "500+", label: t("stats.sellers"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 22 }), color: "indigo" },
          { value: "50+", label: t("stats.regions"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 22 }), color: "violet" },
          { value: "10,000+", label: t("stats.salesRecords"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 22 }), color: "emerald" },
          { value: "98%", label: t("stats.satisfaction"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 22 }), color: "amber" }
        ].map((stat, i) => {
          const colors = {
            indigo: { iconBg: "bg-indigo-100 dark:bg-indigo-900/40", iconText: "text-indigo-600 dark:text-indigo-400", bar: "bg-indigo-500" },
            violet: { iconBg: "bg-violet-100 dark:bg-violet-900/40", iconText: "text-violet-600 dark:text-violet-400", bar: "bg-violet-500" },
            emerald: { iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconText: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
            amber: { iconBg: "bg-amber-100 dark:bg-amber-900/40", iconText: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" }
          };
          const c = colors[stat.color];
          return /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { stat, c, isStatsVisible: isVisible("stats") }, i);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "cta", "data-animate": true, className: "py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center transition-all duration-700 ${isVisible("cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl md:rounded-[2rem] p-8 md:p-14 lg:p-16 relative overflow-hidden shadow-2xl shadow-indigo-200/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.04]",
          style: {
            backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-200 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4", children: t("cta.badge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight", children: t("cta.heading") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed", children: t("cta.desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: dashboardPath || "/signup/seller",
              className: "group w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2",
              children: [
                dashboardPath ? t("cta.learnMore") : t("cta.freeSignup"),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18, className: "group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "mailto:spacedotmatch@gmail.com?subject=[SpaceMatch] 문의사항",
              className: "w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-2xl font-bold text-base md:text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-xl",
              children: t("cta.inquiry")
            }
          )
        ] }),
        !dashboardPath && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/50", children: [
          t("cta.alreadyHaveAccount"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-white font-bold hover:underline", children: t("cta.login") })
        ] })
      ] })
    ] }) }) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const ServicesPage = () => {
  const { t } = useTranslation("landing");
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const services = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 28 }),
      titleKey: "servicesPage.service1.title",
      subtitleKey: "servicesPage.service1.subtitle",
      accent: "text-indigo-600",
      iconBg: "bg-indigo-50",
      descKey: "servicesPage.service1.desc",
      featuresKey: "servicesPage.service1.features"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 28 }),
      titleKey: "servicesPage.service2.title",
      subtitleKey: "servicesPage.service2.subtitle",
      accent: "text-violet-600",
      iconBg: "bg-violet-50",
      descKey: "servicesPage.service2.desc",
      featuresKey: "servicesPage.service2.features"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 28 }),
      titleKey: "servicesPage.service3.title",
      subtitleKey: "servicesPage.service3.subtitle",
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50",
      descKey: "servicesPage.service3.desc",
      featuresKey: "servicesPage.service3.features"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28 }),
      titleKey: "servicesPage.service4.title",
      subtitleKey: "servicesPage.service4.subtitle",
      accent: "text-amber-600",
      iconBg: "bg-amber-50",
      descKey: "servicesPage.service4.desc",
      featuresKey: "servicesPage.service4.features"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: { backgroundImage: "radial-gradient(circle at 20% 50%, rgba(120,119,198,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.3) 0%, transparent 50%)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4", children: "SERVICES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight", children: [
          t("servicesPage.heroTitle1"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent", children: t("servicesPage.heroTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("servicesPage.heroDesc") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24", children: services.map((service, i) => {
      const title = t(service.titleKey);
      const subtitle = t(service.subtitleKey);
      const desc = t(service.descKey);
      const features = t(service.featuresKey, { returnObjects: true });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex w-14 h-14 rounded-xl ${service.iconBg} items-center justify-center ${service.accent} mb-6`, children: service.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2", children: subtitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold text-gray-900 mb-4", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg leading-relaxed mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: desc }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: Array.isArray(features) && features.map((f2, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm md:text-base text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 18, className: "text-indigo-500 flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f2 })
          ] }, j)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 min-h-[240px] md:min-h-[320px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 ${service.iconBg} rounded-2xl flex items-center justify-center`, children: React$1.cloneElement(service.icon, { size: 40, className: service.accent }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl font-bold text-gray-900", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1", children: subtitle })
        ] }) }) })
      ] }, i);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-20 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-4", children: t("servicesPage.ctaTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("servicesPage.ctaDesc") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2", children: [
          t("servicesPage.ctaSignup"),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/how-it-works", className: "w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center", children: t("servicesPage.ctaHowItWorks") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const HowItWorksPage = () => {
  const { t } = useTranslation("landing");
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [openFaq, setOpenFaq] = reactExports.useState(null);
  const [faqVisible, setFaqVisible] = reactExports.useState(false);
  const faqSectionRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFaqVisible(true);
      },
      { threshold: 0.15 }
    );
    if (faqSectionRef.current) observer.observe(faqSectionRef.current);
    return () => observer.disconnect();
  }, []);
  const sellerSteps = [
    { step: "01", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 22 }), titleKey: "howItWorksPage.sellerStep1.title", descKey: "howItWorksPage.sellerStep1.desc", detailsKey: "howItWorksPage.sellerStep1.details" },
    { step: "02", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 22 }), titleKey: "howItWorksPage.sellerStep2.title", descKey: "howItWorksPage.sellerStep2.desc", detailsKey: "howItWorksPage.sellerStep2.details" },
    { step: "03", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Handshake, { size: 22 }), titleKey: "howItWorksPage.sellerStep3.title", descKey: "howItWorksPage.sellerStep3.desc", detailsKey: "howItWorksPage.sellerStep3.details" }
  ];
  const hostSteps = [
    { step: "01", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 22 }), titleKey: "howItWorksPage.hostStep1.title", descKey: "howItWorksPage.hostStep1.desc", detailsKey: "howItWorksPage.hostStep1.details" },
    { step: "02", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 22 }), titleKey: "howItWorksPage.hostStep2.title", descKey: "howItWorksPage.hostStep2.desc", detailsKey: "howItWorksPage.hostStep2.details" },
    { step: "03", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 22 }), titleKey: "howItWorksPage.hostStep3.title", descKey: "howItWorksPage.hostStep3.desc", detailsKey: "howItWorksPage.hostStep3.details" }
  ];
  const StepCard = ({ item, accent = "indigo" }) => {
    const title = t(item.titleKey);
    const desc = t(item.descKey);
    const details = t(item.detailsKey, { returnObjects: true });
    const accentMap = {
      indigo: { border: "border-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50", check: "text-indigo-500" },
      emerald: { border: "border-emerald-600", text: "text-emerald-600", bg: "bg-emerald-50", check: "text-emerald-500" }
    };
    const c = accentMap[accent] || accentMap.indigo;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg p-6 md:p-8 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-full border-2 ${c.border} flex items-center justify-center flex-shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-black ${c.text}`, children: item.step }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold ${c.text} uppercase tracking-wider`, children: [
            "STEP ",
            item.step
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: title })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 20, pcMax: 36, children: desc }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${c.bg} rounded-xl p-4`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: Array.isArray(details) && details.map((d, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm text-gray-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 15, className: `${c.check} flex-shrink-0 mt-0.5` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d })
      ] }, j)) }) })
    ] });
  };
  const faqItems = t("howItWorksPage.faq", { returnObjects: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: { backgroundImage: "radial-gradient(circle at 70% 30%, rgba(167,139,250,0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(99,102,241,0.3) 0%, transparent 50%)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-violet-300 text-sm font-semibold tracking-widest uppercase mb-4", children: "HOW IT WORKS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight", children: [
          t("howItWorksPage.heroTitle1"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent", children: t("howItWorksPage.heroTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 20, pcMax: 40, children: t("howItWorksPage.heroDesc") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3", children: t("howItWorksPage.sellerBadge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900", children: t("howItWorksPage.sellerTitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6", children: sellerSteps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StepCard, { item: step, accent: "indigo" }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gray-100" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3", children: t("howItWorksPage.hostBadge") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900", children: t("howItWorksPage.hostTitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6", children: hostSteps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StepCard, { item: step, accent: "emerald" }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { ref: faqSectionRef, className: "py-16 md:py-24 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-center mb-12 transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3", children: "FAQ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900", children: t("howItWorksPage.faqTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-2", children: t("howItWorksPage.faqSubtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.isArray(faqItems) && faqItems.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `group bg-white rounded-xl border transition-all duration-300 cursor-pointer ${openFaq === i ? "border-indigo-200 shadow-md" : "border-gray-100 hover:border-gray-200"} ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
          style: { transitionDelay: faqVisible ? `${200 + i * 80}ms` : "0ms" },
          onClick: () => setOpenFaq(openFaq === i ? null : i),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-5 md:p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-300 ${openFaq === i ? "bg-indigo-600 text-white" : "bg-gray-50 group-hover:bg-indigo-50"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: faq.icon }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `flex-1 font-semibold text-base transition-colors duration-300 ${openFaq === i ? "text-indigo-700" : "text-gray-900"}`, children: faq.q }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 18,
                  className: `flex-shrink-0 transition-all duration-300 ${openFaq === i ? "rotate-180 text-indigo-500" : "text-gray-300"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "overflow-hidden transition-all duration-300 ease-in-out",
                style: {
                  maxHeight: openFaq === i ? "200px" : "0px",
                  opacity: openFaq === i ? 1 : 0
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-gray-100 mb-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: faq.a })
                ] })
              }
            )
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-20 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-4", children: t("howItWorksPage.ctaTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg mb-8", children: t("howItWorksPage.ctaDesc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300", children: [
        t("howItWorksPage.ctaSignup"),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const AboutPage = () => {
  const { t } = useTranslation("landing");
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const sellerFeatures = t("aboutPage.sellerFeatures", { returnObjects: true });
  const hostFeatures = t("aboutPage.hostFeatures", { returnObjects: true });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: { backgroundImage: "radial-gradient(circle at 30% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4", children: "ABOUT US" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight", children: [
          t("aboutPage.heroTitle1"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent", children: t("aboutPage.heroTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("aboutPage.heroDesc") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-8 md:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Mission" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 leading-relaxed text-base", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("aboutPage.missionDesc") }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-8 md:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Vision" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 leading-relaxed text-base", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("aboutPage.visionDesc") }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-20 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3", children: "VALUES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-3", children: t("aboutPage.valuesTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg", children: t("aboutPage.valuesSubtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6", children: [
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 22 }), titleKey: "aboutPage.trust.title", descKey: "aboutPage.trust.desc", accent: "text-blue-600", iconBg: "bg-blue-50" },
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 22 }), titleKey: "aboutPage.innovation.title", descKey: "aboutPage.innovation.desc", accent: "text-amber-600", iconBg: "bg-amber-50" },
        { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 22 }), titleKey: "aboutPage.winwin.title", descKey: "aboutPage.winwin.desc", accent: "text-rose-600", iconBg: "bg-rose-50" }
      ].map((value, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 mx-auto rounded-xl ${value.iconBg} flex items-center justify-center ${value.accent} mb-5`, children: value.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-3", children: t(value.titleKey) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 22, children: t(value.descKey) }) })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3", children: "FOR YOU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-3", children: t("aboutPage.whoTitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-7 md:p-8 pl-8 md:pl-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 22, className: "text-indigo-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("aboutPage.sellerTitle") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: t("aboutPage.sellerSubtitle") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-5 leading-relaxed text-sm", children: t("aboutPage.sellerDesc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: Array.isArray(sellerFeatures) && sellerFeatures.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 15, className: "text-indigo-500 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-7 md:p-8 pl-8 md:pl-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 22, className: "text-emerald-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: t("aboutPage.hostTitle") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: t("aboutPage.hostSubtitle") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-5 leading-relaxed text-sm", children: t("aboutPage.hostDesc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: Array.isArray(hostFeatures) && hostFeatures.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 15, className: "text-emerald-500 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
            ] }, i)) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-20 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-4", children: t("aboutPage.ctaTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("aboutPage.ctaDesc") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2", children: [
          t("aboutPage.ctaSignup"),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center", children: t("aboutPage.ctaServices") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const ContactPage = () => {
  const { t } = useTranslation("landing");
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-20",
          style: { backgroundImage: "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(167,139,250,0.3) 0%, transparent 50%)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-4", children: "CONTACT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight", children: [
          t("contactPage.heroTitle1"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent", children: t("contactPage.heroTitle2") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("contactPage.heroDesc") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "http://pf.kakao.com/_xjGxoRX/chat",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💬" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 18, className: "text-gray-300 group-hover:text-violet-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: t("contactPage.kakaoTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("contactPage.kakaoDesc") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-violet-600 font-semibold text-sm", children: [
                t("contactPage.kakaoAction"),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "mailto:spacedotmatch@gmail.com?subject=[SpaceMatch] 문의사항",
            className: "group bg-white rounded-2xl p-7 md:p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 24, className: "text-indigo-600" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 18, className: "text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: t("contactPage.emailTitle", "이메일 문의") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("contactPage.emailDesc", "이메일로 문의사항을 보내주시면 빠르게 답변 드립니다.") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-indigo-600", children: "spacedotmatch@gmail.com" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-2xl p-7 md:p-10 border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-6", children: t("contactPage.otherInfo") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18, className: "text-gray-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1", children: t("contactPage.address") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: t("contactPage.addressValue") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-gray-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1", children: t("contactPage.hours") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: t("contactPage.hoursValue") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("contactPage.hoursNote") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18, className: "text-gray-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1", children: t("contactPage.quickResponse") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: t("contactPage.quickResponseValue") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: t("contactPage.quickResponseNote") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:spacedotmatch@gmail.com", className: "text-xs text-indigo-600 hover:underline mt-1 inline-block", children: "spacedotmatch@gmail.com" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-20 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-4xl font-bold text-gray-900 mb-4", children: t("contactPage.ctaTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-base md:text-lg mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartText, { mobileMax: 16, pcMax: 24, children: t("contactPage.ctaDesc") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2", children: [
          t("contactPage.ctaSignup"),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center", children: t("contactPage.ctaLogin") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const COUNTRY_CENTERS = {
  "ko": { lat: 37.5665, lng: 126.978, zoom: 11 },
  "en": { lat: 40.7128, lng: -74.006, zoom: 10 },
  "en-GB": { lat: 51.5074, lng: -0.1278, zoom: 10 },
  "en-CA": { lat: 43.6532, lng: -79.3832, zoom: 10 },
  "fr-CA": { lat: 45.5017, lng: -73.5673, zoom: 10 },
  "ja": { lat: 35.6762, lng: 139.6503, zoom: 10 },
  "vi": { lat: 10.8231, lng: 106.6297, zoom: 10 },
  "th": { lat: 13.7563, lng: 100.5018, zoom: 10 },
  "km": { lat: 11.5564, lng: 104.9282, zoom: 11 },
  "ru": { lat: 55.7558, lng: 37.6173, zoom: 10 },
  "uk": { lat: 50.4501, lng: 30.5234, zoom: 10 }
};
const REGION_DISTRICTS = {
  "서울 전체": {
    "강남구": { lat: 37.4959, lng: 127.0628, zoom: 14 },
    "강동구": { lat: 37.55, lng: 127.147, zoom: 14 },
    "강북구": { lat: 37.638, lng: 127.027, zoom: 14 },
    "강서구": { lat: 37.56, lng: 126.849, zoom: 14 },
    "관악구": { lat: 37.478, lng: 126.952, zoom: 14 },
    "광진구": { lat: 37.548, lng: 127.086, zoom: 14 },
    "구로구": { lat: 37.495, lng: 126.858, zoom: 14 },
    "금천구": { lat: 37.457, lng: 126.896, zoom: 14 },
    "노원구": { lat: 37.655, lng: 127.058, zoom: 14 },
    "도봉구": { lat: 37.668, lng: 127.047, zoom: 14 },
    "동대문구": { lat: 37.574, lng: 127.04, zoom: 14 },
    "동작구": { lat: 37.508, lng: 126.938, zoom: 14 },
    "마포구": { lat: 37.566, lng: 126.901, zoom: 14 },
    "서대문구": { lat: 37.578, lng: 126.937, zoom: 14 },
    "서초구": { lat: 37.492, lng: 127.009, zoom: 14 },
    "성동구": { lat: 37.551, lng: 127.041, zoom: 14 },
    "성북구": { lat: 37.606, lng: 127.017, zoom: 14 },
    "송파구": { lat: 37.514, lng: 127.106, zoom: 14 },
    "양천구": { lat: 37.527, lng: 126.866, zoom: 14 },
    "영등포구": { lat: 37.526, lng: 126.897, zoom: 14 },
    "용산구": { lat: 37.532, lng: 126.981, zoom: 14 },
    "은평구": { lat: 37.617, lng: 126.922, zoom: 14 },
    "종로구": { lat: 37.573, lng: 126.979, zoom: 14 },
    "중구": { lat: 37.561, lng: 126.996, zoom: 14 },
    "중랑구": { lat: 37.596, lng: 127.094, zoom: 14 }
  },
  "경기도": {
    "수원시": { lat: 37.2636, lng: 127.0286, zoom: 13 },
    "성남시": { lat: 37.42, lng: 127.1267, zoom: 13 },
    "고양시": { lat: 37.6584, lng: 126.832, zoom: 13 },
    "용인시": { lat: 37.2411, lng: 127.1776, zoom: 12 },
    "부천시": { lat: 37.5034, lng: 126.766, zoom: 13 },
    "안산시": { lat: 37.3219, lng: 126.8309, zoom: 13 },
    "안양시": { lat: 37.3943, lng: 126.9568, zoom: 13 },
    "남양주시": { lat: 37.636, lng: 127.2165, zoom: 12 },
    "화성시": { lat: 37.1995, lng: 126.8313, zoom: 12 },
    "평택시": { lat: 36.9921, lng: 127.1127, zoom: 12 },
    "의정부시": { lat: 37.7381, lng: 127.0337, zoom: 13 },
    "시흥시": { lat: 37.38, lng: 126.8028, zoom: 13 },
    "파주시": { lat: 37.7599, lng: 126.7802, zoom: 12 },
    "광명시": { lat: 37.4786, lng: 126.8645, zoom: 14 },
    "김포시": { lat: 37.6153, lng: 126.7156, zoom: 12 },
    "군포시": { lat: 37.3617, lng: 126.9352, zoom: 14 },
    "광주시": { lat: 37.4294, lng: 127.2551, zoom: 12 },
    "이천시": { lat: 37.272, lng: 127.435, zoom: 12 },
    "양주시": { lat: 37.7853, lng: 127.0456, zoom: 12 },
    "오산시": { lat: 37.1498, lng: 127.0697, zoom: 14 },
    "구리시": { lat: 37.5943, lng: 127.1296, zoom: 14 },
    "안성시": { lat: 37.008, lng: 127.2797, zoom: 12 },
    "포천시": { lat: 37.8949, lng: 127.2003, zoom: 12 },
    "의왕시": { lat: 37.3449, lng: 126.9685, zoom: 14 },
    "하남시": { lat: 37.5393, lng: 127.2148, zoom: 13 },
    "여주시": { lat: 37.2983, lng: 127.6373, zoom: 12 },
    "양평군": { lat: 37.4917, lng: 127.4876, zoom: 12 },
    "동두천시": { lat: 37.9034, lng: 127.0607, zoom: 13 },
    "과천시": { lat: 37.4292, lng: 126.9876, zoom: 14 },
    "가평군": { lat: 37.8313, lng: 127.5098, zoom: 11 },
    "연천군": { lat: 38.0964, lng: 127.0751, zoom: 11 }
  },
  "인천": {
    "중구": { lat: 37.4738, lng: 126.6217, zoom: 13 },
    "동구": { lat: 37.4737, lng: 126.6432, zoom: 14 },
    "미추홀구": { lat: 37.442, lng: 126.653, zoom: 14 },
    "연수구": { lat: 37.4101, lng: 126.6783, zoom: 13 },
    "남동구": { lat: 37.4488, lng: 126.7317, zoom: 13 },
    "부평구": { lat: 37.5067, lng: 126.7219, zoom: 14 },
    "계양구": { lat: 37.5371, lng: 126.7378, zoom: 14 },
    "서구": { lat: 37.5449, lng: 126.676, zoom: 13 },
    "강화군": { lat: 37.747, lng: 126.4879, zoom: 12 },
    "옹진군": { lat: 37.4467, lng: 126.6356, zoom: 11 }
  },
  "부산": {
    "중구": { lat: 35.1066, lng: 129.0326, zoom: 14 },
    "서구": { lat: 35.0976, lng: 129.0243, zoom: 14 },
    "동구": { lat: 35.1295, lng: 129.0457, zoom: 14 },
    "영도구": { lat: 35.0914, lng: 129.068, zoom: 14 },
    "부산진구": { lat: 35.1629, lng: 129.0531, zoom: 14 },
    "동래구": { lat: 35.1964, lng: 129.0838, zoom: 14 },
    "남구": { lat: 35.1365, lng: 129.0843, zoom: 14 },
    "북구": { lat: 35.1975, lng: 129.013, zoom: 14 },
    "해운대구": { lat: 35.1631, lng: 129.1636, zoom: 13 },
    "사하구": { lat: 35.1046, lng: 128.9748, zoom: 14 },
    "금정구": { lat: 35.2431, lng: 129.0923, zoom: 14 },
    "강서구": { lat: 35.2121, lng: 128.9806, zoom: 13 },
    "연제구": { lat: 35.1761, lng: 129.0797, zoom: 14 },
    "수영구": { lat: 35.1454, lng: 129.1132, zoom: 14 },
    "사상구": { lat: 35.1526, lng: 128.9916, zoom: 14 },
    "기장군": { lat: 35.2447, lng: 129.2222, zoom: 12 }
  },
  "대구": {
    "중구": { lat: 35.8694, lng: 128.6062, zoom: 14 },
    "동구": { lat: 35.8862, lng: 128.6356, zoom: 13 },
    "서구": { lat: 35.8718, lng: 128.5592, zoom: 14 },
    "남구": { lat: 35.8462, lng: 128.5977, zoom: 14 },
    "북구": { lat: 35.8861, lng: 128.583, zoom: 13 },
    "수성구": { lat: 35.8586, lng: 128.6306, zoom: 14 },
    "달서구": { lat: 35.8299, lng: 128.5327, zoom: 13 },
    "달성군": { lat: 35.7749, lng: 128.4313, zoom: 12 }
  },
  "대전": {
    "동구": { lat: 36.3121, lng: 127.4558, zoom: 13 },
    "중구": { lat: 36.3254, lng: 127.4212, zoom: 13 },
    "서구": { lat: 36.3555, lng: 127.3836, zoom: 13 },
    "유성구": { lat: 36.3622, lng: 127.3561, zoom: 13 },
    "대덕구": { lat: 36.3467, lng: 127.4156, zoom: 13 }
  },
  "광주": {
    "동구": { lat: 35.146, lng: 126.9231, zoom: 14 },
    "서구": { lat: 35.1525, lng: 126.891, zoom: 14 },
    "남구": { lat: 35.1329, lng: 126.9025, zoom: 14 },
    "북구": { lat: 35.1747, lng: 126.912, zoom: 13 },
    "광산구": { lat: 35.1396, lng: 126.7936, zoom: 13 }
  },
  "울산": {
    "중구": { lat: 35.5698, lng: 129.3324, zoom: 14 },
    "남구": { lat: 35.5446, lng: 129.3301, zoom: 14 },
    "동구": { lat: 35.505, lng: 129.4169, zoom: 13 },
    "북구": { lat: 35.5824, lng: 129.3612, zoom: 13 },
    "울주군": { lat: 35.5225, lng: 129.2425, zoom: 11 }
  },
  "세종": {
    "세종시": { lat: 36.48, lng: 127, zoom: 12 }
  },
  "제주": {
    "제주시": { lat: 33.4996, lng: 126.5312, zoom: 12 },
    "서귀포시": { lat: 33.2542, lng: 126.56, zoom: 12 }
  },
  "강원": {
    "춘천시": { lat: 37.8813, lng: 127.73, zoom: 12 },
    "원주시": { lat: 37.3422, lng: 127.9202, zoom: 12 },
    "강릉시": { lat: 37.7519, lng: 128.8761, zoom: 12 },
    "동해시": { lat: 37.5247, lng: 129.1143, zoom: 13 },
    "태백시": { lat: 37.1641, lng: 128.9858, zoom: 13 },
    "속초시": { lat: 38.2071, lng: 128.5918, zoom: 13 },
    "삼척시": { lat: 37.45, lng: 129.1652, zoom: 12 },
    "홍천군": { lat: 37.6972, lng: 127.8886, zoom: 11 },
    "횡성군": { lat: 37.4883, lng: 127.9847, zoom: 11 },
    "영월군": { lat: 37.1837, lng: 128.4615, zoom: 11 },
    "평창군": { lat: 37.3706, lng: 128.3906, zoom: 11 },
    "정선군": { lat: 37.3808, lng: 128.6608, zoom: 11 },
    "철원군": { lat: 38.1467, lng: 127.3133, zoom: 11 },
    "화천군": { lat: 38.1063, lng: 127.7082, zoom: 11 },
    "양구군": { lat: 38.1097, lng: 127.9895, zoom: 11 },
    "인제군": { lat: 38.0697, lng: 128.1706, zoom: 11 },
    "고성군": { lat: 38.38, lng: 128.4678, zoom: 11 },
    "양양군": { lat: 38.0754, lng: 128.6189, zoom: 11 }
  },
  "충북": {
    "청주시": { lat: 36.6424, lng: 127.489, zoom: 12 },
    "충주시": { lat: 36.9911, lng: 127.9259, zoom: 12 },
    "제천시": { lat: 37.1327, lng: 128.1909, zoom: 12 },
    "보은군": { lat: 36.4893, lng: 127.7293, zoom: 11 },
    "옥천군": { lat: 36.3062, lng: 127.5713, zoom: 11 },
    "영동군": { lat: 36.175, lng: 127.7836, zoom: 11 },
    "진천군": { lat: 36.8554, lng: 127.4356, zoom: 12 },
    "괴산군": { lat: 36.815, lng: 127.7866, zoom: 11 },
    "음성군": { lat: 36.9403, lng: 127.6907, zoom: 11 },
    "단양군": { lat: 36.9846, lng: 128.3653, zoom: 11 },
    "증평군": { lat: 36.7855, lng: 127.5813, zoom: 12 }
  },
  "충남": {
    "천안시": { lat: 36.8151, lng: 127.1139, zoom: 12 },
    "공주시": { lat: 36.4465, lng: 127.119, zoom: 12 },
    "보령시": { lat: 36.3334, lng: 126.6128, zoom: 12 },
    "아산시": { lat: 36.7898, lng: 127.0018, zoom: 12 },
    "서산시": { lat: 36.7845, lng: 126.4503, zoom: 12 },
    "논산시": { lat: 36.1872, lng: 127.0987, zoom: 12 },
    "계룡시": { lat: 36.2741, lng: 127.2487, zoom: 13 },
    "당진시": { lat: 36.89, lng: 126.6297, zoom: 12 },
    "금산군": { lat: 36.1086, lng: 127.4878, zoom: 11 },
    "부여군": { lat: 36.2758, lng: 126.9098, zoom: 11 },
    "서천군": { lat: 36.0801, lng: 126.6941, zoom: 11 },
    "청양군": { lat: 36.4594, lng: 126.8022, zoom: 11 },
    "홍성군": { lat: 36.6011, lng: 126.6608, zoom: 11 },
    "예산군": { lat: 36.6828, lng: 126.8484, zoom: 11 },
    "태안군": { lat: 36.7456, lng: 126.2979, zoom: 11 }
  },
  "전북": {
    "전주시": { lat: 35.8242, lng: 127.148, zoom: 12 },
    "군산시": { lat: 35.9676, lng: 126.7368, zoom: 12 },
    "익산시": { lat: 35.9483, lng: 126.9576, zoom: 12 },
    "정읍시": { lat: 35.5699, lng: 126.8558, zoom: 12 },
    "남원시": { lat: 35.4164, lng: 127.3905, zoom: 12 },
    "김제시": { lat: 35.8036, lng: 126.8809, zoom: 12 },
    "완주군": { lat: 35.9044, lng: 127.1628, zoom: 11 },
    "진안군": { lat: 35.7919, lng: 127.4246, zoom: 11 },
    "무주군": { lat: 35.9221, lng: 127.6606, zoom: 11 },
    "장수군": { lat: 35.6475, lng: 127.5211, zoom: 11 },
    "임실군": { lat: 35.6178, lng: 127.2827, zoom: 11 },
    "순창군": { lat: 35.3743, lng: 127.1378, zoom: 11 },
    "고창군": { lat: 35.4358, lng: 126.7019, zoom: 11 },
    "부안군": { lat: 35.7316, lng: 126.7332, zoom: 11 }
  },
  "전남": {
    "목포시": { lat: 34.8118, lng: 126.3922, zoom: 13 },
    "여수시": { lat: 34.7604, lng: 127.6622, zoom: 12 },
    "순천시": { lat: 34.9506, lng: 127.4874, zoom: 12 },
    "나주시": { lat: 35.0159, lng: 126.7109, zoom: 12 },
    "광양시": { lat: 34.9407, lng: 127.6958, zoom: 12 },
    "담양군": { lat: 35.3213, lng: 126.9883, zoom: 11 },
    "곡성군": { lat: 35.2819, lng: 127.2922, zoom: 11 },
    "구례군": { lat: 35.2026, lng: 127.4625, zoom: 11 },
    "고흥군": { lat: 34.6111, lng: 127.275, zoom: 11 },
    "보성군": { lat: 34.7714, lng: 127.08, zoom: 11 },
    "화순군": { lat: 35.0643, lng: 126.9864, zoom: 11 },
    "장흥군": { lat: 34.6819, lng: 126.9073, zoom: 11 },
    "강진군": { lat: 34.6419, lng: 126.7673, zoom: 11 },
    "해남군": { lat: 34.5735, lng: 126.5988, zoom: 11 },
    "영암군": { lat: 34.8001, lng: 126.6966, zoom: 11 },
    "무안군": { lat: 34.9906, lng: 126.4815, zoom: 11 },
    "함평군": { lat: 35.0658, lng: 126.5167, zoom: 11 },
    "영광군": { lat: 35.2771, lng: 126.5122, zoom: 11 },
    "장성군": { lat: 35.3019, lng: 126.7847, zoom: 11 },
    "완도군": { lat: 34.3108, lng: 126.7543, zoom: 11 },
    "진도군": { lat: 34.4868, lng: 126.2633, zoom: 11 },
    "신안군": { lat: 34.8272, lng: 126.1082, zoom: 10 }
  },
  "경북": {
    "포항시": { lat: 36.019, lng: 129.3435, zoom: 12 },
    "경주시": { lat: 35.8562, lng: 129.225, zoom: 12 },
    "김천시": { lat: 36.1398, lng: 128.1136, zoom: 12 },
    "안동시": { lat: 36.5684, lng: 128.7294, zoom: 12 },
    "구미시": { lat: 36.1196, lng: 128.3444, zoom: 12 },
    "영주시": { lat: 36.8057, lng: 128.624, zoom: 12 },
    "영천시": { lat: 35.9733, lng: 128.9385, zoom: 12 },
    "상주시": { lat: 36.411, lng: 128.159, zoom: 12 },
    "문경시": { lat: 36.5866, lng: 128.1864, zoom: 12 },
    "경산시": { lat: 35.8254, lng: 128.7413, zoom: 12 }
  },
  "경남": {
    "창원시": { lat: 35.228, lng: 128.6811, zoom: 12 },
    "진주시": { lat: 35.1798, lng: 128.1076, zoom: 12 },
    "통영시": { lat: 34.8545, lng: 128.4332, zoom: 12 },
    "사천시": { lat: 35.0036, lng: 128.0647, zoom: 12 },
    "김해시": { lat: 35.2286, lng: 128.889, zoom: 12 },
    "밀양시": { lat: 35.5037, lng: 128.7467, zoom: 12 },
    "거제시": { lat: 34.8808, lng: 128.6213, zoom: 12 },
    "양산시": { lat: 35.3351, lng: 129.0373, zoom: 12 },
    "의령군": { lat: 35.3222, lng: 128.2617, zoom: 11 },
    "함안군": { lat: 35.2724, lng: 128.406, zoom: 11 },
    "창녕군": { lat: 35.5441, lng: 128.4917, zoom: 11 },
    "고성군": { lat: 34.9733, lng: 128.3225, zoom: 11 },
    "남해군": { lat: 34.8377, lng: 127.8926, zoom: 11 },
    "하동군": { lat: 35.0675, lng: 127.7514, zoom: 11 },
    "산청군": { lat: 35.4156, lng: 127.8734, zoom: 11 },
    "함양군": { lat: 35.5197, lng: 127.7252, zoom: 11 },
    "거창군": { lat: 35.6869, lng: 127.9093, zoom: 11 },
    "합천군": { lat: 35.5664, lng: 128.166, zoom: 11 }
  }
};
const REGIONS_BY_COUNTRY = {
  "ko": {
    "서울 전체": { lat: 37.5665, lng: 126.978, zoom: 11, keywords: ["서울", "서울특별시"] },
    "경기도": { lat: 37.275, lng: 127.009, zoom: 9, keywords: ["경기", "경기도"] },
    "인천": { lat: 37.4563, lng: 126.7052, zoom: 11, keywords: ["인천", "인천광역시"] },
    "부산": { lat: 35.1796, lng: 129.0756, zoom: 11, keywords: ["부산", "부산광역시"] },
    "대구": { lat: 35.8714, lng: 128.6014, zoom: 11, keywords: ["대구", "대구광역시"] },
    "대전": { lat: 36.3504, lng: 127.3845, zoom: 11, keywords: ["대전", "대전광역시"] },
    "광주": { lat: 35.1595, lng: 126.8526, zoom: 11, keywords: ["광주", "광주광역시"] },
    "울산": { lat: 35.5384, lng: 129.3114, zoom: 11, keywords: ["울산", "울산광역시"] },
    "세종": { lat: 36.48, lng: 127, zoom: 11, keywords: ["세종", "세종특별자치시"] },
    "제주": { lat: 33.4996, lng: 126.5312, zoom: 10, keywords: ["제주", "제주특별자치도"] },
    "강원": { lat: 37.8228, lng: 128.1555, zoom: 9, keywords: ["강원", "강원도", "강원특별자치도"] },
    "충북": { lat: 36.6357, lng: 127.4913, zoom: 9, keywords: ["충북", "충청북도"] },
    "충남": { lat: 36.5184, lng: 126.8, zoom: 9, keywords: ["충남", "충청남도"] },
    "전북": { lat: 35.82, lng: 127.1089, zoom: 9, keywords: ["전북", "전라북도", "전북특별자치도"] },
    "전남": { lat: 34.8161, lng: 126.4629, zoom: 9, keywords: ["전남", "전라남도"] },
    "경북": { lat: 36.4919, lng: 128.8889, zoom: 9, keywords: ["경북", "경상북도"] },
    "경남": { lat: 35.4606, lng: 128.2132, zoom: 9, keywords: ["경남", "경상남도"] }
  },
  "en": {
    "New York": { lat: 40.7128, lng: -74.006, zoom: 10, keywords: ["new york", "ny"] },
    "California": { lat: 36.7783, lng: -119.4179, zoom: 6, keywords: ["california", "ca"] },
    "Texas": { lat: 31.9686, lng: -99.9018, zoom: 6, keywords: ["texas", "tx"] },
    "Florida": { lat: 27.6648, lng: -81.5158, zoom: 7, keywords: ["florida", "fl"] },
    "Illinois": { lat: 40.6331, lng: -89.3985, zoom: 7, keywords: ["illinois", "il", "chicago"] },
    "Washington": { lat: 47.7511, lng: -120.7401, zoom: 7, keywords: ["washington", "wa", "seattle"] },
    "Georgia": { lat: 32.1656, lng: -82.9001, zoom: 7, keywords: ["georgia", "ga", "atlanta"] },
    "Massachusetts": { lat: 42.4072, lng: -71.3824, zoom: 8, keywords: ["massachusetts", "ma", "boston"] },
    "Pennsylvania": { lat: 41.2033, lng: -77.1945, zoom: 7, keywords: ["pennsylvania", "pa"] },
    "New Jersey": { lat: 40.0583, lng: -74.4057, zoom: 8, keywords: ["new jersey", "nj"] },
    "Hawaii": { lat: 19.8968, lng: -155.5828, zoom: 7, keywords: ["hawaii", "hi"] },
    "Nevada": { lat: 38.8026, lng: -116.4194, zoom: 7, keywords: ["nevada", "nv", "las vegas"] }
  },
  "en-GB": {
    "London": { lat: 51.5074, lng: -0.1278, zoom: 10, keywords: ["london"] },
    "Manchester": { lat: 53.4808, lng: -2.2426, zoom: 11, keywords: ["manchester"] },
    "Birmingham": { lat: 52.4862, lng: -1.8904, zoom: 11, keywords: ["birmingham"] },
    "Edinburgh": { lat: 55.9533, lng: -3.1883, zoom: 11, keywords: ["edinburgh"] },
    "Glasgow": { lat: 55.8642, lng: -4.2518, zoom: 11, keywords: ["glasgow"] },
    "Liverpool": { lat: 53.4084, lng: -2.9916, zoom: 11, keywords: ["liverpool"] },
    "Bristol": { lat: 51.4545, lng: -2.5879, zoom: 11, keywords: ["bristol"] },
    "Cardiff": { lat: 51.4816, lng: -3.1791, zoom: 11, keywords: ["cardiff"] },
    "Belfast": { lat: 54.5973, lng: -5.9301, zoom: 11, keywords: ["belfast"] },
    "Leeds": { lat: 53.8008, lng: -1.5491, zoom: 11, keywords: ["leeds"] }
  },
  "en-CA": {
    "Ontario": { lat: 51.2538, lng: -85.3232, zoom: 5, keywords: ["ontario", "toronto"] },
    "British Columbia": { lat: 53.7267, lng: -127.6476, zoom: 5, keywords: ["british columbia", "bc", "vancouver"] },
    "Quebec": { lat: 46.8139, lng: -71.208, zoom: 6, keywords: ["quebec", "montreal"] },
    "Alberta": { lat: 53.9333, lng: -116.5765, zoom: 5, keywords: ["alberta", "calgary", "edmonton"] },
    "Manitoba": { lat: 53.7609, lng: -98.8139, zoom: 5, keywords: ["manitoba", "winnipeg"] },
    "Saskatchewan": { lat: 52.9399, lng: -106.4509, zoom: 5, keywords: ["saskatchewan"] },
    "Nova Scotia": { lat: 44.682, lng: -63.7443, zoom: 7, keywords: ["nova scotia", "halifax"] },
    "New Brunswick": { lat: 46.5653, lng: -66.4619, zoom: 7, keywords: ["new brunswick"] }
  },
  "fr-CA": {
    "Ontario": { lat: 51.2538, lng: -85.3232, zoom: 5, keywords: ["ontario", "toronto"] },
    "Colombie-Britannique": { lat: 53.7267, lng: -127.6476, zoom: 5, keywords: ["colombie-britannique", "bc", "vancouver"] },
    "Québec": { lat: 46.8139, lng: -71.208, zoom: 6, keywords: ["québec", "montréal"] },
    "Alberta": { lat: 53.9333, lng: -116.5765, zoom: 5, keywords: ["alberta", "calgary"] },
    "Manitoba": { lat: 53.7609, lng: -98.8139, zoom: 5, keywords: ["manitoba", "winnipeg"] },
    "Saskatchewan": { lat: 52.9399, lng: -106.4509, zoom: 5, keywords: ["saskatchewan"] },
    "Nouvelle-Écosse": { lat: 44.682, lng: -63.7443, zoom: 7, keywords: ["nouvelle-écosse", "halifax"] },
    "Nouveau-Brunswick": { lat: 46.5653, lng: -66.4619, zoom: 7, keywords: ["nouveau-brunswick"] }
  },
  "ja": {
    "東京都": { lat: 35.6762, lng: 139.6503, zoom: 10, keywords: ["東京", "tokyo"] },
    "大阪府": { lat: 34.6937, lng: 135.5023, zoom: 10, keywords: ["大阪", "osaka"] },
    "京都府": { lat: 35.0116, lng: 135.7681, zoom: 10, keywords: ["京都", "kyoto"] },
    "北海道": { lat: 43.0642, lng: 141.3469, zoom: 7, keywords: ["北海道", "hokkaido", "札幌"] },
    "愛知県": { lat: 35.1802, lng: 136.9066, zoom: 10, keywords: ["愛知", "名古屋", "nagoya"] },
    "福岡県": { lat: 33.5904, lng: 130.4017, zoom: 10, keywords: ["福岡", "fukuoka"] },
    "神奈川県": { lat: 35.4478, lng: 139.6425, zoom: 10, keywords: ["神奈川", "横浜", "yokohama"] },
    "兵庫県": { lat: 34.6913, lng: 135.183, zoom: 9, keywords: ["兵庫", "神戸", "kobe"] },
    "広島県": { lat: 34.3966, lng: 132.4596, zoom: 9, keywords: ["広島", "hiroshima"] },
    "沖縄県": { lat: 26.3344, lng: 127.8056, zoom: 9, keywords: ["沖縄", "okinawa"] },
    "宮城県": { lat: 38.2688, lng: 140.8721, zoom: 9, keywords: ["宮城", "仙台", "sendai"] },
    "千葉県": { lat: 35.6073, lng: 140.1063, zoom: 9, keywords: ["千葉", "chiba"] }
  },
  "vi": {
    "Hà Nội": { lat: 21.0285, lng: 105.8542, zoom: 11, keywords: ["hà nội", "ha noi", "hanoi"] },
    "TP. Hồ Chí Minh": { lat: 10.8231, lng: 106.6297, zoom: 11, keywords: ["hồ chí minh", "ho chi minh", "saigon"] },
    "Đà Nẵng": { lat: 16.0544, lng: 108.2022, zoom: 11, keywords: ["đà nẵng", "da nang"] },
    "Hải Phòng": { lat: 20.8449, lng: 106.6881, zoom: 11, keywords: ["hải phòng", "hai phong"] },
    "Cần Thơ": { lat: 10.0452, lng: 105.7469, zoom: 11, keywords: ["cần thơ", "can tho"] },
    "Nha Trang": { lat: 12.2388, lng: 109.1967, zoom: 11, keywords: ["nha trang", "khánh hòa"] },
    "Huế": { lat: 16.4637, lng: 107.5909, zoom: 11, keywords: ["huế", "hue"] },
    "Đà Lạt": { lat: 11.9404, lng: 108.4583, zoom: 11, keywords: ["đà lạt", "da lat", "lâm đồng"] },
    "Vũng Tàu": { lat: 10.4114, lng: 107.1362, zoom: 11, keywords: ["vũng tàu", "vung tau"] },
    "Quảng Ninh": { lat: 21.0064, lng: 107.2925, zoom: 9, keywords: ["quảng ninh", "hạ long"] }
  },
  "th": {
    "กรุงเทพมหานคร": { lat: 13.7563, lng: 100.5018, zoom: 11, keywords: ["กรุงเทพ", "bangkok"] },
    "เชียงใหม่": { lat: 18.7883, lng: 98.9853, zoom: 10, keywords: ["เชียงใหม่", "chiang mai"] },
    "ภูเก็ต": { lat: 7.8804, lng: 98.3923, zoom: 10, keywords: ["ภูเก็ต", "phuket"] },
    "พัทยา": { lat: 12.9236, lng: 100.8825, zoom: 11, keywords: ["พัทยา", "pattaya", "ชลบุรี"] },
    "เชียงราย": { lat: 19.9105, lng: 99.8406, zoom: 10, keywords: ["เชียงราย", "chiang rai"] },
    "ขอนแก่น": { lat: 16.4322, lng: 102.8236, zoom: 10, keywords: ["ขอนแก่น", "khon kaen"] },
    "สุราษฎร์ธานี": { lat: 9.1382, lng: 99.3217, zoom: 9, keywords: ["สุราษฎร์ธานี", "surat thani", "เกาะสมุย"] },
    "นครราชสีมา": { lat: 14.9799, lng: 102.0978, zoom: 10, keywords: ["นครราชสีมา", "nakhon ratchasima", "โคราช"] },
    "สงขลา": { lat: 7.1896, lng: 100.5945, zoom: 10, keywords: ["สงขลา", "หาดใหญ่", "songkhla"] }
  },
  "km": {
    "ភ្នំពេញ": { lat: 11.5564, lng: 104.9282, zoom: 12, keywords: ["ភ្នំពេញ", "phnom penh"] },
    "សៀមរាប": { lat: 13.3633, lng: 103.86, zoom: 11, keywords: ["សៀមរាប", "siem reap"] },
    "បាត់ដំបង": { lat: 13.1023, lng: 103.1986, zoom: 11, keywords: ["បាត់ដំបង", "battambang"] },
    "ព្រះសីហនុ": { lat: 10.6093, lng: 103.5228, zoom: 11, keywords: ["ព្រះសីហនុ", "sihanoukville"] },
    "កំពង់ចាម": { lat: 11.9925, lng: 105.4533, zoom: 10, keywords: ["កំពង់ចាម", "kampong cham"] },
    "កំពត": { lat: 10.6104, lng: 104.1722, zoom: 10, keywords: ["កំពត", "kampot"] }
  },
  "ru": {
    "Москва": { lat: 55.7558, lng: 37.6173, zoom: 10, keywords: ["москва", "moscow"] },
    "Санкт-Петербург": { lat: 59.9343, lng: 30.3351, zoom: 10, keywords: ["санкт-петербург", "saint petersburg"] },
    "Новосибирск": { lat: 55.0084, lng: 82.9357, zoom: 10, keywords: ["новосибирск", "novosibirsk"] },
    "Екатеринбург": { lat: 56.8389, lng: 60.6057, zoom: 10, keywords: ["екатеринбург", "yekaterinburg"] },
    "Казань": { lat: 55.7887, lng: 49.1221, zoom: 10, keywords: ["казань", "kazan"] },
    "Нижний Новгород": { lat: 56.2965, lng: 43.9361, zoom: 10, keywords: ["нижний новгород"] },
    "Красноярск": { lat: 56.0153, lng: 92.8932, zoom: 10, keywords: ["красноярск"] },
    "Владивосток": { lat: 43.1156, lng: 131.8855, zoom: 10, keywords: ["владивосток", "vladivostok"] },
    "Сочи": { lat: 43.6028, lng: 39.7342, zoom: 11, keywords: ["сочи", "sochi"] }
  },
  "uk": {
    "Київ": { lat: 50.4501, lng: 30.5234, zoom: 10, keywords: ["київ", "kyiv"] },
    "Харків": { lat: 49.9935, lng: 36.2304, zoom: 10, keywords: ["харків", "kharkiv"] },
    "Одеса": { lat: 46.4825, lng: 30.7233, zoom: 10, keywords: ["одеса", "odesa"] },
    "Дніпро": { lat: 48.4647, lng: 35.0462, zoom: 10, keywords: ["дніпро", "dnipro"] },
    "Львів": { lat: 49.8397, lng: 24.0297, zoom: 11, keywords: ["львів", "lviv"] },
    "Запоріжжя": { lat: 47.8388, lng: 35.1396, zoom: 10, keywords: ["запоріжжя"] },
    "Вінниця": { lat: 49.2331, lng: 28.4682, zoom: 10, keywords: ["вінниця", "vinnytsia"] },
    "Полтава": { lat: 49.5883, lng: 34.5514, zoom: 10, keywords: ["полтава"] }
  }
};
const getRegionsForCountry = (code) => {
  if (!code || code === "all") return REGIONS_BY_COUNTRY["ko"];
  return REGIONS_BY_COUNTRY[code] || REGIONS_BY_COUNTRY["ko"];
};
const getDefaultRegion = (code) => {
  const regions = getRegionsForCountry(code);
  return Object.keys(regions)[0] || "서울 전체";
};
const KakaoMap = ({
  venues = [],
  center = null,
  zoom = 12,
  height = "400px",
  singleMode = false,
  onMarkerClick = null,
  countryCode = "all",
  className = ""
}) => {
  const mapRef = reactExports.useRef(null);
  const { t } = useTranslation();
  const mapInstanceRef = reactExports.useRef(null);
  const [mapError, setMapError] = reactExports.useState(false);
  const [mapLoaded, setMapLoaded] = reactExports.useState(false);
  const [showFilter, setShowFilter] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("region");
  const [selectedRegion, setSelectedRegion] = reactExports.useState(getDefaultRegion(countryCode));
  const filterRef = reactExports.useRef(null);
  const validVenues = venues.filter((v2) => v2.latitude && v2.longitude);
  [...new Set(validVenues.map((v2) => {
    if (!v2.location) return null;
    const match = v2.location.match(/([가-힣]+구)/);
    return match ? match[1] : null;
  }).filter(Boolean))];
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  reactExports.useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) {
          resolve();
          return;
        }
        if (!document.querySelector('link[href*="leaflet"]')) {
          const css = document.createElement("link");
          css.rel = "stylesheet";
          css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          css.crossOrigin = "";
          document.head.appendChild(css);
        }
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.crossOrigin = "";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Leaflet"));
          document.head.appendChild(script);
        } else {
          const check = setInterval(() => {
            if (window.L) {
              clearInterval(check);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(check);
            reject(new Error("Timeout"));
          }, 1e4);
        }
      });
    };
    loadLeaflet().then(() => {
      if (cancelled || !mapRef.current) return;
      initMap();
      setMapLoaded(true);
    }).catch((err) => {
      console.error("Map load error:", err);
      if (!cancelled) setMapError(true);
    });
    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      updateMarkers();
    }
  }, [venues, mapLoaded]);
  reactExports.useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    setSelectedRegion(getDefaultRegion(countryCode));
    setActiveTab("region");
    if (!countryCode || countryCode === "all" || countryCode === "ko") return;
    const cc2 = COUNTRY_CENTERS[countryCode];
    if (cc2) {
      mapInstanceRef.current.flyTo([cc2.lat, cc2.lng], cc2.zoom, { duration: 1.2 });
    }
  }, [countryCode, mapLoaded]);
  const initMap = () => {
    const L2 = window.L;
    let centerLat = 37.5665;
    let centerLng = 126.978;
    if (center) {
      centerLat = center.lat;
      centerLng = center.lng;
    } else if (validVenues.length === 1) {
      centerLat = parseFloat(validVenues[0].latitude);
      centerLng = parseFloat(validVenues[0].longitude);
    } else if (validVenues.length > 1) {
      const avgLat = validVenues.reduce((sum, v2) => sum + parseFloat(v2.latitude), 0) / validVenues.length;
      const avgLng = validVenues.reduce((sum, v2) => sum + parseFloat(v2.longitude), 0) / validVenues.length;
      centerLat = avgLat;
      centerLng = avgLng;
    }
    const map = L2.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom: singleMode ? 16 : zoom,
      zoomControl: true
    });
    L2.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    mapInstanceRef.current = map;
    updateMarkers();
  };
  const updateMarkers = () => {
    const L2 = window.L;
    const map = mapInstanceRef.current;
    if (!map || !L2) return;
    map.eachLayer((layer) => {
      if (layer instanceof L2.Marker) {
        map.removeLayer(layer);
      }
    });
    if (validVenues.length === 0) return;
    const typeLabels = {
      popup: t("mapComponent.typePopup"),
      gallery: t("mapComponent.typeGallery"),
      cafe: t("mapComponent.typeCafe"),
      showroom: t("mapComponent.typeShowroom"),
      fleamarket: t("mapComponent.typeFleamarket"),
      store: t("mapComponent.typeStore")
    };
    const bounds = [];
    validVenues.forEach((venue) => {
      const lat = parseFloat(venue.latitude);
      const lng = parseFloat(venue.longitude);
      bounds.push([lat, lng]);
      const icon = L2.divIcon({
        className: "custom-map-marker",
        html: `<div style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
      const typeLabel = typeLabels[venue.type] || venue.type || "";
      const price = venue.price ? Number(venue.price) === 0 ? t("mapComponent.free") : `₩${Number(venue.price).toLocaleString()}` : "";
      const popupContent = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; min-width:180px;">
                    <div style="font-weight:700; font-size:14px; color:#1f2937; margin-bottom:4px;">${venue.name}</div>
                    <div style="font-size:12px; color:#6b7280; margin-bottom:6px;">📍 ${venue.location || ""}</div>
                    <div>
                        ${typeLabel ? `<span style="display:inline-block; background:#eef2ff; color:#4f46e5; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600; margin-right:4px;">${typeLabel}</span>` : ""}
                        ${price ? `<span style="display:inline-block; background:#f0fdf4; color:#16a34a; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:600;">${price}</span>` : ""}
                    </div>
                </div>
            `;
      const marker = L2.marker([lat, lng], { icon }).addTo(map).bindPopup(popupContent);
      if (singleMode && validVenues.length === 1) {
        marker.openPopup();
      }
      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(venue);
        }
      });
    });
    if (bounds.length > 1 && !singleMode) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  };
  const navigateToLocation = (lat, lng, zoomLevel) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([lat, lng], zoomLevel, { duration: 1.2 });
    setShowFilter(false);
  };
  if (mapError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`,
        style: { height },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 32, className: "text-gray-300 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm font-medium", children: t("mapComponent.mapLoadError") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-xs mt-1", children: t("mapComponent.checkInternet") })
        ]
      }
    );
  }
  if (validVenues.length === 0 && venues.length > 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${className}`,
        style: { height },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 32, className: "text-gray-300 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm font-medium", children: t("mapComponent.noLocationData") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-xs mt-1", children: t("mapComponent.registerCoordinates") })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mapRef, style: { width: "100%", height } }),
    !singleMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: filterRef, className: "absolute bottom-3 left-3", style: { zIndex: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowFilter(!showFilter),
          className: "flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg text-sm font-bold text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 14, className: "text-indigo-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-indigo-400" }),
            t("mapComponent.venueCount", { count: validVenues.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: `transition-transform ${showFilter ? "rotate-180" : ""}` })
          ]
        }
      ),
      showFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", children: t("mapComponent.regionFilter") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFilter(false), className: "p-1 hover:bg-white/20 rounded-lg transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 14 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveTab("region"),
              className: `flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === "region" ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50" : "text-gray-400 hover:text-gray-600"}`,
              children: t("mapComponent.metropolitanTab")
            }
          ),
          (!countryCode || countryCode === "all" || countryCode === "ko") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveTab("district"),
              className: `flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === "district" ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50" : "text-gray-400 hover:text-gray-600"}`,
              children: t("mapComponent.districtDetailTab", { region: selectedRegion.replace(" 전체", "") })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveTab("venue"),
              className: `flex-1 py-2.5 text-xs font-bold transition-all ${activeTab === "venue" ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50" : "text-gray-400 hover:text-gray-600"}`,
              children: t("mapComponent.venueShortcutTab")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-56 overflow-y-auto custom-scrollbar p-2", children: [
          activeTab === "region" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1", children: Object.entries(getRegionsForCountry(countryCode)).map(([name, coords]) => {
            const count = validVenues.filter((v2) => {
              const loc = (v2.location || "").toLowerCase();
              const reg = (v2.region || "").toLowerCase();
              return (coords.keywords || []).some((kw) => {
                const kwLower = kw.toLowerCase();
                return loc.includes(kwLower) || reg.includes(kwLower);
              });
            }).length;
            const isSelected = selectedRegion === name;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  navigateToLocation(coords.lat, coords.lng, coords.zoom);
                  setSelectedRegion(name);
                },
                className: `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${isSelected ? "bg-indigo-100 text-indigo-700 font-bold" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name }),
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold", children: count })
                ]
              },
              name
            );
          }) }),
          activeTab === "district" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1", children: REGION_DISTRICTS[selectedRegion] ? Object.entries(REGION_DISTRICTS[selectedRegion]).map(([name, coords]) => {
            const count = validVenues.filter((v2) => v2.location && v2.location.includes(name)).length;
            const hasVenues = count > 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigateToLocation(coords.lat, coords.lng, coords.zoom),
                className: `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${hasVenues ? "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600" : "text-gray-300"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name }),
                  hasVenues && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold", children: count })
                ]
              },
              name
            );
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "col-span-2 text-center text-gray-400 text-xs py-4", children: t("mapComponent.noDistrictData") }) }),
          activeTab === "venue" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: validVenues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-400 text-xs py-4", children: t("mapComponent.noVenuesWithCoords") }) : validVenues.map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigateToLocation(parseFloat(venue.latitude), parseFloat(venue.longitude), 16),
              className: "w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left hover:bg-indigo-50 transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-indigo-400 mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 truncate", children: venue.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 truncate", children: venue.location })
                ] })
              ]
            },
            venue.id
          )) })
        ] })
      ] })
    ] })
  ] });
};
const API_BASE$2 = "/api";
const getImgSrc$1 = (imgPath) => {
  if (!imgPath) return null;
  if (typeof imgPath !== "string") return null;
  if (imgPath.startsWith("/") || imgPath.startsWith("http")) return imgPath;
  return `/${imgPath}`;
};
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
const RecruitmentDashboard = () => {
  const { t, i18n } = useTranslation("venue");
  const [data, setData] = reactExports.useState({ hot_top: [], hot_mid: [], category_featured: {}, all: [] });
  const [allVenues, setAllVenues] = reactExports.useState([]);
  const [trendingVenues, setTrendingVenues] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [filterLocation, setFilterLocation] = reactExports.useState("all");
  const [priceRange, setPriceRange] = reactExports.useState("all");
  const [selectedVenue, setSelectedVenue] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [heroIndex, setHeroIndex] = reactExports.useState(0);
  const [countryFilter, setCountryFilter] = reactExports.useState("all");
  const [sortOrder, setSortOrder] = reactExports.useState("latest");
  const [showMap, setShowMap] = reactExports.useState(true);
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const regionOptions = reactExports.useMemo(() => getRegionOptions(countryFilter), [countryFilter]);
  reactExports.useEffect(() => {
    setFilterLocation("all");
  }, [countryFilter]);
  const trendingRef = reactExports.useRef(null);
  const hotPromoRef = reactExports.useRef(null);
  const { user } = useAuth();
  const location = useLocation();
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const TYPE_LABELS = {
    popup: t("spaceType.popup"),
    gallery: t("spaceType.gallery"),
    cafe: t("spaceType.cafe"),
    showroom: t("spaceType.showroom"),
    fleamarket: t("spaceType.fleamarket"),
    store: t("spaceType.store")
  };
  const getPricingUnitLabel = (unit) => {
    switch (unit) {
      case "weekly":
        return t("perWeek");
      case "monthly":
        return t("perMonth");
      default:
        return t("perDay");
    }
  };
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    fetchAllVenues();
    fetchTrendingVenues();
  }, []);
  const hotPromoVenues = reactExports.useMemo(() => (data.hot_mid || []).map((v2) => ({ ...v2, id: v2.venue_id || v2.id })), [data.hot_mid]);
  const curatedVenues = reactExports.useMemo(() => (data.hot_top || []).map((v2) => ({ ...v2, id: v2.venue_id || v2.id })), [data.hot_top]);
  reactExports.useEffect(() => {
    if (hotPromoVenues.length <= 1) return;
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % hotPromoVenues.length), 5e3);
    return () => clearInterval(timer);
  }, [hotPromoVenues.length]);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const venueId = params.get("venue");
    if (venueId && allVenues.length > 0) {
      const found = allVenues.find((v2) => String(v2.id) === String(venueId));
      if (found) {
        setSelectedVenue(found);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [location.search, allVenues]);
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE$2}/promotions/get_promotions.php`);
      const json = await res.json();
      if (json.success) {
        setData({ hot_top: json.hot_top || [], hot_mid: json.hot_mid || [], category_featured: json.category_featured || {}, all: json.all || [] });
      }
    } catch (err) {
      console.error("Recruitment data load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllVenues = async () => {
    try {
      const res = await fetch(`${API_BASE$2}/venues/get_venues.php`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setAllVenues(json);
      } else if (json.success && Array.isArray(json.venues)) {
        setAllVenues(json.venues);
      }
    } catch (err) {
      console.error("Venue list load failed:", err);
    }
  };
  const fetchTrendingVenues = async () => {
    try {
      const res = await fetch(`${API_BASE$2}/venues/get_trending.php`);
      const json = await res.json();
      if (json.success && Array.isArray(json.trending)) {
        setTrendingVenues(json.trending);
      }
    } catch (err) {
      console.error("Trending venues load failed:", err);
    }
  };
  const getDday = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - /* @__PURE__ */ new Date()) / (1e3 * 60 * 60 * 24));
    if (diff < 0) return { text: t("closed"), color: "bg-gray-500", urgent: false };
    if (diff === 0) return { text: "D-DAY", color: "bg-red-500", urgent: true };
    if (diff <= 3) return { text: `D-${diff}`, color: "bg-red-500", urgent: true };
    if (diff <= 7) return { text: `D-${diff}`, color: "bg-orange-500", urgent: false };
    return { text: `D-${diff}`, color: "bg-blue-500", urgent: false };
  };
  const displayVenues = allVenues.length > 0 ? allVenues : data.all;
  const filteredVenues = reactExports.useMemo(() => {
    const filtered = displayVenues.filter((v2) => {
      const name = v2.name || "";
      const loc = v2.location || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || loc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || v2.type === filterType;
      const matchesLocation = filterLocation === "all" || v2.region === filterLocation || loc.includes(filterLocation);
      const matchesCountry = countryFilter === "all" || v2.owner_country === countryFilter;
      let matchesPrice = true;
      const price = parseInt(v2.price) || 0;
      if (priceRange === "low") matchesPrice = price <= 1e5;
      if (priceRange === "mid") matchesPrice = price > 1e5 && price <= 3e5;
      if (priceRange === "high") matchesPrice = price > 3e5;
      return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesCountry;
    });
    const sorted = [...filtered];
    if (sortOrder === "priceAsc") sorted.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
    else if (sortOrder === "priceDesc") sorted.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
    else if (sortOrder === "popular") sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    else sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return sorted;
  }, [displayVenues, searchTerm, filterType, filterLocation, priceRange, countryFilter, sortOrder]);
  const countryStats = reactExports.useMemo(() => {
    const target = countryFilter === "all" ? displayVenues : displayVenues.filter((v2) => v2.owner_country === countryFilter);
    const totalCount = target.length;
    const prices = target.map((v2) => parseInt(v2.price) || 0).filter((p2) => p2 > 0);
    const avgPrice = prices.length ? Math.round(prices.reduce((s, p2) => s + p2, 0) / prices.length) : 0;
    const activeCount = target.filter((v2) => {
      const cur = parseInt(v2.current_sellers) || 0;
      const max = parseInt(v2.max_sellers) || 0;
      return max === 0 || cur < max;
    }).length;
    return { totalCount, avgPrice, activeCount };
  }, [displayVenues, countryFilter]);
  const HotPlaceCard = ({ venue }) => {
    var _a, _b;
    const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
    const imgSrc = getImgSrc$1(firstImage);
    const dday = getDday(venue.recruitment_deadline);
    const typeLabel = TYPE_LABELS[venue.type] || venue.type;
    const [liked, setLiked] = reactExports.useState(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-200 shadow-lg hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex-shrink-0 w-72 md:w-80",
        onClick: () => setSelectedVenue(venue),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 z-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden", children: [
            imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, className: "text-orange-200" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-extrabold shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 12 }),
              "HOT"
            ] }),
            dday && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-3 right-3 px-2.5 py-1 ${dday.color} text-white rounded-lg text-xs font-extrabold shadow-lg ${dday.urgent ? "animate-pulse" : ""}`, children: dday.text })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 11 }),
              typeLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors truncate", children: venue.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "flex-shrink-0 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: ((_b = venue.location) == null ? void 0 : _b.split(" ").slice(0, 2).join(" ")) || t("locationTBD") })
            ] }),
            venue.recruitment_deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "flex-shrink-0 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("recruitmentDeadline", { date: venue.recruitment_deadline }) }),
              dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`, children: dday.text })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 pt-2 border-t border-gray-50", children: [
              user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: user.role === "seller" ? "/seller" : user.role === "host" ? "/host" : "/admin",
                  onClick: (e) => e.stopPropagation(),
                  className: "flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors",
                  children: t("apply")
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/login",
                  onClick: (e) => e.stopPropagation(),
                  className: "flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors",
                  children: t("apply")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setLiked(!liked);
                  },
                  className: `p-2 rounded-lg border transition-colors ${liked ? "bg-red-50 border-red-200 text-red-500" : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400 hover:border-red-200"}`,
                  title: t("like"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, fill: liked ? "currentColor" : "none" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: async (e) => {
                    e.stopPropagation();
                    const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.venue_id || venue.id}`;
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(t("linkCopied"));
                    } catch {
                    }
                  },
                  className: "p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors",
                  title: t("share"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 14 })
                }
              )
            ] })
          ] })
        ]
      }
    );
  };
  const TrendingCard = ({ venue }) => {
    var _a, _b;
    const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
    const imgSrc = getImgSrc$1(firstImage);
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
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-gray-900 mb-1.5 group-hover:text-violet-600 transition-colors text-sm truncate", children: venue.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                (_b = venue.location) == null ? void 0 : _b.split(" ").slice(0, 2).join(" ")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: TYPE_LABELS[venue.type] || venue.type })
            ] })
          ] })
        ]
      }
    );
  };
  const VenueCard = ({ venue }) => {
    var _a;
    const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
    const imgSrc = getImgSrc$1(firstImage);
    const typeLabel = TYPE_LABELS[venue.type] || venue.type;
    const dday = getDday(venue.recruitment_deadline);
    const [liked, setLiked] = reactExports.useState(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setSelectedVenue(venue),
        className: "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-48 relative bg-gray-100 overflow-hidden", children: [
            imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, strokeWidth: 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm mt-2 font-medium", children: "No Image" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/20", children: typeLabel }),
            dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-3 right-3 px-2.5 py-1 ${dday.color} text-white rounded-lg text-xs font-extrabold shadow-lg ${dday.urgent ? "animate-pulse" : ""}`, children: dday.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-lg", children: Number(venue.price) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: t("free") }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "₩",
              parseInt(venue.price).toLocaleString(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-normal text-xs ml-1", children: getPricingUnitLabel(venue.pricing_unit) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 11 }),
              typeLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1", children: venue.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "flex-shrink-0 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: venue.location || t("locationTBD") })
            ] }),
            venue.recruitment_deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "flex-shrink-0 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("recruitmentDeadline", { date: venue.recruitment_deadline }) }),
              dday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`, children: dday.text })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 pt-3 border-t border-gray-100", children: [
              user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: user.role === "seller" ? "/seller" : user.role === "host" ? "/host" : "/admin",
                  onClick: (e) => e.stopPropagation(),
                  className: "flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold text-center hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all",
                  children: t("applyForEntry")
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/login",
                  onClick: (e) => e.stopPropagation(),
                  className: "flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold text-center hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all",
                  children: t("applyForEntry")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setLiked(!liked);
                  },
                  className: `p-2.5 rounded-xl border transition-all ${liked ? "bg-red-50 border-red-200 text-red-500 shadow-sm" : "bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"}`,
                  title: t("like"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, fill: liked ? "currentColor" : "none" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: async (e) => {
                    e.stopPropagation();
                    const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.id || venue.venue_id}`;
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(t("linkCopied"));
                    } catch {
                    }
                  },
                  className: "p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-all",
                  title: t("share"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 })
                }
              )
            ] })
          ] })
        ]
      }
    );
  };
  const VenueDetailModal = ({ venue, onClose }) => {
    var _a;
    if (!venue) return null;
    const dday = getDday(venue.recruitment_deadline);
    const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
    const imgSrc = getImgSrc$1(firstImage);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: onClose, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 18 }) }),
        imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-52 md:h-64 overflow-hidden rounded-t-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover" }),
          dday && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-4 left-4 px-3 py-1 ${dday.color} text-white rounded-lg text-sm font-bold shadow-lg`, children: dday.text })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-t-3xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 48, className: "text-indigo-300" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          venue.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-orange-500 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-orange-700", children: venue.admin_note })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-900 mb-3", children: venue.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-gray-400 flex-shrink-0" }),
              venue.location || t("locationTBD")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16, className: "text-gray-400 flex-shrink-0" }),
              TYPE_LABELS[venue.type] || venue.type || t("typeTBD")
            ] }),
            venue.size && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 16, className: "text-gray-400 flex-shrink-0" }),
              venue.size
            ] }),
            venue.price && Number(venue.price) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 flex-shrink-0 font-bold text-sm" }),
              "₩",
              parseInt(venue.price).toLocaleString(),
              getPricingUnitLabel(venue.pricing_unit)
            ] }),
            parseFloat(venue.commission_rate) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 flex-shrink-0 font-bold text-sm" }),
              t("commissionRate", { rate: venue.commission_rate })
            ] }),
            venue.recruitment_deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-gray-400 flex-shrink-0" }),
              t("recruitmentDeadline", { date: venue.recruitment_deadline })
            ] })
          ] }),
          venue.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-2xl p-4 mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: venue.description }) }),
          (() => {
            const approved = parseInt(venue.approved_count) || 0;
            const max = parseInt(venue.max_sellers) || 0;
            const isFull = max > 0 && approved >= max;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-5 text-sm font-bold ${isFull ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                " ",
                t("occupancy")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                approved,
                max > 0 ? ` / ${max}` : "",
                isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full", children: t("full") })
              ] })
            ] });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: async () => {
                  const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.id}`;
                  const shareText = `[SpaceMatch] ${venue.name}
📍 ${venue.location || t("locationTBD")}`;
                  if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
                    try {
                      await navigator.share({ title: `SpaceMatch - ${venue.name}`, text: shareText, url: shareUrl });
                    } catch (e) {
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(t("linkCopied"));
                    } catch (e) {
                      const ta2 = document.createElement("textarea");
                      ta2.value = shareUrl;
                      document.body.appendChild(ta2);
                      ta2.select();
                      document.execCommand("copy");
                      document.body.removeChild(ta2);
                      showToast(t("linkCopied"));
                    }
                  }
                },
                className: "px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-sm flex items-center gap-2",
                title: t("share"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }),
                  t("share")
                ]
              }
            ),
            user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: user.role === "seller" ? "/seller" : user.role === "host" ? "/host" : "/admin",
                className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition-colors text-sm",
                children: t("applyForEntry")
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition-colors text-sm", children: t("loginAndApply") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-5 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm", children: t("close") })
          ] })
        ] })
      ] })
    ] });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-20 md:pt-24", children: hotPromoVenues.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 md:px-6 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-3xl overflow-hidden shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[250px] md:h-[400px] bg-gray-900", children: [
      hotPromoVenues.map((venue, i) => {
        var _a, _b, _c;
        const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
        const imgSrc = ((_b = firstImage == null ? void 0 : firstImage.startsWith) == null ? void 0 : _b.call(firstImage, "uploads/")) ? `/${firstImage}` : firstImage;
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
                  venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium", children: TYPE_LABELS[venue.type] || venue.type })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-3xl font-black text-white mb-1.5 line-clamp-1", children: venue.name }),
                venue.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-orange-200 font-medium mb-1 line-clamp-1", children: venue.admin_note }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-white/70 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                  (_c = venue.location) == null ? void 0 : _c.split(" ").slice(0, 2).join(" ")
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
    ] }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 md:px-6 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300", children: "Find Your Space" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-2 font-medium", children: t("recruitment.heroDesc") })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6 space-y-8 pb-16 pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg md:text-xl font-black text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20, className: "text-indigo-500" }),
            t("recruitment.countryFilter")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sortOrder,
              onChange: (e) => setSortOrder(e.target.value),
              className: "px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-indigo-400 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "latest", children: t("recruitment.sortLatest") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "priceAsc", children: t("recruitment.sortPriceAsc") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "priceDesc", children: t("recruitment.sortPriceDesc") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popular", children: t("recruitment.sortPopular") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-1 px-1 scrollbar-hide", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-2 min-w-max", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setCountryFilter("all"),
              className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${countryFilter === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`,
              children: [
                "🌍 ",
                t("recruitment.allCountries"),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[11px]", children: displayVenues.length })
              ]
            }
          ),
          Object.entries(COUNTRY_FLAGS).map(([code, info]) => {
            const cnt = displayVenues.filter((v2) => v2.owner_country === code).length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setCountryFilter(code),
                className: `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${countryFilter === code ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.flag }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: i18n.language === "ko" ? info.name : info.nameEn }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-0.5 px-1.5 py-0.5 rounded-md text-[11px] ${countryFilter === code ? "bg-white/20" : "bg-gray-100 text-gray-500"}`, children: cnt })
                ]
              },
              code
            );
          })
        ] }) }),
        countryFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-800/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-indigo-600 dark:text-indigo-400", children: countryStats.totalCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-indigo-400 dark:text-indigo-300/70 mt-0.5", children: t("recruitment.venueCount") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-emerald-600 dark:text-emerald-400", children: countryStats.avgPrice > 0 ? `${Math.round(countryStats.avgPrice / 1e4)}만` : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-emerald-400 dark:text-emerald-300/70 mt-0.5", children: t("recruitment.avgPrice") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-amber-600 dark:text-amber-400", children: countryStats.activeCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-amber-400 dark:text-amber-300/70 mt-0.5", children: t("recruitment.activeRecruit") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg md:text-xl font-black text-gray-900", children: t("recruitment.category") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 scrollbar-thin", children: [
          { key: "all", label: t("recruitment.allTypes"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 14 }) },
          { key: "popup", label: t("spaceType.popup"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 }) },
          { key: "fleamarket", label: t("spaceType.fleamarket"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
          { key: "gallery", label: t("spaceType.gallery"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }) },
          { key: "cafe", label: t("spaceType.cafe"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
          { key: "showroom", label: t("spaceType.showroom"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) },
          { key: "store", label: t("spaceType.store", "스토어"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }) }
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black", children: t("recruitment.hotPlaces") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("recruitment.hotPlacesDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  var _a;
                  return (_a = hotPromoRef.current) == null ? void 0 : _a.scrollBy({ left: -300, behavior: "smooth" });
                },
                className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  var _a;
                  return (_a = hotPromoRef.current) == null ? void 0 : _a.scrollBy({ left: 300, behavior: "smooth" });
                },
                className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: hotPromoRef, className: "flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth", children: curatedVenues.map((venue, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(HotPlaceCard, { venue }, venue.promotion_id || i)) })
      ] }),
      trendingVenues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black", children: t("recruitment.trendingSpaces") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("recruitment.trendingDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  var _a;
                  return (_a = trendingRef.current) == null ? void 0 : _a.scrollBy({ left: -300, behavior: "smooth" });
                },
                className: "w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  var _a;
                  return (_a = trendingRef.current) == null ? void 0 : _a.scrollBy({ left: 300, behavior: "smooth" });
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowMap(!showMap),
              className: `flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-lg ${showMap ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Map$1, { size: 18 }),
                t("recruitment.mapView")
              ]
            }
          ),
          showMap && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 font-medium hidden md:block", children: t("recruitment.mapHint") }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base sm:text-lg font-black", children: t("recruitment.allSpaces") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400 font-medium", children: filteredVenues.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setViewMode("grid"),
                className: `p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`,
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
                placeholder: t("searchPlaceholder"),
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-transparent text-gray-700 placeholder-gray-400 font-medium text-sm sm:text-base"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors", size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: filterType,
                  onChange: (e) => setFilterType(e.target.value),
                  className: "w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("recruitment.allTypes") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popup", children: t("spaceType.popup") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fleamarket", children: t("spaceType.fleamarket") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gallery", children: t("spaceType.gallery") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cafe", children: t("spaceType.cafe") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "showroom", children: t("spaceType.showroom") })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 12 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors", size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: filterLocation,
                  onChange: (e) => setFilterLocation(e.target.value),
                  className: "w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("recruitment.allRegions") }),
                    regionOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
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
                  className: "w-full pl-7 sm:pl-9 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("recruitment.allPrices") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: t("recruitment.under100k") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mid", children: t("recruitment.range100to300k") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: t("recruitment.over300k") })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", size: 12 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [
          filteredVenues.map((venue, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VenueCard, { venue }, venue.id || venue.venue_id || i)),
          filteredVenues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-32 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 40 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: t("recruitment.noResults") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: t("recruitment.tryDifferent") })
          ] })
        ] })
      ] })
    ] }),
    selectedVenue && /* @__PURE__ */ jsxRuntimeExports.jsx(VenueDetailModal, { venue: selectedVenue, onClose: () => setSelectedVenue(null) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const API_BASE$1 = "/api";
const getImgSrc = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  if (imgPath.startsWith("/")) return imgPath;
  return `/spacematch/uploads/venues/${imgPath}`;
};
const HostPublicProfile = () => {
  const { id: id2 } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [activeVenueTab, setActiveVenueTab] = reactExports.useState("all");
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(-1);
  const TYPE_LABELS = {
    popup: t("publicProfile.typePopup"),
    gallery: t("publicProfile.typeGallery"),
    cafe: t("publicProfile.typeCafe"),
    showroom: t("publicProfile.typeShowroom"),
    fleamarket: t("publicProfile.typeFleamarket"),
    store: t("publicProfile.typeStore")
  };
  reactExports.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE$1}/users/get_public_profile.php?id=${encodeURIComponent(id2)}`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data);
        } else {
          setError(data.message || t("publicProfile.profileLoadFailed"));
        }
      } catch (err) {
        setError(t("publicProfile.profileLoadError"));
      } finally {
        setLoading(false);
      }
    };
    if (id2) fetchProfile();
  }, [id2]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-28 bg-gray-200 rounded-2xl -mt-16 ml-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 bg-gray-200 rounded-lg w-48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-100 rounded w-32" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 bg-gray-100 rounded-2xl" }, i)) })
      ] }) })
    ] });
  }
  if (error || !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 40, className: "text-indigo-200" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-900 mb-2", children: t("publicProfile.profileNotFound") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-8", children: error || t("publicProfile.invalidAccess") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200", children: t("publicProfile.goBack") })
      ] })
    ] });
  }
  const user = profile.user;
  const venues = profile.venues || [];
  profile.stats || {};
  profile.community_stats || {};
  const isHost = user.role === "host";
  const isSeller = user.role === "seller";
  const sellerPhotos = profile.seller_photos || [];
  const applications = profile.applications || [];
  const displayName = user.brand_name || user.name;
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long" }) : "";
  const getTypeLabel = (type) => TYPE_LABELS[type] || type;
  const venueTypes = [...new Set(venues.map((v2) => v2.type).filter(Boolean))];
  const filteredVenues = activeVenueTab === "all" ? venues : venues.filter((v2) => v2.type === activeVenueTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-56 md:h-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 right-20 w-60 h-60 bg-pink-400/10 rounded-full blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.03]",
            style: { backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative -mt-24 md:-mt-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-5 items-start", children: [
          user.profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: user.profile_image,
              alt: displayName,
              className: "w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-indigo-100 flex-shrink-0"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-4 border-white shadow-lg ring-2 ring-indigo-100 flex items-center justify-center text-white text-4xl font-black flex-shrink-0", children: (displayName || "?").charAt(0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-black text-gray-900", children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isHost ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"}`, children: isHost ? t("publicProfile.roleHost") : isSeller ? t("publicProfile.roleSeller") : user.role })
            ] }),
            user.brand_name && user.name !== user.brand_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-2", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-3", children: [
              joinDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                joinDate,
                " ",
                t("publicProfile.joined")
              ] }),
              user.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12 }),
                user.category
              ] }),
              user.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `https://instagram.com/${user.instagram.replace("@", "")}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1.5 text-xs text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg font-medium hover:bg-pink-100 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 12 }),
                    "@",
                    user.instagram.replace("@", "")
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex sm:flex-col gap-3 flex-shrink-0", children: [
            isHost && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl px-5 py-3 text-center border border-indigo-100/50 min-w-[90px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: venues.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-indigo-500 mt-0.5", children: t("publicProfile.registeredSpaces") })
            ] }),
            isSeller && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl px-5 py-3 text-center border border-emerald-100/50 min-w-[90px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent", children: applications.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-emerald-500 mt-0.5", children: t("publicProfile.entryActivity") })
            ] })
          ] })
        ] }),
        user.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-5 border-t border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 leading-relaxed whitespace-pre-line", children: user.description }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 flex-1", children: [
      isHost && venues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-black text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 20, className: "text-indigo-500" }),
            t("publicProfile.registeredSpaces"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-indigo-500 ml-1", children: venues.length })
          ] }),
          venueTypes.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 bg-gray-100 p-1 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveVenueTab("all"),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeVenueTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                children: t("publicProfile.allTypes")
              }
            ),
            venueTypes.map((vt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveVenueTab(vt),
                className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeVenueTab === vt ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
                children: getTypeLabel(vt)
              },
              vt
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredVenues.map((venue) => {
          var _a;
          const firstImage = (_a = venue.images) == null ? void 0 : _a[0];
          const imgSrc = getImgSrc(firstImage);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer",
              onClick: () => navigate(`/recruitment?venue=${venue.id}`),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 overflow-hidden", children: [
                  imgSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: venue.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 36, className: "text-indigo-300" }) }),
                  venue.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-gray-700 shadow-sm", children: TYPE_LABELS[venue.type] || venue.type })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors truncate", children: venue.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 flex items-center gap-1 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-gray-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.location || t("locationTBD") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    venue.price && Number(venue.price) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-black text-indigo-600", children: [
                      "₩",
                      Number(venue.price).toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-gray-400 font-medium flex items-center gap-1 ml-auto", children: [
                      t("publicProfile.viewDetails"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
                    ] })
                  ] })
                ] })
              ]
            },
            venue.id
          );
        }) })
      ] }),
      isSeller && sellerPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-black text-gray-900 flex items-center gap-2 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { size: 20, className: "text-emerald-500" }),
          t("publicProfile.productPhotos")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: sellerPhotos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "aspect-square rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg transition-all cursor-pointer relative",
            onClick: () => setLightboxIndex(idx),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo.image_url, alt: photo.caption || t("publicProfile.product"), className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { size: 24, className: "text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" }) })
            ]
          },
          photo.id
        )) })
      ] }),
      lightboxIndex >= 0 && sellerPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm",
          onClick: () => setLightboxIndex(-1),
          onKeyDown: (e) => {
            if (e.key === "Escape") setLightboxIndex(-1);
            if (e.key === "ArrowLeft" && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
            if (e.key === "ArrowRight" && lightboxIndex < sellerPhotos.length - 1) setLightboxIndex(lightboxIndex + 1);
          },
          tabIndex: 0,
          ref: (el2) => el2 && el2.focus(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setLightboxIndex(-1),
                className: "absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-bold", children: [
              lightboxIndex + 1,
              " / ",
              sellerPhotos.length
            ] }),
            lightboxIndex > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                },
                className: "absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 24 })
              }
            ),
            lightboxIndex < sellerPhotos.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                },
                className: "absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "max-w-[90vw] max-h-[85vh] relative",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: sellerPhotos[lightboxIndex].image_url,
                      alt: sellerPhotos[lightboxIndex].caption || t("publicProfile.productPhoto"),
                      className: "max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                    }
                  ),
                  sellerPhotos[lightboxIndex].caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-xl", children: sellerPhotos[lightboxIndex].caption })
                ]
              }
            )
          ]
        }
      ),
      isSeller && applications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-black text-gray-900 flex items-center gap-2 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 20, className: "text-amber-500" }),
          t("publicProfile.entryHistory")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden", children: applications.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16, className: "text-emerald-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 truncate", children: app.venue_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "flex-shrink-0" }),
              app.venue_location || "",
              app.venue_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-400 ml-1", children: [
                "· ",
                getTypeLabel(app.venue_type)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold flex-shrink-0", children: t("publicProfile.approved") })
        ] }, app.id)) })
      ] }),
      isHost && venues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 py-16 px-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { size: 32, className: "text-indigo-200" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-bold text-lg mb-1", children: t("publicProfile.noSpacesYet") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: t("publicProfile.noSpacesDesc") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicFooter, {})
  ] });
};
const API_BASE = "/api/ads";
const ReportChart$1 = ({ data, width = 600, height = 220 }) => {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    ctx.clearRect(0, 0, width, height);
    const maxVal = Math.max(...data.map((d) => Math.max(d.views, d.clicks)), 1);
    const barGroupW = chartW / data.length;
    const barW = Math.min(barGroupW * 0.35, 20);
    const gap = 2;
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH / 4 * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal - maxVal / 4 * i).toLocaleString(), padding.left - 6, y + 3);
    }
    data.forEach((d, i) => {
      const x = padding.left + barGroupW * i + barGroupW / 2;
      const viewH = d.views / maxVal * chartH;
      const g1 = ctx.createLinearGradient(0, padding.top + chartH - viewH, 0, padding.top + chartH);
      g1.addColorStop(0, "#818cf8");
      g1.addColorStop(1, "#4f46e5");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.roundRect(x - barW - gap / 2, padding.top + chartH - viewH, barW, viewH, [3, 3, 0, 0]);
      ctx.fill();
      const clickH = d.clicks / maxVal * chartH;
      const g2 = ctx.createLinearGradient(0, padding.top + chartH - clickH, 0, padding.top + chartH);
      g2.addColorStop(0, "#34d399");
      g2.addColorStop(1, "#059669");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, padding.top + chartH - clickH, barW, clickH, [3, 3, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(x, padding.top + chartH + 14);
      ctx.rotate(-0.5);
      ctx.fillText(d.stat_date.slice(5), 0, 0);
      ctx.restore();
    });
  }, [data, width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { width: "100%", maxWidth: width } });
};
const AdSharePage = () => {
  const { t } = useTranslation("ads");
  const SLOT_LABELS = {
    seller_community_top: t("slots.sellerCommunityTop", "Seller Community Top"),
    seller_community_feed: t("slots.sellerCommunityFeed", "Seller Community Feed"),
    seller_dashboard_top: t("slots.sellerDashboardTop", "Seller Dashboard Top"),
    seller_dashboard_mid: t("slots.sellerDashboardMid", "Seller Dashboard Mid"),
    host_dashboard_top: t("slots.hostDashboardTop", "Host Dashboard Top"),
    host_dashboard_mid: t("slots.hostDashboardMid", "Host Dashboard Mid"),
    general_community_top: t("slots.generalCommunityTop", "General Community Top"),
    general_community_feed: t("slots.generalCommunityFeed", "General Community Feed"),
    landing_a: t("slots.landingA", "Landing A"),
    landing_b: t("slots.landingB", "Landing B"),
    landing_b2: t("slots.landingB2", "Landing B2")
  };
  const { token } = useParams();
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE}/ad_share_report.php?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setReport(data);
        } else {
          setError(data.message || "Failed to load report");
        }
      } catch {
        setError("서버에 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "animate-spin text-indigo-600 mx-auto mb-4", size: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-medium", children: "리포트 로딩 중..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-xl p-10 max-w-md text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "text-red-400 mx-auto mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-gray-900 mb-2", children: "접근 불가" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: error })
    ] }) });
  }
  const { ad: ad2, summary, daily_stats } = report;
  const chartWidth = Math.max(600, daily_stats.length * 40);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white border-b border-gray-100 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-black text-gray-900", children: "SpaceMatch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 font-medium", children: "광고 성과 리포트" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `${API_BASE}/ad_share_export.php?token=${token}`, download: true, className: "flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
        "Export Excel"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-4 py-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black", children: ad2.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-indigo-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/15 px-2 py-0.5 rounded-lg", children: SLOT_LABELS[ad2.slot_id] || ad2.slot_id }),
            ad2.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
              " ",
              ad2.start_date,
              " ~ ",
              ad2.end_date || "진행중"
            ] })
          ] })
        ] }),
        ad2.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ad2.image_url, alt: ad2.title, className: "w-full max-h-48 object-cover rounded-2xl" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        { label: "총 노출수", value: summary.total_views.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }), color: "from-blue-500 to-indigo-600" },
        { label: "총 클릭수", value: summary.total_clicks.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 18 }), color: "from-emerald-500 to-teal-600" },
        { label: "CTR", value: summary.ctr + "%", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 18 }), color: "from-orange-500 to-red-500" },
        { label: "집행 일수", value: summary.running_days + "일", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18 }), color: "from-violet-500 to-purple-600" }
      ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm p-4 border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-8 h-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`, children: stat.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 font-medium", children: stat.label })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-indigo-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: "Daily Avg Impressions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900", children: summary.avg_daily_views })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 font-medium", children: "일평균 클릭" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-gray-900", children: summary.avg_daily_clicks })
          ] })
        ] })
      ] }),
      daily_stats.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm p-5 border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-indigo-500" }),
          "일별 추이"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-3 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-gradient-to-b from-indigo-400 to-indigo-600" }),
            "노출수"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600" }),
            "클릭수"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReportChart$1, { data: daily_stats, width: chartWidth, height: 220 }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 32, className: "mx-auto mb-2 text-gray-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "일별 데이터가 아직 없습니다" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-300 font-medium", children: "Powered by SpaceMatch · 광고 성과 리포트" }) })
    ] })
  ] });
};
function ReportChart({ data, width = 600, height = 220 }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cw = width - pad.left - pad.right;
    const ch2 = height - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map((d) => parseInt(d.views || 0)), 1);
    const barW = Math.max(Math.min(cw / data.length - 4, 24), 6);
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ch2 / 4 * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal * (1 - i / 4)).toLocaleString(), pad.left - 8, y + 3);
    }
    data.forEach((d, i) => {
      const x = pad.left + cw / data.length * i + (cw / data.length - barW) / 2;
      const v2 = parseInt(d.views || 0);
      const c = parseInt(d.clicks || 0);
      const vh2 = v2 / maxVal * ch2;
      const ch22 = c / maxVal * ch2;
      const grad = ctx.createLinearGradient(x, pad.top + ch2 - vh2, x, pad.top + ch2);
      grad.addColorStop(0, "#818cf8");
      grad.addColorStop(1, "#6366f1");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, pad.top + ch2 - vh2, barW, vh2, [3, 3, 0, 0]);
      ctx.fill();
      if (ch22 > 0) {
        const grad2 = ctx.createLinearGradient(x, pad.top + ch2 - ch22, x, pad.top + ch2);
        grad2.addColorStop(0, "#34d399");
        grad2.addColorStop(1, "#10b981");
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.roundRect(x, pad.top + ch2 - ch22, barW, ch22, [3, 3, 0, 0]);
        ctx.fill();
      }
      ctx.fillStyle = "#9ca3af";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      const label = d.stat_date ? d.stat_date.substring(5) : "";
      ctx.fillText(label, x + barW / 2, height - pad.bottom + 16);
    });
  }, [data, width, height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { width, height }, className: "w-full" });
}
const CampaignSharePage = () => {
  var _a, _b;
  const { t } = useTranslation("ads");
  const SLOT_LABELS = {
    seller_community_top: t("slots.sellerCommunityTop", "Seller Community Top"),
    seller_community_feed: t("slots.sellerCommunityFeed", "Seller Community Feed"),
    seller_dashboard_top: t("slots.sellerDashboardTop", "Seller Dashboard Top"),
    seller_dashboard_mid: t("slots.sellerDashboardMid", "Seller Dashboard Mid"),
    host_dashboard_top: t("slots.hostDashboardTop", "Host Dashboard Top"),
    host_dashboard_mid: t("slots.hostDashboardMid", "Host Dashboard Mid"),
    general_community_top: t("slots.generalCommunityTop", "General Community"),
    general_community_feed: t("slots.generalCommunityFeed", "General Feed"),
    landing_a: t("slots.landingA", "Landing A"),
    landing_b: t("slots.landingB", "Landing B"),
    landing_b2: t("slots.landingB2", "Landing B2")
  };
  const { token } = useParams();
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/ads/campaign_share_report.php?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setReport(data);
        } else {
          setError(data.message || "Failed to load report");
        }
      } catch {
        setError("서버 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);
  const handleExcelDownload = () => {
    var _a2;
    if (!report) return;
    let csv = "\uFEFF캠페인 통합 리포트\n";
    csv += `캠페인명,${report.campaign.name}
`;
    csv += `광고주,${report.campaign.advertiser || "-"}
`;
    csv += `기간,${report.campaign.start_date || "-"} ~ ${report.campaign.end_date || "진행 중"}

`;
    csv += "광고,슬롯,노출,클릭,CTR\n";
    (report.ads || []).forEach((a) => {
      const v2 = parseInt(a.view_count || 0);
      const c = parseInt(a.click_count || 0);
      const ctr = v2 > 0 ? (c / v2 * 100).toFixed(2) : "0.00";
      csv += `"${a.title}",${SLOT_LABELS[a.slot_id] || a.slot_id},${v2},${c},${ctr}%
`;
    });
    csv += `
합계,,${report.summary.total_views},${report.summary.total_clicks},${report.summary.ctr}%
`;
    if (((_a2 = report.daily_stats) == null ? void 0 : _a2.length) > 0) {
      csv += "\n날짜,노출,클릭\n";
      report.daily_stats.forEach((d) => {
        csv += `${d.stat_date},${d.views},${d.clicks}
`;
      });
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `campaign_report_${report.campaign.name}.csv`;
    link.click();
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "animate-spin mx-auto text-indigo-500", size: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-4", children: "리포트 로딩 중..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md p-8 bg-white rounded-2xl shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "mx-auto text-amber-500 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-2", children: "리포트를 확인할 수 없습니다" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: error })
    ] }) });
  }
  const s = report.summary;
  const statusLabels = { active: "진행 중", paused: "일시정지", completed: "완료" };
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
  const totalViewsForBar = Math.max(s.total_views, 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "opacity-80", size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-200 text-sm font-medium", children: "캠페인 통합 리포트" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold mb-1", children: report.campaign.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-indigo-200", children: [
        report.campaign.advertiser && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: report.campaign.advertiser }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold", children: statusLabels[report.campaign.status] || report.campaign.status }),
        report.campaign.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          report.campaign.start_date,
          " ~ ",
          report.campaign.end_date || "진행 중"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-6 -mt-4 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
        { label: "총 노출", value: s.total_views.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }), bg: "bg-indigo-500" },
        { label: "총 클릭", value: s.total_clicks.toLocaleString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 18 }), bg: "bg-emerald-500" },
        { label: "CTR", value: s.ctr + "%", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 18 }), bg: "bg-amber-500" },
        { label: "집행일", value: s.running_days + "일", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 18 }), bg: "bg-violet-500" }
      ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center text-white mb-3`, children: stat.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-extrabold text-gray-900", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 font-medium", children: stat.label })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50 rounded-xl p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-indigo-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-indigo-700", children: s.avg_daily_views }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-indigo-400 font-medium", children: "일평균 노출" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { size: 20, className: "text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-extrabold text-emerald-700", children: s.avg_daily_clicks }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-emerald-400 font-medium", children: "일평균 클릭" })
          ] })
        ] })
      ] }),
      ((_a = report.ads) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart3, { size: 16, className: "text-indigo-500" }),
          " 광고별 성과 (",
          report.ads.length,
          "개)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-full h-3 overflow-hidden mb-4", children: report.ads.map((a, i) => {
          const pct = parseInt(a.view_count || 0) / totalViewsForBar * 100;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${pct}%`, backgroundColor: colors[i % colors.length] }, className: "transition-all", title: `${a.title}: ${pct.toFixed(1)}%` }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: report.ads.map((a, i) => {
          const v2 = parseInt(a.view_count || 0);
          const c = parseInt(a.click_count || 0);
          const ctr = v2 > 0 ? (c / v2 * 100).toFixed(2) : "0.00";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full flex-shrink-0", style: { backgroundColor: colors[i % colors.length] } }),
            a.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image_url, alt: "", className: "w-12 h-8 object-cover rounded-lg border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 truncate", children: a.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400", children: SLOT_LABELS[a.slot_id] || a.slot_id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-gray-700", children: [
                v2.toLocaleString(),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-medium", children: "Impressions" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-bold", children: c.toLocaleString() }),
                " 클릭 · ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-600 font-bold", children: [
                  ctr,
                  "%"
                ] })
              ] })
            ] })
          ] }, i);
        }) })
      ] }),
      ((_b = report.daily_stats) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-700 mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, className: "text-violet-500" }),
          " 일별 추이"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2 text-[10px] text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-2 rounded bg-indigo-500 inline-block" }),
            " 노출"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-2 rounded bg-emerald-500 inline-block" }),
            " 클릭"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReportChart, { data: report.daily_stats })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExcelDownload, className: "inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
        " Excel 다운로드"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[10px] text-gray-300 mt-8", children: [
        "Spacematch Campaign Report · Generated at ",
        (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR")
      ] })
    ] })
  ] });
};
const SecurityGuard = () => {
  const [devtoolsAllowed, setDevtoolsAllowed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetch("/api/admin/security_flags.php", { credentials: "include" }).then((r) => r.ok ? r.json() : null).then((data) => {
      var _a;
      if ((data == null ? void 0 : data.success) && ((_a = data.flags) == null ? void 0 : _a.disable_devtools_block) === "1") {
        setDevtoolsAllowed(true);
      }
    }).catch(() => {
    });
  }, []);
  const blockEvent = reactExports.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);
  reactExports.useEffect(() => {
    if (devtoolsAllowed) return;
    const handleContextMenu = (e) => blockEvent(e);
    const handleKeyDown = (e) => {
      var _a, _b, _c;
      const key = (_a = e.key) == null ? void 0 : _a.toLowerCase();
      const code = e.keyCode || e.which;
      if (key === "printscreen" || code === 44) {
        e.preventDefault();
        try {
          (_c = (_b = navigator.clipboard) == null ? void 0 : _b.writeText) == null ? void 0 : _c.call(_b, "");
        } catch {
        }
        showSecurityAlert();
        return false;
      }
      if (code === 123) {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey || e.metaKey) {
        if (key === "u") {
          e.preventDefault();
          return false;
        }
        if (key === "s") {
          e.preventDefault();
          return false;
        }
        if (key === "p") {
          e.preventDefault();
          return false;
        }
        if (key === "a") {
          e.preventDefault();
          return false;
        }
        if (key === "c" && !e.shiftKey) {
          e.preventDefault();
          return false;
        }
        if (e.shiftKey && ["i", "j", "c"].includes(key)) {
          e.preventDefault();
          return false;
        }
        if (e.shiftKey && key === "s") {
          e.preventDefault();
          showSecurityAlert();
          return false;
        }
      }
      if (e.metaKey && e.shiftKey && key === "s") {
        e.preventDefault();
        showSecurityAlert();
        return false;
      }
    };
    const handleDragStart = (e) => {
      if (e.target.closest && e.target.closest(".leaflet-container")) return;
      e.preventDefault();
      return false;
    };
    const handleCopy = (e) => {
      var _a, _b;
      const tag = (_b = (_a = e.target) == null ? void 0 : _a.tagName) == null ? void 0 : _b.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", "이 콘텐츠는 저작권으로 보호됩니다. 무단 복제를 금지합니다.");
      }
      return false;
    };
    const handleBeforePrint = () => {
      document.body.style.visibility = "hidden";
    };
    const handleAfterPrint = () => {
      document.body.style.visibility = "visible";
    };
    const handleSelectStart = (e) => {
      var _a, _b;
      const tag = (_b = (_a = e.target) == null ? void 0 : _a.tagName) == null ? void 0 : _b.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault();
      return false;
    };
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", (e) => {
      var _a, _b;
      if (e.keyCode === 44) {
        try {
          (_b = (_a = navigator.clipboard) == null ? void 0 : _a.writeText) == null ? void 0 : _b.call(_a, "");
        } catch {
        }
      }
    }, true);
    document.addEventListener("dragstart", handleDragStart, true);
    document.addEventListener("drop", (e) => {
      if (e.target.closest && e.target.closest(".leaflet-container")) return;
      blockEvent(e);
    }, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCopy, true);
    document.addEventListener("selectstart", handleSelectStart, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("drop", blockEvent, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCopy, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [blockEvent, devtoolsAllowed]);
  reactExports.useEffect(() => {
    if (devtoolsAllowed) return;
    let devtoolsOpen = false;
    const checkDevToolsBySize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          handleDevToolsDetected();
        }
      } else {
        devtoolsOpen = false;
      }
    };
    const checkDevToolsByTiming = () => {
      const start = performance.now();
      try {
        const check = new Function("debugger");
        check();
      } catch {
      }
      const elapsed = performance.now() - start;
      if (elapsed > 100) {
        handleDevToolsDetected();
      }
    };
    const checkDevToolsByLog = () => {
      const el2 = new Image();
      Object.defineProperty(el2, "id", {
        get: function() {
          handleDevToolsDetected();
          return "";
        }
      });
      console.debug("%c", el2);
    };
    const handleDevToolsDetected = () => {
      let overlay = document.getElementById("security-devtools-warning");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "security-devtools-warning";
        overlay.style.cssText = `
                    position: fixed; inset: 0; z-index: 2147483647;
                    background: rgba(0,0,0,0.95);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: -apple-system, sans-serif;
                `;
        overlay.innerHTML = `
                    <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
                    <h2 style="font-size: 28px; font-weight: 900; margin-bottom: 12px;">보안 경고</h2>
                    <p style="font-size: 16px; color: #ccc; text-align: center; max-width: 400px; line-height: 1.6;">
                        개발자 도구가 감지되었습니다.<br/>
                        보안을 위해 페이지가 보호 모드로 전환됩니다.<br/>
                        개발자 도구를 닫으면 정상적으로 이용 가능합니다.
                    </p>
                `;
        document.body.appendChild(overlay);
      }
    };
    const interval = setInterval(() => {
      checkDevToolsBySize();
    }, 1e3);
    const timingInterval = setInterval(() => {
      checkDevToolsByTiming();
    }, 3e3);
    const logInterval = setInterval(() => {
      checkDevToolsByLog();
    }, 5e3);
    const cleanupInterval = setInterval(() => {
      const widthOk = window.outerWidth - window.innerWidth <= 160;
      const heightOk = window.outerHeight - window.innerHeight <= 160;
      if (widthOk && heightOk) {
        const overlay = document.getElementById("security-devtools-warning");
        if (overlay) overlay.remove();
        devtoolsOpen = false;
      }
    }, 1500);
    window.addEventListener("resize", checkDevToolsBySize);
    return () => {
      clearInterval(interval);
      clearInterval(timingInterval);
      clearInterval(logInterval);
      clearInterval(cleanupInterval);
      window.removeEventListener("resize", checkDevToolsBySize);
      const overlay = document.getElementById("security-devtools-warning");
      if (overlay) overlay.remove();
    };
  }, [devtoolsAllowed]);
  reactExports.useEffect(() => {
    var _a;
    const originalGetDisplayMedia = (_a = navigator.mediaDevices) == null ? void 0 : _a.getDisplayMedia;
    if (navigator.mediaDevices && originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = function() {
        showSecurityAlert();
        return Promise.reject(new Error("Screen capture is disabled for security."));
      };
    }
    const handleVisibilityChange = () => {
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (navigator.mediaDevices && originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "security-guard-styles";
    styleEl.textContent = `
            /* ─── Text Selection Prevention ─── */
            body, body * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
            }

            /* ─── Allow selection in input fields ─── */
            input, textarea, select, [contenteditable="true"],
            input *, textarea *, select * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }

            /* ─── Image Protection ─── */
            img {
                -webkit-user-drag: none !important;
                user-drag: none !important;
                pointer-events: auto;
                -webkit-touch-callout: none !important;
            }

            /* ─── Allow Leaflet map interaction ─── */
            .leaflet-container,
            .leaflet-container * {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                -webkit-user-drag: auto !important;
                user-drag: auto !important;
                pointer-events: auto !important;
                touch-action: auto !important;
            }

            /* ─── Allow Daum Postcode interaction ─── */
            .react-daum-postcode,
            .react-daum-postcode *,
            iframe[src*="daumcdn"],
            iframe[src*="postcode"] {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                -webkit-user-drag: auto !important;
                user-drag: auto !important;
                pointer-events: auto !important;
                touch-action: auto !important;
            }

            /* ─── Print Protection ─── */
            @media print {
                html, body {
                    display: none !important;
                    visibility: hidden !important;
                }
                body::after {
                    content: "이 페이지는 인쇄할 수 없습니다.";
                    display: block !important;
                    visibility: visible !important;
                    position: fixed;
                    inset: 0;
                    background: white;
                    color: black;
                    font-size: 24px;
                    text-align: center;
                    padding-top: 40vh;
                }
            }

            /* ─── Prevent Save-As Image ─── */
            img, video, canvas {
                -webkit-touch-callout: none !important;
            }

            /* ─── Security Alert Overlay ─── */
            #security-capture-alert {
                position: fixed;
                inset: 0;
                z-index: 2147483646;
                background: rgba(220, 38, 38, 0.97);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                animation: securityFadeIn 0.2s ease-out;
                pointer-events: all;
            }

            @keyframes securityFadeIn {
                from { opacity: 0; transform: scale(1.05); }
                to { opacity: 1; transform: scale(1); }
            }

            /* ─── Anti-iframe ─── */
            /* Prevent the site from being loaded in an iframe on other domains */
        `;
    document.head.appendChild(styleEl);
    const observer = new MutationObserver(() => {
      if (!document.getElementById("security-guard-styles")) {
        document.head.appendChild(styleEl.cloneNode(true));
      }
    });
    observer.observe(document.head, { childList: true });
    return () => {
      observer.disconnect();
      const el2 = document.getElementById("security-guard-styles");
      if (el2) el2.remove();
    };
  }, []);
  reactExports.useEffect(() => {
    if (window.top !== window.self) {
      try {
        window.top.location.href;
      } catch {
        document.body.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-size:24px;font-weight:bold;">이 콘텐츠는 외부 사이트에서 표시할 수 없습니다.</div>';
      }
    }
  }, []);
  return null;
};
function showSecurityAlert() {
  if (document.getElementById("security-capture-alert")) return;
  const alert2 = document.createElement("div");
  alert2.id = "security-capture-alert";
  alert2.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 24px;">🛡️</div>
        <h2 style="font-size: 32px; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.5px;">캡처 시도 감지</h2>
        <p style="font-size: 16px; color: rgba(255,255,255,0.8); text-align: center; max-width: 420px; line-height: 1.7;">
            화면 캡처가 감지되었습니다.<br/>
            이 플랫폼의 모든 콘텐츠는 저작권법에 의해 보호됩니다.<br/>
            무단 캡처 및 배포는 법적 책임을 수반할 수 있습니다.
        </p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 20px;">
            이 경고는 5초 후 자동으로 닫힙니다.
        </p>
    `;
  document.body.appendChild(alert2);
  setTimeout(() => {
    const el2 = document.getElementById("security-capture-alert");
    if (el2) {
      el2.style.transition = "opacity 0.3s ease";
      el2.style.opacity = "0";
      setTimeout(() => el2.remove(), 300);
    }
  }, 5e3);
}
const COUNTRY_LANGUAGE_MAP = {
  KR: "ko",
  // 한국
  US: "en",
  // 미국
  GB: "en-GB",
  // 영국
  CA: "en-CA",
  // 캐나다 (기본 영어)
  JP: "ja",
  // 일본
  VN: "vi",
  // 베트남
  TH: "th",
  // 태국
  KH: "km",
  // 캄보디아
  RU: "ru",
  // 러시아
  UA: "uk"
  // 우크라이나
};
const CACHE_KEY = "geoCountryCode";
async function fetchCountryCode() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) return cached;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5e3);
    const res = await fetch("http://ip-api.com/json/?fields=status,countryCode", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === "success" && data.countryCode) {
      sessionStorage.setItem(CACHE_KEY, data.countryCode);
      return data.countryCode;
    }
    return null;
  } catch {
    return null;
  }
}
function getLanguageFromCountry(countryCode) {
  if (!countryCode) return null;
  return COUNTRY_LANGUAGE_MAP[countryCode.toUpperCase()] || null;
}
async function detectLanguageByIP() {
  const countryCode = await fetchCountryCode();
  return getLanguageFromCountry(countryCode);
}
function useGeoLanguage() {
  const { i18n } = useTranslation();
  const { setCurrencyFromLanguage } = useCurrency();
  const hasRun = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang) return;
    (async () => {
      try {
        const detectedLang = await detectLanguageByIP();
        if (detectedLang) {
          await i18n.changeLanguage(detectedLang);
          document.documentElement.lang = detectedLang.substring(0, 2);
          localStorage.setItem("i18nextLng", detectedLang);
          setCurrencyFromLanguage(detectedLang);
          console.log(`[GeoLanguage] IP 기반 언어 자동 설정: ${detectedLang}`);
        }
      } catch (err) {
        console.warn("[GeoLanguage] IP 기반 언어 감지 실패:", err);
      }
    })();
  }, [i18n, setCurrencyFromLanguage]);
}
const AdminDashboard = React$1.lazy(() => __vitePreload(() => import("./AdminDashboard-CuCi2HzO.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0));
const AdminVenues = React$1.lazy(() => __vitePreload(() => import("./AdminVenues-BVaUwWEk.js"), true ? __vite__mapDeps([4,1,5,2,3]) : void 0));
const AdminApplications = React$1.lazy(() => __vitePreload(() => import("./AdminApplications-el11hro6.js"), true ? __vite__mapDeps([6,1,3]) : void 0));
const AdminUsers = React$1.lazy(() => __vitePreload(() => import("./AdminUsers-BCX62YXd.js"), true ? __vite__mapDeps([7,1,2,3]) : void 0));
const AdminUserDetail = React$1.lazy(() => __vitePreload(() => import("./AdminUserDetail-BJCv34zo.js"), true ? __vite__mapDeps([8,1,3]) : void 0));
const AdminPromotions = React$1.lazy(() => __vitePreload(() => import("./AdminPromotions-hBS_5lgs.js"), true ? __vite__mapDeps([9,1,2,3]) : void 0));
const AdminCancellations = React$1.lazy(() => __vitePreload(() => import("./AdminCancellations-D877OAtt.js"), true ? __vite__mapDeps([10,1,2,3]) : void 0));
const SuperAdminDatabase = React$1.lazy(() => __vitePreload(() => import("./SuperAdminDatabase-B--rNmfa.js"), true ? __vite__mapDeps([11,1,3]) : void 0));
const AdminAds = React$1.lazy(() => __vitePreload(() => import("./AdminAds-DRIBfPtk.js"), true ? __vite__mapDeps([12,1,2,3]) : void 0));
const AdminTrash = React$1.lazy(() => __vitePreload(() => import("./AdminTrash-V6Fe0DXm.js"), true ? __vite__mapDeps([13,1,2,3]) : void 0));
const AdminPopups = React$1.lazy(() => __vitePreload(() => import("./AdminPopups-CQwQZ7ND.js"), true ? __vite__mapDeps([14,1,3]) : void 0));
const AdminSecurity = React$1.lazy(() => __vitePreload(() => import("./AdminSecurity-CntOsck5.js"), true ? __vite__mapDeps([15,1,3]) : void 0));
const AdminPayments = React$1.lazy(() => __vitePreload(() => import("./AdminPayments-soyRi8wb.js"), true ? __vite__mapDeps([16,1,17,3]) : void 0));
const AdminSellerStats = React$1.lazy(() => __vitePreload(() => import("./AdminSellerStats-DFTF1CSl.js"), true ? __vite__mapDeps([18,1,3]) : void 0));
const SellerDashboard = React$1.lazy(() => __vitePreload(() => import("./SellerDashboard-DJHPTi1P.js"), true ? __vite__mapDeps([19,1,3,20]) : void 0));
const SellerApplications = React$1.lazy(() => __vitePreload(() => import("./SellerApplications-Dq7PZhcv.js"), true ? __vite__mapDeps([21,1,20,3]) : void 0));
const SellerProfile = React$1.lazy(() => __vitePreload(() => import("./SellerProfile-C1gda0HS.js"), true ? __vite__mapDeps([22,1,20,3]) : void 0));
const SellerPayments = React$1.lazy(() => __vitePreload(() => import("./SellerPayments-dsSaBK-s.js"), true ? __vite__mapDeps([23,1,3]) : void 0));
const SellerStats = React$1.lazy(() => __vitePreload(() => import("./SellerStats-CseEb4G0.js"), true ? __vite__mapDeps([24,1,25,2,17,3]) : void 0));
const HostDashboard = React$1.lazy(() => __vitePreload(() => import("./HostDashboard-BUw2zRHw.js"), true ? __vite__mapDeps([26,1,3]) : void 0));
const HostVenues = React$1.lazy(() => __vitePreload(() => import("./HostVenues-j4exWlbX.js"), true ? __vite__mapDeps([27,1,5,20,3]) : void 0));
const SellerHostDirectory = React$1.lazy(() => __vitePreload(() => import("./SellerHostDirectory-CaBbv733.js"), true ? __vite__mapDeps([28,1,3]) : void 0));
const HostSellerDirectory = React$1.lazy(() => __vitePreload(() => import("./HostSellerDirectory-Ry-hIVuq.js"), true ? __vite__mapDeps([29,1,3]) : void 0));
const SellerCommunity = React$1.lazy(() => __vitePreload(() => import("./SellerCommunity-DPIL9Qyb.js"), true ? __vite__mapDeps([30,1,31,3,20]) : void 0));
const HostCommunity = React$1.lazy(() => __vitePreload(() => import("./HostCommunity-BNhITol1.js"), true ? __vite__mapDeps([32,1,31,3,20]) : void 0));
const HostApplications = React$1.lazy(() => __vitePreload(() => import("./HostApplications-B2kKx5tb.js"), true ? __vite__mapDeps([33,1,20,3]) : void 0));
const GeneralCommunity = React$1.lazy(() => __vitePreload(() => import("./GeneralCommunity--i5cQtbc.js"), true ? __vite__mapDeps([34,1,31,3,20]) : void 0));
const Analytics = React$1.lazy(() => __vitePreload(() => import("./Analytics-CKWIszeM.js"), true ? __vite__mapDeps([35,1,3]) : void 0));
const HostAnalyticsReport = React$1.lazy(() => __vitePreload(() => import("./HostAnalyticsReport-Df5J6OSX.js"), true ? __vite__mapDeps([36,1,3]) : void 0));
const HostStats = React$1.lazy(() => __vitePreload(() => import("./HostStats-DvY4dIWK.js"), true ? __vite__mapDeps([37,1,24,25,2,17,3]) : void 0));
const SellerPopularAlerts = React$1.lazy(() => __vitePreload(() => import("./SellerPopularAlerts-DaQ0mZQI.js"), true ? __vite__mapDeps([38,1,3]) : void 0));
const SellerMarketing = React$1.lazy(() => __vitePreload(() => import("./SellerMarketing-C8jnwU35.js"), true ? __vite__mapDeps([39,1,17,3]) : void 0));
const HostMarketing = React$1.lazy(() => __vitePreload(() => import("./HostMarketing-D2kzy3Ri.js"), true ? __vite__mapDeps([40,1,17,3]) : void 0));
const ChatPage = React$1.lazy(() => __vitePreload(() => Promise.resolve().then(() => ChatPage$2), true ? void 0 : void 0));
const AdminCS = React$1.lazy(() => __vitePreload(() => import("./AdminCS-BPlDj94i.js"), true ? __vite__mapDeps([41,1,3]) : void 0));
const NotificationSettings = React$1.lazy(() => __vitePreload(() => import("./NotificationSettings-BLh3x4U-.js"), true ? __vite__mapDeps([42,1,3]) : void 0));
const AdminMenuVisibility = React$1.lazy(() => __vitePreload(() => import("./AdminMenuVisibility-CjcWm0pG.js"), true ? __vite__mapDeps([43,1,3]) : void 0));
const AdminMarketing = React$1.lazy(() => __vitePreload(() => import("./AdminMarketing-_Nvaa0JD.js"), true ? __vite__mapDeps([44,1,3]) : void 0));
const AdminVendorManagement = React$1.lazy(() => __vitePreload(() => import("./AdminVendorManagement-Bd-yJue8.js"), true ? __vite__mapDeps([45,1,3]) : void 0));
const VendorDashboard = React$1.lazy(() => __vitePreload(() => import("./VendorDashboard-BE2Y8OcX.js"), true ? __vite__mapDeps([46,1,3]) : void 0));
const VendorSellerDirectory = React$1.lazy(() => __vitePreload(() => import("./VendorSellerDirectory--yRBnv4z.js"), true ? __vite__mapDeps([47,1,3]) : void 0));
const VendorProposals = React$1.lazy(() => __vitePreload(() => import("./VendorProposals-C5feLsVi.js"), true ? __vite__mapDeps([48,1,3]) : void 0));
const VendorShipments = React$1.lazy(() => __vitePreload(() => import("./VendorShipments-Dbs5qhvz.js"), true ? __vite__mapDeps([49,1,17,3]) : void 0));
const VendorSettlements = React$1.lazy(() => __vitePreload(() => import("./VendorSettlements-Dz8a8c2v.js"), true ? __vite__mapDeps([50,1,3]) : void 0));
const SellerProposals = React$1.lazy(() => __vitePreload(() => import("./SellerProposals-yl3pZTyQ.js"), true ? __vite__mapDeps([51,1,3]) : void 0));
const SellerShipments = React$1.lazy(() => __vitePreload(() => import("./SellerShipments-DJ5IsGkH.js"), true ? __vite__mapDeps([52,1,3]) : void 0));
const SellerSettlements = React$1.lazy(() => __vitePreload(() => import("./SellerSettlements-CmjrPbTr.js"), true ? __vite__mapDeps([53,1,3]) : void 0));
const VendorProfile = React$1.lazy(() => __vitePreload(() => import("./VendorProfile-CHKdw6eX.js"), true ? __vite__mapDeps([54,1,3]) : void 0));
const SignupVendor = React$1.lazy(() => __vitePreload(() => import("./SignupVendor-CsdKwEz_.js"), true ? __vite__mapDeps([55,1,3]) : void 0));
const LazyFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg) } }` })
] });
const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  if (!allowedRoles.includes(user.role)) {
    const redirectMap = { admin: "/admin", superadmin: "/admin", host: "/host", seller: "/seller", vendor: "/vendor" };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: redirectMap[user.role] || "/login", replace: true });
  }
  return children;
};
function App() {
  useGeoLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityGuard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { basename: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Login, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/signup", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SignupSelection, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/signup/seller", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Signup, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/signup/host", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SignupHost, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/signup/vendor", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SignupVendor, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/find-email", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FindEmail, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPassword, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/admin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleRoute, { allowedRoles: ["admin", "superadmin"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "venues", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminVenues, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "applications", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminApplications, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "users", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsers, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "users/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUserDetail, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "promotions", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPromotions, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "cancellations", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCancellations, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "database", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SuperAdminDatabase, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "ads", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminAds, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "popups", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPopups, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "security", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSecurity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "payments", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPayments, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "seller-stats", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSellerStats, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community/seller", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community/host", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community/general", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerProfile, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "analytics", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sellers", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostSellerDirectory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "hosts", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerHostDirectory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "host-report", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostAnalyticsReport, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "popular", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerPopularAlerts, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "trash", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminTrash, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "notification-settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSettings, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "menu-visibility", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminMenuVisibility, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "marketing", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminMarketing, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vendor-management", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminVendorManagement, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "cs", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCS, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "chat", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPage, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/seller", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleRoute, { allowedRoles: ["seller"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "applications", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerApplications, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "hosts", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerHostDirectory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "payments", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerPayments, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community/general", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerProfile, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "analytics", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "stats", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerStats, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "popular", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerPopularAlerts, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "marketing", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerMarketing, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "chat", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "proposals", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerProposals, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "shipments", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerShipments, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "settlements", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerSettlements, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "notification-settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSettings, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/host", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleRoute, { allowedRoles: ["host"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "venues", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostVenues, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "applications", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostApplications, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sellers", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostSellerDirectory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "cancellations", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCancellations, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "payments", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerPayments, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "community/general", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralCommunity, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SellerProfile, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "analytics", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "stats", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostStats, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "report", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostAnalyticsReport, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "marketing", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostMarketing, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "chat", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "notification-settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSettings, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/vendor", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleRoute, { allowedRoles: ["vendor"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sellers", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorSellerDirectory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "proposals", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProposals, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "shipments", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorShipments, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "settlements", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorSettlements, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProfile, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "chat", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "notification-settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSettings, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LandingPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/services", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/how-it-works", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/about", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AboutPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/recruitment", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RecruitmentDashboard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/profile/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HostPublicProfile, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/ad-report/:token", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdSharePage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/ad-campaign-report/:token", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignSharePage, {}) })
    ] }) }) }) }) })
  ] }) });
}
instance.use(Backend).use(Browser).use(initReactI18next).init({
  fallbackLng: {
    "ko": ["ko"],
    "en-GB": ["en"],
    "en-CA": ["en"],
    "fr-CA": ["en"],
    default: ["en"]
  },
  supportedLngs: ["ko", "en", "en-GB", "en-CA", "fr-CA", "ja", "vi", "th", "km", "ru", "uk"],
  ns: ["common", "auth", "admin", "seller", "host", "venue", "ads", "community", "landing", "chat"],
  defaultNS: "common",
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ["querystring", "localStorage", "navigator"],
    lookupQuerystring: "lang",
    caches: ["localStorage"]
  },
  react: {
    useSuspense: true
  },
  // Load only the exact selected locale (e.g. fr-CA, not fr+fr-CA)
  load: "currentOnly"
});
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }) })
);
export {
  AdSlot as A,
  validateBusinessName as B,
  COUNTRY_FLAGS as C,
  validateRealName as D,
  KakaoMap as K,
  Link as L,
  Toast as T,
  useAuth as a,
  useNavigate as b,
  useParams as c,
  useToast as d,
  useLocation as e,
  formatBusinessNumber as f,
  getBusinessRegConfig as g,
  KeywordSelector as h,
  countryToLang as i,
  jsxRuntimeExports as j,
  useSearchParams as k,
  getDisplayName as l,
  CountryBadge as m,
  useCurrency as n,
  getPushStatus as o,
  unsubscribeFromPush as p,
  isRequiredAgreed as q,
  TermsAgreement as r,
  subscribeToPush as s,
  formatPhone as t,
  useData as u,
  validateSignupForm as v,
  validateEmail as w,
  validatePassword as x,
  validatePhone as y,
  validateBusinessNumber as z
};
