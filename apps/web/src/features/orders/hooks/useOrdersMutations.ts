import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { OrderStatus } from "@car-wash/types";
import {
  createOrder,
  changeOrderStatus,
  addOrderPayment,
} from "../services/orderService";
import type { AddPaymentArgs, UseOrdersMutationsResult } from "../types/orders.dtos";

export function useOrdersMutations(): UseOrdersMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["orders"] });

  const mutationCallbacks = (successMessage: string) => ({
    onSuccess: () => {
      invalidate();
      toast.success(successMessage);
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) {
        toast.error("Ocurrió un error inesperado");
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    ...mutationCallbacks("Orden creada correctamente"),
  });

  const startMutation = useMutation({
    mutationFn: (id: string) =>
      changeOrderStatus(id, { status: OrderStatus.IN_PROGRESS }),
    ...mutationCallbacks("Orden iniciada"),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      changeOrderStatus(id, { status: OrderStatus.COMPLETED }),
    ...mutationCallbacks("Orden completada"),
  });

  const addPaymentMutation = useMutation({
    mutationFn: ({ orderId, payload }: AddPaymentArgs) =>
      addOrderPayment(orderId, payload),
    ...mutationCallbacks("Pago registrado correctamente"),
  });

  return {
    createOrder: createMutation.mutate,
    startOrder: startMutation.mutate,
    completeOrder: completeMutation.mutate,
    addPayment: addPaymentMutation.mutate,
    isCreating: createMutation.isPending,
    isChangingStatus: startMutation.isPending || completeMutation.isPending,
    isAddingPayment: addPaymentMutation.isPending,
  };
}
