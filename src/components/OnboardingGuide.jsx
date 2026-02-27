import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, ChevronLeft, Sparkles, EyeOff } from 'lucide-react';

/**
 * OnboardingGuide — 신규 사용자 대시보드 기능 안내 컴포넌트
 *
 * - 가입 후 1주일 이내: 매일 자동 노출, "오늘 그만 보기" 가능
 * - 가입 후 1주일 이후: "더 이상 보지 않기" 버튼 추가 → 영구 숨김
 * - Admin/SuperAdmin은 제외
 */

// ── 역할별 가이드 단계 정의 ──
const GUIDE_STEPS = {
    seller: [
        { menuPath: '/seller', key: 'home', icon: '🏠' },
        { menuPath: '/seller/applications', key: 'applications', icon: '📋' },
        { menuPath: '/seller/hosts', key: 'hosts', icon: '🏢' },
        { menuPath: '/seller/stats', key: 'stats', icon: '📊' },
        { menuPath: '/seller/community', key: 'community', icon: '💬' },
        { menuPath: '/seller/profile', key: 'profile', icon: '👤' },
    ],
    host: [
        { menuPath: '/host', key: 'home', icon: '🏠' },
        { menuPath: '/host/dashboard', key: 'dashboard', icon: '📊' },
        { menuPath: '/host/venues', key: 'venues', icon: '🏪' },
        { menuPath: '/host/sellers', key: 'sellers', icon: '🛍️' },
        { menuPath: '/host/stats', key: 'hostStats', icon: '📈' },
        { menuPath: '/host/community', key: 'community', icon: '💬' },
    ],
    vendor: [
        { menuPath: '/vendor', key: 'home', icon: '🏠' },
        { menuPath: '/vendor/sellers', key: 'vendorSellers', icon: '🛍️' },
        { menuPath: '/vendor/proposals', key: 'proposals', icon: '📩' },
        { menuPath: '/vendor/shipments', key: 'shipments', icon: '📦' },
        { menuPath: '/vendor/settlements', key: 'settlements', icon: '💰' },
        { menuPath: '/vendor/profile', key: 'profile', icon: '👤' },
    ],
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const OnboardingGuide = () => {
    const { user } = useAuth();
    const { t } = useTranslation('common');
    const [currentStep, setCurrentStep] = useState(0);
    const [visible, setVisible] = useState(false);
    const [highlightRect, setHighlightRect] = useState(null);
    const tooltipRef = useRef(null);

    const role = user?.role;
    const email = user?.email;
    const createdAt = user?.created_at ? new Date(user.created_at) : null;
    const isAdmin = role === 'admin' || role === 'superadmin';

    // Layout.jsx와 동일한 fallback 방식: admin/host/vendor가 아니면 → seller
    const guideRole = isAdmin ? null : (role === 'host' ? 'host' : role === 'vendor' ? 'vendor' : 'seller');

    // 가입 후 1주일 경과 여부
    const isAfterFirstWeek = createdAt
        ? (Date.now() - createdAt.getTime()) > ONE_WEEK_MS
        : false;

    const steps = guideRole ? (GUIDE_STEPS[guideRole] || []) : [];

    console.log('[OnboardingGuide] Mounted:', { email, role, guideRole, isAdmin, stepsCount: steps.length });

    // ── 노출 여부 판단 ──
    useEffect(() => {
        console.log('[OnboardingGuide] Checking visibility:', { email, role, guideRole, isAdmin, stepsCount: steps.length });

        if (!email || isAdmin || steps.length === 0) {
            console.log('[OnboardingGuide] Hidden — reason:', !email ? 'no email' : isAdmin ? 'admin' : 'no steps for role');
            return;
        }

        // 영구 숨김 체크
        const foreverKey = `onboarding_dismiss_forever_${email}`;
        if (localStorage.getItem(foreverKey) === 'true') {
            console.log('[OnboardingGuide] Hidden — dismissed forever');
            setVisible(false);
            return;
        }

        // 오늘 숨김 체크
        const todayKey = `onboarding_dismiss_today_${email}`;
        const today = new Date().toDateString();
        if (localStorage.getItem(todayKey) === today) {
            console.log('[OnboardingGuide] Hidden — dismissed today');
            setVisible(false);
            return;
        }

        console.log('[OnboardingGuide] ✅ Showing guide!');
        setVisible(true);
        setCurrentStep(0);
    }, [email, isAdmin, steps.length]);

    // ── 하이라이트 대상 메뉴 위치 계산 ──
    const updateHighlight = useCallback(() => {
        if (!visible || steps.length === 0) return;
        const step = steps[currentStep];
        if (!step) return;

        // 사이드바에서 해당 메뉴 NavLink 찾기
        const selector = `a[href="${step.menuPath}"]`;
        const el = document.querySelector(selector);
        if (el) {
            const rect = el.getBoundingClientRect();
            setHighlightRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        } else {
            setHighlightRect(null);
        }
    }, [visible, currentStep, steps]);

    useEffect(() => {
        updateHighlight();
        window.addEventListener('resize', updateHighlight);
        window.addEventListener('scroll', updateHighlight);
        return () => {
            window.removeEventListener('resize', updateHighlight);
            window.removeEventListener('scroll', updateHighlight);
        };
    }, [updateHighlight]);

    // ── 액션 핸들러 ──
    const dismissToday = () => {
        const todayKey = `onboarding_dismiss_today_${email}`;
        localStorage.setItem(todayKey, new Date().toDateString());
        setVisible(false);
    };

    const dismissForever = () => {
        const foreverKey = `onboarding_dismiss_forever_${email}`;
        localStorage.setItem(foreverKey, 'true');
        setVisible(false);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            dismissToday();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    if (!visible || steps.length === 0) return null;

    const step = steps[currentStep];
    const stepTitle = t(`onboarding.steps.${step.key}.title`, step.key);
    const stepDesc = t(`onboarding.steps.${step.key}.desc`, '');
    const progress = ((currentStep + 1) / steps.length) * 100;
    const isLastStep = currentStep === steps.length - 1;

    // 툴팁 위치 계산 (하이라이트 오른쪽에 표시)
    const tooltipStyle = highlightRect ? {
        position: 'fixed',
        top: Math.max(16, Math.min(highlightRect.top - 20, window.innerHeight - 320)),
        left: highlightRect.left + highlightRect.width + 16,
        zIndex: 10001,
    } : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
    };

    // 모바일에서는 중앙 표시
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile) {
        tooltipStyle.top = 'auto';
        tooltipStyle.left = '50%';
        tooltipStyle.bottom = '24px';
        tooltipStyle.transform = 'translateX(-50%)';
        delete tooltipStyle.right;
    }

    return (
        <>
            {/* 오버레이 (클릭하면 닫기) */}
            <div
                className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={dismissToday}
            />

            {/* 하이라이트 영역 (사이드바 메뉴 위치) */}
            {highlightRect && !isMobile && (
                <div
                    className="fixed z-[10000] rounded-xl transition-all duration-300 ease-out"
                    style={{
                        top: highlightRect.top - 4,
                        left: highlightRect.left - 4,
                        width: highlightRect.width + 8,
                        height: highlightRect.height + 8,
                        boxShadow: '0 0 0 4000px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.6)',
                        border: '2px solid rgba(99,102,241,0.8)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* 말풍선 (Tooltip) */}
            <div
                ref={tooltipRef}
                style={tooltipStyle}
                className={`w-[340px] max-w-[calc(100vw-32px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden ${isMobile ? '' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* 진행률 바 */}
                <div className="h-1 bg-gray-100 dark:bg-gray-700">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* 헤더 */}
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                {t('onboarding.title', '시작 가이드')}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                                {t('onboarding.stepCount', { current: currentStep + 1, total: steps.length })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={dismissToday}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 본문 */}
                <div className="px-5 pb-4">
                    <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl flex-shrink-0 mt-0.5">{step.icon}</span>
                        <div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                {stepTitle}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {stepDesc}
                            </p>
                        </div>
                    </div>

                    {/* 단계 인디케이터 */}
                    <div className="flex items-center gap-1 mb-4 justify-center">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep
                                    ? 'w-6 bg-indigo-500'
                                    : i < currentStep
                                        ? 'w-1.5 bg-indigo-300'
                                        : 'w-1.5 bg-gray-200 dark:bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* 네비게이션 버튼 */}
                    <div className="flex items-center gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                            >
                                <ChevronLeft size={14} />
                                {t('onboarding.prev', '이전')}
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all"
                        >
                            {isLastStep ? t('onboarding.finish', '완료') : t('onboarding.next', '다음')}
                            {!isLastStep && <ChevronRight size={14} />}
                        </button>
                    </div>

                    {/* 하단 Dismiss 버튼들 */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-3">
                        <button
                            onClick={dismissToday}
                            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
                        >
                            {t('onboarding.dismissToday', '오늘 그만 보기')}
                        </button>
                        {isAfterFirstWeek && (
                            <>
                                <span className="text-gray-200 dark:text-gray-600">|</span>
                                <button
                                    onClick={dismissForever}
                                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
                                >
                                    <EyeOff size={11} />
                                    {t('onboarding.dismissForever', '더 이상 보지 않기')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnboardingGuide;
