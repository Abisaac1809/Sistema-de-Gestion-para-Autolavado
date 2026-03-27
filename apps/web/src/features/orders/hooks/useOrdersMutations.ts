import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { OrderStatus } from "@car-wash/types";
import {
  createOrder,
  changeOrderStatus,
  addOrderPayment,
} from "../services/orderService";
import type { AddPaymentArgs, OrderMutateOptions, UseOrdersMutationsResult } from "../types/orders.dtos";
import type { OrderToCreateType } from "@car-wash/types";

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
    createOrder: (payload: OrderToCreateType, options?: OrderMutateOptions) =>
      createMutation.mutate(payload, options),
    startOrder: (id: string, options?: OrderMutateOptions) =>
      startMutation.mutate(id, options),
    completeOrder: (id: string, options?: OrderMutateOptions) =>
      completeMutation.mutate(id, options),
    addPayment: (args: AddPaymentArgs, options?: OrderMutateOptions) =>
      addPaymentMutation.mutate(args, options),
    isCreating: createMutation.isPending,
    isChangingStatus: startMutation.isPending || completeMutation.isPending,
    isAddingPayment: addPaymentMutation.isPending,
  };
}
