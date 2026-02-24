import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Eye, EyeOff, Globe, MapPin, User, Save, Search,
    Home, ClipboardList, Building, Flame, TrendingUp, BarChart3,
    ShoppingBag, Store, AlertTriangle, MessageSquare, UserCircle,
    CreditCard, LayoutDashboard, Users, Settings, X,
    RefreshCw, Trash2, Megaphone, Inbox, Package, Wallet, Send, Truck
} from 'lucide-react';

const API_BASE = '/api/admin/menu_visibility.php';

// Menu definitions matching Layout.jsx
const SELLER_MENUS = [
    { key: '/seller', label: 'sidebar.home', icon: Home, group: 'main' },
    { key: '/seller/applications', label: 'sidebar.applicationStatus', icon: ClipboardList, group: 'main' },
    { key: '/seller/hosts', label: 'sidebar.hostDirectory', icon: Building, group: 'main' },
    { key: '/seller/popular', label: 'sidebar.popularSpaces', icon: Flame, group: 'main' },
    { key: '/seller/proposals', label: 'sidebar.distributionProposals', icon: Inbox, group: 'main' },
    { key: '/seller/shipments', label: 'sidebar.shippingManagement', icon: Package, group: 'main' },
    { key: '/seller/settlements', label: 'sidebar.settlements', icon: Wallet, group: 'main' },
    { key: '/seller/stats', label: 'sidebar.salesManagement', icon: TrendingUp, group: 'main' },
    { key: '/seller/analytics', label: 'sidebar.analytics', icon: BarChart3, group: 'main' },
    { key: '/seller/marketing', label: 'sidebar.marketing', icon: Megaphone, group: 'main' },
    { key: '/seller/community', label: 'sidebar.sellerCommunity', icon: ShoppingBag, group: 'community' },
    { key: '/seller/community/general', label: 'sidebar.integratedCommunity', icon: Users, group: 'community' },
    { key: '/seller/profile', label: 'sidebar.myProfile', icon: UserCircle, group: 'bottom' },
    { key: '/seller/payments', label: 'sidebar.servicePayment', icon: CreditCard, group: 'bottom' },
];

const VENDOR_MENUS = [
    { key: '/host', label: 'sidebar.home', icon: Home, group: 'main' },
    { key: '/host/dashboard', label: 'sidebar.dashboard', icon: LayoutDashboard, group: 'main' },
    { key: '/host/sellers', label: 'sidebar.sellerDirectory', icon: ShoppingBag, group: 'main' },
    { key: '/host/analytics', label: 'sidebar.analytics', icon: BarChart3, group: 'main' },
    { key: '/host/report', label: 'sidebar.analyticsReport', icon: TrendingUp, group: 'main' },
    { key: '/host/venues', label: 'sidebar.spaceManagement', icon: Store, group: 'management' },
    { key: '/host/applications', label: 'sidebar.applicationManagement', icon: ClipboardList, group: 'management' },
    { key: '/host/cancellations', label: 'sidebar.cancellationRequests', icon: AlertTriangle, group: 'management' },
    { key: '/host/marketing', label: 'sidebar.marketing', icon: Megaphone, group: 'main' },
    { key: '/host/community', label: 'sidebar.hostCommunity', icon: Store, group: 'community' },
    { key: '/host/community/general', label: 'sidebar.integratedCommunity', icon: Users, group: 'community' },
    { key: '/host/profile', label: 'sidebar.myProfile', icon: UserCircle, group: 'bottom' },
    { key: '/host/payments', label: 'sidebar.servicePayment', icon: CreditCard, group: 'bottom' },
];

// Vendor role menus (separate from host)
const VENDOR_ROLE_MENUS = [
    { key: '/vendor', label: 'sidebar.home', icon: Home, group: 'main' },
    { key: '/vendor/sellers', label: 'sidebar.sellerDirectory', icon: ShoppingBag, group: 'main' },
    { key: '/vendor/proposals', label: 'sidebar.distributionProposals', icon: Send, group: 'main' },
    { key: '/vendor/shipments', label: 'sidebar.shippingManagement', icon: Package, group: 'main' },
    { key: '/vendor/settlements', label: 'sidebar.settlements', icon: Wallet, group: 'main' },
    { key: '/vendor/profile', label: 'sidebar.myProfile', icon: UserCircle, group: 'bottom' },
];

const COUNTRY_FLAGS = {
    KR: '🇰🇷', US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', JP: '🇯🇵',
    VN: '🇻🇳', TH: '🇹🇭', KH: '🇰🇭', RU: '🇷🇺', UA: '🇺🇦',
    // Lowercase DB aliases
    ko: '🇰🇷', ja: '🇯🇵', vi: '🇻🇳', th: '🇹🇭',
    km: '🇰🇭', ru: '🇷🇺', uk: '🇺🇦',
};

