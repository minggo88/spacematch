import React, { useState } from 'react';
import { ChevronDown, Check, Shield, FileText, Megaphone } from 'lucide-react';

// ─── 셀러(학생/브랜드) 약관 ───
const SELLER_TERMS = {
    terms: {
        title: '서비스 이용약관',
        required: true,
        icon: FileText,
        content: `제1조 (목적)
본 약관은 SpaceMatch(이하 "플랫폼")가 제공하는 팝업스토어 매칭 서비스의 이용과 관련하여, 셀러(이하 "회원")와 플랫폼 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 플랫폼이 제공하는 팝업스토어 공간 검색, 입점 신청, 매칭 등 일체의 온라인 서비스를 말합니다.
2. "셀러"란 서비스에 가입하여 공간에 입점을 신청하는 브랜드 또는 개인 사업자를 말합니다.
3. "벤더"란 서비스를 통해 공간을 등록하고 셀러를 선정하는 공간 제공자를 말합니다.

제3조 (서비스의 제공)
1. 플랫폼은 다음 서비스를 제공합니다:
   - 공간 검색 및 정보 열람
   - 입점 신청 및 관리
   - 셀러-벤더 간 커뮤니케이션 지원
   - 커뮤니티 기능
2. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만, 시스템 점검 등의 사유로 일시 중단될 수 있습니다.

제4조 (회원가입)
1. 회원가입은 이용자가 약관에 동의하고, 가입 신청 양식에 따라 정보를 기재한 후 신청합니다.
2. 플랫폼은 다음 각 호에 해당하는 경우 가입을 거부할 수 있습니다:
   - 타인의 정보를 도용한 경우
   - 허위 정보를 기재한 경우
   - 기타 서비스 운영에 지장을 초래하는 경우

제5조 (회원의 의무)
1. 회원은 가입 시 정확한 정보를 제공하여야 하며, 변경 사항이 있을 경우 즉시 수정하여야 합니다.
2. 회원은 다음 행위를 하여서는 안 됩니다:
   - 타인의 정보를 부정 사용하는 행위
   - 서비스를 이용하여 법령에 위반되는 행위
   - 서비스의 운영을 고의로 방해하는 행위
   - 다른 이용자에게 피해를 주는 행위

제6조 (입점 신청 및 계약)
1. 셀러는 원하는 공간에 입점 신청을 할 수 있으며, 벤더의 승인을 통해 입점이 확정됩니다.
2. 입점 조건(기간, 비용, 수수료 등)은 벤더가 설정한 조건에 따릅니다.
3. 입점 확정 후 셀러와 벤더 간의 구체적인 계약 사항은 양 당사자 간 별도 합의에 따릅니다.
4. 플랫폼은 매칭 서비스를 제공할 뿐, 입점 계약의 당사자가 아닙니다.

제7조 (서비스 이용 제한)
1. 플랫폼은 회원이 본 약관을 위반한 경우 서비스 이용을 제한하거나 계정을 해지할 수 있습니다.
2. 부정 사용, 스팸, 허위 신청 등이 확인된 경우 사전 통보 없이 이용이 제한될 수 있습니다.

제8조 (면책조항)
1. 플랫폼은 서비스를 통해 이루어진 셀러와 벤더 간 거래에 대해 직접적인 책임을 지지 않습니다.
2. 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 플랫폼은 책임을 지지 않습니다.

제9조 (분쟁해결)
1. 서비스 이용과 관련한 분쟁은 대한민국 법률에 따르며, 관할 법원은 플랫폼 소재지를 관할하는 법원으로 합니다.

부칙
본 약관은 2026년 2월 8일부터 시행합니다.`
    },
    privacy: {
        title: '개인정보 처리방침',
        required: true,
        icon: Shield,
        content: `SpaceMatch(이하 "플랫폼")는 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같은 개인정보 처리방침을 수립합니다.

제1조 (수집하는 개인정보)
1. 필수 수집 항목:
   - 이메일 주소, 비밀번호, 브랜드명(이름)
   - 사업자등록번호
   - 판매 카테고리
2. 선택 수집 항목:
   - 인스타그램 계정, 브랜드 설명
   - 프로필 사진, 연락처
3. 서비스 이용 과정에서 자동 수집되는 정보:
   - 접속 IP, 접속 일시, 브라우저 정보

제2조 (개인정보의 수집 및 이용 목적)
1. 회원 관리: 본인 확인, 계정 관리, 부정 이용 방지
2. 서비스 제공: 공간 매칭, 입점 신청 처리, 알림 발송
3. 서비스 개선: 이용 통계, 서비스 품질 향상

제3조 (개인정보의 보유 및 이용 기간)
1. 회원 탈퇴 시 즉시 파기합니다. 다만, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
   - 계약 또는 청약철회 등에 관한 기록: 5년
   - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
   - 접속 기록: 3개월

제4조 (개인정보의 제3자 제공)
1. 플랫폼은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
2. 다만, 다음의 경우에는 예외로 합니다:
   - 이용자가 사전에 동의한 경우
   - 법령에 의해 요구되는 경우
   - 입점 신청 시 해당 벤더에게 셀러 정보(브랜드명, 카테고리, 연락처)가 제공됩니다.

제5조 (개인정보의 파기)
1. 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
2. 전자적 파일은 복구할 수 없는 방법으로 삭제하며, 종이 문서는 분쇄기로 파기합니다.

제6조 (이용자의 권리)
1. 이용자는 언제든지 자신의 개인정보에 대한 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
2. 관련 문의는 플랫폼 고객센터를 통해 접수할 수 있습니다.

제7조 (개인정보의 안전성 확보 조치)
플랫폼은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
   - 비밀번호 암호화 저장
   - SSL/TLS 통신 암호화
   - 접근 권한 관리 및 접속 기록 보관

본 방침은 2026년 2월 8일부터 시행합니다.`
    },
    marketing: {
        title: '마케팅 정보 수신 동의',
        required: false,
        icon: Megaphone,
        content: `SpaceMatch는 더 나은 서비스를 제공하기 위해 다음과 같은 마케팅 정보를 발송할 수 있습니다.

1. 수신 내용
   - 신규 공간 등록 알림
   - 인기 공간 추천 및 핫딜 정보
   - 이벤트, 프로모션 안내
   - 플랫폼 업데이트 및 새로운 기능 소개
   - 셀러를 위한 팝업 운영 팁 및 가이드

2. 수신 방법
   - 이메일, 앱 내 알림(푸시)

3. 수신 동의 철회
   - 마케팅 수신 동의는 언제든지 철회할 수 있습니다.
   - 내 정보 관리 페이지 또는 수신 이메일 하단의 '수신 거부 링크를 통해 철회 가능합니다.

4. 유의 사항
   - 마케팅 수신에 동의하지 않더라도 서비스 이용에 필수적인 안내(입점 승인 알림, 시스템 공지 등)는 발송됩니다.
   - 본 동의는 선택 사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.`
    }
};

