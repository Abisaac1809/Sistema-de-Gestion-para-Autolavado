import Sale from "../entities/Sale";
import SaleDetail from "../entities/SaleDetail";
import { PublicSale, PublicSaleDetail } from "../types/dtos/Sale.dto";
import CustomerMapper from "./CustomerMapper";
import ProductMapper from "./ProductMapper";
import ServiceMapper from "./ServiceMapper";

export default class SaleMapper {
    static toPublicSale(sale: Sale): PublicSale {
        return {
            id: sale.id,
            customerId: sale.customerId,
            orderId: sale.orderId,
            total: sale.total,
            dollarRate: sale.dollarRate,
            status: sale.status,
            paymentStatus: sale.paymentStatus,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            customer: CustomerMapper.toPublic(sale.customer),
            saleDetails: sale.saleDetails.map((detail) =>
                this.toPublicSaleDetail(detail)
            ),
        };
    }

    static toPublicSaleDetail(detail: SaleDetail): PublicSaleDetail {
        return {
            id: detail.id,
            saleId: detail.saleId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            subtotal: detail.subtotal,
            service: detail.service ? ServiceMapper.toPublicService(detail.service) : null,
            product: detail.product ? ProductMapper.toPublicProduct(detail.product) : null,
        };
    }

    static toPublicSaleList(sales: Sale[]): PublicSale[] {
        return sales.map(SaleMapper.toPublicSale);
    }
}
