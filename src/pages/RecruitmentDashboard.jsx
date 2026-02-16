import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import Toast from '../components/Toast';
import {
    Flame, MapPin, Calendar, Store, ArrowRight, Search,
    Filter, X, Clock, ChevronDown, ChevronRight, Star,
    TrendingUp, Building, Users, Sparkles, Eye, FolderOpen, Heart, Share2, Link2, Check
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

const RecruitmentDashboard = () => {
    const { t } = useTranslation('venue');
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
        return displayVenues.filter(v => {
            const name = v.name || '';
            const location = v.location || '';
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || v.type === filterType;
            const matchesLocation = filterLocation === 'all' || v.region === filterLocation || location.includes(filterLocation);

            let matchesPrice = true;
            const price = parseInt(v.price) || 0;
            if (priceRange === 'low') matchesPrice = price <= 100000;
            if (priceRange === 'mid') matchesPrice = price > 100000 && price <= 300000;
            if (priceRange === 'high') matchesPrice = price > 300000;

            return matchesSearch && matchesType && matchesLocation && matchesPrice;
        });
    }, [displayVenues, searchTerm, filterType, filterLocation, priceRange]);

    // Hot places (combined hot_top + hot_mid)
    const hotPlaces = useMemo(() => {
        return [...data.hot_top, ...data.hot_mid].map(v => ({
            ...v,
            id: v.venue_id || v.id,
        }));
    }, [data.hot_top, data.hot_mid]);

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
                                to={user.role === 'seller' ? '/seller' : user.role === 'vendor' ? '/vendor' : '/admin'}
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
                                try { await navigator.clipboard.writeText(shareUrl); showToast(t('linkCopied')); } catch { }
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
                                to={user.role === 'seller' ? '/seller' : user.role === 'vendor' ? '/vendor' : '/admin'}
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
                                try { await navigator.clipboard.writeText(shareUrl); showToast(t('linkCopied')); } catch { }
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
                                        } catch (e) { }
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
                                    to={user.role === 'seller' ? '/seller' : user.role === 'vendor' ? '/vendor' : '/admin'}
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

            {/* Hero */}
            <section className="pt-24 pb-10 md:pt-32 md:pb-16 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(120,119,198,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(167,139,250,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium mb-4 md:mb-6">
                        <Flame size={14} />
                        FIND YOUR SPACE
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">
                        {t('recruitment.heroTitle1')}
                        <br />
                        <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">{t('recruitment.heroTitle2')}</span>{t('recruitment.heroTitle3')}</h1>
                    <p className="text-sm md:text-lg text-white/60 max-w-xl mx-auto">
                        {t('recruitment.heroDesc')}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10 pb-16">

                {/* 핫한 플레이스 (horizontal scroll, same as SellerDashboard) */}
                {hotPlaces.length > 0 && (
                    <section className="pt-8 md:pt-12">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
                                <Flame size={18} />
                                <h2 className="text-lg font-black">{t('recruitment.hotPlaces')}</h2>
                            </div>
                            <p className="text-sm text-gray-400 font-medium hidden md:block">{t('recruitment.hotPlacesDesc')}</p>
                            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
                            {hotPlaces.map((venue, i) => (
                                <HotPlaceCard key={venue.promotion_id || i} venue={venue} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 급상승 공간 */}
                {trendingVenues.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">
                                <TrendingUp size={18} />
                                <h2 className="text-lg font-black">{t('recruitment.trendingSpaces')}</h2>
                            </div>
                            <p className="text-sm text-gray-400 font-medium hidden md:block">{t('recruitment.trendingDesc')}</p>
                            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {trendingVenues.map((venue) => (
                                <TrendingCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 모든 공간 (same card style as SellerDashboard) */}
                <section>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl">
                            <Eye size={18} />
                            <h2 className="text-lg font-black">{t('recruitment.allSpaces')}</h2>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">{filteredVenues.length}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    </div>

                    {/* Search & Filter Bar (same as SellerDashboard) */}
                    <div className="bg-white p-2 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 flex flex-col md:flex-row gap-3 items-center sticky top-20 z-30 transition-all mb-6">
                        <div className="relative flex-1 w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-4 py-3.5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                            <div className="relative group">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={16} />
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                    <option value="all">{t('recruitment.allTypes')}</option>
                                    <option value="popup">{t('spaceType.popup')}</option>
                                    <option value="fleamarket">{t('spaceType.fleamarket')}</option>
                                    <option value="gallery">{t('spaceType.gallery')}</option>
                                    <option value="cafe">{t('spaceType.cafe')}</option>
                                    <option value="showroom">{t('spaceType.showroom')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={16} />
                                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                    <option value="all">{t('recruitment.allRegions')}</option>
                                    <option value="서울특별시">{t('recruitment.regions.seoul')}</option>
                                    <option value="경기도">{t('recruitment.regions.gyeonggi')}</option>
                                    <option value="인천광역시">{t('recruitment.regions.incheon')}</option>
                                    <option value="대전광역시">{t('recruitment.regions.daejeon')}</option>
                                    <option value="대구광역시">{t('recruitment.regions.daegu')}</option>
                                    <option value="광주광역시">{t('recruitment.regions.gwangju')}</option>
                                    <option value="울산광역시">{t('recruitment.regions.ulsan')}</option>
                                    <option value="부산광역시">{t('recruitment.regions.busan')}</option>
                                    <option value="제주특별자치도">{t('recruitment.regions.jeju')}</option>
                                    <option value="강원도">{t('recruitment.regions.gangwon')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif"></span>
                                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                    className="pl-9 pr-8 py-3 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer font-medium text-gray-700 transition-all min-w-[140px]">
                                    <option value="all">{t('recruitment.allPrices')}</option>
                                    <option value="low">{t('recruitment.under100k')}</option>
                                    <option value="mid">{t('recruitment.range100to300k')}</option>
                                    <option value="high">{t('recruitment.over300k')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
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
