import { a as useAuth } from "./index-BM1FR1Lq.js";
const useDemoGuard = () => {
  const { user } = useAuth();
  const isDemoUser = !!(user && (user.is_demo === 1 || user.is_demo === "1" || user.is_demo === true));
  const demoAlert = (actionName = "") => {
    const msg = actionName ? `데모 계정에서는 "${actionName}" 기능을 사용할 수 없습니다.
실제 계정을 만들어 이용해 주세요.` : "데모 계정에서는 이 기능을 사용할 수 없습니다.\n실제 계정을 만들어 이용해 주세요.";
    alert(msg);
    return true;
  };
  const guardAction = (fn, actionName = "") => {
    if (isDemoUser) {
      demoAlert(actionName);
      return;
    }
    return fn();
  };
  return { isDemoUser, demoAlert, guardAction };
};
export {
  useDemoGuard as u
};
