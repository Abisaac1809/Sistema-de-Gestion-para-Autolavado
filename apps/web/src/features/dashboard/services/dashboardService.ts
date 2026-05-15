import type {
  RevenueWithRate,
  OperationsKpis,
  PaymentMethodBreakdownItem,
  TopServiceItem,
  TopProductItem,
  InventoryAlertItem,
  AdjustmentTypeSummary,
  ActivityFeedItem,
  RevenueChartPoint,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export type DateRangeParams = { fromDate: string; toDate: string };

export async function getRevenue(params: DateRangeParams): Promise<RevenueWithRate> {
  const { data } = await api.get<RevenueWithRate>("/api/dashboard/revenue", { params });
  return data;
}

export async function getOperations(params: DateRangeParams): Promise<OperationsKpis> {
  const { data } = await api.get<OperationsKpis>("/api/dashboard/operations", { params });
  return data;
}

export async function getPaymentBreakdown(params: DateRangeParams): Promise<PaymentMethodBreakdownItem[]> {
  const { data } = await api.get<PaymentMethodBreakdownItem[]>("/api/dashboard/payment-breakdown", { params });
  return data;
}

export async function getTopServices(params: DateRangeParams, limit = 5): Promise<TopServiceItem[]> {
  const { data } = await api.get<TopServiceItem[]>("/api/dashboard/top-services", { params: { ...params, limit } });
  return data;
}

export async function getTopProducts(params: DateRangeParams, limit = 5): Promise<TopProductItem[]> {
  const { data } = await api.get<TopProductItem[]>("/api/dashboard/top-products", { params: { ...params, limit } });
  return data;
}

export async function getInventoryAlerts(): Promise<InventoryAlertItem[]> {
  const { data } = await api.get<InventoryAlertItem[]>("/api/dashboard/inventory-alerts");
  return data;
}

export async function getAdjustmentSummary(params: DateRangeParams): Promise<AdjustmentTypeSummary[]> {
  const { data } = await api.get<AdjustmentTypeSummary[]>("/api/dashboard/adjustment-summary", { params });
  return data;
}

export async function getActivityFeed(params: DateRangeParams, limit = 10): Promise<ActivityFeedItem[]> {
  const { data } = await api.get<ActivityFeedItem[]>("/api/dashboard/activity", { params: { ...params, limit } });
  return data;
}

export async function getRevenueChart(params: DateRangeParams): Promise<RevenueChartPoint[]> {
  const { data } = await api.get<RevenueChartPoint[]>("/api/dashboard/chart/revenue", { params });
  return data;
}
