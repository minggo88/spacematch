import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, Heart, Search, Filter, Sparkles, ChevronDown, Flame, TrendingUp, Eye, Users, X, Map, LayoutGrid, List, Calendar } from 'lucide-react';
import VenueDetailModal from '../../components/VenueDetailModal';
import KakaoMap from '../../components/KakaoMap';
import AdSlot from '../../components/AdSlot';

const API_BASE = '/api';

const TYPE_LABELS = {
    popup: '팝업스토어', gallery: '갤러리', cafe: '카페',
    showroom: '쇼룸', fleamarket: '플리마켓', store: '매장'
};

const SellerDashboard = () => {
    const { venues, applyForVenue, applications, wishlist, toggleWishlist } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    // Hot Places from promotions API
    const [hotPlaces, setHotPlaces] = useState([]);

    useEffect(() => {
        fetchHotPlaces();
    }, []);

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
            const res = await fetch(`${API_BASE}/promotions/get_promotions.php`);
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
            console.log('레퍼런스 API 응답:', json);
            if (json.success) {
                // Combine hot_top and hot_mid as "인기 레퍼런스"
                const combined = [...(json.hot_top || []), ...(json.hot_mid || [])];
                // Normalize: ensure `id` is set for card/modal compatibility
                const normalized = combined.map(v => ({
                    ...v,
                    id: v.venue_id || v.id,
                }));
                console.log('레퍼런스 데이터', normalized.length, '건');
                setHotPlaces(normalized);
            }
        } catch (err) {
            console.error('레퍼런스 로드 실패:', err);
        }
    };

    const getPricingUnitLabel = (unit) => {
        switch (unit) {
            case 'weekly': return '/';
            case 'monthly': return '/';
            default: return '/';
        }
    };

    // Apply Modal State
    const [applyModalVenue, setApplyModalVenue] = useState(null);
    const [applyMessage, setApplyMessage] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    // Check if user is a vendor (vendors cannot apply)
    const isVendor = user?.role === 'vendor';
    const isAdminOrSuper = user?.role === 'admin' || user?.role === 'superadmin';

    const handleApply = (venue) => {
        if (isVendor) {
            alert('벤더 계정으로는 입점 신청을 할 수 없습니다.\n셀러 계정으로 로그인해 주세요.');
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
    };

    const submitApply = async () => {
        if (!applyModalVenue) return;
        setApplyLoading(true);
        try {
            const result = await applyForVenue({
                venue_id: applyModalVenue.id,
                venue_name: applyModalVenue.name,
                seller_id: user.id,
                seller_name: user.name,
                message: applyMessage.trim(),
                selected_period: selectedPeriod || null,
                status: 'pending'
            });
            if (result.success) {
                alert('신청이 완료되었습니다!');
                setApplyModalVenue(null);
                const role = user?.role;
                if (role === 'admin' || role === 'superadmin') {
                    navigate('/admin/applications');
                } else if (role === 'vendor') {
                    navigate('/vendor/dashboard');
                } else {
                    navigate('/seller/applications');
                }
            } else {
                alert(`신청에 실패했습니다: ${result.message}`);
            }
        } catch (error) {
            console.error("Apply error:", error);
            alert(`시스템 오류: ${error.message}`);
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
            const res = await fetch(`${API_BASE}/venues/get_trending.php`);
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

            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesWishlist && matchesMine;
        });
    }, [venues, searchTerm, filterType, filterLocation, priceRange, showWishlistOnly, showMyVenuesOnly, wishlist, user.email, user.id]);

    // Card Components

    const HotPlaceCard = ({ venue }) => {
        const firstImage = venue.images?.[0];
        const imgSrc = firstImage?.startsWith?.('uploads/') ? `/${firstImage}` : firstImage;
        return (
            <div
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-200 shadow-lg hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex-shrink-0 w-72 md:w-80"
                onClick={() => setSelectedVenue(venue)}
            >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 z-10" />
                <div className="relative h-44 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Store size={48} className="text-orange-200" />
                        </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-extrabold shadow-lg">
                        <Flame size={12} />
                        HOT
                    </div>
                </div>
                <div className="p-4">
                    {venue.admin_note && (
                        <p className="text-xs font-bold text-orange-600 mb-1.5 flex items-center gap-1 truncate">
                            <Sparkles size={12} />{venue.admin_note}
                        </p>
                    )}
                    <h3 className="text-base font-extrabold text-gray-900 mb-1.5 group-hover:text-orange-600 transition-colors truncate">{venue.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={12} />{venue.location?.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="flex items-center gap-1"><Store size={12} />{TYPE_LABELS[venue.type] || venue.type}</span>
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
                        급상승
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
                        <span>{TYPE_LABELS[venue.type] || venue.type}</span>
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
        let typeLabel = TYPE_LABELS[venue.type] || venue.type;

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
                            <span className="text-emerald-600">무료</span>
                        ) : (
                            <>₩{parseInt(venue.price).toLocaleString()}<span className="text-gray-500 font-normal text-xs ml-1">{getPricingUnitLabel(venue.pricing_unit)}</span></>
                        )}
                        {parseFloat(venue.commission_rate) > 0 && (
                            <span className="block text-[10px] text-orange-500 font-medium mt-0.5">수수료 {venue.commission_rate}%</span>
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
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{venue.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                        <div className="p-1 bg-gray-50 rounded-full"><MapPin size={14} className="text-gray-400" /></div>
                        <span className="line-clamp-1">{venue.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {venue.description || "이 베뉴에 대한 자세한 설명이 없습니다."}
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
                                    입점 현황
                                </span>
                                <span>
                                    {approved}{max > 0 ? ` / ${max}명` : ''}
                                    {isFull && <span className="ml-1.5 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full">마감</span>}
                                </span>
                            </div>
                        );
                    })()}

                    {isVendor ? (
                        <div className="w-full py-3 rounded-xl text-sm font-bold text-center bg-gray-100 text-gray-400">
                            벤더 계정은 신청 불가
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
                                <span className="flex items-center justify-center gap-2"><Sparkles size={16} /> 신청 완료</span>
                            ) : '입점 신청하기'}
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
        let typeLabel = TYPE_LABELS[venue.type] || venue.type;
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
                                        수수료 {commission}%
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
                                        <span className="text-sm sm:text-base font-bold text-emerald-600">무료</span>
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
                                        {isFull && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded">마감</span>}
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
                                        <p className="text-white/70 text-sm mb-4">SpaceMatch가 최적의 공간을 찾아드립니다.</p>
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
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                            Find Your Space
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">당신의 브랜드에 딱 맞는 특별한 베뉴를 찾아보세요</p>
                    </div>
                    <button
                        onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                        className={`group flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 shadow-sm
                            ${showWishlistOnly
                                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500'
                            }`}
                    >
                        <Heart size={20} className={`transition-transform duration-300 ${showWishlistOnly ? 'fill-rose-500' : 'group-hover:scale-110'}`} fill={showWishlistOnly ? "currentColor" : "none"} />
                        <span className="font-semibold">찜한 베뉴 모아보기</span>
                    </button>
                </div>
            </div>


            {hotPlaces.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
                            <Flame size={18} />
                            <h2 className="text-lg font-black">인기 레퍼런스</h2>
                        </div>

                        <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
                        {hotPlaces.map((venue, i) => (
                            <HotPlaceCard key={venue.promotion_id || i} venue={venue} />
                        ))}
                    </div>
                </section>
            )}

            {/* Ad Slot: Dashboard Banner */}
            <AdSlot slotId="home_a" format="banner" />

            {/* ━━ 급상승 공간 ━━ */}
            {trendingVenues.length > 0 && !showWishlistOnly && (
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">
                            <TrendingUp size={18} />
                            <h2 className="text-lg font-black">급상승 공간</h2>
                        </div>
                        <p className="text-sm text-gray-400 font-medium hidden md:block">새롭게 등록되어 떠오르는 공간</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {trendingVenues.map((venue) => (
                            <TrendingCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                </section>
            )}

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
                            지도로 보기
                        </button>
                        {showMap && (
                            <span className="text-sm text-gray-400 font-medium hidden md:block">마커를 클릭하면 베뉴 상세정보를 볼 수 있어요</span>
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

            {/* Ad Slot: Dashboard Banner 2 */}
            <AdSlot slotId="home_b" format="banner" />

            {/* ━━ 모든 공간 ━━ */}
            <section>
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl">
                        <Eye size={18} />
                        <h2 className="text-lg font-black">모든 공간</h2>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{filteredVenues.length}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="그리드 보기"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="리스트 보기"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 flex flex-col md:flex-row gap-3 items-center sticky top-4 z-30 transition-all mb-6">
                    <div className="relative flex-1 w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="찾으시는 지역이나 베뉴 이름을 입력하세요.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-4 py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                        <div className="relative group">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={16} />
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                <option value="all">모든 공간 타입</option>
                                <option value="popup">팝업 스토어</option>
                                <option value="fleamarket">플리마켓</option>
                                <option value="gallery">갤러</option>
                                <option value="cafe">카페/레스토랑</option>
                                <option value="showroom">쇼룸</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative group">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={16} />
                            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                <option value="all">모든 지역</option>
                                <option value="서울특별시">서울</option>
                                <option value="경기도">경기</option>
                                <option value="인천광역시">인천</option>
                                <option value="대전광역시">대전</option>
                                <option value="대구광역시">대구</option>
                                <option value="광주광역시">광주</option>
                                <option value="울산광역시">울산</option>
                                <option value="부산광역시">부산</option>
                                <option value="제주특별자치도">제주</option>
                                <option value="강원도">강원</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif"></span>
                            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                className="pl-9 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                <option value="all">모든 가격대</option>
                                <option value="low">10만원 이하</option>
                                <option value="mid">10~30만원</option>
                                <option value="high">30만원 이상</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                        {isVendor && (
                            <button
                                onClick={() => setShowMyVenuesOnly(!showMyVenuesOnly)}
                                className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${showMyVenuesOnly
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-200'
                                    }`}
                            >
                                <Store size={14} />
                                내 베뉴</button>
                        )}
                    </div>
                </div>

                {/* Venues Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVenues.map(venue => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                        {filteredVenues.length === 0 && (
                            <div className="col-span-full py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">조건에 맞는 베뉴가 없어요</h3>
                                <p className="text-gray-500">다른 키워드나 필터를 시도해보세요!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredVenues.map(venue => (
                            <VenueListItem key={venue.id} venue={venue} />
                        ))}
                        {filteredVenues.length === 0 && (
                            <div className="py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">조건에 맞는 베뉴가 없어요</h3>
                                <p className="text-gray-500">다른 키워드나 필터를 시도해보세요!</p>
                            </div>
                        )}
                    </div>
                )}
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
                                    <h3 className="text-lg font-extrabold">입점 신청</h3>
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
                                            <label className="block text-sm font-bold text-gray-700 mb-2">희망 행사 기간 <span className="text-red-500">*</span></label>
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
                                                                    기간 {idx + 1}: {p.start ? new Date(p.start).toLocaleDateString('ko-KR') : '미정'} ~ {p.end ? new Date(p.end).toLocaleDateString('ko-KR') : '미정'}
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">신청 메시지 <span className="text-gray-400 font-normal">(선택)</span></label>
                                <textarea
                                    value={applyMessage}
                                    onChange={(e) => setApplyMessage(e.target.value)}
                                    placeholder="안녕하세요! 핸드메이드 액세서리를 판매하고 있으며 팝업 경험이 풍부합니다."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-sm resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{applyMessage.length}/500</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setApplyModalVenue(null)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    취소
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
                                    {applyLoading ? '신청 중..' : '신청하기'}
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
