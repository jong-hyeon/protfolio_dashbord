# 넓은 반응형 대시보드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 데스크톱의 넓은 화면을 활용하는 2단 포트폴리오 대시보드와 모바일 한 열 레이아웃을 구현한다.

**Architecture:** 페이지 컨테이너는 `max-w-screen-2xl`로 확장한다. `AssetsDashboard`가 `lg` breakpoint에서 4:8 비율의 12열 grid를 책임지고, 개별 컴포넌트는 크기와 여백만 조정한다. 데이터 접근·계산·폼 제출 동작은 변경하지 않는다.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, Testing Library.

## Global Constraints

- 데스크톱 `lg` 이상은 자산 추가 4열·자산 목록 8열의 2단 레이아웃을 사용한다.
- `lg` 미만은 요약 → 자산 추가 → 자산 목록 순서의 한 열로 표시한다.
- 모바일에서 표 열은 삭제하지 않고 가로 스크롤로 보존한다.
- 기존 자산 추가, 로그인, 회원가입 동작은 변경하지 않는다.

---

### Task 1: 레이아웃 회귀 테스트 작성

**Files:**
- Create: `tests/components/assets/assets-dashboard.test.tsx`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: `AssetsDashboard`, `AssetForm`, `AssetTable`, `PortfolioSummary`
- Produces: 큰 화면 레이아웃에 필요한 grid wrapper와 모바일 표 스크롤 컨테이너의 검증

- [ ] **Step 1: 자산 목록이 모바일 스크롤 컨테이너에 렌더링되는 실패 테스트를 작성한다.**

```tsx
const asset = {
  id: "asset-1", userId: "user-1", name: "S&P 500 ETF",
  accountType: "isa", assetClass: "us_stock", quantity: 2,
  currentPrice: 50000, createdAt: "2026-08-14T00:00:00.000Z",
  updatedAt: "2026-08-14T00:00:00.000Z",
} as const;

render(<AssetTable assets={[asset]} />);
expect(screen.getByTestId("asset-table-scroll").className).toContain("overflow-x-auto");
```

- [ ] **Step 2: 테스트가 test id 부재로 실패하는지 확인한다.**

```bash
npm run test -- tests/components/assets/assets-dashboard.test.tsx
```

- [ ] **Step 3: 테스트 전용 접근성 식별자를 추가하지 않고, 실제 스크롤 영역에 `data-testid`를 최소한으로 추가한다.**

```tsx
<div data-testid="asset-table-scroll" className="overflow-x-auto rounded-xl border">
```

- [ ] **Step 4: 테스트가 통과하는지 확인한다.**

```bash
npm run test -- tests/components/assets/assets-dashboard.test.tsx
```

### Task 2: 넓은 반응형 대시보드 구현

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/assets/assets-dashboard.tsx`
- Modify: `components/assets/asset-form.tsx`
- Modify: `components/assets/asset-table.tsx`
- Modify: `components/assets/portfolio-summary.tsx`

**Interfaces:**
- Consumes: 기존 `AssetsDashboard` 데이터 로딩 및 `AssetForm.onSubmit` 계약
- Produces: 큰 화면 4:8 grid, 모바일 한 열, 가로 스크롤 가능한 자산 표

- [ ] **Step 1: 페이지 컨테이너와 헤더를 반응형으로 확장한다.**

```tsx
<main className="mx-auto min-h-screen w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
```

- [ ] **Step 2: 요약 카드 아래에 12열 grid를 만들고 폼·목록을 4:8 비율로 배치한다.**

```tsx
<div className="grid gap-8 lg:grid-cols-12">
  <div className="lg:col-span-4"><AssetForm onSubmit={addAsset} /></div>
  <section className="lg:col-span-8">...</section>
</div>
```

- [ ] **Step 3: 요약·폼·목록 카드의 여백, 숫자 크기, 표 최소 너비를 키운다.**

```tsx
<Table className="min-w-[760px]">
```

- [ ] **Step 4: 작은 화면과 큰 화면에서 개발 서버로 레이아웃을 확인한다.**

```text
모바일 폭: 한 열과 표 가로 스크롤을 확인한다.
데스크톱 폭: 전폭 요약 카드와 4:8 2단 레이아웃을 확인한다.
```

### Task 3: 전체 검증 및 문서화

**Files:**
- Modify: `README.md`
- Test: `tests/components/assets/assets-dashboard.test.tsx`

**Interfaces:**
- Produces: 반응형 화면 확인 방법이 포함된 로컬 실행 문서

- [ ] **Step 1: README에 데스크톱·모바일 확인 방법을 추가한다.**

```text
브라우저 개발자 도구의 기기 모드에서 375px와 1440px 폭을 확인한다.
```

- [ ] **Step 2: 전체 테스트, lint, production build를 실행한다.**

```bash
npm run test
npm run lint
npm run build
```

- [ ] **Step 3: 변경을 커밋하고 Pull Request #1 브랜치에 푸시한다.**

```bash
git add app components tests README.md
git commit -m "feat: improve responsive dashboard layout"
git push
```
