import IDashboardService from '../interfaces/IServices/IDashboardService';
import IReportService from '../interfaces/IServices/IReportService';
import { DailyReport } from '../types/dtos/Report.dto';

export default class ReportService implements IReportService {
    constructor(private dashboardService: IDashboardService) {}

    async getDailyReport(date: string): Promise<DailyReport> {
        const fromDate = new Date(date + 'T00:00:00.000Z');
        const toDate = new Date(date + 'T23:59:59.999Z');

        const [
            revenueWithRate,
            operations,
            paymentBreakdown,
            topServices,
            topProducts,
            inventoryAlerts,
            adjustmentSummary,
        ] = await Promise.all([
            this.dashboardService.getRevenue(fromDate, toDate),
            this.dashboardService.getOperations(fromDate, toDate),
            this.dashboardService.getPaymentBreakdown(fromDate, toDate),
            this.dashboardService.getTopServices(fromDate, toDate, 5),
            this.dashboardService.getTopProducts(fromDate, toDate, 5),
            this.dashboardService.getInventoryAlerts(),
            this.dashboardService.getAdjustmentSummary(fromDate, toDate),
        ]);

        const { exchangeRate, ...revenue } = revenueWithRate;

        const dailyReport: DailyReport = {
            date,
            revenue,
            operations,
            paymentBreakdown,
            topServices,
            topProducts,
            inventoryAlerts,
            adjustmentSummary,
            exchangeRate,
        };

        return dailyReport;
    }
}
