import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const PublicFooter = () => {
    return (
        <footer className="bg-gray-950 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-extrabold text-lg">SpaceMatch</p>
                                <p className="text-gray-500 text-xs">셀러와 공간을 연결하는 플랫폼</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <Link to="/services" className="text-gray-400 hover:text-white transition-colors">서비스 소개</Link>
                            <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">이용 방법</Link>
                            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">회사 소개</Link>
                            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">문의하기</Link>
                        </div>
                    </div>

                    <div className="text-left md:text-right text-sm text-gray-500 space-y-1">
                        <p>상호명: 스페이스메치 / 대표자: 백세웅</p>
                        <p>사업자번호: 157-49-00421</p>
                        <p>서울시 용산구 이촌로</p>
                        <p>연락처: 050407775410 / <a href="http://pf.kakao.com/_xjGxoRX/chat" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">카카오톡 문의</a></p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-600 text-xs">
                        © 2025 SpaceMatch. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
