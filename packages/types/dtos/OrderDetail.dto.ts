import type { PublicService } from './Service.dto.js';
import type { PublicProduct } from './Product.dto.js';

export type OrderDetailToSave = {
    orderId: string;
    serviceId: string | null;
    productId: string | null;
    quantity: number;
    priceAtTime: number;
}

export type OrderDetailRecord = {
    id: string;
    orderId: string;
    serviceId: string | null;
    productId: string | null;
    quantity: number;
    priceAtTime: number;
    serviceName?: string | null;
    productName?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type PublicOrderDetail = {
    id: string;
    orderId: string;
    quantity: number;
    priceAtTime: number;
    subtotal: number;
    service: PublicService | null;
    product: PublicProduct | null;
}
