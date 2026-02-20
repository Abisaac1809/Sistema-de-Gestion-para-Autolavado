import { InventoryAdjustmentType } from "../types/dtos/InventoryAdjustment.dto";
import { AdjustmentReason, AdjustmentType } from "../types/enums";

export default class InventoryAdjustment {
    public readonly id: string;
    public productId: string;
    public productName: string;
    public adjustmentType: AdjustmentType;
    public quantity: number;
    public stockBefore: number;
    public stockAfter: number;
    public reason: AdjustmentReason;
    public notes: string | null;
    public createdAt: Date;

    constructor(data: InventoryAdjustmentType) {
        this.id = data.id;
        this.productId = data.productId;
        this.productName = data.productName;
        this.adjustmentType = data.adjustmentType;
        this.quantity = data.quantity;
        this.stockBefore = data.stockBefore;
        this.stockAfter = data.stockAfter;
        this.reason = data.reason;
        this.notes = data.notes;
        this.createdAt = data.createdAt;
    }
}
