import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { AuthResponse, User } from '../../types/auth';

type RegisterPayload = { name: string; lastName: string; email: string; password: string };
type LoginPayload = { email: string; password: string };
type ActivatePayload = { token: string };
type ForgotPasswordPayload = { email: string };
type VerifyResetCodePayload = { email: string; code: string };
type ResetPasswordPayload = { resetToken: string; password: string };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string; user: User }, RegisterPayload>({
      query: (body) => ({ url: '/auth/register', method: 'post', data: body }),
    }),
    activate: builder.mutation<{ message: string }, ActivatePayload>({
      query: (body) => ({ url: '/auth/activate', method: 'post', data: body }),
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'post', data: body }),
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'post', data: body }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordPayload>({
      query: (body) => ({ url: '/auth/password/forgot', method: 'post', data: body }),
    }),
    verifyResetCode: builder.mutation<{ resetToken: string }, VerifyResetCodePayload>({
      query: (body) => ({ url: '/auth/password/verify-code', method: 'post', data: body }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordPayload>({
      query: (body) => ({ url: '/auth/password/reset', method: 'post', data: body }),
    }),
    me: builder.query<{ user: User }, void>({
      query: () => ({ url: '/users/me', method: 'get' }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivateMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useMeQuery,
} = authApi;
