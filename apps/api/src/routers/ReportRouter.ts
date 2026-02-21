import { Router } from 'express';
import ReportController from '../controllers/ReportController';
import IReportService from '../interfaces/IServices/IReportService';

export default function createReportRouter(reportService: IReportService): Router {
    const router = Router();
    const controller = new ReportController(reportService);

    router.get('/daily/:date', controller.getDailyReport);

    return router;
}
