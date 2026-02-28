import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getStoreInfo(): Promise<PublicStoreInfo> {
  const response = await api.get<{ storeInfo: PublicStoreInfo }>("/api/config/store");
  return response.data.storeInfo;
}

export async function updateStoreInfo(
  payload: StoreInfoToUpdateType
): Promise<PublicStoreInfo> {
  const response = await api.patch<{ storeInfo: PublicStoreInfo }>("/api/config/store", payload);
  return response.data.storeInfo;
}
