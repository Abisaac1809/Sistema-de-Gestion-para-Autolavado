import { z } from 'zod';

export const StoreInfoToUpdate = z.object({
    logoUrl: z.url("La URL del logo no es válida").nullable().optional(),
    name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede superar los 100 caracteres").optional(),
    rif: z.string().regex(/^[VEJPG]-\d{7,9}-\d$/, "El RIF no tiene un formato válido (ej: J-12345678-9)").optional(),
    address: z.string().min(1, "La dirección es requerida").max(255, "La dirección no puede superar los 255 caracteres").optional(),
    phone: z.string().regex(/^(0414|0424|0412|0416|0426)-?\d{7}$/, "El teléfono no tiene un formato válido (ej: 0414-1234567)").optional(),
});

export type StoreInfoToUpdateType = z.infer<typeof StoreInfoToUpdate>;