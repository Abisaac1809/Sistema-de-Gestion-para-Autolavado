import { AdjustmentReason, AdjustmentType, OrderStatus } from "../enums";
import { CurrentExchangeRateInfo } from "./ExchangeRateConfig.dto";

export type DateRangeFilter = {
    fromDate: Date;
    toDate: Date;
};

export type RevenueKpis = {
    totalRevenueUsd: number;
    totalRevenueVes: number;
    salesCount: number;
    averageTicketUsd: number;
    averageTicketVes: number;
};

export type RevenueWithRate = RevenueKpis & {
    exchangeRate: CurrentExchangeRateInfo;
};

export type RevenueTotals = {
    totalRevenueUsd: number;
    totalRevenueVes: number;
    salesCount: number;
};

export type PaymentMethodAggregate = {
    paymentMethodId: string;
    totalUsd: number;
    totalVes: number;
};

export type NameLookupItem = {
    id: string;
    name: string;
};

export type RevenueBucket = 'hour' | 'day';

export type PaymentMethodBreakdownItem = {
    paymentMethodId: string;
    paymentMethodName: string;
    totalUsd: number;
    totalVes: number;
    percentage: number;
};

export type OrderStatusCount = {
    status: OrderStatus;
    count: number;
};

export type OperationsKpis = {
    ordersToday: number;
    ordersByStatus: OrderStatusCount[];
    averageServiceTimeMinutes: number | null;
};

export type TopServiceItem = {
    serviceId: string;
    serviceName: string;
    revenueUsd: number;
    quantitySold: number;
};

export type TopProductItem = {
    productId: string;
    productName: string;
    revenueUsd: number;
    quantitySold: number;
};

export type InventoryAlertItem = {
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
    deficit: number;
};

export type AdjustmentSummaryItem = {
    adjustmentType: AdjustmentType;
    reason: AdjustmentReason;
    totalQuantity: number;
    count: number;
};

export type AdjustmentTypeSummary = {
    type: string;
    total: number;
    reasons: AdjustmentSummaryItem[];
};

export type ActivityFeedItem = {
    id: string;
    type: 'order' | 'sale' | 'payment';
    description: string;
    timestamp: Date;
    amountUsd: number | null;
};

export type RevenueChartPoint = {
    timestamp: string;
    totalUsd: number;
    totalVes: number;
};

export type DashboardSummary = {
    revenue: RevenueKpis;
    operations: OperationsKpis;
    paymentBreakdown: PaymentMethodBreakdownItem[];
    exchangeRate: CurrentExchangeRateInfo;
};
