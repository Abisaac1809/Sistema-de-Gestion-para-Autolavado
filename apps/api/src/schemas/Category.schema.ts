import { z } from 'zod';

// Schema for creating a category
export const CategoryToCreate = z.object({
    name: z.string()
        .min(2, 'Name must have at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
    description: z.string().optional().default(''),
    status: z.boolean().optional().default(true),
});

export type CategoryToCreateType = z.infer<typeof CategoryToCreate>;

// Schema for updating a category (all fields optional)
export const CategoryToUpdate = CategoryToCreate.partial();

export type CategoryToUpdateType = z.infer<typeof CategoryToUpdate>;

// Schema for query parameters filtering
export const CategoryFilters = z.object({
    search: z.string().min(1).optional(),
    status: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export type CategoryFiltersType = z.infer<typeof CategoryFilters>;
