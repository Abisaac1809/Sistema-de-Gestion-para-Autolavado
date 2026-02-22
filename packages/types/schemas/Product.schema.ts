import { z } from 'zod';
import { UnitType } from '../enums.js';

export const ProductToCreate = z.object({
    categoryId: z.string().uuid().nullable().optional(),
    name: z.string()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    stock: z.number().min(0, 'Stock must be greater than or equal to 0').default(0),
    minStock: z.number().min(0, 'Min stock must be greater than or equal to 0').default(0),
    unitType: z.nativeEnum(UnitType).nullable().optional(),
    costPrice: z.number().min(0, 'Cost price must be greater than or equal to 0'),
    isForSale: z.boolean().optional().default(false),
    status: z.boolean().optional().default(true),
});

export type ProductToCreateType = z.infer<typeof ProductToCreate>;

export const ProductToUpdate = z.object({
    categoryId: z.string().uuid().nullable().optional(),
    name: z.string()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
    minStock: z.number().min(0, 'Min stock must be greater than or equal to 0').optional(),
    unitType: z.nativeEnum(UnitType).nullable().optional(),
    costPrice: z.number().min(0, 'Cost price must be greater than or equal to 0').optional(),
    isForSale: z.boolean().optional(),
    status: z.boolean().optional(),
});

export type ProductToUpdateType = z.infer<typeof ProductToUpdate>;

export const ProductFilters = z.object({
    search: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    isForSale: z.coerce.boolean().optional(),
    status: z.coerce.boolean().optional(),
    lowStock: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export type ProductFiltersType = z.infer<typeof ProductFilters>;
