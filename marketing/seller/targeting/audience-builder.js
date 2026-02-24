/**
 * Space Match 셀러 마케팅 — 타겟 오디언스 빌더
 * 
 * 마케팅 대상 고객 그룹을 다양한 조건 필터로 정의하고
 * 캠페인에 활용할 수 있는 오디언스를 생성합니다.
 */

// ── 필터 종류 ──
export const FILTER_TYPES = {
    COUNTRY: { id: 'country', label: '국가', icon: '🌍' },
    REGION: { id: 'region', label: '지역', icon: '📍' },
    CATEGORY: { id: 'category', label: '인기 카테고리', icon: '🏷️' },
    REVENUE_RANGE: { id: 'revenue_range', label: '매출 범위', icon: '💰' },
    RECORD_TYPE: { id: 'record_type', label: '기록 유형', icon: '📊' },
    VENUE_TYPE: { id: 'venue_type', label: '공간 유형', icon: '🏢' },
    SATISFACTION: { id: 'satisfaction', label: '만족도', icon: '⭐' },
    DATE_RANGE: { id: 'date_range', label: '활동 기간', icon: '📅' },
};

// ── 오디언스 생성 ──
export function createAudience({
    name,
    description = '',
    filters = [],
    logic = 'AND', // AND: 모든 조건 충족, OR: 하나라도 충족
}) {
    if (!name) throw new Error('오디언스 이름은 필수입니다');

    return {
        id: `audience_${Date.now()}`,
        name,
        description,
        filters: filters.map((f, i) => ({
            id: `filter_${i}`,
            type: f.type,
            operator: f.operator || 'equals',
            value: f.value,
            ...f,
        })),
        logic,
        estimatedSize: 0,
        matchedRecords: [],
        createdAt: new Date().toISOString(),
    };
}

// ── 단일 필터 평가 ──
function evaluateFilter(record, filter) {
    const { type, operator, value } = filter;

    const getValue = () => {
        switch (type) {
            case 'country': return record.country_code || 'KR';
            case 'region': return record.region || '';
            case 'category': return record.best_selling_item || '';
            case 'revenue_range': return Number(record.monthly_revenue) || 0;
            case 'record_type': return record.record_type || '';
            case 'venue_type': return record.venue_type || '';
            case 'satisfaction': return Number(record.satisfaction_score) || 0;
            case 'date_range': return record.record_date || '';
            default: return '';
        }
    };

    const recordValue = getValue();

    switch (operator) {
        case 'equals': return recordValue === value;
        case 'not_equals': return recordValue !== value;
        case 'contains': return String(recordValue).includes(String(value));
        case 'in': return Array.isArray(value) && value.includes(recordValue);
        case 'not_in': return Array.isArray(value) && !value.includes(recordValue);
        case 'greater_than': return Number(recordValue) > Number(value);
        case 'less_than': return Number(recordValue) < Number(value);
        case 'between':
            return Array.isArray(value) && Number(recordValue) >= Number(value[0]) && Number(recordValue) <= Number(value[1]);
        case 'after': return recordValue > value;
        case 'before': return recordValue < value;
        default: return true;
    }
}

// ── 오디언스에 레코드 매칭 ──
export function matchAudience(audience, records) {
    const matched = records.filter(record => {
        if (audience.filters.length === 0) return true;

        if (audience.logic === 'AND') {
            return audience.filters.every(f => evaluateFilter(record, f));
        } else {
            return audience.filters.some(f => evaluateFilter(record, f));
        }
    });

    return {
        ...audience,
        estimatedSize: matched.length,
        matchedRecords: matched,
    };
}

// ── 프리셋 오디언스 템플릿 ──
export const AUDIENCE_PRESETS = {
    highValue: () => createAudience({
        name: '고가치 셀러',
        description: '월 매출 500만원 이상',
        filters: [{ type: 'revenue_range', operator: 'greater_than', value: 5000000 }],
    }),
    internationalSellers: () => createAudience({
        name: '해외 활동 셀러',
        description: '한국 외 국가에서 활동',
        filters: [{ type: 'country', operator: 'not_equals', value: 'KR' }],
    }),
    satisfiedSellers: () => createAudience({
        name: '만족도 높은 셀러',
        description: '만족도 4점 이상',
        filters: [{ type: 'satisfaction', operator: 'greater_than', value: 3.9 }],
    }),
    newSellers: () => createAudience({
        name: '신규 셀러',
        description: '최근 30일 이내 활동 시작',
        filters: [{
            type: 'date_range',
            operator: 'after',
            value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }],
    }),
    japanSellers: () => createAudience({
        name: '일본 시장 셀러',
        description: '일본에서 활동하는 셀러',
        filters: [{ type: 'country', operator: 'equals', value: 'JP' }],
    }),
};

// ── 오디언스 비교 (Venn) ──
export function compareAudiences(audienceA, audienceB) {
    const setA = new Set(audienceA.matchedRecords.map(r => r.id || r.record_date));
    const setB = new Set(audienceB.matchedRecords.map(r => r.id || r.record_date));

    const intersection = [...setA].filter(id => setB.has(id));
    const onlyA = [...setA].filter(id => !setB.has(id));
    const onlyB = [...setB].filter(id => !setA.has(id));

    return {
        audienceA: { name: audienceA.name, size: setA.size },
        audienceB: { name: audienceB.name, size: setB.size },
        overlap: intersection.length,
        overlapPercent: setA.size > 0 ? Math.round((intersection.length / setA.size) * 10000) / 100 : 0,
        onlyA: onlyA.length,
        onlyB: onlyB.length,
        totalUnique: new Set([...setA, ...setB]).size,
    };
}

export default {
    FILTER_TYPES,
    createAudience,
    matchAudience,
    AUDIENCE_PRESETS,
    compareAudiences,
};
