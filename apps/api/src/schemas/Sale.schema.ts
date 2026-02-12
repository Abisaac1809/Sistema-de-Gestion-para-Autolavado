import { z } from 'zod';
import { SaleStatus } from '../types/enums';
import { SaleDetailToCreate } from './SaleDetail.schema';

export const SaleToCreate = z.object({
    customerId: z.string().uuid('Invalid customer ID format'),
    paymentMethodId: z.string().uuid('Invalid payment method ID format').optional(),
    dollarRate: z.number().positive('Dollar rate must be greater than 0'),
    details: z.array(SaleDetailToCreate).min(1, 'Sale must have at least one item'),
});

export type SaleToCreateType = z.infer<typeof SaleToCreate>;

export const SaleStatusChange = z.object({
    status: z.nativeEnum(SaleStatus).optional(),
});

export type SaleStatusChangeType = z.infer<typeof SaleStatusChange>;

export const SaleFilters = z.object({
    search: z.string().min(1).optional(),
    status: z.nativeEnum(SaleStatus).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export type SaleFiltersType = z.infer<typeof SaleFilters>;
