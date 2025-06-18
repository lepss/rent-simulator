// /lib/validations/achat.ts
import * as z from "zod";

export const achatSchema = z.object({
  prixNetVendeur: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  fraisAgence: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  prixFAI: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  fraisAcquisition: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxAcquisition: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  aCharge: z.enum(["acquereur", "vendeur"], {
    errorMap: () => ({ message: "Valeur invalide" }),
  }),
  fraisAvocat: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
});

export type AchatValues = z.infer<typeof achatSchema>;
