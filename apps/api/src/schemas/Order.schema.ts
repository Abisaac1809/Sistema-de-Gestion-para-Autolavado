import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '../types/enums';
import { OrderDetailToCreate } from './OrderDetail.schema';

export const OrderToCreate = z.object({
    customerId: z.string().uuid(),
    vehiclePlate: z.string().max(20).nullable().optional(),
    vehicleModel: z.string().min(1).max(50),
    details: z.array(OrderDetailToCreate).min(1, 'Order must have at least one item')
}).refine((data) => {
    return data.details.every(detail => {
        const hasService = detail.serviceId !== null && detail.serviceId !== undefined;
        const hasProduct = detail.productId !== null && detail.productId !== undefined;
        return (hasService && !hasProduct) || (!hasService && hasProduct);
    });
}, {
    message: 'Each order detail must have either a serviceId or a productId, but not both'
});

export type OrderToCreateType = z.infer<typeof OrderToCreate>;

export const OrderToUpdate = z.object({
    vehiclePlate: z.string().max(20).nullable().optional(),
    vehicleModel: z.string().min(1).max(50).optional()
});

export type OrderToUpdateType = z.infer<typeof OrderToUpdate>;

export const OrderStatusChange = z.object({
    status: z.nativeEnum(OrderStatus)
});

export type OrderStatusChangeType = z.infer<typeof OrderStatusChange>;

export const OrderPaymentStatusChange = z.object({
    status: z.nativeEnum(PaymentStatus)
});

export type OrderPaymentStatusChangeType = z.infer<typeof OrderPaymentStatusChange>;

export const OrderFilters = z.object({
    search: z.string().min(1).optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10)
});

export type OrderFiltersType = z.infer<typeof OrderFilters>;
