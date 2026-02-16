import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const TOAST_STYLES = {
    success: {
        light: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/80 text-emerald-900',
        dark: 'dark:from-emerald-950/80 dark:to-teal-950/80 dark:border-emerald-700/40 dark:text-emerald-100',
        icon: 'text-emerald-500 dark:text-emerald-400',
        progress: 'bg-emerald-500 dark:bg-emerald-400',
        glow: 'shadow-emerald-200/40 dark:shadow-emerald-900/40',
    },
    error: {
        light: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/80 text-red-900',
        dark: 'dark:from-red-950/80 dark:to-rose-950/80 dark:border-red-700/40 dark:text-red-100',
        icon: 'text-red-500 dark:text-red-400',
        progress: 'bg-red-500 dark:bg-red-400',
        glow: 'shadow-red-200/40 dark:shadow-red-900/40',
    },
    warning: {
        light: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/80 text-amber-900',
        dark: 'dark:from-amber-950/80 dark:to-yellow-950/80 dark:border-amber-700/40 dark:text-amber-100',
        icon: 'text-amber-500 dark:text-amber-400',
        progress: 'bg-amber-500 dark:bg-amber-400',
        glow: 'shadow-amber-200/40 dark:shadow-amber-900/40',
    },
    info: {
        light: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/80 text-blue-900',
        dark: 'dark:from-blue-950/80 dark:to-indigo-950/80 dark:border-blue-700/40 dark:text-blue-100',
        icon: 'text-blue-500 dark:text-blue-400',
        progress: 'bg-blue-500 dark:bg-blue-400',
        glow: 'shadow-blue-200/40 dark:shadow-blue-900/40',
    },
};

const DURATION = 3500;

const ToastItem = ({ toast, onDismiss }) => {
    const [entering, setEntering] = useState(true);
    const [exiting, setExiting] = useState(false);
    const timerRef = useRef(null);
    const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
    const Icon = TOAST_ICONS[toast.type] || Info;

    useEffect(() => {
        requestAnimationFrame(() => setEntering(false));
        timerRef.current = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 350);
        }, toast.duration || DURATION);
        return () => clearTimeout(timerRef.current);
    }, []);

    const handleDismiss = () => {
        clearTimeout(timerRef.current);
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 350);
    };

    return (
        <div
            className={`
                relative flex items-center gap-3 w-full max-w-md px-5 py-4 
                rounded-2xl border backdrop-blur-xl
                shadow-xl ${style.glow}
                ${style.light} ${style.dark}
                transition-all duration-350 ease-out
                ${entering ? 'opacity-0 translate-y-[-20px] scale-95' : exiting ? 'opacity-0 translate-y-[-10px] scale-95' : 'opacity-100 translate-y-0 scale-100'}
            `}
            role="alert"
        >
            {/* Icon with pulse animation */}
            <div className="flex-shrink-0 relative">
                <div className={`absolute inset-0 rounded-full ${style.icon} opacity-20 animate-ping`} style={{ animationDuration: '2s' }} />
                <Icon size={22} className={`${style.icon} relative z-10`} strokeWidth={2.5} />
            </div>

            {/* Message */}
            <p className="flex-1 text-sm font-semibold leading-snug">
                {toast.message}
            </p>

            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
                <X size={14} className="opacity-50 hover:opacity-100 transition-opacity" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                <div
                    className={`h-full rounded-full ${style.progress} opacity-60`}
                    style={{
                        animation: `toast-progress ${toast.duration || DURATION}ms linear forwards`,
                    }}
                />
            </div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const showToast = useCallback((message, type = 'success', duration = DURATION) => {
        const id = ++idRef.current;
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Convenience methods
    const toast = {
        success: (msg, dur) => showToast(msg, 'success', dur),
        error: (msg, dur) => showToast(msg, 'error', dur),
        warning: (msg, dur) => showToast(msg, 'warning', dur),
        info: (msg, dur) => showToast(msg, 'info', dur),
    };

    return (
        <ToastContext.Provider value={{ showToast, toast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 pointer-events-none w-full px-4">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto w-full max-w-md">
                        <ToastItem toast={t} onDismiss={dismissToast} />
                    </div>
                ))}
            </div>

            {/* Progress bar keyframe animation */}
            <style>{`
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
};

export default ToastContext;
