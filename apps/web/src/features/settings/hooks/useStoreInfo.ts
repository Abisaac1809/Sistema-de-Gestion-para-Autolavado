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

export function useStoreInfo(): UseStoreInfoResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "storeInfo"],
    queryFn: getStoreInfo,
  });

  const mutation = useMutation({
    mutationFn: updateStoreInfo,
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", "storeInfo"], data);
      toast.success("Información del negocio guardada correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    storeInfo: query.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    save: mutation.mutate,
  };
}
