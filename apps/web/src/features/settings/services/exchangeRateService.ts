import type {
  PublicExchangeRateConfig,
  ExchangeRateConfigToUpdateType,
} from "@car-wash/types";
import { api } from "@/services/axiosInstance";

export async function getExchangeRateConfig(): Promise<PublicExchangeRateConfig> {
  const response = await api.get<PublicExchangeRateConfig>("/api/exchange-rates");
  return response.data;
}

export async function updateExchangeRateConfig(payload: ExchangeRateConfigToUpdateType): Promise<PublicExchangeRateConfig> {
  const response = await api.patch<PublicExchangeRateConfig>(
    "/api/exchange-rates",
    payload
  );
  return response.data;
}

export async function syncBcvRates(): Promise<void> {
  await api.post("/api/exchange-rates/sync");
}
