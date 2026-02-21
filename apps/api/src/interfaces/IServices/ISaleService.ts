import {
    PublicSale,
    SaleFiltersForService,
    ListOfSales,
} from '../../types/dtos/Sale.dto';
import { SaleToCreateType } from '../../schemas/Sale.schema';
import { SaleStatus } from '../../types/enums';

export default interface ISaleService {
    createQuickSale(data: SaleToCreateType): Promise<PublicSale>;
    createFromOrder(orderId: string): Promise<PublicSale>;
    createSaleFromOrder(orderId: string): Promise<PublicSale>;
    getById(id: string): Promise<PublicSale>;
    list(filters: SaleFiltersForService): Promise<ListOfSales>;
    updateStatus(id: string, status: SaleStatus): Promise<PublicSale>;
}
