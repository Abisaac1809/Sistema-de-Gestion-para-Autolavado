import { DailyReport } from '../../types/dtos/Report.dto';

export default interface IReportService {
    getDailyReport(date: string): Promise<DailyReport>;
}
