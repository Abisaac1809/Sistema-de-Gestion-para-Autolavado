import { z } from "zod"; 
import { ExchangeRateSource } from "../types/enums";

export const ExchangeRateConfigToUpdate = z.object({
    activeSource : z.enum(ExchangeRateSource).optional(),
    customRate: z.number().optional(),
    autoUpdate: z.boolean().optional(),
});

export type ExchangeRateConfigToUpdateType = z.infer<typeof ExchangeRateConfigToUpdate>;