import { useState } from "react";
import { Search } from "lucide-react";
import type { OrderSummary, OrderToCreateType } from "@car-wash/types";
import { CreateButton } from "@/components/CreateButton";
import { PageView } from "@/components/PageView";
import { useOrders } from "../hooks/useOrders";
import { useOrdersMutations } from "../hooks/useOrdersMutations";
import { KanbanBoard, KanbanBoardSkeleton } from "./KanbanBoard";
import { OrdersKpiBar, OrdersKpiBarSkeleton } from "./OrdersKpiBar";
import { NewOrderDrawer } from "./NewOrderDrawer";
import { OrderPaymentModal } from "./OrderPaymentModal";
import type { AddPaymentArgs } from "../types/orders.dtos";

export function OrdersView() {
  const { columns, kpis, isLoading, search, setSearch } = useOrders();
  const {
    createOrder,
    startOrder,
    completeOrder,
    addPayment,
    isCreating,
    isChangingStatus,
    isAddingPayment,
  } = useOrdersMutations();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [paymentOrder, setPaymentOrder] = useState<OrderSummary | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);

  function handleStartOrder(orderId: string) {
    setActionPendingId(orderId);
    startOrder(orderId, { onSettled: () => setActionPendingId(null) });
  }

  function handleCompleteOrder(orderId: string) {
    setActionPendingId(orderId);
    completeOrder(orderId, { onSettled: () => setActionPendingId(null) });
  }

  function handleCollectPayment(orderId: string) {
    const allOrders = columns.flatMap((col) => col.orders);
    const order = allOrders.find((o) => o.id === orderId) ?? null;
    setPaymentOrder(order);
  }

  function handleCreateOrder(data: OrderToCreateType) {
    createOrder(data, { onSuccess: () => setDrawerOpen(false) });
  }

  function handleAddPayment(payload: AddPaymentArgs) {
    addPayment(payload);
  }

  return (
      <PageView
        title="Gestion de Ordenes"
        subtitle="Administra el flujo de trabajo de tu autolavado."
        action={<CreateButton title="Nueva Orden" onClick={() => setDrawerOpen(true)} />}
      >

      {/* KPI Bar */}
      {isLoading ? (
        <OrdersKpiBarSkeleton />
      ) : (
        <OrdersKpiBar
          vehiclesInYard={kpis.vehiclesInYard}
          servicesInProgress={kpis.servicesInProgress}
          totalOrders={kpis.totalOrders}
        />
      )}

      {/* Search bar */}
      <div className="flex gap-3 items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Buscar por orden o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <KanbanBoardSkeleton />
      ) : (
        <KanbanBoard
          columns={columns}
          onStartOrder={handleStartOrder}
          onCompleteOrder={handleCompleteOrder}
          onCollectPayment={handleCollectPayment}
          actionPendingId={actionPendingId}
        />
      )}

      {/* NewOrderDrawer */}
      <NewOrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleCreateOrder}
        isSubmitting={isCreating}
      />

      {/* OrderPaymentModal */}
      <OrderPaymentModal
        isOpen={paymentOrder !== null}
        onClose={() => setPaymentOrder(null)}
        order={paymentOrder}
        onAddPayment={handleAddPayment}
        isSubmitting={isAddingPayment}
      />
      </PageView>
  );
}
