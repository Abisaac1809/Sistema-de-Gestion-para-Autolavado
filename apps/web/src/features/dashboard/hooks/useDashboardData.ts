import { useQuery } from "@tanstack/react-query";
import type {
  RevenueWithRate,
  OperationsKpis,
  PaymentMethodBreakdownItem,
  TopServiceItem,
  TopProductItem,
  InventoryAlertItem,
  ActivityFeedItem,
  RevenueChartPoint,
} from "@car-wash/types";
import {
  getRevenue,
  getOperations,
  getPaymentBreakdown,
  getTopServices,
  getTopProducts,
  getInventoryAlerts,
  getActivityFeed,
  getRevenueChart,
} from "../services/dashboardService";
import type { DateRangeParams } from "../services/dashboardService";

export function useDashboardData(dateParams: DateRangeParams) {
  const revenueQuery = useQuery<RevenueWithRate>({
    queryKey: ["dashboard", "revenue", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getRevenue(dateParams),
  });

  const operationsQuery = useQuery<OperationsKpis>({
    queryKey: ["dashboard", "operations", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getOperations(dateParams),
  });

  const breakdownQuery = useQuery<PaymentMethodBreakdownItem[]>({
    queryKey: ["dashboard", "payment-breakdown", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getPaymentBreakdown(dateParams),
  });

  const topServicesQuery = useQuery<TopServiceItem[]>({
    queryKey: ["dashboard", "top-services", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getTopServices(dateParams),
  });

  const topProductsQuery = useQuery<TopProductItem[]>({
    queryKey: ["dashboard", "top-products", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getTopProducts(dateParams),
  });

  const inventoryAlertsQuery = useQuery<InventoryAlertItem[]>({
    queryKey: ["dashboard", "inventory-alerts"],
    queryFn: getInventoryAlerts,
  });

  const activityQuery = useQuery<ActivityFeedItem[]>({
    queryKey: ["dashboard", "activity", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getActivityFeed(dateParams),
  });

  const chartQuery = useQuery<RevenueChartPoint[]>({
    queryKey: ["dashboard", "chart-revenue", dateParams.fromDate, dateParams.toDate],
    queryFn: () => getRevenueChart(dateParams),
  });

  return {
    revenue: revenueQuery.data ?? null,
    operations: operationsQuery.data ?? null,
    breakdown: breakdownQuery.data ?? [],
    topServices: topServicesQuery.data ?? [],
    topProducts: topProductsQuery.data ?? [],
    inventoryAlerts: inventoryAlertsQuery.data ?? [],
    activity: activityQuery.data ?? [],
    chartData: chartQuery.data ?? [],
    isLoadingRevenue: revenueQuery.isLoading,
    isLoadingOperations: operationsQuery.isLoading,
    isLoadingBreakdown: breakdownQuery.isLoading,
    isLoadingTopServices: topServicesQuery.isLoading,
    isLoadingTopProducts: topProductsQuery.isLoading,
    isLoadingAlerts: inventoryAlertsQuery.isLoading,
    isLoadingActivity: activityQuery.isLoading,
    isLoadingChart: chartQuery.isLoading,
  };
}
