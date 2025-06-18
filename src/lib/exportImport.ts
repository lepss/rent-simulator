import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import type { AchatValues } from "@/lib/validations/achat.schema";

export const exportSimulation = (filename = "simulation") => {
  const state = useSimulationStore.getState();
  const data = JSON.stringify(state, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`; // <- nom dynamique
  a.click();

  URL.revokeObjectURL(url);
};

export const importSimulation = (file: File) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = event.target?.result as string;
      const parsed = JSON.parse(json);
      useSimulationStore.getState().setAll(parsed);
    } catch (err) {
      console.error("Erreur d'importation :", err);
      alert("Le fichier est invalide.");
    }
  };
  reader.readAsText(file);
};

export const exportAchatData = () => {
  const { achat } = useSimulationStore.getState();
  if (!achat) return;

  const blob = new Blob([JSON.stringify(achat, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const date = new Date().toISOString().slice(0, 10);
  link.download = `achat_${date}.json`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
};

export const importAchatData = async (
  file: File
): Promise<AchatValues | null> => {
  try {
    const text = await file.text();
    const achat = JSON.parse(text) as AchatValues;

    // met à jour le store (mais pas le formulaire)
    useSimulationStore.getState().setAchat(achat);

    return achat;
  } catch (error) {
    console.error("Erreur d'importation d'achat :", error);
    return null;
  }
};
