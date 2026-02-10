import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import {
    MessageCircle, Phone, Mail, MapPin, Clock,
    ArrowRight, ExternalLink, Send
} from 'lucide-react';

const ContactPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-amber-950 via-orange-900 to-rose-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(251,146,60,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(244,63,94,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium mb-6">
                        <MessageCircle size={14} />
                        CONTACT
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                        궁금한 점이
                        <br />
                        <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                            있으신가요</span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        SpaceMatch 팀이 도와드리겠습니다.
                        <br className="hidden md:block" />
                        편하신 방법으로 언제든지 문의해 주세요.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
                        {/* KakaoTalk */}
                        <a
                            href="http://pf.kakao.com/_xjGxoRX/chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-7 md:p-8 border border-yellow-200 hover:shadow-2xl hover:shadow-yellow-100 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200">
                                    <span className="text-3xl">💬</span>
                                </div>
                                <ExternalLink size={20} className="text-yellow-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">카카오톡 문의</h3>
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
                                카카오톡 채널을 통해 실시간으로 문의하실 수 있습니다. 운영 시간 내 빠른 답변을 드립니다.
                            </p>
                            <span className="inline-flex items-center gap-1 text-yellow-700 font-bold text-sm">
                                채팅 시작하기 <ArrowRight size={14} />
                            </span>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:050407775410"
                            className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-7 md:p-8 border border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Phone size={28} className="text-white" />
                                </div>
                                <ExternalLink size={20} className="text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">전화 문의</h3>
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
                                직접 전화로 상담을 원하시면 아래 번호로 연락해 주세요. 영업일 기준 상담 가능합니다.
                            </p>
                            <span className="text-2xl font-black text-blue-600">0504-0777-5410</span>
                        </a>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 rounded-3xl p-7 md:p-10 border border-gray-100">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-6">기타 정보</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                    <MapPin size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">주소</p>
                                    <p className="text-sm text-gray-700 font-medium">서울시 용산구 이촌로</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                    <Clock size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">운영 시간</p>
                                    <p className="text-sm text-gray-700 font-medium">평일 09:00 ~ 18:00</p>
                                    <p className="text-xs text-gray-400">주말/공휴일 카카오톡 문의</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                                    <Send size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">빠른 응답</p>
                                    <p className="text-sm text-gray-700 font-medium">카카오톡 문의 권장</p>
                                    <p className="text-xs text-gray-400">평균 1시간 이내 답변</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">아직 회원이 아니신가요?</h2>
                    <p className="text-gray-500 text-base md:text-lg mb-8">
                        무료 가입 후 공간 탐색 및 브랜드 매칭 서비스를 이용하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            무료 회원가입
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 text-center">
                            로그인
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default ContactPage;
