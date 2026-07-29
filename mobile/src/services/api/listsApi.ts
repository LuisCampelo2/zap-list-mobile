import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { ShoppingListDetail, ShoppingListSummary } from '../../types/shoppingList';

type AddItemPayload = { listId: number; productId: number; quantity?: number; observation?: string };
type UpdateItemPayload = {
  listId: number;
  itemId: number;
  quantity?: number;
  observation?: string | null;
  isChecked?: boolean;
};

export const listsApi = createApi({
  reducerPath: 'listsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Lists', 'ListItems'],
  endpoints: (builder) => ({
    getLists: builder.query<ShoppingListSummary[], void>({
      query: () => ({ url: '/lists', method: 'get' }),
      transformResponse: (response: { lists: ShoppingListSummary[] }) => response.lists,
      providesTags: ['Lists'],
    }),
    createList: builder.mutation<ShoppingListSummary, { name: string }>({
      query: (body) => ({ url: '/lists', method: 'post', data: body }),
      transformResponse: (response: { list: ShoppingListSummary }) => response.list,
      invalidatesTags: ['Lists'],
    }),
    deleteList: builder.mutation<void, number>({
      query: (listId) => ({ url: `/lists/${listId}`, method: 'delete' }),
      invalidatesTags: ['Lists'],
    }),
    getListItems: builder.query<ShoppingListDetail, number>({
      query: (listId) => ({ url: `/lists/${listId}/items`, method: 'get' }),
      providesTags: (_result, _error, listId) => [{ type: 'ListItems', id: listId }],
    }),
    addItemToList: builder.mutation<{ itemId: number }, AddItemPayload>({
      query: ({ listId, ...body }) => ({ url: `/lists/${listId}/items`, method: 'post', data: body }),
      invalidatesTags: (_result, _error, { listId }) => [{ type: 'ListItems', id: listId }, 'Lists'],
    }),
    updateListItem: builder.mutation<void, UpdateItemPayload>({
      query: ({ listId, itemId, ...body }) => ({
        url: `/lists/${listId}/items/${itemId}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: (_result, _error, { listId }) => [{ type: 'ListItems', id: listId }, 'Lists'],
    }),
    deleteListItem: builder.mutation<void, { listId: number; itemId: number }>({
      query: ({ listId, itemId }) => ({ url: `/lists/${listId}/items/${itemId}`, method: 'delete' }),
      invalidatesTags: (_result, _error, { listId }) => [{ type: 'ListItems', id: listId }, 'Lists'],
    }),
  }),
});

export const {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useGetListItemsQuery,
  useAddItemToListMutation,
  useUpdateListItemMutation,
  useDeleteListItemMutation,
} = listsApi;
