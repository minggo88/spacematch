import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import Toast from '../components/Toast';
import KakaoMap from '../components/KakaoMap';
import { COUNTRY_FLAGS } from '../components/CountryBadge';
import {
    Flame, MapPin, Calendar, Store, ArrowRight, Search,
    Filter, X, Clock, ChevronDown, ChevronLeft, ChevronRight, Star,
    TrendingUp, Building, Users, Sparkles, Eye, FolderOpen, Heart, Share2, Link2, Check,
    Globe, LayoutGrid, List, Map
} from 'lucide-react';

const API_BASE = '/api';

// TYPE_LABELS moved into component to use t()

// Smart image path helper
const getImgSrc = (imgPath) => {
    if (!imgPath) return null;
    if (typeof imgPath !== 'string') return null;
    if (imgPath.startsWith('/') || imgPath.startsWith('http')) return imgPath;
    return `/${imgPath}`;
};

// getPricingUnitLabel moved into component to use t()

// ─── Region options by country ───
const REGION_OPTIONS_BY_COUNTRY = {
    'ko': [
        { value: '서울특별시', label: '서울' },
        { value: '경기도', label: '경기도' },
        { value: '인천광역시', label: '인천' },
        { value: '대전광역시', label: '대전' },
        { value: '대구광역시', label: '대구' },
        { value: '광주광역시', label: '광주' },
        { value: '울산광역시', label: '울산' },
        { value: '부산광역시', label: '부산' },
        { value: '제주특별자치도', label: '제주' },
        { value: '강원도', label: '강원' },
    ],
    'en': [
        { value: 'New York', label: 'New York' },
        { value: 'California', label: 'California' },
        { value: 'Texas', label: 'Texas' },
        { value: 'Florida', label: 'Florida' },
        { value: 'Illinois', label: 'Illinois' },
        { value: 'Washington', label: 'Washington' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Massachusetts', label: 'Massachusetts' },
        { value: 'Pennsylvania', label: 'Pennsylvania' },
        { value: 'Nevada', label: 'Nevada' },
        { value: 'Hawaii', label: 'Hawaii' },
    ],
    'en-GB': [
        { value: 'London', label: 'London' },
        { value: 'Manchester', label: 'Manchester' },
        { value: 'Birmingham', label: 'Birmingham' },
        { value: 'Edinburgh', label: 'Edinburgh' },
        { value: 'Glasgow', label: 'Glasgow' },
        { value: 'Liverpool', label: 'Liverpool' },
        { value: 'Bristol', label: 'Bristol' },
        { value: 'Cardiff', label: 'Cardiff' },
        { value: 'Belfast', label: 'Belfast' },
        { value: 'Leeds', label: 'Leeds' },
    ],
    'en-CA': [
        { value: 'Ontario', label: 'Ontario' },
        { value: 'British Columbia', label: 'British Columbia' },
        { value: 'Quebec', label: 'Quebec' },
        { value: 'Alberta', label: 'Alberta' },
        { value: 'Manitoba', label: 'Manitoba' },
        { value: 'Saskatchewan', label: 'Saskatchewan' },
        { value: 'Nova Scotia', label: 'Nova Scotia' },
    ],
    'fr-CA': [
        { value: 'Ontario', label: 'Ontario' },
        { value: 'Colombie-Britannique', label: 'Colombie-Britannique' },
        { value: 'Québec', label: 'Québec' },
        { value: 'Alberta', label: 'Alberta' },
        { value: 'Manitoba', label: 'Manitoba' },
        { value: 'Saskatchewan', label: 'Saskatchewan' },
        { value: 'Nouvelle-Écosse', label: 'Nouvelle-Écosse' },
    ],
    'ja': [
        { value: '東京都', label: '東京都' },
        { value: '大阪府', label: '大阪府' },
        { value: '京都府', label: '京都府' },
        { value: '北海道', label: '北海道' },
        { value: '愛知県', label: '愛知県' },
        { value: '福岡県', label: '福岡県' },
        { value: '神奈川県', label: '神奈川県' },
        { value: '兵庫県', label: '兵庫県' },
        { value: '広島県', label: '広島県' },
        { value: '沖縄県', label: '沖縄県' },
    ],
    'vi': [
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'TP. Hồ Chí Minh', label: 'TP. HCM' },
        { value: 'Đà Nẵng', label: 'Đà Nẵng' },
        { value: 'Hải Phòng', label: 'Hải Phòng' },
        { value: 'Cần Thơ', label: 'Cần Thơ' },
        { value: 'Nha Trang', label: 'Nha Trang' },
        { value: 'Huế', label: 'Huế' },
        { value: 'Đà Lạt', label: 'Đà Lạt' },
        { value: 'Vũng Tàu', label: 'Vũng Tàu' },
    ],
    'th': [
        { value: 'กรุงเทพมหานคร', label: 'กรุงเทพฯ' },
        { value: 'เชียงใหม่', label: 'เชียงใหม่' },
        { value: 'ภูเก็ต', label: 'ภูเก็ต' },
        { value: 'พัทยา', label: 'พัทยา' },
        { value: 'เชียงราย', label: 'เชียงราย' },
        { value: 'ขอนแก่น', label: 'ขอนแก่น' },
        { value: 'สงขลา', label: 'สงขลา' },
    ],
    'km': [
        { value: 'ភ្នំពេញ', label: 'ភ្នំពេញ' },
        { value: 'សៀមរាប', label: 'សៀមរាប' },
        { value: 'បាត់ដំបង', label: 'បាត់ដំបង' },
        { value: 'ព្រះសីហនុ', label: 'ព្រះសីហនុ' },
        { value: 'កំពង់ចាម', label: 'កំពង់ចាម' },
        { value: 'កំពត', label: 'កំពត' },
    ],
    'ru': [
        { value: 'Москва', label: 'Москва' },
        { value: 'Санкт-Петербург', label: 'С.-Петербург' },
        { value: 'Новосибирск', label: 'Новосибирск' },
        { value: 'Екатеринбург', label: 'Екатеринбург' },
        { value: 'Казань', label: 'Казань' },
        { value: 'Владивосток', label: 'Владивосток' },
        { value: 'Сочи', label: 'Сочи' },
    ],
    'uk': [
        { value: 'Київ', label: 'Київ' },
        { value: 'Харків', label: 'Харків' },
        { value: 'Одеса', label: 'Одеса' },
        { value: 'Дніпро', label: 'Дніпро' },
        { value: 'Львів', label: 'Львів' },
        { value: 'Запоріжжя', label: 'Запоріжжя' },
        { value: 'Вінниця', label: 'Вінниця' },
    ],
};

