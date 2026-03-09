import './DetailedResult.css'

export default function DetailedResult({ data }) {
    if (!data) return null

    const { mode, inputs, feeRate, analysisResult, reverseResult, breakdown } = data

    /* 비용 항목 테이블 */
    const costItems = [
        { label: '매입가 (원가)', value: Number(inputs.costPrice) || 0 },
        { label: '배송비', value: Number(inputs.shippingCost) || 0 },
        { label: '포장비', value: Number(inputs.packagingCost) || 0 },
        { label: '인건비', value: Number(inputs.laborCost) || 0 },
        { label: `플랫폼 수수료 (${feeRate}%)`, value: mode === 'analysis' ? Math.round((Number(inputs.sellingPrice) || 0) * feeRate / 100) : Math.round((reverseResult?.recommendedPrice || 0) * feeRate / 100) },
    ]

    if (inputs.includeVat) {
        const sellingPrice = mode === 'analysis' ? Number(inputs.sellingPrice) || 0 : reverseResult?.recommendedPrice || 0
        costItems.push({ label: '부가세 (10%)', value: Math.round(sellingPrice * 0.1) })
    }

    const totalCost = costItems.reduce((sum, item) => sum + item.value, 0)
    const sellingPrice = mode === 'analysis' ? Number(inputs.sellingPrice) || 0 : reverseResult?.recommendedPrice || 0
    const profit = sellingPrice - totalCost

    return (
        <section id="detailed-result" className="detailed-section section">
            <div className="container">
                <div className="detailed-header">
                    <div className="detailed-header__icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="h2 detailed-header__title">상세 분석 결과</h2>
                        <p className="caption">항목별 비용 구조와 수익성을 한눈에 확인하세요</p>
                    </div>
                </div>

                <div className="detailed-grid">
                    {/* 비용 구조 테이블 */}
                    <div className="card detailed-card">
                        <h3 className="h3 detailed-card__title">
                            <span className="detailed-card__icon">📊</span>
                            비용 구조 상세
                        </h3>
                        <table className="detailed-table">
                            <thead>
                                <tr>
                                    <th>항목</th>
                                    <th>금액</th>
                                    <th>비중</th>
                                </tr>
                            </thead>
                            <tbody>
                                {costItems.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.label}</td>
                                        <td className="detailed-table__number">
                                            {item.value.toLocaleString()}원
                                        </td>
                                        <td className="detailed-table__pct">
                                            {sellingPrice > 0 ? (item.value / sellingPrice * 100).toFixed(1) : 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="detailed-table__total">
                                    <td>총 비용</td>
                                    <td className="detailed-table__number">
                                        {totalCost.toLocaleString()}원
                                    </td>
                                    <td className="detailed-table__pct">
                                        {sellingPrice > 0 ? (totalCost / sellingPrice * 100).toFixed(1) : 0}%
                                    </td>
                                </tr>
                                <tr className="detailed-table__profit">
                                    <td>순이익</td>
                                    <td className="detailed-table__number" style={{ color: profit >= 0 ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}>
                                        {profit >= 0 ? '+' : ''}{profit.toLocaleString()}원
                                    </td>
                                    <td className="detailed-table__pct" style={{ color: profit >= 0 ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}>
                                        {sellingPrice > 0 ? (profit / sellingPrice * 100).toFixed(1) : 0}%
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* 인사이트 카드 */}
                    <div className="card detailed-card">
                        <h3 className="h3 detailed-card__title">
                            <span className="detailed-card__icon">💡</span>
                            수익성 인사이트
                        </h3>
                        <div className="insight-list">
                            <div className={`insight-item ${profit >= 0 ? 'insight-item--good' : 'insight-item--bad'}`}>
                                <span className="insight-item__icon">{profit >= 0 ? '✅' : '⚠️'}</span>
                                <div>
                                    <strong>{profit >= 0 ? '수익 구조가 양호합니다' : '현재 적자 구조입니다'}</strong>
                                    <p>
                                        판매가 대비 순이익률이 {sellingPrice > 0 ? (profit / sellingPrice * 100).toFixed(1) : 0}%입니다.
                                        {profit >= 0
                                            ? ' 안정적인 수익 구조를 유지하고 있습니다.'
                                            : ' 판매가 인상 또는 비용 절감이 필요합니다.'
                                        }
                                    </p>
                                </div>
                            </div>

                            {costItems[0].value > 0 && sellingPrice > 0 && (
                                <div className="insight-item">
                                    <span className="insight-item__icon">📈</span>
                                    <div>
                                        <strong>원가 비중 분석</strong>
                                        <p>
                                            매입가가 판매가의 {(costItems[0].value / sellingPrice * 100).toFixed(1)}%를 차지합니다.
                                            {costItems[0].value / sellingPrice > 0.6
                                                ? ' 원가 비중이 높아 마진 확보가 어려울 수 있습니다.'
                                                : ' 적정 수준의 원가 비중입니다.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="insight-item">
                                <span className="insight-item__icon">🏪</span>
                                <div>
                                    <strong>플랫폼 수수료 영향</strong>
                                    <p>
                                        플랫폼 수수료({feeRate}%)가 판매가의
                                        {sellingPrice > 0 ? ` ${(sellingPrice * feeRate / 100 / sellingPrice * 100).toFixed(1)}%` : ' 0%'}에 해당합니다.
                                        수수료가 낮은 자사몰이나 직거래를 병행하면 수익률을 높일 수 있습니다.
                                    </p>
                                </div>
                            </div>

                            <div className="insight-item insight-item--cta">
                                <span className="insight-item__icon">🚀</span>
                                <div>
                                    <strong>더 자세한 분석이 필요하신가요?</strong>
                                    <p>
                                        스페이스매치에서 다양한 셀러 도구를 활용해보세요.
                                    </p>
                                    <a href="https://spacematch.net/" target="_blank" rel="noopener noreferrer" className="btn btn-cta insight-item__btn">
                                        스페이스매치 바로가기
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
