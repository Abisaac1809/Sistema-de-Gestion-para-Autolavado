import type { PublicPurchaseDetail } from './PurchaseDetail.dto.js';

export type PublicPurchase = {
    id: string;
    providerName: string;
    purchaseDate: string;
    dollarRate: number;
    totalUsd: number;
    paymentMethodId: string | null;
    paymentMethodName: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    details: PublicPurchaseDetail[];
};

export type PurchaseFiltersForService = {
    search?: string;
    paymentMethodId?: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
};

export type PurchaseFiltersForRepository = {
    search?: string;
    paymentMethodId?: string;
    fromDate?: string;
    toDate?: string;
    limit: number;
    offset: number;
};

export type PurchaseFiltersForCount = {
    search?: string;
    paymentMethodId?: string;
    fromDate?: string;
    toDate?: string;
};

export type ListOfPurchases = {
    data: PublicPurchase[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
