import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';

/**
 * 공통 토스트 알림 컴포넌트
 * 
 * @param {Object} toast - 토스트 설정
 * @param {string} toast.message - 메시지 내용
 * @param {string} toast.type - 'success' | 'error' | 'warning'
 * @param {Function} onClose - 닫기 콜백
 * @param {number} duration - 표시 시간 (ms)
 */
const Toast = ({ toast, onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!toast) return;

        setIsExiting(false);

        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration - 300);

        const closeTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(closeTimer);
        };
    }, [toast, duration, onClose]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';
    const isWarning = toast.type === 'warning';
    const isError = toast.type === 'error';

    const theme = isSuccess
        ? { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', progress: 'bg-green-400' }
        : isWarning
            ? { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', progress: 'bg-amber-400' }
            : { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', progress: 'bg-red-400' };

    const Icon = isSuccess ? CheckCircle : isWarning ? AlertTriangle : XCircle;
    const iconColor = isSuccess ? 'text-green-500' : isWarning ? 'text-amber-500' : 'text-red-500';

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 200);
    };

    return (
        <div
            className="fixed top-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm pointer-events-auto"
            style={{
                transform: 'translateX(-50%)',
                animation: isExiting ? 'slideUp 0.25s ease-in forwards' : 'slideDown 0.3s ease-out',
            }}
        >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${theme.bg} ${theme.border} ${theme.text} relative overflow-hidden`}>
                <Icon size={18} className={`${iconColor} flex-shrink-0`} />
                <span className="text-sm font-bold flex-1 leading-snug">{toast.message}</span>
                <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
                    aria-label="닫기"
                >
                    <X size={14} />
                </button>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                    <div
                        className={`h-full ${theme.progress} rounded-full`}
                        style={{
                            animation: `toastProgress ${duration}ms linear`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toast;
