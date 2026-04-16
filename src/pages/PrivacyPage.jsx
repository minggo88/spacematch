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
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 text-gray-600 text-sm md:text-base leading-relaxed flex flex-col gap-8 break-keep">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. 개인정보의 수집 및 이용 목적</h2>
                        <p>스페이스매치는 다음의 목적을 위하여 개인정보를 최소한으로 수집 및 이용합니다. 수집된 개인정보는 다음 목적 이외의 용도로는 이용되지 않으며 목적이 달라질 경우 사전 동의를 구합니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별 및 부정이용 방지</li>
                            <li>스페이스매치 주요 서비스(공간 탐색, 입점 제안, 매칭, 대관 결제 등)의 원활한 제공</li>
                            <li>고객 상담, 불만 처리 등 민원 처리 및 중요한 공지사항 전달</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. 수집하는 개인정보의 항목 및 수집 방법</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>필수항목:</strong> 이메일 가입 밎 인증 정보, 영문/한글 이름(또는 담당자명), 연락처, 상호명 및 사업자등록정보(기업/호스트 회원의 경우)</li>
                            <li><strong>선택항목:</strong> 직책, 부서, 선호하는 팝업 공간 카테고리 등</li>
                            <li><strong>자동 수집 항목:</strong> 서비스 이용 기록, 접속 기기 로그, 쿠키(Cookie), 거래 결제 및 정산 관련 기록</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. 개인정보의 보유 및 이용기간</h2>
                        <p>원칙적으로, 이용자의 개인정보는 수집 및 이용 목적이 달성된 후(회원 탈퇴 시 등)에는 지체 없이 파기합니다. 단, 관계법령 규정에 의하여 보존할 필요가 있는 경우 다음과 같이 명시한 기간 동안 보존합니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>계약 또는 청약철회, 환불 등에 관한 기록: <strong>5년</strong> (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                            <li>대금결제 및 재화/서비스 등의 공급에 관한 기록: <strong>5년</strong></li>
                            <li>소비자의 불만 또는 분쟁처리에 관한 기록: <strong>3년</strong></li>
                            <li>접속 로그에 관한 기록: <strong>3개월</strong> (통신비밀보호법)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공 및 공유</h2>
                        <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 공간 대여 및 매칭 관련 계약이 성립되어 <strong>커뮤니케이션 및 상호 거래가 불가피한 경우</strong> 원활한 서비스 이행을 위해 당사자(셀러와 호스트) 간에 필수적인 정보(담당자 연락처, 상호명 등)가 제한적으로 제공됩니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. 이용자의 권리와 그 행사방법</h2>
                        <p>이용자는 언제든지 스페이스매치 마이페이지(프로필 설정)를 통해 등록되어 있는 자신의 개인정보를 열람하거나 수정할 수 있으며, 동의 철회 및 회원가입 해지(탈퇴)를 요청할 수 있습니다. 정상적인 처리가 어려운 경우 고객센터(이메일 접수 등)로 연락 주시면 신속하게 조치해 드립니다.</p>
                    </section>
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPage;
