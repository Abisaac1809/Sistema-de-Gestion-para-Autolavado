import { Request, Response, NextFunction } from 'express';
import IReportService from '../interfaces/IServices/IReportService';
import { ReportDateParam } from '../schemas/Report.schema';

export default class ReportController {
    constructor(private reportService: IReportService) {}

    getDailyReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = ReportDateParam.safeParse({ date: req.params.date });
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.issues[0].message });
                return;
            }
            const result = await this.reportService.getDailyReport(parsed.data.date);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
