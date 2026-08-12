# 개인 투자 포트폴리오 대시보드 설계

## 목표

3주 안에 Vercel에 배포 가능한 개인 투자 포트폴리오 대시보드 MVP를 만든다. 사용자는 이메일과 비밀번호로 가입·로그인하고 자신의 자산을 관리한다.

## 기술 선택

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui로 폼, 테이블, 알림 UI 구성
- Recharts로 2주차 이후 비중 차트 구성
- Supabase Auth와 Postgres를 기본 저장소로 사용
- Supabase Row Level Security(RLS)로 사용자 데이터 분리

## 3주 로드맵

1. 1주차: Supabase 인증·데이터베이스·RLS, 자산 추가/목록/총 평가금액
2. 2주차: 자산 수정·삭제, 계좌 및 자산군 비중, 목표 비중과 차이
3. 3주차: Recharts 시각화, 예외·빈 상태, 테스트, Vercel 배포

## 사용자 흐름

1. 방문자는 회원가입 또는 로그인 화면으로 이동한다.
2. 인증된 사용자는 `/dashboard`에서 본인 자산을 본다.
3. 사용자는 이름, 계좌, 자산군, 수량, 현재가를 입력해 자산을 추가한다.
4. 화면은 평가금액(`수량 × 현재가`)과 전체 평가금액을 원화로 표시한다.
5. 모든 데이터 접근은 현재 인증된 사용자 소유 행으로 제한된다.

## 데이터 모델

`assets` 테이블은 다음 필드를 가진다.

- `id`: UUID 기본 키
- `user_id`: `auth.users.id`를 참조하는 소유자 UUID
- `name`: 자산 이름
- `account_type`: `isa`, `brokerage`, `cash` 중 하나
- `asset_class`: `us_stock`, `kr_stock`, `bond`, `gold`, `cash` 중 하나
- `quantity`: 0보다 큰 수량
- `current_price`: 0보다 큰 원화 현재가
- `created_at`, `updated_at`: 타임스탬프

평가금액은 중복 저장하지 않는다. 화면과 계산 모듈에서 `quantity * current_price`로 계산한다.

## 아키텍처

UI 컴포넌트는 저장 기술을 직접 알지 않고 `AssetRepository` 인터페이스와 `AssetService`만 사용한다. 1단계 구현체는 `SupabaseAssetRepository`이며, 나중에 오프라인 지원이 필요하면 동일 인터페이스를 만족하는 localStorage 구현체를 추가할 수 있다.

Supabase 서버·브라우저 클라이언트는 `lib/supabase`에 분리한다. 미들웨어는 인증 상태를 갱신하고, `/dashboard` 보호는 서버 페이지에서 수행한다. 공개 URL과 익명 키는 환경 변수로 관리하며 서비스 역할 키는 브라우저에 절대 포함하지 않는다.

## 디렉터리 책임

```text
app/(auth)/              로그인·회원가입 화면
app/dashboard/           인증된 대시보드 경로
components/assets/       자산 UI 단위
components/ui/           shadcn/ui 생성 컴포넌트
features/assets/         자산 도메인 타입, 저장소, 계산, 서비스
lib/supabase/            Supabase 클라이언트와 인증 도우미
supabase/migrations/     추적 가능한 DB 스키마와 RLS 정책
tests/features/assets/   자산 계산·검증 단위 테스트
```

## 오류 처리 및 검증

- 이름은 공백만으로 저장할 수 없다.
- 수량과 현재가는 유한한 양수여야 한다.
- 폼 전송 중에는 중복 전송을 막는다.
- 저장 실패는 사용자가 읽을 수 있는 오류 메시지로 표시한다.
- 빈 목록에는 자산 추가를 안내하는 빈 상태를 표시한다.

## 테스트 전략

- 단위 테스트: 평가금액 합계, 원화 입력값 검증, 자산 입력 변환
- 통합 수준 검증: TypeScript 검사, ESLint, Next.js production build
- Supabase RLS: SQL 정책으로 본인 행만 접근하도록 제한

## 1단계 완료 기준

- 이메일·비밀번호 회원가입과 로그인이 가능하다.
- 로그인한 사용자가 자산을 추가할 수 있다.
- 자산 목록에 입력값과 계산된 평가금액이 표시된다.
- 총 평가금액이 모든 자산의 합계로 갱신된다.
- 다른 사용자 데이터는 RLS에 의해 접근할 수 없다.
