import { SaleStatus } from '@car-wash/types';
import Customer from '../../entities/Customer';
import Order from '../../entities/Order';
import SaleDetail from '../../entities/SaleDetail';
import Payment from '../../entities/Payment';

export type {
    SaleDetailType,
    PublicSaleDetail,
    SalePaymentToSave,
    SaleToSave,
    PublicSale,
    SaleFiltersForService,
    SaleFiltersForRepository,
    SaleFiltersForCount,
    ListOfSales,
} from '@car-wash/types';

// Internal type using entity classes — not in shared package
export type SaleType = {
    id: string;
    customer: Customer;
    order: Order | null;
    saleDetails: SaleDetail[];
    payments?: Payment[];
    totalUSD: number;
    totalVES: number;
    dollarRate: number;
    status: SaleStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
