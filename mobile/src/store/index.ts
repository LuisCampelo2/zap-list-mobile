import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/api/authApi';
import { productsApi } from '../services/api/productsApi';
import { injectStore } from '../services/api/client';
import { authReducer } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productsApi.middleware),
});

// Dá ao client Axios acesso ao token atual e a como disparar logout,
// sem que services/api/client.ts precise importar este arquivo (ciclo).
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
