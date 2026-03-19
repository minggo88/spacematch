import { useState, useEffect } from 'react'
import { trackPageView, trackEvent } from './utils/tracker'
import HeroSection from './components/HeroSection'
import CalculatorSection from './components/CalculatorSection'
import TrustSection from './components/TrustSection'
// AdSection removed — replaced by DynamicAd system
import SpacematchSection from './components/SpacematchSection'
import Footer from './components/Footer'
import ConversionModal from './components/ConversionModal'
import DetailedResult from './components/DetailedResult'
import FloatingBar from './components/FloatingBar'
import DynamicAd from './components/DynamicAd'
import './App.css'

/* ── LocalStorage 키 ──────────────────────────────── */
const STORAGE_KEY = 'spacematch_seller_calc'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [calcResult, setCalcResult] = useState({ marginRate: 0, marginAmount: 0 })
  const [calcData, setCalcData] = useState(null) // 전체 계산 데이터

  /* ── 페이지 로드 시: 트래킹 + URL 파라미터 체크 ────── */
  useEffect(() => {
    // 페이지뷰 트래킹
    trackPageView()

    const params = new URLSearchParams(window.location.search)
    const unlocked = params.get('unlocked')

    if (unlocked === 'true') {
      // SpaceMatch 로그인 후 복귀 → 전환 이벤트 트래킹
      trackEvent('conversion')

      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setCalcData(data)
          setIsUnlocked(true)
        } catch (e) {
          console.error('저장된 데이터 복원 실패:', e)
        }
      } else {
        // 데이터 없어도 잠금 해제
        setIsUnlocked(true)
      }

      // URL 정리 (파라미터 제거)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)

      // 계산기 섹션으로 스크롤
      setTimeout(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [])

  /* ── 계산 데이터 변경 시 LocalStorage에 저장 + 트래킹 */
  const handleResultChange = (result) => {
    setCalcResult(result)
    // 마진율이 0이 아닐 때만 계산 이벤트 기록 (초기 렌더 제외)
    if (result.marginRate !== 0) {
      trackEvent('calculate', { marginRate: result.marginRate })
    }
  }

  /* ── 상세 결과 보기 시도 → 데이터 저장 후 모달 열기 ─ */
  const handleUnlockAttempt = (currentCalcData) => {
    // 잠금 해제 시도 트래킹
    trackEvent('unlock_attempt')

    // 현재 계산 데이터를 localStorage에 저장
    if (currentCalcData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCalcData))
      setCalcData(currentCalcData)
    }
    setIsModalOpen(true)
  }

  /* ── 새로 상세 분석하기 → calcData 갱신 ──────── */
  const handleRefreshAnalysis = (newCalcData) => {
    setCalcData(newCalcData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalcData))
  }

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <HeroSection onCtaClick={scrollToCalculator} />

      {/* 광고 슬롯: 계산기 상단 */}
      <DynamicAd slotId="calc_top" />

      <CalculatorSection
        onUnlock={handleUnlockAttempt}
        onResultChange={handleResultChange}
        isUnlocked={isUnlocked}
        onRefreshAnalysis={handleRefreshAnalysis}
      />

      {/* 광고 슬롯: 계산기 ↔ 상세 분석 결과 사이 */}
      <DynamicAd slotId="calc_between" />

      {/* 상세 결과 (잠금 해제 시) */}
      {isUnlocked && calcData && (
        <DetailedResult data={calcData} />
      )}

      <TrustSection />
      <SpacematchSection />

      {/* 광고 슬롯: 하단 */}
      <DynamicAd slotId="calc_bottom" />

      <Footer />

      {isModalOpen && (
        <ConversionModal
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <FloatingBar result={calcResult} />
    </div>
  )
}

export default App
