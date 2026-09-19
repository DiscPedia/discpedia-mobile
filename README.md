# DiscPedia Mobile

[discpedia-frontend](https://github.com/DiscPedia/discpedia-frontend)를 React Native(Expo)로 옮긴 앱입니다.

## 기술 스택

- Expo SDK 57 / React Native 0.86 / React 19 (React Compiler 사용)
- expo-router (파일 기반 라우팅, typed routes)
- Uniwind (Tailwind v4): 웹의 `className`을 그대로 사용
- zustand (인증 상태), expo-secure-store (토큰 저장)
- react-query (서버 데이터 조회·캐싱)
- react-native-svg + react-native-svg-transformer (SVG 아이콘)
- ESLint (eslint-config-expo) + Prettier + husky / lint-staged

## 시작하기

### 1) 사전 준비

- Node.js `24` 권장, npm 사용
- iOS: Xcode + 시뮬레이터 / Android: Android Studio + 에뮬레이터
- 또는 실기기에 [Expo Go](https://expo.dev/go) 설치

### 2) 설치

```bash
git clone https://github.com/DiscPedia/discpedia-mobile.git
cd discpedia-mobile
npm install
cp .env.example .env
```

### 3) 실행

```bash
npm start        # Metro 실행 후 i(iOS) / a(Android) / 실기기 QR
npm run ios
npm run android
npm run web
```

### 4) 검사

```bash
npm run lint
npm run typecheck
npm run format
```

커밋 시 husky가 lint-staged(eslint --fix + prettier)를 실행합니다. 오류가 있으면 커밋이 막히니 해결하고 푸시해 주세요.

## 폴더 구조

```
assets/
  icons/          웹 src/assets의 SVG 아이콘
  images/         앱 아이콘, 스플래시
src/
  app/            expo-router 라우트
    _layout.tsx   루트 스택 + 로그인 가드 (웹 ProtectedRoute 대응)
    login.tsx
    (tabs)/       하단 탭 (웹 BackgroundPage + BottomNav 대응)
  apis/           웹 src/apis 그대로 (auth만 RN용으로 수정)
  components/
  hooks/
  lib/            플랫폼별 유틸 (token-storage 등)
  stores/         zustand 스토어
  util/
  global.css      Uniwind 엔트리
```

## 웹 → 앱 포팅 가이드

| 웹                                    | 앱                                                                   |
| ------------------------------------- | -------------------------------------------------------------------- |
| `div`, `span`, `p`, `h1`              | `View`, `Text` (문자열은 반드시 `Text` 안에)                         |
| `button onClick`                      | `Pressable onPress`                                                  |
| `input`, `textarea`                   | `TextInput`                                                          |
| 스크롤 영역, `.scrollbar-hide`        | `ScrollView` / `FlatList` (스크롤바 숨김은 prop으로)                 |
| `<img src={icon} />` (svg)            | `import Icon from '@/assets/icons/x.svg'` 후 `<Icon width height />` |
| `<img src={url} />` (원격 이미지)     | `expo-image`의 `Image`                                               |
| `useNavigate()`, `<Navigate />`       | `useRouter()`, `<Redirect />` (`expo-router`)                        |
| `useParams()`                         | `useLocalSearchParams()`                                             |
| `localStorage.getItem("accessToken")` | `useAuthStore.getState().accessToken`                                |
| `window.open(url)`                    | `expo-web-browser`의 `openBrowserAsync`                              |

### 라우트 매핑

| 웹 경로                         | 앱 파일                                         | 상태    |
| ------------------------------- | ----------------------------------------------- | ------- |
| `/login`                        | `src/app/login.tsx`                             | 기본 UI |
| `/home`                         | `src/app/(tabs)/index.tsx`                      | 완료    |
| `/search`                       | `src/app/(tabs)/search.tsx`                     | 완료    |
| `/collection`                   | `src/app/(tabs)/collection.tsx`                 | 자리만  |
| `/myPage`                       | `src/app/(tabs)/my-page.tsx`                    | 자리만  |
| `/new-releases`                 | `src/app/new-releases.tsx`                      | 완료    |
| `/used-albums`                  | `src/app/used-albums.tsx`                       | 완료    |
| `/detail/:id`                   | `src/app/detail/[id].tsx`                       | 자리만  |
| `/collection/add/:id`           | `src/app/collection/add/[id].tsx`               | 미작업  |
| `/collection/:collectionItemId` | `src/app/collection/[collectionItemId].tsx`     | 미작업  |
| `/review/write/:id`             | `src/app/review/write/[id].tsx`                 | 미작업  |
| `/review/edit/:reviewId`        | `src/app/review/edit/[reviewId].tsx`            | 미작업  |
| `/recommand`                    | `src/app/recommand.tsx`                         | 미작업  |
| `/myReview`                     | `src/app/my-review.tsx`                         | 미작업  |
| `/portfolio`                    | `src/app/portfolio.tsx`                         | 미작업  |
| `/login/oauth2/code/*`          | 없음 (`startOAuthLogin`이 인앱 브라우저로 처리) | -       |

새 화면을 만들면 `src/app/_layout.tsx`의 `Stack.Protected guard={isLoggedIn}` 블록에 `Stack.Screen`을 추가해 주세요. 등록하지 않으면 로그인 없이 열립니다.

### 로그인 없이 화면 작업하기

백엔드 OAuth가 앱 스킴을 지원하기 전까지는 앱에서 로그인을 할 수 없습니다. 로그인 뒤 화면을 작업하려면 `.env`에 아래를 넣고 실행하세요.

```
EXPO_PUBLIC_DEV_BYPASS_AUTH=1
```

가짜 토큰으로 탭 화면까지 들어가며, 서버 호출은 401이 날 수 있습니다. 배포 빌드에는 넣지 마세요.

## 남은 작업

- **OAuth 리다이렉트**: 백엔드 redirect_uri가 웹 콜백이면 앱으로 돌아오지 못합니다. `discpedia://login/oauth2/code/{provider}`로 돌아오도록 백엔드 지원이 필요합니다.
- **폰트**: 로고용 Raleway는 넣었습니다(`@expo-google-fonts/raleway`, `font-raleway` 클래스). 본문용 Pretendard는 아직입니다.
- **이미지**: 웹 `assets/common/Logo.svg`(PNG가 들어 있는 880KB SVG)와 `albumMock*.svg`(목데이터)는 가져오지 않았습니다. 로고는 PNG로 따로 넣는 것을 권장합니다.
- 앱 아이콘/스플래시는 Expo 기본 이미지입니다.
