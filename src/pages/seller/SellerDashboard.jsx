import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, Heart, Search, Filter, Sparkles, ChevronDown, ChevronLeft, ChevronRight, Flame, TrendingUp, Eye, Users, X, Map, LayoutGrid, List, Calendar, Paperclip, FileText, Star, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VenueDetailModal from '../../components/VenueDetailModal';
import KakaoMap from '../../components/KakaoMap';
import AdSlot from '../../components/AdSlot';
import { COUNTRY_FLAGS } from '../../components/CountryBadge';

const API_BASE = '/api';

// TYPE_LABELS moved to translation: seller:typeLabels.*

const SellerDashboard = () => {
    const { venues, applyForVenue, applications, wishlist, toggleWishlist } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation('seller');

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);
    const [showMyVenuesOnly, setShowMyVenuesOnly] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showMap, setShowMap] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [countryFilter, setCountryFilter] = useState(user?.country || 'all');
    const [heroIndex, setHeroIndex] = useState(0);
    const trendingRef = useRef(null);
    const hotPromoRef = useRef(null);

    // Promotions from API — separated by type
    const [curatedVenues, setCuratedVenues] = useState([]); // hot_top: 엄선된 모집 정보
    const [hotPromoVenues, setHotPromoVenues] = useState([]); // hot_mid: 핫한 모집
    useEffect(() => {
        fetchHotPlaces();
    }, []);

    // Hero auto-slide (hotPromo venues)
    useEffect(() => {
        if (hotPromoVenues.length <= 1) return;
        const timer = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % hotPromoVenues.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [hotPromoVenues.length]);

    // Auto-open venue from shared URL (?venue=ID)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const venueId = params.get('venue');
        if (venueId && venues && venues.length > 0) {
            const found = venues.find(v => String(v.id) === String(venueId));
            if (found) {
                setSelectedVenue(found);
                // Clean the URL param after opening
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [location.search, venues]);

    const fetchHotPlaces = async () => {
        try {
            const res = await fetch(`${API_BASE}/promotions/get_promotions.php`, { credentials: 'include' });
            if (!res.ok) {
                console.error('레퍼런스 API 응답 오류:', res.status, res.statusText);
                return;
            }
            const text = await res.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (parseErr) {
                console.error('레퍼런스 JSON 파싱 실패:', text.substring(0, 500));
                return;
            }
            if (json.success) {
                const normalize = (arr) => (arr || []).map(v => ({ ...v, id: v.venue_id || v.id }));
                setCuratedVenues(normalize(json.hot_top));
                setHotPromoVenues(normalize(json.hot_mid));
            }
        } catch (err) {
            console.error('레퍼런스 로드 실패:', err);
        }
    };

    const getPricingUnitLabel = (unit) => {
        switch (unit) {
            case 'weekly': return t('pricingUnit.weekly');
            case 'monthly': return t('pricingUnit.monthly');
            default: return t('pricingUnit.daily');
        }
    };

    // Apply Modal State
    const [applyModalVenue, setApplyModalVenue] = useState(null);
    const [applyMessage, setApplyMessage] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [applyFiles, setApplyFiles] = useState([]);
    const [useFasttrack, setUseFasttrack] = useState(false);
    const [fasttrackInfo, setFasttrackInfo] = useState(null); // { hasAccess, auto_apply, monthly_limit, monthly_used }

    // Check if user is a vendor (vendors cannot apply)
    const isVendor = user?.role === 'vendor';
    const isAdminOrSuper = user?.role === 'admin' || user?.role === 'superadmin';

    const handleApply = (venue) => {
        if (isVendor) {
            alert(t('vendorCannotApplyAlert'));
            return;
        }
        setApplyModalVenue(venue);
        setApplyMessage('');
        // Auto-select period if only one exists
        let periods = [];
        if (venue.event_periods) {
            try {
                const parsed = typeof venue.event_periods === 'string' ? JSON.parse(venue.event_periods) : venue.event_periods;
                if (Array.isArray(parsed)) periods = parsed.filter(p => p.start || p.end);
            } catch { }
        }
        setSelectedPeriod(periods.length === 1 ? periods[0] : null);

        // Fetch fast track info for seller
        if (user?.role === 'seller') {
            fetch(`${API_BASE}/users/check_service.php?service=priority_application`, { credentials: 'include' })
                .then(r => r.json())
                .then(info => {
                    setFasttrackInfo(info);
                    setUseFasttrack(info.hasAccess && info.auto_apply === 1);
                })
                .catch(() => { setFasttrackInfo(null); setUseFasttrack(false); });
        }
    };

    const submitApply = async () => {
        if (!applyModalVenue) return;
        setApplyLoading(true);
        try {
            const formData = new FormData();
            formData.append('venue_id', applyModalVenue.id);
            formData.append('venue_name', applyModalVenue.name);
            formData.append('seller_id', user.id);
            formData.append('seller_name', user.name);
            formData.append('message', applyMessage.trim());
            if (selectedPeriod) {
                formData.append('selected_period', JSON.stringify(selectedPeriod));
            }
            applyFiles.forEach(f => formData.append('attachments[]', f));
            if (useFasttrack && fasttrackInfo?.hasAccess) {
                formData.append('use_fasttrack', '1');
            }

            const result = await applyForVenue(formData);
            if (result.success) {
                alert(t('applicationSuccess'));
                setApplyModalVenue(null);
                setApplyFiles([]);
                const role = user?.role;
                if (role === 'admin' || role === 'superadmin') {
                    navigate('/admin/applications');
                } else if (role === 'vendor') {
                    navigate('/vendor/dashboard');
                } else {
                    navigate('/seller/applications');
                }
            } else {
                alert(t('applicationFailed', { message: result.message }));
            }
        } catch (error) {
            console.error("Apply error:", error);
            alert(t('systemError', { message: error.message }));
        } finally {
            setApplyLoading(false);
        }
    };

    const myApplications = applications;

    // Trending venues from API (popularity-based)
    const [trendingVenues, setTrendingVenues] = useState([]);

    useEffect(() => {
        fetchTrendingVenues();
    }, []);

    const fetchTrendingVenues = async () => {
        try {
            const res = await fetch(`${API_BASE}/venues/get_trending.php`, { credentials: 'include' });
            const json = await res.json();
            if (json.success && Array.isArray(json.trending)) {
                setTrendingVenues(json.trending);
            }
        } catch (err) {
            console.error('급상승 공간 로드 실패:', err);
        }
    };

    // Region short-name mapping for flexible filter matching
    const REGION_SHORT = {
        '서울': '서울', '경기': '경기', '인천광역시': '인천',
        '대전광역시': '대전', '대구광역시': '대구', '광주광역시': '광주',
        '부산광역시': '부산', '울산광역시': '울산', '제주특별자치': '제주',
        '강원': '강원'
    };

    // All venues (filtered)
    const filteredVenues = useMemo(() => {
        return venues.filter(venue => {
            const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venue.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || venue.type === filterType;

            // Flexible region matching: match full name, short name, or location text
            let matchesLocation = true;
            if (filterLocation !== 'all') {
                const shortName = REGION_SHORT[filterLocation] || filterLocation;
                matchesLocation = venue.region === filterLocation ||
                    venue.region === shortName ||
                    (venue.location && (venue.location.includes(filterLocation) || venue.location.includes(shortName)));
            }

            let matchesPrice = true;
            const price = parseInt(venue.price);
            if (priceRange === 'low') matchesPrice = price <= 100000;
            if (priceRange === 'mid') matchesPrice = price > 100000 && price <= 300000;
            if (priceRange === 'high') matchesPrice = price > 300000;

            const matchesWishlist = !showWishlistOnly || wishlist.some(w => w.userId === user.email && w.venueId === venue.id);
            const matchesMine = !showMyVenuesOnly || String(venue.owner_id) === String(user.id);

            // Country filter: match venue owner's country
            const matchesCountry = countryFilter === 'all' || venue.owner_country === countryFilter;

            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesWishlist && matchesMine && matchesCountry;
        });
    }, [venues, searchTerm, filterType, filterLocation, priceRange, showWishlistOnly, showMyVenuesOnly, wishlist, user.email, user.id, countryFilter]);

    // Card Components

    const HotPlaceCard = ({ venue }) => {
        const firstImage = venue.images?.[0];
        const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
        return (
            <div
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex-shrink-0 w-72 md:w-80"
                onClick={() => setSelectedVenue(venue)}
            >
                {/* Full-height image with overlay */}
                <div className="relative h-56 md:h-64 bg-gradient-to-br from-gray-800 to-gray-900">
                    {imgSrc ? (
                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store size={48} className="text-gray-600" />
                        </div>
                    )}
                    {/* Multi-layer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* HOT Badge with pulse */}
                    <div className="absolute top-3 left-3">
                        <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-extrabold shadow-lg shadow-orange-500/30">
                            <span className="absolute inset-0 rounded-lg bg-orange-400 animate-ping opacity-20" />
                            <Flame size={13} />
                            HOT
                        </div>
                    </div>

                    {/* Type pill */}
                    {venue.type && (
                        <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md text-white/90 rounded-lg text-[11px] font-semibold border border-white/10">
                                {t(`typeLabels.${venue.type}`, venue.type)}
                            </span>
                        </div>
                    )}

                    {/* Bottom content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {venue.admin_note && (
                            <p className="text-[11px] font-bold text-orange-300 mb-1 flex items-center gap-1 truncate">
                                <Sparkles size={11} />{venue.admin_note}
                            </p>
                        )}
                        <h3 className="text-[15px] font-extrabold text-white mb-1.5 group-hover:text-orange-200 transition-colors truncate drop-shadow-sm">{venue.name}</h3>
                        <div className="flex items-center gap-2.5 text-xs text-white/60">
                            <span className="flex items-center gap-1"><MapPin size={11} />{venue.location?.split(' ').slice(0, 2).join(' ')}</span>
                            {venue.price && (
                                <span className="flex items-center gap-1 text-emerald-300/80 font-semibold">
                                    ₩{Number(venue.price).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TrendingCard = ({ venue }) => {
        const firstImage = venue.images?.[0];
        const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
        const isWishlisted = wishlist.some(w => w.userId === user.email && w.venueId === venue.id);
        return (
            <div
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedVenue(venue)}
            >
                <div className="relative h-40 bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store size={36} className="text-violet-300" />
                        </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white rounded-lg text-xs font-bold shadow">
                        <TrendingUp size={11} />
                        {t('trending')}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(user.email, venue.id); }}
                        className="absolute top-2.5 right-2.5 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                    >
                        <Heart size={14} className={isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400"} />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="font-extrabold text-gray-900 mb-1.5 group-hover:text-violet-600 transition-colors text-sm truncate">{venue.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={11} />{venue.location?.split(' ').slice(0, 2).join(' ')}</span>
                        <span>{t(`typeLabels.${venue.type}`, venue.type)}</span>
                    </div>
                </div>
            </div>
        );
    };

    const VenueCard = ({ venue }) => {
        const isApplied = myApplications.some(app => String(app.venue_id) === String(venue.id) || String(app.venueId) === String(venue.id));
        const isWishlisted = wishlist.some(w => String(w.venueId) === String(venue.id));
        const firstImage = venue.images?.[0];
        const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
        let typeLabel = t(`typeLabels.${venue.type}`, venue.type);

        return (
            <div
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
                <div className="h-52 relative bg-gray-100 overflow-hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <Store size={48} strokeWidth={1} />
                            <span className="text-sm mt-2 font-medium">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-lg">
                        {Number(venue.price) === 0 ? (
                            <span className="text-emerald-600">{t('free')}</span>
                        ) : (
                            <>₩{parseInt(venue.price).toLocaleString()}<span className="text-gray-500 font-normal text-xs ml-1">{getPricingUnitLabel(venue.pricing_unit)}</span></>
                        )}
                        {parseFloat(venue.commission_rate) > 0 && (
                            <span className="block text-[10px] text-orange-500 font-medium mt-0.5">{t('commission', { rate: venue.commission_rate })}</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(user.email, venue.id); }}
                        className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 group-hover:opacity-100"
                    >
                        <Heart size={18} className={`transition-colors ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"}`} />
                    </button>
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/20">
                        {typeLabel}
                    </span>
                    {venue.is_premium ? (
                        <span className="absolute top-14 left-4 inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg text-[10px] font-extrabold text-white shadow-lg">
                            <Star size={10} className="fill-white" /> PREMIUM
                        </span>
                    ) : null}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {venue.is_premium ? <Star size={14} className="inline text-amber-400 fill-amber-400 mr-1" /> : null}
                        {venue.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                        <div className="p-1 bg-gray-50 rounded-full"><MapPin size={14} className="text-gray-400" /></div>
                        <span className="line-clamp-1">{venue.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {venue.description || t('noDescription')}
                    </p>

                    {/* Occupancy Info */}
                    {(() => {
                        const approved = parseInt(venue.approved_count) || 0;
                        const max = parseInt(venue.max_sellers) || 0;
                        const isFull = max > 0 && approved >= max;
                        const isAlmostFull = max > 0 && approved >= max - 1 && !isFull;
                        return (
                            <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-4 text-sm font-bold ${isFull ? 'bg-red-50 text-red-600 border border-red-100'
                                : isAlmostFull ? 'bg-orange-50 text-orange-600 border border-orange-100'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                <span className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    {t('occupancyStatus')}
                                </span>
                                <span>
                                    {approved}{max > 0 ? t('occupancyCount', { max }) : ''}
                                    {isFull && <span className="ml-1.5 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full">{t('closed')}</span>}
                                </span>
                            </div>
                        );
                    })()}

                    {isVendor ? (
                        <div className="w-full py-3 rounded-xl text-sm font-bold text-center bg-gray-100 text-gray-400">
                            {t('vendorCannotApply')}
                        </div>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleApply(venue); }}
                            disabled={isApplied}
                            className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isApplied
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98]'
                                }`}
                        >
                            {isApplied ? (
                                <span className="flex items-center justify-center gap-2"><Sparkles size={16} /> {t('applicationComplete')}</span>
                            ) : t('applyForSpace')}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // List-view row version
    const VenueListItem = ({ venue }) => {
        const isApplied = myApplications.some(app => String(app.venue_id) === String(venue.id) || String(app.venueId) === String(venue.id));
        const isWishlisted = wishlist.some(w => String(w.venueId) === String(venue.id));
        const firstImage = venue.images?.[0];
        const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
        let typeLabel = t(`typeLabels.${venue.type}`, venue.type);
        const approved = parseInt(venue.approved_count) || 0;
        const max = parseInt(venue.max_sellers) || 0;
        const isFull = max > 0 && approved >= max;
        const occupancyPct = max > 0 ? Math.min((approved / max) * 100, 100) : 0;
        const commission = parseFloat(venue.commission_rate) || 0;

        // Type badge color map
        const typeColors = {
            popup: 'from-pink-500 to-rose-500',
            gallery: 'from-violet-500 to-purple-500',
            cafe: 'from-amber-500 to-orange-500',
            flea_market: 'from-emerald-500 to-teal-500',
            showroom: 'from-blue-500 to-cyan-500',
        };
        const badgeGradient = typeColors[venue.type] || 'from-gray-500 to-gray-600';

        return (
            <div
                onClick={() => setSelectedVenue(venue)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 cursor-pointer"
            >
                <div className="flex flex-row items-stretch">
                    {/* Thumbnail */}
                    <div className="w-28 sm:w-36 md:w-44 flex-shrink-0 relative bg-gray-100 overflow-hidden">
                        {imgSrc ? (
                            <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <Store size={28} strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Wishlist heart overlay */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(user.email, venue.id); }}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                            <Heart size={14} className={isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-400'} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-3 sm:p-4 min-w-0 flex flex-col justify-between">
                        {/* Top: Title + Type Badge */}
                        <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`bg-gradient-to-r ${badgeGradient} text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm`}>
                                    {typeLabel}
                                </span>
                                {commission > 0 && (
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100">
                                        {t('commission', { rate: commission })}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors mb-1">
                                {venue.name}
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                                <span className="truncate">{venue.location}</span>
                            </div>
                            {/* Short description */}
                            {venue.description && (
                                <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5 line-clamp-1 leading-relaxed">
                                    {venue.description}
                                </p>
                            )}
                        </div>

                        {/* Bottom: Price + Occupancy + Actions */}
                        <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-3 sm:gap-4">
                                {/* Price */}
                                <div>
                                    {Number(venue.price) === 0 ? (
                                        <span className="text-sm sm:text-base font-bold text-emerald-600">{t('free')}</span>
                                    ) : (
                                        <span className="text-sm sm:text-base font-bold text-gray-900">
                                            ₩{parseInt(venue.price).toLocaleString()}
                                            <span className="text-[10px] text-gray-400 font-normal ml-0.5">{getPricingUnitLabel(venue.pricing_unit)}</span>
                                        </span>
                                    )}
                                </div>

                                {/* Occupancy mini-bar */}
                                {max > 0 && (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Users size={11} className={isFull ? 'text-red-400' : 'text-gray-400'} />
                                            <span className={`text-[10px] font-bold ${isFull ? 'text-red-500' : 'text-gray-500'}`}>
                                                {approved}/{max}
                                            </span>
                                        </div>
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : occupancyPct > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                                style={{ width: `${occupancyPct}%` }}
                                            />
                                        </div>
                                        {isFull && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded">{t('closed')}</span>}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1.5">
                                {!isVendor && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleApply(venue); }}
                                        disabled={isApplied || isFull}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${isApplied
                                            ? 'bg-gray-100 text-gray-400'
                                            : isFull ? 'bg-red-50 text-red-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                                            }`}
                                    >
                                        <p className="text-white/70 text-sm mb-4">{t('spacematchFindSpace')}</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render

    return (
        <div className="space-y-8 pb-20">
            {/* ━━ Ad Section 1: Full-Width Top Banner ━━ */}
            <section className="w-full">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200/60 overflow-hidden">
                    <AdSlot slotId="home_top" format="native" className="!shadow-none !border-none" />
                </div>
            </section>

            {/* ━━ Hero Banner Carousel (핫한 모집) ━━ */}
            {hotPromoVenues.length > 0 ? (
                <section className="relative rounded-3xl overflow-hidden shadow-xl">
                    <div className="relative h-[250px] md:h-[400px] bg-gray-900">
                        {hotPromoVenues.map((venue, i) => {
                            const firstImage = venue.images?.[0];
                            const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
                            return (
                                <div
                                    key={venue.promotion_id || i}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${i === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                    onClick={() => setSelectedVenue(venue)}
                                >
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                            <Store size={64} className="text-white/30" />
                                        </div>
                                    )}
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                                                <Flame size={11} /> HOT
                                            </span>
                                            {venue.type && (
                                                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                                                    {t(`typeLabels.${venue.type}`, venue.type)}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-xl md:text-3xl font-black text-white mb-1.5 line-clamp-1">{venue.name}</h2>
                                        {venue.admin_note && <p className="text-sm text-orange-200 font-medium mb-1 line-clamp-1">{venue.admin_note}</p>}
                                        <div className="flex items-center gap-3 text-white/70 text-sm">
                                            <span className="flex items-center gap-1"><MapPin size={14} />{venue.location?.split(' ').slice(0, 2).join(' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Nav arrows */}
                        {hotPromoVenues.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setHeroIndex(prev => (prev - 1 + hotPromoVenues.length) % hotPromoVenues.length); }}
                                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setHeroIndex(prev => (prev + 1) % hotPromoVenues.length); }}
                                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                        {/* Dot indicators */}
                        {hotPromoVenues.length > 1 && (
                            <div className="absolute bottom-3 right-6 md:right-10 flex gap-1.5 z-10">
                                {hotPromoVenues.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }}
                                        className={`rounded-full transition-all ${i === heroIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                /* Fallback header if no hot places */
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">
                        Find Your Space
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">{t('heroSubtitle')}</p>
                </div>
            )}

            {/* ━━ 🌍 Country Filter Tabs ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
                        <Globe size={20} className="text-indigo-500" />
                        {t('countryFilter')}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <div className="overflow-x-auto -mx-1 px-1 scrollbar-hide">
                    <div className="flex items-center gap-2 pb-2 min-w-max">
                        <button
                            onClick={() => setCountryFilter('all')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${countryFilter === 'all'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            🌍 {t('allCountries')}
                        </button>
                        {Object.entries(COUNTRY_FLAGS).map(([code, info]) => (
                            <button
                                key={code}
                                onClick={() => setCountryFilter(code)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${countryFilter === code
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200'
                                    : code === user?.country
                                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                <span>{info.flag}</span>
                                <span>{i18n.language === 'ko' ? info.name : info.nameEn}</span>
                                {code === user?.country && countryFilter !== code && (
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━ Category Filter Chips ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg md:text-xl font-black text-gray-900">{t('category')}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {[
                        { key: 'all', label: t('allTypes'), icon: <LayoutGrid size={14} /> },
                        { key: 'popup', label: t('popupStore'), icon: <Sparkles size={14} /> },
                        { key: 'fleamarket', label: t('fleamarket'), icon: <Store size={14} /> },
                        { key: 'gallery', label: t('gallery'), icon: <Eye size={14} /> },
                        { key: 'cafe', label: t('cafeRestaurant'), icon: <Store size={14} /> },
                        { key: 'showroom', label: t('showroom'), icon: <Store size={14} /> },
                        { key: 'store', label: t('store'), icon: <Store size={14} /> },
                    ].map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setFilterType(cat.key)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${filterType === cat.key
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ━━ 엄선된 모집 정보 (Horizontal Scroll) ━━ */}
            {curatedVenues.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
                            <Sparkles size={18} />
                            <h2 className="text-lg font-black">{t('curatedRecruitment')}</h2>
                        </div>
                        <p className="text-sm text-gray-400 font-medium hidden md:block">{t('curatedDesc')}</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" />
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => hotPromoRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => hotPromoRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <div ref={hotPromoRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth">
                        {curatedVenues.map((venue, i) => (
                            <HotPlaceCard key={venue.promotion_id || i} venue={venue} />
                        ))}
                    </div>
                </section>
            )}

            {/* ━━ Ad Section 2: Two Ads Side by Side ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('recommendedAds')}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdSlot slotId="home_a" format="card" />
                    <AdSlot slotId="home_a2" format="card" />
                </div>
            </section>

            {/* ━━ 급상승 공간 (Horizontal Scroll) ━━ */}
            {trendingVenues.length > 0 && !showWishlistOnly && (
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">
                            <TrendingUp size={18} />
                            <h2 className="text-lg font-black">{t('trendingSpaces')}</h2>
                        </div>
                        <p className="text-sm text-gray-400 font-medium hidden md:block">{t('trendingDesc')}</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
                        {/* Scroll arrows */}
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => trendingRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => trendingRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <div ref={trendingRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth">
                        {trendingVenues.map((venue) => (
                            <div key={venue.id} className="flex-shrink-0 w-64 md:w-72">
                                <TrendingCard venue={venue} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ━━ Ad Section 3: Four Ads Grid ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('sponsor')}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <AdSlot slotId="home_b" format="card" />
                    <AdSlot slotId="home_b2" format="card" />
                    <AdSlot slotId="home_b3" format="card" />
                    <AdSlot slotId="home_b4" format="card" />
                </div>
            </section>

            {/* ━━ 지도로 보기 ━━ */}
            {!showWishlistOnly && (
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-lg ${showMap
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <Map size={18} />
                            {t('mapViewLabel')}
                        </button>
                        {showMap && (
                            <span className="text-sm text-gray-400 font-medium hidden md:block">{t('mapHint')}</span>
                        )}
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
                    </div>
                    {showMap && (
                        <KakaoMap
                            venues={filteredVenues}
                            height="450px"
                            onMarkerClick={(venue) => setSelectedVenue(venue)}
                            className="mb-2"
                        />
                    )}
                </section>
            )}


            {/* ━━ 모든 공간 ━━ */}
            <section>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-xl">
                        <Eye size={18} />
                        <h2 className="text-base sm:text-lg font-black">{t('allSpaces')}</h2>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{filteredVenues.length}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent hidden sm:block" />
                    {/* 찜 모아보기 */}
                    <button
                        onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${showWishlistOnly
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-[1.02]'
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:shadow-md'
                            }`}
                    >
                        <Heart size={14} className={`transition-all duration-300 ${showWishlistOnly ? 'fill-white scale-110' : ''}`} fill={showWishlistOnly ? 'currentColor' : 'none'} />
                        <span className="hidden sm:inline">{t('favoritesView')}</span>
                        <span className="sm:hidden">{t('favoritesShort')}</span>
                        {showWishlistOnly && (
                            <span className="bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">ON</span>
                        )}
                    </button>
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title={t('gridViewTitle')}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title={t('listViewTitle')}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 flex flex-col gap-2 sm:gap-3 sticky top-4 z-30 transition-all mb-6">
                    <div className="relative w-full">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                            <Search size={15} />
                        </div>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholderFull')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 bg-transparent text-gray-700 placeholder-gray-400 font-medium text-sm sm:text-base"
                        />
                    </div>
                    <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 w-full">
                        <div className="relative group">
                            <Filter className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={14} />
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                className="w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                <option value="all">{t('spaceType')}</option>
                                <option value="popup">{t('popupStore')}</option>
                                <option value="fleamarket">{t('fleamarket')}</option>
                                <option value="gallery">{t('gallery')}</option>
                                <option value="cafe">{t('cafeRestaurant')}</option>
                                <option value="showroom">{t('showroom')}</option>
                            </select>
                            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>
                        <div className="relative group">
                            <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={14} />
                            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                                className="w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                <option value="all">{t('region')}</option>
                                <option value="서울특별시">{t('regionSeoul')}</option>
                                <option value="경기도">{t('regionGyeonggi')}</option>
                                <option value="인천광역시">{t('regionIncheon')}</option>
                                <option value="대전광역시">{t('regionDaejeon')}</option>
                                <option value="대구광역시">{t('regionDaegu')}</option>
                                <option value="광주광역시">{t('regionGwangju')}</option>
                                <option value="울산광역시">{t('regionUlsan')}</option>
                                <option value="부산광역시">{t('regionBusan')}</option>
                                <option value="제주특별자치도">{t('regionJeju')}</option>
                                <option value="강원도">{t('regionGangwon')}</option>
                            </select>
                            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>
                        <div className="relative group">
                            <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₩</span>
                            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full pl-7 sm:pl-9 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                <option value="all">{t('priceRangeLabel')}</option>
                                <option value="low">{t('priceLow')}</option>
                                <option value="mid">{t('priceMid')}</option>
                                <option value="high">{t('priceHigh')}</option>
                            </select>
                            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>
                        {isVendor && (
                            <button
                                onClick={() => setShowMyVenuesOnly(!showMyVenuesOnly)}
                                className={`col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${showMyVenuesOnly
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200'
                                    }`}
                            >
                                <Store size={14} />
                                {t('myVenues')}</button>
                        )}
                    </div>
                </div>

                {/* Venues Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVenues.map((venue, idx) => (
                            <React.Fragment key={venue.id}>
                                <VenueCard venue={venue} />
                                {idx === 3 && <div className="col-span-full"><AdSlot slotId="home_d" format="native" /></div>}
                                {idx === 7 && <div className="col-span-full"><AdSlot slotId="home_e" format="native" /></div>}
                            </React.Fragment>
                        ))}
                        {filteredVenues.length === 0 && (
                            <div className="col-span-full py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noMatchingVenues')}</h3>
                                <p className="text-gray-500">{t('tryOtherFilters')}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredVenues.map((venue, idx) => (
                            <React.Fragment key={venue.id}>
                                <VenueListItem venue={venue} />
                                {idx === 3 && <AdSlot slotId="home_d" format="native" />}
                                {idx === 7 && <AdSlot slotId="home_e" format="native" />}
                            </React.Fragment>
                        ))}
                        {filteredVenues.length === 0 && (
                            <div className="py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noMatchingVenues')}</h3>
                                <p className="text-gray-500">{t('tryOtherFilters')}</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ━━ Ad Section: Bottom ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('recommended')}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <AdSlot slotId="home_f" format="banner" />
            </section>

            {/* Detail Modal */}
            {selectedVenue && (
                <VenueDetailModal
                    venue={selectedVenue}
                    onClose={() => setSelectedVenue(null)}
                    onApply={(v) => {
                        handleApply(v);
                        if (!isVendor) setSelectedVenue(null);
                    }}
                    onToggleWishlist={(id) => toggleWishlist(user.email, id)}
                    isApplied={myApplications.some(app => String(app.venue_id) === String(selectedVenue.id) || String(app.venueId) === String(selectedVenue.id))}
                    isWishlisted={wishlist.some(w => String(w.venueId) === String(selectedVenue.id))}
                    getPricingUnitLabel={getPricingUnitLabel}
                    isVendor={isVendor}
                />
            )}
            {/* Apply Modal with Message Input */}
            {applyModalVenue && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setApplyModalVenue(null)}>
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-extrabold">{t('applyModalTitle')}</h3>
                                    <p className="text-indigo-200 text-sm mt-1">{applyModalVenue.name}</p>
                                </div>
                                <button onClick={() => setApplyModalVenue(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Event Period Selection */}
                            {(() => {
                                let periods = [];
                                if (applyModalVenue.event_periods) {
                                    try {
                                        const parsed = typeof applyModalVenue.event_periods === 'string' ? JSON.parse(applyModalVenue.event_periods) : applyModalVenue.event_periods;
                                        if (Array.isArray(parsed)) periods = parsed.filter(p => p.start || p.end);
                                    } catch { }
                                }
                                if (periods.length > 1) {
                                    return (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('eventPeriodLabel')} <span className="text-red-500">*</span></label>
                                            <div className="space-y-2">
                                                {periods.map((p, idx) => {
                                                    const isSelected = selectedPeriod && selectedPeriod.start === p.start && selectedPeriod.end === p.end;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => setSelectedPeriod(p)}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                                }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-indigo-600' : 'border-gray-300'
                                                                }`}>
                                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={14} className={isSelected ? 'text-indigo-600' : 'text-gray-400'} />
                                                                <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                                    {t('periodLabel', { num: idx + 1, start: p.start ? new Date(p.start).toLocaleDateString() : t('periodTbd'), end: p.end ? new Date(p.end).toLocaleDateString() : t('periodTbd') })}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('applyMessageLabel')} <span className="text-gray-400 font-normal">{t('applyMessageOptional')}</span></label>
                                <textarea
                                    value={applyMessage}
                                    onChange={(e) => setApplyMessage(e.target.value)}
                                    placeholder={t('applyMessagePlaceholderLong')}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-sm resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{applyMessage.length}/500</p>
                            </div>
                            {/* Attachments */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('attachmentsLabel')} <span className="text-gray-400 font-normal">{t('applyMessageOptional')}</span></label>
                                <p className="text-xs text-gray-400 mb-2">{t('attachmentsDesc')}</p>
                                {applyFiles.length > 0 && (
                                    <div className="space-y-1.5 mb-2">
                                        {applyFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                                                <FileText size={14} className="text-indigo-500 flex-shrink-0" />
                                                <span className="text-xs font-medium text-indigo-700 flex-1 truncate">{file.name}</span>
                                                <span className="text-[10px] text-indigo-400">{(file.size / 1024).toFixed(0)}KB</span>
                                                <button type="button" onClick={() => setApplyFiles(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 text-red-400 hover:text-red-600"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl text-gray-400 hover:text-indigo-600 cursor-pointer transition-all">
                                    <Paperclip size={14} />
                                    <span className="text-xs font-bold">{t('attachFile')}</span>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'm4v', '3gp', 'mpeg', 'mpg'];
                                            const blocked = files.filter(f => {
                                                const ext = f.name.split('.').pop().toLowerCase();
                                                return videoExts.includes(ext) || f.type.startsWith('video/');
                                            });
                                            if (blocked.length > 0) {
                                                alert(t('videoNotAllowed'));
                                                e.target.value = '';
                                                return;
                                            }
                                            setApplyFiles(prev => [...prev, ...files]);
                                            e.target.value = '';
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {/* Fast Track Option */}
                            {fasttrackInfo?.hasAccess && (() => {
                                const limit = fasttrackInfo.monthly_limit || 0;
                                const used = fasttrackInfo.monthly_used || 0;
                                const remaining = limit > 0 ? limit - used : -1; // -1 = unlimited
                                const isExhausted = limit > 0 && used >= limit;
                                return (
                                    <div className={`p-4 rounded-xl border-2 transition-all ${useFasttrack && !isExhausted ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${useFasttrack && !isExhausted ? 'bg-amber-400 dark:bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                    <Zap size={16} className={useFasttrack && !isExhausted ? 'text-white' : 'text-gray-400 dark:text-gray-500'} fill={useFasttrack && !isExhausted ? 'white' : 'none'} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${useFasttrack && !isExhausted ? 'text-amber-700 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>{t('fasttrackLabel')}</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                        {isExhausted ? t('fasttrackMonthlyExhausted') : limit > 0 ? t('fasttrackMonthlyRemaining', { remaining, used, limit }) : t('fasttrackPriorityReview')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => !isExhausted && setUseFasttrack(!useFasttrack)}
                                                disabled={isExhausted}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${useFasttrack && !isExhausted ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gray-200 dark:bg-gray-600'} ${isExhausted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300" style={{ left: useFasttrack && !isExhausted ? '1.5rem' : '0.125rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setApplyModalVenue(null)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    {t('cancel', { ns: 'common' })}
                                </button>
                                <button
                                    onClick={submitApply}
                                    disabled={applyLoading || (() => {
                                        let periods = [];
                                        try {
                                            const parsed = typeof applyModalVenue.event_periods === 'string' ? JSON.parse(applyModalVenue.event_periods) : applyModalVenue.event_periods;
                                            if (Array.isArray(parsed)) periods = parsed.filter(p => p.start || p.end);
                                        } catch { }
                                        return periods.length > 1 && !selectedPeriod;
                                    })()}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applyLoading ? t('applying') : t('submitApplication')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
