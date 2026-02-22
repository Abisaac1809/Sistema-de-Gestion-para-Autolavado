import { z } from "zod";

export const OrderDetailToCreate = z
  .object({
    serviceId: z.string().uuid().nullable().optional(),
    productId: z.string().uuid().nullable().optional(),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    priceAtTime: z.number().min(0).nullable().optional(),
  })
  .refine(
    (data) => {
      const hasService =
        data.serviceId !== null && data.serviceId !== undefined;
      const hasProduct =
        data.productId !== null && data.productId !== undefined;
      return (hasService && !hasProduct) || (!hasService && hasProduct);
    },
    {
      message:
        "Order detail must have either a serviceId or a productId, but not both",
    },
  );

export type OrderDetailToCreateType = z.infer<typeof OrderDetailToCreate>;
