import type {
  PublicCategory,
  ListOfCategories,
  CategoryToCreateType,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getCategories(): Promise<ListOfCategories> {
  const response = await api.get<ListOfCategories>("/api/categories", {
    params: { limit: 100, status: true },
  });
  return response.data;
}

export async function createCategory(payload: CategoryToCreateType): Promise<PublicCategory> {
  const response = await api.post<PublicCategory>("/api/categories", payload);
  return response.data;
}
