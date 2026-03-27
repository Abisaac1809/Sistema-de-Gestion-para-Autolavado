import type {
  PublicSale,
  ListOfSales,
  SaleToCreateType,
  SaleFiltersType,
  SaleStatus,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getSales(params: SaleFiltersType): Promise<ListOfSales> {
  const response = await api.get<ListOfSales>("/api/sales", { params });
  return response.data;
}

export async function getSale(id: string): Promise<PublicSale> {
  const response = await api.get<{ message: string; sale: PublicSale }>(`/api/sales/${id}`);
  return response.data.sale;
}

export async function createSale(data: SaleToCreateType): Promise<PublicSale> {
  const response = await api.post<{ message: string; sale: PublicSale }>("/api/sales", data);
  return response.data.sale;
}

export async function updateSaleStatus(
  id: string,
  status: SaleStatus,
): Promise<PublicSale> {
  const response = await api.patch<{ message: string; sale: PublicSale }>(
    `/api/sales/${id}/status`,
    { status },
  );
  return response.data.sale;
}
