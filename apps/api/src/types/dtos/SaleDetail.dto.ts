import { SaleDetailToCreateType } from '../../schemas/SaleDetail.schema';
import { PublicService } from './Service.dto';
import { PublicProduct } from './Product.dto';

export type { SaleDetailToCreateType };

export type SaleDetailType = {
    serviceId?: string;
    productId?: string;
    quantity: number;
    unitPrice: number;
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
