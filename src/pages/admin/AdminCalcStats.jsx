import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart3, Users, Calculator, Unlock, ArrowUpRight,
    Eye, Smartphone, Monitor, Globe, Calendar, RefreshCw,
    TrendingUp, TrendingDown, Clock, ExternalLink, ArrowUp, ArrowDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const API_BASE = '/api';

const PERIOD_OPTIONS = [
    { value: 'today', label: '오늘' },
    { value: '7d', label: '최근 7일' },
    { value: '30d', label: '최근 30일' },
];

const AdminCalcStats = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');
    const [error, setError] = useState(null);

    // ── 다크/라이트 색상 팔레트 ──
    const C = isDark ? {
        primary: '#7c78f2', primaryLight: '#9b98f5', primaryBg: '#2a2760',
        accent: '#9b98f5', dark: '#e2e8f0',
        green: '#34d399', red: '#f87171', amber: '#fbbf24', cyan: '#22d3ee',
        bg: '#0f172a', cardBg: '#1e293b', cardBorder: '#334155',
        text: '#f1f5f9', textSec: '#94a3b8', textMuted: '#64748b',
        tableBg: '#1e293b', tableHover: '#253449', tableHeader: '#253449',
        inputBg: '#253449', gridLine: '#334155',
        tagBg: '#334155', codeBg: '#253449',
        errorBg: '#451a1a', errorBorder: '#7f1d1d', errorText: '#fca5a5',
    } : {
        primary: '#5551e8', primaryLight: '#6d69f1', primaryBg: '#EEEDFD',
        accent: '#6d69f1', dark: '#2d2b6e',
        green: '#10b981', red: '#ef4444', amber: '#f59e0b', cyan: '#06b6d4',
        bg: 'transparent', cardBg: '#fff', cardBorder: '#e2e8f0',
        text: '#1e293b', textSec: '#64748b', textMuted: '#94a3b8',
        tableBg: '#fff', tableHover: '#f8fafc', tableHeader: '#f8fafc',
        inputBg: '#f1f5f9', gridLine: '#f1f5f9',
        tagBg: '#f1f5f9', codeBg: '#f1f5f9',
        errorBg: '#fef2f2', errorBorder: '#fecaca', errorText: '#dc2626',
    };

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/calc-stats/get_stats.php?period=${period}`, {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success) {
                setData(json);
            } else {
                setError(json.message || '데이터를 불러올 수 없습니다');
            }
        } catch (e) {
            setError('서버에 연결할 수 없습니다');
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <RefreshCw size={32} style={{ color: C.primary, animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: 12, color: C.textMuted, fontWeight: 600 }}>통계 로딩 중...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{
                    background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: 16,
                    padding: 32, maxWidth: 480, margin: '0 auto'
                }}>
                    <p style={{ color: C.errorText, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>⚠️ 오류 발생</p>
                    <p style={{ color: C.errorText, fontSize: 14, opacity: 0.8 }}>{error}</p>
                    <button onClick={fetchStats} style={{
                        marginTop: 16, padding: '10px 24px', background: C.primary,
                        color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                        fontWeight: 700, fontSize: 14
                    }}>다시 시도</button>
                </div>
            </div>
        );
    }

    const { summary, changes, chart, referrers, recent_logs, hourly } = data;

    // max값 계산 (차트 스케일링용)
    const maxChartValue = Math.max(...(chart || []).map(d =>
        Math.max(d.page_views || 0, d.unique_visitors || 0, d.calculations || 0)
    ), 1);

    const maxHourly = Math.max(...(hourly || []), 1);

    return (
        <div style={{ padding: '24px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Calculator size={28} style={{ color: C.primary }} />
                        마진율 계산기 통계
                    </h1>
                    <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>
                        {data.period.from} ~ {data.period.to}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {PERIOD_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setPeriod(opt.value)}
                            style={{
                                padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                                background: period === opt.value ? C.primary : C.inputBg,
                                color: period === opt.value ? '#fff' : C.textSec,
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                    <button onClick={fetchStats} style={{
                        padding: '8px 12px', borderRadius: 10, border: `1px solid ${C.cardBorder}`,
                        background: C.cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        color: C.textSec, fontWeight: 600, fontSize: 13
                    }}>
                        <RefreshCw size={14} /> 새로고침
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                <KPICard C={C} icon={<Eye size={22} />} label="총 페이지뷰" value={formatNum(summary.total_views)}
                    change={changes.views} color={C.primary} bg={C.primaryBg} />
                <KPICard C={C} icon={<Users size={22} />} label="고유 방문자 (UV)" value={formatNum(summary.total_uv)}
                    change={changes.uv} color={C.cyan} bg={isDark ? '#083344' : '#ecfeff'} />
                <KPICard C={C} icon={<Calculator size={22} />} label="계산 실행" value={formatNum(summary.total_calculations)}
                    change={changes.calculations} color={C.green} bg={isDark ? '#052e16' : '#ecfdf5'} />
                <KPICard C={C} icon={<ArrowUpRight size={22} />} label="전환율" value={`${summary.conversion_rate}%`}
                    sub={`${formatNum(summary.total_conversions)}건 전환`} color={C.amber} bg={isDark ? '#451a03' : '#fffbeb'} />
            </div>

            {/* ── 일별 추이 차트 + 디바이스 분포 ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
                {/* 일별 추이 */}
                <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BarChart3 size={18} style={{ color: C.primary }} />
                        일별 추이
                    </h3>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.textSec }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: C.primary, display: 'inline-block' }} /> 페이지뷰
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.textSec }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: C.cyan, display: 'inline-block' }} /> 방문자(UV)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.textSec }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: C.green, display: 'inline-block' }} /> 계산 실행
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200, padding: '0 4px' }}>
                        {(chart || []).map((d, i) => {
                            const pvH = (d.page_views / maxChartValue) * 180;
                            const uvH = (d.unique_visitors / maxChartValue) * 180;
                            const calcH = (d.calculations / maxChartValue) * 180;
                            const label = d.stat_date.slice(5);
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 180 }}>
                                        <div title={`PV: ${d.page_views}`} style={{ width: 8, height: Math.max(pvH, 2), background: C.primary, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
                                        <div title={`UV: ${d.unique_visitors}`} style={{ width: 8, height: Math.max(uvH, 2), background: C.cyan, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
                                        <div title={`계산: ${d.calculations}`} style={{ width: 8, height: Math.max(calcH, 2), background: C.green, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
                                    </div>
                                    <span style={{ fontSize: 10, color: C.textMuted, marginTop: 6, whiteSpace: 'nowrap' }}>{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 디바이스 분포 */}
                <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Smartphone size={18} style={{ color: C.primary }} />
                        디바이스 분포
                    </h3>
                    {(() => {
                        const mobile = Number(summary.total_mobile) || 0;
                        const desktop = Number(summary.total_desktop) || 0;
                        const total = mobile + desktop || 1;
                        const mobileP = Math.round((mobile / total) * 100);
                        const desktopP = 100 - mobileP;
                        return (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                                    <div style={{ width: 140, height: 140, borderRadius: '50%', background: `conic-gradient(${C.primary} 0% ${mobileP}%, ${C.green} ${mobileP}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 90, height: 90, borderRadius: '50%', background: C.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{total > 1 ? formatNum(total) : '0'}</span>
                                            <span style={{ fontSize: 11, color: C.textMuted }}>총 뷰</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.textSec }}>
                                            <Smartphone size={16} style={{ color: C.primary }} /> 모바일
                                        </span>
                                        <span style={{ fontWeight: 700, color: C.text }}>{mobileP}% <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 12 }}>({formatNum(mobile)})</span></span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.textSec }}>
                                            <Monitor size={16} style={{ color: C.green }} /> 데스크톱
                                        </span>
                                        <span style={{ fontWeight: 700, color: C.text }}>{desktopP}% <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 12 }}>({formatNum(desktop)})</span></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ── 시간대별 분포 + 유입 경로 ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                {/* 시간대별 (점 그래프) */}
                <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={18} style={{ color: C.primary }} />
                        오늘 시간대별 방문
                    </h3>
                    {(() => {
                        const h = hourly || Array(24).fill(0);
                        const svgW = 480, svgH = 120, padX = 20, padY = 10;
                        const chartW = svgW - padX * 2, chartH = svgH - padY * 2;
                        const stepX = chartW / 23;
                        const points = h.map((c, i) => ({
                            x: padX + i * stepX,
                            y: padY + chartH - (maxHourly > 0 ? (c / maxHourly) * chartH : 0),
                            count: c,
                            hour: i,
                        }));
                        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                        const areaPath = linePath + ` L${points[23].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;
                        return (
                            <svg viewBox={`0 0 ${svgW} ${svgH + 20}`} style={{ width: '100%', height: 'auto' }}>
                                {[0, 0.5, 1].map((r, i) => (
                                    <line key={i} x1={padX} x2={svgW - padX} y1={padY + chartH * (1 - r)} y2={padY + chartH * (1 - r)}
                                        stroke={C.gridLine} strokeWidth={1} />
                                ))}
                                <path d={areaPath} fill={`${C.primary}18`} />
                                <path d={linePath} fill="none" stroke={C.primary} strokeWidth={2} strokeLinejoin="round" />
                                {points.map((p, i) => (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r={p.count > 0 ? 5 : 2.5}
                                            fill={p.count > 0 ? C.primary : C.textMuted}
                                            stroke={C.cardBg} strokeWidth={p.count > 0 ? 2 : 1} />
                                        {p.count > 0 && (
                                            <text x={p.x} y={p.y - 10} textAnchor="middle"
                                                fontSize={9} fontWeight={700} fill={C.primaryLight}>{p.count}</text>
                                        )}
                                        <title>{`${i}시: ${p.count}건`}</title>
                                    </g>
                                ))}
                                {[0, 3, 6, 9, 12, 15, 18, 21].map(i => (
                                    <text key={i} x={points[i].x} y={svgH + 14} textAnchor="middle"
                                        fontSize={9} fill={C.textMuted}>{i}시</text>
                                ))}
                            </svg>
                        );
                    })()}
                </div>

                {/* 유입 경로 */}
                <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Globe size={18} style={{ color: C.primary }} />
                        유입 경로
                    </h3>
                    {(referrers || []).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {referrers.map((r, i) => {
                                const maxRef = referrers[0]?.count || 1;
                                const pct = Math.round((r.count / maxRef) * 100);
                                return (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.source}</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{formatNum(r.count)}</span>
                                        </div>
                                        <div style={{ height: 6, background: C.inputBg, borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius: 3, transition: 'width 0.5s' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{ color: C.textMuted, textAlign: 'center', padding: 20, fontSize: 14 }}>아직 데이터가 없습니다</p>
                    )}
                </div>
            </div>

            {/* ── 퍼널 분석 ── */}
            <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}`, marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={18} style={{ color: C.primary }} />
                    전환 퍼널 분석
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
                    {[
                        { label: '페이지 방문', value: summary.total_uv, icon: <Users size={20} />, color: C.primary },
                        { label: '계산 실행', value: summary.total_calculations, icon: <Calculator size={20} />, color: C.cyan },
                        { label: '잠금 해제 시도', value: summary.total_unlocks, icon: <Unlock size={20} />, color: C.amber },
                        { label: '전환 완료', value: summary.total_conversions, icon: <ArrowUpRight size={20} />, color: C.green },
                    ].map((step, i, arr) => (
                        <React.Fragment key={i}>
                            <div style={{
                                textAlign: 'center', padding: '20px 28px', background: `${step.color}${isDark ? '20' : '08'}`,
                                borderRadius: 14, border: `1px solid ${step.color}${isDark ? '40' : '20'}`, minWidth: 140,
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${step.color}${isDark ? '30' : '15'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: step.color }}>
                                    {step.icon}
                                </div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{formatNum(step.value)}</div>
                                <div style={{ fontSize: 12, color: C.textSec, fontWeight: 600, marginTop: 4 }}>{step.label}</div>
                                {i > 0 && arr[i - 1].value > 0 && (
                                    <div style={{ fontSize: 11, color: step.color, fontWeight: 700, marginTop: 6, background: `${step.color}${isDark ? '30' : '10'}`, padding: '2px 8px', borderRadius: 8, display: 'inline-block' }}>
                                        {Math.round((step.value / arr[i - 1].value) * 100)}%
                                    </div>
                                )}
                            </div>
                            {i < arr.length - 1 && (
                                <div style={{ fontSize: 20, color: C.textMuted, padding: '0 8px' }}>→</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── 최근 방문 로그 ── */}
            <div style={{ background: C.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${C.cardBorder}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={18} style={{ color: C.primary }} />
                    최근 방문 로그
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: C.tableHeader }}>
                                <th style={{ ...thBase, color: C.textSec, borderBottom: `2px solid ${C.cardBorder}` }}>시간</th>
                                <th style={{ ...thBase, color: C.textSec, borderBottom: `2px solid ${C.cardBorder}` }}>IP</th>
                                <th style={{ ...thBase, color: C.textSec, borderBottom: `2px solid ${C.cardBorder}` }}>디바이스</th>
                                <th style={{ ...thBase, color: C.textSec, borderBottom: `2px solid ${C.cardBorder}` }}>리퍼러</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(recent_logs || []).map((log, i) => (
                                <tr key={i} style={{ borderBottom: `1px solid ${C.gridLine}` }}>
                                    <td style={{ ...tdBase, color: C.text, borderBottom: `1px solid ${C.gridLine}` }}>{formatDateTime(log.created_at)}</td>
                                    <td style={{ ...tdBase, borderBottom: `1px solid ${C.gridLine}` }}>
                                        <code style={{ background: C.codeBg, padding: '2px 6px', borderRadius: 4, fontSize: 12, color: C.textSec }}>{log.ip_address}</code>
                                    </td>
                                    <td style={{ ...tdBase, borderBottom: `1px solid ${C.gridLine}` }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                                            borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            background: log.device_type === 'mobile' ? (isDark ? '#2e1065' : '#ede9fe') : (isDark ? '#052e16' : '#ecfdf5'),
                                            color: log.device_type === 'mobile' ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? '#6ee7b7' : '#059669'),
                                        }}>
                                            {log.device_type === 'mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
                                            {log.device_type}
                                        </span>
                                    </td>
                                    <td style={{ ...tdBase, borderBottom: `1px solid ${C.gridLine}` }}>
                                        <span style={{ color: C.textMuted, fontSize: 12 }}>{log.referrer || '직접 방문'}</span>
                                    </td>
                                </tr>
                            ))}
                            {(!recent_logs || recent_logs.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ ...tdBase, textAlign: 'center', color: C.textMuted, padding: 32, borderBottom: `1px solid ${C.gridLine}` }}>
                                        아직 방문 기록이 없습니다
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ── Sub Components ──

const KPICard = ({ C, icon, label, value, change, sub, color, bg }) => {
    const diff = change ? (Number(change.today) - Number(change.yesterday)) : null;
    const isUp = diff > 0;
    const isDown = diff < 0;

    return (
        <div style={{
            background: C.cardBg, borderRadius: 16, padding: 20,
            border: `1px solid ${C.cardBorder}`, position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSec }}>{label}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 4 }}>{value}</div>
            {change && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    {isUp && <ArrowUp size={14} style={{ color: C.green }} />}
                    {isDown && <ArrowDown size={14} style={{ color: C.red }} />}
                    <span style={{ color: isUp ? C.green : isDown ? C.red : C.textMuted, fontWeight: 600 }}>
                        {diff === 0 ? '변동 없음' : `전일 대비 ${Math.abs(diff)}`}
                    </span>
                    <span style={{ color: C.textMuted }}>|</span>
                    <span style={{ color: C.textMuted }}>어제 {formatNum(change.yesterday)}</span>
                </div>
            )}
            {sub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
        </div>
    );
};

// ── Utility ──

const thBase = {
    textAlign: 'left', padding: '10px 14px', fontWeight: 700, fontSize: 12,
};

const tdBase = {
    padding: '10px 14px',
};

function formatNum(n) {
    if (n == null) return '0';
    return Number(n).toLocaleString('ko-KR');
}

function formatDateTime(dt) {
    if (!dt) return '-';
    const d = new Date(dt);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${mins}`;
}

export default AdminCalcStats;
