import { PrismaClient, Prisma } from '../generated/prisma';
import OrderDetail from '../entities/OrderDetail';
import IOrderDetailRepository from '../interfaces/IRepositories/IOrderDetailRepository';

export default class PrismaOrderDetailRepository implements IOrderDetailRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: {
        orderId: string;
        serviceId: string | null;
        productId: string | null;
        quantity: number;
        priceAtTime: number;
    }): Promise<OrderDetail> {
        const created = await this.prisma.orderDetail.create({
            data: {
                orderId: data.orderId,
                serviceId: data.serviceId,
                productId: data.productId,
                quantity: data.quantity,
                priceAtTime: data.priceAtTime,
            },
        });
        return this.mapToEntity(created);
    }

    async createMany(data: Array<{
        orderId: string;
        serviceId: string | null;
        productId: string | null;
        quantity: number;
        priceAtTime: number;
    }>): Promise<OrderDetail[]> {
        // Use transaction to create all details and return them
        const created = await this.prisma.$transaction(
            data.map(d => this.prisma.orderDetail.create({ data: d }))
        );
        return created.map(detail => this.mapToEntity(detail));
    }

    async getByOrderId(orderId: string): Promise<OrderDetail[]> {
        const details = await this.prisma.orderDetail.findMany({
            where: { orderId, deletedAt: null },
        });
        return details.map(d => this.mapToEntity(d));
    }

    async getById(id: string): Promise<OrderDetail | null> {
        const detail = await this.prisma.orderDetail.findFirst({
            where: { id, deletedAt: null },
        });
        return detail ? this.mapToEntity(detail) : null;
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.orderDetail.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async softDeleteByOrderId(orderId: string): Promise<void> {
        await this.prisma.orderDetail.updateMany({
            where: { orderId, deletedAt: null },
            data: { deletedAt: new Date() },
        });
    }

    private mapToEntity(prismaDetail: Prisma.OrderDetailGetPayload<{}>): OrderDetail {
        // Este repositorio NO carga relaciones completas
        // Los details con entities completos solo vienen del OrderRepository
        return new OrderDetail({
            id: prismaDetail.id,
            orderId: prismaDetail.orderId,
            quantity: prismaDetail.quantity.toNumber(),
            priceAtTime: prismaDetail.priceAtTime.toNumber(),
            createdAt: prismaDetail.createdAt,
            updatedAt: prismaDetail.updatedAt,
            deletedAt: prismaDetail.deletedAt,
            service: null,
            product: null,
        });
    }
}
