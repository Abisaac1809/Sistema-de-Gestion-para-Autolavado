import { PrismaClient, Prisma } from '../generated/prisma';
import NotificationContact from '../entities/NotificationContact';
import INotificationContactRepository from '../interfaces/IRepositories/INotificationContactRepository';
import {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersForRepository,
    NotificationContactFiltersForCount

} from '../types/dtos/NotificationContact.dto';

export default class PrismaNotificationContactRepository implements INotificationContactRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: NotificationContactToCreateType): Promise<NotificationContact> {
        const created = await this.prisma.notificationContact.create({
            data: {
                fullName: data.fullName ?? null,
                email: data.email,
                receiveReports: data.receiveReports ?? true,
                isActive: data.isActive ?? true,
            },
        });
        return this.mapToEntity(created);
    }

    async getById(id: string): Promise<NotificationContact | null> {
        const contact = await this.prisma.notificationContact.findFirst({
            where: { id, deletedAt: null },
        });
        return contact ? this.mapToEntity(contact) : null;
    }

    async getAll(filters: NotificationContactFiltersForRepository): Promise<NotificationContact[]> {
        const where: Prisma.NotificationContactWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { fullName: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        const contacts = await this.prisma.notificationContact.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });

        return contacts.map(contact => this.mapToEntity(contact));
    }

    async update(id: string, data: NotificationContactToUpdateType): Promise<NotificationContact> {
        const updated = await this.prisma.notificationContact.update({
            where: { id },
            data: {
                fullName: data.fullName,
                email: data.email,
                receiveReports: data.receiveReports,
                isActive: data.isActive,
            },
        });
        return this.mapToEntity(updated);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.notificationContact.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<NotificationContact> {
        const restored = await this.prisma.notificationContact.update({
            where: { id },
            data: { deletedAt: null },
        });
        return this.mapToEntity(restored);
    }

    async getByEmail(email: string): Promise<NotificationContact | null> {
        const contact = await this.prisma.notificationContact.findFirst({
            where: {
                email: { equals: email, mode: 'insensitive' },
            },
        });
        return contact ? this.mapToEntity(contact) : null;
    }

    async getBulkByIds(ids: string[]): Promise<NotificationContact[]> {
        const contacts = await this.prisma.notificationContact.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
        });
        return contacts.map(contact => this.mapToEntity(contact));
    }

    async count(filters: NotificationContactFiltersForCount): Promise<number> {
        const where: Prisma.NotificationContactWhereInput = {
            deletedAt: null,
        };

        if (filters.search) {
            where.OR = [
                { fullName: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        return await this.prisma.notificationContact.count({ where });
    }

    private mapToEntity(prismaContact: Prisma.NotificationContactGetPayload<{}>): NotificationContact {
        return new NotificationContact({
            id: prismaContact.id,
            fullName: prismaContact.fullName,
            email: prismaContact.email,
            receiveReports: prismaContact.receiveReports,
            isActive: prismaContact.isActive,
            createdAt: prismaContact.createdAt,
            updatedAt: prismaContact.updatedAt,
            deletedAt: prismaContact.deletedAt,
        });
    }
}
