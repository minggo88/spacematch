---
description: Git에 변경사항을 커밋하고 dist 폴더에 빌드하는 워크플로우
---

# Git 커밋 & 빌드 규칙

## ⚠️ 핵심 규칙
- **`git push`는 절대 수행하지 않는다** (어떤 상황에서도!)
- 작업 완료 시 `git add` + `git commit`만 수행
- 서버 배포는 사용자가 **FTP로 `dist` 폴더를 직접 업로드**

## 커밋 단계
// turbo
1. 변경 파일 스테이징: `git add <changed files>`
// turbo
2. 커밋: `git commit -m "<type>: <description>"`

## 빌드 단계 (사용자 요청 시)
// turbo
3. 프로덕션 빌드: `npm run build`
4. 빌드 결과물은 `dist` 폴더에 생성됨
5. 사용자가 FTP로 `dist` 폴더 내용을 서버에 업로드

## ❌ 절대 금지
- `git push` 명령어 사용 금지
- GitHub Actions, CI/CD 배포 트리거 금지
