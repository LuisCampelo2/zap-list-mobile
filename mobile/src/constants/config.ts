import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/**
 * `EXPO_PUBLIC_*` env vars são embutidas no bundle em build time — nunca
 * colocar segredos aqui, apenas configuração pública como a URL da API.
 * Fallback para localhost:3001 facilita rodar o app + server lado a lado em
 * dev (3001 porque 3000 pode já estar ocupada por outro server local).
 */
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? 'http://localhost:3001/api';

export const config = {
  apiUrl,
  // Imagens de produtos são servidas fora do prefixo /api (ex: /images/products/x.png).
  serverOrigin: apiUrl.replace(/\/api\/?$/, ''),
  appScheme: 'zaplist',
} as const;