const getRegionOptions = (code) => {
    if (!code || code === 'all') return REGION_OPTIONS_BY_COUNTRY['ko'];
    return REGION_OPTIONS_BY_COUNTRY[code] || REGION_OPTIONS_BY_COUNTRY['ko'];
};

const RecruitmentDashboard = () => {
    const { t, i18n } = useTranslation('venue');
    const [data, setData] = useState({ hot_top: [], hot_mid: [], category_featured: {}, all: [] });
    const [allVenues, setAllVenues] = useState([]);
    const [trendingVenues, setTrendingVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [toast, setToast] = useState(null);
    const [heroIndex, setHeroIndex] = useState(0);
    const [countryFilter, setCountryFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('latest');
    const [showMap, setShowMap] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    // Get region options for the selected country
    const regionOptions = useMemo(() => getRegionOptions(countryFilter), [countryFilter]);

    // Reset location filter when country changes
    useEffect(() => { setFilterLocation('all'); }, [countryFilter]);

    const trendingRef = useRef(null);
    const hotPromoRef = useRef(null);
    const { user } = useAuth();
    const location = useLocation();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const TYPE_LABELS = {
        popup: t('spaceType.popup'), gallery: t('spaceType.gallery'), cafe: t('spaceType.cafe'),
        showroom: t('spaceType.showroom'), fleamarket: t('spaceType.fleamarket'), store: t('spaceType.store')
    };

    const getPricingUnitLabel = (unit) => {
        switch (unit) {
            case 'weekly': return t('perWeek');
            case 'monthly': return t('perMonth');
            default: return t('perDay');
        }
    };

    useEffect(() => { window.scrollTo(0, 0); fetchData(); fetchAllVenues(); fetchTrendingVenues(); }, []);

    // Hero auto-slide
    const hotPromoVenues = useMemo(() => (data.hot_mid || []).map(v => ({ ...v, id: v.venue_id || v.id })), [data.hot_mid]);
    const curatedVenues = useMemo(() => (data.hot_top || []).map(v => ({ ...v, id: v.venue_id || v.id })), [data.hot_top]);
    useEffect(() => {
        if (hotPromoVenues.length <= 1) return;
        const timer = setInterval(() => setHeroIndex(prev => (prev + 1) % hotPromoVenues.length), 5000);
        return () => clearInterval(timer);
    }, [hotPromoVenues.length]);

    // Auto-open venue from shared URL (?venue=ID)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const venueId = params.get('venue');
        if (venueId && allVenues.length > 0) {
            const found = allVenues.find(v => String(v.id) === String(venueId));
            if (found) {
                setSelectedVenue(found);
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [location.search, allVenues]);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/promotions/get_promotions.php`);
            const json = await res.json();
            if (json.success) {
                setData({ hot_top: json.hot_top || [], hot_mid: json.hot_mid || [], category_featured: json.category_featured || {}, all: json.all || [] });
            }
        } catch (err) {
            console.error('Recruitment data load failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllVenues = async () => {
        try {
            const res = await fetch(`${API_BASE}/venues/get_venues.php`);
            const json = await res.json();
            // API returns plain array directly, not {success, venues}
            if (Array.isArray(json)) {
                setAllVenues(json);
            } else if (json.success && Array.isArray(json.venues)) {
                setAllVenues(json.venues);
            }
        } catch (err) {
            console.error('Venue list load failed:', err);
        }
    };

    const fetchTrendingVenues = async () => {
        try {
            const res = await fetch(`${API_BASE}/venues/get_trending.php`);
            const json = await res.json();
            if (json.success && Array.isArray(json.trending)) {
                setTrendingVenues(json.trending);
            }
        } catch (err) {
            console.error('Trending venues load failed:', err);
        }
    };

    const getDday = (deadline) => {
        if (!deadline) return null;
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: t('closed'), color: 'bg-gray-500', urgent: false };
        if (diff === 0) return { text: 'D-DAY', color: 'bg-red-500', urgent: true };
        if (diff <= 3) return { text: `D-${diff}`, color: 'bg-red-500', urgent: true };
        if (diff <= 7) return { text: `D-${diff}`, color: 'bg-orange-500', urgent: false };
        return { text: `D-${diff}`, color: 'bg-blue-500', urgent: false };
    };

    // Use allVenues for the main grid (same as SellerDashboard)
    const displayVenues = allVenues.length > 0 ? allVenues : data.all;

    const filteredVenues = useMemo(() => {
        const filtered = displayVenues.filter(v => {
            const name = v.name || '';
            const loc = v.location || '';
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || v.type === filterType;
            const matchesLocation = filterLocation === 'all' || v.region === filterLocation || loc.includes(filterLocation);
            const matchesCountry = countryFilter === 'all' || v.owner_country === countryFilter;

            let matchesPrice = true;
            const price = parseInt(v.price) || 0;
            if (priceRange === 'low') matchesPrice = price <= 100000;
            if (priceRange === 'mid') matchesPrice = price > 100000 && price <= 300000;
            if (priceRange === 'high') matchesPrice = price > 300000;

            return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesCountry;
        });
        const sorted = [...filtered];
        if (sortOrder === 'priceAsc') sorted.sort((a, b) => (parseInt(a.price) || 0) - (parseInt(b.price) || 0));
        else if (sortOrder === 'priceDesc') sorted.sort((a, b) => (parseInt(b.price) || 0) - (parseInt(a.price) || 0));
        else if (sortOrder === 'popular') sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        else sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return sorted;
    }, [displayVenues, searchTerm, filterType, filterLocation, priceRange, countryFilter, sortOrder]);

    // Country stats
    const countryStats = useMemo(() => {
        const target = countryFilter === 'all' ? displayVenues : displayVenues.filter(v => v.owner_country === countryFilter);
        const totalCount = target.length;
        const prices = target.map(v => parseInt(v.price) || 0).filter(p => p > 0);
        const avgPrice = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;
        const activeCount = target.filter(v => {
            const cur = parseInt(v.current_sellers) || 0;
            const max = parseInt(v.max_sellers) || 0;
            return max === 0 || cur < max;
        }).length;
        return { totalCount, avgPrice, activeCount };
    }, [displayVenues, countryFilter]);

    // Card Components (matching SellerDashboard style)

    const HotPlaceCard = ({ venue }) => {
        const firstImage = venue.images?.[0];
        const imgSrc = getImgSrc(firstImage);
        const dday = getDday(venue.recruitment_deadline);
        const typeLabel = TYPE_LABELS[venue.type] || venue.type;
        const [liked, setLiked] = useState(false);
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
                    {dday && (
                        <div className={`absolute top-3 right-3 px-2.5 py-1 ${dday.color} text-white rounded-lg text-xs font-extrabold shadow-lg ${dday.urgent ? 'animate-pulse' : ''}`}>
                            {dday.text}
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {/* 2. Type Label */}
                    <span className="inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
                        <Store size={11} />{typeLabel}
                    </span>
                    {/* 3. Title */}
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors truncate">{venue.name}</h3>
                    {/* 4. Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                        <span className="truncate">{venue.location?.split(' ').slice(0, 2).join(' ') || t('locationTBD')}</span>
                    </div>
                    {/* 5. Deadline */}
                    {venue.recruitment_deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={12} className="flex-shrink-0 text-gray-400" />
                            <span>{t('recruitmentDeadline', { date: venue.recruitment_deadline })}</span>
                            {dday && <span className={`ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`}>{dday.text}</span>}
                        </div>
                    )}
                    {/* 6. Action Buttons */}
                    <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-50">
                        {user ? (
                            <Link
                                to={user.role === 'seller' ? '/seller' : user.role === 'host' ? '/host' : '/admin'}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors"
                            >
                                {t('apply')}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors"
                            >
                                {t('apply')}
                            </Link>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                            className={`p-2 rounded-lg border transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400 hover:border-red-200'}`}
                            title={t('like')}
                        >
                            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.venue_id || venue.id}`;
                                try { await navigator.clipboard.writeText(shareUrl); showToast(t('linkCopied')); } catch { /* ignored */ }
                            }}
                            className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors"
                            title={t('share')}
                        >
                            <Share2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const TrendingCard = ({ venue }) => {
        const firstImage = venue.images?.[0];
        const imgSrc = getImgSrc(firstImage);
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
        const firstImage = venue.images?.[0];
        const imgSrc = getImgSrc(firstImage);
        const typeLabel = TYPE_LABELS[venue.type] || venue.type;
        const dday = getDday(venue.recruitment_deadline);
        const [liked, setLiked] = useState(false);

        return (
            <div
                onClick={() => setSelectedVenue(venue)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
                {/* Image */}
                <div className="h-48 relative bg-gray-100 overflow-hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <Store size={48} strokeWidth={1} />
                            <span className="text-sm mt-2 font-medium">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Type badge on image */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/20">
                        {typeLabel}
                    </span>
                    {/* D-Day badge on image */}
                    {dday && (
                        <span className={`absolute top-3 right-3 px-2.5 py-1 ${dday.color} text-white rounded-lg text-xs font-extrabold shadow-lg ${dday.urgent ? 'animate-pulse' : ''}`}>
                            {dday.text}
                        </span>
                    )}
                    {/* Price badge */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-lg">
                        {Number(venue.price) === 0 ? (
                            <span className="text-emerald-600">{t('free')}</span>
                        ) : (
                            <>₩{parseInt(venue.price).toLocaleString()}<span className="text-gray-500 font-normal text-xs ml-1">{getPricingUnitLabel(venue.pricing_unit)}</span></>
                        )}
                    </div>
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-1.5">
                    {/* 2. Type Label */}
                    <span className="inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                        <Store size={11} />{typeLabel}
                    </span>
                    {/* 3. Title */}
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{venue.name}</h3>
                    {/* 4. Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{venue.location || t('locationTBD')}</span>
                    </div>
                    {/* 5. Recruitment Deadline */}
                    {venue.recruitment_deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={12} className="flex-shrink-0 text-gray-400" />
                            <span>{t('recruitmentDeadline', { date: venue.recruitment_deadline })}</span>
                            {dday && <span className={`ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`}>{dday.text}</span>}
                        </div>
                    )}
                    {/* Spacer */}
                    <div className="flex-1" />
                    {/* 6. Action Buttons */}
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                        {user ? (
                            <Link
                                to={user.role === 'seller' ? '/seller' : user.role === 'host' ? '/host' : '/admin'}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold text-center hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                            >
                                {t('applyForEntry')}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold text-center hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                            >
                                {t('applyForEntry')}
                            </Link>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                            className={`p-2.5 rounded-xl border transition-all ${liked ? 'bg-red-50 border-red-200 text-red-500 shadow-sm' : 'bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200'}`}
                            title={t('like')}
                        >
                            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.id || venue.venue_id}`;
                                try { await navigator.clipboard.writeText(shareUrl); showToast(t('linkCopied')); } catch { /* ignored */ }
                            }}
                            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-all"
                            title={t('share')}
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Detail Modal (public version)
    const VenueDetailModal = ({ venue, onClose }) => {
        if (!venue) return null;
        const dday = getDday(venue.recruitment_deadline);
        const firstImage = venue.images?.[0];
        const imgSrc = getImgSrc(firstImage);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </button>

                    {/* Image */}
                    {imgSrc ? (
                        <div className="relative h-52 md:h-64 overflow-hidden rounded-t-3xl">
                            <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover" />
                            {dday && (
                                <div className={`absolute top-4 left-4 px-3 py-1 ${dday.color} text-white rounded-lg text-sm font-bold shadow-lg`}>
                                    {dday.text}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-40 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-t-3xl flex items-center justify-center">
                            <Store size={48} className="text-indigo-300" />
                        </div>
                    )}

                    <div className="p-6">
                        {venue.admin_note && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl mb-4">
                                <Sparkles size={14} className="text-orange-500 flex-shrink-0" />
                                <p className="text-sm font-semibold text-orange-700">{venue.admin_note}</p>
                            </div>
                        )}

                        <h2 className="text-2xl font-black text-gray-900 mb-3">{venue.name}</h2>

                        <div className="space-y-2 mb-5">
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                {venue.location || t('locationTBD')}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <Store size={16} className="text-gray-400 flex-shrink-0" />
                                {TYPE_LABELS[venue.type] || venue.type || t('typeTBD')}
                            </p>
                            {venue.size && (
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building size={16} className="text-gray-400 flex-shrink-0" />
                                    {venue.size}
                                </p>
                            )}
                            {venue.price && Number(venue.price) > 0 && (
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="text-gray-400 flex-shrink-0 font-bold text-sm"></span>
                                    ₩{parseInt(venue.price).toLocaleString()}{getPricingUnitLabel(venue.pricing_unit)}
                                </p>
                            )}
                            {parseFloat(venue.commission_rate) > 0 && (
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="text-gray-400 flex-shrink-0 font-bold text-sm"></span>
                                    {t('commissionRate', { rate: venue.commission_rate })}
                                </p>
                            )}
                            {venue.recruitment_deadline && (
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                    {t('recruitmentDeadline', { date: venue.recruitment_deadline })}
                                </p>
                            )}
                        </div>

                        {venue.description && (
                            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                                <p className="text-sm text-gray-600 leading-relaxed">{venue.description}</p>
                            </div>
                        )}

                        {/* Occupancy */}
                        {(() => {
                            const approved = parseInt(venue.approved_count) || 0;
                            const max = parseInt(venue.max_sellers) || 0;
                            const isFull = max > 0 && approved >= max;
                            return (
                                <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-5 text-sm font-bold ${isFull ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    <span className="flex items-center gap-1.5"><Users size={14} /> {t('occupancy')}</span>
                                    <span>{approved}{max > 0 ? ` / ${max}` : ''}{isFull && <span className="ml-1.5 text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full">{t('full')}</span>}</span>
                                </div>
                            );
                        })()}



                        <div className="flex gap-3">
                            {/* Share Button */}
                            <button
                                onClick={async () => {
                                    const shareUrl = `${window.location.origin}${window.location.pathname}?venue=${venue.id}`;
                                    const shareText = `[SpaceMatch] ${venue.name}\n📍 ${venue.location || t('locationTBD')}`;
                                    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
                                        try {
                                            await navigator.share({ title: `SpaceMatch - ${venue.name}`, text: shareText, url: shareUrl });
                                        } catch (e) { /* ignored */ }
                                    } else {
                                        try {
                                            await navigator.clipboard.writeText(shareUrl);
                                            showToast(t('linkCopied'));
                                        } catch (e) {
                                            const ta = document.createElement('textarea');
                                            ta.value = shareUrl;
                                            document.body.appendChild(ta);
                                            ta.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(ta);
                                            showToast(t('linkCopied'));
                                        }
                                    }
                                }}
                                className="px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors text-sm flex items-center gap-2"
                                title={t('share')}
                            >
                                <Share2 size={16} />
                                {t('share')}
                            </button>

                            {user ? (
                                <Link
                                    to={user.role === 'seller' ? '/seller' : user.role === 'host' ? '/host' : '/admin'}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    {t('applyForEntry')}
                                </Link>
                            ) : (
                                <Link to="/login" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition-colors text-sm">
                                    {t('loginAndApply')}
                                </Link>
                            )}
                            <button onClick={onClose} className="px-5 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                                {t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <PublicNav />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicNav />

            {/* ━━ Hero Banner Carousel (핫한 모집) ━━ */}
            <div className="pt-20 md:pt-24">
                {hotPromoVenues.length > 0 ? (
                    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Flame size={11} /> HOT
                                                    </span>
                                                    {venue.type && (
                                                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                                                            {TYPE_LABELS[venue.type] || venue.type}
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
                        </div>
                    </section>
                ) : (
                    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">
                                Find Your Space
                            </h1>
                            <p className="text-gray-400 mt-2 font-medium">{t('recruitment.heroDesc')}</p>
                        </div>
                    </section>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 pb-16 pt-8">

                {/* ━━ 🌍 Country Filter Tabs ━━ */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
                            <Globe size={20} className="text-indigo-500" />
                            {t('recruitment.countryFilter')}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-indigo-400 transition-colors"
                        >
                            <option value="latest">{t('recruitment.sortLatest')}</option>
                            <option value="priceAsc">{t('recruitment.sortPriceAsc')}</option>
                            <option value="priceDesc">{t('recruitment.sortPriceDesc')}</option>
                            <option value="popular">{t('recruitment.sortPopular')}</option>
                        </select>
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
                                🌍 {t('recruitment.allCountries')}
                                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[11px]">{displayVenues.length}</span>
                            </button>
                            {Object.entries(COUNTRY_FLAGS).map(([code, info]) => {
                                const cnt = displayVenues.filter(v => v.owner_country === code).length;
                                return (
                                    <button
                                        key={code}
                                        onClick={() => setCountryFilter(code)}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${countryFilter === code
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        <span>{info.flag}</span>
                                        <span>{i18n.language === 'ko' ? info.name : info.nameEn}</span>
                                        <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[11px] ${countryFilter === code ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{cnt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {countryFilter !== 'all' && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-800/50">
                                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{countryStats.totalCount}</div>
                                <div className="text-[11px] font-bold text-indigo-400 dark:text-indigo-300/70 mt-0.5">{t('recruitment.venueCount')}</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800/50">
                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    {countryStats.avgPrice > 0 ? `${Math.round(countryStats.avgPrice / 10000)}만` : '-'}
                                </div>
                                <div className="text-[11px] font-bold text-emerald-400 dark:text-emerald-300/70 mt-0.5">{t('recruitment.avgPrice')}</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800/50">
                                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{countryStats.activeCount}</div>
                                <div className="text-[11px] font-bold text-amber-400 dark:text-amber-300/70 mt-0.5">{t('recruitment.activeRecruit')}</div>
                            </div>
                        </div>
                    )}
                </section>

                {/* ━━ Category Filter Chips ━━ */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-lg md:text-xl font-black text-gray-900">{t('recruitment.category')}</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {[
                            { key: 'all', label: t('recruitment.allTypes'), icon: <LayoutGrid size={14} /> },
                            { key: 'popup', label: t('spaceType.popup'), icon: <Sparkles size={14} /> },
                            { key: 'fleamarket', label: t('spaceType.fleamarket'), icon: <Store size={14} /> },
                            { key: 'gallery', label: t('spaceType.gallery'), icon: <Eye size={14} /> },
                            { key: 'cafe', label: t('spaceType.cafe'), icon: <Store size={14} /> },
                            { key: 'showroom', label: t('spaceType.showroom'), icon: <Store size={14} /> },
                            { key: 'store', label: t('spaceType.store', '스토어'), icon: <Store size={14} /> },
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
                                <h2 className="text-lg font-black">{t('recruitment.hotPlaces')}</h2>
                            </div>
                            <p className="text-sm text-gray-400 font-medium hidden md:block">{t('recruitment.hotPlacesDesc')}</p>
                            <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent" />
                            <div className="flex gap-1.5">
                                <button onClick={() => hotPromoRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => hotPromoRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all">
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

                {/* ━━ 급상승 공간 (Horizontal Scroll) ━━ */}
                {trendingVenues.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">
                                <TrendingUp size={18} />
                                <h2 className="text-lg font-black">{t('recruitment.trendingSpaces')}</h2>
                            </div>
                            <p className="text-sm text-gray-400 font-medium hidden md:block">{t('recruitment.trendingDesc')}</p>
                            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
                            <div className="flex gap-1.5">
                                <button onClick={() => trendingRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => trendingRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all">
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

                {/* ━━ 지도로 보기 ━━ */}
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
                            {t('recruitment.mapView')}
                        </button>
                        {showMap && (
                            <span className="text-sm text-gray-400 font-medium hidden md:block">{t('recruitment.mapHint')}</span>
                        )}
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
                    </div>
                    {showMap && (
                        <KakaoMap
                            venues={filteredVenues}
                            height="450px"
                            onMarkerClick={(venue) => setSelectedVenue(venue)}
                            countryCode={countryFilter}
                            className="mb-2"
                        />
                    )}
                </section>

                {/* ━━ 모든 공간 ━━ */}
                <section>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-xl">
                            <Eye size={18} />
                            <h2 className="text-base sm:text-lg font-black">{t('recruitment.allSpaces')}</h2>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">{filteredVenues.length}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent hidden sm:block" />
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-transparent text-gray-700 placeholder-gray-400 font-medium text-sm sm:text-base"
                            />
                        </div>
                        <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 w-full">
                            <div className="relative group">
                                <Filter className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={14} />
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                    <option value="all">{t('recruitment.allTypes')}</option>
                                    <option value="popup">{t('spaceType.popup')}</option>
                                    <option value="fleamarket">{t('spaceType.fleamarket')}</option>
                                    <option value="gallery">{t('spaceType.gallery')}</option>
                                    <option value="cafe">{t('spaceType.cafe')}</option>
                                    <option value="showroom">{t('spaceType.showroom')}</option>
                                </select>
                                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={14} />
                                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                                    className="w-full pl-8 sm:pl-10 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                    <option value="all">{t('recruitment.allRegions')}</option>
                                    {regionOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₩</span>
                                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full pl-7 sm:pl-9 pr-6 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all text-xs sm:text-sm sm:min-w-[140px]">
                                    <option value="all">{t('recruitment.allPrices')}</option>
                                    <option value="low">{t('recruitment.under100k')}</option>
                                    <option value="mid">{t('recruitment.range100to300k')}</option>
                                    <option value="high">{t('recruitment.over300k')}</option>
                                </select>
                                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Venues Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVenues.map((venue, i) => (
                            <VenueCard key={venue.id || venue.venue_id || i} venue={venue} />
                        ))}
                        {filteredVenues.length === 0 && (
                            <div className="col-span-full py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('recruitment.noResults')}</h3>
                                <p className="text-gray-500">{t('recruitment.tryDifferent')}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Detail Modal */}
            {selectedVenue && (
                <VenueDetailModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <PublicFooter />
        </div>
    );
};

export default RecruitmentDashboard;
