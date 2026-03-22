import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
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
  isSyncing: boolean;
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
      toast.success("Configuración de monedas guardada correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const syncMutation = useMutation({
    mutationFn: syncBcvRates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "exchangeRate"] });
      toast.success("Tasas del BCV sincronizadas correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Error al sincronizar con el BCV"); },
  });

  return {
    config: query.data,
    isLoading: query.isLoading,
    isSaving: updateMutation.isPending,
    isSyncing: syncMutation.isPending,
    save: updateMutation.mutate,
    sync: syncMutation.mutate,
  };
}
