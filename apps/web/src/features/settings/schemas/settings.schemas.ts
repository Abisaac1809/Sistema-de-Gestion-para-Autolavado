import { z } from "zod";
import { ExchangeRateSource, StoreInfoToUpdate } from "@car-wash/types";
import type { StoreInfoToUpdateType } from "@car-wash/types";

export const GeneralTabFormSchema = StoreInfoToUpdate;

export type GeneralTabFormValues = StoreInfoToUpdateType;

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

import { NotificationContactToCreate } from "@car-wash/types";
import type { NotificationContactToCreateType } from "@car-wash/types";

// Reuse the shared schema — same rules the backend router validates against.
// Extend only if the UI needs extra UI-only fields; otherwise assign directly.
export const NotificationContactFormSchema = NotificationContactToCreate;

export type NotificationContactFormValues = NotificationContactToCreateType;
