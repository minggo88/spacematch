import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import {
    MapPin, ShoppingBag, TrendingUp, Users, ArrowRight,
    CheckCircle, BarChart3, Globe, Layers, Zap, Target, HeartHandshake
} from 'lucide-react';

const ServicesPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const services = [
        {
            icon: <MapPin size={28} />,
            title: '공간 탐색 & 매칭',
            subtitle: 'Space Discovery',
            gradient: 'from-blue-500 to-indigo-600',
            shadow: 'shadow-blue-200',
            desc: '전국 각지의 팝업스토어, 갤러리, 카페, 쇼룸, 백화점 팝업존 등 다양한 유형의 공간을 한 곳에서 검색하고 비교할 수 있습니다.',
            features: [
                '지역별, 유형별, 규모별 상세 필터링',
                '실시간 공간 가용 현황 확인',
                '공간 사진 및 상세 정보 열람',
                '관심 공간 저장 & 비교 기능'
            ]
        },
        {
            icon: <ShoppingBag size={28} />,
            title: '브랜드 매칭 서비스',
            subtitle: 'Brand Matching',
            gradient: 'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-200',
            desc: '공간 제공자와 입점 브랜드를 카테고리, 지역, 규모, 브랜드 성격에 맞춰 최적의 조합으로 매칭해 드립니다. AI 기반 추천으로 성공적인 팝업 운영을 지원합니다.',
            features: [
                '카테고리 기반 자동 추천',
                '브랜드 포트폴리오 기반 매칭',
                '과거 매칭 이력 참고',
                '프리미엄 셀러 & 벤더 우선 매칭'
            ]
        },
        {
            icon: <TrendingUp size={28} />,
            title: '운영 & 관리 도구',
            subtitle: 'Operations Management',
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
            desc: '입점 신청부터 승인, 일정 관리, 수수료 정산까지. 공간 운영에 필요한 모든 프로세스를 SpaceMatch 대시보드에서 한눈에 관리하세요.',
            features: [
                '입점 신청 및 승인 워크플로우',
                '계약 조건 및 수수료율 관리',
                'D-day 카운트다운 & 마감 관리',
                '실시간 현황 대시보드'
            ]
        },
        {
            icon: <Users size={28} />,
            title: '커뮤니티 & 네트워킹',
            subtitle: 'Community',
            gradient: 'from-amber-500 to-orange-600',
            shadow: 'shadow-amber-200',
            desc: '셀러와 벤더가 자유롭게 소통하고 정보를 공유하는 전용 커뮤니티 공간입니다. 업계 트렌드, 팝업 운영 노하우, 파트너 모집 등 다양한 주제로 교류하세요.',
            features: [
                '셀러 전용 / 벤더 전용 / 통합 게시판',
                '사진 업로드 & 라벨 태그 기능',
                '인기 게시물 자동 정렬',
                '파트너 모집 및 협업 공간'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120,119,198,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium mb-6">
                        <Layers size={14} />
                        SERVICES
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        SpaceMatch의
                        <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                            핵심 서비스
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        공간과 브랜드의 완벽한 만남을 위한 올인원 플랫폼.
                        <br className="hidden md:block" />
                        탐색부터 매칭, 운영까지 모든 것을 한 곳에서 해결하세요.
                    </p>
                </div>
            </section>

            {/* Services Detail */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
                    {services.map((service, i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}>
                            {/* Content */}
                            <div className="flex-1 w-full">
                                <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} items-center justify-center text-white mb-6 shadow-lg ${service.shadow}`}>
                                    {service.icon}
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{service.subtitle}</p>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{service.title}</h2>
                                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6">{service.desc}</p>
                                <ul className="space-y-3">
                                    {service.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm md:text-base text-gray-600">
                                            <CheckCircle size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Visual Card */}
                            <div className="flex-1 w-full">
                                <div className={`bg-gradient-to-br ${service.gradient} rounded-3xl p-8 md:p-10 text-white relative overflow-hidden min-h-[240px] md:min-h-[320px] flex items-center justify-center`}>
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
                                    />
                                    <div className="relative z-10 text-center">
                                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                                            {React.cloneElement(service.icon, { size: 40 })}
                                        </div>
                                        <p className="text-lg md:text-xl font-extrabold">{service.title}</p>
                                        <p className="text-white/60 text-sm mt-1">{service.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">준비되셨나요?</h2>
                    <p className="text-gray-500 text-base md:text-lg mb-8">
                        지금 무료로 가입하고 SpaceMatch의 모든 서비스를 경험하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            무료 회원가입
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center">
                            이용 방법 보기
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default ServicesPage;
