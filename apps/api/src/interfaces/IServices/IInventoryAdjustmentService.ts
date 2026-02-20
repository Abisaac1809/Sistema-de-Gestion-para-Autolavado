import { InventoryAdjustmentToCreateType, PublicInventoryAdjustment } from '../../types/dtos/InventoryAdjustment.dto';
import {
    ListOfInventoryAdjustments,
    InventoryAdjustmentFiltersForService,
} from '../../types/dtos/InventoryAdjustment.dto';

export default interface IInventoryAdjustmentService {
    create(data: InventoryAdjustmentToCreateType): Promise<PublicInventoryAdjustment>;
    getById(id: string): Promise<PublicInventoryAdjustment>;
    getAll(filters: InventoryAdjustmentFiltersForService): Promise<ListOfInventoryAdjustments>;
}
