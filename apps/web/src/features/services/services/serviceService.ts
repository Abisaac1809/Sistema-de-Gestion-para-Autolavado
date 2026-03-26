import type {
  PublicService,
  ListOfServices,
  ServiceToCreateType,
  ServiceToUpdateType,
  ServiceFiltersType,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getServices(params: ServiceFiltersType): Promise<ListOfServices> {
  const response = await api.get<ListOfServices>("/api/services", { params });
  return response.data;
}

export async function getService(id: string): Promise<PublicService> {
  const response = await api.get<PublicService>(`/api/services/${id}`);
  return response.data;
}

export async function createService(payload: ServiceToCreateType): Promise<PublicService> {
  const response = await api.post<PublicService>("/api/services", payload);
  return response.data;
}

export async function updateService(id: string, payload: ServiceToUpdateType): Promise<PublicService> {
  const response = await api.put<PublicService>(`/api/services/${id}`, payload);
  return response.data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/api/services/${id}`);
}
