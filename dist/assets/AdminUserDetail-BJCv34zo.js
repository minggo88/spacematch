import { c as useParams, b as useNavigate, j as jsxRuntimeExports } from "./index-BM1FR1Lq.js";
import { r as reactExports, e as ArrowLeft, ag as User, aa as Mail, ah as Phone, K as Shield, az as Calendar, aS as Award, u as Store, C as CheckCircle, aq as Clock, t as ClipboardList } from "./vendor-icons-BFe5lkJJ.js";
import "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    fetchUserDetail();
  }, [id]);
  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/get_user_detail.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setUserData(data);
      } else {
        setError(data.message || "사용자 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-red-500 font-bold", children: [
    error,
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(-1), className: "mt-4 text-sm text-gray-500 hover:underline", children: "뒤로 가기" })
  ] });
  if (!userData) return null;
  const { user, venues, applications, stats } = userData;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-20 max-w-6xl mx-auto space-y-8 animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
        " ",
        "목록으로 돌아가기"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-8 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-4 border-white shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 40 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold text-gray-900", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold border ${user.role === "host" ? "bg-blue-50 text-blue-700 border-blue-100" : user.role === "seller" ? "bg-green-50 text-green-700 border-green-100" : user.role === "superadmin" ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-purple-50 text-purple-700 border-purple-100"}`, children: user.role === "superadmin" ? "슈퍼관리자" : user.role === "admin" ? "관리자" : user.role === "host" ? "벤더" : "셀러" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-bold text-white ${user.status === "blocked" ? "bg-red-500" : "bg-emerald-500"}`, children: user.status === "blocked" ? "차단됨" : "정상 활동 중" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, className: "text-gray-400" }),
              user.email
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-gray-400" }),
              user.phone || "전화번호 미등록"
            ] }),
            user.business_no && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "text-gray-400" }),
              "사업자#",
              " ",
              user.business_no
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-gray-400" }),
              "가입일:",
              " ",
              new Date(user.created_at).toLocaleDateString()
            ] }),
            user.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 16, className: "text-gray-400" }),
              "베뉴 등록 한도:",
              " ",
              user.venue_limit,
              "개"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: user.role === "host" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Store, label: "총 등록 베뉴", value: stats.total_venues, color: "text-blue-600", bg: "bg-blue-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CheckCircle, label: "승인된 베뉴", value: stats.approved_venues, color: "text-green-600", bg: "bg-green-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: "승인 대기중", value: stats.pending_venues, color: "text-yellow-600", bg: "bg-yellow-50" })
    ] }) : user.role === "seller" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: ClipboardList, label: "총 입점 신청", value: stats.total_applications, color: "text-indigo-600", bg: "bg-indigo-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CheckCircle, label: "승인된 신청", value: stats.approved_applications, color: "text-green-600", bg: "bg-green-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: "대기중인 신청", value: stats.pending_applications, color: "text-yellow-600", bg: "bg-yellow-50" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500", children: [
      user.role === "superadmin" ? "슈퍼관리자" : "관리자",
      " ",
      "계정입니다"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: user.role === "host" ? "등록된 베뉴 목록" : user.role === "seller" ? "입점 신청 내역" : "활동 내역" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: user.role === "host" && venues.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: venues.map((venue) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-40 bg-gray-100 relative", children: [
          venue.images && venue.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: venue.images[0], alt: venue.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: venue.status }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 truncate", children: venue.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1 truncate", children: venue.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-indigo-600", children: [
              "₩",
              parseInt(venue.price).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: venue.type })
          ] })
        ] })
      ] }, venue.id)) }) : user.role === "seller" && applications.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "신청일" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "대상 베뉴" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "위치" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "메시지" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "상태" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: applications.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-gray-600", children: new Date(app.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold text-gray-900", children: app.venue_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-gray-600", children: app.venue_location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-gray-600 max-w-xs truncate", title: app.message, children: app.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: app.status }) })
        ] }, app.id)) })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-gray-400", children: "데이터가 없습니다." }) })
    ] })
  ] });
};
const StatCard = ({ icon: Icon, label, value, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-full flex items-center justify-center ${bg} ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 24 }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-gray-900", children: value })
  ] })
] });
const StatusBadge = ({ status }) => {
  let styles = "bg-gray-100 text-gray-600";
  let text = status;
  if (status === "approved") {
    styles = "bg-green-100 text-green-700";
    text = "승인됨";
  } else if (status === "pending") {
    styles = "bg-yellow-100 text-yellow-700";
    text = "대기중";
  } else if (status === "rejected") {
    styles = "bg-red-100 text-red-700";
    text = "거절됨";
  } else if (status === "blocked") {
    styles = "bg-red-500 text-white";
    text = "차단됨";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${styles}`, children: text });
};
export {
  AdminUserDetail as default
};
