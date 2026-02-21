import { PrismaClient, Prisma } from '../generated/prisma';
import StoreInfo from '../entities/StoreInfo';
import IStoreInfoRepository from '../interfaces/IRepositories/IStoreInfoRepository';
import { StoreInfoToUpdateType } from '../types/dtos/StoreInfo.dto';
import { StoreInfoNotFoundError } from '../errors/BusinessErrors';

export default class PrismaStoreInfoRepository implements IStoreInfoRepository {
    constructor(private prisma: PrismaClient) {}

    async getStoreInfo(): Promise<StoreInfo> {
        const storeInfo = await this.prisma.storeInfo.findFirst({
            where: { deletedAt: null },
        });
        if (!storeInfo) throw new StoreInfoNotFoundError('Store info not found');
        return this.mapToEntity(storeInfo);
    }

    async updateStoreInfo(data: StoreInfoToUpdateType): Promise<StoreInfo> {
        const existing = await this.prisma.storeInfo.findFirst({
            where: { deletedAt: null },
        });
        if (!existing) throw new StoreInfoNotFoundError('Store info not found');

        const updated = await this.prisma.storeInfo.update({
            where: { id: existing.id },
            data: {
                name: data.name,
                rif: data.rif,
                address: data.address,
                phone: data.phone,
                logoUrl: data.logoUrl,
            },
        });
        return this.mapToEntity(updated);
    }

    private mapToEntity(data: Prisma.StoreInfoGetPayload<object>): StoreInfo {
        return new StoreInfo({
            id: data.id,
            logoUrl: data.logoUrl ?? null,
            name: data.name,
            rif: data.rif,
            address: data.address,
            phone: data.phone,
            updatedAt: data.updatedAt,
        });
    }
}
