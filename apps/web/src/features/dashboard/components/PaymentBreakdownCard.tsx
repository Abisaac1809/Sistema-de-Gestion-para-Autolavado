import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { PaymentMethodBreakdownItem } from "@car-wash/types";

const COLORS = ["#10b981", "#8b5cf6", "#f43f5e", "#f59e0b", "#0ea5e9", "#6366f1"];

type Props = {
  data: PaymentMethodBreakdownItem[];
  isLoading: boolean;
};

export function PaymentBreakdownCard({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-[100px] w-[100px] mx-auto bg-gray-100 rounded-full" />
      </div>
    );
  }

  const isEmpty = data.length === 0 || data.every((d) => d.totalUsd === 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <p className="text-sm font-semibold text-gray-900 mb-3">Metodos de Pago</p>

      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          Sin datos
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <PieChart width={120} height={120}>
            <Pie
              data={data}
              dataKey="totalUsd"
              nameKey="paymentMethodName"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={54}
              strokeWidth={2}
            >
              {data.map((_, index) => (
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

          <ul className="flex flex-col gap-1.5 w-full">
            {data.map((item, index) => (
              <li key={item.paymentMethodId} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-gray-600 truncate flex-1">
                  {item.paymentMethodName}
                </span>
                <span className="text-xs font-medium text-gray-800">
                  {item.percentage.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
