import type {
  PublicProduct,
  ListOfProducts,
  ProductToCreateType,
  ProductToUpdateType,
  ProductFiltersType
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getProducts(params: ProductFiltersType): Promise<ListOfProducts> {
  const response = await api.get<ListOfProducts>("/api/products", { params });
  return response.data;
}

export async function getProduct(id: string): Promise<PublicProduct> {
  const response = await api.get<PublicProduct>(`/api/products/${id}`);
  return response.data;
}

export async function createProduct(payload: ProductToCreateType): Promise<PublicProduct> {
  const response = await api.post<PublicProduct>("/api/products", payload);
  return response.data;
}

export async function updateProduct(id: string, payload: ProductToUpdateType): Promise<PublicProduct> {
  const response = await api.patch<PublicProduct>(`/api/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`);
}
