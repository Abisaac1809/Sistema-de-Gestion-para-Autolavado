import { PrismaClient, Prisma } from '../generated/prisma';
import Order from '../entities/Order';
import IOrderRepository from '../interfaces/IRepositories/IOrderRepository';
import OrderDetail from '../entities/OrderDetail';
import Customer from '../entities/Customer';
import Service from '../entities/Service';
import Product from '../entities/Product';
import Payment from '../entities/Payment';
import PaymentMethod from '../entities/PaymentMethod';
import { OrderToSave, OrderToUpdateType } from '../types/dtos/Order.dto';
import { OrderFiltersForRepository, OrderFiltersForCount } from '../types/dtos/Order.dto';
import { OrderStatus, PaymentStatus } from '../types/enums';

export default class PrismaOrderRepository implements IOrderRepository {
    constructor(private prisma: PrismaClient) { }

    private readonly includeRelationsBase = {
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

    private readonly includeRelationsDetail = {
        customer: true,
        orderDetails: {
            where: { deletedAt: null },
            include: {
                service: true,
                product: true
            },
            orderBy: { createdAt: 'asc' as const }
        },
        payments: {
            where: { deletedAt: null },
            include: { paymentMethod: true },
            orderBy: { paymentDate: 'asc' as const }
        }
    } as const;

    async create(data: OrderToSave): Promise<Order> {
        const created = await this.prisma.order.create({
            data: {
                customerId: data.customerId,
                vehiclePlate: data.vehiclePlate,
                vehicleModel: data.vehicleModel,
                dollarRate: data.dollarRate,
                totalUsd: data.totalUSD,
                totalVes: data.totalVES,
            },
            include: this.includeRelationsBase,
        });
        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<Order | null> {
        const order = await this.prisma.order.findFirst({
            where: { id, deletedAt: null },
            include: this.includeRelationsDetail,
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
            include: this.includeRelationsBase,
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
            include: this.includeRelationsBase,
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
            include: this.includeRelationsBase,
        });
        return this.mapToEntity(updated);
    }

    async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { paymentStatus: status },
            include: this.includeRelationsBase,
        });
        return this.mapToEntity(updated);
    }

    async updateTotal(id: string, totalUSD: number, totalVES: number): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { totalUsd: totalUSD, totalVes: totalVES },
            include: this.includeRelationsBase,
        });
        return this.mapToEntity(updated);
    }

    async updateTotalPaid(id: string, totalPaidUSD: number, totalPaidVES: number): Promise<Order> {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { totalPaidUsd: totalPaidUSD, totalPaidVes: totalPaidVES },
            include: this.includeRelationsBase,
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

        const payments = prismaOrder.payments
            ? prismaOrder.payments.map((p: any) => {
                const paymentMethod = new PaymentMethod({
                    id: p.paymentMethod.id,
                    name: p.paymentMethod.name,
                    description: p.paymentMethod.description,
                    currency: p.paymentMethod.currency,
                    bankName: p.paymentMethod.bankName,
                    accountHolder: p.paymentMethod.accountHolder,
                    accountNumber: p.paymentMethod.accountNumber,
                    idCard: p.paymentMethod.idCard,
                    phoneNumber: p.paymentMethod.phoneNumber,
                    email: p.paymentMethod.email,
                    isActive: p.paymentMethod.isActive,
                    createdAt: p.paymentMethod.createdAt,
                    updatedAt: p.paymentMethod.updatedAt,
                    deletedAt: p.paymentMethod.deletedAt,
                });
                return new Payment({
                    id: p.id,
                    orderId: p.orderId,
                    saleId: p.saleId,
                    paymentMethod,
                    amountUsd: p.amountUsd.toNumber(),
                    exchangeRate: p.exchangeRate.toNumber(),
                    amountVes: p.amountVes.toNumber(),
                    originalCurrency: p.originalCurrency,
                    paymentDate: p.paymentDate,
                    notes: p.notes,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    deletedAt: p.deletedAt,
                });
            })
            : undefined;

        return new Order({
            id: prismaOrder.id,
            customer,
            orderDetails,
            payments,
            vehiclePlate: prismaOrder.vehiclePlate,
            vehicleModel: prismaOrder.vehicleModel,
            status: prismaOrder.status as OrderStatus,
            paymentStatus: prismaOrder.paymentStatus as PaymentStatus,
            dollarRate: prismaOrder.dollarRate.toNumber(),
            totalUSD: prismaOrder.totalUsd.toNumber(),
            totalVES: prismaOrder.totalVes.toNumber(),
            totalPaidUSD: prismaOrder.totalPaidUsd.toNumber(),
            totalPaidVES: prismaOrder.totalPaidVes.toNumber(),
            startedAt: prismaOrder.startedAt,
            completedAt: prismaOrder.completedAt,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            deletedAt: prismaOrder.deletedAt,
        });
    }
}
