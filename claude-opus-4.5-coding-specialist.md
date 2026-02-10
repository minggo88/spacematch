# Claude Opus 4.5 Coding Specialist System Prompt

> **Version:** 1.0  
> **Last Updated:** 2026-02-06  
> **Author:** 백세웅  
> **Purpose:** 30년 경력 베테랑 기획자 + 개발자 역할을 하는 AI 시스템 프롬프트

---

## 📋 목차

- [개요](#개요)
- [프롬프트 전문](#프롬프트-전문)
- [주요 특징](#주요-특징)
- [사용 방법](#사용-방법)
- [적용 사례](#적용-사례)
- [세부 사항](#세부-사항)

---

## 개요

이 시스템 프롬프트는 Claude Opus 4.5 모델이 **시니어 소프트웨어 엔지니어 및 기술 아키텍트**로 동작하도록 설계되었습니다. 단순한 코드 생성기가 아닌, 프로덕션 수준의 코드를 작성하고 소프트웨어 설계에 대해 깊이 있게 사고하는 협업자 역할을 수행합니다.

### 핵심 컨셉

- **의도성(Intentionality)**: 모든 코드 결정에는 이유가 있음
- **명확성(Clarity)**: 가독성 최적화
- **견고성(Robustness)**: 엣지 케이스 처리 및 방어적 프로그래밍
- **실용성(Pragmatism)**: 완벽보다는 동작하는 솔루션 우선

---

## 프롬프트 전문

[여기에 전체 시스템 프롬프트 내용 삽입]

---

## 주요 특징

### 1. 엔지니어링 철학 (Part 1)
- 시니어 엔지니어의 사고 패턴과 철학 반영
- 문제 해결을 위한 체계적 접근법
- 실용주의적 기술 판단 기준

### 2. 코드 품질 표준 (Part 2)
- 함수/메서드 구조 원칙
- 명명 규칙 철학
- 에러 핸들링 전략
- 주석 작성 가이드

### 3. 언어별 전문성 (Part 3)
- **Python**: PEP 8, 타입 힌트, 데이터클래스
- **JavaScript/TypeScript**: 엄격 모드, async/await, 타입 안전성
- **SQL**: 명확한 쿼리 구조, CTE 활용
- **Bash/Shell**: 안전한 스크립트 작성

### 4. 고급 엔지니어링 실천 (Part 4)
- 테스팅 철학 (AAA 패턴)
- 보안 마인드셋
- 성능 인식 (Big-O 복잡도)
- 동시성 및 비동기 처리

### 5. 디버깅 및 문제 해결 (Part 5)
- 체계적 디버깅 방법론
- 일반적인 버그 패턴
- 에러 메시지 분석

### 6. 응답 프로토콜 (Part 6)
- 코드 요청 처리 방식
- 코드 리뷰 진행 방식
- 디버깅 지원 방식

### 7. 상호작용 예제 (Part 7)
- 빠른 질문 응답
- 구현 요청 처리
- 디버깅 도움
- 코드 리뷰 샘플

---

## 사용 방법

### Claude AI Space에서 사용

1. Space 생성 또는 기존 Space 선택
2. Space Instructions에 전체 프롬프트 붙여넣기
3. 코딩 관련 질문이나 요청 시작

### API 통합

```python
import anthropic

client = anthropic.Anthropic(api_key="YOUR_API_KEY")

system_prompt = """
[전체 시스템 프롬프트 내용]
"""

message = client.messages.create(
    model="claude-opus-4.5",
    max_tokens=4096,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Python으로 재시도 로직이 있는 HTTP 클라이언트 만들어줘"}
    ]
)
