import { PrismaClient, Prisma } from "../generated/prisma";
import Customer from "../entities/Customer";
import { ICustomerRepository } from "../interfaces/IRepositories/ICustomerRepository";
import {
    CustomerToCreateType,
    CustomerToUpdateType,
    CustomerFiltersForRepository,
    CustomerFiltersForCount
} from "../types/dtos/Customer.dto";

export default class PrismaCustomerRepository implements ICustomerRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: CustomerToCreateType): Promise<Customer> {
        const created = await this.prisma.customer.create({
            data: {
                fullName: data.fullName,
                idNumber: data.idNumber,
                phone: data.phone,
            },
        });
        return this.mapToEntity(created);
    }

    async update(id: string, data: CustomerToUpdateType): Promise<Customer> {
        const updated = await this.prisma.customer.update({
            where: { id },
            data: {
                fullName: data.fullName,
                idNumber: data.idNumber,
                phone: data.phone,
            },
        });
        return this.mapToEntity(updated);
    }

    async getById(id: string): Promise<Customer | null> {
        const customer = await this.prisma.customer.findFirst({
            where: { id, deletedAt: null },
        });
        return customer ? this.mapToEntity(customer) : null;
    }

    async getByIdNumber(idNumber: string, includeDeleted: boolean = false): Promise<Customer | null> {
        const where: Prisma.CustomerWhereInput = { idNumber };
        if (!includeDeleted) {
            where.deletedAt = null;
        }

        const customer = await this.prisma.customer.findFirst({
            where,
        });
        return customer ? this.mapToEntity(customer) : null;
    }

    async getList(filters: CustomerFiltersForRepository): Promise<Customer[]> {
        const where: Prisma.CustomerWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { fullName: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { idNumber: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.idNumber) {
            where.idNumber = { contains: filters.idNumber, mode: 'insensitive' };
        }

        const customers = await this.prisma.customer.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });

        return customers.map(c => this.mapToEntity(c));
    }

    async count(filters: CustomerFiltersForCount): Promise<number> {
        const where: Prisma.CustomerWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { fullName: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { idNumber: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.idNumber) {
            where.idNumber = { contains: filters.idNumber, mode: 'insensitive' };
        }

        return await this.prisma.customer.count({ where });
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.customer.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<Customer> {
        const restored = await this.prisma.customer.update({
            where: { id },
            data: { deletedAt: null },
        });
        return this.mapToEntity(restored);
    }

    async getBulkByIds(ids: string[]): Promise<Customer[]> {
        const results = await this.prisma.customer.findMany({
            where: { id: { in: ids }, deletedAt: null },
        });
        return results.map((r) => this.mapToEntity(r));
    }

    private mapToEntity(data: Prisma.CustomerGetPayload<{}>): Customer {
        return new Customer({
            id: data.id,
            fullName: data.fullName,
            idNumber: data.idNumber,
            phone: data.phone,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}
