const ACCESS_TOKEN_KEY = 'accessToken';

/** 웹: SecureStore가 없으므로 기존 웹과 같이 localStorage를 쓴다. */
export const tokenStorage = {
  get: async () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: async (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  remove: async () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};
