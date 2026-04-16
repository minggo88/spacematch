import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LegalModal from './LegalModal';

const PublicFooter = () => {
    const { t } = useTranslation('landing');
    const { t: tLegal } = useTranslation('legal');
    const [legalModal, setLegalModal] = useState(null);

    return (
        <>
            <footer className="bg-gray-950 text-white py-5 md:py-6">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        {/* Logo + Links */}
                        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
                                <img src="/favicon.png" alt="SpaceMatch" className="w-6 h-6 rounded-md object-contain brightness-0 invert" />
                                <span className="font-extrabold text-sm">SpaceMatch</span>
                            </Link>
                            <div className="flex gap-3 text-xs text-gray-500">
                                <Link to="/services" className="hover:text-white transition-colors">{t('nav.services')}</Link>
                                <Link to="/how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks')}</Link>
                                <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
                                <Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>
                                <span className="text-gray-700 hidden md:inline">|</span>
                                <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">{tLegal('footer.terms')}</button>
                                <button onClick={() => setLegalModal('privacy')} className="font-bold hover:text-white transition-colors cursor-pointer">{tLegal('footer.privacy')}</button>
                                <span className="text-gray-700 hidden md:inline">|</span>
                                <Link to="/signup/host" className="text-gray-600 hover:text-gray-400 transition-colors">행사 주최자</Link>
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="text-[11px] text-gray-600 text-center md:text-right leading-relaxed">
                            <span>{t('footer.businessInfo')}</span>
                            <span className="mx-1.5 hidden md:inline">|</span>
                            <br className="md:hidden" />
                            <span><a href="mailto:spacedotmatch@gmail.com" className="text-indigo-400 hover:underline">spacedotmatch@gmail.com</a></span>
                            <span className="mx-1.5">·</span>
                            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
                        </div>
                    </div>
                </div>
            </footer>

            {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
        </>
    );
};

export default PublicFooter;
