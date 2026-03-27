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

export type OrderMutateOptions = {
  onSuccess?: () => void;
  onSettled?: () => void;
};

export type UseOrdersMutationsResult = {
  createOrder: (payload: OrderToCreateType, options?: OrderMutateOptions) => void;
  startOrder: (id: string, options?: OrderMutateOptions) => void;
  completeOrder: (id: string, options?: OrderMutateOptions) => void;
  addPayment: (args: AddPaymentArgs, options?: OrderMutateOptions) => void;
  isCreating: boolean;
  isChangingStatus: boolean;
  isAddingPayment: boolean;
};
