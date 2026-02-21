import {
    DashboardSummary,
    RevenueWithRate,
    OperationsKpis,
    PaymentMethodBreakdownItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentTypeSummary,
    ActivityFeedItem,
    RevenueChartPoint,
} from '../../types/dtos/Dashboard.dto';

export default interface IDashboardService {
    getSummary(fromDate: Date, toDate: Date): Promise<DashboardSummary>;
    getRevenue(fromDate: Date, toDate: Date): Promise<RevenueWithRate>;
    getOperations(fromDate: Date, toDate: Date): Promise<OperationsKpis>;
    getPaymentBreakdown(fromDate: Date, toDate: Date): Promise<PaymentMethodBreakdownItem[]>;
    getTopServices(fromDate: Date, toDate: Date, limit: number): Promise<TopServiceItem[]>;
    getTopProducts(fromDate: Date, toDate: Date, limit: number): Promise<TopProductItem[]>;
    getInventoryAlerts(): Promise<InventoryAlertItem[]>;
    getAdjustmentSummary(fromDate: Date, toDate: Date): Promise<AdjustmentTypeSummary[]>;
    getActivityFeed(fromDate: Date, toDate: Date, limit: number): Promise<ActivityFeedItem[]>;
    getRevenueChart(fromDate: Date, toDate: Date): Promise<RevenueChartPoint[]>;
}
