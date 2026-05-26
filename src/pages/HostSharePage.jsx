import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Store, Building, X, Users, Mail, Phone, Calendar, Clock, Star, ChevronRight, ImageIcon, Flame, ExternalLink, Lock, ArrowLeft } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const API_BASE = '/api';

const HostSharePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('seller');

    const TYPE_LABELS = {
        popup:      t('hostDirectoryPage.typePopup'),
        gallery:    t('hostDirectoryPage.typeGallery'),
        cafe:       t('hostDirectoryPage.typeCafe'),
        showroom:   t('hostDirectoryPage.typeShowroom'),
        fleamarket: t('hostDirectoryPage.typeFleamarket'),
    };

    const [host, setHost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHost, setSelectedHost] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venueImageIndex, setVenueImageIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchHost();
    }, [id]);

    const fetchHost = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/get_host_public.php?id=${id}`);
            const data = await res.json();
            if (data.success && data.host) {
                setHost(data.host);
                setSelectedHost(data.host); // Auto-open modal
            } else {
                setError(data.message || '호스트를 찾을 수 없습니다.');
            }
        } catch (err) {
            setError('호스트 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

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
                        <Clock size={9} /> D-Day
                    </span>
                );
            }
            if (diffDays <= 3) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                        <Clock size={9} /> D-{diffDays}
                    </span>
                );
            }
            if (diffDays <= 7) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-200">
                        <Clock size={9} /> D-{diffDays}
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
                    <Clock size={9} /> D-{diffDays}
                </span>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <PublicNav />
            <main className="flex-1 flex flex-col">
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-28 pb-0">
                    {/* Page Header */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-1">스페이스매치 — 호스트 프로필 공유</p>
                        <a href="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                            <ArrowLeft size={14} /> 스페이스매치 홈으로
                        </a>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-20">
                            <Users className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-500">{error}</h3>
                            <a href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">홈으로 돌아가기</a>
                        </div>
                    )}

                    {/* Host Card Grid */}
                    {!loading && host && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div
                                onClick={() => setSelectedHost(host)}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className="p-5 pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm overflow-hidden">
                                            {host.profile_image
                                                ? <img src={host.profile_image} alt={host.name} className="w-full h-full object-cover" />
                                                : host.name?.[0] || 'H'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 text-lg truncate">{host.name}</h3>
                                                {host.is_featured ? (
                                                    <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Star size={8} fill="white" /> PREMIUM
                                                    </span>
                                                ) : null}
                                                {host.is_verified ? (
                                                    <span className="inline-flex shrink-0 whitespace-nowrap px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-extrabold">
                                                        {t('hostDirectoryPage.verified')}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">●●●●@●●●●.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Store size={15} className="text-indigo-500 flex-shrink-0" />
                                        <span className="text-gray-600">{t('hostDirectoryPage.registeredVenues')} <span className="font-bold text-indigo-600">{host.venue_count}</span></span>
                                    </div>
                                    {host.regions?.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex flex-wrap gap-1.5">
                                                {host.regions.slice(0, 3).map((r, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-xs font-medium">{r}</span>
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
                                                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium">
                                                    {TYPE_LABELS[tp] || tp}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <span className="text-xs text-gray-400">
                                        {t('hostDirectoryPage.joinDate')} {new Date(host.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {getDdayBadge(host)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <PublicFooter />

            {/* Detail Modal */}
            {selectedHost && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedHost(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                                        {selectedHost.profile_image ? (
                                            <img src={selectedHost.profile_image} alt={selectedHost.name} className="w-full h-full object-cover" />
                                        ) : (
                                            selectedHost.name?.[0] || 'H'
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

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Description */}
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">{t('hostDirectoryPage.hostIntro')}</p>
                                {selectedHost.description ? (
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedHost.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">{t('hostDirectoryPage.hostIntroEmpty')}</p>
                                )}
                            </div>

                            {/* Venue Stats */}
                            <div className="flex items-center justify-center gap-8 py-3 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600">{selectedHost.venue_count || 0}</p>
                                    <p className="text-xs text-gray-400">{t('hostDirectoryPage.registeredVenues')}</p>
                                </div>
                            </div>

                            {/* Venue List */}
                            {(() => {
                                const activeVenues = (selectedHost.venues || []).filter(v => v.is_active !== 0);
                                const pastVenues   = (selectedHost.venues || []).filter(v => v.is_active === 0);
                                return (
                                    <>
                                        {activeVenues.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Building size={12} /> {t('hostDirectoryPage.activeVenues')}
                                                </p>
                                                <div className="space-y-2">
                                                    {activeVenues.map(venue => (
                                                        <div
                                                            key={venue.id}
                                                            className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all cursor-pointer group"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedVenue(venue);
                                                                setVenueImageIndex(0);
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-gray-800 truncate">{venue.name}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {venue.type && (
                                                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium">
                                                                                {TYPE_LABELS[venue.type] || venue.type}
                                                                            </span>
                                                                        )}
                                                                        {venue.size && <span className="text-xs text-gray-500">{venue.size}</span>}
                                                                    </div>
                                                                    {venue.location && (
                                                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 truncate">
                                                                            <MapPin size={10} /> {venue.location}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-indigo-500 group-hover:text-indigo-700 transition-colors flex-shrink-0 ml-2">
                                                                    <span className="text-xs font-medium hidden sm:inline">{t('hostDirectoryPage.viewDetail')}</span>
                                                                    <ChevronRight size={16} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pastVenues.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Clock size={12} /> {t('hostDirectoryPage.pastVenues')}
                                                </p>
                                                <div className="space-y-1.5">
                                                    {pastVenues.map(venue => (
                                                        <div key={venue.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                            <p className="text-sm font-medium text-gray-500">{venue.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {venue.type && (
                                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs font-medium">
                                                                        {TYPE_LABELS[venue.type] || venue.type}
                                                                    </span>
                                                                )}
                                                                {venue.location && (
                                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                        <MapPin size={10} /> {venue.location}
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

                            {/* Regions */}
                            {selectedHost.regions?.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <MapPin size={12} /> {t('hostDirectoryPage.activeRegions')}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedHost.regions.map((r, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium border border-rose-100">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Types */}
                            {selectedHost.types?.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Store size={12} /> {t('hostDirectoryPage.venueTypeStatus')}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedHost.types.map((tp, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium border border-indigo-100">
                                                {TYPE_LABELS[tp] || tp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact — login required */}
                            <div className="p-5 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 rounded-2xl border border-indigo-500/30 text-center backdrop-blur-sm">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-2 ring-indigo-400/30">
                                    <Lock size={24} className="text-indigo-300" />
                                </div>
                                <p className="text-sm font-bold text-white mb-1">연락처 비공개</p>
                                <p className="text-xs text-indigo-200/70 mb-4">로그인 후 열람권을 사용하여 연락처를 확인하세요</p>
                                <a
                                    href="/login"
                                    className="inline-block w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-900/30 transition-all text-center"
                                >
                                    로그인하기
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Venue Image Modal */}
            {selectedVenue && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedVenue(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-gray-900">{selectedVenue.name}</h3>
                            <button onClick={() => setSelectedVenue(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={20} />
                            </button>
                        </div>
                        {selectedVenue.images?.length > 0 ? (
                            <div>
                                <div className="relative bg-gray-100 aspect-video">
                                    <img
                                        src={selectedVenue.images[venueImageIndex]}
                                        alt={selectedVenue.name}
                                        className="w-full h-full object-contain"
                                    />
                                    {selectedVenue.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setVenueImageIndex(i => (i - 1 + selectedVenue.images.length) % selectedVenue.images.length)}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors"
                                            >‹</button>
                                            <button
                                                onClick={() => setVenueImageIndex(i => (i + 1) % selectedVenue.images.length)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors"
                                            >›</button>
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                {selectedVenue.images.map((_, i) => (
                                                    <button key={i} onClick={() => setVenueImageIndex(i)}
                                                        className={`w-2 h-2 rounded-full transition-colors ${i === venueImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    {selectedVenue.location && (
                                        <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={14} />{selectedVenue.location}</p>
                                    )}
                                    {selectedVenue.type && (
                                        <p className="text-sm text-gray-600 flex items-center gap-1"><Store size={14} />{TYPE_LABELS[selectedVenue.type] || selectedVenue.type}</p>
                                    )}
                                    {selectedVenue.description && (
                                        <p className="text-sm text-gray-500 leading-relaxed">{selectedVenue.description}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-gray-300">
                                <ImageIcon size={48} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostSharePage;
