import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import {
    ArrowRight, Target, Eye, Heart, Shield, Lightbulb,
    ShoppingBag, Building, Users, TrendingUp, Globe, CheckCircle
} from 'lucide-react';

const AboutPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(6,182,212,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium mb-6">
                        <Heart size={14} />
                        ABOUT US
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        공간과 브랜드의
                        <br />
                        <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                            새로운 연결
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        SpaceMatch는 유휴 공간과 성장하는 브랜드를 연결하여
                        <br className="hidden md:block" />
                        새로운 비즈니스 기회를 만들어 가는 매칭 플랫폼입니다.
                    </p>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Mission */}
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-8 md:p-10 border border-indigo-100">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4">우리의 미션</h2>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                전국의 유휴 공간에 새로운 활력을 불어넣고, 성장하는 브랜드에 최적의 무대를 제공합니다.
                                SpaceMatch는 공간의 가치를 극대화하고, 브랜드에게는 고객과의 접점을 넓혀주는 가교 역할을 합니다.
                            </p>
                        </div>
                        {/* Vision */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-10 border border-emerald-100">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                                <Eye size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4">우리의 비전</h2>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                대한민국 No.1 공간-브랜드 매칭 플랫폼으로서, 누구나 쉽게 팝업스토어를 시작할 수 있는 생태계를 만들어갑니다.
                                온라인과 오프라인의 경계를 허물고, 새로운 리테일 경험을 선도합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">핵심 가치</h2>
                        <p className="text-gray-500 text-base md:text-lg">SpaceMatch를 이끄는 세 가지 원칙</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: <Shield size={24} />,
                                title: '신뢰 (Trust)',
                                desc: '검증된 공간과 브랜드만을 연결합니다. 사업자 확인, 공간 실사, 리뷰 시스템을 통해 안전한 매칭 환경을 보장합니다.',
                                gradient: 'from-blue-500 to-indigo-600',
                                shadow: 'shadow-blue-200'
                            },
                            {
                                icon: <Lightbulb size={24} />,
                                title: '혁신 (Innovation)',
                                desc: '데이터 기반 매칭 알고리즘과 직관적인 UX로 기존의 복잡한 공간 임대 프로세스를 혁신합니다. 기술로 더 나은 경험을 만듭니다.',
                                gradient: 'from-amber-500 to-orange-600',
                                shadow: 'shadow-amber-200'
                            },
                            {
                                icon: <Heart size={24} />,
                                title: '상생 (Win-Win)',
                                desc: '공간 제공자는 수익을, 브랜드는 성장을 얻을 수 있는 상생 모델을 추구합니다. 모든 참여자가 함께 성장하는 생태계를 만듭니다.',
                                gradient: 'from-rose-500 to-pink-600',
                                shadow: 'shadow-rose-200'
                            }
                        ].map((value, i) => (
                            <div key={i} className="bg-white rounded-3xl p-7 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-5 shadow-lg ${value.shadow}`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">이런 분들을 위해 만들었습니다</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Seller */}
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500">
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
                            <div className="p-7 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <ShoppingBag size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">입점 브랜드 (셀러)</h3>
                                        <p className="text-sm text-gray-400">Brand Owners</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-5 leading-relaxed text-sm md:text-base">
                                    팝업스토어, 전시회, 체험장 등을 통해 고객과 직접 만나고 싶은 브랜드와 사업자분들을 위한 서비스입니다.
                                </p>
                                <ul className="space-y-2.5">
                                    {[
                                        '온라인 브랜드의 오프라인 진출',
                                        'MZ세대 타겟 팝업 이벤트 기획',
                                        '신규 제품 론칭 & 전시',
                                        '지역 장터 및 플리마켓 참여',
                                        '포트폴리오 활용한 전문 프로필 구성'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Vendor */}
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-emerald-50 transition-all duration-500">
                            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <div className="p-7 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                        <Building size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">공간 제공자 (벤더)</h3>
                                        <p className="text-sm text-gray-400">Space Owners</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-5 leading-relaxed text-sm md:text-base">
                                    보유한 공간의 가치를 높이고, 다양한 브랜드를 유치하고 싶은 공간 소유자 및 관리자를 위한 서비스입니다.
                                </p>
                                <ul className="space-y-2.5">
                                    {[
                                        '유휴 공간의 효율적 활용',
                                        '다양한 브랜드 유치를 통한 집객 효과',
                                        '수수료 기반의 안정적 수익 모델',
                                        '공간 브랜딩 및 가치 향상',
                                        'D-Day 기반 모집 마감 관리'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120,119,198,0.4) 0%, transparent 60%)' }}
                />
                <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
                        SpaceMatch와 함께하세요
                    </h2>
                    <p className="text-white/60 text-base md:text-lg mb-8">
                        공간과 브랜드의 새로운 만남을 지금 시작하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 rounded-2xl font-extrabold text-lg shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            무료 회원가입
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 text-center">
                            서비스 알아보기
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default AboutPage;
