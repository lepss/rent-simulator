// /lib/validations/achat.ts
import * as z from "zod";

export const depenseSchema = z.object({
  nom: z.string().min(0),
  prixHT: z.number().min(0),
  tauxTVA: z.number().min(0),
  TVA: z.number().min(0),
  prixTTC: z.number().min(0),
  quantite: z.number().int().min(0),
  lotsIndex: z.array(z.number()),
});

export type DepenseValues = z.infer<typeof depenseSchema>;
