import type {
  PublicPaymentMethod,
  ListOfPaymentMethods,
  PaymentMethodToCreateType,
  PaymentMethodToUpdateType,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getPaymentMethod(id: string): Promise<PublicPaymentMethod> {
  const response = await api.get<PublicPaymentMethod>(`/api/payment-methods/${id}`);
  return response.data;
}

export async function getPaymentMethods(): Promise<ListOfPaymentMethods> {
  const response = await api.get<ListOfPaymentMethods>(
    "/api/payment-methods?page=1&limit=100"
  );
  return response.data;
}

export async function createPaymentMethod(payload: PaymentMethodToCreateType): Promise<PublicPaymentMethod> {
  const response = await api.post<PublicPaymentMethod>(
    "/api/payment-methods",
    payload
  );
  return response.data;
}

export async function updatePaymentMethod(
  id: string,
  payload: PaymentMethodToUpdateType
): Promise<PublicPaymentMethod> {
  const response = await api.put<PublicPaymentMethod>(
    `/api/payment-methods/${id}`,
    payload
  );
  return response.data;
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await api.delete(`/api/payment-methods/${id}`);
}
