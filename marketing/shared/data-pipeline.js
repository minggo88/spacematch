/**
 * Space Match 공통 — 데이터 파이프라인
 * 
 * 마케팅 모듈 간 데이터 수집, 변환, 집계를 관리합니다.
 * ETL (Extract-Transform-Load) 패턴을 기반으로 합니다.
 */

// ── 데이터 소스 ──
export const DATA_SOURCES = {
    SALES_RECORDS: { id: 'sales_records', label: '매출 기록', table: 'seller_stats' },
    CAMPAIGNS: { id: 'campaigns', label: '캠페인', table: 'marketing_campaigns' },
    USER_PROFILES: { id: 'user_profiles', label: '사용자 프로필', table: 'users' },
    REVIEWS: { id: 'reviews', label: '리뷰', table: 'reviews' },
    NOTIFICATIONS: { id: 'notifications', label: '알림', table: 'notifications' },
    AD_METRICS: { id: 'ad_metrics', label: '광고 지표', table: 'ad_metrics' },
};

// ── 데이터 정제 ──
export function cleanData(records, schema = {}) {
    return records.map(record => {
        const cleaned = {};
        Object.entries(record).forEach(([key, value]) => {
            const type = schema[key] || 'string';
            switch (type) {
                case 'number':
                    cleaned[key] = Number(value) || 0;
                    break;
                case 'date':
                    cleaned[key] = value ? new Date(value).toISOString() : null;
                    break;
                case 'boolean':
                    cleaned[key] = !!value && value !== '0' && value !== 'false';
                    break;
                default:
                    cleaned[key] = value !== null && value !== undefined ? String(value).trim() : '';
            }
        });
        return cleaned;
    }).filter(r => Object.keys(r).length > 0);
}

// ── 데이터 집계 ──
export function aggregateData(records, { groupBy, metrics, filters = {} }) {
    // 필터 적용
    let filtered = [...records];
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            filtered = filtered.filter(r => value.includes(r[key]));
        } else {
            filtered = filtered.filter(r => r[key] === value);
        }
    });

    // 그룹핑
    const groups = {};
    filtered.forEach(record => {
        const key = Array.isArray(groupBy)
            ? groupBy.map(g => record[g] || '').join('_')
            : record[groupBy] || 'unknown';

        if (!groups[key]) groups[key] = [];
        groups[key].push(record);
    });

    // 메트릭 계산
    return Object.entries(groups).map(([key, groupRecords]) => {
        const result = { group: key, count: groupRecords.length };

        metrics.forEach(metric => {
            const values = groupRecords.map(r => Number(r[metric.field]) || 0);
            switch (metric.aggregation) {
                case 'sum':
                    result[metric.alias || metric.field] = values.reduce((s, v) => s + v, 0);
                    break;
                case 'avg':
                    result[metric.alias || metric.field] = values.length > 0
                        ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100
                        : 0;
                    break;
                case 'max':
                    result[metric.alias || metric.field] = Math.max(0, ...values);
                    break;
                case 'min':
                    result[metric.alias || metric.field] = values.length > 0 ? Math.min(...values) : 0;
                    break;
                case 'count':
                    result[metric.alias || metric.field] = values.filter(v => v > 0).length;
                    break;
                default:
                    result[metric.alias || metric.field] = values.reduce((s, v) => s + v, 0);
            }
        });

        return result;
    });
}

// ── 시계열 변환 ──
export function toTimeSeries(records, { dateField = 'date', valueField = 'revenue', interval = 'daily' }) {
    const series = {};

    records.forEach(r => {
        const date = r[dateField];
        if (!date) return;

        let key;
        switch (interval) {
            case 'monthly': key = date.substring(0, 7); break;
            case 'weekly': {
                const d = new Date(date);
                const w = new Date(d); w.setDate(d.getDate() - d.getDay());
                key = w.toISOString().split('T')[0];
                break;
            }
            default: key = date.substring(0, 10);
        }

        if (!series[key]) series[key] = { date: key, value: 0, count: 0 };
        series[key].value += Number(r[valueField]) || 0;
        series[key].count += 1;
    });

    return Object.values(series).sort((a, b) => a.date.localeCompare(b.date));
}

// ── 데이터 검증 ──
export function validateData(records, rules = []) {
    const errors = [];
    const valid = [];

    records.forEach((record, index) => {
        const recordErrors = [];

        rules.forEach(rule => {
            const value = record[rule.field];
            switch (rule.type) {
                case 'required':
                    if (value === null || value === undefined || value === '') {
                        recordErrors.push({ field: rule.field, rule: 'required', message: `${rule.field}은(는) 필수입니다` });
                    }
                    break;
                case 'min':
                    if (Number(value) < rule.value) {
                        recordErrors.push({ field: rule.field, rule: 'min', message: `${rule.field} 최소값: ${rule.value}` });
                    }
                    break;
                case 'max':
                    if (Number(value) > rule.value) {
                        recordErrors.push({ field: rule.field, rule: 'max', message: `${rule.field} 최대값: ${rule.value}` });
                    }
                    break;
                case 'pattern':
                    if (!new RegExp(rule.value).test(value)) {
                        recordErrors.push({ field: rule.field, rule: 'pattern', message: `${rule.field} 형식이 올바르지 않습니다` });
                    }
                    break;
                case 'enum':
                    if (!rule.values.includes(value)) {
                        recordErrors.push({ field: rule.field, rule: 'enum', message: `${rule.field}: [${rule.values.join(', ')}] 중 하나여야 합니다` });
                    }
                    break;
            }
        });

        if (recordErrors.length > 0) {
            errors.push({ index, errors: recordErrors });
        } else {
            valid.push(record);
        }
    });

    return { valid, errors, totalRecords: records.length, validCount: valid.length, errorCount: errors.length };
}

// ── 리포트 데이터 빌더 ──
export function buildReportData(records, config) {
    const { title = 'Report', dateRange, groupBy = 'date', metrics = [], filters = {} } = config;

    const aggregated = aggregateData(records, { groupBy, metrics, filters });
    const timeSeries = toTimeSeries(records, { dateField: 'date', valueField: metrics[0]?.field || 'revenue' });

    const summary = {};
    metrics.forEach(m => {
        const values = records.map(r => Number(r[m.field]) || 0);
        summary[m.alias || m.field] = {
            total: values.reduce((s, v) => s + v, 0),
            avg: values.length > 0 ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0,
            max: Math.max(0, ...values),
            min: values.length > 0 ? Math.min(...values) : 0,
        };
    });

    return {
        title,
        dateRange,
        summary,
        aggregated,
        timeSeries,
        recordCount: records.length,
        generatedAt: new Date().toISOString(),
    };
}

// ── CSV 내보내기 포맷 ──
export function toCSV(records, columns = null) {
    if (!records || records.length === 0) return '';

    const cols = columns || Object.keys(records[0]);
    const header = cols.join(',');
    const rows = records.map(r =>
        cols.map(c => {
            const val = r[c] !== undefined ? String(r[c]) : '';
            return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
    );

    return [header, ...rows].join('\n');
}

export default {
    DATA_SOURCES,
    cleanData,
    aggregateData,
    toTimeSeries,
    validateData,
    buildReportData,
    toCSV,
};
