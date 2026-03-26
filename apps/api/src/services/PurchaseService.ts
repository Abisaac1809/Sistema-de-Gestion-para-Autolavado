import IPurchaseService from '../interfaces/IServices/IPurchaseService';
import IPurchaseRepository from '../interfaces/IRepositories/IPurchaseRepository';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import { PurchaseToCreateType } from '@car-wash/types';
import {
    PublicPurchase,
    ListOfPurchases,
    PurchaseFiltersForService,
} from '../types/dtos/Purchase.dto';
import PurchaseMapper from '../mappers/PurchaseMapper';
import { ProductNotFoundError, PurchaseNotFoundError } from '../errors/BusinessErrors';

export default class PurchaseService implements IPurchaseService {
    constructor(
        private purchaseRepository: IPurchaseRepository,
        private productRepository: IProductRepository,
    ) {}

    async create(data: PurchaseToCreateType): Promise<PublicPurchase> {
        const productIds = data.details.map((d) => d.productId);
        const foundProducts = await this.productRepository.getByIds(productIds);

        const foundIds = new Set(foundProducts.map((p) => p.id));
        const missingId = productIds.find((id) => !foundIds.has(id));
        if (missingId) {
            throw new ProductNotFoundError(`Product ${missingId} not found`);
        }

        const totalUsd = data.details.reduce(
            (sum, detail) => sum + detail.quantity * detail.unitCostUsd,
            0,
        );

        const purchase = await this.purchaseRepository.create({ ...data, totalUsd });
        return PurchaseMapper.toPublic(purchase);
    }

    async getById(id: string): Promise<PublicPurchase> {
        const purchase = await this.purchaseRepository.getById(id);
        if (!purchase) {
            throw new PurchaseNotFoundError(`Purchase ${id} not found`);
        }
        return PurchaseMapper.toPublic(purchase);
    }

    async getMany(filters: PurchaseFiltersForService): Promise<ListOfPurchases> {
        const offset = (filters.page - 1) * filters.limit;

        const repoFilters = {
            search: filters.search,
            paymentMethodId: filters.paymentMethodId,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            limit: filters.limit,
            offset,
        };

        const countFilters = {
            search: filters.search,
            paymentMethodId: filters.paymentMethodId,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
        };

        const [purchases, totalRecords] = await Promise.all([
            this.purchaseRepository.getMany(repoFilters),
            this.purchaseRepository.count(countFilters),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: purchases.map((p) => PurchaseMapper.toPublic(p)),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async softDelete(id: string): Promise<void> {
        const purchase = await this.purchaseRepository.getById(id);
        if (!purchase) {
            throw new PurchaseNotFoundError(`Purchase ${id} not found`);
        }
        await this.purchaseRepository.softDelete(id);
    }
}
