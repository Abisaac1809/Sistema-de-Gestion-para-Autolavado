import { Currency } from '../enums.js';
import type { PublicPaymentMethod } from './PaymentMethod.dto.js';

export type PaymentSumsResult = {
    usd: number;
    ves: number;
};

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
