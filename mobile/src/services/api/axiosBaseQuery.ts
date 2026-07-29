import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient } from './client';

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: unknown;
};

/**
 * Ponte entre RTK Query (cache/hooks/loading state) e Axios (transporte HTTP
 * + interceptors de token) — o app usa as duas libs pedidas no stack sem
 * duplicar lógica de autenticação em dois lugares.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, { status?: number; message: string }> =>
  async ({ url, method = 'get', data, params }) => {
    try {
      const result = await apiClient({ url, method, data, params });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        error: {
          status: axiosError.response?.status,
          message: axiosError.response?.data?.message ?? 'Erro de conexão. Tente novamente.',
        },
      };
    }
  };
