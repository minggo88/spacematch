import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LayoutDashboard, Store, ClipboardList, LogOut, UserCircle, Bell, Menu, X, Users, Building, ShoppingBag, MessageSquare, Flame, Home, Database, ChevronDown, Settings, AlertTriangle, Megaphone } from 'lucide-react';
import NotificationPrompt from './NotificationPrompt';

const Layout = () => {
    const { user, logout } = useAuth();
    const { notifications, markAsRead, markAllAsRead, deleteReadNotifications } = useData();
    const navigate = useNavigate();
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef(null);

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

    const handleNotifClick = (notif) => {
        if (notif.is_read == 0) {
            markAsRead(notif.id);
        }
        setShowNotifs(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <Navigate to="/login" replace />;

    const adminLinks = [
        { to: '/admin', icon: Home, label: '홈' },
        { to: '/admin/dashboard', icon: LayoutDashboard, label: '대시보드' },
    ];
    const adminManagementLinks = [
        { to: '/admin/venues', icon: Store, label: '베뉴 관리' },
        { to: '/admin/applications', icon: ClipboardList, label: '입점 신청 관리' },
        { to: '/admin/cancellations', icon: AlertTriangle, label: '취소 요청' },
        { to: '/admin/promotions', icon: Flame, label: '모집 관리' },
        { to: '/admin/users', icon: Users, label: '사용자 관리' },
        { to: '/admin/ads', icon: Megaphone, label: '광고 관리' },
    ];
    const adminBottomLinks = [
        { to: '/admin/profile', icon: UserCircle, label: '내 프로필' },
        ...(user.role === 'superadmin' ? [{ to: '/admin/database', icon: Database, label: 'DB 관리' }] : []),
    ];

    const adminCommunityLinks = [
        { to: '/admin/community/seller', icon: ShoppingBag, label: '셀러 커뮤니티' },
        { to: '/admin/community/vendor', icon: Store, label: '벤더 커뮤니티' },
        { to: '/admin/community/general', icon: Users, label: '통합 커뮤니티' },
    ];

    const sellerLinks = [
        { to: '/seller', icon: Home, label: '홈' },
        { to: '/seller/vendors', icon: Building, label: '벤더 탐색' },
        { to: '/seller/applications', icon: ClipboardList, label: '신청 현황' },
    ];
    const sellerBottomLinks = [
        { to: '/seller/profile', icon: UserCircle, label: '내 프로필' },
    ];

    const sellerCommunityLinks = [
        { to: '/seller/community', icon: ShoppingBag, label: '셀러 커뮤니티' },
        { to: '/seller/community/general', icon: Users, label: '통합 커뮤니티' },
    ];

    const vendorLinks = [
        { to: '/vendor', icon: Home, label: '홈' },
        { to: '/vendor/dashboard', icon: LayoutDashboard, label: '대시보드' },
        { to: '/vendor/sellers', icon: ShoppingBag, label: '셀러 탐색' },
    ];
    const vendorManagementLinks = [
        { to: '/vendor/venues', icon: Store, label: '공간 관리' },
        { to: '/vendor/applications', icon: ClipboardList, label: '입점 신청 관리' },
        { to: '/vendor/cancellations', icon: AlertTriangle, label: '취소 요청' },
    ];
    const vendorBottomLinks = [
        { to: '/vendor/profile', icon: UserCircle, label: '내 프로필' },
    ];

    const vendorCommunityLinks = [
        { to: '/vendor/community', icon: Store, label: '벤더 커뮤니티' },
        { to: '/vendor/community/general', icon: Users, label: '통합 커뮤니티' },
    ];

    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    const isVendor = user.role === 'vendor';
    const links = isAdmin ? adminLinks : (isVendor ? vendorLinks : sellerLinks);
    const managementLinks = isAdmin ? adminManagementLinks : (isVendor ? vendorManagementLinks : []);
    const communityLinks = isAdmin ? adminCommunityLinks : (isVendor ? vendorCommunityLinks : sellerCommunityLinks);
    const bottomLinks = isAdmin ? adminBottomLinks : (isVendor ? vendorBottomLinks : sellerBottomLinks);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
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
                {links.map((link) => {
                    const needsEnd = link.to === '/admin' || link.to === '/seller' || link.to === '/vendor'
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

                {/* Collapsible Management Menu (Admin only) */}
                {managementLinks.length > 0 && (
                    <>
                        <button
                            onClick={() => setManagementOpen(!managementOpen)}
                            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${managementOpen ? 'text-primary bg-indigo-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Settings size={20} />
                            <span className="flex-1">{isVendor ? '내 공간 관리' : '관리'}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${managementOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {managementOpen && (
                            <div className="bg-gray-50/50">
                                {managementLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 pl-12 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive
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
                    </>
                )}

                {/* Collapsible Community Menu */}
                <button
                    onClick={() => setCommunityOpen(!communityOpen)}
                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors w-full text-left ${communityOpen ? 'text-primary bg-indigo-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                >
                    <MessageSquare size={20} />
                    <span className="flex-1">커뮤니티</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`} />
                </button>
                {communityOpen && (
                    <div className="bg-gray-50/50">
                        {communityLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                end={communityLinks.some(other => other.to !== link.to && other.to.startsWith(link.to + '/'))}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 pl-12 pr-6 py-2.5 text-sm font-medium transition-colors ${isActive
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

                {/* Profile & DB links after community */}
                {bottomLinks.map((link) => (
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
            <div className="w-full p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="relative mb-4 px-2" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors w-full p-2 hover:bg-gray-50 rounded-lg relative"
                    >
                        <div className="relative">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                        <span className="text-sm font-medium">알림</span>
                        {unreadCount > 0 && (
                            <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown (Popover upwards) */}
                    {showNotifs && (
                        <div className="absolute bottom-full right-0 left-0 mb-2 w-auto min-w-[240px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20">
                            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                                <h4 className="font-bold text-xs text-gray-500 uppercase">알림</h4>
                                {unreadCount > 0 && (
                                    <button onClick={() => markAllAsRead()} className="text-xs text-primary hover:underline">
                                        모두 읽음
                                    </button>
                                )}
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {myNotifs.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {myNotifs.map(n => (
                                            <div key={n.id}
                                                className={`p-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${n.is_read == 1 ? 'bg-white opacity-60' : 'bg-indigo-50/50'}`}
                                                onClick={() => handleNotifClick(n)}
                                            >
                                                <p className="text-gray-800">{n.message}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</p>
                                                    {n.link && (
                                                        <span className="text-xs text-indigo-500 font-medium">
                                                            이동 →
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-4 text-center text-gray-400 text-xs">새로운 알림이 없습니다.</p>
                                )}
                            </div>
                            {myNotifs.some(n => n.is_read == 1) && (
                                <div className="p-2 border-t border-gray-100 bg-gray-50">
                                    <button
                                        onClick={() => deleteReadNotifications()}
                                        className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors font-medium"
                                    >
                                        읽은 알림 전체 지우기
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 px-2 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0">
                        {user.profile_image ? (
                            <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role === 'superadmin' ? '슈퍼관리자' : user.role === 'admin' ? '관리자' : user.role === 'vendor' ? '벤더' : '셀러'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                <h1 className="text-xl font-bold text-primary">SpaceMatch</h1>
                <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar (Static) */}
            <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 overflow-hidden">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Browser Notification Permission Prompt */}
            <NotificationPrompt />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen p-4 lg:px-12 lg:py-8 relative">
                <div className="max-w-screen-xl mx-auto">
                    <Outlet />

                    {/* Floating Inquiry Button */}
                    <a
                        href="http://pf.kakao.com/_xjGxoRX/chat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-[#fae100] hover:bg-[#ffe812] text-[#3c1e1e] rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
                        title="카카오톡 문의하기"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C6.48 3 2 6.48 2 10.76C2 13.62 3.93 16.08 6.78 17.34C6.61 17.9 5.86 20.47 5.8 20.67C5.7 21 6.07 21.2 6.32 21.03C7.57 20.19 9.35 18.98 10.12 18.46C10.73 18.5 11.36 18.52 12 18.52C17.52 18.52 22 15.04 22 10.76C22 6.48 17.52 3 12 3Z" />
                        </svg>
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Layout;
