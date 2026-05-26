# Critical — SpaceMatch 개발·배포 규칙

이 파일은 **코드를 건드리기 전**, **배포 전**, **날짜가 바뀔 때** 읽는 상시 규칙이다.  
일자별 변경 내용은 `DEPLOY_YYYY-MM-DD.md`에 쌓는다.

---

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, **ask**.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, **stop**. Name what's confusing. Ask.

---

## 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, **rewrite it**.

> Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

---

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, **mention it — don't delete it**.

When your changes create orphans:
- Remove imports/variables/functions that **your** changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

---

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → Write tests for invalid inputs, then make them pass
- "Fix the bug" → Write a test that reproduces it, then make it pass
- "Refactor X" → Ensure tests pass before and after

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. 배포 규칙

### 날짜가 바뀌면
1. 이 파일을 다시 훑는다.
2. `docs/DEPLOY_YYYY-MM-DD.md` 당일 파일 확인 — 없으면 새로 만든다.
3. 전날 "아직 반영 안 된 항목"이 있으면 옮긴다.

### 코드 바꿨으면 반드시 기록 (`DEPLOY_YYYY-MM-DD.md`)

| 항목 | 내용 |
|------|------|
| 증상 | 보이던 문제 한 줄 |
| 원인 | 기술적으로 왜 그랬는지 한 줄 |
| 조치 | 바꾼 파일·동작 |
| 배포 | FTP 경로 (`www/...`) |

규칙: **PR·커밋만 하고 deploy 문서를 비우지 않는다.**

### 프로젝트 관례

1. **프론트 배포** — `index.html` + `assets/` 항상 **같은 빌드 세트**로 올린다. 한쪽만 올리면 해시 불일치·MIME 오류.
2. **PHP** — 소스 기준은 `public/api/...`, 서버 경로는 `www/api/...`. `dist/api`가 있으면 배포 전 동기화.
3. **인증** (`me.php`, `login.php`) — `rowCount()` 대신 `fetch()` 결과로 행 존재 판별.
4. **다국어** — 수정 시 항상 다국어 파일도 함께 수정.

---

## 6. 관련 파일

| 파일 | 용도 |
|------|------|
| `docs/critical.md` | 이 문서 — 상시 규칙 |
| `docs/DEPLOY_YYYY-MM-DD.md` | 일자별 변경·FTP 로그 |
| `CLAUDE.md` | AI 코딩 원칙·아키텍처 |
| `.cursor/rules/critical-deploy.mdc` | Cursor `alwaysApply` 규칙 |
