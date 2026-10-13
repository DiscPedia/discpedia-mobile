import { Alert } from 'react-native';

import { useAuthStore } from '@/stores/auth';

import { API_BASE_URL } from './api-config';

type CallOptions = {
  skipAuth?: boolean;
  /** 추가 헤더. OAuth 요청에서 Origin을 직접 지정할 때 쓴다. */
  headers?: Record<string, string>;
};

/**
 * 로그인 응답이 심어 주는 refresh_token 쿠키를 저장하고 다시 보내도록 쿠키를 포함한다.
 * 토큰 재발급(/auth/refresh)과 로그아웃이 이 쿠키를 읽는다.
 */
const CREDENTIALS: RequestCredentials = 'include';

// 여러 요청이 동시에 401을 받아도 재발급은 한 번만 한다.
let refreshing: Promise<string | null> | null = null;

/** 재발급에 실패하면 로그아웃시키고 한 번만 안내한다. 루트 가드가 로그인 화면으로 보낸다. */
const expireSession = async () => {
  await useAuthStore.getState().clear();
  Alert.alert('로그인 만료', '로그인이 만료됐어요. 다시 로그인해 주세요.');
};

const refreshAccessToken = () => {
  refreshing ??= (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: CREDENTIALS,
      });
      const body = response.ok ? await response.json() : null;
      const token: string | undefined = body?.data?.accessToken?.token;
      if (!token) {
        await expireSession();
        return null;
      }
      await useAuthStore.getState().setAccessToken(token);
      return token;
    } catch {
      await expireSession();
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
};

export async function call(api: string, method: string, request?: unknown, option?: CallOptions) {
  const url = `${API_BASE_URL}${api}`;

  const send = (accessToken: string | null) => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (accessToken && !option?.skipAuth) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (option?.headers) {
      Object.entries(option.headers).forEach(([key, value]) => headers.set(key, value));
    }

    const options: RequestInit = { method, headers, credentials: CREDENTIALS };
    if (request !== undefined && request !== null) {
      options.body = JSON.stringify(request);
    }
    return fetch(url, options);
  };

  try {
    const sentToken = useAuthStore.getState().accessToken;
    let response = await send(sentToken);

    // 토큰이 만료되면 재발급 후 한 번만 다시 보낸다. 그사이 다른 요청이 이미
    // 재발급했으면 그 토큰을 쓰고, 이미 로그아웃됐으면(토큰 없음) 재발급하지 않는다.
    // 토큰 없이 보낸 요청의 401은 그대로 실패로 둔다.
    if (response.status === 401 && sentToken && !option?.skipAuth) {
      const current = useAuthStore.getState().accessToken;
      if (current) {
        const nextToken = current !== sentToken ? current : await refreshAccessToken();
        if (nextToken) {
          response = await send(nextToken);
        }
      }
    }

    if (!response.ok) {
      throw new Error(response.statusText || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
