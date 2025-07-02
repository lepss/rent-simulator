// tests/calculs.test.ts
import {
  getAchatTotal,
  getCoutTotal,
  getMarge,
  getMargeNetteTVA,
  getRentabilite,
  getTotalDepenses,
  getTotalFinancement,
  getTotalVentesLots,
  getTVA,
} from "@/lib/simulation/calculs";
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";

describe("Calculs financiers", () => {
  const achat: AchatValues = {
    prixNetVendeur: 100000,
    fraisAgence: 5000,
    prixFAI: 105000,
    fraisAcquisition: 5000,
    tauxAcquisition: 5,
    aCharge: "acquereur",
    fraisAvocat: 2000,
  };

  const lots: LotValues[] = [
    {
      id: 1,
      nom: "Lot 1",
      prixVente: 80000,
      surface: 50,
      prixM2: 1600,
      regimeTVA: "20",
      ponderation: 1,
      tva: 16000,
    },
    {
      id: 2,
      nom: "Lot 2",
      prixVente: 90000,
      surface: 60,
      prixM2: 1500,
      regimeTVA: "20",
      ponderation: 1,
      tva: 18000,
    },
  ];

  const depenses: DepenseValues[] = [
    {
      id: 1,
      nom: "Travaux",
      prixHT: 2000,
      tauxTVA: 20,
      TVA: 400,
      prixTTC: 2400,
      quantite: 2,
      lotsIndex: [1, 2],
    },
    {
      id: 2,
      nom: "Honoraires",
      prixHT: 1000,
      tauxTVA: 20,
      TVA: 200,
      prixTTC: 1200,
      quantite: 1,
      lotsIndex: [2],
    },
  ];

  const financement: FinancementValues = {
    apport: 50000,
    tauxApport: 50,
    interetEmprunt: 3000,
    tauxInteret: 2,
    dureeRemboursementEmprunt: 20,
    commissionEngagement: 1000,
    tauxCommissionEngagement: 1,
    dureeRemboursementCommissionEngagement: 20,
    hypotheque: 1500,
    tauxHypotheque: 1,
    fraisDossier: 200,
  };

  test("achatTotal calcule le total correct", () => {
    expect(getAchatTotal(achat)).toBe(105000 + 5000 + 2000);
  });

  test("totalVentesLots calcule la somme des ventes", () => {
    expect(getTotalVentesLots(lots)).toBe(80000 + 90000);
  });

  test("totalDepenses calcule la somme TTC * quantité", () => {
    expect(getTotalDepenses(depenses)).toBe(2400 * 2 + 1200 * 1);
  });

  test("totalFinancement calcule les frais de financement", () => {
    expect(getTotalFinancement(financement)).toBe(3000 + 1500 + 1000 + 200);
  });

  test("coutTotal calcule achat + depenses + financement", () => {
    const expected =
      getAchatTotal(achat) +
      getTotalDepenses(depenses) +
      getTotalFinancement(financement);
    expect(getCoutTotal(achat, depenses, financement)).toBe(expected);
  });

  // test("tvaCollectee totalise la TVA des lots", () => {
  //   expect(getTvaCollectee(lots)).toBe(16000 + 18000);
  // });

  // test("tvaDeductibleParLot répartit correctement", () => {
  //   const result = getTvaDeductibleParLot(depenses);
  //   expect(result[1]).toBeCloseTo(400 / 2); // moitié de 400
  //   expect(result[2]).toBeCloseTo(400 / 2 + 200); // moitié + 200
  // });

  // test("tvaDeductibleTotale fait la somme de la TVA déductible", () => {
  //   const result = getTvaDeductibleTotale(depenses);
  //   expect(result).toBeCloseTo(400 + 200);
  // });

  // test("TVA calcule TVA collectée - déductible", () => {
  //   const expected = getTvaCollectee(lots) - getTvaDeductibleTotale(depenses);
  //   expect(getTVA(lots, depenses)).toBe(expected);
  // });

  test("marge calcule vente - coût", () => {
    const expected =
      getTotalVentesLots(lots) - getCoutTotal(achat, depenses, financement);
    expect(getMarge(achat, depenses, financement, lots)).toBe(expected);
  });

  test("margeNetteTVA calcule marge - TVA", () => {
    const expected =
      getMarge(achat, depenses, financement, lots) - getTVA(lots, depenses);
    expect(getMargeNetteTVA(achat, depenses, financement, lots)).toBe(expected);
  });

  test("rentabilite retourne le % correct", () => {
    const ventes = getTotalVentesLots(lots);
    const margeNet = getMargeNetteTVA(achat, depenses, financement, lots);
    const expected = (margeNet / ventes) * 100;
    expect(getRentabilite(achat, depenses, financement, lots)).toBeCloseTo(
      expected
    );
  });
});
