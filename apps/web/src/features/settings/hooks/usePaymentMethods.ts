import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PublicPaymentMethod,
  PaymentMethodToCreateType,
  PaymentMethodToUpdateType,
} from "@car-wash/types";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentMethodsService";

export type UsePaymentMethodsResult = {
  paymentMethods: PublicPaymentMethod[];
  isLoading: boolean;
  isCreating: boolean;
  createError: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  create: (payload: PaymentMethodToCreateType) => void;
  update: (args: { id: string; payload: PaymentMethodToUpdateType }) => void;
  remove: (id: string) => void;
};

export function usePaymentMethods(): UsePaymentMethodsResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings", "paymentMethods"],
    queryFn: getPaymentMethods,
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentMethodToUpdateType }) =>
      updatePaymentMethod(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });
    },
  });

  return {
    paymentMethods: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    createError: createMutation.isError
      ? (createMutation.error as Error)?.message ?? "Error al crear"
      : null,
    isSaving: updateMutation.isPending,
    saveSuccess: updateMutation.isSuccess,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
