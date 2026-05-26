import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LegalModal from './LegalModal';
import ServiceGuideModal from './ServiceGuideModal';
import { SITE_BUSINESS, SITE_LINKS } from '../content/spacematchServiceGuide';

/**
 * 전역 푸터 — 상단 바(로고·메뉴·사업자 정보)
 */
const SiteFooter = ({ className = '' }) => {
    const { t } = useTranslation('landing');
    const { t: tLegal } = useTranslation('legal');
    const [legalModal, setLegalModal] = useState(null);
    const [showServiceGuide, setShowServiceGuide] = useState(false);

    const businessLine = `스페이스매치 · 대표 ${SITE_BUSINESS.ceo} · 사업자번호 ${SITE_BUSINESS.bizNo} · ${SITE_BUSINESS.address}`;

    return (
        <>
            <footer className={`bg-gray-950 text-white ${className}`}>
                <div className="py-5 md:py-6">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                                <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
                                    <img
                                        src="/favicon.png"
                                        alt="SpaceMatch"
                                        className="w-6 h-6 rounded-md object-contain brightness-0 invert"
                                    />
                                    <span className="font-extrabold text-sm text-white">SpaceMatch</span>
                                </Link>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                    <Link to={SITE_LINKS.services} className="hover:text-white transition-colors">
                                        {t('nav.services')}
                                    </Link>
                                    <Link to={SITE_LINKS.howItWorks} className="hover:text-white transition-colors">
                                        {t('nav.howItWorks')}
                                    </Link>
                                    <Link to={SITE_LINKS.about} className="hover:text-white transition-colors">
                                        {t('nav.about')}
                                    </Link>
                                    <Link to={SITE_LINKS.contact} className="hover:text-white transition-colors">
                                        {t('nav.contact')}
                                    </Link>
                                    <span className="text-gray-700 hidden sm:inline">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setLegalModal('terms')}
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        {tLegal('footer.terms')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLegalModal('privacy')}
                                        className="font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {tLegal('footer.privacy')}
                                    </button>
                                    <span className="text-gray-700 hidden sm:inline">|</span>
                                    <Link
                                        to={SITE_LINKS.signupHost}
                                        className="text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        행사 주최자
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setShowServiceGuide(true)}
                                        className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                                    >
                                        서비스 설명서
                                    </button>
                                </div>
                            </div>

                            <div className="text-[11px] text-gray-600 leading-relaxed lg:text-right">
                                <span>{businessLine}</span>
                                <span className="mx-1.5 hidden lg:inline">|</span>
                                <span className="block lg:inline mt-1 lg:mt-0">
                                    <a
                                        href={SITE_LINKS.emailHref}
                                        className="text-indigo-400 hover:underline"
                                    >
                                        {SITE_LINKS.email}
                                    </a>
                                    <span className="mx-1.5">·</span>
                                    <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
            {showServiceGuide && <ServiceGuideModal onClose={() => setShowServiceGuide(false)} />}
        </>
    );
};

export default SiteFooter;
