/**
 * Space Match 셀러 마케팅 — 쿠폰 발행 엔진
 * 
 * 셀러가 다양한 유형의 쿠폰을 생성, 관리, 검증할 수 있는 엔진입니다.
 * 할인율/금액 쿠폰, 사용 조건, 유효기간, 사용 추적을 지원합니다.
 */

// ── 쿠폰 유형 ──
export const COUPON_TYPES = {
    PERCENTAGE: { id: 'percentage', label: '할인율 (%)', icon: '🏷️' },
    FIXED_AMOUNT: { id: 'fixed_amount', label: '고정 금액', icon: '💰' },
    FREE_SHIPPING: { id: 'free_shipping', label: '무료 배송', icon: '🚚' },
    BUY_X_GET_Y: { id: 'buy_x_get_y', label: 'N+1 이벤트', icon: '🎁' },
};

// ── 쿠폰 상태 ──
export const COUPON_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    EXPIRED: 'expired',
    DEPLETED: 'depleted',
};

// ── 고유 쿠폰 코드 생성 ──
export function generateCouponCode(prefix = 'SM', length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 혼동 가능 문자 제외 (0,O,I,1)
    let code = prefix;
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ── 쿠폰 생성 ──
export function createCoupon({
    name,
    type = 'percentage',
    value = 10,
    minOrderAmount = 0,
    maxDiscountAmount = null,
    maxUsageTotal = null,
    maxUsagePerUser = 1,
    validFrom = new Date().toISOString().split('T')[0],
    validUntil = null,
    applicableCategories = [],
    applicableCountries = [],
    prefix = 'SM',
}) {
    if (!name) throw new Error('쿠폰 이름은 필수입니다');
    if (type === 'percentage' && (value <= 0 || value > 100)) throw new Error('할인율은 1~100% 사이여야 합니다');
    if (type === 'fixed_amount' && value <= 0) throw new Error('할인 금액은 0보다 커야 합니다');

    // 유효기간 미설정 시 30일 기본
    if (!validUntil) {
        const d = new Date(validFrom);
        d.setDate(d.getDate() + 30);
        validUntil = d.toISOString().split('T')[0];
    }

    return {
        id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        code: generateCouponCode(prefix),
        name,
        type,
        value,
        minOrderAmount,
        maxDiscountAmount,
        maxUsageTotal,
        maxUsagePerUser,
        validFrom,
        validUntil,
        applicableCategories,
        applicableCountries,
        status: COUPON_STATUS.DRAFT,
        usageCount: 0,
        usageHistory: [],
        createdAt: new Date().toISOString(),
    };
}

// ── 쿠폰 유효성 검증 ──
export function validateCoupon(coupon, orderAmount, userId = null, category = null, country = null) {
    const errors = [];
    const now = new Date().toISOString().split('T')[0];

    if (coupon.status !== COUPON_STATUS.ACTIVE) {
        errors.push(`쿠폰이 활성 상태가 아닙니다 (현재: ${coupon.status})`);
    }
    if (now < coupon.validFrom) {
        errors.push('쿠폰 사용 기간이 시작되지 않았습니다');
    }
    if (now > coupon.validUntil) {
        errors.push('쿠폰 사용 기간이 만료되었습니다');
    }
    if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
        errors.push(`최소 주문금액 ${coupon.minOrderAmount.toLocaleString()}원 이상이어야 합니다`);
    }
    if (coupon.maxUsageTotal && coupon.usageCount >= coupon.maxUsageTotal) {
        errors.push('쿠폰 총 사용 한도에 도달했습니다');
    }
    if (userId && coupon.maxUsagePerUser) {
        const userUsageCount = coupon.usageHistory.filter(h => h.userId === userId).length;
        if (userUsageCount >= coupon.maxUsagePerUser) {
            errors.push('1인당 사용 한도를 초과했습니다');
        }
    }
    if (coupon.applicableCategories.length > 0 && category && !coupon.applicableCategories.includes(category)) {
        errors.push('해당 카테고리에 적용 불가한 쿠폰입니다');
    }
    if (coupon.applicableCountries.length > 0 && country && !coupon.applicableCountries.includes(country)) {
        errors.push('해당 국가에서 사용 불가한 쿠폰입니다');
    }

    return { valid: errors.length === 0, errors };
}

// ── 할인 금액 계산 ──
export function calculateDiscount(coupon, orderAmount) {
    let discount = 0;

    switch (coupon.type) {
        case 'percentage':
            discount = Math.round(orderAmount * (coupon.value / 100));
            break;
        case 'fixed_amount':
            discount = coupon.value;
            break;
        case 'free_shipping':
            discount = 0; // 배송비는 별도 처리
            break;
        case 'buy_x_get_y':
            discount = 0; // 상품 기반 할인, 별도 처리
            break;
    }

    // 최대 할인 제한
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
    }

    // 주문금액 초과 방지
    if (discount > orderAmount) {
        discount = orderAmount;
    }

    return {
        discount,
        finalAmount: orderAmount - discount,
        discountRate: orderAmount > 0 ? Math.round((discount / orderAmount) * 10000) / 100 : 0,
    };
}

// ── 쿠폰 사용 기록 ──
export function recordCouponUsage(coupon, userId, orderAmount, orderId) {
    const usage = {
        userId,
        orderId,
        orderAmount,
        discountApplied: calculateDiscount(coupon, orderAmount).discount,
        usedAt: new Date().toISOString(),
    };

    return {
        ...coupon,
        usageCount: coupon.usageCount + 1,
        usageHistory: [...coupon.usageHistory, usage],
        status: coupon.maxUsageTotal && coupon.usageCount + 1 >= coupon.maxUsageTotal
            ? COUPON_STATUS.DEPLETED
            : coupon.status,
    };
}

// ── 쿠폰 성과 분석 ──
export function analyzeCouponPerformance(coupon) {
    const totalDiscountGiven = coupon.usageHistory.reduce((s, h) => s + h.discountApplied, 0);
    const totalOrderAmount = coupon.usageHistory.reduce((s, h) => s + h.orderAmount, 0);
    const uniqueUsers = new Set(coupon.usageHistory.map(h => h.userId)).size;

    return {
        couponCode: coupon.code,
        name: coupon.name,
        type: coupon.type,
        totalUsage: coupon.usageCount,
        uniqueUsers,
        totalDiscountGiven,
        totalOrderAmount,
        avgDiscountPerUse: coupon.usageCount > 0 ? Math.round(totalDiscountGiven / coupon.usageCount) : 0,
        avgOrderPerUse: coupon.usageCount > 0 ? Math.round(totalOrderAmount / coupon.usageCount) : 0,
        roi: totalDiscountGiven > 0 ? Math.round(((totalOrderAmount - totalDiscountGiven) / totalDiscountGiven) * 100) / 100 : 0,
        redemptionRate: coupon.maxUsageTotal ? Math.round((coupon.usageCount / coupon.maxUsageTotal) * 10000) / 100 : null,
    };
}

// ── 일괄 쿠폰 생성 ──
export function createBulkCoupons(template, count = 10) {
    return Array.from({ length: count }, (_, i) => createCoupon({ ...template, name: `${template.name} #${i + 1}` }));
}

export default {
    COUPON_TYPES,
    COUPON_STATUS,
    generateCouponCode,
    createCoupon,
    validateCoupon,
    calculateDiscount,
    recordCouponUsage,
    analyzeCouponPerformance,
    createBulkCoupons,
};
