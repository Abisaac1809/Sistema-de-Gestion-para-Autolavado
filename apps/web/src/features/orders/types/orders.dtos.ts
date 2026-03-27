import type { OrderSummary, OrderToCreateType, PaymentToCreateType } from "@car-wash/types";

export type CustomerSearchParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type BoardColumn = {
  id: "pending" | "in_progress" | "por_cobrar";
  title: string;
  orders: OrderSummary[];
};

export type OrderKpis = {
  vehiclesInYard: number;
  servicesInProgress: number;
  totalOrders: number;
};

export type OrderBoardData = {
  columns: BoardColumn[];
  kpis: OrderKpis;
};

export type UseOrdersResult = {
  columns: BoardColumn[];
  kpis: OrderKpis;
  isLoading: boolean;
  search: string;
  setSearch: (v: string) => void;
};

export type AddPaymentArgs = {
  orderId: string;
  payload: PaymentToCreateType;
};

export type UseOrdersMutationsResult = {
  createOrder: (payload: OrderToCreateType) => void;
  startOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  addPayment: (args: AddPaymentArgs) => void;
  isCreating: boolean;
  isChangingStatus: boolean;
  isAddingPayment: boolean;
};
