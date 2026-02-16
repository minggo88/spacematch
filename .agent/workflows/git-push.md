---
description: Git에 변경사항을 커밋하고 푸시하는 워크플로우
---

# Git 커밋 & 푸시

작업 완료 후 변경사항을 GitHub에 업로드합니다.

## 단계

// turbo-all

1. 변경된 파일 확인
```
git status
```

2. 모든 변경사항 스테이징
```
git add .
```

3. 커밋 메시지와 함께 커밋 (유저에게 커밋 메시지를 물어본 뒤 사용)
```
git commit -m "<커밋 메시지>"
```

4. GitHub에 푸시
```
git push
```
