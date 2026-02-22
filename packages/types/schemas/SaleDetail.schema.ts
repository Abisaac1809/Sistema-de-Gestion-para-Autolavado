import { z } from 'zod';

export const SaleDetailToCreate = z.object({
    serviceId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    quantity: z.number().positive('Quantity must be greater than 0'),
    unitPrice: z.number().nonnegative('Unit price must be non-negative'),
}).refine((data) => {
    const hasService = data.serviceId !== undefined;
    const hasProduct = data.productId !== undefined;
    return (hasService && !hasProduct) || (!hasService && hasProduct);
}, {
    message: 'Each sale detail must have either serviceId or productId, but not both',
});

export type SaleDetailToCreateType = z.infer<typeof SaleDetailToCreate>;
