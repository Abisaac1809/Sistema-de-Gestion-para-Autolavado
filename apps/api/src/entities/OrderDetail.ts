import Service from "./Service";
import Product from "./Product";
import { OrderDetailType } from "../types/dtos/OrderDetail.dto";

export default class OrderDetail {
    public readonly id: string;
    public readonly orderId: string;
    public quantity: number;
    public priceAtTime: number;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    public readonly service: Service | null;
    public readonly product: Product | null;

    constructor(data: OrderDetailType) {
        this.id = data.id;
        this.orderId = data.orderId;
        this.quantity = data.quantity;
        this.priceAtTime = data.priceAtTime;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.service = data.service;
        this.product = data.product;
    }

    get serviceId(): string | null {
        return this.service?.id ?? null;
    }

    get productId(): string | null {
        return this.product?.id ?? null;
    }
}
