import Purchase from '../entities/Purchase';
import PurchaseDetail from '../entities/PurchaseDetail';
import { PublicPurchase } from '../types/dtos/Purchase.dto';
import { PublicPurchaseDetail } from '@car-wash/types';

export default class PurchaseMapper {
    static toPublic(purchase: Purchase): PublicPurchase {
        return {
            id: purchase.id,
            providerName: purchase.providerName,
            purchaseDate: purchase.purchaseDate.toISOString(),
            dollarRate: purchase.dollarRate,
            totalUsd: purchase.totalUsd,
            paymentMethodId: purchase.paymentMethodId,
            paymentMethodName: purchase.paymentMethodName,
            notes: purchase.notes,
            createdAt: purchase.createdAt.toISOString(),
            updatedAt: purchase.updatedAt.toISOString(),
            details: purchase.details.map((detail) => this.toPublicDetail(detail)),
        };
    }

    static toPublicDetail(detail: PurchaseDetail): PublicPurchaseDetail {
        return {
            id: detail.id,
            purchaseId: detail.purchaseId,
            productId: detail.productId,
            productName: detail.productName,
            quantity: detail.quantity,
            unitCostUsd: detail.unitCostUsd,
            subtotalUsd: detail.subtotalUsd,
        };
    }
}
