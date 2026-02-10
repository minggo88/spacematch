import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    UserPlus, Search, Shield, ShieldAlert, Store, Ban, MoreHorizontal, X,
    AlertTriangle, Eye, Users, Briefcase, ShoppingBag, Filter, CheckCircle, Edit3, Crown, XCircle
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminUsers = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, vendor, seller, admin
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
                } else if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            })
            .catch(err => {
                console.error(err);
                setError('\ub370\uc774\ud130 \ubd88\ub7ec\uc624\ub294 \ub370 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.');
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
                    showToast('\uad00\ub9ac\uc790\uac00 \ucd94\uac00\ub418\uc5c8\uc2b5\ub2c8\ub2e4.', 'success');
                    setShowCreateAdmin(false);
                    setNewAdmin({ name: '', email: '', password: '' });
                    fetchUsers();
                } else {
                    showToast(data.message, 'error');
                }
            });
    };

    const openManageModal = (user) => {
        setSelectedUser(user);
        setEditLimit(user.venue_limit || 3);
        setEditContent({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        setShowEditContent(false);
        setShowManageModal(true);
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
                    showToast('\uc0ac\uc6a9\uc790 \uc815\ubcf4\uac00 \uc218\uc815\ub418\uc5c8\uc2b5\ub2c8\ub2e4.', 'success');
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
                    showToast('\ubca0\ub274 \ub4f1\ub85d \uc81c\ud55c\uc774 \uc218\uc815\ub418\uc5c8\uc2b5\ub2c8\ub2e4.', 'success');
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, venue_limit: editLimit } : u));
                } else {
                    showToast(data.message, 'error');
                }
            })
            .finally(() => setActionLoading(false));
    };

    const handleStatusAction = (action) => {
        const actionText = action === 'ban' ? '\uc601\uad6c \ucc28\ub2e8' : (action === 'block' ? '\ucc28\ub2e8' : action === 'approve' ? '\uc2b9\uc778' : '\ucc28\ub2e8 \ud574\uc81c');
        setConfirmModal({
            title: `\uc0ac\uc6a9\uc790 ${actionText}`,
            message: `\uc815\ub9d0\ub85c \uc774 \uc0ac\uc6a9\uc790\ub97c ${actionText} \ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?`,
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
        fetch(`${API_BASE}/users/toggle_featured.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, is_featured: currentStatus ? 0 : 1 })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUsers(prev => prev.map(u =>
                        u.id === userId ? { ...u, is_featured: currentStatus ? 0 : 1 } : u
                    ));
                    if (selectedUser && selectedUser.id === userId) {
                        setSelectedUser(prev => ({ ...prev, is_featured: currentStatus ? 0 : 1 }));
                    }
                } else {
                    showToast(data.message || '\uc0c1\uc704 \ub178\ucd9c \uc124\uc815\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.', 'error');
                }
            })
            .catch(() => showToast('\ub124\ud2b8\uc6cc\ud06c \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.', 'error'))
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
                        statusFilter === 'active' ? u.status === 'active' : true);

            return matchesRole && matchesSearch && matchesStatus;
        });
    }, [users, activeTab, searchTerm, statusFilter]);

    // Stats for Top Bar
    const stats = useMemo(() => {
        return {
            total: users.length,
            vendor: users.filter(u => u.role === 'vendor').length,
            seller: users.filter(u => u.role === 'seller').length,
            admin: users.filter(u => u.role === 'admin').length,
            pending: users.filter(u => u.status === 'pending').length
        };
    }, [users]);

    // Check if current user is Super Admin
    const isSuperAdmin = user?.role === 'superadmin';

    // Tabs Configuration
    const tabs = [
        { id: 'all', label: '\uc804\uccb4 \uc0ac\uc6a9\uc790', icon: Users, count: stats.total },
        { id: 'vendor', label: '\ubca4\ub354', icon: Store, count: stats.vendor },
        { id: 'seller', label: '\uc785\uc810 \ube0c\ub79c\ub4dc', icon: ShoppingBag, count: stats.seller },
    ];

    // Only add Admin tab if Super Admin
    if (isSuperAdmin) {
        tabs.push({ id: 'admin', label: '\uad00\ub9ac\uc790', icon: Shield, count: stats.admin });
    }

    return (
        <div className="space-y-8 animate-fadeIn pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{'\uc0ac\uc6a9\uc790 \uad00\ub9ac'}</h1>
                    <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base font-medium">{'\uc11c\ube44\uc2a4\uc5d0 \ub4f1\ub85d\ub41c \ubaa8\ub4e0 \uc0ac\uc6a9\uc790\ub97c \ud1b5\ud569 \uad00\ub9ac\ud569\ub2c8\ub2e4.'}</p>
                </div>
                {isSuperAdmin && (
                    <button
                        onClick={() => setShowCreateAdmin(true)}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 text-sm md:text-base"
                    >
                        <UserPlus size={18} /> {'\uc2e0\uaddc \uad00\ub9ac\uc790 \ucd94\uac00'}
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
                                <span className="md:hidden">{tab.id === 'all' ? '\uc804\uccb4' : tab.id === 'vendor' ? '\ubca4\ub354' : tab.id === 'seller' ? '\ube0c\ub79c\ub4dc' : '\uad00\ub9ac\uc790'}</span>
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
                            placeholder={'\uc0ac\uc6a9\uc790 \uc774\ub984, \uc774\uba54\uc77c, \uc0ac\uc5c5\uc790\ubc88\ud638 \uac80\uc0c9..'}
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
                                <option value="all">{'\ubaa8\ub4e0 \uc0c1\ud0dc'}</option>
                                <option value="active">{'\uc815\uc0c1 \ud65c\ub3d9'}</option>
                                <option value="pending">{'\uc2b9\uc778 \ub300\uae30'}</option>
                                <option value="blocked">{'\ucc28\ub2e8'}</option>
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
                                <th className="p-6">{'\uc0ac\uc6a9\uc790 \uc815\ubcf4'}</th>
                                <th className="p-6">{'\uc5ed\ud560 / \uc720\ud615'}</th>
                                <th className="p-6">{'\uc8fc\uc694 \ud65c\ub3d9'}</th>
                                <th className="p-6">{'\uc0c1\ud0dc'}</th>
                                <th className="p-6 text-right">{'\uad00\ub9ac'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium">{'\ub370\uc774\ud130\ub97c \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4...'}</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="p-12 text-center text-red-500 font-bold bg-red-50">{error}</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium">{'\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.'}</td></tr>
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
                                                user.role === 'vendor' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {(user.role === 'admin' || user.role === 'superadmin') && <Shield size={12} />}
                                                {user.role === 'vendor' && <Store size={12} />}
                                                {user.role === 'seller' && <ShoppingBag size={12} />}
                                                {user.role === 'superadmin' ? '\uc288\ud37c\uad00\ub9ac\uc790' : user.role === 'admin' ? '\uad00\ub9ac\uc790' : user.role === 'vendor' ? '\ubca4\ub354' : '\uc785\uc810 \ube0c\ub79c\ub4dc'}
                                            </span>
                                            {(user.role === 'vendor' || user.role === 'seller') && parseInt(user.is_featured) === 1 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold ml-1">
                                                    <Crown size={10} /> PREMIUM
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            {user.role === 'vendor' ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block mb-0.5">{'\ub4f1\ub85d \ubca0\ub274'}</span>
                                                    <span className="font-bold text-gray-900 text-base">{user.venue_count || 0}</span>
                                                    <span className="text-gray-400 text-xs ml-1">/ {user.venue_limit || 3}</span>
                                                </div>
                                            ) : user.role === 'seller' ? (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block mb-0.5">{'\uc785\uc810 \uc2e0\uccad'}</span>
                                                    <span className="font-bold text-gray-900 text-base">{user.app_count || 0}</span>
                                                    <span className="text-gray-400 text-xs ml-1"></span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'blocked'
                                                ? 'bg-red-50 text-red-600'
                                                : user.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'blocked' ? 'bg-red-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                {user.status === 'blocked' ? '\ucc28\ub2e8' : user.status === 'pending' ? '\uc2b9\uc778 \ub300\uae30' : '\ud65c\ub3d9'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                                                    title={'\uc0c1\uc138 \ud65c\ub3d9 \ubcf4\uae30'}
                                                >
                                                    <Eye size={16} /> {'\uc0c1\uc138'}
                                                </button>
                                                <button
                                                    onClick={() => openManageModal(user)}
                                                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                                                    title={'\uacc4\uc815 \uad00\ub9ac'}
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
                        <div className="p-10 text-center text-gray-400 font-medium">{'\ub370\uc774\ud130\ub97c \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4...'}</div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 font-bold bg-red-50">{error}</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-medium">{'\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.'}</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="p-4 active:bg-gray-50 transition-colors">
                                    {/* Top: Avatar + Info + Status Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${u.role === 'superadmin' ? 'bg-orange-100 text-orange-600' : u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                            u.role === 'vendor' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-bold text-gray-900 text-sm truncate">{u.name}</p>
                                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${u.role === 'superadmin' ? 'bg-orange-50 text-orange-600' : u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                    u.role === 'vendor' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-green-50 text-green-600'
                                                    }`}>
                                                    {(u.role === 'admin' || u.role === 'superadmin') && <Shield size={9} />}
                                                    {u.role === 'vendor' && <Store size={9} />}
                                                    {u.role === 'seller' && <ShoppingBag size={9} />}
                                                    {u.role === 'superadmin' ? '\uc288\ud37c\uad00\ub9ac\uc790' : u.role === 'admin' ? '\uad00\ub9ac\uc790' : u.role === 'vendor' ? '\ubca4\ub354' : '\ube0c\ub79c\ub4dc'}
                                                </span>
                                                {parseInt(u.is_featured) === 1 && (
                                                    <Crown size={12} className="text-amber-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{u.email}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${u.status === 'blocked' ? 'bg-red-50 text-red-500' : u.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'blocked' ? 'bg-red-400' : u.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                            {u.status === 'blocked' ? '\ucc28\ub2e8' : u.status === 'pending' ? '\ub300\uae30' : '\ud65c\ub3d9'}
                                        </span>
                                    </div>

                                    {/* Bottom: Activity + Action Buttons */}
                                    <div className="flex items-center justify-between mt-2.5 pl-14">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                            {u.role === 'vendor' && (
                                                <span className="flex items-center gap-1">
                                                    <Store size={11} className="text-gray-300" />
                                                    <span className="font-bold text-gray-700">{u.venue_count || 0}</span>/{u.venue_limit || 3}
                                                </span>
                                            )}
                                            {u.role === 'seller' && (
                                                <span className="flex items-center gap-1">
                                                    <Briefcase size={11} className="text-gray-300" />
                                                    {'\uc2e0\uccad'} <span className="font-bold text-gray-700">{u.app_count || 0}</span>
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
                                                <Eye size={12} /> {'\uc0c1\uc138'}
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
                                    {'\uacc4\uc815 \uad00\ub9ac'}
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
                                        {'\ucf58\ud150\uce20 \uc218\uc815'}
                                    </span>
                                    <span className="text-xs text-blue-500">{showEditContent ? '\uc811\uae30' : '\ud3bc\uce58\uae30'}</span>
                                </button>
                                {showEditContent && (
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{'\uc774\ub984'}</label>
                                            <input
                                                type="text"
                                                value={editContent.name}
                                                onChange={e => setEditContent({ ...editContent, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{'\uc774\uba54\uc77c'}</label>
                                            <input
                                                type="email"
                                                value={editContent.email}
                                                onChange={e => setEditContent({ ...editContent, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">{'\uc5f0\ub77d\ucc98'}</label>
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
                                            {'\uc800\uc7a5'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Venue Limit Settings (Vendor Only) */}
                            {selectedUser.role === 'vendor' && (
                                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
                                        <Store size={16} className="text-indigo-600" />
                                        {'\ubca0\ub274 \ub4f1\ub85d \ud55c\ub3c4 \uc124\uc815'}
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
                                            {'\uc218\uc815'}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-xs font-medium text-indigo-500">
                                        <CheckCircle size={12} />
                                        <span>{'\ud604\uc7ac \ub4f1\ub85d\ub41c \ubca0\ub274:'} {selectedUser.venue_count || 0}</span>
                                    </div>
                                </div>
                            )}

                            {/* Featured / Premium Toggle (Vendor & Seller Only) */}
                            {(selectedUser.role === 'vendor' || selectedUser.role === 'seller') && (
                                <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                                                <Crown size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-900">{'\uc0c1\uc704 \ub178\ucd9c (PREMIUM)'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedUser.role === 'vendor' ? '\uacf5\uac04 \uac80\uc0c9 \ud398\uc774\uc9c0' : '\ubca4\ub354 \uac80\uc0c9 \ud398\uc774\uc9c0'}{'\uc5d0\uc11c \uc0c1\ub2e8 \ub178\ucd9c'}
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
                                            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${parseInt(selectedUser.is_featured) === 1 ? 'left-7.5' : 'left-0.5'
                                                }`} style={{ left: parseInt(selectedUser.is_featured) === 1 ? '1.875rem' : '0.125rem' }} />
                                        </button>
                                    </div>
                                    {parseInt(selectedUser.is_featured) === 1 && (
                                        <div className="mt-3 px-3 py-2 bg-white/60 rounded-xl">
                                            <p className="text-xs font-bold text-amber-700">{'\ud604\uc7ac \uc0c1\uc704 \ub178\ucd9c \uc911'}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Status Actions */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <ColorsIcon status={selectedUser.status} />
                                    {'\uacc4\uc815 \uc0c1\ud0dc \uad00\ub9ac'}
                                </h4>

                                <div className="space-y-3">
                                    {selectedUser.status === 'pending' && selectedUser.role === 'vendor' && (
                                        <button
                                            onClick={() => handleStatusAction('approve')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <CheckCircle size={18} /> {'\ubca4\ub354 \uc2b9\uc778'}
                                        </button>
                                    )}
                                    {selectedUser.status === 'blocked' ? (
                                        <button
                                            onClick={() => handleStatusAction('unblock')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-emerald-100 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Shield size={18} /> {'\ucc28\ub2e8 \ud574\uc81c (\uc815\uc0c1\ud654)'}
                                        </button>
                                    ) : selectedUser.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusAction('block')}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 hover:border-orange-200 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <ShieldAlert size={18} /> {'\ud65c\ub3d9 \uc815\uc9c0 (\uc77c\uc2dc \ucc28\ub2e8)'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleStatusAction('ban')}
                                        disabled={actionLoading}
                                        className="w-full py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Ban size={18} /> {'\uc601\uad6c \ucc28\ub2e8'}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                                        {'\uc601\uad6c \ucc28\ub2e8 \uc2dc \uc0ac\uc6a9\uc790\uc758 \ubaa8\ub4e0 \ub370\uc774\ud130\uac00 \uc601\uad6c\uc801\uc73c\ub85c \uc0ad\uc81c\ub418\uba70 \ubcf5\uad6c\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.'}
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
                        <h2 className="text-2xl font-extrabold mb-6 text-gray-900">{'\uc2e0\uaddc \uad00\ub9ac\uc790 \ucd94\uac00'}</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{'\uc774\ub984'}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.name}
                                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{'\uc774\uba54\uc77c'}</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.email}
                                    onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">{'\ube44\ubc00\ubc88\ud638'}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    value={newAdmin.password}
                                    onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateAdmin(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">{'\ucde8\uc18c'}</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">{'\uacc4\uc815 \uc0dd\uc131'}</button>
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
