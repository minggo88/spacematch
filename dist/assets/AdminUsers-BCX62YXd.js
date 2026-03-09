import { a as useAuth, b as useNavigate, j as jsxRuntimeExports, T as Toast } from "./index-BM1FR1Lq.js";
import { r as reactExports, v as Users, u as Store, p as ShoppingBag, z as Truck, K as Shield, U as UserPlus, f as Search, av as Filter, aL as Crown, aM as BadgeCheck, N as Eye, aN as MoreHorizontal, aO as Briefcase, a as X, aH as PenLine, C as CheckCircle, az as Calendar, aP as Unlock, ab as Lock, a6 as UserCheck, _ as Settings, aQ as ShieldAlert, aR as Ban } from "./vendor-icons-BFe5lkJJ.js";
import { C as ConfirmModal } from "./ConfirmModal-C7hQ6Ai9.js";
import { u as useTranslation } from "./vendor-i18n-NBK24oRL.js";
const API_BASE = "/api";
const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [showCreateAdmin, setShowCreateAdmin] = reactExports.useState(false);
  const [newAdmin, setNewAdmin] = reactExports.useState({ name: "", email: "", password: "" });
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [showManageModal, setShowManageModal] = reactExports.useState(false);
  const [editLimit, setEditLimit] = reactExports.useState(3);
  const [actionLoading, setActionLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [editContent, setEditContent] = reactExports.useState({ name: "", email: "", phone: "" });
  const [showEditContent, setShowEditContent] = reactExports.useState(false);
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [toast, setToast] = reactExports.useState(null);
  const [contactAccess, setContactAccess] = reactExports.useState({ can_view: 0, monthly_limit: 0, used: 0, access_start: "", access_end: "" });
  const [editContactLimit, setEditContactLimit] = reactExports.useState(0);
  const [contactStartDate, setContactStartDate] = reactExports.useState("");
  const [contactEndDate, setContactEndDate] = reactExports.useState("");
  const [featuredStartDate, setFeaturedStartDate] = reactExports.useState("");
  const [featuredEndDate, setFeaturedEndDate] = reactExports.useState("");
  const [verifiedStartDate, setVerifiedStartDate] = reactExports.useState("");
  const [verifiedEndDate, setVerifiedEndDate] = reactExports.useState("");
  const [userServices, setUserServices] = reactExports.useState({});
  const showToast = reactExports.useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  reactExports.useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/users/get_users.php`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (data.error) {
        setError(data.error);
      } else if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    }).catch((err) => {
      console.error(err);
      setError(t("usersPage.loadError"));
    }).finally(() => setLoading(false));
  };
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    fetch(`${API_BASE}/users/create_admin.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newAdmin)
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        showToast(t("usersPage.adminAdded"), "success");
        setShowCreateAdmin(false);
        setNewAdmin({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        showToast(data.message, "error");
      }
    });
  };
  const getDDayText = (endDate) => {
    if (!endDate) return null;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - today) / (1e3 * 60 * 60 * 24));
    if (diff < 0) return { text: t("usersPage.expired"), expired: true, days: diff };
    if (diff === 0) return { text: "D-Day", expired: false, days: 0 };
    return { text: `D-${diff}`, expired: false, days: diff };
  };
  const setQuickPeriod = (setter_start, setter_end, days) => {
    const today = /* @__PURE__ */ new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + days);
    setter_start(today.toISOString().split("T")[0]);
    setter_end(end.toISOString().split("T")[0]);
  };
  const openManageModal = (user2) => {
    setSelectedUser(user2);
    setEditLimit(user2.venue_limit || 3);
    setEditContent({ name: user2.name || "", email: user2.email || "", phone: user2.phone || "" });
    setShowEditContent(false);
    setShowManageModal(true);
    setFeaturedStartDate(user2.featured_start || "");
    setFeaturedEndDate(user2.featured_end || "");
    setVerifiedStartDate(user2.verified_start || "");
    setVerifiedEndDate(user2.verified_end || "");
    if (user2.role === "host") {
      fetch(`${API_BASE}/users/seller_contact_access.php?host_id=${user2.id}`, { credentials: "include" }).then((res) => res.json()).then((data) => {
        if (data.success) {
          setContactAccess({
            can_view: data.can_view_contacts,
            monthly_limit: data.monthly_limit,
            used: data.used_this_period ?? data.used_this_month ?? 0,
            access_start: data.access_start || "",
            access_end: data.access_end || ""
          });
          setEditContactLimit(data.monthly_limit);
          setContactStartDate(data.access_start || "");
          setContactEndDate(data.access_end || "");
        }
      }).catch(() => {
      });
    }
    setUserServices({});
    fetch(`${API_BASE}/users/toggle_service.php?user_id=${user2.id}`, { credentials: "include" }).then((res) => res.json()).then((data) => {
      if (data.success) setUserServices(data.services || {});
    }).catch(() => {
    });
  };
  const handleSaveContent = () => {
    setActionLoading(true);
    fetch(`${API_BASE}/users/update_user_content.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user_id: selectedUser.id, ...editContent })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        showToast(t("usersPage.userInfoUpdated"), "success");
        setUsers(users.map((u) => u.id === selectedUser.id ? { ...u, ...editContent } : u));
        setSelectedUser({ ...selectedUser, ...editContent });
        setShowEditContent(false);
      } else {
        showToast(data.message, "error");
      }
    }).finally(() => setActionLoading(false));
  };
  const handleUpdateLimit = () => {
    setActionLoading(true);
    fetch(`${API_BASE}/users/update_venue_limit.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user_id: selectedUser.id, limit: editLimit })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        showToast(t("usersPage.venueLimitUpdated"), "success");
        setUsers(users.map((u) => u.id === selectedUser.id ? { ...u, venue_limit: editLimit } : u));
      } else {
        showToast(data.message, "error");
      }
    }).finally(() => setActionLoading(false));
  };
  const handleStatusAction = (action) => {
    const actionText = action === "ban" ? t("usersPage.actionBan") : action === "block" ? t("usersPage.actionBlock") : action === "approve" ? t("usersPage.actionApprove") : t("usersPage.actionUnblock");
    setConfirmModal({
      title: t("usersPage.confirmTitle", { action: actionText }),
      message: t("usersPage.confirmMsg", { action: actionText }),
      type: action === "approve" || action === "unblock" ? "success" : "danger",
      confirmLabel: actionText,
      onConfirm: () => {
        setConfirmModal(null);
        setActionLoading(true);
        fetch(`${API_BASE}/users/manage_user_status.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id: selectedUser.id, action })
        }).then((res) => res.json()).then((data) => {
          if (data.success) {
            showToast(data.message, "success");
            setShowManageModal(false);
            fetchUsers();
          } else {
            showToast(data.message, "error");
          }
        }).finally(() => setActionLoading(false));
      }
    });
  };
  const handleToggleFeatured = (userId, currentStatus) => {
    setActionLoading(true);
    const newVal = currentStatus ? 0 : 1;
    fetch(`${API_BASE}/users/toggle_featured.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: userId,
        is_featured: newVal,
        start_date: newVal ? featuredStartDate : null,
        end_date: newVal ? featuredEndDate : null
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        const updatedFields = {
          is_featured: data.is_featured ?? newVal,
          featured_start: data.featured_start || null,
          featured_end: data.featured_end || null
        };
        setUsers((prev) => prev.map(
          (u) => u.id === userId ? { ...u, ...updatedFields } : u
        ));
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser((prev) => ({ ...prev, ...updatedFields }));
        }
        if (!newVal) {
          setFeaturedStartDate("");
          setFeaturedEndDate("");
        }
        showToast(data.message, "success");
      } else {
        showToast(data.message || t("usersPage.featuredFailed"), "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const handleSaveFeaturedPeriod = (userId) => {
    setActionLoading(true);
    fetch(`${API_BASE}/users/toggle_featured.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user_id: userId, is_featured: 1, start_date: featuredStartDate, end_date: featuredEndDate })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        const updatedFields = { is_featured: 1, featured_start: data.featured_start, featured_end: data.featured_end };
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...updatedFields } : u));
        if (selectedUser && selectedUser.id === userId) setSelectedUser((prev) => ({ ...prev, ...updatedFields }));
        showToast(data.message, "success");
      } else {
        showToast(data.message, "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const handleToggleVerified = (userId, currentStatus) => {
    setActionLoading(true);
    const newVal = currentStatus ? 0 : 1;
    fetch(`${API_BASE}/users/toggle_verified.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: userId,
        is_verified: newVal,
        start_date: newVal ? verifiedStartDate : null,
        end_date: newVal ? verifiedEndDate : null
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        const updatedFields = {
          is_verified: data.is_verified ?? newVal,
          verified_start: data.verified_start || null,
          verified_end: data.verified_end || null
        };
        setUsers((prev) => prev.map(
          (u) => u.id === userId ? { ...u, ...updatedFields } : u
        ));
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser((prev) => ({ ...prev, ...updatedFields }));
        }
        if (!newVal) {
          setVerifiedStartDate("");
          setVerifiedEndDate("");
        }
        showToast(data.message, "success");
      } else {
        showToast(data.message || t("usersPage.verifiedFailed"), "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const handleSaveVerifiedPeriod = (userId) => {
    setActionLoading(true);
    fetch(`${API_BASE}/users/toggle_verified.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user_id: userId, is_verified: 1, start_date: verifiedStartDate, end_date: verifiedEndDate })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        const updatedFields = { is_verified: 1, verified_start: data.verified_start, verified_end: data.verified_end };
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...updatedFields } : u));
        if (selectedUser && selectedUser.id === userId) setSelectedUser((prev) => ({ ...prev, ...updatedFields }));
        showToast(data.message, "success");
      } else {
        showToast(data.message, "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const handleToggleService = (service, enabled, startDate, endDate, autoApply, monthlyLimit) => {
    if (!selectedUser) return;
    setActionLoading(true);
    fetch(`${API_BASE}/users/toggle_service.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: selectedUser.id,
        service,
        enabled: enabled ? 1 : 0,
        start_date: startDate || null,
        end_date: endDate || null,
        auto_apply: autoApply !== void 0 ? autoApply ? 1 : 0 : void 0,
        monthly_limit: monthlyLimit !== void 0 ? parseInt(monthlyLimit) || 0 : void 0
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setUserServices((prev) => ({
          ...prev,
          [service]: {
            ...prev[service],
            enabled: enabled ? 1 : 0,
            start_date: startDate || null,
            end_date: endDate || null,
            ...autoApply !== void 0 ? { auto_apply: autoApply ? 1 : 0 } : {},
            ...monthlyLimit !== void 0 ? { monthly_limit: parseInt(monthlyLimit) || 0 } : {}
          }
        }));
        showToast(data.message, "success");
      } else {
        showToast(data.message || t("usersPage.serviceFailed"), "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const handleUpdateContactAccess = (newCanView = null) => {
    setActionLoading(true);
    const canView = newCanView !== null ? newCanView : contactAccess.can_view;
    const limit = editContactLimit;
    fetch(`${API_BASE}/users/seller_contact_access.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        host_id: selectedUser.id,
        can_view_contacts: canView,
        monthly_limit: limit,
        start_date: canView ? contactStartDate : null,
        end_date: canView ? contactEndDate : null
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        showToast(data.message || t("usersPage.contactAccessChanged"), "success");
        setContactAccess((prev) => ({
          ...prev,
          can_view: canView,
          monthly_limit: limit,
          access_start: data.access_start || "",
          access_end: data.access_end || ""
        }));
        if (!canView) {
          setContactStartDate("");
          setContactEndDate("");
        }
      } else {
        showToast(data.message, "error");
      }
    }).catch(() => showToast(t("usersPage.networkError"), "error")).finally(() => setActionLoading(false));
  };
  const filteredUsers = reactExports.useMemo(() => {
    return users.filter((u) => {
      const matchesRole = activeTab === "all" || u.role === activeTab;
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.business_no && u.business_no.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || (statusFilter === "pending" ? u.status === "pending" : statusFilter === "blocked" ? u.status === "blocked" : statusFilter === "active" ? u.status === "active" : true);
      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [users, activeTab, searchTerm, statusFilter]);
  const stats = reactExports.useMemo(() => {
    return {
      total: users.length,
      host: users.filter((u) => u.role === "host").length,
      seller: users.filter((u) => u.role === "seller").length,
      vendor: users.filter((u) => u.role === "vendor").length,
      admin: users.filter((u) => u.role === "admin").length,
      pending: users.filter((u) => u.status === "pending").length
    };
  }, [users]);
  const isSuperAdmin = (user == null ? void 0 : user.role) === "superadmin";
  const tabs = [
    { id: "all", label: t("usersPage.tabAll"), icon: Users, count: stats.total },
    { id: "host", label: t("usersPage.tabHosts"), icon: Store, count: stats.host },
    { id: "seller", label: t("usersPage.tabSeller"), icon: ShoppingBag, count: stats.seller },
    { id: "vendor", label: t("usersPage.tabVendor"), icon: Truck, count: stats.vendor }
  ];
  if (isSuperAdmin) {
    tabs.push({ id: "admin", label: t("usersPage.tabAdmin"), icon: Shield, count: stats.admin });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-fadeIn pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end md:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight", children: t("usersPage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1 md:mt-2 text-sm md:text-base font-medium", children: t("usersPage.subtitle") })
      ] }),
      isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowCreateAdmin(true),
          className: "flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 text-sm md:text-base",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }),
            " ",
            t("usersPage.addAdmin")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 bg-gray-50/50 p-1.5 md:p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto scrollbar-none", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0
                                    ${activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 16, className: activeTab === tab.id ? "text-indigo-600" : "text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: tab.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: tab.id === "all" ? t("usersPage.tabAllShort") : tab.id === "host" ? t("usersPage.tabHostShort") : tab.id === "seller" ? t("usersPage.tabSellerShort") : t("usersPage.tabAdminShort") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-500"}`, children: tab.count })
          ]
        },
        tab.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: t("usersPage.searchPlaceholder"),
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white text-gray-700 font-medium transition-all outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 w-full md:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: "appearance-none pl-10 pr-10 py-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-gray-600 text-sm cursor-pointer transition-all min-w-[140px]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: t("usersPage.filterAllStatus") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: t("usersPage.filterActive") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: t("usersPage.filterPending") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blocked", children: t("usersPage.filterBlocked") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400", size: 16 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: t("usersPage.thUserInfo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: t("usersPage.thRoleType") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: t("usersPage.thActivity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6", children: t("usersPage.thStatus") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-right", children: t("usersPage.thManage") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100 bg-white", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "5", className: "p-12 text-center text-gray-400 font-medium", children: t("usersPage.loading") }) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "5", className: "p-12 text-center text-red-500 font-bold bg-red-50", children: error }) }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "5", className: "p-12 text-center text-gray-400 font-medium", children: t("usersPage.noResults") }) }) : filteredUsers.map((user2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg", children: user2.name.charAt(0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900", children: user2.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 font-medium", children: user2.email }),
              user2.business_no && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold", children: [
                "BN: ",
                user2.business_no
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${user2.role === "superadmin" ? "bg-orange-50 text-orange-700 border-orange-100" : user2.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-100" : user2.role === "host" ? "bg-blue-50 text-blue-700 border-blue-100" : user2.role === "vendor" ? "bg-teal-50 text-teal-700 border-teal-100" : "bg-green-50 text-green-700 border-green-100"}`, children: [
              (user2.role === "admin" || user2.role === "superadmin") && /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12 }),
              user2.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12 }),
              user2.role === "seller" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 12 }),
              user2.role === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 12 }),
              user2.role === "superadmin" ? t("usersPage.roleSuperAdmin") : user2.role === "admin" ? t("usersPage.roleAdmin") : user2.role === "host" ? t("usersPage.roleHost") : user2.role === "vendor" ? "벤더" : t("usersPage.roleSeller")
            ] }),
            (user2.role === "host" || user2.role === "seller") && parseInt(user2.is_featured) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 10 }),
              " PREMIUM"
            ] }),
            (user2.role === "host" || user2.role === "seller") && parseInt(user2.is_verified) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 10 }),
              " ",
              t("usersPage.verified")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: user2.role === "host" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 block mb-0.5", children: t("usersPage.registeredVenues") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-base", children: user2.venue_count || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 text-xs ml-1", children: [
              "/ ",
              user2.venue_limit || 3
            ] })
          ] }) : user2.role === "seller" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 block mb-0.5", children: t("usersPage.applications") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-base", children: user2.app_count || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-xs ml-1" })
          ] }) : user2.role === "vendor" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 block mb-0.5", children: t("usersPage.distributionTrade") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-base", children: user2.company_name || "-" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "-" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user2.status === "blocked" ? "bg-red-50 text-red-600" : user2.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${user2.status === "blocked" ? "bg-red-500" : user2.status === "pending" ? "bg-amber-500" : "bg-emerald-500"}` }),
            user2.status === "blocked" ? t("usersPage.statusBlocked") : user2.status === "pending" ? t("usersPage.statusPending") : t("usersPage.statusActive")
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigate(`/admin/users/${user2.id}`),
                className: "px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5",
                title: t("usersPage.viewDetailTooltip"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
                  " ",
                  t("usersPage.viewDetail")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => openManageModal(user2),
                className: "p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all",
                title: t("usersPage.manageAccount"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreHorizontal, { size: 20 })
              }
            )
          ] }) })
        ] }, user2.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block md:hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-gray-400 font-medium", children: t("usersPage.loading") }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-red-500 font-bold bg-red-50", children: error }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-gray-400 font-medium", children: t("usersPage.noResults") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100", children: filteredUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 active:bg-gray-50 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${u.role === "superadmin" ? "bg-orange-100 text-orange-600" : u.role === "admin" ? "bg-purple-100 text-purple-600" : u.role === "host" ? "bg-blue-100 text-blue-600" : u.role === "vendor" ? "bg-teal-100 text-teal-600" : "bg-green-100 text-green-600"}`, children: u.name.charAt(0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900 text-sm truncate", children: u.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${u.role === "superadmin" ? "bg-orange-50 text-orange-600" : u.role === "admin" ? "bg-purple-50 text-purple-600" : u.role === "host" ? "bg-blue-50 text-blue-600" : u.role === "vendor" ? "bg-teal-50 text-teal-600" : "bg-green-50 text-green-600"}`, children: [
                (u.role === "admin" || u.role === "superadmin") && /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 9 }),
                u.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 9 }),
                u.role === "seller" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 9 }),
                u.role === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 9 }),
                u.role === "superadmin" ? t("usersPage.roleSuperAdmin") : u.role === "admin" ? t("usersPage.roleAdmin") : u.role === "host" ? t("usersPage.roleHost") : u.role === "vendor" ? "벤더" : t("usersPage.roleSellerShort")
              ] }),
              parseInt(u.is_featured) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 12, className: "text-amber-500 flex-shrink-0" }),
              parseInt(u.is_verified) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 12, className: "text-emerald-500 flex-shrink-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 truncate mt-0.5", children: u.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${u.status === "blocked" ? "bg-red-50 text-red-500" : u.status === "pending" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${u.status === "blocked" ? "bg-red-400" : u.status === "pending" ? "bg-amber-400" : "bg-emerald-400"}` }),
            u.status === "blocked" ? t("usersPage.statusBlocked") : u.status === "pending" ? t("usersPage.statusPendingShort") : t("usersPage.statusActive")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2.5 pl-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-gray-500", children: [
            u.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 11, className: "text-gray-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700", children: u.venue_count || 0 }),
              "/",
              u.venue_limit || 3
            ] }),
            u.role === "seller" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 11, className: "text-gray-300" }),
              t("usersPage.applicationShort"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700", children: u.app_count || 0 })
            ] }),
            u.role === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 11, className: "text-gray-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-700", children: u.company_name || "-" })
            ] }),
            u.business_no && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded", children: "BN" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigate(`/admin/users/${u.id}`),
                className: "px-3 py-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 rounded-lg active:bg-indigo-100 transition-colors flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12 }),
                  " ",
                  t("usersPage.viewDetail")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => openManageModal(u),
                className: "p-1.5 text-gray-400 active:text-gray-700 active:bg-gray-100 rounded-lg transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MoreHorizontal, { size: 16 })
              }
            )
          ] })
        ] })
      ] }, u.id)) }) })
    ] }),
    showManageModal && selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-extrabold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 20, className: "text-indigo-600" }),
            t("usersPage.accountManage")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1 font-medium", children: selectedUser.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowManageModal(false), className: "text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-h-[60vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-blue-50/50 rounded-2xl border border-blue-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowEditContent(!showEditContent),
              className: "w-full flex items-center justify-between text-sm font-bold text-gray-700",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 16, className: "text-blue-600" }),
                  t("usersPage.contentEdit")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-500", children: showEditContent ? t("usersPage.fold") : t("usersPage.expand") })
              ]
            }
          ),
          showEditContent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 block mb-1", children: t("usersPage.labelName") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: editContent.name,
                  onChange: (e) => setEditContent({ ...editContent, name: e.target.value }),
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 block mb-1", children: t("usersPage.labelEmail") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  value: editContent.email,
                  onChange: (e) => setEditContent({ ...editContent, email: e.target.value }),
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 block mb-1", children: t("usersPage.labelPhone") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: editContent.phone,
                  onChange: (e) => setEditContent({ ...editContent, phone: e.target.value }),
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleSaveContent,
                disabled: actionLoading,
                className: "w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200",
                children: t("usersPage.save")
              }
            )
          ] })
        ] }),
        selectedUser.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16, className: "text-indigo-600" }),
            t("usersPage.venueLimitSetting")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editLimit,
                onChange: (e) => setEditLimit(e.target.value),
                className: "flex-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-800",
                min: "0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleUpdateLimit,
                disabled: actionLoading,
                className: "px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200",
                children: t("usersPage.modify")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 text-xs font-medium text-indigo-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              t("usersPage.currentVenues"),
              " ",
              selectedUser.venue_count || 0
            ] })
          ] })
        ] }),
        (selectedUser.role === "host" || selectedUser.role === "seller") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 20, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: t("usersPage.premiumExposure") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: [
                  selectedUser.role === "host" ? t("usersPage.premiumVenueSearch") : t("usersPage.premiumHostSearch"),
                  t("usersPage.premiumTopExposure")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleToggleFeatured(selectedUser.id, parseInt(selectedUser.is_featured)),
                disabled: actionLoading,
                className: `relative w-14 h-7 rounded-full transition-all duration-300 ${parseInt(selectedUser.is_featured) === 1 ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-200" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`,
                    style: { left: parseInt(selectedUser.is_featured) === 1 ? "1.875rem" : "0.125rem" }
                  }
                )
              }
            )
          ] }),
          parseInt(selectedUser.is_featured) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12, className: "text-amber-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("usersPage.periodSetting") }),
              featuredEndDate && (() => {
                const dday = getDDayText(featuredEndDate);
                return dday ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? "bg-red-100 text-red-600" : dday.days <= 7 ? "bg-orange-100 text-orange-600" : "bg-amber-100 text-amber-700"}`, children: dday.text }) : null;
              })()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: featuredStartDate,
                  onChange: (e) => setFeaturedStartDate(e.target.value),
                  className: "px-3 py-2 border border-amber-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-amber-300/30 bg-white/80"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: featuredEndDate,
                  onChange: (e) => setFeaturedEndDate(e.target.value),
                  className: "px-3 py-2 border border-amber-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-amber-300/30 bg-white/80"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: [{ l: t("usersPage.days7"), d: 7 }, { l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days180"), d: 180 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setQuickPeriod(setFeaturedStartDate, setFeaturedEndDate, p.d),
                className: "px-2.5 py-1 bg-white/70 border border-amber-200 rounded-lg text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors",
                children: p.l
              },
              p.d
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleSaveFeaturedPeriod(selectedUser.id),
                disabled: actionLoading,
                className: "w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-200",
                children: t("usersPage.savePeriod")
              }
            )
          ] })
        ] }),
        (selectedUser.role === "host" || selectedUser.role === "seller") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 20, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: t("usersPage.verifiedBadge") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: t("usersPage.verifiedDesc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleToggleVerified(selectedUser.id, parseInt(selectedUser.is_verified)),
                disabled: actionLoading,
                className: `relative w-14 h-7 rounded-full transition-all duration-300 ${parseInt(selectedUser.is_verified) === 1 ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-200" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`,
                    style: { left: parseInt(selectedUser.is_verified) === 1 ? "1.875rem" : "0.125rem" }
                  }
                )
              }
            )
          ] }),
          parseInt(selectedUser.is_verified) === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12, className: "text-emerald-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("usersPage.periodSetting") }),
              verifiedEndDate && (() => {
                const dday = getDDayText(verifiedEndDate);
                return dday ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? "bg-red-100 text-red-600" : dday.days <= 7 ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-700"}`, children: dday.text }) : null;
              })()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: verifiedStartDate,
                  onChange: (e) => setVerifiedStartDate(e.target.value),
                  className: "px-3 py-2 border border-emerald-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300/30 bg-white/80"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: verifiedEndDate,
                  onChange: (e) => setVerifiedEndDate(e.target.value),
                  className: "px-3 py-2 border border-emerald-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300/30 bg-white/80"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: [{ l: t("usersPage.days7"), d: 7 }, { l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days180"), d: 180 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setQuickPeriod(setVerifiedStartDate, setVerifiedEndDate, p.d),
                className: "px-2.5 py-1 bg-white/70 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors",
                children: p.l
              },
              p.d
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleSaveVerifiedPeriod(selectedUser.id),
                disabled: actionLoading,
                className: "w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200",
                children: t("usersPage.savePeriod")
              }
            )
          ] })
        ] }),
        selectedUser.role === "host" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-2xl border border-cyan-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200", children: contactAccess.can_view ? /* @__PURE__ */ jsxRuntimeExports.jsx(Unlock, { size: 20, className: "text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 20, className: "text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900", children: t("usersPage.sellerContactAccess") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: t("usersPage.sellerContactDesc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  const newVal = contactAccess.can_view ? 0 : 1;
                  setContactAccess((prev) => ({ ...prev, can_view: newVal }));
                  handleUpdateContactAccess(newVal);
                },
                disabled: actionLoading,
                className: `relative w-14 h-7 rounded-full transition-all duration-300 ${contactAccess.can_view ? "bg-gradient-to-r from-cyan-500 to-sky-600 shadow-lg shadow-cyan-200" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`,
                    style: { left: contactAccess.can_view ? "1.875rem" : "0.125rem" }
                  }
                )
              }
            )
          ] }),
          contactAccess.can_view ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12, className: "text-cyan-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("usersPage.accessPeriod") }),
              contactEndDate && (() => {
                const dday = getDDayText(contactEndDate);
                return dday ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? "bg-red-100 text-red-600" : dday.days <= 7 ? "bg-orange-100 text-orange-600" : "bg-cyan-100 text-cyan-700"}`, children: dday.text }) : null;
              })()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: contactStartDate,
                  onChange: (e) => setContactStartDate(e.target.value),
                  className: "px-3 py-2 border border-cyan-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-300/30 bg-white/80"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: contactEndDate,
                  onChange: (e) => setContactEndDate(e.target.value),
                  className: "px-3 py-2 border border-cyan-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-300/30 bg-white/80"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: [{ l: t("usersPage.days7"), d: 7 }, { l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days180"), d: 180 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setQuickPeriod(setContactStartDate, setContactEndDate, p.d),
                className: "px-2.5 py-1 bg-white/70 border border-cyan-200 rounded-lg text-[10px] font-bold text-cyan-700 hover:bg-cyan-100 transition-colors",
                children: p.l
              },
              p.d
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 12, className: "text-cyan-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("usersPage.maxViews") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: editContactLimit,
                onChange: (e) => setEditContactLimit(parseInt(e.target.value) || 0),
                className: "flex-1 px-4 py-2 border border-cyan-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-gray-800 text-sm",
                min: "0",
                placeholder: t("usersPage.viewsPlaceholder")
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-cyan-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                t("usersPage.currentUsage"),
                " ",
                contactAccess.used,
                " / ",
                contactAccess.monthly_limit,
                " ",
                t("usersPage.timesLabel")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleUpdateContactAccess(),
                disabled: actionLoading,
                className: "w-full py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 disabled:opacity-50 transition-all shadow-lg shadow-cyan-200",
                children: t("usersPage.saveSettings")
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 bg-white/60 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-400", children: t("usersPage.accessDisabled") }) })
        ] }),
        (selectedUser.role === "host" || selectedUser.role === "seller") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-2xl border border-violet-200 dark:border-violet-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-extrabold text-gray-900 dark:text-white", children: t("usersPage.paidServices") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: t("usersPage.paidServicesDesc") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            selectedUser.role === "host" && (() => {
              const svc = userServices["analytics_report"] || { enabled: 0, start_date: "", end_date: "" };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/70 dark:bg-gray-800/70 rounded-xl p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-200", children: t("usersPage.analyticsReport") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: t("usersPage.analyticsReportDesc") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleToggleService("analytics_report", !svc.enabled, svc.start_date, svc.end_date),
                      disabled: actionLoading,
                      className: `relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-200 dark:shadow-violet-900" : "bg-gray-200 dark:bg-gray-600"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300",
                          style: { left: svc.enabled ? "1.5rem" : "0.125rem" }
                        }
                      )
                    }
                  )
                ] }),
                svc.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.start_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, analytics_report: { ...svc, start_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.end_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, analytics_report: { ...svc, end_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: [{ l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        const s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                        const e = new Date(Date.now() + p.d * 864e5).toISOString().split("T")[0];
                        setUserServices((prev) => ({ ...prev, analytics_report: { ...svc, start_date: s, end_date: e } }));
                      },
                      className: "px-2 py-0.5 bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-700 rounded text-[9px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors",
                      children: p.l
                    },
                    p.d
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        var _a, _b;
                        return handleToggleService("analytics_report", 1, (_a = userServices["analytics_report"]) == null ? void 0 : _a.start_date, (_b = userServices["analytics_report"]) == null ? void 0 : _b.end_date);
                      },
                      disabled: actionLoading,
                      className: "w-full py-1.5 bg-violet-500 text-white rounded-lg text-[10px] font-bold hover:bg-violet-600 disabled:opacity-50 transition-all",
                      children: t("usersPage.savePeriod")
                    }
                  )
                ] }) : null
              ] });
            })(),
            selectedUser.role === "seller" && (() => {
              const svc = userServices["popular_alerts"] || { enabled: 0, start_date: "", end_date: "" };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/70 dark:bg-gray-800/70 rounded-xl p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-200", children: t("usersPage.popularAlerts") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: t("usersPage.popularAlertsDesc") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleToggleService("popular_alerts", !svc.enabled, svc.start_date, svc.end_date),
                      disabled: actionLoading,
                      className: `relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-200 dark:shadow-violet-900" : "bg-gray-200 dark:bg-gray-600"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300",
                          style: { left: svc.enabled ? "1.5rem" : "0.125rem" }
                        }
                      )
                    }
                  )
                ] }),
                svc.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.start_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, popular_alerts: { ...svc, start_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.end_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, popular_alerts: { ...svc, end_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: [{ l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        const s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                        const e = new Date(Date.now() + p.d * 864e5).toISOString().split("T")[0];
                        setUserServices((prev) => ({ ...prev, popular_alerts: { ...svc, start_date: s, end_date: e } }));
                      },
                      className: "px-2 py-0.5 bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-700 rounded text-[9px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors",
                      children: p.l
                    },
                    p.d
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        var _a, _b;
                        return handleToggleService("popular_alerts", 1, (_a = userServices["popular_alerts"]) == null ? void 0 : _a.start_date, (_b = userServices["popular_alerts"]) == null ? void 0 : _b.end_date);
                      },
                      disabled: actionLoading,
                      className: "w-full py-1.5 bg-violet-500 text-white rounded-lg text-[10px] font-bold hover:bg-violet-600 disabled:opacity-50 transition-all",
                      children: t("usersPage.savePeriod")
                    }
                  )
                ] }) : null
              ] });
            })(),
            selectedUser.role === "seller" && (() => {
              const svc = userServices["priority_application"] || { enabled: 0, start_date: "", end_date: "", auto_apply: 0, monthly_limit: 0, monthly_used: 0 };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/70 dark:bg-gray-800/70 rounded-xl p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-800 dark:text-gray-200", children: t("usersPage.priorityApp") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: t("usersPage.priorityAppDesc") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleToggleService("priority_application", !svc.enabled, svc.start_date, svc.end_date, svc.auto_apply, svc.monthly_limit),
                      disabled: actionLoading,
                      className: `relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-200 dark:shadow-amber-900" : "bg-gray-200 dark:bg-gray-600"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300",
                          style: { left: svc.enabled ? "1.5rem" : "0.125rem" }
                        }
                      )
                    }
                  )
                ] }),
                svc.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.start_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, priority_application: { ...svc, start_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "date",
                        value: svc.end_date || "",
                        onChange: (e) => setUserServices((prev) => ({ ...prev, priority_application: { ...svc, end_date: e.target.value } })),
                        className: "px-2 py-1.5 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: [{ l: t("usersPage.days30"), d: 30 }, { l: t("usersPage.days90"), d: 90 }, { l: t("usersPage.days365"), d: 365 }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        const s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                        const e = new Date(Date.now() + p.d * 864e5).toISOString().split("T")[0];
                        setUserServices((prev) => ({ ...prev, priority_application: { ...svc, start_date: s, end_date: e } }));
                      },
                      className: "px-2 py-0.5 bg-white dark:bg-gray-700 border border-amber-200 dark:border-amber-700 rounded text-[9px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors",
                      children: p.l
                    },
                    p.d
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-800", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1", children: t("usersPage.monthlyLimit") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          min: "0",
                          value: svc.monthly_limit || 0,
                          onChange: (e) => setUserServices((prev) => ({ ...prev, priority_application: { ...svc, monthly_limit: parseInt(e.target.value) || 0 } })),
                          className: "w-20 px-2 py-1 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-300 outline-none bg-white dark:bg-gray-700 text-center"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: t("usersPage.timesPerMonth") }),
                      svc.monthly_used !== void 0 && svc.monthly_used > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-600 dark:text-amber-400 font-medium ml-auto", children: t("usersPage.usedThisMonth", { count: svc.monthly_used }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-800", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-amber-700 dark:text-amber-400", children: t("usersPage.autoApply") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-gray-500 dark:text-gray-400", children: t("usersPage.autoApplyDesc") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setUserServices((prev) => ({ ...prev, priority_application: { ...svc, auto_apply: svc.auto_apply ? 0 : 1 } })),
                        className: `relative w-10 h-5 rounded-full transition-all duration-300 ${svc.auto_apply ? "bg-amber-400 dark:bg-amber-500" : "bg-gray-200 dark:bg-gray-600"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300",
                            style: { left: svc.auto_apply ? "1.25rem" : "0.125rem" }
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleToggleService("priority_application", 1, svc.start_date, svc.end_date, svc.auto_apply, svc.monthly_limit),
                      disabled: actionLoading,
                      className: "w-full py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold hover:bg-amber-600 disabled:opacity-50 transition-all",
                      children: t("usersPage.saveSettings")
                    }
                  )
                ] }) : null
              ] });
            })()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ColorsIcon, { status: selectedUser.status }),
            t("usersPage.accountStatus")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            selectedUser.status === "pending" && (selectedUser.role === "host" || selectedUser.role === "vendor") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleStatusAction("approve"),
                disabled: actionLoading,
                className: "w-full py-3.5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-center gap-2 transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 18 }),
                  " ",
                  t("usersPage.approveVendor")
                ]
              }
            ),
            selectedUser.status === "blocked" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleStatusAction("unblock"),
                disabled: actionLoading,
                className: "w-full py-3.5 bg-white border-2 border-emerald-100 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center gap-2 transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18 }),
                  " ",
                  t("usersPage.unblock")
                ]
              }
            ) : selectedUser.status !== "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleStatusAction("block"),
                disabled: actionLoading,
                className: "w-full py-3.5 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 hover:border-orange-200 flex items-center justify-center gap-2 transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 18 }),
                  " ",
                  t("usersPage.blockTemp")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleStatusAction("ban"),
                disabled: actionLoading,
                className: "w-full py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 18 }),
                  " ",
                  t("usersPage.banPermanent")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 text-center leading-relaxed px-4", children: t("usersPage.banWarning") })
          ] })
        ] })
      ] })
    ] }) }),
    showCreateAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold mb-6 text-gray-900", children: t("usersPage.createAdminTitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateAdmin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 ml-1", children: t("usersPage.labelName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              className: "w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium",
              value: newAdmin.name,
              onChange: (e) => setNewAdmin({ ...newAdmin, name: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 ml-1", children: t("usersPage.labelEmail") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              className: "w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium",
              value: newAdmin.email,
              onChange: (e) => setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-gray-500 ml-1", children: t("usersPage.labelPassword") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              className: "w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium",
              value: newAdmin.password,
              onChange: (e) => setNewAdmin({ ...newAdmin, password: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowCreateAdmin(false), className: "flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors", children: t("usersPage.cancel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5", children: t("usersPage.createAccount") })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { modal: confirmModal, onClose: () => setConfirmModal(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onClose: () => setToast(null) })
  ] });
};
const ColorsIcon = ({ status }) => {
  if (status === "blocked") return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 16, className: "text-orange-500" });
  if (status === "pending") return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 16, className: "text-amber-500" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, className: "text-emerald-500" });
};
export {
  AdminUsers as default
};
