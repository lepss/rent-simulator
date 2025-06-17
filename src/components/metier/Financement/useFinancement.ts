import type { FinancementValues } from "@/lib/validations/financement.schema";

export const calculateFinancement = (values: FinancementValues) => {
  const { interetEmprunt, hypotheque, commissionEngagement, fraisDossier } =
    values;
  const coutTotal =
    interetEmprunt + hypotheque + commissionEngagement + fraisDossier;
  return coutTotal;
};
