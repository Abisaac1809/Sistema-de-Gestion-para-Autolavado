import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";
import { getStoreInfo, updateStoreInfo } from "../services/storeInfoService";

export type UseStoreInfoResult = {
  storeInfo: PublicStoreInfo | undefined;
  isLoading: boolean;
  isSaving: boolean;
  save: (payload: StoreInfoToUpdateType) => void;
};

const QUERY_KEY = ["settings", "storeInfo"] as const;

export function useStoreInfo() {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getStoreInfo
  });

  return {
    storeInfo: query.data,
    isLoading: query.isLoading
  }
}

export function useStoreInfoMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({queryKey: QUERY_KEY});

  const updateMutation = useMutation({
    mutationFn: updateStoreInfo,
    onSuccess: () => {invalidate(); toast.success("Información del autolavado actualizada correctamente");},
    onError: (error: unknown) => {if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado");} 
  })
  return {
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending
  }
}
