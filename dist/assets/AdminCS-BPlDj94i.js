import { a as useAuth, j as jsxRuntimeExports, C as COUNTRY_FLAGS } from "./index-BM1FR1Lq.js";
import { r as reactExports, a5 as Headphones, f as Search, e as ArrowLeft, F as FileText, i as Send } from "./vendor-icons-BFe5lkJJ.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const POLL_INTERVAL = 5e3;
const AdminCS = () => {
  var _a;
  const { user } = useAuth();
  const { t, i18n } = useTranslation("chat");
  const [conversations, setConversations] = reactExports.useState([]);
  const [activeConv, setActiveConv] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [inputText, setInputText] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [sending, setSending] = reactExports.useState(false);
  const [mobileShowMessages, setMobileShowMessages] = reactExports.useState(false);
  const messagesEndRef = reactExports.useRef(null);
  const lastMsgIdRef = reactExports.useRef(0);
  const pollRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const fetchConversations = reactExports.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations.php?type=cs`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setConversations(data.conversations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchMessages = reactExports.useCallback(async (convId, isPolling = false) => {
    var _a2;
    if (!convId) return;
    try {
      const afterParam = isPolling && lastMsgIdRef.current > 0 ? `&after_id=${lastMsgIdRef.current}` : "";
      const res = await fetch(`${API_BASE}/chat/messages.php?conversation_id=${convId}${afterParam}`, { credentials: "include" });
      const data = await res.json();
      if (data.success && ((_a2 = data.messages) == null ? void 0 : _a2.length) > 0) {
        if (isPolling) setMessages((prev) => [...prev, ...data.messages]);
        else setMessages(data.messages);
        const maxId = Math.max(...data.messages.map((m) => parseInt(m.id)));
        lastMsgIdRef.current = maxId;
      } else if (!isPolling) setMessages([]);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const markAsRead = reactExports.useCallback(async (convId) => {
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
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
  const selectConv = (conv) => {
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
  reactExports.useEffect(() => {
    var _a2;
    (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async () => {
    var _a2;
    if (!inputText.trim() || !activeConv || sending) return;
    const text = inputText.trim();
    setInputText("");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConv.id, text })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        lastMsgIdRef.current = parseInt(data.message.id);
        fetchConversations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diff = (now - d) / 1e3;
    if (diff < 60) return t("justNow");
    if (diff < 3600) return t("minutesAgo", { count: Math.floor(diff / 60) });
    if (diff < 86400) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString();
  };
  const getDisplayText = (msg) => {
    if (!msg.translated_texts || Object.keys(msg.translated_texts).length === 0) return msg.original_text;
    if (String(msg.sender_id) === String(user.id)) return msg.original_text;
    const viewerLang = (user == null ? void 0 : user.country) || i18n.language || "ko";
    return msg.translated_texts[viewerLang] || msg.original_text;
  };
  const filteredConvs = conversations.filter(
    (c) => {
      var _a2;
      return !searchTerm || ((_a2 = c.other_name) == null ? void 0 : _a2.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { size: 20, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-black text-gray-900", children: t("csTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: t("csSubtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-sm font-bold text-gray-400", children: [
        conversations.length,
        " ",
        t("csInquiries")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full lg:w-80 border-r border-gray-100 flex flex-col ${mobileShowMessages ? "hidden lg:flex" : "flex"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: t("searchPlaceholder"),
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 border-none"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin" }) }) : filteredConvs.length > 0 ? filteredConvs.map((conv) => {
          var _a2;
          const isActive = (activeConv == null ? void 0 : activeConv.id) === conv.id;
          const unread = parseInt(conv.unread_count || 0);
          const flag = COUNTRY_FLAGS[conv.other_country];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => selectConv(conv),
              className: `flex items-center gap-3 p-3.5 cursor-pointer transition-all rounded-2xl mx-2 my-1 ${isActive ? "bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 shadow-sm" : "hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold overflow-hidden", children: conv.other_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: conv.other_profile_image, alt: "", className: "w-full h-full object-cover" }) : ((_a2 = conv.other_name) == null ? void 0 : _a2[0]) || "?" }),
                  flag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 text-xs", children: flag.flag })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold truncate", children: conv.other_name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${conv.other_role === "host" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`, children: conv.other_role === "host" ? t("host") : t("seller") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400", children: formatTime(conv.last_message_at) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 truncate max-w-[160px]", children: conv.last_message || t("noMessages") }),
                    unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center", children: unread })
                  ] })
                ] })
              ]
            },
            conv.id
          );
        }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { size: 28, className: "text-gray-300 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-400", children: t("noCSInquiries") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 flex flex-col ${!mobileShowMessages ? "hidden lg:flex" : "flex"}`, children: activeConv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setMobileShowMessages(false);
            setActiveConv(null);
          }, className: "lg:hidden p-1.5 hover:bg-gray-100 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold overflow-hidden", children: activeConv.other_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeConv.other_profile_image, alt: "", className: "w-full h-full object-cover" }) : (_a = activeConv.other_name) == null ? void 0 : _a[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900", children: activeConv.other_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500", children: activeConv.other_email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white", children: [
          messages.map((msg) => {
            var _a2;
            const isMine = String(msg.sender_id) === String(user.id);
            const displayText = getDisplayText(msg);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex ${isMine ? "justify-end" : "justify-start"} mb-3`, children: [
              !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 mr-2 mt-1", children: msg.sender_profile_image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.sender_profile_image, alt: "", className: "w-full h-full object-cover" }) : (_a2 = msg.sender_name) == null ? void 0 : _a2[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[70%] flex flex-col ${isMine ? "items-end" : ""}`, children: [
                !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-500 mb-1 ml-1", children: msg.sender_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl px-4 py-2.5 shadow-sm ${isMine ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-md" : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"}`, children: [
                  msg.file_url && msg.message_type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.file_url, alt: "", className: "max-w-full rounded-xl max-h-60 object-cover mb-1" }),
                  msg.message_type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words", children: displayText }),
                  msg.file_url && msg.message_type === "file" && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: msg.file_url, download: true, className: `flex items-center gap-2 px-3 py-2 rounded-xl ${isMine ? "bg-white/20" : "bg-gray-50"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm truncate", children: msg.file_name })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 mt-0.5 mx-1", children: formatTime(msg.created_at) })
              ] })
            ] }, msg.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-gray-100 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: inputRef,
              value: inputText,
              onChange: (e) => setInputText(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: t("csReplyPlaceholder"),
              rows: 1,
              className: "flex-1 px-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none border-none max-h-32",
              style: { minHeight: "44px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSend,
              disabled: !inputText.trim() || sending,
              className: `p-2.5 rounded-xl transition-all flex-shrink-0 ${inputText.trim() ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
            }
          )
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { size: 40, className: "text-gray-300 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-gray-600 mb-2", children: t("selectCSConversation") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: t("selectCSConversationDesc") })
      ] }) })
    ] })
  ] });
};
export {
  AdminCS as default
};
