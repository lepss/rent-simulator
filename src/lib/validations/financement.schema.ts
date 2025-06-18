import * as z from "zod";

export const financementSchema = z.object({
  apport: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxApport: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  interetEmprunt: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxInteret: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  dureeRemboursementEmprunt: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  commissionEngagement: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxCommissionEngagement: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  dureeRemboursementCommissionEngagement: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .int({ message: "Doit être un entier" })
    .min(0, { message: "Doit être ≥ 0" }),
  hypotheque: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  tauxHypotheque: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
  fraisDossier: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, { message: "Doit être ≥ 0" }),
});

export type FinancementValues = z.infer<typeof financementSchema>;
