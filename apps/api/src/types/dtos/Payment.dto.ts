import PaymentMethod from '../../entities/PaymentMethod';
import { PublicPaymentMethod } from './PaymentMethod.dto';

export type Currency = 'USD' | 'VES';

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

export type PaymentToSave = {
    orderId?: string;
    saleId?: string;
    paymentMethodId: string;
    amountUsd: number;
    exchangeRate: number;
    amountVes: number;
    originalCurrency: Currency;
    paymentDate?: Date;
    notes?: string;
}

export type PublicPayment = {
    id: string;
    orderId: string | null;
    saleId: string | null;
    amountUsd: number;
    exchangeRate: number;
    amountVes: number;
    originalCurrency: Currency;
    paymentDate: Date;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: PublicPaymentMethod;
}

export type PaymentFiltersForService = {
    orderId?: string;
    saleId?: string;
    paymentMethodId?: string;
    fromDate?: Date;
    toDate?: Date;
    page: number;
    limit: number;
}

export type PaymentFiltersForRepository = {
    orderId?: string;
    saleId?: string;
    paymentMethodId?: string;
    fromDate?: Date;
    toDate?: Date;
    limit: number;
    offset: number;
}

export type PaymentFiltersForCount = {
    orderId?: string;
    saleId?: string;
    paymentMethodId?: string;
    fromDate?: Date;
    toDate?: Date;
}

export type ListOfPayments = {
    data: PublicPayment[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
}
