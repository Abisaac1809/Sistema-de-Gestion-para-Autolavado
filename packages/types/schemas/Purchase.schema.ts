import { z } from 'zod';
import { PurchaseDetailToCreate } from './PurchaseDetail.schema.js';

export const PurchaseToCreate = z.object({
    providerName: z.string()
        .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres')
        .max(100, 'El nombre del proveedor no debe exceder 100 caracteres'),
    purchaseDate: z.coerce.date(),
    dollarRate: z.number().positive('La tasa de cambio debe ser mayor a 0'),
    paymentMethodId: z.string().uuid('ID de metodo de pago invalido').optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
    details: z.array(PurchaseDetailToCreate).min(1, 'Debe incluir al menos un producto'),
});

export type PurchaseToCreateType = z.infer<typeof PurchaseToCreate>;

export const PurchaseFilters = z.object({
    search: z.string().min(1).optional(),
    paymentMethodId: z.string().uuid().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export type PurchaseFiltersType = z.infer<typeof PurchaseFilters>;
