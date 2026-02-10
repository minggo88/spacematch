import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * 공통 확인 모달 컴포넌트
 * 
 * @param {Object} modal - 모달 설정 객체
 * @param {string} modal.title - 모달 제목
 * @param {string} modal.message - 확인 메시지
 * @param {string} modal.type - 'danger' | 'success' | 'warning'
 * @param {string} modal.confirmLabel - 확인 버튼 텍스트
 * @param {Function} modal.onConfirm - 확인 콜백
 * @param {Function} onClose - 닫기 콜백
 */
const ConfirmModal = ({ modal, onClose }) => {
    if (!modal) return null;

    const isDanger = modal.type === 'danger';
    const isWarning = modal.type === 'warning';
    const isPositive = !isDanger && !isWarning;

    // 색상 테마
    const theme = isDanger
        ? { bg: 'bg-red-50', border: 'border-red-100', iconBg: 'bg-red-100', iconColor: 'text-red-600', btnBg: 'bg-red-600 hover:bg-red-700 active:bg-red-800' }
        : isWarning
            ? { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', btnBg: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800' }
            : { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600', btnBg: 'bg-green-600 hover:bg-green-700 active:bg-green-800' };

    const Icon = isPositive ? CheckCircle : AlertTriangle;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.15s ease-out' }}>
            {/* Backdrop - 위험 액션일 때는 클릭으로 닫기 비활성화 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={isDanger ? undefined : onClose}
            />

            {/* Modal Card */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden"
                style={{ animation: 'scaleIn 0.2s ease-out' }}
            >
                {/* Header */}
                <div className={`px-5 py-4 ${theme.bg} border-b ${theme.border}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.iconBg}`}>
                            <Icon size={20} className={theme.iconColor} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 leading-snug">{modal.title}</h3>
                        <button
                            onClick={onClose}
                            className="ml-auto p-1.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
                            aria-label="닫기"
                        >
                            <X size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{modal.message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-[0.97] transition-all"
                    >
                        취소
                    </button>
                    <button
                        onClick={modal.onConfirm}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm text-white active:scale-[0.97] transition-all shadow-sm ${theme.btnBg}`}
                    >
                        {modal.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
