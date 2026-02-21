import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';
import IDashboardService from '../interfaces/IServices/IDashboardService';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import {
    DashboardFilters,
    TopItemsFilters,
    ActivityFeedFilters,
    ChartFilters,
} from '../schemas/Dashboard.schema';

export default function createDashboardRouter(dashboardService: IDashboardService): Router {
    const router = Router();
    const controller = new DashboardController(dashboardService);

    router.get('/summary', validateQueryParams(DashboardFilters), controller.getSummary);
    router.get('/revenue', validateQueryParams(DashboardFilters), controller.getRevenue);
    router.get('/operations', validateQueryParams(DashboardFilters), controller.getOperations);
    router.get('/payment-breakdown', validateQueryParams(DashboardFilters), controller.getPaymentBreakdown);
    router.get('/top-services', validateQueryParams(TopItemsFilters), controller.getTopServices);
    router.get('/top-products', validateQueryParams(TopItemsFilters), controller.getTopProducts);
    router.get('/inventory-alerts', controller.getInventoryAlerts);
    router.get('/adjustment-summary', validateQueryParams(DashboardFilters), controller.getAdjustmentSummary);
    router.get('/activity', validateQueryParams(ActivityFeedFilters), controller.getActivityFeed);
    router.get('/chart/revenue', validateQueryParams(ChartFilters), controller.getRevenueChart);

    return router;
}
