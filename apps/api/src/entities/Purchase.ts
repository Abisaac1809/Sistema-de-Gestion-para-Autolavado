import PurchaseDetail from './PurchaseDetail';

export type PurchaseType = {
    id: string;
    providerName: string;
    purchaseDate: Date;
    dollarRate: number;
    totalUsd: number;
    paymentMethodId: string | null;
    paymentMethodName: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    details: PurchaseDetail[];
};

export default class Purchase {
    public readonly id: string;
    public readonly providerName: string;
    public purchaseDate: Date;
    public dollarRate: number;
    public totalUsd: number;
    public paymentMethodId: string | null;
    public paymentMethodName: string | null;
    public notes: string | null;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;
    public details: PurchaseDetail[];

    constructor(data: PurchaseType) {
        this.id = data.id;
        this.providerName = data.providerName;
        this.purchaseDate = data.purchaseDate;
        this.dollarRate = data.dollarRate;
        this.totalUsd = data.totalUsd;
        this.paymentMethodId = data.paymentMethodId;
        this.paymentMethodName = data.paymentMethodName;
        this.notes = data.notes;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.details = data.details;
    }
}
