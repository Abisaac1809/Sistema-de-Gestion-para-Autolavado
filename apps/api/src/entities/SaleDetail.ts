import Product from "./Product";
import Service from "./Service";

export default class SaleDetail {
    public readonly id: string;
    public readonly saleId: string;
    public readonly service: Service | null;
    public readonly product: Product | null;
    public quantity: number;
    public unitPrice: number;
    public subtotal: number;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: {
        id: string;
        saleId: string;
        service: Service | null;
        product: Product | null;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
    }) {
        this.id = data.id;
        this.saleId = data.saleId;
        this.service = data.service;
        this.product = data.product;
        this.quantity = data.quantity;
        this.unitPrice = data.unitPrice;
        this.subtotal = data.subtotal;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }

    get serviceId(): string | null {
        return this.service?.id ?? null;
    }

    get productId(): string | null {
        return this.product?.id ?? null;
    }
}
