import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import {
    User, Building, MapPin, Store, Calendar, ArrowLeft,
    Instagram, Tag, ChevronRight, ExternalLink, Image as ImageIcon,
    Briefcase, Globe, Clock, Star, Heart, Sparkles, Eye,
    X, ChevronLeft, ZoomIn
} from 'lucide-react';

const API_BASE = '/api';

// TYPE_LABELS moved inside component to use i18n

const getImgSrc = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/')) return imgPath;
    return `/spacematch/uploads/venues/${imgPath}`;
};

const VendorPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeVenueTab, setActiveVenueTab] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState(-1); // -1 = closed

    const TYPE_LABELS = {
        popup: t('publicProfile.typePopup'), gallery: t('publicProfile.typeGallery'), cafe: t('publicProfile.typeCafe'),
        showroom: t('publicProfile.typeShowroom'), fleamarket: t('publicProfile.typeFleamarket'), store: t('publicProfile.typeStore')
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/users/get_public_profile.php?id=${encodeURIComponent(id)}`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    setProfile(data);
                } else {
                    setError(data.message || t('publicProfile.profileLoadFailed'));
                }
            } catch (err) {
                setError(t('publicProfile.profileLoadError'));
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProfile();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <PublicNav />
                <div className="max-w-5xl mx-auto px-4 py-20">
                    <div className="animate-pulse space-y-8">
                        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded-3xl" />
                        <div className="flex gap-6">
                            <div className="w-28 h-28 bg-gray-200 rounded-2xl -mt-16 ml-6" />
                            <div className="space-y-3 flex-1 pt-2">
                                <div className="h-7 bg-gray-200 rounded-lg w-48" />
                                <div className="h-4 bg-gray-100 rounded w-32" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl" />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <PublicNav />
                <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                        <User size={40} className="text-indigo-200" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">{t('publicProfile.profileNotFound')}</h2>
                    <p className="text-gray-500 mb-8">{error || t('publicProfile.invalidAccess')}</p>
                    <button onClick={() => navigate(-1)} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200">
                        {t('publicProfile.goBack')}
                    </button>
                </div>
            </div>
        );
    }

    const user = profile.user;
    const venues = profile.venues || [];
    const stats = profile.stats || {};
    const communityStats = profile.community_stats || {};
    const isVendor = user.role === 'vendor';
    const isSeller = user.role === 'seller';
    const sellerPhotos = profile.seller_photos || [];
    const applications = profile.applications || [];
    const displayName = user.brand_name || user.name;
    const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '';
    const getTypeLabel = (type) => TYPE_LABELS[type] || type;

    // Filter venues by type
    const venueTypes = [...new Set(venues.map(v => v.type).filter(Boolean))];
    const filteredVenues = activeVenueTab === 'all' ? venues : venues.filter(v => v.type === activeVenueTab);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
            <PublicNav />

            {/* Hero Cover Section */}
            <div className="relative">
                <div className="h-56 md:h-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute bottom-10 right-20 w-60 h-60 bg-pink-400/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl" />
                    </div>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                    />
                </div>

                {/* Profile Card - overlaps cover */}
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative -mt-24 md:-mt-28">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row gap-5 items-start">
                                {/* Avatar */}
                                {user.profile_image ? (
                                    <img
                                        src={user.profile_image}
                                        alt={displayName}
                                        className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-indigo-100 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-4 border-white shadow-lg ring-2 ring-indigo-100 flex items-center justify-center text-white text-4xl font-black flex-shrink-0">
                                        {(displayName || '?').charAt(0)}
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-1">
                                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">{displayName}</h1>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isVendor
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                            }`}>
                                            {isVendor ? t('publicProfile.roleVendor') : isSeller ? t('publicProfile.roleSeller') : user.role}
                                        </span>
                                    </div>

                                    {user.brand_name && user.name !== user.brand_name && (
                                        <p className="text-sm text-gray-500 mb-2">{user.name}</p>
                                    )}

                                    {/* Meta row */}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {joinDate && (
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <Calendar size={12} />
                                                {joinDate} {t('publicProfile.joined')}
                                            </span>
                                        )}
                                        {user.category && (
                                            <span className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg font-medium">
                                                <Tag size={12} />
                                                {user.category}
                                            </span>
                                        )}
                                        {user.instagram && (
                                            <a
                                                href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg font-medium hover:bg-pink-100 transition-colors"
                                            >
                                                <Instagram size={12} />
                                                @{user.instagram.replace('@', '')}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Stats badges - right side on desktop */}
                                <div className="flex sm:flex-col gap-3 flex-shrink-0">
                                    {isVendor && (
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl px-5 py-3 text-center border border-indigo-100/50 min-w-[90px]">
                                            <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{venues.length}</p>
                                            <p className="text-[11px] font-bold text-indigo-500 mt-0.5">{t('publicProfile.registeredSpaces')}</p>
                                        </div>
                                    )}
                                    {isSeller && (
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl px-5 py-3 text-center border border-emerald-100/50 min-w-[90px]">
                                            <p className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{applications.length}</p>
                                            <p className="text-[11px] font-bold text-emerald-500 mt-0.5">{t('publicProfile.entryActivity')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {user.description && (
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{user.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-5xl mx-auto px-4 py-8 flex-1">

                {/* Vendor: Registered Venues */}
                {isVendor && venues.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <Building size={20} className="text-indigo-500" />
                                {t('publicProfile.registeredSpaces')}
                                <span className="text-sm font-bold text-indigo-500 ml-1">{venues.length}</span>
                            </h2>

                            {/* Type filter tabs */}
                            {venueTypes.length > 1 && (
                                <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setActiveVenueTab('all')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeVenueTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >{t('publicProfile.allTypes')}</button>
                                    {venueTypes.map(vt => (
                                        <button
                                            key={vt}
                                            onClick={() => setActiveVenueTab(vt)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeVenueTab === vt ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >{getTypeLabel(vt)}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredVenues.map(venue => {
                                const firstImage = venue.images?.[0];
                                const imgSrc = getImgSrc(firstImage);
                                return (
                                    <div
                                        key={venue.id}
                                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                        onClick={() => navigate(`/recruitment?venue=${venue.id}`)}
                                    >
                                        {/* Image */}
                                        <div className="relative h-44 overflow-hidden">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                                    <Store size={36} className="text-indigo-300" />
                                                </div>
                                            )}
                                            {/* Type badge */}
                                            {venue.type && (
                                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-gray-700 shadow-sm">
                                                    {TYPE_LABELS[venue.type] || venue.type}
                                                </span>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors truncate">
                                                {venue.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                                <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{venue.location || t('locationTBD')}</span>
                                            </p>
                                            <div className="flex items-center justify-between">
                                                {venue.price && Number(venue.price) > 0 && (
                                                    <span className="text-sm font-black text-indigo-600">
                                                        ₩{Number(venue.price).toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1 ml-auto">
                                                    {t('publicProfile.viewDetails')} <ChevronRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Seller: Product Photos */}
                {isSeller && sellerPhotos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <ImageIcon size={20} className="text-emerald-500" />
                            {t('publicProfile.productPhotos')}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {sellerPhotos.map((photo, idx) => (
                                <div
                                    key={photo.id}
                                    className="aspect-square rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg transition-all cursor-pointer relative"
                                    onClick={() => setLightboxIndex(idx)}
                                >
                                    <img src={photo.image_url} alt={photo.caption || t('publicProfile.product')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Lightbox Modal */}
                {lightboxIndex >= 0 && sellerPhotos.length > 0 && (
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setLightboxIndex(-1)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setLightboxIndex(-1);
                            if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
                            if (e.key === 'ArrowRight' && lightboxIndex < sellerPhotos.length - 1) setLightboxIndex(lightboxIndex + 1);
                        }}
                        tabIndex={0}
                        ref={(el) => el && el.focus()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxIndex(-1)}
                            className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                        >
                            <X size={22} />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-bold">
                            {lightboxIndex + 1} / {sellerPhotos.length}
                        </div>

                        {/* Previous button */}
                        {lightboxIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Next button */}
                        {lightboxIndex < sellerPhotos.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}

                        {/* Main image */}
                        <div
                            className="max-w-[90vw] max-h-[85vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={sellerPhotos[lightboxIndex].image_url}
                                alt={sellerPhotos[lightboxIndex].caption || t('publicProfile.productPhoto')}
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            />
                            {sellerPhotos[lightboxIndex].caption && (
                                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-xl">
                                    {sellerPhotos[lightboxIndex].caption}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Seller: Activity History */}
                {isSeller && applications.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-5">
                            <Sparkles size={20} className="text-amber-500" />
                            {t('publicProfile.entryHistory')}
                        </h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                            {applications.map(app => (
                                <div key={app.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Store size={16} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{app.venue_name}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <MapPin size={10} className="flex-shrink-0" />
                                            {app.venue_location || ''}
                                            {app.venue_type && (
                                                <span className="text-indigo-400 ml-1">· {getTypeLabel(app.venue_type)}</span>
                                            )}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold flex-shrink-0">
                                        {t('publicProfile.approved')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state for vendors */}
                {isVendor && venues.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-16 px-8 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building size={32} className="text-indigo-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-1">{t('publicProfile.noSpacesYet')}</p>
                        <p className="text-gray-300 text-sm">{t('publicProfile.noSpacesDesc')}</p>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
};

export default VendorPublicProfile;
