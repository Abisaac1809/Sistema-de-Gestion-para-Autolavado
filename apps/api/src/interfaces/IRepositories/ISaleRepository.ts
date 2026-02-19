import Sale from '../../entities/Sale';
import { SaleToSave } from '../../types/dtos/Sale.dto';
import { SaleFiltersForRepository, SaleFiltersForCount } from '../../types/dtos/Sale.dto';
import { SaleStatus, PaymentStatus } from '../../types/enums';

export default interface ISaleRepository {
    create(data: SaleToSave): Promise<Sale>;
    getById(id: string): Promise<Sale | null>;
    list(filters: SaleFiltersForRepository): Promise<Sale[]>;
    count(filters: SaleFiltersForCount): Promise<number>;
    updateStatus(id: string, status: SaleStatus): Promise<Sale>;
    updatePaymentStatus(id: string, status: PaymentStatus): Promise<Sale>;
}
