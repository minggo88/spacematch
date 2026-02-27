import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, ChevronLeft, Sparkles, EyeOff } from 'lucide-react';

/**
 * OnboardingGuide — 신규 사용자 대시보드 기능 안내 컴포넌트
 *
 * 역할별 맞춤 가이드:
 *   seller / host / vendor / admin / superadmin
 *
 * - visible 기본값 TRUE → 무조건 보임
 * - dismiss 시에만 숨김 (localStorage 기반)
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
    admin: [
        { menuPath: '/admin', key: 'adminHome', icon: '🏠' },
        { menuPath: '/admin/dashboard', key: 'adminDashboard', icon: '📊' },
        { menuPath: '/admin/sellers', key: 'adminSellers', icon: '🛍️' },
        { menuPath: '/admin/hosts', key: 'adminHosts', icon: '🏢' },
        { menuPath: '/admin/applications', key: 'adminApps', icon: '📋' },
        { menuPath: '/admin/venues', key: 'adminVenues', icon: '🏪' },
        { menuPath: '/admin/users', key: 'adminUsers', icon: '👥' },
        { menuPath: '/admin/payments', key: 'adminPayments', icon: '💳' },
        { menuPath: '/admin/community/general', key: 'adminCommunity', icon: '💬' },
        { menuPath: '/admin/profile', key: 'profile', icon: '👤' },
    ],
    superadmin: [
        { menuPath: '/admin', key: 'adminHome', icon: '🏠' },
        { menuPath: '/admin/dashboard', key: 'adminDashboard', icon: '📊' },
        { menuPath: '/admin/sellers', key: 'adminSellers', icon: '🛍️' },
        { menuPath: '/admin/hosts', key: 'adminHosts', icon: '🏢' },
        { menuPath: '/admin/applications', key: 'adminApps', icon: '📋' },
        { menuPath: '/admin/venues', key: 'adminVenues', icon: '🏪' },
        { menuPath: '/admin/users', key: 'adminUsers', icon: '👥' },
        { menuPath: '/admin/payments', key: 'adminPayments', icon: '💳' },
        { menuPath: '/admin/security', key: 'adminSecurity', icon: '🔒' },
        { menuPath: '/admin/database', key: 'adminDB', icon: '🗄️' },
        { menuPath: '/admin/community/general', key: 'adminCommunity', icon: '💬' },
        { menuPath: '/admin/profile', key: 'profile', icon: '👤' },
    ],
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const OnboardingGuide = () => {
    const { user } = useAuth();
    const { t } = useTranslation('common');
    const [currentStep, setCurrentStep] = useState(0);
    // ★ 핵심 변경: 기본값 TRUE — 무조건 먼저 보여주고, dismiss 체크 후 숨김
    const [visible, setVisible] = useState(true);
    const [highlightRect, setHighlightRect] = useState(null);
    const tooltipRef = useRef(null);
    const [ready, setReady] = useState(false);

    const userId = user?.id;
    const role = user?.role;
    const createdAt = user?.created_at ? new Date(user.created_at) : null;

    const guideRole = role === 'superadmin' ? 'superadmin'
        : role === 'admin' ? 'admin'
            : role === 'host' ? 'host'
                : role === 'vendor' ? 'vendor'
                    : role ? 'seller' : null;

    const isAfterFirstWeek = createdAt
        ? (Date.now() - createdAt.getTime()) > ONE_WEEK_MS
        : false;

    const steps = guideRole ? (GUIDE_STEPS[guideRole] || []) : [];

    // ── 숨김 여부만 판단 (기본은 보임) ──
    useEffect(() => {
        // user 아직 안 로드되었으면 기다림
        if (!user) {
            setReady(false);
            return;
        }

        // role이 없거나 steps가 없으면 숨김
        if (!guideRole || steps.length === 0) {
            setVisible(false);
            setReady(true);
            return;
        }

        const uid = userId || user?.email || 'default';

        // 영구 숨김 체크
        const foreverKey = `onboarding_dismiss_forever_${uid}`;
        if (localStorage.getItem(foreverKey) === 'true') {
            setVisible(false);
            setReady(true);
            return;
        }

        // 오늘 숨김 체크
        const todayKey = `onboarding_dismiss_today_${uid}`;
        const today = new Date().toDateString();
        if (localStorage.getItem(todayKey) === today) {
            setVisible(false);
            setReady(true);
            return;
        }

        // ★ 모든 체크 통과 → 보여짐!
        setVisible(true);
        setCurrentStep(0);
        setReady(true);
    }, [user, userId, guideRole, steps.length]);

    // ── 하이라이트 대상 메뉴 위치 계산 ──
    const updateHighlight = useCallback(() => {
        if (!visible || !ready || steps.length === 0) return;
        const step = steps[currentStep];
        if (!step) return;

        const el = document.querySelector(`a[href="${step.menuPath}"]`);
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
    }, [visible, ready, currentStep, steps]);

    useEffect(() => {
        if (!visible || !ready) return;
        updateHighlight();
        const timer = setTimeout(updateHighlight, 500);
        window.addEventListener('resize', updateHighlight);
        window.addEventListener('scroll', updateHighlight);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateHighlight);
            window.removeEventListener('scroll', updateHighlight);
        };
    }, [updateHighlight, visible, ready]);

    // ── 액션 핸들러 ──
    const getUid = () => userId || user?.email || 'default';

    const dismissToday = () => {
        const todayKey = `onboarding_dismiss_today_${getUid()}`;
        localStorage.setItem(todayKey, new Date().toDateString());
        setVisible(false);
    };

    const dismissForever = () => {
        const foreverKey = `onboarding_dismiss_forever_${getUid()}`;
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

    // ★ user 없거나 아직 ready 안 됐으면 null
    if (!user || !ready || !visible || steps.length === 0) return null;

    const step = steps[currentStep];
    const stepTitle = t(`onboarding.steps.${step.key}.title`, step.key);
    const stepDesc = t(`onboarding.steps.${step.key}.desc`, '');
    const progress = ((currentStep + 1) / steps.length) * 100;
    const isLastStep = currentStep === steps.length - 1;

    // 툴팁 위치 계산
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
            {/* 오버레이 */}
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
                onClick={dismissToday}
            />

            {/* 하이라이트 영역 */}
            {highlightRect && !isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        zIndex: 10000,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease-out',
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

            {/* 말풍선 */}
            <div
                ref={tooltipRef}
                style={{ ...tooltipStyle, width: 340, maxWidth: 'calc(100vw - 32px)', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }}
                onClick={e => e.stopPropagation()}
            >
                {/* 진행률 바 */}
                <div style={{ height: 4, backgroundColor: '#f1f5f9' }}>
                    <div
                        style={{ height: '100%', background: 'linear-gradient(to right, #6366f1, #a855f7)', transition: 'width 0.5s ease-out', width: `${progress}%` }}
                    />
                </div>

                {/* 헤더 */}
                <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #9333ea)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                            <Sparkles size={16} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', margin: 0 }}>
                                {t('onboarding.title', '시작 가이드')}
                            </p>
                            <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, margin: 0 }}>
                                {currentStep + 1} / {steps.length}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={dismissToday}
                        style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 본문 */}
                <div style={{ padding: '0 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 30, flexShrink: 0, marginTop: 2 }}>{step.icon}</span>
                        <div>
                            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4, marginTop: 0 }}>
                                {stepTitle}
                            </h4>
                            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                                {stepDesc}
                            </p>
                        </div>
                    </div>

                    {/* 단계 인디케이터 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, justifyContent: 'center' }}>
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                style={{
                                    height: 6,
                                    borderRadius: 3,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    width: i === currentStep ? 24 : 6,
                                    backgroundColor: i === currentStep ? '#6366f1' : i < currentStep ? '#a5b4fc' : '#e2e8f0',
                                }}
                            />
                        ))}
                    </div>

                    {/* 네비게이션 버튼 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {currentStep > 0 && (
                            <button
                                onClick={prevStep}
                                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#6b7280', background: 'transparent', border: 'none', borderRadius: 12, cursor: 'pointer' }}
                            >
                                <ChevronLeft size={14} />
                                {t('onboarding.prev', '이전')}
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        <button
                            onClick={nextStep}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', fontSize: 12, fontWeight: 700, color: 'white', background: 'linear-gradient(to right, #6366f1, #9333ea)', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
                        >
                            {isLastStep ? t('onboarding.finish', '완료') : t('onboarding.next', '다음')}
                            {!isLastStep && <ChevronRight size={14} />}
                        </button>
                    </div>

                    {/* Dismiss 버튼들 */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <button
                            onClick={dismissToday}
                            style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                        >
                            {t('onboarding.dismissToday', '오늘 그만 보기')}
                        </button>
                        {isAfterFirstWeek && (
                            <>
                                <span style={{ color: '#e2e8f0' }}>|</span>
                                <button
                                    onClick={dismissForever}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
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
