# 반응형 자산 입력 폼 수정 설계

## 목표

중간 폭의 화면에서도 자산 추가·자산 목록 카드가 화면 너비에 맞춰 축소되고, 자산 이름 입력칸에 브라우저의 이전 입력 자동완성 제안이 나타나지 않게 한다.

## 원인과 해결 방식

- 자산 표의 `min-w-[760px]`가 `lg` 12열 grid 항목의 기본 최소 콘텐츠 너비에 영향을 주어, 중간 폭에서 두 열 모두가 화면보다 넓어질 수 있다. 폼과 목록 grid 항목에 `min-w-0`을 주어 트랙 안에서 줄어들게 한다. 표의 최소 너비는 유지하며 기존 `Table`의 가로 스크롤 컨테이너가 표 오버플로만 처리한다.
- 이름 입력칸의 일반적인 `name="name"`은 브라우저 자동완성 후보와 충돌하기 쉽다. 제출 필드명을 `assetName`으로 구체화하고, 폼과 입력에 `autoComplete="off"`를 설정한다. 유효성 검사에 전달되는 데이터는 계속 `name` 속성으로 유지한다.

## 범위와 검증

- `components/assets/assets-dashboard.tsx`와 `components/assets/asset-form.tsx`만 동작을 수정한다.
- `tests/components/assets/asset-form.test.tsx`에서 이름 필드의 자동완성 설정과 제출 데이터 보존을 검증한다.
- 컴포넌트 마크업에서 두 `lg` grid 항목의 `min-w-0`을 검증한다.
- 기존 전체 테스트, 린트, production build를 실행한다.
