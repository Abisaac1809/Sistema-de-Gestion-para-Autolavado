import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderStatus } from "@car-wash/types";
import type { OrderSummary } from "@car-wash/types";
import { getOrders } from "../services/orderService";
import type { BoardColumn, OrderKpis, UseOrdersResult } from "../types/orders.dtos";

function splitIntoColumns(orders: OrderSummary[], search: string): BoardColumn[] {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query)
      )
    : orders;

  const pending: OrderSummary[] = [];
  const inProgress: OrderSummary[] = [];
  const porCobrar: OrderSummary[] = [];

  for (const order of filtered) {
    if (order.status === OrderStatus.PENDING) {
      pending.push(order);
    } else if (order.status === OrderStatus.IN_PROGRESS) {
      inProgress.push(order);
    } else if (
      order.status === OrderStatus.COMPLETED &&
      order.totalPaidUSD < order.totalUSD
    ) {
      porCobrar.push(order);
    }
    // CANCELLED and fully paid COMPLETED orders are excluded from the board
  }

  return [
    { id: "pending", title: "En Cola", orders: pending },
    { id: "in_progress", title: "En Proceso", orders: inProgress },
    { id: "por_cobrar", title: "Por Cobrar", orders: porCobrar },
  ];
}

function deriveKpis(columns: BoardColumn[]): OrderKpis {
  const [pendingCol, inProgressCol] = columns;
  const pendingCount = pendingCol.orders.length;
  const inProgressCount = inProgressCol.orders.length;
  const total = columns.reduce((sum, col) => sum + col.orders.length, 0);

  return {
    vehiclesInYard: pendingCount + inProgressCount,
    servicesInProgress: inProgressCount,
    totalOrders: total,
  };
}

export function useOrders(): UseOrdersResult {
  const [search, setSearch] = useState<string>("");

  const query = useQuery({
    queryKey: ["orders", "board"],
    queryFn: () => getOrders({ page: 1, limit: 100 }),
  });

  const allOrders: OrderSummary[] = query.data?.data ?? [];
  const columns = splitIntoColumns(allOrders, search);
  const kpis = deriveKpis(columns);

  return {
    columns,
    kpis,
    isLoading: query.isLoading,
    search,
    setSearch,
  };
}
