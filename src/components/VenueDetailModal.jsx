import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Heart, Sparkles, ChevronLeft, ChevronRight, Store, Share2, Link2, Check, ExternalLink, Users, Calendar, Ruler, Clock, Coins, Tag, BarChart3 } from 'lucide-react';
import KakaoMap from './KakaoMap';

const CATEGORY_OPTIONS = { food: '음식/요리', fashion: '패션/의류', beauty: '뷰티/화장품', art: '예술/공예', digital: '디지털/전자', lifestyle: '라이프스타일', pet: '반려동물', kids: '키즈/유아', sports: '스포츠/아웃도어', book: '도서/문구', eco: '친환경/에코', local: '지역특산물', health: '건강/웰빙', handmade: '핸드메이드', vintage: '빈티지/레트로', other: '기타' };
const typeLabels = { popup: '팝업스토어', gallery: '갤러리', cafe: '카페', showroom: '쇼룸', fleamarket: '플리마켓', store: '매장' };
const sizeLabels = { small: '소형 (10평 미만)', medium: '중형 (10~30평)', large: '대형 (30평 이상)' };

const VenueDetailModal = ({ venue, onClose, onApply, onToggleWishlist, isApplied, isWishlisted, getPricingUnitLabel, isVendor = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareMenuRef = useRef(null);

    // Close share menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
                setShowShareMenu(false);
            }
        };
        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showShareMenu]);

    if (!venue) return null;

    const images = Array.isArray(venue.images) ? venue.images : [];

    const prevImage = () => setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
    const nextImage = () => setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1));

    // Type labels
    const typeLabels = {
        popup: '팝업스토어', gallery: '갤러리', cafe: '카페',
        showroom: '쇼룸', fleamarket: '플리마켓', store: '매장'
    };

    // Size labels
    const sizeLabels = {
        small: '소형 (10평 미만)', medium: '중형 (10~30평)', large: '대형 (30평 이상)'
    };

    // Pricing unit labels
    const unitLabels = {
        daily: '/일', weekly: '/주', monthly: '/월'
    };

    // Share handlers
    const venueUrl = `${window.location.origin}/venues/${venue.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(venueUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = venueUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title: venue.name,
                text: `${venue.name} - ${venue.location}`,
                url: venueUrl
            });
        } catch { }
        setShowShareMenu(false);
    };

    const handleKakaoShare = () => {
        const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=javascript_key&url=${encodeURIComponent(venueUrl)}&text=${encodeURIComponent(venue.name)}`;
        window.open(kakaoUrl, '_blank', 'width=500,height=600');
        setShowShareMenu(false);
    };

    const handleShareClick = () => {
        if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
            handleNativeShare();
        } else {
            setShowShareMenu(!showShareMenu);
        }
    };

    const commissionRate = parseFloat(venue.commission_rate) || 0;
    const approvedCount = venue.approved_count || 0;
    const maxSellers = venue.max_sellers || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Modal ??overflow-y-auto on mobile, hidden on desktop (right panel scrolls independently) */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md"
                >
                    <X size={18} />
                </button>

                {/* Left: Image Gallery with Swipe */}
                <div className="w-full md:w-1/2 bg-gray-900 relative group flex-shrink-0" style={{ minHeight: '280px' }}>
                    <div
                        className="w-full h-72 md:h-full md:min-h-[500px] relative overflow-hidden select-none"
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            e.currentTarget._touchStartX = touch.clientX;
                            e.currentTarget._touchStartY = touch.clientY;
                            e.currentTarget._swiping = false;
                        }}
                        onTouchMove={(e) => {
                            if (!e.currentTarget._touchStartX) return;
                            const dx = e.touches[0].clientX - e.currentTarget._touchStartX;
                            const dy = e.touches[0].clientY - e.currentTarget._touchStartY;
                            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                                e.currentTarget._swiping = true;
                            }
                        }}
                        onTouchEnd={(e) => {
                            if (!e.currentTarget._touchStartX) return;
                            const dx = e.changedTouches[0].clientX - e.currentTarget._touchStartX;
                            if (e.currentTarget._swiping && Math.abs(dx) > 50 && images.length > 1) {
                                if (dx < 0) nextImage();
                                else prevImage();
                            }
                            e.currentTarget._touchStartX = null;
                            e.currentTarget._swiping = false;
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget._dragStartX = e.clientX;
                        }}
                        onMouseUp={(e) => {
                            if (!e.currentTarget._dragStartX) return;
                            const dx = e.clientX - e.currentTarget._dragStartX;
                            if (Math.abs(dx) > 50 && images.length > 1) {
                                if (dx < 0) nextImage();
                                else prevImage();
                            }
                            e.currentTarget._dragStartX = null;
                        }}
                    >
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[currentImageIndex]}
                                    alt={venue.name}
                                    className="w-full h-full object-contain"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200"
                                        >
                                            <ChevronLeft size={22} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all duration-200"
                                        >
                                            <ChevronRight size={22} />
                                        </button>
                                        {/* Counter Badge */}
                                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-medium">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                        {/* Dot Indicators */}
                                        {images.length > 1 && images.length <= 10 && (
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                                {images.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                        className={`rounded-full transition-all duration-300 ${idx === currentImageIndex
                                                            ? 'w-5 h-2 bg-white'
                                                            : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <Store size={64} strokeWidth={1} />
                                <span className="mt-4 text-sm">등록된 이미지가 없습니다</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Info panel */}
                <div className="w-full md:w-1/2 flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-5 md:p-7 flex-1">
                        {/* Header */}
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {typeLabels[venue.type] || venue.type}
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                    <MapPin size={12} />
                                    <span className="truncate max-w-[200px]">{venue.location}</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{venue.name}</h2>
                        </div>

                        {/* ???? Price & Commission ???? */}
                        <div className="mb-5 pb-5 border-b border-gray-100">
                            <div className="flex items-end gap-1 mb-3">
                                {Number(venue.price) === 0 ? (
                                    <span className="text-2xl font-bold text-emerald-600">무료</span>
                                ) : (
                                    <>
                                        <span className="text-sm text-gray-500 font-medium">월 임대료</span>
                                        <span className="text-2xl font-bold text-indigo-600 ml-1">{`₩${Number(venue.price).toLocaleString()}`}</span>
                                        <span className="text-gray-400 font-medium mb-0.5 text-sm">{unitLabels[venue.pricing_unit] || (getPricingUnitLabel ? getPricingUnitLabel(venue.pricing_unit) : '')}</span>
                                    </>
                                )}
                            </div>

                            {/* Commission ??always visible */}
                            <div className={`p-3 rounded-xl border ${commissionRate > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-bold flex items-center gap-1.5 ${commissionRate > 0 ? 'text-orange-700' : 'text-gray-500'}`}>
                                        <BarChart3 size={14} />
                                        수수료
                                    </span>
                                    <span className={`text-lg font-extrabold ${commissionRate > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                        {commissionRate > 0 ? `${commissionRate}%` : '없음'}
                                    </span>
                                </div>
                                {commissionRate > 0 && (
                                    <p className="text-xs text-orange-500 mt-1">매출 기반 수수료가 적용됩니다</p>
                                )}
                            </div>
                        </div>

                        {/* ???? Space Detail Grid ???? */}
                        <div className="mb-5 pb-5 border-b border-gray-100">
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Tag size={16} className="text-indigo-500" />
                                    공간 상세 정보
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* 공간 유형 */}
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Store size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-500">공간 유형</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">{typeLabels[venue.type] || venue.type}</span>
                                    </div>
                                    {/* 위치 */}
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <MapPin size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-500">지역</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">{venue.region || "미정"}</span>
                                    </div>
                                    {/* 공간 크기 */}
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Ruler size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-500">공간 규모</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">{sizeLabels[venue.size] || venue.size || "미정"}</span>
                                    </div>
                                    {/* 가격 단위 */}
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Coins size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-500">가격 단위</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">{venue.pricing_unit === 'daily' ? '일간' : venue.pricing_unit === 'weekly' ? '주간' : venue.pricing_unit === 'monthly' ? '월간' : venue.pricing_unit || '미정'}</span>
                                    </div>
                                    {/* 최대 셀러 */}
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Users size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-500">최대 셀러</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">{venue.max_sellers || "제한 없음"} 명</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sales & Category Section */}
                            {(venue.avg_sales || (() => { try { const p = typeof venue.popular_categories === 'string' ? JSON.parse(venue.popular_categories) : venue.popular_categories; return Array.isArray(p) && p.length > 0; } catch { return false; } })()) && (
                                <div className="mb-5 pb-5 border-b border-gray-100">
                                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <BarChart3 size={16} className="text-amber-500" />
                                        매출 & 카테고리 정보
                                    </h3>
                                    <div className="space-y-3">
                                        {venue.avg_sales && (
                                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Coins size={12} className="text-amber-600" />
                                                    <span className="text-[11px] font-medium text-amber-700">평균 매출</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{venue.avg_sales}</span>
                                            </div>
                                        )}
                                        {(() => {
                                            let cats = [];
                                            try {
                                                cats = typeof venue.popular_categories === 'string' ? JSON.parse(venue.popular_categories) : venue.popular_categories;
                                                if (!Array.isArray(cats)) cats = [];
                                            } catch { cats = []; }
                                            if (cats.length === 0) return null;
                                            return (
                                                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <Tag size={12} className="text-teal-600" />
                                                        <span className="text-[11px] font-medium text-teal-700">인기 카테고리</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {cats.map((cat, i) => {
                                                            const found = Object.entries(CATEGORY_OPTIONS).find(([k]) => k === cat);
                                                            return (
                                                                <span key={i} className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">
                                                                    {found ? found[1] : cat}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Schedule Section */}
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-500" />
                                    일정 정보
                                </h3>

                                {/* 모집 기간 */}
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Clock size={13} className="text-blue-600" />
                                        <span className="text-xs font-bold text-blue-800">모집 기간</span>
                                    </div>
                                    {(venue.recruitment_start || venue.recruitment_end) ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-[10px] text-gray-500">시작</span>
                                                <p className="text-sm font-bold text-gray-800">{venue.recruitment_start ? new Date(venue.recruitment_start).toLocaleDateString('ko-KR') : '미정'}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-gray-500">마감</span>
                                                <p className="text-sm font-bold text-gray-800">{venue.recruitment_end ? new Date(venue.recruitment_end).toLocaleDateString('ko-KR') : '미정'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-blue-500">모집 기간이 설정되지 않았습니다</p>
                                    )}
                                </div>

                                {/* 행사 기간 */}
                                {(() => {
                                    let periods = [];
                                    if (venue.event_periods) {
                                        try {
                                            const parsed = typeof venue.event_periods === 'string' ? JSON.parse(venue.event_periods) : venue.event_periods;
                                            if (Array.isArray(parsed)) periods = parsed.filter(p => p.start || p.end);
                                        } catch { }
                                    }
                                    if (periods.length === 0 && (venue.event_start || venue.event_end)) {
                                        periods = [{ start: venue.event_start || '', end: venue.event_end || '' }];
                                    }

                                    return periods.length > 0 ? (
                                        <div className="space-y-2">
                                            {periods.map((period, idx) => (
                                                <div key={idx} className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <Calendar size={13} className="text-purple-600" />
                                                        <span className="text-xs font-bold text-purple-800">
                                                            {periods.length > 1 ? `행사 기간 ${idx + 1}` : '행사 기간'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-[10px] text-gray-500">시작</span>
                                                            <p className="text-sm font-bold text-gray-800">{period.start ? new Date(period.start).toLocaleDateString('ko-KR') : '미정'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-gray-500">종료</span>
                                                            <p className="text-sm font-bold text-gray-800">{period.end ? new Date(period.end).toLocaleDateString('ko-KR') : '미정'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Calendar size={13} className="text-purple-600" />
                                                <span className="text-xs font-bold text-purple-800">행사 기간</span>
                                            </div>
                                            <p className="text-xs text-purple-500">행사 기간이 설정되지 않았습니다</p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* ???? Recruitment Progress ???? */}
                            {maxSellers > 0 && (
                                <div className="mb-5 pb-5 border-b border-gray-100">
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-indigo-700 flex items-center gap-1.5">
                                                <Users size={14} />
                                                모집 ?�황
                                            </span>
                                            <span className="text-sm font-bold text-indigo-600">
                                                {approvedCount} / {maxSellers}명?
                                            </span>
                                        </div>
                                        <div className="w-full bg-indigo-200 rounded-full h-2.5">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (approvedCount / maxSellers) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-indigo-500 mt-1.5">
                                            {approvedCount >= maxSellers
                                                ? '모집이 완료되었습니다' : `${maxSellers - approvedCount}자리 남았습니다`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-2">공간 소개</h3>
                                <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-600">
                                    {venue.description || "이 공간에 대한 자세한 설명이 없습니다."}
                                </p>
                            </div>

                            {/* Map */}
                            {venue.latitude && venue.longitude && (
                                <div className="mb-2">
                                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <MapPin size={16} className="text-indigo-500" />
                                        위치
                                    </h3>
                                    <KakaoMap
                                        venues={[venue]}
                                        singleMode={true}
                                        height="220px"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer Actions ??sticky bottom */}
                        <div className="sticky bottom-0 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex gap-3">
                            <button
                                onClick={() => onToggleWishlist(venue.id)}
                                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-center flex-shrink-0
                                ${isWishlisted
                                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                                        : 'border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:text-rose-500'
                                    }`}
                            >
                                <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            {/* Share Button */}
                            <div className="relative" ref={shareMenuRef}>
                                <button
                                    onClick={handleShareClick}
                                    className="p-3 rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-indigo-200 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center flex-shrink-0"
                                    title="공유하기"
                                >
                                    <Share2 size={22} />
                                </button>

                                {/* Share Dropdown */}
                                {showShareMenu && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                        style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                            <p className="text-xs font-bold text-gray-700">공유하기</p>
                                        </div>
                                        <div className="p-1.5">
                                            <button
                                                onClick={handleCopyLink}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors group"
                                            >
                                                {copied ? (
                                                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-lg">
                                                        <Check size={16} className="text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                                                        <Link2 size={16} className="text-gray-500 group-hover:text-indigo-600" />
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <p className={`text-sm font-bold ${copied ? 'text-emerald-600' : 'text-gray-700'}`}>
                                                        {copied ? '복사 완료!' : '링크 복사'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">URL을 클립보드에 복사합니다</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={handleKakaoShare}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-yellow-50 transition-colors group"
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
                                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#3C1E1E">
                                                        <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.69 1.76 5.04 4.4 6.38l-1.12 4.12c-.1.36.3.65.6.44L10.5 18.5c.49.06 1 .1 1.5.1 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-gray-700">카카오톡</p>
                                                    <p className="text-[10px] text-gray-400">카카오톡으로 공유합니다</p>
                                                </div>
                                            </button>
                                            {navigator.share && (
                                                <button
                                                    onClick={handleNativeShare}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                                                >
                                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                                                        <ExternalLink size={16} className="text-blue-600" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold text-gray-700">다른 앱으로 공유</p>
                                                        <p className="text-[10px] text-gray-400">시스템 공유 메뉴를 엽니다</p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => onApply(venue)}
                                disabled={isApplied || isVendor}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-base py-3 transition-all shadow-lg
                                ${isVendor
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : isApplied ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
                                    }`}
                            >
                                {isVendor ? (
                                    <span>벤더 계정은 신청 불가</span>
                                ) : isApplied ? (
                                    <>
                                        <Sparkles size={18} />
                                        <span>신청 완료</span>
                                    </>
                                ) : (
                                    <span>입점 신청하기</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailModal;
