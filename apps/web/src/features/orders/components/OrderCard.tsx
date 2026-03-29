import { Clock, Car } from "lucide-react";
import { OrderStatus } from "@car-wash/types";
import type { OrderSummary } from "@car-wash/types";
import { useElapsedTimer } from "../hooks/useElapsedTimer";

export type OrderCardProps = {
  order: OrderSummary;
  onAction: (orderId: string) => void;
  isActionPending: boolean;
};

function getAnchorDate(order: OrderSummary): Date | string {
  switch (order.status) {
    case OrderStatus.PENDING:
      return order.createdAt;
    case OrderStatus.IN_PROGRESS:
      return order.startedAt ?? order.createdAt;
    case OrderStatus.COMPLETED:
      return order.completedAt ?? order.createdAt;
    default:
      return order.createdAt;
  }
}

type ActionConfig = {
  label: string;
  className: string;
};

function getActionConfig(status: OrderStatus): ActionConfig {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        label: "Empezar",
        className:
          "w-full mt-3 rounded-lg py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
      };
    case OrderStatus.IN_PROGRESS:
      return {
        label: "Listo",
        className:
          "w-full mt-3 rounded-lg py-1.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
      };
    case OrderStatus.COMPLETED:
      return {
        label: "Cobrar",
        className:
          "w-full mt-3 rounded-lg py-1.5 text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
      };
    default:
      return {
        label: "Ver",
        className:
          "w-full mt-3 rounded-lg py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
      };
  }
}

const MAX_PILLS = 3;

function ShortId({ id }: { id: string }) {
  return (
    <span className="text-xs font-mono text-gray-400 truncate">
      #{id.slice(-6).toUpperCase()}
    </span>
  );
}

export function OrderCard({ order, onAction, isActionPending }: OrderCardProps) {
  const anchor = getAnchorDate(order);
  const elapsed = useElapsedTimer(anchor);
  const action = getActionConfig(order.status);

  const isPorCobrar = order.status === OrderStatus.COMPLETED;

  const containerClass = [
    "bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow",
    isPorCobrar ? "border-l-4 border-l-amber-400 bg-amber-50/30" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const visibleItems = order.items.slice(0, MAX_PILLS);
  const extraCount = order.items.length - MAX_PILLS;

  return (
    <div className={containerClass}>
      {/* Top row: short ID + elapsed timer */}
      <div className="flex items-center justify-between mb-1.5">
        <ShortId id={order.id} />
        <span className="flex items-center gap-1 text-xs font-mono text-gray-500">
          <Clock size={12} />
          {elapsed}
        </span>
      </div>

      {/* Customer name */}
      <p className="font-semibold text-sm text-gray-900 truncate">
        {order.customerName}
      </p>

      {/* Vehicle info */}
      <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
        <Car size={12} />
        <span className="truncate">
          {order.vehicleModel}
          {order.vehiclePlate ? ` · ${order.vehiclePlate}` : ""}
        </span>
      </p>

      {/* Service / product pills */}
      {order.items.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {visibleItems.map((item, idx) => {
            const pillClass =
              item.type === "service"
                ? "bg-indigo-50 text-indigo-700"
                : "bg-emerald-50 text-emerald-700";
            return (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded-full ${pillClass}`}
              >
                {item.name}
              </span>
            );
          })}
          {extraCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              +{extraCount} más
            </span>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-sm font-medium text-gray-800">
          ${order.totalUSD.toFixed(2)}
        </span>
        <span className="text-sm font-medium text-gray-500">
          Bs {order.totalVES.toFixed(2)}
        </span>
      </div>

      {/* Action button */}
      <button
        onClick={() => onAction(order.id)}
        disabled={isActionPending}
        className={action.className}
      >
        {action.label}
      </button>
    </div>
  );
}
