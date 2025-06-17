import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SimulationState {
  achat: AchatValues | null;
  achatTotal: number;
  lots: LotValues[];
  totalVentesLots: number;
  depenses: DepenseValues[];
  totalDepenses: number;
  financement: FinancementValues | null;
  totalFinancement: number;
  setAchat: (data: AchatValues) => void;
  setAchatTotal: (data: number) => void;
  setLots: (data: LotValues[]) => void;
  setTotalVentesLots: (data: number) => void;
  setDepenses: (data: DepenseValues[]) => void;
  setTotalDepenses: (data: number) => void;
  setFinancement: (data: FinancementValues) => void;
  setTotalFinancement: (data: number) => void;
}

export const useSimulationStore = create<SimulationState>()(
  devtools(
    persist(
      (set) => ({
        achat: null,
        achatTotal: 0,
        lots: [],
        totalVentesLots: 0,
        depenses: [],
        totalDepenses: 0,
        financement: null,
        totalFinancement: 0,
        setAchat: (data: AchatValues) => set({ achat: data }),
        setAchatTotal: (data: number) => set({ achatTotal: data }),
        setLots: (data: LotValues[]) => set({ lots: data }),
        setTotalVentesLots: (data: number) => set({ totalVentesLots: data }),
        setDepenses: (data: DepenseValues[]) => set({ depenses: data }),
        setTotalDepenses: (data: number) => set({ totalDepenses: data }),
        setFinancement: (data: FinancementValues) => set({ financement: data }),
        setTotalFinancement: (data: number) => set({ totalFinancement: data }),
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
