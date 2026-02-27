import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PublicStoreInfo, StoreInfoToUpdateType } from "@car-wash/types";
import { getStoreInfo, updateStoreInfo } from "../services/storeInfoService";

export type UseStoreInfoResult = {
  storeInfo: PublicStoreInfo | undefined;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
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
    },
  });

  return {
    storeInfo: query.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    saveSuccess: mutation.isSuccess,
    saveError: mutation.isError
      ? (mutation.error as Error)?.message ?? "Error al guardar"
      : null,
    save: mutation.mutate,
  };
}
