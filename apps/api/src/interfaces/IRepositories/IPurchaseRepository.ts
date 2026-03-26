import Purchase from '../../entities/Purchase';
import { PurchaseFiltersForRepository, PurchaseFiltersForCount } from '../../types/dtos/Purchase.dto';
import { PurchaseToCreateType } from '@car-wash/types';

export default interface IPurchaseRepository {
    getById(id: string): Promise<Purchase | null>;
    getMany(filters: PurchaseFiltersForRepository): Promise<Purchase[]>;
    count(filters: PurchaseFiltersForCount): Promise<number>;
    create(data: PurchaseToCreateType & { totalUsd: number }): Promise<Purchase>;
    softDelete(id: string): Promise<void>;
}
