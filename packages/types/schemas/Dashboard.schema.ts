import { z } from 'zod';

export const DashboardFilters = z.object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
});

export type DashboardFiltersInput = z.infer<typeof DashboardFilters>;

export const TopItemsFilters = DashboardFilters.extend({
    limit: z.coerce.number().int().min(1).max(50).default(5),
});

export type TopItemsFiltersInput = z.infer<typeof TopItemsFilters>;

export const ActivityFeedFilters = DashboardFilters.extend({
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ActivityFeedFiltersInput = z.infer<typeof ActivityFeedFilters>;

export const ChartFilters = DashboardFilters;

export type ChartFiltersInput = z.infer<typeof ChartFilters>;
