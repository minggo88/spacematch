import { useAuth } from '../context/AuthContext';

/**
 * 데모 계정 가드 훅
 * 데모 계정 여부 확인 및 액션 차단 유틸리티
 */
export const useDemoGuard = () => {
    const { user } = useAuth();

    const isDemoUser = !!(user && (user.is_demo === 1 || user.is_demo === '1' || user.is_demo === true));

    const demoAlert = (actionName = '') => {
        const msg = actionName
            ? `데모 계정에서는 "${actionName}" 기능을 사용할 수 없습니다.\n실제 계정을 만들어 이용해 주세요.`
            : '데모 계정에서는 이 기능을 사용할 수 없습니다.\n실제 계정을 만들어 이용해 주세요.';
        alert(msg);
        return true; // returns true to indicate action was blocked
    };

    /**
     * Guard wrapper — wraps an action function.
     * If demo user, shows alert and blocks. Otherwise executes the action.
     * Usage: guardAction(() => handleSubmit(), '입점 신청')
     */
    const guardAction = (fn, actionName = '') => {
        if (isDemoUser) {
            demoAlert(actionName);
            return;
        }
        return fn();
    };

    return { isDemoUser, demoAlert, guardAction };
};

export default useDemoGuard;
