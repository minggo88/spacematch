import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Tag, ShoppingBag, Filter, ChevronDown, ChevronLeft, ChevronRight, X, Users, Instagram, ArrowUpDown, Mail, Phone, Building, Calendar, ImageIcon, Crown, Star, Lock, Eye, BadgeCheck, Heart, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const VendorSellerDirectory = () => {
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

    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    // Contact access control state
    const [contactAccess, setContactAccess] = useState({ can_view: 0, monthly_limit: 0, remaining: 0, viewed_ids: [] });
    const [unlockedContacts, setUnlockedContacts] = useState({});
    const [unlockLoading, setUnlockLoading] = useState(false);
    // Favorites state
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteLoading, setFavoriteLoading] = useState({});
    // View filter
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
            console.error('Failed to load sellers', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contact access permissions
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
            }
        } catch (e) { console.error(e); }
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
            if (viewFilter === 'viewed' && !contactAccess.viewed_ids.includes(seller.id)) return false;
            if (viewFilter === 'favorites' && !favoriteIds.includes(seller.id)) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = seller.name?.toLowerCase().includes(term);
                const categoryMatch = seller.category?.toLowerCase().includes(term);
                const categoryLabelMatch = Object.entries(CATEGORY_LABELS).some(
                    ([key, label]) => key === seller.category && label.toLowerCase().includes(term)
                );
                if (!nameMatch && !categoryMatch && !categoryLabelMatch) return false;
            }
            if (selectedCategory && seller.category !== selectedCategory) return false;
            return true;
        });

        switch (sortBy) {
            case 'newest': result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
            case 'oldest': result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
            case 'name_asc': result.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko')); break;
            case 'name_desc': result.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'ko')); break;
            case 'apps_desc': result.sort((a, b) => (b.app_count || 0) - (a.app_count || 0)); break;
            default: break;
        }
        return result;
    }, [sellers, searchTerm, selectedCategory, sortBy, viewFilter, contactAccess.viewed_ids, favoriteIds]);

    const activeFilterCount = [selectedCategory].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSortBy('newest');
    };

    const getCategoryLabel = (cat) => CATEGORY_LABELS[cat] || cat || t('sellerDirectoryPage.unspecified');
    const getCategoryColor = (cat) => {
        const colors = {
            fashion: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
            beauty: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
            food: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
            living: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            art: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
            stationery: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            digital: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
            activity: 'bg-lime-50 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
            eco: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            pet: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            kids: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
            handmade: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            vintage: 'bg-stone-100 text-stone-600 dark:bg-stone-800/30 dark:text-stone-400',
            perfume: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            book: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
        };
        return colors[cat] || 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-teal-600 dark:text-teal-400" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">{t('sellerDirectoryPage.title')}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('sellerDirectoryPage.subtitle')}</p>
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
                                placeholder={t('sellerDirectoryPage.searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all font-medium dark:text-gray-100 dark:placeholder-gray-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('sellerDirectoryPage.categoryLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100"
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
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('sellerDirectoryPage.sortLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-transparent focus:border-teal-500 outline-none appearance-none font-medium text-sm dark:text-gray-100"
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
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {tab.key === 'favorites' && <Heart size={14} fill={viewFilter === 'favorites' ? 'white' : 'none'} />}
                            {tab.key === 'viewed' && <Eye size={14} />}
                            {tab.label}
                            {tab.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${viewFilter === tab.key ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{tab.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('sellerDirectoryPage.totalSellers', { count: filteredSellers.length })}
                    </p>
                </div>

                {/* Seller Grid */}
                {filteredSellers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.noResults')}</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('sellerDirectoryPage.noResultsHint')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredSellers.map((seller) => (
                            <div
                                key={seller.id}
                                onClick={() => setSelectedSeller(seller)}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className="p-5 pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm overflow-hidden">
                                            {seller.profile_image ? (
                                                <img src={seller.profile_image} alt="seller" className="w-full h-full object-cover" />
                                            ) : (
                                                seller.name?.[0] || 'S'
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate">{seller.name}</h3>
                                                {seller.is_featured ? (
                                                    <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Star size={8} fill="white" /> PREMIUM
                                                    </span>
                                                ) : null}
                                                {seller.is_verified ? (
                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 rounded-full text-[9px] font-extrabold">
                                                        <BadgeCheck size={9} /> {t('sellerDirectoryPage.verified')}
                                                    </span>
                                                ) : null}
                                            </div>
                                            {unlockedContacts[seller.id] ? (
                                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{unlockedContacts[seller.id]?.email}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 truncate" style={{ filter: 'blur(4px)', userSelect: 'none' }}>email@hidden.com</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Tag size={15} className="text-gray-400 flex-shrink-0" />
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`}>
                                            {getCategoryLabel(seller.category)}
                                        </span>
                                    </div>

                                    {seller.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {seller.description}
                                        </p>
                                    )}

                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {t('sellerDirectoryPage.appCount', { count: seller.app_count })}
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {t('sellerDirectoryPage.joinDate')}{new Date(seller.created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleToggleFavorite(e, seller.id)}
                                            disabled={favoriteLoading[seller.id]}
                                            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                                        >
                                            <Heart size={16} className={favoriteIds.includes(seller.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-300 dark:text-gray-600 hover:text-rose-400'} />
                                        </button>
                                        {unlockedContacts[seller.id] ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/vendor/chat?user=${seller.id}`); }}
                                                className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                                            >
                                                <MessageCircle size={12} /> 채팅
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Lock size={10} /> {t('sellerDirectoryPage.contact')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedSeller && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSeller(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 p-6 text-white relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                                <div className="relative flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden ring-2 ring-white/30">
                                            {selectedSeller.profile_image ? (
                                                <img src={selectedSeller.profile_image} alt="" className="w-full h-full object-cover" />
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
                                {/* What they sell */}
                                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                                    <p className="text-xs font-bold text-teal-500 dark:text-teal-400 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.salesInfo')}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag size={16} className="text-teal-600 dark:text-teal-400" />
                                        <span className="text-sm font-bold text-teal-800 dark:text-teal-200">{getCategoryLabel(selectedSeller.category)}</span>
                                    </div>
                                    {selectedSeller.description ? (
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2 whitespace-pre-wrap">{selectedSeller.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-2">{t('sellerDirectoryPage.noBrandIntro')}</p>
                                    )}
                                </div>

                                {/* Product Photos */}
                                {selectedSeller.photos && selectedSeller.photos.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <ImageIcon size={12} />
                                            {t('sellerDirectoryPage.productPhotos')}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedSeller.photos.map((photo, idx) => (
                                                <div key={photo.id || idx}
                                                    className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:ring-2 hover:ring-teal-400 transition-all"
                                                    onClick={() => { setLightboxPhotos(selectedSeller.photos); setLightboxIndex(idx); }}
                                                >
                                                    <img src={photo.image_url?.startsWith?.('uploads/') ? `/${photo.image_url}` : photo.image_url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-center gap-6 py-3 border-y border-gray-100 dark:border-gray-700">
                                    <div className="text-center">
                                        <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{selectedSeller.app_count || 0}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.applicationCount')}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.contactInfo')}</p>
                                    {unlockedContacts[selectedSeller.id] ? (
                                        <>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <Mail size={16} className="text-teal-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.email')}</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{unlockedContacts[selectedSeller.id]?.email || t('sellerDirectoryPage.notRegistered')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <Phone size={16} className="text-teal-400" />
                                                    <div>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.phone')}</p>
                                                        <p className={`text-sm font-medium ${unlockedContacts[selectedSeller.id]?.phone ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 italic'}`}>
                                                            {unlockedContacts[selectedSeller.id]?.phone || t('sellerDirectoryPage.notRegistered')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                                                    <Instagram size={16} className="text-teal-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.instagramLabel')}</p>
                                                        {unlockedContacts[selectedSeller.id]?.instagram ? (
                                                            <a href={`https://instagram.com/${unlockedContacts[selectedSeller.id]?.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors">
                                                                {unlockedContacts[selectedSeller.id]?.instagram}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm font-medium text-gray-400 italic">{t('sellerDirectoryPage.notRegistered')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => navigate(`/vendor/chat?user=${selectedSeller.id}`)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-200/50 dark:shadow-teal-900/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <MessageCircle size={16} /> 채팅하기
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/vendor/proposals?seller=${selectedSeller.id}&name=${encodeURIComponent(selectedSeller.name)}`)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-violet-400 hover:to-purple-400 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Send size={16} /> 유통 제안
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-5 bg-gradient-to-br from-teal-900/80 to-emerald-900/80 rounded-2xl border border-teal-500/30 text-center backdrop-blur-sm">
                                            <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-teal-400/30">
                                                <Lock size={24} className="text-teal-300" />
                                            </div>
                                            <p className="text-sm font-bold text-white mb-1">{t('sellerDirectoryPage.contactLockedTitle')}</p>
                                            <p className="text-xs text-teal-200/70 mb-4">{t('sellerDirectoryPage.contactLockedDesc')}</p>
                                            {contactAccess.can_view ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUnlockContact(selectedSeller.id)}
                                                        disabled={unlockLoading || contactAccess.remaining <= 0}
                                                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Eye size={16} />
                                                        {unlockLoading ? t('sellerDirectoryPage.loadingText') : contactAccess.remaining > 0 ? t('sellerDirectoryPage.unlockContact') : t('sellerDirectoryPage.monthlyExhausted')}
                                                    </button>
                                                    <p className="text-xs text-teal-300/80 mt-2">
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
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('sellerDirectoryPage.businessInfo')}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <Building size={16} className="text-teal-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.businessNo')}</p>
                                                <p className={`text-sm font-medium ${selectedSeller.business_no ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 italic'}`}>
                                                    {selectedSeller.business_no ? selectedSeller.business_no.slice(0, 3) + '-**-*****' : t('sellerDirectoryPage.notRegistered')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <Calendar size={16} className="text-teal-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{t('sellerDirectoryPage.joinDateLabel')}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{new Date(selectedSeller.created_at).toLocaleDateString('ko-KR')}</p>
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

export default VendorSellerDirectory;
