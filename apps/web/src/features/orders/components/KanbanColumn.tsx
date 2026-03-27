import type { OrderSummary } from "@car-wash/types";
import { OrderCard } from "./OrderCard";

export type KanbanColumnProps = {
  title: string;
  orders: OrderSummary[];
  onAction: (orderId: string) => void;
  actionPendingId: string | null;
  accentColor: string;
  emptyMessage: string;
};

export function KanbanColumn({
  title,
  orders,
  onAction,
  actionPendingId,
  accentColor,
  emptyMessage,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 min-h-[400px] max-h-[calc(100vh-320px)]">
      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-50 z-10 p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${accentColor}`}>{title}</span>
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Scrollable card list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{emptyMessage}</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={onAction}
              isActionPending={order.id === actionPendingId}
            />
          ))
        )}
      </div>
    </div>
  );
}
