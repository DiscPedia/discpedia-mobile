# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# DiscPedia Mobile

[discpedia-frontend](https://github.com/DiscPedia/discpedia-frontend)(Vite + React 웹)를 React Native(Expo)로 옮기는 앱이다.

- 라우팅: expo-router, `src/app` 파일 기반. 새 화면은 `src/app/_layout.tsx`의 `Stack.Protected` 블록 안에 등록한다.
- 스타일: Uniwind(Tailwind v4). 웹의 `className`을 RN 컴포넌트(`View`, `Text`, `Pressable` 등)에 그대로 쓴다. 서드파티 컴포넌트는 `withUniwind`로 감싼다.
- API: `src/apis`는 웹 코드와 경로·시그니처를 맞춘다. 토큰은 `useAuthStore`(`src/stores/auth.ts`)가 SecureStore에 보관한다. `localStorage`/`window`를 직접 쓰지 않는다.
- 아이콘: `assets/icons/*.svg`를 `import Icon from '@/assets/icons/x.svg'`로 불러 컴포넌트로 렌더한다.
- 커밋 전 `npm run lint`, `npm run typecheck`가 통과해야 한다.
