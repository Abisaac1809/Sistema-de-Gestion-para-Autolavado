import type { ListOfPayments } from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getOrderPayments(orderId: string): Promise<ListOfPayments> {
  const response = await api.get<ListOfPayments>(`/api/orders/${orderId}/payments`);
  return response.data;
}
