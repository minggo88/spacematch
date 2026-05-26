import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const PrivacyPage = () => {
    const { t } = useTranslation('legal');
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicNav />
            <main className="flex-1">
            <section className="pt-32 pb-24 max-w-4xl mx-auto px-4 md:px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('privacyTitle')}</h1>
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100 text-gray-600 text-sm md:text-base leading-relaxed flex flex-col gap-8 break-keep">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('privacy.s1Title')}</h2>
                        <p>{t('privacy.s1Body')}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>{t('privacy.s1Item1')}</li>
                            <li>{t('privacy.s1Item2')}</li>
                            <li>{t('privacy.s1Item3')}</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('privacy.s2Title')}</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>{t('privacy.s2Item1')}</strong></li>
                            <li>{t('privacy.s2Item2')}</li>
                            <li>{t('privacy.s2Item3')}</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('privacy.s3Title')}</h2>
                        <p>{t('privacy.s3Body')}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>{t('privacy.s3Item1')}</li>
                            <li>{t('privacy.s3Item2')}</li>
                            <li>{t('privacy.s3Item3')}</li>
                            <li>{t('privacy.s3Item4')}</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('privacy.s4Title')}</h2>
                        <p>{t('privacy.s4Body')}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{t('privacy.s5Title')}</h2>
                        <p>{t('privacy.s5Body')}</p>
                    </section>
                </div>
            </section>
            </main>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPage;
