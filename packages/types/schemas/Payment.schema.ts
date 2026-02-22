import { z } from 'zod';

export const PaymentToCreate = z.object({
    paymentMethodId: z.string().uuid('Invalid payment method ID format'),
    amountUsd: z.number().refine((val) => val !== 0, { message: 'Amount USD cannot be zero' }).optional(),
    amountVes: z.number().refine((val) => val !== 0, { message: 'Amount VES cannot be zero' }).optional(),
    notes: z.string().optional(),
}).refine(
    (data) => {
        const hasAmountUsd = data.amountUsd !== undefined;
        const hasAmountVes = data.amountVes !== undefined;
        return (hasAmountUsd && !hasAmountVes) || (!hasAmountUsd && hasAmountVes);
    },
    {
        message: 'Must provide either amountUsd or amountVes, but not both',
        path: ['amountUsd', 'amountVes'],
    }
);

export type PaymentToCreateType = z.infer<typeof PaymentToCreate>;

export const PaymentFilters = z.object({
    orderId: z.string().uuid('Invalid order ID format').optional(),
    saleId: z.string().uuid('Invalid sale ID format').optional(),
    paymentMethodId: z.string().uuid('Invalid payment method ID format').optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
}).refine(
    (data) => {
        const hasOrderId = data.orderId !== undefined;
        const hasSaleId = data.saleId !== undefined;
        return !hasOrderId || !hasSaleId;
    },
    {
        message: 'Cannot filter by both orderId and saleId simultaneously',
        path: ['orderId', 'saleId'],
    }
);

export type PaymentFiltersType = z.infer<typeof PaymentFilters>;
