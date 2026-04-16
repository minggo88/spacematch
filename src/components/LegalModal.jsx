import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const LegalModal = ({ type, onClose }) => {
    const { t } = useTranslation('legal');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc); };
    }, [onClose]);

    const isTerms = type === 'terms';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 flex-shrink-0">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        {isTerms ? t('termsTitle') : t('privacyTitle')}
                    </h2>
                    <button onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed break-keep">
                    {isTerms ? (
                        <div className="flex flex-col gap-7">
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('terms.art1Title')}</h3>
                                <p>{t('terms.art1Body')}</p>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('terms.art2Title')}</h3>
                                <p>{t('terms.art2Body1')}</p>
                                <p className="mt-1">{t('terms.art2Body2')}</p>
                                <p className="mt-1">{t('terms.art2Body3')}</p>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('terms.art3Title')}</h3>
                                <p>{t('terms.art3Body')}</p>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('terms.art4Title')}</h3>
                                <p>{t('terms.art4Body')}</p>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('terms.art5Title')}</h3>
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
                    ) : (
                        <div className="flex flex-col gap-7">
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('privacy.s1Title')}</h3>
                                <p>{t('privacy.s1Body')}</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>{t('privacy.s1Item1')}</li>
                                    <li>{t('privacy.s1Item2')}</li>
                                    <li>{t('privacy.s1Item3')}</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('privacy.s2Title')}</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>{t('privacy.s2Item1')}</strong></li>
                                    <li>{t('privacy.s2Item2')}</li>
                                    <li>{t('privacy.s2Item3')}</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('privacy.s3Title')}</h3>
                                <p>{t('privacy.s3Body')}</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>{t('privacy.s3Item1')}</li>
                                    <li>{t('privacy.s3Item2')}</li>
                                    <li>{t('privacy.s3Item3')}</li>
                                    <li>{t('privacy.s3Item4')}</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('privacy.s4Title')}</h3>
                                <p>{t('privacy.s4Body')}</p>
                            </section>
                            <section>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('privacy.s5Title')}</h3>
                                <p>{t('privacy.s5Body')}</p>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200/50 transition-all">
                        {t('close', { defaultValue: '확인' })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
