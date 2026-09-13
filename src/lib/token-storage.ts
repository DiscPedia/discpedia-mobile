import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';

/** 네이티브: 액세스 토큰을 Keychain/Keystore(SecureStore)에 보관한다. */
export const tokenStorage = {
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};
