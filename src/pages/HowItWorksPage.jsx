import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import {
    ArrowRight, UserPlus, Search, Handshake, CheckCircle,
    Zap, ClipboardList, MessageSquare, Star, Shield
} from 'lucide-react';

const HowItWorksPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const sellerSteps = [
        {
            step: '01',
            icon: <UserPlus size={24} />,
            title: '회원가입',
            desc: '이메일과 기본 정보만으로 간편하게 셀러 계정을 만드세요. 사업자번호, 브랜드명, 카테고리 등을 입력하면 됩니다.',
            details: [
                '이메일 인증으로 빠른 가입',
                '사업자 정보 및 브랜드 소개 입력',
                '상품 카테고리 선택 (15개 카테고리 + 기타)',
                '프로필 사진 및 포트폴리오 업로드'
            ],
            color: 'indigo'
        },
        {
            step: '02',
            icon: <Search size={24} />,
            title: '공간 탐색 & 입점 신청',
            desc: '대시보드의 벤더 탐색 페이지에서 원하는 조건의 공간을 찾아보세요. 마음에 드는 공간에 바로 입점을 신청할 수 있습니다.',
            details: [
                '지역, 유형, 규모별 필터링 검색',
                '공간 상세 정보 및 사진 확인',
                'D-Day 카운트다운으로 마감 현황 파악',
                '클릭 한 번으로 입점 신청 완료'
            ],
            color: 'violet'
        },
        {
            step: '03',
            icon: <Handshake size={24} />,
            title: '매칭 & 운영 시작',
            desc: '공간 제공자가 신청을 승인하면 매칭이 완료됩니다. 대시보드에서 모든 입점 현황을 실시간으로 관리하세요.',
            details: [
                '실시간 승인/반려 알림',
                '수수료율 및 계약 조건 확인',
                '입점 이력 및 현황 대시보드',
                '커뮤니티를 통한 소통 & 네트워킹'
            ],
            color: 'purple'
        }
    ];

    const vendorSteps = [
        {
            step: '01',
            icon: <ClipboardList size={24} />,
            title: '공간 등록',
            desc: '보유한 공간의 정보를 등록하세요. 위치, 규모, 유형, 가격, 수수료율 등 상세 정보를 입력하고 사진을 업로드합니다.',
            details: [
                '주소 검색으로 편리한 위치 등록',
                '공간 사진 및 상세 설명 추가',
                '가격 및 수수료율 설정',
                '모집 마감 기한 설정 (D-day)'
            ],
            color: 'emerald'
        },
        {
            step: '02',
            icon: <Search size={24} />,
            title: '셀러 탐색 & 모집',
            desc: '셀러 탐색 페이지에서 브랜드들을 검색하고, 공간에 적합한 셀러를 찾아보세요. 프리미엄 셀러가 상단에 노출됩니다.',
            details: [
                '카테고리별 셀러 필터링',
                '셀러 프로필 및 포트폴리오 확인',
                '프리미엄 셀러 우선 확인',
                '직접 매칭 제안 가능'
            ],
            color: 'teal'
        },
        {
            step: '03',
            icon: <Star size={24} />,
            title: '승인 & 관리',
            desc: '셀러의 입점 신청을 검토하고 승인/반려할 수 있습니다. 대시보드에서 공간별 입점 현황과 모집 상태를 한눈에 관리하세요.',
            details: [
                '입점 신청 승인/반려 워크플로우',
                '공간별 입점 브랜드 현황 확인',
                '모집 완료 / 마감 상태 관리',
                '벤더 전용 커뮤니티 참여'
            ],
            color: 'cyan'
        }
    ];

    const StepCard = ({ item, index }) => {
        const colorMap = {
            indigo: { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
            violet: { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
            purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
            emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
            teal: { bg: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
            cyan: { bg: 'bg-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' }
        };
        const c = colorMap[item.color] || colorMap.indigo;

        return (
            <div className={`relative bg-white rounded-3xl border ${c.border} p-6 md:p-8 hover:shadow-xl transition-all duration-300`}>
                {/* Step badge */}
                <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        {item.icon}
                    </div>
                    <div>
                        <span className={`text-xs font-extrabold ${c.text} uppercase tracking-wider`}>STEP {item.step}</span>
                        <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
                    </div>
                </div>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-5">{item.desc}</p>
                <div className={`${c.light} rounded-2xl p-4`}>
                    <ul className="space-y-2.5">
                        {item.details.map((d, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <CheckCircle size={16} className={`${c.text} flex-shrink-0 mt-0.5`} />
                                <span className="font-medium">{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(167,139,250,0.4) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(99,102,241,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium mb-6">
                        <Zap size={14} />
                        HOW IT WORKS
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        간단한 3단계로
                        <br />
                        <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                            매칭을 시작하세요
                        </span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        셀러와 공간 제공자 각각에 맞는 맞춤형 프로세스를 제공합니다.
                        <br className="hidden md:block" />
                        복잡한 절차 없이, 빠르고 쉽게 시작할 수 있습니다.
                    </p>
                </div>
            </section>

            {/* Seller Process */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
                            🛍️ 입점 브랜드 (셀러)
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900">셀러 이용 방법</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {sellerSteps.map((step, i) => (
                            <StepCard key={i} item={step} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-5xl mx-auto px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Vendor Process */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold mb-4">
                            🏢 공간 제공자 (벤더)
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900">벤더 이용 방법</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {vendorSteps.map((step, i) => (
                            <StepCard key={i} item={step} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-10">자주 묻는 질문</h2>
                    <div className="space-y-4">
                        {[
                            { q: '가입비나 이용 수수료가 있나요?', a: '회원가입과 기본 서비스 이용은 무료입니다. 프리미엄 기능은 추후 안내될 예정입니다.' },
                            { q: '어떤 유형의 공간을 등록할 수 있나요?', a: '팝업스토어, 갤러리, 카페, 쇼룸, 백화점 팝업존, 공유오피스 등 다양한 유형의 공간을 등록할 수 있습니다.' },
                            { q: '입점 신청 후 승인까지 얼마나 걸리나요?', a: '공간 제공자가 직접 신청을 검토하므로 소요 시간은 달라질 수 있습니다. 보통 1~3일 이내에 결과를 확인하실 수 있습니다.' },
                            { q: '한 번에 여러 공간에 입점할 수 있나요?', a: '네, 셀러는 여러 공간에 동시에 입점 신청을 할 수 있습니다. 대시보드에서 모든 신청 현황을 한눈에 관리하세요.' }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 flex items-start gap-2">
                                    <MessageSquare size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                    {faq.q}
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed pl-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">지금 바로 시작하세요</h2>
                    <p className="text-gray-500 text-base md:text-lg mb-8">셀러든 벤더든, 1분이면 가입 완료!</p>
                    <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300">
                        무료 회원가입
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default HowItWorksPage;
