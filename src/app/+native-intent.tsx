/**
 * 웹 콜백 페이지가 discpedia://login/oauth2/code/{provider}?code=... 로 앱을 다시 열면,
 * 안드로이드는 이 딥링크를 인증 세션(openAuthSessionAsync)뿐 아니라 라우터에도 넘긴다.
 * 앱에는 그 경로의 화면이 없어 "Unmatched Route"가 뜨므로 OAuth 콜백 경로는 홈으로 돌린다.
 * 토큰 교환은 startOAuthLogin이 인증 세션 결과로 처리한다.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  if (path.includes('login/oauth2/code')) {
    return '/';
  }
  return path;
}
