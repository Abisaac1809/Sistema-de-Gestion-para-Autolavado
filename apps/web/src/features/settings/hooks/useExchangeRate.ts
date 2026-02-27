import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PublicExchangeRateConfig,
  ExchangeRateConfigToUpdateType,
} from "@car-wash/types";
import {
  getExchangeRateConfig,
  updateExchangeRateConfig,
  syncBcvRates,
} from "../services/exchangeRateService";

export type UseExchangeRateResult = {
  config: PublicExchangeRateConfig | undefined;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  isSyncing: boolean;
  syncSuccess: boolean;
  syncError: string | null;
  save: (payload: ExchangeRateConfigToUpdateType) => void;
  sync: () => void;
};

export function useExchangeRate(): UseExchangeRateResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "exchangeRate"],
    queryFn: getExchangeRateConfig,
  });

  const updateMutation = useMutation({
    mutationFn: updateExchangeRateConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", "exchangeRate"], data);
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncBcvRates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "exchangeRate"] });
    },
  });

  return {
    config: query.data,
    isLoading: query.isLoading,
    isSaving: updateMutation.isPending,
    saveSuccess: updateMutation.isSuccess,
    saveError: updateMutation.isError
      ? (updateMutation.error as Error)?.message ?? "Error al guardar"
      : null,
    isSyncing: syncMutation.isPending,
    syncSuccess: syncMutation.isSuccess,
    syncError: syncMutation.isError
      ? (syncMutation.error as Error)?.message ?? "Error al sincronizar"
      : null,
    save: updateMutation.mutate,
    sync: syncMutation.mutate,
  };
}
