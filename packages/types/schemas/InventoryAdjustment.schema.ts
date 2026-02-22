import { z } from 'zod';
import { AdjustmentType, AdjustmentReason } from '../enums.js';

export const InventoryAdjustmentToCreate = z.object({
    productId: z.string().uuid('Product ID must be a valid UUID'),
    adjustmentType: z.nativeEnum(AdjustmentType),
    quantity: z.number().positive('Quantity must be positive'),
    reason: z.nativeEnum(AdjustmentReason),
    notes: z.string().max(1000, 'Notes must not exceed 1000 characters').nullable().optional(),
});

export type InventoryAdjustmentToCreateType = z.infer<typeof InventoryAdjustmentToCreate>;

export const InventoryAdjustmentFilters = z.object({
    search: z.string().min(1).optional(),
    productId: z.string().uuid().optional(),
    type: z.nativeEnum(AdjustmentType).optional(),
    reason: z.nativeEnum(AdjustmentReason).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type InventoryAdjustmentFiltersType = z.infer<typeof InventoryAdjustmentFilters>;
