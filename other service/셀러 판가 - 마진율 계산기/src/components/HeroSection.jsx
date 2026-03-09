import './HeroSection.css'

export default function HeroSection({ onCtaClick }) {
    return (
        <section className="hero">
            {/* 기하학적 패턴 오버레이 */}
            <div className="hero__pattern" />

            <div className="container hero__inner">
                {/* 좌측: 텍스트 */}
                <div className="hero__text">
                    <h1 className="h1 hero__title">
                        내 상품,<br />
                        <span className="hero__accent">얼마에 팔아야</span> 남을까?
                    </h1>
                    <p className="hero__subtitle">
                        매입가·배송비·플랫폼 수수료까지 한 번에 입력하면<br />
                        마진율과 적정 판매가를 즉시 계산해 드립니다.
                    </p>
                    <button className="btn btn-cta pulse" onClick={onCtaClick}>
                        지금 바로 계산하기
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <p className="hero__badge">✦ 회원가입 없이 무료 사용</p>
                </div>

                {/* 우측: 계산기 목업 카드 */}
                <div className="hero__visual">
                    <div className="hero__mockup-card">
                        <div className="mockup__header">
                            <div className="mockup__dot" />
                            <div className="mockup__dot" />
                            <div className="mockup__dot" />
                        </div>
                        <div className="mockup__body">
                            <div className="mockup__label">판매가</div>
                            <div className="mockup__value">₩ 35,000</div>
                            <div className="mockup__divider" />
                            <div className="mockup__label">예상 마진율</div>
                            <div className="mockup__result">
                                <span className="mockup__number">32.4</span>
                                <span className="mockup__percent">%</span>
                            </div>
                            <div className="mockup__bar">
                                <div className="mockup__bar-fill" />
                            </div>
                            <div className="mockup__label">예상 순이익</div>
                            <div className="mockup__profit">₩ 11,340</div>
                        </div>
                    </div>
                    {/* floating elements */}
                    <div className="hero__float hero__float--1">📦</div>
                    <div className="hero__float hero__float--2">💰</div>
                    <div className="hero__float hero__float--3">📊</div>
                </div>
            </div>
        </section>
    )
}
