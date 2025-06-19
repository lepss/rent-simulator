import * as z from "zod";

export const lotSchema = z.object({
  id: z.number(),
  nom: z
    .string({ invalid_type_error: "Doit être une chaîne de caractères" })
    .min(1, { message: "Le nom est requis" }),
  prixVente: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  surface: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  prixM2: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  regimeTVA: z
    .string({ invalid_type_error: "Doit être une chaîne de caractères" })
    .min(1, { message: "Le regime TVA est requise" }),
  ponderation: z
    .number({ invalid_type_error: "Doit être un nombre entier" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  tva: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
});

export type LotValues = z.infer<typeof lotSchema>;
