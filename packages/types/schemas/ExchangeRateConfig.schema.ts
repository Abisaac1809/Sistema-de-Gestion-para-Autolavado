import { z } from "zod";
import { ExchangeRateSource } from "../enums.js";

export const ExchangeRateConfigToUpdate = z.object({
    activeSource : z.nativeEnum(ExchangeRateSource).optional(),
    customRate: z.number().optional(),
    autoUpdate: z.boolean().optional(),
});

export type ExchangeRateConfigToUpdateType = z.infer<typeof ExchangeRateConfigToUpdate>;
