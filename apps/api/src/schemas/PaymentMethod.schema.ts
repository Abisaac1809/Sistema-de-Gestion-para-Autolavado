import { z } from 'zod';
import { Currency } from '../types/enums';

export const PaymentMethodToCreate = z.object({
    name: z.string()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    description: z.string()
        .max(1000, 'Description must not exceed 1000 characters')
        .nullable()
        .optional(),
    currency: z.nativeEnum(Currency)
        .nullable()
        .optional(),
    bankName: z.string()
        .max(100, 'Bank name must not exceed 100 characters')
        .nullable()
        .optional(),
    accountHolder: z.string()
        .max(100, 'Account holder must not exceed 100 characters')
        .nullable()
        .optional(),
    accountNumber: z.string()
        .max(50, 'Account number must not exceed 50 characters')
        .nullable()
        .optional(),
    idCard: z.string()
        .max(20, 'ID card must not exceed 20 characters')
        .nullable()
        .optional(),
    phoneNumber: z.string()
        .max(20, 'Phone number must not exceed 20 characters')
        .nullable()
        .optional(),
    email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters')
        .nullable()
        .optional()
        .or(z.literal('')),
    isActive: z.boolean()
        .default(true),
});

export type PaymentMethodToCreateType = z.infer<typeof PaymentMethodToCreate>;

export const PaymentMethodToUpdate = z.object({
    name: z.string()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
    description: z.string()
        .max(1000, 'Description must not exceed 1000 characters')
        .nullable()
        .optional(),
    currency: z.nativeEnum(Currency)
        .nullable()
        .optional(),
    bankName: z.string()
        .max(100, 'Bank name must not exceed 100 characters')
        .nullable()
        .optional(),
    accountHolder: z.string()
        .max(100, 'Account holder must not exceed 100 characters')
        .nullable()
        .optional(),
    accountNumber: z.string()
        .max(50, 'Account number must not exceed 50 characters')
        .nullable()
        .optional(),
    idCard: z.string()
        .max(20, 'ID card must not exceed 20 characters')
        .nullable()
        .optional(),
    phoneNumber: z.string()
        .max(20, 'Phone number must not exceed 20 characters')
        .nullable()
        .optional(),
    email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters')
        .nullable()
        .optional()
        .or(z.literal('')),
    isActive: z.boolean()
        .optional(),
}).partial();

export type PaymentMethodToUpdateType = z.infer<typeof PaymentMethodToUpdate>;

export const PaymentMethodFilters = z.object({
    search: z.string().min(1).optional(),
    currency: z.nativeEnum(Currency).optional(),
    isActive: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type PaymentMethodFiltersType = z.infer<typeof PaymentMethodFilters>;
