import type {
  PublicPaymentMethod,
  ListOfPaymentMethods,
  PaymentMethodToCreateType,
  PaymentMethodToUpdateType,
} from "@car-wash/types";

export type UsePaymentMethodsResult = {
  paymentMethods: PublicPaymentMethod[];
  meta: ListOfPaymentMethods["meta"] | null;
  isLoading: boolean;
};

export type UsePaymentMethodResult = {
  paymentMethod: PublicPaymentMethod | null;
  isLoading: boolean;
};

export type UsePaymentMethodsMutationsResult = {
  create: (payload: PaymentMethodToCreateType) => void;
  update: (args: { id: string; payload: PaymentMethodToUpdateType }) => void;
  remove: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};
