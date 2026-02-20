import InventoryAdjustment from '../entities/InventoryAdjustment';
import {
    PublicInventoryAdjustment,
} from '../types/dtos/InventoryAdjustment.dto';

export default class InventoryAdjustmentMapper {
    static toPublic(adjustment: InventoryAdjustment): PublicInventoryAdjustment {
        return {
            id: adjustment.id,
            productId: adjustment.productId,
            productName: adjustment.productName,
            adjustmentType: adjustment.adjustmentType,
            quantity: adjustment.quantity,
            stockBefore: adjustment.stockBefore,
            stockAfter: adjustment.stockAfter,
            reason: adjustment.reason,
            notes: adjustment.notes,
            createdAt: adjustment.createdAt,
        };
    }

    static toPublicList(adjustments: InventoryAdjustment[]): PublicInventoryAdjustment[] {
        return adjustments.map((adjustment) => this.toPublic(adjustment));
    }
}
