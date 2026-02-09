import { OrderDetailToCreateType } from '../../schemas/OrderDetail.schema';
import Service from '../../entities/Service';
import Product from '../../entities/Product';
import { PublicService } from './Service.dto';
import { PublicProduct } from './Product.dto';

export type { OrderDetailToCreateType };

export type OrderDetailToSave = {
    orderId: string;
    serviceId: string | null;
    productId: string | null;
    quantity: number;
    priceAtTime: number;
}

export type OrderDetailType = {
    id: string;
    orderId: string;
    quantity: number;
    priceAtTime: number;
    service: Service | null;
    product: Product | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
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