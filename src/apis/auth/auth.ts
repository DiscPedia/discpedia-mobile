import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

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

export function isAuthenticated(): boolean {
  return useAuthStore.getState().accessToken !== null;
}

/**
 * 인가 URL을 인앱 브라우저로 열고, 앱 스킴으로 돌아온 code/state로 JWT를 발급받는다.
 * 사용자가 브라우저를 닫으면 null을 반환한다.
 *
 * TODO: 백엔드 redirect_uri가 웹 콜백(/login/oauth2/code/{provider})으로 잡혀 있으면
 * 앱으로 돌아오지 못한다. discpedia://login/oauth2/code/{provider} 지원이 필요하다.
 */
export async function startOAuthLogin(provider: OAuthProvider) {
  const res = (await call(`/api/v1/auth/oauth/${provider}/authorize`, 'GET', undefined, {
    skipAuth: true,
  })) as ApiResponse<OAuthAuthorizeResponse>;

  const redirectUrl = Linking.createURL(`login/oauth2/code/${provider}`);
  const result = await WebBrowser.openAuthSessionAsync(res.data.authorizationUrl, redirectUrl);
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

/** OAuth 콜백: code + state로 JWT 발급 */
export async function completeOAuthLogin(provider: OAuthProvider, code: string, state: string) {
  const res = (await call(
    `/api/v1/auth/oauth/${provider}/login`,
    'POST',
    { code, state },
    { skipAuth: true },
  )) as ApiResponse<OAuthLoginResponse>;
  await useAuthStore.getState().setAccessToken(res.data.accessToken.token);
  return res.data;
}

export async function logout() {
  try {
    await call('/api/v1/auth/logout', 'POST');
  } catch {
    // 서버 실패해도 클라이언트는 로그아웃 처리
  } finally {
    await useAuthStore.getState().clear();
  }
}
