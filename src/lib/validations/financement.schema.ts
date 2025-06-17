// /lib/validations/achat.ts
import * as z from "zod";

export const financementSchema = z.object({
  apport: z.number().min(0),
  tauxApport: z.number().int().min(0),
  interetEmprunt: z.number().min(0),
  tauxInteret: z.number().min(0),
  dureeRemboursementEmprunt: z.number().int().min(0),
  commissionEngagement: z.number().min(0),
  tauxCommissionEngagement: z.number().min(0),
  dureeRemboursementCommissionEngagement: z.number().int().min(0),
  hypotheque: z.number().min(0),
  tauxHypotheque: z.number().min(0),
  fraisDossier: z.number().min(0),
});

export type FinancementValues = z.infer<typeof financementSchema>;
