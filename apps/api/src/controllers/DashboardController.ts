import { Request, Response, NextFunction } from 'express';
import IDashboardService from '../interfaces/IServices/IDashboardService';

type DateRange = {
    fromDate: Date;
    toDate: Date;
};

type ValidatedDateRangeQuery = {
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
};

export default class DashboardController {
    constructor(private dashboardService: IDashboardService) {}

    private getDateRange(res: Response): DateRange {
        const query: ValidatedDateRangeQuery = res.locals.validatedQuery ?? {};

        if (query.fromDate && query.toDate) {
            return { fromDate: query.fromDate, toDate: query.toDate };
        }

        const now = new Date();
        const fromDate = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
        );
        const toDate = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
        );

        return { fromDate, toDate };
    }

    getSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getSummary(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getRevenue(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getOperations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getOperations(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getPaymentBreakdown = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getPaymentBreakdown(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getTopServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const query: ValidatedDateRangeQuery = res.locals.validatedQuery ?? {};
            const limit = query.limit ?? 5;
            const result = await this.dashboardService.getTopServices(fromDate, toDate, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const query: ValidatedDateRangeQuery = res.locals.validatedQuery ?? {};
            const limit = query.limit ?? 5;
            const result = await this.dashboardService.getTopProducts(fromDate, toDate, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getInventoryAlerts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.dashboardService.getInventoryAlerts();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getAdjustmentSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getAdjustmentSummary(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getActivityFeed = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const query: ValidatedDateRangeQuery = res.locals.validatedQuery ?? {};
            const limit = query.limit ?? 10;
            const result = await this.dashboardService.getActivityFeed(fromDate, toDate, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fromDate, toDate } = this.getDateRange(res);
            const result = await this.dashboardService.getRevenueChart(fromDate, toDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
