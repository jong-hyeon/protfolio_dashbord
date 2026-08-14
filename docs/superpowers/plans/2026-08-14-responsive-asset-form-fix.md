# Responsive Asset Form Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 화면 폭에 맞는 자산 카드 축소와 자산 이름 브라우저 자동완성 비활성화를 구현한다.

**Architecture:** `AssetsDashboard`의 두 grid item이 `min-w-0`으로 트랙 폭 안에서 축소되게 하고, 표만 기존 내부 스크롤 컨테이너에서 넘치게 한다. `AssetForm`은 제출용 필드명을 `assetName`으로 바꾸고 `autoComplete="off"`를 적용한 뒤, 기존 도메인 입력 `name`으로 매핑한다.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Vitest, Testing Library.

## Global Constraints

- 자산 표의 6개 열과 가로 스크롤 동작을 유지한다.
- 기존 자산 추가 유효성 검사와 Supabase 저장 계약을 변경하지 않는다.
- 브라우저 자동완성 제안은 자산 이름 입력칸에서 비활성화한다.

---

### Task 1: 반응형 축소와 자동완성 회귀 방지

**Files:**
- Modify: `components/assets/assets-dashboard.tsx`
- Modify: `components/assets/asset-form.tsx`
- Modify: `tests/components/assets/asset-form.test.tsx`
- Test: `tests/components/assets/asset-form.test.tsx`

**Interfaces:**
- Consumes: `AssetForm.onSubmit(input: CreateAssetInput): Promise<void>`
- Produces: `assetName` HTML 폼 필드를 기존 `CreateAssetInput.name`으로 변환한 제출 및 축소 가능한 grid item

- [ ] **Step 1: 자동완성 설정과 제출 매핑을 위한 실패 테스트를 작성한다.**

```tsx
const nameInput = screen.getByLabelText("자산 이름");
expect(nameInput).toHaveAttribute("name", "assetName");
expect(nameInput).toHaveAttribute("autocomplete", "off");
expect(nameInput.closest("form")).toHaveAttribute("autocomplete", "off");
```

- [ ] **Step 2: 대상 테스트를 실행해 현재 `name="name"` 때문에 실패하는지 확인한다.**

Run: `npm run test -- tests/components/assets/asset-form.test.tsx`

Expected: `name` 속성 기대값 불일치로 FAIL.

- [ ] **Step 3: 최소 구현을 적용한다.**

```tsx
<form autoComplete="off" ...>
  <Input id="name" name="assetName" autoComplete="off" ... />
</form>
const result = assetInputSchema.safeParse({
  name: String(new FormData(form).get("assetName")),
  // existing fields unchanged
});
```

`AssetsDashboard`의 폼 wrapper와 목록 `section`에는 각각 `min-w-0`을 추가한다.

- [ ] **Step 4: 대상 테스트와 전체 테스트를 실행한다.**

Run: `npm run test -- tests/components/assets/asset-form.test.tsx && npm run test`

Expected: 모든 테스트 PASS.

- [ ] **Step 5: 린트, build, 공백 검사를 실행한다.**

Run: `npm run lint && npm run build && git diff --check`

Expected: 모두 exit 0.

- [ ] **Step 6: 변경 사항을 커밋하고 기존 PR 브랜치에 푸시한다.**

```bash
git add components/assets/assets-dashboard.tsx components/assets/asset-form.tsx tests/components/assets/asset-form.test.tsx docs/superpowers
git commit -m "fix: keep asset dashboard responsive"
git push origin phase-1-auth-assets
```
