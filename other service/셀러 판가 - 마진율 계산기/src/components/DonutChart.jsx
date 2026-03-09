import { useMemo } from 'react'

/**
 * SVG 도넛 차트 — 비용 구조 시각화
 */
const COLORS = {
    costPrice: 'var(--chart-material)',
    laborCost: 'var(--chart-labor)',
    packagingCost: 'var(--chart-packaging)',
    shippingCost: 'var(--chart-shipping)',
    feeAmount: 'var(--chart-fee)',
    vatAmount: 'var(--chart-tax)',
    profit: 'var(--chart-profit)',
}

const LABELS = {
    costPrice: '재료비(매입가)',
    laborCost: '인건비',
    packagingCost: '포장비',
    shippingCost: '배송비',
    feeAmount: '수수료',
    vatAmount: '부가세',
    profit: '순이익',
}

export default function DonutChart({ breakdown, animate = true }) {
    const size = 220
    const strokeWidth = 36
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const cx = size / 2
    const cy = size / 2

    const segments = useMemo(() => {
        if (!breakdown) return []

        const allValues = Object.entries(breakdown)
            .map(([key, val]) => ({ key, value: Math.abs(val) }))
            .filter(d => d.value > 0)

        const total = allValues.reduce((s, d) => s + d.value, 0)
        if (total <= 0) return []

        let offset = 0
        return allValues.map((d, i) => {
            const fraction = d.value / total
            const dashLen = fraction * circumference
            const seg = {
                key: d.key,
                label: LABELS[d.key] || d.key,
                color: COLORS[d.key] || '#ccc',
                value: d.value,
                percent: (fraction * 100).toFixed(1),
                dashArray: `${dashLen} ${circumference - dashLen}`,
                dashOffset: -offset,
                delay: i * 0.08,
            }
            offset += dashLen
            return seg
        })
    }, [breakdown, circumference])

    const profitValue = breakdown?.profit ?? 0

    if (segments.length === 0) {
        return (
            <div className="donut-chart donut-chart--empty">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        cx={cx} cy={cy} r={radius}
                        fill="none" stroke="var(--neutral-300)"
                        strokeWidth={strokeWidth} opacity="0.3"
                    />
                </svg>
                <div className="donut-chart__center">
                    <span className="donut-chart__center-label">데이터 입력 대기</span>
                </div>
            </div>
        )
    }

    return (
        <div className="donut-chart">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map(seg => (
                    <circle
                        key={seg.key}
                        cx={cx} cy={cy} r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        strokeLinecap="butt"
                        style={{
                            transformOrigin: 'center',
                            transform: 'rotate(-90deg)',
                            animation: animate
                                ? `donutDraw 0.6s ease ${seg.delay}s both`
                                : 'none',
                        }}
                    />
                ))}
            </svg>
            <div className="donut-chart__center">
                <span className="donut-chart__center-label">순이익</span>
                <span
                    className="donut-chart__center-value"
                    style={{ color: profitValue >= 0 ? 'var(--accent-primary)' : 'var(--accent-warning)' }}
                >
                    {profitValue >= 0 ? '+' : ''}{profitValue.toLocaleString()}원
                </span>
            </div>

            {/* 범례 */}
            <ul className="donut-chart__legend">
                {segments.map(seg => (
                    <li key={seg.key} className="donut-chart__legend-item">
                        <span className="donut-chart__legend-dot" style={{ background: seg.color }} />
                        <span className="donut-chart__legend-label">{seg.label}</span>
                        <span className="donut-chart__legend-pct">{seg.percent}%</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
