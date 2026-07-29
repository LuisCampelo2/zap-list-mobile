import { z } from 'zod';

export const createListSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Informe um nome para a lista').max(255),
  }),
});

export const listIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Lista inválida'),
  }),
});

export const itemIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Lista inválida'),
    itemId: z.coerce.number().int().positive('Item inválido'),
  }),
});

export const addItemSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Lista inválida'),
  }),
  body: z.object({
    productId: z.coerce.number().int().positive('Produto inválido'),
    quantity: z.coerce.number().positive().optional(),
    observation: z.string().trim().max(500).optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Lista inválida'),
    itemId: z.coerce.number().int().positive('Item inválido'),
  }),
  body: z
    .object({
      quantity: z.coerce.number().positive().optional(),
      observation: z.string().trim().max(500).nullable().optional(),
      isChecked: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: 'Nada para atualizar' }),
});
