import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getStoreInfo(): Promise<PublicStoreInfo> {
  const response = await api.get<PublicStoreInfo>("/api/config/store");
  return response.data;
}

export async function updateStoreInfo(
  payload: StoreInfoToUpdateType
): Promise<PublicStoreInfo> {
  const response = await api.patch<PublicStoreInfo>("/api/config/store", payload);
  return response.data;
}
