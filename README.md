# Cinema

TMDB API 기반 영화/TV 탐색 웹앱입니다.

트렌딩 조회, 영화/TV 목록 무한 스크롤, 상세 페이지, 검색, 찜 목록 기능을 제공합니다.

## Quick Start

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 입력하세요.

```env
# 필수: TMDB API 인증 키
TMDB_API_KEY=your_tmdb_api_key

# 선택: TMDB API 기본 주소 (미설정 시 기본값 사용)
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

## 기술 스택

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `TanStack Query`
- `Zustand` (찜 목록 로컬 저장)
- `Tailwind CSS v4`
- `shadcn/ui`, `Radix UI`, `lucide-react`

## 주요 기능

- 이번 주 트렌딩(영화/TV) 조회
- 영화/TV 목록 + 장르 필터 + 무한 스크롤
- 영화/TV 상세 정보(출연진, 예고편, 유사 콘텐츠)
- 검색(영화+TV 통합)
- 찜 목록 추가/삭제/영구 저장(`localStorage`)
- 반응형 UI(모바일 메뉴/필터 오버레이 포함)

## 아키텍처 개요

- **TMDB API 키 보호**
  - 클라이언트에서 TMDB를 직접 호출하지 않습니다.
  - 모든 외부 API 요청은 `Route Handler`(`src/app/api/*`)를 거칩니다.
  - 서버 전용 모듈(`src/lib/tmdb.ts`)에서 `TMDB_API_KEY`를 사용합니다.

- **렌더링 전략**
  - 홈/목록 페이지: 서버 프리패치 + 하이드레이션(`dehydrate`, `HydrationBoundary`)
  - 상세 페이지: 서버 컴포넌트 기반 렌더링
  - 검색/찜 목록: 클라이언트 상호작용 중심

- **캐시 전략**
  - Next.js 서버 fetch 캐시: `revalidate: 300` (5분)
  - TanStack Query 클라이언트 캐시: `staleTime: 5분`, `gcTime: 30분`

### 데이터 흐름

```txt
Client Component
  -> /api/* Route Handler
  -> src/lib/tmdb.ts (server-only)
  -> TMDB API
```

홈/목록 페이지는 서버에서 프리패치한 Query 캐시를 `dehydrate`로 직렬화해 전달하고,
클라이언트에서 `HydrationBoundary`로 복원해 즉시 사용합니다.

## 실행 명령어

```bash
pnpm dev    # 개발 서버
pnpm build  # 프로덕션 빌드
pnpm start  # 프로덕션 서버 실행
pnpm lint   # ESLint 검사
```

## 프로젝트 구조

```txt
src/
  app/
    api/                # 서버 Route Handler (TMDB 프록시)
    movie/[id]/         # 영화 상세
    movies/             # 영화 목록
    search/             # 검색
    tv/[id]/            # TV 상세
    tv/                 # TV 목록
    watchlist/          # 찜 목록
  components/
    media/              # HeroBanner, MediaCard, InfiniteScroll 등
    skeletons/          # 스켈레톤 UI
    providers/          # QueryProvider
  hooks/                # useMovies, useTv, useSearch 등
  lib/                  # TMDB 호출/유틸 함수
  store/                # Zustand 스토어 (watchlist)
  types/                # TMDB 타입 정의
```

## 체크리스트

- 작업 전 `pnpm lint`로 기본 정적 검사를 수행합니다.
- 데이터 패칭 코드를 수정할 때는 서버/클라이언트 경계를 확인합니다.
  - 민감 정보(API 키)가 필요한 코드는 `src/lib/tmdb.ts` 또는 `Route Handler`에서만 처리합니다.
- UI 변경 시 모바일(768px 이하)과 데스크톱을 모두 확인합니다.
- PR 전 `pnpm build`로 프로덕션 빌드 성공 여부를 확인합니다.
