import {
    SaleToSave,
    PublicSale,
    SaleFiltersForService,
    ListOfSales,
} from '../../types/dtos/Sale.dto';
import { SaleStatus } from '../../types/enums';

export default interface ISaleService {
    createQuickSale(data: SaleToSave): Promise<PublicSale>;
    createFromOrder(orderId: string): Promise<PublicSale>;
    getById(id: string): Promise<PublicSale>;
    list(filters: SaleFiltersForService): Promise<ListOfSales>;
    updateStatus(id: string, status: SaleStatus): Promise<PublicSale>;
}
