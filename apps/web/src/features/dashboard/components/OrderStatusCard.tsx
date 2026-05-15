import type { OperationsKpis } from "@car-wash/types";
import { OrderStatus } from "@car-wash/types";

type Props = {
  operations: OperationsKpis | null;
  isLoading: boolean;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  [OrderStatus.PENDING]: { label: "Pendiente", color: "bg-amber-500", bg: "bg-amber-50" },
  [OrderStatus.IN_PROGRESS]: { label: "En Proceso", color: "bg-blue-500", bg: "bg-blue-50" },
  [OrderStatus.COMPLETED]: { label: "Completada", color: "bg-green-500", bg: "bg-green-50" },
  [OrderStatus.CANCELLED]: { label: "Cancelada", color: "bg-red-500", bg: "bg-red-50" },
};

export function OrderStatusCard({ operations, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const statuses = operations?.ordersByStatus ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-900 mb-3">Estado de Ordenes</p>

      {statuses.length === 0 ? (
        <p className="text-sm text-gray-400">Sin ordenes</p>
      ) : (
        <div className="space-y-2.5">
          {statuses.map((item) => {
            const config = STATUS_CONFIG[item.status] ?? {
              label: item.status,
              color: "bg-gray-400",
              bg: "bg-gray-50",
            };
            return (
              <div
                key={item.status}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${config.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span className="text-xs font-medium text-gray-700">{config.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
