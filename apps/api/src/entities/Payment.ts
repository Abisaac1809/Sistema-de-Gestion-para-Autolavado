import { PaymentType } from "../types/dtos/Payment.dto";
import PaymentMethod from "./PaymentMethod";

export default class Payment {
    public readonly id: string;
    public readonly orderId: string | null;
    public readonly saleId: string | null;
    public readonly paymentMethod: PaymentMethod;
    public amountUsd: number;
    public exchangeRate: number;
    public amountVes: number;
    public originalCurrency: 'USD' | 'VES';
    public paymentDate: Date;
    public notes: string | null;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: PaymentType) {
        this.id = data.id;
        this.orderId = data.orderId;
        this.saleId = data.saleId;
        this.paymentMethod = data.paymentMethod;
        this.amountUsd = data.amountUsd;
        this.exchangeRate = data.exchangeRate;
        this.amountVes = data.amountVes;
        this.originalCurrency = data.originalCurrency;
        this.paymentDate = data.paymentDate;
        this.notes = data.notes;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }

    get paymentMethodId(): string {
        return this.paymentMethod.id;
    }
}
