import IDashboardRepository from '../interfaces/IRepositories/IDashboardRepository';
import IDashboardService from '../interfaces/IServices/IDashboardService';
import IExchangeRateService from '../interfaces/IServices/IExchangeRateService';
import {
    DashboardSummary,
    RevenueWithRate,
    OperationsKpis,
    PaymentMethodBreakdownItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentTypeSummary,
    AdjustmentSummaryItem,
    ActivityFeedItem,
    RevenueChartPoint,
    RevenueBucket,
} from '../types/dtos/Dashboard.dto';

export default class DashboardService implements IDashboardService {
    private dashboardRepository: IDashboardRepository;
    private exchangeRateService: IExchangeRateService;

    constructor(
        dashboardRepository: IDashboardRepository,
        exchangeRateService: IExchangeRateService,
    ) {
        this.dashboardRepository = dashboardRepository;
        this.exchangeRateService = exchangeRateService;
    }

    async getRevenue(fromDate: Date, toDate: Date): Promise<RevenueWithRate> {
        const totals = await this.dashboardRepository.getRevenueTotals(fromDate, toDate);
        const exchangeRate = await this.exchangeRateService.getCurrentExchangeRateInfo();

        const averageTicketUsd = totals.salesCount > 0
            ? totals.totalRevenueUsd / totals.salesCount : 0;
        const averageTicketVes = totals.salesCount > 0
            ? totals.totalRevenueVes / totals.salesCount : 0;

        return {
            ...totals,
            averageTicketUsd,
            averageTicketVes,
            exchangeRate,
        };
    }

    async getOperations(fromDate: Date, toDate: Date): Promise<OperationsKpis> {
        const [ordersByStatus, averageServiceTimeMinutes] = await Promise.all([
            this.dashboardRepository.getOrderCountsByStatus(fromDate, toDate),
            this.dashboardRepository.getAverageServiceTimeMinutes(fromDate, toDate),
        ]);

        const ordersToday = ordersByStatus.reduce((sum, orderStatusSummary) => sum + orderStatusSummary.count, 0);

        return {
            ordersToday,
            ordersByStatus,
            averageServiceTimeMinutes,
        };
    }

    async getPaymentBreakdown(
        fromDate: Date,
        toDate: Date,
    ): Promise<PaymentMethodBreakdownItem[]> {
        const aggregates = await this.dashboardRepository.getPaymentsByMethod(fromDate, toDate);
        const methodIds = aggregates.map((a) => a.paymentMethodId);
        const methodNames = await this.dashboardRepository.getPaymentMethodNames(methodIds);
        const nameMap = new Map(methodNames.map((m) => [m.id, m.name]));

        const grandTotalUsd = aggregates.reduce((sum, a) => sum + a.totalUsd, 0);

        const breakdown: PaymentMethodBreakdownItem[] = aggregates.map((a) => ({
            paymentMethodId: a.paymentMethodId,
            paymentMethodName: nameMap.get(a.paymentMethodId) ?? 'Unknown',
            totalUsd: a.totalUsd,
            totalVes: a.totalVes,
            percentage: grandTotalUsd > 0 ? (a.totalUsd / grandTotalUsd) * 100 : 0,
        }));

        return breakdown.sort((a, b) => b.totalUsd - a.totalUsd);
    }

    async getSummary(fromDate: Date, toDate: Date): Promise<DashboardSummary> {
        const [revenueWithRate, operations, paymentBreakdown] = await Promise.all([
            this.getRevenue(fromDate, toDate),
            this.getOperations(fromDate, toDate),
            this.getPaymentBreakdown(fromDate, toDate),
        ]);

        const { exchangeRate, ...revenue } = revenueWithRate;

        return {
            revenue,
            operations,
            paymentBreakdown,
            exchangeRate,
        };
    }

    async getTopServices(
        fromDate: Date,
        toDate: Date,
        limit: number,
    ): Promise<TopServiceItem[]> {
        return this.dashboardRepository.getTopServices(fromDate, toDate, limit);
    }

    async getTopProducts(
        fromDate: Date,
        toDate: Date,
        limit: number,
    ): Promise<TopProductItem[]> {
        return this.dashboardRepository.getTopProducts(fromDate, toDate, limit);
    }

    async getInventoryAlerts(): Promise<InventoryAlertItem[]> {
        return this.dashboardRepository.getInventoryAlerts();
    }

    async getAdjustmentSummary(
        fromDate: Date,
        toDate: Date,
    ): Promise<AdjustmentTypeSummary[]> {
        const adjustmentGroups = await this.dashboardRepository.getAdjustmentGroups(fromDate, toDate);

        const grouped = new Map<string, AdjustmentSummaryItem[]>();

        for (const item of adjustmentGroups) {
            const type = item.adjustmentType;
            if (!grouped.has(type)) {
                grouped.set(type, []);
            }
            grouped.get(type)!.push(item);
        }

        const result: AdjustmentTypeSummary[] = [];

        for (const [type, reasons] of grouped.entries()) {
            const total = reasons.reduce((sum, item) => sum + item.totalQuantity, 0);
            result.push({ type, total, reasons });
        }

        return result;
    }

    async getActivityFeed(
        fromDate: Date,
        toDate: Date,
        limit: number,
    ): Promise<ActivityFeedItem[]> {
        return this.dashboardRepository.getRecentActivity(fromDate, toDate, limit);
    }

    async getRevenueChart(fromDate: Date, toDate: Date): Promise<RevenueChartPoint[]> {
        const isOneDay = toDate.getTime() - fromDate.getTime() <= 86400000;
        const bucket: RevenueBucket = isOneDay ? 'hour' : 'day';

        return this.dashboardRepository.getRevenueByBucket(fromDate, toDate, bucket);
    }
}
