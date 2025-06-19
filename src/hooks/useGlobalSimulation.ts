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
  getTvaCollectee,
  getTvaDeductibleParLot,
  getTvaDeductibleTotale,
} from "@/lib/simulation/calculs";
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SimulationState {
  achat: AchatValues | null;
  lots: LotValues[];
  depenses: DepenseValues[];
  financement: FinancementValues | null;

  //SETTERS
  setAchat: (data: AchatValues) => void;
  setLots: (data: LotValues[]) => void;
  setDepenses: (data: DepenseValues[]) => void;
  setFinancement: (data: FinancementValues) => void;

  // GETTERS calculés
  achatTotal: () => number;
  totalVentesLots: () => number;
  totalDepenses: () => number;
  totalFinancement: () => number;
  coutTotal: () => number;
  tvaCollectee: () => number;
  tvaDeductibleParLot: () => Record<string, number>;
  tvaDeductibleTotale: () => number;
  TVA: () => number;
  marge: () => number;
  margeNetteTVA: () => number;
  rentabilite: () => number;
}

export const useSimulationStore = create<SimulationState>()(
  devtools(
    persist(
      (set, get) => ({
        achat: null,
        lots: [],
        depenses: [],
        financement: null,

        // SETTERS
        setAchat: (data) => set({ achat: data }),
        setLots: (data) => set({ lots: data }),
        setDepenses: (data) => set({ depenses: data }),
        setFinancement: (data) => set({ financement: data }),

        // GETTERS
        achatTotal: () => getAchatTotal(get().achat),
        totalVentesLots: () => getTotalVentesLots(get().lots),
        totalDepenses: () => getTotalDepenses(get().depenses),
        totalFinancement: () => getTotalFinancement(get().financement),
        coutTotal: () =>
          getCoutTotal(get().achat, get().depenses, get().financement),
        tvaCollectee: () => getTvaCollectee(get().lots),
        tvaDeductibleParLot: () => getTvaDeductibleParLot(get().depenses),
        tvaDeductibleTotale: () => getTvaDeductibleTotale(get().depenses),
        TVA: () => getTVA(get().lots, get().depenses),
        marge: () =>
          getMarge(get().achat, get().depenses, get().financement, get().lots),
        margeNetteTVA: () =>
          getMargeNetteTVA(
            get().achat,
            get().depenses,
            get().financement,
            get().lots
          ),
        rentabilite: () =>
          getRentabilite(
            get().achat,
            get().depenses,
            get().financement,
            get().lots
          ),
      }),
      {
        name: "simulation-storage",
      }
    )
  )
);

declare global {
  interface Window {
    store: typeof useSimulationStore;
  }
}

window.store = useSimulationStore;
