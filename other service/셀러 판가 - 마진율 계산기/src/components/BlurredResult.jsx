import './BlurredResult.css'

export default function BlurredResult({ onUnlock }) {
    return (
        <div className="blurred-result">
            <div className="blurred-result__content">
                {/* fake data behind blur */}
                <div className="blurred-result__fake">
                    <div className="fake-row"><span>항목별 상세 분석</span><span>₩12,000</span></div>
                    <div className="fake-row"><span>플랫폼 비교 결과</span><span>₩8,500</span></div>
                    <div className="fake-row"><span>최적 판매가 추천</span><span>₩35,200</span></div>
                    <div className="fake-row"><span>월 예상 수익</span><span>₩420,000</span></div>
                </div>
            </div>
            <div className="blurred-result__overlay">
                <div className="blurred-result__lock">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <p className="blurred-result__title">상세 분석 결과 보기</p>
                <p className="blurred-result__desc">
                    항목별 비용 분석, 플랫폼 비교, 최적가 추천까지<br />
                    무료로 확인하세요
                </p>
                <button className="btn btn-cta" onClick={onUnlock}>
                    상세 결과 확인하기
                </button>
            </div>
        </div>
    )
}
