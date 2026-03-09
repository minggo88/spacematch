import { useEffect, useRef, useState } from 'react'

/**
 * Intersection Observer 기반 스크롤 페이드인 훅
 */
export function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(el)
                }
            },
            { threshold }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])

    return [ref, isVisible]
}

/**
 * 숫자 카운트업 애니메이션 훅
 */
export function useCountUp(target, duration = 400) {
    const [value, setValue] = useState(0)
    const prevTarget = useRef(target)

    useEffect(() => {
        const start = prevTarget.current
        prevTarget.current = target

        if (start === target) return

        const startTime = performance.now()
        let rafId

        const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setValue(Math.round(start + (target - start) * eased))

            if (progress < 1) {
                rafId = requestAnimationFrame(animate)
            }
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [target, duration])

    return value
}
