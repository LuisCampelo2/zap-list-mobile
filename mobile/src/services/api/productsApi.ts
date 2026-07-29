import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { Product } from '../../types/product';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Products', 'Favorites'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: '/products', method: 'get' }),
      transformResponse: (response: { products: Product[] }) => response.products,
      providesTags: ['Products'],
    }),
    getFavorites: builder.query<Product[], void>({
      query: () => ({ url: '/products/favorites', method: 'get' }),
      transformResponse: (response: { products: Product[] }) => response.products,
      providesTags: ['Favorites'],
    }),
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, number>({
      query: (productId) => ({ url: `/products/${productId}/favorite`, method: 'post' }),
      // Atualiza o cache local imediatamente (coração muda na hora) em vez de
      // esperar a resposta do servidor — a mutation ainda reconcilia/reverte
      // se a chamada falhar, então a UI nunca fica presa num estado errado.
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
            const product = draft.find((p) => p.id === productId);
            if (product) product.isFavorite = !product.isFavorite;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const { useGetProductsQuery, useGetFavoritesQuery, useToggleFavoriteMutation } = productsApi;