// ─── 벤더(공간 호스트) 약관 ───
const VENDOR_TERMS = {
    terms: {
        title: '서비스 이용약관',
        required: true,
        icon: FileText,
        content: `제1조 (목적)
본 약관은 SpaceMatch(이하 "플랫폼")가 제공하는 팝업스토어 매칭 서비스의 이용과 관련하여, 벤더(공간 호스트, 이하 "회원")와 플랫폼 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 플랫폼이 제공하는 공간 등록, 셀러 매칭, 입점 관리 등 일체의 온라인 서비스를 말합니다.
2. "벤더"란 서비스에 가입하여 보유 공간을 등록하고 셀러를 유치하는 공간 제공자를 말합니다.
3. "셀러"란 서비스를 통해 공간에 입점을 신청하는 브랜드 또는 개인 사업자를 말합니다.

제3조 (서비스의 제공)
1. 플랫폼은 다음 서비스를 제공합니다:
   - 공간 등록 및 관리
   - 셀러 입점 신청 수신 및 승인/거절 관리
   - 모집 공고 노출 및 프로모션 기능
   - 셀러 디렉토리 열람
   - 커뮤니티 기능
2. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다.

제4조 (벤더 회원가입 및 승인)
1. 벤더 가입은 관리자의 사전 승인을 필요로 합니다.
2. 가입 시 제공한 정보가 허위인 경우 승인이 취소될 수 있습니다.
3. 승인이 완료되면 서비스 이용이 가능합니다.

제5조 (벤더의 의무)
1. 벤더는 등록하는 공간 정보(위치, 면적, 가격, 이미지 등)를 정확히 기재하여야 합니다.
2. 셀러 입점 신청에 대해 합리적인 기간 내 승인/거절 처리를 하여야 합니다.
3. 벤더는 다음 행위를 하여서는 안 됩니다:
   - 허위 또는 과장된 공간 정보를 등록하는 행위
   - 서비스를 이용하여 법령에 위반되는 행위
   - 셀러에게 플랫폼 외 부당한 조건을 강요하는 행위
   - 서비스의 운영을 고의로 방해하는 행위

제6조 (공간 등록 및 관리)
1. 벤더는 보유한 공간의 정보를 등록할 수 있으며, 관리자 승인 후 공개됩니다.
2. 공간 정보(가격, 위치, 이미지 등)에 변동이 있을 경우 즉시 수정하여야 합니다.
3. 모집 마감일, 최대 입점 수 등 모집 조건을 명확히 설정하여야 합니다.

제7조 (입점 신청 관리)
1. 셀러의 입점 신청을 수신하면, 합리적인 기간 내에 승인 또는 거절 처리를 하여야 합니다.
2. 거절 시 합당한 사유를 명시하는 것을 권장합니다.

제8조 (수수료 및 비용)
1. 플랫폼 이용에 대한 수수료는 별도 고지하며, 변경 시 사전에 안내합니다.
2. 셀러와의 공간 이용 관련 비용(임대료, 보증금 등)은 벤더와 셀러 간 직접 정산합니다.

제9조 (면책조항)
1. 플랫폼은 벤더와 셀러 간 거래에 대해 직접적인 책임을 지지 않습니다.
2. 공간 이용 중 발생하는 사고·분쟁은 당사자 간 해결을 원칙으로 합니다.

제10조 (분쟁해결)
1. 서비스 이용과 관련한 분쟁은 대한민국 법률에 따릅니다.

부칙
본 약관은 2026년 2월 8일부터 시행합니다.`
    },
    privacy: {
        title: '개인정보 처리방침',
        required: true,
        icon: Shield,
        content: `SpaceMatch(이하 "플랫폼")는 「개인정보 보호법」에 따라 벤더 회원의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같은 개인정보 처리방침을 수립합니다.

제1조 (수집하는 개인정보)
1. 필수 수집 항목:
   - 이메일 주소, 비밀번호, 업체명(호스트명)
   - 사업자등록번호
   - 연락처(전화번호)
2. 선택 수집 항목:
   - 프로필 사진
3. 서비스 이용 과정에서 자동 수집되는 정보:
   - 접속 IP, 접속 일시, 브라우저 정보

제2조 (개인정보의 수집 및 이용 목적)
1. 회원 관리: 본인 확인, 계정 관리, 벤더 승인 처리
2. 서비스 제공: 공간 등록, 셀러 매칭, 입점 관리, 알림 발송
3. 서비스 개선: 이용 통계, 서비스 품질 향상

제3조 (개인정보의 보유 및 이용 기간)
1. 회원 탈퇴 시 즉시 파기합니다. 다만, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
   - 계약 또는 청약철회 등에 관한 기록: 5년
   - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
   - 접속 기록: 3개월

제4조 (개인정보의 제3자 제공)
1. 플랫폼은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
2. 다만, 다음의 경우에는 예외로 합니다:
   - 이용자가 사전에 동의한 경우
   - 법령에 의해 요구되는 경우
   - 셀러가 입점 신청 시, 셀러에게 벤더의 업체명 및 연락처 정보가 표시될 수 있습니다.

제5조 (개인정보의 파기)
1. 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.

제6조 (이용자의 권리)
1. 이용자는 언제든지 자신의 개인정보에 대한 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.

제7조 (개인정보의 안전성 확보 조치)
플랫폼은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
   - 비밀번호 암호화 저장
   - SSL/TLS 통신 암호화
   - 접근 권한 관리 및 접속 기록 보관

본 방침은 2026년 2월 8일부터 시행합니다.`
    },
    marketing: {
        title: '마케팅 정보 수신 동의',
        required: false,
        icon: Megaphone,
        content: `SpaceMatch는 벤더에게 더 나은 서비스를 제공하기 위해 다음과 같은 마케팅 정보를 발송할 수 있습니다.

1. 수신 내용
   - 신규 셀러 가입 알림 및 추천
   - 인기 셀러 트렌드 리포트
   - 이벤트, 프로모션 안내
   - 플랫폼 업데이트 및 새로운 기능 소개
   - 공간 운영 노하우 및 벤더 가이드

2. 수신 방법
   - 이메일, 앱 내 알림(푸시)

3. 수신 동의 철회
   - 마케팅 수신 동의는 언제든지 철회할 수 있습니다.
   - 내 정보 관리 페이지 또는 수신 이메일 하단의 '수신 거부 링크를 통해 철회 가능합니다.

4. 유의 사항
   - 마케팅 수신에 동의하지 않더라도 서비스 이용에 필수적인 안내(입점 신청 알림, 시스템 공지 등)는 발송됩니다.
   - 본 동의는 선택 사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.`
    }
};

