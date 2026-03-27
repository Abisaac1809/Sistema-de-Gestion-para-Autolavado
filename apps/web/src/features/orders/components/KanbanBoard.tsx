import type { BoardColumn } from "../types/orders.dtos";
import { KanbanColumn } from "./KanbanColumn";

export type KanbanBoardProps = {
  columns: BoardColumn[];
  onStartOrder: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onCollectPayment: (orderId: string) => void;
  actionPendingId: string | null;
};

export function KanbanBoard({
  columns,
  onStartOrder,
  onCompleteOrder,
  onCollectPayment,
  actionPendingId,
}: KanbanBoardProps) {
  const pending = columns.find((c) => c.id === "pending");
  const inProgress = columns.find((c) => c.id === "in_progress");
  const porCobrar = columns.find((c) => c.id === "por_cobrar");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <KanbanColumn
        title="En Cola"
        orders={pending?.orders ?? []}
        onAction={onStartOrder}
        actionPendingId={actionPendingId}
        accentColor="text-blue-600"
        emptyMessage="No hay ordenes en cola"
      />
      <KanbanColumn
        title="En Proceso"
        orders={inProgress?.orders ?? []}
        onAction={onCompleteOrder}
        actionPendingId={actionPendingId}
        accentColor="text-indigo-600"
        emptyMessage="No hay ordenes en proceso"
      />
      <KanbanColumn
        title="Por Cobrar"
        orders={porCobrar?.orders ?? []}
        onAction={onCollectPayment}
        actionPendingId={actionPendingId}
        accentColor="text-amber-600"
        emptyMessage="No hay ordenes por cobrar"
      />
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((col) => (
        <div
          key={col}
          className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 min-h-[400px]"
        >
          {/* Header skeleton */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="animate-pulse bg-gray-200 rounded h-4 w-24" />
              <div className="animate-pulse bg-gray-200 rounded-full h-5 w-6" />
            </div>
          </div>
          {/* Card skeletons */}
          <div className="p-3 space-y-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="animate-pulse bg-white rounded-xl h-40 border border-gray-100"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
