import React, { useEffect } from 'react';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const TermsPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <section className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 prose max-w-none text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {'본 약관은 회사가 제공하는 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n[여기에 실제 이용약관(청약철회/환불사항 포함) 내용이 게재될 예정입니다. 준비된 텍스트로 이곳을 교체해 주세요.]'}
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default TermsPage;
