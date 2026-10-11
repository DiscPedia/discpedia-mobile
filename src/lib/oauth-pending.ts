import * as SecureStore from 'expo-secure-store';

const KEY = 'oauthPending';
const TTL_MS = 10 * 60 * 1000;

export type OAuthPending = { provider: string; state: string; createdAt: number };

/**
 * 로그인 브라우저가 열린 사이 앱이 종료돼도 돌아온 딥링크의 state를 검증할 수 있도록
 * 진행 중인 로그인 정보를 기기에 남겨둔다. 10분이 지나면 무효로 본다.
 */
export const oauthPending = {
  save: (provider: string, state: string) =>
    SecureStore.setItemAsync(KEY, JSON.stringify({ provider, state, createdAt: Date.now() })),
  take: async (): Promise<OAuthPending | null> => {
    const raw = await SecureStore.getItemAsync(KEY);
    await SecureStore.deleteItemAsync(KEY);
    if (!raw) return null;
    try {
      const pending = JSON.parse(raw) as OAuthPending;
      return Date.now() - pending.createdAt <= TTL_MS ? pending : null;
    } catch {
      return null;
    }
  },
  clear: () => SecureStore.deleteItemAsync(KEY),
};
