/**
 * 웹 콜백 페이지가 discpedia://login/oauth2/code/{provider}?code=... 로 앱을 다시 열 때의 경로 처리.
 *
 * - 앱이 살아 있으면: 인증 세션(openAuthSessionAsync)이 이 링크로 로그인을 마친다.
 *   안드로이드는 같은 링크를 라우터에도 넘기는데 그 경로의 화면이 없으므로 홈으로 돌린다.
 * - 앱이 종료됐다가 이 링크로 새로 켜졌으면(initial): 인증 세션이 사라졌으므로
 *   콜백 화면으로 보내 저장해 둔 state로 이어서 로그인을 마친다.
 */
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  if (!path.includes('login/oauth2/code')) {
    return path;
  }
  if (!initial) {
    return '/';
  }

  const match = path.match(/login\/oauth2\/code\/([a-z]+)\??(.*)$/);
  if (!match) {
    return '/';
  }
  const [, provider, query] = match;
  return `/oauth-callback?provider=${provider}${query ? `&${query}` : ''}`;
}
