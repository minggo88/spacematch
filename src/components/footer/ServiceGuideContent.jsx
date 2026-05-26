import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_BUSINESS, SITE_LINKS } from '../../content/spacematchServiceGuide';

const THEMES = {
    dark: {
        link: 'text-indigo-400 hover:text-indigo-300 hover:underline',
        sectionTitle: 'text-sm font-bold text-white border-b border-gray-800 pb-2',
        sectionBody: 'text-xs text-gray-400 leading-relaxed space-y-2',
        planName: 'font-semibold text-gray-300',
        label: 'text-gray-500',
        emphasis: 'font-semibold text-gray-300',
        muted: 'text-gray-500 text-[11px]',
    },
    light: {
        link: 'text-indigo-600 hover:text-indigo-700 hover:underline',
        sectionTitle: 'text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2',
        sectionBody: 'text-xs text-gray-600 dark:text-gray-300 leading-relaxed space-y-2',
        planName: 'font-semibold text-gray-800 dark:text-gray-200',
        label: 'text-gray-500 dark:text-gray-400',
        emphasis: 'font-semibold text-gray-800 dark:text-gray-200',
        muted: 'text-gray-500 dark:text-gray-400 text-[11px]',
    },
};

const Ext = ({ href, children, className }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
);

const Section = ({ title, children, theme }) => (
    <section className="space-y-3">
        <h3 className={theme.sectionTitle}>{title}</h3>
        <div className={theme.sectionBody}>{children}</div>
    </section>
);

const Plan = ({ name, items, theme }) => (
    <div className="mb-3">
        <p className={theme.planName}>{name}</p>
        <ul className="list-disc pl-4 mt-1 space-y-0.5">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
);

