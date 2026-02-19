import { PrismaClient, Prisma } from '../generated/prisma';
import Product from '../entities/Product';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import { ProductToCreateType, ProductToUpdateType, StockUpdate } from '../types/dtos/Product.dto';
import { ProductFiltersForRepository, ProductFiltersForCount, RawProduct } from '../types/dtos/Product.dto';
import { UnitType } from '../types/enums';

export default class PrismaProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: ProductToCreateType): Promise<Product> {
        const created = await this.prisma.product.create({
            data: {
                categoryId: data.categoryId,
                name: data.name,
                minStock: data.minStock,
                unitType: data.unitType as UnitType | null | undefined,
                costPrice: data.costPrice,
                isForSale: data.isForSale,
                status: data.status,
                stock: data.stock,
            },
        });
        return this.mapToEntity(created);
    }

    async get(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        return product ? this.mapToEntity(product) : null;
    }

    async getByName(name: string): Promise<Product | null> {
        const product = await this.prisma.product.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
        return product ? this.mapToEntity(product) : null;
    }

    async list(filters: ProductFiltersForRepository): Promise<Product[]> {
        if (filters.lowStock) {
            return this.listLowStock(filters);
        }

        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.isForSale !== undefined) {
            where.isForSale = filters.isForSale;
        }
        if (filters.status !== undefined) {
            where.status = filters.status;
        }

        const products = await this.prisma.product.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });

        return products.map(p => this.mapToEntity(p));
    }

    private async listLowStock(filters: ProductFiltersForRepository): Promise<Product[]> {
        const conditionsSql: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`, Prisma.sql`stock < min_stock`];

        if (filters.search) {
            conditionsSql.push(Prisma.sql`name ILIKE ${'%' + filters.search + '%'}`);
        }
        if (filters.categoryId) {
            conditionsSql.push(Prisma.sql`category_id = ${filters.categoryId}::uuid`);
        }
        if (filters.isForSale !== undefined) {
            conditionsSql.push(Prisma.sql`is_for_sale = ${filters.isForSale}`);
        }
        if (filters.status !== undefined) {
            conditionsSql.push(Prisma.sql`status = ${filters.status}`);
        }

        const whereSql = Prisma.sql`WHERE ${Prisma.join(conditionsSql, ' AND ')}`;

        const products = await this.prisma.$queryRaw<RawProduct[]>`
        SELECT * FROM products
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT ${filters.limit} OFFSET ${filters.offset}
        `;

        return products.map(p => this.mapRawToEntity(p));
    }

    async count(filters: ProductFiltersForCount): Promise<number> {
        if (filters.lowStock) {
            return this.countLowStock(filters);
        }

        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.isForSale !== undefined) {
            where.isForSale = filters.isForSale;
        }
        if (filters.status !== undefined) {
            where.status = filters.status;
        }

        return await this.prisma.product.count({ where });
    }

    private async countLowStock(filters: ProductFiltersForCount): Promise<number> {
        const conditionsSql: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`, Prisma.sql`stock < min_stock`];

        if (filters.search) {
            conditionsSql.push(Prisma.sql`name ILIKE ${'%' + filters.search + '%'}`);
        }
        if (filters.categoryId) {
            conditionsSql.push(Prisma.sql`category_id = ${filters.categoryId}::uuid`);
        }
        if (filters.isForSale !== undefined) {
            conditionsSql.push(Prisma.sql`is_for_sale = ${filters.isForSale}`);
        }
        if (filters.status !== undefined) {
            conditionsSql.push(Prisma.sql`status = ${filters.status}`);
        }

        const whereSql = Prisma.sql`WHERE ${Prisma.join(conditionsSql, ' AND ')}`;

        const result = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int as count FROM products
        ${whereSql}
        `;

        return result[0]?.count || 0;
    }

    async update(id: string, data: ProductToUpdateType): Promise<Product> {
        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                categoryId: data.categoryId,
                name: data.name,
                minStock: data.minStock,
                unitType: data.unitType as UnitType | null | undefined,
                costPrice: data.costPrice,
                isForSale: data.isForSale,
                status: data.status,
            },
        });
        return this.mapToEntity(updated);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: null },
        });
    }

    async countByCategoryId(categoryId: string): Promise<number> {
        return await this.prisma.product.count({
            where: {
                categoryId,
                deletedAt: null,
            },
        });
    }

    async updateStock(id: string, newStock: number): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
    }

    async bulkUpdateStock(updates: StockUpdate[]): Promise<void> {
        await this.prisma.$transaction(
            updates.map(({ id, newStock }) =>
                this.prisma.product.update({
                    where: { id },
                    data: { stock: newStock },
                })
            )
        );
    }

    private mapToEntity(prismaProduct: Prisma.ProductGetPayload<{}>): Product {
        return new Product({
            id: prismaProduct.id,
            categoryId: prismaProduct.categoryId,
            name: prismaProduct.name,
            stock: prismaProduct.stock.toNumber(),
            minStock: prismaProduct.minStock.toNumber(),
            unitType: prismaProduct.unitType as UnitType | null,
            costPrice: prismaProduct.costPrice.toNumber(),
            isForSale: prismaProduct.isForSale,
            status: prismaProduct.status,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
            deletedAt: prismaProduct.deletedAt,
        });
    }

    private mapRawToEntity(rawProduct: RawProduct): Product {
        return new Product({
            id: rawProduct.id,
            categoryId: rawProduct.category_id,
            name: rawProduct.name,
            stock: Number(rawProduct.stock),
            minStock: Number(rawProduct.min_stock),
            unitType: rawProduct.unit_type as UnitType | null,
            costPrice: Number(rawProduct.cost_price),
            isForSale: rawProduct.is_for_sale,
            status: rawProduct.status,
            createdAt: rawProduct.created_at,
            updatedAt: rawProduct.updated_at,
            deletedAt: rawProduct.deleted_at,
        });
    }
}