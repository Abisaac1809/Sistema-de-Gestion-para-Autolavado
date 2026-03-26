import type {
  PublicPurchase,
  ListOfPurchases,
  PurchaseToCreateType,
  PurchaseFiltersType,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getPurchases(params: PurchaseFiltersType): Promise<ListOfPurchases> {
  const response = await api.get<ListOfPurchases>("/api/purchases", { params });
  return response.data;
}

export async function getPurchase(id: string): Promise<PublicPurchase> {
  const response = await api.get<PublicPurchase>(`/api/purchases/${id}`);
  return response.data;
}

export async function createPurchase(payload: PurchaseToCreateType): Promise<PublicPurchase> {
  const response = await api.post<PublicPurchase>("/api/purchases", payload);
  return response.data;
}

export async function deletePurchase(id: string): Promise<void> {
  await api.delete(`/api/purchases/${id}`);
}
