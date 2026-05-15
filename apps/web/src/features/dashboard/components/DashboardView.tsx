import { PageView } from "@/components/PageView";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useDashboardData } from "../hooks/useDashboardData";
import { DashboardDateFilter } from "./DashboardDateFilter";
import { DashboardKpiBar } from "./DashboardKpiBar";
import { RevenueChartSection } from "./RevenueChartSection";
import { PaymentBreakdownCard } from "./PaymentBreakdownCard";
import { OrderStatusCard } from "./OrderStatusCard";
import { TopRankingSection } from "./TopRankingSection";
import { InventoryAlertsCard } from "./InventoryAlertsCard";
import { ActivityFeedCard } from "./ActivityFeedCard";

export function DashboardView() {
  const { filters, filterActions, dateParams } = useDashboardFilters();
  const data = useDashboardData(dateParams);

  return (
    <PageView
      title="Dashboard"
      subtitle="Resumen general del negocio."
      action={<DashboardDateFilter filters={filters} filterActions={filterActions} />}
    >
      <DashboardKpiBar
        revenue={data.revenue}
        operations={data.operations}
        isLoadingRevenue={data.isLoadingRevenue}
        isLoadingOperations={data.isLoadingOperations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChartSection
          data={data.chartData}
          activePreset={filters.activePreset}
          isLoading={data.isLoadingChart}
        />
        <div className="flex flex-col gap-4">
          <PaymentBreakdownCard data={data.breakdown} isLoading={data.isLoadingBreakdown} />
          <OrderStatusCard operations={data.operations} isLoading={data.isLoadingOperations} />
        </div>
      </div>

      <TopRankingSection
        services={data.topServices}
        products={data.topProducts}
        isLoadingServices={data.isLoadingTopServices}
        isLoadingProducts={data.isLoadingTopProducts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InventoryAlertsCard alerts={data.inventoryAlerts} isLoading={data.isLoadingAlerts} />
        <ActivityFeedCard activity={data.activity} isLoading={data.isLoadingActivity} />
      </div>
    </PageView>
  );
}
