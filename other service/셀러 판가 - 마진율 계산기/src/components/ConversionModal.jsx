import { useState } from 'react'
import './ConversionModal.css'

/* ── 이용약관 내용 ──────────────────────────────────── */
const TERMS_CONTENT = `
제1조 (목적)
본 약관은 주식회사 스페이스매치(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 셀러 마진율 계산기, 공간 매칭, 셀러 성장 도구 등 일체의 온라인 서비스를 말합니다.
② "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.
③ "회원"이란 서비스에 가입하여 아이디와 비밀번호를 부여받은 이용자를 말합니다.

제3조 (약관의 효력)
① 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대해 효력이 발생합니다.
② 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지합니다.

제4조 (서비스의 제공)
① 회사는 다음과 같은 서비스를 제공합니다.
  1. 셀러 마진율 계산 및 비용 분석 도구
  2. 판매 플랫폼별 수수료 비교
  3. 적정 판매가 추천
  4. 공간 매칭 서비스
  5. 기타 회사가 정하는 서비스

제5조 (회원 가입)
① 서비스 이용을 위해 회원 가입이 필요할 수 있습니다.
② 회원 가입은 이메일 인증을 통해 완료됩니다.

제6조 (서비스 이용의 제한)
회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다.
  1. 타인의 정보를 도용한 경우
  2. 서비스 운영을 방해하는 경우
  3. 관련 법령을 위반하는 경우

제7조 (면책조항)
① 회사는 천재지변, 전쟁 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.
② 계산기를 통한 결과는 참고용이며, 실제 거래 시 차이가 발생할 수 있습니다.

제8조 (분쟁 해결)
본 약관에 관한 분쟁은 회사의 본사 소재지 관할 법원을 전속 관할 법원으로 합니다.

부칙
본 약관은 2024년 1월 1일부터 시행합니다.

주식회사 스페이스매치
서울특별시 용산구 이촌로
`

const PRIVACY_CONTENT = `
주식회사 스페이스매치(이하 "회사")는 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리하기 위하여 다음과 같은 개인정보 처리방침을 수립·공개합니다.

제1조 (수집하는 개인정보 항목)
회사는 다음과 같은 개인정보를 수집합니다.
  • 필수항목: 이메일 주소
  • 선택항목: 이름, 사업자 정보
  • 자동 수집항목: 접속 IP, 쿠키, 서비스 이용 기록

제2조 (개인정보의 수집 및 이용 목적)
  • 서비스 제공 및 운영
  • 회원 관리 및 본인 확인
  • 마케팅 및 광고 활용 (동의 시)
  • 서비스 개선을 위한 통계 분석

제3조 (개인정보의 보유 및 이용 기간)
  • 회원 탈퇴 시까지 보유
  • 관계 법령에 의한 보존이 필요한 경우 해당 기간 동안 보유
    - 계약 또는 청약철회에 관한 기록: 5년
    - 소비자 불만 또는 분쟁 처리에 관한 기록: 3년
    - 웹사이트 방문 기록: 3개월

제4조 (개인정보의 제3자 제공)
회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.
  • 이용자가 사전에 동의한 경우
  • 법률에 의해 요구되는 경우

제5조 (개인정보의 파기)
  • 보유 기간 경과 시 지체 없이 파기합니다.
  • 전자적 파일: 복구 불가능한 방법으로 삭제
  • 종이 문서: 분쇄 또는 소각

제6조 (이용자의 권리)
이용자는 언제든지 다음 권리를 행사할 수 있습니다.
  • 개인정보 열람, 정정, 삭제 요청
  • 처리 정지 요청
  • 회원 탈퇴

제7조 (개인정보 보호책임자)
  • 책임자: 스페이스매치 개인정보보호팀
  • 이메일: contact@spacematch.net

제8조 (개인정보처리방침 변경)
본 방침은 시행일로부터 적용되며, 변경 사항은 서비스 내 공지합니다.

시행일: 2024년 1월 1일

주식회사 스페이스매치
서울특별시 용산구 이촌로
`

