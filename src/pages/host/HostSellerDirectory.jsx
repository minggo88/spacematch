import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Tag, ShoppingBag, Filter, ChevronDown, ChevronLeft, ChevronRight, X, Users, Instagram, ArrowUpDown, Mail, Phone, Building, Calendar, ImageIcon, Crown, Star, Lock, Unlock, Eye, BadgeCheck, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdSlot from '../../components/AdSlot';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const HostSellerDirectory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('host');
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'success') => { setToast({ message, type }); }, []);

    const CATEGORY_LABELS = {
        fashion: t('applicationsPage.catFashion'),
        beauty: t('applicationsPage.catBeauty'),
        food: t('applicationsPage.catFood'),
        living: t('applicationsPage.catLiving'),
        art: t('applicationsPage.catArt'),
        stationery: t('applicationsPage.catStationery'),
        digital: t('applicationsPage.catDigital'),
        activity: t('applicationsPage.catActivity'),
        eco: t('applicationsPage.catEco'),
        pet: t('applicationsPage.catPet'),
        kids: t('applicationsPage.catKids'),
        handmade: t('applicationsPage.catHandmade'),
        vintage: t('applicationsPage.catVintage'),
        perfume: t('applicationsPage.catPerfume'),
        book: t('applicationsPage.catBook')
    };
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    // Contact access control state
    const [contactAccess, setContactAccess] = useState({ can_view: 0, monthly_limit: 0, remaining: 0, viewed_ids: [] });
    const [unlockedContacts, setUnlockedContacts] = useState({}); // { sellerId: { email, phone, instagram, business_no } }
    const [unlockLoading, setUnlockLoading] = useState(false);
    // Favorites state
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteLoading, setFavoriteLoading] = useState({});
    // View filter: 'all' | 'viewed' | 'favorites'
    const [viewFilter, setViewFilter] = useState('all');
    // Lightbox state
    const [lightboxPhotos, setLightboxPhotos] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/browse_sellers.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) {
                setSellers(data);
            }
        } catch (err) {
            console.error(t('sellerDirectoryPage.sellerLoadFailed'), err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contact access permissions + auto-load viewed contacts
    useEffect(() => {
        fetch(`${API_BASE}/users/seller_contact_access.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setContactAccess({
                        can_view: data.can_view_contacts,
                        monthly_limit: data.monthly_limit,
                        remaining: data.remaining,
                        viewed_ids: data.viewed_seller_ids || []
                    });
                    // Auto-load contacts for previously viewed sellers
                    (data.viewed_seller_ids || []).forEach(sid => {
                        fetch(`${API_BASE}/users/unlock_seller_contact.php`, {
                            method: 'POST', credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ seller_id: sid })
                        })
                            .then(r => r.json())
                            .then(d => {
                                if (d.success) setUnlockedContacts(prev => ({ ...prev, [sid]: d.contact }));
                            })
                            .catch(() => { });
                    });
                }
            })
            .catch(() => { });
    }, []);

    // Fetch favorites
    useEffect(() => {
        fetch(`${API_BASE}/users/seller_favorites.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setFavoriteIds(data.favorite_ids || []);
            })
            .catch(() => { });
    }, []);

    // Toggle favorite
    const handleToggleFavorite = useCallback(async (e, sellerId) => {
        e.stopPropagation();
        setFavoriteLoading(prev => ({ ...prev, [sellerId]: true }));
        try {
            const res = await fetch(`${API_BASE}/users/seller_favorites.php`, {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seller_id: sellerId })
            });
            const data = await res.json();
            if (data.success) {
                setFavoriteIds(prev => data.is_favorite ? [...prev, sellerId] : prev.filter(id => id !== sellerId));
            } else {
                showToast(data.message || t('sellerDirectoryPage.actionFailed', '작업을 실패했습니다.'), 'error');
            }
        } catch (e) {
            showToast(t('sellerDirectoryPage.serverError', '서버 통신 오류가 발생했습니다.'), 'error');
            console.error(e);
        }
        finally { setFavoriteLoading(prev => ({ ...prev, [sellerId]: false })); }
    }, []);

    const handleUnlockContact = async (sellerId) => {
        setUnlockLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/unlock_seller_contact.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ seller_id: sellerId })
            });
            const data = await res.json();
            if (data.success) {
                setUnlockedContacts(prev => ({ ...prev, [sellerId]: data.contact }));
                if (!data.already_viewed) {
                    setContactAccess(prev => ({
                        ...prev,
                        remaining: data.remaining,
                        viewed_ids: [...prev.viewed_ids, sellerId]
                    }));
                }
            } else {
                showToast(data.message || t('sellerDirectoryPage.contactLoadFailed'), 'error');
            }
        } catch (err) {
            showToast(t('sellerDirectoryPage.contactLoadFailed'), 'error');
        } finally {
            setUnlockLoading(false);
        }
    };

    // Extract unique categories
    const allCategories = useMemo(() => {
        const cats = new Set();
        sellers.forEach(s => {
            if (s.category) cats.add(s.category);
        });
        return Array.from(cats).sort();
    }, [sellers]);

    // Filtered & sorted sellers
    const filteredSellers = useMemo(() => {
        let result = sellers.filter(seller => {
            // View filter
            if (viewFilter === 'viewed' && !contactAccess.viewed_ids.includes(seller.id)) return false;
            if (viewFilter === 'favorites' && !favoriteIds.includes(seller.id)) return false;
            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = seller.name?.toLowerCase().includes(term);
                const categoryMatch = seller.category?.toLowerCase().includes(term);
                const categoryLabelMatch = Object.entries(CATEGORY_LABELS).some(
                    ([key, label]) => key === seller.category && label.toLowerCase().includes(term)
                );
                const instagramMatch = seller.instagram?.toLowerCase().includes(term);
                if (!nameMatch && !categoryMatch && !categoryLabelMatch && !instagramMatch) return false;
            }
            // Category filter
            if (selectedCategory && seller.category !== selectedCategory) {
                return false;
            }
            return true;
        });

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'name_asc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
                break;
            case 'name_desc':
                result.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'ko'));
                break;
            case 'apps_desc':
                result.sort((a, b) => (b.app_count || 0) - (a.app_count || 0));
                break;
            default:
                break;
        }

        return result;
    }, [sellers, searchTerm, selectedCategory, sortBy, viewFilter, contactAccess.viewed_ids, favoriteIds]);

    const activeFilterCount = [selectedCategory].filter(Boolean).length;

    const featuredSellers = useMemo(() => {
        return sellers.filter(s => s.is_featured);
    }, [sellers]);

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSortBy('newest');
    };

    const getCategoryLabel = (cat) => CATEGORY_LABELS[cat] || cat || t('sellerDirectoryPage.unspecified');
    const getCategoryColor = (cat) => {
        const colors = {
            fashion: 'bg-pink-50 text-pink-600',
            beauty: 'bg-fuchsia-50 text-fuchsia-600',
            food: 'bg-orange-50 text-orange-600',
            living: 'bg-emerald-50 text-emerald-600',
            art: 'bg-violet-50 text-violet-600',
            stationery: 'bg-blue-50 text-blue-600',
            digital: 'bg-cyan-50 text-cyan-600',
            activity: 'bg-lime-50 text-lime-600',
            eco: 'bg-green-50 text-green-600',
            pet: 'bg-amber-50 text-amber-600',
            kids: 'bg-rose-50 text-rose-600',
            handmade: 'bg-yellow-50 text-yellow-600',
            vintage: 'bg-stone-100 text-stone-600',
            perfume: 'bg-purple-50 text-purple-600',
            book: 'bg-sky-50 text-sky-600'
        };
        return colors[cat] || 'bg-gray-50 text-gray-600';
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
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-rose-600" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t('sellerDirectoryPage.title')}</h1>
                            <p className="text-sm text-gray-500">{t('sellerDirectoryPage.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('sellerDirectoryPage.searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Filter size={16} />
                            {t('sellerDirectoryPage.filterSort')}
                            {activeFilterCount > 0 && (
                                <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('sellerDirectoryPage.categoryLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <option value="">{t('sellerDirectoryPage.allCategories')}</option>
                                        {allCategories.map(c => (
                                            <option key={c} value={c}>{getCategoryLabel(c)}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('sellerDirectoryPage.sortLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                    >
                                        <option value="newest">{t('sellerDirectoryPage.sortNewest')}</option>
                                        <option value="oldest">{t('sellerDirectoryPage.sortOldest')}</option>
                                        <option value="name_asc">{t('sellerDirectoryPage.sortNameAsc')}</option>
                                        <option value="name_desc">{t('sellerDirectoryPage.sortNameDesc')}</option>
                                        <option value="apps_desc">{t('sellerDirectoryPage.sortAppsDesc')}</option>
                                    </select>
                                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            {activeFilterCount > 0 && (
                                <div className="md:col-span-2">
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                        <X size={14} /> {t('sellerDirectoryPage.clearFilters')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* View Filter Tabs */}
                <div className="flex items-center gap-2 mb-5">
                    {[
                        { key: 'all', label: t('sellerDirectoryPage.allSellers', '전체 셀러') },
                        { key: 'viewed', label: t('sellerDirectoryPage.viewedSellers', '열람한 셀러'), count: contactAccess.viewed_ids.length },
                        { key: 'favorites', label: t('sellerDirectoryPage.favoriteSellers', '좋아요'), count: favoriteIds.length }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setViewFilter(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewFilter === tab.key
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.key === 'favorites' && <Heart size={14} fill={viewFilter === 'favorites' ? 'white' : 'none'} />}
                            {tab.key === 'viewed' && <Eye size={14} />}
                            {tab.label}
                            {tab.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${viewFilter === tab.key ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Featured Sellers Premium Section */}
                {featuredSellers.length > 0 && !searchTerm && !selectedCategory && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border border-amber-200/60 overflow-hidden shadow-sm">
                            <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2">
                                <Crown size={18} className="text-white" />
                                <span className="text-white font-extrabold text-sm">PREMIUM</span>
                                <span className="text-white/70 text-xs ml-1">{t('sellerDirectoryPage.premiumExposure')}</span>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featuredSellers.map(seller => (
                                        <div
                                            key={`featured-${seller.id}`}
                                            onClick={() => setSelectedSeller(seller)}
                                            className="relative bg-white rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
                                        >
                                            {/* Premium Badge */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-200/50">
                                                    <Star size={10} fill="white" />
                                                    PREMIUM
                                                </div>
                                            </div>

                                            {/* Decorative top bar */}
                                            <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>

                                            <div className="p-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-amber-200/50 overflow-hidden ring-2 ring-amber-200">
                                                        {seller.profile_image ? (
                                                            <img src={seller.profile_image} alt="seller" className="w-full h-full object-cover" />
                                                        ) : (
                                                            seller.name?.[0] || 'S'
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-extrabold text-gray-900 text-lg truncate">{seller.name}</h3>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`}>
                                                                {getCategoryLabel(seller.category)}
                                                            </span>
                                                            {seller.is_verified ? (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold">
                                                                    <BadgeCheck size={9} /> {t('sellerDirectoryPage.verified')}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                {seller.description && (
                                                    <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">{seller.description}</p>
                                                )}
                                                {seller.instagram && (
                                                    <div className="flex items-center gap-1.5 mt-2 text-pink-500">
                                                        <Instagram size={12} />
                                                        <span className="text-xs font-medium">{seller.instagram}</span>
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
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('sellerDirectoryPage.sponsor')}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdSlot slotId="directory_c" format="card" />
                        <AdSlot slotId="directory_c2" format="card" />
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 font-medium">
                        {t('sellerDirectoryPage.totalSellers', { count: filteredSellers.length })} </p>
                </div>

                {/* Seller Grid */}
                {filteredSellers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400">{t('sellerDirectoryPage.noResults')}</h3>
                        <p className="text-sm text-gray-400 mt-1">{t('sellerDirectoryPage.noResultsHint')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredSellers.map((seller, idx) => (
                            <React.Fragment key={seller.id}>
                                {idx === 6 && <AdSlot slotId="directory_d" format="card" />}
                                {idx === 12 && <AdSlot slotId="directory_d2" format="card" />}
                                <div
                                    onClick={() => setSelectedSeller(seller)}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="p-5 pb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm overflow-hidden">
                                                {seller.profile_image ? (
                                                    <img src={seller.profile_image} alt="seller" className="w-full h-full object-cover" />
                                                ) : (
                                                    seller.name?.[0] || 'S'
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900 text-lg truncate">{seller.name}</h3>
                                                    {seller.is_featured ? (
                                                        <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                            <Star size={8} fill="white" /> PREMIUM
                                                        </span>
                                                    ) : null}
                                                    {seller.is_verified ? (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold">
                                                            <BadgeCheck size={9} /> {t('sellerDirectoryPage.verified')}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                {(isAdmin || unlockedContacts[seller.id]) ? (
                                                    <p className="text-xs text-gray-400 truncate">{unlockedContacts[seller.id]?.email || seller.email}</p>
                                                ) : (
                                                    <p className="text-xs text-gray-400 truncate" style={{ filter: 'blur(4px)', userSelect: 'none' }}>{seller.email || 'email@hidden.com'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 space-y-3">
                                        {/* Category */}
                                        <div className="flex items-center gap-2">
                                            <Tag size={15} className="text-gray-400 flex-shrink-0" />
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`}>
                                                {getCategoryLabel(seller.category)}
                                            </span>
                                        </div>

                                        {/* Instagram - Locked */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Instagram size={15} className="text-gray-300 flex-shrink-0" />
                                            <span className="text-gray-400 flex items-center gap-1"><Lock size={12} /> {t('sellerDirectoryPage.contactLocked')}</span>
                                        </div>

                                        {/* Description */}
                                        {seller.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {seller.description}
                                            </p>
                                        )}

                                        {/* App Count */}
                                        <div className="text-xs text-gray-400">
                                            {t('sellerDirectoryPage.appCount', { count: seller.app_count })}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                                        <span className="text-xs text-gray-400">
                                            {t('sellerDirectoryPage.joinDate')}{new Date(seller.created_at).toLocaleDateString('ko-KR')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleToggleFavorite(e, seller.id)}
                                                disabled={favoriteLoading[seller.id]}
                                                className="p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                            >
                                                <Heart size={16} className={favoriteIds.includes(seller.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-300 hover:text-rose-400'} />
                                            </button>
                                            {(isAdmin || unlockedContacts[seller.id]) ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/${user.role}/chat?user=${seller.id}`); }}
                                                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                >
                                                    <MessageCircle size={12} /> 채팅
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 flex items-center gap-1"><Lock size={10} /> {t('sellerDirectoryPage.contact')}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {/* Detail Modal */}
                {selectedSeller && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSeller(null)}>
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Header ??SpaceMatch brand gradient */}
                            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden">
                                {/* Subtle pattern overlay */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                                <div className="relative flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-white/30">
                                            {selectedSeller.profile_image ? (
                                                <img src={selectedSeller.profile_image} alt="셀러" className="w-full h-full object-cover" />
                                            ) : (
                                                selectedSeller.name?.[0] || 'S'
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-extrabold">{selectedSeller.name}</h2>
                                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm">
                                                {getCategoryLabel(selectedSeller.category)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleToggleFavorite(e, selectedSeller.id)}
                                            disabled={favoriteLoading[selectedSeller.id]}
                                            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            <Heart size={22} className={favoriteIds.includes(selectedSeller.id) ? 'text-rose-400 fill-rose-400' : 'text-white/60 hover:text-white'} />
                                        </button>
                                        <button onClick={() => setSelectedSeller(null)} className="text-white/80 hover:text-white p-1 transition-colors">
                                            <X size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {/* What they sell - Most prominent */}
                                <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                    <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.salesInfo')}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag size={16} className="text-violet-600" />
                                        <span className="text-sm font-bold text-violet-800">{getCategoryLabel(selectedSeller.category)}</span>
                                    </div>
                                    {selectedSeller.description ? (
                                        <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">{selectedSeller.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic mt-2">{t('sellerDirectoryPage.noBrandIntro')}</p>
                                    )}
                                </div>

                                {/* Product Photos */}
                                {selectedSeller.photos && selectedSeller.photos.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <ImageIcon size={12} />
                                            {t('sellerDirectoryPage.productPhotos')}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedSeller.photos.map((photo, idx) => (
                                                <div key={photo.id || idx}
                                                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                                                    onClick={() => { setLightboxPhotos(selectedSeller.photos); setLightboxIndex(idx); }}
                                                >
                                                    <img src={photo.image_url?.startsWith?.('uploads/') ? `/${photo.image_url}` : photo.image_url} alt={t('sellerDirectoryPage.productPhotoAlt', { index: idx + 1 })} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-center gap-6 py-3 border-y border-gray-100">
                                    <div className="text-center">
                                        <p className="text-2xl font-extrabold text-indigo-600">{selectedSeller.app_count || 0}</p>
                                        <p className="text-xs text-gray-400">{t('sellerDirectoryPage.applicationCount')}</p>
                                    </div>
                                </div>

                                {/* Contact Info - Admins see everything, hosts need unlock */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.contactInfo')}</p>
                                    {isAdmin || unlockedContacts[selectedSeller.id] ? (
                                        <>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <Mail size={16} className="text-indigo-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t('sellerDirectoryPage.email')}</p>
                                                        <p className="text-sm font-medium text-gray-800">{isAdmin ? (selectedSeller.email || t('sellerDirectoryPage.notRegistered')) : (unlockedContacts[selectedSeller.id]?.email || t('sellerDirectoryPage.notRegistered'))}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <Phone size={16} className="text-indigo-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t('sellerDirectoryPage.phone')}</p>
                                                        <p className={`text-sm font-medium ${(isAdmin ? selectedSeller.phone : unlockedContacts[selectedSeller.id]?.phone) ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                            {isAdmin ? (selectedSeller.phone || t('sellerDirectoryPage.notRegistered')) : (unlockedContacts[selectedSeller.id]?.phone || t('sellerDirectoryPage.notRegistered'))}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                                    <Instagram size={16} className="text-violet-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-400">{t('sellerDirectoryPage.instagramLabel')}</p>
                                                        {(isAdmin ? selectedSeller.instagram : unlockedContacts[selectedSeller.id]?.instagram) ? (
                                                            <a href={`https://instagram.com/${((isAdmin ? selectedSeller.instagram : unlockedContacts[selectedSeller.id]?.instagram) || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                                                                {isAdmin ? selectedSeller.instagram : unlockedContacts[selectedSeller.id]?.instagram}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm font-medium text-gray-400 italic">{t('sellerDirectoryPage.notRegistered')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {(isAdmin || unlockedContacts[selectedSeller.id]) && (unlockedContacts[selectedSeller.id]?.business_no || selectedSeller.business_no) && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                        <Building size={16} className="text-indigo-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-400">{t('sellerDirectoryPage.businessNo')}</p>
                                                            <p className="text-sm font-medium text-gray-800">{unlockedContacts[selectedSeller.id]?.business_no || selectedSeller.business_no}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Chat button for unlocked contacts */}
                                            <button
                                                onClick={() => navigate(`/${user.role}/chat?user=${selectedSeller.id}`)}
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
                                            <p className="text-sm font-bold text-white mb-1">{t('sellerDirectoryPage.contactLockedTitle')}</p>
                                            <p className="text-xs text-indigo-200/70 mb-4">{t('sellerDirectoryPage.contactLockedDesc')}</p>
                                            {contactAccess.can_view ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUnlockContact(selectedSeller.id)}
                                                        disabled={unlockLoading || contactAccess.remaining <= 0}
                                                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Eye size={16} />
                                                        {unlockLoading ? t('sellerDirectoryPage.loadingText') : contactAccess.remaining > 0 ? t('sellerDirectoryPage.unlockContact') : t('sellerDirectoryPage.monthlyExhausted')}
                                                    </button>
                                                    <p className="text-xs text-indigo-300/80 mt-2">
                                                        {t('sellerDirectoryPage.monthlyRemaining', { remaining: contactAccess.remaining, limit: contactAccess.monthly_limit })}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-amber-300 font-bold">{t('sellerDirectoryPage.noPermission')}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Business Info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.businessInfo')}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Building size={16} className="text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('sellerDirectoryPage.businessNo')}</p>
                                                <p className={`text-sm font-medium ${selectedSeller.business_no ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                    {selectedSeller.business_no ? (isAdmin ? selectedSeller.business_no : selectedSeller.business_no.slice(0, 3) + '-**-*****') : t('sellerDirectoryPage.notRegistered')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Calendar size={16} className="text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">{t('sellerDirectoryPage.joinDateLabel')}</p>
                                                <p className="text-sm font-medium text-gray-800">{new Date(selectedSeller.created_at).toLocaleDateString('ko-KR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Lightbox */}
                {lightboxPhotos.length > 0 && (
                    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center" onClick={() => setLightboxPhotos([])}>
                        <button onClick={() => setLightboxPhotos([])} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
                            <X size={28} />
                        </button>
                        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold">{lightboxIndex + 1} / {lightboxPhotos.length}</p>
                        {lightboxIndex > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                                <ChevronLeft size={28} />
                            </button>
                        )}
                        {lightboxIndex < lightboxPhotos.length - 1 && (
                            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                                <ChevronRight size={28} />
                            </button>
                        )}
                        <img
                            src={(() => { const url = lightboxPhotos[lightboxIndex]?.image_url || ''; return url.startsWith?.('uploads/') ? `/${url}` : url; })()}
                            alt=""
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default HostSellerDirectory;
