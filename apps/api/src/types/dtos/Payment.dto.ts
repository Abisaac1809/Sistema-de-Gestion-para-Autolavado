import { Currency } from '@car-wash/types';
import PaymentMethod from '../../entities/PaymentMethod';

export type {
    PaymentSumsResult,
    PaymentToSave,
    PublicPayment,
    PaymentFiltersForService,
    PaymentFiltersForRepository,
    PaymentFiltersForCount,
    ListOfPayments,
} from '@car-wash/types';

// Re-export Currency for backward compatibility (replaces local 'USD' | 'VES' union)
export { Currency };

// Internal type using entity classes — not in shared package
export type PaymentType = {
    id: string;
    orderId: string | null;
    saleId: string | null;
    paymentMethod: PaymentMethod;
    amountUsd: number;
    exchangeRate: number;
    amountVes: number;
    originalCurrency: Currency;
    paymentDate: Date;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
