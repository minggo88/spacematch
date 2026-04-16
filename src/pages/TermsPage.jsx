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
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 text-gray-600 text-sm md:text-base leading-relaxed flex flex-col gap-8 break-keep">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">제1조 (목적)</h2>
                        <p>본 약관은 "스페이스매치(SpaceMatch)"(이하 "회사")가 제공하는 공간 중개 플랫폼 및 관련 제반 서비스의 이용과 관련하여, 회사와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">제2조 (용어의 정의)</h2>
                        <p>1. "서비스"란 회사가 플랫폼(웹/모바일)을 통해 제공하는 공간 탐색, 중개, 매칭 및 제반 서비스를 의미합니다.</p>
                        <p className="mt-1">2. "호스트"란 회사의 서비스에 공간을 등록하여 대여를 제공하거나 제안을 받는 회원을 말합니다.</p>
                        <p className="mt-1">3. "셀러(브랜드)"란 호스트의 공간을 대여하기 위해 서비스를 이용하는 회원을 말합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">제3조 (서비스의 성격 및 책임 한계)</h2>
                        <p>회사는 호스트와 셀러 간의 편리한 공간 대여 및 팝업 매칭을 위한 통신판매중개 시스템을 제공할 뿐이며, 각 당사자가 직접 협의 및 거래하는 정보에 대하여 직접적인 판매자 또는 구매자로서의 의무를 부담하지 않습니다. 거래에 따른 제반 책임은 거래 당사자인 회원들에게 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">제4조 (결제 및 이용 요금)</h2>
                        <p>회원은 회사가 제공하는 결제 수단을 통하여 서비스 이용 요금 및 대관료를 지불합니다. 회사는 서비스 개편이나 정책 변경에 따라 중개 수수료 및 서비스 이용 요금을 변경할 수 있으며, 이 경우 약관 개정 절차 또는 사전에 공지합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">제5조 (청약철회 및 환불 규정)</h2>
                        <p>1. 플랫폼을 통해 결제완료된 대관 및 부가 서비스에 대한 청약철회 및 환불은 원칙적으로 각 호스트가 자율적으로 맺고 명시한 <strong>개별 환불 정책</strong>에 따릅니다.</p>
                        <p className="mt-2">2. 호스트의 별도 규정이 명백히 명시되지 않았거나 기본 정책이 적용되는 경우, 회사의 표준 환불 규정은 아래와 같습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>이용 예정일 기준 7일 전까지 취소 요청 시: 결제 대금의 100% 환불</li>
                            <li>이용 예정일 기준 4~6일 전까지 취소 요청 시: 결제 대금의 50% 반환</li>
                            <li>이용 예정일 기준 3일 전 ~ 당일 취소 요청 시: 환불 불가</li>
                        </ul>
                        <p className="mt-2">3. 단, 통신판매중개업자인 회사는 환불 과정에 대한 시스템적 지원 및 정산 보류 처리를 돕지만, 환불 귀책사유를 둘러싼 당사자 간의 민형사상 분쟁에는 원칙적으로 개입하지 않습니다. 천재지변 등 불가항력적인 사유나 호스트 측의 일방적인 귀책사유(공간 사용 불가 등)가 명백히 입증된 경우에는 전액 환불 처리될 수 있습니다.</p>
                    </section>
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default TermsPage;
