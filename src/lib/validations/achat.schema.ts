// /lib/validations/achat.ts
import * as z from "zod";

export const achatSchema = z.object({
  prixNetVendeur: z.number().min(0),
  fraisAgence: z.number().min(0),
  prixFAI: z.number().min(0),
  fraisAcquisition: z.number().min(0),
  tauxAcquisition: z.number().int().min(0),
  aCharge: z.boolean(),
});

export type AchatValues = z.infer<typeof achatSchema>;
