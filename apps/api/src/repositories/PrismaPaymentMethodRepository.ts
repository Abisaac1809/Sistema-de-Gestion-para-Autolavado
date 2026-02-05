import { PrismaClient, Prisma } from '../generated/prisma';
import PaymentMethod from '../entities/PaymentMethod';
import IPaymentMethodRepository from '../interfaces/IRepositories/IPaymentMethodRepository';
import { PaymentMethodFiltersForRepository, PaymentMethodFiltersForCount } from '../types/dtos/PaymentMethod.dto';
import { PaymentMethodToCreateType, PaymentMethodToUpdateType } from '../schemas/PaymentMethod.schema';
import { Currency } from '../types/enums';

export default class PrismaPaymentMethodRepository implements IPaymentMethodRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: PaymentMethodToCreateType): Promise<PaymentMethod> {
        const created = await this.prisma.paymentMethod.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                currency: data.currency ?? null,
                bankName: data.bankName ?? null,
                accountHolder: data.accountHolder ?? null,
                accountNumber: data.accountNumber ?? null,
                idCard: data.idCard ?? null,
                phoneNumber: data.phoneNumber ?? null,
                email: data.email ?? null,
                isActive: data.isActive ?? true,
            },
        });
        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<PaymentMethod | null> {
        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: { id, deletedAt: null },
        });
        return paymentMethod ? this.mapToEntity(paymentMethod) : null;
    }

    async getAll(filters: PaymentMethodFiltersForRepository): Promise<PaymentMethod[]> {
        const where: Prisma.PaymentMethodWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.currency !== undefined) {
            where.currency = filters.currency;
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        const paymentMethods = await this.prisma.paymentMethod.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });

        return paymentMethods.map(pm => this.mapToEntity(pm));
    }

    async update(id: string, data: PaymentMethodToUpdateType): Promise<PaymentMethod> {
        const updated = await this.prisma.paymentMethod.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                currency: data.currency,
                bankName: data.bankName,
                accountHolder: data.accountHolder,
                accountNumber: data.accountNumber,
                idCard: data.idCard,
                phoneNumber: data.phoneNumber,
                email: data.email,
                isActive: data.isActive,
            },
        });
        return this.mapToEntity(updated);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.paymentMethod.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<PaymentMethod> {
        const restored = await this.prisma.paymentMethod.update({
            where: { id },
            data: { deletedAt: null },
        });
        return this.mapToEntity(restored);
    }

    async getByName(name: string): Promise<PaymentMethod | null> {
        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' },
            },
        });
        return paymentMethod ? this.mapToEntity(paymentMethod) : null;
    }

    async getBulkByIds(ids: string[]): Promise<PaymentMethod[]> {
        const paymentMethods = await this.prisma.paymentMethod.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
        });
        return paymentMethods.map(pm => this.mapToEntity(pm));
    }

    async count(filters: PaymentMethodFiltersForCount): Promise<number> {
        const where: Prisma.PaymentMethodWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.currency !== undefined) {
            where.currency = filters.currency;
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        return await this.prisma.paymentMethod.count({ where });
    }

    private mapToEntity(prismaPaymentMethod: Prisma.PaymentMethodGetPayload<{}>): PaymentMethod {
        return new PaymentMethod({
            id: prismaPaymentMethod.id,
            name: prismaPaymentMethod.name,
            description: prismaPaymentMethod.description,
            currency: prismaPaymentMethod.currency as Currency | null,
            bankName: prismaPaymentMethod.bankName,
            accountHolder: prismaPaymentMethod.accountHolder,
            accountNumber: prismaPaymentMethod.accountNumber,
            idCard: prismaPaymentMethod.idCard,
            phoneNumber: prismaPaymentMethod.phoneNumber,
            email: prismaPaymentMethod.email,
            isActive: prismaPaymentMethod.isActive,
            createdAt: prismaPaymentMethod.createdAt,
            updatedAt: prismaPaymentMethod.updatedAt,
            deletedAt: prismaPaymentMethod.deletedAt,
        });
    }
}
