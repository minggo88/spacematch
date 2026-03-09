import { useScrollReveal } from '../hooks/useAnimations'
import './SpacematchSection.css'

const FEATURES = [
    {
        icon: '🏢',
        title: '전국 공간 매칭',
        desc: '오프라인 팝업 공간을 쉽고 빠르게 찾아보세요.',
    },
    {
        icon: '📊',
        title: '셀러 성장 도구',
        desc: '마진 계산, 재고 관리, 판매 분석을 한곳에서.',
    },
    {
        icon: '🤝',
        title: '파트너 네트워크',
        desc: '물류, 디자인, 마케팅 파트너를 연결해 드립니다.',
    },
]

export default function SpacematchSection() {
    const [ref, isVisible] = useScrollReveal()

    return (
        <section className="spacematch-section section" ref={ref}>
            <div className="spacematch-section__pattern" />
            <div className="container spacematch-section__inner">
                <img src="/seller-calc/logo.png" alt="SpaceMatch" className="spacematch-section__logo" />
                <h2 className="h2 spacematch-section__title">
                    이 도구를 만든 <span style={{ color: 'var(--accent-primary)' }}>스페이스매치</span>
                </h2>
                <p className="spacematch-section__subtitle">
                    셀러의 성장을 돕는 올인원 이커머스 플랫폼
                </p>

                <div className={`spacematch-grid ${isVisible ? 'visible' : ''}`}>
                    {FEATURES.map((feat, i) => (
                        <div
                            key={i}
                            className="card-glass spacematch-card"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <span className="spacematch-card__icon">{feat.icon}</span>
                            <h3 className="spacematch-card__title">{feat.title}</h3>
                            <p className="spacematch-card__desc">{feat.desc}</p>
                        </div>
                    ))}
                </div>

                <a
                    href="https://spacematch.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-cta spacematch-section__cta"
                >
                    스페이스매치 시작하기
                </a>
            </div>
        </section>
    )
}
