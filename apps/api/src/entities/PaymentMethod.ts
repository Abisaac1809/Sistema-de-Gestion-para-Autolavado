import { PaymentMethodType } from "../types/dtos/PaymentMethod.dto";
import { Currency } from "../types/enums";

export default class PaymentMethod {
    public readonly id: string;
    public name: string;
    public description: string | null;
    public currency: Currency | null;
    public bankName: string | null;
    public accountHolder: string | null;
    public accountNumber: string | null;
    public idCard: string | null;
    public phoneNumber: string | null;
    public email: string | null;
    public isActive: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: PaymentMethodType) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.currency = data.currency;
        this.bankName = data.bankName;
        this.accountHolder = data.accountHolder;
        this.accountNumber = data.accountNumber;
        this.idCard = data.idCard;
        this.phoneNumber = data.phoneNumber;
        this.email = data.email;
        this.isActive = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
