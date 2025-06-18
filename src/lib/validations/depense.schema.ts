// /lib/validations/achat.ts
import * as z from "zod";

export const depenseSchema = z.object({
  id: z.number(),
  nom: z
    .string({ invalid_type_error: "Doit être une chaîne de caractères" })
    .min(1, { message: "Le nom est requis" }),
  prixHT: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxTVA: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  TVA: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  prixTTC: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  quantite: z
    .number({ invalid_type_error: "Doit être un nombre entier" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  lotsIndex: z
    .array(z.number({ invalid_type_error: "Doit être un nombre" }))
    .min(1, { message: "Doit contenir au moins un élément" }),
});

export type DepenseValues = z.infer<typeof depenseSchema>;
