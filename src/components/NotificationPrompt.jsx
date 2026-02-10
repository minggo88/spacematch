import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Smartphone } from 'lucide-react';

/**
 * Persistent notification permission prompt.
 * Shows a beautiful popup asking users to enable browser notifications.
 * Keeps appearing on each visit until the user grants permission.
 * Uses a smart delay algorithm to avoid being annoying.
 */
const NotificationPrompt = () => {
    const [visible, setVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // Check if browser supports notifications
    const isSupported = 'Notification' in window;

    useEffect(() => {
        if (!isSupported) return;

        // Already granted ??no need to show
        if (Notification.permission === 'granted') return;

        // If user has permanently denied via browser settings, don't show
        if (Notification.permission === 'denied') return;

        // Check dismissal history from localStorage
        const dismissData = localStorage.getItem('spacematch_notif_dismiss');
        if (dismissData) {
            try {
                const { count, lastDismissed } = JSON.parse(dismissData);
                const now = Date.now();
                const elapsed = now - lastDismissed;

                // Smart delay algorithm: increase delay based on dismiss count
                // 1st dismiss: show after 30 seconds
                // 2nd dismiss: show after 2 minutes
                // 3rd dismiss: show after 10 minutes  
                // 4th+: show after 30 minutes
                const delays = [30000, 120000, 600000, 1800000];
                const delay = delays[Math.min(count - 1, delays.length - 1)] || 1800000;

                if (elapsed < delay) {
                    // Schedule to show after remaining delay
                    const remaining = delay - elapsed;
                    const timer = setTimeout(() => {
                        setVisible(true);
                        setTimeout(() => setAnimateIn(true), 50);
                    }, remaining);
                    return () => clearTimeout(timer);
                }
            } catch (e) {
                // Invalid data, show prompt
            }
        }

        // Show prompt after a 3-second delay on page load
        const timer = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setAnimateIn(true), 50);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isSupported]);

    const handleAllow = useCallback(async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                // Clear dismiss history
                localStorage.removeItem('spacematch_notif_dismiss');
                localStorage.setItem('spacematch_notif_granted', 'true');

                // Show a test notification
                new Notification('SpaceMatch 알림 설정 완료', {
                    body: '이제 새로운 소식을 바로 받아보실 수 있습니다.',
                    icon: '/favicon.ico',
                    tag: 'welcome'
                });
            }
        } catch (e) {
            console.error('Notification permission error:', e);
        }
        setAnimateIn(false);
        setTimeout(() => setVisible(false), 300);
    }, []);

    const handleDismiss = useCallback(() => {
        // Track dismiss count and timestamp
        const dismissData = localStorage.getItem('spacematch_notif_dismiss');
        let count = 1;
        if (dismissData) {
            try {
                count = JSON.parse(dismissData).count + 1;
            } catch (e) { }
        }
        localStorage.setItem('spacematch_notif_dismiss', JSON.stringify({
            count,
            lastDismissed: Date.now()
        }));

        setAnimateIn(false);
        setTimeout(() => setVisible(false), 300);
    }, []);

    if (!visible || !isSupported) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${animateIn ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'
                }`}
            onClick={handleDismiss}
        >
            <div
                className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transition-all duration-300 ${animateIn
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-8 opacity-0 scale-95'
                    }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient Header */}
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Bell size={32} className="text-white animate-bounce" style={{ animationDuration: '2s' }} />
                        </div>
                        <h2 className="text-xl font-extrabold mb-1">알림을 켜보세요! 🔔</h2>
                        <p className="text-white/80 text-sm">새로운 소식을 놓치지 마세요</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">입점 신청 결과 알림</p>
                                <p className="text-xs text-gray-500">승인/반려 결과를 바로 확인하세요</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Smartphone size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">커뮤니티 활동 알림</p>
                                <p className="text-xs text-gray-500">댓글, 좋아요를 놓치지 마세요</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bell size={16} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">새로운 공간 정보</p>
                                <p className="text-xs text-gray-500">새 공간 등록 및 상태 변경 알림</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                        <button
                            onClick={handleAllow}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Bell size={18} />
                            알림 받기
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="w-full py-3 text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors"
                        >
                            나중에 하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPrompt;
