import { Currency } from "../enums";

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

export interface PublicPaymentMethod {
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
}

export type PaymentMethodFiltersForService = {
    search?: string;
    currency?: Currency;
    isActive?: boolean;
    page: number;
    limit: number;
};

export type PaymentMethodFiltersForRepository = {
    search?: string;
    currency?: Currency;
    isActive?: boolean;
    limit: number;
    offset: number;
};

export type PaymentMethodFiltersForCount = {
    search?: string;
    currency?: Currency;
    isActive?: boolean;
};

export type ListOfPaymentMethods = {
    data: PublicPaymentMethod[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
