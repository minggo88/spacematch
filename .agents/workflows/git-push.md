---
description: Git에 변경사항을 커밋하고 푸시하는 워크플로우
---

# Git 배포 규칙

## ⚠️ 핵심 규칙
- 작업 완료 시 `git add` + `git commit`은 **즉시** 수행
- `git push`는 **사용자가 명시적으로 요청할 때만** 수행
  - "배포 해주세요"
  - "서버에 올려주세요"
  - "push 해줘"

## 커밋 단계
// turbo
1. 변경 파일 스테이징: `git add <changed files>`
2. 커밋: `git commit -m "<type>: <description>"`

## 배포 단계 (사용자 요청 시에만!)
3. 푸시: `git push origin main`
4. 배포 상태 확인: `& "C:\Program Files\GitHub CLI\gh.exe" run list --repo thomas-paik/spacematch --limit 3`
