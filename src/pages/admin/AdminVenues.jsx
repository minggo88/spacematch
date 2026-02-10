import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import {
    Plus, X, Search, Filter, MapPin, Calendar,
    MoreHorizontal, Edit3, Trash2, Eye, EyeOff, LayoutGrid, List,
    Image as ImageIcon, CheckCircle2, TrendingUp, Settings,
    Users, Store, BarChart3, ChevronDown, ChevronUp,
    AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import VenueModal from '../../components/VenueModal';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const API_BASE = '/api';

const AdminVenues = () => {
    const { deleteVenue, fetchVenues } = useData();

    // Own data fetch from admin endpoint (includes owner_name, owner_email)
    const [adminVenues, setAdminVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const fetchAdminVenues = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/venues/get_all_venues_admin.php`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) setAdminVenues(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAdminVenues(); }, [fetchAdminVenues]);

    // View & UI state
    const [viewMode, setViewMode] = useState('grid');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [statsVenue, setStatsVenue] = useState(null); // Per-venue stats panel

    // Filters & Sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterVendor, setFilterVendor] = useState('all'); // NEW: vendor filter

    // Derive unique vendors from data
    const vendorList = useMemo(() => {
        const map = new Map();
        adminVenues.forEach(v => {
            if (v.owner_name && v.owner_email) {
                map.set(v.owner_email, v.owner_name);
            }
        });
        return Array.from(map.entries()); // [[email, name], ...]
    }, [adminVenues]);

    // Filtered + sorted venues
    const filteredVenues = useMemo(() => {
        let result = adminVenues.filter(venue => {
            const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (venue.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSize = filterCategory === 'all' || venue.size === filterCategory;
            const matchesStatus = filterStatus === 'all' || venue.status === filterStatus;
            const matchesType = filterType === 'all' || venue.type === filterType;
            const matchesVendor = filterVendor === 'all' || venue.owner_email === filterVendor;
            return matchesSearch && matchesSize && matchesStatus && matchesType && matchesVendor;
        });

        return result.sort((a, b) => {
            switch (sortOption) {
                case 'price_high': return parseInt(b.price) - parseInt(a.price);
                case 'price_low': return parseInt(a.price) - parseInt(b.price);
                case 'name_asc': return a.name.localeCompare(b.name);
                case 'oldest': return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                case 'vendor': return (a.owner_name || '').localeCompare(b.owner_name || '');
                case 'newest':
                default: return parseInt(b.id) - parseInt(a.id);
            }
        });
    }, [adminVenues, searchTerm, filterCategory, filterStatus, filterType, filterVendor, sortOption]);

    // Stats (overall & filtered)
    const stats = useMemo(() => {
        const total = adminVenues.length;
        const approved = adminVenues.filter(v => v.status === 'approved').length;
        const pending = adminVenues.filter(v => v.status === 'pending').length;
        const rejected = adminVenues.filter(v => v.status === 'rejected').length;
        const avgPrice = total > 0 ? Math.round(adminVenues.reduce((acc, v) => acc + parseInt(v.price || 0), 0) / total) : 0;
        const vendorCount = new Set(adminVenues.map(v => v.owner_email).filter(Boolean)).size;
        return { total, approved, pending, rejected, avgPrice, vendorCount };
    }, [adminVenues]);

    // Per-venue stats
    const venueStats = useMemo(() => {
        if (!statsVenue) return null;
        const v = statsVenue;
        return {
            name: v.name,
            type: v.type,
            status: v.status,
            location: v.location,
            price: parseInt(v.price || 0),
            owner: v.owner_name || '미지정',
            ownerEmail: v.owner_email || '',
            createdAt: v.created_at,
            maxSellers: parseInt(v.max_sellers || 0),
            // Count matching venues from same owner
            ownerVenueCount: adminVenues.filter(x => x.owner_email === v.owner_email).length,
        };
    }, [statsVenue, adminVenues]);

    // Handlers
    const handleOpenDrawer = (venue = null) => {
        setSelectedVenue(venue);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedVenue(null), 300);
    };

    const handleModalSubmit = async (submitData) => {
        const endpoint = selectedVenue
            ? `${API_BASE}/venues/update_venue.php`
            : `${API_BASE}/venues/add_venue.php`;
        try {
            const res = await fetch(endpoint, { method: 'POST', body: submitData });
            const data = await res.json();
            if (data.success) {
                showToast(selectedVenue ? '수정되었습니다' : '등록되었습니다', 'success');
                setIsDrawerOpen(false);
                fetchAdminVenues();
                fetchVenues();
            } else {
                showToast(data.message || '오류가 발생했습니다.', 'error');
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = (id) => {
        const venue = adminVenues.find(v => String(v.id) === String(id));
        setConfirmModal({
            title: '베뉴 삭제',
            message: `정말 ${venue?.name || '이 베뉴'}를 삭제하시겠습니까?`,
            type: 'danger',
            confirmLabel: '삭제',
            onConfirm: () => {
                setConfirmModal(null);
                deleteVenue(id);
                setAdminVenues(prev => prev.filter(v => String(v.id) !== String(id)));
                showToast('베뉴가 삭제되었습니다.', 'success');
            }
        });
    };

    // Type Management State
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [venueTypes, setVenueTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeCode, setNewTypeCode] = useState('');

    const fetchVenueTypes = () => {
        fetch(`${API_BASE}/venues/manage_types.php`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setVenueTypes(data); })
            .catch(err => console.error("Error fetching types:", err));
    };

    const handleOpenTypeModal = () => { fetchVenueTypes(); setIsTypeModalOpen(true); };

    const handleAddType = () => {
        if (!newTypeName || !newTypeCode) { showToast('이름과 코드를 모두 입력해주세요.', 'error'); return; }
        fetch(`${API_BASE}/venues/manage_types.php`, {
            method: 'POST',
            body: JSON.stringify({ name: newTypeName, code: newTypeCode })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) { setNewTypeName(''); setNewTypeCode(''); fetchVenueTypes(); showToast('유형이 추가되었습니다', 'success'); }
                else showToast(data.message, 'error');
            });
    };

    const handleToggleType = (id, currentStatus) => {
        fetch(`${API_BASE}/venues/manage_types.php`, {
            method: 'PUT',
            body: JSON.stringify({ id, is_active: currentStatus == 1 ? 0 : 1 })
        })
            .then(res => res.json())
            .then(data => { if (data.success) fetchVenueTypes(); else showToast(data.message, 'error'); });
    };

    // Status badge helper
    const StatusBadge = ({ status }) => {
        const styles = {
            approved: 'bg-emerald-100 text-emerald-700',
            pending: 'bg-amber-100 text-amber-700',
            rejected: 'bg-red-100 text-red-700',
        };
        const labels = { approved: '운영', pending: '심사중', rejected: '반려' };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-4 md:space-y-6 pb-20 animate-fadeIn relative">

            {/* 1. Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {/* Total */}
                <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white shadow-lg shadow-indigo-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 className="text-sm font-bold opacity-90">전체 베뉴</h2>
                            <button onClick={handleOpenTypeModal} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="베뉴 유형 설정">
                                <Settings size={14} />
                            </button>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{stats.total}</h1>
                    </div>
                    <button
                        onClick={() => handleOpenDrawer()}
                        className="mt-3 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-xl transition-all font-bold text-xs md:text-sm"
                    >
                        <Plus size={14} /> 베뉴 등록
                    </button>
                </div>

                {/* Approved */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-400 text-[10px] md:text-xs font-bold mb-1">승인</div>
                    <div className="text-xl md:text-2xl font-extrabold text-emerald-600">{stats.approved}</div>
                </div>
                {/* Pending */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-400 text-[10px] md:text-xs font-bold mb-1">심사 대기</div>
                    <div className="text-xl md:text-2xl font-extrabold text-amber-600">{stats.pending}</div>
                </div>
                {/* Avg Price */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-400 text-[10px] md:text-xs font-bold mb-1">평균 임대료</div>
                    <div className="text-lg md:text-2xl font-extrabold text-gray-900">{`₩${stats.avgPrice.toLocaleString()}`}</div>
                </div>
                {/* Vendor Count */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-400 text-[10px] md:text-xs font-bold mb-1">등록 벤더</div>
                    <div className="flex items-center gap-2">
                        <div className="text-xl md:text-2xl font-extrabold text-indigo-600">{stats.vendorCount}</div>
                        <Users size={16} className="text-indigo-400" />
                    </div>
                </div>
            </div>

            {/* 2. Control Bar */}
            <div className="flex flex-col gap-3 md:gap-4 sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-3 md:py-4 border-b border-white/50">

                {/* Top Row: Search & Status */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 md:gap-4">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="베뉴 이름, 위치, 벤더 검색.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm overflow-x-auto hide-scrollbar">
                        {['all', 'approved', 'pending', 'rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${filterStatus === status
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'all' ? '전체' : status === 'approved' ? '승인' : status === 'pending' ? '심사' : '반려'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Row: Filters & Sort */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {/* Vendor Filter */}
                    <select
                        value={filterVendor}
                        onChange={(e) => setFilterVendor(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors max-w-[140px] md:max-w-[200px]"
                    >
                        <option value="all">모든 벤더</option>
                        {vendorList.map(([email, name]) => (
                            <option key={email} value={email}>{name}</option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <option value="all">모든 타입</option>
                        <option value="popup">팝업스토어</option>
                        <option value="gallery">갤러리</option>
                        <option value="cafe">카페</option>
                        <option value="flea_market">플리마켓</option>
                        <option value="showroom">쇼룸</option>
                    </select>

                    {/* Size Filter */}
                    <div className="hidden md:flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm shrink-0">
                        {['all', 'small', 'medium', 'large'].map(size => (
                            <button
                                key={size}
                                onClick={() => setFilterCategory(size)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${filterCategory === size
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {size === 'all' ? '전체' : size}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-indigo-500 shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="newest">최신</option>
                                <option value="oldest">오래된순</option>
                                <option value="price_high">{"\uAC00\uACA9 \uB192\uC740\uC21C"}</option>
                                <option value="price_low">{"\uAC00\uACA9 \uB0AE\uC740\uC21C"}</option>
                                <option value="name_asc">이름</option>
                                <option value="vendor">벤더</option>
                            </select>
                            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        {/* View Mode */}
                        <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm shrink-0">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 md:p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 md:p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result count */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-bold text-gray-600">{filteredVenues.length}</span>개 베뉴
                    {filterVendor !== 'all' && <span className="text-indigo-500">· {vendorList.find(([e]) => e === filterVendor)?.[1]} 벤더</span>}
                </div>
            </div>

            {/* 3. Per-Venue Stats Panel (Slide-down) */}
            {venueStats && (
                <div className="bg-white rounded-2xl md:rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">{venueStats.name}</h3>
                                <p className="text-xs text-gray-500">베뉴 상세 통계</p>
                            </div>
                        </div>
                        <button onClick={() => setStatsVenue(null)} className="p-2 hover:bg-white/80 rounded-lg transition-colors">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>
                    <div className="p-4 md:p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">상태</div>
                                <StatusBadge status={venueStats.status} />
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">임대료</div>
                                <div className="text-base md:text-lg font-bold text-gray-900">{`₩${venueStats.price.toLocaleString()}`}</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">타입</div>
                                <div className="text-sm font-bold text-gray-700 uppercase">{venueStats.type}</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-gray-400 font-bold mb-1">모집 정원</div>
                                <div className="text-base md:text-lg font-bold text-gray-900">{venueStats.maxSellers > 0 ? `${venueStats.maxSellers}명` : '제한없음'}</div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3 md:p-4">
                                <Users size={18} className="text-indigo-500 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">벤더</div>
                                    <div className="text-sm font-bold text-gray-900">{venueStats.owner}</div>
                                    <div className="text-[10px] text-gray-400">{venueStats.ownerEmail}</div>
                                </div>
                                <div className="ml-auto text-right">
                                    <div className="text-xs text-gray-500">보유 베뉴</div>
                                    <div className="text-lg font-bold text-indigo-600">{venueStats.ownerVenueCount}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 md:p-4">
                                <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs text-gray-500">위치</div>
                                    <div className="text-sm font-bold text-gray-900 truncate">{venueStats.location}</div>
                                </div>
                                <div className="ml-auto text-right flex-shrink-0">
                                    <div className="text-xs text-gray-500">등록</div>
                                    <div className="text-sm font-bold text-gray-700">{venueStats.createdAt ? new Date(venueStats.createdAt).toLocaleDateString('ko-KR') : '-'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => { handleOpenDrawer(statsVenue); }}
                                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 size={14} /> 수정하기
                            </button>
                            <button
                                onClick={() => { setFilterVendor(venueStats.ownerEmail); setStatsVenue(null); }}
                                className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
                            >
                                <Filter size={14} /> 이 벤더 필터
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Content Area */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div></div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[320px] md:auto-rows-[350px]">
                    {filteredVenues.map((venue, idx) => (
                        <div
                            key={venue.id}
                            className={`group relative rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100
                                    ${idx % 7 === 0 ? 'md:col-span-2 md:row-span-1' : ''} 
                            `}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 bg-gray-200">
                                <img
                                    src={venue.images && venue.images[0] ? venue.images[0] : `https://source.unsplash.com/random/800x600?interior,${idx}`}
                                    alt={venue.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2">
                                <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] md:text-xs font-extrabold px-2 md:px-3 py-1 rounded-full uppercase tracking-wide">
                                    {venue.type}
                                </span>
                            </div>

                            {/* Quick Actions (Hover) */}
                            <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <button onClick={() => setStatsVenue(venue)} className="p-2 bg-white text-indigo-600 rounded-full hover:bg-indigo-500 hover:text-white transition-colors shadow-lg">
                                    <BarChart3 size={14} />
                                </button>
                                <button onClick={() => handleOpenDrawer(venue)} className="p-2 bg-white text-gray-900 rounded-full hover:bg-indigo-500 hover:text-white transition-colors shadow-lg">
                                    <Edit3 size={14} />
                                </button>
                                <button onClick={() => handleDelete(venue.id)} className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Info Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {venue.owner_name && (
                                    <div className="text-[10px] text-indigo-200 font-bold mb-1 flex items-center gap-1">
                                        <Users size={10} /> {venue.owner_name}
                                    </div>
                                )}
                                <div className="flex justify-between items-end">
                                    <div className="w-2/3">
                                        <h3 className="text-lg md:text-xl font-bold truncate leading-tight mb-1">{venue.name}</h3>
                                        <p className="text-gray-300 text-xs md:text-sm flex items-center gap-1">
                                            <MapPin size={11} /> <span className="truncate">{venue.location}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg md:text-xl font-extrabold text-indigo-300">{`₩${parseInt(venue.price).toLocaleString()}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={() => handleOpenDrawer()}
                        className="rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 transition-all gap-3"
                    >
                        <div className="p-4 bg-gray-100 rounded-full"><Plus size={28} /></div>
                        <span className="font-bold text-sm">새 베뉴 등록하기</span>
                    </button>
                </div>
            ) : (
                /* List View — Mobile-optimized card rows instead of table */
                <div className="space-y-2 md:space-y-3">
                    {filteredVenues.map(venue => (
                        <div key={venue.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-row items-stretch">
                                {/* Thumbnail */}
                                <div className="w-20 sm:w-28 md:w-36 flex-shrink-0 relative bg-gray-100 overflow-hidden">
                                    {venue.images && venue.images[0] ? (
                                        <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300"><Store size={24} strokeWidth={1} /></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-3 md:p-4 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                <h3 className="text-sm md:text-base font-bold text-gray-900 truncate">{venue.name}</h3>
                                                <StatusBadge status={venue.status} />
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500">
                                                <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{venue.location}</span>
                                            </div>
                                            {venue.owner_name && (
                                                <div className="flex items-center gap-1 mt-0.5 text-[10px] md:text-[11px] text-indigo-500 font-medium">
                                                    <Users size={10} className="flex-shrink-0" />
                                                    <span className="truncate">{venue.owner_name}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => setStatsVenue(venue)}
                                                className="p-1.5 md:p-2 rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                title="통계 보기"
                                            >
                                                <BarChart3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDrawer(venue)}
                                                className="p-1.5 md:p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                                title="수정"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(venue.id)}
                                                className="p-1.5 md:p-2 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom info row */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                        <span className="text-sm md:text-base font-bold text-gray-900">{`₩${parseInt(venue.price).toLocaleString()}`}</span>
                                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{venue.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredVenues.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">조건에 맞는 베뉴가 없어요</h3>
                            <p className="text-sm text-gray-500">다른 조건이나 필터를 시도해보세요!</p>
                        </div>
                    )}
                </div>
            )
            }

            {/* 5. Modal */}
            <VenueModal
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                venue={selectedVenue}
                onSubmit={handleModalSubmit}
                onDelete={selectedVenue ? () => handleDelete(selectedVenue.id) : null}
                isAdmin={true}
            />

            {/* 6. Type Management Modal */}
            {
                isTypeModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsTypeModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                            <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-base md:text-lg font-bold">베뉴 타입 관리</h3>
                                <button onClick={() => setIsTypeModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            <div className="p-4 md:p-5">
                                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                                    <input
                                        placeholder="코드 (예: flea_market)"
                                        className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
                                        value={newTypeCode}
                                        onChange={e => setNewTypeCode(e.target.value)}
                                    />
                                    <input
                                        placeholder="이름 (예: 플리마켓)"
                                        className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
                                        value={newTypeName}
                                        onChange={e => setNewTypeName(e.target.value)}
                                    />
                                    <button onClick={handleAddType} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 whitespace-nowrap">추가</button>
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {venueTypes.map(type => (
                                        <div key={type.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
                                            <div>
                                                <div className="font-bold text-sm text-gray-800">{type.name}</div>
                                                <div className="text-xs text-gray-400">{type.code}</div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleType(type.id, type.is_active)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${type.is_active == 1 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                {type.is_active == 1 ? '사용중' : '사용안함'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <ConfirmModal modal={confirmModal} onClose={() => setConfirmModal(null)} />
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default AdminVenues;
