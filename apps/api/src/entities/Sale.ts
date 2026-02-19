import { SaleStatus, PaymentStatus } from "../types/enums";
import { SaleType } from "../types/dtos/Sale.dto";
import Customer from "./Customer";
import Order from "./Order";
import SaleDetail from "./SaleDetail";

export default class Sale {
    public readonly id: string;
    public readonly customer: Customer;
    public readonly order: Order | null;
    public readonly saleDetails: SaleDetail[];
    public total: number;
    public dollarRate: number;
    public status: SaleStatus;
    public paymentStatus: PaymentStatus;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: SaleType) {
        this.id = data.id;
        this.customer = data.customer;
        this.order = data.order;
        this.saleDetails = data.saleDetails;
        this.total = data.total;
        this.dollarRate = data.dollarRate;
        this.status = data.status;
        this.paymentStatus = data.paymentStatus;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }

    get customerId(): string {
        return this.customer.id;
    }

    get orderId(): string | null {
        return this.order?.id ?? null;
    }
}
