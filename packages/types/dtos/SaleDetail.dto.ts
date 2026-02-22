import type { PublicService } from './Service.dto.js';
import type { PublicProduct } from './Product.dto.js';

export type SaleDetailType = {
    serviceId?: string;
    productId?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export type PublicSaleDetail = {
    id: string;
    saleId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    service: PublicService | null;
    product: PublicProduct | null;
}
