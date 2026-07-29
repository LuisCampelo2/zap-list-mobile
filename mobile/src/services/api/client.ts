import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '../../constants/config';
import { secureStorage } from '../storage/secureStorage';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 15_000,
});

/**
 * `injectStore` evita import circular entre este módulo e store/index.ts:
 * o client precisa ler o access token e disparar logout em caso de sessão
 * inválida, mas o store depende deste client para o RTK Query. store/index.ts
 * importa e chama `injectStore(store)` uma única vez, depois de criar o store.
 */
type MinimalStore = {
  getState: () => { auth: { accessToken: string | null } };
  dispatch: (action: unknown) => unknown;
};

let store: MinimalStore | undefined;
export const injectStore = (s: MinimalStore) => {
  store = s;
};

apiClient.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
  const accessToken = store?.getState().auth.accessToken;
  if (accessToken) {
    requestConfig.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return requestConfig;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const AUTH_ENDPOINTS_WITHOUT_RETRY = ['/auth/refresh', '/auth/login', '/auth/register'];

let refreshPromise: Promise<string | null> | null = null;

/** Garante uma única chamada de refresh em voo mesmo se várias requisições levarem 401 ao mesmo tempo. */
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) return null;

        const { data } = await axios.post(`${config.apiUrl}/auth/refresh`, { refreshToken });

        await secureStorage.setRefreshToken(data.refreshToken);
        // Import tardio evita ciclo: authSlice não depende deste módulo.
        const { setCredentials } = await import('../../store/slices/authSlice');
        store?.dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));

        return data.accessToken as string;
      } catch {
        await secureStorage.clearRefreshToken();
        const { clearCredentials } = await import('../../store/slices/authSlice');
        store?.dispatch(clearCredentials());
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_RETRY.some((path) =>
      originalRequest?.url?.includes(path)
    );

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
