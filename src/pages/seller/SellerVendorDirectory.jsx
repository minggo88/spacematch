import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Store, Filter, Building, ChevronDown, ChevronRight, ArrowLeft, X, Users, Mail, Phone, Calendar, Crown, Star, Clock, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdSlot from '../../components/AdSlot';

const API_BASE = '/api';

const TYPE_LABELS = {
    popup: '팝업스토어',
    gallery: '갤러리',
    cafe: '카페',
    showroom: '쇼룸',
    fleamarket: '플리마켓',
};

const SellerVendorDirectory = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venueImageIndex, setVenueImageIndex] = useState(0);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await fetch(`${API_BASE}/users/browse_vendors.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) {
                setVendors(data);
            }
        } catch (err) {
            console.error('벤더 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique regions and types from all vendors
    const allRegions = useMemo(() => {
        const regions = new Set();
        vendors.forEach(v => v.regions?.forEach(r => regions.add(r)));
        return Array.from(regions).sort();
    }, [vendors]);

    const allTypes = useMemo(() => {
        const types = new Set();
        vendors.forEach(v => v.types?.forEach(t => types.add(t)));
        return Array.from(types).sort();
    }, [vendors]);

    // Filtered vendors
    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const nameMatch = vendor.name?.toLowerCase().includes(term);
                const emailMatch = vendor.email?.toLowerCase().includes(term);
                if (!nameMatch && !emailMatch) return false;
            }
            // Region filter
            if (selectedRegion && !(vendor.regions || []).some(r => r.includes(selectedRegion))) {
                return false;
            }
            // Type filter
            if (selectedType && !(vendor.types || []).includes(selectedType)) {
                return false;
            }
            return true;
        });
    }, [vendors, searchTerm, selectedRegion, selectedType]);

    const activeFilterCount = [selectedRegion, selectedType].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedRegion('');
        setSelectedType('');
        setSearchTerm('');
    };

    const featuredVendors = useMemo(() => {
        return vendors.filter(v => v.is_featured);
    }, [vendors]);

    const getDdayBadge = (vendor) => {
        if (vendor.has_closed) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    모집 완료
                </span>
            );
        }
        if (vendor.nearest_deadline) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadline = new Date(vendor.nearest_deadline);
            deadline.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-500 border border-gray-200">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        마감
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
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Building className="text-indigo-600" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">벤더 검색</h1>
                        <p className="text-sm text-gray-500">공간을 제공하는 벤더(호스트)를 찾아보세요</p>
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
                            placeholder="벤더 이름 또는 키워드로 검색.."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${showFilters || activeFilterCount > 0
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Filter size={16} />
                        필터
                        {activeFilterCount > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{activeFilterCount}</span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">지역</label>
                            <div className="relative">
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                >
                                    <option value="">전체 지역</option>
                                    {allRegions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">공간 ??</label>
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                >
                                    <p className="text-sm text-gray-400 italic mt-2">등록된 공간이 없습니다</p>
                                    {allTypes.map(t => (
                                        <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
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
                                    <X size={14} /> 필터 초기화</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Featured Vendors Premium Section */}
            {featuredVendors.length > 0 && !searchTerm && !selectedRegion && !selectedType && (
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border border-amber-200/60 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2">
                            <Crown size={18} className="text-white" />
                            <span className="text-white font-extrabold text-sm">PREMIUM 벤더</span>
                            <span className="text-white/70 text-xs ml-1">상위 노출</span>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featuredVendors.map(vendor => (
                                    <div
                                        key={`featured-${vendor.id}`}
                                        onClick={() => setSelectedVendor(vendor)}
                                        className="relative bg-white rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
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
                                                    {vendor.name?.[0] || 'V'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-extrabold text-gray-900 text-lg truncate">{vendor.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-indigo-600 font-bold">공간 {vendor.venue_count}</span>
                                                        {getDdayBadge(vendor)}
                                                    </div>
                                                </div>
                                            </div>
                                            {vendor.regions?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {vendor.regions.slice(0, 2).map((r, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[10px] font-medium">{r}</span>
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

            {/* Ad Slot C ??Banner after Featured */}
            <AdSlot slotId="directory_c" format="banner" />

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 font-medium">
                    총 <span className="text-indigo-600 font-bold">{filteredVendors.length}</span>명의 벤더
                </p>
            </div>

            {/* Vendor Grid */}
            {filteredVendors.length === 0 ? (
                <div className="text-center py-20">
                    <Users className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-400">검색 결과가 없습니다</h3>
                    <p className="text-sm text-gray-400 mt-1">필터 조건을 변경해 보세요</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVendors.map((vendor, idx) => (
                        <React.Fragment key={vendor.id}>
                            {idx === 6 && <AdSlot slotId="directory_d" format="card" />}
                            <div
                                onClick={() => setSelectedVendor(vendor)}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className="p-5 pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                                            {vendor.name?.[0] || 'V'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 text-lg truncate">{vendor.name}</h3>
                                                {vendor.is_featured ? (
                                                    <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Star size={8} fill="white" /> PREMIUM
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{vendor.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Store size={15} className="text-indigo-500 flex-shrink-0" />
                                        <span className="text-gray-600">등록 공간 <span className="font-bold text-indigo-600">{vendor.venue_count}</span>개</span>
                                    </div>
                                    {vendor.regions?.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex flex-wrap gap-1.5">
                                                {vendor.regions.slice(0, 3).map((r, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-xs font-medium">{r}</span>
                                                ))}
                                                {vendor.regions.length > 3 && (
                                                    <span className="text-xs text-gray-400 self-center">+{vendor.regions.length - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {vendor.types?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {vendor.types.map((t, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium">
                                                    {TYPE_LABELS[t] || t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <span className="text-xs text-gray-400">
                                        가입일: {new Date(vendor.created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {getDdayBadge(vendor)}
                                        {vendor.phone && (
                                            <span className="text-xs text-gray-500 font-medium">{vendor.phone}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
            {/* Detail Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedVendor(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                                        {selectedVendor.profile_image ? (
                                            <img src={selectedVendor.profile_image} alt={selectedVendor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            selectedVendor.name?.[0] || 'V'
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold">{selectedVendor.name}</h2>
                                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20">
                                            공간 제공자(벤더)
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedVendor(null)} className="text-white/80 hover:text-white p-1">
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Vendor Description */}
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">벤더 소개</p>
                                {selectedVendor.description ? (
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedVendor.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">아직 벤더 소개를 등록하지 않았습니다</p>
                                )}
                            </div>

                            {/* Venue Stats */}
                            <div className="flex items-center justify-center gap-8 py-3 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600">{selectedVendor.venue_count || 0}</p>
                                    <p className="text-xs text-gray-400">등록 공간</p>
                                </div>
                            </div>

                            {/* Venue List */}
                            {selectedVendor.venues?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Building size={12} />
                                        운영 중인 공간 목록
                                    </p>
                                    <div className="space-y-2">
                                        {selectedVendor.venues.map(venue => (
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
                                                    </div>
                                                    <div className="flex items-center gap-1 text-indigo-500 group-hover:text-indigo-700 transition-colors flex-shrink-0 ml-2">
                                                        <span className="text-xs font-medium hidden sm:inline">상세보기</span>
                                                        <ChevronRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Regions */}
                            {selectedVendor.regions?.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <MapPin size={12} />
                                        활동 지역
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedVendor.regions.map((r, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium border border-rose-100">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Space Types */}
                            {selectedVendor.types?.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Store size={12} />
                                        운영 공간 현황
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedVendor.types.map((t, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium border border-indigo-100">
                                                {TYPE_LABELS[t] || t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">연락처 정보</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">이메일</p>
                                            <p className="text-sm font-medium text-gray-800">{selectedVendor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">연락처</p>
                                            <p className={`text-sm font-medium ${selectedVendor.phone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {selectedVendor.phone || '미등'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">비즈니스 정보</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Building size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">사업자등록번호</p>
                                            <p className={`text-sm font-medium ${selectedVendor.business_no ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {selectedVendor.business_no || '미등'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Calendar size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">가입일</p>
                                            <p className="text-sm font-medium text-gray-800">{new Date(selectedVendor.created_at).toLocaleDateString('ko-KR')}</p>
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
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Venue Image Gallery */}
                        <div className="relative w-full h-56 bg-gray-100">
                            {(() => {
                                const imgs = (selectedVenue.images || []).map(img =>
                                    img?.startsWith?.('uploads/') ? `/${img}` : img
                                );
                                return imgs.length > 0 ? (
                                    <>
                                        <img src={imgs[venueImageIndex]} alt={selectedVenue.name} className="w-full h-full object-cover" />
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
                                        <span className="mt-2 text-sm">등록된 공간이 없습니다</span>
                                    </div>
                                );
                            })()}
                            <button onClick={() => setSelectedVenue(null)} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors z-10">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Venue Info */}
                        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                            {/* Name & Type */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedVenue.type && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                                            {TYPE_LABELS[selectedVenue.type] || selectedVenue.type}
                                        </span>
                                    )}
                                    {selectedVenue.size && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                            {selectedVenue.size}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900">{selectedVenue.name}</h2>
                                {selectedVenue.location && (
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                        <MapPin size={14} />
                                        {selectedVenue.location}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            {selectedVenue.price !== undefined && selectedVenue.price !== null && (
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">가격</p>
                                    <div className="flex items-end gap-1">
                                        {Number(selectedVenue.price) === 0 ? (
                                            <span className="text-2xl font-bold text-emerald-600">무료</span>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-bold text-indigo-600">??{Number(selectedVenue.price).toLocaleString()}</span>
                                                <span className="text-sm text-gray-400 mb-0.5">
                                                    {selectedVenue.pricing_unit === 'weekly' ? '/ ': selectedVenue.pricing_unit === 'monthly' ? '/ ': '/ '}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {parseFloat(selectedVenue.commission_rate) > 0 && (
                                        <p className="text-xs text-orange-600 mt-2 font-medium">매출 수수료 {selectedVenue.commission_rate}%</p>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">공간 소개</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedVenue.description || '이 공간에 대한 자세한 설명이 아직 등록되지 않았습니다'}
                                </p>
                            </div>

                            {/* Back to vendor */}
                            <button
                                onClick={() => setSelectedVenue(null)}
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                벤더 정보로 돌아가기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerVendorDirectory;
