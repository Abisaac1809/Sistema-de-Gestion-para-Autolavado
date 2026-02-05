import { z } from 'zod';

export const ServiceToCreate = z.object({
    name: z.string()
        .min(1, 'Name must have at least 1 character')
        .max(100, 'Name must not exceed 100 characters'),
    description: z.string()
        .max(500, 'Description must not exceed 500 characters')
        .nullable()
        .optional(),
    price: z.number()
        .positive('Price must be a positive number'),

    status: z.boolean()
        .default(true),
});

export type ServiceToCreateType = z.infer<typeof ServiceToCreate>;

export const ServiceToUpdate = z.object({
    name: z.string()
        .min(1, 'Name must have at least 1 character')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
    description: z.string()
        .max(500, 'Description must not exceed 500 characters')
        .nullable()
        .optional(),
    price: z.number()
        .positive('Price must be a positive number')
        .optional(),

    status: z.boolean()
        .optional(),
}).partial();

export type ServiceToUpdateType = z.infer<typeof ServiceToUpdate>;

export const ServiceFilters = z.object({
    search: z.string().min(1).optional(),
    status: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type ServiceFiltersType = z.infer<typeof ServiceFilters>;
