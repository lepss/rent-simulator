// /hooks/useGlobalSimulation.ts
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";
import { create } from "zustand";

interface SimulationState {
  achat: AchatValues | null;
  lots: LotValues[];
  depenses: DepenseValues[];
  financement: FinancementValues | null;
  setAchat: (data: AchatValues) => void;
  setLots: (data: LotValues[]) => void;
  setDepenses: (data: DepenseValues[]) => void;
  setFinancement: (data: FinancementValues) => void;
}

export const useSimulationStore = create<SimulationState>()((set) => ({
  achat: null,
  lots: [],
  depenses: [],
  financement: null,
  setAchat: (data: AchatValues) => set({ achat: data }),
  setLots: (data: LotValues[]) => set({ lots: data }),
  setDepenses: (data: DepenseValues[]) => set({ depenses: data }),
  setFinancement: (data: FinancementValues) => set({ financement: data }),
}));
