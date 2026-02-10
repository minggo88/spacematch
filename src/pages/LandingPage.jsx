import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import AdSlot from '../components/AdSlot';
import {
    ArrowRight, Store, ShoppingBag, Users, Sparkles, ChevronDown,
    MapPin, TrendingUp, Shield, Zap, CheckCircle, Star, Building,
    MessageCircle, Flame, Clock, Eye, Heart, Share2
} from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [hotPromos, setHotPromos] = useState([]);
    const [promosLoading, setPromosLoading] = useState(true);

    const dashboardPath = user
        ? user.role === 'superadmin' || user.role === 'admin'
            ? '/admin'
            : user.role === 'vendor'
                ? '/vendor'
                : '/seller'
        : null;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
        );
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Fetch hot promotions from API
    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const res = await fetch('/api/promotions/get_promotions.php');
                const json = await res.json();
                if (json.success) {
                    // Combine hot_top and hot_mid for homepage display (max 6)
                    const combined = [...(json.hot_top || []), ...(json.hot_mid || [])].slice(0, 6);
                    setHotPromos(combined);
                }
            } catch (e) { console.error('프로모션 로드 실패:', e); }
            finally { setPromosLoading(false); }
        };
        fetchPromos();
    }, []);

    const getDday = (deadline) => {
        if (!deadline) return null;
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: '마감', color: 'bg-gray-500' };
        if (diff === 0) return { text: 'D-DAY', color: 'bg-red-500' };
        if (diff <= 3) return { text: `D-${diff}`, color: 'bg-red-500' };
        if (diff <= 7) return { text: `D-${diff}`, color: 'bg-orange-500' };
        return { text: `D-${diff}`, color: 'bg-blue-500' };
    };

    const getImageSrc = (images) => {
        if (!images || images.length === 0) return null;
        const img = images[0];
        if (typeof img === 'string') {
            return img.startsWith('/') ? img : `/${img}`;
        }
        return null;
    };

    const isVisible = (id) => visibleSections.has(id);

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <PublicNav transparent />

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
                    <div className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)'
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 right-1/3 w-48 md:w-64 h-48 md:h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}
                />

                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center pt-20 md:pt-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 md:mb-8 animate-fadeIn">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs md:text-sm font-medium">최적의 공간을 연결하는 플랫폼</span>
                    </div>

                    <h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.3] sm:leading-tight mb-4 md:mb-6 tracking-tight px-2 sm:px-0">
                        <span className="block sm:inline">당신의 브랜드에</span>
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
                            완벽한 공간</span>을
                        <br className="block sm:hidden" />
                        찾아드립니다
                    </h1>

                    <p className="text-[0.95rem] sm:text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-medium px-6 sm:px-4">
                        팝업스토어, 갤러리, 쇼룸 등
                        <br className="block sm:hidden" />
                        다양한 공간과 브랜드를 매칭해드립니다.
                        <br className="hidden md:block" />
                        지금 바로 SpaceMatch에서 시작하세요!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4">
                        <Link
                            to={dashboardPath || "/signup"}
                            className="group w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white text-indigo-700 rounded-2xl font-extrabold text-base md:text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <p className="text-gray-400 text-sm mt-1">SpaceMatch가 엄선한 베스트 공간</p>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/services"
                            className="w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            자세히 알아보기
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/40 text-xs md:text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Shield size={14} />
                            <span>안전한 매칭</span>
                        </div>
                        <div className="w-px h-3 md:h-4 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <Zap size={14} />
                            <span>빠른 입점</span>
                        </div>
                        <div className="w-px h-3 md:h-4 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} />
                            <span>검증된 공간</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-white/30 text-xs font-medium hidden md:block">SCROLL</span>
                    <ChevronDown size={20} className="text-white/30" />
                </div>
            </section>

            {/* 긴급 모집 Preview */}
            {!promosLoading && hotPromos.length > 0 && (
                <section id="hot-promos" className="py-6 md:py-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="text-center mb-8 md:mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-full text-sm font-bold mb-4">
                                <Flame size={14} />
                                HOT RECRUITMENT
                            </div>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                                지금<span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">인기</span>
                                <br className="block sm:hidden" />
                                모집 정보
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
                                관리자가 선정한 인기 모집 공간을 확인하세요!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                            {hotPromos.map((venue, i) => {
                                const imgSrc = getImageSrc(venue.images);
                                const dday = getDday(venue.recruitment_deadline);
                                const typeLabel = venue.type === 'popup' ? '팝업스토어' : venue.type === 'gallery' ? '갤러리' : venue.type === 'cafe' ? '카페' : venue.type === 'showroom' ? '쇼룸' : venue.type === 'fleamarket' ? '플리마켓' : venue.type || '기타';
                                return (
                                    <div key={venue.promotion_id || i}
                                        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                        onClick={() => window.location.href = '/recruitment'}
                                    >
                                        {/* Image */}
                                        <div className="relative h-40 md:h-48 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Store size={40} className="text-orange-300" />
                                                </div>
                                            )}
                                            {/* HOT Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                                    <Flame size={12} /> HOT
                                                </span>
                                            </div>
                                            {/* D-Day Badge */}
                                            {dday && (
                                                <div className="absolute top-3 right-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${dday.color} text-white text-xs font-bold rounded-lg shadow-lg`}>
                                                        <Clock size={11} /> {dday.text}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="p-4 md:p-5 flex flex-col gap-1.5">
                                            {/* 1. Vendor Name */}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Building size={12} className="flex-shrink-0" />
                                                <span className="truncate font-medium">{venue.owner_name || '공간 제공자'}</span>
                                            </div>
                                            {/* 2. Type Label */}
                                            {venue.type && (
                                                <span className="inline-flex items-center gap-1 self-start px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
                                                    <Store size={11} />{typeLabel}
                                                </span>
                                            )}
                                            {/* 3. Title */}
                                            <h3 className="font-extrabold text-gray-900 text-base md:text-lg truncate group-hover:text-orange-600 transition-colors">{venue.name}</h3>
                                            {/* 4. Location */}
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <MapPin size={13} className="flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{venue.location || '위치 미정'}</span>
                                            </div>
                                            {/* 5. Deadline */}
                                            {venue.recruitment_deadline && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Clock size={12} className="flex-shrink-0 text-gray-400" />
                                                    <span>모집 마감: {venue.recruitment_deadline}</span>
                                                    {dday && <span className={`ml-auto px-1.5 py-0.5 ${dday.color} text-white text-[10px] font-bold rounded`}>{dday.text}</span>}
                                                </div>
                                            )}
                                            {/* 6. Action Buttons */}
                                            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                                                <Link
                                                    to={user ? (user.role === 'seller' ? '/seller' : user.role === 'vendor' ? '/vendor' : '/admin') : '/login'}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold text-center hover:bg-indigo-700 transition-colors"
                                                >
                                                    참여 신청하기
                                                </Link>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors"
                                                    title="좋아요"
                                                >
                                                    <Heart size={14} />
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try { await navigator.clipboard.writeText(`${window.location.origin}/recruitment`); alert('링크가 복사되었습니다! 📋'); } catch (e) { console.error(e); }
                                                    }}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors"
                                                    title="공유하기"
                                                >
                                                    <Share2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center">
                            <Link to="/recruitment" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-300">
                                <Eye size={16} />
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">이용 안내</h2>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Services Preview */}
            <section id="services-preview" data-animate className="py-12 md:py-16 lg:py-20 bg-gray-50">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('services-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                    <div className="text-center mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
                            <Sparkles size={14} />
                            SERVICES
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                            SpaceMatch{'가'} {'제공하는'}
                            <br className="block sm:hidden" />
                            로그인
                        </h2>
                        <p className="text-gray-500 text-[0.95rem] md:text-lg max-w-xl mx-auto px-4 sm:px-0">
                            셀러와 공간 제공자 모두를 위한
                            <br className="block sm:hidden" />
                            유일한 매칭 플랫폼
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                        {[
                            {
                                icon: <MapPin size={22} />,
                                title: '\uacf5\uac04 \uac80\uc0c9',
                                desc: '\uc804\uad6d \ud31d\uc5c5, \uac24\ub7ec\ub9ac, \uce74\ud398, \uc1fc\ub8f8 \ub4f1 \ub2e4\uc591\ud55c \uacf5\uac04\uc744 \ud55c\uacf3\uc5d0\uc11c \uac80\uc0c9\ud558\uace0 \ube44\uad50 \ubd84\uc11d\ud558\uc138\uc694.',
                                gradient: 'from-blue-500 to-indigo-600',
                                shadow: 'shadow-blue-200'
                            },
                            {
                                icon: <ShoppingBag size={22} />,
                                title: '\ube0c\ub79c\ub4dc \ub9e4\uce6d',
                                desc: '\uce74\ud14c\uace0\ub9ac, \uaddc\ubaa8\uc5d0 \ub9de\ub294 \ucd5c\uc801\uc758 \uacf5\uac04\uc744 \ube0c\ub79c\ub4dc\uc640 \uc790\ub3d9 \ub9e4\uce6d\ud574\ub4dc\ub9bd\ub2c8\ub2e4.',
                                gradient: 'from-violet-500 to-purple-600',
                                shadow: 'shadow-violet-200'
                            },
                            {
                                icon: <TrendingUp size={22} />,
                                title: '\uc6b4\uc601 \uad00\ub9ac',
                                desc: '\uc785\uc810 \uc2e0\uccad, \uc2b9\uc778, \uc218\uc218\ub8cc \uacb0\uc815\uae4c\uc9c0 \ubaa8\ub4e0 \ud504\ub85c\uc138\uc2a4\ub97c \ub300\uc2dc\ubcf4\ub4dc\uc5d0\uc11c \uad00\ub9ac\ud558\uc138\uc694.',
                                gradient: 'from-emerald-500 to-teal-600',
                                shadow: 'shadow-emerald-200'
                            },
                            {
                                icon: <Users size={22} />,
                                title: '\ucee4\ubba4\ub2c8\ud2f0',
                                desc: '\uc140\ub7ec\uc640 \ubca4\ub354\uac00 \uc18c\ud1b5\ud558\uace0 \ub124\ud2b8\uc6cc\ud0b9\ud558\ub294 \uc804\uc6a9 \ucee4\ubba4\ub2c8\ud2f0 \uacf5\uac04\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4.',
                                gradient: 'from-amber-500 to-orange-600',
                                shadow: 'shadow-amber-200'
                            }
                        ].map((service, i) => (
                            <div key={i}
                                className={`group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 border border-gray-100 hover:border-transparent hover:shadow-2xl ${service.shadow} transition-all duration-500 hover:-translate-y-2 cursor-default`}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-4 md:mb-5 shadow-lg ${service.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 font-bold text-sm md:text-base hover:bg-indigo-50 rounded-xl transition-all">
                            서비스 자세히 보기 <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ad Slot A */}
            <AdSlot slotId="home_a" format="banner" />

            {/* How It Works Preview */}
            <section id="how-preview" data-animate className="py-12 md:py-16 lg:py-20 bg-white">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('how-preview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                    <div className="text-center mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-sm font-bold mb-4">
                            <Zap size={14} />
                            HOW IT WORKS
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                            3{'단계로'} <br className="block sm:hidden" />
                            {'시작하세요'}
                        </h2>
                        <p className="text-gray-500 text-[0.95rem] md:text-lg max-w-xl mx-auto px-4 sm:px-0">
                            복잡한 절차 없이, 간단한 3단계로
                            <br className="block sm:hidden" />
                            매칭을 시작할 수 있습니다
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200" />

                        {[
                            {
                                step: '01',
                                title: '회원가입',
                                desc: '간단한 정보 입력으로 셀러 또는 벤더로 가입하세요. SNS 계정 연동으로 더욱 빠르게 시작할 수 있습니다.',
                                boxClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-xl shadow-indigo-200'
                            },
                            {
                                step: '02',
                                title: '공간 / 브랜드 탐색',
                                desc: '\uce74\ud14c\uace0\ub9ac, \uaddc\ubaa8\ubcc4\ub85c \ud544\ud130\ub9c1\ud558\uc5ec \ucd5c\uc801\uc758 \ud30c\ud2b8\ub108\ub97c \ucc3e\uc544\ubcf4\uc138\uc694. D-Day \ub9c8\uac10 \uae30\ub2a5\uc73c\ub85c \uae34\uae09 \ubaa8\uc9d1\ub3c4 \ud655\uc778 \uac00\ub2a5\ud569\ub2c8\ub2e4.',
                                boxClass: 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-xl shadow-violet-200'
                            },
                            {
                                step: '03',
                                title: '매칭 & 입점',
                                desc: '입점 신청 후 공간 제공자의 승인이 완료되면 바로 사업 운영을 시작할 수 있습니다.',
                                boxClass: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl shadow-purple-200'
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative text-center px-2">
                                <div className={`relative z-10 w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 md:mb-6 rounded-xl md:rounded-2xl ${item.boxClass} flex items-center justify-center`}>
                                    <span className="text-white text-xl md:text-2xl font-black">{item.step}</span>
                                </div>
                                <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2 md:mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:mt-10">
                        <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 text-violet-600 font-bold text-sm md:text-base hover:bg-violet-50 rounded-xl transition-all">
                            이용 방법 자세히 보기 <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* For Who Preview */}
            <section id="for-who" data-animate className="py-12 md:py-16 lg:py-20 bg-gray-50">
                <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${isVisible('for-who') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                    <div className="text-center mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold mb-4">
                            <Star size={14} />
                            WHO IS IT FOR
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                            {'모든 참여자를 위한'}
                            <br className="block sm:hidden" />
                            {'플랫폼'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                        <div className="relative group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                            <div className="p-6 md:p-8 lg:p-10">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-lg shadow-indigo-200">
                                    <ShoppingBag size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">입점 브랜드(셀러)</h3>
                                <p className="text-gray-500 mb-5 md:mb-6 leading-relaxed text-sm md:text-base">
                                    팝업스토어, 갤러리, 쇼룸 등 최적의 공간을 찾고 계신 브랜드 사장님을 위한 서비스입니다.
                                </p>
                                <ul className="space-y-2.5 md:space-y-3">
                                    {['전국 공간 검색 & 필터링', '간편한 입점 신청', '전용 이용 커뮤니티', '프로필 & 포트폴리오'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 md:gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-indigo-500 flex-shrink-0" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="relative group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <div className="p-6 md:p-8 lg:p-10">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-lg shadow-emerald-200">
                                    <Building size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">공간 제공자(벤더)</h3>
                                <p className="text-gray-500 mb-5 md:mb-6 leading-relaxed text-sm md:text-base">
                                    보유 공간에 입점할 브랜드를 효율적으로 모집하고 관리하시는 공간 오너를 위한 서비스입니다.
                                </p>
                                <ul className="space-y-2.5 md:space-y-3">
                                    {['공간 등록 & 사진 관리', '셀러 검색 & 모집', 'D-day 마감 관리', '벤더 전용 커뮤니티'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 md:gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8 md:mt-10">
                        <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 font-bold text-sm md:text-base hover:bg-emerald-50 rounded-xl transition-all">
                            더 알아보기 <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ad Slot B */}
            <AdSlot slotId="home_b" format="banner" />

            {/* Stats Section */}
            <section data-animate id="stats" className="py-16 md:py-20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)'
                    }}
                />
                <div className={`relative z-10 max-w-5xl mx-auto px-4 md:px-6 transition-all duration-1000 ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                        {[
                            { value: '500+', label: '등록 셀러', icon: <ShoppingBag size={18} /> },
                            { value: '200+', label: '등록 공간', icon: <Store size={18} /> },
                            { value: '1,000+', label: '매칭 완료', icon: <Users size={18} /> },
                            { value: '98%', label: '만족?', icon: <Star size={18} /> },
                        ].map((stat, i) => (
                            <div key={i} className="group">
                                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 group-hover:bg-white/20 transition-all">
                                    {stat.icon}
                                </div>
                                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1">{stat.value}</p>
                                <p className="text-indigo-300 text-xs md:text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" data-animate className="py-12 md:py-16 lg:py-20 bg-white">
                <div className={`max-w-4xl mx-auto px-4 md:px-6 text-center transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-bold mb-6">
                        <MessageCircle size={14} />
                        GET STARTED
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
                        {'지금 시작해 보세요'}</h2>
                    <p className="text-gray-500 text-[0.95rem] md:text-lg mb-8 md:mb-10 max-w-xl mx-auto px-4 sm:px-0">
                        무료 회원가입으로 SpaceMatch의
                        <br className="block sm:hidden" />
                        모든 기능을 경험하세요!
                        <br />
                        궁금한 점이 있으시면
                        <br className="block sm:hidden" />
                        언제든지 문의해 주세요!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 px-4">
                        <Link
                            to={dashboardPath || "/signup"}
                            className="group w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-indigo-600 text-white rounded-2xl font-extrabold text-base md:text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {dashboardPath ? '더 알아보기' : '무료 가입'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="http://pf.kakao.com/_xjGxoRX/chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-7 md:px-8 py-3.5 md:py-4 bg-yellow-400 text-gray-900 rounded-2xl font-bold text-base md:text-lg hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
                        >
                            💬 문의하기
                        </a>
                    </div>

                    {!dashboardPath && (
                        <p className="text-sm text-gray-400">
                            이미 계정이 있으신가요?{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                                {'로그인'}</Link>
                        </p>
                    )}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default LandingPage;
