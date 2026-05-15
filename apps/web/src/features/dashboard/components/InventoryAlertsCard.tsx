import { AlertTriangle, CheckCircle } from "lucide-react";
import type { InventoryAlertItem } from "@car-wash/types";

type Props = {
  alerts: InventoryAlertItem[];
  isLoading: boolean;
};

export function InventoryAlertsCard({ alerts, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Alertas de Inventario</p>
        {alerts.length > 0 && (
          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle size={16} />
          <span>Sin alertas de stock</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-[240px] overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.productId}
              className="flex items-center gap-3 rounded-lg bg-red-50 px-3 py-2"
            >
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{alert.productName}</p>
                <p className="text-[10px] text-gray-500">
                  Stock: {alert.currentStock} / Min: {alert.minStock}
                </p>
              </div>
              <span className="text-xs font-semibold text-red-600 shrink-0">
                -{alert.deficit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
