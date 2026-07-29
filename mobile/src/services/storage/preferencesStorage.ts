import * as SecureStore from 'expo-secure-store';

/**
 * Preferências de UI (não sensíveis) também via expo-secure-store — o app
 * usava react-native-mmkv aqui antes, mas MMKV exige um development build
 * (não roda dentro do Expo Go puro, que é como este projeto é testado por
 * enquanto). expo-secure-store já é uma dependência existente (tokens) e
 * funciona no Expo Go, então reaproveitamos em vez de adicionar outra lib.
 * Para poucas chaves pequenas como esta, o overhead do Keychain/Keystore é
 * irrelevante — não é o mesmo caso de uso de cache de dados em volume.
 */
export const preferencesStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export const storageKeys = {
  themePreference: 'zaplist.theme.preference',
} as const;
