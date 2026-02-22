import { z } from 'zod';

export const CustomerToCreate = z.object({
    fullName: z.string()
        .min(2, 'Full name must have at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),
    idNumber: z.string()
        .max(20, 'ID number must not exceed 20 characters')
        .nullable()
        .optional(),
    phone: z.string()
        .regex(/^(0414|0424|0412|0416|0426)-?\d{7}$/, "El teléfono no tiene un formato válido (ej: 0414-1234567)")
        .nullable()
        .optional(),
});

export type CustomerToCreateType = z.infer<typeof CustomerToCreate>;

export const CustomerToUpdate = CustomerToCreate.partial();

export type CustomerToUpdateType = z.infer<typeof CustomerToUpdate>;

export const CustomerFilters = z.object({
    search: z.string().optional(),
    idNumber: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type CustomerFiltersType = z.infer<typeof CustomerFilters>;
