import { Currency } from '@car-wash/types';

export type {
    PaymentMethodToCreateType,
    PaymentMethodToUpdateType,
    PaymentMethodFiltersType,
    PublicPaymentMethod,
    PaymentMethodFiltersForService,
    PaymentMethodFiltersForRepository,
    PaymentMethodFiltersForCount,
    ListOfPaymentMethods,
} from '@car-wash/types';

// Internal type used by PaymentMethod entity — not in shared package
export interface PaymentMethodType {
    id: string;
    name: string;
    description: string | null;
    currency: Currency | null;
    bankName: string | null;
    accountHolder: string | null;
    accountNumber: string | null;
    idCard: string | null;
    phoneNumber: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | undefined;
}
