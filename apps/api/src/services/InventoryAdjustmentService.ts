import IInventoryAdjustmentService from '../interfaces/IServices/IInventoryAdjustmentService';
import IInventoryAdjustmentRepository from '../interfaces/IRepositories/IInventoryAdjustmentRepository';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import { InventoryAdjustmentToCreateType, PublicInventoryAdjustment } from '../types/dtos/InventoryAdjustment.dto';
import {
    ListOfInventoryAdjustments,
    InventoryAdjustmentFiltersForService,
    InventoryAdjustmentFiltersForRepository,
    InventoryAdjustmentFiltersForCount,
} from '../types/dtos/InventoryAdjustment.dto';
import { AdjustmentType } from '../types/enums';
import {
    ProductNotFoundError,
    InventoryAdjustmentNotFoundError,
    InsufficientAdjustmentStockError,
} from '../errors/BusinessErrors';
import InventoryAdjustmentMapper from '../mappers/InventoryAdjustmentMapper';

export default class InventoryAdjustmentService implements IInventoryAdjustmentService {
    constructor(
        private inventoryAdjustmentRepository: IInventoryAdjustmentRepository,
        private productRepository: IProductRepository
    ) {}

    async create(data: InventoryAdjustmentToCreateType): Promise<PublicInventoryAdjustment> {
        const product = await this.productRepository.get(data.productId);

        if (!product) {
            throw new ProductNotFoundError(`Product ${data.productId} not found`);
        }

        const stockBefore = product.stock;
        let stockAfter: number;

        if (data.adjustmentType === AdjustmentType.IN) {
            stockAfter = stockBefore + data.quantity;
        } else {
            stockAfter = stockBefore - data.quantity;
        }

        if (stockAfter < 0) {
            throw new InsufficientAdjustmentStockError(
                'Insufficient stock: cannot reduce stock below zero'
            );
        }

        const adjustment = await this.inventoryAdjustmentRepository.create(
            data,
            stockBefore,
            stockAfter
        );

        return InventoryAdjustmentMapper.toPublic(adjustment);
    }

    async getById(id: string): Promise<PublicInventoryAdjustment> {
        const adjustment = await this.inventoryAdjustmentRepository.getById(id);

        if (!adjustment) {
            throw new InventoryAdjustmentNotFoundError(
                `Inventory adjustment ${id} not found`
            );
        }

        return InventoryAdjustmentMapper.toPublic(adjustment);
    }

    async getAll(filters: InventoryAdjustmentFiltersForService): Promise<ListOfInventoryAdjustments> {
        const offset = (filters.page - 1) * filters.limit;

        const repoFilters: InventoryAdjustmentFiltersForRepository = {
            search: filters.search,
            productId: filters.productId,
            type: filters.type,
            reason: filters.reason,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            limit: filters.limit,
            offset,
        };

        const countFilters: InventoryAdjustmentFiltersForCount = {
            search: filters.search,
            productId: filters.productId,
            type: filters.type,
            reason: filters.reason,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
        };

        const [adjustments, totalRecords] = await Promise.all([
            this.inventoryAdjustmentRepository.getAll(repoFilters),
            this.inventoryAdjustmentRepository.count(countFilters),
        ]);

        const data = InventoryAdjustmentMapper.toPublicList(adjustments);

        return {
            data,
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages: Math.ceil(totalRecords / filters.limit),
            },
        };
    }
}
