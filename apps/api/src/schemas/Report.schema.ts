import { z } from 'zod';

export const ReportDateParam = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
});

export type ReportDateParamInput = z.infer<typeof ReportDateParam>;
