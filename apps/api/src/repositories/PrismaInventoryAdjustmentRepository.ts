import { PrismaClient, Prisma } from '../generated/prisma';
import InventoryAdjustment from '../entities/InventoryAdjustment';
import IInventoryAdjustmentRepository from '../interfaces/IRepositories/IInventoryAdjustmentRepository';
import {
    InventoryAdjustmentToCreateType,
    InventoryAdjustmentFiltersForRepository,
    InventoryAdjustmentFiltersForCount,
} from '../types/dtos/InventoryAdjustment.dto';
import { AdjustmentType, AdjustmentReason } from '../types/enums';

export default class PrismaInventoryAdjustmentRepository implements IInventoryAdjustmentRepository {
    constructor(private prisma: PrismaClient) {}

    async create(
        data: InventoryAdjustmentToCreateType,
        stockBefore: number,
        stockAfter: number,
    ): Promise<InventoryAdjustment> {
        return await this.prisma.$transaction(async (tx) => {
            const created = await tx.inventoryAdjustment.create({
                data: {
                    productId: data.productId,
                    adjustmentType: data.adjustmentType as AdjustmentType,
                    quantity: data.quantity,
                    stockBefore,
                    stockAfter,
                    reason: data.reason as AdjustmentReason,
                    notes: data.notes ?? null,
                },
                include: { product: true },
            });

            await tx.product.update({
                where: { id: data.productId },
                data: { stock: stockAfter },
            });

            return this.mapToEntity(created);
        });
    }

    async getById(id: string): Promise<InventoryAdjustment | null> {
        const record = await this.prisma.inventoryAdjustment.findFirst({
            where: { id },
            include: { product: true },
        });
        return record ? this.mapToEntity(record) : null;
    }

    async getAll(filters: InventoryAdjustmentFiltersForRepository): Promise<InventoryAdjustment[]> {
        const where: Prisma.InventoryAdjustmentWhereInput = {};

        if (filters.productId) {
            where.productId = filters.productId;
        }

        if (filters.type) {
            where.adjustmentType = filters.type as AdjustmentType;
        }

        if (filters.reason) {
            where.reason = filters.reason as AdjustmentReason;
        }

        if (filters.search) {
            where.OR = [
                { product: { name: { contains: filters.search, mode: 'insensitive' } } },
                { notes: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.fromDate !== undefined || filters.toDate !== undefined) {
            where.createdAt = {};
            if (filters.fromDate !== undefined) {
                (where.createdAt as Prisma.DateTimeFilter).gte = filters.fromDate;
            }
            if (filters.toDate !== undefined) {
                (where.createdAt as Prisma.DateTimeFilter).lte = filters.toDate;
            }
        }

        const records = await this.prisma.inventoryAdjustment.findMany({
            where,
            include: { product: true },
            orderBy: { createdAt: 'desc' },
            skip: filters.offset,
            take: filters.limit,
        });

        return records.map((r) => this.mapToEntity(r));
    }

    async count(filters: InventoryAdjustmentFiltersForCount): Promise<number> {
        const where: Prisma.InventoryAdjustmentWhereInput = {};

        if (filters.productId) {
            where.productId = filters.productId;
        }

        if (filters.type) {
            where.adjustmentType = filters.type as AdjustmentType;
        }

        if (filters.reason) {
            where.reason = filters.reason as AdjustmentReason;
        }

        if (filters.search) {
            where.OR = [
                { product: { name: { contains: filters.search, mode: 'insensitive' } } },
                { notes: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.fromDate !== undefined || filters.toDate !== undefined) {
            where.createdAt = {};
            if (filters.fromDate !== undefined) {
                (where.createdAt as Prisma.DateTimeFilter).gte = filters.fromDate;
            }
            if (filters.toDate !== undefined) {
                (where.createdAt as Prisma.DateTimeFilter).lte = filters.toDate;
            }
        }

        return await this.prisma.inventoryAdjustment.count({ where });
    }

    private mapToEntity(record: Prisma.InventoryAdjustmentGetPayload<{ include: { product: true } }>): InventoryAdjustment {
        return new InventoryAdjustment({
            id: record.id,
            productId: record.productId,
            productName: record.product.name,
            adjustmentType: record.adjustmentType as AdjustmentType,
            quantity: record.quantity.toNumber(),
            stockBefore: record.stockBefore.toNumber(),
            stockAfter: record.stockAfter.toNumber(),
            reason: record.reason as AdjustmentReason,
            notes: record.notes,
            createdAt: record.createdAt,
        });
    }
}