const AdminMenuVisibility = () => {
    const { t } = useTranslation('common');
    const [activeRole, setActiveRole] = useState('seller');
    const [activeTab, setActiveTab] = useState('global');
    const [rules, setRules] = useState([]);
    const [countries, setCountries] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    // Track local visibility state directly
    const [localVisibility, setLocalVisibility] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    const menus = activeRole === 'seller' ? SELLER_MENUS : activeRole === 'vendor' ? VENDOR_ROLE_MENUS : VENDOR_MENUS;

    const groupLabels = {
        main: t('menuVis.mainMenu'),
        management: t('menuVis.managementMenu'),
        community: t('menuVis.communityMenu'),
        bottom: t('menuVis.otherMenu'),
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Fetch rules from server
    const fetchRules = useCallback(async (opts = {}) => {
        setLoading(true);
        try {
            let url = `${API_BASE}?role=${activeRole}&fetch_users=1&user_role=${activeRole}`;
            const search = opts.search ?? userSearch;
            if (search.trim()) url += `&user_search=${encodeURIComponent(search)}`;
            const res = await fetch(url, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setRules(data.rules || []);
                setCountries(data.countries || []);
                setUsers(data.users || []);
                // Build local visibility map based on current scope
                buildLocalVisibility(data.rules || []);
            }
        } catch {
            showToast(t('menuVis.loadFailed'), 'error');
        } finally {
            setLoading(false);
        }
    }, [activeRole, activeTab, userSearch]);

    // Build local visibility from rules for current scope
    const buildLocalVisibility = useCallback((rulesData, country, user) => {
        const cs = country ?? selectedCountry;
        const us = user ?? selectedUser;
        const vis = {};

        menus.forEach(m => {
            // Default: visible
            vis[m.key] = 1;

            if (activeTab === 'global') {
                const rule = rulesData.find(r => r.menu_key === m.key && r.scope === 'global');
                if (rule) vis[m.key] = parseInt(rule.is_visible);
            } else if (activeTab === 'country' && cs) {
                // Start from global, then overlay country
                const globalRule = rulesData.find(r => r.menu_key === m.key && r.scope === 'global');
                if (globalRule) vis[m.key] = parseInt(globalRule.is_visible);
                const countryRule = rulesData.find(r => r.menu_key === m.key && r.scope === 'country' && r.scope_value === cs);
                if (countryRule) vis[m.key] = parseInt(countryRule.is_visible);
            } else if (activeTab === 'user' && us) {
                // global → country → user
                const globalRule = rulesData.find(r => r.menu_key === m.key && r.scope === 'global');
                if (globalRule) vis[m.key] = parseInt(globalRule.is_visible);
                if (us.country) {
                    const countryRule = rulesData.find(r => r.menu_key === m.key && r.scope === 'country' && r.scope_value === us.country);
                    if (countryRule) vis[m.key] = parseInt(countryRule.is_visible);
                }
                const userRule = rulesData.find(r => r.menu_key === m.key && r.scope === 'user' && r.scope_value == us.id);
                if (userRule) vis[m.key] = parseInt(userRule.is_visible);
            }
        });

        setLocalVisibility(vis);
        setIsDirty(false);
    }, [menus, activeTab, selectedCountry, selectedUser]);

    // Refetch on role/tab change
    useEffect(() => {
        setSelectedCountry('');
        setSelectedUser(null);
        setUserSearch('');
        setIsDirty(false);
        fetchRules({ search: '' });
    }, [activeRole, activeTab]);

    // Rebuild local state when country/user selection changes
    useEffect(() => {
        if (rules.length > 0) {
            buildLocalVisibility(rules);
        }
    }, [selectedCountry, selectedUser]);

    // Debounced user search
    useEffect(() => {
        if (activeTab !== 'user') return;
        const timer = setTimeout(() => fetchRules(), 300);
        return () => clearTimeout(timer);
    }, [userSearch]);

    const toggleVisibility = (menuKey) => {
        setLocalVisibility(prev => ({
            ...prev,
            [menuKey]: prev[menuKey] === 1 ? 0 : 1
        }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let rulesToSave = [];

            if (activeTab === 'country' && selectedCountry === '__ALL__') {
                // Save the same settings for ALL countries
                countries.forEach(c => {
                    menus.forEach(m => {
                        rulesToSave.push({
                            role: activeRole,
                            menu_key: m.key,
                            scope: 'country',
                            scope_value: c,
                            is_visible: localVisibility[m.key] ?? 1
                        });
                    });
                });
            } else {
                const scopeValue = activeTab === 'country' ? selectedCountry : activeTab === 'user' ? String(selectedUser?.id) : '';
                rulesToSave = menus.map(m => ({
                    role: activeRole,
                    menu_key: m.key,
                    scope: activeTab,
                    scope_value: scopeValue,
                    is_visible: localVisibility[m.key] ?? 1
                }));
            }

            const res = await fetch(API_BASE, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rules: rulesToSave })
            });
            const data = await res.json();
            if (data.success) {
                showToast(selectedCountry === '__ALL__' ? (t('menuVis.allCountriesSaved') || '전체 국가에 저장되었습니다') : t('menuVis.saved'));
                setIsDirty(false);
                fetchRules();
            } else {
                showToast(data.message || t('menuVis.saveFailed'), 'error');
            }
        } catch {
            showToast(t('menuVis.serverError'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteOverride = async () => {
        if (activeTab === 'global') return;
        const scopeValue = activeTab === 'country' ? selectedCountry : String(selectedUser?.id);
        if (!scopeValue) return;

        try {
            const res = await fetch(API_BASE, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: activeRole, scope: activeTab, scope_value: scopeValue })
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('menuVis.overrideDeleted'));
                setIsDirty(false);
                fetchRules();
            }
        } catch {
            showToast(t('menuVis.serverError'), 'error');
        }
    };

    // Group menus for display
    const groupedMenus = {};
    menus.forEach(m => {
        if (!groupedMenus[m.group]) groupedMenus[m.group] = [];
        groupedMenus[m.group].push(m);
    });

    const canEdit = activeTab === 'global' || (activeTab === 'country' && selectedCountry) || (activeTab === 'user' && selectedUser);

    // Check if scope has overrides
    const scopeHasOverrides = () => {
        if (activeTab === 'country' && selectedCountry)
            return rules.some(r => r.scope === 'country' && r.scope_value === selectedCountry);
        if (activeTab === 'user' && selectedUser)
            return rules.some(r => r.scope === 'user' && r.scope_value == selectedUser.id);
        return false;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" />
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Settings size={28} />
                        <h1 className="text-2xl md:text-3xl font-extrabold">{t('menuVis.title')}</h1>
                    </div>
                    <p className="text-white/70 text-sm">{t('menuVis.subtitle')}</p>
                </div>
            </div>

            {/* Role Selector + Scope Tabs */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    {[{ key: 'seller', label: t('menuVis.seller'), icon: ShoppingBag },
                    { key: 'host', label: t('menuVis.vendor'), icon: Store },
                    { key: 'vendor', label: t('menuVis.vendorRole', 'Vendor'), icon: Truck }].map(r => (
                        <button key={r.key} onClick={() => setActiveRole(r.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeRole === r.key
                                ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 ring-2 ring-violet-300'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400'}`}>
                            <r.icon size={16} />
                            {r.label}
                            <span className="text-xs opacity-60">({t('menuVis.menuCount', { count: (r.key === 'seller' ? SELLER_MENUS : r.key === 'vendor' ? VENDOR_ROLE_MENUS : VENDOR_MENUS).length })})</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {[{ key: 'global', label: t('menuVis.globalTab'), icon: Globe, desc: t('menuVis.globalDesc') },
                    { key: 'country', label: t('menuVis.countryTab'), icon: MapPin, desc: t('menuVis.countryDesc') },
                    { key: 'user', label: t('menuVis.userTab'), icon: User, desc: t('menuVis.userDesc') }].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 ring-2 ring-indigo-300'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400'}`}>
                            <tab.icon size={16} />
                            <div className="text-left">
                                <div>{tab.label}</div>
                                <div className="text-[10px] font-normal opacity-60">{tab.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Country Selector */}
            {activeTab === 'country' && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-500" />
                        {t('menuVis.selectCountry')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {/* Select All Countries button */}
                        <button onClick={() => setSelectedCountry('__ALL__')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCountry === '__ALL__'
                                ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-300 dark:bg-violet-500/20 dark:text-violet-400'
                                : 'bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-700/30 dark:text-violet-400'}`}>
                            <Globe size={14} />
                            {t('menuVis.allCountries') || '전체 국가'}
                        </button>
                        {countries.length > 0 ? countries.map(c => {
                            const hasOvr = rules.some(r => r.scope === 'country' && r.scope_value === c);
                            return (
                                <button key={c} onClick={() => setSelectedCountry(c)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCountry === c
                                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-400'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400'}`}>
                                    <span>{COUNTRY_FLAGS[c] || '🏳️'}</span>
                                    {t(`menuVis.countries.${c}`) || c}
                                    {hasOvr && <span className="w-2 h-2 bg-amber-400 rounded-full" title={t('menuVis.hasOverride')} />}
                                </button>
                            );
                        }) : (
                            <p className="text-sm text-gray-400">{t('menuVis.noCountries')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* User Selector */}
            {activeTab === 'user' && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <User size={16} className="text-indigo-500" />
                        {t('menuVis.searchUser')}
                        <span className="text-xs font-normal text-gray-400">— {t('menuVis.allUsers')}: {users.length}</span>
                    </h3>
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                            placeholder={t('menuVis.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-indigo-500 outline-none font-medium text-sm dark:text-white" />
                        {userSearch && (
                            <button onClick={() => setUserSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {users.length > 0 && (
                        <div className="max-h-60 overflow-y-auto space-y-1 border border-gray-100 dark:border-gray-700 rounded-xl p-2">
                            {users.map(u => {
                                const hasOvr = rules.some(r => r.scope === 'user' && r.scope_value == u.id);
                                return (
                                    <button key={u.id} onClick={() => setSelectedUser(u)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${selectedUser?.id === u.id
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 ring-1 ring-indigo-300'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {u.name?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-800 dark:text-gray-200 truncate">{u.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{u.email} · ID: {u.id}</div>
                                        </div>
                                        {u.country && <span className="text-sm flex-shrink-0">{COUNTRY_FLAGS[u.country] || u.country}</span>}
                                        {hasOvr && <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" title={t('menuVis.hasOverride')} />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Menu Toggle Grid */}
            {canEdit && !loading && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    {/* Title bar */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 flex-wrap">
                                <Eye size={18} className="text-indigo-500" />
                                {activeRole === 'seller' ? t('menuVis.seller') : t('menuVis.vendor')} {t('menuVis.menuSettings')}
                                {activeTab === 'country' && selectedCountry && (
                                    <span className="text-sm font-normal text-gray-400">
                                        — {selectedCountry === '__ALL__' ? `🌐 ${t('menuVis.allCountries')}` : `${COUNTRY_FLAGS[selectedCountry] || ''} ${t(`menuVis.countries.${selectedCountry}`) || selectedCountry}`}
                                    </span>
                                )}
                                {activeTab === 'user' && selectedUser && (
                                    <span className="text-sm font-normal text-gray-400">
                                        — {selectedUser.name} ({selectedUser.email})
                                    </span>
                                )}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {activeTab === 'global' && t('menuVis.globalNote')}
                                {activeTab === 'country' && t('menuVis.countryNote')}
                                {activeTab === 'user' && t('menuVis.userNote')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {activeTab !== 'global' && scopeHasOverrides() && (
                                <button onClick={handleDeleteOverride}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors">
                                    <Trash2 size={13} />
                                    {t('menuVis.deleteOverride')}
                                </button>
                            )}
                            <button onClick={handleSave} disabled={saving}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${isDirty
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                {t('menuVis.save')}
                            </button>
                        </div>
                    </div>

                    {/* Menu items by group */}
                    <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
                        {Object.entries(groupedMenus).map(([group, items]) => (
                            <div key={group}>
                                <div className="px-6 py-2 bg-gray-50/50 dark:bg-gray-700/20">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{groupLabels[group] || group}</span>
                                </div>
                                {items.map(menu => {
                                    const visible = localVisibility[menu.key] ?? 1;
                                    const Icon = menu.icon;

                                    return (
                                        <div key={menu.key}
                                            className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${visible ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                    <Icon size={16} className={visible ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
                                                </div>
                                                <div>
                                                    <div className={`text-sm font-bold transition-colors ${visible ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
                                                        {t(menu.label)}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono">{menu.key}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleVisibility(menu.key)}
                                                className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${visible
                                                    ? 'bg-indigo-500 shadow-inner shadow-indigo-600'
                                                    : 'bg-gray-300 dark:bg-gray-600 shadow-inner'}`}>
                                                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${visible ? 'left-[22px]' : 'left-0.5'}`}>
                                                    {visible ? <Eye size={12} className="text-indigo-500" /> : <EyeOff size={12} className="text-gray-400" />}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No selection message */}
            {!canEdit && (activeTab === 'country' || activeTab === 'user') && !loading && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'country' ? <MapPin size={28} className="text-gray-300" /> : <User size={28} className="text-gray-300" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">
                        {activeTab === 'country' ? t('menuVis.selectCountryPrompt') : t('menuVis.selectUserPrompt')}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                        {activeTab === 'country' ? t('menuVis.selectCountryDesc') : t('menuVis.selectUserDesc')}
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default AdminMenuVisibility;
