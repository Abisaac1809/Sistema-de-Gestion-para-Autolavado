import type {
  PublicCategory,
  ListOfCategories,
  CategoryToCreateType,
  CategoryToUpdateType,
  CategoryFiltersType
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getCategories(params: CategoryFiltersType): Promise<ListOfCategories> {
  const response = await api.get<ListOfCategories>("/api/categories", { params });
  return response.data;
}

export async function getCategory(id: string): Promise<PublicCategory> {
  const response = await api.get<PublicCategory>(`/api/categories/${id}`);
  return response.data;
}

export async function createCategory(payload: CategoryToCreateType): Promise<PublicCategory> {
  const response = await api.post<PublicCategory>("/api/categories", payload);
  return response.data;
}

export async function editCategory(id: string, payload: CategoryToUpdateType): Promise<PublicCategory> {
  const response = await api.patch<PublicCategory>(`/api/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/categories/${id}`);
}
