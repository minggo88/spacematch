import React, { useState, useEffect, useMemo } from 'react';
import { Search, Tag, ShoppingBag, Filter, ChevronDown, X, Users, Instagram, ArrowUpDown, Mail, Phone, Building, Calendar, ImageIcon, Crown, Star } from 'lucide-react';
import AdSlot from '../../components/AdSlot';

const API_BASE = '/api';

const CATEGORY_LABELS = {
    fashion: '패션/잡화',
    beauty: '뷰티',
    food: '푸드/음료',
    living: '리빙/라이프스타일',
    art: '아트/디자인',
    stationery: '문구/오피스',
    digital: '디지털/테크',
    activity: '스포츠/액티비티',
    eco: '친환경/에코라이프',
    pet: '반려동물',
    kids: '키즈/유아',
    handmade: '핸드메이드/수공예',
    vintage: '빈티지/중고',
    perfume: '향수/디퓨저',
    book: '도서/매거진'};

const VendorSellerDirectory = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);

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
            console.error('셀러 목록 로드 실패:', err);
        } finally {
            setLoading(false);
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
    }, [sellers, searchTerm, selectedCategory, sortBy]);

    const activeFilterCount = [selectedCategory].filter(Boolean).length;

    const featuredSellers = useMemo(() => {
        return sellers.filter(s => s.is_featured);
    }, [sellers]);

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSortBy('newest');
    };

    const getCategoryLabel = (cat) => CATEGORY_LABELS[cat] || cat || '미';
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
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="text-rose-600" size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">셀러 검색</h1>
                        <p className="text-sm text-gray-500">입점 희망 셀러 브랜드를 찾아보세요</p>
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
                            placeholder="브랜드명, 카테고리, 인스타그램으로 검색.."
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
                        필터 & 정렬
                        {activeFilterCount > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{activeFilterCount}</span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">업종 (카테고리)</label>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                >
                                    <option value="">전체 업종</option>
                                    {allCategories.map(c => (
                                        <option key={c} value={c}>{getCategoryLabel(c)}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">정렬</label>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:border-indigo-500 outline-none appearance-none font-medium text-sm"
                                >
                                    <option value="newest">최신 가입순</option>
                                    <option value="oldest">오래된 가입순</option>
                                    <option value="name_asc">이름순 (가→하)</option>
                                    <option value="name_desc">이름순 (하→ㄱ)</option>
                                    <option value="apps_desc">신청 많은순</option>
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
                                    <X size={14} /> 필터 초기화
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Featured Sellers Premium Section */}
            {featuredSellers.length > 0 && !searchTerm && !selectedCategory && (
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border border-amber-200/60 overflow-hidden shadow-sm">
                        <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center gap-2">
                            <Crown size={18} className="text-white" />
                            <span className="text-white font-extrabold text-sm">PREMIUM ??</span>
                            <span className="text-white/70 text-xs ml-1">상위 노출</span>
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
                                                        <img src={seller.profile_image} alt={seller.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        seller.name?.[0] || 'S'
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-extrabold text-gray-900 text-lg truncate">{seller.name}</h3>
                                                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${getCategoryColor(seller.category)}`}>
                                                        {getCategoryLabel(seller.category)}
                                                    </span>
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

            {/* Ad Slot C ??Banner after Featured */}
            <AdSlot slotId="directory_c" format="banner" />

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 font-medium">
                    총 <span className="text-rose-600 font-bold">{filteredSellers.length}</span>명의 셀러 </p>
            </div>

            {/* Seller Grid */}
            {filteredSellers.length === 0 ? (
                <div className="text-center py-20">
                    <Users className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-400">검색 결과가 없습니다</h3>
                    <p className="text-sm text-gray-400 mt-1">필터 조건을 변경해 보세요</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredSellers.map((seller, idx) => (
                        <React.Fragment key={seller.id}>
                            {idx === 6 && <AdSlot slotId="directory_d" format="card" />}
                            <div
                                onClick={() => setSelectedSeller(seller)}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className="p-5 pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm overflow-hidden">
                                            {seller.profile_image ? (
                                                <img src={seller.profile_image} alt={seller.name} className="w-full h-full object-cover" />
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
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{seller.email}</p>
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

                                    {/* Instagram */}
                                    {seller.instagram && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Instagram size={15} className="text-pink-500 flex-shrink-0" />
                                            <span className="text-pink-500 font-medium truncate">{seller.instagram}</span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {seller.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {seller.description}
                                        </p>
                                    )}

                                    {/* App Count */}
                                    <div className="text-xs text-gray-400">
                                        입점 신청 <span className="font-bold text-gray-600">{seller.app_count}</span>건
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <span className="text-xs text-gray-400">
                                        가입일: {new Date(seller.created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                    {seller.phone && (
                                        <span className="text-xs text-gray-500 font-medium">{seller.phone}</span>
                                    )}
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
                                            <img src={selectedSeller.profile_image} alt={selectedSeller.name} className="w-full h-full object-cover" />
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
                                <button onClick={() => setSelectedSeller(null)} className="text-white/80 hover:text-white p-1 transition-colors">
                                    <X size={22} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* What they sell - Most prominent */}
                            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">판매 정보</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={16} className="text-violet-600" />
                                    <span className="text-sm font-bold text-violet-800">{getCategoryLabel(selectedSeller.category)}</span>
                                </div>
                                {selectedSeller.description ? (
                                    <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">{selectedSeller.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic mt-2">브랜드 소개가 등록되지 않았습니다</p>
                                )}
                            </div>

                            {/* Product Photos */}
                            {selectedSeller.photos && selectedSeller.photos.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <ImageIcon size={12} />
                                        제품 사진
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedSeller.photos.map((photo, idx) => (
                                            <div key={photo.id || idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity">
                                                <img src={photo.image_url} alt={`제품 ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 py-3 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600">{selectedSeller.app_count || 0}</p>
                                    <p className="text-xs text-gray-400">입점 신청</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">연락처 정보</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">이메일</p>
                                            <p className="text-sm font-medium text-gray-800">{selectedSeller.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">연락처</p>
                                            <p className={`text-sm font-medium ${selectedSeller.phone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {selectedSeller.phone || '미등'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                        <Instagram size={16} className="text-violet-500" />
                                        <div>
                                            <p className="text-xs text-gray-400">인스타그램</p>
                                            {selectedSeller.instagram ? (
                                                <a href={`https://instagram.com/${selectedSeller.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
                                                    {selectedSeller.instagram}
                                                </a>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-400 italic">미등</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">비즈니스 정보</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Building size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">사업자등록번호</p>
                                            <p className={`text-sm font-medium ${selectedSeller.business_no ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                {selectedSeller.business_no || '미등'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Calendar size={16} className="text-indigo-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">가입일</p>
                                            <p className="text-sm font-medium text-gray-800">{new Date(selectedSeller.created_at).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSellerDirectory;
