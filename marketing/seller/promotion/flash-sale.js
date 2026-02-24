/**
 * Space Match 셀러 마케팅 — 한정 세일 관리
 * 
 * 시간/수량 한정 플래시 세일을 생성하고 관리합니다.
 * 타이머, 재고, 참여자 추적 기능을 제공합니다.
 */

// ── 세일 유형 ──
export const SALE_TYPES = {
    TIME_LIMITED: { id: 'time', label: '타임 세일', icon: '⏰', description: '시간 제한 할인' },
    QUANTITY_LIMITED: { id: 'quantity', label: '수량 한정', icon: '📦', description: '선착순 한정 수량' },
    EARLY_BIRD: { id: 'early_bird', label: '얼리버드', icon: '🐤', description: '초기 참여자 특별 혜택' },
    HAPPY_HOUR: { id: 'happy_hour', label: '해피 아워', icon: '🎉', description: '특정 시간대 할인' },
};

// ── 세일 상태 ──
export const SALE_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    PAUSED: 'paused',
    SOLD_OUT: 'sold_out',
    ENDED: 'ended',
};

// ── 플래시 세일 생성 ──
export function createFlashSale({
    title,
    type = 'time',
    discountPercent = 20,
    startTime,
    endTime,
    totalQuantity = null,
    maxPerUser = 1,
    targetCategories = [],
    targetCountries = [],
    description = '',
}) {
    if (!title) throw new Error('세일 제목은 필수입니다');
    if (!startTime) throw new Error('시작 시간은 필수입니다');
    if (discountPercent <= 0 || discountPercent > 90) throw new Error('할인율은 1~90% 사이여야 합니다');

    // 종료 시간 기본값 (시작 후 2시간)
    if (!endTime) {
        const end = new Date(startTime);
        end.setHours(end.getHours() + 2);
        endTime = end.toISOString();
    }

    return {
        id: `flash_${Date.now()}`,
        title,
        description,
        type,
        discountPercent,
        startTime,
        endTime,
        totalQuantity,
        remainingQuantity: totalQuantity,
        maxPerUser,
        targetCategories,
        targetCountries,
        status: SALE_STATUS.SCHEDULED,
        participants: [],
        totalRevenue: 0,
        totalOrders: 0,
        createdAt: new Date().toISOString(),
    };
}

// ── 세일 상태 자동 판단 ──
export function determineSaleStatus(sale) {
    const now = new Date();
    const start = new Date(sale.startTime);
    const end = new Date(sale.endTime);

    if (sale.status === SALE_STATUS.PAUSED) return SALE_STATUS.PAUSED;
    if (sale.remainingQuantity !== null && sale.remainingQuantity <= 0) return SALE_STATUS.SOLD_OUT;
    if (now < start) return SALE_STATUS.SCHEDULED;
    if (now > end) return SALE_STATUS.ENDED;
    return SALE_STATUS.LIVE;
}

// ── 카운트다운 계산 ──
export function calculateCountdown(sale) {
    const now = new Date();
    const start = new Date(sale.startTime);
    const end = new Date(sale.endTime);
    const status = determineSaleStatus(sale);

    let targetTime, label;
    if (status === SALE_STATUS.SCHEDULED) {
        targetTime = start;
        label = '시작까지';
    } else if (status === SALE_STATUS.LIVE) {
        targetTime = end;
        label = '종료까지';
    } else {
        return { label: '종료됨', hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isActive: false };
    }

    const diffMs = targetTime - now;
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        label,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isActive: status === SALE_STATUS.LIVE,
        progress: status === SALE_STATUS.LIVE
            ? Math.round(((end - now) / (end - start)) * 10000) / 100
            : 0,
    };
}

// ── 재고 확인 및 차감 ──
export function processOrder(sale, userId, quantity = 1) {
    const status = determineSaleStatus(sale);
    const errors = [];

    if (status !== SALE_STATUS.LIVE) errors.push(`세일이 진행 중이 아닙니다 (상태: ${status})`);
    if (sale.remainingQuantity !== null && sale.remainingQuantity < quantity) {
        errors.push(`남은 수량이 부족합니다 (잔여: ${sale.remainingQuantity})`);
    }

    const userOrders = sale.participants.filter(p => p.userId === userId);
    const userTotal = userOrders.reduce((s, p) => s + p.quantity, 0);
    if (sale.maxPerUser && userTotal + quantity > sale.maxPerUser) {
        errors.push(`1인당 구매 한도 ${sale.maxPerUser}개를 초과합니다`);
    }

    if (errors.length > 0) return { success: false, errors, sale };

    const updatedSale = {
        ...sale,
        remainingQuantity: sale.remainingQuantity !== null ? sale.remainingQuantity - quantity : null,
        totalOrders: sale.totalOrders + 1,
        participants: [...sale.participants, {
            userId,
            quantity,
            orderedAt: new Date().toISOString(),
        }],
    };

    updatedSale.status = determineSaleStatus(updatedSale);

    return { success: true, errors: [], sale: updatedSale };
}

// ── 세일 성과 분석 ──
export function analyzeFlashSalePerformance(sale) {
    const uniqueBuyers = new Set(sale.participants.map(p => p.userId)).size;
    const totalSold = sale.participants.reduce((s, p) => s + p.quantity, 0);
    const sellThroughRate = sale.totalQuantity
        ? Math.round(((sale.totalQuantity - (sale.remainingQuantity || 0)) / sale.totalQuantity) * 10000) / 100
        : null;

    const duration = (new Date(sale.endTime) - new Date(sale.startTime)) / (1000 * 60 * 60); // 시간 단위

    return {
        saleId: sale.id,
        title: sale.title,
        status: determineSaleStatus(sale),
        discountPercent: sale.discountPercent,
        totalOrders: sale.totalOrders,
        uniqueBuyers,
        totalSold,
        sellThroughRate,
        durationHours: Math.round(duration * 10) / 10,
        ordersPerHour: duration > 0 ? Math.round((sale.totalOrders / duration) * 10) / 10 : 0,
        remainingQuantity: sale.remainingQuantity,
    };
}

// ── 해피 아워 스케줄 생성 (반복 이벤트) ──
export function createHappyHourSchedule({
    title,
    discountPercent = 15,
    startHour = 14,
    endHour = 16,
    daysOfWeek = [1, 2, 3, 4, 5], // 평일
    weeksAhead = 4,
}) {
    const sales = [];
    const today = new Date();

    for (let week = 0; week < weeksAhead; week++) {
        daysOfWeek.forEach(dayOfWeek => {
            const date = new Date(today);
            date.setDate(today.getDate() + (dayOfWeek - today.getDay() + 7 * week + 7) % 7 + (week === 0 ? 0 : 0));

            // 이미 지난 날짜 건너뛰기
            if (date < today) return;

            const start = new Date(date);
            start.setHours(startHour, 0, 0, 0);
            const end = new Date(date);
            end.setHours(endHour, 0, 0, 0);

            sales.push(createFlashSale({
                title: `${title} [${date.toLocaleDateString('ko-KR', { weekday: 'short' })}]`,
                type: 'happy_hour',
                discountPercent,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
            }));
        });
    }

    return sales;
}

export default {
    SALE_TYPES,
    SALE_STATUS,
    createFlashSale,
    determineSaleStatus,
    calculateCountdown,
    processOrder,
    analyzeFlashSalePerformance,
    createHappyHourSchedule,
};
