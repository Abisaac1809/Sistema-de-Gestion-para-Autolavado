import { SaleStatus, PaymentStatus } from '../enums';
import { PublicCustomer } from './Customer.dto';
import { SaleDetailType, PublicSaleDetail } from './SaleDetail.dto';
import Customer from '../../entities/Customer';
import Order from '../../entities/Order';
import SaleDetail from '../../entities/SaleDetail';

export type { SaleDetailType, PublicSaleDetail };

export type SaleType = {
    id: string;
    customer: Customer;
    order: Order | null;
    saleDetails: SaleDetail[];
    total: number;
    dollarRate: number;
    status: SaleStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type SaleToSave = {
    customerId: string;
    orderId?: string;
    dollarRate: number;
    details: SaleDetailType[];
}

export type PublicSale = {
    id: string;
    customerId: string;
    orderId: string | null;
    total: number;
    dollarRate: number;
    status: SaleStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    customer: PublicCustomer;
    saleDetails: PublicSaleDetail[];
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
