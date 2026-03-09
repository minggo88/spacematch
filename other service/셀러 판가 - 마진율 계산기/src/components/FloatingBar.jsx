import { useState, useEffect } from 'react'
import './FloatingBar.css'

export default function FloatingBar({ result }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const calcSection = document.getElementById('calculator')
            if (!calcSection) return
            const rect = calcSection.getBoundingClientRect()
            // 계산기 섹션이 뷰포트 밖으로 나가면 표시
            setShow(rect.bottom < 0 || rect.top > window.innerHeight)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!show) return null

    const { marginRate = 0, marginAmount = 0 } = result || {}
    const isPositive = marginAmount >= 0

    return (
        <div className="floating-bar">
            <div className="floating-bar__inner">
                <div className="floating-bar__metric">
                    <span className="floating-bar__label">마진율</span>
                    <span
                        className="floating-bar__value"
                        style={{ color: isPositive ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}
                    >
                        {marginRate >= 0 ? '+' : ''}{(Math.round(marginRate * 10) / 10).toFixed(1)}%
                    </span>
                </div>
                <div className="floating-bar__divider" />
                <div className="floating-bar__metric">
                    <span className="floating-bar__label">순이익</span>
                    <span
                        className="floating-bar__value"
                        style={{ color: isPositive ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}
                    >
                        {marginAmount >= 0 ? '+' : ''}{Math.round(marginAmount).toLocaleString()}원
                    </span>
                </div>
                <button
                    className="btn btn-cta floating-bar__btn"
                    onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    계산기로 이동
                </button>
            </div>
        </div>
    )
}
