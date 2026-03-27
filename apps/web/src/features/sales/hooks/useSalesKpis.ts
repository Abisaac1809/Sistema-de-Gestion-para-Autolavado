import { useQuery } from "@tanstack/react-query";
import type { RevenueWithRate, PaymentMethodBreakdownItem } from "@car-wash/types";
import { api } from "@/services/axiosInstance";
import type { UseSalesKpisResult } from "../types/sales.dtos";

export function useSalesKpis(): UseSalesKpisResult {
  const revenueQuery = useQuery({
    queryKey: ["dashboard", "revenue", "today"],
    queryFn: async () => {
      const response = await api.get<RevenueWithRate>("/api/dashboard/revenue");
      return response.data;
    },
  });

  const breakdownQuery = useQuery({
    queryKey: ["dashboard", "payment-breakdown", "today"],
    queryFn: async () => {
      const response = await api.get<PaymentMethodBreakdownItem[]>(
        "/api/dashboard/payment-breakdown",
      );
      return response.data;
    },
  });

  return {
    revenue: revenueQuery.data ?? null,
    breakdown: breakdownQuery.data ?? [],
    isLoading: revenueQuery.isLoading || breakdownQuery.isLoading,
  };
}
