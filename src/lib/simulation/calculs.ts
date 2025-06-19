// lib/simulation/calculs.ts
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";

export function calculerPrixFAI(
  prixNetVendeur: number,
  fraisAgence: number,
  aCharge: string
) {
  return aCharge === "acquereur"
    ? prixNetVendeur + fraisAgence
    : prixNetVendeur;
}

export function getAchatTotal(achat: AchatValues | null): number {
  if (!achat) return 0;
  return (
    (achat.prixFAI ?? 0) +
    (achat.fraisAcquisition ?? 0) +
    (achat.fraisAvocat ?? 0)
  );
}

export function getTotalVentesLots(lots: LotValues[]): number {
  return lots.reduce((acc, lot) => acc + (lot.prixVente || 0), 0);
}

export function getTotalDepenses(depenses: DepenseValues[]): number {
  return depenses.reduce((acc, d) => acc + d.prixTTC * d.quantite, 0);
}

export function getTotalFinancement(
  financement: FinancementValues | null
): number {
  if (!financement) return 0;
  return (
    (financement.interetEmprunt ?? 0) +
    (financement.hypotheque ?? 0) +
    (financement.commissionEngagement ?? 0) +
    (financement.fraisDossier ?? 0)
  );
}

export function getCoutTotal(
  achat: AchatValues | null,
  depenses: DepenseValues[],
  financement: FinancementValues | null
): number {
  return (
    getAchatTotal(achat) +
    getTotalDepenses(depenses) +
    getTotalFinancement(financement)
  );
}

export function getTvaCollectee(lots: LotValues[]): number {
  return lots.reduce((total, lot) => total + (lot.tva ?? 0), 0);
}

/**
 * Répartit la TVA déductible pour chaque lot
 *
 * On somme la TVA de chaque dépense et on la répartit équitablement
 * entre les lots concernés (en fonction de la propriété `lotsIndex`)
 * @param {DepenseValues[]} depenses
 * @return {Record<string, number>} un objet avec les IDs des lots comme clés
 * et la TVA déductible pour chaque lot comme valeur
 */
export function getTvaDeductibleParLot(
  depenses: DepenseValues[]
): Record<string, number> {
  const tvaMap: Record<string, number> = {};
  depenses.forEach((dep) => {
    const tva = dep.TVA ?? 0;
    const refs = dep.lotsIndex ?? [];
    if (refs.length === 0) return;
    const part = tva / refs.length;
    refs.forEach((id) => {
      tvaMap[id] = (tvaMap[id] ?? 0) + part;
    });
  });
  return tvaMap;
}

export function getTvaDeductibleTotale(depenses: DepenseValues[]): number {
  const map = getTvaDeductibleParLot(depenses);
  return Object.values(map).reduce((acc, v) => acc + v, 0);
}

export function getTVA(lots: LotValues[], depenses: DepenseValues[]): number {
  const tvaCollectee = getTvaCollectee(lots);
  const tvaDeductible = getTvaDeductibleTotale(depenses);
  // console.log(
  //   "tvaCollectee",
  //   tvaCollectee,
  //   "tvaDeductible",
  //   tvaDeductible,
  //   "total",
  //   Math.max(0, tvaCollectee - tvaDeductible)
  // );

  return Math.max(0, tvaCollectee - tvaDeductible);
}

export function getMarge(
  achat: AchatValues | null,
  depenses: DepenseValues[],
  financement: FinancementValues | null,
  lots: LotValues[]
): number {
  return getTotalVentesLots(lots) - getCoutTotal(achat, depenses, financement);
}

export function getMargeNetteTVA(
  achat: AchatValues | null,
  depenses: DepenseValues[],
  financement: FinancementValues | null,
  lots: LotValues[]
): number {
  return getMarge(achat, depenses, financement, lots) - getTVA(lots, depenses);
}

export function getRentabilite(
  achat: AchatValues | null,
  depenses: DepenseValues[],
  financement: FinancementValues | null,
  lots: LotValues[]
): number {
  const ventes = getTotalVentesLots(lots);
  const margeNette = getMargeNetteTVA(achat, depenses, financement, lots);
  return ventes > 0 ? (margeNette / ventes) * 100 : 0;
}
