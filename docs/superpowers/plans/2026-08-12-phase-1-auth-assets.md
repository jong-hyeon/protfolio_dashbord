# 1단계 인증 및 자산 관리 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase 이메일·비밀번호 인증을 적용하고, 로그인한 사용자가 자산을 추가·조회하며 총 평가금액을 볼 수 있는 Next.js 앱을 구축한다.

**Architecture:** App Router의 서버 페이지는 인증된 사용자를 확인해 대시보드를 보호한다. 브라우저 컴포넌트는 `AssetService`를 통해 자산을 만들고 목록을 갱신하며, 서비스는 `AssetRepository` 인터페이스를 통해 Supabase 구현체에 의존한다. 평가금액과 총액은 순수 계산 모듈에서 계산해 테스트한다.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth/Postgres, Vitest, Zod.

## Global Constraints

- 기본 통화는 대한민국 원화(KRW)이며 평가금액은 `quantity * currentPrice`로 계산한다.
- 자산 필수 입력은 이름, 계좌, 자산군, 수량, 현재가다.
- 계좌 값은 `isa`, `brokerage`, `cash`로 제한한다.
- 자산군 값은 `us_stock`, `kr_stock`, `bond`, `gold`, `cash`로 제한한다.
- Supabase 서비스 역할 키는 사용하거나 브라우저에 노출하지 않는다.
- RLS는 `auth.uid() = user_id` 행만 허용해야 한다.
- 한 작업은 테스트 실패 확인 → 최소 구현 → 통과 확인 순서로 진행한다.

---

### Task 1: Next.js 앱 및 UI 기반 구성

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `components.json`, `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/select.tsx`, `components/ui/table.tsx`
- Create: `.env.example`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: App Router + Tailwind 개발 환경 및 `@/` 경로 별칭
- Produces: `cn(...inputs: ClassValue[]): string` in `lib/utils.ts`

- [ ] **Step 1: 문서가 있는 저장소에서도 충돌 없이 Next.js 프로젝트를 생성한다.**

```bash
npx create-next-app@latest /private/tmp/portfolio-dashboard-bootstrap --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
rsync -a --exclude .git --exclude docs /private/tmp/portfolio-dashboard-bootstrap/ ./
```

