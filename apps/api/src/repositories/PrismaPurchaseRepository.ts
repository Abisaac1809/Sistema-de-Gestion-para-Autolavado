import { PrismaClient, Prisma } from '../generated/prisma';
import Purchase from '../entities/Purchase';
import PurchaseDetail from '../entities/PurchaseDetail';
import IPurchaseRepository from '../interfaces/IRepositories/IPurchaseRepository';
import { PurchaseFiltersForRepository, PurchaseFiltersForCount } from '../types/dtos/Purchase.dto';
import { PurchaseToCreateType } from '@car-wash/types';

type PurchaseWithRelations = Prisma.PurchaseGetPayload<{
    include: {
        purchaseDetails: {
            where: { deletedAt: null };
            include: { product: true };
        };
        paymentMethod: true;
    };
}>;

export default class PrismaPurchaseRepository implements IPurchaseRepository {
    constructor(private prisma: PrismaClient) {}

    private readonly includeRelations = {
        purchaseDetails: {
            where: { deletedAt: null as null },
            include: { product: true },
            orderBy: { createdAt: 'asc' as const },
        },
        paymentMethod: true,
    } as const;

    async getById(id: string): Promise<Purchase | null> {
        const record = await this.prisma.purchase.findFirst({
            where: { id, deletedAt: null },
            include: this.includeRelations,
        });
        return record ? this.mapToEntity(record) : null;
    }

    async getMany(filters: PurchaseFiltersForRepository): Promise<Purchase[]> {
        const where = this.buildWhereClause(filters);

        const records = await this.prisma.purchase.findMany({
            where,
            include: this.includeRelations,
            orderBy: { purchaseDate: 'desc' },
            skip: filters.offset,
            take: filters.limit,
        });

        return records.map((r) => this.mapToEntity(r));
    }

    async count(filters: PurchaseFiltersForCount): Promise<number> {
        const where = this.buildWhereClause(filters);
        return await this.prisma.purchase.count({ where });
    }

    async create(data: PurchaseToCreateType & { totalUsd: number }): Promise<Purchase> {
        return await this.prisma.$transaction(async (tx) => {
            const created = await tx.purchase.create({
                data: {
                    providerName: data.providerName,
                    purchaseDate: data.purchaseDate,
                    dollarRate: data.dollarRate,
                    totalUsd: data.totalUsd,
                    paymentMethodId: data.paymentMethodId ?? null,
                    notes: data.notes ?? null,
                    purchaseDetails: {
                        create: data.details.map((detail) => ({
                            productId: detail.productId,
                            quantity: detail.quantity,
                            unitCostUsd: detail.unitCostUsd,
                            subtotalUsd: detail.quantity * detail.unitCostUsd,
                        })),
                    },
                },
                include: this.includeRelations,
            });

            for (const detail of data.details) {
                await tx.product.update({
                    where: { id: detail.productId },
                    data: { stock: { increment: detail.quantity } },
                });
            }

            return this.mapToEntity(created);
        });
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.purchase.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    private buildWhereClause(
        filters: PurchaseFiltersForRepository | PurchaseFiltersForCount,
    ): Prisma.PurchaseWhereInput {
        const where: Prisma.PurchaseWhereInput = { deletedAt: null };

        if (filters.search) {
            where.OR = [
                { providerName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.paymentMethodId) {
            where.paymentMethodId = filters.paymentMethodId;
        }

        if (filters.fromDate || filters.toDate) {
            where.purchaseDate = {};
            if (filters.fromDate) {
                (where.purchaseDate as Prisma.DateTimeFilter).gte = new Date(filters.fromDate);
            }
            if (filters.toDate) {
                (where.purchaseDate as Prisma.DateTimeFilter).lte = new Date(filters.toDate);
            }
        }

        return where;
    }

    private mapToEntity(record: PurchaseWithRelations): Purchase {
        const details = record.purchaseDetails.map(
            (detail) =>
                new PurchaseDetail({
                    id: detail.id,
                    purchaseId: detail.purchaseId,
                    productId: detail.productId,
                    productName: detail.product.name,
                    quantity: detail.quantity.toNumber(),
                    unitCostUsd: detail.unitCostUsd.toNumber(),
                    subtotalUsd: detail.subtotalUsd.toNumber(),
                    createdAt: detail.createdAt,
                    updatedAt: detail.updatedAt,
                    deletedAt: detail.deletedAt,
                }),
        );

        return new Purchase({
            id: record.id,
            providerName: record.providerName,
            purchaseDate: record.purchaseDate,
            dollarRate: record.dollarRate.toNumber(),
            totalUsd: record.totalUsd.toNumber(),
            paymentMethodId: record.paymentMethodId,
            paymentMethodName: record.paymentMethod?.name ?? null,
            notes: record.notes,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
            details,
        });
    }
}
