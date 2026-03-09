import { useState, useMemo, useCallback } from 'react'

/* ── 플랫폼별 수수료율 데이터 ────────────────────────── */
export const PLATFORMS = [
    { id: 'coupang', name: '쿠팡', rate: 10.8 },
    { id: 'naver', name: '네이버 스마트스토어', rate: 5.6 },
    { id: 'gmarket', name: 'G마켓/옥션', rate: 12 },
    { id: 'ssg', name: 'SSG닷컴', rate: 13 },
    { id: '11st', name: '11번가', rate: 13 },
    { id: 'tmon', name: '티몬', rate: 12 },
    { id: 'wemake', name: '위메프', rate: 12 },
    { id: 'lotte', name: '롯데온', rate: 13 },
    { id: 'custom', name: '직접 입력', rate: 0 },
]

/* ── 초기 입력값 ────────────────────────────────── */
const initialInputs = {
    costPrice: '',       // 매입가
    sellingPrice: '',    // 판매가
    shippingCost: '',    // 배송비
    packagingCost: '',   // 포장비
    laborCost: '',       // 인건비
    platformId: 'coupang',
    customFeeRate: '',   // 직접 입력 수수료율
    includeVat: true,    // 부가세 포함 여부
    targetMarginRate: '', // 목표 마진율 (역산 모드)
}

export default function useCalculator() {
    const [mode, setMode] = useState('analysis') // 'analysis' | 'reverse'
    const [inputs, setInputs] = useState(initialInputs)

    const updateInput = useCallback((key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }, [])

    const resetInputs = useCallback(() => {
        setInputs(initialInputs)
    }, [])

    /* ── 현재 플랫폼 수수료율 ──────────────────────── */
    const feeRate = useMemo(() => {
        const platform = PLATFORMS.find(p => p.id === inputs.platformId)
        if (!platform) return 0
        if (platform.id === 'custom') return parseFloat(inputs.customFeeRate) || 0
        return platform.rate
    }, [inputs.platformId, inputs.customFeeRate])

    /* ── 숫자 파싱 헬퍼 ────────────────────────────── */
    const n = (key) => parseFloat(inputs[key]) || 0

    /* ── 마진율 분석 모드 계산 ──────────────────────── */
    const analysisResult = useMemo(() => {
        const sellingPrice = n('sellingPrice')
        const costPrice = n('costPrice')
        const shippingCost = n('shippingCost')
        const packagingCost = n('packagingCost')
        const laborCost = n('laborCost')

        if (sellingPrice <= 0) {
            return {
                marginRate: 0, marginAmount: 0,
                feeAmount: 0, vatAmount: 0, totalCost: 0,
                breakdown: null,
            }
        }

        const feeAmount = Math.round(sellingPrice * (feeRate / 100))
        const vatAmount = inputs.includeVat ? Math.round(sellingPrice / 11) : 0

        const totalCost = costPrice + shippingCost + packagingCost + laborCost + feeAmount + vatAmount
        const marginAmount = sellingPrice - totalCost
        const marginRate = (marginAmount / sellingPrice) * 100

        const breakdown = {
            costPrice,
            laborCost,
            packagingCost,
            shippingCost,
            feeAmount,
            vatAmount,
            profit: marginAmount,
        }

        return { marginRate, marginAmount, feeAmount, vatAmount, totalCost, breakdown }
    }, [inputs, feeRate])

    /* ── 적정 판매가 역산 모드 계산 ─────────────────── */
    const reverseResult = useMemo(() => {
        const costPrice = n('costPrice')
        const shippingCost = n('shippingCost')
        const packagingCost = n('packagingCost')
        const laborCost = n('laborCost')
        const targetMarginRate = parseFloat(inputs.targetMarginRate) || 0

        const fixedCost = costPrice + shippingCost + packagingCost + laborCost

        if (fixedCost <= 0 || targetMarginRate >= 100) {
            return { recommendedPrice: 0, expectedProfit: 0, breakdown: null }
        }

        // 판매가 = 고정비용 / (1 - 마진율/100 - 수수료율/100 - 부가세율)
        const vatRate = inputs.includeVat ? (1 / 11) : 0
        const denominator = 1 - (targetMarginRate / 100) - (feeRate / 100) - vatRate

        if (denominator <= 0) {
            return { recommendedPrice: 0, expectedProfit: 0, breakdown: null }
        }

        const recommendedPrice = Math.ceil(fixedCost / denominator / 10) * 10 // 10원 단위 올림
        const feeAmount = Math.round(recommendedPrice * (feeRate / 100))
        const vatAmount = inputs.includeVat ? Math.round(recommendedPrice / 11) : 0
        const expectedProfit = recommendedPrice - fixedCost - feeAmount - vatAmount

        const breakdown = {
            costPrice,
            laborCost,
            packagingCost,
            shippingCost,
            feeAmount,
            vatAmount,
            profit: expectedProfit,
        }

        return { recommendedPrice, expectedProfit, breakdown }
    }, [inputs, feeRate])

    const currentResult = mode === 'analysis' ? analysisResult : reverseResult

    return {
        mode, setMode,
        inputs, updateInput, resetInputs,
        feeRate,
        analysisResult,
        reverseResult,
        currentResult,
    }
}
