import { SaleStatus } from "../types/enums";
import { SaleType } from "../types/dtos/Sale.dto";
import Customer from "./Customer";
import Order from "./Order";
import SaleDetail from "./SaleDetail";
import Payment from "./Payment";

export default class Sale {
    public readonly id: string;
    public readonly customer: Customer;
    public readonly order: Order | null;
    public readonly saleDetails: SaleDetail[];
    public readonly payments?: Payment[];
    public dollarRate: number;
    public totalUSD: number;
    public totalVES: number;
    public status: SaleStatus;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: SaleType) {
        this.id = data.id;
        this.customer = data.customer;
        this.order = data.order;
        this.saleDetails = data.saleDetails;
        this.payments = data.payments;
        this.dollarRate = data.dollarRate;
        this.totalUSD = data.totalUSD;
        this.totalVES = data.totalVES;
        this.status = data.status;
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
