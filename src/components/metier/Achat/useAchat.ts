import type { AchatValues } from "@/lib/validations/achat.schema";

export const calculateAchat = (values: AchatValues) => {
  const { prixFAI, fraisAcquisition, fraisAvocat } = values;
  const coutTotal = prixFAI + fraisAcquisition + fraisAvocat;
  return coutTotal;
};
