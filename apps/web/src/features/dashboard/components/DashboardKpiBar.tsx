import { DollarSign, Banknote, ShoppingCart, TrendingUp, ClipboardList } from "lucide-react";
import type { RevenueWithRate, OperationsKpis } from "@car-wash/types";
import { KpiCard } from "@/components/KpiCard";

type Props = {
  revenue: RevenueWithRate | null;
  operations: OperationsKpis | null;
  isLoadingRevenue: boolean;
  isLoadingOperations: boolean;
};

export function DashboardKpiBar({ revenue, operations, isLoadingRevenue, isLoadingOperations }: Props) {
  const avgTime = operations?.averageServiceTimeMinutes;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <KpiCard
        value={`$${(revenue?.totalRevenueUsd ?? 0).toFixed(2)}`}
        label="Ingresos USD"
        icon={DollarSign}
        subtitle={revenue?.exchangeRate ? `Tasa: ${revenue.exchangeRate.rate}` : undefined}
        isLoading={isLoadingRevenue}
      />
      <KpiCard
        value={`Bs. ${(revenue?.totalRevenueVes ?? 0).toFixed(2)}`}
        label="Ingresos Bs"
        icon={Banknote}
        isLoading={isLoadingRevenue}
      />
      <KpiCard
        value={String(revenue?.salesCount ?? 0)}
        label="Ventas"
        icon={ShoppingCart}
        isLoading={isLoadingRevenue}
      />
      <KpiCard
        value={`$${(revenue?.averageTicketUsd ?? 0).toFixed(2)}`}
        label="Ticket Promedio"
        icon={TrendingUp}
        isLoading={isLoadingRevenue}
      />
      <KpiCard
        value={String(operations?.ordersToday ?? 0)}
        label="Ordenes"
        icon={ClipboardList}
        subtitle={avgTime != null ? `Prom: ${avgTime} min` : undefined}
        isLoading={isLoadingOperations}
      />
    </div>
  );
}
