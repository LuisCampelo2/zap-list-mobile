import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'zaplist.refreshToken';

/**
 * Único lugar do app que persiste o refresh token em disco — usa o
 * Keychain (iOS) / Keystore (Android) via expo-secure-store, nunca
 * AsyncStorage. O access token nunca é persistido aqui: ele vive só em
 * memória (Redux), então é perdido ao fechar o app e precisa ser renovado
 * via refresh token no próximo boot (ver bootstrapSession em authSlice).
 */
export const secureStorage = {
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    }),
  clearRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
};
