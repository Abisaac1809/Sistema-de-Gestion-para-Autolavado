import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
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
  isSaving: boolean;
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
      toast.success("Método de pago creado correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentMethodToUpdateType }) =>
      updatePaymentMethod(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });
      toast.success("Métodos de pago actualizados correctamente");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });
      toast.success("Método de pago eliminado");
    },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    paymentMethods: query.data ?? [],
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    isSaving: updateMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
