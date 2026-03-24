import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { PaymentMethodToUpdateType } from "@car-wash/types";
import {
  getPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentMethodsService";
import type {
  UsePaymentMethodsResult,
  UsePaymentMethodResult,
  UsePaymentMethodsMutationsResult,
} from "../types/paymentMethod.dtos";

// ─── Hook 1: list ─────────────────────────────────────────────────────────────
export function usePaymentMethods(): UsePaymentMethodsResult {
  const query = useQuery({
    queryKey: ["settings", "paymentMethods"],
    queryFn: getPaymentMethods,
  });

  return {
    paymentMethods: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
  };
}

// ─── Hook 2: single item ──────────────────────────────────────────────────────
export function usePaymentMethod(id: string | null): UsePaymentMethodResult {
  const query = useQuery({
    queryKey: ["settings", "paymentMethods", id],
    queryFn: () => getPaymentMethod(id!),
    enabled: !!id,
  });

  return {
    paymentMethod: query.data ?? null,
    isLoading: query.isLoading,
  };
}

// ─── Hook 3: mutations ────────────────────────────────────────────────────────
export function usePaymentMethodsMutations(): UsePaymentMethodsMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["settings", "paymentMethods"] });

  const createMutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => { invalidate(); toast.success("Método de pago creado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentMethodToUpdateType }) =>
      updatePaymentMethod(id, payload),
    onSuccess: () => { invalidate(); toast.success("Métodos de pago actualizados correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => { invalidate(); toast.success("Método de pago eliminado"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
