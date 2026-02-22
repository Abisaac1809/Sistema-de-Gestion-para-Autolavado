import { AdjustmentType, AdjustmentReason } from '@car-wash/types';

export type {
    InventoryAdjustmentToCreateType,
    InventoryAdjustmentFiltersType,
    PublicInventoryAdjustment,
    InventoryAdjustmentFiltersForService,
    InventoryAdjustmentFiltersForRepository,
    InventoryAdjustmentFiltersForCount,
    ListOfInventoryAdjustments,
} from '@car-wash/types';

// Internal type used by InventoryAdjustment entity — not in shared package
export interface InventoryAdjustmentType {
    id: string;
    productId: string;
    productName: string;
    adjustmentType: AdjustmentType;
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    reason: AdjustmentReason;
    notes: string | null;
    createdAt: Date;
}
