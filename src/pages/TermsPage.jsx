import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const TermsPage = () => {
    const { t } = useTranslation('legal');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <section className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('termsTitle')}</h1>
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 text-gray-600 text-sm md:text-base leading-relaxed flex flex-col gap-8 break-keep">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('terms.art1Title')}</h2>
                        <p>{t('terms.art1Body')}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('terms.art2Title')}</h2>
                        <p>{t('terms.art2Body1')}</p>
                        <p className="mt-1">{t('terms.art2Body2')}</p>
                        <p className="mt-1">{t('terms.art2Body3')}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('terms.art3Title')}</h2>
                        <p>{t('terms.art3Body')}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('terms.art4Title')}</h2>
                        <p>{t('terms.art4Body')}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('terms.art5Title')}</h2>
                        <p>{t('terms.art5Body1')}</p>
                        <p className="mt-2">{t('terms.art5Body2')}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>{t('terms.art5Refund1')}</li>
                            <li>{t('terms.art5Refund2')}</li>
                            <li>{t('terms.art5Refund3')}</li>
                        </ul>
                        <p className="mt-2">{t('terms.art5Body3')}</p>
                    </section>
                </div>
            </section>
            <PublicFooter />
        </div>
    );
};

export default TermsPage;
