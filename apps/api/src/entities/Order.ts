import { OrderStatus, PaymentStatus } from "../types/enums";
import Customer from "./Customer";
import OrderDetail from "./OrderDetail";
import { OrderType } from "../types/dtos/Order.dto";

export default class Order {
    public readonly id: string;
    public readonly customer: Customer;
    public readonly orderDetails: OrderDetail[];
    public vehiclePlate: string | null;
    public vehicleModel: string;
    public status: OrderStatus;
    public paymentStatus: PaymentStatus;
    public totalEstimated: number;
    public startedAt: Date | null;
    public completedAt: Date | null;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: OrderType) {
        this.id = data.id;
        this.customer = data.customer;
        this.orderDetails = data.orderDetails;
        this.vehiclePlate = data.vehiclePlate;
        this.vehicleModel = data.vehicleModel;
        this.status = data.status;
        this.paymentStatus = data.paymentStatus;
        this.totalEstimated = data.totalEstimated;
        this.startedAt = data.startedAt;
        this.completedAt = data.completedAt;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }

    get customerId(): string {
        return this.customer.id;
    }
}
