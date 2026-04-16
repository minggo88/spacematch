import React, { useEffect } from 'react';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const PrivacyPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <section className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 prose max-w-none text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {'회사는 이용자의 개인정보를 중요시하며, 개인정보보호법 및 관련 법령을 준수하고 있습니다.\n\n[여기에 실제 개인정보처리방침 내용이 게재될 예정입니다. 준비된 텍스트로 이곳을 교체해 주세요.]'}
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPage;
