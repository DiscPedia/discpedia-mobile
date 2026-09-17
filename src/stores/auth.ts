import { create } from 'zustand';

import { tokenStorage } from '@/lib/token-storage';

/**
 * 개발용 로그인 우회 (.env의 EXPO_PUBLIC_DEV_BYPASS_AUTH=1).
 * 백엔드 OAuth가 앱 스킴(discpedia://)을 지원하기 전까지 로그인 뒤 화면을
 * 작업하려면 필요하다. 서버 호출은 토큰이 가짜라 401이 날 수 있다.
 */
const DEV_BYPASS_AUTH = process.env.EXPO_PUBLIC_DEV_BYPASS_AUTH === '1';

type AuthState = {
  accessToken: string | null;
  /** 저장소에서 토큰을 한 번 읽어왔는지. false 동안은 스플래시를 유지한다. */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setAccessToken: (token: string) => Promise<void>;
  clear: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  hydrated: false,
  hydrate: async () => {
    const stored = await tokenStorage.get().catch(() => null);
    const accessToken = stored ?? (DEV_BYPASS_AUTH ? 'dev-bypass-token' : null);
    set({ accessToken, hydrated: true });
  },
  setAccessToken: async (accessToken) => {
    await tokenStorage.set(accessToken);
    set({ accessToken });
  },
  clear: async () => {
    await tokenStorage.remove();
    set({ accessToken: null });
  },
}));
