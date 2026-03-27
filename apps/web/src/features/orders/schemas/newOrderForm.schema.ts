import { z } from "zod";

const OrderLineItemSchema = z.object({
  itemType: z.enum(["service", "product"]),
  serviceId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

export const NewOrderFormSchema = z.object({
  customerId: z.string().uuid("Debe seleccionar un cliente"),
  vehiclePlate: z.string().max(20).optional().nullable(),
  vehicleModel: z.string().min(1, "El modelo del vehiculo es requerido").max(50),
  details: z.array(OrderLineItemSchema).min(1, "Debe agregar al menos un item"),
});

export type NewOrderFormValues = z.infer<typeof NewOrderFormSchema>;
export type OrderLineItemValues = z.infer<typeof OrderLineItemSchema>;
