import { z } from 'zod';

export const NotificationContactToCreate = z.object({
    fullName: z.string()
        .min(2, 'Full name must have at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters')
        .nullable()
        .optional(),
    email: z.string()
        .email('Must be a valid email address')
        .max(100, 'Email must not exceed 100 characters'),
    receiveReports: z.boolean().default(true),
    isActive: z.boolean().default(true),
});

export type NotificationContactToCreateType = z.infer<typeof NotificationContactToCreate>;

export const NotificationContactToUpdate = NotificationContactToCreate.partial();

export type NotificationContactToUpdateType = z.infer<typeof NotificationContactToUpdate>;

export const NotificationContactFilters = z.object({
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type NotificationContactFiltersType = z.infer<typeof NotificationContactFilters>;
