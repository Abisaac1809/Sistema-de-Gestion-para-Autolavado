import type { ListOfCustomers } from "@car-wash/types";
import { api } from "@/services/axiosInstance";
import type { CustomerSearchParams } from "../types/orders.dtos";

export async function getCustomers(params?: CustomerSearchParams): Promise<ListOfCustomers> {
  const response = await api.get<ListOfCustomers>("/api/customers", { params });
  return response.data;
}