// ─── 약관 아코디언 아이템 ───
const TermItem = ({ item, checked, onCheck, expanded, onToggle }) => {
    const Icon = item.icon;
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${checked ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'}`}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Checkbox */}
                <button
                    type="button"
                    onClick={onCheck}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-gray-300 hover:border-indigo-400'
                        }`}
                >
                    {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>

                {/* Label */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <Icon size={16} className={`flex-shrink-0 ${checked ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${checked ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {item.title}
                    </span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.required ? '필수' : '선택'}
                    </span>
                </div>

                {/* Expand button */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pb-4">
                    <div className="bg-white border border-gray-100 rounded-lg p-4 max-h-[260px] overflow-y-auto">
                        <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                            {item.content}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───
const TermsAgreement = ({ userType = 'seller', agreements, onAgreementsChange }) => {
    const [expandedItems, setExpandedItems] = useState({});
    const terms = userType === 'vendor' ? VENDOR_TERMS : SELLER_TERMS;
    const termKeys = Object.keys(terms);

    const allChecked = termKeys.every(key => agreements[key]);
    const requiredAllChecked = termKeys.filter(k => terms[k].required).every(k => agreements[k]);

    const handleToggleExpand = (key) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCheck = (key) => {
        onAgreementsChange({ ...agreements, [key]: !agreements[key] });
    };

    const handleAllCheck = () => {
        const newVal = !allChecked;
        const updated = {};
        termKeys.forEach(key => { updated[key] = newVal; });
        onAgreementsChange(updated);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 mb-2">약관 동의</label>

            {/* All agree */}
            <div
                onClick={handleAllCheck}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${allChecked
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
            >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${allChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                    }`}>
                    {allChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm font-extrabold ${allChecked ? 'text-indigo-700' : 'text-gray-800'}`}>
                    전체 동의하기
                </span>
                <span className="text-xs text-gray-400 ml-auto">필수 및 선택 항목 포함</span>
            </div>

            {/* Individual terms */}
            <div className="space-y-2">
                {termKeys.map(key => (
                    <TermItem
                        key={key}
                        item={terms[key]}
                        checked={!!agreements[key]}
                        onCheck={() => handleCheck(key)}
                        expanded={!!expandedItems[key]}
                        onToggle={() => handleToggleExpand(key)}
                    />
                ))}
            </div>

            {/* Warning if required not checked */}
            {!requiredAllChecked && (
                <p className="text-xs text-red-500 font-medium mt-1">
                    * 필수 약관에 모두 동의해야 가입이 가능합니다.
                </p>
            )}
        </div>
    );
};

// Export helper to check if required terms are agreed
export const isRequiredAgreed = (agreements, userType = 'seller') => {
    const terms = userType === 'vendor' ? VENDOR_TERMS : SELLER_TERMS;
    return Object.keys(terms).filter(k => terms[k].required).every(k => agreements[k]);
};

export default TermsAgreement;
