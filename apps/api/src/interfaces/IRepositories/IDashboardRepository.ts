import {
    RevenueTotals,
    OrderStatusCount,
    PaymentMethodAggregate,
    NameLookupItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentSummaryItem,
    ActivityFeedItem,
    RevenueChartPoint,
    RevenueBucket,
} from '../../types/dtos/Dashboard.dto';

export default interface IDashboardRepository {
    getRevenueTotals(fromDate: Date, toDate: Date): Promise<RevenueTotals>;
    getOrderCountsByStatus(fromDate: Date, toDate: Date): Promise<OrderStatusCount[]>;
    getAverageServiceTimeMinutes(fromDate: Date, toDate: Date): Promise<number | null>;
    getPaymentsByMethod(fromDate: Date, toDate: Date): Promise<PaymentMethodAggregate[]>;
    getPaymentMethodNames(ids: string[]): Promise<NameLookupItem[]>;
    getTopServices(fromDate: Date, toDate: Date, limit: number): Promise<TopServiceItem[]>;
    getTopProducts(fromDate: Date, toDate: Date, limit: number): Promise<TopProductItem[]>;
    getInventoryAlerts(): Promise<InventoryAlertItem[]>;
    getAdjustmentGroups(fromDate: Date, toDate: Date): Promise<AdjustmentSummaryItem[]>;
    getRecentActivity(fromDate: Date, toDate: Date, limit: number): Promise<ActivityFeedItem[]>;
    getRevenueByBucket(fromDate: Date, toDate: Date, bucket: RevenueBucket): Promise<RevenueChartPoint[]>;
}