const ServiceGuideContent = ({ variant = 'dark' }) => {
    const theme = THEMES[variant] || THEMES.dark;
    const linkClass = theme.link;

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        <Section title="1. 사업자 정보" theme={theme}>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                <dt className={theme.label}>상호명</dt><dd>{SITE_BUSINESS.name}</dd>
                <dt className={theme.label}>대표자</dt><dd>{SITE_BUSINESS.ceo}</dd>
                <dt className={theme.label}>사업자등록번호</dt><dd>{SITE_BUSINESS.bizNo}</dd>
                <dt className={theme.label}>개업일</dt><dd>{SITE_BUSINESS.opened}</dd>
                <dt className={theme.label}>업태</dt><dd>{SITE_BUSINESS.bizType}</dd>
                <dt className={theme.label}>종목</dt><dd>{SITE_BUSINESS.bizItem}</dd>
                <dt className={theme.label}>소재지</dt><dd>{SITE_BUSINESS.address}</dd>
                <dt className={theme.label}>이메일</dt>
                <dd><Ext href={SITE_LINKS.emailHref} className={linkClass}>{SITE_LINKS.email}</Ext></dd>
                <dt className={theme.label}>홈페이지</dt>
                <dd><Ext href={SITE_LINKS.homepage} className={linkClass}>{SITE_LINKS.homepage}</Ext></dd>
            </dl>
        </Section>

        <Section title="2. 서비스 개요" theme={theme}>
            <p>
                스페이스매치(SpaceMatch)는 팝업스토어·플리마켓 셀러와 공간 호스트를 연결하는 온라인 매칭 플랫폼입니다.
                공간 검색, 입점 신청, 매칭, 매출 CRM, 세무 자동화 기능을 하나의 플랫폼에서 제공하며,
                셀러·호스트·벤더 세 가지 사용자 유형을 대상으로 서비스를 운영합니다.
            </p>
            <p className={theme.emphasis}>[핵심 제공 서비스]</p>
            <ul className="list-disc pl-4 space-y-1">
                <li>전국 팝업스토어·플리마켓 공간 검색 및 <Link to={SITE_LINKS.signupSeller} className={linkClass}>입점 신청</Link></li>
                <li>셀러-호스트 간 매칭 플랫폼 운영</li>
                <li>매출 CRM 대시보드 (일·월·연간 매출 집계, 트렌드 분석)</li>
                <li>세무 자동 계산 및 신고 알림 (부가세·종합소득세)</li>
                <li>ERP 엑셀 자동 임포트 (네이버 스마트스토어, 쿠팡, Shopify 등)</li>
                <li>RFM 기반 고객 분석 및 CRM 자동화</li>
                <li>셀러·호스트 전용 커뮤니티</li>
            </ul>
            <p>
                <Link to={SITE_LINKS.services} className={linkClass}>서비스 상세 보기 →</Link>
            </p>
        </Section>

        <Section title="3. 가입자 유형" theme={theme}>
            <div className="space-y-3">
                <div>
                    <p className={theme.emphasis}>셀러 (Seller)</p>
                    <p>팝업스토어·플리마켓 입점을 원하는 브랜드 및 개인 사업자 · 결제: Free / Pro / Pro+</p>
                    <Link to={SITE_LINKS.signupSeller} className={`${linkClass} text-[11px]`}>셀러 가입 →</Link>
                </div>
                <div>
                    <p className={theme.emphasis}>호스트 (Host)</p>
                    <p>유휴 공간을 제공하는 공간 소유자·관리자 · 결제: Basic / Premium</p>
                    <Link to={SITE_LINKS.signupHost} className={`${linkClass} text-[11px]`}>호스트(행사 주최자) 가입 →</Link>
                </div>
                <div>
                    <p className={theme.emphasis}>벤더 (Vendor)</p>
                    <p>이벤트 기획사, 플리마켓 운영사 등 · 결제: Starter / Growth / Pro</p>
                    <Link to={SITE_LINKS.signupVendor} className={`${linkClass} text-[11px]`}>벤더 가입 →</Link>
                </div>
            </div>
            <p className={theme.muted}>
                ※ 벤더 서비스는 현재 약관 정비 및 기능 개발 진행 중이며, 정식 운영 시 약관에 반영 예정입니다.
            </p>
        </Section>

        <Section title="4-1. 셀러 (Seller) 요금제" theme={theme}>
            <Plan name="Free (₩0)" items={['공간 탐색 및 입점 신청', '기본 매출 대시보드', '월 50건 데이터 입력', '커뮤니티 이용']} theme={theme} />
            <Plan name="Pro (₩30,000/월)" items={['Free 전체 포함', '무제한 데이터 & 엑셀 업로드', '세무 자동 계산 & 신고 알림', 'RFM CRM', '인기 공간 마감 우선 알림', '입점 신청 우선권', '공식 인증 뱃지']} theme={theme} />
            <Plan name="Pro+ (₩50,000/월)" items={['Pro 전체 포함', '호스트 검색 시 카테고리별 상위 노출', '셀러 디렉토리 상단 고정 + 추천 셀러 뱃지', '월 5회 커뮤니티 프로모션 무료', '브랜드 포트폴리오 강조']} theme={theme} />
        </Section>

        <Section title="4-2. 호스트 (Host) 요금제" theme={theme}>
            <Plan name="Basic (₩30,000/월)" items={['공간 등록 3개', '셀러 탐색·포트폴리오 확인', '입점 신청 승인·반려', '기본 활동 통계']} theme={theme} />
            <Plan name="Premium (₩100,000/월)" items={['Basic 전체 포함', '공간 등록 최대 10개', 'HOT 영역·지역 탭 최상단', '추천 알고리즘 우선 노출', '골드 공간 뱃지', '프리미엄 등록 페이지 강조']} theme={theme} />
            <p>
                <span className={theme.emphasis}>Enterprise (별도 협의 / 준비 중)</span>
                {' '}— Premium 포함, 전담 매니저, 맞춤 리포트·API, 멀티 공간 관리.
                문의: <Ext href={SITE_LINKS.emailHref} className={linkClass}>{SITE_LINKS.email}</Ext>
            </p>
        </Section>

        <Section title="4-3. 벤더 (Vendor) 요금제" theme={theme}>
            <Plan name="Starter (₩20,000/월)" items={['벤더 프로필 상단 고정', 'D-Day 뱃지', '셀러 디렉토리 상위 노출']} theme={theme} />
            <Plan name="Growth (₩49,900/월)" items={['Starter 포함', '입점 신청 우선 알림', '커뮤니티 프로모션 무제한', '인증 뱃지']} theme={theme} />
            <Plan name="Pro (₩99,000/월)" items={['Growth 포함', '분석 리포트', '매칭 관리', '전담 CS', '다중 행사 운영']} theme={theme} />
        </Section>

        <Section title="4-4. 애드온 (Add-on)" theme={theme}>
            <ul className="space-y-1">
                <li>배너 광고 게재 (1개월) : ₩50,000 / 호스트·벤더</li>
                <li>커뮤니티 프로모션 게시 : ₩15,000/건 / 셀러·벤더</li>
                <li>분석 리포트 : ₩30,000 / 전체</li>
                <li>인증 뱃지 : ₩15,000 / 셀러·벤더</li>
                <li>노출 부스팅 : ₩999~/건 / 전체</li>
                <li>입점 신청 우선권 (1회) : ₩20,000 / 셀러</li>
            </ul>
        </Section>

        <Section title="5. 결제 수단 적용 대상" theme={theme}>
            <ul className="space-y-1">
                <li>셀러 Pro · Pro+ / 호스트 Basic · Premium / 벤더 Starter · Growth · Pro — 정기 결제</li>
                <li>애드온 단건 — ₩999 ~ ₩50,000</li>
            </ul>
            <p className={theme.muted}>
                ※ Enterprise는 별도 협의·계약서 기반 청구이며 PG 단순 결제가 아닙니다.
            </p>
        </Section>

        <Section title="6. 환불 및 청약철회" theme={theme}>
            <p className={theme.emphasis}>[월 구독]</p>
            <ul className="list-disc pl-4 space-y-1">
                <li>결제일로부터 7일 이내 청약철회 가능 (전자상거래법 제17조)</li>
                <li>유료 기능 이용 시 콘텐츠 제공 개시로 철회 제한 가능, 일할 공제 후 환불</li>
                <li>다음 결제일 전일까지 해지 신청 가능, 주기 종료까지 이용 유지</li>
            </ul>
            <p className={`${theme.emphasis} mt-2`}>[애드온 단건]</p>
            <ul className="list-disc pl-4 space-y-1">
                <li>노출·게시 등 즉시 개시 상품은 개시 후 환불 불가</li>
                <li>미제공 상태 취소는 결제일로부터 7일 이내 전액 환불</li>
            </ul>
        </Section>

        <Section title="7. 정산 보류 및 기타" theme={theme}>
            <ul className="list-disc pl-4 space-y-1">
                <li>PG 결제는 플랫폼 구독·애드온에 한함</li>
                <li>셀러-호스트 행사 참가비 직접 결제는 미운영, 도입 시 별도 안내</li>
                <li>정산 보류 조항은 향후 확장 대비이며 현재 구독에는 실질적 보류 사유 없음</li>
            </ul>
        </Section>

        <Section title="8. 문의처" theme={theme}>
            <ul className="space-y-1.5">
                <li>이메일: <Ext href={SITE_LINKS.emailHref} className={linkClass}>{SITE_LINKS.email}</Ext></li>
                <li>카카오톡: <Ext href={SITE_LINKS.kakao} className={linkClass}>채널 채팅</Ext></li>
                <li>홈페이지: <Ext href={SITE_LINKS.homepage} className={linkClass}>{SITE_LINKS.homepage}</Ext></li>
                <li><Link to={SITE_LINKS.contact} className={linkClass}>문의 페이지 →</Link></li>
            </ul>
        </Section>
    </div>
    );
};

export default ServiceGuideContent;
