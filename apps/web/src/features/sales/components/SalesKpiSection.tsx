import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { RevenueKpis, PaymentMethodBreakdownItem } from "@car-wash/types";
import { KpiCard } from "@/components/KpiCard";

const COLORS = [
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
  "#f59e0b",
  "#0ea5e9",
  "#6366f1",
];

type SalesKpiSectionProps = {
  revenue: RevenueKpis | null;
  breakdown: PaymentMethodBreakdownItem[];
  isLoading: boolean;
};

export function SalesKpiSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard value="" label="" icon={DollarSign} colorClass="" isLoading />
      <KpiCard value="" label="" icon={ShoppingCart} colorClass="" isLoading />
      <KpiCard value="" label="" icon={TrendingUp} colorClass="" isLoading />
      <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse h-24" />
    </div>
  );
}

export function SalesKpiSection({
  revenue,
  breakdown,
  isLoading,
}: SalesKpiSectionProps) {
  if (isLoading) {
    return <SalesKpiSectionSkeleton />;
  }

  const totalRevenueUsd = revenue?.totalRevenueUsd ?? 0;
  const totalRevenueVes = revenue?.totalRevenueVes ?? 0;
  const salesCount = revenue?.salesCount ?? 0;
  const averageTicketUsd = revenue?.averageTicketUsd ?? 0;

  const isBreakdownEmpty =
    breakdown.length === 0 || breakdown.every((d) => d.totalUsd === 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard
        value={`$${totalRevenueUsd.toFixed(2)}`}
        label="Ingreso del dia"
        icon={DollarSign}
        colorClass="bg-green-50 text-green-600"
        subtitle={`Bs. ${totalRevenueVes.toFixed(2)}`}
      />

      <KpiCard
        value={String(salesCount)}
        label="Ventas totales"
        icon={ShoppingCart}
        colorClass="bg-blue-50 text-blue-600"
      />

      <KpiCard
        value={`$${averageTicketUsd.toFixed(2)}`}
        label="Ticket promedio"
        icon={TrendingUp}
        colorClass="bg-purple-50 text-purple-600"
      />

      {/* Donut chart card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Resumen de Ingresos
        </p>

        {isBreakdownEmpty ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Sin datos
          </div>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <PieChart width={100} height={100}>
              <Pie
                data={breakdown}
                dataKey="totalUsd"
                nameKey="paymentMethodName"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={46}
                strokeWidth={2}
              >
                {breakdown.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? [`$${value.toFixed(2)}`, "Ingresos"]
                    : [String(value), "Ingresos"]
                }
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>

            <ul className="flex flex-col gap-1.5 flex-1 min-w-0">
              {breakdown.map((item, index) => (
                <li
                  key={item.paymentMethodId}
                  className="flex items-center gap-2 min-w-0"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600 truncate flex-1">
                    {item.paymentMethodName}
                  </span>
                  <span className="text-xs font-medium text-gray-800 shrink-0">
                    ${item.totalUsd.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
