# 개인 투자 포트폴리오 대시보드

Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase로 만드는 개인 투자 포트폴리오 대시보드입니다.

## 처음 실행하기

이 프로젝트는 Next.js 16을 사용하므로 **Node.js 20.9 이상**이 필요합니다. 먼저 설치된 버전을 확인하세요.

```bash
node --version
```

`v20.9.0`보다 낮다면 Node.js를 업데이트한 뒤 아래 명령을 실행합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 반응형 화면 확인

1. `npm run dev`로 개발 서버를 실행한 뒤, 브라우저 개발자 도구의 기기 모드를 엽니다.
2. 폭을 **375px**로 설정해 요약 → 자산 추가 → 자산 목록 순서의 한 열 레이아웃과 자산 표의 가로 스크롤을 확인합니다.
3. 폭을 **1440px**로 설정해 넓은 요약 카드와 자산 추가(4열) · 자산 목록(8열)의 2단 레이아웃을 확인합니다.

## Supabase 연결하기

1. [Supabase](https://supabase.com)에서 새 프로젝트를 만듭니다.
2. Dashboard의 **SQL Editor**에서 [`supabase/migrations/001_create_assets.sql`](supabase/migrations/001_create_assets.sql) 전체를 실행합니다.
3. **Connect** 또는 **Project Settings > API**에서 Project URL과 Publishable key를 복사합니다.
4. `.env.local`을 열어 값을 입력합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=복사한_키
```

5. **Authentication > URL Configuration**에서 Site URL을 `http://localhost:3000`으로 설정합니다.
6. `npm run dev`를 다시 실행하고 [http://localhost:3000](http://localhost:3000)에서 회원가입합니다.

이메일 인증을 켜 둔 경우, 받은 메일의 링크를 클릭한 후 로그인하세요.

## 검사 명령

```bash
npm run test
npm run lint
npm run build
```

## Vercel 배포

1. GitHub에 이 저장소를 올리고 Vercel에서 **New Project**로 가져옵니다.
2. Vercel의 **Settings > Environment Variables**에 위의 두 `NEXT_PUBLIC_SUPABASE_*` 값을 등록합니다.
3. 배포가 끝나면 Supabase **Authentication > URL Configuration**의 Site URL을 Vercel 배포 주소로 바꿉니다.

서비스 역할 키(`service_role`)는 환경 변수에 넣거나 브라우저에 노출하지 마세요.
