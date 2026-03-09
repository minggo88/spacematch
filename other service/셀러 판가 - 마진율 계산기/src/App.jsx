import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import CalculatorSection from './components/CalculatorSection'
import TrustSection from './components/TrustSection'
import AdSection from './components/AdSection'
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

  /* ── 페이지 로드 시: URL 파라미터 체크 ────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const unlocked = params.get('unlocked')

    if (unlocked === 'true') {
      // SpaceMatch 로그인 후 복귀
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

  /* ── 계산 데이터 변경 시 LocalStorage에 저장 ──────── */
  const handleResultChange = (result) => {
    setCalcResult(result)
  }

  /* ── 상세 결과 보기 시도 → 데이터 저장 후 모달 열기 ─ */
  const handleUnlockAttempt = (currentCalcData) => {
    // 현재 계산 데이터를 localStorage에 저장
    if (currentCalcData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCalcData))
      setCalcData(currentCalcData)
    }
    setIsModalOpen(true)
  }

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <HeroSection onCtaClick={scrollToCalculator} />
      <CalculatorSection
        onUnlock={handleUnlockAttempt}
        onResultChange={handleResultChange}
        isUnlocked={isUnlocked}
      />

      {/* 광고 슬롯: 계산기 ↔ 상세 분석 결과 사이 */}
      <DynamicAd slotId="calc_between" />

      {/* 상세 결과 (잠금 해제 시) */}
      {isUnlocked && calcData && (
        <DetailedResult data={calcData} />
      )}

      <TrustSection />
      <AdSection />
      <SpacematchSection />
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
