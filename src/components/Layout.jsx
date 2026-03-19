import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Store, ClipboardList, LogOut, UserCircle, Bell, Menu, X, Users, Building, ShoppingBag, MessageSquare, Flame, Home, Database, ChevronDown, Settings, AlertTriangle, Megaphone, Shield, AtSign, Heart, UserCheck, UserPlus, XCircle, CheckCircle2, BarChart3, Moon, Sun, CreditCard, TrendingUp, Monitor, ExternalLink, Trash2, MessageCircle, Headphones, Eye, Package, Send, Inbox, Wallet, Truck, Calculator } from 'lucide-react';
import NotificationPrompt from './NotificationPrompt';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { countryToLang, getPopupLocalized } from '../utils/translateText';
import ChatPage from '../pages/ChatPage';
import { subscribeToPush } from '../utils/pushNotifications';
import OnboardingGuide from './OnboardingGuide';

const Layout = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation('common');
    const { notifications, markAsRead, markAllAsRead, deleteReadNotifications } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith('/admin') ? '/admin' :
        location.pathname.startsWith('/host') ? '/host' :
            location.pathname.startsWith('/vendor') ? '/vendor' : '/seller';
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef(null);
    const [paymentEnabled, setPaymentEnabled] = useState(false);
    const [showChatPopup, setShowChatPopup] = useState(false);
    const [hiddenMenus, setHiddenMenus] = useState([]);

    // Login popup state
    const [loginPopups, setLoginPopups] = useState([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const allPopupsRef = useRef([]);

    // Fetch payment settings to control menu visibility
    useEffect(() => {
        fetch('/api/payments/get_settings.php', { credentials: 'include' })
            .then(r => r.json())
            .then(d => { if (d.success) setPaymentEnabled(!!parseInt(d.settings?.is_payment_enabled)); })
            .catch(() => { });
    }, []);

    // Fetch hidden menus for seller/host
    useEffect(() => {
        if (!user || user.role === 'admin' || user.role === 'superadmin') return;
        fetch('/api/menu/get_menu_visibility.php', { credentials: 'include' })
            .then(r => r.json())
            .then(d => { if (d.success) setHiddenMenus(d.hiddenMenus || []); })
            .catch(() => { });
    }, [user]);

    // 로그인 + 알림 권한 granted 시 자동 Push 구독 (세션당 1회)
    useEffect(() => {
        if (!user) return;
        if (sessionStorage.getItem('push_subscribed')) return;
        if ('Notification' in window && Notification.permission === 'granted') {
            subscribeToPush()
                .then(ok => { if (ok) sessionStorage.setItem('push_subscribed', '1'); })
                .catch(() => { });
        }
    }, [user]);

    // Fetch login popups on mount (with country filtering)
    useEffect(() => {
        if (!user) return;
        const userLang = i18n.language || countryToLang(user?.country);
        console.log('[Popup] i18n.language =', i18n.language, 'user.country =', user?.country, '→ userLang =', userLang);
        fetch(`/api/popups/popups.php?lang=${userLang}`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                console.log('[Popup] API response:', data);
                if (data.popups) {
                    data.popups.forEach(p => console.log(`[Popup] id=${p.id} title="${p.title}" translations=`, p.translations));
                }
                if (data.success && data.popups?.length > 0) {
                    // Client-side country filter (safety net alongside backend filter)
                    const filtered = data.popups.filter(p => {
                        const tc = p.target_countries;
                        if (!tc || tc === 'all') return true;
                        return tc.split(',').map(c => c.trim()).includes(userLang);
                    });
                    console.log('[Popup] Total popups from API:', data.popups.length, '→ After country filter:', filtered.length, 'userLang:', userLang);
                    allPopupsRef.current = filtered;
                    // Filter out popups dismissed today
                    const today = new Date().toDateString();
                    const visible = filtered.filter(p => {
                        const dismissKey = `popup_dismiss_${p.id}`;
                        const dismissed = localStorage.getItem(dismissKey);
                        console.log(`[Popup] id=${p.id} dismissKey=${dismissKey} dismissed=${dismissed} today=${today} show=${dismissed !== today}`);
                        return dismissed !== today;
                    });
                    console.log('[Popup] Visible after dismiss filter:', visible.length);
                    if (visible.length > 0) {
                        setLoginPopups(visible);
                        setCurrentPopupIndex(0);
                        setShowLoginPopup(true);
                    }
                }
            })
            .catch(err => { console.error('[Popup] Fetch error:', err); });
    }, [user, i18n.language]);

    // Re-show popups when user navigates back to home page
    const isHomePath = ['/admin', '/seller', '/host', '/vendor', '/'].includes(location.pathname) || location.pathname === '';
    useEffect(() => {
        if (!user || !isHomePath || allPopupsRef.current.length === 0) return;
        const today = new Date().toDateString();
        const visible = allPopupsRef.current.filter(p => {
            const dismissKey = `popup_dismiss_${p.id}`;
            return localStorage.getItem(dismissKey) !== today;
        });
        if (visible.length > 0) {
            setLoginPopups(visible);
            setCurrentPopupIndex(0);
            setShowLoginPopup(true);
        }
    }, [location.pathname]);

    // Click-outside-to-close for notification popup
    useEffect(() => {
        if (!showNotifs) return;
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifs]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [communityOpen, setCommunityOpen] = useState(false);
    const [managementOpen, setManagementOpen] = useState(false);

    const myNotifs = notifications; // Backend handles filtering by session
    // DB 'is_read' is 0 or 1.
    const unreadCount = myNotifs.filter(n => n.is_read == 0).length;

    // 탭 타이틀에 읽지 않은 알림 수 표시
    useEffect(() => {
        document.title = unreadCount > 0 ? `(${unreadCount}) SpaceMatch` : 'SpaceMatch';
    }, [unreadCount]);

    const [notifFilter, setNotifFilter] = useState('all');
    const [unreadOnly, setUnreadOnly] = useState(false);

    // Notification category mapping
    const NOTIF_CATEGORIES = {
        application: { label: t('notif.application'), types: ['application_new', 'application_status', 'cancellation_request', 'cancellation_result'], accent: 'border-l-indigo-500' },
        community: { label: t('notif.community'), types: ['community_post', 'community_comment', 'community_reply', 'community_mention'], accent: 'border-l-rose-500' },
        venue: { label: t('notif.venue'), types: ['venue_status', 'venue_new'], accent: 'border-l-emerald-500' },
        account: { label: t('notif.account'), types: ['vendor_approved', 'user_registered', 'test', 'chat_message', 'cs_message'], accent: 'border-l-cyan-500' },
        payment: { label: t('notif.payment'), types: ['payment_submitted', 'payment_result'], accent: 'border-l-green-500' },
    };

    const getNotifAccent = (type) => {
        for (const [, cat] of Object.entries(NOTIF_CATEGORIES)) {
            if (cat.types.includes(type)) return cat.accent;
        }
        return 'border-l-gray-300';
    };

    const getNotifMeta = (type) => {
        switch (type) {
            case 'application_new': return { icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-100', tag: t('notif.tagNewApplication'), tagColor: 'bg-indigo-100 text-indigo-600' };
            case 'application_status': return { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100', tag: t('notif.tagApplicationResult'), tagColor: 'bg-blue-100 text-blue-600' };
            case 'cancellation_request': return { icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-100', tag: t('notif.tagCancellationRequest'), tagColor: 'bg-orange-100 text-orange-600' };
            case 'cancellation_result': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', tag: t('notif.tagCancellationResult'), tagColor: 'bg-red-100 text-red-600' };
            case 'venue_status': return { icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-100', tag: t('notif.tagVenueStatus'), tagColor: 'bg-emerald-100 text-emerald-600' };
            case 'venue_new': return { icon: Building, color: 'text-teal-600', bg: 'bg-teal-100', tag: t('notif.tagNewVenue'), tagColor: 'bg-teal-100 text-teal-600' };
            case 'community_post': return { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100', tag: t('notif.tagLike'), tagColor: 'bg-rose-100 text-rose-600' };
            case 'community_comment': return { icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-100', tag: t('notif.tagComment'), tagColor: 'bg-violet-100 text-violet-600' };
            case 'community_reply': return { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100', tag: t('notif.tagReply'), tagColor: 'bg-purple-100 text-purple-600' };
            case 'community_mention': return { icon: AtSign, color: 'text-pink-600', bg: 'bg-pink-100', tag: t('notif.tagMention'), tagColor: 'bg-pink-100 text-pink-600' };
            case 'vendor_approved': return { icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', tag: t('notif.tagApproved'), tagColor: 'bg-green-100 text-green-600' };
            case 'user_registered': return { icon: UserPlus, color: 'text-cyan-600', bg: 'bg-cyan-100', tag: t('notif.tagRegistered'), tagColor: 'bg-cyan-100 text-cyan-600' };
            case 'payment_submitted': return { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100', tag: t('notif.tagPaymentSubmitted'), tagColor: 'bg-green-100 text-green-600' };
            case 'payment_result': return { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100', tag: t('notif.tagPaymentResult'), tagColor: 'bg-emerald-100 text-emerald-600' };
            case 'chat_message': return { icon: MessageCircle, color: 'text-violet-600', bg: 'bg-violet-100', tag: t('sidebar.chat'), tagColor: 'bg-violet-100 text-violet-600' };
            case 'cs_message': return { icon: Headphones, color: 'text-teal-600', bg: 'bg-teal-100', tag: 'CS', tagColor: 'bg-teal-100 text-teal-600' };
            default: return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100', tag: t('notif.tagDefault'), tagColor: 'bg-gray-100 text-gray-600' };
        }
    };

    const getRelativeTime = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return t('time.justNow');
        if (diff < 3600) return t('time.minutesAgo', { count: Math.floor(diff / 60) });
        if (diff < 86400) return t('time.hoursAgo', { count: Math.floor(diff / 3600) });
        if (diff < 604800) return t('time.daysAgo', { count: Math.floor(diff / 86400) });
        return date.toLocaleDateString();
    };

    const filteredNotifs = (() => {
        let result = notifFilter === 'all' ? myNotifs
            : myNotifs.filter(n => NOTIF_CATEGORIES[notifFilter]?.types.includes(n.type));
        if (unreadOnly) result = result.filter(n => n.is_read == 0);
        return result;
    })();

    const handleNotifClick = (notif) => {
        if (notif.is_read == 0) {
            markAsRead(notif.id);
        }
        setShowNotifs(false);
        // For chat/CS notifications, open the chat popup instead of navigating
        if (notif.type === 'chat_message' || notif.type === 'cs_message') {
            setShowChatPopup(true);
            return;
        }
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { to: '/admin', icon: Home, label: t('sidebar.home') },
        { to: '/admin/dashboard', icon: LayoutDashboard, label: t('sidebar.adminDashboard') },
        { to: '/admin/analytics', icon: BarChart3, label: t('sidebar.analytics') },
        { to: '/admin/sellers', icon: ShoppingBag, label: t('sidebar.sellerDirectory') },
        { to: '/admin/hosts', icon: Building, label: t('sidebar.hostDirectory') },
        { to: '/admin/popular', icon: Flame, label: t('sidebar.popularSpaces') },
    ];
    const adminManagementLinks = [
        { to: '/admin/applications', icon: ClipboardList, label: t('sidebar.applicationManagement') },
        { to: '/admin/cancellations', icon: AlertTriangle, label: t('sidebar.cancellationRequests') },
        { to: '/admin/venues', icon: Store, label: t('sidebar.venueManagement') },
        { to: '/admin/promotions', icon: Flame, label: t('sidebar.recruitmentManagement') },
        { to: '/admin/users', icon: Users, label: t('sidebar.userManagement') },
        { to: '/admin/seller-stats', icon: TrendingUp, label: t('sidebar.sellerStatsManagement') },
        { to: '/admin/calc-stats', icon: Calculator, label: t('sidebar.calcStats', '계산기 통계') },
        { to: '/admin/payments', icon: CreditCard, label: t('sidebar.paymentManagement') },
        { to: '/admin/host-report', icon: BarChart3, label: t('sidebar.analyticsReport') },
        { to: '/admin/ads', icon: Megaphone, label: t('sidebar.adManagement') },
        { to: '/admin/marketing', icon: Megaphone, label: t('sidebar.marketingManagement', '마케팅 관리') },
        { to: '/admin/vendor-management', icon: Truck, label: t('sidebar.vendorTransactionManagement', '벤더 거래 관리') },
        { to: '/admin/popups', icon: Monitor, label: t('sidebar.popupManagement') },
        { to: '/admin/security', icon: Shield, label: t('sidebar.securitySettings') },
        { to: '/admin/menu-visibility', icon: Eye, label: t('sidebar.menuVisibility') },
    ];
    const adminBottomLinks = [
        { to: '/admin/trash', icon: Trash2, label: t('sidebar.trash') },
        { to: '/admin/profile', icon: UserCircle, label: t('sidebar.myProfile') },
        { to: '/admin/notification-settings', icon: Bell, label: t('sidebar.notificationSettings', '알림 설정') },
        ...(user?.role === 'superadmin' ? [{ to: '/admin/database', icon: Database, label: t('sidebar.dbManagement') }] : []),
    ];

    const adminCommunityLinks = [
        { to: '/admin/community/general', icon: Users, label: t('sidebar.integratedCommunity') },
        { to: '/admin/community/seller', icon: ShoppingBag, label: t('sidebar.sellerCommunity') },
        { to: '/admin/community/host', icon: Store, label: t('sidebar.hostCommunity') },
    ];

    const sellerLinks = [
        { to: '/seller', icon: Home, label: t('sidebar.home') },
        { to: '/seller/applications', icon: ClipboardList, label: t('sidebar.applicationStatus') },
        { to: '/seller/hosts', icon: Building, label: t('sidebar.hostDirectory') },
        { to: '/seller/popular', icon: Flame, label: t('sidebar.popularSpaces') },
        { to: '/seller/proposals', icon: Inbox, label: t('sidebar.distributionProposals', '유통 제안') },
        { to: '/seller/shipments', icon: Package, label: t('sidebar.shippingManagement', '배송 관리') },
        { to: '/seller/settlements', icon: Wallet, label: t('sidebar.settlements', '정산') },
        { to: '/seller/stats', icon: TrendingUp, label: t('sidebar.salesManagement') },
        { to: '/seller/analytics', icon: BarChart3, label: t('sidebar.analytics') },
        { to: '/seller/marketing', icon: Megaphone, label: t('sidebar.marketing', '마케팅') },
    ];
    const sellerBottomLinks = [
        { to: '/seller/profile', icon: UserCircle, label: t('sidebar.myProfile') },
        { to: '/seller/notification-settings', icon: Bell, label: t('sidebar.notificationSettings', '알림 설정') },
        ...(paymentEnabled ? [{ to: '/seller/payments', icon: CreditCard, label: t('sidebar.servicePayment') }] : []),
    ];

    const sellerCommunityLinks = [
        { to: '/seller/community', icon: ShoppingBag, label: t('sidebar.sellerCommunity') },
        { to: '/seller/community/general', icon: Users, label: t('sidebar.integratedCommunity') },
    ];

    const hostLinks = [
        { to: '/host', icon: Home, label: t('sidebar.home') },
        { to: '/host/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
        { to: '/host/sellers', icon: ShoppingBag, label: t('sidebar.sellerDirectory') },
        { to: '/host/stats', icon: TrendingUp, label: t('sidebar.salesManagement') },
        { to: '/host/analytics', icon: BarChart3, label: t('sidebar.analytics') },
        { to: '/host/report', icon: TrendingUp, label: t('sidebar.analyticsReport') },
        { to: '/host/marketing', icon: Megaphone, label: t('sidebar.marketing', '마케팅') },
    ];
    const hostManagementLinks = [
        { to: '/host/venues', icon: Store, label: t('sidebar.spaceManagement') },
        { to: '/host/applications', icon: ClipboardList, label: t('sidebar.applicationManagement') },
        { to: '/host/cancellations', icon: AlertTriangle, label: t('sidebar.cancellationRequests') },
    ];
    const hostBottomLinks = [
        { to: '/host/profile', icon: UserCircle, label: t('sidebar.myProfile') },
        { to: '/host/notification-settings', icon: Bell, label: t('sidebar.notificationSettings', '알림 설정') },
        ...(paymentEnabled ? [{ to: '/host/payments', icon: CreditCard, label: t('sidebar.servicePayment') }] : []),
    ];

    const hostCommunityLinks = [
        { to: '/host/community', icon: Store, label: t('sidebar.hostCommunity') },
        { to: '/host/community/general', icon: Users, label: t('sidebar.integratedCommunity') },
    ];

    const vendorLinks = [
        { to: '/vendor', icon: Home, label: t('sidebar.home') },
        { to: '/vendor/sellers', icon: ShoppingBag, label: t('sidebar.sellerDirectory') },
        { to: '/vendor/proposals', icon: Send, label: t('sidebar.distributionProposals', '유통 제안') },
        { to: '/vendor/shipments', icon: Package, label: t('sidebar.shippingManagement', '배송 관리') },
        { to: '/vendor/settlements', icon: Wallet, label: t('sidebar.settlements', '정산') },
        { to: '/vendor/chat', icon: MessageCircle, label: t('sidebar.chat', '채팅') },
    ];
    const vendorBottomLinks = [
        { to: '/vendor/profile', icon: UserCircle, label: t('sidebar.myProfile') },
        { to: '/vendor/notification-settings', icon: Bell, label: t('sidebar.notificationSettings', '알림 설정') },
    ];

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const isHost = user?.role === 'host';
    const isVendor = user?.role === 'vendor';
    const filterHidden = (items) => isAdmin ? items.filter(l => l.to === '/admin/marketing' ? !hiddenMenus.includes(l.to) : true) : items.filter(l => !hiddenMenus.includes(l.to));
    const links = filterHidden(isAdmin ? adminLinks : (isHost ? hostLinks : (isVendor ? vendorLinks : sellerLinks)));
    const managementLinks = filterHidden(isAdmin ? adminManagementLinks : (isHost ? hostManagementLinks : []));
    const communityLinks = filterHidden(isAdmin ? adminCommunityLinks : (isHost ? hostCommunityLinks : (isVendor ? [] : sellerCommunityLinks)));
    const bottomLinks = filterHidden(isAdmin ? adminBottomLinks : (isHost ? hostBottomLinks : (isVendor ? vendorBottomLinks : sellerBottomLinks)));

    // Auto-redirect: if current page is hidden, go to first visible page
    const allVisibleLinks = [...links, ...managementLinks, ...communityLinks, ...bottomLinks];

    useEffect(() => {
        if (!user || isAdmin || hiddenMenus.length === 0 || allVisibleLinks.length === 0) return;
        const currentPath = location.pathname;
        // Check if current path is the base index or a hidden menu
        const isIndex = currentPath === basePath || currentPath === basePath + '/';
        const isHidden = hiddenMenus.includes(currentPath);
        if (isIndex || isHidden) {
            const firstVisible = allVisibleLinks[0];
            if (firstVisible && firstVisible.to !== currentPath) {
                navigate(firstVisible.to, { replace: true });
            }
        }
    }, [hiddenMenus, location.pathname, allVisibleLinks, basePath, isAdmin, user]);

    if (!user) return <Navigate to="/login" replace />;

    const renderSidebar = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <img src="/favicon.png" alt="SpaceMatch" className="w-8 h-8 rounded-lg object-contain dark:brightness-0 dark:invert" />
                    SpaceMatch
                </h1>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
            <nav className="mt-6 flex-1 overflow-y-auto pb-4">
                {/* Main Links */}
                {links.map(link => {
                    const needsEnd = link.to === '/admin' || link.to === '/seller' || link.to === '/host' || link.to === '/vendor'
                        || links.some(other => other.to !== link.to && other.to.startsWith(link.to + '/'));
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setMobileMenuOpen(false)}
                            end={needsEnd}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'text-primary bg-indigo-50 border-r-4 border-primary'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            <link.icon size={20} />
                            {link.label}
                        </NavLink>
                    );
                })}

                {/* Management Section (renders BEFORE community for host, AFTER for admin) */}
                {isHost && managementLinks.length > 0 && (
                    <div>
                        <button
                            onClick={() => setManagementOpen(!managementOpen)}
                            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${managementOpen ? 'text-primary bg-indigo-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Settings size={20} />
                            <span className="flex-1">{t('sidebar.mySpaceManagement')}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${managementOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {managementOpen && (
                            <div className="bg-gray-50/50">
                                {managementLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive
                                                ? 'text-primary bg-indigo-50 border-r-4 border-primary'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                                            }`
                                        }
                                    >
                                        <link.icon size={16} />
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                )}



                {/* Community Section */}
                <div>
                    <button
                        onClick={() => setCommunityOpen(!communityOpen)}
                        className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${communityOpen ? 'text-primary bg-indigo-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={20} />
                        <span className="flex-1">{t('sidebar.community')}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {communityOpen && (
                        <div className="bg-gray-50/50">
                            {communityLinks.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    end={communityLinks.some(other => other.to !== link.to && other.to.startsWith(link.to + '/'))}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? 'text-primary bg-indigo-50 border-r-4 border-primary'
                                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                                        }`
                                    }
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {/* Admin Management Section (renders AFTER community) */}
                {!isHost && managementLinks.length > 0 && (
                    <div>
                        <button
                            onClick={() => setManagementOpen(!managementOpen)}
                            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${managementOpen ? 'text-primary bg-indigo-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Settings size={20} />
                            <span className="flex-1">{t('sidebar.management')}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${managementOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {managementOpen && (
                            <div className="bg-gray-50/50">
                                {managementLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive
                                                ? 'text-primary bg-indigo-50 border-r-4 border-primary'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                                            }`
                                        }
                                    >
                                        <link.icon size={16} />
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Links (Profile, DB etc.) */}
                {bottomLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive
                                ? 'text-primary bg-indigo-50 border-r-4 border-primary'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`
                        }
                    >
                        <link.icon size={20} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            <div className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                {/* User Profile Card */}
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0 shadow-md">
                            {user.profile_image ? (
                                <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name[0]
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{user.role === 'superadmin' ? t('roleSuperAdmin') : user.role === 'admin' ? t('roleAdmin') : user.role === 'host' ? t('roleHost') : user.role === 'vendor' ? t('roleVendor', 'Vendor') : t('roleSeller')}</p>
                        </div>
                    </div>
                </div>

                {/* Utility Row: Theme + Notifications + Language */}
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={toggleTheme}
                            className="flex-1 h-9 flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all"
                            title={isDark ? t('lightMode') : t('darkMode')}
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            <span className="text-[11px] font-semibold">{isDark ? t('lightMode') : t('darkMode')}</span>
                        </button>
                        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="relative flex-1 h-9 flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all"
                            title={t('notifications')}
                        >
                            <Bell size={16} />
                            <span className="text-[11px] font-semibold">{t('notifications')}</span>
                            {unreadCount > 0 && (
                                <span className="min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="px-4 pb-3">
                    <div className="flex items-center">
                        <LanguageSelector />
                    </div>
                </div>

                {/* Logout */}
                <div className="px-4 pb-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full h-9 text-[12px] font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                    >
                        <LogOut size={15} />
                        {t('logout')}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-30">
                <h1 className="text-xl font-bold text-primary">SpaceMatch</h1>
                <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar (Static) */}
            <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
                {renderSidebar()}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-hidden">
                        {renderSidebar()}
                    </aside>
                </div>
            )}

            {/* Browser Notification Permission Prompt */}
            <NotificationPrompt />

            {/* Onboarding Guide for new users */}
            <OnboardingGuide />

            {/* ━━ Notification Popup Modal ━━ */}
            {showNotifs && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => setShowNotifs(false)}
                    />
                    {/* Modal */}
                    <div
                        className="relative w-full max-w-[480px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/50"
                        style={{ animation: 'popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-shrink-0 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                        <Bell size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-white text-lg">{t('notif.center')}</h3>
                                        <p className="text-[12px] text-white/70">{t('notif.countSummary', { total: myNotifs.length, unread: unreadCount })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={() => markAllAsRead()}
                                            className="text-xs text-white/90 hover:text-white font-bold hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all backdrop-blur-sm"
                                        >
                                            {t('notif.markAllRead')}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setShowNotifs(false); navigate(`${basePath}/notification-settings`); }}
                                        className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                                        title="알림 설정"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShowNotifs(false)}
                                        className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Tabs + Unread Toggle */}
                            <div className="flex flex-wrap gap-1.5 relative">
                                {[{ key: 'all', label: t('notif.all') }, { key: 'application', label: t('notif.application') }, { key: 'community', label: t('notif.community') }, { key: 'venue', label: t('notif.venue') }, { key: 'account', label: t('notif.account') }].map(tab => {
                                    const tabCount = tab.key === 'all' ? myNotifs.filter(n => n.is_read == 0).length
                                        : myNotifs.filter(n => NOTIF_CATEGORIES[tab.key]?.types.includes(n.type) && n.is_read == 0).length;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setNotifFilter(tab.key)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${notifFilter === tab.key
                                                ? 'bg-white text-indigo-600 shadow-lg'
                                                : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
                                                }`}
                                        >
                                            {tab.label}
                                            {tabCount > 0 && (
                                                <span className={`ml-1 text-[10px] ${notifFilter === tab.key ? 'text-indigo-400' : 'text-white/50'}`}>{tabCount}</span>
                                            )}
                                        </button>
                                    );
                                })}
                                {/* Unread Toggle */}
                                <button
                                    onClick={() => setUnreadOnly(!unreadOnly)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${unreadOnly
                                        ? 'bg-white text-rose-500 shadow-lg'
                                        : 'bg-white/15 text-white/80 hover:bg-white/25'
                                        }`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${unreadOnly ? 'border-rose-500' : 'border-white/60'}`}>
                                        {unreadOnly && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                                    </div>
                                    {t('notif.unreadOnly')}
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredNotifs.length > 0 ? (
                                <div className="py-2">
                                    {filteredNotifs.map(n => {
                                        const meta = getNotifMeta(n.type);
                                        const IconComp = meta.icon;
                                        const accent = getNotifAccent(n.type);
                                        return (
                                            <div key={n.id}
                                                className={`flex items-start gap-3 mx-3 my-1.5 px-4 py-3.5 cursor-pointer transition-all duration-200 rounded-2xl border-l-[3px] ${accent} ${n.is_read == 0
                                                    ? 'bg-indigo-50/60 hover:bg-indigo-50 shadow-sm'
                                                    : 'bg-gray-50/50 hover:bg-gray-100/50 opacity-60'
                                                    }`}
                                                onClick={() => handleNotifClick(n)}
                                            >
                                                {/* Type Icon */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shadow-sm`}>
                                                    <IconComp size={18} className={meta.color} />
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.tagColor}`}>{meta.tag}</span>
                                                        {n.is_read == 0 && (
                                                            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-300 flex-shrink-0 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <p className={`text-sm leading-relaxed line-clamp-2 ${n.is_read == 0 ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{n.message}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <p className="text-[11px] text-gray-400">{getRelativeTime(n.created_at)}</p>
                                                        {n.link && (
                                                            <span className="text-[11px] text-indigo-500 font-semibold">{t('notif.goTo')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
                                        <Bell size={32} className="text-gray-300" />
                                    </div>
                                    <p className="text-base font-bold text-gray-400 mb-1">
                                        {unreadOnly ? t('notif.emptyUnreadTitle') : t('notif.emptyTitle')}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {unreadOnly ? t('notif.emptyUnreadDesc') : t('notif.emptyDesc')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {myNotifs.some(n => n.is_read == 1) && (
                            <div className="p-3 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
                                <button
                                    onClick={() => deleteReadNotifications()}
                                    className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-colors font-bold"
                                >
                                    {t('notif.deleteRead')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )
            }

            {/* Login Popup Display */}
            {
                showLoginPopup && loginPopups.length > 0 && (() => {
                    const popup = loginPopups[currentPopupIndex];
                    if (!popup) return null;
                    const viewerLang = i18n.language || countryToLang(user?.country);
                    const localized = getPopupLocalized(popup, viewerLang);
                    console.log('[Popup Render] i18n.language:', i18n.language, 'user.country:', user?.country, '→ viewerLang:', viewerLang, '| popup.translations:', popup.translations, '| showing:', localized);
                    const dismissToday = () => {
                        const today = new Date().toDateString();
                        localStorage.setItem(`popup_dismiss_${popup.id}`, today);
                        if (currentPopupIndex < loginPopups.length - 1) setCurrentPopupIndex(i => i + 1);
                        else setShowLoginPopup(false);
                    };
                    const closePopup = () => {
                        if (currentPopupIndex < loginPopups.length - 1) setCurrentPopupIndex(i => i + 1);
                        else setShowLoginPopup(false);
                    };
                    return (
                        <div key={popup.id} className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={closePopup}>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}
                                style={{ animation: 'popupScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                                {popup.image_url && (
                                    <div className="relative">
                                        {popup.click_url ? (
                                            <a href={popup.click_url} target="_blank" rel="noreferrer">
                                                <img src={popup.image_url} alt="" className="w-full max-h-80 object-cover" />
                                            </a>
                                        ) : (
                                            <img src={popup.image_url} alt="" className="w-full max-h-80 object-cover" />
                                        )}
                                        <button onClick={closePopup} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
                                            <X size={16} />
                                        </button>
                                        {loginPopups.length > 1 && (
                                            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full">
                                                {currentPopupIndex + 1} / {loginPopups.length}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="p-5">
                                    {!popup.image_url && (
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${popup.popup_type === 'notice' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {popup.popup_type === 'notice' ? t('popup.notice') : t('popup.ad')}
                                            </span>
                                            <button onClick={closePopup} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                                        </div>
                                    )}
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">{localized.title}</h2>
                                    {localized.content && <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{localized.content}</p>}
                                    {popup.click_url && (
                                        <a href={popup.click_url} target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors mb-3">
                                            <ExternalLink size={14} /> {t('popup.viewDetails')}
                                        </a>
                                    )}
                                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                        <button onClick={closePopup}
                                            className="flex-1 py-2.5 text-gray-700 font-bold border border-gray-200 rounded-xl text-xs hover:bg-gray-50 transition-colors">{t('popup.close')}</button>
                                        <button onClick={dismissToday}
                                            className="flex-1 py-2.5 text-gray-400 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">{t('popup.dismissToday')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            }

            {/* Popup animation */}
            <style>{`
                @keyframes popupScale {
                    from { transform: scale(0.85) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen px-6 py-4 lg:px-20 lg:py-8 relative">
                <div className="max-w-screen-xl mx-auto">
                    <Outlet />
                </div>

                {/* Floating Chat Button */}
                <>
                    {/* FAB Button */}
                    <button
                        onClick={() => setShowChatPopup(!showChatPopup)}
                        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 z-[9999] ${showChatPopup
                            ? 'bg-gray-800 hover:bg-gray-900 text-white shadow-xl shadow-gray-500/30 scale-90 rotate-90'
                            : 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-400 hover:via-violet-400 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110'
                            }`}
                        title={t('sidebar.chat')}
                    >
                        {showChatPopup ? <X size={24} /> : <MessageCircle size={24} />}
                        {!showChatPopup && (
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
                        )}
                    </button>

                    {/* Chat Popup Overlay */}
                    {showChatPopup && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9997] lg:hidden"
                                onClick={() => setShowChatPopup(false)}
                            />
                            <div
                                className="fixed z-[9998] flex flex-col overflow-hidden
                                    bottom-4 right-4 left-4 top-20
                                    sm:left-auto sm:top-auto sm:bottom-24 sm:right-6 sm:w-[620px] sm:h-[580px]
                                    lg:bottom-28 lg:right-10 lg:w-[680px] lg:h-[640px]
                                    bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-100"
                                style={{ animation: 'chatPopupSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                            >
                                {/* Popup Header */}
                                <div className="relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white flex-shrink-0 overflow-hidden">
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.2) 0%, transparent 40%)' }}
                                    />
                                    <div className="relative flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <MessageCircle size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm leading-tight">{t('sidebar.chat')}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                <span className="text-[10px] text-white/70 font-medium">Online</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChatPopup(false)}
                                        className="relative w-8 h-8 flex items-center justify-center hover:bg-white/15 rounded-xl transition-colors duration-200"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                {/* Chat Content */}
                                <div className="flex-1 overflow-hidden">
                                    <ChatPage isPopup={true} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Chat popup animations */}
                    <style>{`
                        @keyframes chatPopupSlide {
                            from { transform: translateY(24px) scale(0.92); opacity: 0; }
                            to { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    `}</style>
                </>


            </main>
        </div >
    );
};

export default Layout;
