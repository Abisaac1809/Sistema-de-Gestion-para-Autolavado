import { z } from 'zod';

export const PurchaseDetailToCreate = z.object({
    productId: z.string().uuid('ID de producto invalido'),
    quantity: z.number().positive('La cantidad debe ser mayor a 0'),
    unitCostUsd: z.number().min(0, 'El costo unitario debe ser mayor o igual a 0'),
});

export type PurchaseDetailToCreateType = z.infer<typeof PurchaseDetailToCreate>;
