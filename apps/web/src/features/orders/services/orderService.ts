import type {
  ListOfOrders,
  PublicOrder,
  OrderFiltersType,
  OrderToCreateType,
  OrderStatusChangeType,
  PaymentToCreateType,
  PublicPayment,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export type CreateOrderResponse = {
  message: string;
  order: PublicOrder;
};

export type ChangeOrderStatusResponse = {
  message: string;
  order: PublicOrder;
};

export type GetOrderResponse = {
  order: PublicOrder;
};

export async function getOrders(params: OrderFiltersType): Promise<ListOfOrders> {
  const response = await api.get<ListOfOrders>("/api/orders", { params });
  return response.data;
}

export async function getOrder(id: string): Promise<GetOrderResponse> {
  const response = await api.get<GetOrderResponse>(`/api/orders/${id}`);
  return response.data;
}

export async function createOrder(payload: OrderToCreateType): Promise<CreateOrderResponse> {
  const response = await api.post<CreateOrderResponse>("/api/orders", payload);
  return response.data;
}

export async function changeOrderStatus(
  id: string,
  payload: OrderStatusChangeType
): Promise<ChangeOrderStatusResponse> {
  const response = await api.patch<ChangeOrderStatusResponse>(
    `/api/orders/${id}/status`,
    payload
  );
  return response.data;
}

export async function addOrderPayment(
  orderId: string,
  payload: PaymentToCreateType
): Promise<PublicPayment> {
  const response = await api.post<PublicPayment>(
    `/api/orders/${orderId}/payments`,
    payload
  );
  return response.data;
}
