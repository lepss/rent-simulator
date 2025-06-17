// /lib/validations/achat.ts
import * as z from "zod";

export const lotSchema = z.object({
  nom: z.string().min(0),
  prixVente: z.number().min(0),
  surface: z.number().min(0),
  prixM2: z.number().min(0),
  tva: z.string().min(0),
  ponderation: z.number().int().min(0),
});

export type LotValues = z.infer<typeof lotSchema>;
