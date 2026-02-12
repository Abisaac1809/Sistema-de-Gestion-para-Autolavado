import { OrderStatus, PaymentStatus } from '../enums';
import { OrderToCreateType, OrderToUpdateType, OrderStatusChangeType, OrderFiltersType } from '../../schemas/Order.schema';
import { PublicOrderDetail } from './OrderDetail.dto';
import { PublicCustomer } from './Customer.dto';
import Customer from '../../entities/Customer';
import OrderDetail from '../../entities/OrderDetail';

export type { OrderToCreateType, OrderToUpdateType, OrderStatusChangeType, OrderFiltersType };

export type OrderItemSummary = {
    type: 'product' | 'service';
    name: string;
    quantity: number;
}

export type OrderSummary = {
    id: string;
    status: OrderStatus;
    totalEstimated: number;
    createdAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    vehicleModel: string;
    vehiclePlate: string | null;
    customerName: string;
    customerDocument: string | null;
    customerPhone: string | null;
    items: OrderItemSummary[];
}

export type OrderType = {
    id: string;
    customer: Customer;
    orderDetails: OrderDetail[];
    vehiclePlate: string | null;
    vehicleModel: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalEstimated: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type OrderToSave = {
    customerId: string;
    vehiclePlate: string | null;
    vehicleModel: string;
    totalEstimated: number;
}

export type PublicOrder = {
    id: string;
    customerId: string;
    vehiclePlate: string | null;
    vehicleModel: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalEstimated: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    customer: PublicCustomer;
    orderDetails: PublicOrderDetail[];
    durations: {
        pendingMinutes: number | null;
        inProgressMinutes: number | null;
        totalMinutes: number | null;
    };
}

export type PublicOrderListItem = {
    id: string;
    status: OrderStatus;
    totalEstimated: number;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    vehiclePlate: string | null;
    vehicleModel: string;
    timeInCurrentStateMinutes: number;
    customer: PublicCustomer;
    orderDetails: PublicOrderDetail[];
}

export type OrderFiltersForService = OrderFiltersType;

export type OrderFiltersForRepository = {
    search?: string;
    status?: OrderStatus;
    fromDate?: Date;
    toDate?: Date;
    limit: number;
    offset: number;
}

export type OrderFiltersForCount = {
    search?: string;
    status?: OrderStatus;
    fromDate?: Date;
    toDate?: Date;
}

export type ListOfOrders = {
    data: OrderSummary[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
}