export default function ConversionModal({ onClose }) {
    const [email, setEmail] = useState('')
    const [agreed, setAgreed] = useState(false)
    const [error, setError] = useState('')
    const [subPopup, setSubPopup] = useState(null) // 'terms' | 'privacy' | null

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            if (subPopup) {
                setSubPopup(null)
            } else {
                onClose()
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!email || !email.includes('@')) {
            setError('올바른 이메일 주소를 입력해주세요.')
            return
        }
        if (!agreed) {
            setError('이용약관 및 개인정보처리방침에 동의해주세요.')
            return
        }

        const currentOrigin = window.location.origin
        const returnPath = window.location.pathname
        const redirectUri = `${currentOrigin}${returnPath}?unlocked=true`

        const loginUrl = new URL('https://spacematch.net/login')
        loginUrl.searchParams.set('email', email)
        loginUrl.searchParams.set('redirect_uri', redirectUri)
        loginUrl.searchParams.set('ref', 'seller-calc')

        window.location.href = loginUrl.toString()
    }

    const openTerms = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSubPopup('terms')
    }

    const openPrivacy = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSubPopup('privacy')
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-card">
                <div className="modal-card__bar" />

                <button className="modal-close" onClick={onClose} aria-label="닫기">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="modal-card__body">
                    <img src="/seller-calc/logo.png" alt="SpaceMatch" className="modal-card__logo" />

                    <h2 className="h3 modal-card__title">상세 분석 결과 보기</h2>
                    <p className="caption modal-card__desc">
                        스페이스매치에 가입하면 항목별 비용 분석,<br />
                        플랫폼 비교, 최적 판매가 추천까지 무료로 확인할 수 있어요.
                    </p>

                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="modal-form__field">
                            <label className="label" htmlFor="modal-email">이메일 주소</label>
                            <input
                                id="modal-email"
                                className="input-field"
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                autoFocus
                            />
                        </div>

                        {error && <p className="modal-form__error">{error}</p>}

                        <label className="modal-form__agree">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
                            />
                            <span className="modal-form__agree-text">
                                <button type="button" className="modal-form__link" onClick={openTerms}>이용약관</button> 및{' '}
                                <button type="button" className="modal-form__link" onClick={openPrivacy}>개인정보처리방침</button>에 동의합니다.
                            </span>
                        </label>

                        <button type="submit" className="btn btn-cta modal-form__submit">
                            이메일로 시작하기
                        </button>
                    </form>

                    <div className="modal-card__divider"><span>또는</span></div>

                    <a
                        href={(() => {
                            const currentOrigin = window.location.origin
                            const returnPath = window.location.pathname
                            const redirectUri = `${currentOrigin}${returnPath}?unlocked=true`
                            const loginUrl = new URL('https://spacematch.net/login')
                            loginUrl.searchParams.set('redirect_uri', redirectUri)
                            loginUrl.searchParams.set('ref', 'seller-calc')
                            return loginUrl.toString()
                        })()}
                        className="btn modal-card__login-btn"
                    >
                        이미 계정이 있으신가요? 로그인
                    </a>
                </div>
            </div>

            {/* ── 이용약관 / 개인정보처리방침 서브 팝업 ──── */}
            {subPopup && (
                <div className="sub-popup-overlay" onClick={() => setSubPopup(null)}>
                    <div className="sub-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="sub-popup__header">
                            <h3 className="h3">{subPopup === 'terms' ? '이용약관' : '개인정보처리방침'}</h3>
                            <button className="modal-close" onClick={() => setSubPopup(null)} aria-label="닫기">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="sub-popup__body">
                            <pre className="sub-popup__text">
                                {subPopup === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT}
                            </pre>
                        </div>
                        <div className="sub-popup__footer">
                            <button className="btn btn-cta" onClick={() => setSubPopup(null)}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
