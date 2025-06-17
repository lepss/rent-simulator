import type { DepenseValues } from "@/lib/validations/depense.schema";

export const calculateDepenses = (values: DepenseValues[]) => {
  const totalDepenses = values.reduce(
    (acc, d) => acc + d.prixTTC * d.quantite,
    0
  );
  return totalDepenses;
};
