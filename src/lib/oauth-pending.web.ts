const KEY = 'oauthPending';
const TTL_MS = 10 * 60 * 1000;

export type OAuthPending = { provider: string; state: string; createdAt: number };

/** 웹: SecureStore가 없으므로 sessionStorage를 쓴다. */
export const oauthPending = {
  save: async (provider: string, state: string) =>
    sessionStorage.setItem(KEY, JSON.stringify({ provider, state, createdAt: Date.now() })),
  take: async (): Promise<OAuthPending | null> => {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    try {
      const pending = JSON.parse(raw) as OAuthPending;
      return Date.now() - pending.createdAt <= TTL_MS ? pending : null;
    } catch {
      return null;
    }
  },
  clear: async () => sessionStorage.removeItem(KEY),
};
