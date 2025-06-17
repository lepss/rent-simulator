import type { LotValues } from "@/lib/validations/lot.schema";

export const calculateLots = (values: LotValues[]) => {
  const totalVente = values.reduce((acc, lot) => acc + (lot.prixVente || 0), 0);
  return totalVente;
};
