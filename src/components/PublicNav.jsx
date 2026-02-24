import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn, Moon, Sun } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const PublicNav = ({ transparent = false }) => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation('landing');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (!transparent) { setScrolled(true); return; }
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparent]);

    useEffect(() => { setMobileMenu(false); }, [location.pathname]);

    const navLinks = [
        { label: t('nav.services'), path: '/services' },
        { label: t('nav.howItWorks'), path: '/how-it-works' },
        { label: t('recruitment.title'), path: '/recruitment' },
        { label: t('nav.about'), path: '/about' },
        { label: t('nav.contact'), path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;
    const shouldBeTransparent = transparent && !scrolled;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shouldBeTransparent
            ? 'bg-transparent py-4 md:py-5'
            : 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)] py-2.5 md:py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                    <img
                        src="/favicon.png"
                        alt="SpaceMatch"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-xl object-contain transition-all duration-300"
                    />
                    <span className="text-lg md:text-xl font-extrabold tracking-tight transition-colors duration-300 text-gray-900">
                        SpaceMatch
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 lg:px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${isActive(link.path)
                                ? 'text-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="w-px h-5 mx-2 bg-gray-200" />

                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 shadow-lg hover:-translate-y-0.5 ml-2 bg-indigo-600 text-white shadow-indigo-200/60 hover:bg-indigo-700"
                    >
                        <LogIn size={15} />
                        {t('nav.login')}
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="ml-1 p-2 rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <LanguageSelector compact />
                </div>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl transition-all text-gray-500 hover:bg-gray-100"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <LanguageSelector compact />
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="p-2 rounded-xl transition-all text-gray-700 hover:bg-gray-100"
                    >
                        {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border-t border-gray-100 animate-fadeIn">
                    <div className="p-3 space-y-0.5">
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
                        <div className="pt-2 border-t border-gray-100 mt-2">
                            <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200/50">
                                <LogIn size={16} />
                                {t('nav.login')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNav;
