import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Menu, X } from 'lucide-react';

const PublicNav = ({ transparent = false }) => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation();

    const dashboardPath = user
        ? user.role === 'superadmin' || user.role === 'admin'
            ? '/admin'
            : user.role === 'vendor'
                ? '/vendor'
                : '/seller'
        : null;

    useEffect(() => {
        if (!transparent) { setScrolled(true); return; }
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparent]);

    // Close mobile menu on route change
    useEffect(() => { setMobileMenu(false); }, [location.pathname]);

    const navLinks = [
        { label: '서비스 소개', path: '/services' },
        { label: '이용 방법', path: '/how-it-works' },
        { label: '모집 정보', path: '/recruitment' },
        { label: '회사 소개', path: '/about' },
        { label: '문의하기', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;
    const shouldBeTransparent = transparent && !scrolled;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shouldBeTransparent
            ? 'bg-transparent py-4 md:py-5'
            : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 py-2.5 md:py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shouldBeTransparent ? 'bg-white/20 backdrop-blur-sm' : 'bg-indigo-600'
                        }`}>
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className={`text-lg md:text-xl font-extrabold tracking-tight transition-colors duration-300 ${shouldBeTransparent ? 'text-white' : 'text-gray-900'
                        }`}>
                        SpaceMatch
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-semibold transition-all duration-300 relative ${shouldBeTransparent
                                ? isActive(link.path) ? 'text-white' : 'text-white/70 hover:text-white'
                                : isActive(link.path) ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                                }`}
                        >
                            {link.label}
                            {isActive(link.path) && (
                                <span className={`absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full ${shouldBeTransparent ? 'bg-white' : 'bg-indigo-600'
                                    }`} />
                            )}
                        </Link>
                    ))}
                    <div className="flex items-center gap-3 ml-2 lg:ml-4">
                        {dashboardPath ? (
                            <Link
                                to={dashboardPath}
                                className="px-4 lg:px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                            >
                                대시보드 →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-3 lg:px-4 py-2 rounded-xl font-bold text-sm transition-all ${shouldBeTransparent
                                        ? 'text-white/90 hover:bg-white/10'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`px-4 lg:px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 ${shouldBeTransparent
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                        }`}
                                >
                                    무료 시작하기
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className={`md:hidden p-2 rounded-xl transition-all ${shouldBeTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t animate-fadeIn">
                    <div className="p-4 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block w-full text-left px-4 py-3 font-semibold rounded-xl transition-colors ${isActive(link.path)
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t mt-3 space-y-2">
                            {dashboardPath ? (
                                <Link to={dashboardPath} className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold">
                                    대시보드 →
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="block w-full text-center py-3 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                                        로그인
                                    </Link>
                                    <Link to="/signup" className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold">
                                        무료 시작하기
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNav;
