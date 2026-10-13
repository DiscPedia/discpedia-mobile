import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { oauthPending } from '@/lib/oauth-pending';
import { useAuthStore } from '@/stores/auth';

import type { ApiResponse } from '../commontype';
import { call } from './ApiService';

export type OAuthProvider = 'kakao' | 'google';

export type OAuthAuthorizeResponse = {
  provider: string;
  authorizationUrl: string;
  state: string;
};
export type AccessToken = {
  token: string;
  tokenType: string;
  expiresIn: number;
};
export type OAuthLoginResponse = {
  accessToken: AccessToken;
  userId: string;
  nickname: string;
  provider: string;
  onboardingCompleted: boolean;
};

/**
 * 백엔드는 Origin 헤더를 보고 OAuth 복귀 주소를 정한다. 앱 요청에는 Origin이
 * 붙지 않아 기본값(localhost)이 내려오므로 배포된 웹 주소를 직접 지정한다.
 * 로그인이 끝나면 그 웹 콜백 페이지가 discpedia:// 딥링크로 앱을 다시 연다.
 * (네이티브 fetch는 브라우저와 달리 Origin을 직접 넣을 수 있다.)
 */
const WEB_ORIGIN = process.env.EXPO_PUBLIC_WEB_ORIGIN ?? 'https://discpedia-frontend.vercel.app';

const oauthCallOptions = {
  skipAuth: true,
  headers: { Origin: WEB_ORIGIN },
};

export function isAuthenticated(): boolean {
  return useAuthStore.getState().accessToken !== null;
}

/**
 * 인가 URL을 인앱 브라우저로 열고, 앱 스킴으로 돌아온 code/state로 JWT를 발급받는다.
 * 사용자가 브라우저를 닫으면 null을 반환한다.
 *
 * 브라우저가 열린 사이 앱이 종료될 수 있어(메모리가 부족한 안드로이드) state를 저장해 둔다.
 * 그 경우 딥링크로 다시 켜진 앱이 resumeOAuthLogin으로 이어서 처리한다.
 */
export async function startOAuthLogin(provider: OAuthProvider) {
  const res = (await call(
    `/api/v1/auth/oauth/${provider}/authorize`,
    'GET',
    undefined,
    oauthCallOptions,
  )) as ApiResponse<OAuthAuthorizeResponse>;
  await oauthPending.save(provider, res.data.state);

  const redirectUrl = Linking.createURL(`login/oauth2/code/${provider}`);
  const result = await WebBrowser.openAuthSessionAsync(res.data.authorizationUrl, redirectUrl);
  await oauthPending.clear();
  if (result.type !== 'success') return null;

  const { code, state } = Linking.parse(result.url).queryParams ?? {};
  if (typeof code !== 'string' || typeof state !== 'string') {
    throw new Error('OAuth callback missing code/state');
  }
  if (state !== res.data.state) {
    throw new Error('OAuth state mismatch');
  }

  return completeOAuthLogin(provider, code, state);
}

/** 앱이 종료됐다가 로그인 딥링크로 다시 켜졌을 때, 저장해 둔 state로 검증하고 로그인을 마친다. */
export async function resumeOAuthLogin(provider: OAuthProvider, code: string, state: string) {
  const pending = await oauthPending.take();
  if (!pending || pending.provider !== provider || pending.state !== state) {
    throw new Error('OAuth state mismatch');
  }
  return completeOAuthLogin(provider, code, state);
}

/** OAuth 콜백: code + state로 JWT 발급 */
export async function completeOAuthLogin(provider: OAuthProvider, code: string, state: string) {
  const res = (await call(
    `/api/v1/auth/oauth/${provider}/login`,
    'POST',
    { code, state },
    oauthCallOptions,
  )) as ApiResponse<OAuthLoginResponse>;
  await useAuthStore.getState().setAccessToken(res.data.accessToken.token);
  return res.data;
}

export async function logout() {
  try {
    // 로그아웃은 refresh_token 쿠키만 읽는다. 만료된 토큰으로 401 → 재발급 경로를 타지 않게 한다.
    await call('/api/v1/auth/logout', 'POST', undefined, { skipAuth: true });
  } catch {
    // 서버 실패해도 클라이언트는 로그아웃 처리
  } finally {
    await useAuthStore.getState().clear();
  }
}
