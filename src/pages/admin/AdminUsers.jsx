import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    UserPlus, Search, Shield, ShieldAlert, Store, Ban, MoreHorizontal, X,
    AlertTriangle, Eye, Users, Briefcase, ShoppingBag, Filter, CheckCircle, Edit3, Crown, XCircle,
    Lock, Unlock, UserCheck, BadgeCheck, Calendar, Clock, Settings, Truck, Mail, MailX
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminUsers = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('admin');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, host, seller, admin
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, blocked

    // Modal State
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showManageModal, setShowManageModal] = useState(false);
    const [editLimit, setEditLimit] = useState(3);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editContent, setEditContent] = useState({ name: '', email: '', phone: '' });
    const [showEditContent, setShowEditContent] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);
    // Seller contact access state
    const [contactAccess, setContactAccess] = useState({ can_view: 0, monthly_limit: 0, used: 0, access_start: '', access_end: '' });
    const [editContactLimit, setEditContactLimit] = useState(0);
    const [contactStartDate, setContactStartDate] = useState('');
    const [contactEndDate, setContactEndDate] = useState('');
    // Period dates for featured/verified
    const [featuredStartDate, setFeaturedStartDate] = useState('');
    const [featuredEndDate, setFeaturedEndDate] = useState('');
    const [verifiedStartDate, setVerifiedStartDate] = useState('');
    const [verifiedEndDate, setVerifiedEndDate] = useState('');
    // Service permissions state
    const [userServices, setUserServices] = useState({});

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE}/users/get_users.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else if (data.success && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            })
            .catch(err => {
                console.error(err);
                setError(t('usersPage.loadError'));
            })
            .finally(() => setLoading(false));
    };

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;

        fetch(`${API_BASE}/users/create_admin.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newAdmin)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(t('usersPage.adminAdded'), 'success');
                    setShowCreateAdmin(false);
                    setNewAdmin({ name: '', email: '', password: '' });
                    fetchUsers();
                } else {
                    showToast(data.message, 'error');
                }
            });
    };

    // Helper: compute D-day text
    const getDDayText = (endDate) => {
        if (!endDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: t('usersPage.expired'), expired: true, days: diff };
        if (diff === 0) return { text: 'D-Day', expired: false, days: 0 };
        return { text: `D-${diff}`, expired: false, days: diff };
    };

    // Helper: set quick period
    const setQuickPeriod = (setter_start, setter_end, days) => {
        const today = new Date();
        const end = new Date(today);
        end.setDate(end.getDate() + days);
        setter_start(today.toISOString().split('T')[0]);
        setter_end(end.toISOString().split('T')[0]);
    };

    const openManageModal = (user) => {
        setSelectedUser(user);
        setEditLimit(user.venue_limit || 3);
        setEditContent({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        setShowEditContent(false);
        setShowManageModal(true);
        // Set period dates from user data
        setFeaturedStartDate(user.featured_start || '');
        setFeaturedEndDate(user.featured_end || '');
        setVerifiedStartDate(user.verified_start || '');
        setVerifiedEndDate(user.verified_end || '');
        // Fetch contact access info for hosts
        if (user.role === 'host') {
            fetch(`${API_BASE}/users/seller_contact_access.php?host_id=${user.id}`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setContactAccess({
                            can_view: data.can_view_contacts,
                            monthly_limit: data.monthly_limit,
                            used: data.used_this_period ?? data.used_this_month ?? 0,
                            access_start: data.access_start || '',
                            access_end: data.access_end || ''
                        });
                        setEditContactLimit(data.monthly_limit);
                        setContactStartDate(data.access_start || '');
                        setContactEndDate(data.access_end || '');
                    }
                })
                .catch(() => { });
        }
        // Fetch service permissions
        setUserServices({});
        fetch(`${API_BASE}/users/toggle_service.php?user_id=${user.id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setUserServices(data.services || {});
            })
            .catch(() => { });
    };

    const handleSaveContent = () => {
        setActionLoading(true);
        fetch(`${API_BASE}/users/update_user_content.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: selectedUser.id, ...editContent })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(t('usersPage.userInfoUpdated'), 'success');
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editContent } : u));
                    setSelectedUser({ ...selectedUser, ...editContent });
                    setShowEditContent(false);
                } else {
                    showToast(data.message, 'error');
                }
            })
            .finally(() => setActionLoading(false));
    };

    const handleUpdateLimit = () => {
        setActionLoading(true);
        fetch(`${API_BASE}/users/update_venue_limit.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: selectedUser.id, limit: editLimit })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(t('usersPage.venueLimitUpdated'), 'success');
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, venue_limit: editLimit } : u));
                } else {
                    showToast(data.message, 'error');
                }
            })
            .finally(() => setActionLoading(false));
    };

    const handleStatusAction = (action) => {
        const actionText = action === 'ban' ? t('usersPage.actionBan') : (action === 'block' ? t('usersPage.actionBlock') : action === 'approve' ? t('usersPage.actionApprove') : t('usersPage.actionUnblock'));
        setConfirmModal({
            title: t('usersPage.confirmTitle', { action: actionText }),
            message: t('usersPage.confirmMsg', { action: actionText }),
            type: action === 'approve' || action === 'unblock' ? 'success' : 'danger',
            confirmLabel: actionText,
            onConfirm: () => {
                setConfirmModal(null);
                setActionLoading(true);
                fetch(`${API_BASE}/users/manage_user_status.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ user_id: selectedUser.id, action })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast(data.message, 'success');
                            setShowManageModal(false);
                            fetchUsers();
                        } else {
                            showToast(data.message, 'error');
                        }
                    })
                    .finally(() => setActionLoading(false));
            }
        });
    };

    const handleToggleFeatured = (userId, currentStatus) => {
        setActionLoading(true);
        const newVal = currentStatus ? 0 : 1;
        fetch(`${API_BASE}/users/toggle_featured.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                is_featured: newVal,
                start_date: newVal ? featuredStartDate : null,
                end_date: newVal ? featuredEndDate : null
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const updatedFields = {
                        is_featured: data.is_featured ?? newVal,
                        featured_start: data.featured_start || null,
                        featured_end: data.featured_end || null
                    };
                    setUsers(prev => prev.map(u =>
                        u.id === userId ? { ...u, ...updatedFields } : u
                    ));
                    if (selectedUser && selectedUser.id === userId) {
                        setSelectedUser(prev => ({ ...prev, ...updatedFields }));
                    }
                    if (!newVal) {
                        setFeaturedStartDate('');
                        setFeaturedEndDate('');
                    }
                    showToast(data.message, 'success');
                } else {
                    showToast(data.message || t('usersPage.featuredFailed'), 'error');
                }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleSaveFeaturedPeriod = (userId) => {
        setActionLoading(true);
        fetch(`${API_BASE}/users/toggle_featured.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, is_featured: 1, start_date: featuredStartDate, end_date: featuredEndDate })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const updatedFields = { is_featured: 1, featured_start: data.featured_start, featured_end: data.featured_end };
                    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
                    if (selectedUser && selectedUser.id === userId) setSelectedUser(prev => ({ ...prev, ...updatedFields }));
                    showToast(data.message, 'success');
                } else { showToast(data.message, 'error'); }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleToggleVerified = (userId, currentStatus) => {
        setActionLoading(true);
        const newVal = currentStatus ? 0 : 1;
        fetch(`${API_BASE}/users/toggle_verified.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                is_verified: newVal,
                start_date: newVal ? verifiedStartDate : null,
                end_date: newVal ? verifiedEndDate : null
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const updatedFields = {
                        is_verified: data.is_verified ?? newVal,
                        verified_start: data.verified_start || null,
                        verified_end: data.verified_end || null
                    };
                    setUsers(prev => prev.map(u =>
                        u.id === userId ? { ...u, ...updatedFields } : u
                    ));
                    if (selectedUser && selectedUser.id === userId) {
                        setSelectedUser(prev => ({ ...prev, ...updatedFields }));
                    }
                    if (!newVal) {
                        setVerifiedStartDate('');
                        setVerifiedEndDate('');
                    }
                    showToast(data.message, 'success');
                } else {
                    showToast(data.message || t('usersPage.verifiedFailed'), 'error');
                }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleSaveVerifiedPeriod = (userId) => {
        setActionLoading(true);
        fetch(`${API_BASE}/users/toggle_verified.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, is_verified: 1, start_date: verifiedStartDate, end_date: verifiedEndDate })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const updatedFields = { is_verified: 1, verified_start: data.verified_start, verified_end: data.verified_end };
                    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
                    if (selectedUser && selectedUser.id === userId) setSelectedUser(prev => ({ ...prev, ...updatedFields }));
                    showToast(data.message, 'success');
                } else { showToast(data.message, 'error'); }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleToggleService = (service, enabled, startDate, endDate, autoApply, monthlyLimit) => {
        if (!selectedUser) return;
        setActionLoading(true);
        fetch(`${API_BASE}/users/toggle_service.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                user_id: selectedUser.id,
                service,
                enabled: enabled ? 1 : 0,
                start_date: startDate || null,
                end_date: endDate || null,
                auto_apply: autoApply !== undefined ? (autoApply ? 1 : 0) : undefined,
                monthly_limit: monthlyLimit !== undefined ? parseInt(monthlyLimit) || 0 : undefined
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserServices(prev => ({
                        ...prev,
                        [service]: {
                            ...prev[service],
                            enabled: enabled ? 1 : 0,
                            start_date: startDate || null,
                            end_date: endDate || null,
                            ...(autoApply !== undefined ? { auto_apply: autoApply ? 1 : 0 } : {}),
                            ...(monthlyLimit !== undefined ? { monthly_limit: parseInt(monthlyLimit) || 0 } : {})
                        }
                    }));
                    showToast(data.message, 'success');
                } else {
                    showToast(data.message || t('usersPage.serviceFailed'), 'error');
                }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleUpdateContactAccess = (newCanView = null) => {
        setActionLoading(true);
        const canView = newCanView !== null ? newCanView : contactAccess.can_view;
        const limit = editContactLimit;
        fetch(`${API_BASE}/users/seller_contact_access.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                host_id: selectedUser.id,
                can_view_contacts: canView,
                monthly_limit: limit,
                start_date: canView ? contactStartDate : null,
                end_date: canView ? contactEndDate : null
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message || t('usersPage.contactAccessChanged'), 'success');
                    setContactAccess(prev => ({
                        ...prev,
                        can_view: canView,
                        monthly_limit: limit,
                        access_start: data.access_start || '',
                        access_end: data.access_end || ''
                    }));
                    if (!canView) {
                        setContactStartDate('');
                        setContactEndDate('');
                    }
                } else {
                    showToast(data.message, 'error');
                }
            })
            .catch(() => showToast(t('usersPage.networkError'), 'error'))
            .finally(() => setActionLoading(false));
    };

    const handleToggleEmailVerified = (userId, currentStatus) => {
        setActionLoading(true);
        const newVal = currentStatus ? 0 : 1;
        fetch(`${API_BASE}/users/toggle_email_verified.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, email_verified: newVal })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUsers(prev => prev.map(u =>
                        u.id === userId ? { ...u, email_verified: data.email_verified ?? newVal } : u
                    ));
                    if (selectedUser && selectedUser.id === userId) {
                        setSelectedUser(prev => ({ ...prev, email_verified: data.email_verified ?? newVal }));
                    }
                    showToast(data.message, 'success');
                } else {
                    showToast(data.message || '이메일 인증 변경 실패', 'error');
                }
            })
            .catch(() => showToast('네트워크 오류', 'error'))
            .finally(() => setActionLoading(false));
    };

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesRole = activeTab === 'all' || u.role === activeTab;
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.business_no && u.business_no.includes(searchTerm));
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'pending' ? u.status === 'pending' :
                    statusFilter === 'blocked' ? u.status === 'blocked' :
                        statusFilter === 'active' ? u.status === 'active' :
                            statusFilter === 'unverified' ? parseInt(u.email_verified) === 0 : true);

            return matchesRole && matchesSearch && matchesStatus;
        });
    }, [users, activeTab, searchTerm, statusFilter]);

    // Stats for Top Bar
    const stats = useMemo(() => {
        return {
            total: users.length,
            host: users.filter(u => u.role === 'host').length,
            seller: users.filter(u => u.role === 'seller').length,
            vendor: users.filter(u => u.role === 'vendor').length,
            admin: users.filter(u => u.role === 'admin').length,
            pending: users.filter(u => u.status === 'pending').length
        };
    }, [users]);

    // Check if current user is Super Admin
    const isSuperAdmin = user?.role === 'superadmin';

    // Tabs Configuration
    const tabs = [
        { id: 'all', label: t('usersPage.tabAll'), icon: Users, count: stats.total },
        { id: 'host', label: t('usersPage.tabHosts'), icon: Store, count: stats.host },
        { id: 'seller', label: t('usersPage.tabSeller'), icon: ShoppingBag, count: stats.seller },
        { id: 'vendor', label: t('usersPage.tabVendor'), icon: Truck, count: stats.vendor },
    ];

    // Only add Admin tab if Super Admin
    if (isSuperAdmin) {
        tabs.push({ id: 'admin', label: t('usersPage.tabAdmin'), icon: Shield, count: stats.admin });
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{t('usersPage.title')}</h1>
                    <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base font-medium">{t('usersPage.subtitle')}</p>
                </div>
                {isSuperAdmin && (
                    <button
                        onClick={() => setShowCreateAdmin(true)}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 text-sm md:text-base"
                    >
                        <UserPlus size={18} /> {t('usersPage.addAdmin')}
                    </button>
                )}
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                {/* 1. Tabs & Stats Header */}
                <div className="border-b border-gray-100 bg-gray-50/50 p-1.5 md:p-2">
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0
                                    ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                            >
                                <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'} />
                                <span className="hidden md:inline">{tab.label}</span>
                                <span className="md:hidden">{tab.id === 'all' ? t('usersPage.tabAllShort') : tab.id === 'host' ? t('usersPage.tabHostShort') : tab.id === 'seller' ? t('usersPage.tabSellerShort') : t('usersPage.tabAdminShort')}</span>
                                <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Enhanced Filter Bar */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center bg-white">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('usersPage.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white text-gray-700 font-medium transition-all outline-none"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative group">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-10 pr-10 py-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-gray-600 text-sm cursor-pointer transition-all min-w-[140px]"
                            >
                                <option value="all">{t('usersPage.filterAllStatus')}</option>
                                <option value="active">{t('usersPage.filterActive')}</option>
                                <option value="pending">{t('usersPage.filterPending')}</option>
                                <option value="blocked">{t('usersPage.filterBlocked')}</option>
                                <option value="unverified">이메일 미인증</option>
                            </select>
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                {/* 3. Desktop Table UI */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                <th className="p-6">{t('usersPage.thUserInfo')}</th>
                                <th className="p-6">{t('usersPage.thRoleType')}</th>
                                <th className="p-6">{t('usersPage.thActivity')}</th>
                                <th className="p-6">{t('usersPage.thStatus')}</th>
                                <th className="p-6 text-right">{t('usersPage.thManage')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium">{t('usersPage.loading')}</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="p-12 text-center text-red-500 font-bold bg-red-50">{error}</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium">{t('usersPage.noResults')}</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                                                    {user.business_no && (
                                                        <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                                                            BN: {user.business_no}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${user.role === 'superadmin' ? 'bg-orange-50 text-orange-700 border-orange-100' : user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                user.role === 'host' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    user.role === 'vendor' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                        'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {(user.role === 'admin' || user.role === 'superadmin') && <Shield size={12} />}
                                                {user.role === 'host' && <Store size={12} />}
                                                {user.role === 'seller' && <ShoppingBag size={12} />}
                                                {user.role === 'vendor' && <Truck size={12} />}
                                                {user.role === 'superadmin' ? t('usersPage.roleSuperAdmin') : user.role === 'admin' ? t('usersPage.roleAdmin') : user.role === 'host' ? t('usersPage.roleHost') : user.role === 'vendor' ? '벤더' : t('usersPage.roleSeller')}
                                            </span>
                                            {(user.role === 'host' || user.role === 'seller') && parseInt(user.is_featured) === 1 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold ml-1">
                                                    <Crown size={10} /> PREMIUM
                                                </span>
                                            )}
                                            {(user.role === 'host' || user.role === 'seller') && parseInt(user.is_verified) === 1 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold ml-1">
                                                    <BadgeCheck size={10} /> {t('usersPage.verified')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            {user.role === 'host' ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block mb-0.5">{t('usersPage.registeredVenues')}</span>
                                                    <span className="font-bold text-gray-900 text-base">{user.venue_count || 0}</span>
                                                    <span className="text-gray-400 text-xs ml-1">/ {user.venue_limit || 3}</span>
                                                </div>
                                            ) : user.role === 'seller' ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block mb-0.5">{t('usersPage.applications')}</span>
                                                    <span className="font-bold text-gray-900 text-base">{user.app_count || 0}</span>
                                                    <span className="text-gray-400 text-xs ml-1"></span>
                                                </div>
                                            ) : user.role === 'vendor' ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block mb-0.5">{t('usersPage.distributionTrade')}</span>
                                                    <span className="font-bold text-gray-900 text-base">{user.company_name || '-'}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'blocked'
                                                    ? 'bg-red-50 text-red-600'
                                                    : user.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'blocked' ? 'bg-red-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                    {user.status === 'blocked' ? t('usersPage.statusBlocked') : user.status === 'pending' ? t('usersPage.statusPending') : t('usersPage.statusActive')}
                                                </span>
                                                {parseInt(user.email_verified) === 1 ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-full text-[10px] font-extrabold">
                                                        <Mail size={10} /> 인증완료
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-full text-[10px] font-extrabold">
                                                        <MailX size={10} /> 미인증
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                                                    title={t('usersPage.viewDetailTooltip')}
                                                >
                                                    <Eye size={16} /> {t('usersPage.viewDetail')}
                                                </button>
                                                <button
                                                    onClick={() => openManageModal(user)}
                                                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                                                    title={t('usersPage.manageAccount')}
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3-M. Mobile Card List */}
                <div className="block md:hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 font-medium">{t('usersPage.loading')}</div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 font-bold bg-red-50">{error}</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-medium">{t('usersPage.noResults')}</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="p-4 active:bg-gray-50 transition-colors">
                                    {/* Top: Avatar + Info + Status Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${u.role === 'superadmin' ? 'bg-orange-100 text-orange-600' : u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                            u.role === 'host' ? 'bg-blue-100 text-blue-600' :
                                                u.role === 'vendor' ? 'bg-teal-100 text-teal-600' :
                                                    'bg-green-100 text-green-600'
                                            }`}>
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-bold text-gray-900 text-sm truncate">{u.name}</p>
                                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${u.role === 'superadmin' ? 'bg-orange-50 text-orange-600' : u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                    u.role === 'host' ? 'bg-blue-50 text-blue-600' :
                                                        u.role === 'vendor' ? 'bg-teal-50 text-teal-600' :
                                                            'bg-green-50 text-green-600'
                                                    }`}>
                                                    {(u.role === 'admin' || u.role === 'superadmin') && <Shield size={9} />}
                                                    {u.role === 'host' && <Store size={9} />}
                                                    {u.role === 'seller' && <ShoppingBag size={9} />}
                                                    {u.role === 'vendor' && <Truck size={9} />}
                                                    {u.role === 'superadmin' ? t('usersPage.roleSuperAdmin') : u.role === 'admin' ? t('usersPage.roleAdmin') : u.role === 'host' ? t('usersPage.roleHost') : u.role === 'vendor' ? '벤더' : t('usersPage.roleSellerShort')}
                                                </span>
                                                {parseInt(u.is_featured) === 1 && (
                                                    <Crown size={12} className="text-amber-500 flex-shrink-0" />
                                                )}
                                                {parseInt(u.is_verified) === 1 && (
                                                    <BadgeCheck size={12} className="text-emerald-500 flex-shrink-0" />
                                                )}
                                                {parseInt(u.email_verified) === 1 ? (
                                                    <Mail size={11} className="text-sky-500 flex-shrink-0" />
                                                ) : (
                                                    <MailX size={11} className="text-rose-400 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{u.email}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${u.status === 'blocked' ? 'bg-red-50 text-red-500' : u.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'blocked' ? 'bg-red-400' : u.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                            {u.status === 'blocked' ? t('usersPage.statusBlocked') : u.status === 'pending' ? t('usersPage.statusPendingShort') : t('usersPage.statusActive')}
                                        </span>
                                    </div>

                                    {/* Bottom: Activity + Action Buttons */}
                                    <div className="flex items-center justify-between mt-2.5 pl-14">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                            {u.role === 'host' && (
                                                <span className="flex items-center gap-1">
                                                    <Store size={11} className="text-gray-300" />
                                                    <span className="font-bold text-gray-700">{u.venue_count || 0}</span>/{u.venue_limit || 3}
                                                </span>
                                            )}
                                            {u.role === 'seller' && (
                                                <span className="flex items-center gap-1">
                                                    <Briefcase size={11} className="text-gray-300" />
                                                    {t('usersPage.applicationShort')} <span className="font-bold text-gray-700">{u.app_count || 0}</span>
                                                </span>
                                            )}
                                            {u.role === 'vendor' && (
                                                <span className="flex items-center gap-1">
                                                    <Truck size={11} className="text-gray-300" />
                                                    <span className="font-bold text-gray-700">{u.company_name || '-'}</span>
                                                </span>
                                            )}
                                            {u.business_no && (
                                                <span className="text-[10px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded">BN</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => navigate(`/admin/users/${u.id}`)}
                                                className="px-3 py-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 rounded-lg active:bg-indigo-100 transition-colors flex items-center gap-1"
                                            >
                                                <Eye size={12} /> {t('usersPage.viewDetail')}
                                            </button>
                                            <button
                                                onClick={() => openManageModal(u)}
                                                className="p-1.5 text-gray-400 active:text-gray-700 active:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Manage Modal */}
            {showManageModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                    <Briefcase size={20} className="text-indigo-600" />
                                    {t('usersPage.accountManage')}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">{selectedUser.name}</p>
                            </div>
                            <button onClick={() => setShowManageModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {/* Content Edit Section */}
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <button
                                    onClick={() => setShowEditContent(!showEditContent)}
                                    className="w-full flex items-center justify-between text-sm font-bold text-gray-700"
                                >
                                    <span className="flex items-center gap-2">
                                        <Edit3 size={16} className="text-blue-600" />
                                        {t('usersPage.contentEdit')}
                                    </span>
                                    <span className="text-xs text-blue-500">{showEditContent ? t('usersPage.fold') : t('usersPage.expand')}</span>
                                </button>
                                {showEditContent && (
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{t('usersPage.labelName')}</label>
                                            <input
                                                type="text"
                                                value={editContent.name}
                                                onChange={e => setEditContent({ ...editContent, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{t('usersPage.labelEmail')}</label>
                                            <input
                                                type="email"
                                                value={editContent.email}
                                                onChange={e => setEditContent({ ...editContent, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{t('usersPage.labelPhone')}</label>
                                            <input
                                                type="text"
                                                value={editContent.phone}
                                                onChange={e => setEditContent({ ...editContent, phone: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveContent}
                                            disabled={actionLoading}
                                            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                                        >
                                            {t('usersPage.save')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Venue Limit Settings (Vendor Only) */}
                            {selectedUser.role === 'host' && (
                                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
                                        <Store size={16} className="text-indigo-600" />
                                        {t('usersPage.venueLimitSetting')}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={editLimit}
                                            onChange={(e) => setEditLimit(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-gray-800"
                                            min="0"
                                        />
                                        <button
                                            onClick={handleUpdateLimit}
                                            disabled={actionLoading}
                                            className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200"
                                        >
                                            {t('usersPage.modify')}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-xs font-medium text-indigo-500">
                                        <CheckCircle size={12} />
                                        <span>{t('usersPage.currentVenues')} {selectedUser.venue_count || 0}</span>
                                    </div>
                                </div>
                            )}

                            {/* Featured / Premium Toggle (Vendor & Seller Only) */}
                            {(selectedUser.role === 'host' || selectedUser.role === 'seller') && (
                                <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                                                <Crown size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-900">{t('usersPage.premiumExposure')}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedUser.role === 'host' ? t('usersPage.premiumVenueSearch') : t('usersPage.premiumHostSearch')}{t('usersPage.premiumTopExposure')}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleFeatured(selectedUser.id, parseInt(selectedUser.is_featured))}
                                            disabled={actionLoading}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${parseInt(selectedUser.is_featured) === 1
                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-200'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`}
                                                style={{ left: parseInt(selectedUser.is_featured) === 1 ? '1.875rem' : '0.125rem' }} />
                                        </button>
                                    </div>
                                    {parseInt(selectedUser.is_featured) === 1 && (
                                        <div className="mt-4 space-y-3">
                                            {/* Period Date Inputs */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <Calendar size={12} className="text-amber-600" />
                                                <span>{t('usersPage.periodSetting')}</span>
                                                {featuredEndDate && (() => {
                                                    const dday = getDDayText(featuredEndDate);
                                                    return dday ? (
                                                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? 'bg-red-100 text-red-600' : dday.days <= 7 ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-700'}`}>
                                                            {dday.text}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="date" value={featuredStartDate} onChange={e => setFeaturedStartDate(e.target.value)}
                                                    className="px-3 py-2 border border-amber-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-amber-300/30 bg-white/80" />
                                                <input type="date" value={featuredEndDate} onChange={e => setFeaturedEndDate(e.target.value)}
                                                    className="px-3 py-2 border border-amber-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-amber-300/30 bg-white/80" />
                                            </div>
                                            {/* Quick Period Buttons */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {[{ l: t('usersPage.days7'), d: 7 }, { l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days180'), d: 180 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                    <button key={p.d} onClick={() => setQuickPeriod(setFeaturedStartDate, setFeaturedEndDate, p.d)}
                                                        className="px-2.5 py-1 bg-white/70 border border-amber-200 rounded-lg text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors">{p.l}</button>
                                                ))}
                                            </div>
                                            <button onClick={() => handleSaveFeaturedPeriod(selectedUser.id)} disabled={actionLoading}
                                                className="w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-200">
                                                {t('usersPage.savePeriod')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Verified Badge Toggle (Vendor & Seller Only) */}
                            {(selectedUser.role === 'host' || selectedUser.role === 'seller') && (
                                <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                                <BadgeCheck size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-900">{t('usersPage.verifiedBadge')}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{t('usersPage.verifiedDesc')}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleVerified(selectedUser.id, parseInt(selectedUser.is_verified))}
                                            disabled={actionLoading}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${parseInt(selectedUser.is_verified) === 1
                                                ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-200'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`}
                                                style={{ left: parseInt(selectedUser.is_verified) === 1 ? '1.875rem' : '0.125rem' }} />
                                        </button>
                                    </div>
                                    {parseInt(selectedUser.is_verified) === 1 && (
                                        <div className="mt-4 space-y-3">
                                            {/* Period Date Inputs */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <Calendar size={12} className="text-emerald-600" />
                                                <span>{t('usersPage.periodSetting')}</span>
                                                {verifiedEndDate && (() => {
                                                    const dday = getDDayText(verifiedEndDate);
                                                    return dday ? (
                                                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? 'bg-red-100 text-red-600' : dday.days <= 7 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {dday.text}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="date" value={verifiedStartDate} onChange={e => setVerifiedStartDate(e.target.value)}
                                                    className="px-3 py-2 border border-emerald-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300/30 bg-white/80" />
                                                <input type="date" value={verifiedEndDate} onChange={e => setVerifiedEndDate(e.target.value)}
                                                    className="px-3 py-2 border border-emerald-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-300/30 bg-white/80" />
                                            </div>
                                            {/* Quick Period Buttons */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {[{ l: t('usersPage.days7'), d: 7 }, { l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days180'), d: 180 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                    <button key={p.d} onClick={() => setQuickPeriod(setVerifiedStartDate, setVerifiedEndDate, p.d)}
                                                        className="px-2.5 py-1 bg-white/70 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">{p.l}</button>
                                                ))}
                                            </div>
                                            <button onClick={() => handleSaveVerifiedPeriod(selectedUser.id)} disabled={actionLoading}
                                                className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200">
                                                {t('usersPage.savePeriod')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Email Verification Management */}
                            <div className="p-5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${parseInt(selectedUser.email_verified) === 1 ? 'bg-gradient-to-br from-sky-400 to-blue-500 shadow-sky-200' : 'bg-gradient-to-br from-rose-400 to-red-500 shadow-rose-200'}`}>
                                            {parseInt(selectedUser.email_verified) === 1 ? <Mail size={20} className="text-white" /> : <MailX size={20} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-gray-900">이메일 인증 관리</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {parseInt(selectedUser.email_verified) === 1 ? '이메일 인증 완료된 사용자입니다' : '이메일 미인증 사용자 — 로그인이 차단됩니다'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleEmailVerified(selectedUser.id, parseInt(selectedUser.email_verified))}
                                        disabled={actionLoading}
                                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${parseInt(selectedUser.email_verified) === 1
                                            ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-200'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`}
                                            style={{ left: parseInt(selectedUser.email_verified) === 1 ? '1.875rem' : '0.125rem' }} />
                                    </button>
                                </div>
                                {parseInt(selectedUser.email_verified) === 0 && (
                                    <div className="mt-3 px-3 py-2 bg-rose-50 rounded-xl border border-rose-100">
                                        <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                                            <AlertTriangle size={12} />
                                            인증 처리 시 이 사용자는 이메일 인증 없이 로그인할 수 있습니다
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Seller Contact Access Settings (Vendor Only) */}
                            {selectedUser.role === 'host' && (
                                <div className="p-5 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-2xl border border-cyan-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200">
                                                {contactAccess.can_view ? <Unlock size={20} className="text-white" /> : <Lock size={20} className="text-white" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-900">{t('usersPage.sellerContactAccess')}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{t('usersPage.sellerContactDesc')}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newVal = contactAccess.can_view ? 0 : 1;
                                                setContactAccess(prev => ({ ...prev, can_view: newVal }));
                                                handleUpdateContactAccess(newVal);
                                            }}
                                            disabled={actionLoading}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${contactAccess.can_view
                                                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 shadow-lg shadow-cyan-200'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`}
                                                style={{ left: contactAccess.can_view ? '1.875rem' : '0.125rem' }} />
                                        </button>
                                    </div>

                                    {contactAccess.can_view ? (
                                        <div className="space-y-3">
                                            {/* Period Date Inputs */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <Calendar size={12} className="text-cyan-600" />
                                                <span>{t('usersPage.accessPeriod')}</span>
                                                {contactEndDate && (() => {
                                                    const dday = getDDayText(contactEndDate);
                                                    return dday ? (
                                                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${dday.expired ? 'bg-red-100 text-red-600' : dday.days <= 7 ? 'bg-orange-100 text-orange-600' : 'bg-cyan-100 text-cyan-700'}`}>
                                                            {dday.text}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="date" value={contactStartDate} onChange={e => setContactStartDate(e.target.value)}
                                                    className="px-3 py-2 border border-cyan-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-300/30 bg-white/80" />
                                                <input type="date" value={contactEndDate} onChange={e => setContactEndDate(e.target.value)}
                                                    className="px-3 py-2 border border-cyan-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-300/30 bg-white/80" />
                                            </div>
                                            {/* Quick Period Buttons */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {[{ l: t('usersPage.days7'), d: 7 }, { l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days180'), d: 180 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                    <button key={p.d} onClick={() => setQuickPeriod(setContactStartDate, setContactEndDate, p.d)}
                                                        className="px-2.5 py-1 bg-white/70 border border-cyan-200 rounded-lg text-[10px] font-bold text-cyan-700 hover:bg-cyan-100 transition-colors">{p.l}</button>
                                                ))}
                                            </div>

                                            {/* View Limit */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <Eye size={12} className="text-cyan-600" />
                                                <span>{t('usersPage.maxViews')}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={editContactLimit}
                                                    onChange={(e) => setEditContactLimit(parseInt(e.target.value) || 0)}
                                                    className="flex-1 px-4 py-2 border border-cyan-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-gray-800 text-sm"
                                                    min="0"
                                                    placeholder={t('usersPage.viewsPlaceholder')}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-cyan-600">
                                                <UserCheck size={12} />
                                                <span>{t('usersPage.currentUsage')} {contactAccess.used} / {contactAccess.monthly_limit} {t('usersPage.timesLabel')}</span>
                                            </div>

                                            <button onClick={() => handleUpdateContactAccess()} disabled={actionLoading}
                                                className="w-full py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 disabled:opacity-50 transition-all shadow-lg shadow-cyan-200">
                                                {t('usersPage.saveSettings')}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-2 bg-white/60 rounded-xl">
                                            <p className="text-xs font-bold text-gray-400">{t('usersPage.accessDisabled')}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Service Permissions Section ── */}
                            {(selectedUser.role === 'host' || selectedUser.role === 'seller') && (
                                <div className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-2xl border border-violet-200 dark:border-violet-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900">
                                            <Settings size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{t('usersPage.paidServices')}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('usersPage.paidServicesDesc')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Analytics Report — host only */}
                                        {selectedUser.role === 'host' && (() => {
                                            const svc = userServices['analytics_report'] || { enabled: 0, start_date: '', end_date: '' };
                                            return (
                                                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t('usersPage.analyticsReport')}</p>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('usersPage.analyticsReportDesc')}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleService('analytics_report', !svc.enabled, svc.start_date, svc.end_date)}
                                                            disabled={actionLoading}
                                                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-200 dark:shadow-violet-900' : 'bg-gray-200 dark:bg-gray-600'}`}
                                                        >
                                                            <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                                                                style={{ left: svc.enabled ? '1.5rem' : '0.125rem' }} />
                                                        </button>
                                                    </div>
                                                    {svc.enabled ? (
                                                        <div className="mt-2 space-y-2">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input type="date" value={svc.start_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, analytics_report: { ...svc, start_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                                <input type="date" value={svc.end_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, analytics_report: { ...svc, end_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {[{ l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                                    <button key={p.d} onClick={() => {
                                                                        const s = new Date().toISOString().split('T')[0];
                                                                        const e = new Date(Date.now() + p.d * 86400000).toISOString().split('T')[0];
                                                                        setUserServices(prev => ({ ...prev, analytics_report: { ...svc, start_date: s, end_date: e } }));
                                                                    }}
                                                                        className="px-2 py-0.5 bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-700 rounded text-[9px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">{p.l}</button>
                                                                ))}
                                                            </div>
                                                            <button onClick={() => handleToggleService('analytics_report', 1, userServices['analytics_report']?.start_date, userServices['analytics_report']?.end_date)}
                                                                disabled={actionLoading}
                                                                className="w-full py-1.5 bg-violet-500 text-white rounded-lg text-[10px] font-bold hover:bg-violet-600 disabled:opacity-50 transition-all">
                                                                {t('usersPage.savePeriod')}
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })()}

                                        {/* Popular Alerts — seller only */}
                                        {selectedUser.role === 'seller' && (() => {
                                            const svc = userServices['popular_alerts'] || { enabled: 0, start_date: '', end_date: '' };
                                            return (
                                                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t('usersPage.popularAlerts')}</p>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('usersPage.popularAlertsDesc')}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleService('popular_alerts', !svc.enabled, svc.start_date, svc.end_date)}
                                                            disabled={actionLoading}
                                                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-200 dark:shadow-violet-900' : 'bg-gray-200 dark:bg-gray-600'}`}
                                                        >
                                                            <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                                                                style={{ left: svc.enabled ? '1.5rem' : '0.125rem' }} />
                                                        </button>
                                                    </div>
                                                    {svc.enabled ? (
                                                        <div className="mt-2 space-y-2">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input type="date" value={svc.start_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, popular_alerts: { ...svc, start_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                                <input type="date" value={svc.end_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, popular_alerts: { ...svc, end_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-violet-200 dark:border-violet-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {[{ l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                                    <button key={p.d} onClick={() => {
                                                                        const s = new Date().toISOString().split('T')[0];
                                                                        const e = new Date(Date.now() + p.d * 86400000).toISOString().split('T')[0];
                                                                        setUserServices(prev => ({ ...prev, popular_alerts: { ...svc, start_date: s, end_date: e } }));
                                                                    }}
                                                                        className="px-2 py-0.5 bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-700 rounded text-[9px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">{p.l}</button>
                                                                ))}
                                                            </div>
                                                            <button onClick={() => handleToggleService('popular_alerts', 1, userServices['popular_alerts']?.start_date, userServices['popular_alerts']?.end_date)}
                                                                disabled={actionLoading}
                                                                className="w-full py-1.5 bg-violet-500 text-white rounded-lg text-[10px] font-bold hover:bg-violet-600 disabled:opacity-50 transition-all">
                                                                {t('usersPage.savePeriod')}
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })()}

                                        {/* Priority Application — seller only */}
                                        {selectedUser.role === 'seller' && (() => {
                                            const svc = userServices['priority_application'] || { enabled: 0, start_date: '', end_date: '', auto_apply: 0, monthly_limit: 0, monthly_used: 0 };
                                            return (
                                                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t('usersPage.priorityApp')}</p>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('usersPage.priorityAppDesc')}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleService('priority_application', !svc.enabled, svc.start_date, svc.end_date, svc.auto_apply, svc.monthly_limit)}
                                                            disabled={actionLoading}
                                                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${svc.enabled ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-200 dark:shadow-amber-900' : 'bg-gray-200 dark:bg-gray-600'}`}
                                                        >
                                                            <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                                                                style={{ left: svc.enabled ? '1.5rem' : '0.125rem' }} />
                                                        </button>
                                                    </div>
                                                    {svc.enabled ? (
                                                        <div className="mt-2 space-y-2">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input type="date" value={svc.start_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, priority_application: { ...svc, start_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                                <input type="date" value={svc.end_date || ''}
                                                                    onChange={e => setUserServices(prev => ({ ...prev, priority_application: { ...svc, end_date: e.target.value } }))}
                                                                    className="px-2 py-1.5 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-medium text-gray-700 dark:text-gray-300 outline-none bg-white/80 dark:bg-gray-700/80" />
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {[{ l: t('usersPage.days30'), d: 30 }, { l: t('usersPage.days90'), d: 90 }, { l: t('usersPage.days365'), d: 365 }].map(p => (
                                                                    <button key={p.d} onClick={() => {
                                                                        const s = new Date().toISOString().split('T')[0];
                                                                        const e = new Date(Date.now() + p.d * 86400000).toISOString().split('T')[0];
                                                                        setUserServices(prev => ({ ...prev, priority_application: { ...svc, start_date: s, end_date: e } }));
                                                                    }}
                                                                        className="px-2 py-0.5 bg-white dark:bg-gray-700 border border-amber-200 dark:border-amber-700 rounded text-[9px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">{p.l}</button>
                                                                ))}
                                                            </div>
                                                            {/* Monthly Limit */}
                                                            <div className="p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-800">
                                                                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">{t('usersPage.monthlyLimit')}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="number" min="0" value={svc.monthly_limit || 0}
                                                                        onChange={e => setUserServices(prev => ({ ...prev, priority_application: { ...svc, monthly_limit: parseInt(e.target.value) || 0 } }))}
                                                                        className="w-20 px-2 py-1 border border-amber-200 dark:border-amber-700 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-300 outline-none bg-white dark:bg-gray-700 text-center" />
                                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('usersPage.timesPerMonth')}</span>
                                                                    {svc.monthly_used !== undefined && svc.monthly_used > 0 && (
                                                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium ml-auto">{t('usersPage.usedThisMonth', { count: svc.monthly_used })}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Auto-Apply Toggle */}
                                                            <div className="flex items-center justify-between p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-800">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{t('usersPage.autoApply')}</p>
                                                                    <p className="text-[9px] text-gray-500 dark:text-gray-400">{t('usersPage.autoApplyDesc')}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => setUserServices(prev => ({ ...prev, priority_application: { ...svc, auto_apply: svc.auto_apply ? 0 : 1 } }))}
                                                                    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${svc.auto_apply ? 'bg-amber-400 dark:bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                                                                >
                                                                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                                                                        style={{ left: svc.auto_apply ? '1.25rem' : '0.125rem' }} />
                                                                </button>
                                                            </div>
                                                            <button onClick={() => handleToggleService('priority_application', 1, svc.start_date, svc.end_date, svc.auto_apply, svc.monthly_limit)}
                                                                disabled={actionLoading}
                                                                className="w-full py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold hover:bg-amber-600 disabled:opacity-50 transition-all">
                                                                {t('usersPage.saveSettings')}
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Status Actions */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <ColorsIcon status={selectedUser.status} />
                                    {t('usersPage.accountStatus')}
                                </h4>

                                <div className="space-y-3">
                                    {selectedUser.status === 'pending' && (selectedUser.role === 'host' || selectedUser.role === 'vendor') && (
                                        <button
                                            onClick={() => handleStatusAction('approve')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <CheckCircle size={18} /> {t('usersPage.approveVendor')}
                                        </button>
                                    )}
                                    {selectedUser.status === 'blocked' ? (
                                        <button
                                            onClick={() => handleStatusAction('unblock')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-emerald-100 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Shield size={18} /> {t('usersPage.unblock')}
                                        </button>
                                    ) : selectedUser.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusAction('block')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 hover:border-orange-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <ShieldAlert size={18} /> {t('usersPage.blockTemp')}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleStatusAction('ban')}
                                        disabled={actionLoading}
                                        className="w-full py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Ban size={18} /> {t('usersPage.banPermanent')}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                                        {t('usersPage.banWarning')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            {showCreateAdmin && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-fadeIn">
                        <h2 className="text-2xl font-extrabold mb-6 text-gray-900">{t('usersPage.createAdminTitle')}</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{t('usersPage.labelName')}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.name}
                                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{t('usersPage.labelEmail')}</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.email}
                                    onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{t('usersPage.labelPassword')}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.password}
                                    onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateAdmin(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">{t('usersPage.cancel')}</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">{t('usersPage.createAccount')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

// Helper for status icon color
const ColorsIcon = ({ status }) => {
    if (status === 'blocked') return <ShieldAlert size={16} className="text-orange-500" />;
    if (status === 'pending') return <ShieldAlert size={16} className="text-amber-500" />;
    return <Shield size={16} className="text-emerald-500" />;
}

export default AdminUsers;
