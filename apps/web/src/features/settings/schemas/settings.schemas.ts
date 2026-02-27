import { z } from "zod";
import { ExchangeRateSource } from "@car-wash/types";

export const GeneralTabFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  rif: z.string().min(1, "El RIF es requerido"),
  address: z.string().min(1, "La dirección es requerida").max(255),
  phones: z.array(z.string()),
});

export type GeneralTabFormValues = z.infer<typeof GeneralTabFormSchema>;

export const CurrencyTabFormSchema = z.object({
  activeSource: z.nativeEnum(ExchangeRateSource),
  customRate: z.number().positive().optional(),
  autoUpdate: z.boolean(),
});

export type CurrencyTabFormValues = z.infer<typeof CurrencyTabFormSchema>;

export const NewPaymentMethodSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

export type NewPaymentMethodValues = z.infer<typeof NewPaymentMethodSchema>;
