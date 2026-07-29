import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../constants/config';
import { secureStorage } from '../../services/storage/secureStorage';
import type { User } from '../../types/auth';

type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

type AuthState = {
  user: User | null;
  // Access token vive só em memória (nunca persistido) — se o app for
  // encerrado, é reobtido no próximo boot via refresh token no SecureStore.
  accessToken: string | null;
  status: AuthStatus;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'bootstrapping',
};

/**
 * Roda uma vez ao abrir o app: se houver um refresh token salvo no
 * SecureStore, troca por uma sessão nova (access token + refresh token
 * rotacionado) sem pedir login de novo. Usa axios puro (não apiClient) para
 * não passar pelo interceptor de 401, que dependeria do store ainda em
 * criação.
 */
export const bootstrapSession = createAsyncThunk('auth/bootstrap', async () => {
  const refreshToken = await secureStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post(`${config.apiUrl}/auth/refresh`, { refreshToken });
    await secureStorage.setRefreshToken(data.refreshToken);
    return { user: data.user as User, accessToken: data.accessToken as string };
  } catch {
    await secureStorage.clearRefreshToken();
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapSession.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'authenticated';
      } else {
        state.status = 'unauthenticated';
      }
    });
    builder.addCase(bootstrapSession.rejected, (state) => {
      state.status = 'unauthenticated';
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
