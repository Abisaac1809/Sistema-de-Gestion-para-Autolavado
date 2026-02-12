import Sale from "../entities/Sale";
import SaleDetail from "../entities/SaleDetail";
import { PublicSale, PublicSaleDetail } from "../types/dtos/Sale.dto";
import CustomerMapper from "./CustomerMapper";
import PaymentMethodMapper from "./PaymentMethodMapper";
import ProductMapper from "./ProductMapper";
import ServiceMapper from "./ServiceMapper";

export default class SaleMapper {
    static toPublicSale(sale: Sale): PublicSale {
        return {
            id: sale.id,
            customerId: sale.customerId,
            orderId: sale.orderId,
            paymentMethodId: sale.paymentMethodId,
            total: sale.total,
            dollarRate: sale.dollarRate,
            status: sale.status,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            customer: CustomerMapper.toPublic(sale.customer),
            paymentMethod: sale.paymentMethod ? PaymentMethodMapper.toPublic(sale.paymentMethod) : null,
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
