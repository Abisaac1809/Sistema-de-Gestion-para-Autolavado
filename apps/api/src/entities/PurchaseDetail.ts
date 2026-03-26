export type PurchaseDetailType = {
    id: string;
    purchaseId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitCostUsd: number;
    subtotalUsd: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
};

export default class PurchaseDetail {
    public readonly id: string;
    public readonly purchaseId: string;
    public readonly productId: string;
    public readonly productName: string;
    public quantity: number;
    public unitCostUsd: number;
    public subtotalUsd: number;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: PurchaseDetailType) {
        this.id = data.id;
        this.purchaseId = data.purchaseId;
        this.productId = data.productId;
        this.productName = data.productName;
        this.quantity = data.quantity;
        this.unitCostUsd = data.unitCostUsd;
        this.subtotalUsd = data.subtotalUsd;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
