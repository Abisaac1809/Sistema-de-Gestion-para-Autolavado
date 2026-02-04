import { PrismaClient } from '../generated/prisma';
import Category from '../entities/Category';
import ICategoryRepository from '../interfaces/IRepositories/ICategoryRepository';
import { CategoryToCreateType } from '../schemas/Category.schema';
import {
    CategoryFiltersForRepository,
    CategoryFiltersForCount,
} from '../types/dtos/Category.dto';

export default class PrismaCategoryRepository implements ICategoryRepository {
    constructor(private prisma: PrismaClient) {}

    async createCategory(data: CategoryToCreateType): Promise<Category> {
        const created = await this.prisma.productCategory.create({
            data: {
                name: data.name,
                description: data.description || null,
                status: data.status !== undefined ? data.status : true,
            },
        });
        return new Category(created);
    }

    async getCategoryById(id: string): Promise<Category | null> {
        const category = await this.prisma.productCategory.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        return category ? new Category(category) : null;
    }

    async getCategoryByName(name: string): Promise<Category | null> {
        const category = await this.prisma.productCategory.findFirst({
            where: {
                name,
                deletedAt: null,
            },
        });
        return category ? new Category(category) : null;
    }

    async getListOfCategories(filters: CategoryFiltersForRepository): Promise<Category[]> {
        const whereClause: any = {
            deletedAt: null,
        };

        // Apply status filter if provided
        if (filters.status !== undefined) {
            whereClause.status = filters.status;
        }

        // Apply search filter
        if (filters.search) {
            whereClause.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const categories = await this.prisma.productCategory.findMany({
            where: whereClause,
            skip: filters.offset,
            take: filters.limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return categories.map((c: any) => new Category(c));
    }

    async getCountOfCategories(filters: CategoryFiltersForCount): Promise<number> {
        const whereClause: any = {
            deletedAt: null,
        };

        // Apply status filter if provided
        if (filters.status !== undefined) {
            whereClause.status = filters.status;
        }

        // Apply search filter
        if (filters.search) {
            whereClause.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return await this.prisma.productCategory.count({
            where: whereClause,
        });
    }

    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        const updated = await this.prisma.productCategory.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
            },
        });
        return new Category(updated);
    }

    async softDeleteCategory(id: string): Promise<void> {
        await this.prisma.productCategory.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async restoreCategory(id: string): Promise<Category> {
        const restored = await this.prisma.productCategory.update({
            where: { id },
            data: {
                deletedAt: null,
            },
        });
        return new Category(restored);
    }
}
