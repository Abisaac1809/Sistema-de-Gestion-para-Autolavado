import InventoryAdjustment from '../../entities/InventoryAdjustment';
import {
    InventoryAdjustmentToCreateType,
    InventoryAdjustmentFiltersForRepository,
    InventoryAdjustmentFiltersForCount,
} from '../../types/dtos/InventoryAdjustment.dto';

export default interface IInventoryAdjustmentRepository {
    create(data: InventoryAdjustmentToCreateType, stockBefore: number, stockAfter: number): Promise<InventoryAdjustment>;
    getById(id: string): Promise<InventoryAdjustment | null>;
    getAll(filters: InventoryAdjustmentFiltersForRepository): Promise<InventoryAdjustment[]>;
    count(filters: InventoryAdjustmentFiltersForCount): Promise<number>;
}
