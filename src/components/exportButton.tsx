import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { Button } from "./ui/button";

export const ExportButton = () => {
  const state = useSimulationStore((state) => state);

  const handleExport = () => {
    const exportData = state;
    const dataStr = JSON.stringify(exportData, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleExport}>Export JSON</Button>;
};
