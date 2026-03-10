import { useEffect } from 'react'
import useCalculator, { PLATFORMS } from '../hooks/useCalculator'
import DonutChart from './DonutChart'
import BlurredResult from './BlurredResult'
import './CalculatorSection.css'

export default function CalculatorSection({ onUnlock, onResultChange, isUnlocked, onRefreshAnalysis }) {
    const {
        mode, setMode,
        inputs, updateInput, resetInputs,
        feeRate,
        analysisResult,
        reverseResult,
        currentResult,
    } = useCalculator()

    /* 결과를 부모로 전달 (FloatingBar 용) */
    useEffect(() => {
        if (mode === 'analysis') {
            onResultChange?.({
                marginRate: analysisResult.marginRate,
                marginAmount: analysisResult.marginAmount,
            })
        } else {
            onResultChange?.({
                marginRate: 0,
                marginAmount: reverseResult.expectedProfit,
                recommendedPrice: reverseResult.recommendedPrice,
            })
        }
    }, [mode, analysisResult, reverseResult])

    const handleInput = (key) => (e) => {
        updateInput(key, e.target.value)
    }

    const isPositive = (val) => val >= 0

    /* 현재 계산 데이터를 모아주는 헬퍼 */
    const gatherCalcData = () => ({
        mode,
        inputs: { ...inputs },
        feeRate,
        analysisResult: { ...analysisResult },
        reverseResult: { ...reverseResult },
        breakdown: currentResult.breakdown,
    })

    /* 상세 결과 보기 시도: 현재 계산 데이터 전체를 부모에 전달 */
    const handleUnlockClick = () => {
        onUnlock(gatherCalcData())
    }

    /* 새로 상세 분석하기: 수정된 입력으로 상세 분석 갱신 */
    const handleRefreshClick = () => {
        onRefreshAnalysis?.(gatherCalcData())
        // 상세 분석 영역으로 스크롤
        setTimeout(() => {
            document.querySelector('.detailed-result')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    return (
        <section id="calculator" className="calculator-section section">
            <div className="container">
                <h2 className="h2 calculator-section__title">마진율 계산기</h2>
                <p className="caption calculator-section__desc">
                    비용 항목을 입력하면 실시간으로 마진율과 수익을 분석해 드립니다
                </p>

                {/* 탭 전환 */}
                <div className="calc-tabs">
                    <button
                        className={`calc-tabs__item ${mode === 'analysis' ? 'calc-tabs__item--active' : ''}`}
                        onClick={() => setMode('analysis')}
                    >
                        마진율 분석
                    </button>
                    <button
                        className={`calc-tabs__item ${mode === 'reverse' ? 'calc-tabs__item--active' : ''}`}
                        onClick={() => setMode('reverse')}
                    >
                        적정 판매가 역산
                    </button>
                </div>

                <div className="calc-grid">
                    {/* ── 좌측: 입력 영역 ──────────────────────── */}
                    <div className="card calc-input-card">
                        <div className="calc-input-card__header">
                            <div className="calc-input-card__header-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="2" width="16" height="20" rx="2" />
                                    <line x1="8" y1="6" x2="16" y2="6" />
                                    <line x1="8" y1="10" x2="16" y2="10" />
                                    <line x1="8" y1="14" x2="12" y2="14" />
                                </svg>
                            </div>
                            <h3>비용 정보 입력</h3>
                        </div>
                        <div className="calc-input-card__inner">

                            {/* 매입가 */}
                            <div className="field-group">
                                <div className="field-group__label-row">
                                    <span className="label">
                                        <span className="label-icon">💰</span>
                                        매입가 (원가)
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <span className="input-prefix">₩</span>
                                    <input
                                        className="input-field"
                                        type="number"
                                        placeholder="예: 10000"
                                        value={inputs.costPrice}
                                        onChange={handleInput('costPrice')}
                                    />
                                </div>
                            </div>

                            {/* 판매가 — 분석 모드에서만 */}
                            {mode === 'analysis' && (
                                <div className="field-group">
                                    <div className="field-group__label-row">
                                        <span className="label">
                                            <span className="label-icon">🏷️</span>
                                            판매가
                                        </span>
                                    </div>
                                    <div className="input-wrap">
                                        <span className="input-prefix">₩</span>
                                        <input
                                            className="input-field"
                                            type="number"
                                            placeholder="예: 35000"
                                            value={inputs.sellingPrice}
                                            onChange={handleInput('sellingPrice')}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 목표 마진율 — 역산 모드에서만 */}
                            {mode === 'reverse' && (
                                <div className="field-group">
                                    <div className="field-group__label-row">
                                        <span className="label">
                                            <span className="label-icon">🎯</span>
                                            목표 마진율
                                        </span>
                                    </div>
                                    <div className="input-wrap">
                                        <input
                                            className="input-field"
                                            type="number"
                                            placeholder="예: 30"
                                            value={inputs.targetMarginRate}
                                            onChange={handleInput('targetMarginRate')}
                                        />
                                        <span className="input-suffix">%</span>
                                    </div>
                                </div>
                            )}

                            {/* 배송비 */}
                            <div className="field-group">
                                <div className="field-group__label-row">
                                    <span className="label">
                                        <span className="label-icon">🚚</span>
                                        배송비 (건당)
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <span className="input-prefix">₩</span>
                                    <input
                                        className="input-field"
                                        type="number"
                                        placeholder="예: 3000"
                                        value={inputs.shippingCost}
                                        onChange={handleInput('shippingCost')}
                                    />
                                </div>
                            </div>

                            {/* 포장비 */}
                            <div className="field-group">
                                <div className="field-group__label-row">
                                    <span className="label">
                                        <span className="label-icon">📦</span>
                                        포장비 (건당)
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <span className="input-prefix">₩</span>
                                    <input
                                        className="input-field"
                                        type="number"
                                        placeholder="예: 500"
                                        value={inputs.packagingCost}
                                        onChange={handleInput('packagingCost')}
                                    />
                                </div>
                            </div>

                            {/* 인건비 */}
                            <div className="field-group">
                                <div className="field-group__label-row">
                                    <span className="label">
                                        <span className="label-icon">👷</span>
                                        인건비 (건당)
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <span className="input-prefix">₩</span>
                                    <input
                                        className="input-field"
                                        type="number"
                                        placeholder="예: 1000"
                                        value={inputs.laborCost}
                                        onChange={handleInput('laborCost')}
                                    />
                                </div>
                            </div>

                            {/* 플랫폼 수수료 */}
                            <div className="field-group">
                                <div className="field-group__label-row">
                                    <span className="label">
                                        <span className="label-icon">🛒</span>
                                        판매 플랫폼
                                    </span>
                                    <span className="caption">수수료 {feeRate}%</span>
                                </div>
                                <select
                                    className="input-field input-field--standalone"
                                    value={inputs.platformId}
                                    onChange={handleInput('platformId')}
                                >
                                    {PLATFORMS.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} {p.id !== 'custom' ? `(${p.rate}%)` : ''}
                                        </option>
                                    ))}
                                </select>
                                {inputs.platformId === 'custom' && (
                                    <div className="input-wrap" style={{ marginTop: 8 }}>
                                        <input
                                            className="input-field"
                                            type="number"
                                            placeholder="수수료율"
                                            value={inputs.customFeeRate}
                                            onChange={handleInput('customFeeRate')}
                                        />
                                        <span className="input-suffix">%</span>
                                    </div>
                                )}
                            </div>

                            {/* 부가세 */}
                            <div className="field-group field-group--row">
                                <span className="label">
                                    <span className="label-icon">📋</span>
                                    부가세 포함
                                </span>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={inputs.includeVat}
                                        onChange={(e) => updateInput('includeVat', e.target.checked)}
                                    />
                                    <span className="toggle__slider" />
                                </label>
                            </div>

                            {/* 버튼 */}
                            <div className="calc-input-card__actions">
                                <button className="btn btn-reset" onClick={resetInputs}>
                                    초기화
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── 우측: 결과 영역 ──────────────────────── */}
                    <div className="calc-result-area">
                        <div className="card calc-result-card">
                            <div className="calc-result-card__header">
                                <h3 className="h3" style={{ color: 'var(--white)' }}>
                                    {mode === 'analysis' ? '마진율 분석 결과' : '적정 판매가 결과'}
                                </h3>
                            </div>
                            <div className="calc-result-card__body">
                                {mode === 'analysis' ? (
                                    <>
                                        <div className="result-metric result-metric--main">
                                            <span className="result-metric__label">마진율</span>
                                            <span
                                                className="number-display"
                                                style={{ color: isPositive(analysisResult.marginRate) ? 'var(--accent-secondary)' : 'var(--accent-warning)', transition: 'color 0.3s ease' }}
                                            >
                                                {analysisResult.marginRate >= 0 ? '+' : ''}{(Math.round(analysisResult.marginRate * 10) / 10).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="result-metric">
                                            <span className="result-metric__label">마진 금액</span>
                                            <span
                                                className="result-metric__value"
                                                style={{ color: isPositive(analysisResult.marginAmount) ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}
                                            >
                                                {analysisResult.marginAmount >= 0 ? '+' : ''}{Math.round(analysisResult.marginAmount).toLocaleString()}원
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="result-metric result-metric--main">
                                            <span className="result-metric__label">적정 판매가</span>
                                            <span className="number-display" style={{ color: 'var(--primary-800)' }}>
                                                ₩{Math.round(reverseResult.recommendedPrice).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="result-metric">
                                            <span className="result-metric__label">예상 순이익</span>
                                            <span
                                                className="result-metric__value"
                                                style={{ color: isPositive(reverseResult.expectedProfit) ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}
                                            >
                                                {reverseResult.expectedProfit >= 0 ? '+' : ''}{Math.round(reverseResult.expectedProfit).toLocaleString()}원
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* 비용 구조 도넛 차트 */}
                                <DonutChart breakdown={currentResult.breakdown} />
                            </div>
                        </div>

                        {/* 블러 처리된 상세 결과 — 잠금 해제 전에만 표시 */}
                        {!isUnlocked && (
                            <BlurredResult onUnlock={handleUnlockClick} />
                        )}

                        {/* 잠금 해제 후 뱃지 + 새로 분석하기 버튼 */}
                        {isUnlocked && (
                            <div className="unlocked-area">
                                <div className="unlocked-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                    </svg>
                                    상세 분석이 해제되었습니다 — 아래에서 확인하세요
                                </div>
                                <button className="btn btn-refresh-analysis" onClick={handleRefreshClick}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 4 23 10 17 10" />
                                        <polyline points="1 20 1 14 7 14" />
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                    </svg>
                                    새로 상세 분석하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
