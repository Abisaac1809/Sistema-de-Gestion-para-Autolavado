import { PrismaClient, Prisma } from '../generated/prisma';
import Service from '../entities/Service';
import IServiceRepository from '../interfaces/IRepositories/IServiceRepository';
import { ServiceFiltersForRepository, ServiceFiltersForCount } from '../types/dtos/Service.dto';
import { ServiceToCreateType, ServiceToUpdateType } from '../schemas/Service.schema';

export default class PrismaServiceRepository implements IServiceRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: ServiceToCreateType): Promise<Service> {
        const created = await this.prisma.service.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                price: data.price,

                status: data.status,
            },
        });
        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<Service | null> {
        const service = await this.prisma.service.findFirst({
            where: { id, deletedAt: null },
        });
        return service ? this.mapToEntity(service) : null;
    }

    async getAll(filters: ServiceFiltersForRepository): Promise<Service[]> {
        const where: Prisma.ServiceWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.status !== undefined) {
            where.status = filters.status;
        }

        const services = await this.prisma.service.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });

        return services.map(s => this.mapToEntity(s));
    }

    async update(id: string, data: ServiceToUpdateType): Promise<Service> {
        const updated = await this.prisma.service.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,

                status: data.status,
            },
        });
        return this.mapToEntity(updated);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.service.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<Service> {
        const restored = await this.prisma.service.update({
            where: { id },
            data: { deletedAt: null },
        });
        return this.mapToEntity(restored);
    }

    async getByName(name: string): Promise<Service | null> {
        const service = await this.prisma.service.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' },
            },
        });
        return service ? this.mapToEntity(service) : null;
    }

    async getBulkByIds(ids: string[]): Promise<Service[]> {
        const services = await this.prisma.service.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
        });
        return services.map(s => this.mapToEntity(s));
    }

    async count(filters: ServiceFiltersForCount): Promise<number> {
        const where: Prisma.ServiceWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.status !== undefined) {
            where.status = filters.status;
        }

        return await this.prisma.service.count({ where });
    }

    private mapToEntity(prismaService: Prisma.ServiceGetPayload<{}>): Service {
        return new Service({
            id: prismaService.id,
            name: prismaService.name,
            description: prismaService.description,
            price: prismaService.price.toNumber(),
            status: prismaService.status,
            createdAt: prismaService.createdAt,
            updatedAt: prismaService.updatedAt,
            deletedAt: prismaService.deletedAt,
        });
    }
}
