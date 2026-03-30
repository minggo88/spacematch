import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MapPin, Store, Filter, Building, ChevronDown, ChevronRight, ArrowLeft, X, Users, Mail, Phone, Calendar, Crown, Star, Clock, ImageIcon, Flame, ExternalLink, BadgeCheck, MessageCircle, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdSlot from '../../components/AdSlot';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const SellerHostDirectory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation('seller');
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'success') => { setToast({ message, type }); }, []);

    const TYPE_LABELS = {
        popup: t('hostDirectoryPage.typePopup'),
        gallery: t('hostDirectoryPage.typeGallery'),
        cafe: t('hostDirectoryPage.typeCafe'),
        showroom: t('hostDirectoryPage.typeShowroom'),
        fleamarket: t('hostDirectoryPage.typeFleamarket'),
    };
    const [hosts, setHosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedHost, setSelectedHost] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venueImageIndex, setVenueImageIndex] = useState(0);
    const [promotions, setPromotions] = useState([]);

    // Host contact access state (for sellers)
    const [contactAccess, setContactAccess] = useState({ can_view: false, monthly_limit: 0, remaining: 0 });
    const [unlockedHosts, setUnlockedHosts] = useState({});
    const [unlockLoading, setUnlockLoading] = useState(false);

    useEffect(() => {
        fetchHosts();
        fetchPromotions();
        if (user?.role === 'seller') fetchHostContactAccess();
    }, []);

    const fetchHostContactAccess = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/host_contact_access.php`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
                setContactAccess({
                    can_view: data.can_view_contacts,
                    monthly_limit: data.monthly_limit,
                    remaining: data.remaining
                });
                // Auto-load unlocked host contacts
                if (data.viewed_host_ids?.length > 0) {
                    for (const vid of data.viewed_host_ids) {
                        fetchUnlockedHostContact(vid);
                    }
                }
            }
        } catch (err) {
        }
    };

    const fetchUnlockedHostContact = async (hostId) => {
        try {
            const res = await fetch(`${API_BASE}/users/unlock_host_contact.php?host_id=${hostId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.already_viewed) {
                setUnlockedHosts(prev => ({ ...prev, [hostId]: data.contact }));
            }
        } catch (err) { /* ignore */ }
    };

    const handleUnlockHost = async (hostId) => {
        setUnlockLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/unlock_host_contact.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ host_id: hostId })
            });
            const data = await res.json();
            if (data.success) {
                setUnlockedHosts(prev => ({ ...prev, [hostId]: data.contact }));
                setContactAccess(prev => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
            } else {
                showToast(data.message || t('hostDirectoryPage.unlockFailed'), 'error');
            }
        } catch (err) {
            showToast(t('hostDirectoryPage.errorOccurred'), 'error');
        } finally {
            setUnlockLoading(false);
        }
    };

    const fetchPromotions = async () => {
        try {
            const res = await fetch(`${API_BASE}/promotions/get_promotions.php`);
            const data = await res.json();
            if (data.success) {
                const all = [
                    ...(data.hot_top || []),
                    ...(data.hot_mid || []),
                    ...Object.values(data.category_featured || {}).flat(),
                ];
                setPromotions(all);
            }
        } catch (err) {
        }
    };

    const getPromotionForVenue = (venueId) => {
        return promotions.find(p => parseInt(p.venue_id) === parseInt(venueId));
    };

    const fetchHosts = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/browse_hosts.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) {
                setHosts(data);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    // Extract unique regions and types from all hosts
    const allRegions = useMemo(() => {
        const regions = new Set();
        hosts.forEach(v => v.regions?.forEach(r => regions.add(r)));
        return Array.from(regions).sort();
    }, [hosts]);

    const allTypes = useMemo(() => {
        const types = new Set();
        hosts.forEach(v => v.types?.forEach(tp => types.add(tp)));
        return Array.from(types).sort();
    }, [hosts]);

    // Filtered hosts
    const filteredHosts = useMemo(() => {
        return hosts.filter(host => {
            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = host.name?.toLowerCase().includes(term);
                const emailMatch = host.email?.toLowerCase().includes(term);
                if (!nameMatch && !emailMatch) return false;
            }
            // Region filter
            if (selectedRegion && !(host.regions || []).some(r => r.includes(selectedRegion))) {
                return false;
            }
            // Type filter
            if (selectedType && !(host.types || []).includes(selectedType)) {
                return false;
            }
            return true;
        });
    }, [hosts, searchTerm, selectedRegion, selectedType]);

    const activeFilterCount = [selectedRegion, selectedType].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedRegion('');
        setSelectedType('');
        setSearchTerm('');
    };

    const featuredHosts = useMemo(() => {
        return hosts.filter(v => v.is_featured);
    }, [hosts]);

    const getDdayBadge = (host) => {
        if (host.has_closed) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {t('hostDirectoryPage.recruitDone')}
                </span>
            );
        }
        if (host.nearest_deadline) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadline = new Date(host.nearest_deadline);
            deadline.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        {t('hostDirectoryPage.closed')}
                    </span>
                );
            }
            if (diffDays === 0) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                        <Clock size={9} />
                        D-Day
                    </span>
                );
            }
            if (diffDays <= 3) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                        <Clock size={9} />
                        D-{diffDays}
                    </span>
                );
            }
            if (diffDays <= 7) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200">
                        <Clock size={9} />
                        D-{diffDays}
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
                    <Clock size={9} />
                    D-{diffDays}
                </span>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                            <Building className="text-indigo-600 dark:text-indigo-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">{t('hostDirectoryPage.title')}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('hostDirectoryPage.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('hostDirectoryPage.searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Filter size={16} />
                            {t('hostDirectoryPage.filter')}
                            {activeFilterCount > 0 && (
                                <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('hostDirectoryPage.filterRegion')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <option value="">{t('hostDirectoryPage.filterAllRegions')}</option>
                                        {allRegions.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('hostDirectoryPage.filterVenueType')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <p className="text-sm text-gray-400 italic mt-2">{t('hostDirectoryPage.noRegisteredVenues')}</p>
                                        {allTypes.map(tp => (
                                            <option key={tp} value={tp}>{TYPE_LABELS[tp] || tp}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            {activeFilterCount > 0 && (
                                <div className="md:col-span-2">
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                        <X size={14} /> {t('hostDirectoryPage.filterClear')}</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Featured Hosts Premium Section */}
                {featuredHosts.length > 0 && !searchTerm && !selectedRegion && !selectedType && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-700/40 overflow-hidden shadow-sm">
                            <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2">
                                <Crown size={18} className="text-white" />
                                <span className="text-white font-extrabold text-sm">{t('hostDirectoryPage.premiumHosts')}</span>
                                <span className="text-white/70 text-xs ml-1">{t('hostDirectoryPage.premiumTopExposure')}</span>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featuredHosts.map(host => (
                                        <div
                                            key={`featured-${host.id}`}
                                            onClick={() => setSelectedHost(host)}
                                            className="relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-amber-200 dark:border-amber-700/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute top-3 right-3 z-10">
                                                <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-200/50">
                                                    <Star size={10} fill="white" />
                                                    PREMIUM
                                                </div>
                                            </div>
                                            <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
                                            <div className="p-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-amber-200/50 ring-2 ring-amber-200">
                                                        {host.name?.[0] || 'V'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg truncate">{host.name}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-indigo-600 font-bold">{t('hostDirectoryPage.venueCount', { count: host.venue_count })}</span>
                                                            {host.is_verified ? (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 rounded-full text-[9px] font-extrabold">
                                                                    <BadgeCheck size={9} /> {t('hostDirectoryPage.verified')}
                                                                </span>
                                                            ) : null}
                                                            {getDdayBadge(host)}
                                                        </div>
                                                    </div>
                                                </div>
                                                {host.regions?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {host.regions.slice(0, 2).map((r, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-md text-[10px] font-medium">{r}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ━━ Ad Section ━━ */}
                <div className="mb-5">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('hostDirectoryPage.sponsor')}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdSlot slotId="directory_c" format="card" />
                        <AdSlot slotId="directory_c2" format="card" />
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 font-medium">
                        {t('hostDirectoryPage.totalHosts', { count: filteredHosts.length })}
                    </p>
                </div>

                {/* Host Grid */}
                {filteredHosts.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400">{t('hostDirectoryPage.noResults')}</h3>
                        <p className="text-sm text-gray-400 mt-1">{t('hostDirectoryPage.noResultsHint')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredHosts.map((host, idx) => (
                            <React.Fragment key={host.id}>
                                {idx === 6 && <AdSlot slotId="directory_d" format="card" />}
                                {idx === 12 && <AdSlot slotId="directory_d2" format="card" />}
                                <div
                                    onClick={() => setSelectedHost(host)}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="p-5 pb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                                                {host.name?.[0] || 'V'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate">{host.name}</h3>
                                                    {host.is_featured ? (
                                                        <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                            <Star size={8} fill="white" /> PREMIUM
                                                        </span>
                                                    ) : null}
                                                    {host.is_verified ? (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 rounded-full text-[9px] font-extrabold">
                                                            <BadgeCheck size={9} /> {t('hostDirectoryPage.verified')}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-gray-400 truncate">{isAdmin || unlockedHosts[host.id] ? host.email : '●●●●@●●●●.com'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Store size={15} className="text-indigo-500 flex-shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-400">{t('hostDirectoryPage.registeredVenues')} <span className="font-bold text-indigo-600 dark:text-indigo-400">{host.venue_count}</span></span>
                                        </div>
                                        {host.regions?.length > 0 && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex flex-wrap gap-1.5">
                                                    {host.regions.slice(0, 3).map((r, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-md text-xs font-medium">{r}</span>
                                                    ))}
                                                    {host.regions.length > 3 && (
                                                        <span className="text-xs text-gray-400 self-center">+{host.regions.length - 3}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {host.types?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {host.types.map((tp, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium">
                                                        {TYPE_LABELS[tp] || tp}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 py-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                                        <span className="text-xs text-gray-400">
                                            {t('hostDirectoryPage.joinDate')} {new Date(host.created_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {getDdayBadge(host)}
                                            {(isAdmin || unlockedHosts[host.id]) ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/${user.role}/chat?user=${host.id}`); }}
                                                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                >
                                                    <MessageCircle size={12} /> 채팅
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 flex items-center gap-1"><Lock size={10} /> 연락처</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {/* Detail Modal */}
                {selectedHost && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedHost(null)}>
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                                            {selectedHost.profile_image ? (
                                                <img src={selectedHost.profile_image} alt={selectedHost.name} className="w-full h-full object-cover" />
                                            ) : (
                                                selectedHost.name?.[0] || 'V'
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-extrabold">{selectedHost.name}</h2>
                                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20">
                                                {t('hostDirectoryPage.hostRole')}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedHost(null)} className="text-white/80 hover:text-white p-1">
                                        <X size={22} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto dark:text-gray-200">
                                {/* Host Description */}
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">{t('hostDirectoryPage.hostIntro')}</p>
                                    {selectedHost.description ? (
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedHost.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">{t('hostDirectoryPage.hostIntroEmpty')}</p>
                                    )}
                                </div>

                                {/* Venue Stats */}
                                <div className="flex items-center justify-center gap-8 py-3 border-y border-gray-100 dark:border-gray-700">
                                    <div className="text-center">
                                        <p className="text-2xl font-extrabold text-indigo-600">{selectedHost.venue_count || 0}</p>
                                        <p className="text-xs text-gray-400">{t('hostDirectoryPage.registeredVenues')}</p>
                                    </div>
                                </div>

                                {/* Active Venue List */}
                                {(() => {
                                    const activeVenues = (selectedHost.venues || []).filter(v => v.is_active !== 0);
                                    const pastVenues = (selectedHost.venues || []).filter(v => v.is_active === 0);
                                    return (
                                        <>
                                            {activeVenues.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <Building size={12} />
                                                        {t('hostDirectoryPage.activeVenues')}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {activeVenues.map(venue => {
                                                            const promo = getPromotionForVenue(venue.id);
                                                            return (
                                                                <div
                                                                    key={venue.id}
                                                                    className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50 hover:shadow-md transition-all cursor-pointer group"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedVenue(venue);
                                                                        setVenueImageIndex(0);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{venue.name}</p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                {venue.type && (
                                                                                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium">
                                                                                        {TYPE_LABELS[venue.type] || venue.type}
                                                                                    </span>
                                                                                )}
                                                                                {venue.size && (
                                                                                    <span className="text-xs text-gray-500">{venue.size}</span>
                                                                                )}
                                                                            </div>
                                                                            {venue.location && (
                                                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 truncate">
                                                                                    <MapPin size={10} />
                                                                                    {venue.location}
                                                                                </p>
                                                                            )}
                                                                            {promo && (
                                                                                <button
                                                                                    className="mt-2 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        navigate('/recruitment');
                                                                                    }}
                                                                                >
                                                                                    <Flame size={12} />
                                                                                    {t('hostDirectoryPage.eventOngoing')}
                                                                                    <ExternalLink size={10} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-indigo-500 group-hover:text-indigo-700 transition-colors flex-shrink-0 ml-2">
                                                                            <span className="text-xs font-medium hidden sm:inline">{t('hostDirectoryPage.viewDetail')}</span>
                                                                            <ChevronRight size={16} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Past (Inactive) Venues */}
                                            {pastVenues.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {t('hostDirectoryPage.pastVenues')}
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        {pastVenues.map(venue => (
                                                            <div
                                                                key={venue.id}
                                                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                                                            >
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{venue.name}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {venue.type && (
                                                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium">
                                                                            {TYPE_LABELS[venue.type] || venue.type}
                                                                        </span>
                                                                    )}
                                                                    {venue.location && (
                                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                            <MapPin size={10} />
                                                                            {venue.location}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activeVenues.length === 0 && pastVenues.length === 0 && (
                                                <p className="text-sm text-gray-400 italic">{t('hostDirectoryPage.noRegisteredVenues')}</p>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Active Regions */}
                                {selectedHost.regions?.length > 0 && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <MapPin size={12} />
                                            {t('hostDirectoryPage.activeRegions')}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedHost.regions.map((r, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-medium border border-rose-100 dark:border-rose-800/50">{r}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Space Types */}
                                {selectedHost.types?.length > 0 && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Store size={12} />
                                            {t('hostDirectoryPage.venueTypeStatus')}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedHost.types.map((tp, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium border border-indigo-100 dark:border-indigo-800/50">
                                                    {TYPE_LABELS[tp] || tp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('hostDirectoryPage.contactInfo')}</p>
                                    {isAdmin || unlockedHosts[selectedHost.id] ? (
                                        <>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                    <Mail size={16} className="text-indigo-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t('hostDirectoryPage.email')}</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{isAdmin ? selectedHost.email : (unlockedHosts[selectedHost.id]?.email || selectedHost.email)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                    <Phone size={16} className="text-indigo-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t('hostDirectoryPage.phone')}</p>
                                                        <p className={`text-sm font-medium ${(isAdmin ? selectedHost.phone : unlockedHosts[selectedHost.id]?.phone) ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                            {isAdmin ? (selectedHost.phone || t('hostDirectoryPage.notRegistered')) : (unlockedHosts[selectedHost.id]?.phone || t('hostDirectoryPage.notRegistered'))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Chat button for unlocked hosts */}
                                            <button
                                                onClick={() => navigate(`/${user.role}/chat?user=${selectedHost.id}`)}
                                                className="w-full mt-3 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle size={16} /> 채팅하기
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-5 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 rounded-2xl border border-indigo-500/30 text-center backdrop-blur-sm">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-indigo-400/30">
                                                <Lock size={24} className="text-indigo-300" />
                                            </div>
                                            <p className="text-sm font-bold text-white mb-1">연락처 비공개</p>
                                            <p className="text-xs text-indigo-200/70 mb-4">열람권을 사용하여 연락처를 확인하세요</p>
                                            {contactAccess.can_view ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUnlockHost(selectedHost.id)}
                                                        disabled={unlockLoading || contactAccess.remaining <= 0}
                                                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Eye size={16} />
                                                        {unlockLoading ? '처리 중...' : contactAccess.remaining > 0 ? '연락처 열람' : '월간 횟수 소진'}
                                                    </button>
                                                    <p className="text-xs text-indigo-300/80 mt-2">
                                                        잔여 {contactAccess.remaining} / {contactAccess.monthly_limit}회
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-amber-300 font-bold">열람 권한이 없습니다. 관리자에게 문의하세요.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Business Info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('hostDirectoryPage.businessInfo')}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <Building size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('hostDirectoryPage.businessNo')}</p>
                                                <p className={`text-sm font-medium ${selectedHost.business_no ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                    {selectedHost.business_no ? (isAdmin ? selectedHost.business_no : selectedHost.business_no.slice(0, 3) + '-**-*****') : t('hostDirectoryPage.notRegistered')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <Calendar size={16} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('hostDirectoryPage.joinDate')}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(selectedHost.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Venue Detail Sub-Popup */}
                {selectedVenue && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setSelectedVenue(null)}>
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Venue Image Gallery */}
                            <div className="relative w-full h-56 bg-gray-900">
                                {(() => {
                                    const imgs = (selectedVenue.images || []).map(img =>
                                        img?.startsWith?.('uploads/') ? `/${img}` : img
                                    );
                                    return imgs.length > 0 ? (
                                        <>
                                            <img src={imgs[venueImageIndex]} alt={selectedVenue.name} className="w-full h-full object-contain" />
                                            {imgs.length > 1 && (
                                                <>
                                                    <button onClick={() => setVenueImageIndex(p => (p - 1 + imgs.length) % imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors">
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <button onClick={() => setVenueImageIndex(p => (p + 1) % imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors rotate-180">
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-white text-xs font-medium">
                                                        {venueImageIndex + 1} / {imgs.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <Store size={48} strokeWidth={1} />
                                            <span className="mt-2 text-sm">{t('hostDirectoryPage.noImages')}</span>
                                        </div>
                                    );
                                })()}
                                <button onClick={() => setSelectedVenue(null)} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors z-10">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Venue Info */}
                            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto dark:text-gray-200">
                                {/* Name & Type */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {selectedVenue.type && (
                                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                                                {TYPE_LABELS[selectedVenue.type] || selectedVenue.type}
                                            </span>
                                        )}
                                        {selectedVenue.size && (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold">
                                                {selectedVenue.size}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{selectedVenue.name}</h2>
                                    {selectedVenue.location && (
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                            <MapPin size={14} />
                                            {selectedVenue.location}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                {selectedVenue.price !== undefined && selectedVenue.price !== null && (
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{t('hostDirectoryPage.priceLabel')}</p>
                                        <div className="flex items-end gap-1">
                                            {Number(selectedVenue.price) === 0 ? (
                                                <span className="text-2xl font-bold text-emerald-600">{t('hostDirectoryPage.priceFree')}</span>
                                            ) : (
                                                <>
                                                    <span className="text-2xl font-bold text-indigo-600">{`₩${Number(selectedVenue.price).toLocaleString()}`}</span>
                                                    <span className="text-sm text-gray-400 mb-0.5">
                                                        {selectedVenue.pricing_unit === 'daily' ? t('hostDirectoryPage.priceDaily') : selectedVenue.pricing_unit === 'weekly' ? t('hostDirectoryPage.priceWeekly') : selectedVenue.pricing_unit === 'monthly' ? t('hostDirectoryPage.priceMonthly') : ''}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {parseFloat(selectedVenue.commission_rate) > 0 && (
                                            <p className="text-xs text-orange-600 mt-2 font-medium">{t('hostDirectoryPage.commissionRate', { rate: selectedVenue.commission_rate })}</p>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('hostDirectoryPage.venueIntro')}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {selectedVenue.description || t('hostDirectoryPage.venueIntroEmpty')}
                                    </p>
                                </div>

                                {/* Back to vendor */}
                                <button
                                    onClick={() => setSelectedVenue(null)}
                                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    {t('hostDirectoryPage.backToHost')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default SellerHostDirectory;
