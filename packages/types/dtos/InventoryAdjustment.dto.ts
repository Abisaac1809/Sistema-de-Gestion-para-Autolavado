import type { InventoryAdjustmentFiltersType } from '../schemas/InventoryAdjustment.schema.js';
import { AdjustmentType, AdjustmentReason } from '../enums.js';

export interface PublicInventoryAdjustment {
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

export type InventoryAdjustmentFiltersForService = InventoryAdjustmentFiltersType;

export type InventoryAdjustmentFiltersForRepository = {
    search?: string;
    productId?: string;
    type?: AdjustmentType;
    reason?: AdjustmentReason;
    fromDate?: Date;
    toDate?: Date;
    limit: number;
    offset: number;
};

export type InventoryAdjustmentFiltersForCount = {
    search?: string;
    productId?: string;
    type?: AdjustmentType;
    reason?: AdjustmentReason;
    fromDate?: Date;
    toDate?: Date;
};

export type ListOfInventoryAdjustments = {
    data: PublicInventoryAdjustment[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
