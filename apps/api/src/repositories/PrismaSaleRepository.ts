import { PrismaClient, Prisma } from '../generated/prisma';
import Sale from '../entities/Sale';
import ISaleRepository from '../interfaces/IRepositories/ISaleRepository';
import SaleDetail from '../entities/SaleDetail';
import Customer from '../entities/Customer';
import Order from '../entities/Order';
import Service from '../entities/Service';
import Product from '../entities/Product';
import OrderDetail from '../entities/OrderDetail';
import { SaleToSave } from '../types/dtos/Sale.dto';
import { SaleFiltersForRepository, SaleFiltersForCount } from '../types/dtos/Sale.dto';
import { SaleStatus, PaymentStatus } from '../types/enums';

export default class PrismaSaleRepository implements ISaleRepository {
    constructor(private prisma: PrismaClient) { }

    private readonly includeRelations = {
        customer: true,
        order: {
            include: {
                customer: true,
                orderDetails: {
                    where: { deletedAt: null },
                    include: {
                        service: true,
                        product: true
                    }
                }
            }
        },
        saleDetails: {
            where: { deletedAt: null },
            include: {
                service: true,
                product: true
            },
            orderBy: { createdAt: 'asc' as const }
        }
    } as const;

    async create(data: SaleToSave): Promise<Sale> {
        // Calculate total from details
        const total = data.details.reduce((sum, detail) =>
            sum + (detail.quantity * detail.unitPrice), 0
        );

        const created = await this.prisma.sale.create({
            data: {
                customerId: data.customerId,
                orderId: data.orderId ?? null,
                total,
                dollarRate: data.dollarRate,
                saleDetails: {
                    create: data.details.map(detail => {
                        const subtotal = detail.quantity * detail.unitPrice;
                        return {
                            serviceId: detail.serviceId ?? null,
                            productId: detail.productId ?? null,
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            subtotal
                        };
                    })
                }
            },
            include: this.includeRelations,
        });

        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<Sale | null> {
        const sale = await this.prisma.sale.findFirst({
            where: { id, deletedAt: null },
            include: this.includeRelations,
        });
        return sale ? this.mapToEntity(sale) : null;
    }

    async list(filters: SaleFiltersForRepository): Promise<Sale[]> {
        const where: Prisma.SaleWhereInput = {
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
                    customer: {
                        idNumber: { contains: filters.search, mode: 'insensitive' }
                    }
                },
                {
                    order: {
                        vehiclePlate: { contains: filters.search, mode: 'insensitive' }
                    }
                }
            ];
        }

        if (filters.orderId) {
            where.orderId = filters.orderId;
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

        const sales = await this.prisma.sale.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
            include: this.includeRelations,
        });

        return sales.map(s => this.mapToEntity(s));
    }

    async count(filters: SaleFiltersForCount): Promise<number> {
        const where: Prisma.SaleWhereInput = {
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
                    customer: {
                        idNumber: { contains: filters.search, mode: 'insensitive' }
                    }
                },
                {
                    order: {
                        vehiclePlate: { contains: filters.search, mode: 'insensitive' }
                    }
                }
            ];
        }

        if (filters.orderId) {
            where.orderId = filters.orderId;
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

        return await this.prisma.sale.count({ where });
    }

    async updateStatus(id: string, status: SaleStatus): Promise<Sale> {
        const updated = await this.prisma.sale.update({
            where: { id },
            data: { status },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Sale> {
        const updated = await this.prisma.sale.update({
            where: { id },
            data: { paymentStatus: status },
            include: this.includeRelations,
        });
        return this.mapToEntity(updated);
    }

    private mapToEntity(prismaSale: any): Sale {
        const customer = new Customer({
            id: prismaSale.customer.id,
            fullName: prismaSale.customer.fullName,
            idNumber: prismaSale.customer.idNumber,
            phone: prismaSale.customer.phone,
            createdAt: prismaSale.customer.createdAt,
            updatedAt: prismaSale.customer.updatedAt,
            deletedAt: prismaSale.customer.deletedAt,
        });

        const order = prismaSale.order ? this.mapOrderToEntity(prismaSale.order) : null;

        const saleDetails = prismaSale.saleDetails.map((detail: any) => {
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

            return new SaleDetail({
                id: detail.id,
                saleId: detail.saleId,
                quantity: detail.quantity.toNumber(),
                unitPrice: detail.unitPrice.toNumber(),
                subtotal: detail.subtotal.toNumber(),
                createdAt: detail.createdAt,
                updatedAt: detail.updatedAt,
                deletedAt: detail.deletedAt,
                service,
                product,
            });
        });

        return new Sale({
            id: prismaSale.id,
            customer,
            order,
            saleDetails,
            total: prismaSale.total.toNumber(),
            dollarRate: prismaSale.dollarRate.toNumber(),
            status: prismaSale.status as SaleStatus,
            paymentStatus: prismaSale.paymentStatus as PaymentStatus,
            createdAt: prismaSale.createdAt,
            updatedAt: prismaSale.updatedAt,
            deletedAt: prismaSale.deletedAt,
        });
    }

    private mapOrderToEntity(prismaOrder: any): Order {
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
            status: prismaOrder.status,
            paymentStatus: prismaOrder.paymentStatus,
            totalEstimated: prismaOrder.totalEstimated.toNumber(),
            startedAt: prismaOrder.startedAt,
            completedAt: prismaOrder.completedAt,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            deletedAt: prismaOrder.deletedAt,
        });
    }
}
