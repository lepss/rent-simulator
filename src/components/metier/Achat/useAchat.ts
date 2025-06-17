import type { AchatValues } from "@/lib/validations/achat.schema";

export const calculateAchat = (values: AchatValues) => {
  const { prixNetVendeur, fraisAcquisition } = values;
  const coutTotal = prixNetVendeur + fraisAcquisition;
  return { ...values, coutTotal };
};
