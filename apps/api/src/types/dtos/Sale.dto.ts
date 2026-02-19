import { SaleStatus, PaymentStatus } from '../enums';
import { PublicCustomer } from './Customer.dto';
import { SaleDetailType, PublicSaleDetail } from './SaleDetail.dto';
import { PublicPayment } from './Payment.dto';
import Customer from '../../entities/Customer';
import Order from '../../entities/Order';
import SaleDetail from '../../entities/SaleDetail';
import Payment from '../../entities/Payment';

export type { SaleDetailType, PublicSaleDetail };

export type SaleType = {
    id: string;
    customer: Customer;
    order: Order | null;
    saleDetails: SaleDetail[];
    payments?: Payment[];
    totalUSD: number;
    totalVES: number;
    dollarRate: number;
    totalPaidUSD: number;
    totalPaidVES: number;
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
    totalUsd: number;
    totalVes: number;
    details: SaleDetailType[];
}

export type PublicSale = {
    id: string;
    customerId: string;
    orderId: string | null;
    dollarRate: number;
    totalUSD: number;
    totalVES: number;
    totalPaidUSD: number;
    totalPaidVES: number;
    status: SaleStatus;
    paymentStatus: PaymentStatus;
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
