import { useScrollReveal } from '../hooks/useAnimations'
import './TrustSection.css'

const TRUST_ITEMS = [
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-800)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: '정확한 수수료 반영',
        desc: '쿠팡, 네이버, 11번가 등 주요 플랫폼의 실제 수수료율을 실시간 반영합니다.',
    },
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-800)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
            </svg>
        ),
        title: '실시간 계산',
        desc: '입력과 동시에 결과가 즉시 반영됩니다. 다양한 시나리오를 빠르게 테스트해보세요.',
    },
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-800)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        title: '비용 구조 시각화',
        desc: '도넛 차트로 비용 구조를 한눈에 파악하고, 어디서 비용을 절감할 수 있는지 확인하세요.',
    },
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-800)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
            </svg>
        ),
        title: '역산 기능',
        desc: '목표 마진율을 입력하면 적정 판매가를 자동 계산합니다. 가격 전략 수립에 활용하세요.',
    },
]

export default function TrustSection() {
    const [ref, isVisible] = useScrollReveal()

    return (
        <section className="trust-section section" ref={ref}>
            <div className="container">
                <h2 className="h2 trust-section__title">왜 이 계산기를 사용해야 할까요?</h2>
                <p className="caption trust-section__desc">
                    이커머스 셀러를 위해 설계된 전문 마진율 계산 도구
                </p>
                <div className={`trust-grid ${isVisible ? 'visible' : ''}`}>
                    {TRUST_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className="trust-card card"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="trust-card__icon">{item.icon}</div>
                            <h3 className="h3 trust-card__title">{item.title}</h3>
                            <p className="body-text trust-card__desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