- [ ] **Step 2: shadcn/ui를 초기화하고 필요한 기본 컴포넌트를 설치한다.**

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label select table
```

- [ ] **Step 3: Supabase 환경 변수 예시와 실행 안내를 작성한다.**

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- [ ] **Step 4: 개발 서버를 실행해 기본 페이지가 열리는지 확인한다.**

```bash
npm run dev
```

- [ ] **Step 5: 초기 구성 변경을 커밋한다.**

```bash
git add .
git commit -m "chore: scaffold Next.js portfolio app"
```

### Task 2: Supabase 스키마와 RLS 정책

**Files:**
- Create: `supabase/migrations/001_create_assets.sql`
- Create: `lib/supabase/database.types.ts`
- Modify: `.env.example`
- Test: Supabase SQL Editor에서 migration 실행

**Interfaces:**
- Produces: `assets` 테이블의 `AssetRow` 타입
- Produces: 로그인 사용자가 자신의 `assets` 행만 CRUD할 수 있는 RLS 정책

- [ ] **Step 1: migration SQL을 작성한다.**

```sql
create type public.account_type as enum ('isa', 'brokerage', 'cash');
create type public.asset_class as enum ('us_stock', 'kr_stock', 'bond', 'gold', 'cash');

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  account_type public.account_type not null,
  asset_class public.asset_class not null,
  quantity numeric not null check (quantity > 0),
  current_price numeric not null check (current_price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assets enable row level security;
```

- [ ] **Step 2: 사용자별 CRUD 정책을 추가한다.**

```sql
create policy "Users manage their own assets"
on public.assets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
```

- [ ] **Step 3: Supabase 프로젝트를 만들고 SQL Editor에서 migration을 실행한다.**

```bash
# Supabase Dashboard > SQL Editor에서 supabase/migrations/001_create_assets.sql 내용을 실행
```

- [ ] **Step 4: 테이블과 RLS가 활성화됐는지 Dashboard에서 확인한다.**

```text
Database > Tables > assets, Authentication > Policies에서 정책을 확인한다.
```

- [ ] **Step 5: 스키마 변경을 커밋한다.**

```bash
git add supabase/migrations/001_create_assets.sql lib/supabase/database.types.ts .env.example
git commit -m "feat: add secured assets schema"
```

### Task 3: 자산 도메인 계산과 검증

**Files:**
- Create: `features/assets/asset.types.ts`
- Create: `features/assets/asset.calculations.ts`
- Create: `features/assets/asset.validation.ts`
- Create: `tests/features/assets/asset.calculations.test.ts`
- Create: `tests/features/assets/asset.validation.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `calculateAssetValue(asset: Pick<Asset, 'quantity' | 'currentPrice'>): number`
- Produces: `calculateTotalValue(assets: Asset[]): number`
- Produces: `assetInputSchema` yielding `CreateAssetInput`

- [ ] **Step 1: 평가금액 합계의 실패 테스트를 작성한다.**

```ts
import { describe, expect, it } from "vitest";
import { calculateTotalValue } from "@/features/assets/asset.calculations";

it("sums asset quantities multiplied by current prices", () => {
  expect(calculateTotalValue([
    { quantity: 2, currentPrice: 50000 },
    { quantity: 3, currentPrice: 10000 },
  ])).toBe(130000);
});
```

- [ ] **Step 2: 테스트가 모듈 부재로 실패하는지 확인한다.**

```bash
npm run test -- tests/features/assets/asset.calculations.test.ts
```

- [ ] **Step 3: 최소 계산 구현을 작성한다.**

```ts
export const calculateAssetValue = (asset: { quantity: number; currentPrice: number }) =>
  asset.quantity * asset.currentPrice;

export const calculateTotalValue = (assets: Array<{ quantity: number; currentPrice: number }>) =>
  assets.reduce((total, asset) => total + calculateAssetValue(asset), 0);
```

- [ ] **Step 4: 이름·양수 숫자 검증의 실패 테스트와 Zod 스키마를 작성한다.**

```ts
expect(() => assetInputSchema.parse({ name: " ", quantity: 0, currentPrice: 1 })).toThrow();
```

- [ ] **Step 5: 단위 테스트 전체를 통과시키고 커밋한다.**

```bash
npm run test
git add features/assets tests/features/assets package.json package-lock.json
git commit -m "feat: add asset validation and calculations"
```

### Task 4: Supabase 인증과 경로 보호

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`
- Create: `components/auth/login-form.tsx`, `components/auth/signup-form.tsx`, `components/auth/logout-button.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `createClient()` for browser and server Supabase clients
- Produces: `/dashboard` redirect to `/login` when no authenticated user exists
- Produces: email/password sign-up, sign-in, sign-out UI

- [ ] **Step 1: `@supabase/ssr`와 `@supabase/supabase-js`를 설치한다.**

```bash
npm install @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 2: 브라우저와 서버 Supabase 클라이언트를 구현한다.**

```ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

- [ ] **Step 3: 로그인되지 않은 `/dashboard` 요청이 `/login`으로 이동하도록 서버 페이지와 middleware를 작성한다.**

```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

- [ ] **Step 4: 회원가입, 로그인, 로그아웃 폼을 구현하고 신규 계정으로 테스트한다.**

```text
회원가입 후 이메일 확인이 켜져 있으면 받은 편지함의 링크를 열고 로그인한다.
```

- [ ] **Step 5: lint와 production build를 확인하고 커밋한다.**

```bash
npm run lint
npm run build
git add app components/auth lib/supabase middleware.ts package.json package-lock.json
git commit -m "feat: add Supabase email authentication"
```

### Task 5: 자산 저장소, 추가 폼, 목록, 총 평가금액

**Files:**
- Create: `features/assets/asset.repository.ts`, `features/assets/supabase-asset.repository.ts`, `features/assets/asset.service.ts`
- Create: `components/assets/asset-form.tsx`, `components/assets/asset-table.tsx`, `components/assets/portfolio-summary.tsx`, `components/assets/assets-dashboard.tsx`
- Create: `app/dashboard/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `CreateAssetInput`, `Asset`, `calculateAssetValue`, `calculateTotalValue`
- Produces: `AssetRepository.list(): Promise<Asset[]>`, `AssetRepository.create(input): Promise<Asset>`
- Produces: client `AssetsDashboard` that refreshes the list after successful creation

- [ ] **Step 1: 저장소 계약을 정의한다.**

```ts
export interface AssetRepository {
  list(): Promise<Asset[]>;
  create(input: CreateAssetInput): Promise<Asset>;
}
```

- [ ] **Step 2: Supabase 구현체가 현재 사용자의 자산을 생성하고 최신 생성순으로 가져오게 한다.**

```ts
await supabase.from("assets").insert({ ...input, user_id: userId }).select().single();
await supabase.from("assets").select("*").order("created_at", { ascending: false });
```

- [ ] **Step 3: 폼 동작 테스트를 작성해 빈 이름과 0 이하 수량·현재가가 제출되지 않는지 확인한다.**

```ts
await user.click(screen.getByRole("button", { name: "자산 추가" }));
expect(await screen.findByText("자산 이름을 입력해 주세요.")).toBeInTheDocument();
```

- [ ] **Step 4: 자산 추가 폼을 구현한다.**

```text
필드: 자산 이름, 계좌 선택, 자산군 선택, 수량, 현재가(원)
성공: 폼을 초기화하고 목록·총액을 갱신한다.
실패: 사용자에게 저장 실패 메시지를 표시한다.
```

- [ ] **Step 5: 목록 테이블과 원화 총 평가금액 카드를 구현한다.**

```ts
export const formatKrw = (value: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
```

- [ ] **Step 6: RLS 분리, 자산 추가, 새로고침 후 유지, 총액 갱신을 수동 확인한다.**

```text
서로 다른 테스트 계정 두 개로 로그인해 각 목록에 다른 계정 자산이 보이지 않는지 확인한다.
```

- [ ] **Step 7: 전체 테스트·lint·build를 실행하고 커밋한다.**

```bash
npm run test
npm run lint
npm run build
git add app/dashboard components/assets features/assets tests
git commit -m "feat: add portfolio asset dashboard"
```

### Task 6: 배포 준비 문서화

**Files:**
- Modify: `README.md`, `.env.example`

**Interfaces:**
- Produces: 초보자도 재현 가능한 로컬 실행, Supabase 설정, Vercel 환경 변수 설정 안내

- [ ] **Step 1: 로컬 개발 명령을 README에 추가한다.**

```bash
npm install
cp .env.example .env.local
npm run dev
```

- [ ] **Step 2: Supabase와 Vercel 설정을 명시한다.**

```text
Supabase: Authentication > URL Configuration에 개발·배포 URL을 추가한다.
Vercel: Settings > Environment Variables에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 등록한다.
```

- [ ] **Step 3: 최종 production build를 다시 확인하고 문서를 커밋한다.**

```bash
npm run build
git add README.md .env.example
git commit -m "docs: add setup and deployment guide"
```
