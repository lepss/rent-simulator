// lib/simulation/calculs.ts
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";

/**
 * Calcule le prix FAI (Frais d'Agence Inclus) en fonction de
 * qui est à charge des frais d'agence.
 * @param prixNetVendeur Le prix net HT du vendeur.
 * @param fraisAgence Les frais d'agence.
 * @param aCharge Soit "acquereur" ou "vendeur", indiquant qui est à charge des frais d'agence.
 * @returns Le prix FAI.
 */
export function calculerPrixFAI(
  prixNetVendeur: number,
  fraisAgence: number,
  aCharge: string
) {
  return aCharge === "acquereur"
    ? prixNetVendeur + fraisAgence
    : prixNetVendeur;
}

/**
 * Retourne le coût total de l'achat, en incluant les frais d'agence,
 * les frais d'acquisition et les frais d'avocat.
 * @param achat Les informations de l'achat.
 * @returns Le coût total de l'achat.
 */
export function getAchatTotal(achat: AchatValues | null): number {
  if (!achat) return 0;
  return (
    (achat.prixFAI ?? 0) +
    (achat.fraisAcquisition ?? 0) +
    (achat.fraisAvocat ?? 0)
  );
}

/**
 * Calcule la somme totale des prix de vente de tous les lots.
 * @param lots Un tableau d'objets LotValues contenant les informations des lots.
 * @returns La somme totale des prix de vente des lots.
 */

export function getTotalVentesLots(lots: LotValues[]): number {
  return lots.reduce((acc, lot) => acc + (lot.prixVente || 0), 0);
}

/**
 * Calculates the total expenses by summing up the total cost (TTC) of each
 * expenditure multiplied by its quantity.
 * @param depenses - An array of DepenseValues objects.
 * @returns The sum of all expenses as a number.
 */

export function getTotalDepenses(depenses: DepenseValues[]): number {
  return depenses.reduce((acc, d) => acc + d.prixTTC * d.quantite, 0);
}

/**
 * Calculates the total financial expenses by summing up the interest rate of the loan, the mortgage, the engagement
 * commission and the dossier fees.
 * @param financement - An object containing the financial expenses.
 * @returns The sum of all financial expenses as a number.
 */
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

/**
 * Calculates the total cost of the operation by summing up the total cost of the achat, the total expenses and the total financial expenses.
 * @param achat - An object containing the informations of the achat.
 * @param depenses - An array of DepenseValues objects.
 * @param financement - An object containing the financial expenses.
 * @returns The total cost of the operation as a number.
 */
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

// export function getMargeParLot(
//   lots: LotValues[],
//   achat: AchatValues | null
// ): Record<string, number> {
//   const margeMap: Record<string, number> = {};
//   lots.forEach((lot) => {
//     margeMap[lot.id] =
//       (lot.prixVente ?? 0) -
//       (achat?.prixNetVendeur ?? 0) * (lot.ponderation / 100);
//   });
//   return margeMap;
// }

// export function getTvaCollecteeParLot(
//   lots: LotValues[]
// ): Record<string, number> {
//   const tvaMap: Record<string, number> = {};
//   lots.forEach((lot) => {
//     switch (lot.regimeTVA) {
//       case "exonere":
//         tvaMap[lot.id] = 0;
//         break;
//       case "integral":
//         tvaMap[lot.id] = lot.tva ?? 0;
//         break;
//       case "marge":
//         tvaMap[lot.id] = (lot.tva ?? 0) * (lot.ponderation / 100);
//         break;
//       default:
//         tvaMap[lot.id] = lot.tva ?? 0;
//         break;
//     }
//   });
//   return tvaMap;
// }

/**
 * Calculates the total TVA collected from all lots.
 * @param {LotValues[]} lots - An array of LotValues objects.
 * @returns {number} The total TVA collected as a number.
 */
// export function getTvaCollectee(lots: LotValues[]): number {
//   return lots.reduce((total, lot) => total + (lot.tva ?? 0), 0);
// }

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
  depenses: DepenseValues[],
  lots: LotValues[]
): Record<string, number> {
  const tvaMap: Record<string, number> = {};

  depenses.forEach((dep) => {
    const tva = dep.TVA ?? 0;
    const refs = dep.lotsIndex ?? [];
    if (refs.length === 0 || tva === 0) return;

    // On récupère les lots concernés
    const lotsConcernés = lots.filter((lot) => refs.includes(lot.id));

    // On calcule la somme des pondérations
    const totalPonderation = lotsConcernés.reduce(
      (sum, lot) => sum + lot.ponderation,
      0
    );

    if (totalPonderation === 0) return;

    lotsConcernés.forEach((lot) => {
      const part = (lot.ponderation / totalPonderation) * tva;
      tvaMap[lot.id] = (tvaMap[lot.id] ?? 0) + part;
    });
  });

  // console.log("tvaMap", tvaMap);
  return tvaMap;
}

export function getTvaFinalParLot(
  lots: LotValues[],
  tvaDeductibleParLotMap: Record<string, number>
): Record<string, number> {
  const tvaMap: Record<string, number> = {};
  lots.forEach((lot) => {
    const tvaInitiale = lot.tva ?? 0;
    const tvaDéductible = tvaDeductibleParLotMap[lot.id] ?? 0;
    const tvaFinale = tvaInitiale - tvaDéductible;

    // Forcer à 0 si négatif
    tvaMap[lot.id] = Math.max(0, tvaFinale);
  });
  return tvaMap;
}

/**
 * Calculates the total deductible TVA from all expenses.
 *
 * This function first distributes the deductible TVA among lots using
 * `getTvaDeductibleParLot` and then sums up all the deductible TVA values
 * across the lots.
 *
 * @param depenses - An array of DepenseValues objects representing the expenses.
 * @returns The total deductible TVA as a number.
 */

// export function getTvaDeductibleTotale(
//   depenses: DepenseValues[],
//   lots: LotValues[]
// ): number {
//   const map = getTvaDeductibleParLot(depenses, lots);
//   return Object.values(map).reduce((acc, v) => acc + v, 0);
// }

/**
 * Calculates the net TVA by subtracting the total deductible TVA from the total collected TVA.
 *
 * This function first calculates the total TVA collected from all lots using `getTvaCollectee`.
 * Then, it calculates the total deductible TVA from all expenses using `getTvaDeductibleTotale`.
 * The net TVA is the positive difference between the collected and deductible TVA.
 *
 * @param lots - An array of LotValues objects representing the lots.
 * @param depenses - An array of DepenseValues objects representing the expenses.
 * @returns The net TVA as a non-negative number.
 */

export function getTVA(lots: LotValues[], depenses: DepenseValues[]): number {
  const tvaDeductibleParLotMap = getTvaDeductibleParLot(depenses, lots);
  const tvaFinalParLot = getTvaFinalParLot(lots, tvaDeductibleParLotMap);
  const tvaFinal = Object.values(tvaFinalParLot).reduce((acc, v) => acc + v, 0);
  return Math.max(0, tvaFinal);
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
