import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  getExchangeRateConfig,
  updateExchangeRateConfig,
  syncBcvRates,
} from "../services/exchangeRateService";
import type {
  UseExchangeRateConfigResult,
  UseExchangeRateMutationsResult,
} from "../types/exchangeRate.dtos";

const QUERY_KEY = ["settings", "exchangeRate"] as const;

export function useExchangeRateConfig(): UseExchangeRateConfigResult {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getExchangeRateConfig,
  });

  return {
    config: query.data,
    isLoading: query.isLoading,
  };
}

export function useExchangeRateMutations(): UseExchangeRateMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const updateMutation = useMutation({
    mutationFn: updateExchangeRateConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
      toast.success("Configuración de monedas guardada correctamente");
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado");
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncBcvRates,
    onSuccess: () => {
      invalidate();
      toast.success("Tasas del BCV sincronizadas correctamente");
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) toast.error("Error al sincronizar con el BCV");
    },
  });

  return {
    save: updateMutation.mutate,
    sync: syncMutation.mutate,
    isSaving: updateMutation.isPending,
    isSyncing: syncMutation.isPending,
  };
}
