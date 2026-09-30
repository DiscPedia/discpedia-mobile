import { useAuthStore } from '@/stores/auth';

import { API_BASE_URL } from './api-config';

type CallOptions = {
  skipAuth?: boolean;
  /** 추가 헤더. OAuth 요청에서 Origin을 직접 지정할 때 쓴다. */
  headers?: Record<string, string>;
};

export async function call(api: string, method: string, request?: unknown, option?: CallOptions) {
  const { accessToken } = useAuthStore.getState();

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (accessToken && !option?.skipAuth) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (option?.headers) {
    Object.entries(option.headers).forEach(([key, value]) => headers.set(key, value));
  }

  const url = `${API_BASE_URL}${api}`;
  const options: RequestInit = {
    method,
    headers,
  };

  if (request !== undefined && request !== null) {
    options.body = JSON.stringify(request);
  }

  try {
    const response = await fetch(url, options);

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
