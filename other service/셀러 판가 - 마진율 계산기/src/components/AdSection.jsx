import './AdSection.css'

export default function AdSection() {
    return (
        <section className="ad-section section">
            <div className="container">
                <span className="ad-section__label">추천 서비스</span>
                <div className="ad-section__banner">
                    <div className="ad-section__content">
                        <span className="ad-section__badge">AD</span>
                        <div className="ad-section__text">
                            <h3 className="h3">이커머스 물류 자동화의 시작</h3>
                            <p className="body-text" style={{ color: 'var(--neutral-600)' }}>
                                주문 수집부터 재고 관리, 출고까지 — 셀러를 위한 올인원 물류 솔루션
                            </p>
                        </div>
                        <button className="btn btn-primary">자세히 보기</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
