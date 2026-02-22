import { SaleStatus } from '../enums.js';
import type { PublicCustomer } from './Customer.dto.js';
import type { SaleDetailType, PublicSaleDetail } from './SaleDetail.dto.js';
import type { PublicPayment } from './Payment.dto.js';

export type SalePaymentToSave = {
    paymentMethodId: string;
    amountUsd: number;
    exchangeRate: number;
    amountVes: number;
    originalCurrency: 'USD' | 'VES';
    notes?: string;
}

export type SaleToSave = {
    customerId: string;
    orderId?: string;
    dollarRate: number;
    totalUsd: number;
    totalVes: number;
    details: SaleDetailType[];
    payments?: SalePaymentToSave[];
}

export type PublicSale = {
    id: string;
    customerId: string;
    orderId: string | null;
    dollarRate: number;
    totalUSD: number;
    totalVES: number;
    status: SaleStatus;
    createdAt: Date;
    updatedAt: Date;
    customer: PublicCustomer;
    saleDetails: PublicSaleDetail[];
    payments?: PublicPayment[];
}

export type SaleFiltersForService = {
    search?: string;
    status?: SaleStatus;
    orderId?: string;
    fromDate?: Date;
    toDate?: Date;
    page: number;
    limit: number;
}

export type SaleFiltersForRepository = {
    search?: string;
    status?: SaleStatus;
    orderId?: string;
    fromDate?: Date;
    toDate?: Date;
    limit: number;
    offset: number;
}

export type SaleFiltersForCount = {
    search?: string;
    status?: SaleStatus;
    orderId?: string;
    fromDate?: Date;
    toDate?: Date;
}

export type ListOfSales = {
    data: PublicSale[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
}
