import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueChartPoint } from "@car-wash/types";
import type { DatePreset } from "../hooks/useDashboardFilters";

type Props = {
  data: RevenueChartPoint[];
  activePreset: DatePreset;
  isLoading: boolean;
};

function formatXLabel(timestamp: string, preset: DatePreset): string {
  const date = new Date(timestamp);
  if (preset === "today") {
    return date.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

export function RevenueChartSection({ data, activePreset, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-[280px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2">
      <p className="text-sm font-semibold text-gray-900 mb-4">Ingresos en el Tiempo</p>
      {data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
          Sin datos para el periodo seleccionado
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradUsd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradVes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => formatXLabel(v, activePreset)}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value, name) => [
                `${name === "totalUsd" ? "$" : "Bs. "}${Number(value).toFixed(2)}`,
                name === "totalUsd" ? "USD" : "Bolívares",
              ]}
              labelFormatter={(label) => formatXLabel(label, activePreset)}
            />
            <Area
              type="monotone"
              dataKey="totalUsd"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradUsd)"
            />
            <Area
              type="monotone"
              dataKey="totalVes"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#gradVes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
