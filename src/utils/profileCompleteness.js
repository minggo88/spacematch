/**
 * 대시보드 프로필 완성도(6항목) — `user`는 me.php 등에서 오는 snake_case 기준.
 * 공백만 있는 값·빈 문자열은 미입력으로 본다.
 * 사업자 구간은 business_no / brand_name / company_name 중 하나라도 있으면 충족.
 */
function strOk(v) {
    if (v == null) return false;
    const s = String(v).trim();
    return s !== '' && s !== 'null' && s !== 'undefined';
}

export function getProfileCompletenessPercent(user) {
    if (!user) return 0;
    // SellerProfile 에서 admin/superadmin 은 브랜드·사업자번호 입력 UI가 없음 → 해당 칸은 항상 충족으로 본다.
    const adminNoBizForm = user.role === 'admin' || user.role === 'superadmin';
    const total = 6;
    let filled = 0;
    if (strOk(user.name)) filled++;
    if (strOk(user.email)) filled++;
    if (strOk(user.phone)) filled++;
    if (adminNoBizForm || strOk(user.business_no) || strOk(user.brand_name) || strOk(user.company_name)) filled++;
    if (strOk(user.description)) filled++;
    if (strOk(user.profile_image)) filled++;
    return Math.round((filled / total) * 100);
}
