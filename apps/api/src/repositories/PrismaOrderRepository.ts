import { PrismaClient, Prisma } from '../generated/prisma';
import Order from '../entities/Order';
import IOrderRepository from '../interfaces/IRepositories/IOrderRepository';
import OrderDetail from '../entities/OrderDetail';
import Customer from '../entities/Customer';
import Service from '../entities/Service';
import Product from '../entities/Product';
import { OrderToUpdateType } from '../types/dtos/Order.dto';
import { OrderFiltersForRepository, OrderFiltersForCount } from '../types/dtos/Order.dto';
import { OrderStatus, PaymentStatus } from '../types/enums';

export default class PrismaOrderRepository implements IOrderRepository {
    constructor(private prisma: PrismaClient) { }

    private readonly includeRelations = {
        customer: true,
        orderDetails: {
            where: { deletedAt: null },
            include: {
                service: true,
                product: true
            },
            orderBy: { createdAt: 'asc' as const }
        }
    } as const;

    async create(data: {
        customerId: string;
        vehiclePlate: string | null;
        vehicleModel: string;
        totalEstimated: number;
    }): Promise<Order> {
        // Ensure totalEstimated is a valid number
        const validTotal = isNaN(data.totalEstimated) || !isFinite(data.totalEstimated) 
            ? 0 
            : data.totalEstimated;

        const created = await this.prisma.order.create({
            data: {
                customerId: data.customerId,
                vehiclePlate: data.vehiclePlate,
                vehicleModel: data.vehicleModel,
                totalEstimated: validTotal,
            },
            include: this.includeRelations,
        });
        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<Order | null> {
        const order = await this.prisma.order.findFirst({
            where: { id, deletedAt: null },
            include: this.includeRelations,
        });
        return order ? this.mapToEntity(order) : null;
    }


    async list(filters: OrderFiltersForRepository): Promise<Order[]> {
        const where: Prisma.OrderWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                {
                    customer: {
                        fullName: { contains: filters.search, mode: 'insensitive' }
                    }
                },
                {
                    vehiclePlate: { contains: filters.search, mode: 'insensitive' }
                }
            ];
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.fromDate || filters.toDate) {
            where.createdAt = {};
            if (filters.fromDate) {
                where.createdAt.gte = filters.fromDate;
            }
            if (filters.toDate) {
                where.createdAt.lte = filters.toDate;
            }
        }

        const orders = await this.prisma.order.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
            include: this.includeRelations,
        });

        return orders.map(o => this.mapToEntity(o));
    }

    async count(filters: OrderFiltersForCount): Promise<number> {
        const where: Prisma.OrderWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                {
                    customer: {
                        fullName: { contains: filters.search, mode: 'insensitive' }
                    }
                },
                {
                    vehiclePlate: { contains: filters.search, mode: 'insensitive' }
                }
            ];
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.fromDate || filters.toDate) {
            where.createdAt = {};
            if (filters.fromDate) {
                where.createdAt.gte = filters.fromDate;
            }
            if (filters.toDate) {
                where.createdAt.lte = filters.toDate;
            }
        }

        return await this.prisma.order.count({ where });
    }

    async update(id: string, data: OrderToUpdateType): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                vehiclePlate: data.vehiclePlate,
                vehicleModel: data.vehicleModel,
            },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    async updateStatus(id: string, status: OrderStatus, timestamps: {
        startedAt?: Date;
        completedAt?: Date;
    }): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status,
                ...(timestamps.startedAt && { startedAt: timestamps.startedAt }),
                ...(timestamps.completedAt && { completedAt: timestamps.completedAt }),
            },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { paymentStatus: status },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    async updateTotal(id: string, totalEstimated: number): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { totalEstimated },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    private mapToEntity(prismaOrder: any): Order {
        const customer = new Customer({
            id: prismaOrder.customer.id,
            fullName: prismaOrder.customer.fullName,
            idNumber: prismaOrder.customer.idNumber,
            phone: prismaOrder.customer.phone,
            createdAt: prismaOrder.customer.createdAt,
            updatedAt: prismaOrder.customer.updatedAt,
            deletedAt: prismaOrder.customer.deletedAt,
        });

        const orderDetails = prismaOrder.orderDetails.map((detail: any) => {
            const service = detail.service ? new Service({
                id: detail.service.id,
                name: detail.service.name,
                description: detail.service.description,
                price: detail.service.price.toNumber(),
                status: detail.service.status,
                createdAt: detail.service.createdAt,
                updatedAt: detail.service.updatedAt,
                deletedAt: detail.service.deletedAt,
            }) : null;

            const product = detail.product ? new Product({
                id: detail.product.id,
                categoryId: detail.product.categoryId,
                name: detail.product.name,
                stock: detail.product.stock.toNumber(),
                minStock: detail.product.minStock.toNumber(),
                unitType: detail.product.unitType,
                costPrice: detail.product.costPrice.toNumber(),
                isForSale: detail.product.isForSale,
                status: detail.product.status,
                createdAt: detail.product.createdAt,
                updatedAt: detail.product.updatedAt,
                deletedAt: detail.product.deletedAt,
            }) : null;

            return new OrderDetail({
                id: detail.id,
                orderId: detail.orderId,
                quantity: detail.quantity.toNumber(),
                priceAtTime: detail.priceAtTime.toNumber(),
                createdAt: detail.createdAt,
                updatedAt: detail.updatedAt,
                deletedAt: detail.deletedAt,
                service,
                product,
            });
        });

        return new Order({
            id: prismaOrder.id,
            customer,
            orderDetails,
            vehiclePlate: prismaOrder.vehiclePlate,
            vehicleModel: prismaOrder.vehicleModel,
            status: prismaOrder.status as OrderStatus,
            paymentStatus: prismaOrder.paymentStatus as any,
            totalEstimated: prismaOrder.totalEstimated.toNumber(),
            startedAt: prismaOrder.startedAt,
            completedAt: prismaOrder.completedAt,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            deletedAt: prismaOrder.deletedAt,
        });
    }
}
