import { create } from 'zustand';

import { tokenStorage } from '@/lib/token-storage';

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
    const accessToken = await tokenStorage.get().catch(() => null);
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
